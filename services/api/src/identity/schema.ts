import { getTableColumns, getTableName } from "drizzle-orm";
import { bigint, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Mirrors migrations/0001_identity.up.sql; a test compares the column names so the two cannot drift silently.
const tz = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  revision: integer("revision").notNull().default(1),
  createdAt: tz("created_at").notNull().defaultNow(),
});

export const outlets = pgTable("outlets", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  name: text("name").notNull(),
  timezone: text("timezone").notNull(),
  businessDayCutoff: text("business_day_cutoff").notNull().default("04:00"),
  configVersion: integer("config_version").notNull().default(1),
  revision: integer("revision").notNull().default(1),
  createdAt: tz("created_at").notNull().defaultNow(),
});

export const staff = pgTable("staff", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  status: text("status").notNull().default("active"),
  revision: integer("revision").notNull().default(1),
  createdAt: tz("created_at").notNull().defaultNow(),
});

export const roleGrants = pgTable("role_grants", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  staffId: uuid("staff_id").notNull(),
  outletId: uuid("outlet_id"),
  role: text("role").notNull(),
  grantedBy: uuid("granted_by"),
  revokedAt: tz("revoked_at"),
  revision: integer("revision").notNull().default(1),
  createdAt: tz("created_at").notNull().defaultNow(),
});

export const staffSessions = pgTable("staff_sessions", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  staffId: uuid("staff_id").notNull(),
  outletId: uuid("outlet_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  csrfHash: text("csrf_hash").notNull(),
  mfaState: text("mfa_state").notNull(),
  stepUpUntil: tz("step_up_until"),
  source: text("source").notNull(),
  createdAt: tz("created_at").notNull(),
  expiresAt: tz("expires_at").notNull(),
  revokedAt: tz("revoked_at"),
});

export const mfaFactors = pgTable("mfa_factors", {
  staffId: uuid("staff_id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  secretEnc: text("secret_enc").notNull(),
  status: text("status").notNull(),
  lastUsedStep: bigint("last_used_step", { mode: "number" }).notNull().default(0),
  createdAt: tz("created_at").notNull(),
  confirmedAt: tz("confirmed_at"),
});

export const mfaRecoveryCodes = pgTable("mfa_recovery_codes", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  staffId: uuid("staff_id").notNull(),
  codeHash: text("code_hash").notNull(),
  usedAt: tz("used_at"),
  createdAt: tz("created_at").notNull(),
});

export const authAttempts = pgTable(
  "auth_attempts",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    kind: text("kind").notNull(),
    staffId: uuid("staff_id"),
    source: text("source").notNull(),
    at: tz("at").notNull(),
  },
  (t) => [index("auth_attempts_staff_idx").on(t.kind, t.staffId, t.at)],
);

export const idempotencyKeys = pgTable("idempotency_keys", {
  tenantId: uuid("tenant_id").notNull(),
  actorId: uuid("actor_id").notNull(),
  route: text("route").notNull(),
  key: uuid("key").notNull(),
  requestHash: text("request_hash").notNull(),
  responseEnc: text("response_enc").notNull(),
  createdAt: tz("created_at").notNull(),
});

export const identityAuditEvents = pgTable("identity_audit_events", {
  id: uuid("id").primaryKey(),
  tenantId: uuid("tenant_id").notNull(),
  outletId: uuid("outlet_id"),
  actorId: uuid("actor_id"),
  subjectStaffId: uuid("subject_staff_id"),
  kind: text("kind").notNull(),
  detail: jsonb("detail").notNull().default({}),
  at: tz("at").notNull(),
});

/** table name -> sorted column names, so a test can prove this file and the SQL migration agree. */
export function schemaColumns(): Record<string, string[]> {
  const tables = [tenants, outlets, staff, roleGrants, staffSessions, mfaFactors, mfaRecoveryCodes, authAttempts, idempotencyKeys, identityAuditEvents];
  return Object.fromEntries(tables.map((t) => [getTableName(t), Object.values(getTableColumns(t)).map((c) => c.name).sort()]));
}
