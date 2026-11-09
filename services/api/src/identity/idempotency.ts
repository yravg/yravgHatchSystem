import { canonicalJson } from "@yravg/contracts";
import { DomainError } from "@yravg/domain";
import { sql } from "drizzle-orm";
import { open, seal, sha256 } from "./crypto.ts";
import type { Db, Tx } from "./db.ts";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export interface IdempotencyScope {
  tenantId: string;
  actorId: string;
  route: string;
}

/**
 * Postgres replacement for T01's in-memory store (closes the T01 gap "concurrent same-key untested").
 * The key row is inserted first, inside the same transaction as the effect. A concurrent request with the same key
 * blocks on the unique index until the first commits, then reads its hash: same payload replays, different payload is
 * IDEMPOTENCY_CONFLICT (409). If the first request fails, its row rolls back and the retry runs fresh.
 * The snapshot is sealed because MFA responses carry one-time secrets and recovery codes.
 */
export async function idempotent<R>(
  db: Db,
  sealKey: Buffer,
  scope: IdempotencyScope,
  key: string | undefined,
  payload: unknown,
  now: Date,
  effect: (tx: Tx) => Promise<R>,
): Promise<{ replayed: boolean; response: R }> {
  if (key === undefined || !UUID.test(key)) throw new DomainError("VALIDATION_FAILED", { field: "Idempotency-Key" });
  const requestHash = sha256(canonicalJson(payload));
  const aad = `idem:${scope.tenantId}:${scope.actorId}:${key}`;
  return db.transaction(async (tx) => {
    const inserted = await tx.execute(sql`
      INSERT INTO idempotency_keys (tenant_id, actor_id, route, key, request_hash, response_enc, created_at)
      VALUES (${scope.tenantId}, ${scope.actorId}, ${scope.route}, ${key}, ${requestHash}, '', ${now.toISOString()})
      ON CONFLICT DO NOTHING RETURNING 1`);
    if (inserted.rows.length === 0) {
      const seen = (await tx.execute(sql`
        SELECT request_hash, response_enc FROM idempotency_keys
        WHERE tenant_id = ${scope.tenantId} AND actor_id = ${scope.actorId} AND route = ${scope.route} AND key = ${key}`)).rows[0] as
        | { request_hash: string; response_enc: string }
        | undefined;
      if (!seen || seen.request_hash !== requestHash) throw new DomainError("IDEMPOTENCY_CONFLICT");
      return { replayed: true, response: JSON.parse(open(sealKey, seen.response_enc, aad)) as R };
    }
    const response = await effect(tx);
    await tx.execute(sql`
      UPDATE idempotency_keys SET response_enc = ${seal(sealKey, JSON.stringify(response), aad)}
      WHERE tenant_id = ${scope.tenantId} AND actor_id = ${scope.actorId} AND route = ${scope.route} AND key = ${key}`);
    return { replayed: false, response };
  });
}
