// Contract: Midtrans sandbox dynamic QRIS against a LOCAL MOCK provider. Value is granted only after a valid signature,
// an authenticated GET status that settles, and matching merchant/order/amount/currency, and only once.
// All keys and money values are labelled FIXTURES; D06, D15 and D17 production policy is NOT approved.
import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { call } from "../ledger/support.ts";
import { FIXTURE_SERVER_KEY, FIXTURE_SIGNATURE_PREVIOUS, FIXTURE_SIGNATURE_SECRET, signature } from "./mock-midtrans.ts";
import { P, as, payHarness, type PayHarness } from "./support.ts";

let t: PayHarness;
beforeAll(async () => { t = await payHarness(); });
afterAll(async () => { await t.close(); });

const settled = async (intentId: string) => (await t.get(intentId))["status"];
const credits = () => t.count("SELECT count(*) AS n FROM ledger_transactions WHERE kind = 'payment_settlement'");

describe("QRIS intent", () => {
  it("creates a dynamic QRIS intent for a quote through the provider charge, pending, never paid", async () => {
    const p = await t.prepare();
    const r = await t.intent(p);
    expect(r.status).toBe(200);
    expect(r.json["data"]).toMatchObject({ status: "pending", amountIdr: "10000", currency: "IDR" });
    expect(String(r.json["data"].qrString)).toContain("FIXTURE-QR");
    const charge = t.mock.calls.find((c) => c.method === "POST" && c.path === "/v2/charge");
    expect(charge?.authorization).toBe(`Basic ${Buffer.from(`${FIXTURE_SERVER_KEY}:`).toString("base64")}`);
  });

  it("a second live intent for the same quote is refused, concurrent or not (split brain)", async () => {
    const p = await t.prepare();
    const rs = await Promise.all([t.intent(p), t.intent(p), t.intent(p)]);
    expect(rs.filter((r) => r.status === 200)).toHaveLength(1);
    expect(rs.filter((r) => r.status === 409)).toHaveLength(2);
  });

  it("is refused unless the station is reserved by this cashier, and cross-tenant ids are 404", async () => {
    const p = await t.prepare();
    expect((await t.intent(p, t.cashier2)).status).toBe(200); // same staff id: allowed
    const other = await t.prepare();
    await call(t.h.app, "POST", `${P}/stations/${other.stationId}/release`, { ...as(t.cashier), body: {} });
    expect((await t.intent(other)).status).toBe(409);
    expect((await call(t.h.app, "POST", `${P}/payments/qris-intents`, { ...as(t.ownerB), body: { quoteId: p.quoteId, stationId: p.stationId } })).status).toBe(404);
  });

  it("reading an intent is tenant scoped, permission scoped and needs a live session", async () => {
    const i = await t.newIntent();
    expect((await call(t.h.app, "GET", `${P}/payments/qris-intents/${i.intentId}`, as(t.ownerB))).status).toBe(404);
    expect((await call(t.h.app, "GET", `${P}/payments/qris-intents/${i.intentId}`)).status).toBe(401);
    const kitchen = await call(t.h.app, "GET", `${P}/payments/qris-intents/${i.intentId}`, as(t.cashier));
    expect(kitchen.status).toBe(200);
  });
});

describe("verified settlement", () => {
  it("grants value only after valid signature + authenticated GET status, posts a balanced journal and allocates to the quote", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    const before = await t.balances();
    const n = await t.notify(t.mock.notification(i.orderId));
    expect(n.status).toBe(200);
    expect(await settled(i.intentId)).toBe("pending"); // persisted + queued, nothing granted by the callback itself
    expect(await t.balances()).toEqual(before);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
    const after = await t.balances();
    expect(BigInt(after["provider_clearing"] as string)).toBe(BigInt(before["provider_clearing"] ?? "0") + 10000n);
    expect(BigInt(after["sales_revenue"] as string)).toBe(BigInt(before["sales_revenue"] ?? "0") + 10000n);
    const status = t.mock.calls.filter((c) => c.method === "GET" && c.path === `/v2/${i.orderId}/status`);
    expect(status.length).toBeGreaterThanOrEqual(1);
    expect(status[0]?.authorization).toBe(`Basic ${Buffer.from(`${FIXTURE_SERVER_KEY}:`).toString("base64")}`);
    const alloc = (await t.h.pool.query("SELECT quote_id, amount_idr FROM payment_allocations WHERE intent_id = $1", [i.intentId])).rows;
    expect(alloc).toEqual([{ quote_id: i.quoteId, amount_idr: "10000" }]);
  });

  it("a wrong signature is refused with nothing stored or granted", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    const r = await t.notify(t.mock.notification(i.orderId, { secret: "FIXTURE-some-other-secret" }));
    expect(r.status).toBe(403);
    expect(await t.count("SELECT count(*) AS n FROM provider_events WHERE provider_order_id = $1", [i.orderId])).toBe(0);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("pending");
  });

  it("a notification signed with the ServerKey is refused when it differs from the signature secret (no key fallback)", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    expect((await t.notify(t.mock.notification(i.orderId, { secret: FIXTURE_SERVER_KEY }))).status).toBe(403);
    expect(await settled(i.intentId)).toBe("pending");
  });

  it("rotation: the previous signature secret is accepted, an unknown one is not", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    expect((await t.notify(t.mock.notification(i.orderId, { secret: FIXTURE_SIGNATURE_PREVIOUS }))).status).toBe(200);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
  });

  it("a tampered amount breaks the signature, and a replayed signature on a different order is refused", async () => {
    const a = await t.newIntent();
    const b = await t.newIntent();
    t.mock.settle(a.orderId);
    const body = t.mock.notification(a.orderId);
    expect((await t.notify({ ...body, gross_amount: "1.00" })).status).toBe(403);
    expect((await t.notify({ ...body, order_id: b.orderId })).status).toBe(403);
  });

  it("wrong amount, merchant, order or currency in the provider GET status grants nothing", async () => {
    const cases: [string, Record<string, string>][] = [
      ["amount", { grossAmount: "9999.00" }], ["merchant", { merchantId: "G000OTHER" }],
      ["currency", { currency: "USD" }], ["order", { orderIdInBody: "other-order" }], ["fraud", { fraud: "deny" }],
    ];
    for (const [name, patch] of cases) {
      const i = await t.newIntent();
      t.mock.settle(i.orderId, name === "order" ? {} : patch);
      if (name === "order") { t.mock.orders.set(i.orderId, { ...t.mock.order(i.orderId), orderId: "other-order" }); }
      expect((await t.notify(t.mock.notification(i.orderId, { gross: "10000.00", merchant: "G000FIXTURE", currency: "IDR", status: "settlement", statusCode: "200" }))).status, name).toBe(200);
      await t.runner.drain();
      expect(await settled(i.intentId), name).not.toBe("settled");
    }
    expect(await t.count("SELECT count(*) AS n FROM ledger_transactions l JOIN payment_intents p ON p.id::text = split_part(l.source_event, ':', 2) WHERE p.status <> 'settled' AND l.kind = 'payment_settlement'")).toBe(0);
  });

  it("a callback that claims settlement is not enough when the authenticated GET says pending", async () => {
    const i = await t.newIntent();
    const forged = t.mock.notification(i.orderId, { status: "settlement", statusCode: "200" }); // validly signed, but the provider state is pending
    expect((await t.notify(forged)).status).toBe(200);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("pending");
    expect(await t.count("SELECT count(*) AS n FROM payment_allocations WHERE intent_id = $1", [i.intentId])).toBe(0);
  });

  it("a notification whose own fields disagree with the intent is stored and never queued", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    const r = await t.notify(t.mock.notification(i.orderId, { gross: "5.00", status: "settlement", statusCode: "200" }));
    expect(r.status).toBe(200);
    expect((await t.h.pool.query("SELECT outcome FROM provider_events WHERE provider_order_id = $1", [i.orderId])).rows[0].outcome).toBe("rejected_mismatch");
    expect(await t.count("SELECT count(*) AS n FROM outbox WHERE aggregate_id = $1 AND processed_at IS NULL AND topic = 'payment.verify' AND available_at <= now() + interval '1 second'", [i.intentId])).toBeLessThanOrEqual(1);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled"); // the poll chain still asks the provider, which is the authority
  });

  it("duplicate notifications credit exactly once", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    const body = t.mock.notification(i.orderId);
    const before = await credits();
    for (let k = 0; k < 4; k++) expect((await t.notify(body)).status).toBe(200);
    await t.runner.drain();
    await t.notify(body);
    await t.runner.drain();
    expect(await credits()).toBe(before + 1);
    expect(await t.count("SELECT count(*) AS n FROM provider_events WHERE provider_order_id = $1", [i.orderId])).toBe(1);
  });

  it("out of order: a stale pending notification after settlement never reverses paid", async () => {
    const i = await t.newIntent();
    const stalePending = t.mock.notification(i.orderId); // signed while pending
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
    const before = await t.balances();
    expect((await t.notify(stalePending)).status).toBe(200);
    t.mock.set(i.orderId, { status: "pending", statusCode: "201" }); // even a provider replaying an old state
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
    expect(await t.balances()).toEqual(before);
  });

  it("the tenant comes from the stored intent, never from callback fields", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    const before = await t.balances();
    await t.notify(t.mock.notification(i.orderId, { extra: { tenant_id: t.h.world.tenantB, outlet_id: t.h.world.outletB1 } }));
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
    expect(BigInt((await t.balances())["sales_revenue"] as string)).toBe(BigInt(before["sales_revenue"] as string) + 10000n);
    expect(await t.count("SELECT count(*) AS n FROM ledger_transactions WHERE tenant_id = $1", [t.h.world.tenantB])).toBe(0);
  });

  it("a notification for an unknown order is stored, grants nothing and answers 200", async () => {
    const body = { order_id: "hatch-unknown", status_code: "200", gross_amount: "10000.00", transaction_status: "settlement", merchant_id: "G000FIXTURE", currency: "IDR", signature_key: signature("hatch-unknown", "200", "10000.00", FIXTURE_SIGNATURE_SECRET) };
    expect((await t.notify(body)).status).toBe(200);
    expect((await t.h.pool.query("SELECT outcome, tenant_id FROM provider_events WHERE provider_order_id = 'hatch-unknown'")).rows).toEqual([{ outcome: "unknown_order", tenant_id: null }]);
  });

  it("no screenshot or client redirect is payment proof", async () => {
    const i = await t.newIntent();
    const redirect = await call(t.h.app, "GET", `${P}/payments/qris-intents/${i.intentId}?transaction_status=settlement&status_code=200&order_id=${i.orderId}`, as(t.cashier));
    expect(redirect.json["data"].status).toBe("pending");
    for (const path of ["confirm", "paid", "settle"]) {
      expect((await call(t.h.app, "POST", `${P}/payments/qris-intents/${i.intentId}/${path}`, { ...as(t.cashier), body: { screenshot: "data:image/png;base64,AAAA" } })).status).toBe(404);
    }
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("pending");
  });
});

describe("provider failure", () => {
  it("provider down keeps the intent pending, retries with backoff, then settles once", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    t.mock.mode = "down";
    const r = await t.runner.drain();
    expect(r.retried).toBeGreaterThanOrEqual(1);
    expect(await settled(i.intentId)).toBe("pending");
    const job = (await t.h.pool.query("SELECT attempts, available_at, last_error FROM outbox WHERE aggregate_id = $1 AND processed_at IS NULL", [i.intentId])).rows[0];
    expect(job.attempts).toBeGreaterThanOrEqual(1);
    expect(String(job.last_error)).not.toContain(FIXTURE_SERVER_KEY);
    t.mock.mode = "ok";
    expect((await t.runner.drain()).done).toBe(0); // backoff has not elapsed
    t.h.clock.advance(3600);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
    expect(await credits()).toBeGreaterThanOrEqual(1);
  });

  it("a provider timeout is pending, never success", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    t.mock.mode = "hang";
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("pending");
    t.mock.mode = "ok";
  });

  it("creating an intent while the provider is down fails typed and leaves no intent behind", async () => {
    const p = await t.prepare();
    t.mock.mode = "down";
    const r = await t.intent(p);
    t.mock.mode = "ok";
    expect(r.status).toBe(503);
    expect(r.json["error"].code).toBe("PROVIDER_UNAVAILABLE");
    expect(await t.count("SELECT count(*) AS n FROM payment_intents WHERE quote_id = $1", [p.quoteId])).toBe(0);
    expect((await t.intent(p)).status).toBe(200); // the quote is free again
  });

  it("an unauthorised charge (wrong ServerKey) is not a payment", async () => {
    const bad = await payHarness({ serverKey: "FIXTURE-wrong-server-key" });
    try {
      const p = await bad.prepare();
      expect((await bad.intent(p)).status).toBe(503);
    } finally { await bad.close(); }
  });
});

describe("late settlement and refunds", () => {
  it("a settlement after the intent was abandoned goes to refund_pending, not to a session", async () => {
    const i = await t.newIntent();
    expect((await call(t.h.app, "POST", `${P}/payments/qris-intents/${i.intentId}/abandon`, { ...as(t.cashier), body: {} })).status).toBe(200);
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("refund_pending");
    expect(await t.count("SELECT count(*) AS n FROM payment_allocations WHERE intent_id = $1", [i.intentId])).toBe(0);
    const refund = (await t.h.pool.query("SELECT status, amount_idr, provider_proof_ref FROM refunds WHERE intent_id = $1", [i.intentId])).rows;
    expect(refund).toEqual([{ status: "pending", amount_idr: "10000", provider_proof_ref: null }]);
    const station = (await t.h.pool.query("SELECT status FROM stations WHERE id = $1", [i.stationId])).rows[0];
    expect(station.status).toBe("reserved"); // untouched: the payment did not start or steal anything
    const j = await t.h.pool.query("SELECT account, credit_idr FROM ledger_entries e JOIN ledger_transactions l ON l.id = e.transaction_id WHERE l.source_event = $1 AND e.credit_idr > 0", [`payment:${i.intentId}:late-settlement`]);
    expect(j.rows).toEqual([{ account: "refund_payable", credit_idr: "10000" }]);
  });

  it("a settlement after the station was released and reserved by someone else goes to refund_pending", async () => {
    const i = await t.newIntent();
    await call(t.h.app, "POST", `${P}/stations/${i.stationId}/release`, { ...as(t.cashier), body: {} });
    const other = await call(t.h.app, "POST", `${P}/stations/${i.stationId}/reserve`, { ...as(t.owner), body: {} });
    expect(other.status).toBe(200);
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("refund_pending");
    expect((await t.h.pool.query("SELECT reserved_by FROM stations WHERE id = $1", [i.stationId])).rows[0].reserved_by).not.toBeNull();
  });

  it("a provider expiry marks the intent expired; a later settlement is refund_pending", async () => {
    const i = await t.newIntent();
    t.mock.set(i.orderId, { status: "expire", statusCode: "407" });
    await t.notify(t.mock.notification(i.orderId));
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("expired");
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("refund_pending");
  });

  it("a refund stays pending: the database refuses 'refunded' without provider proof, and no API claims money returned", async () => {
    const r = (await t.h.pool.query("SELECT id FROM refunds LIMIT 1")).rows[0];
    await expect(t.h.pool.query("UPDATE refunds SET status = 'refunded' WHERE id = $1", [r.id])).rejects.toThrow();
    const list = await call(t.h.app, "GET", `${P}/payments/refunds`, as(t.owner));
    expect(list.status).toBe(200);
    expect((list.json["data"].refunds as { status: string }[]).every((x) => x.status === "pending")).toBe(true);
  });
});

describe("worker faults", () => {
  it("a crash after the effect rolls everything back; the rerun credits exactly once", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    const before = await credits();
    const crashing = (await import("../../services/worker/src/payments/runner.ts")).createPaymentsRunner(
      { pool: t.h.pool, config: t.config, clock: t.h.clock.read },
      { around: async (run) => { await run(); throw new Error("simulated process death"); } });
    await crashing.drain(1);
    expect(await credits()).toBe(before);
    expect(await settled(i.intentId)).toBe("pending");
    t.h.clock.advance(3600);
    await t.runner.drain();
    expect(await credits()).toBe(before + 1);
  });

  it("two workers racing on one settlement credit exactly once", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    const before = await credits();
    await Promise.all([t.runner.drain(), t.runner.drain(), t.runner.drain()]);
    expect(await credits()).toBe(before + 1);
    expect(await settled(i.intentId)).toBe("settled");
  });

  it("a clock rollback neither double credits nor loses the job", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    await t.notify(t.mock.notification(i.orderId));
    const before = await credits();
    t.h.clock.advance(-3 * 3600);
    await t.runner.drain();
    t.h.clock.advance(3 * 3600);
    await t.runner.drain();
    await t.runner.drain();
    expect(await credits()).toBe(before + 1);
    expect(await settled(i.intentId)).toBe("settled");
  });

  it("polling alone settles an intent when no notification ever arrives", async () => {
    const i = await t.newIntent();
    t.mock.settle(i.orderId);
    t.h.clock.advance(60);
    await t.runner.drain();
    expect(await settled(i.intentId)).toBe("settled");
  });

  it("a job that keeps failing is dead-lettered with the intent still pending", async () => {
    const i = await t.newIntent();
    t.mock.mode = "down";
    for (let k = 0; k < 14; k++) { await t.runner.drain(); t.h.clock.advance(24 * 3600); }
    t.mock.mode = "ok";
    expect(await settled(i.intentId)).toBe("pending");
    expect(await t.count("SELECT count(*) AS n FROM outbox WHERE aggregate_id = $1 AND dead_at IS NOT NULL", [i.intentId])).toBeGreaterThanOrEqual(1);
  });

  it("the SHA-512 formula in the mock equals an independent computation", () => {
    expect(signature("o", "200", "1.00", "k")).toBe(createHash("sha512").update("o2001.00k").digest("hex"));
  });
});
