import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrateDown, migrateUp } from "../../services/api/src/identity/migrate.ts";
import { isolatedSchema } from "./support.ts";

const ALL = ["0001_identity", "0002_stations_rates", "0003_ledger_payments", "0004_edge_devices", "0005_sessions", "0006_operations"];

describe("migration 0005 (sessions)", () => {
  let db: Awaited<ReturnType<typeof isolatedSchema>>;
  beforeAll(async () => { db = await isolatedSchema(); });
  afterAll(async () => { await db.drop(); });
  const tables = async (): Promise<string[]> =>
    (await db.pool.query<{ table_name: string }>("SELECT table_name FROM information_schema.tables WHERE table_schema = $1 ORDER BY 1", [db.name])).rows.map((r) => r.table_name);

  it("applies up, rolls back to nothing, applies up again", async () => {
    expect(await migrateUp(db.pool)).toEqual(ALL);
    expect(await tables()).toEqual(expect.arrayContaining(["sessions", "session_events", "session_commands", "session_leases", "session_transfers", "session_transfer_quotes", "session_outbox", "session_station_holds", "zone_rate_versions"]));
    expect(await migrateDown(db.pool)).toEqual([...ALL].reverse());
    expect(await tables()).toEqual(["schema_migrations"]);
    expect(await migrateUp(db.pool)).toEqual(ALL);
  });

  it("the up file lets a settled intent move to refund_pending (session start failed)", async () => {
    const guard = (await db.pool.query("SELECT pg_get_functiondef('t48_intent_guard'::regproc) AS d")).rows[0].d as string;
    expect(guard).toContain("OLD.status = 'settled'");
  });

  it("session events are append-only", async () => {
    const t = "00000000-0000-4000-8000-0000000000a1";
    const o = "00000000-0000-4000-8000-0000000000b1";
    await db.pool.query("INSERT INTO tenants (id, name) VALUES ($1, 'a')", [t]);
    await db.pool.query("INSERT INTO outlets (id, tenant_id, name, timezone) VALUES ($1, $2, 'o', 'Asia/Jakarta')", [o, t]);
    const cols = (await db.pool.query("SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = 'session_events'", [db.name])).rows.map((r) => r.column_name);
    expect(cols).toEqual(expect.arrayContaining(["session_id", "kind", "data", "at"]));
    const triggers = (await db.pool.query("SELECT tgname FROM pg_trigger WHERE tgrelid = 'session_events'::regclass AND NOT tgisinternal")).rows.map((r) => r.tgname);
    expect(triggers).toContain("session_events_append_only");
  });
});
