// Contract: one fenced authority epoch per outlet, and ACK intake from enrolled devices.
// The epoch only moves forward. Any ACK whose epoch is not the current one is rejected (stale or from the future),
// so an old edge after a split brain cannot be heard. ACKs are at-least-once on the wire and idempotent here: the
// unique (device, command, status) row makes a duplicate a no-op. The tenant comes from the authenticated device row.
import { canonicalJson, validateAck } from "@yravg/contracts";
import { verifyText } from "@yravg/contracts/leases";
import { DomainError } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { IdentityError } from "../identity/errors.ts";
import type { IdentityDeps } from "../identity/service.ts";
import { DEVICE_COLS, type DeviceRow } from "../devices/routes.ts";
import { UUID, header, makeHttp, parse, req_, uuid } from "../rates/http.ts";

export function registerEdge(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1/edge";

  app.post(`${P}/authority/claim`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "edge.authority" });
    const b = parse<{ edgeDeviceId: string }>(req.body, { edgeDeviceId: req_(uuid) });
    return http.mutate(req, p, b, async (tx) => {
      const dev = (await tx.execute(sql`SELECT ${DEVICE_COLS} FROM devices WHERE id = ${b.edgeDeviceId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as DeviceRow | undefined;
      if (!dev) throw new DomainError("NOT_FOUND");
      if (dev.kind !== "edge" || dev.status !== "active") throw new DomainError("REVISION_CONFLICT", { reason: "not_an_active_edge" });
      const r = await tx.execute(sql`
        INSERT INTO outlet_authority (tenant_id, outlet_id, epoch, edge_device_id, updated_at)
        VALUES (${p.tenantId}, ${p.outletId}, 1, ${dev.id}, ${http.now().toISOString()})
        ON CONFLICT (tenant_id, outlet_id) DO UPDATE SET epoch = outlet_authority.epoch + 1, edge_device_id = ${dev.id}, updated_at = ${http.now().toISOString()}
        RETURNING epoch`);
      const epoch = Number((r.rows[0] as { epoch: string }).epoch);
      return { data: { authorityEpoch: epoch, edgeDeviceId: dev.id }, revision: epoch };
    });
  });

  app.get(`${P}/authority`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "device.manage" });
    const row = (await http.db.execute(sql`SELECT epoch, edge_device_id FROM outlet_authority WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as { epoch: string; edge_device_id: string | null } | undefined;
    return http.send(req, { authorityEpoch: row ? Number(row.epoch) : 0, edgeDeviceId: row?.edge_device_id ?? null });
  });

  // Device-authenticated: x-hatch-device-id + x-hatch-signature = Ed25519 over the canonical JSON of the body.
  app.post(`${P}/acks`, async (req) => {
    const deviceId = header(req, "x-hatch-device-id");
    const sig = header(req, "x-hatch-signature");
    if (!deviceId || !sig || !UUID.test(deviceId)) throw new IdentityError("UNAUTHENTICATED");
    const dev = (await http.db.execute(sql`SELECT ${DEVICE_COLS} FROM devices WHERE id = ${deviceId}`)).rows[0] as DeviceRow | undefined;
    let body: string;
    try { body = canonicalJson(req.body); } catch { throw new DomainError("VALIDATION_FAILED", { field: "body" }); }
    // Unknown, not active, or a bad signature all look the same to the caller.
    if (!dev || dev.status !== "active" || dev.public_key === null || !verifyText(dev.public_key, body, sig)) throw new IdentityError("UNAUTHENTICATED");
    const b = parse<{ ack: unknown }>(req.body, { ack: req_((v) => (typeof v === "object" && v !== null ? v : undefined)) });
    let ack;
    try { ack = validateAck(b.ack); } catch { throw new DomainError("VALIDATION_FAILED", { field: "ack" }); }
    if (ack.deviceId !== dev.id) throw new DomainError("AUTH_FORBIDDEN");
    const now = http.now();
    const duplicate = await http.db.transaction(async (tx) => {
      const auth = (await tx.execute(sql`SELECT epoch FROM outlet_authority WHERE tenant_id = ${dev.tenant_id} AND outlet_id = ${dev.outlet_id} FOR SHARE`)).rows[0] as { epoch: string } | undefined;
      if (!auth || Number(auth.epoch) !== ack.authorityEpoch) throw new DomainError("REVISION_CONFLICT", { reason: "stale_epoch" });
      const r = await tx.execute(sql`
        INSERT INTO edge_acks (tenant_id, outlet_id, device_id, command_id, status, sequence, authority_epoch, body, received_at)
        VALUES (${dev.tenant_id}, ${dev.outlet_id}, ${dev.id}, ${ack.commandId}, ${ack.status}, ${ack.sequence}, ${ack.authorityEpoch}, ${JSON.stringify(ack)}::jsonb, ${now.toISOString()})
        ON CONFLICT (device_id, command_id, status) DO NOTHING RETURNING id`);
      return r.rows.length === 0;
    });
    return http.send(req, { duplicate }, ack.authorityEpoch);
  });
}
