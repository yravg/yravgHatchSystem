// Contract: tenant/outlet scoped station API. tenantId and outletId come from the session, never the body.
// reserve is one conditional UPDATE (status = 'available'): under N concurrent requests the row lock lets exactly one
// win, the rest re-evaluate the predicate after the winner commits and get 409. Payment/session state is not touched.
import { DomainError } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { Tx } from "../identity/db.ts";
import type { IdentityDeps, Principal } from "../identity/service.ts";
import { idParam, makeHttp, opt_, parse, req_, revision, text } from "../rates/http.ts";

interface StationRow { id: string; name: string; zone: string; status: string; reserved_by: string | null; reserved_at: Date | null; revision: number }

const view = (r: StationRow) => ({
  stationId: r.id, name: r.name, zone: r.zone, status: r.status,
  reservedBy: r.reserved_by, reservedAt: r.reserved_at ? new Date(r.reserved_at).toISOString() : null, revision: r.revision,
});

const COLS = sql`id, name, zone, status, reserved_by, reserved_at, revision`;
const unavailable = (): never => { throw new DomainError("REVISION_CONFLICT", { reason: "station_not_available" }); };

async function lockStation(tx: Tx, p: Principal, id: string): Promise<StationRow> {
  const row = (await tx.execute(sql`SELECT ${COLS} FROM stations WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as StationRow | undefined;
  if (!row) throw new DomainError("NOT_FOUND"); // another tenant's or outlet's station looks the same as a missing one
  return row;
}

export function registerStations(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1/stations";

  app.post(P, async (req) => {
    const p = await app.identity.authorize(req, { permission: "station.manage" });
    const b = parse<{ name: string; zone?: string }>(req.body, { name: req_(text(1, 60)), zone: opt_(text(1, 40)) });
    return http.mutate(req, p, b, async (tx) => {
      const id = crypto.randomUUID();
      const r = await tx.execute(sql`
        INSERT INTO stations (id, tenant_id, outlet_id, name, zone, created_at)
        VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.name}, ${b.zone ?? "general"}, ${http.now().toISOString()})
        ON CONFLICT (tenant_id, outlet_id, name) DO NOTHING RETURNING ${COLS}`);
      const row = r.rows[0] as StationRow | undefined;
      if (!row) throw new DomainError("REVISION_CONFLICT", { reason: "station_name_taken" });
      return { data: view(row), revision: row.revision };
    });
  });

  app.get(P, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const rows = (await http.db.execute(sql`SELECT ${COLS} FROM stations WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ORDER BY name`)).rows as unknown as StationRow[];
    return http.send(req, { stations: rows.map(view) });
  });

  app.get(`${P}/:stationId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "stationId");
    const row = (await http.db.execute(sql`SELECT ${COLS} FROM stations WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as StationRow | undefined;
    if (!row) throw new DomainError("NOT_FOUND");
    return http.send(req, view(row), row.revision);
  });

  app.post(`${P}/:stationId/reserve`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "stationId");
    const b = parse(req.body, {});
    return http.mutate(req, p, b, async (tx) => {
      const r = await tx.execute(sql`
        UPDATE stations SET status = 'reserved', reserved_by = ${p.staffId}, reserved_at = ${http.now().toISOString()}, revision = revision + 1
        WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} AND status = 'available' RETURNING ${COLS}`);
      const won = r.rows[0] as StationRow | undefined;
      if (won) return { data: view(won), revision: won.revision };
      await lockStation(tx, p, id); // 404 when out of scope, otherwise it exists but is taken or retired
      return unavailable();
    });
  });

  app.post(`${P}/:stationId/release`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const id = idParam(req, "stationId");
    const b = parse(req.body, {});
    return http.mutate(req, p, b, async (tx) => {
      const cur = await lockStation(tx, p, id);
      if (cur.status !== "reserved") return unavailable();
      if (cur.reserved_by !== p.staffId && !p.permissions.has("station.manage")) throw new DomainError("AUTH_FORBIDDEN");
      const r = await tx.execute(sql`UPDATE stations SET status = 'available', reserved_by = NULL, reserved_at = NULL, revision = revision + 1 WHERE id = ${id} RETURNING ${COLS}`);
      const row = r.rows[0] as unknown as StationRow;
      return { data: view(row), revision: row.revision };
    });
  });

  app.post(`${P}/:stationId/retire`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "station.manage" });
    const id = idParam(req, "stationId");
    const b = parse<{ expectedRevision: number }>(req.body, { expectedRevision: req_(revision) });
    return http.mutate(req, p, b, async (tx) => {
      const cur = await lockStation(tx, p, id);
      if (cur.revision !== b.expectedRevision) throw new DomainError("REVISION_CONFLICT");
      if (cur.status !== "available") return unavailable();
      const r = await tx.execute(sql`UPDATE stations SET status = 'retired', revision = revision + 1 WHERE id = ${id} RETURNING ${COLS}`);
      const row = r.rows[0] as unknown as StationRow;
      return { data: view(row), revision: row.revision };
    });
  });
}
