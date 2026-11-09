// Contract: orders, order payments and order refunds (T53). All money is integer IDR (bigint), SANDBOX FIXTURES.
//   createOrder   accepts lines (price + recipe-version snapshot) and consumes stock once; optional T49 session lineage.
//   payCash       T48 ledger: Dr cash / Cr sales_revenue for the order total (tender and change tracked), once.
//   payQris       T48 MidtransClient charge; the row stays pending and grants NOTHING.
//   verifyQris    value only after the authenticated provider status matches order id, merchant, amount, currency and type
//                 (T48 `matches` + `settlementAccepted`); then Dr provider_clearing / Cr sales_revenue once.
//   refund        pending until proof: Dr sales_revenue / Cr refund_payable (T48 pattern, nothing claims money went back);
//                 proof posts Dr refund_payable / Cr cash|provider_clearing once. No provider refund call exists here (D15).
// Offline sale capture is refused (CONTRACTS section 5: offline start/extend/refund/spend default refused).
import { DomainError, idrToJson, parseIdr } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { Tx } from "../identity/db.ts";
import type { Principal } from "../identity/service.ts";
import { postTransaction } from "../ledger/service.ts";
import { consumeForOrder, reverseOrderConsumption } from "../inventory/service.ts";
import type { PaymentsConfig } from "../payments/config.ts";
import { PaymentError, ProviderError } from "../payments/errors.ts";
import { MidtransClient } from "../payments/midtrans.ts";
import { matches, settlementAccepted } from "../payments/settlement.ts";
import { audit, closeFor, loadShift } from "../shifts/service.ts";
import { OperationsError } from "./errors.ts";

type Q = Pick<Tx, "execute">;
const conflict = (reason: string): never => { throw new DomainError("REVISION_CONFLICT", { reason }); };
const pgCode = (e: unknown): string | undefined => (e as { cause?: { code?: string }; code?: string }).cause?.code ?? (e as { code?: string }).code;
const ctx = (p: Principal, now: Date) => ({ tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, now });

interface OrderRow { id: string; session_id: string | null; status: string; total_idr: string; revision: number; created_at: Date }
interface PayRow { id: string; order_id: string; shift_id: string; method: string; amount_idr: string; tender_idr: string | null; change_idr: string | null; status: string; provider_order_id: string | null; merchant_id: string | null; qr_string: string | null; settled_at: Date | null; revision: number }
interface RefundRow { id: string; order_id: string; payment_id: string; amount_idr: string; status: string; reason: string; proof_ref: string | null; created_at: Date }
const PCOLS = sql`id, order_id, shift_id, method, amount_idr, tender_idr, change_idr, status, provider_order_id, merchant_id, qr_string, settled_at, revision`;

export const paymentView = (r: PayRow) => ({
  paymentId: r.id, orderId: r.order_id, shiftId: r.shift_id, method: r.method, status: r.status, amountIdr: idrToJson(BigInt(r.amount_idr)),
  tenderIdr: r.tender_idr === null ? null : idrToJson(BigInt(r.tender_idr)), changeIdr: r.change_idr === null ? null : idrToJson(BigInt(r.change_idr)),
  providerOrderId: r.provider_order_id, qrString: r.qr_string, settledAt: r.settled_at ? new Date(r.settled_at).toISOString() : null,
});
export const refundView = (r: RefundRow) => ({ refundId: r.id, orderId: r.order_id, paymentId: r.payment_id, amountIdr: idrToJson(BigInt(r.amount_idr)), status: r.status, reason: r.reason, proofRef: r.proof_ref, createdAt: new Date(r.created_at).toISOString() });

async function loadOrder(q: Q, p: Pick<Principal, "tenantId" | "outletId">, id: string, lock = false): Promise<OrderRow> {
  const r = (await q.execute(sql`SELECT id, session_id, status, total_idr, revision, created_at FROM orders WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ${lock ? sql`FOR UPDATE` : sql``}`)).rows[0] as OrderRow | undefined;
  if (!r) throw new DomainError("NOT_FOUND"); // cross-tenant and cross-outlet look like a missing order
  return r;
}

export async function orderView(q: Q, p: Pick<Principal, "tenantId" | "outletId">, id: string) {
  const o = await loadOrder(q, p, id);
  const lines = (await q.execute(sql`SELECT menu_item_id, qty, unit_price_idr, line_total_idr FROM order_lines WHERE order_id = ${id} ORDER BY id`)).rows as { menu_item_id: string; qty: number; unit_price_idr: string; line_total_idr: string }[];
  const pay = (await q.execute(sql`SELECT ${PCOLS} FROM order_payments WHERE order_id = ${id} ORDER BY created_at DESC, id LIMIT 1`)).rows[0] as PayRow | undefined;
  const refund = (await q.execute(sql`SELECT id, order_id, payment_id, amount_idr, status, reason, proof_ref, created_at FROM order_refunds WHERE order_id = ${id}`)).rows[0] as RefundRow | undefined;
  const paymentStatus = refund ? (refund.status === "refunded" ? "refunded" : "refund_pending") : pay?.status === "settled" ? "paid" : pay?.status === "pending" ? "pending" : "unpaid";
  return {
    orderId: o.id, status: o.status, sessionId: o.session_id, totalIdr: idrToJson(BigInt(o.total_idr)), paymentStatus,
    lines: lines.map((l) => ({ menuItemId: l.menu_item_id, qty: l.qty, unitPriceIdr: idrToJson(BigInt(l.unit_price_idr)), lineTotalIdr: idrToJson(BigInt(l.line_total_idr)) })),
    payment: pay ? paymentView(pay) : null, refund: refund ? refundView(refund) : null, revision: o.revision,
  };
}

export async function createOrder(tx: Tx, p: Principal, now: Date, b: { sessionId?: string; lines: { menuItemId: string; qty: number }[]; offline?: boolean }) {
  if (b.offline) throw new OperationsError("OFFLINE_NOT_ALLOWED");
  if (b.lines.length === 0) throw new DomainError("VALIDATION_FAILED", { field: "lines" });
  if (b.sessionId) {
    const s = (await tx.execute(sql`SELECT state FROM sessions WHERE id = ${b.sessionId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as { state: string } | undefined;
    if (!s) throw new DomainError("NOT_FOUND");
    if (!["STARTING", "ACTIVE", "PAUSED", "RECOVERY", "FINISHED", "CHECKOUT_PENDING"].includes(s.state)) conflict("session_not_live");
  }
  const orderId = crypto.randomUUID();
  let total = 0n;
  const rows: { id: string; menuItemId: string; recipe: string | null; qty: number; price: bigint }[] = [];
  for (const l of b.lines) {
    const m = (await tx.execute(sql`SELECT price_idr, active FROM menu_items WHERE id = ${l.menuItemId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as { price_idr: string; active: boolean } | undefined;
    if (!m) throw new DomainError("NOT_FOUND");
    if (!m.active) conflict("menu_item_inactive");
    const rv = (await tx.execute(sql`SELECT id FROM recipe_versions WHERE menu_item_id = ${l.menuItemId} ORDER BY version DESC LIMIT 1`)).rows[0] as { id: string } | undefined;
    const price = BigInt(m.price_idr);
    total += price * BigInt(l.qty);
    rows.push({ id: crypto.randomUUID(), menuItemId: l.menuItemId, recipe: rv?.id ?? null, qty: l.qty, price });
  }
  await tx.execute(sql`INSERT INTO orders (id, tenant_id, outlet_id, session_id, total_idr, created_by, created_at) VALUES (${orderId}, ${p.tenantId}, ${p.outletId}, ${b.sessionId ?? null}, ${total.toString()}, ${p.staffId}, ${now.toISOString()})`);
  for (const r of rows) {
    await tx.execute(sql`INSERT INTO order_lines (id, order_id, tenant_id, outlet_id, menu_item_id, recipe_version_id, qty, unit_price_idr, line_total_idr) VALUES (${r.id}, ${orderId}, ${p.tenantId}, ${p.outletId}, ${r.menuItemId}, ${r.recipe}, ${r.qty}, ${r.price.toString()}, ${(r.price * BigInt(r.qty)).toString()})`);
  }
  await consumeForOrder(tx, { ...ctx(p, now), orderId }); // throws REVISION_CONFLICT negative_stock: no order, no stock move
  return orderView(tx, p, orderId);
}

export async function cancelOrder(tx: Tx, p: Principal, now: Date, id: string, reason: string) {
  const o = await loadOrder(tx, p, id, true);
  if (o.status !== "accepted") conflict("order_not_open");
  const live = (await tx.execute(sql`SELECT 1 FROM order_payments WHERE order_id = ${id} AND status IN ('pending', 'settled')`)).rows.length;
  if (live) conflict("order_has_payment");
  await reverseOrderConsumption(tx, ctx(p, now), id);
  await tx.execute(sql`UPDATE orders SET status = 'cancelled', cancelled_at = ${now.toISOString()}, cancel_reason = ${reason}, revision = revision + 1 WHERE id = ${id}`);
  return orderView(tx, p, id);
}

async function checkShift(tx: Tx, p: Principal, shiftId: string): Promise<void> {
  const s = await loadShift(tx, p.tenantId, p.outletId, shiftId, "share");
  if (s.cashier_id !== p.staffId) throw new DomainError("AUTH_FORBIDDEN"); // someone else's shift
  if (s.status !== "open") throw new OperationsError("SHIFT_NOT_OPEN");
}

export async function payOrder(tx: Tx, p: Principal, now: Date, id: string, b: { method: "cash" | "qris"; tenderIdr?: string; shiftId: string }, payments: PaymentsConfig | undefined) {
  const o = await loadOrder(tx, p, id, true);
  if (o.status !== "accepted") conflict("order_not_open");
  await checkShift(tx, p, b.shiftId);
  const live = (await tx.execute(sql`SELECT 1 FROM order_payments WHERE order_id = ${id} AND status IN ('pending', 'settled')`)).rows.length;
  if (live) conflict("order_already_paid");
  const amount = BigInt(o.total_idr);
  if (amount <= 0n) throw new DomainError("VALIDATION_FAILED", { field: "totalIdr" });
  const paymentId = crypto.randomUUID();

  if (b.method === "cash") {
    if (b.tenderIdr === undefined) throw new DomainError("VALIDATION_FAILED", { field: "tenderIdr" });
    const tender = parseIdr(b.tenderIdr);
    if (tender < amount) conflict("tender_below_total");
    const posted = await postTransaction(tx, { ...ctx(p, now), sourceEvent: `order-payment:${paymentId}`, kind: "order_sale", lines: [
      { account: "cash", debitIdr: amount, creditIdr: 0n }, { account: "sales_revenue", debitIdr: 0n, creditIdr: amount }] });
    await tx.execute(sql`INSERT INTO order_payments (id, tenant_id, outlet_id, order_id, shift_id, method, amount_idr, tender_idr, change_idr, status, ledger_transaction_id, created_by, created_at, settled_at)
      VALUES (${paymentId}, ${p.tenantId}, ${p.outletId}, ${id}, ${b.shiftId}, 'cash', ${amount.toString()}, ${tender.toString()}, ${(tender - amount).toString()}, 'settled', ${posted.transactionId}, ${p.staffId}, ${now.toISOString()}, ${now.toISOString()})`);
  } else {
    if (!payments) throw new OperationsError("PAYMENTS_NOT_CONFIGURED");
    const providerOrderId = `hatch-ord-${paymentId}`;
    try {
      await tx.execute(sql`INSERT INTO order_payments (id, tenant_id, outlet_id, order_id, shift_id, method, amount_idr, status, provider_order_id, merchant_id, created_by, created_at)
        VALUES (${paymentId}, ${p.tenantId}, ${p.outletId}, ${id}, ${b.shiftId}, 'qris', ${amount.toString()}, 'pending', ${providerOrderId}, ${payments.merchantId}, ${p.staffId}, ${now.toISOString()})`);
    } catch (e) { if (pgCode(e) === "23505") conflict("order_already_paid"); throw e; }
    try {
      const qr = (await new MidtransClient(payments).charge(providerOrderId, amount, payments.intentTtlSeconds)).qrString;
      await tx.execute(sql`UPDATE order_payments SET qr_string = ${qr} WHERE id = ${paymentId}`);
    } catch (e) { if (e instanceof ProviderError) throw new PaymentError("PROVIDER_UNAVAILABLE", { reason: e.reason }); throw e; } // rolls the pending row back
  }
  const row = (await tx.execute(sql`SELECT ${PCOLS} FROM order_payments WHERE id = ${paymentId}`)).rows[0] as unknown as PayRow;
  return paymentView(row);
}

export async function verifyQris(tx: Tx, p: Principal, now: Date, orderId: string, paymentId: string, payments: PaymentsConfig | undefined) {
  await loadOrder(tx, p, orderId);
  const row = (await tx.execute(sql`SELECT ${PCOLS} FROM order_payments WHERE id = ${paymentId} AND order_id = ${orderId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as PayRow | undefined;
  if (!row || row.method !== "qris") throw new DomainError("NOT_FOUND");
  if (row.status !== "pending") return paymentView(row); // settled or failed: a no-op replay
  if (!payments) throw new OperationsError("PAYMENTS_NOT_CONFIGURED");
  let status;
  try { status = await new MidtransClient(payments).status(row.provider_order_id as string); }
  catch (e) { if (e instanceof ProviderError) throw new PaymentError("PROVIDER_UNAVAILABLE", { reason: e.reason }); throw e; }
  const intentLike = { provider_order_id: row.provider_order_id as string, merchant_id: row.merchant_id as string, amount_idr: row.amount_idr };
  if (!matches(status, intentLike, payments.merchantId)) return paymentView(row); // wrong amount / merchant / currency / type: never grants
  const ts = status.transactionStatus;
  if (settlementAccepted(status)) {
    const amount = BigInt(row.amount_idr);
    const posted = await postTransaction(tx, { ...ctx(p, now), sourceEvent: `order-payment:${row.id}`, kind: "order_sale", lines: [
      { account: "provider_clearing", debitIdr: amount, creditIdr: 0n }, { account: "sales_revenue", debitIdr: 0n, creditIdr: amount }] });
    await tx.execute(sql`UPDATE order_payments SET status = 'settled', ledger_transaction_id = ${posted.transactionId}, settled_at = ${now.toISOString()}, revision = revision + 1 WHERE id = ${row.id}`);
    const sh = await loadShift(tx, p.tenantId, p.outletId, row.shift_id);
    const closeId = await closeFor(tx, sh.register_id, sh.business_day);
    if (closeId) await audit(tx, { ...ctx(p, now), kind: "qris.settled_after_close", data: { closeId, paymentId: row.id, orderId, amountIdr: row.amount_idr } }); // the closed snapshot is never rewritten
  } else if (ts === "expire" || ts === "cancel" || ts === "deny" || ts === "failure") {
    await tx.execute(sql`UPDATE order_payments SET status = 'failed', revision = revision + 1 WHERE id = ${row.id}`);
  }
  return paymentView((await tx.execute(sql`SELECT ${PCOLS} FROM order_payments WHERE id = ${row.id}`)).rows[0] as unknown as PayRow);
}

export async function requestRefund(tx: Tx, p: Principal, now: Date, orderId: string, b: { paymentId: string; reason: string }) {
  await loadOrder(tx, p, orderId, true);
  const pay = (await tx.execute(sql`SELECT ${PCOLS} FROM order_payments WHERE id = ${b.paymentId} AND order_id = ${orderId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as PayRow | undefined;
  if (!pay) throw new DomainError("NOT_FOUND");
  if (pay.status !== "settled") conflict("payment_not_settled");
  if ((await tx.execute(sql`SELECT 1 FROM order_refunds WHERE payment_id = ${pay.id}`)).rows.length) conflict("refund_exists");
  const amount = BigInt(pay.amount_idr);
  const refundId = crypto.randomUUID();
  const posted = await postTransaction(tx, { ...ctx(p, now), sourceEvent: `order-refund:${refundId}`, kind: "order_refund", reason: b.reason, lines: [
    { account: "sales_revenue", debitIdr: amount, creditIdr: 0n }, { account: "refund_payable", debitIdr: 0n, creditIdr: amount }] });
  await tx.execute(sql`INSERT INTO order_refunds (id, tenant_id, outlet_id, order_id, payment_id, amount_idr, reason, request_ledger_transaction_id, requested_by, created_at)
    VALUES (${refundId}, ${p.tenantId}, ${p.outletId}, ${orderId}, ${pay.id}, ${amount.toString()}, ${b.reason}, ${posted.transactionId}, ${p.staffId}, ${now.toISOString()})`);
  const sh = await loadShift(tx, p.tenantId, p.outletId, pay.shift_id);
  const closeId = await closeFor(tx, sh.register_id, sh.business_day);
  if (closeId) await audit(tx, { ...ctx(p, now), kind: "refund.conflicts_with_close", data: { closeId, refundId, paymentId: pay.id, orderId, amountIdr: pay.amount_idr } }); // proceeds in the current shift; the close is untouched
  return refundView((await tx.execute(sql`SELECT id, order_id, payment_id, amount_idr, status, reason, proof_ref, created_at FROM order_refunds WHERE id = ${refundId}`)).rows[0] as unknown as RefundRow);
}

export async function proveRefund(tx: Tx, p: Principal, now: Date, refundId: string, b: { proofRef: string; shiftId?: string }) {
  const r = (await tx.execute(sql`SELECT id, order_id, payment_id, amount_idr, status, reason, proof_ref, created_at FROM order_refunds WHERE id = ${refundId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as RefundRow | undefined;
  if (!r) throw new DomainError("NOT_FOUND");
  if (r.status !== "pending") conflict("refund_not_pending");
  const pay = (await tx.execute(sql`SELECT method FROM order_payments WHERE id = ${r.payment_id}`)).rows[0] as { method: string };
  if (pay.method === "cash") {
    if (!b.shiftId) throw new DomainError("VALIDATION_FAILED", { field: "shiftId" }); // cash leaves the drawer of an open shift
    await checkShift(tx, p, b.shiftId);
  }
  const amount = BigInt(r.amount_idr);
  const from = pay.method === "cash" ? "cash" : "provider_clearing";
  const posted = await postTransaction(tx, { ...ctx(p, now), sourceEvent: `order-refund-paid:${r.id}`, kind: "order_refund_paid", reason: b.proofRef, lines: [
    { account: "refund_payable", debitIdr: amount, creditIdr: 0n }, { account: from, debitIdr: 0n, creditIdr: amount }] });
  await tx.execute(sql`UPDATE order_refunds SET status = 'refunded', proof_ref = ${b.proofRef}, proof_shift_id = ${pay.method === "cash" ? b.shiftId ?? null : null}, paid_ledger_transaction_id = ${posted.transactionId}, paid_at = ${now.toISOString()} WHERE id = ${r.id}`);
  return refundView((await tx.execute(sql`SELECT id, order_id, payment_id, amount_idr, status, reason, proof_ref, created_at FROM order_refunds WHERE id = ${r.id}`)).rows[0] as unknown as RefundRow);
}

