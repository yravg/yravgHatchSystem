// Contract: registers, shifts, X report, Z day close, D30 open-shift policy (T53). tenantId/outletId come from the session.
// X (GET) is SELECT-only. Z needs a policy version (D30 fixture, owner-lock open) and refuses with a typed error otherwise.
import { DomainError, parseIdr } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { IdentityDeps } from "../identity/service.ts";
import { idParam, makeHttp, opt_, parse, req_, text, uuid, type Rule } from "../rates/http.ts";
import { OperationsError } from "../orders/errors.ts";
import { businessDayFor, closeFor, closeShift, closeView, currentPolicy, dayClose, loadClose, loadShift, shiftView, xReport } from "./service.ts";

const money: Rule = (v) => { try { return parseIdr(v) <= 1_000_000_000_000n ? v : undefined; } catch { return undefined; } };
const mode: Rule = (v) => (v === "block_if_other_open" ? v : undefined);
const pgCode = (e: unknown): string | undefined => (e as { cause?: { code?: string }; code?: string }).cause?.code ?? (e as { code?: string }).code;

export function registerShifts(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1";

  app.post(`${P}/registers`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.policy" });
    const b = parse<{ name: string }>(req.body, { name: req_(text(1, 60)) });
    return http.mutate(req, p, b, async (tx) => {
      const id = crypto.randomUUID();
      const r = await tx.execute(sql`INSERT INTO registers (id, tenant_id, outlet_id, name, created_at) VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.name}, ${http.now().toISOString()}) ON CONFLICT (tenant_id, outlet_id, name) DO NOTHING RETURNING id`);
      if (r.rows.length === 0) throw new DomainError("REVISION_CONFLICT", { reason: "name_taken" });
      return { data: { registerId: id, name: b.name }, revision: 1 };
    });
  });

  app.post(`${P}/shift-close-policies`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.policy" });
    const b = parse<{ mode?: string }>(req.body, { mode: opt_(mode) });
    return http.mutate(req, p, b, async (tx) => {
      await tx.execute(sql`SELECT 1 FROM tenants WHERE id = ${p.tenantId} FOR UPDATE`); // serialises version numbering per tenant
      const next = Number(((await tx.execute(sql`SELECT coalesce(max(version), 0) + 1 AS v FROM shift_close_policies WHERE tenant_id = ${p.tenantId}`)).rows[0] as { v: string }).v);
      const m = b.mode ?? "block_if_other_open"; // the D30 recommended fixture is the default
      await tx.execute(sql`INSERT INTO shift_close_policies (id, tenant_id, version, mode, fixture, created_by, created_at) VALUES (${crypto.randomUUID()}, ${p.tenantId}, ${next}, ${m}, true, ${p.staffId}, ${http.now().toISOString()})`);
      return { data: { version: next, mode: m, fixture: true, label: "fixture: D30 recommended default, not owner approved" }, revision: next };
    });
  });

  app.get(`${P}/shift-close-policies/current`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.operate" });
    const c = await currentPolicy(http.db, p.tenantId);
    if (!c) throw new DomainError("NOT_FOUND");
    return http.send(req, { version: c.version, mode: c.mode, fixture: c.fixture }, c.version);
  });

  app.post(`${P}/shifts/open`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.operate" });
    const b = parse<{ registerId: string; openingFloatIdr: string }>(req.body, { registerId: req_(uuid), openingFloatIdr: req_(money) });
    return http.mutate(req, p, b, async (tx) => {
      const reg = (await tx.execute(sql`SELECT id FROM registers WHERE id = ${b.registerId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR SHARE`)).rows[0];
      if (!reg) throw new DomainError("NOT_FOUND");
      const now = http.now();
      const day = await businessDayFor(tx, p.outletId, now);
      if (await closeFor(tx, b.registerId, day)) throw new OperationsError("DAY_CLOSED", { businessDay: day });
      const id = crypto.randomUUID();
      try {
        await tx.execute(sql`INSERT INTO shifts (id, tenant_id, outlet_id, register_id, cashier_id, business_day, opening_float_idr, opened_at) VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.registerId}, ${p.staffId}, ${day}::date, ${parseIdr(b.openingFloatIdr).toString()}, ${now.toISOString()})`);
      } catch (e) { if (pgCode(e) === "23505") throw new DomainError("REVISION_CONFLICT", { reason: "shift_already_open" }); throw e; }
      return { data: shiftView(await loadShift(tx, p.tenantId, p.outletId, id)), revision: 1 };
    });
  });

  app.get(`${P}/shifts/:shiftId/x-report`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.operate" });
    const s = await loadShift(http.db, p.tenantId, p.outletId, idParam(req, "shiftId"));
    if (s.cashier_id !== p.staffId && !p.permissions.has("report.read")) throw new DomainError("AUTH_FORBIDDEN");
    return http.send(req, await xReport(http.db, p.tenantId, p.outletId, s)); // SELECT only: nothing is written
  });

  app.post(`${P}/shifts/:shiftId/close`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.operate" });
    const id = idParam(req, "shiftId");
    const b = parse<{ actualCashIdr: string; handoverTo?: string }>(req.body, { actualCashIdr: req_(money), handoverTo: opt_(uuid) });
    return http.mutate(req, p, b, async (tx) => {
      const s = await loadShift(tx, p.tenantId, p.outletId, id, "update");
      if (s.cashier_id !== p.staffId && !p.permissions.has("report.read")) throw new DomainError("AUTH_FORBIDDEN");
      if (s.status !== "open") throw new OperationsError("SHIFT_NOT_OPEN");
      await closeShift(tx, { tenantId: p.tenantId, outletId: p.outletId, shift: s, actualCashIdr: parseIdr(b.actualCashIdr), actorId: p.staffId, ...(b.handoverTo ? { handoverTo: b.handoverTo } : {}), now: http.now() });
      return { data: shiftView(await loadShift(tx, p.tenantId, p.outletId, id)), revision: 2 };
    });
  });

  app.post(`${P}/registers/:registerId/day-closes`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.operate" });
    const registerId = idParam(req, "registerId");
    const b = parse<{ shiftId: string; actualCashIdr: string }>(req.body, { shiftId: req_(uuid), actualCashIdr: req_(money) });
    return http.mutate(req, p, b, async (tx) => ({
      data: await dayClose(tx, { tenantId: p.tenantId, outletId: p.outletId, registerId, shiftId: b.shiftId, actualCashIdr: parseIdr(b.actualCashIdr), actorId: p.staffId, canSeeOthers: p.permissions.has("report.read"), now: http.now() }),
      revision: 1,
    }));
  });

  app.get(`${P}/day-closes/:closeId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "shift.operate" });
    const c = await loadClose(http.db, p.tenantId, p.outletId, idParam(req, "closeId"));
    return http.send(req, closeView(c, false));
  });

}
