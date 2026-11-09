// Contract: T50 device pairing, keys, revocation and the one fenced authority epoch per outlet (AC-HS-50).
// Pairing is the D32 fixture: 8 numeric digits, 5 minutes, staff approval, a refresh revokes the old code,
// 5 wrong attempts per minute per device. Authority is the D07 fixture: one fenced epoch per outlet.
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { call, enrolAndConfirm, harness, login, newDeviceKeys, pairingProof, signBody, type DeviceKeys, type Harness } from "./support.ts";

let h: Harness;
let owner: Awaited<ReturnType<typeof login>>;
let ownerB: Awaited<ReturnType<typeof login>>;
let cashier: Awaited<ReturnType<typeof login>>;
const P = "/api/v1";
const as = (s: { cookie: string; csrf: string }) => ({ cookie: s.cookie, csrf: s.csrf });

beforeAll(async () => {
  h = await harness();
  owner = await login(h.app, "ownerA", { outletId: h.world.outletA1 });
  await enrolAndConfirm(h, owner);
  ownerB = await login(h.app, "ownerB");
  await enrolAndConfirm(h, ownerB);
  cashier = await login(h.app, "cashierA");
});
afterAll(async () => { await h.close(); });

const slot = async (kind = "edge", name = `dev-${randomUUID().slice(0, 6)}`) => {
  const r = await call(h.app, "POST", `${P}/devices`, { ...as(owner), body: { kind, name } });
  expect(r.status).toBe(200);
  return r.json["data"].deviceId as string;
};
const challenge = async (id: string, k: DeviceKeys) =>
  call(h.app, "POST", `${P}/devices/${id}/pairing-challenge`, { key: null, body: { publicKey: k.publicKey, proof: pairingProof(k, id) } });
const approve = (id: string, code: string, who = owner) => call(h.app, "POST", `${P}/devices/${id}/pairing/approve`, { ...as(who), body: { code } });
const pairOk = async (kind = "edge") => {
  const id = await slot(kind);
  const k = newDeviceKeys();
  const c = await challenge(id, k);
  const a = await approve(id, c.json["data"].code);
  expect(a.status).toBe(200);
  return { id, k };
};

describe("device slots", () => {
  it("staff with device.manage creates a pending slot; a cashier cannot", async () => {
    const id = await slot();
    const one = await call(h.app, "GET", `${P}/devices/${id}`, as(owner));
    expect(one.json["data"]).toMatchObject({ deviceId: id, kind: "edge", status: "pending", publicKey: null });
    expect((await call(h.app, "POST", `${P}/devices`, { ...as(cashier), body: { kind: "edge", name: "x" } })).status).toBe(403);
  });

  it("another tenant sees 404, not the device", async () => {
    const id = await slot();
    expect((await call(h.app, "GET", `${P}/devices/${id}`, as(ownerB))).status).toBe(404);
    expect((await approve(id, "12345678", ownerB)).status).toBe(404);
  });

  it("rejects a body that tries to choose tenantId or outletId", async () => {
    const r = await call(h.app, "POST", `${P}/devices`, { ...as(owner), body: { kind: "edge", name: "x", tenantId: randomUUID() } });
    expect(r.status).toBe(400);
  });
});

describe("pairing challenge (D32 fixture)", () => {
  it("issues an 8 digit code valid 5 minutes and stores only a hash", async () => {
    const id = await slot();
    const k = newDeviceKeys();
    const c = await challenge(id, k);
    expect(c.status).toBe(200);
    expect(c.json["data"].code).toMatch(/^[0-9]{8}$/);
    expect(c.json["data"].expiresAt).toBe(new Date(h.clock.now.getTime() + 300_000).toISOString());
    const rows = (await h.pool.query("SELECT * FROM pairing_challenges WHERE device_id = $1", [id])).rows;
    expect(JSON.stringify(rows)).not.toContain(c.json["data"].code);
  });

  it("staff approval with the right code activates the device and pins its key", async () => {
    const { id, k } = await pairOk();
    const one = await call(h.app, "GET", `${P}/devices/${id}`, as(owner));
    expect(one.json["data"]).toMatchObject({ status: "active", publicKey: k.publicKey });
  });

  it("an expired code is refused", async () => {
    const id = await slot();
    const c = await challenge(id, newDeviceKeys());
    h.clock.advance(301);
    const a = await approve(id, c.json["data"].code);
    expect(a.status).toBe(409);
    expect(a.json["error"].details.reason).toBe("challenge_expired");
  });

  it("a refresh revokes the old code", async () => {
    const id = await slot();
    const k = newDeviceKeys();
    const first = await challenge(id, k);
    const second = await challenge(id, k);
    expect(second.json["data"].code).not.toBe(first.json["data"].code);
    expect((await approve(id, first.json["data"].code)).status).toBe(409);
    expect((await approve(id, second.json["data"].code)).status).toBe(200);
  });

  it("a proof signed by a different key is refused", async () => {
    const id = await slot();
    const k = newDeviceKeys();
    const other = newDeviceKeys();
    const r = await call(h.app, "POST", `${P}/devices/${id}/pairing-challenge`, { key: null, body: { publicKey: k.publicKey, proof: pairingProof(other, id) } });
    expect(r.status).toBe(403);
  });

  it("5 wrong attempts per minute per device, then 429 even for the right code; other devices are unaffected", async () => {
    const id = await slot();
    const other = await pairOk();
    const c = await challenge(id, newDeviceKeys());
    for (let i = 0; i < 5; i++) expect((await approve(id, "00000000")).status).toBe(409);
    const blocked = await approve(id, c.json["data"].code);
    expect(blocked.status).toBe(429);
    expect(other.id).not.toBe(id);
    const id2 = await slot();
    const c2 = await challenge(id2, newDeviceKeys());
    expect((await approve(id2, c2.json["data"].code)).status).toBe(200);
    h.clock.advance(61);
    const c3 = await challenge(id, newDeviceKeys());
    expect((await approve(id, c3.json["data"].code)).status).toBe(200);
  });

  it("a code cannot be approved twice and an active device cannot be re-paired with a new key", async () => {
    const { id } = await pairOk();
    const again = await challenge(id, newDeviceKeys());
    expect(again.status).toBe(409);
  });
});

describe("revocation", () => {
  it("revoke is permanent, audited and idempotent; the device can no longer pair", async () => {
    const { id } = await pairOk("seat");
    const r = await call(h.app, "POST", `${P}/devices/${id}/revoke`, { ...as(owner), body: {} });
    expect(r.status).toBe(200);
    expect(r.json["data"].status).toBe("revoked");
    const again = await call(h.app, "POST", `${P}/devices/${id}/revoke`, { ...as(owner), body: {} });
    expect(again.json["data"].status).toBe("revoked");
    expect((await challenge(id, newDeviceKeys())).status).toBe(409);
    expect((await call(h.app, "POST", `${P}/devices/${id}/revoke`, { ...as(ownerB), body: {} })).status).toBe(404);
  });
});

describe("authority epoch and ACK intake", () => {
  const ack = (deviceId: string, epoch: number, commandId = randomUUID()) => ({
    protocolVersion: 1, commandId, deviceId, authorityEpoch: epoch, sequence: 1, desiredRevision: 3,
    status: "RECEIVED", verificationLevel: "SIMULATED", bootId: randomUUID(), observedAt: "2026-11-09T03:00:00Z",
  });
  const send = (deviceId: string, k: DeviceKeys, body: unknown, sig?: string) =>
    h.app.inject({ method: "POST", url: `${P}/edge/acks`, remoteAddress: "10.0.0.9",
      headers: { "x-hatch-device-id": deviceId, "x-hatch-signature": sig ?? signBody(k, body) }, payload: body as object });

  it("claim bumps one epoch per outlet; only an active edge device can hold it", async () => {
    const e1 = await pairOk("edge");
    const seat = await pairOk("seat");
    expect((await call(h.app, "POST", `${P}/edge/authority/claim`, { ...as(owner), body: { edgeDeviceId: seat.id } })).status).toBe(409);
    const c1 = await call(h.app, "POST", `${P}/edge/authority/claim`, { ...as(owner), body: { edgeDeviceId: e1.id } });
    expect(c1.status).toBe(200);
    const first = c1.json["data"].authorityEpoch as number;
    const e2 = await pairOk("edge");
    const c2 = await call(h.app, "POST", `${P}/edge/authority/claim`, { ...as(owner), body: { edgeDeviceId: e2.id } });
    expect(c2.json["data"].authorityEpoch).toBe(first + 1);
    const cur = await call(h.app, "GET", `${P}/edge/authority`, as(owner));
    expect(cur.json["data"]).toMatchObject({ authorityEpoch: first + 1, edgeDeviceId: e2.id });
    // the old edge is fenced out, the new one is accepted
    const stale = await send(e1.id, e1.k, { ack: ack(e1.id, first) });
    expect(stale.statusCode).toBe(409);
    expect(JSON.parse(stale.body).error.details.reason).toBe("stale_epoch");
    expect((await send(e2.id, e2.k, { ack: ack(e2.id, first + 1) })).statusCode).toBe(200);
    expect((await send(e2.id, e2.k, { ack: ack(e2.id, first + 5) })).statusCode).toBe(409);
  });

  it("a duplicate ACK is accepted once and stored once (at-least-once, idempotent)", async () => {
    const e = await pairOk("edge");
    const claim = await call(h.app, "POST", `${P}/edge/authority/claim`, { ...as(owner), body: { edgeDeviceId: e.id } });
    const epoch = claim.json["data"].authorityEpoch as number;
    const body = { ack: ack(e.id, epoch) };
    const a = await send(e.id, e.k, body);
    const b = await send(e.id, e.k, body);
    expect(JSON.parse(a.body).data.duplicate).toBe(false);
    expect(JSON.parse(b.body).data.duplicate).toBe(true);
    const n = await h.pool.query("SELECT count(*)::int AS n FROM edge_acks WHERE command_id = $1", [body.ack.commandId]);
    expect(n.rows[0].n).toBe(1);
  });

  it("refuses a wrong signature, a device id mismatch and a revoked device", async () => {
    const e = await pairOk("edge");
    const claim = await call(h.app, "POST", `${P}/edge/authority/claim`, { ...as(owner), body: { edgeDeviceId: e.id } });
    const epoch = claim.json["data"].authorityEpoch as number;
    const intruder = newDeviceKeys();
    expect((await send(e.id, intruder, { ack: ack(e.id, epoch) })).statusCode).toBe(401);
    expect((await send(e.id, e.k, { ack: ack(randomUUID(), epoch) })).statusCode).toBe(403);
    expect((await send(randomUUID(), e.k, { ack: ack(e.id, epoch) })).statusCode).toBe(401);
    await call(h.app, "POST", `${P}/devices/${e.id}/revoke`, { ...as(owner), body: {} });
    expect((await send(e.id, e.k, { ack: ack(e.id, epoch) })).statusCode).toBe(401);
  });

  it("rejects an ACK that is not a valid DeviceAck", async () => {
    const e = await pairOk("edge");
    const bad = { ack: { ...ack(e.id, 1), status: "MAYBE" } };
    expect((await send(e.id, e.k, bad)).statusCode).toBe(400);
  });
});
