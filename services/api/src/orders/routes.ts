// Contract: orders HTTP API (T53). tenantId/outletId come from the session, never the body; money is a decimal string.
// An order is accepted (stock consumed once) before it is paid; payment, session and stock state are separate axes.
import { DomainError, parseIdr } from "@yravg/domain";
import type { FastifyInstance } from "fastify";
import type { IdentityDeps } from "../identity/service.ts";
import type { PaymentsConfig } from "../payments/config.ts";
import { bool, idParam, int, makeHttp, opt_, parse, req_, text, uuid, type Rule } from "../rates/http.ts";
import { cancelOrder, createOrder, orderView, payOrder, proveRefund, requestRefund, verifyQris } from "./service.ts";

const money: Rule = (v) => { try { return parseIdr(v) <= 1_000_000_000_000n ? v : undefined; } catch { return undefined; } };
const method: Rule = (v) => (v === "cash" || v === "qris" ? v : undefined);
const linesRule: Rule = (v) => {
  if (!Array.isArray(v) || v.length < 1 || v.length > 50) return undefined;
  v.forEach((l) => parse(l, { menuItemId: req_(uuid), qty: req_(int(1, 99)) }));
  return v;
};

export function registerOrders(app: FastifyInstance, deps: IdentityDeps, payments?: PaymentsConfig): void {
  const http = makeHttp(deps);
  const P = "/api/v1";

  app.post(`${P}/orders`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const b = parse<{ sessionId?: string; lines: { menuItemId: string; qty: number }[]; offline?: boolean }>(req.body, { sessionId: opt_(uuid), lines: req_(linesRule), offline: opt_(bool) });
    return http.mutate(req, p, b, async (tx) => ({ data: await createOrder(tx, p, http.now(), b), revision: 1 }));
  });

  app.get(`${P}/orders/:orderId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const v = await orderView(http.db, p, idParam(req, "orderId"));
    return http.send(req, v, v.revision);
  });

  app.post(`${P}/orders/:orderId/cancel`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const id = idParam(req, "orderId");
    const b = parse<{ reason: string }>(req.body, { reason: req_(text(1, 200)) });
    return http.mutate(req, p, b, async (tx) => { const d = await cancelOrder(tx, p, http.now(), id, b.reason); return { data: d, revision: d.revision }; });
  });

  app.post(`${P}/orders/:orderId/payments`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const id = idParam(req, "orderId");
    const b = parse<{ method: "cash" | "qris"; tenderIdr?: string; shiftId: string }>(req.body, { method: req_(method), tenderIdr: opt_(money), shiftId: req_(uuid) });
    if ((b.method === "cash") !== (b.tenderIdr !== undefined)) throw new DomainError("VALIDATION_FAILED", { field: "tenderIdr" });
    return http.mutate(req, p, b, async (tx) => ({ data: await payOrder(tx, p, http.now(), id, b, payments), revision: 1 }));
  });

  app.post(`${P}/orders/:orderId/payments/:paymentId/verify`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "checkout" });
    const id = idParam(req, "orderId");
    const pid = idParam(req, "paymentId");
    const b = parse(req.body, {});
    return http.mutate(req, p, b, async (tx) => ({ data: await verifyQris(tx, p, http.now(), id, pid, payments), revision: 1 }));
  });

  app.post(`${P}/orders/:orderId/refunds`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "refund.approve" });
    const id = idParam(req, "orderId");
    const b = parse<{ paymentId: string; reason: string }>(req.body, { paymentId: req_(uuid), reason: req_(text(1, 200)) });
    return http.mutate(req, p, b, async (tx) => ({ data: await requestRefund(tx, p, http.now(), id, b), revision: 1 }));
  });

  app.post(`${P}/order-refunds/:refundId/proof`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "refund.approve" });
    const id = idParam(req, "refundId");
    const b = parse<{ proofRef: string; shiftId?: string }>(req.body, { proofRef: req_(text(1, 120)), shiftId: opt_(uuid) });
    return http.mutate(req, p, b, async (tx) => ({ data: await proveRefund(tx, p, http.now(), id, b), revision: 2 }));
  });
}
