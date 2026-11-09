import { randomUUID } from "node:crypto";
import { DomainError, failure, success } from "@yravg/domain";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import { IdentityError } from "./identity/errors.ts";
import { registerIdentity } from "./identity/routes.ts";
import type { IdentityDeps } from "./identity/service.ts";
import { registerRates } from "./rates/routes.ts";
import { registerStations } from "./stations/routes.ts";

export interface AppOptions {
  /** When absent the identity routes are not registered (the T01 scaffold: health only). */
  identity?: IdentityDeps;
  logger?: { level: string; stream: NodeJS.WritableStream };
}

export function buildApp(opts: AppOptions = {}): FastifyInstance {
  const app = Fastify({ genReqId: () => randomUUID(), ...(opts.logger ? { logger: opts.logger } : {}) });

  app.setErrorHandler((err: FastifyError, req, reply) => {
    if (err instanceof IdentityError) {
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
  }

  return app;
}
