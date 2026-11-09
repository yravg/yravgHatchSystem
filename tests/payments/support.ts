import { expect } from "vitest";
import type { PaymentsConfig } from "../../services/api/src/payments/config.ts";
import { createPaymentsRunner } from "../../services/worker/src/payments/runner.ts";
import { call, enrolAndConfirm, harness, login, type Harness } from "../ledger/support.ts";
import { FIXTURE_MERCHANT, FIXTURE_SERVER_KEY, FIXTURE_SIGNATURE_PREVIOUS, FIXTURE_SIGNATURE_SECRET, MockMidtrans } from "./mock-midtrans.ts";

export type Session = Awaited<ReturnType<typeof login>>;
export const P = "/api/v1";
export const as = (s: { cookie: string; csrf: string }) => ({ cookie: s.cookie, csrf: s.csrf });

export interface Prepared { stationId: string; quoteId: string; amount: string }

export async function payHarness(over: Partial<PaymentsConfig> = {}) {
  const mock = new MockMidtrans();
  await mock.start();
  const config: PaymentsConfig = {
    merchantId: FIXTURE_MERCHANT, serverKey: FIXTURE_SERVER_KEY, signatureSecrets: [FIXTURE_SIGNATURE_SECRET, FIXTURE_SIGNATURE_PREVIOUS],
    baseUrl: mock.baseUrl, timeoutMs: 400, intentTtlSeconds: 900, pollSeconds: 30, ...over,
  };
  const h: Harness = await harness({ payments: config });
  const owner = await login(h.app, "ownerA", { outletId: h.world.outletA1 });
  await enrolAndConfirm(h, owner);
  const ownerB = await login(h.app, "ownerB");
  await enrolAndConfirm(h, ownerB);
  const cashier = await login(h.app, "cashierA");
  const cashier2 = await login(h.app, "cashierA");
  const runner = createPaymentsRunner({ pool: h.pool, config, clock: h.clock.read });
  expect((await call(h.app, "POST", `${P}/rate-rules`, { ...as(owner), body: { ratePerHourIdr: "10000" } })).status).toBe(200);
  let n = 0;

  /** A reserved station and a stored quote. 3600 s at Rp10.000/hour is Rp10.000 (sandbox fixture). */
  const prepare = async (seconds = 3600, by: Session = cashier): Promise<Prepared> => {
    const st = await call(h.app, "POST", `${P}/stations`, { ...as(owner), body: { name: `PS-${++n}` } });
    const stationId = st.json["data"].stationId as string;
    expect((await call(h.app, "POST", `${P}/stations/${stationId}/reserve`, { ...as(by), body: {} })).status).toBe(200);
    const q = await call(h.app, "POST", `${P}/quotes`, { ...as(by), body: { stationId, segments: [{ seconds, paused: false }] } });
    expect(q.status).toBe(200);
    return { stationId, quoteId: q.json["data"].quoteId as string, amount: q.json["data"].amountIdr as string };
  };
  const intent = (p: Prepared, by: Session = cashier) =>
    call(h.app, "POST", `${P}/payments/qris-intents`, { ...as(by), body: { quoteId: p.quoteId, stationId: p.stationId } });
  const newIntent = async (seconds = 3600) => {
    const p = await prepare(seconds);
    const r = await intent(p);
    expect(r.status).toBe(200);
    return { ...p, intentId: r.json["data"].intentId as string, orderId: r.json["data"].providerOrderId as string };
  };
  const notify = (body: unknown) => call(h.app, "POST", `${P}/payments/midtrans/notification`, { key: null, body });
  const get = async (id: string, by: Session = cashier) => (await call(h.app, "GET", `${P}/payments/qris-intents/${id}`, as(by))).json["data"] as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const balances = async (): Promise<Record<string, string>> =>
    Object.fromEntries(((await call(h.app, "GET", `${P}/ledger/balances`, as(owner))).json["data"].balances as { account: string; balanceIdr: string }[]).map((b) => [b.account, b.balanceIdr]));
  const count = async (sql: string, args: unknown[] = []): Promise<number> => Number((await h.pool.query(sql, args)).rows[0].n);
  return {
    h, mock, config, runner, owner, ownerB, cashier, cashier2, prepare, intent, newIntent, notify, get, balances, count,
    close: async () => { await h.close(); await mock.stop(); },
  };
}
export type PayHarness = Awaited<ReturnType<typeof payHarness>>;
