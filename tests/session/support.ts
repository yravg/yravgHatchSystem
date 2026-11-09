// T49 test support: own database hatch_t49 (one schema per test file), local Midtrans mock, simulated edge and seat
// devices with Ed25519 FIXTURE keys. Every key, id and amount here is a labelled fixture; nothing talks to a network.
import { randomBytes, randomUUID } from "node:crypto";
import { buildApp } from "../../services/api/src/app.ts";
import { createPool, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { createSessionJobs, type SessionsOptions } from "../../services/api/src/sessions/index.ts";
import { createPaymentsRunner } from "../../services/worker/src/payments/runner.ts";
import { FIXTURE_KEY, TestClock, fixtureRandom, seedWorld, call, enrolAndConfirm, login, type Harness } from "../identity/support.ts";
import { newDeviceKeys, pairingProof, signBody, type DeviceKeys } from "../edge/support.ts";
import { FIXTURE_MERCHANT, FIXTURE_SERVER_KEY, FIXTURE_SIGNATURE_PREVIOUS, FIXTURE_SIGNATURE_SECRET, MockMidtrans } from "../payments/mock-midtrans.ts";

export { call, enrolAndConfirm, login };
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
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'hatch_t49'");
  if (exists.rowCount === 0) await admin.query("CREATE DATABASE hatch_t49").catch(() => undefined);
  await admin.end();
  const root = createPool(dbUrl("hatch_t49"));
  const name = `t49_${randomBytes(6).toString("hex")}`;
  await root.query(`CREATE SCHEMA ${name}`);
  const pool = createPool(dbUrl("hatch_t49"), name);
  return { pool, name, drop: async () => { await pool.end(); await root.query(`DROP SCHEMA ${name} CASCADE`); await root.end(); } };
}

export interface CommandView { commandId: string; action: string; status: string; leaseClaims: Json | null; command: Json }

export async function sessionHarness(o: { sessions?: SessionsOptions } = {}) {
  const schema = await isolatedSchema();
  await migrateUp(schema.pool);
  const world = await seedWorld(schema.pool);
  const clock = new TestClock();
  const mock = new MockMidtrans();
  await mock.start();
  const payments = {
    merchantId: FIXTURE_MERCHANT, serverKey: FIXTURE_SERVER_KEY, signatureSecrets: [FIXTURE_SIGNATURE_SECRET, FIXTURE_SIGNATURE_PREVIOUS],
    baseUrl: mock.baseUrl, timeoutMs: 400, intentTtlSeconds: 900, pollSeconds: 30,
  };
  const opts: SessionsOptions = { ...(o.sessions ?? {}) };
  const deps = { pool: schema.pool, key: FIXTURE_KEY, clock: clock.read, random: fixtureRandom };
  const app = buildApp({ identity: deps, payments, sessions: opts });
  const h: Harness = { app, pool: schema.pool, clock, world, close: async () => undefined };
  const jobs = createSessionJobs(deps, opts);
  const runner = createPaymentsRunner({ pool: schema.pool, config: payments, clock: clock.read });

  const owner = await login(app, "ownerA", { outletId: world.outletA1 });
  await enrolAndConfirm(h, owner);
  const ownerB = await login(app, "ownerB");
  await enrolAndConfirm(h, ownerB);
  const cashier = await login(app, "cashierA");
  const cashierA2 = await login(app, "cashierA2");
  const rate = await call(app, "POST", `${P}/rate-rules`, { ...as(owner), body: { ratePerHourIdr: "12000" } }); // fixture D01
  if (rate.status !== 200) throw new Error("rate rule fixture failed");

  // ---- simulated devices -------------------------------------------------------------------------------------------
  const keys = new Map<string, DeviceKeys>();
  const pair = async (kind: "edge" | "seat", name: string, stationId?: string): Promise<string> => {
    const r = await call(app, "POST", `${P}/devices`, { ...as(owner), body: { kind, name, ...(stationId ? { stationId } : {}) } });
    const id = r.json["data"].deviceId as string;
    const k = newDeviceKeys();
    const c = await call(app, "POST", `${P}/devices/${id}/pairing-challenge`, { key: null, body: { publicKey: k.publicKey, proof: pairingProof(k, id) } });
    const a = await call(app, "POST", `${P}/devices/${id}/pairing/approve`, { ...as(owner), body: { code: c.json["data"].code } });
    if (a.status !== 200) throw new Error("pairing fixture failed");
    keys.set(id, k);
    return id;
  };
  const edgeId = await pair("edge", "edge-1");
  const claim = async (): Promise<number> => {
    const r = await call(app, "POST", `${P}/edge/authority/claim`, { ...as(owner), body: { edgeDeviceId: edgeId } });
    return r.json["data"].authorityEpoch as number;
  };
  let epoch = await claim();

  const stations = new Map<string, { id: string; deviceId: string | null }>();
  let n = 0;
  const addStation = async (name = `PS-${++n}`, zone = "reguler", seat = true) => {
    const st = await call(app, "POST", `${P}/stations`, { ...as(owner), body: { name, zone } });
    const id = st.json["data"].stationId as string;
    const deviceId = seat ? await pair("seat", `seat-${name}`, id) : null;
    stations.set(id, { id, deviceId });
    return { id, deviceId };
  };

  // ---- sessions ----------------------------------------------------------------------------------------------------
  const quote = async (stationId: string, seconds = 3600, by: Staff = cashier) =>
    call(app, "POST", `${P}/quotes`, { ...as(by), body: { stationId, segments: [{ seconds, paused: false }] } });
  const start = async (stationId: string, o2: { seconds?: number; mode?: "FIXED" | "OPEN"; by?: Staff; body?: Json; key?: string } = {}) => {
    const q = await quote(stationId, o2.seconds ?? 3600, o2.by);
    return call(app, "POST", `${P}/sessions`, {
      ...as(o2.by ?? cashier), ...(o2.key ? { key: o2.key } : {}),
      body: { quoteId: q.json["data"].quoteId, paymentMode: "postpaid", ...(o2.mode ? { sessionMode: o2.mode } : {}), ...(o2.body ?? {}) },
    });
  };
  const view = async (id: string, by: Staff = cashier): Promise<Json> => (await call(app, "GET", `${P}/sessions/${id}`, as(by))).json["data"];
  const commands = async (id: string, by: Staff = cashier): Promise<CommandView[]> => (await call(app, "GET", `${P}/sessions/${id}/commands`, as(by))).json["data"].commands;
  const pending = async (id: string, action?: string): Promise<CommandView[]> =>
    (await commands(id)).filter((c) => ["PENDING", "RECEIVED", "TIMED_OUT"].includes(c.status) && (!action || c.action === action));
  const reconcile = async (id: string, by: Staff = cashier) => call(app, "POST", `${P}/sessions/${id}/reconcile`, { ...as(by), body: {} });
  const action = (id: string, body: Json, by: Staff = cashier) => call(app, "POST", `${P}/sessions/${id}/actions`, { ...as(by), body });
  const act = async (id: string, kind: string, extra: Json = {}, by: Staff = cashier) => {
    const v = await view(id, by);
    return action(id, { kind, expectedRevision: v["revision"], ...extra }, by);
  };

  /** What the seat device (through the enrolled edge) would send: a signed DeviceAck over the real ACK intake. */
  const ack = (c: CommandView, status: "RECEIVED" | "APPLIED" | "FAILED", level = "API_OBSERVED", over: Json = {}) => {
    const deviceId = (over["deviceId"] as string | undefined) ?? (c.command["deviceId"] as string);
    const body = {
      ack: {
        protocolVersion: 1, commandId: c.commandId, deviceId, authorityEpoch: epoch, sequence: c.command["sequence"], desiredRevision: c.command["desiredRevision"],
        status, verificationLevel: level, bootId: randomUUID(), observedAt: clock.now.toISOString().replace(/\.\d{3}Z$/, "Z"),
        ...(status === "FAILED" ? { errorCode: "DISPLAY_ERROR" } : {}), ...over,
      },
    };
    const k = keys.get(deviceId) as DeviceKeys;
    return app.inject({ method: "POST", url: `${P}/edge/acks`, remoteAddress: "10.0.0.9", headers: { "x-hatch-device-id": deviceId, "x-hatch-signature": signBody(k, body) }, payload: body });
  };
  /** The common happy path: seat applies the START command at API_OBSERVED, then the coordinator reconciles. */
  const applyStart = async (id: string, level = "API_OBSERVED") => {
    const [c] = await pending(id, "START");
    expectOk((await ack(c as CommandView, "APPLIED", level)).statusCode);
    return reconcile(id);
  };
  const activate = async (stationId: string, o2: Parameters<typeof start>[1] = {}) => {
    const r = await start(stationId, o2);
    if (r.status !== 202) throw new Error(`start failed ${r.status} ${JSON.stringify(r.json)}`);
    const id = r.json["data"].sessionId as string;
    await applyStart(id);
    return id;
  };

  // ---- payments ----------------------------------------------------------------------------------------------------
  const paidIntent = async (stationId: string, seconds = 3600) => {
    expect_(await call(app, "POST", `${P}/stations/${stationId}/reserve`, { ...as(cashier), body: {} }), 200);
    const q = await quote(stationId, seconds);
    const i = await call(app, "POST", `${P}/payments/qris-intents`, { ...as(cashier), body: { quoteId: q.json["data"].quoteId, stationId } });
    expect_(i, 200);
    return { quoteId: q.json["data"].quoteId as string, intentId: i.json["data"].intentId as string, orderId: i.json["data"].providerOrderId as string, amount: q.json["data"].amountIdr as string };
  };
  const settle = async (orderId: string) => {
    mock.settle(orderId);
    await call(app, "POST", `${P}/payments/midtrans/notification`, { key: null, body: mock.notification(orderId) });
    await runner.drain();
  };

  const count = async (sql: string, args: unknown[] = []): Promise<number> => Number((await schema.pool.query(sql, args)).rows[0].n);
  const setEpoch = (e: number) => { epoch = e; };
  return {
    app, pool: schema.pool, clock, world, mock, runner, jobs, opts, owner, ownerB, cashier, cashierA2, edgeId, keys, pair, claim, addStation, stations,
    quote, start, view, commands, pending, reconcile, action, act, ack, applyStart, activate, paidIntent, settle, count, setEpoch,
    epoch: () => epoch,
    close: async () => { await app.close(); await mock.stop(); await schema.drop(); },
  };
}
export type SH = Awaited<ReturnType<typeof sessionHarness>>;

import { expect } from "vitest";
const expectOk = (code: number): void => { expect(code).toBe(200); };
const expect_ = (r: { status: number }, code: number): void => { expect(r.status).toBe(code); };
