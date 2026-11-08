import { createHash } from "node:crypto";
import { canonicalJson } from "@yravg/contracts";
import { DomainError } from "./errors.ts";

export interface IdempotencyScope {
  tenantId: string;
  actorId: string;
  route: string;
}

interface Entry<R> {
  requestHash: string;
  response: R;
}

export interface IdempotencyStore<R> {
  get(id: string): Entry<R> | undefined;
  set(id: string, entry: Entry<R>): void;
}

// shortcut: in-memory and synchronous. The API needs a Postgres table with a unique (tenant, actor, route, key)
// constraint and an atomic insert-with-effect; replace this store when the first mutating endpoint lands.
export class MemoryIdempotencyStore<R> implements IdempotencyStore<R> {
  private readonly rows = new Map<string, Entry<R>>();
  get(id: string): Entry<R> | undefined {
    return this.rows.get(id);
  }
  set(id: string, entry: Entry<R>): void {
    this.rows.set(id, entry);
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** Same key + same payload replays the stored response; same key + different payload is IDEMPOTENCY_CONFLICT. */
export function idempotent<R>(
  store: IdempotencyStore<R>,
  scope: IdempotencyScope,
  key: string | undefined,
  payload: unknown,
  effect: () => R,
): { replayed: boolean; response: R } {
  if (key === undefined || !UUID.test(key)) throw new DomainError("VALIDATION_FAILED", { field: "Idempotency-Key" });
  const id = canonicalJson([scope.tenantId, scope.actorId, scope.route, key]);
  const requestHash = createHash("sha256").update(canonicalJson(payload)).digest("hex");
  const seen = store.get(id);
  if (seen) {
    if (seen.requestHash !== requestHash) throw new DomainError("IDEMPOTENCY_CONFLICT");
    return { replayed: true, response: seen.response };
  }
  const response = effect(); // a throwing effect stores nothing, so the client may retry
  store.set(id, { requestHash, response });
  return { replayed: false, response };
}
