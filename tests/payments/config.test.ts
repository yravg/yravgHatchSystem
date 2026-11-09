// Contract: Midtrans configuration. ServerKey (API auth) and Signature Secret Key (notification verification) are two
// separate values with no fallback either way. Every key below is a labelled FIXTURE.
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildApp } from "../../services/api/src/app.ts";
import { loadPaymentsConfig } from "../../services/api/src/payments/config.ts";
import { midtransSignature } from "../../services/api/src/payments/midtrans.ts";
import { FIXTURE_KEY } from "../identity/support.ts";
import { FIXTURE_MERCHANT, FIXTURE_SERVER_KEY, FIXTURE_SIGNATURE_PREVIOUS, FIXTURE_SIGNATURE_SECRET } from "./mock-midtrans.ts";

const env = (o: Record<string, string | undefined> = {}): Record<string, string | undefined> => ({
  MIDTRANS_SERVER_KEY: FIXTURE_SERVER_KEY, MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT: FIXTURE_SIGNATURE_SECRET,
  MIDTRANS_MERCHANT_ID: FIXTURE_MERCHANT, MIDTRANS_BASE_URL: "http://127.0.0.1:9", ...o,
});

describe("payments config", () => {
  it("loads the four settings and keeps the two keys separate", () => {
    const c = loadPaymentsConfig(env({ MIDTRANS_SIGNATURE_SECRET_KEY_PREVIOUS: FIXTURE_SIGNATURE_PREVIOUS }));
    expect(c.serverKey).toBe(FIXTURE_SERVER_KEY);
    expect(c.signatureSecrets).toEqual([FIXTURE_SIGNATURE_SECRET, FIXTURE_SIGNATURE_PREVIOUS]);
    expect(c.merchantId).toBe(FIXTURE_MERCHANT);
  });

  it("startup fails closed when the signature secret is missing, even with a server key present", () => {
    expect(() => loadPaymentsConfig(env({ MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT: undefined }))).toThrow(/signature/i);
    expect(() => loadPaymentsConfig(env({ MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT: "" }))).toThrow(/signature/i);
    expect(() => loadPaymentsConfig(env({ MIDTRANS_SERVER_KEY: undefined }))).toThrow(/server key/i);
    expect(() => loadPaymentsConfig(env({ MIDTRANS_MERCHANT_ID: undefined }))).toThrow(/merchant/i);
  });

  it("the app refuses to start payments without a signature secret", () => {
    const bad = { merchantId: FIXTURE_MERCHANT, serverKey: FIXTURE_SERVER_KEY, signatureSecrets: [], baseUrl: "http://127.0.0.1:9", timeoutMs: 100, intentTtlSeconds: 900, pollSeconds: 30 };
    const pool = {} as never;
    expect(() => buildApp({ identity: { pool, key: FIXTURE_KEY }, payments: bad })).toThrow(/signature/i);
  });

  it("equal legacy values are accepted but stay two separate settings", () => {
    const c = loadPaymentsConfig(env({ MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT: FIXTURE_SERVER_KEY }));
    expect(c.signatureSecrets).toEqual([FIXTURE_SERVER_KEY]);
    expect(c.serverKey).toBe(FIXTURE_SERVER_KEY);
  });

  it("refuses a base URL that is neither loopback nor the Midtrans sandbox host (no live endpoint)", () => {
    expect(() => loadPaymentsConfig(env({ MIDTRANS_BASE_URL: "https://api.midtrans.com" }))).toThrow(/sandbox|loopback/i);
    expect(() => loadPaymentsConfig(env({ MIDTRANS_BASE_URL: "https://example.com" }))).toThrow(/sandbox|loopback/i);
    expect(() => loadPaymentsConfig(env({ MIDTRANS_BASE_URL: "http://127.0.0.1:8123" }))).not.toThrow();
    expect(() => loadPaymentsConfig(env({ MIDTRANS_BASE_URL: "https://api.sandbox.midtrans.com" }))).not.toThrow();
  });

  it("the signature is SHA512(order_id + status_code + gross_amount + secret) over the exact provider strings", () => {
    const want = createHash("sha512").update("ord-1" + "200" + "10000.00" + "s3cret").digest("hex");
    expect(midtransSignature("ord-1", "200", "10000.00", "s3cret")).toBe(want);
    expect(midtransSignature("ord-1", "200", "10000", "s3cret")).not.toBe(want); // no reformatting of gross_amount
  });
});
