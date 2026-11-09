import { describe, expect, it } from "vitest";
import { loadServerConfig } from "../../services/api/src/server.ts";

const base = { PORT: "33101", DATABASE_URL: "postgres://u:secret-pw@127.0.0.1/db", HATCH_IDENTITY_KEY: Buffer.alloc(32, 1).toString("base64") };

describe("preview server config fails closed", () => {
  it("refuses HOST 0.0.0.0, :: and an empty or missing HOST", () => {
    for (const host of ["0.0.0.0", "::", "", undefined]) {
      expect(() => loadServerConfig({ ...base, HOST: host })).toThrow(/HOST/);
    }
  });

  it("accepts a specific address and never puts the connection string in an error", () => {
    expect(loadServerConfig({ ...base, HOST: "127.0.0.1" })).toMatchObject({ host: "127.0.0.1", port: 33101, payments: undefined });
    expect(() => loadServerConfig({ ...base, HOST: "127.0.0.1", DATABASE_URL: undefined })).toThrow(/DATABASE_URL/);
    try { loadServerConfig({ ...base, HOST: "0.0.0.0" }); } catch (e) { expect(String(e)).not.toMatch(/secret-pw/); }
  });

  it("enables payments only when every Midtrans sandbox value is present", () => {
    const m = { MIDTRANS_MERCHANT_ID: "G1", MIDTRANS_SERVER_KEY: "k", MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT: "s", MIDTRANS_BASE_URL: "https://api.sandbox.midtrans.com" };
    expect(loadServerConfig({ ...base, HOST: "127.0.0.1", ...m }).payments).toBeDefined();
    expect(() => loadServerConfig({ ...base, HOST: "127.0.0.1", ...m, MIDTRANS_SERVER_KEY: "" })).toThrow(/Midtrans/);
  });
});
