// Contract: idempotent FIXTURE seed for the preview database only. Skips when the fixture tenant exists. Passwords are
// generated once and written ONLY to the credentials file (mode 600); they are never printed or logged.
// usage: DATABASE_URL=... node scripts/seed-preview.ts [credentials-file]
import { randomBytes, randomUUID } from "node:crypto";
import { chmodSync, writeFileSync } from "node:fs";
import type { Pool } from "pg";
import { hashPassword } from "../src/identity/crypto.ts";
import { createPool, migrateUp } from "../src/identity/migrate.ts";

const DEFAULT_FILE = "/home/user/dev/HatchSystem/preview-credentials.txt";
export const TENANT = "Demo Venue (fixture)";
export const OTHER_TENANT = "Other Venue (fixture)";
/** Fixed id so the walkthrough can show a station that belongs to another tenant. */
export const OTHER_STATION_ID = "00000000-0000-4000-8000-0000000000b1";

export async function seedPreview(pool: Pool, credentialsFile: string): Promise<"seeded" | "already seeded"> {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended('seed-preview', 1))");
    if ((await c.query("SELECT 1 FROM tenants WHERE name = $1", [TENANT])).rowCount) { await c.query("ROLLBACK"); return "already seeded"; }
    const [tenant, outlet, owner, cashier, otherTenant, otherOutlet] = Array.from({ length: 6 }, () => randomUUID());
    const pw = { owner: randomBytes(18).toString("base64url"), cashier: randomBytes(18).toString("base64url") };
    const email = { owner: "owner@demo-fixture.invalid", cashier: "cashier@demo-fixture.invalid" };
    await c.query("INSERT INTO tenants (id, name) VALUES ($1, $2), ($3, $4)", [tenant, TENANT, otherTenant, OTHER_TENANT]);
    await c.query("INSERT INTO outlets (id, tenant_id, name, timezone) VALUES ($1, $2, 'Demo Outlet (fixture)', 'Asia/Jakarta'), ($3, $4, 'Other Outlet (fixture)', 'Asia/Jakarta')", [outlet, tenant, otherOutlet, otherTenant]);
    for (const [id, who, role, grantOutlet] of [[owner, "owner", "owner", null], [cashier, "cashier", "cashier", outlet]] as const) {
      await c.query("INSERT INTO staff (id, tenant_id, email, display_name, password_hash) VALUES ($1, $2, $3, $4, $5)", [id, tenant, email[who], `${who} (fixture)`, await hashPassword(pw[who])]);
      await c.query("INSERT INTO role_grants (id, tenant_id, staff_id, outlet_id, role) VALUES ($1, $2, $3, $4, $5)", [randomUUID(), tenant, id, grantOutlet, role]);
    }
    for (const name of ["Station 1 (fixture)", "Station 2 (fixture)"]) {
      await c.query("INSERT INTO stations (id, tenant_id, outlet_id, name) VALUES ($1, $2, $3, $4)", [randomUUID(), tenant, outlet, name]);
    }
    await c.query("INSERT INTO stations (id, tenant_id, outlet_id, name) VALUES ($1, $2, $3, 'Other Station (fixture)')", [OTHER_STATION_ID, otherTenant, otherOutlet]);
    await c.query(
      "INSERT INTO rate_rule_versions (id, tenant_id, outlet_id, version, effective_from, rate_per_hour_idr, created_by) VALUES ($1, $2, $3, 1, '2026-01-01T00:00:00Z', 12000, $4)",
      [randomUUID(), tenant, outlet, owner]);
    writeFileSync(credentialsFile, [
      "HatchSystem preview FIXTURE logins (sandbox data, not real accounts). Keep this file private.",
      `owner    email: ${email.owner}    password: ${pw.owner}    (needs 2FA enrolment before it can do anything; use cashier for the walkthrough)`,
      `cashier  email: ${email.cashier}    password: ${pw.cashier}`,
      `other-tenant station id (for the 404 check): ${OTHER_STATION_ID}`, "",
    ].join("\n"), { mode: 0o600 });
    chmodSync(credentialsFile, 0o600);
    await c.query("COMMIT");
    return "seeded";
  } catch (e) {
    await c.query("ROLLBACK").catch(() => undefined);
    throw e;
  } finally {
    c.release();
  }
}

if (import.meta.main) {
  const url = process.env["DATABASE_URL"] ?? process.env["HATCH_PG_URL"];
  if (!url) { console.error("DATABASE_URL (or HATCH_PG_URL) is not set"); process.exit(2); }
  const file = process.argv[2] ?? DEFAULT_FILE;
  const pool = createPool(url);
  try {
    await migrateUp(pool);
    console.log(`seed-preview: ${await seedPreview(pool, file)} (credentials file: ${file})`);
  } catch (e) {
    console.error("seed-preview failed:", e instanceof Error ? e.message : "unknown error");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
