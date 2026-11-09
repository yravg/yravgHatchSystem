import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { DomainError } from "@yravg/domain";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import type { Pool } from "pg";
import { permissionsFor, requiresMfa, ROLES, STEP_UP_PERMISSIONS, type Role } from "../tenancy/permissions.ts";
import { hashPassword, hmac, open, randomToken, seal, sha256, verifyPassword } from "./crypto.ts";
import { connect, type Db, type Q, type Tx } from "./db.ts";
import { IdentityError, type IdentityErrorCode } from "./errors.ts";
import { lockAndCheck, recordFailure } from "./limiter.ts";
import * as t from "./schema.ts";
import { base32Decode, base32Encode, matchTotp, otpauthUri } from "./totp.ts";

// ASSUMPTION: these numbers are recommended fixtures (D02/D24 are not owner-locked). Wrong-attempt limit 10 is from the ticket.
export interface IdentityConfig {
  sessionTtlSeconds: number;
  stepUpTtlSeconds: number;
  maxWrongAttempts: number;
  attemptWindowSeconds: number;
  recoveryCodeCount: number;
}
export const DEFAULT_CONFIG: IdentityConfig = {
  sessionTtlSeconds: 12 * 3600,
  stepUpTtlSeconds: 300,
  maxWrongAttempts: 10,
  attemptWindowSeconds: 900,
  recoveryCodeCount: 10,
};

export interface IdentityDeps {
  pool: Pool;
  /** 32-byte server key: seals TOTP secrets and idempotency snapshots, keys the recovery-code hash. */
  key: Buffer;
  clock?: () => Date;
  random?: (bytes: number) => Buffer;
  config?: Partial<IdentityConfig>;
}

export type MfaState = "pending" | "enrollment_required" | "verified" | "not_required";

export interface Principal {
  sessionId: string;
  staffId: string;
  tenantId: string;
  outletId: string;
  displayName: string;
  roles: Role[];
  permissions: ReadonlySet<string>;
  mfaState: MfaState;
  stepUpUntil: Date | null;
  source: string;
}

/** A wrong code is a normal result, not a throw, so that its attempt row commits and counts toward the limit. */
export type Outcome<D> = { ok: true; data: D; revision?: number } | { ok: false; error: IdentityErrorCode };

const SESSION_COOKIE = "hatch_session";
const eqHash = (a: string, b: string): boolean => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export class IdentityService {
  readonly db: Db;
  readonly cfg: IdentityConfig;
  readonly now: () => Date;
  private readonly rnd: (n: number) => Buffer;
  private readonly recoveryKey: Buffer;
  private dummyHash: string | undefined;

  readonly deps: IdentityDeps;

  constructor(deps: IdentityDeps) {
    this.deps = deps;
    this.db = connect(deps.pool);
    this.cfg = { ...DEFAULT_CONFIG, ...deps.config };
    this.now = deps.clock ?? (() => new Date());
    this.rnd = deps.random ?? randomBytes;
    this.recoveryKey = createHmac("sha256", deps.key).update("hatch:recovery:v1").digest();
  }

  // ---- sessions -------------------------------------------------------------------------------------------------

  private async grantsOf(q: Q, tenantId: string, staffId: string) {
    return q.select({ id: t.roleGrants.id, role: t.roleGrants.role, outletId: t.roleGrants.outletId }).from(t.roleGrants)
      .where(and(eq(t.roleGrants.tenantId, tenantId), eq(t.roleGrants.staffId, staffId), isNull(t.roleGrants.revokedAt)));
  }

  async login(input: { email: string; password: string; outletId?: string | undefined }, source: string) {
    const now = this.now();
    const row = (await this.db.select().from(t.staff).where(sql`lower(${t.staff.email}) = ${input.email.toLowerCase()}`))[0];
    this.dummyHash ??= await hashPassword(randomToken());
    const outcome = await this.db.transaction(async (tx) => {
      await lockAndCheck(tx, this.cfg, now, "password", row?.id ?? null, source);
      const good = await verifyPassword(input.password, row?.passwordHash ?? this.dummyHash!);
      if (!row || !good || row.status !== "active") {
        await recordFailure(tx, now, "password", row?.id ?? null, source);
        return undefined;
      }
      return row;
    });
    if (!outcome) throw new IdentityError("UNAUTHENTICATED"); // same answer for unknown email and wrong password
    const grants = await this.grantsOf(this.db, outcome.tenantId, outcome.id);
    if (grants.length === 0) throw new DomainError("AUTH_FORBIDDEN");
    const reachable = grants.some((g) => g.outletId === null)
      ? (await this.db.select({ id: t.outlets.id }).from(t.outlets).where(eq(t.outlets.tenantId, outcome.tenantId)).orderBy(asc(t.outlets.name), asc(t.outlets.id))).map((o) => o.id)
      : [...new Set(grants.map((g) => g.outletId!))].sort();
    const outletId = input.outletId ?? reachable[0];
    if (!outletId || !reachable.includes(outletId)) throw new DomainError("NOT_FOUND");
    const roles = this.rolesAt(grants, outletId);
    const factor = (await this.db.select().from(t.mfaFactors).where(eq(t.mfaFactors.staffId, outcome.id)))[0];
    const mfaState: MfaState = factor?.status === "active" ? "pending" : requiresMfa(roles) ? "enrollment_required" : "not_required";
    const token = randomToken();
    const csrf = randomToken();
    const expiresAt = new Date(now.getTime() + this.cfg.sessionTtlSeconds * 1000);
    await this.db.transaction(async (tx) => {
      await tx.insert(t.staffSessions).values({
        id: randomUUID(), tenantId: outcome.tenantId, staffId: outcome.id, outletId, tokenHash: sha256(token), csrfHash: sha256(csrf),
        mfaState, source, createdAt: now, expiresAt,
      });
      await this.audit(tx, { tenantId: outcome.tenantId, outletId, actorId: outcome.id, kind: "session.login", detail: { mfaState } });
    });
    return { token, maxAge: this.cfg.sessionTtlSeconds, csrf, expiresAt, mfaState, staffId: outcome.id, tenantId: outcome.tenantId, outletId, displayName: outcome.displayName, roles, permissions: [...permissionsFor(roles)].sort() };
  }

  private rolesAt(grants: { role: string; outletId: string | null }[], outletId: string): Role[] {
    return [...new Set(grants.filter((g) => g.outletId === null || g.outletId === outletId).map((g) => g.role))].filter((r): r is Role => (ROLES as readonly string[]).includes(r));
  }

  /** Resolves the cookie to a Principal. Grants are read on every request, so a revoked grant bites immediately. */
  async authenticate(cookieHeader: string | undefined, method: string, csrfHeader: string | undefined, source: string): Promise<Principal> {
    const token = cookieHeader?.split(";").map((p) => p.trim().split("=")).find(([k]) => k === SESSION_COOKIE)?.[1];
    if (!token) throw new IdentityError("UNAUTHENTICATED");
    const now = this.now();
    const row = (await this.db.select({ s: t.staffSessions, name: t.staff.displayName, status: t.staff.status }).from(t.staffSessions)
      .innerJoin(t.staff, and(eq(t.staff.tenantId, t.staffSessions.tenantId), eq(t.staff.id, t.staffSessions.staffId)))
      .where(eq(t.staffSessions.tokenHash, sha256(token))))[0];
    // now < createdAt: the clock went backwards, so no age or expiry can be trusted; fail closed.
    if (!row || row.s.revokedAt || row.s.expiresAt <= now || now < row.s.createdAt || row.status !== "active") throw new IdentityError("UNAUTHENTICATED");
    if (method !== "GET" && method !== "HEAD" && !(csrfHeader && eqHash(sha256(csrfHeader), row.s.csrfHash))) {
      throw new DomainError("AUTH_FORBIDDEN", { reason: "csrf" });
    }
    const roles = this.rolesAt(await this.grantsOf(this.db, row.s.tenantId, row.s.staffId), row.s.outletId);
    let mfaState = row.s.mfaState as MfaState;
    if (mfaState === "not_required" && requiresMfa(roles)) mfaState = "enrollment_required"; // promoted after login
    return {
      sessionId: row.s.id, staffId: row.s.staffId, tenantId: row.s.tenantId, outletId: row.s.outletId, displayName: row.name,
      roles, permissions: permissionsFor(roles), mfaState, stepUpUntil: row.s.stepUpUntil, source,
    };
  }

  /** Ordinary business routes: the second factor must be satisfied (or not required). Fails closed otherwise. */
  requireFull(p: Principal): void {
    if (p.mfaState === "pending" || p.mfaState === "enrollment_required") throw new IdentityError("MFA_REQUIRED", { state: p.mfaState });
  }

  stepUpValid(p: Principal): boolean {
    const now = this.now();
    const until = p.stepUpUntil;
    return !!until && until > now && now.getTime() >= until.getTime() - this.cfg.stepUpTtlSeconds * 1000;
  }

  /** deny default (403), then step-up for the sensitive permissions. */
  requirePermission(p: Principal, permission: string): void {
    this.requireFull(p);
    if (!p.permissions.has(permission)) throw new DomainError("AUTH_FORBIDDEN");
    if (STEP_UP_PERMISSIONS.has(permission) && !this.stepUpValid(p)) throw new IdentityError("STEP_UP_REQUIRED");
  }

  async logout(p: Principal): Promise<void> {
    await this.db.update(t.staffSessions).set({ revokedAt: this.now() }).where(eq(t.staffSessions.id, p.sessionId));
  }

  async view(p: Principal) {
    return { staffId: p.staffId, tenantId: p.tenantId, outletId: p.outletId, displayName: p.displayName, roles: p.roles, permissions: [...p.permissions].sort(), mfaState: p.mfaState, stepUpUntil: p.stepUpUntil && this.stepUpValid(p) ? p.stepUpUntil.toISOString() : null };
  }

  // ---- MFA ------------------------------------------------------------------------------------------------------

  private aad = (staffId: string): string => `mfa:${staffId}`;

  async enroll(tx: Tx, p: Principal): Promise<Outcome<{ secret: string; otpauthUri: string }>> {
    const now = this.now();
    const existing = (await tx.select().from(t.mfaFactors).where(eq(t.mfaFactors.staffId, p.staffId)).for("update"))[0];
    if (existing?.status === "active") throw new IdentityError("MFA_ALREADY_ENROLLED");
    const secret = this.rnd(20);
    const sealed = seal(this.deps.key, base32Encode(secret), this.aad(p.staffId));
    await tx.execute(sql`
      INSERT INTO mfa_factors (staff_id, tenant_id, secret_enc, status, last_used_step, created_at)
      VALUES (${p.staffId}, ${p.tenantId}, ${sealed}, 'pending', 0, ${now.toISOString()})
      ON CONFLICT (staff_id) DO UPDATE SET secret_enc = EXCLUDED.secret_enc, last_used_step = 0, created_at = EXCLUDED.created_at`);
    await this.audit(tx, { tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, subjectStaffId: p.staffId, kind: "mfa.enroll.started" });
    const b32 = base32Encode(secret);
    return { ok: true, data: { secret: b32, otpauthUri: otpauthUri(b32, p.displayName) } };
  }

  /** Shared TOTP check. Throws RATE_LIMITED / MFA_REQUIRED; returns the accepted step or undefined (attempt recorded). */
  private async checkCode(tx: Tx, p: Principal, code: string, want: "pending" | "active"): Promise<number | undefined> {
    const now = this.now();
    await lockAndCheck(tx, this.cfg, now, "mfa", p.staffId, p.source);
    const f = (await tx.select().from(t.mfaFactors).where(eq(t.mfaFactors.staffId, p.staffId)).for("update"))[0];
    if (!f || f.status !== want) throw new IdentityError("MFA_REQUIRED", { state: "no_factor" });
    let secret: Buffer;
    try {
      secret = base32Decode(open(this.deps.key, f.secretEnc, this.aad(p.staffId)));
    } catch {
      throw new IdentityError("MFA_REQUIRED", { state: "factor_unreadable" }); // second factor missing or tampered: fail closed
    }
    const step = matchTotp(secret, code, now);
    if (step === undefined || step <= f.lastUsedStep) { // unknown code, or a step already accepted (replay)
      await recordFailure(tx, now, "mfa", p.staffId, p.source);
      return undefined;
    }
    await tx.update(t.mfaFactors).set({ lastUsedStep: step }).where(eq(t.mfaFactors.staffId, p.staffId));
    return step;
  }

  private async openSession(tx: Tx, p: Principal, stepUp: boolean): Promise<Date | null> {
    const until = stepUp ? new Date(this.now().getTime() + this.cfg.stepUpTtlSeconds * 1000) : null;
    await tx.update(t.staffSessions).set({ mfaState: "verified", stepUpUntil: until }).where(eq(t.staffSessions.id, p.sessionId));
    return until;
  }

  async confirm(tx: Tx, p: Principal, code: string): Promise<Outcome<{ recoveryCodes: string[]; mfaState: MfaState; stepUpUntil: string }>> {
    const now = this.now();
    if ((await this.checkCode(tx, p, code, "pending")) === undefined) return { ok: false, error: "MFA_INVALID" };
    await tx.update(t.mfaFactors).set({ status: "active", confirmedAt: now }).where(eq(t.mfaFactors.staffId, p.staffId));
    await tx.delete(t.mfaRecoveryCodes).where(eq(t.mfaRecoveryCodes.staffId, p.staffId));
    const codes = Array.from({ length: this.cfg.recoveryCodeCount }, () => {
      const raw = base32Encode(this.rnd(10)); // 80 bits
      return raw.match(/.{4}/g)!.join("-");
    });
    for (const c of codes) {
      await tx.insert(t.mfaRecoveryCodes).values({ id: randomUUID(), tenantId: p.tenantId, staffId: p.staffId, codeHash: hmac(this.recoveryKey, normalizeCode(c)), createdAt: now });
    }
    const until = (await this.openSession(tx, p, true))!;
    await this.audit(tx, { tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, subjectStaffId: p.staffId, kind: "mfa.enabled" });
    return { ok: true, data: { recoveryCodes: codes, mfaState: "verified", stepUpUntil: until.toISOString() } };
  }

  async challenge(tx: Tx, p: Principal, code: string): Promise<Outcome<{ mfaState: MfaState; stepUpUntil: string }>> {
    if ((await this.checkCode(tx, p, code, "active")) === undefined) return { ok: false, error: "MFA_INVALID" };
    const until = (await this.openSession(tx, p, true))!;
    return { ok: true, data: { mfaState: "verified", stepUpUntil: until.toISOString() } };
  }

  /** Recovery opens the session but gives NO step-up: owner and refund approvals still need a live authenticator code. */
  async recover(tx: Tx, p: Principal, recoveryCode: string): Promise<Outcome<{ mfaState: MfaState; stepUpUntil: null; recoveryCodesRemaining: number }>> {
    const now = this.now();
    await lockAndCheck(tx, this.cfg, now, "mfa", p.staffId, p.source);
    const hit = (await tx.select().from(t.mfaRecoveryCodes).where(and(eq(t.mfaRecoveryCodes.staffId, p.staffId), eq(t.mfaRecoveryCodes.codeHash, hmac(this.recoveryKey, normalizeCode(recoveryCode))), isNull(t.mfaRecoveryCodes.usedAt))).for("update"))[0];
    if (!hit) {
      await recordFailure(tx, now, "mfa", p.staffId, p.source);
      return { ok: false, error: "MFA_INVALID" };
    }
    await tx.update(t.mfaRecoveryCodes).set({ usedAt: now }).where(eq(t.mfaRecoveryCodes.id, hit.id));
    await this.openSession(tx, p, false);
    const left = (await tx.select({ id: t.mfaRecoveryCodes.id }).from(t.mfaRecoveryCodes).where(and(eq(t.mfaRecoveryCodes.staffId, p.staffId), isNull(t.mfaRecoveryCodes.usedAt)))).length;
    await this.audit(tx, { tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, subjectStaffId: p.staffId, kind: "mfa.recovery.used", detail: { remaining: left } });
    return { ok: true, data: { mfaState: "verified", stepUpUntil: null, recoveryCodesRemaining: left } };
  }

  /** Order: scope (404), permission (403) + step-up, revision (409). The only recovery path for someone else is this audited owner action. */
  async revokeMfa(tx: Tx, p: Principal, input: { staffId?: string | undefined; reason: string; expectedRevision: number }): Promise<Outcome<{ staffId: string; sessionsRevoked: number }>> {
    const now = this.now();
    const targetId = input.staffId ?? p.staffId;
    const target = (await tx.select().from(t.staff).where(and(eq(t.staff.tenantId, p.tenantId), eq(t.staff.id, targetId))).for("update"))[0];
    if (!target) throw new DomainError("NOT_FOUND");
    if (targetId === p.staffId) this.requireFull(p);
    else this.requirePermission(p, "mfa.revoke.other");
    if (!this.stepUpValid(p)) throw new IdentityError("STEP_UP_REQUIRED"); // also covers revoking your own factor
    if (target.revision !== input.expectedRevision) throw new DomainError("REVISION_CONFLICT");
    await tx.delete(t.mfaFactors).where(eq(t.mfaFactors.staffId, targetId));
    await tx.delete(t.mfaRecoveryCodes).where(eq(t.mfaRecoveryCodes.staffId, targetId));
    const killed = await tx.update(t.staffSessions).set({ revokedAt: now }).where(and(eq(t.staffSessions.staffId, targetId), isNull(t.staffSessions.revokedAt))).returning({ id: t.staffSessions.id });
    await tx.update(t.staff).set({ revision: target.revision + 1 }).where(eq(t.staff.id, targetId));
    await this.audit(tx, { tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, subjectStaffId: targetId, kind: "mfa.revoked", detail: { reason: input.reason, self: targetId === p.staffId } });
    return { ok: true, data: { staffId: targetId, sessionsRevoked: killed.length }, revision: target.revision + 1 };
  }

  // ---- staff and grants -----------------------------------------------------------------------------------------

  async staffView(p: Principal, staffId: string) {
    const s = (await this.db.select().from(t.staff).where(and(eq(t.staff.tenantId, p.tenantId), eq(t.staff.id, staffId))))[0];
    if (!s) throw new DomainError("NOT_FOUND");
    this.requirePermission(p, "staff.read");
    const grants = await this.db.select().from(t.roleGrants).where(and(eq(t.roleGrants.tenantId, p.tenantId), eq(t.roleGrants.staffId, staffId), isNull(t.roleGrants.revokedAt)));
    const f = (await this.db.select({ status: t.mfaFactors.status }).from(t.mfaFactors).where(eq(t.mfaFactors.staffId, staffId)))[0];
    return { data: { staffId: s.id, displayName: s.displayName, mfaEnrolled: f?.status === "active", grants: grants.map((g) => ({ grantId: g.id, role: g.role, outletId: g.outletId, revision: g.revision })) }, revision: s.revision };
  }

  async createGrant(tx: Tx, p: Principal, staffId: string, input: { role: Role; outletId?: string | undefined; expectedRevision: number }): Promise<Outcome<{ grantId: string }>> {
    const target = (await tx.select().from(t.staff).where(and(eq(t.staff.tenantId, p.tenantId), eq(t.staff.id, staffId))).for("update"))[0];
    if (!target) throw new DomainError("NOT_FOUND");
    if (input.outletId) {
      const o = (await tx.select({ id: t.outlets.id }).from(t.outlets).where(and(eq(t.outlets.tenantId, p.tenantId), eq(t.outlets.id, input.outletId))))[0];
      if (!o) throw new DomainError("NOT_FOUND"); // an outlet of another tenant looks the same as a missing one
    }
    this.requirePermission(p, "staff.manage");
    if (target.revision !== input.expectedRevision) throw new DomainError("REVISION_CONFLICT");
    if ((input.role === "owner") === (input.outletId !== undefined)) throw new DomainError("VALIDATION_FAILED", { field: "outletId" });
    const grantId = randomUUID();
    try {
      await tx.insert(t.roleGrants).values({ id: grantId, tenantId: p.tenantId, staffId, outletId: input.outletId ?? null, role: input.role, grantedBy: p.staffId, createdAt: this.now() });
    } catch (e) {
      if ((e as { code?: string }).code === "23505") throw new DomainError("REVISION_CONFLICT", { reason: "duplicate_grant" });
      throw e;
    }
    await tx.update(t.staff).set({ revision: target.revision + 1 }).where(eq(t.staff.id, staffId));
    await this.audit(tx, { tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, subjectStaffId: staffId, kind: "grant.created", detail: { role: input.role, grantId } });
    return { ok: true, data: { grantId }, revision: target.revision + 1 };
  }

  async revokeGrant(tx: Tx, p: Principal, staffId: string, grantId: string, expectedRevision: number): Promise<Outcome<{ grantId: string }>> {
    const g = (await tx.select().from(t.roleGrants).where(and(eq(t.roleGrants.tenantId, p.tenantId), eq(t.roleGrants.staffId, staffId), eq(t.roleGrants.id, grantId))).for("update"))[0];
    if (!g || g.revokedAt) throw new DomainError("NOT_FOUND");
    this.requirePermission(p, "staff.manage");
    if (g.revision !== expectedRevision) throw new DomainError("REVISION_CONFLICT");
    if (g.role === "owner") {
      const owners = await tx.select({ id: t.roleGrants.id }).from(t.roleGrants).where(and(eq(t.roleGrants.tenantId, p.tenantId), eq(t.roleGrants.role, "owner"), isNull(t.roleGrants.revokedAt)));
      if (owners.length <= 1) throw new DomainError("VALIDATION_FAILED", { field: "role" }); // never lock the tenant out of its last owner
    }
    await tx.update(t.roleGrants).set({ revokedAt: this.now(), revision: g.revision + 1 }).where(eq(t.roleGrants.id, grantId));
    await tx.execute(sql`UPDATE staff SET revision = revision + 1 WHERE id = ${staffId}`);
    await this.audit(tx, { tenantId: p.tenantId, outletId: p.outletId, actorId: p.staffId, subjectStaffId: staffId, kind: "grant.revoked", detail: { role: g.role, grantId } });
    return { ok: true, data: { grantId }, revision: g.revision + 1 };
  }

  private async audit(q: Q, e: { tenantId: string; outletId?: string; actorId: string; subjectStaffId?: string; kind: string; detail?: Record<string, unknown> }): Promise<void> {
    await q.insert(t.identityAuditEvents).values({ id: randomUUID(), tenantId: e.tenantId, outletId: e.outletId ?? null, actorId: e.actorId, subjectStaffId: e.subjectStaffId ?? null, kind: e.kind, detail: e.detail ?? {}, at: this.now() });
  }
}

const normalizeCode = (c: string): string => c.toUpperCase().replace(/[\s-]/g, "");
