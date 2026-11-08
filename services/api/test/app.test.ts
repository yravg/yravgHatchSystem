import { validateError } from "@yravg/contracts";
import { DomainError } from "@yravg/domain";
import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.ts";

describe("api scaffold: shared envelopes over HTTP", () => {
  it("GET /api/v1/health returns the success envelope", async () => {
    const res = await buildApp().inject({ url: "/api/v1/health" });
    const body = res.json();
    expect(res.statusCode).toBe(200);
    expect(body).toMatchObject({ data: { status: "ok" }, revision: 0 });
    expect(body.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(body.serverTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  });

  it("unknown route: 404 NOT_FOUND envelope that matches the shared schema", async () => {
    const res = await buildApp().inject({ url: "/api/v1/nope" });
    expect(res.statusCode).toBe(404);
    const body = validateError(res.json());
    expect(body.error).toMatchObject({ code: "NOT_FOUND", messageKey: "error.notFound", retryable: false });
  });

  it("AUTH_FORBIDDEN is 403 with code and messageKey, and no secrets", async () => {
    const app = buildApp();
    app.get("/t/forbidden", () => { throw new DomainError("AUTH_FORBIDDEN"); });
    const res = await app.inject({ url: "/t/forbidden" });
    expect(res.statusCode).toBe(403);
    expect(validateError(res.json()).error).toEqual({
      code: "AUTH_FORBIDDEN", messageKey: "error.authForbidden", retryable: false, details: {},
    });
  });

  it("malformed JSON body: 400 VALIDATION_FAILED", async () => {
    const app = buildApp();
    app.post("/t/echo", (req) => req.body);
    const res = await app.inject({ method: "POST", url: "/t/echo", headers: { "content-type": "application/json" }, payload: "{oops" });
    expect(res.statusCode).toBe(400);
    expect(validateError(res.json()).error.code).toBe("VALIDATION_FAILED");
  });

  it("unexpected failure: 500 INTERNAL_ERROR, retryable, internals not leaked", async () => {
    const app = buildApp();
    app.get("/t/boom", () => { throw new Error("db password=hunter2 at /srv/app.js:10"); });
    const res = await app.inject({ url: "/t/boom" });
    expect(res.statusCode).toBe(500);
    expect(res.body).not.toMatch(/hunter2|srv|stack/);
    expect(validateError(res.json()).error).toMatchObject({ code: "INTERNAL_ERROR", retryable: true });
  });
});
