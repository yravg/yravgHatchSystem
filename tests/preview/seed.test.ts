import { mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrateUp } from "../../services/api/src/identity/migrate.ts";
import { seedPreview } from "../../services/api/scripts/seed-preview.ts";
import { isolatedSchema } from "../identity/support.ts";

const schema = await isolatedSchema();
beforeAll(async () => { await migrateUp(schema.pool); });
afterAll(async () => { await schema.drop(); });

const counts = async () => Object.fromEntries(await Promise.all(["tenants", "outlets", "staff", "role_grants", "stations", "rate_rule_versions"].map(
  async (t) => [t, (await schema.pool.query(`SELECT count(*)::int AS n FROM ${t}`)).rows[0].n as number])));

describe("seed-preview", () => {
  it("is idempotent, labels fixtures, and keeps passwords out of its output", async () => {
    const file = join(mkdtempSync(join(tmpdir(), "seed-")), "creds.txt");
    const first = await seedPreview(schema.pool, file);
    const after1 = await counts();
    const creds = readFileSync(file, "utf8");
    const second = await seedPreview(schema.pool, file);
    expect(await counts()).toEqual(after1);
    expect(after1).toMatchObject({ tenants: 2, outlets: 2, staff: 2, stations: 3, rate_rule_versions: 1 });
    expect(readFileSync(file, "utf8")).toBe(creds); // second run does not rotate or rewrite
    expect(statSync(file).mode & 0o777).toBe(0o600);
    expect((await schema.pool.query("SELECT name FROM tenants WHERE name LIKE 'Demo Venue%'")).rows[0].name).toBe("Demo Venue (fixture)");
    const password = /cashier[^\n]*password: (\S+)/.exec(creds)?.[1] ?? "";
    expect(password.length).toBeGreaterThanOrEqual(16);
    expect(JSON.stringify([first, second])).not.toContain(password);
  });
});
