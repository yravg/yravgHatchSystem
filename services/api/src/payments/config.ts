// Contract: Midtrans settings, server side only. ServerKey authenticates our calls to the provider; the Signature Secret
// Key verifies provider notifications (CONTRACTS section 6, D15). There is NO fallback from one to the other, and the
// app refuses to start without a signature secret. Only loopback (the local mock) or the Midtrans sandbox host is allowed:
// a live endpoint is refused at configuration time. Error messages never contain a key value.
export interface PaymentsConfig {
  merchantId: string;
  serverKey: string;
  /** Current secret first, optional previous secret for bounded rotation. */
  signatureSecrets: readonly string[];
  baseUrl: string;
  timeoutMs: number;
  intentTtlSeconds: number;
  pollSeconds: number;
}

const SANDBOX_HOST = "api.sandbox.midtrans.com";
const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]"]);

export function assertPaymentsConfig(c: PaymentsConfig): void {
  if (!c.signatureSecrets.length || c.signatureSecrets.some((s) => !s)) throw new Error("Midtrans signature secret key is missing; refusing to start payments");
  if (!c.serverKey) throw new Error("Midtrans server key is missing; refusing to start payments");
  if (!c.merchantId) throw new Error("Midtrans merchant id is missing; refusing to start payments");
  let u: URL;
  try { u = new URL(c.baseUrl); } catch { throw new Error("Midtrans base URL is not a URL"); }
  const ok = (u.protocol === "http:" && LOOPBACK.has(u.hostname)) || (u.protocol === "https:" && u.hostname === SANDBOX_HOST);
  if (!ok) throw new Error("Midtrans base URL must be loopback or the Midtrans sandbox host; live endpoints are not allowed");
  if (!(c.timeoutMs > 0 && c.intentTtlSeconds > 0 && c.pollSeconds > 0)) throw new Error("Midtrans timing settings must be positive");
}

export function loadPaymentsConfig(env: Record<string, string | undefined>): PaymentsConfig {
  const previous = env["MIDTRANS_SIGNATURE_SECRET_KEY_PREVIOUS"];
  const c: PaymentsConfig = {
    merchantId: env["MIDTRANS_MERCHANT_ID"] ?? "",
    serverKey: env["MIDTRANS_SERVER_KEY"] ?? "",
    signatureSecrets: [env["MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT"] ?? "", ...(previous ? [previous] : [])],
    baseUrl: env["MIDTRANS_BASE_URL"] ?? "",
    timeoutMs: Number(env["MIDTRANS_TIMEOUT_MS"] ?? 5000),
    intentTtlSeconds: Number(env["MIDTRANS_INTENT_TTL_SECONDS"] ?? 900),
    pollSeconds: Number(env["MIDTRANS_POLL_SECONDS"] ?? 30),
  };
  if (!c.signatureSecrets[0]) c.signatureSecrets = []; // an empty current secret is a missing one
  assertPaymentsConfig(c);
  return c;
}
