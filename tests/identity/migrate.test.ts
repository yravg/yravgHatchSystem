import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { schemaColumns } from "../../services/api/src/identity/schema.ts";
import { migrateDown, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { isolatedSchema } from "./support.ts";

describe("identity migrations", () => {
  let db: Awaited<ReturnType<typeof isolatedSchema>>;
  beforeAll(async () => { db = await isolatedSchema(); });
  afterAll(async () => { await db.drop(); });

  const tables = async (): Promise<string[]> =>
    (await db.pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY 1", [db.name])).rows.map((r) => r.table_name);

  it("applies up, rolls back down to nothing, and applies up again", async () => {
    expect(await migrateUp(db.pool)).toEqual(["0001_identity", "0002_stations_rates", "0003_ledger_payments"]);
    expect(await tables()).toContain("staff_sessions");
    expect(await migrateUp(db.pool)).toEqual([]); // already applied
    expect(await migrateDown(db.pool)).toEqual(["0003_ledger_payments", "0002_stations_rates", "0001_identity"]);
    expect(await tables()).toEqual(["schema_migrations"]);
    expect(await migrateUp(db.pool)).toEqual(["0001_identity", "0002_stations_rates", "0003_ledger_payments"]);
  });

  it("the drizzle schema has exactly the columns the migration creates", async () => {
    const rows = (await db.pool.query<{ table_name: string; column_name: string }>(
      "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = $1", [db.name])).rows;
    for (const [name, want] of Object.entries(schemaColumns())) {
      const got = rows.filter((r) => r.table_name === name).map((r) => r.column_name).sort();
      expect({ name, columns: got }).toEqual({ name, columns: want });
    }
  });

  it("a child row cannot point at another tenant's parent", async () => {
    await db.pool.query("INSERT INTO tenants (id, name) VALUES ('00000000-0000-4000-8000-0000000000a1', 'a'), ('00000000-0000-4000-8000-0000000000b1', 'b')");
    await db.pool.query("INSERT INTO outlets (id, tenant_id, name, timezone) VALUES ('00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-0000000000a1', 'o', 'Asia/Jakarta')");
    await db.pool.query("INSERT INTO staff (id, tenant_id, email, display_name, password_hash) VALUES ('00000000-0000-4000-8000-0000000000b3', '00000000-0000-4000-8000-0000000000b1', 'x@fixture.invalid', 'x', 'h')");
    await expect(db.pool.query(
      "INSERT INTO role_grants (id, tenant_id, staff_id, outlet_id, role) VALUES ('00000000-0000-4000-8000-0000000000c4', '00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000b3', '00000000-0000-4000-8000-0000000000a2', 'cashier')",
    )).rejects.toThrow();
  });

  it("only an owner grant may span every outlet", async () => {
    await expect(db.pool.query(
      "INSERT INTO role_grants (id, tenant_id, staff_id, outlet_id, role) VALUES ('00000000-0000-4000-8000-0000000000c5', '00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000b3', NULL, 'cashier')",
    )).rejects.toThrow();
  });
});
