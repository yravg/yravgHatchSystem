// T53 inventory: recipes, append-only stock moves, moving-average cost (D17 FIXTURE, not approved), order consumption.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { connect } from "../../services/api/src/identity/db.ts";
import { consumeForOrder } from "../../services/api/src/inventory/service.ts";
import { opsHarness, type OH, call, P, as } from "../orders/support.ts";

describe("T53 inventory", () => {
  let h: OH;
  beforeAll(async () => { h = await opsHarness(); });
  afterAll(async () => { await h.close(); });

  it("two drinks of a 100 ml recipe consume 200 ml exactly once", async () => {
    const { milk, menu } = await h.latte();
    const r = await h.order(h.cashier, [{ menuItemId: menu, qty: 2 }]);
    expect(r.status).toBe(200);
    expect(await h.onHand(milk)).toBe("800");
    expect(await h.count("SELECT count(*) n FROM stock_moves WHERE stock_item_id = $1 AND kind = 'consume'", [milk])).toBe(1);
    const sum = await h.q<{ s: string }>("SELECT sum(qty_delta)::text s FROM stock_moves WHERE stock_item_id = $1 AND kind = 'consume'", [milk]);
    expect(sum[0]?.s).toBe("-200");
  });

  it("a retry with the same Idempotency-Key replays the order and consumes once", async () => {
    const { milk, menu } = await h.latte();
    const key = randomUUID();
    const a = await h.order(h.cashier, [{ menuItemId: menu, qty: 2 }], {}, key);
    const b = await h.order(h.cashier, [{ menuItemId: menu, qty: 2 }], {}, key);
    expect(a.status).toBe(200); expect(b.status).toBe(200);
    expect(b.json["data"].orderId).toBe(a.json["data"].orderId);
    expect(await h.onHand(milk)).toBe("800");
    const c = await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }], {}, key); // same key, different payload
    expect(c.status).toBe(409);
    expect(await h.onHand(milk)).toBe("800");
  });

  it("a duplicate consume event for the same order is ignored by the unique source event", async () => {
    const { milk, menu } = await h.latte();
    const o = (await h.order(h.cashier, [{ menuItemId: menu, qty: 2 }])).json["data"];
    const again = await connect(h.pool).transaction((tx) => consumeForOrder(tx, { tenantId: h.world.tenantA, outletId: h.world.outletA1, orderId: o.orderId, actorId: h.world.cashierA, now: h.clock.read() }));
    expect(again.created).toBe(false); // replaying the consume for the same order (duplicate delivery) is a no-op
    expect(await h.onHand(milk)).toBe("800");
  });

  it("stock moves are append-only: update and delete are refused by the database", async () => {
    const { milk } = await h.latte();
    await expect(h.pool.query("UPDATE stock_moves SET qty_delta = 1 WHERE stock_item_id = $1", [milk])).rejects.toThrow(/append-only/);
    await expect(h.pool.query("DELETE FROM stock_moves WHERE stock_item_id = $1", [milk])).rejects.toThrow(/append-only/);
  });

  it("cancelling an order reverses its consumption exactly once", async () => {
    const { milk, menu } = await h.latte();
    const o = (await h.order(h.cashier, [{ menuItemId: menu, qty: 2 }])).json["data"];
    expect((await h.post(h.cashier, `/orders/${o.orderId}/cancel`, { reason: "salah pesan" })).status).toBe(200);
    expect(await h.onHand(milk)).toBe("1000");
    const again = await h.post(h.cashier, `/orders/${o.orderId}/cancel`, { reason: "lagi" });
    expect(again.status).toBe(409);
    expect(await h.onHand(milk)).toBe("1000");
    expect(await h.count("SELECT count(*) n FROM stock_moves WHERE stock_item_id = $1 AND kind = 'reversal'", [milk])).toBe(1);
  });

  it("a manual reversal of a receipt is allowed once; a reversal cannot be reversed; no history is deleted", async () => {
    const milk = (await h.ok(h.post(h.owner, "/stock-items", { name: `susu-${randomUUID()}`, baseUom: "ml" })))["stockItemId"] as string;
    const rec = await h.ok(h.post(h.owner, `/stock-items/${milk}/receipts`, { qty: "500", totalCostIdr: "2000" }));
    expect((await h.post(h.owner, `/stock-moves/${rec["moveId"]}/reversal`, { reason: "salah input" })).status).toBe(200);
    expect(await h.onHand(milk)).toBe("0");
    expect((await h.post(h.owner, `/stock-moves/${rec["moveId"]}/reversal`, { reason: "lagi" })).status).toBe(409);
    const moves = await h.ok(h.get(h.owner, `/stock-items/${milk}/moves`));
    expect(moves["moves"].map((m: { kind: string }) => m.kind)).toEqual(["receipt", "reversal"]);
    const rev = moves["moves"][1];
    expect((await h.post(h.owner, `/stock-moves/${rev.moveId}/reversal`, { reason: "balik" })).status).toBe(409);
  });

  it("consumption beyond stock on hand is refused, nothing is written, no negative balance", async () => {
    const milk = await h.stockItem(`susu-${randomUUID()}`, "150", "600");
    const menu = await h.menuItem(`latte-${randomUUID()}`, "20000", [{ stockItemId: milk, qty: "100" }]);
    expect((await h.order(h.cashier, [{ menuItemId: menu, qty: 2 }])).status).toBe(409);
    expect(await h.onHand(milk)).toBe("150");
    expect(await h.count("SELECT count(*) n FROM orders o JOIN order_lines l ON l.order_id = o.id WHERE l.menu_item_id = $1", [menu])).toBe(0);
    await expect(h.pool.query("UPDATE stock_balances SET qty = -1 WHERE stock_item_id = $1", [milk])).rejects.toThrow();
  });

  it("moving average prices a drink from the running average and never recalculates history", async () => {
    const milk = await h.stockItem(`susu-${randomUUID()}`, "1000", "2000"); // Rp2 per ml
    const menu = await h.menuItem(`latte-${randomUUID()}`, "20000", [{ stockItemId: milk, qty: "100" }]);
    await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }]); // 100 ml at Rp2 = Rp200
    await h.ok(h.post(h.owner, `/stock-items/${milk}/receipts`, { qty: "900", totalCostIdr: "7200" })); // now 900 ml / Rp1800 + 900 ml / Rp7200 => Rp5 per ml
    await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }]); // 100 ml at Rp5 = Rp500
    const moves = (await h.ok(h.get(h.owner, `/stock-items/${milk}/moves`)))["moves"].filter((m: { kind: string }) => m.kind === "consume");
    expect(moves.map((m: { costIdr: string }) => m.costIdr)).toEqual(["200", "500"]);
    const first = await h.q<{ cost_idr: string }>("SELECT cost_idr FROM stock_moves WHERE stock_item_id = $1 AND kind = 'consume' ORDER BY seq LIMIT 1", [milk]);
    expect(first[0]?.cost_idr).toBe("200"); // the first move still carries the cost it had when it happened
  });

  it("cost is never shown to customer-facing or cashier views", async () => {
    const { milk, menu } = await h.latte();
    const list = await h.get(h.cashier, "/menu-items");
    expect(list.status).toBe(200);
    expect(JSON.stringify(list.json)).not.toMatch(/cost|value/i);
    expect(JSON.stringify(list.json)).toContain(menu);
    const item = await h.get(h.cashier, `/stock-items/${milk}`);
    expect(item.status).toBe(200);
    expect(JSON.stringify(item.json)).not.toMatch(/cost|value/i);
    const o = (await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }])).json["data"];
    expect(JSON.stringify(o)).not.toMatch(/cost/i);
    expect(JSON.stringify((await h.get(h.owner, `/stock-items/${milk}`)).json)).toMatch(/valueIdr/); // managers see it
  });

  it("a new recipe version never changes what an existing order consumed", async () => {
    const { milk, menu } = await h.latte();
    const o = (await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }])).json["data"];
    await h.ok(h.post(h.owner, `/menu-items/${menu}/recipes`, { recipe: [{ stockItemId: milk, qty: "250" }] }));
    expect((await h.post(h.cashier, `/orders/${o.orderId}/cancel`, { reason: "batal" })).status).toBe(200);
    expect(await h.onHand(milk)).toBe("1000"); // 100 ml restored, not 250
    await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }]);
    expect(await h.onHand(milk)).toBe("750"); // the new version applies to new orders only
  });

  it("cross-tenant and cross-outlet stock items are NOT_FOUND, and a cashier cannot manage stock", async () => {
    const { milk, menu } = await h.latte();
    expect((await h.get(h.ownerB, `/stock-items/${milk}`)).status).toBe(404);
    expect((await h.post(h.ownerB, `/stock-items/${milk}/receipts`, { qty: "1", totalCostIdr: "1" })).status).toBe(404);
    expect((await h.order(h.cashierA2, [{ menuItemId: menu, qty: 1 }])).status).toBe(404);
    expect((await h.post(h.cashier, "/stock-items", { name: "x", baseUom: "ml" })).status).toBe(403);
    expect((await call(h.app, "POST", `${P}/orders`, { body: { lines: [] } })).status).toBeGreaterThanOrEqual(400);
    expect((await call(h.app, "POST", `${P}/orders`, { ...as(h.cashier), body: { tenantId: h.world.tenantB, lines: [{ menuItemId: menu, qty: 1 }] } })).status).toBe(400); // tenant from the session only
  });
});
