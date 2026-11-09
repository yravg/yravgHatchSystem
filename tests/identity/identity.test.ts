import { randomUUID } from "node:crypto";
import { Writable } from "node:stream";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../../services/api/src/app.ts";
import { FIXTURE_KEY, FIXTURE_PASSWORD, FIXTURE_TOTP_BASE32, call, codeAt, emailOf, enrolAndConfirm, fixtureRandom, harness, login, type Harness, type Session } from "./support.ts";

const P = "/api/v1";
let h: Harness;

/** Test-only routes standing in for the callers of the guard (T48 refunds, T47 checkout). */
function withGuardRoutes(x: Harness): Harness {
  x.app.get("/test/refund-approve", async (req) => { await x.app.identity.authorize(req, { permission: "refund.approve" }); return { ok: true }; });
  x.app.get("/test/checkout", async (req) => { await x.app.identity.authorize(req, { permission: "checkout" }); return { ok: true }; });
  x.app.get("/test/report", async (req) => { await x.app.identity.authorize(req, { permission: "report.read" }); return { ok: true }; });
  return x;
}
const err = (r: { json: Record<string, any> }): string => r.json["error"]?.code; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Logs in, enrols (fixture secret) and returns a verified session with an open step-up. */
async function enrolled(who: string): Promise<{ s: Session; codes: string[] }> {
  const s = await login(h.app, who);
  const codes = await enrolAndConfirm(h, s);
  return { s, codes };
}
const challenge = (s: Session, code: string, ip?: string) => call(h.app, "POST", `${P}/auth/mfa/challenge`, { cookie: s.cookie, csrf: s.csrf, body: { code }, ...(ip ? { ip } : {}) });
const staffRevision = async (s: Session, id: string): Promise<number> => (await call(h.app, "GET", `${P}/staff/${id}`, { cookie: s.cookie })).json["revision"];

beforeEach(async () => { h = withGuardRoutes(await harness()); });
afterEach(async () => { await h.close(); });

describe("sessions and tenancy", () => {
  it("login sets an HttpOnly Secure SameSite cookie and never returns the session token in the body", async () => {
    const s = await login(h.app, "cashierA");
    const raw = String((await call(h.app, "POST", `${P}/auth/session`, { key: null, body: { email: emailOf("cashierA"), password: FIXTURE_PASSWORD } })).headers["set-cookie"]);
    expect(raw).toMatch(/HttpOnly/);
    expect(raw).toMatch(/Secure/);
    expect(raw).toMatch(/SameSite=Strict/);
    expect(JSON.stringify(s.body)).not.toContain(s.cookie.split("=")[1]);
  });

  it("wrong password and unknown email give the same 401 with no existence leak", async () => {
    const a = await call(h.app, "POST", `${P}/auth/session`, { key: null, body: { email: emailOf("cashierA"), password: "wrong" } });
    const b = await call(h.app, "POST", `${P}/auth/session`, { key: null, body: { email: "nobody@fixture.invalid", password: "wrong" } });
    expect(a.status).toBe(401);
    expect(b.status).toBe(401);
    expect(a.json["error"]).toEqual(b.json["error"]);
  });

  it("tenant and outlet come from the session; a client supplied tenantId or outletId in a body is rejected", async () => {
    const s = await login(h.app, "cashierA");
    expect(s.body["tenantId"]).toBe(h.world.tenantA);
    expect(s.body["outletId"]).toBe(h.world.outletA1);
    for (const extra of [{ tenantId: h.world.tenantB }, { outletId: h.world.outletB1 }]) {
      const r = await call(h.app, "POST", `${P}/auth/mfa/enroll`, { cookie: s.cookie, csrf: s.csrf, body: extra });
      expect(r.status).toBe(400);
      expect(err(r)).toBe("VALIDATION_FAILED");
    }
  });

  it("outlet selection at login is limited to granted outlets; other outlets and other tenants are 404", async () => {
    expect((await call(h.app, "POST", `${P}/auth/session`, { key: null, body: { email: emailOf("cashierA"), password: FIXTURE_PASSWORD, outletId: h.world.outletA2 } })).status).toBe(404);
    expect((await call(h.app, "POST", `${P}/auth/session`, { key: null, body: { email: emailOf("cashierA"), password: FIXTURE_PASSWORD, outletId: h.world.outletB1 } })).status).toBe(404);
    expect((await login(h.app, "ownerA", { outletId: h.world.outletA2 })).body["outletId"]).toBe(h.world.outletA2); // owner: every outlet of the tenant
  });

  it("role denial is 403 and a cross-tenant id is 404, even for a role without the permission", async () => {
    const { s: owner } = await enrolled("ownerA");
    const cashier = await login(h.app, "cashierA");
    expect((await call(h.app, "GET", `${P}/staff/${h.world.managerA}`, { cookie: cashier.cookie })).status).toBe(403);
    expect((await call(h.app, "GET", `${P}/staff/${h.world.ownerB}`, { cookie: cashier.cookie })).status).toBe(404);
    expect((await call(h.app, "GET", `${P}/staff/${h.world.ownerB}`, { cookie: owner.cookie })).status).toBe(404);
    expect((await call(h.app, "GET", `${P}/staff/${h.world.managerA}`, { cookie: owner.cookie })).status).toBe(200);
  });

  it("a revoked role grant loses its permission on the very next request", async () => {
    const { s: owner } = await enrolled("ownerA");
    const cashier = await login(h.app, "cashierA");
    expect((await call(h.app, "GET", "/test/checkout", { cookie: cashier.cookie })).status).toBe(200);
    const view = await call(h.app, "GET", `${P}/staff/${h.world.cashierA}`, { cookie: owner.cookie });
    const grant = view.json["data"].grants[0];
    const r = await call(h.app, "POST", `${P}/staff/${h.world.cashierA}/role-grants/${grant.grantId}/revoke`, { cookie: owner.cookie, csrf: owner.csrf, body: { expectedRevision: grant.revision } });
    expect(r.status).toBe(200);
    expect((await call(h.app, "GET", "/test/checkout", { cookie: cashier.cookie })).status).toBe(403);
  });

  it("an unsafe request without the matching CSRF header is rejected", async () => {
    const s = await login(h.app, "cashierA");
    expect((await call(h.app, "POST", `${P}/auth/mfa/enroll`, { cookie: s.cookie, body: {} })).status).toBe(403);
    expect((await call(h.app, "POST", `${P}/auth/mfa/enroll`, { cookie: s.cookie, csrf: "wrong", body: {} })).status).toBe(403);
    expect((await call(h.app, "POST", `${P}/auth/mfa/enroll`, { cookie: s.cookie, csrf: s.csrf, body: {} })).status).toBe(200);
  });

  it("logout revokes the session", async () => {
    const s = await login(h.app, "cashierA");
    expect((await call(h.app, "DELETE", `${P}/auth/session`, { cookie: s.cookie, csrf: s.csrf, key: null })).status).toBe(200);
    expect((await call(h.app, "GET", `${P}/me`, { cookie: s.cookie })).status).toBe(401);
  });
});

describe("TOTP enrolment and fail-closed second factor", () => {
  it("enrol returns the secret once; the factor is unusable until a code confirms it", async () => {
    const s = await login(h.app, "ownerA");
    expect(s.body["mfaState"]).toBe("enrollment_required");
    const e = await call(h.app, "POST", `${P}/auth/mfa/enroll`, { cookie: s.cookie, csrf: s.csrf, body: {} });
    expect(e.json["data"].secret).toBe(FIXTURE_TOTP_BASE32);
    expect((await challenge(s, codeAt(h.clock))).status).toBe(403); // pending factor cannot challenge
    const wrong = await call(h.app, "POST", `${P}/auth/mfa/confirm`, { cookie: s.cookie, csrf: s.csrf, body: { code: codeAt(h.clock, 5) } });
    expect(err(wrong)).toBe("MFA_INVALID");
    expect((await call(h.app, "GET", "/test/report", { cookie: s.cookie })).status).toBe(403); // still not verified
    const ok = await call(h.app, "POST", `${P}/auth/mfa/confirm`, { cookie: s.cookie, csrf: s.csrf, body: { code: codeAt(h.clock) } });
    expect(ok.status).toBe(200);
    expect(ok.json["data"].recoveryCodes).toHaveLength(10);
    expect((await call(h.app, "GET", "/test/report", { cookie: s.cookie })).status).toBe(200);
  });

  it("the secret is stored sealed and recovery codes only as hashes", async () => {
    const { codes } = await enrolled("ownerA");
    const f = (await h.pool.query("SELECT secret_enc FROM mfa_factors WHERE staff_id = $1", [h.world.ownerA])).rows[0];
    expect(f.secret_enc).not.toContain(FIXTURE_TOTP_BASE32);
    const rows = (await h.pool.query("SELECT code_hash, used_at FROM mfa_recovery_codes WHERE staff_id = $1", [h.world.ownerA])).rows;
    expect(rows).toHaveLength(10);
    for (const c of codes) for (const r of rows) expect(r.code_hash).not.toContain(c.replaceAll("-", ""));
    expect(new Set(rows.map((r) => r.code_hash)).size).toBe(10);
  });

  it("a role that requires MFA is denied on business routes until a factor is verified", async () => {
    const s = await login(h.app, "managerA");
    const r = await call(h.app, "GET", "/test/report", { cookie: s.cookie });
    expect(r.status).toBe(403);
    expect(err(r)).toBe("MFA_REQUIRED");
    expect((await call(h.app, "GET", "/test/checkout", { cookie: (await login(h.app, "cashierA")).cookie })).status).toBe(200); // cashier: not required
  });

  it("an enrolled account starts each login pending and must challenge before any business route", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    const s = await login(h.app, "ownerA");
    expect(s.body["mfaState"]).toBe("pending");
    expect(err(await call(h.app, "GET", "/test/report", { cookie: s.cookie }))).toBe("MFA_REQUIRED");
    expect((await challenge(s, codeAt(h.clock))).status).toBe(200);
    expect((await call(h.app, "GET", "/test/report", { cookie: s.cookie })).status).toBe(200);
  });

  it("an unreadable stored secret or a missing factor fails closed", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    const s = await login(h.app, "ownerA");
    await h.pool.query("UPDATE mfa_factors SET secret_enc = 'v1.AAAA.AAAA.AAAA' WHERE staff_id = $1", [h.world.ownerA]);
    const r = await challenge(s, codeAt(h.clock));
    expect(r.status).toBe(403);
    expect(err(r)).toBe("MFA_REQUIRED");
    await h.pool.query("DELETE FROM mfa_factors WHERE staff_id = $1", [h.world.ownerA]);
    expect(err(await challenge(s, codeAt(h.clock, 1)))).toBe("MFA_REQUIRED");
    expect(err(await call(h.app, "GET", "/test/report", { cookie: s.cookie }))).toBe("MFA_REQUIRED");
  });
});

describe("challenge, step-up, replay and rate limits", () => {
  it("step-up opens for the TTL, then expires, then a fresh code renews it", async () => {
    const { s } = await enrolled("managerA");
    expect((await call(h.app, "GET", "/test/refund-approve", { cookie: s.cookie })).status).toBe(200);
    h.clock.advance(299);
    expect((await call(h.app, "GET", "/test/refund-approve", { cookie: s.cookie })).status).toBe(200);
    h.clock.advance(2);
    const expired = await call(h.app, "GET", "/test/refund-approve", { cookie: s.cookie });
    expect(err(expired)).toBe("STEP_UP_REQUIRED");
    expect((await call(h.app, "GET", "/test/report", { cookie: s.cookie })).status).toBe(200); // ordinary routes keep working
    expect((await challenge(s, codeAt(h.clock))).status).toBe(200);
    expect((await call(h.app, "GET", "/test/refund-approve", { cookie: s.cookie })).status).toBe(200);
  });

  it("a cashier cannot approve a refund however fresh the step-up is", async () => {
    const s = await login(h.app, "cashierA");
    expect(err(await call(h.app, "GET", "/test/refund-approve", { cookie: s.cookie }))).toBe("AUTH_FORBIDDEN");
  });

  it("a code replayed inside its step is rejected, also from a second session", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    const a = await login(h.app, "ownerA");
    const b = await login(h.app, "ownerA");
    const code = codeAt(h.clock);
    expect((await challenge(a, code)).status).toBe(200);
    const replay = await challenge(b, code);
    expect(replay.status).toBe(403);
    expect(err(replay)).toBe("MFA_INVALID");
    h.clock.advance(30);
    expect((await challenge(b, codeAt(h.clock))).status).toBe(200);
  });

  it("an older step than the last accepted one is rejected (monotonic), even inside the skew window", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    const a = await login(h.app, "ownerA");
    expect((await challenge(a, codeAt(h.clock, 1))).status).toBe(200); // next step, inside skew
    const b = await login(h.app, "ownerA");
    expect(err(await challenge(b, codeAt(h.clock, 0)))).toBe("MFA_INVALID");
  });

  it("skew is narrow: one step back is accepted, two are not", async () => {
    await enrolled("ownerA");
    h.clock.advance(120);
    const s = await login(h.app, "ownerA");
    expect(err(await challenge(s, codeAt(h.clock, -2)))).toBe("MFA_INVALID");
    expect(err(await challenge(s, codeAt(h.clock, 2)))).toBe("MFA_INVALID");
    expect((await challenge(s, codeAt(h.clock, -1))).status).toBe(200);
  });

  it("10 wrong codes lock the actor; the 11th is 429 even with the correct code, and the lock lifts after the window", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    const s = await login(h.app, "ownerA");
    for (let i = 0; i < 10; i++) expect(err(await challenge(s, "000000", `10.9.0.${i}`))).toBe("MFA_INVALID"); // a different source each time
    const locked = await challenge(s, codeAt(h.clock), "10.9.0.200");
    expect(locked.status).toBe(429);
    expect(err(locked)).toBe("RATE_LIMITED");
    h.clock.advance(901);
    expect((await challenge(s, codeAt(h.clock), "10.9.0.200")).status).toBe(200);
  });

  it("10 wrong codes from one source lock that source across actors", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    await enrolled("managerA");
    h.clock.advance(30);
    const o = await login(h.app, "ownerA", { ip: "10.8.0.1" });
    const m = await login(h.app, "managerA", { ip: "10.8.0.1" });
    for (let i = 0; i < 5; i++) {
      await challenge(o, "000000", "10.8.0.1");
      await challenge(m, "000000", "10.8.0.1");
    }
    const locked = await challenge(o, codeAt(h.clock), "10.8.0.1");
    expect(err(locked)).toBe("RATE_LIMITED");
    expect((await challenge(o, codeAt(h.clock), "10.8.0.2")).status).toBe(200); // another source is not locked
  });

  it("rolling the clock back neither revives a session nor re-opens an accepted code", async () => {
    await enrolled("ownerA");
    h.clock.advance(300);
    const s = await login(h.app, "ownerA");
    expect((await challenge(s, codeAt(h.clock))).status).toBe(200);
    const accepted = codeAt(h.clock);
    h.clock.advance(-90); // clock rollback
    expect((await call(h.app, "GET", `${P}/me`, { cookie: s.cookie })).status).toBe(401);
    const other = await login(h.app, "ownerA"); // created in the rolled-back past
    expect(err(await challenge(other, accepted))).toBe("MFA_INVALID");
  });

  it("two app instances racing the same code accept it exactly once", async () => {
    await enrolled("ownerA");
    h.clock.advance(30);
    const app2 = buildApp({ identity: { pool: h.pool, key: FIXTURE_KEY, clock: h.clock.read, random: fixtureRandom } });
    const a = await login(h.app, "ownerA");
    const b = await login(app2, "ownerA");
    const code = codeAt(h.clock);
    const [x, y] = await Promise.all([
      call(h.app, "POST", `${P}/auth/mfa/challenge`, { cookie: a.cookie, csrf: a.csrf, body: { code } }),
      call(app2, "POST", `${P}/auth/mfa/challenge`, { cookie: b.cookie, csrf: b.csrf, body: { code } }),
    ]);
    expect([x.status, y.status].sort()).toEqual([200, 403]);
    // a restarted instance still honours the existing session and the stored replay guard
    const restarted = buildApp({ identity: { pool: h.pool, key: FIXTURE_KEY, clock: h.clock.read, random: fixtureRandom } });
    expect((await call(restarted, "GET", `${P}/me`, { cookie: a.cookie })).status).toBe(200);
    await restarted.close();
    await app2.close();
  });
});

describe("recovery codes", () => {
  it("a recovery code works once and then never again", async () => {
    const { codes } = await enrolled("ownerA");
    h.clock.advance(30);
    const a = await login(h.app, "ownerA");
    const b = await login(h.app, "ownerA");
    const r = await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: a.cookie, csrf: a.csrf, body: { recoveryCode: codes[0]!.toLowerCase().replaceAll("-", "") } });
    expect(r.status).toBe(200);
    expect(r.json["data"].recoveryCodesRemaining).toBe(9);
    expect(err(await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: b.cookie, csrf: b.csrf, body: { recoveryCode: codes[0] } }))).toBe("MFA_INVALID");
    expect((await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: b.cookie, csrf: b.csrf, body: { recoveryCode: codes[1] } })).status).toBe(200);
  });

  it("recovery opens the session but gives no step-up, and another person's code does not work", async () => {
    const { codes } = await enrolled("managerA");
    await enrolled("ownerA");
    h.clock.advance(30);
    const m = await login(h.app, "managerA");
    const o = await login(h.app, "ownerA");
    expect(err(await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: o.cookie, csrf: o.csrf, body: { recoveryCode: codes[0] } }))).toBe("MFA_INVALID");
    expect((await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: m.cookie, csrf: m.csrf, body: { recoveryCode: codes[0] } })).status).toBe(200);
    expect((await call(h.app, "GET", "/test/report", { cookie: m.cookie })).status).toBe(200);
    expect(err(await call(h.app, "GET", "/test/refund-approve", { cookie: m.cookie }))).toBe("STEP_UP_REQUIRED");
  });

  it("wrong recovery codes count toward the 10-attempt limit", async () => {
    const { codes } = await enrolled("ownerA");
    h.clock.advance(30);
    const s = await login(h.app, "ownerA");
    for (let i = 0; i < 10; i++) await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: s.cookie, csrf: s.csrf, body: { recoveryCode: `AAAA-AAAA-AAAA-AAA${i}` }, ip: `10.7.0.${i}` });
    const locked = await call(h.app, "POST", `${P}/auth/mfa/recover`, { cookie: s.cookie, csrf: s.csrf, body: { recoveryCode: codes[0] }, ip: "10.7.0.99" });
    expect(locked.status).toBe(429);
  });
});

describe("MFA revocation (the only recovery path for someone else)", () => {
  it("an owner with a fresh step-up revokes another member's factor: audited, sessions killed, re-enrolment forced", async () => {
    const { s: owner } = await enrolled("ownerA");
    h.clock.advance(30);
    const { s: mgr } = await enrolled("managerA");
    const rev = await staffRevision(owner, h.world.managerA);
    const r = await call(h.app, "POST", `${P}/auth/mfa/revoke`, { cookie: owner.cookie, csrf: owner.csrf, body: { staffId: h.world.managerA, reason: "lost phone, identity checked in person", expectedRevision: rev } });
    expect(r.status).toBe(200);
    expect(r.json["data"].sessionsRevoked).toBeGreaterThanOrEqual(1);
    expect((await h.pool.query("SELECT 1 FROM mfa_factors WHERE staff_id = $1", [h.world.managerA])).rowCount).toBe(0);
    expect((await h.pool.query("SELECT 1 FROM mfa_recovery_codes WHERE staff_id = $1", [h.world.managerA])).rowCount).toBe(0);
    expect((await call(h.app, "GET", `${P}/me`, { cookie: mgr.cookie })).status).toBe(401);
    expect((await login(h.app, "managerA")).body["mfaState"]).toBe("enrollment_required");
    const audit = (await h.pool.query("SELECT actor_id, subject_staff_id, detail FROM identity_audit_events WHERE kind = 'mfa.revoked'")).rows;
    expect(audit).toHaveLength(1);
    expect(audit[0].actor_id).toBe(h.world.ownerA);
    expect(audit[0].subject_staff_id).toBe(h.world.managerA);
    expect(audit[0].detail.reason).toContain("lost phone");
    await expect(h.pool.query("UPDATE identity_audit_events SET kind = 'x'")).rejects.toThrow(/append-only/);
    await expect(h.pool.query("DELETE FROM identity_audit_events")).rejects.toThrow(/append-only/);
  });

  it("a manager cannot revoke someone else's factor (403) and another tenant's staff is 404", async () => {
    const { s: mgr } = await enrolled("managerA");
    await enrolled("ownerA");
    const body = { reason: "attempted support bypass", expectedRevision: 1 };
    expect(err(await call(h.app, "POST", `${P}/auth/mfa/revoke`, { cookie: mgr.cookie, csrf: mgr.csrf, body: { ...body, staffId: h.world.ownerA } }))).toBe("AUTH_FORBIDDEN");
    const { s: owner } = { s: await login(h.app, "ownerA") };
    h.clock.advance(30);
    await challenge(owner, codeAt(h.clock));
    expect((await call(h.app, "POST", `${P}/auth/mfa/revoke`, { cookie: owner.cookie, csrf: owner.csrf, body: { ...body, staffId: h.world.ownerB } })).status).toBe(404);
    expect((await h.pool.query("SELECT 1 FROM mfa_factors WHERE staff_id = $1", [h.world.ownerA])).rowCount).toBe(1);
  });

  it("revocation needs a fresh step-up, a reason, and the current revision", async () => {
    const { s: owner } = await enrolled("ownerA");
    const rev = await staffRevision(owner, h.world.ownerA);
    const base = { cookie: owner.cookie, csrf: owner.csrf };
    expect(err(await call(h.app, "POST", `${P}/auth/mfa/revoke`, { ...base, body: { expectedRevision: rev } }))).toBe("VALIDATION_FAILED");
    expect(err(await call(h.app, "POST", `${P}/auth/mfa/revoke`, { ...base, body: { reason: "stale", expectedRevision: rev + 5 } }))).toBe("REVISION_CONFLICT");
    h.clock.advance(400);
    expect(err(await call(h.app, "POST", `${P}/auth/mfa/revoke`, { ...base, body: { reason: "after the step-up expired", expectedRevision: rev } }))).toBe("STEP_UP_REQUIRED");
    expect((await h.pool.query("SELECT 1 FROM mfa_factors WHERE staff_id = $1", [h.world.ownerA])).rowCount).toBe(1);
  });
});

describe("idempotency and expected revision", () => {
  async function ownerAndCashierRevision() {
    const { s } = await enrolled("ownerA");
    return { s, rev: await staffRevision(s, h.world.cashierA) };
  }
  const grantCount = async (): Promise<number> => Number((await h.pool.query("SELECT count(*) FROM role_grants WHERE staff_id = $1", [h.world.cashierA])).rows[0].count);
  const grant = (s: Session, key: string, body: object) => call(h.app, "POST", `${P}/staff/${h.world.cashierA}/role-grants`, { cookie: s.cookie, csrf: s.csrf, key, body });

  it("the same key and payload replays the stored result and runs the effect once", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    const key = randomUUID();
    const body = { role: "technician", outletId: h.world.outletA1, expectedRevision: rev };
    const a = await grant(s, key, body);
    const b = await grant(s, key, body);
    expect(a.status).toBe(200);
    expect(b.json["data"].grantId).toBe(a.json["data"].grantId);
    expect(await grantCount()).toBe(2);
    expect(await staffRevision(s, h.world.cashierA)).toBe(rev + 1);
  });

  it("the same key with a different payload is 409 over HTTP and changes nothing", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    const key = randomUUID();
    expect((await grant(s, key, { role: "technician", outletId: h.world.outletA1, expectedRevision: rev })).status).toBe(200);
    const clash = await grant(s, key, { role: "kitchen", outletId: h.world.outletA1, expectedRevision: rev });
    expect(clash.status).toBe(409);
    expect(err(clash)).toBe("IDEMPOTENCY_CONFLICT");
    expect(await grantCount()).toBe(2);
  });

  it("two concurrent requests with the same key and different payloads: one wins, the other is 409", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    const key = randomUUID();
    const [x, y] = await Promise.all([
      grant(s, key, { role: "technician", outletId: h.world.outletA1, expectedRevision: rev }),
      grant(s, key, { role: "kitchen", outletId: h.world.outletA1, expectedRevision: rev }),
    ]);
    expect([x.status, y.status].sort()).toEqual([200, 409]);
    expect(await grantCount()).toBe(2);
  });

  it("two concurrent requests with the same key and the same payload run once and agree", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    const key = randomUUID();
    const body = { role: "technician", outletId: h.world.outletA1, expectedRevision: rev };
    const [x, y] = await Promise.all([grant(s, key, body), grant(s, key, body)]);
    expect([x.status, y.status]).toEqual([200, 200]);
    expect(x.json["data"].grantId).toBe(y.json["data"].grantId);
    expect(await grantCount()).toBe(2);
  });

  it("a missing or malformed Idempotency-Key is 400", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    const body = { role: "technician", outletId: h.world.outletA1, expectedRevision: rev };
    expect((await call(h.app, "POST", `${P}/staff/${h.world.cashierA}/role-grants`, { cookie: s.cookie, csrf: s.csrf, key: null, body })).status).toBe(400);
    expect((await grant(s, "not-a-uuid", body)).status).toBe(400);
  });

  it("a stale expectedRevision is 409 REVISION_CONFLICT and nothing changes", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    const r = await grant(s, randomUUID(), { role: "technician", outletId: h.world.outletA1, expectedRevision: rev + 3 });
    expect(r.status).toBe(409);
    expect(err(r)).toBe("REVISION_CONFLICT");
    expect(await grantCount()).toBe(1);
  });

  it("an outlet of another tenant is 404 and the last owner grant cannot be revoked", async () => {
    const { s, rev } = await ownerAndCashierRevision();
    expect((await grant(s, randomUUID(), { role: "cashier", outletId: h.world.outletB1, expectedRevision: rev })).status).toBe(404);
    const ownerView = await call(h.app, "GET", `${P}/staff/${h.world.ownerA}`, { cookie: s.cookie });
    const g = ownerView.json["data"].grants[0];
    const r = await call(h.app, "POST", `${P}/staff/${h.world.ownerA}/role-grants/${g.grantId}/revoke`, { cookie: s.cookie, csrf: s.csrf, body: { expectedRevision: g.revision } });
    expect(r.status).toBe(400);
  });
});

describe("logs", () => {
  it("never contain the TOTP secret, an OTP, a recovery code, the password or the session token", async () => {
    await h.close();
    const lines: string[] = [];
    const sink = new Writable({ write(chunk, _enc, cb) { lines.push(String(chunk)); cb(); } });
    h = withGuardRoutes(await harness({ logStream: sink }));
    const s = await login(h.app, "ownerA");
    const e = await call(h.app, "POST", `${P}/auth/mfa/enroll`, { cookie: s.cookie, csrf: s.csrf, body: {} });
    const otps = [codeAt(h.clock)];
    const c = await call(h.app, "POST", `${P}/auth/mfa/confirm`, { cookie: s.cookie, csrf: s.csrf, body: { code: otps[0] } });
    h.clock.advance(30);
    otps.push(codeAt(h.clock));
    await challenge(s, otps[1]!);
    await challenge(s, "000000");
    await call(h.app, "POST", `${P}/auth/session`, { key: null, body: { email: emailOf("ownerA"), password: "a-wrong-password-for-the-log-test" } });
    const secrets = [e.json["data"].secret, FIXTURE_TOTP_BASE32, FIXTURE_PASSWORD, "a-wrong-password-for-the-log-test", s.cookie.split("=")[1]!, s.csrf, ...otps, ...(c.json["data"].recoveryCodes as string[])];
    const log = lines.join("");
    expect(log.length).toBeGreaterThan(200); // the capture really saw the requests
    for (const x of secrets) expect(log).not.toContain(x);
  });
});
