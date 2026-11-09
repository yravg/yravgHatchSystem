// Contract: tenant/outlet scoped ledger HTTP API. Money in JSON is a decimal string. Sandbox fixture figures only.
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { call, enrolAndConfirm, harness, login, type Harness } from "./support.ts";

let h: Harness;
let owner: Awaited<ReturnType<typeof login>>;
let ownerB: Awaited<ReturnType<typeof login>>;
let cashier: Awaited<ReturnType<typeof login>>;
const P = "/api/v1/ledger";
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

const sale = (amount: string) => [
  { account: "cash", debitIdr: amount, creditIdr: "0" },
  { account: "sales_revenue", debitIdr: "0", creditIdr: amount },
];
const post = (s: typeof owner, sourceEvent: string, lines: unknown, extra: Record<string, unknown> = {}, key?: string) =>
  call(h.app, "POST", `${P}/transactions`, { ...as(s), ...(key ? { key } : {}), body: { sourceEvent, lines, ...extra } });
const balances = async (s = owner) => {
  const r = await call(h.app, "GET", `${P}/balances`, as(s));
  expect(r.status).toBe(200);
  return Object.fromEntries((r.json["data"].balances as { account: string; balanceIdr: string }[]).map((b) => [b.account, b.balanceIdr]));
};

describe("ledger API", () => {
  it("owner posts a balanced transaction and the balances move", async () => {
    const r = await post(owner, "fixture:sale-1", sale("25000"));
    expect(r.status).toBe(200);
    expect(r.json["data"]).toMatchObject({ sourceEvent: "fixture:sale-1", kind: "manual", reversalOf: null });
    expect(r.json["data"].lines).toEqual([
      { account: "cash", debitIdr: "25000", creditIdr: "0" },
      { account: "sales_revenue", debitIdr: "0", creditIdr: "25000" },
    ]);
    expect(await balances()).toMatchObject({ cash: "25000", sales_revenue: "25000" });
    const got = await call(h.app, "GET", `${P}/transactions/${r.json["data"].transactionId}`, as(owner));
    expect(got.json["data"].lines).toHaveLength(2);
  });

  it("an unbalanced, float-money or unknown-account request is a 400 and nothing is stored", async () => {
    const before = await balances();
    expect((await post(owner, "fixture:bad-1", [{ account: "cash", debitIdr: "100", creditIdr: "0" }, { account: "sales_revenue", debitIdr: "0", creditIdr: "99" }])).status).toBe(400);
    expect((await post(owner, "fixture:bad-2", [{ account: "cash", debitIdr: 100.5, creditIdr: "0" }, { account: "sales_revenue", debitIdr: "0", creditIdr: "100" }])).status).toBe(400);
    expect((await post(owner, "fixture:bad-3", [{ account: "bank_of_nowhere", debitIdr: "5", creditIdr: "0" }, { account: "sales_revenue", debitIdr: "0", creditIdr: "5" }])).status).toBe(400);
    expect((await post(owner, "fixture:bad-4", [{ account: "cash", debitIdr: "-5", creditIdr: "0" }, { account: "sales_revenue", debitIdr: "0", creditIdr: "-5" }])).status).toBe(400);
    expect(await balances()).toEqual(before);
  });

  it("a duplicate source event is a 409 and does not post twice", async () => {
    expect((await post(owner, "fixture:dup-1", sale("1000"))).status).toBe(200);
    const before = await balances();
    const again = await post(owner, "fixture:dup-1", sale("1000"));
    expect(again.status).toBe(409);
    expect(await balances()).toEqual(before);
  });

  it("the same Idempotency-Key replays the first answer instead of posting twice", async () => {
    const key = randomUUID();
    const a = await post(owner, "fixture:idem-1", sale("2000"), {}, key);
    const before = await balances();
    const b = await post(owner, "fixture:idem-1", sale("2000"), {}, key);
    expect(b.status).toBe(200);
    expect(b.json["data"].transactionId).toBe(a.json["data"].transactionId);
    expect(await balances()).toEqual(before);
  });

  it("concurrent posts with the same source event create exactly one transaction", async () => {
    const before = BigInt((await balances())["cash"] ?? "0");
    const rs = await Promise.all(Array.from({ length: 8 }, () => post(owner, "fixture:race-1", sale("300"))));
    expect(rs.filter((r) => r.status === 200)).toHaveLength(1);
    expect(rs.filter((r) => r.status === 409)).toHaveLength(7);
    expect(BigInt((await balances())["cash"] as string)).toBe(before + 300n);
  });

  it("a correction is an immutable reversal; a second reversal and a reversal of a reversal are refused", async () => {
    const orig = await post(owner, "fixture:rev-1", sale("4000"));
    const id = orig.json["data"].transactionId as string;
    const before = BigInt((await balances())["cash"] as string);
    const rev = await call(h.app, "POST", `${P}/transactions/${id}/reversal`, { ...as(owner), body: { reason: "fixture mistake" } });
    expect(rev.status).toBe(200);
    expect(rev.json["data"]).toMatchObject({ kind: "reversal", reversalOf: id });
    expect(rev.json["data"].lines).toEqual([
      { account: "cash", debitIdr: "0", creditIdr: "4000" },
      { account: "sales_revenue", debitIdr: "4000", creditIdr: "0" },
    ]);
    expect(BigInt((await balances())["cash"] as string)).toBe(before - 4000n);
    const original = await call(h.app, "GET", `${P}/transactions/${id}`, as(owner));
    expect(original.json["data"].lines[0]).toEqual({ account: "cash", debitIdr: "4000", creditIdr: "0" }); // never edited
    expect((await call(h.app, "POST", `${P}/transactions/${id}/reversal`, { ...as(owner), body: { reason: "again" } })).status).toBe(409);
    expect((await call(h.app, "POST", `${P}/transactions/${rev.json["data"].transactionId}/reversal`, { ...as(owner), body: { reason: "undo undo" } })).status).toBe(409);
  });

  it("a movement that would make a balance negative is refused and changes nothing", async () => {
    const before = await balances();
    const r = await post(owner, "fixture:neg-1", [{ account: "sales_revenue", debitIdr: "999999999", creditIdr: "0" }, { account: "cash", debitIdr: "0", creditIdr: "999999999" }]);
    expect(r.status).toBe(409);
    expect(await balances()).toEqual(before);
  });

  it("reversing a sale whose cash was already paid out would go negative: refused, nothing changes", async () => {
    const a = await post(ownerB, "fixture:neg-2", sale("700"));
    expect((await post(ownerB, "fixture:neg-3", [{ account: "sales_revenue", debitIdr: "700", creditIdr: "0" }, { account: "cash", debitIdr: "0", creditIdr: "700" }])).status).toBe(200);
    const snapshot = await balances(ownerB);
    expect(snapshot).toMatchObject({ cash: "0", sales_revenue: "0" });
    const rev = await call(h.app, "POST", `${P}/transactions/${a.json["data"].transactionId}/reversal`, { ...as(ownerB), body: { reason: "too late" } });
    expect(rev.status).toBe(409);
    expect(await balances(ownerB)).toEqual(snapshot);
  });

  it("the ledger is tenant scoped: another tenant sees its own books and gets 404 for foreign ids", async () => {
    const mine = await post(owner, "fixture:tenant-1", sale("111"));
    const id = mine.json["data"].transactionId as string;
    expect((await call(h.app, "GET", `${P}/transactions/${id}`, as(ownerB))).status).toBe(404);
    expect((await call(h.app, "POST", `${P}/transactions/${id}/reversal`, { ...as(ownerB), body: { reason: "x" } })).status).toBe(404);
    expect((await post(ownerB, "fixture:tenant-1", sale("111"))).status).toBe(200); // same source event, other tenant
    expect((await balances(ownerB))["cash"]).toBe("111"); // only its own books
  });

  it("tenant and outlet come from the session; a body that names them is rejected", async () => {
    expect((await post(owner, "fixture:smuggle-1", sale("5"), { tenantId: h.world.tenantB })).status).toBe(400);
    expect((await post(owner, "fixture:smuggle-2", sale("5"), { outletId: h.world.outletA2 })).status).toBe(400);
  });

  it("a cashier cannot post, reverse or read the ledger, and an anonymous caller gets 401", async () => {
    expect((await post(cashier, "fixture:cashier-1", sale("5"))).status).toBe(403);
    expect((await call(h.app, "GET", `${P}/balances`, as(cashier))).status).toBe(403);
    expect((await call(h.app, "GET", `${P}/balances`)).status).toBe(401);
  });
});
