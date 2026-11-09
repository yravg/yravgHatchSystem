// T50 test support: its own hatch_t50 database (one schema per test file) plus Ed25519 FIXTURE device keys.
// Every key here is generated per test run and protects nothing; none is a real secret.
import { generateKeyPairSync, randomBytes, sign, type KeyObject } from "node:crypto";
import { canonicalJson } from "@yravg/contracts";
import { buildApp } from "../../services/api/src/app.ts";
import { createPool, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { FIXTURE_KEY, TestClock, fixtureRandom, seedWorld, type Harness } from "../identity/support.ts";

export { call, enrolAndConfirm, login, type Harness } from "../identity/support.ts";

const dbUrl = (name: string): string => {
  const base = process.env["HATCH_PG_URL"];
  if (!base) throw new Error("HATCH_PG_URL is not set; source hatch-env.sh");
  const u = new URL(base);
  u.pathname = `/${name}`;
  return u.toString();
};

export async function isolatedSchema() {
  const admin = createPool(dbUrl("postgres"));
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'hatch_t50'");
  if (exists.rowCount === 0) await admin.query("CREATE DATABASE hatch_t50").catch(() => undefined);
  await admin.end();
  const root = createPool(dbUrl("hatch_t50"));
  const name = `t50_${randomBytes(6).toString("hex")}`;
  await root.query(`CREATE SCHEMA ${name}`);
  const pool = createPool(dbUrl("hatch_t50"), name);
  return { pool, name, drop: async () => { await pool.end(); await root.query(`DROP SCHEMA ${name} CASCADE`); await root.end(); } };
}

export async function harness(): Promise<Harness> {
  const schema = await isolatedSchema();
  await migrateUp(schema.pool);
  const world = await seedWorld(schema.pool);
  const clock = new TestClock();
  const app = buildApp({ identity: { pool: schema.pool, key: FIXTURE_KEY, clock: clock.read, random: fixtureRandom } });
  return { app, pool: schema.pool, clock, world, close: async () => { await app.close(); await schema.drop(); } };
}

const b64u = (b: Buffer): string => b.toString("base64url");

export interface DeviceKeys { publicKey: string; priv: KeyObject }

export function newDeviceKeys(): DeviceKeys {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const raw = publicKey.export({ format: "der", type: "spki" }).subarray(-32);
  return { publicKey: b64u(Buffer.from(raw)), priv: privateKey };
}

export const signText = (k: DeviceKeys, text: string): string => b64u(sign(null, Buffer.from(text), k.priv));
export const pairingProof = (k: DeviceKeys, deviceId: string): string => signText(k, `hatch-pair-v1:${deviceId}:${k.publicKey}`);
export const signBody = (k: DeviceKeys, body: unknown): string => signText(k, canonicalJson(body));
