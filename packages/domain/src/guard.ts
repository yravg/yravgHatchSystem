import { DomainError } from "./errors.ts";

// tenantId and outletId come from the authenticated context, never from the client (CONTRACTS section 1).
export interface RequestContext {
  tenantId: string;
  outletId: string;
  actorId: string;
  permissions: ReadonlySet<string>;
}

export interface Scoped {
  tenantId: string;
  outletId: string;
  revision: number;
}

/**
 * Order matters: scope first (404, hides existence), then permission (403), then revision (409).
 * The mutation runs only after all three pass, so a denial has no side effect.
 */
export function guardedMutation<T extends Scoped>(
  ctx: RequestContext,
  resource: T | undefined,
  opts: { permission: string; expectedRevision: number },
  mutate: (current: T) => T,
): T {
  if (!resource || resource.tenantId !== ctx.tenantId || resource.outletId !== ctx.outletId) {
    throw new DomainError("NOT_FOUND");
  }
  if (!ctx.permissions.has(opts.permission)) throw new DomainError("AUTH_FORBIDDEN");
  if (resource.revision !== opts.expectedRevision) throw new DomainError("REVISION_CONFLICT");
  return { ...mutate(resource), revision: resource.revision + 1 };
}
