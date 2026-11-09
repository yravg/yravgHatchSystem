// Contract: shift, X report and Z day-close logic (T53). SANDBOX FIXTURES: D08 (Asia/Jakarta, 04:00 cut, rule label
// fixture-d08-v1) and D30 (policy default block_if_other_open, NOT owner approved).
//   shiftTotals   read-only maths over order_payments / order_refunds; the cash drawer ignores QRIS entirely.
//   xReport       non-mutating: SELECT only, repeatable, writes nothing.
//   closeShift    closes one open shift (expected, actual, variance) in the caller's transaction.
//   dayClose      Z: atomic snapshot of one register + business day; duplicate Z returns the existing close; active sessions
//                 carry forward untouched; QRIS pending is reported apart from settled; conflicts are audited, never dropped.
import { BUSINESS_DAY_CUTOFF_MINUTES, businessDay, drawerExpected, DomainError, idrToJson } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { Tx } from "../identity/db.ts";
import { OperationsError } from "../orders/errors.ts";

type Q = Pick<Tx, "execute">;
export const RULE = { cutoff: "04:00", version: "fixture-d08-v1", fixture: true } as const;
export const LIVE_SESSION_STATES = ["STARTING", "ACTIVE", "PAUSED", "RECOVERY"] as const;

export async function audit(tx: Q, a: { tenantId: string; outletId: string; kind: string; actorId: string | null; data: Record<string, unknown>; now: Date }): Promise<void> {
  await tx.execute(sql`INSERT INTO ops_audit_events (tenant_id, outlet_id, kind, actor_id, data, at) VALUES (${a.tenantId}, ${a.outletId}, ${a.kind}, ${a.actorId}, ${JSON.stringify(a.data)}::jsonb, ${a.now.toISOString()})`);
}

export interface ShiftRow {
  id: string; register_id: string; cashier_id: string; status: string; business_day: string; opening_float_idr: string;
  expected_cash_idr: string | null; actual_cash_idr: string | null; variance_idr: string | null; opened_at: Date; closed_at: Date | null;
}
const SCOLS = sql`id, register_id, cashier_id, status, business_day::text AS business_day, opening_float_idr, expected_cash_idr, actual_cash_idr, variance_idr, opened_at, closed_at`;

export async function loadShift(q: Q, tenantId: string, outletId: string, id: string, lock?: "update" | "share"): Promise<ShiftRow> {
  const lockSql = lock === "update" ? sql`FOR UPDATE` : lock === "share" ? sql`FOR SHARE` : sql``;
  const r = (await q.execute(sql`SELECT ${SCOLS} FROM shifts WHERE id = ${id} AND tenant_id = ${tenantId} AND outlet_id = ${outletId} ${lockSql}`)).rows[0] as ShiftRow | undefined;
  if (!r) throw new DomainError("NOT_FOUND"); // another tenant's or outlet's shift looks like a missing one
  return r;
}

export const shiftView = (s: ShiftRow) => ({
  shiftId: s.id, registerId: s.register_id, cashierId: s.cashier_id, status: s.status, businessDay: s.business_day, openingFloatIdr: idrToJson(BigInt(s.opening_float_idr)),
  openedAt: new Date(s.opened_at).toISOString(), closedAt: s.closed_at ? new Date(s.closed_at).toISOString() : null,
  ...(s.status === "closed" ? { expectedCashIdr: idrToJson(BigInt(s.expected_cash_idr ?? "0")), actualCashIdr: idrToJson(BigInt(s.actual_cash_idr ?? "0")), varianceIdr: String(s.variance_idr ?? "0") } : {}),
});

/** The close of the register's business day that a shift belongs to, if any (null = the day is still open). */
export async function closeFor(q: Q, registerId: string, day: string): Promise<string | undefined> {
  return ((await q.execute(sql`SELECT id FROM day_closes WHERE register_id = ${registerId} AND business_day = ${day}::date`)).rows[0] as { id: string } | undefined)?.id;
}

export interface Totals { cashSales: bigint; cashRefundsPaid: bigint; qrisSettled: bigint; qrisPending: bigint; refundsPendingCount: number; refundsPending: bigint }

export async function shiftTotals(q: Q, shiftId: string): Promise<Totals> {
  const p = (await q.execute(sql`
    SELECT coalesce(sum(amount_idr) FILTER (WHERE method = 'cash' AND status = 'settled'), 0) AS cash_sales,
           coalesce(sum(amount_idr) FILTER (WHERE method = 'qris' AND status = 'settled'), 0) AS qris_settled,
           coalesce(sum(amount_idr) FILTER (WHERE method = 'qris' AND status = 'pending'), 0) AS qris_pending
    FROM order_payments WHERE shift_id = ${shiftId}`)).rows[0] as { cash_sales: string; qris_settled: string; qris_pending: string };
  const paid = (await q.execute(sql`
    SELECT coalesce(sum(r.amount_idr), 0) AS s FROM order_refunds r JOIN order_payments p ON p.id = r.payment_id
    WHERE r.proof_shift_id = ${shiftId} AND r.status = 'refunded' AND p.method = 'cash'`)).rows[0] as { s: string };
  const pend = (await q.execute(sql`
    SELECT count(*) AS n, coalesce(sum(r.amount_idr), 0) AS s FROM order_refunds r JOIN order_payments p ON p.id = r.payment_id
    WHERE p.shift_id = ${shiftId} AND r.status = 'pending'`)).rows[0] as { n: string; s: string };
  return { cashSales: BigInt(p.cash_sales), cashRefundsPaid: BigInt(paid.s), qrisSettled: BigInt(p.qris_settled), qrisPending: BigInt(p.qris_pending), refundsPendingCount: Number(pend.n), refundsPending: BigInt(pend.s) };
}

const expectedFor = (s: ShiftRow, t: Totals): bigint => drawerExpected({ openingFloatIdr: BigInt(s.opening_float_idr), cashSalesIdr: t.cashSales, cashRefundsPaidIdr: t.cashRefundsPaid });

export async function xReport(q: Q, tenantId: string, outletId: string, s: ShiftRow) {
  const t = await shiftTotals(q, s.id);
  const live = (await q.execute(sql`SELECT count(*) AS n FROM sessions WHERE tenant_id = ${tenantId} AND outlet_id = ${outletId} AND state IN ('STARTING', 'ACTIVE', 'PAUSED', 'RECOVERY')`)).rows[0] as { n: string };
  return {
    ...shiftView(s), fixture: true, rule: { cutoff: RULE.cutoff, version: RULE.version },
    cash: { openingFloatIdr: idrToJson(BigInt(s.opening_float_idr)), salesIdr: idrToJson(t.cashSales), refundsPaidIdr: idrToJson(t.cashRefundsPaid), expectedDrawerIdr: idrToJson(expectedFor(s, t)) },
    qris: { settledIdr: idrToJson(t.qrisSettled), pendingIdr: idrToJson(t.qrisPending) },
    refundsPending: { count: t.refundsPendingCount, amountIdr: idrToJson(t.refundsPending) },
    activeSessions: Number(live.n),
  };
}

export async function closeShift(tx: Tx, a: { tenantId: string; outletId: string; shift: ShiftRow; actualCashIdr: bigint; actorId: string; handoverTo?: string; now: Date }): Promise<void> {
  const t = await shiftTotals(tx, a.shift.id);
  const expected = expectedFor(a.shift, t);
  if (a.handoverTo) {
    const ok = (await tx.execute(sql`SELECT 1 FROM staff WHERE id = ${a.handoverTo} AND tenant_id = ${a.tenantId}`)).rows.length;
    if (!ok) throw new DomainError("NOT_FOUND");
  }
  await tx.execute(sql`
    UPDATE shifts SET status = 'closed', expected_cash_idr = ${expected.toString()}, actual_cash_idr = ${a.actualCashIdr.toString()}, variance_idr = ${(a.actualCashIdr - expected).toString()},
                      handover_to = ${a.handoverTo ?? null}, closed_at = ${a.now.toISOString()}, closed_by = ${a.actorId} WHERE id = ${a.shift.id}`);
}

export const businessDayFor = async (q: Q, outletId: string, at: Date): Promise<string> => {
  const tz = ((await q.execute(sql`SELECT timezone FROM outlets WHERE id = ${outletId}`)).rows[0] as { timezone: string } | undefined)?.timezone;
  if (!tz) throw new DomainError("NOT_FOUND");
  return businessDay(at, tz, BUSINESS_DAY_CUTOFF_MINUTES);
};

export interface CloseRow { id: string; business_day: string; snapshot: Record<string, unknown>; created_at: Date }
export const closeView = (c: CloseRow, duplicate: boolean) => ({ closeId: c.id, ...c.snapshot, duplicate });

export async function loadClose(q: Q, tenantId: string, outletId: string, id: string): Promise<CloseRow> {
  const r = (await q.execute(sql`SELECT id, business_day::text AS business_day, snapshot, created_at FROM day_closes WHERE id = ${id} AND tenant_id = ${tenantId} AND outlet_id = ${outletId}`)).rows[0] as CloseRow | undefined;
  if (!r) throw new DomainError("NOT_FOUND");
  return r;
}

export async function currentPolicy(q: Q, tenantId: string): Promise<{ version: number; mode: string; fixture: boolean } | undefined> {
  return (await q.execute(sql`SELECT version, mode, fixture FROM shift_close_policies WHERE tenant_id = ${tenantId} ORDER BY version DESC LIMIT 1`)).rows[0] as { version: number; mode: string; fixture: boolean } | undefined;
}

export async function dayClose(tx: Tx, a: { tenantId: string; outletId: string; registerId: string; shiftId: string; actualCashIdr: bigint; actorId: string; canSeeOthers: boolean; now: Date }) {
  const shift = await loadShift(tx, a.tenantId, a.outletId, a.shiftId, "update");
  if (shift.register_id !== a.registerId) throw new DomainError("NOT_FOUND");
  if (shift.cashier_id !== a.actorId && !a.canSeeOthers) throw new DomainError("AUTH_FORBIDDEN");
  await tx.execute(sql`SELECT 1 FROM registers WHERE id = ${a.registerId} FOR UPDATE`); // serialises concurrent Z of one register
  const existing = await closeFor(tx, a.registerId, shift.business_day);
  if (existing) return closeView(await loadClose(tx, a.tenantId, a.outletId, existing), true); // duplicate Z: same closeId, nothing written
  if (shift.status !== "open") throw new OperationsError("SHIFT_NOT_OPEN");
  const policy = await currentPolicy(tx, a.tenantId);
  if (!policy) throw new OperationsError("SHIFT_CLOSE_POLICY_MISSING");
  const others = (await tx.execute(sql`SELECT count(*) AS n FROM shifts WHERE register_id = ${a.registerId} AND business_day = ${shift.business_day}::date AND status = 'open' AND id <> ${a.shiftId}`)).rows[0] as { n: string };
  if (Number(others.n) > 0) throw new OperationsError("OPEN_SHIFTS_BLOCK", { openShifts: String(others.n) });

  await closeShift(tx, { tenantId: a.tenantId, outletId: a.outletId, shift, actualCashIdr: a.actualCashIdr, actorId: a.actorId, now: a.now });
  const scope = (await tx.execute(sql`SELECT ${SCOLS} FROM shifts WHERE register_id = ${a.registerId} AND business_day = ${shift.business_day}::date ORDER BY opened_at, id`)).rows as unknown as ShiftRow[];
  let settled = 0n; let pending = 0n; let refundsPending = 0n; let expected = 0n; let actual = 0n; let variance = 0n;
  const shifts = [];
  for (const s of scope) {
    const t = await shiftTotals(tx, s.id);
    settled += t.qrisSettled; pending += t.qrisPending; refundsPending += t.refundsPending;
    expected += BigInt(s.expected_cash_idr ?? "0"); actual += BigInt(s.actual_cash_idr ?? "0"); variance += BigInt(s.variance_idr ?? "0");
    shifts.push({ shiftId: s.id, cashierId: s.cashier_id, openingFloatIdr: idrToJson(BigInt(s.opening_float_idr)), cashSalesIdr: idrToJson(t.cashSales), cashRefundsPaidIdr: idrToJson(t.cashRefundsPaid),
      expectedCashIdr: idrToJson(BigInt(s.expected_cash_idr ?? "0")), actualCashIdr: idrToJson(BigInt(s.actual_cash_idr ?? "0")), varianceIdr: String(s.variance_idr ?? "0") });
  }
  const carried = (await tx.execute(sql`SELECT id, state FROM sessions WHERE tenant_id = ${a.tenantId} AND outlet_id = ${a.outletId} AND state IN ('STARTING', 'ACTIVE', 'PAUSED', 'RECOVERY') ORDER BY id`)).rows as { id: string; state: string }[];
  const transfers = (await tx.execute(sql`SELECT id, session_id, status FROM session_transfers WHERE tenant_id = ${a.tenantId} AND outlet_id = ${a.outletId} AND status IN ('LOCKING_SOURCE', 'ACTIVATING_TARGET', 'SOURCE_UNPROVEN', 'TARGET_FAILED') ORDER BY id`)).rows as { id: string; session_id: string; status: string }[];
  const closeId = crypto.randomUUID();
  const snapshot = {
    registerId: a.registerId, businessDay: shift.business_day, fixture: true,
    rule: { timezone: ((await tx.execute(sql`SELECT timezone FROM outlets WHERE id = ${a.outletId}`)).rows[0] as { timezone: string }).timezone, cutoff: RULE.cutoff, version: RULE.version, fixture: true },
    policy: { version: policy.version, mode: policy.mode, fixture: policy.fixture },
    shiftIds: scope.map((s) => s.id), shifts,
    totals: { expectedCashIdr: idrToJson(expected), actualCashIdr: idrToJson(actual), varianceIdr: variance.toString(), qrisSettledIdr: idrToJson(settled), qrisPendingIdr: idrToJson(pending), refundsPendingIdr: idrToJson(refundsPending) },
    carriedSessions: carried.map((s) => ({ sessionId: s.id, state: s.state })),
    openTransfers: transfers.map((t) => ({ transferId: t.id, sessionId: t.session_id, status: t.status })),
    closedAt: a.now.toISOString(),
  };
  await tx.execute(sql`
    INSERT INTO day_closes (id, tenant_id, outlet_id, register_id, business_day, policy_version, closing_shift_id, snapshot, created_by, created_at)
    VALUES (${closeId}, ${a.tenantId}, ${a.outletId}, ${a.registerId}, ${shift.business_day}::date, ${policy.version}, ${a.shiftId}, ${JSON.stringify(snapshot)}::jsonb, ${a.actorId}, ${a.now.toISOString()})`);
  for (const t of transfers) await audit(tx, { tenantId: a.tenantId, outletId: a.outletId, kind: "close.conflict.transfer", actorId: a.actorId, data: { closeId, transferId: t.id, sessionId: t.session_id, status: t.status }, now: a.now });
  await audit(tx, { tenantId: a.tenantId, outletId: a.outletId, kind: "day.closed", actorId: a.actorId, data: { closeId, registerId: a.registerId, businessDay: shift.business_day }, now: a.now });
  return { closeId, ...snapshot, duplicate: false };
}
