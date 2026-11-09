// Contract: T47 HTTP API. Stations (tenant/outlet scoped, atomic reserve), immutable rate-rule versions, immutable quotes.
// Money in JSON is a decimal string, duration is integer seconds. EVERY money figure here is a SANDBOX FIXTURE (D01, D26).
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { call, enrolAndConfirm, harness, login, type Harness } from "./support.ts";

let h: Harness;
let owner: Awaited<ReturnType<typeof login>>;
let cashier: Awaited<ReturnType<typeof login>>;
let ownerB: Awaited<ReturnType<typeof login>>;
let cashierA2: Awaited<ReturnType<typeof login>>;
const P = "/api/v1";
const as = (s: { cookie: string; csrf: string }) => ({ cookie: s.cookie, csrf: s.csrf });
const MIN = 60;

beforeAll(async () => {
  h = await harness();
  owner = await login(h.app, "ownerA", { outletId: h.world.outletA1 });
  await enrolAndConfirm(h, owner);
  ownerB = await login(h.app, "ownerB");
  await enrolAndConfirm(h, ownerB);
  cashier = await login(h.app, "cashierA");
  cashierA2 = await login(h.app, "cashierA2");
});
afterAll(async () => { await h.close(); });

const newStation = async (name: string) => {
  const r = await call(h.app, "POST", `${P}/stations`, { ...as(owner), body: { name, zone: "reguler" } });
  expect(r.status).toBe(200);
  return r.json["data"].stationId as string;
};
const newRule = async (body: Record<string, unknown>) => call(h.app, "POST", `${P}/rate-rules`, { ...as(owner), body });
const quote = async (stationId: string, segments: { seconds: number; paused: boolean }[]) =>
  call(h.app, "POST", `${P}/quotes`, { ...as(cashier), body: { stationId, segments } });

describe("stations", () => {
  it("owner creates and lists stations; a cashier may list but not create", async () => {
    const id = await newStation("PS-01");
    const denied = await call(h.app, "POST", `${P}/stations`, { ...as(cashier), body: { name: "PS-X" } });
    expect(denied.status).toBe(403);
    const list = await call(h.app, "GET", `${P}/stations`, as(cashier));
    expect(list.status).toBe(200);
    expect((list.json["data"].stations as { stationId: string }[]).some((s) => s.stationId === id)).toBe(true);
    const one = await call(h.app, "GET", `${P}/stations/${id}`, as(cashier));
    expect(one.json["data"]).toMatchObject({ stationId: id, name: "PS-01", zone: "reguler", status: "available" });
  });

  it("a duplicate name in the same outlet is a typed 409, not a 500", async () => {
    await newStation("PS-DUP");
    const r = await call(h.app, "POST", `${P}/stations`, { ...as(owner), body: { name: "PS-DUP" } });
    expect(r.status).toBe(409);
  });

  it("cross-tenant and cross-outlet reads are 404 and never 403", async () => {
    const id = await newStation("PS-SCOPE");
    expect((await call(h.app, "GET", `${P}/stations/${id}`, as(ownerB))).status).toBe(404);
    expect((await call(h.app, "GET", `${P}/stations/${id}`, as(cashierA2))).status).toBe(404);
    expect((await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(ownerB), body: {} })).status).toBe(404);
  });

  it("rejects tenantId or outletId smuggled in the body", async () => {
    const r = await call(h.app, "POST", `${P}/stations`, { ...as(owner), body: { name: "PS-EVIL", tenantId: h.world.tenantB } });
    expect(r.status).toBe(400);
  });

  it("requires a session", async () => {
    expect((await call(h.app, "GET", `${P}/stations`)).status).toBe(401);
  });

  it("exactly one of N concurrent reserve requests wins over real HTTP", async () => {
    const id = await newStation("PS-RACE");
    await h.app.listen({ host: "127.0.0.1", port: 0 });
    try {
      const addr = h.app.server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      const N = 12;
      const results = await Promise.all(Array.from({ length: N }, () => fetch(`http://127.0.0.1:${port}${P}/stations/${id}/reserve`, {
        method: "POST",
        headers: { cookie: cashier.cookie, "x-hatch-csrf": cashier.csrf, "idempotency-key": randomUUID(), "content-type": "application/json" },
        body: "{}",
      }).then((r) => r.status)));
      expect(results.filter((s) => s === 200)).toHaveLength(1);
      expect(results.filter((s) => s === 409)).toHaveLength(N - 1);
    } finally {
      await h.app.server.close?.();
    }
    const rows = (await h.pool.query("SELECT status, reserved_by FROM stations WHERE id = $1", [id])).rows;
    expect(rows[0].status).toBe("reserved");
  });

  it("the same Idempotency-Key replays the same reservation instead of conflicting", async () => {
    const id = await newStation("PS-IDEM");
    const key = randomUUID();
    const a = await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(cashier), key, body: {} });
    const b = await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(cashier), key, body: {} });
    expect([a.status, b.status]).toEqual([200, 200]);
    expect(b.json["data"]).toEqual(a.json["data"]);
    expect((await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(cashier), body: {} })).status).toBe(409);
  });

  it("only the reserver or a station manager may release, then it can be reserved again", async () => {
    const id = await newStation("PS-REL");
    await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(cashier), body: {} });
    expect((await call(h.app, "POST", `${P}/stations/${id}/release`, { ...as(cashierA2), body: {} })).status).toBe(404); // other outlet
    const other = await login(h.app, "managerA", { outletId: h.world.outletA1 });
    await enrolAndConfirm(h, other);
    expect((await call(h.app, "POST", `${P}/stations/${id}/release`, { ...as(other), body: {} })).status).toBe(200); // manager holds station.manage
    expect((await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(cashier), body: {} })).status).toBe(200);
  });

  it("a retired station cannot be reserved, and a stale revision is refused", async () => {
    const id = await newStation("PS-RET");
    const stale = await call(h.app, "POST", `${P}/stations/${id}/retire`, { ...as(owner), body: { expectedRevision: 99 } });
    expect(stale.status).toBe(409);
    const ok = await call(h.app, "POST", `${P}/stations/${id}/retire`, { ...as(owner), body: { expectedRevision: 1 } });
    expect(ok.status).toBe(200);
    expect((await call(h.app, "POST", `${P}/stations/${id}/reserve`, { ...as(cashier), body: {} })).status).toBe(409);
  });
});

describe("rate rules and quotes (sandbox fixtures)", () => {
  let station: string;
  beforeAll(async () => { station = await newStation("PS-RATE"); });

  it("a quote without any rule is 404; a cashier cannot create rules", async () => {
    expect((await quote(station, [{ seconds: 61, paused: false }])).status).toBe(404);
    expect((await call(h.app, "POST", `${P}/rate-rules`, { ...as(cashier), body: { ratePerHourIdr: "10000" } })).status).toBe(403);
  });

  it("v1 Rp10.000/hour: minimum is disabled by default and 61 s quotes exactly 610000/3600 = Rp169", async () => {
    const r = await newRule({ ratePerHourIdr: "10000" });
    expect(r.status).toBe(200);
    expect(r.json["data"]).toMatchObject({ version: 1, ratePerHourIdr: "10000", minimum: null });
    const q = await quote(station, [{ seconds: 61, paused: false }]);
    expect(q.status).toBe(200);
    expect(q.json["data"]).toMatchObject({ amountIdr: "169", exact: { numerator: "610000", denominator: "3600" }, billableSeconds: 61, minimumApplied: false });
    expect(q.json["data"].ruleVersion.version).toBe(1);
  });

  it("a new rule version never changes an old quote, and the new quote cites the new version", async () => {
    const old = await quote(station, [{ seconds: 61, paused: false }]);
    h.clock.advance(3600);
    const v2 = await newRule({ ratePerHourIdr: "12000", minimum: { amountIdr: "5000", coveredSeconds: 30 * MIN } });
    expect(v2.json["data"]).toMatchObject({ version: 2, minimum: { amountIdr: "5000", coveredSeconds: 1800 } });
    const again = await call(h.app, "GET", `${P}/quotes/${old.json["data"].quoteId}`, as(cashier));
    expect(again.json["data"]).toEqual(old.json["data"]); // identical, including the cited rule version
    expect(again.json["data"].ruleVersion.version).toBe(1);
    const fresh = await quote(station, [{ seconds: 61, paused: false }]);
    expect(fresh.json["data"].ruleVersion.version).toBe(2);
  });

  it("with the minimum fixture: 20 min = 5.000, 30 min = 5.000, 40 min = 7.000; pause is not billed", async () => {
    const amt = async (segs: { seconds: number; paused: boolean }[]) => (await quote(station, segs)).json["data"].amountIdr as string;
    expect(await amt([{ seconds: 20 * MIN, paused: false }])).toBe("5000");
    expect(await amt([{ seconds: 30 * MIN, paused: false }])).toBe("5000");
    expect(await amt([{ seconds: 40 * MIN, paused: false }])).toBe("7000");
    expect(await amt([{ seconds: 20 * MIN, paused: false }, { seconds: 50 * MIN, paused: true }, { seconds: 10 * MIN, paused: false }])).toBe("5000");
  });

  it("an effective date earlier than the latest version is refused", async () => {
    const r = await newRule({ ratePerHourIdr: "9000", effectiveFrom: "2020-01-01T00:00:00Z" });
    expect(r.status).toBe(400);
  });

  it("an enabled minimum needs both fields; money as a JSON number or negative is refused", async () => {
    expect((await newRule({ ratePerHourIdr: 10000 })).status).toBe(400);
    expect((await newRule({ ratePerHourIdr: "-1" })).status).toBe(400);
    expect((await newRule({ ratePerHourIdr: "10000", minimum: { amountIdr: "5000" } })).status).toBe(400);
    expect((await quote(station, [{ seconds: 1.5, paused: false }])).status).toBe(400);
  });

  it("the same Idempotency-Key replays a quote; the same key with another body is 409", async () => {
    const key = randomUUID();
    const body = { stationId: station, segments: [{ seconds: 61, paused: false }] };
    const a = await call(h.app, "POST", `${P}/quotes`, { ...as(cashier), key, body });
    const b = await call(h.app, "POST", `${P}/quotes`, { ...as(cashier), key, body });
    expect(b.json["data"].quoteId).toBe(a.json["data"].quoteId);
    const c = await call(h.app, "POST", `${P}/quotes`, { ...as(cashier), key, body: { ...body, segments: [{ seconds: 62, paused: false }] } });
    expect(c.status).toBe(409);
  });

  it("rate rules and quotes are tenant scoped: another tenant sees 404 and its own empty list", async () => {
    const q = await quote(station, [{ seconds: 61, paused: false }]);
    expect((await call(h.app, "GET", `${P}/quotes/${q.json["data"].quoteId}`, as(ownerB))).status).toBe(404);
    expect((await call(h.app, "POST", `${P}/quotes`, { ...as(ownerB), body: { stationId: station, segments: [{ seconds: 1, paused: false }] } })).status).toBe(404);
    const list = await call(h.app, "GET", `${P}/rate-rules`, as(ownerB));
    expect(list.json["data"].versions).toEqual([]);
  });

  it("the database refuses to change or delete a rule version or a quote", async () => {
    await expect(h.pool.query("UPDATE rate_rule_versions SET rate_per_hour_idr = 1")).rejects.toThrow(/append-only/);
    await expect(h.pool.query("DELETE FROM quotes")).rejects.toThrow(/append-only/);
  });
});
