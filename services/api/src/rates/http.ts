// Shared HTTP plumbing for the T47 routes: strict body parsing and the idempotent mutation wrapper.
// Reuses T46's Postgres idempotency store and principal; nothing here authenticates or stores keys itself.
import { DomainError, success } from "@yravg/domain";
import type { FastifyRequest } from "fastify";
import { connect, type Db, type Tx } from "../identity/db.ts";
import { idempotent } from "../identity/idempotency.ts";
import type { IdentityDeps, Principal } from "../identity/service.ts";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const bad = (field: string): never => { throw new DomainError("VALIDATION_FAILED", { field }); };

export type Rule = (v: unknown) => unknown;
export const uuid: Rule = (v) => (typeof v === "string" && UUID.test(v) ? v : undefined);
export const text = (min: number, max: number): Rule => (v) => (typeof v === "string" && v.length >= min && v.length <= max ? v : undefined);
export const revision: Rule = (v) => (typeof v === "number" && Number.isSafeInteger(v) && v >= 1 ? v : undefined);
export const int = (min: number, max: number): Rule => (v) => (typeof v === "number" && Number.isSafeInteger(v) && v >= min && v <= max ? v : undefined);
export const bool: Rule = (v) => (typeof v === "boolean" ? v : undefined);
export const req_ = (rule: Rule) => ({ rule });
export const opt_ = (rule: Rule) => ({ rule, optional: true as const });

/** Strict body: unknown members are rejected, so a client cannot smuggle tenantId or outletId in. */
export function parse<T>(body: unknown, spec: Record<string, { rule: Rule; optional?: true }>): T {
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

export const header = (req: FastifyRequest, name: string): string | undefined => {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
};

export const idParam = (req: FastifyRequest, name: string): string => {
  const v = (req.params as Record<string, string>)[name];
  return v !== undefined && UUID.test(v) ? v : bad(name);
};

export interface Effect<D> { data: D; revision: number }

export interface Http {
  db: Db;
  now: () => Date;
  send: <D>(req: FastifyRequest, data: D, revision?: number) => ReturnType<typeof success<D>>;
  /** Runs `effect` once per Idempotency-Key inside one transaction; a thrown DomainError rolls everything back. */
  mutate: <D>(req: FastifyRequest, p: Principal, payload: unknown, effect: (tx: Tx) => Promise<Effect<D>>) => Promise<ReturnType<typeof success<D>>>;
}

export function makeHttp(deps: IdentityDeps): Http {
  const db = connect(deps.pool);
  const now = deps.clock ?? (() => new Date());
  const send: Http["send"] = (req, data, revision = 1) => success(data, { revision, requestId: req.id, serverTime: now() });
  const mutate: Http["mutate"] = async (req, p, payload, effect) => {
    const { response } = await idempotent<Effect<never>>(
      db, deps.key, { tenantId: p.tenantId, actorId: p.staffId, route: `${req.method} ${req.url.split("?")[0]}` },
      header(req, "idempotency-key"), payload, now(), effect as (tx: Tx) => Promise<Effect<never>>);
    return send(req, response.data as never, response.revision);
  };
  return { db, now, send, mutate } as Http;
}
