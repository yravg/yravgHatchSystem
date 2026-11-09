import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrateDown, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { isolatedSchema } from "./support.ts";

describe("migration 0004 (edge devices)", () => {
  let db: Awaited<ReturnType<typeof isolatedSchema>>;
  beforeAll(async () => { db = await isolatedSchema(); });
  afterAll(async () => { await db.drop(); });

  const tables = async (): Promise<string[]> =>
    (await db.pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY 1", [db.name])).rows.map((r) => r.table_name);

  it("applies up, rolls back to nothing, applies up again", async () => {
    expect(await migrateUp(db.pool)).toContain("0004_edge_devices");
    for (const t of ["devices", "pairing_challenges", "pairing_attempts", "outlet_authority", "edge_acks"]) expect(await tables()).toContain(t);
    expect(await migrateDown(db.pool)).toContain("0004_edge_devices");
    expect(await tables()).toEqual(["schema_migrations"]);
    expect(await migrateUp(db.pool)).toContain("0004_edge_devices");
  });
});
