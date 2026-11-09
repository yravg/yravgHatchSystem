// Contract: T49 session start (AC-HS-49). POST /sessions reserves, verifies payment, then commits STARTING + command + outbox
// atomically; billing starts only when the device ACKs APPLIED at an accepted verification level. Sandbox fixtures only
// (D01, D06, D07, D26 production policy is NOT approved). The edge and seat devices are SIMULATORS (no hardware).
import { randomUUID } from "node:crypto";
import { signLease, verifyLease } from "@yravg/contracts/leases";
import { validateCommand, validateLease } from "@yravg/contracts";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { as, call, P, sessionHarness, type SH } from "./support.ts";

let t: SH;
beforeAll(async () => { t = await sessionHarness(); });
afterAll(async () => { await t.close(); });

const startOk = async (stationId: string, o: Parameters<SH["start"]>[1] = {}) => {
  const r = await t.start(stationId, o);
  expect(r.status, JSON.stringify(r.json)).toBe(202);
  return r.json["data"] as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

describe("start is atomic and does not bill before APPLIED", () => {
  it("creates STARTING with one START command, a lease grant and an outbox row; the clock has not started", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    expect(d).toMatchObject({ state: "STARTING", stationId: s.id, mode: "FIXED", paymentMode: "postpaid", revision: 1 });
    expect(d.clock).toMatchObject({ running: false, billableSeconds: 0 });
    expect(d.activation).toMatchObject({ status: "PENDING", timedOut: false });
    const cmds = await t.commands(d.sessionId);
    expect(cmds).toHaveLength(1);
    expect(cmds[0]).toMatchObject({ action: "START", status: "PENDING" });
    validateCommand(cmds[0]!.command); // the committed protocol schema accepts it
    expect(cmds[0]!.command).toMatchObject({ stationId: s.id, deviceId: s.deviceId, authorityEpoch: t.epoch(), desiredRevision: 1 });
    expect(await t.count("SELECT count(*) AS n FROM session_outbox WHERE session_id = $1 AND processed_at IS NULL", [d.sessionId])).toBe(1);
    expect(await t.count("SELECT count(*) AS n FROM session_leases WHERE session_id = $1 AND status = 'granted'", [d.sessionId])).toBe(1);
    const st = await call(t.app, "GET", `${P}/stations/${s.id}`, as(t.cashier));
    expect(st.json["data"].status).toBe("reserved");
  });

  it("a failure after the session row is written rolls back everything: no session, command, outbox row or reservation", async () => {
    const s = await t.addStation();
    t.opts.faults = { afterStartInsert: () => { throw new Error("fixture crash"); } };
    const r = await t.start(s.id);
    t.opts.faults = {};
    expect(r.status).toBe(500);
    expect(await t.count("SELECT count(*) AS n FROM sessions WHERE station_id = $1", [s.id])).toBe(0);
    expect(await t.count("SELECT count(*) AS n FROM session_commands c JOIN sessions x ON x.id = c.session_id WHERE x.station_id = $1", [s.id])).toBe(0);
    expect((await call(t.app, "GET", `${P}/stations/${s.id}`, as(t.cashier))).json["data"].status).toBe("available");
    expect((await t.start(s.id)).status).toBe(202); // and the station is usable again
  });

  it("RECEIVED is not APPLIED: the clock stays stopped until APPLIED, and a reordered or duplicate APPLIED starts billing once", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const [c] = await t.pending(d.sessionId, "START");
    expect((await t.ack(c!, "RECEIVED")).statusCode).toBe(200);
    let v = (await t.reconcile(d.sessionId)).json["data"];
    expect(v).toMatchObject({ state: "STARTING", activation: { status: "RECEIVED" } });
    expect(v.clock.running).toBe(false);
    t.clock.advance(3);
    expect((await t.ack(c!, "APPLIED")).statusCode).toBe(200);
    v = (await t.reconcile(d.sessionId)).json["data"];
    expect(v).toMatchObject({ state: "ACTIVE", verificationLevel: "API_OBSERVED", deviceProof: true, limitedMode: false });
    expect(v.clock.running).toBe(true);
    t.clock.advance(5);
    expect((await t.ack(c!, "RECEIVED")).statusCode).toBe(200); // reordered after APPLIED
    expect((await t.ack(c!, "APPLIED")).statusCode).toBe(200); // duplicate
    v = (await t.reconcile(d.sessionId)).json["data"];
    expect(v.state).toBe("ACTIVE");
    expect(v.clock.billableSeconds).toBe(5); // counted from the single APPLIED, not restarted by the duplicate
  });

  it("COMMANDED_ONLY starts billing but is labelled limited and never shown as device proof", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const v = (await t.applyStart(d.sessionId, "COMMANDED_ONLY")).json["data"];
    expect(v).toMatchObject({ state: "ACTIVE", verificationLevel: "COMMANDED_ONLY", deviceProof: false, limitedMode: true });
  });

  it("a SIMULATED ACK does not start billing in this configuration", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const v = (await t.applyStart(d.sessionId, "SIMULATED")).json["data"];
    expect(v.state).toBe("STARTING");
    expect(v.clock.running).toBe(false);
    expect(await t.count("SELECT count(*) AS n FROM session_events WHERE session_id = $1 AND kind = 'ACK_REJECTED'", [d.sessionId])).toBe(1);
  });

  it("the lease claims become a lease the edge can sign and a device can verify against its pinned key", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id, { seconds: 1800 });
    const [c] = await t.pending(d.sessionId, "START");
    const claims = c!.leaseClaims!;
    expect(claims).toMatchObject({ sessionId: d.sessionId, stationId: s.id, deviceId: s.deviceId, mode: "FIXED", remainingSecondsAtIssue: 1800, authorityEpoch: t.epoch() });
    const edgeKey = t.keys.get(t.edgeId)!;
    const lease = signLease({ ...(claims as any), keyId: "edge-key-v1" }, edgeKey.priv); // eslint-disable-line @typescript-eslint/no-explicit-any
    validateLease(lease);
    expect(verifyLease(lease, { "edge-key-v1": edgeKey.publicKey }, t.clock.now, t.epoch())).toBeNull();
  });
});

describe("start gates", () => {
  it("a station without an active paired seat device is DEVICE_UNAVAILABLE and nothing is reserved", async () => {
    const s = await t.addStation("PS-NOSEAT", "reguler", false);
    const r = await t.start(s.id);
    expect(r.status).toBe(409);
    expect(r.json["error"].code).toBe("DEVICE_UNAVAILABLE");
    expect((await call(t.app, "GET", `${P}/stations/${s.id}`, as(t.cashier))).json["data"].status).toBe("available");
  });

  it("a revoked seat device cannot start a session", async () => {
    const s = await t.addStation();
    expect((await call(t.app, "POST", `${P}/devices/${s.deviceId}/revoke`, { ...as(t.owner), body: {} })).status).toBe(200);
    const r = await t.start(s.id);
    expect(r.json["error"].code).toBe("DEVICE_UNAVAILABLE");
  });

  it("a stale quote (older than 900 s) and an already used quote are QUOTE_STALE", async () => {
    const s = await t.addStation();
    const q = await t.quote(s.id);
    const body = { quoteId: q.json["data"].quoteId, paymentMode: "postpaid" };
    expect((await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body })).status).toBe(202);
    const again = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body });
    expect(again.json["error"].code === "QUOTE_STALE" || again.json["error"].code === "STATION_BUSY").toBe(true);
    const s2 = await t.addStation();
    const q2 = await t.quote(s2.id);
    t.clock.advance(901);
    const old = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body: { quoteId: q2.json["data"].quoteId, paymentMode: "postpaid" } });
    expect(old.status).toBe(409);
    expect(old.json["error"].code).toBe("QUOTE_STALE");
  });

  it("one station, five concurrent starts: exactly one wins, the rest are STATION_BUSY", async () => {
    const s = await t.addStation();
    const quotes = await Promise.all([1, 2, 3, 4, 5].map(() => t.quote(s.id)));
    const rs = await Promise.all(quotes.map((q) => call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body: { quoteId: q.json["data"].quoteId, paymentMode: "postpaid" } })));
    expect(rs.filter((r) => r.status === 202)).toHaveLength(1);
    for (const r of rs.filter((x) => x.status !== 202)) expect([r.status, r.json["error"].code]).toEqual([409, "STATION_BUSY"]);
    expect(await t.count("SELECT count(*) AS n FROM sessions WHERE station_id = $1", [s.id])).toBe(1);
  });

  it("a station reserved by someone else is STATION_BUSY", async () => {
    const s = await t.addStation();
    expect((await call(t.app, "POST", `${P}/stations/${s.id}/reserve`, { ...as(t.owner), body: {} })).status).toBe(200);
    const r = await t.start(s.id);
    expect(r.json["error"].code).toBe("STATION_BUSY");
  });

  it("manual billing is not available to a cashier", async () => {
    const s = await t.addStation();
    const r = await t.start(s.id, { body: { manualMode: true } });
    expect(r.status).toBe(403);
  });

  it("the body cannot choose tenantId or outletId, and a missing Idempotency-Key is refused", async () => {
    const s = await t.addStation();
    const q = await t.quote(s.id);
    const body = { quoteId: q.json["data"].quoteId, paymentMode: "postpaid" };
    expect((await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body: { ...body, tenantId: randomUUID() } })).status).toBe(400);
    expect((await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), key: null, body })).status).toBe(400);
  });

  it("same key and same body replays the same session; same key with another body is IDEMPOTENCY_CONFLICT; no second command", async () => {
    const s = await t.addStation();
    const q = await t.quote(s.id);
    const key = randomUUID();
    const body = { quoteId: q.json["data"].quoteId, paymentMode: "postpaid" };
    const a = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), key, body });
    const b = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), key, body });
    expect(a.status).toBe(202);
    expect(b.json["data"].sessionId).toBe(a.json["data"].sessionId);
    expect(await t.count("SELECT count(*) AS n FROM session_commands WHERE session_id = $1", [a.json["data"].sessionId])).toBe(1);
    const c = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), key, body: { ...body, sessionMode: "OPEN" } });
    expect(c.status).toBe(409);
    expect(c.json["error"].code).toBe("IDEMPOTENCY_CONFLICT");
  });

  it("another tenant and another outlet get 404, never the session", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    expect((await call(t.app, "GET", `${P}/sessions/${d.sessionId}`, as(t.ownerB))).status).toBe(404);
    expect((await call(t.app, "GET", `${P}/sessions/${d.sessionId}`, as(t.cashierA2))).status).toBe(404);
    expect((await call(t.app, "POST", `${P}/sessions/${d.sessionId}/reconcile`, { ...as(t.ownerB), body: {} })).status).toBe(404);
    expect((await call(t.app, "GET", `${P}/sessions/${d.sessionId}/commands`, as(t.cashierA2))).status).toBe(404);
  });
});

describe("prepaid needs a verified T48 payment (T47 insufficient-balance gap closed over HTTP)", () => {
  it("a pending intent is PAYMENT_UNCONFIRMED; once the provider settlement is verified the session starts", async () => {
    const s = await t.addStation();
    const p = await t.paidIntent(s.id);
    const body = { quoteId: p.quoteId, paymentMode: "payment", paymentIntentId: p.intentId };
    const early = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body });
    expect([early.status, early.json["error"].code]).toEqual([409, "PAYMENT_UNCONFIRMED"]);
    await t.settle(p.orderId);
    const ok = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body });
    expect(ok.status, JSON.stringify(ok.json)).toBe(202);
    expect(ok.json["data"]).toMatchObject({ paymentMode: "payment", paymentIntentId: p.intentId, quoteId: p.quoteId, amountIdr: "12000" });
  });

  it("a payment smaller than the quote refuses activation with INSUFFICIENT_BALANCE and the shortfall", async () => {
    const s = await t.addStation();
    const small = await t.paidIntent(s.id, 600); // Rp2.000 settled
    await t.settle(small.orderId);
    const big = await t.quote(s.id, 3600); // Rp12.000 needed
    const r = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body: { quoteId: big.json["data"].quoteId, paymentMode: "payment", paymentIntentId: small.intentId } });
    expect([r.status, r.json["error"].code]).toEqual([409, "INSUFFICIENT_BALANCE"]);
    expect(r.json["error"].details).toMatchObject({ shortfallIdr: "10000" });
    expect(await t.count("SELECT count(*) AS n FROM sessions WHERE station_id = $1", [s.id])).toBe(0);
  });

  it("one settled payment funds one session only", async () => {
    const s = await t.addStation();
    const p = await t.paidIntent(s.id);
    await t.settle(p.orderId);
    const body = { quoteId: p.quoteId, paymentMode: "payment", paymentIntentId: p.intentId };
    expect((await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body })).status).toBe(202);
    const twice = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body });
    expect(twice.status).toBe(409);
  });
});

describe("ACK timeout, retry and compensation (D06 fixture: 10 s)", () => {
  it("after 10 s without an ACK the start is pending/timed out, never silently ACTIVE; retry reuses the same commandId", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const [c] = await t.pending(d.sessionId, "START");
    t.clock.advance(9);
    expect((await t.reconcile(d.sessionId)).json["data"].activation.timedOut).toBe(false);
    t.clock.advance(2);
    const v = (await t.reconcile(d.sessionId)).json["data"];
    expect(v).toMatchObject({ state: "STARTING", activation: { status: "TIMED_OUT", timedOut: true, commandId: c!.commandId } });
    expect(v.clock.running).toBe(false);
    const retry = await t.act(d.sessionId, "retry");
    expect(retry.status).toBe(202);
    expect(retry.json["data"].activation).toMatchObject({ commandId: c!.commandId, status: "PENDING", retries: 1, timedOut: false });
    expect(await t.count("SELECT count(*) AS n FROM session_commands WHERE session_id = $1", [d.sessionId])).toBe(1);
    const after = (await t.pending(d.sessionId, "START"))[0]!;
    expect(after.commandId).toBe(c!.commandId);
    expect(after.command["sequence"]).toBeGreaterThan(c!.command["sequence"] as number); // a new sequence, same command
    expect((await t.ack(after, "APPLIED")).statusCode).toBe(200);
    expect((await t.reconcile(d.sessionId)).json["data"].state).toBe("ACTIVE");
  });

  it("the sweep applies ACKs and timeouts for every session without being asked per session", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const [c] = await t.pending(d.sessionId, "START");
    expect((await t.ack(c!, "APPLIED")).statusCode).toBe(200);
    await t.jobs.sweep();
    expect((await t.view(d.sessionId)).state).toBe("ACTIVE");
  });

  it("a FAILED ACK fails activation, releases the station, and a settled payment goes to refund_pending without claiming a refund", async () => {
    const s = await t.addStation();
    const p = await t.paidIntent(s.id);
    await t.settle(p.orderId);
    const before = Object.fromEntries(((await call(t.app, "GET", `${P}/ledger/balances`, as(t.owner))).json["data"].balances as { account: string; balanceIdr: string }[]).map((b) => [b.account, BigInt(b.balanceIdr)]));
    const r = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body: { quoteId: p.quoteId, paymentMode: "payment", paymentIntentId: p.intentId } });
    const id = r.json["data"].sessionId as string;
    const [c] = await t.pending(id, "START");
    expect((await t.ack(c!, "FAILED")).statusCode).toBe(200);
    const v = (await t.reconcile(id)).json["data"];
    expect(v.state).toBe("ACTIVATION_FAILED");
    expect(v.clock.running).toBe(false);
    expect((await call(t.app, "GET", `${P}/stations/${s.id}`, as(t.cashier))).json["data"].status).toBe("available");
    expect((await t.pool.query("SELECT status FROM payment_intents WHERE id = $1", [p.intentId])).rows[0].status).toBe("refund_pending");
    const refund = (await call(t.app, "GET", `${P}/payments/refunds`, as(t.owner))).json["data"].refunds.find((x: any) => x.intentId === p.intentId); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(refund).toMatchObject({ status: "pending", providerProofRef: null, amountIdr: "12000" });
    const after = Object.fromEntries(((await call(t.app, "GET", `${P}/ledger/balances`, as(t.owner))).json["data"].balances as { account: string; balanceIdr: string }[]).map((b) => [b.account, BigInt(b.balanceIdr)]));
    expect(after["sales_revenue"]).toBe((before["sales_revenue"] ?? 0n) - 12000n);
    expect(after["refund_payable"]).toBe((before["refund_payable"] ?? 0n) + 12000n);
    expect(after["provider_clearing"]).toBe(before["provider_clearing"]); // no provider refund happened
    await t.reconcile(id); // replay: no second ledger posting
    expect(await t.count("SELECT count(*) AS n FROM refunds WHERE intent_id = $1", [p.intentId])).toBe(1);
    expect(await t.count("SELECT count(*) AS n FROM ledger_transactions WHERE source_event = $1", [`session:${id}:activation-failed`])).toBe(1);
  });

  it("a late APPLIED after cancel is rejected, never starts billing, and the station waits for the lock proof", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const [start] = await t.pending(d.sessionId, "START");
    const cancel = await t.act(d.sessionId, "cancel");
    expect(cancel.status).toBe(202);
    expect(cancel.json["data"].state).toBe("ACTIVATION_FAILED");
    expect((await t.ack(start!, "APPLIED")).statusCode).toBe(200); // the device acks late; intake accepts it, the coordinator must not
    const v = (await t.reconcile(d.sessionId)).json["data"];
    expect(v.state).toBe("ACTIVATION_FAILED");
    expect(v.clock.running).toBe(false);
    expect(await t.count("SELECT count(*) AS n FROM session_events WHERE session_id = $1 AND kind = 'ACK_REJECTED'", [d.sessionId])).toBe(1);
    expect((await call(t.app, "GET", `${P}/stations/${s.id}`, as(t.cashier))).json["data"].status).toBe("reserved"); // device may be live: not released yet
    const [lock] = await t.pending(d.sessionId, "LOCK");
    expect((await t.ack(lock!, "APPLIED")).statusCode).toBe(200);
    await t.reconcile(d.sessionId);
    expect((await call(t.app, "GET", `${P}/stations/${s.id}`, as(t.cashier))).json["data"].status).toBe("available");
  });

  it("an ACK signed by another seat device for this command is rejected", async () => {
    const a = await t.addStation();
    const b = await t.addStation();
    const d = await startOk(a.id);
    const [c] = await t.pending(d.sessionId, "START");
    expect((await t.ack(c!, "APPLIED", "API_OBSERVED", { deviceId: b.deviceId })).statusCode).toBe(200); // valid for device b at T50 intake
    expect((await t.reconcile(d.sessionId)).json["data"].state).toBe("STARTING");
  });

  it("an ACK from a revoked device or at a stale epoch never reaches the session", async () => {
    const s = await t.addStation();
    const d = await startOk(s.id);
    const [c] = await t.pending(d.sessionId, "START");
    const old = t.epoch();
    t.setEpoch(old + 5);
    expect((await t.ack(c!, "APPLIED")).statusCode).toBe(409); // T50 fence
    t.setEpoch(old);
    expect((await call(t.app, "POST", `${P}/devices/${s.deviceId}/revoke`, { ...as(t.owner), body: {} })).status).toBe(200);
    expect((await t.ack(c!, "APPLIED")).statusCode).toBe(401);
    expect((await t.reconcile(d.sessionId)).json["data"].state).toBe("STARTING");
  });
});
