// Contract: tenant/outlet scoped inventory + menu API. tenantId and outletId come from the session, never the body.
// Quantities are integer base units (decimal string in JSON), money is a decimal string. Cost (value, per-move cost) is only
// returned to holders of stock.manage: cashiers, kitchen and customers never see it (D17: cost never shown to customers).
import { DomainError, idrToJson, parseIdr } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { IdentityDeps, Principal } from "../identity/service.ts";
import type { Tx } from "../identity/db.ts";
import { idParam, makeHttp, parse, req_, text, uuid, type Rule } from "../rates/http.ts";
import { receive, reverseMove } from "./service.ts";

const MAX_QTY = 1_000_000_000_000n; // ASSUMPTION: sandbox ceiling
const qty: Rule = (v) => (typeof v === "string" && /^[1-9][0-9]{0,12}$/.test(v) && BigInt(v) <= MAX_QTY ? v : undefined);
const money: Rule = (v) => { try { return parseIdr(v) <= 1_000_000_000_000n ? v : undefined; } catch { return undefined; } };
const uom: Rule = (v) => (v === "ml" || v === "g" || v === "pcs" ? v : undefined);
const recipeRule: Rule = (v) => {
  if (!Array.isArray(v) || v.length > 20) return undefined;
  v.forEach((l) => parse(l, { stockItemId: req_(uuid), qty: req_(qty) }));
  return v;
};
const canSeeCost = (p: Principal): boolean => p.permissions.has("stock.manage");
const pgCode = (e: unknown): string | undefined => (e as { cause?: { code?: string }; code?: string }).cause?.code ?? (e as { code?: string }).code;

export function registerInventory(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1";
  const ctx = (p: Principal) => ({ tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, now: http.now() });

  app.post(`${P}/stock-items`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.manage" });
    const b = parse<{ name: string; baseUom: string }>(req.body, { name: req_(text(1, 80)), baseUom: req_(uom) });
    return http.mutate(req, p, b, async (tx) => {
      const id = crypto.randomUUID();
      const r = await tx.execute(sql`INSERT INTO stock_items (id, tenant_id, outlet_id, name, base_uom, created_by, created_at) VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.name}, ${b.baseUom}, ${p.staffId}, ${http.now().toISOString()}) ON CONFLICT (tenant_id, outlet_id, name) DO NOTHING RETURNING id`);
      if (r.rows.length === 0) throw new DomainError("REVISION_CONFLICT", { reason: "name_taken" });
      await tx.execute(sql`INSERT INTO stock_balances (stock_item_id, tenant_id, outlet_id) VALUES (${id}, ${p.tenantId}, ${p.outletId})`);
      return { data: { stockItemId: id, name: b.name, baseUom: b.baseUom }, revision: 1 };
    });
  });

  app.post(`${P}/stock-items/:stockItemId/receipts`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.manage" });
    const id = idParam(req, "stockItemId");
    const b = parse<{ qty: string; totalCostIdr: string }>(req.body, { qty: req_(qty), totalCostIdr: req_(money) });
    return http.mutate(req, p, b, async (tx) => {
      const r = await receive(tx, ctx(p), id, BigInt(b.qty), parseIdr(b.totalCostIdr), `receipt:${crypto.randomUUID()}`);
      return { data: { moveId: r.moveId, kind: "receipt", qtyDelta: b.qty }, revision: 1 };
    });
  });

  app.get(`${P}/stock-items/:stockItemId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.read" });
    const row = (await http.db.execute(sql`
      SELECT i.id, i.name, i.base_uom, b.qty, b.value_idr FROM stock_items i JOIN stock_balances b ON b.stock_item_id = i.id
      WHERE i.id = ${idParam(req, "stockItemId")} AND i.tenant_id = ${p.tenantId} AND i.outlet_id = ${p.outletId}`)).rows[0] as { id: string; name: string; base_uom: string; qty: string; value_idr: string } | undefined;
    if (!row) throw new DomainError("NOT_FOUND");
    return http.send(req, { stockItemId: row.id, name: row.name, baseUom: row.base_uom, onHand: String(row.qty), ...(canSeeCost(p) ? { valueIdr: idrToJson(BigInt(row.value_idr)) } : {}) });
  });

  app.get(`${P}/stock-items/:stockItemId/moves`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.read" });
    const id = idParam(req, "stockItemId");
    const owns = (await http.db.execute(sql`SELECT 1 FROM stock_items WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows.length;
    if (!owns) throw new DomainError("NOT_FOUND");
    const rows = (await http.db.execute(sql`
      SELECT id, kind, qty_delta, cost_idr, reversal_of, order_id, reason, created_at FROM stock_moves
      WHERE stock_item_id = ${id} AND tenant_id = ${p.tenantId} ORDER BY seq LIMIT 200`)).rows as
      { id: string; kind: string; qty_delta: string; cost_idr: string; reversal_of: string | null; order_id: string | null; reason: string | null; created_at: Date }[];
    return http.send(req, { moves: rows.map((m) => ({
      moveId: m.id, kind: m.kind, qtyDelta: String(m.qty_delta), reversalOf: m.reversal_of, orderId: m.order_id, reason: m.reason, createdAt: new Date(m.created_at).toISOString(),
      ...(canSeeCost(p) ? { costIdr: idrToJson(BigInt(m.cost_idr)) } : {}),
    })) });
  });

  app.post(`${P}/stock-moves/:moveId/reversal`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.manage" });
    const id = idParam(req, "moveId");
    const b = parse<{ reason: string }>(req.body, { reason: req_(text(1, 200)) });
    return http.mutate(req, p, b, async (tx) => {
      const r = await reverseMove(tx, ctx(p), id, b.reason);
      if (!r.created) throw new DomainError("REVISION_CONFLICT", { reason: "already_reversed" });
      return { data: { moveId: r.moveId, kind: "reversal", reversalOf: id }, revision: 1 };
    });
  });

  const recipeLines = async (tx: Tx, p: Principal, versionId: string, recipe: { stockItemId: string; qty: string }[]): Promise<void> => {
    const seenItems = new Set<string>();
    for (const l of recipe) {
      if (seenItems.has(l.stockItemId)) throw new DomainError("VALIDATION_FAILED", { field: "recipe" });
      seenItems.add(l.stockItemId);
      const own = (await tx.execute(sql`SELECT 1 FROM stock_items WHERE id = ${l.stockItemId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows.length;
      if (!own) throw new DomainError("NOT_FOUND");
      await tx.execute(sql`INSERT INTO recipe_lines (recipe_version_id, stock_item_id, qty_base) VALUES (${versionId}, ${l.stockItemId}, ${l.qty})`);
    }
  };

  app.post(`${P}/menu-items`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.manage" });
    const b = parse<{ name: string; priceIdr: string; recipe: { stockItemId: string; qty: string }[] }>(req.body, { name: req_(text(1, 80)), priceIdr: req_(money), recipe: req_(recipeRule) });
    return http.mutate(req, p, b, async (tx) => {
      const id = crypto.randomUUID();
      const now = http.now().toISOString();
      const r = await tx.execute(sql`INSERT INTO menu_items (id, tenant_id, outlet_id, name, price_idr, created_by, created_at) VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.name}, ${parseIdr(b.priceIdr).toString()}, ${p.staffId}, ${now}) ON CONFLICT (tenant_id, outlet_id, name) DO NOTHING RETURNING id`);
      if (r.rows.length === 0) throw new DomainError("REVISION_CONFLICT", { reason: "name_taken" });
      const v = crypto.randomUUID();
      await tx.execute(sql`INSERT INTO recipe_versions (id, tenant_id, outlet_id, menu_item_id, version, created_by, created_at) VALUES (${v}, ${p.tenantId}, ${p.outletId}, ${id}, 1, ${p.staffId}, ${now})`);
      await recipeLines(tx, p, v, b.recipe);
      return { data: { menuItemId: id, name: b.name, priceIdr: b.priceIdr, recipeVersion: 1 }, revision: 1 };
    });
  });

  app.post(`${P}/menu-items/:menuItemId/recipes`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.manage" });
    const id = idParam(req, "menuItemId");
    const b = parse<{ recipe: { stockItemId: string; qty: string }[] }>(req.body, { recipe: req_(recipeRule) });
    return http.mutate(req, p, b, async (tx) => {
      const m = (await tx.execute(sql`SELECT id FROM menu_items WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0];
      if (!m) throw new DomainError("NOT_FOUND");
      const next = Number(((await tx.execute(sql`SELECT coalesce(max(version), 0) + 1 AS v FROM recipe_versions WHERE menu_item_id = ${id}`)).rows[0] as { v: string }).v);
      const v = crypto.randomUUID();
      try {
        await tx.execute(sql`INSERT INTO recipe_versions (id, tenant_id, outlet_id, menu_item_id, version, created_by, created_at) VALUES (${v}, ${p.tenantId}, ${p.outletId}, ${id}, ${next}, ${p.staffId}, ${http.now().toISOString()})`);
      } catch (e) { if (pgCode(e) === "23505") throw new DomainError("REVISION_CONFLICT", { reason: "recipe_version_race" }); throw e; }
      await recipeLines(tx, p, v, b.recipe);
      return { data: { menuItemId: id, recipeVersion: next }, revision: next };
    });
  });

  // Customer/cashier-safe view: price and availability, never cost.
  app.get(`${P}/menu-items`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "stock.read" });
    const rows = (await http.db.execute(sql`
      SELECT m.id, m.name, m.price_idr, m.active, (SELECT max(version) FROM recipe_versions r WHERE r.menu_item_id = m.id) AS recipe_version
      FROM menu_items m WHERE m.tenant_id = ${p.tenantId} AND m.outlet_id = ${p.outletId} ORDER BY m.name, m.id LIMIT 200`)).rows as { id: string; name: string; price_idr: string; active: boolean; recipe_version: number | null }[];
    return http.send(req, { items: rows.map((m) => ({ menuItemId: m.id, name: m.name, priceIdr: idrToJson(BigInt(m.price_idr)), active: m.active, recipeVersion: m.recipe_version })) });
  });
}
