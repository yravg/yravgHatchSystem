// LOCAL MOCK of the Midtrans sandbox, bound to 127.0.0.1 only. Every key and id below is a labelled FIXTURE.
// It never talks to the network; it exists so the tests can prove authentication, matching and failure handling.
import { createHash } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

export const FIXTURE_SERVER_KEY = "FIXTURE-SERVER-KEY-not-a-real-key";
export const FIXTURE_SIGNATURE_SECRET = "FIXTURE-SIGNATURE-SECRET-not-a-real-key";
export const FIXTURE_SIGNATURE_PREVIOUS = "FIXTURE-SIGNATURE-SECRET-previous-not-real";
export const FIXTURE_MERCHANT = "G000FIXTURE";

export interface MockOrder {
  orderId: string; grossAmount: string; status: string; statusCode: string; fraud?: string;
  merchantId: string; currency: string; paymentType: string; orderIdInBody?: string;
}
export type Mode = "ok" | "down" | "hang";

export const signature = (orderId: string, statusCode: string, gross: string, secret: string): string =>
  createHash("sha512").update(orderId + statusCode + gross + secret).digest("hex");

export class MockMidtrans {
  readonly orders = new Map<string, MockOrder>();
  readonly calls: { method: string; path: string; authorization: string | undefined }[] = [];
  mode: Mode = "ok";
  baseUrl = "";
  private server: Server | undefined;
  private readonly sockets = new Set<import("node:net").Socket>();

  async start(): Promise<void> {
    this.server = createServer((req, res) => void this.handle(req, res));
    this.server.on("connection", (s) => { this.sockets.add(s); s.on("close", () => this.sockets.delete(s)); });
    await new Promise<void>((ok) => this.server!.listen(0, "127.0.0.1", ok));
    this.baseUrl = `http://127.0.0.1:${(this.server.address() as AddressInfo).port}`;
  }
  async stop(): Promise<void> {
    for (const s of this.sockets) s.destroy();
    await new Promise<void>((ok) => this.server?.close(() => ok()) ?? ok());
  }

  private async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const path = (req.url ?? "").split("?")[0] ?? "";
    this.calls.push({ method: req.method ?? "", path, authorization: req.headers.authorization });
    if (this.mode === "down") { req.socket.destroy(); return; }
    if (this.mode === "hang") return;
    const expected = `Basic ${Buffer.from(`${FIXTURE_SERVER_KEY}:`).toString("base64")}`;
    if (req.headers.authorization !== expected) return json(res, 401, { status_code: "401", status_message: "Unauthorized" });
    if (req.method === "POST" && path === "/v2/charge") {
      let raw = ""; for await (const c of req) raw += c;
      const b = JSON.parse(raw) as { payment_type: string; transaction_details: { order_id: string; gross_amount: number } };
      const o: MockOrder = { orderId: b.transaction_details.order_id, grossAmount: `${b.transaction_details.gross_amount}.00`, status: "pending", statusCode: "201", merchantId: FIXTURE_MERCHANT, currency: "IDR", paymentType: b.payment_type };
      this.orders.set(o.orderId, o);
      return json(res, 201, { ...view(o), qr_string: `00020101FIXTURE-QR-${o.orderId}` });
    }
    const m = /^\/v2\/([^/]+)\/status$/.exec(path);
    if (req.method === "GET" && m) {
      const o = this.orders.get(decodeURIComponent(m[1] as string));
      return o ? json(res, 200, view(o)) : json(res, 404, { status_code: "404", status_message: "not found" });
    }
    return json(res, 404, {});
  }

  /** Simulate the payer paying (what the provider would later report). */
  settle(orderId: string, patch: Partial<MockOrder> = {}): void { Object.assign(this.order(orderId), { status: "settlement", statusCode: "200", fraud: "accept" }, patch); }
  set(orderId: string, patch: Partial<MockOrder>): void { Object.assign(this.order(orderId), patch); }
  order(orderId: string): MockOrder { const o = this.orders.get(orderId); if (!o) throw new Error("unknown mock order"); return o; }

  /** A notification body as the provider would POST it, signed with `secret` (default: the fixture signature secret). */
  notification(orderId: string, o: { secret?: string; status?: string; statusCode?: string; gross?: string; merchant?: string; currency?: string; extra?: Record<string, unknown> } = {}): Record<string, unknown> {
    const ord = this.order(orderId);
    const statusCode = o.statusCode ?? ord.statusCode;
    const gross = o.gross ?? ord.grossAmount;
    return {
      order_id: orderId, status_code: statusCode, gross_amount: gross, transaction_status: o.status ?? ord.status,
      merchant_id: o.merchant ?? ord.merchantId, currency: o.currency ?? ord.currency, payment_type: "qris",
      signature_key: signature(orderId, statusCode, gross, o.secret ?? FIXTURE_SIGNATURE_SECRET), ...(o.extra ?? {}),
    };
  }
}

const view = (o: MockOrder) => ({
  status_code: o.statusCode, transaction_status: o.status, order_id: o.orderId, gross_amount: o.grossAmount, merchant_id: o.merchantId,
  currency: o.currency, payment_type: o.paymentType, ...(o.fraud ? { fraud_status: o.fraud } : {}),
});
const json = (res: ServerResponse, status: number, body: unknown): void => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
