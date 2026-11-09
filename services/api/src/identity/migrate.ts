import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

// Plain SQL migrations with an explicit down file, because the roll-back must be testable. Applied names are kept in
// schema_migrations of the connection's search_path schema, so tests can run each file in its own schema.
const DIR = join(dirname(fileURLToPath(import.meta.url)), "migrations");

export function createPool(connectionString: string, schema?: string): pg.Pool {
  return new pg.Pool({ connectionString, max: 8, ...(schema ? { options: `-c search_path=${schema}` } : {}) });
}

const names = (): string[] =>
  readdirSync(DIR)
    .filter((f) => f.endsWith(".up.sql"))
    .map((f) => f.replace(".up.sql", ""))
    .sort();

async function applied(c: pg.PoolClient): Promise<string[]> {
  await c.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  return (await c.query<{ name: string }>("SELECT name FROM schema_migrations ORDER BY name")).rows.map((r) => r.name);
}

async function inTx<T>(pool: pg.Pool, fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const out = await fn(c);
    await c.query("COMMIT");
    return out;
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}

export const migrateUp = (pool: pg.Pool): Promise<string[]> =>
  inTx(pool, async (c) => {
    const done = new Set(await applied(c));
    const ran: string[] = [];
    for (const n of names().filter((x) => !done.has(x))) {
      await c.query(readFileSync(join(DIR, `${n}.up.sql`), "utf8"));
      await c.query("INSERT INTO schema_migrations (name) VALUES ($1)", [n]);
      ran.push(n);
    }
    return ran;
  });

/** Rolls back every applied migration, newest first. */
export const migrateDown = (pool: pg.Pool): Promise<string[]> =>
  inTx(pool, async (c) => {
    const done = await applied(c);
    const ran: string[] = [];
    for (const n of done.reverse()) {
      await c.query(readFileSync(join(DIR, `${n}.down.sql`), "utf8"));
      await c.query("DELETE FROM schema_migrations WHERE name = $1", [n]);
      ran.push(n);
    }
    return ran;
  });
