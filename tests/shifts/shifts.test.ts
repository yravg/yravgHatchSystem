// T53 shifts: X report (non-mutating), Z day close (atomic scoped snapshot), D30 open-shift policy (FIXTURE, not owner approved),
// D08 business day (Asia/Jakarta, cut 04:00, FIXTURE). All money is a SANDBOX FIXTURE.
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { opsHarness, type OH } from "../orders/support.ts";

describe("T53 shifts", () => {
  let h: OH;
  beforeAll(async () => { h = await opsHarness(); });
  afterAll(async () => { await h.close(); });

  const reg = () => h.register(`k-${randomUUID().slice(0, 8)}`);
  const sell = async (shift: string, method: "cash" | "qris", qty = 1, settle = false) => {
    const { menu } = await h.latte();
    const o = (await h.order(h.cashier, [{ menuItemId: menu, qty }])).json["data"];
    const p = await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments`, method === "cash" ? { method, tenderIdr: "100000", shiftId: shift } : { method, shiftId: shift }));
    if (settle) { h.mock.settle(p["providerOrderId"]); await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments/${p["paymentId"]}/verify`, {})); }
    return { o, p };
  };
  const z = (s: typeof h.cashier, registerId: string, body: Record<string, unknown>, key?: string) => h.post(s, `/registers/${registerId}/day-closes`, body, key);

  it("Z refuses with a clear typed error when no policy version exists, and closes nothing", async () => {
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    const res = await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" });
    expect(res.status).toBe(409);
    expect(res.json["error"].code).toBe("SHIFT_CLOSE_POLICY_MISSING");
    expect(res.json["error"].messageKey).toBe("error.shift.closePolicyMissing");
    expect(await h.count("SELECT count(*) n FROM day_closes")).toBe(0);
    expect((await h.q<{ status: string }>("SELECT status FROM shifts WHERE id = $1", [shift]))[0]?.status).toBe("open");
  });

  it("the open-shift policy is versioned, tenant scoped, owner only, and labelled as the D30 fixture default", async () => {
    expect((await h.post(h.cashier, "/shift-close-policies", {})).status).toBe(403);
    const v1 = await h.policy();
    expect(v1).toMatchObject({ version: 1, mode: "block_if_other_open", fixture: true });
    expect((await h.policy())["version"]).toBe(2);
    expect((await h.get(h.manager, "/shift-close-policies/current")).json["data"]).toMatchObject({ version: 2, fixture: true });
    expect((await h.get(h.ownerB, "/shift-close-policies/current")).status).toBe(404); // another tenant has none
    expect((await h.post(h.owner, "/shift-close-policies", { mode: "ignore_open_shifts" })).status).toBe(400);
  });

  it("business day follows D08: a shift opened at 03:59 local belongs to the previous day, 04:00 starts the next", async () => {
    const r1 = await reg(); const r2 = await reg();
    h.clock.now = new Date("2026-11-09T20:59:00Z");
    const c = await h.relogin("cashierA"); // a fresh session: the fixture clock jumped past the old one's lifetime
    const a = await h.ok(h.post(c, "/shifts/open", { registerId: r1, openingFloatIdr: "0" }));
    h.clock.now = new Date("2026-11-09T21:00:00Z");
    const b = await h.ok(h.post(c, "/shifts/open", { registerId: r2, openingFloatIdr: "0" }));
    expect([a["businessDay"], b["businessDay"]]).toEqual(["2026-11-09", "2026-11-10"]);
    await h.ok(h.post(c, `/shifts/${a["shiftId"]}/close`, { actualCashIdr: "0" }));
    await h.ok(h.post(c, `/shifts/${b["shiftId"]}/close`, { actualCashIdr: "0" }));
    h.clock.now = new Date("2026-11-09T03:00:00Z");
  });

  it("X report repeated three times changes no shift, ledger entry, audit row, idempotency key or close", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    await sell(shift, "cash");
    const snap = async () => JSON.stringify([
      await h.q("SELECT * FROM shifts ORDER BY id"), await h.count("SELECT count(*) n FROM ledger_transactions"), await h.count("SELECT count(*) n FROM ledger_entries"),
      await h.q("SELECT * FROM ledger_balances ORDER BY account"), await h.count("SELECT count(*) n FROM ops_audit_events"), await h.count("SELECT count(*) n FROM idempotency_keys"),
      await h.count("SELECT count(*) n FROM day_closes"), await h.q("SELECT * FROM order_payments ORDER BY id"),
    ]);
    const before = await snap();
    const reports: unknown[] = [];
    for (let i = 0; i < 3; i++) { const x = await h.get(h.cashier, `/shifts/${shift}/x-report`); expect(x.status).toBe(200); reports.push(x.json["data"]); }
    expect(await snap()).toBe(before);
    expect(reports[1]).toEqual(reports[0]); expect(reports[2]).toEqual(reports[0]);
    expect((reports[0] as { status: string }).status).toBe("open");
  });

  it("X report: the cash drawer ignores QRIS and QRIS settled and pending are reported separately", async () => {
    const r = await reg(); const shift = await h.openShift(h.cashier, r, "100000");
    await sell(shift, "cash"); // 20000 cash
    await sell(shift, "qris", 1, true); // 20000 QRIS settled
    await sell(shift, "qris", 3, false); // 60000 QRIS pending
    const x = (await h.get(h.cashier, `/shifts/${shift}/x-report`)).json["data"];
    expect(x.cash).toMatchObject({ openingFloatIdr: "100000", salesIdr: "20000", refundsPaidIdr: "0", expectedDrawerIdr: "120000" });
    expect(x.qris).toMatchObject({ settledIdr: "20000", pendingIdr: "60000" });
    expect(x.fixture).toBe(true);
  });

  it("Z snapshots the register and business-day scope, closes the shift, and carries active sessions forward", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r, "100000");
    await sell(shift, "cash"); await sell(shift, "qris", 1, true); await sell(shift, "qris", 3, false);
    const active = await h.seedSession("ACTIVE"); const paused = await h.seedSession("PAUSED");
    const sessions = await h.q("SELECT id, state, revision, accrued_seconds FROM sessions ORDER BY id");
    const res = await z(h.cashier, r, { shiftId: shift, actualCashIdr: "119000" });
    expect(res.status).toBe(200);
    const c = res.json["data"];
    expect(c).toMatchObject({ businessDay: "2026-11-09", registerId: r, shiftIds: [shift], duplicate: false });
    expect(c.rule).toMatchObject({ timezone: "Asia/Jakarta", cutoff: "04:00", fixture: true });
    expect(c.policy).toMatchObject({ mode: "block_if_other_open", fixture: true });
    expect(c.totals).toMatchObject({ expectedCashIdr: "120000", actualCashIdr: "119000", varianceIdr: "-1000", qrisSettledIdr: "20000", qrisPendingIdr: "60000" });
    expect(c.carriedSessions.map((s: { sessionId: string }) => s.sessionId).sort()).toEqual([active, paused].sort());
    expect(await h.q("SELECT id, state, revision, accrued_seconds FROM sessions ORDER BY id")).toEqual(sessions); // not cut, not touched
    expect((await h.q<{ status: string }>("SELECT status FROM shifts WHERE id = $1", [shift]))[0]?.status).toBe("closed");
    const read = (await h.get(h.manager, `/day-closes/${c.closeId}`)).json["data"];
    expect(read.totals).toEqual(c.totals);
    await expect(h.pool.query("UPDATE day_closes SET snapshot = '{}'::jsonb WHERE id = $1", [c.closeId])).rejects.toThrow(/append-only|immutable/);
  });

  it("a duplicate Z returns the same closeId and changes nothing (same key and a different key)", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    const key = randomUUID();
    const a = await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" }, key);
    const b = await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" }, key);
    const c = await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" });
    expect([a.status, b.status, c.status]).toEqual([200, 200, 200]);
    expect(b.json["data"].closeId).toBe(a.json["data"].closeId);
    expect(c.json["data"].closeId).toBe(a.json["data"].closeId);
    expect(c.json["data"].duplicate).toBe(true);
    expect(await h.count("SELECT count(*) n FROM day_closes WHERE register_id = $1", [r])).toBe(1);
    expect((await z(h.cashier, r, { shiftId: shift, actualCashIdr: "5" }, key)).status).toBe(409); // same key, other payload
  });

  it("Z is blocked while another shift of the register is open and passes after that shift is closed", async () => {
    await h.policy();
    const r = await reg(); const mine = await h.openShift(h.cashier, r); const other = await h.openShift(h.manager, r);
    const blocked = await z(h.cashier, r, { shiftId: mine, actualCashIdr: "100000" });
    expect(blocked.status).toBe(409);
    expect(blocked.json["error"].code).toBe("OPEN_SHIFTS_BLOCK");
    expect(blocked.json["error"].details).toMatchObject({ openShifts: "1" });
    expect(await h.count("SELECT count(*) n FROM day_closes WHERE register_id = $1", [r])).toBe(0);
    await h.ok(h.post(h.manager, `/shifts/${other}/close`, { actualCashIdr: "100000", handoverTo: h.world.cashierA }));
    const ok = await z(h.cashier, r, { shiftId: mine, actualCashIdr: "100000" });
    expect(ok.status).toBe(200);
    expect(ok.json["data"].shiftIds.sort()).toEqual([mine, other].sort());
  });

  it("Z is atomic: a failure while writing the close leaves the shift open and writes nothing", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    await h.pool.query("CREATE FUNCTION t53_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'injected failure'; END $$");
    await h.pool.query("CREATE TRIGGER t53_fail_close BEFORE INSERT ON day_closes FOR EACH ROW EXECUTE FUNCTION t53_fail()");
    const audits = await h.count("SELECT count(*) n FROM ops_audit_events");
    const res = await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" });
    await h.pool.query("DROP TRIGGER t53_fail_close ON day_closes");
    expect(res.status).toBe(500);
    expect((await h.q<{ status: string }>("SELECT status FROM shifts WHERE id = $1", [shift]))[0]?.status).toBe("open");
    expect(await h.count("SELECT count(*) n FROM ops_audit_events")).toBe(audits);
    expect((await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" })).status).toBe(200); // the retry works
  });

  it("a refund of a payment from a closed day is audited as a conflict, never dropped, and the snapshot is unchanged", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    const { o, p } = await sell(shift, "cash");
    const close = (await z(h.cashier, r, { shiftId: shift, actualCashIdr: "120000" })).json["data"];
    const before = JSON.stringify((await h.q("SELECT snapshot FROM day_closes WHERE id = $1", [close.closeId]))[0]);
    await h.stepUp(h.manager);
    const refund = await h.post(h.manager, `/orders/${o.orderId}/refunds`, { paymentId: p["paymentId"], reason: "komplain" });
    expect(refund.status).toBe(200);
    expect(refund.json["data"].status).toBe("pending");
    const ev = await h.q<{ kind: string; data: { closeId: string; refundId: string } }>("SELECT kind, data FROM ops_audit_events WHERE kind = 'refund.conflicts_with_close'");
    expect(ev).toHaveLength(1);
    expect(ev[0]?.data).toMatchObject({ closeId: close.closeId, refundId: refund.json["data"].refundId });
    expect(JSON.stringify((await h.q("SELECT snapshot FROM day_closes WHERE id = $1", [close.closeId]))[0])).toBe(before);
  });

  it("a transfer in flight at close time is recorded in the snapshot and audited, not dropped", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    const sid = await h.seedSession("ACTIVE"); const tid = await h.seedTransfer(sid);
    const c = (await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" })).json["data"];
    expect(c.openTransfers).toEqual([{ transferId: tid, sessionId: sid, status: "LOCKING_SOURCE" }]);
    const ev = await h.q<{ data: { closeId: string; transferId: string } }>("SELECT data FROM ops_audit_events WHERE kind = 'close.conflict.transfer'");
    expect(ev.map((e) => e.data.transferId)).toContain(tid);
    expect((await h.q<{ status: string }>("SELECT status FROM session_transfers WHERE id = $1", [tid]))[0]?.status).toBe("LOCKING_SOURCE"); // untouched
  });

  it("a QRIS payment settled after the close is audited and never moves the closed totals", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    const { o, p } = await sell(shift, "qris", 1, false);
    const close = (await z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" })).json["data"];
    expect(close.totals.qrisPendingIdr).toBe("20000");
    h.mock.settle(p["providerOrderId"]);
    await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments/${p["paymentId"]}/verify`, {}));
    expect(await h.count("SELECT count(*) n FROM ops_audit_events WHERE kind = 'qris.settled_after_close' AND data->>'closeId' = $1", [close.closeId])).toBe(1);
    expect((await h.get(h.manager, `/day-closes/${close.closeId}`)).json["data"].totals.qrisPendingIdr).toBe("20000");
  });

  it("a day that is closed cannot get a new shift on the same register, and the cashier cannot close someone else's shift", async () => {
    await h.policy();
    const r = await reg(); const shift = await h.openShift(h.cashier, r);
    expect((await z(h.cashierA2, r, { shiftId: shift, actualCashIdr: "1" })).status).toBe(404); // other outlet
    expect((await z(h.ownerB, r, { shiftId: shift, actualCashIdr: "1" })).status).toBe(404); // other tenant
    const mine = await h.openShift(h.manager, r);
    expect((await h.post(h.cashier, `/shifts/${mine}/close`, { actualCashIdr: "1" })).status).toBe(403);
    await h.ok(h.post(h.manager, `/shifts/${mine}/close`, { actualCashIdr: "100000" }));
    await h.ok(z(h.cashier, r, { shiftId: shift, actualCashIdr: "100000" }));
    const again = await h.post(h.manager, "/shifts/open", { registerId: r, openingFloatIdr: "0" });
    expect(again.status).toBe(409);
    expect(again.json["error"].code).toBe("DAY_CLOSED");
    expect((await h.post(h.manager, "/shifts/open", { registerId: r, openingFloatIdr: "-1" })).status).toBe(400);
  });
});
