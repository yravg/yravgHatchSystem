import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrateDown, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { isolatedSchema } from "./support.ts";

const ALL = ["0001_identity", "0002_stations_rates", "0003_ledger_payments", "0004_edge_devices", "0005_sessions"];

describe("T48 migration 0003", () => {
  let db: Awaited<ReturnType<typeof isolatedSchema>>;
  const tenant = randomUUID(); const tenant2 = randomUUID(); const outlet = randomUUID(); const outlet2 = randomUUID();
  beforeAll(async () => { db = await isolatedSchema(); });
  afterAll(async () => { await db.drop(); });
  const tables = async (): Promise<string[]> =>
    (await db.pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY 1", [db.name])).rows.map((r) => r.table_name);

  it("applies up, rolls back down to nothing, and applies up again", async () => {
    expect(await migrateUp(db.pool)).toEqual(ALL);
    expect(await tables()).toEqual(expect.arrayContaining(["ledger_transactions", "ledger_entries", "ledger_balances", "payment_intents", "payment_allocations", "refunds", "provider_events", "outbox"]));
    expect(await migrateDown(db.pool)).toEqual([...ALL].reverse());
    expect(await tables()).toEqual(["schema_migrations"]);
    expect(await migrateUp(db.pool)).toEqual(ALL);
    await db.pool.query("INSERT INTO tenants (id, name) VALUES ($1, 'a'), ($2, 'b')", [tenant, tenant2]);
    await db.pool.query("INSERT INTO outlets (id, tenant_id, name, timezone) VALUES ($1, $2, 'o', 'Asia/Jakarta'), ($3, $4, 'o', 'Asia/Jakarta')", [outlet, tenant, outlet2, tenant2]);
  });

  const insertTxn = async (c: { query: (q: string, p?: unknown[]) => Promise<unknown> }, id: string, t: string, o: string, src: string) =>
    c.query("INSERT INTO ledger_transactions (id, tenant_id, outlet_id, source_event, kind, actor_id) VALUES ($1, $2, $3, $4, 'manual', $5)", [id, t, o, src, randomUUID()]);
  const entry = (c: { query: (q: string, p?: unknown[]) => Promise<unknown> }, txn: string, t: string, o: string, seq: number, acct: string, d: number, cr: number) =>
    c.query("INSERT INTO ledger_entries (id, transaction_id, tenant_id, outlet_id, seq, account, debit_idr, credit_idr) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [randomUUID(), txn, t, o, seq, acct, d, cr]);

  it("the database refuses an unbalanced transaction at commit", async () => {
    const c = await db.pool.connect();
    try {
      await c.query("BEGIN");
      const id = randomUUID();
      await insertTxn(c, id, tenant, outlet, "unbalanced-1");
      await entry(c, id, tenant, outlet, 1, "cash", 100, 0);
      await entry(c, id, tenant, outlet, 2, "sales_revenue", 0, 99);
      await expect(c.query("COMMIT")).rejects.toThrow(/balanced/);
    } finally { await c.query("ROLLBACK").catch(() => undefined); c.release(); }
    expect((await db.pool.query("SELECT 1 FROM ledger_transactions WHERE source_event = 'unbalanced-1'")).rowCount).toBe(0);
  });

  it("the database refuses to update or delete a ledger entry or transaction", async () => {
    const id = randomUUID();
    const c = await db.pool.connect();
    try {
      await c.query("BEGIN");
      await insertTxn(c, id, tenant, outlet, "ok-1");
      await entry(c, id, tenant, outlet, 1, "cash", 100, 0);
      await entry(c, id, tenant, outlet, 2, "sales_revenue", 0, 100);
      await c.query("COMMIT");
    } finally { c.release(); }
    await expect(db.pool.query("UPDATE ledger_entries SET debit_idr = 1 WHERE transaction_id = $1", [id])).rejects.toThrow(/append-only/);
    await expect(db.pool.query("DELETE FROM ledger_entries WHERE transaction_id = $1", [id])).rejects.toThrow(/append-only/);
    await expect(db.pool.query("UPDATE ledger_transactions SET kind = 'x' WHERE id = $1", [id])).rejects.toThrow(/append-only/);
    await expect(db.pool.query("DELETE FROM ledger_transactions WHERE id = $1", [id])).rejects.toThrow(/append-only/);
  });

  it("source event is unique per tenant but may repeat across tenants", async () => {
    const mk = async (t: string, o: string, src: string) => {
      const id = randomUUID(); const c = await db.pool.connect();
      try { await c.query("BEGIN"); await insertTxn(c, id, t, o, src); await entry(c, id, t, o, 1, "cash", 5, 0); await entry(c, id, t, o, 2, "sales_revenue", 0, 5); await c.query("COMMIT"); }
      catch (e) { await c.query("ROLLBACK"); throw e; } finally { c.release(); }
    };
    await mk(tenant, outlet, "shared-src");
    await expect(mk(tenant, outlet, "shared-src")).rejects.toThrow(/unique|duplicate/);
    await expect(mk(tenant2, outlet2, "shared-src")).resolves.toBeUndefined();
  });

  it("a payment intent cannot go back to pending and its amount is frozen", async () => {
    const s = randomUUID(); const q = randomUUID(); const i = randomUUID();
    await db.pool.query("INSERT INTO stations (id, tenant_id, outlet_id, name) VALUES ($1, $2, $3, 'S')", [s, tenant, outlet]);
    await db.pool.query("INSERT INTO rate_rule_versions (id, tenant_id, outlet_id, version, effective_from, rate_per_hour_idr, created_by) VALUES ($1, $2, $3, 1, now(), 1000, $4)", [randomUUID(), tenant, outlet, randomUUID()]);
    const rule = (await db.pool.query("SELECT id FROM rate_rule_versions WHERE tenant_id = $1", [tenant])).rows[0].id;
    await db.pool.query("INSERT INTO quotes (id, tenant_id, outlet_id, station_id, rule_version_id, segments, billable_seconds, exact_numerator, exact_denominator, amount_idr, minimum_applied, created_by) VALUES ($1, $2, $3, $4, $5, '[]', 0, '0', '1', 1000, false, $6)", [q, tenant, outlet, s, rule, randomUUID()]);
    await db.pool.query(
      "INSERT INTO payment_intents (id, tenant_id, outlet_id, quote_id, station_id, provider_order_id, merchant_id, amount_idr, status, created_by, expires_at, station_reserved_by, station_reserved_at) VALUES ($1, $2, $3, $4, $5, 'ord-1', 'M', 1000, 'settled', $6, now(), $6, now())",
      [i, tenant, outlet, q, s, randomUUID()]);
    await expect(db.pool.query("UPDATE payment_intents SET status = 'pending' WHERE id = $1", [i])).rejects.toThrow(/transition/);
    await expect(db.pool.query("UPDATE payment_intents SET amount_idr = 5 WHERE id = $1", [i])).rejects.toThrow(/immutable|transition/);
    await expect(db.pool.query("INSERT INTO refunds (id, tenant_id, outlet_id, intent_id, amount_idr, status, reason) VALUES ($1, $2, $3, $4, 1000, 'refunded', 'x')", [randomUUID(), tenant, outlet, i])).rejects.toThrow();
  });
});
