// T53 test support: own database hatch_t53 (one schema per test file), local Midtrans mock, fixture staff. Every key, id,
// amount, quantity and cost here is a labelled SANDBOX FIXTURE (D08, D17, D30 are not owner-approved).
import { randomBytes, randomUUID } from "node:crypto";
import { buildApp } from "../../services/api/src/app.ts";
import { createPool, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { FIXTURE_KEY, TestClock, call, codeAt, enrolAndConfirm, fixtureRandom, login, seedWorld, type Harness } from "../identity/support.ts";
import { FIXTURE_MERCHANT, FIXTURE_SERVER_KEY, FIXTURE_SIGNATURE_PREVIOUS, FIXTURE_SIGNATURE_SECRET, MockMidtrans } from "../payments/mock-midtrans.ts";

export { call };
export const P = "/api/v1";
export type Staff = Awaited<ReturnType<typeof login>>;
export const as = (s: { cookie: string; csrf: string }) => ({ cookie: s.cookie, csrf: s.csrf });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>;

const dbUrl = (name: string): string => {
  const base = process.env["HATCH_PG_URL"];
  if (!base) throw new Error("HATCH_PG_URL is not set; source hatch-env.sh");
  const u = new URL(base);
  u.pathname = `/${name}`;
  return u.toString();
};

export async function isolatedSchema() {
  const admin = createPool(dbUrl("postgres"));
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'hatch_t53'");
  if (exists.rowCount === 0) await admin.query("CREATE DATABASE hatch_t53").catch(() => undefined);
  await admin.end();
  const root = createPool(dbUrl("hatch_t53"));
  const name = `t53_${randomBytes(6).toString("hex")}`;
  await root.query(`CREATE SCHEMA ${name}`);
  const pool = createPool(dbUrl("hatch_t53"), name);
  return { pool, name, drop: async () => { await pool.end(); await root.query(`DROP SCHEMA ${name} CASCADE`); await root.end(); } };
}

export async function opsHarness(o: { payments?: boolean } = {}) {
  const schema = await isolatedSchema();
  await migrateUp(schema.pool);
  const world = await seedWorld(schema.pool);
  const clock = new TestClock(); // 2026-11-09T03:00:00Z = 10:00 Asia/Jakarta, business day 2026-11-09
  const mock = new MockMidtrans();
  await mock.start();
  const payments = {
    merchantId: FIXTURE_MERCHANT, serverKey: FIXTURE_SERVER_KEY, signatureSecrets: [FIXTURE_SIGNATURE_SECRET, FIXTURE_SIGNATURE_PREVIOUS],
    baseUrl: mock.baseUrl, timeoutMs: 400, intentTtlSeconds: 900, pollSeconds: 30,
  };
  const app = buildApp({ identity: { pool: schema.pool, key: FIXTURE_KEY, clock: clock.read, random: fixtureRandom }, ...(o.payments === false ? {} : { payments }) });
  const h: Harness = { app, pool: schema.pool, clock, world, close: async () => undefined };

  const owner = await login(app, "ownerA", { outletId: world.outletA1 });
  await enrolAndConfirm(h, owner);
  const manager = await login(app, "managerA");
  await enrolAndConfirm(h, manager);
  const ownerB = await login(app, "ownerB");
  await enrolAndConfirm(h, ownerB);
  const cashier = await login(app, "cashierA");
  const cashierA2 = await login(app, "cashierA2");

  /** Fresh step-up (refund.approve needs it): TOTP steps must advance, so move the trusted clock 30 s first. */
  const stepUp = async (s: Staff): Promise<void> => {
    clock.advance(30);
    const r = await call(app, "POST", `${P}/auth/mfa/challenge`, { ...as(s), body: { code: codeAt(clock) } });
    if (r.status !== 200) throw new Error(`step-up failed ${r.status}`);
  };
  const post = (s: Staff, url: string, body: unknown = {}, key?: string) => call(app, "POST", `${P}${url}`, { ...as(s), body, ...(key ? { key } : {}) });
  const get = (s: Staff, url: string) => call(app, "GET", `${P}${url}`, as(s));
  const ok = async <T = Json>(r: Promise<{ status: number; json: Json }>): Promise<T> => {
    const x = await r;
    if (x.status !== 200) throw new Error(`expected 200, got ${x.status} ${JSON.stringify(x.json)}`);
    return x.json["data"] as T;
  };

  // ---- fixtures --------------------------------------------------------------------------------------------------
  /** A stock item with `qty` base units bought for `costIdr` in total (fixture D17 moving average). */
  const stockItem = async (name: string, qty: string, costIdr: string, baseUom = "ml"): Promise<string> => {
    const s = await ok(post(owner, "/stock-items", { name, baseUom }));
    await ok(post(owner, `/stock-items/${s["stockItemId"]}/receipts`, { qty, totalCostIdr: costIdr }));
    return s["stockItemId"] as string;
  };
  const menuItem = async (name: string, priceIdr: string, recipe: { stockItemId: string; qty: string }[]): Promise<string> =>
    (await ok(post(owner, "/menu-items", { name, priceIdr, recipe })))["menuItemId"] as string;
  /** The common fixture: 1000 ml of milk (Rp5.000 total) and a "latte" using 100 ml, price Rp20.000. */
  const latte = async () => {
    const milk = await stockItem(`susu-${randomUUID()}`, "1000", "5000");
    const menu = await menuItem(`latte-${randomUUID()}`, "20000", [{ stockItemId: milk, qty: "100" }]);
    return { milk, menu };
  };
  const order = (s: Staff, lines: { menuItemId: string; qty: number }[], extra: Json = {}, key?: string) => post(s, "/orders", { lines, ...extra }, key);
  const onHand = async (stockItemId: string): Promise<string> => String((await ok(get(owner, `/stock-items/${stockItemId}`)))["onHand"]);

  const register = async (name = "kasir-1"): Promise<string> => (await ok(post(owner, "/registers", { name })))["registerId"] as string;
  const openShift = async (s: Staff, registerId: string, floatIdr = "100000"): Promise<string> =>
    (await ok(post(s, "/shifts/open", { registerId, openingFloatIdr: floatIdr })))["shiftId"] as string;
  const policy = async (): Promise<Json> => ok(post(owner, "/shift-close-policies", {}));

  /** Ledger balances of outlet A1 as numbers; tests compare before/after deltas because a schema is shared by a file. */
  const bal = async (): Promise<Record<string, number>> => {
    const rows = await schema.pool.query("SELECT account, balance FROM ledger_balances WHERE tenant_id = $1 AND outlet_id = $2", [world.tenantA, world.outletA1]);
    return Object.fromEntries(rows.rows.map((r: { account: string; balance: string }) => [r.account, Number(r.balance)]));
  };
  const q = async <T = Record<string, unknown>>(text: string, args: unknown[] = []): Promise<T[]> => (await schema.pool.query(text, args)).rows as T[];
  const count = async (text: string, args: unknown[] = []): Promise<number> => Number((await schema.pool.query(text, args)).rows[0].n);

  /** Station + active seat device + quote + a session row in `state`, the way T49 leaves it (fixture seeding, no device proof). */
  const seedSession = async (state = "ACTIVE", outletId = world.outletA1, tenantId = world.tenantA): Promise<string> => {
    const station = randomUUID(); const device = randomUUID(); const quote = randomUUID(); const rule = randomUUID(); const id = randomUUID();
    const now = clock.now.toISOString();
    await schema.pool.query("INSERT INTO stations (id, tenant_id, outlet_id, name, zone) VALUES ($1,$2,$3,$4,'reguler')", [station, tenantId, outletId, `PS-${station.slice(0, 6)}`]);
    await schema.pool.query("INSERT INTO devices (id, tenant_id, outlet_id, station_id, kind, name, status, public_key, created_by, approved_by, approved_at) VALUES ($1,$2,$3,$4,'seat','seat','active',$5,$6,$6,$7)", [device, tenantId, outletId, station, `pk-${device}`, world.ownerA, now]);
    await schema.pool.query("INSERT INTO rate_rule_versions (id, tenant_id, outlet_id, version, effective_from, rate_per_hour_idr, created_by, created_at) VALUES ($1,$2,$3,1,$5,12000,$4,$5) ON CONFLICT DO NOTHING", [rule, tenantId, outletId, world.ownerA, now]);
    const rv = (await schema.pool.query("SELECT id FROM rate_rule_versions WHERE tenant_id = $1 AND outlet_id = $2 LIMIT 1", [tenantId, outletId])).rows[0]?.id as string;
    await schema.pool.query("INSERT INTO quotes (id, tenant_id, outlet_id, station_id, rule_version_id, segments, billable_seconds, exact_numerator, exact_denominator, amount_idr, minimum_applied, created_by) VALUES ($1,$2,$3,$4,$5,'[]',3600,'12000','1',12000,false,$6)", [quote, tenantId, outletId, station, rv, world.ownerA]);
    await schema.pool.query("INSERT INTO sessions (id, tenant_id, outlet_id, station_id, origin_station_id, device_id, quote_id, payment_mode, mode, state, fixed_seconds, amount_idr, created_by, created_at, updated_at) VALUES ($1,$2,$3,$4,$4,$5,$6,'postpaid','FIXED',$7,3600,12000,$8,$9,$9)", [id, tenantId, outletId, station, device, quote, state, world.ownerA, now]);
    return id;
  };

  /** An open transfer row for a session (what T49 leaves while a move is in flight); fixture seeding only. */
  const seedTransfer = async (sessionId: string): Promise<string> => {
    const s = (await schema.pool.query("SELECT station_id, device_id, quote_id FROM sessions WHERE id = $1", [sessionId])).rows[0];
    const tq = randomUUID(); const id = randomUUID();
    const now = clock.now.toISOString();
    await schema.pool.query("INSERT INTO session_transfer_quotes (id, session_id, tenant_id, outlet_id, from_station_id, to_station_id, session_revision, elapsed_seconds, total_seconds, source_rate_idr, target_rate_idr, base_amount_idr, new_amount_idr, delta_idr, minimum_applied, created_by, created_at, expires_at) VALUES ($1,$2,$3,$4,$5,$6,1,60,3600,12000,12000,12000,12000,0,false,$7,$8,$8)", [tq, sessionId, world.tenantA, world.outletA1, s.station_id, randomUUID(), world.ownerA, now]);
    await schema.pool.query("INSERT INTO session_transfers (id, session_id, tenant_id, outlet_id, from_station_id, to_station_id, from_device_id, to_device_id, transfer_quote_id, status, tariff_delta_idr, lock_command_id, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'LOCKING_SOURCE',0,$10,$11,$11)", [id, sessionId, world.tenantA, world.outletA1, s.station_id, randomUUID(), s.device_id, randomUUID(), tq, randomUUID(), now]);
    return id;
  };

  return {
    app, pool: schema.pool, clock, world, mock, owner, manager, ownerB, cashier, cashierA2, stepUp, post, get, ok,
    stockItem, menuItem, latte, order, relogin: (who: string) => login(app, who), onHand, register, openShift, policy, q, count, seedSession, bal, seedTransfer,
    close: async () => { await app.close(); await mock.stop(); await schema.drop(); },
  };
}
export type OH = Awaited<ReturnType<typeof opsHarness>>;
