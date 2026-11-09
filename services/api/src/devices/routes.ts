// Contract: tenant/outlet scoped device slots, pairing (D32 fixture: 8 digits, 5 minutes, staff approval, a refresh
// revokes the old code, 5 attempts per minute per device) and revocation. tenantId/outletId always come from the
// session or the stored device row, never the body. The pairing code is stored only as an HMAC.
// A wrong code is recorded and COMMITTED, then reported: the transaction must not roll the attempt back.
import { randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { verifyText } from "@yravg/contracts/leases";
import { DomainError } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { hmac } from "../identity/crypto.ts";
import type { Tx } from "../identity/db.ts";
import { IdentityError } from "../identity/errors.ts";
import type { IdentityDeps, Principal } from "../identity/service.ts";
import { idParam, makeHttp, opt_, parse, req_, text, uuid } from "../rates/http.ts";

export const CODE_TTL_SECONDS = 300;
export const MAX_ATTEMPTS_PER_MINUTE = 5;
const WINDOW_SECONDS = 60;
const KINDS = ["edge", "seat", "tv"] as const;
const PUBLIC_KEY = /^[A-Za-z0-9_-]{43}$/; // 32 raw bytes, base64url without padding
const PROOF = /^[A-Za-z0-9_-]{86}$/; // 64 byte Ed25519 signature

export interface DeviceRow {
  id: string; tenant_id: string; outlet_id: string; station_id: string | null; kind: string; name: string;
  status: string; public_key: string | null; revision: number; approved_at: Date | null; revoked_at: Date | null;
}
export const DEVICE_COLS = sql`id, tenant_id, outlet_id, station_id, kind, name, status, public_key, revision, approved_at, revoked_at`;

const iso = (d: Date | null): string | null => (d ? new Date(d).toISOString() : null);
export const deviceView = (r: DeviceRow) => ({
  deviceId: r.id, kind: r.kind, name: r.name, stationId: r.station_id, status: r.status, publicKey: r.public_key,
  approvedAt: iso(r.approved_at), revokedAt: iso(r.revoked_at), revision: r.revision,
});

const oneOf = (allowed: readonly string[]) => (v: unknown) => (typeof v === "string" && allowed.includes(v) ? v : undefined);
const reason = (r: string): DomainError => new DomainError("REVISION_CONFLICT", { reason: r });

async function scoped(tx: Tx, p: Principal, id: string): Promise<DeviceRow> {
  const row = (await tx.execute(sql`SELECT ${DEVICE_COLS} FROM devices WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as DeviceRow | undefined;
  if (!row) throw new DomainError("NOT_FOUND"); // another tenant's or outlet's device looks the same as a missing one
  return row;
}

/** Counts rows after `since`. Rows dated in the future still count, so rolling the clock back does not unlock. */
async function recent(tx: Tx, deviceId: string, kind: string, now: Date): Promise<number> {
  const since = new Date(now.getTime() - WINDOW_SECONDS * 1000).toISOString();
  const r = (await tx.execute(sql`SELECT count(*)::int AS n FROM pairing_attempts WHERE device_id = ${deviceId} AND kind = ${kind} AND at > ${since}::timestamptz`)).rows[0] as { n: number };
  return r.n;
}

export function registerDevices(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1/devices";
  const codeHash = (challengeId: string, code: string): string => hmac(deps.key, `pair:${challengeId}:${code}`);

  app.post(P, async (req) => {
    const p = await app.identity.authorize(req, { permission: "device.manage" });
    const b = parse<{ kind: string; name: string; stationId?: string }>(req.body, { kind: req_(oneOf(KINDS)), name: req_(text(1, 60)), stationId: opt_(uuid) });
    return http.mutate(req, p, b, async (tx) => {
      if (b.stationId) {
        const st = await tx.execute(sql`SELECT 1 FROM stations WHERE id = ${b.stationId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`);
        if (st.rows.length === 0) throw new DomainError("NOT_FOUND");
      }
      const id = randomUUID();
      const r = await tx.execute(sql`
        INSERT INTO devices (id, tenant_id, outlet_id, station_id, kind, name, created_by, created_at)
        VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.stationId ?? null}, ${b.kind}, ${b.name}, ${p.staffId}, ${http.now().toISOString()})
        RETURNING ${DEVICE_COLS}`);
      const row = r.rows[0] as unknown as DeviceRow;
      return { data: deviceView(row), revision: row.revision };
    });
  });

  app.get(P, async (req) => {
    const p = await app.identity.authorize(req, { permission: "device.manage" });
    const rows = (await http.db.execute(sql`SELECT ${DEVICE_COLS} FROM devices WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ORDER BY created_at, id`)).rows as unknown as DeviceRow[];
    return http.send(req, { devices: rows.map(deviceView) });
  });

  app.get(`${P}/:deviceId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "device.manage" });
    const id = idParam(req, "deviceId");
    const row = (await http.db.execute(sql`SELECT ${DEVICE_COLS} FROM devices WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as DeviceRow | undefined;
    if (!row) throw new DomainError("NOT_FOUND");
    return http.send(req, deviceView(row), row.revision);
  });

  // Called by the device itself. It authenticates by proving possession of the key it asks us to pin; staff approval
  // (typing the code shown on the device) is what makes that key trusted.
  app.post(`${P}/:deviceId/pairing-challenge`, async (req) => {
    const id = idParam(req, "deviceId");
    const b = parse<{ publicKey: string; proof: string }>(req.body, {
      publicKey: req_((v) => (typeof v === "string" && PUBLIC_KEY.test(v) ? v : undefined)),
      proof: req_((v) => (typeof v === "string" && PROOF.test(v) ? v : undefined)),
    });
    const now = http.now();
    const out = await http.db.transaction(async (tx) => {
      const dev = (await tx.execute(sql`SELECT ${DEVICE_COLS} FROM devices WHERE id = ${id} FOR UPDATE`)).rows[0] as DeviceRow | undefined;
      if (!dev) throw new DomainError("NOT_FOUND");
      if (dev.status !== "pending") throw reason(`device_${dev.status}`);
      if (!verifyText(b.publicKey, `hatch-pair-v1:${id}:${b.publicKey}`, b.proof)) throw new DomainError("AUTH_FORBIDDEN");
      if ((await recent(tx, id, "challenge", now)) >= MAX_ATTEMPTS_PER_MINUTE) return { limited: true as const };
      await tx.execute(sql`INSERT INTO pairing_attempts (device_id, kind, at) VALUES (${id}, 'challenge', ${now.toISOString()})`);
      await tx.execute(sql`UPDATE pairing_challenges SET status = 'revoked' WHERE device_id = ${id} AND status = 'active'`); // refresh revokes the old code
      const cid = randomUUID();
      const code = String(randomInt(0, 100_000_000)).padStart(8, "0");
      const expiresAt = new Date(now.getTime() + CODE_TTL_SECONDS * 1000);
      await tx.execute(sql`
        INSERT INTO pairing_challenges (id, tenant_id, outlet_id, device_id, code_hash, public_key, created_at, expires_at)
        VALUES (${cid}, ${dev.tenant_id}, ${dev.outlet_id}, ${id}, ${codeHash(cid, code)}, ${b.publicKey}, ${now.toISOString()}, ${expiresAt.toISOString()})`);
      return { limited: false as const, code, expiresAt: expiresAt.toISOString() };
    });
    if (out.limited) throw new IdentityError("RATE_LIMITED", { retryAfterSeconds: String(WINDOW_SECONDS) });
    return http.send(req, { code: out.code, expiresAt: out.expiresAt });
  });

  app.post(`${P}/:deviceId/pairing/approve`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "device.manage" });
    const id = idParam(req, "deviceId");
    const b = parse<{ code: string }>(req.body, { code: req_((v) => (typeof v === "string" && /^[0-9]{8}$/.test(v) ? v : undefined)) });
    const now = http.now();
    type Outcome = { ok: true; row: DeviceRow } | { ok: false; fail: "limited" | string };
    const out: Outcome = await http.db.transaction(async (tx): Promise<Outcome> => {
      const dev = await scoped(tx, p, id); // the row lock serialises attempts per device
      if (dev.status !== "pending") return { ok: false, fail: `device_${dev.status}` };
      if ((await recent(tx, id, "wrong_code", now)) >= MAX_ATTEMPTS_PER_MINUTE) return { ok: false, fail: "limited" }; // before looking at the code
      const ch = (await tx.execute(sql`SELECT id, code_hash, public_key, expires_at FROM pairing_challenges WHERE device_id = ${id} AND status = 'active'`)).rows[0] as
        { id: string; code_hash: string; public_key: string; expires_at: Date } | undefined;
      const wrong = async (why: string): Promise<Outcome> => {
        await tx.execute(sql`INSERT INTO pairing_attempts (device_id, kind, at) VALUES (${id}, 'wrong_code', ${now.toISOString()})`);
        return { ok: false, fail: why };
      };
      if (!ch) return wrong("no_challenge");
      if (new Date(ch.expires_at).getTime() <= now.getTime()) {
        await tx.execute(sql`UPDATE pairing_challenges SET status = 'expired' WHERE id = ${ch.id}`);
        return wrong("challenge_expired");
      }
      const want = codeHash(ch.id, b.code);
      if (want.length !== ch.code_hash.length || !timingEqual(want, ch.code_hash)) return wrong("wrong_code");
      await tx.execute(sql`UPDATE pairing_challenges SET status = 'approved' WHERE id = ${ch.id}`);
      const r = await tx.execute(sql`
        UPDATE devices SET status = 'active', public_key = ${ch.public_key}, approved_by = ${p.staffId}, approved_at = ${now.toISOString()}, revision = revision + 1
        WHERE id = ${id} RETURNING ${DEVICE_COLS}`);
      return { ok: true, row: r.rows[0] as unknown as DeviceRow };
    });
    if (!out.ok) {
      if (out.fail === "limited") throw new IdentityError("RATE_LIMITED", { retryAfterSeconds: String(WINDOW_SECONDS) });
      throw reason(out.fail);
    }
    return http.send(req, deviceView(out.row), out.row.revision);
  });

  app.post(`${P}/:deviceId/revoke`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "device.manage" });
    const id = idParam(req, "deviceId");
    const b = parse(req.body, {});
    return http.mutate(req, p, b, async (tx) => {
      const dev = await scoped(tx, p, id);
      if (dev.status === "revoked") return { data: deviceView(dev), revision: dev.revision };
      const r = await tx.execute(sql`
        UPDATE devices SET status = 'revoked', revoked_by = ${p.staffId}, revoked_at = ${http.now().toISOString()}, revision = revision + 1
        WHERE id = ${id} RETURNING ${DEVICE_COLS}`);
      await tx.execute(sql`UPDATE pairing_challenges SET status = 'revoked' WHERE device_id = ${id} AND status = 'active'`);
      // Revoking the edge that holds the outlet authority fences it: the epoch moves on and nobody holds it.
      await tx.execute(sql`
        UPDATE outlet_authority SET epoch = epoch + 1, edge_device_id = NULL, updated_at = ${http.now().toISOString()}
        WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} AND edge_device_id = ${id}`);
      const row = r.rows[0] as unknown as DeviceRow;
      return { data: deviceView(row), revision: row.revision };
    });
  });
}

const timingEqual = (a: string, b: string): boolean => timingSafeEqual(Buffer.from(a), Buffer.from(b));
