import { randomUUID } from "node:crypto";
import { DomainError, failure, success } from "@yravg/domain";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import { registerDevices } from "./devices/routes.ts";
import { registerEdge } from "./edge/routes.ts";
import { IdentityError } from "./identity/errors.ts";
import { registerIdentity } from "./identity/routes.ts";
import type { IdentityDeps } from "./identity/service.ts";
import { assertPaymentsConfig, type PaymentsConfig } from "./payments/config.ts";
import { PaymentError } from "./payments/errors.ts";
import { registerPayments } from "./payments/routes.ts";
import { registerLedger } from "./ledger/routes.ts";
import { registerRates } from "./rates/routes.ts";
import { registerStations } from "./stations/routes.ts";

export interface AppOptions {
  /** When absent the identity routes are not registered (the T01 scaffold: health only). */
  identity?: IdentityDeps;
  /** Midtrans sandbox settings. Without them the payment routes are not registered; with an invalid set startup throws. */
  payments?: PaymentsConfig;
  logger?: { level: string; stream: NodeJS.WritableStream };
}

export function buildApp(opts: AppOptions = {}): FastifyInstance {
  if (opts.payments) assertPaymentsConfig(opts.payments); // fail closed before anything listens
  const app = Fastify({ genReqId: () => randomUUID(), ...(opts.logger ? { logger: opts.logger } : {}) });

  app.setErrorHandler((err: FastifyError, req, reply) => {
    if (err instanceof IdentityError || err instanceof PaymentError) {
      return reply.status(err.status).send({ error: { code: err.code, messageKey: err.messageKey, retryable: err.retryable, details: { ...err.details } }, requestId: req.id });
    }
    // Never echo err.message or the stack: unknown failures become INTERNAL_ERROR (CONTRACTS section 1).
    const domain = err instanceof DomainError
      ? err
      : err.statusCode !== undefined && err.statusCode >= 400 && err.statusCode < 500
        ? new DomainError("VALIDATION_FAILED")
        : new DomainError("INTERNAL_ERROR");
    if (domain.code === "INTERNAL_ERROR") req.log.error({ errName: err.name, errCode: err.code }, "unexpected failure");
    return reply.status(domain.status).send(failure(domain, req.id));
  });

  app.setNotFoundHandler((req, reply) => reply.status(404).send(failure(new DomainError("NOT_FOUND"), req.id)));

  app.get("/api/v1/health", (req) => success({ status: "ok" }, { revision: 0, requestId: req.id, serverTime: new Date() }));

  if (opts.identity) {
    registerIdentity(app, opts.identity);
    registerStations(app, opts.identity);
    registerRates(app, opts.identity);
    registerLedger(app, opts.identity);
    if (opts.payments) registerPayments(app, opts.identity, opts.payments);
    registerDevices(app, opts.identity);
    registerEdge(app, opts.identity);
  }

  return app;
}
