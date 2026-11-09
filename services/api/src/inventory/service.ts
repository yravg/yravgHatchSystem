// Contract: append-only stock events in the caller's transaction (T53, D17 moving average = SANDBOX FIXTURE).
// receive / consume / reverse each insert one stock_moves row and move stock_balances under a row lock. The source event
// is unique per tenant, so a retried or duplicated event is recognised (created = false) and never moves stock twice.
// The cost of a move is fixed when it happens and never recalculated. Stock can never go negative (domain + CHECK).
import { consumptionFor, DomainError, issueCost, receiveValue, type RecipeLine } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { Tx } from "../identity/db.ts";

export interface Ctx { tenantId: string; outletId: string; actorId: string | null; now: Date }

const lockBalance = async (tx: Tx, c: Ctx, stockItemId: string): Promise<{ onHand: bigint; valueIdr: bigint }> => {
  const r = (await tx.execute(sql`SELECT qty, value_idr FROM stock_balances WHERE stock_item_id = ${stockItemId} AND tenant_id = ${c.tenantId} AND outlet_id = ${c.outletId} FOR UPDATE`)).rows[0] as { qty: string; value_idr: string } | undefined;
  if (!r) throw new DomainError("NOT_FOUND"); // another tenant's or outlet's item looks like a missing one
  return { onHand: BigInt(r.qty), valueIdr: BigInt(r.value_idr) };
};

const setBalance = (tx: Tx, stockItemId: string, s: { onHand: bigint; valueIdr: bigint }) =>
  tx.execute(sql`UPDATE stock_balances SET qty = ${s.onHand.toString()}, value_idr = ${s.valueIdr.toString()} WHERE stock_item_id = ${stockItemId}`);

interface MoveIn { stockItemId: string; kind: "receipt" | "consume" | "reversal"; qtyDelta: bigint; costIdr: bigint; sourceEvent: string; reversalOf?: string; orderId?: string; reason?: string }

async function insertMove(tx: Tx, c: Ctx, m: MoveIn): Promise<string> {
  const id = crypto.randomUUID();
  await tx.execute(sql`
    INSERT INTO stock_moves (id, tenant_id, outlet_id, stock_item_id, kind, qty_delta, cost_idr, source_event, reversal_of, order_id, reason, actor_id, created_at)
    VALUES (${id}, ${c.tenantId}, ${c.outletId}, ${m.stockItemId}, ${m.kind}, ${m.qtyDelta.toString()}, ${m.costIdr.toString()}, ${m.sourceEvent}, ${m.reversalOf ?? null}, ${m.orderId ?? null}, ${m.reason ?? null}, ${c.actorId}, ${c.now.toISOString()})`);
  return id;
}

const seen = async (tx: Tx, c: Ctx, sourceEvent: string): Promise<string | undefined> =>
  ((await tx.execute(sql`SELECT id FROM stock_moves WHERE tenant_id = ${c.tenantId} AND source_event = ${sourceEvent}`)).rows[0] as { id: string } | undefined)?.id;

export async function receive(tx: Tx, c: Ctx, stockItemId: string, qty: bigint, totalCostIdr: bigint, sourceEvent: string): Promise<{ moveId: string; created: boolean }> {
  const cur = await lockBalance(tx, c, stockItemId);
  const dup = await seen(tx, c, sourceEvent);
  if (dup) return { moveId: dup, created: false };
  const next = receiveValue(cur, qty, totalCostIdr);
  const moveId = await insertMove(tx, c, { stockItemId, kind: "receipt", qtyDelta: qty, costIdr: totalCostIdr, sourceEvent });
  await setBalance(tx, stockItemId, next);
  return { moveId, created: true };
}

/** Consumes the recipe snapshot of every line of an order, once. Items are locked in id order so two orders never deadlock. */
export async function consumeForOrder(tx: Tx, c: Ctx & { orderId: string }): Promise<{ created: boolean }> {
  const lines = (await tx.execute(sql`
    SELECT l.qty, rl.stock_item_id, rl.qty_base
    FROM order_lines l JOIN recipe_lines rl ON rl.recipe_version_id = l.recipe_version_id
    WHERE l.order_id = ${c.orderId} AND l.tenant_id = ${c.tenantId} AND l.outlet_id = ${c.outletId}`)).rows as { qty: number; stock_item_id: string; qty_base: string }[];
  const need = new Map<string, bigint>();
  for (const l of lines) {
    const [one] = consumptionFor([{ stockItemId: l.stock_item_id, qtyBase: BigInt(l.qty_base) } satisfies RecipeLine], BigInt(l.qty));
    if (one) need.set(one.stockItemId, (need.get(one.stockItemId) ?? 0n) + one.qtyBase);
  }
  let created = false;
  for (const stockItemId of [...need.keys()].sort()) {
    const qty = need.get(stockItemId) as bigint;
    const cur = await lockBalance(tx, c, stockItemId);
    const sourceEvent = `order:${c.orderId}:consume:${stockItemId}`;
    if (await seen(tx, c, sourceEvent)) continue; // duplicate delivery: already consumed
    const issued = issueCost(cur, qty); // throws REVISION_CONFLICT negative_stock
    await insertMove(tx, c, { stockItemId, kind: "consume", qtyDelta: -qty, costIdr: issued.costIdr, sourceEvent, orderId: c.orderId });
    await setBalance(tx, stockItemId, { onHand: issued.onHand, valueIdr: issued.valueIdr });
    created = true;
  }
  return { created };
}

/** Reverses one receipt or consume exactly once (unique reversal_of + unique source event). */
export async function reverseMove(tx: Tx, c: Ctx, moveId: string, reason: string): Promise<{ moveId: string; created: boolean }> {
  const m = (await tx.execute(sql`SELECT id, stock_item_id, kind, qty_delta, cost_idr, order_id FROM stock_moves WHERE id = ${moveId} AND tenant_id = ${c.tenantId} AND outlet_id = ${c.outletId}`)).rows[0] as
    { id: string; stock_item_id: string; kind: string; qty_delta: string; cost_idr: string; order_id: string | null } | undefined;
  if (!m) throw new DomainError("NOT_FOUND");
  if (m.kind === "reversal") throw new DomainError("REVISION_CONFLICT", { reason: "already_a_reversal" });
  const cur = await lockBalance(tx, c, m.stock_item_id);
  const sourceEvent = `reversal:${m.id}`;
  const dup = await seen(tx, c, sourceEvent);
  if (dup) return { moveId: dup, created: false };
  const delta = -BigInt(m.qty_delta);
  const cost = BigInt(m.cost_idr);
  // receipt reversal removes qty and value, consume reversal restores both; the CHECK keeps either non-negative
  const next = { onHand: cur.onHand + delta, valueIdr: cur.valueIdr + (delta > 0n ? cost : -cost) };
  if (next.onHand < 0n || next.valueIdr < 0n) throw new DomainError("REVISION_CONFLICT", { reason: "negative_stock" });
  const id = await insertMove(tx, c, { stockItemId: m.stock_item_id, kind: "reversal", qtyDelta: delta, costIdr: cost, sourceEvent, reversalOf: m.id, reason, ...(m.order_id ? { orderId: m.order_id } : {}) });
  await setBalance(tx, m.stock_item_id, next);
  return { moveId: id, created: true };
}

/** Cancel: reverse every consume of the order that has no reversal yet. Returns how many moves were reversed. */
export async function reverseOrderConsumption(tx: Tx, c: Ctx, orderId: string): Promise<number> {
  const rows = (await tx.execute(sql`
    SELECT m.id FROM stock_moves m WHERE m.order_id = ${orderId} AND m.kind = 'consume' AND m.tenant_id = ${c.tenantId}
      AND NOT EXISTS (SELECT 1 FROM stock_moves r WHERE r.reversal_of = m.id) ORDER BY m.stock_item_id`)).rows as { id: string }[];
  let n = 0;
  for (const r of rows) if ((await reverseMove(tx, c, r.id, "order_cancelled")).created) n++;
  return n;
}
