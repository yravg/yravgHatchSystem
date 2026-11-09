// Contract: QRIS intent API + provider notification endpoint. tenantId/outletId come from the session; the notification
// endpoint has no session, so it trusts nothing until the signature verifies, and takes the tenant ONLY from the stored
// intent found by order id. The callback itself never grants value: it stores the event, queues a verify job, answers 200.
// The worker later asks the provider (settlement.ts). Screenshots and client redirects are not inputs anywhere.
import { canonicalJson } from "@yravg/contracts";
import { DomainError, idrToJson, success } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { createHash } from "node:crypto";
import { connect } from "../identity/db.ts";
import type { IdentityDeps } from "../identity/service.ts";
import { idParam, makeHttp, parse, req_, uuid } from "../rates/http.ts";
import { assertPaymentsConfig, type PaymentsConfig } from "./config.ts";
import { PaymentError, ProviderError } from "./errors.ts";
import { MidtransClient, parseGross, signatureValid } from "./midtrans.ts";
import { enqueue, PAYMENT_VERIFY } from "./outbox.ts";

interface IntentRow {
  id: string; quote_id: string; station_id: string; status: string; amount_idr: string; currency: string; provider_order_id: string;
  qr_string: string | null; expires_at: Date; settled_at: Date | null; revision: number;
}
const COLS = sql`id, quote_id, station_id, status, amount_idr, currency, provider_order_id, qr_string, expires_at, settled_at, revision`;
const view = (r: IntentRow) => ({
  intentId: r.id, quoteId: r.quote_id, stationId: r.station_id, status: r.status, amountIdr: String(r.amount_idr), currency: r.currency,
  providerOrderId: r.provider_order_id, qrString: r.qr_string, expiresAt: new Date(r.expires_at).toISOString(),
  settledAt: r.settled_at ? new Date(r.settled_at).toISOString() : null, revision: r.revision,
});
const pgCode = (e: unknown): string | undefined => (e as { cause?: { code?: string }; code?: string }).cause?.code ?? (e as { code?: string }).code;
const str = (v: unknown, max = 200): string | undefined => (typeof v === "string" && v.length > 0 && v.length <= max ? v : undefined);

export function registerPayments(app: FastifyInstance, deps: IdentityDeps, config: PaymentsConfig): void {
  assertPaymentsConfig(config);
  const http = makeHttp(deps);
  const db = connect(deps.pool);
  const client = new MidtransClient(config);
  const P = "/api/v1/payments";

  app.post(`${P}/qris-intents`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const b = parse<{ quoteId: string; stationId: string }>(req.body, { quoteId: req_(uuid), stationId: req_(uuid) });
    return http.mutate(req, p, b, async (tx) => {
      const quote = (await tx.execute(sql`SELECT id, station_id, amount_idr FROM quotes WHERE id = ${b.quoteId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as { id: string; station_id: string; amount_idr: string } | undefined;
      if (!quote) throw new DomainError("NOT_FOUND");
      if (quote.station_id !== b.stationId) throw new DomainError("VALIDATION_FAILED", { field: "stationId" });
      const amount = BigInt(quote.amount_idr);
      if (amount <= 0n) throw new DomainError("VALIDATION_FAILED", { field: "amountIDR" });
      const st = (await tx.execute(sql`SELECT status, reserved_by, reserved_at FROM stations WHERE id = ${b.stationId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR SHARE`)).rows[0] as { status: string; reserved_by: string | null; reserved_at: Date } | undefined;
      if (!st) throw new DomainError("NOT_FOUND");
      if (st.status !== "reserved" || st.reserved_by !== p.staffId) throw new DomainError("REVISION_CONFLICT", { reason: "station_not_reserved_by_you" });
      const now = http.now();
      const id = crypto.randomUUID();
      const orderId = `hatch-${id}`;
      try {
        await tx.execute(sql`
          INSERT INTO payment_intents (id, tenant_id, outlet_id, quote_id, station_id, provider_order_id, merchant_id, amount_idr, status, station_reserved_by, station_reserved_at, created_by, expires_at, created_at)
          VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.quoteId}, ${b.stationId}, ${orderId}, ${config.merchantId}, ${amount.toString()}, 'pending', ${st.reserved_by}, ${new Date(st.reserved_at).toISOString()}, ${p.staffId},
                  ${new Date(now.getTime() + config.intentTtlSeconds * 1000).toISOString()}, ${now.toISOString()})`);
      } catch (e) {
        if (pgCode(e) === "23505") throw new DomainError("REVISION_CONFLICT", { reason: "quote_has_live_intent" });
        throw e;
      }
      let qr: string;
      try { qr = (await client.charge(orderId, amount, config.intentTtlSeconds)).qrString; }
      catch (e) { if (e instanceof ProviderError) throw new PaymentError("PROVIDER_UNAVAILABLE", { reason: e.reason }); throw e; }
      await tx.execute(sql`UPDATE payment_intents SET qr_string = ${qr} WHERE id = ${id}`);
      await enqueue(tx, { tenantId: p.tenantId, topic: PAYMENT_VERIFY, aggregateId: id, availableAt: new Date(now.getTime() + config.pollSeconds * 1000) });
      const row = (await tx.execute(sql`SELECT ${COLS} FROM payment_intents WHERE id = ${id}`)).rows[0] as unknown as IntentRow;
      return { data: view(row), revision: row.revision };
    });
  });

  app.get(`${P}/qris-intents/:intentId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const row = (await db.execute(sql`SELECT ${COLS} FROM payment_intents WHERE id = ${idParam(req, "intentId")} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0] as IntentRow | undefined;
    if (!row) throw new DomainError("NOT_FOUND");
    return http.send(req, view(row), row.revision); // query string (client redirect parameters) is ignored on purpose
  });

  app.post(`${P}/qris-intents/:intentId/abandon`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const id = idParam(req, "intentId");
    const b = parse(req.body, {});
    return http.mutate(req, p, b, async (tx) => {
      const cur = (await tx.execute(sql`SELECT ${COLS} FROM payment_intents WHERE id = ${id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`)).rows[0] as IntentRow | undefined;
      if (!cur) throw new DomainError("NOT_FOUND");
      if (cur.status !== "pending") throw new DomainError("REVISION_CONFLICT", { reason: "intent_not_pending" });
      const row = (await tx.execute(sql`UPDATE payment_intents SET status = 'abandoned', revision = revision + 1 WHERE id = ${id} RETURNING ${COLS}`)).rows[0] as unknown as IntentRow;
      return { data: view(row), revision: row.revision }; // the verify chain keeps running so a late payment is found
    });
  });

  app.get(`${P}/refunds`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "ledger.read" });
    const rows = (await db.execute(sql`SELECT id, intent_id, amount_idr, status, reason, provider_proof_ref, created_at FROM refunds WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ORDER BY created_at, id`)).rows as unknown as
      { id: string; intent_id: string; amount_idr: string; status: string; reason: string; provider_proof_ref: string | null; created_at: Date }[];
    return http.send(req, { refunds: rows.map((r) => ({ refundId: r.id, intentId: r.intent_id, amountIdr: idrToJson(BigInt(r.amount_idr)), status: r.status, reason: r.reason, providerProofRef: r.provider_proof_ref, createdAt: new Date(r.created_at).toISOString() })) });
  });

  // Public, signature-gated. Unknown extra members are ignored (the provider may add fields) and never trusted.
  app.post(`${P}/midtrans/notification`, async (req) => {
    const b = (typeof req.body === "object" && req.body !== null && !Array.isArray(req.body) ? req.body : {}) as Record<string, unknown>;
    const orderId = str(b["order_id"]); const statusCode = str(b["status_code"], 10); const gross = str(b["gross_amount"], 30); const given = str(b["signature_key"], 200);
    if (!orderId || !statusCode || !gross || !given) throw new DomainError("VALIDATION_FAILED", { field: "notification" });
    if (!signatureValid(config.signatureSecrets, { order_id: orderId, status_code: statusCode, gross_amount: gross }, given)) throw new DomainError("AUTH_FORBIDDEN", { reason: "signature" });
    const { signature_key: _drop, ...stored } = b; void _drop;
    const body = canonicalJson(stored);
    if (body.length > 8192) throw new DomainError("VALIDATION_FAILED", { field: "notification" });
    const rawHash = createHash("sha256").update(canonicalJson(b)).digest("hex");
    const now = http.now();
    const outcome = await db.transaction(async (tx) => {
      const intent = (await tx.execute(sql`SELECT id, tenant_id, amount_idr, merchant_id FROM payment_intents WHERE provider = 'midtrans' AND provider_order_id = ${orderId}`)).rows[0] as { id: string; tenant_id: string; amount_idr: string; merchant_id: string } | undefined;
      const mismatch = !!intent && (parseGross(gross) !== BigInt(intent.amount_idr) ||
        (typeof b["merchant_id"] === "string" && b["merchant_id"] !== intent.merchant_id) || (typeof b["currency"] === "string" && b["currency"] !== "IDR"));
      const kind = !intent ? "unknown_order" : mismatch ? "rejected_mismatch" : "queued";
      const ins = await tx.execute(sql`
        INSERT INTO provider_events (id, tenant_id, intent_id, provider_order_id, raw_hash, body, outcome, received_at)
        VALUES (${crypto.randomUUID()}, ${intent?.tenant_id ?? null}, ${intent?.id ?? null}, ${orderId}, ${rawHash}, ${body}::jsonb, ${kind}, ${now.toISOString()})
        ON CONFLICT (provider_order_id, raw_hash) DO NOTHING RETURNING id`);
      if (ins.rows.length === 0) return "duplicate";
      if (kind === "queued" && intent) await enqueue(tx, { tenantId: intent.tenant_id, topic: PAYMENT_VERIFY, aggregateId: intent.id, availableAt: now });
      return kind;
    });
    return success({ received: true, duplicate: outcome === "duplicate" }, { revision: 1, requestId: req.id, serverTime: now });
  });
}
