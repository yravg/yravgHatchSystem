import { randomBytes, randomUUID } from "node:crypto";
import { buildApp } from "../../services/api/src/app.ts";
import { hashPassword } from "../../services/api/src/identity/crypto.ts";
import { createPool, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { base32Encode, totpCode, stepAt } from "../../services/api/src/identity/totp.ts";
import type { IdentityConfig } from "../../services/api/src/identity/service.ts";

// fastify and pg live under services/api, so the test types come from its own exports.
export type FastifyInstance = ReturnType<typeof buildApp>;
type Pool = ReturnType<typeof createPool>;

// Everything below is a FIXTURE: fixed secrets, fixed password, fixed key. None of it protects a real account.
export const FIXTURE_PASSWORD = "fixture-password-not-a-real-secret";
export const FIXTURE_KEY = Buffer.alloc(32, 7);
export const FIXTURE_TOTP_SECRET = Buffer.from("12345678901234567890"); // RFC 6238 test secret
export const FIXTURE_TOTP_BASE32 = base32Encode(FIXTURE_TOTP_SECRET);

/** Controllable trusted server time. Starts on a 30 s step boundary. */
export class TestClock {
  now = new Date(Date.UTC(2026, 10, 9, 3, 0, 0));
  readonly read = (): Date => new Date(this.now);
  advance(seconds: number): void {
    this.now = new Date(this.now.getTime() + seconds * 1000);
  }
}

/** The 20-byte request is the TOTP secret; every other size stays random (recovery codes, ids). */
export const fixtureRandom = (n: number): Buffer => (n === 20 ? Buffer.from(FIXTURE_TOTP_SECRET) : randomBytes(n));

export const codeAt = (clock: TestClock, offsetSteps = 0): string => totpCode(FIXTURE_TOTP_SECRET, stepAt(clock.now) + offsetSteps);

const dbUrl = (name: string): string => {
  const base = process.env["HATCH_PG_URL"];
  if (!base) throw new Error("HATCH_PG_URL is not set; source hatch-env.sh");
  const u = new URL(base);
  u.pathname = `/${name}`;
  return u.toString();
};

/** One schema per test file inside the dedicated hatch_t46 database, so files never collide. */
export async function isolatedSchema(): Promise<{ pool: Pool; name: string; drop: () => Promise<void> }> {
  const admin = createPool(dbUrl("postgres"));
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'hatch_t46'");
  if (exists.rowCount === 0) await admin.query("CREATE DATABASE hatch_t46").catch(() => undefined); // another file may win the race
  await admin.end();
  const root = createPool(dbUrl("hatch_t46"));
  const name = `t46_${randomBytes(6).toString("hex")}`;
  await root.query(`CREATE SCHEMA ${name}`);
  const pool = createPool(dbUrl("hatch_t46"), name);
  return {
    pool,
    name,
    drop: async () => {
      await pool.end();
      await root.query(`DROP SCHEMA ${name} CASCADE`);
      await root.end();
    },
  };
}

export interface World {
  tenantA: string; tenantB: string;
  outletA1: string; outletA2: string; outletB1: string;
  ownerA: string; managerA: string; cashierA: string; cashierA2: string; ownerB: string;
}

export const emailOf = (who: string): string => `${who}@fixture.invalid`;

export async function seedWorld(pool: Pool): Promise<World> {
  const w: World = {
    tenantA: randomUUID(), tenantB: randomUUID(), outletA1: randomUUID(), outletA2: randomUUID(), outletB1: randomUUID(),
    ownerA: randomUUID(), managerA: randomUUID(), cashierA: randomUUID(), cashierA2: randomUUID(), ownerB: randomUUID(),
  };
  const hash = await hashPassword(FIXTURE_PASSWORD);
  for (const [id, name] of [[w.tenantA, "Tenant A fixture"], [w.tenantB, "Tenant B fixture"]] as const) {
    await pool.query("INSERT INTO tenants (id, name) VALUES ($1, $2)", [id, name]);
  }
  for (const [id, t, name] of [[w.outletA1, w.tenantA, "A1"], [w.outletA2, w.tenantA, "A2"], [w.outletB1, w.tenantB, "B1"]] as const) {
    await pool.query("INSERT INTO outlets (id, tenant_id, name, timezone) VALUES ($1, $2, $3, 'Asia/Jakarta')", [id, t, name]);
  }
  const staff: [string, string, string, string, string | null][] = [
    [w.ownerA, w.tenantA, "ownerA", "owner", null],
    [w.managerA, w.tenantA, "managerA", "manager", w.outletA1],
    [w.cashierA, w.tenantA, "cashierA", "cashier", w.outletA1],
    [w.cashierA2, w.tenantA, "cashierA2", "cashier", w.outletA2],
    [w.ownerB, w.tenantB, "ownerB", "owner", null],
  ];
  for (const [id, t, who, role, outlet] of staff) {
    await pool.query("INSERT INTO staff (id, tenant_id, email, display_name, password_hash) VALUES ($1, $2, $3, $4, $5)", [id, t, emailOf(who), who, hash]);
    await pool.query("INSERT INTO role_grants (id, tenant_id, staff_id, outlet_id, role) VALUES ($1, $2, $3, $4, $5)", [randomUUID(), t, id, outlet, role]);
  }
  return w;
}

export interface Harness {
  app: FastifyInstance;
  pool: Pool;
  clock: TestClock;
  world: World;
  close: () => Promise<void>;
}

export async function harness(opts: { config?: Partial<IdentityConfig>; logStream?: NodeJS.WritableStream } = {}): Promise<Harness> {
  const schema = await isolatedSchema();
  await migrateUp(schema.pool);
  const world = await seedWorld(schema.pool);
  const clock = new TestClock();
  const app = buildApp({
    identity: { pool: schema.pool, key: FIXTURE_KEY, clock: clock.read, random: fixtureRandom, ...(opts.config ? { config: opts.config } : {}) },
    ...(opts.logStream ? { logger: { level: "trace", stream: opts.logStream } } : {}),
  });
  return { app, pool: schema.pool, clock, world, close: async () => { await app.close(); await schema.drop(); } };
}

export interface Session { cookie: string; csrf: string; body: Record<string, unknown> }
interface Call { cookie?: string; csrf?: string; key?: string | null; body?: unknown; ip?: string }

export async function call(app: FastifyInstance, method: "GET" | "POST" | "DELETE", url: string, c: Call = {}) {
  const headers: Record<string, string> = {};
  if (c.cookie) headers["cookie"] = c.cookie;
  if (c.csrf) headers["x-hatch-csrf"] = c.csrf;
  if (c.key !== null && method !== "GET") headers["idempotency-key"] = c.key ?? randomUUID();
  const res = await app.inject({ method, url, headers, remoteAddress: c.ip ?? "10.0.0.1", ...(c.body !== undefined ? { payload: c.body as object } : {}) });
  const json = res.body ? (JSON.parse(res.body) as Record<string, any>) : {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  return { status: res.statusCode, json, headers: res.headers };
}

export async function login(app: FastifyInstance, who: string, o: { password?: string; outletId?: string; ip?: string } = {}): Promise<Session> {
  const r = await call(app, "POST", "/api/v1/auth/session", {
    key: null, ip: o.ip ?? "10.0.0.1",
    body: { email: emailOf(who), password: o.password ?? FIXTURE_PASSWORD, ...(o.outletId ? { outletId: o.outletId } : {}) },
  });
  if (r.status !== 200) throw new Error(`login ${who} failed with ${r.status}`);
  const setCookie = String(r.headers["set-cookie"]);
  return { cookie: setCookie.split(";")[0] ?? "", csrf: String(r.json["data"].csrfToken), body: r.json["data"] };
}

/** Enrol and confirm a factor for a logged-in session with the fixture secret. Returns the recovery codes. */
export async function enrolAndConfirm(h: Harness, s: Session): Promise<string[]> {
  const e = await call(h.app, "POST", "/api/v1/auth/mfa/enroll", { cookie: s.cookie, csrf: s.csrf, body: {} });
  if (e.status !== 200) throw new Error(`enroll failed ${e.status}`);
  const c = await call(h.app, "POST", "/api/v1/auth/mfa/confirm", { cookie: s.cookie, csrf: s.csrf, body: { code: codeAt(h.clock) } });
  if (c.status !== 200) throw new Error(`confirm failed ${c.status}`);
  return c.json["data"].recoveryCodes as string[];
}
