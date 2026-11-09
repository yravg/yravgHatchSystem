// Contract: Midtrans sandbox wire details. The notification signature is SHA512(order_id + status_code + gross_amount +
// SignatureSecretKey) over the EXACT provider strings, compared in constant time. The status call authenticates with
// the ServerKey (HTTP Basic). Nothing here logs, returns or stores a key, a URL or a response body.
import { createHash, timingSafeEqual } from "node:crypto";
import type { PaymentsConfig } from "./config.ts";
import { ProviderError } from "./errors.ts";

export const midtransSignature = (orderId: string, statusCode: string, grossAmount: string, secret: string): string =>
  createHash("sha512").update(orderId + statusCode + grossAmount + secret).digest("hex");

/** True when `given` matches the signature made with ANY configured secret. Every secret is compared (no early exit). */
export function signatureValid(secrets: readonly string[], n: { order_id: string; status_code: string; gross_amount: string }, given: string): boolean {
  const got = Buffer.from(given, "utf8");
  let ok = false;
  for (const s of secrets) {
    const want = Buffer.from(midtransSignature(n.order_id, n.status_code, n.gross_amount, s), "utf8");
    if (want.length === got.length && timingSafeEqual(want, got)) ok = true;
  }
  return ok;
}

/** "10000" or "10000.00" is Rp10.000; anything else (fractions, signs, exponents) is not a rupiah amount. */
export function parseGross(v: unknown): bigint | undefined {
  return typeof v === "string" && /^(0|[1-9][0-9]{0,14})(\.0{1,2})?$/.test(v) ? BigInt(v.split(".")[0] as string) : undefined;
}

export interface ProviderStatus {
  orderId: string; statusCode: string; transactionStatus: string; grossAmount: string; merchantId: string;
  currency: string; paymentType: string; fraudStatus: string | undefined;
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

export class MidtransClient {
  private readonly cfg: PaymentsConfig;
  private readonly doFetch: typeof fetch;
  constructor(cfg: PaymentsConfig, doFetch: typeof fetch = fetch) { this.cfg = cfg; this.doFetch = doFetch; }

  private async call(method: "GET" | "POST", path: string, body?: unknown): Promise<{ status: number; json: Record<string, unknown> }> {
    try {
      const res = await this.doFetch(`${this.cfg.baseUrl}${path}`, {
        method,
        headers: { accept: "application/json", "content-type": "application/json", authorization: `Basic ${Buffer.from(`${this.cfg.serverKey}:`).toString("base64")}` },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(this.cfg.timeoutMs),
        redirect: "error",
      });
      if (res.status === 401 || res.status === 403) throw new ProviderError("auth");
      if (res.status >= 500) throw new ProviderError("http");
      const json = (await res.json().catch(() => { throw new ProviderError("shape"); })) as unknown;
      if (typeof json !== "object" || json === null || Array.isArray(json)) throw new ProviderError("shape");
      return { status: res.status, json: json as Record<string, unknown> };
    } catch (e) {
      if (e instanceof ProviderError) throw e;
      throw new ProviderError((e as Error).name === "TimeoutError" || (e as Error).name === "AbortError" ? "timeout" : "network");
    }
  }

  /** Dynamic QRIS charge. Returns the QR payload; success of the PAYMENT is never implied. */
  async charge(orderId: string, amountIdr: bigint, ttlSeconds: number): Promise<{ qrString: string }> {
    const r = await this.call("POST", "/v2/charge", {
      payment_type: "qris",
      transaction_details: { order_id: orderId, gross_amount: Number(amountIdr) },
      custom_expiry: { expiry_duration: Math.max(1, Math.ceil(ttlSeconds / 60)), unit: "minute" },
    });
    const qr = str(r.json["qr_string"]);
    if (str(r.json["status_code"]) !== "201" || str(r.json["order_id"]) !== orderId || !qr) throw new ProviderError("shape");
    return { qrString: qr };
  }

  /** Authenticated GET status: the only source of truth for value. A 404 is "not visible yet", so it is retryable. */
  async status(orderId: string): Promise<ProviderStatus> {
    const r = await this.call("GET", `/v2/${encodeURIComponent(orderId)}/status`);
    if (r.status === 404) throw new ProviderError("http");
    const j = r.json;
    const out: ProviderStatus = {
      orderId: str(j["order_id"]), statusCode: str(j["status_code"]), transactionStatus: str(j["transaction_status"]), grossAmount: str(j["gross_amount"]),
      merchantId: str(j["merchant_id"]), currency: str(j["currency"]), paymentType: str(j["payment_type"]), fraudStatus: typeof j["fraud_status"] === "string" ? j["fraud_status"] : undefined,
    };
    if (!out.orderId || !out.transactionStatus) throw new ProviderError("shape");
    return out;
  }
}
