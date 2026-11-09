// Contract: T49 console-to-seat transfer (AC-HS-V02-09 and the transfer clauses of AC-HS-49). PS5 station A to B with CEC
// DISABLED (D28): the only commands are LOCK and START, there is no CEC or SAFE_CONTROL action anywhere. Ordering (CONTRACTS
// section 7): reserve destination and freeze the tariffDelta quote, revoke/fence the source and PROVE it locked (or let its
// bounded lease expire), only then grant the destination. No claim of uninterrupted gameplay on a different console.
// Edge and seats are SIMULATORS; money and timings are SANDBOX FIXTURES (D01, D06, D07, D26 unapproved).
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { as, call, P, sessionHarness, type SH } from "./support.ts";

let t: SH;
let A: { id: string; deviceId: string | null };
let B: { id: string; deviceId: string | null };
let CHEAP: { id: string; deviceId: string | null };
let DEAR: { id: string; deviceId: string | null };
const J = (r: { json: Record<string, any> }) => r.json["data"] as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const stationStatus = async (id: string) => (await call(t.app, "GET", `${P}/stations/${id}`, as(t.cashier))).json["data"].status as string;
const grantedLeases = (sessionId: string) => t.count("SELECT count(*) AS n FROM session_leases WHERE session_id = $1 AND status = 'granted'", [sessionId]);
const quoteMove = (id: string, to: string, by = t.cashier) => call(t.app, "POST", `${P}/sessions/${id}/transfer-quotes`, { ...as(by), body: { targetStationId: to } });
const move = async (id: string, to: string, by = t.cashier) => {
  const q = await quoteMove(id, to, by);
  expect(q.status, JSON.stringify(q.json)).toBe(200);
  return t.act(id, "move", { targetStationId: to, quoteId: q.json["data"].transferQuoteId }, by);
};
/** A fresh pair of stations with an ACTIVE session on the first. */
const fresh = async (o: Parameters<SH["activate"]>[1] = {}) => {
  const a = await t.addStation();
  const b = await t.addStation();
  const id = await t.activate(a.id, o);
  return { a, b, id };
};
const lockProof = async (id: string, level = "API_OBSERVED") => {
  const [lock] = await t.pending(id, "LOCK");
  expect((await t.ack(lock!, "APPLIED", level)).statusCode).toBe(200);
  return lock!;
};

beforeAll(async () => {
  t = await sessionHarness();
  expect((await call(t.app, "POST", `${P}/zone-rates`, { ...as(t.owner), body: { zone: "hemat", ratePerHourIdr: "6000" } })).status).toBe(200);
  expect((await call(t.app, "POST", `${P}/zone-rates`, { ...as(t.owner), body: { zone: "vip", ratePerHourIdr: "20000" } })).status).toBe(200);
  A = await t.addStation("PS5-A");
  B = await t.addStation("PS5-B");
  CHEAP = await t.addStation("PS-HEMAT", "hemat");
  DEAR = await t.addStation("PS-VIP", "vip");
  await t.pool.query("CREATE TABLE test_fb (id serial PRIMARY KEY, session_id uuid NOT NULL REFERENCES sessions (id), item text NOT NULL)");
});
afterAll(async () => { await t.close(); });

describe("tariffDelta quote accepted before action", () => {
  it("is deterministic and frozen; a cheaper zone reprices only the remaining time; a dearer zone is TRANSFER_REFUSED", async () => {
    const id = await t.activate(A.id);
    t.clock.advance(1800);
    const q1 = J(await quoteMove(id, B.id));
    const q2 = J(await quoteMove(id, B.id));
    expect(q1).toMatchObject({ deltaIdr: "0", baseAmountIdr: "12000", newAmountIdr: "12000", elapsedSeconds: 1800, totalSeconds: 3600, fromStationId: A.id, toStationId: B.id });
    expect({ ...q1, transferQuoteId: 0, expiresAt: 0 }).toEqual({ ...q2, transferQuoteId: 0, expiresAt: 0 });
    const cheap = J(await quoteMove(id, CHEAP.id));
    expect(cheap).toMatchObject({ deltaIdr: "-3000", baseAmountIdr: "12000", newAmountIdr: "9000", minimumApplied: false });
    const dear = await quoteMove(id, DEAR.id);
    expect([dear.status, dear.json["error"].code]).toEqual([409, "TRANSFER_REFUSED"]);
    await t.act(id, "end");
  });

  it("move needs an accepted quote for this session and target, unexpired and used once", async () => {
    const { b, id } = await fresh();
    const other = await t.addStation();
    const qOther = J(await quoteMove(id, other.id));
    const wrongTarget = await t.act(id, "move", { targetStationId: b.id, quoteId: qOther["transferQuoteId"] });
    expect([wrongTarget.status, wrongTarget.json["error"].code]).toEqual([409, "QUOTE_STALE"]);
    const noQuote = await t.act(id, "move", { targetStationId: b.id });
    expect(noQuote.status).toBe(400);
    const q = J(await quoteMove(id, b.id));
    t.clock.advance(301);
    const old = await t.act(id, "move", { targetStationId: b.id, quoteId: q["transferQuoteId"] });
    expect([old.status, old.json["error"].code]).toEqual([409, "QUOTE_STALE"]);
    const q3 = J(await quoteMove(id, b.id));
    expect((await t.act(id, "move", { targetStationId: b.id, quoteId: q3["transferQuoteId"] })).status).toBe(202);
    await lockProof(id);
    await t.reconcile(id);
    const [startB] = await t.pending(id, "START");
    expect((await t.ack(startB!, "APPLIED")).statusCode).toBe(200);
    await t.reconcile(id);
    expect((await t.view(id)).stationId).toBe(b.id);
  });

  it("destination must be free, in this outlet, with an active paired seat; a PAUSED or already moving session cannot move", async () => {
    const { a, id } = await fresh();
    const busy = await t.addStation();
    await t.activate(busy.id);
    expect((await quoteMove(id, busy.id)).json["error"].code).toBe("STATION_BUSY");
    const noSeat = await t.addStation("PS-NOSEAT-X", "reguler", false);
    expect((await quoteMove(id, noSeat.id)).json["error"].code).toBe("DEVICE_UNAVAILABLE");
    expect((await quoteMove(id, "00000000-0000-4000-8000-000000000000")).status).toBe(404);
    expect((await quoteMove(id, a.id)).json["error"].code).toBe("TRANSFER_REFUSED"); // itself
    expect((await quoteMove(id, B.id, t.cashierA2)).status).toBe(404); // other outlet
    expect((await quoteMove(id, B.id, t.ownerB)).status).toBe(404); // other tenant
    await t.act(id, "pause");
    const p = await t.act(id, "move", { targetStationId: B.id, quoteId: "00000000-0000-4000-8000-000000000000" });
    expect([p.status, p.json["error"]?.code]).toEqual([409, "INVALID_TRANSITION"]);
    const free = await t.addStation();
    await t.act(id, "resume");
    const [resume] = await t.pending(id, "RESUME");
    await t.ack(resume!, "APPLIED");
    await t.reconcile(id);
    expect((await move(id, free.id)).status).toBe(202);
    const twice = await quoteMove(id, B.id); // a transfer is already in flight
    expect([twice.status, twice.json["error"]?.code]).toEqual([409, "INVALID_TRANSITION"]);
  });
});

describe("source locked and proven before the destination is granted", () => {
  it("revokes the source, issues LOCK first, reserves the destination, and creates no destination command or lease until the lock is proven", async () => {
    const { a, b, id } = await fresh();
    t.clock.advance(600);
    const r = await move(id, b.id);
    expect(r.status).toBe(202);
    const v = J(r);
    expect(v).toMatchObject({ state: "ACTIVE", stationId: a.id, lease: null, clock: { running: false, billableSeconds: 600 }, transfer: { status: "LOCKING_SOURCE", fromStationId: a.id, toStationId: b.id } });
    expect(v.transfer.gameplayContinuity).toBe("not_guaranteed");
    expect(await stationStatus(b.id)).toBe("reserved");
    const cmds = await t.commands(id);
    expect(cmds.filter((c) => c.status === "PENDING").map((c) => [c.action, c.command["deviceId"]])).toEqual([["LOCK", a.deviceId]]);
    expect(await grantedLeases(id)).toBe(0);
    for (let i = 0; i < 3; i++) { t.clock.advance(1); await t.jobs.sweep(); }
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId)).toHaveLength(0);
    expect(await grantedLeases(id)).toBe(0);
  });

  it("a COMMANDED_ONLY lock ACK is not proof: the destination stays ungranted", async () => {
    const { b, id } = await fresh();
    await move(id, b.id);
    await lockProof(id, "COMMANDED_ONLY");
    const v = J(await t.reconcile(id));
    expect(v.transfer.status).toBe("LOCKING_SOURCE");
    expect(await grantedLeases(id)).toBe(0);
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId)).toHaveLength(0);
  });

  it("proven lock then destination: same sessionId, quote, payment and F&B lineage; no new ledger entry; the move window is not billed; CEC never used", async () => {
    const a = await t.addStation();
    const b = await t.addStation();
    const p = await t.paidIntent(a.id);
    await t.settle(p.orderId);
    const started = await call(t.app, "POST", `${P}/sessions`, { ...as(t.cashier), body: { quoteId: p.quoteId, paymentMode: "payment", paymentIntentId: p.intentId } });
    const id = started.json["data"].sessionId as string;
    await t.applyStart(id);
    await t.pool.query("INSERT INTO test_fb (session_id, item) VALUES ($1, 'es teh (fixture)')", [id]);
    t.clock.advance(600);
    const ledgerBefore = await t.count("SELECT count(*) AS n FROM ledger_transactions");
    await move(id, b.id);
    t.clock.advance(40); // the swap window
    await lockProof(id);
    let v = J(await t.reconcile(id));
    expect(v.transfer.status).toBe("ACTIVATING_TARGET");
    expect(await grantedLeases(id)).toBe(1);
    const [startB] = await t.pending(id, "START");
    expect(startB!.command).toMatchObject({ stationId: b.id, deviceId: b.deviceId, action: "START" });
    expect(startB!.leaseClaims).toMatchObject({ sessionId: id, stationId: b.id, deviceId: b.deviceId, mode: "FIXED", remainingSecondsAtIssue: 3000 });
    t.clock.advance(5);
    expect((await t.ack(startB!, "APPLIED")).statusCode).toBe(200);
    v = J(await t.reconcile(id));
    expect(v).toMatchObject({ state: "ACTIVE", sessionId: id, stationId: b.id, deviceId: b.deviceId, quoteId: p.quoteId, paymentIntentId: p.intentId, tariffDeltaIdr: "0", amountIdr: "12000" });
    expect(v.transfer).toMatchObject({ status: "COMMITTED" });
    expect(v.clock).toMatchObject({ running: true, billableSeconds: 600 });
    expect(await t.count("SELECT count(*) AS n FROM test_fb WHERE session_id = $1", [id])).toBe(1);
    expect(await t.count("SELECT count(*) AS n FROM ledger_transactions")).toBe(ledgerBefore);
    expect((await t.pool.query("SELECT status FROM payment_intents WHERE id = $1", [p.intentId])).rows[0].status).toBe("settled");
    expect(await stationStatus(a.id)).toBe("available");
    expect(await stationStatus(b.id)).toBe("reserved");
    expect(await grantedLeases(id)).toBe(1);
    const actions = new Set((await t.commands(id)).map((c) => c.action));
    expect([...actions].sort()).toEqual(["LOCK", "START"]); // no CEC, no SAFE_CONTROL (D28)
    t.clock.advance(10);
    expect(J(await t.reconcile(id)).clock.billableSeconds).toBe(610);
  });

  it("a stale ACK from the old source after the fence is unusable", async () => {
    const { a, b, id } = await fresh({ mode: "OPEN" });
    t.clock.advance(60);
    await t.jobs.sweep(); // a renewal EXTEND for the source is now outstanding
    const [renew] = await t.pending(id, "EXTEND");
    expect(renew).toBeTruthy();
    await move(id, b.id);
    await lockProof(id);
    await t.reconcile(id);
    const [startB] = await t.pending(id, "START");
    await t.ack(startB!, "APPLIED");
    await t.reconcile(id);
    expect(J(await t.reconcile(id)).stationId).toBe(b.id);
    expect((await t.ack(renew!, "APPLIED")).statusCode).toBe(200); // the old source speaks late; T50 intake accepts the signature
    const v = J(await t.reconcile(id));
    expect(v).toMatchObject({ stationId: b.id, deviceId: b.deviceId, state: "ACTIVE" });
    expect(await t.count("SELECT count(*) AS n FROM session_events WHERE session_id = $1 AND kind = 'ACK_REJECTED'", [id])).toBeGreaterThanOrEqual(1);
    expect(await t.count("SELECT count(*) AS n FROM session_leases WHERE session_id = $1 AND status = 'granted' AND station_id = $2", [id, a.id])).toBe(0);
    expect(await grantedLeases(id)).toBe(1);
  });
});

describe("no ACK or unreachable source never creates two playable seats", () => {
  it("FIXED session, source never answers: after 10 s the session is RECOVERY and locked, the destination is never granted; end bills the frozen actual", async () => {
    const { a, b, id } = await fresh();
    t.clock.advance(300);
    await move(id, b.id);
    t.clock.advance(11);
    await t.jobs.sweep();
    const v = await t.view(id);
    expect(v).toMatchObject({ state: "RECOVERY", recoveryReason: "source_lock_unproven", transfer: { status: "SOURCE_UNPROVEN" }, clock: { running: false, billableSeconds: 300 } });
    for (let i = 0; i < 5; i++) { t.clock.advance(100); await t.jobs.sweep(); }
    expect(await grantedLeases(id)).toBe(0);
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId)).toHaveLength(0);
    const end = await t.act(id, "recover", { resolution: "end" });
    expect(J(end)).toMatchObject({ state: "FINISHED", clock: { billableSeconds: 300 } });
    expect(await stationStatus(b.id)).toBe("available"); // the destination was never commanded, so it is released
    expect(await stationStatus(a.id)).toBe("reserved"); // the source may still be playable until its lock is proven
    await lockProof(id);
    await t.reconcile(id);
    for (const kind of ["checkout", "clean", "release"]) expect((await t.act(id, kind)).status).toBe(202);
    expect(await stationStatus(a.id)).toBe("available");
  });

  it("OPEN session, source unreachable: the source lease's bounded expiry is the proof, and not before", async () => {
    const { b, id } = await fresh({ mode: "OPEN" });
    t.clock.advance(30);
    await move(id, b.id);
    t.clock.advance(11);
    await t.jobs.sweep();
    expect((await t.view(id)).state).toBe("RECOVERY");
    t.clock.advance(50); // 91 s after the lease was issued: still inside the 120 s horizon
    await t.jobs.sweep();
    expect(await grantedLeases(id)).toBe(0);
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId)).toHaveLength(0);
    t.clock.advance(30); // 121 s: the source device has locked itself
    await t.jobs.sweep();
    const v = await t.view(id);
    expect(v.transfer.status).toBe("ACTIVATING_TARGET");
    expect(v.state).toBe("ACTIVE");
    expect(await grantedLeases(id)).toBe(1);
    const [startB] = await t.pending(id, "START");
    expect((await t.ack(startB!, "APPLIED")).statusCode).toBe(200);
    expect(J(await t.reconcile(id))).toMatchObject({ stationId: b.id, transfer: { status: "COMMITTED" } });
  });

  it("recover retry re-sends the source LOCK under the same commandId and the transfer continues when it is proven", async () => {
    const { b, id } = await fresh();
    await move(id, b.id);
    const [lock] = await t.pending(id, "LOCK");
    t.clock.advance(11);
    await t.jobs.sweep();
    const retry = await t.act(id, "recover", { resolution: "retry" });
    expect(retry.status).toBe(202);
    const [again] = await t.pending(id, "LOCK");
    expect(again!.commandId).toBe(lock!.commandId);
    expect((await t.ack(again!, "APPLIED")).statusCode).toBe(200);
    expect(J(await t.reconcile(id)).transfer.status).toBe("ACTIVATING_TARGET");
  });
});

describe("target failure is a recoverable locked state with no duplicate charge", () => {
  it("a FAILED destination ACK: RECOVERY, destination locked, source still locked, retry brings it up on the destination", async () => {
    const { a, b, id } = await fresh();
    t.clock.advance(200);
    await move(id, b.id);
    await lockProof(id);
    await t.reconcile(id);
    const [startB] = await t.pending(id, "START");
    expect((await t.ack(startB!, "FAILED")).statusCode).toBe(200);
    let v = J(await t.reconcile(id));
    expect(v).toMatchObject({ state: "RECOVERY", recoveryReason: "target_failed", transfer: { status: "TARGET_FAILED" }, clock: { running: false, billableSeconds: 200 }, lease: null });
    expect(await grantedLeases(id)).toBe(0);
    expect((await t.pending(id, "LOCK")).map((c) => c.command["deviceId"])).toEqual([b.deviceId]); // make sure the destination is locked
    expect(await t.count("SELECT count(*) AS n FROM ledger_transactions WHERE source_event LIKE $1", [`session:${id}:%`])).toBe(0);
    const retry = await t.act(id, "recover", { resolution: "retry" });
    expect(retry.status).toBe(202);
    expect(J(retry).transfer.status).toBe("ACTIVATING_TARGET");
    expect(await grantedLeases(id)).toBe(1);
    const starts = (await t.pending(id, "START"));
    expect(starts).toHaveLength(1);
    expect(starts[0]!.commandId).not.toBe(startB!.commandId);
    expect((await t.ack(starts[0]!, "APPLIED")).statusCode).toBe(200);
    v = J(await t.reconcile(id));
    expect(v).toMatchObject({ state: "ACTIVE", stationId: b.id, clock: { running: true, billableSeconds: 200 }, transfer: { status: "COMMITTED" } });
    expect(await stationStatus(a.id)).toBe("available");
  });

  it("a destination that never answers times out after 10 s into RECOVERY; ending releases the destination only after its lock is proven", async () => {
    const { a, b, id } = await fresh();
    await move(id, b.id);
    await lockProof(id);
    await t.reconcile(id);
    t.clock.advance(11);
    await t.jobs.sweep();
    const v = await t.view(id);
    expect(v).toMatchObject({ state: "RECOVERY", recoveryReason: "target_timeout", transfer: { status: "TARGET_FAILED" } });
    expect(await grantedLeases(id)).toBe(0);
    const end = await t.act(id, "recover", { resolution: "end" });
    expect(J(end).state).toBe("FINISHED");
    expect(await stationStatus(b.id)).toBe("reserved"); // the destination may have applied the START unseen
    const lockB = (await t.pending(id, "LOCK")).find((c) => c.command["deviceId"] === b.deviceId)!;
    expect((await t.ack(lockB, "APPLIED")).statusCode).toBe(200);
    await t.reconcile(id);
    expect(await stationStatus(b.id)).toBe("available");
    expect(await stationStatus(a.id)).toBe("reserved");
  });
});

describe("crash recovery never grants two valid playback leases", () => {
  it("a crash while granting the destination rolls back; the retry grants exactly one", async () => {
    const { b, id } = await fresh();
    await move(id, b.id);
    await lockProof(id);
    t.opts.faults = { afterDestinationGrant: () => { throw new Error("fixture crash"); } };
    const crashed = await t.reconcile(id);
    t.opts.faults = {};
    expect(crashed.status).toBe(500);
    expect(await grantedLeases(id)).toBe(0);
    expect((await t.view(id)).transfer.status).toBe("LOCKING_SOURCE");
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId)).toHaveLength(0);
    await t.reconcile(id);
    await t.reconcile(id); // at-least-once delivery
    expect(await grantedLeases(id)).toBe(1);
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId && c.action === "START")).toHaveLength(1);
  });

  it("concurrent reconciles (two workers) still grant one destination lease and issue one START", async () => {
    const { b, id } = await fresh();
    await move(id, b.id);
    await lockProof(id);
    await Promise.all([t.reconcile(id), t.reconcile(id), t.jobs.sweep(), t.reconcile(id)]);
    expect(await grantedLeases(id)).toBe(1);
    expect((await t.commands(id)).filter((c) => c.command["deviceId"] === b.deviceId && c.action === "START")).toHaveLength(1);
  });

  it("the database itself refuses a second granted lease for one session or one station", async () => {
    const a = await t.addStation();
    const b = await t.addStation();
    const id = await t.activate(a.id, { mode: "OPEN" });
    const id2 = J(await t.start(b.id))["sessionId"] as string; // holds a granted lease on b
    const row = (await t.pool.query("SELECT * FROM session_leases WHERE session_id = $1 AND status = 'granted'", [id])).rows[0];
    const dup = (station: string, device: string) => t.pool.query(
      `INSERT INTO session_leases (lease_id, session_id, tenant_id, outlet_id, station_id, device_id, revision, mode, remaining_seconds_at_issue, issued_at, not_after, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 99, 'OPEN', 0, now(), now() + interval '2 minutes', 'granted')`, [id, row.tenant_id, row.outlet_id, station, device]);
    await expect(dup(a.id, row.device_id)).rejects.toThrow(); // second granted lease for the same session
    await t.act(id, "pause"); // the session now holds no granted lease
    expect(await grantedLeases(id)).toBe(0);
    await expect(dup(b.id, b.deviceId as string)).rejects.toThrow(); // b already holds id2's granted lease: one playable lease per station
    expect(id2).not.toBe(id);
  });
});

describe("minimum payment is charged once across the transfer (T47 gap closed over HTTP)", () => {
  it("5.000 covering 30 billable minutes is counted once; only the remaining time is repriced", async () => {
    const eff = new Date(t.clock.now.getTime() + 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
    const rule = await call(t.app, "POST", `${P}/rate-rules`, { ...as(t.owner), body: { ratePerHourIdr: "12000", minimum: { amountIdr: "5000", coveredSeconds: 1800 }, effectiveFrom: eff } });
    expect(rule.status).toBe(200);
    t.clock.advance(2);
    const a = await t.addStation();
    const id = await t.activate(a.id);
    expect(J(await call(t.app, "GET", `${P}/sessions/${id}`, as(t.cashier)))).toMatchObject({ amountIdr: "11000", minimumApplied: true });
    t.clock.advance(1800);
    const q = J(await quoteMove(id, CHEAP.id));
    expect(q).toMatchObject({ baseAmountIdr: "11000", newAmountIdr: "8000", deltaIdr: "-3000", minimumApplied: true });
    await t.act(id, "move", { targetStationId: CHEAP.id, quoteId: q["transferQuoteId"] });
    await lockProof(id);
    await t.reconcile(id);
    const [startC] = await t.pending(id, "START");
    await t.ack(startC!, "APPLIED");
    const v = J(await t.reconcile(id));
    expect(v).toMatchObject({ stationId: CHEAP.id, amountIdr: "8000", tariffDeltaIdr: "-3000", minimumApplied: true, quoteId: expect.any(String) });
    expect(await t.count("SELECT count(*) AS n FROM session_transfers WHERE session_id = $1 AND status = 'COMMITTED'", [id])).toBe(1);
  });
});
