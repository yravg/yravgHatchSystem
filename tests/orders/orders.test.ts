// T53 orders: attach to a T49 session or stand alone; payment through the T48 ledger (cash) or QRIS (sandbox mock only);
// refunds pending until proof. All money is a SANDBOX FIXTURE.
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { opsHarness, type OH } from "./support.ts";

describe("T53 orders", () => {
  let h: OH;
  beforeAll(async () => { h = await opsHarness(); });
  afterAll(async () => { await h.close(); });

  const placed = async (qty = 1) => {
    const f = await h.latte();
    const o = (await h.order(h.cashier, [{ menuItemId: f.menu, qty }])).json["data"];
    const reg = await h.register(`k-${randomUUID().slice(0, 8)}`);
    const shift = await h.openShift(h.cashier, reg);
    return { ...f, o, reg, shift };
  };

  it("an order attaches to a session of its outlet and also stands alone", async () => {
    const { menu } = await h.latte();
    const sid = await h.seedSession("ACTIVE");
    const before = await h.q("SELECT state, revision FROM sessions WHERE id = $1", [sid]);
    const a = await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }], { sessionId: sid });
    expect(a.status).toBe(200);
    expect(a.json["data"].sessionId).toBe(sid);
    expect((await h.get(h.cashier, `/orders/${a.json["data"].orderId}`)).json["data"].sessionId).toBe(sid);
    expect(await h.q("SELECT state, revision FROM sessions WHERE id = $1", [sid])).toEqual(before); // lineage only, the session is untouched
    const b = await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }]);
    expect(b.json["data"].sessionId).toBeNull();
    expect(b.json["data"].totalIdr).toBe("20000");
  });

  it("a session of another outlet or tenant is NOT_FOUND and no stock is consumed", async () => {
    const { milk, menu } = await h.latte();
    const other = await h.seedSession("ACTIVE", h.world.outletA2);
    const otherTenant = await h.seedSession("ACTIVE", h.world.outletB1, h.world.tenantB);
    expect((await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }], { sessionId: other })).status).toBe(404);
    expect((await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }], { sessionId: otherTenant })).status).toBe(404);
    expect(await h.onHand(milk)).toBe("1000");
  });

  it("a cash payment posts cash and revenue once, tracks change, and a second payment is refused", async () => {
    const { o, shift } = await placed();
    const b0 = await h.bal();
    const key = randomUUID();
    const pay = (k?: string) => h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "50000", shiftId: shift }, k);
    const a = await pay(key);
    expect(a.status).toBe(200);
    expect(a.json["data"]).toMatchObject({ method: "cash", status: "settled", amountIdr: "20000", tenderIdr: "50000", changeIdr: "30000" });
    expect((await pay(key)).json["data"].paymentId).toBe(a.json["data"].paymentId); // replay
    expect((await pay()).status).toBe(409); // different key, already paid
    const b1 = await h.bal();
    expect((b1["cash"] ?? 0) - (b0["cash"] ?? 0)).toBe(20000);
    expect((b1["sales_revenue"] ?? 0) - (b0["sales_revenue"] ?? 0)).toBe(20000);
    expect(await h.count("SELECT count(*) n FROM ledger_transactions WHERE source_event = $1", [`order-payment:${a.json["data"].paymentId}`])).toBe(1);
    expect((await h.get(h.cashier, `/orders/${o.orderId}`)).json["data"].paymentStatus).toBe("paid");
  });

  it("a tender below the total is refused and a payment needs the actor's own open shift", async () => {
    const { o, reg, shift } = await placed();
    expect((await h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "19999", shiftId: shift })).status).toBe(409);
    const mgrShift = await h.openShift(h.manager, reg);
    const r = await h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "20000", shiftId: mgrShift });
    expect(r.status).toBe(403); // someone else's shift
    expect((await h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "20000", shiftId: randomUUID() })).status).toBe(404);
    await h.ok(h.post(h.cashier, `/shifts/${shift}/close`, { actualCashIdr: "100000" }));
    const closed = await h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "20000", shiftId: shift });
    expect(closed.status).toBe(409);
    expect(closed.json["error"].code).toBe("SHIFT_NOT_OPEN");
  });

  it("QRIS stays pending with the provider QR and grants nothing until a verified status", async () => {
    const { o, shift } = await placed();
    const b0 = await h.bal(); const t0 = await h.count("SELECT count(*) n FROM ledger_transactions");
    const p = (await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "qris", shiftId: shift })));
    expect(p).toMatchObject({ method: "qris", status: "pending", amountIdr: "20000" });
    expect(p["qrString"]).toContain("FIXTURE-QR");
    const verify = () => h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments/${p["paymentId"]}/verify`, {}));
    expect((await verify())["status"]).toBe("pending"); // the provider still says pending
    expect(await h.count("SELECT count(*) n FROM ledger_transactions")).toBe(t0);
    h.mock.settle(p["providerOrderId"]);
    expect((await verify())["status"]).toBe("settled");
    expect((await verify())["status"]).toBe("settled"); // a second verify is a no-op
    const b1 = await h.bal();
    expect((b1["provider_clearing"] ?? 0) - (b0["provider_clearing"] ?? 0)).toBe(20000);
    expect((b1["cash"] ?? 0) - (b0["cash"] ?? 0)).toBe(0); // QRIS never touches cash
    expect(await h.count("SELECT count(*) n FROM ledger_transactions")).toBe(t0 + 1);
  });

  it("a settlement with the wrong amount or merchant never grants value", async () => {
    for (const patch of [{ grossAmount: "1.00" }, { merchantId: "G000OTHER" }, { currency: "USD" }, { fraud: "challenge" }]) {
      const { o, shift } = await placed();
      const p = await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "qris", shiftId: shift }));
      h.mock.settle(p["providerOrderId"], patch);
      const t0 = await h.count("SELECT count(*) n FROM ledger_transactions");
      const v = await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments/${p["paymentId"]}/verify`, {}));
      expect(v["status"]).toBe("pending");
      expect(await h.count("SELECT count(*) n FROM ledger_transactions")).toBe(t0);
    }
  });

  it("a provider outage during the QRIS charge creates no payment and is retryable", async () => {
    const { o, shift } = await placed();
    h.mock.mode = "down";
    const r = await h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "qris", shiftId: shift });
    h.mock.mode = "ok";
    expect(r.status).toBe(503);
    expect(r.json["error"].retryable).toBe(true);
    expect(await h.count("SELECT count(*) n FROM order_payments WHERE order_id = $1", [o.orderId])).toBe(0);
  });

  it("QRIS is refused when payments are not configured", async () => {
    const h2 = await opsHarness({ payments: false });
    try {
      const { menu } = await h2.latte();
      const o = (await h2.order(h2.cashier, [{ menuItemId: menu, qty: 1 }])).json["data"];
      const shift = await h2.openShift(h2.cashier, await h2.register());
      const r = await h2.post(h2.cashier, `/orders/${o.orderId}/payments`, { method: "qris", shiftId: shift });
      expect(r.status).toBe(409);
      expect(r.json["error"].code).toBe("PAYMENTS_NOT_CONFIGURED");
    } finally { await h2.close(); }
  });

  it("a cash order captured offline is refused (CONTRACTS section 5: offline sale default refused)", async () => {
    const { milk, menu } = await h.latte();
    const r = await h.order(h.cashier, [{ menuItemId: menu, qty: 1 }], { offline: true });
    expect(r.status).toBe(409);
    expect(r.json["error"].code).toBe("OFFLINE_NOT_ALLOWED");
    expect(await h.onHand(milk)).toBe("1000");
  });

  it("a refund stays pending until proof, posts through refund_payable, and proof pays out once", async () => {
    const { o, reg, shift } = await placed();
    const pay = await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "20000", shiftId: shift }));
    const mgrShift = await h.openShift(h.manager, reg);
    const b0 = await h.bal();
    const body = { paymentId: pay["paymentId"], reason: "pelanggan batal" };
    expect((await h.post(h.cashier, `/orders/${o.orderId}/refunds`, body)).status).toBe(403);
    h.clock.advance(400); // the step-up from enrolment (TTL 300 s fixture) has lapsed
    const noStep = await h.post(h.manager, `/orders/${o.orderId}/refunds`, body);
    expect(noStep.status).toBe(403);
    expect(noStep.json["error"].code).toBe("STEP_UP_REQUIRED");
    await h.stepUp(h.manager);
    const refund = await h.ok(h.post(h.manager, `/orders/${o.orderId}/refunds`, body));
    expect(refund).toMatchObject({ status: "pending", amountIdr: "20000" });
    const b1 = await h.bal();
    expect((b1["refund_payable"] ?? 0) - (b0["refund_payable"] ?? 0)).toBe(20000);
    expect((b1["cash"] ?? 0) - (b0["cash"] ?? 0)).toBe(0); // nothing has left the drawer yet
    expect((await h.post(h.manager, `/orders/${o.orderId}/refunds`, body)).status).toBe(409); // one refund per payment
    expect((await h.get(h.cashier, `/orders/${o.orderId}`)).json["data"].paymentStatus).toBe("refund_pending");
    const proof = (k?: string) => h.post(h.manager, `/order-refunds/${refund["refundId"]}/proof`, { proofRef: "kwitisi-001", shiftId: mgrShift }, k);
    const done = await proof();
    expect(done.status).toBe(200);
    expect(done.json["data"].status).toBe("refunded");
    expect((await proof()).status).toBe(409);
    const b2 = await h.bal();
    expect((b2["cash"] ?? 0) - (b0["cash"] ?? 0)).toBe(-20000);
    expect((b2["refund_payable"] ?? 0) - (b0["refund_payable"] ?? 0)).toBe(0);
  });

  it("a paid order cannot be cancelled and an order of another outlet is NOT_FOUND", async () => {
    const { o, shift, milk } = await placed();
    await h.ok(h.post(h.cashier, `/orders/${o.orderId}/payments`, { method: "cash", tenderIdr: "20000", shiftId: shift }));
    const r = await h.post(h.cashier, `/orders/${o.orderId}/cancel`, { reason: "x" });
    expect(r.status).toBe(409);
    expect(await h.onHand(milk)).toBe("900");
    expect((await h.get(h.cashierA2, `/orders/${o.orderId}`)).status).toBe(404);
    expect((await h.get(h.ownerB, `/orders/${o.orderId}`)).status).toBe(404);
  });
});
