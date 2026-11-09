// Contract: T49 HTTP surface (CONTRACTS section 4, session rows). tenantId/outletId come from the session, never the body.
// Every mutation needs an Idempotency-Key and goes through T46's Postgres store; actions carry expectedRevision.
// POST /sessions and POST /sessions/{id}/actions answer 202: the command is requested, the device ACK decides the rest.
import { DomainError, parseIdr } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { IdentityDeps } from "../identity/service.ts";
import { bool, idParam, makeHttp, opt_, parse, req_, revision, text, uuid, type Rule } from "../rates/http.ts";
import { act, addZoneRate, commandViews, lockSession, reconcile, sessionView, startSession, transferQuote, type ActionBody, type SessionsOptions } from "./service.ts";

const oneOf = (allowed: readonly string[]): Rule => (v) => (typeof v === "string" && allowed.includes(v) ? v : undefined);
const KINDS = ["pause", "resume", "end", "cancel", "retry", "checkout", "clean", "release", "recover", "move"] as const;
const MAX_RATE = 1_000_000_000_000n;
const money: Rule = (v) => { try { const n = parseIdr(v); return n <= MAX_RATE ? n : undefined; } catch { return undefined; } };

export function registerSessions(app: FastifyInstance, deps: IdentityDeps, opts: SessionsOptions = {}): void {
  const http = makeHttp(deps);
  const P = "/api/v1";
  const ctx = () => ({ now: http.now(), opts });

  app.post(`${P}/sessions`, async (req, reply) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const b = parse<{ quoteId: string; paymentMode: "payment" | "postpaid"; paymentIntentId?: string; sessionMode?: "FIXED" | "OPEN"; manualMode?: boolean }>(req.body, {
      quoteId: req_(uuid), paymentMode: req_(oneOf(["payment", "postpaid"])), paymentIntentId: opt_(uuid), sessionMode: opt_(oneOf(["FIXED", "OPEN"])), manualMode: opt_(bool),
    });
    // Manual billing needs an owner-approved policy and a permission that does not exist yet: nobody holds it.
    if (b.manualMode === true) throw new DomainError("AUTH_FORBIDDEN", { reason: "manual_billing_not_enabled" });
    const { manualMode: _m, ...rest } = b; void _m;
    const out = await http.mutate(req, p, b, async (tx) => {
      const c = ctx();
      const s = await startSession(tx, c, p, rest);
      return { data: await sessionView(tx, c, s.id), revision: s.revision };
    });
    return reply.code(202).send(out);
  });

  app.get(`${P}/sessions/:sessionId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "sessionId");
    const owned = await http.db.transaction(async (tx) => {
      const row = (await tx.execute(sql`SELECT tenant_id, outlet_id, revision FROM sessions WHERE id = ${id}`)).rows[0] as { tenant_id: string; outlet_id: string; revision: number } | undefined;
      if (!row || row.tenant_id !== p.tenantId || row.outlet_id !== p.outletId) throw new DomainError("NOT_FOUND");
      return { view: await sessionView(tx, ctx(), id), revision: row.revision };
    });
    return http.send(req, owned.view, owned.revision);
  });

  app.get(`${P}/sessions/:sessionId/commands`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "sessionId");
    const commands = await http.db.transaction(async (tx) => {
      const s = (await tx.execute(sql`SELECT tenant_id, outlet_id FROM sessions WHERE id = ${id}`)).rows[0] as { tenant_id: string; outlet_id: string } | undefined;
      if (!s || s.tenant_id !== p.tenantId || s.outlet_id !== p.outletId) throw new DomainError("NOT_FOUND");
      return commandViews(tx, id);
    });
    return http.send(req, { commands });
  });

  app.post(`${P}/sessions/:sessionId/reconcile`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "sessionId");
    const b = parse(req.body, {});
    return http.mutate(req, p, b, async (tx) => {
      const c = ctx();
      const s = await reconcile(tx, c, p, id);
      return { data: await sessionView(tx, c, id), revision: s.revision };
    });
  });

  app.post(`${P}/sessions/:sessionId/actions`, async (req, reply) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "sessionId");
    const b = parse<ActionBody>(req.body, {
      kind: req_(oneOf(KINDS)), expectedRevision: req_(revision), targetStationId: opt_(uuid), quoteId: opt_(uuid), resolution: opt_(oneOf(["retry", "end"])),
    });
    const out = await http.mutate(req, p, b, async (tx) => {
      const c = ctx();
      const s = await act(tx, c, p, id, b);
      return { data: await sessionView(tx, c, id), revision: s.revision };
    });
    return reply.code(202).send(out);
  });

  app.post(`${P}/sessions/:sessionId/transfer-quotes`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "sessionId");
    const b = parse<{ targetStationId: string }>(req.body, { targetStationId: req_(uuid) });
    return http.mutate(req, p, b, async (tx) => {
      const s = await lockSession(tx, p, id);
      const data = await transferQuote(tx, ctx(), p, id, b.targetStationId);
      return { data, revision: s.revision };
    });
  });

  // Zone rate overrides feed the transfer tariffDelta quote. Versions are append-only; the latest one in effect wins.
  app.post(`${P}/zone-rates`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "rate.manage" });
    const b = parse<{ zone: string; ratePerHourIdr: string }>(req.body, { zone: req_(text(1, 40)), ratePerHourIdr: req_(money) });
    return http.mutate(req, p, b, async (tx) => ({ data: await addZoneRate(tx, ctx(), p, b.zone, parseIdr(b.ratePerHourIdr)), revision: 1 }));
  });
}
