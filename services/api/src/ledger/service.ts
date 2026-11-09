// Contract: append-only double-entry posting. One call inserts the transaction, its lines and the balance deltas in the
// caller's transaction. The source event is unique per tenant, so a replay is recognised (created = false), never
// double posted. The database re-checks balance, immutability and non-negative balances (migration 0003).
import { assertBalanced, balanceDelta, DomainError, type JournalLine } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { Tx } from "../identity/db.ts";

export type LedgerKind = "manual" | "reversal" | "payment_settlement" | "payment_late_settlement" | "order_sale" | "order_refund" | "order_refund_paid";

export interface PostInput {
  tenantId: string;
  outletId: string;
  sourceEvent: string;
  kind: LedgerKind;
  reversalOf?: string;
  reason?: string;
  actorId: string | null;
  lines: readonly JournalLine[];
  now: Date;
}

const pgCode = (e: unknown): string | undefined => {
  const o = e as { code?: string; cause?: { code?: string } };
  return o.cause?.code ?? o.code;
};

export async function postTransaction(tx: Tx, i: PostInput): Promise<{ transactionId: string; created: boolean }> {
  assertBalanced(i.lines);
  const id = crypto.randomUUID();
  const ins = await tx.execute(sql`
    INSERT INTO ledger_transactions (id, tenant_id, outlet_id, source_event, kind, reversal_of, reason, actor_id, created_at)
    VALUES (${id}, ${i.tenantId}, ${i.outletId}, ${i.sourceEvent}, ${i.kind}, ${i.reversalOf ?? null}, ${i.reason ?? null}, ${i.actorId}, ${i.now.toISOString()})
    ON CONFLICT (tenant_id, source_event) DO NOTHING RETURNING id`);
  if (ins.rows.length === 0) {
    const seen = (await tx.execute(sql`SELECT id FROM ledger_transactions WHERE tenant_id = ${i.tenantId} AND source_event = ${i.sourceEvent}`)).rows[0] as { id: string };
    return { transactionId: seen.id, created: false };
  }
  let seq = 0;
  for (const l of i.lines) {
    await tx.execute(sql`
      INSERT INTO ledger_entries (id, transaction_id, tenant_id, outlet_id, seq, account, debit_idr, credit_idr)
      VALUES (${crypto.randomUUID()}, ${id}, ${i.tenantId}, ${i.outletId}, ${++seq}, ${l.account}, ${l.debitIdr.toString()}, ${l.creditIdr.toString()})`);
  }
  // Net per account, applied in account order so two postings never lock in opposite orders.
  const net = new Map<string, bigint>();
  for (const l of i.lines) net.set(l.account, (net.get(l.account) ?? 0n) + balanceDelta(l));
  for (const account of [...net.keys()].sort()) {
    const delta = net.get(account) as bigint;
    await tx.execute(sql`INSERT INTO ledger_balances (tenant_id, outlet_id, account, balance) VALUES (${i.tenantId}, ${i.outletId}, ${account}, 0) ON CONFLICT DO NOTHING`);
    try {
      await tx.execute(sql`UPDATE ledger_balances SET balance = balance + ${delta.toString()} WHERE tenant_id = ${i.tenantId} AND outlet_id = ${i.outletId} AND account = ${account}`);
    } catch (e) {
      if (pgCode(e) === "23514") throw new DomainError("REVISION_CONFLICT", { reason: "negative_balance", account });
      throw e;
    }
  }
  return { transactionId: id, created: true };
}

export interface TxnRow { id: string; source_event: string; kind: string; reversal_of: string | null; reason: string | null; created_at: Date }
export interface EntryRow { account: string; debit_idr: string; credit_idr: string }

export async function loadTransaction(q: Pick<Tx, "execute">, tenantId: string, outletId: string, id: string): Promise<{ txn: TxnRow; lines: JournalLine[] } | undefined> {
  const txn = (await q.execute(sql`SELECT id, source_event, kind, reversal_of, reason, created_at FROM ledger_transactions WHERE id = ${id} AND tenant_id = ${tenantId} AND outlet_id = ${outletId}`)).rows[0] as TxnRow | undefined;
  if (!txn) return undefined;
  const rows = (await q.execute(sql`SELECT account, debit_idr, credit_idr FROM ledger_entries WHERE transaction_id = ${id} ORDER BY seq`)).rows as unknown as EntryRow[];
  return { txn, lines: rows.map((r) => ({ account: r.account, debitIdr: BigInt(r.debit_idr), creditIdr: BigInt(r.credit_idr) })) };
}
