import { describe, expect, it, vi } from "vitest";
import { validateError } from "@yravg/contracts";
import {
  DomainError,
  MemoryIdempotencyStore,
  failure,
  guardedMutation,
  idempotent,
  idrToJson,
  parseIdr,
  success,
  type RequestContext,
  type Scoped,
} from "../src/index.ts";

const KEY_A = "0190a1b2-c3d4-4e5f-8a6b-7c8d9e0f1a2b";
const KEY_B = "0190a1b2-c3d4-4e5f-8a6b-7c8d9e0f1a2c";
const scope = { tenantId: "t1", actorId: "u1", route: "POST /api/v1/sales" };

const codeOf = (fn: () => unknown): string | undefined => {
  try {
    fn();
  } catch (e) {
    return e instanceof DomainError ? e.code : "NOT_A_DOMAIN_ERROR";
  }
  return undefined;
};

describe("money: integer IDR as decimal strings", () => {
  it("parses decimal strings to bigint and back, beyond 2^53", () => {
    expect(parseIdr("18000")).toBe(18000n);
    expect(idrToJson(parseIdr("9007199254740993"))).toBe("9007199254740993");
    expect(idrToJson(0n)).toBe("0");
  });
  it("rejects numbers, floats, negatives, leading zeros, exponent, blanks", () => {
    for (const bad of [18000, 1.5, "-1", "1.0", "01", "1e3", "", " 5", null, undefined]) {
      expect(codeOf(() => parseIdr(bad))).toBe("VALIDATION_FAILED");
    }
  });
  it("refuses to serialise a negative amount", () => {
    expect(codeOf(() => idrToJson(-1n))).toBe("VALIDATION_FAILED");
  });
});

describe("response envelope", () => {
  it("success wraps data with revision, requestId and UTC serverTime", () => {
    expect(success({ ok: true }, { revision: 3, requestId: "r1", serverTime: new Date("2026-11-08T14:00:00.123Z") })).toEqual({
      data: { ok: true },
      revision: 3,
      requestId: "r1",
      serverTime: "2026-11-08T14:00:00Z",
    });
  });
  it.each([
    ["AUTH_FORBIDDEN", 403, "error.authForbidden", false],
    ["NOT_FOUND", 404, "error.notFound", false],
    ["VALIDATION_FAILED", 400, "error.validationFailed", false],
    ["REVISION_CONFLICT", 409, "error.revisionConflict", false],
    ["IDEMPOTENCY_CONFLICT", 409, "error.idempotencyConflict", false],
  ] as const)("%s maps to status %i with messageKey and matches the shared schema", (code, status, messageKey, retryable) => {
    const err = new DomainError(code, { field: "x" });
    const env = failure(err, "r1");
    expect(err.status).toBe(status);
    expect(env).toEqual({ error: { code, messageKey, retryable, details: { field: "x" } }, requestId: "r1" });
    expect(validateError(env)).toBe(env);
  });
  it("refuses details that could carry secrets or stack traces", () => {
    for (const k of ["token", "apiKey", "password", "stack", "Authorization", "secret"]) {
      expect(() => new DomainError("VALIDATION_FAILED", { [k]: "v" })).toThrow(/details/);
    }
  });
});

describe("idempotency", () => {
  it("same key + same payload replays the first result and runs the effect once", () => {
    const store = new MemoryIdempotencyStore<{ id: number }>();
    const effect = vi.fn(() => ({ id: 1 }));
    const a = idempotent(store, scope, KEY_A, { amount: "18000", lines: [1, 2] }, effect);
    const b = idempotent(store, scope, KEY_A, { lines: [1, 2], amount: "18000" }, effect); // key order differs
    expect(effect).toHaveBeenCalledTimes(1);
    expect(a).toEqual({ replayed: false, response: { id: 1 } });
    expect(b).toEqual({ replayed: true, response: { id: 1 } });
  });
  it("same key + different payload is IDEMPOTENCY_CONFLICT (409) with no new effect", () => {
    const store = new MemoryIdempotencyStore<number>();
    const effect = vi.fn(() => 1);
    idempotent(store, scope, KEY_A, { amount: "18000" }, effect);
    let err: unknown;
    try {
      idempotent(store, scope, KEY_A, { amount: "18001" }, effect);
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(DomainError);
    expect((err as DomainError).code).toBe("IDEMPOTENCY_CONFLICT");
    expect((err as DomainError).status).toBe(409);
    expect(effect).toHaveBeenCalledTimes(1);
  });
  it("a different key with the same payload is a separate request (caller owns whether that is legitimate)", () => {
    const store = new MemoryIdempotencyStore<number>();
    const effect = vi.fn(() => 1);
    idempotent(store, scope, KEY_A, { a: 1 }, effect);
    idempotent(store, scope, KEY_B, { a: 1 }, effect);
    expect(effect).toHaveBeenCalledTimes(2);
  });
  it("is scoped by tenant, actor and route", () => {
    const store = new MemoryIdempotencyStore<number>();
    const effect = vi.fn(() => 1);
    idempotent(store, scope, KEY_A, { a: 1 }, effect);
    idempotent(store, { ...scope, tenantId: "t2" }, KEY_A, { a: 2 }, effect);
    idempotent(store, { ...scope, route: "POST /api/v1/orders" }, KEY_A, { a: 3 }, effect);
    expect(effect).toHaveBeenCalledTimes(3);
  });
  it("a failed effect stores nothing, so the retry runs again", () => {
    const store = new MemoryIdempotencyStore<number>();
    const effect = vi.fn().mockImplementationOnce(() => { throw new Error("boom"); }).mockImplementation(() => 7);
    expect(() => idempotent(store, scope, KEY_A, { a: 1 }, effect)).toThrow("boom");
    expect(idempotent(store, scope, KEY_A, { a: 1 }, effect).response).toBe(7);
  });
  it("rejects a missing or non-UUID key", () => {
    const store = new MemoryIdempotencyStore<number>();
    for (const bad of [undefined, "", "abc", "12345"]) {
      expect(codeOf(() => idempotent(store, scope, bad, {}, () => 1))).toBe("VALIDATION_FAILED");
    }
  });
});

describe("tenant scope, permission and revision guards", () => {
  const ctx: RequestContext = { tenantId: "t1", outletId: "o1", actorId: "u1", permissions: new Set(["session.write"]) };
  const fresh = (): Scoped & { name: string } => ({ tenantId: "t1", outletId: "o1", revision: 4, name: "ps5-01" });

  it("applies the mutation and bumps revision when everything is valid", () => {
    const r = fresh();
    const out = guardedMutation(ctx, r, { permission: "session.write", expectedRevision: 4 }, (x) => ({ ...x, name: "ps5-02" }));
    expect(out).toMatchObject({ name: "ps5-02", revision: 5 });
  });

  const denied: [string, RequestContext, Scoped | undefined, number, string][] = [
    ["cross-tenant id", ctx, { ...fresh(), tenantId: "t2" }, 4, "NOT_FOUND"],
    ["other outlet of same tenant", ctx, { ...fresh(), outletId: "o2" }, 4, "NOT_FOUND"],
    ["unknown id", ctx, undefined, 4, "NOT_FOUND"],
    ["role without permission", { ...ctx, permissions: new Set(["session.read"]) }, fresh(), 4, "AUTH_FORBIDDEN"],
    ["stale version", ctx, fresh(), 3, "REVISION_CONFLICT"],
  ];
  it.each(denied)("%s: typed error and the mutation never runs", (_n, c, resource, rev, code) => {
    const mutate = vi.fn((x: Scoped) => x);
    const before = resource ? structuredClone(resource) : undefined;
    expect(codeOf(() => guardedMutation(c, resource, { permission: "session.write", expectedRevision: rev }, mutate))).toBe(code);
    expect(mutate).not.toHaveBeenCalled();
    expect(resource).toEqual(before);
  });
  it("cross-tenant denial does not leak existence: same error as unknown id", () => {
    const run = (r: Scoped | undefined): DomainError => {
      try {
        guardedMutation(ctx, r, { permission: "session.write", expectedRevision: 4 }, (x) => x);
      } catch (e) {
        return e as DomainError;
      }
      throw new Error("expected denial");
    };
    const other = run({ ...fresh(), tenantId: "t2" });
    const missing = run(undefined);
    expect([other.status, other.code, other.details]).toEqual([missing.status, missing.code, missing.details]);
  });
});
