import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrateDown, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { isolatedSchema } from "./support.ts";

describe("T47 migration 0002", () => {
  let db: Awaited<ReturnType<typeof isolatedSchema>>;
  beforeAll(async () => { db = await isolatedSchema(); });
  afterAll(async () => { await db.drop(); });
  const tables = async (): Promise<string[]> =>
    (await db.pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY 1", [db.name])).rows.map((r) => r.table_name);

  it("applies up, rolls back down to nothing, and applies up again", async () => {
    expect(await migrateUp(db.pool)).toEqual(["0001_identity", "0002_stations_rates", "0003_ledger_payments", "0004_edge_devices", "0005_sessions", "0006_operations"]);
    expect(await tables()).toEqual(expect.arrayContaining(["stations", "rate_rule_versions", "quotes"]));
    expect(await migrateDown(db.pool)).toEqual(["0006_operations", "0005_sessions", "0004_edge_devices", "0003_ledger_payments", "0002_stations_rates", "0001_identity"]);
    expect(await tables()).toEqual(["schema_migrations"]);
    expect(await migrateUp(db.pool)).toEqual(["0001_identity", "0002_stations_rates", "0003_ledger_payments", "0004_edge_devices", "0005_sessions", "0006_operations"]);
  });

  it("a station cannot point at another tenant's outlet", async () => {
    await db.pool.query("INSERT INTO tenants (id, name) VALUES ('00000000-0000-4000-8000-0000000000a1', 'a'), ('00000000-0000-4000-8000-0000000000b1', 'b')");
    await db.pool.query("INSERT INTO outlets (id, tenant_id, name, timezone) VALUES ('00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-0000000000a1', 'o', 'Asia/Jakarta')");
    await expect(db.pool.query(
      "INSERT INTO stations (id, tenant_id, outlet_id, name) VALUES ('00000000-0000-4000-8000-0000000000c3', '00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000a2', 's')")).rejects.toThrow();
  });
});
