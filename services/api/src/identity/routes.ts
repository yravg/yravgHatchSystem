import { DomainError, success } from "@yravg/domain";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { ROLES, type Role } from "../tenancy/permissions.ts";
import type { Tx } from "./db.ts";
import { IdentityError } from "./errors.ts";
import { idempotent } from "./idempotency.ts";
import { IdentityService, type IdentityDeps, type Outcome, type Principal } from "./service.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const bad = (field: string): never => { throw new DomainError("VALIDATION_FAILED", { field }); };

type Rule = (v: unknown) => unknown;
const uuid: Rule = (v) => (typeof v === "string" && UUID.test(v) ? v : undefined);
const code6: Rule = (v) => (typeof v === "string" && /^[0-9]{6}$/.test(v) ? v : undefined);
const text = (min: number, max: number): Rule => (v) => (typeof v === "string" && v.length >= min && v.length <= max ? v : undefined);
const revision: Rule = (v) => (typeof v === "number" && Number.isSafeInteger(v) && v >= 1 ? v : undefined);
const role: Rule = (v) => ((ROLES as readonly unknown[]).includes(v) ? v : undefined);

/** Strict body: unknown members are rejected, so a client cannot smuggle tenantId or outletId in. */
function parse<T>(body: unknown, spec: Record<string, { rule: Rule; optional?: true }>): T {
  const src = body === undefined || body === null ? {} : body;
  if (typeof src !== "object" || Array.isArray(src)) return bad("body");
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(src)) if (!(k in spec)) bad(k);
  for (const [k, { rule, optional }] of Object.entries(spec)) {
    const v = (src as Record<string, unknown>)[k];
    if (v === undefined) { if (!optional) bad(k); continue; }
    if (rule(v) === undefined) bad(k);
    out[k] = v;
  }
  return out as T;
}
const req_ = (rule: Rule) => ({ rule });
const opt_ = (rule: Rule) => ({ rule, optional: true as const });

/** What other tickets call: authenticate + MFA state + permission (+ step-up for the sensitive ones). */
export interface IdentityGuards {
  authenticate(req: FastifyRequest): Promise<Principal>;
  authorize(req: FastifyRequest, o: { permission: string }): Promise<Principal>;
}
declare module "fastify" {
  interface FastifyInstance {
    identity: IdentityGuards;
  }
}

export function registerIdentity(app: FastifyInstance, deps: IdentityDeps): IdentityService {
  const svc = new IdentityService(deps);
  const principal = (req: FastifyRequest): Promise<Principal> =>
    svc.authenticate(req.headers.cookie, req.method, header(req, "x-hatch-csrf"), req.ip);
  app.decorate("identity", {
    authenticate: principal,
    authorize: async (req: FastifyRequest, o: { permission: string }) => {
      const p = await principal(req);
      svc.requirePermission(p, o.permission);
      return p;
    },
  } satisfies IdentityGuards);

  const send = (req: FastifyRequest, data: unknown, revision = 0) => success(data, { revision, requestId: req.id, serverTime: svc.now() });

  /** Runs `effect` once per Idempotency-Key. Failure outcomes are stored too, so their attempt rows commit. */
  async function mutate<D>(req: FastifyRequest, p: Principal, payload: unknown, effect: (tx: Tx) => Promise<Outcome<D>>) {
    const { response } = await idempotent<Outcome<D>>(svc.db, deps.key, { tenantId: p.tenantId, actorId: p.staffId, route: `${req.method} ${req.url.split("?")[0]}` }, header(req, "idempotency-key"), payload, svc.now(), effect);
    if (!response.ok) throw new IdentityError(response.error);
    return send(req, response.data, response.revision);
  }

  const P = "/api/v1";

  app.post(`${P}/auth/session`, async (req, reply) => {
    const b = parse<{ email: string; password: string; outletId?: string }>(req.body, { email: req_(text(3, 254)), password: req_(text(1, 256)), outletId: opt_(uuid) });
    const s = await svc.login(b, req.ip);
    reply.header("set-cookie", `hatch_session=${s.token}; HttpOnly; Secure; SameSite=Strict; Path=${P}; Max-Age=${s.maxAge}`);
    req.log.info({ event: "session.login", staffId: s.staffId, mfaState: s.mfaState });
    return send(req, { staffId: s.staffId, tenantId: s.tenantId, outletId: s.outletId, displayName: s.displayName, roles: s.roles, permissions: s.permissions, mfaState: s.mfaState, csrfToken: s.csrf, expiresAt: s.expiresAt.toISOString() });
  });

  app.delete(`${P}/auth/session`, async (req, reply) => {
    await svc.logout(await principal(req));
    reply.header("set-cookie", `hatch_session=; HttpOnly; Secure; SameSite=Strict; Path=${P}; Max-Age=0`);
    return send(req, { revoked: true });
  });

  app.get(`${P}/me`, async (req) => send(req, await svc.view(await principal(req))));

  app.post(`${P}/auth/mfa/enroll`, async (req) => {
    const p = await principal(req);
    if (p.mfaState === "pending") throw new IdentityError("MFA_ALREADY_ENROLLED");
    const body = parse(req.body, {});
    const out = await mutate(req, p, body, (tx) => svc.enroll(tx, p));
    req.log.info({ event: "mfa.enroll", staffId: p.staffId });
    return out;
  });

  app.post(`${P}/auth/mfa/confirm`, async (req) => {
    const p = await principal(req);
    const b = parse<{ code: string }>(req.body, { code: req_(code6) });
    return mutate(req, p, b, (tx) => svc.confirm(tx, p, b.code));
  });

  app.post(`${P}/auth/mfa/challenge`, async (req) => {
    const p = await principal(req);
    const b = parse<{ code: string }>(req.body, { code: req_(code6) });
    return mutate(req, p, b, (tx) => svc.challenge(tx, p, b.code));
  });

  app.post(`${P}/auth/mfa/recover`, async (req) => {
    const p = await principal(req);
    const b = parse<{ recoveryCode: string }>(req.body, { recoveryCode: req_(text(8, 40)) });
    return mutate(req, p, b, (tx) => svc.recover(tx, p, b.recoveryCode));
  });

  app.post(`${P}/auth/mfa/revoke`, async (req) => {
    const p = await principal(req);
    const b = parse<{ staffId?: string; reason: string; expectedRevision: number }>(req.body, { staffId: opt_(uuid), reason: req_(text(3, 200)), expectedRevision: req_(revision) });
    return mutate(req, p, b, (tx) => svc.revokeMfa(tx, p, b));
  });

  const staffId = (req: FastifyRequest): string => (UUID.test((req.params as { staffId: string }).staffId) ? (req.params as { staffId: string }).staffId : bad("staffId"));

  app.get(`${P}/staff/:staffId`, async (req) => {
    const v = await svc.staffView(await principal(req), staffId(req));
    return send(req, v.data, v.revision);
  });

  app.post(`${P}/staff/:staffId/role-grants`, async (req) => {
    const p = await principal(req);
    const b = parse<{ role: Role; outletId?: string; expectedRevision: number }>(req.body, { role: req_(role), outletId: opt_(uuid), expectedRevision: req_(revision) });
    return mutate(req, p, b, (tx) => svc.createGrant(tx, p, staffId(req), b));
  });

  app.post(`${P}/staff/:staffId/role-grants/:grantId/revoke`, async (req) => {
    const p = await principal(req);
    const grantId = (req.params as { grantId: string }).grantId;
    if (!UUID.test(grantId)) bad("grantId");
    const b = parse<{ expectedRevision: number }>(req.body, { expectedRevision: req_(revision) });
    return mutate(req, p, b, (tx) => svc.revokeGrant(tx, p, staffId(req), grantId, b.expectedRevision));
  });

  return svc;
}

const header = (req: FastifyRequest, name: string): string | undefined => {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
};
