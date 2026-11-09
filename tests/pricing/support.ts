import { randomBytes } from "node:crypto";
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

/** One schema per test file inside the dedicated hatch_t47 database. */
export async function isolatedSchema() {
  const admin = createPool(dbUrl("postgres"));
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'hatch_t47'");
  if (exists.rowCount === 0) await admin.query("CREATE DATABASE hatch_t47").catch(() => undefined);
  await admin.end();
  const root = createPool(dbUrl("hatch_t47"));
  const name = `t47_${randomBytes(6).toString("hex")}`;
  await root.query(`CREATE SCHEMA ${name}`);
  const pool = createPool(dbUrl("hatch_t47"), name);
  return {
    pool, name,
    drop: async () => { await pool.end(); await root.query(`DROP SCHEMA ${name} CASCADE`); await root.end(); },
  };
}

export async function harness(): Promise<Harness> {
  const schema = await isolatedSchema();
  await migrateUp(schema.pool);
  const world = await seedWorld(schema.pool);
  const clock = new TestClock();
  const app = buildApp({ identity: { pool: schema.pool, key: FIXTURE_KEY, clock: clock.read, random: fixtureRandom } });
  return { app, pool: schema.pool, clock, world, close: async () => { await app.close(); await schema.drop(); } };
}
