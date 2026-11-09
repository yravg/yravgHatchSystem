// Contract: the ONLY place value is granted for a QRIS payment. Steps, in order: authenticated GET status at the
// provider; order id, merchant, amount, currency and payment type must all match the stored intent; transaction_status
// must be settlement with an acceptable fraud status; then, under a row lock, the intent moves once. A settlement that
// arrives for an abandoned/expired/failed intent, or after the station was released or reassigned, becomes
// refund_pending (a pending refund row and a payable, never revenue and never a session). The refund itself is NOT
// executed here: no provider refund call exists, so nothing claims money was returned. Effects are idempotent
// (intent status guard + unique ledger source event), which makes at-least-once job delivery safe.
import { allocatePayment, type JournalLine } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { Pool } from "pg";
import type { Tx } from "../identity/db.ts";
import { postTransaction } from "../ledger/service.ts";
import type { PaymentsConfig } from "./config.ts";
import { MidtransClient, parseGross, type ProviderStatus } from "./midtrans.ts";

export interface PaymentsDeps {
  pool: Pool;
  config: PaymentsConfig;
  clock?: () => Date;
  fetch?: typeof fetch;
}

interface IntentRow {
  id: string; tenant_id: string; outlet_id: string; quote_id: string; station_id: string; provider_order_id: string; merchant_id: string;
  amount_idr: string; status: string; station_reserved_by: string; station_reserved_at: Date; expires_at: Date;
}
const ICOLS = sql`id, tenant_id, outlet_id, quote_id, station_id, provider_order_id, merchant_id, amount_idr, status, station_reserved_by, station_reserved_at, expires_at`;

const LATE_GRACE_SECONDS = 3600; // keep asking the provider this long after expiry so a late payment is found
const TERMINAL = new Set(["settled", "refund_pending"]);

export type Verdict = "noop" | "settled" | "refund_pending" | "pending" | "mismatch" | "expired" | "failed";
export interface JobResult { verdict: Verdict; nextAt?: Date }

export const matches = (s: ProviderStatus, i: Pick<IntentRow, "provider_order_id" | "merchant_id" | "amount_idr">, merchantId: string): boolean =>
  s.orderId === i.provider_order_id && s.merchantId === i.merchant_id && s.merchantId === merchantId &&
  parseGross(s.grossAmount) === BigInt(i.amount_idr) && s.currency === "IDR" && s.paymentType === "qris";

export const settlementAccepted = (s: ProviderStatus): boolean =>
  s.transactionStatus === "settlement" && s.statusCode === "200" && (s.fraudStatus === undefined || s.fraudStatus === "accept");

export async function verifyIntent(tx: Tx, deps: PaymentsDeps, intentId: string): Promise<JobResult> {
  const now = (deps.clock ?? (() => new Date()))();
  const pollAt = new Date(now.getTime() + deps.config.pollSeconds * 1000);
  const peek = (await tx.execute(sql`SELECT ${ICOLS} FROM payment_intents WHERE id = ${intentId}`)).rows[0] as unknown as IntentRow | undefined;
  if (!peek || TERMINAL.has(peek.status)) return { verdict: "noop" };

  // Throws ProviderError on timeout/outage/auth failure: the job retries with backoff and the intent stays pending.
  const status = await new MidtransClient(deps.config, deps.fetch).status(peek.provider_order_id);

  const intent = (await tx.execute(sql`SELECT ${ICOLS} FROM payment_intents WHERE id = ${intentId} FOR UPDATE`)).rows[0] as unknown as IntentRow;
  if (TERMINAL.has(intent.status)) return { verdict: "noop" }; // another worker won; never reverse a paid intent
  const within = now.getTime() < new Date(intent.expires_at).getTime() + LATE_GRACE_SECONDS * 1000;
  const keepPolling = (): JobResult => (within && intent.status !== "failed" ? { verdict: "pending", nextAt: pollAt } : { verdict: "pending" });

  if (!matches(status, intent, deps.config.merchantId)) return { ...keepPolling(), verdict: "mismatch" }; // never grants

  if (settlementAccepted(status)) return { verdict: await grant(tx, intent, now) };

  const ts = status.transactionStatus;
  if (ts === "expire" || ts === "cancel" || ts === "deny" || ts === "failure") {
    if (intent.status === "pending") {
      const to = ts === "expire" ? "expired" : "failed";
      await setStatus(tx, intent.id, to, now);
      return { verdict: to, ...(ts === "expire" && within ? { nextAt: pollAt } : {}) };
    }
    return keepPolling();
  }
  // pending (or any state we do not recognise, or settlement with a fraud flag): not value.
  if (intent.status === "pending" && now.getTime() >= new Date(intent.expires_at).getTime()) {
    await setStatus(tx, intent.id, "expired", now);
    return { verdict: "expired", nextAt: pollAt };
  }
  return keepPolling();
}

async function setStatus(tx: Tx, id: string, status: string, now: Date, settledAt?: Date): Promise<void> {
  await tx.execute(sql`UPDATE payment_intents SET status = ${status}, settled_at = ${settledAt ? settledAt.toISOString() : null}, revision = revision + 1 WHERE id = ${id}`);
  void now;
}

async function grant(tx: Tx, i: IntentRow, now: Date): Promise<Verdict> {
  const amount = BigInt(i.amount_idr);
  const station = (await tx.execute(sql`SELECT status, reserved_by, reserved_at FROM stations WHERE id = ${i.station_id} AND tenant_id = ${i.tenant_id} AND outlet_id = ${i.outlet_id} FOR SHARE`)).rows[0] as
    | { status: string; reserved_by: string | null; reserved_at: Date | null } | undefined;
  const stationHeld = !!station && station.status === "reserved" && station.reserved_by === i.station_reserved_by &&
    !!station.reserved_at && new Date(station.reserved_at).getTime() === new Date(i.station_reserved_at).getTime();
  const lateReason = i.status !== "pending" ? `intent_${i.status}` : !stationHeld ? "station_reassigned" : undefined;

  if (lateReason) {
    const lines: JournalLine[] = [
      { account: "provider_clearing", debitIdr: amount, creditIdr: 0n },
      { account: "refund_payable", debitIdr: 0n, creditIdr: amount },
    ];
    await postTransaction(tx, { tenantId: i.tenant_id, outletId: i.outlet_id, sourceEvent: `payment:${i.id}:late-settlement`, kind: "payment_late_settlement", actorId: null, lines, now });
    await tx.execute(sql`INSERT INTO refunds (id, tenant_id, outlet_id, intent_id, amount_idr, status, reason, created_at) VALUES (${crypto.randomUUID()}, ${i.tenant_id}, ${i.outlet_id}, ${i.id}, ${amount.toString()}, 'pending', ${lateReason}, ${now.toISOString()}) ON CONFLICT (intent_id) DO NOTHING`);
    await setStatus(tx, i.id, "refund_pending", now, now);
    return "refund_pending";
  }

  const quote = (await tx.execute(sql`SELECT amount_idr FROM quotes WHERE id = ${i.quote_id} AND tenant_id = ${i.tenant_id} AND outlet_id = ${i.outlet_id}`)).rows[0] as { amount_idr: string };
  const alloc = allocatePayment({ amountDueIdr: BigInt(quote.amount_idr), allocatedIdr: 0n, paymentIdr: amount });
  if (alloc.excessIdr !== 0n || alloc.allocatedIdr !== amount) throw new Error("intent amount does not equal the quote amount"); // impossible by construction; fail loud
  const lines: JournalLine[] = [
    { account: "provider_clearing", debitIdr: amount, creditIdr: 0n },
    { account: "sales_revenue", debitIdr: 0n, creditIdr: amount },
  ];
  const posted = await postTransaction(tx, { tenantId: i.tenant_id, outletId: i.outlet_id, sourceEvent: `payment:${i.id}:settlement`, kind: "payment_settlement", actorId: null, lines, now });
  await tx.execute(sql`
    INSERT INTO payment_allocations (id, tenant_id, outlet_id, intent_id, quote_id, amount_idr, ledger_transaction_id, created_at)
    VALUES (${crypto.randomUUID()}, ${i.tenant_id}, ${i.outlet_id}, ${i.id}, ${i.quote_id}, ${alloc.allocatedIdr.toString()}, ${posted.transactionId}, ${now.toISOString()}) ON CONFLICT (intent_id) DO NOTHING`);
  await setStatus(tx, i.id, "settled", now, now);
  return "settled";
}

