import { randomUUID } from "node:crypto";
import { DomainError, failure, success } from "@yravg/domain";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";

// T01 scaffold: the shared error envelope plus a health probe. No product endpoint lives here yet.
export function buildApp(): FastifyInstance {
  const app = Fastify({ genReqId: () => randomUUID() });

  app.setErrorHandler((err: FastifyError, req, reply) => {
    // Never echo err.message or the stack: unknown failures become INTERNAL_ERROR (CONTRACTS section 1).
    const domain = err instanceof DomainError
      ? err
      : err.statusCode !== undefined && err.statusCode >= 400 && err.statusCode < 500
        ? new DomainError("VALIDATION_FAILED")
        : new DomainError("INTERNAL_ERROR");
    return reply.status(domain.status).send(failure(domain, req.id));
  });

  app.setNotFoundHandler((req, reply) => reply.status(404).send(failure(new DomainError("NOT_FOUND"), req.id)));

  app.get("/api/v1/health", (req) => success({ status: "ok" }, { revision: 0, requestId: req.id, serverTime: new Date() }));

  return app;
}
