import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrateDown, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { isolatedSchema } from "./support.ts";

const ALL = ["0001_identity", "0002_stations_rates", "0003_ledger_payments", "0004_edge_devices", "0005_sessions", "0006_operations"];

describe("migration 0006 (operations)", () => {
  let db: Awaited<ReturnType<typeof isolatedSchema>>;
  beforeAll(async () => { db = await isolatedSchema(); });
  afterAll(async () => { await db.drop(); });
  const tables = async (): Promise<string[]> =>
    (await db.pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY 1", [db.name])).rows.map((r) => r.table_name);

  it("applies up, rolls back to nothing, applies up again", async () => {
    expect(await migrateUp(db.pool)).toEqual(ALL);
    expect(await tables()).toEqual(expect.arrayContaining(["stock_items", "stock_balances", "stock_moves", "menu_items", "recipe_versions", "recipe_lines", "orders", "order_lines", "order_payments", "order_refunds", "registers", "shifts", "shift_close_policies", "day_closes", "ops_audit_events"]));
    expect(await migrateDown(db.pool)).toEqual([...ALL].reverse());
    expect(await tables()).toEqual(["schema_migrations"]);
    expect(await migrateUp(db.pool)).toEqual(ALL);
  });

  it("rolling only 0006 back restores the T48 ledger kinds and leaves earlier tables intact", async () => {
    const guard = (await db.pool.query("SELECT pg_get_constraintdef(oid) AS d FROM pg_constraint WHERE conname = 'ledger_transactions_kind_check'")).rows[0].d as string;
    expect(guard).toContain("order_sale");
    const sql = (await import("node:fs")).readFileSync(new URL("../../services/api/src/identity/migrations/0006_operations.down.sql", import.meta.url), "utf8");
    await db.pool.query(sql);
    const after = (await db.pool.query("SELECT pg_get_constraintdef(oid) AS d FROM pg_constraint WHERE conname = 'ledger_transactions_kind_check'")).rows[0].d as string;
    expect(after).not.toContain("order_sale");
    expect(await tables()).toEqual(expect.arrayContaining(["sessions", "ledger_transactions", "payment_intents"]));
    expect(await tables()).not.toContain("stock_moves");
  });
});
