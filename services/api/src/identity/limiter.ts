import { sql } from "drizzle-orm";
import type { Tx } from "./db.ts";
import { IdentityError } from "./errors.ts";

export type AttemptKind = "password" | "mfa";

export interface LimitConfig {
  maxWrongAttempts: number;
  attemptWindowSeconds: number;
}

/**
 * Serialises attempts per actor and per source with transaction advisory locks (actor first, then source, always in
 * that order), then refuses when either already has `maxWrongAttempts` failures inside the window. Blocking is checked
 * before the code is looked at, so the 11th attempt fails even with the correct code. Only failures are stored, and a
 * success does not reset the count: the window expiring is the only way out. Attempts dated after `now` still count, so
 * rolling the clock back does not unlock.
 */
export async function lockAndCheck(tx: Tx, cfg: LimitConfig, now: Date, kind: AttemptKind, staffId: string | null, source: string): Promise<void> {
  if (staffId) await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`staff:${staffId}`}, 0))`);
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${`src:${source}`}, 0))`);
  const since = new Date(now.getTime() - cfg.attemptWindowSeconds * 1000).toISOString();
  const row = (await tx.execute(sql`
    SELECT count(*) FILTER (WHERE staff_id = ${staffId}::uuid) AS actor, count(*) FILTER (WHERE source = ${source}) AS src
    FROM auth_attempts WHERE kind = ${kind} AND at > ${since}::timestamptz`)).rows[0] as { actor: string; src: string };
  if (Number(row.actor) >= cfg.maxWrongAttempts || Number(row.src) >= cfg.maxWrongAttempts) {
    throw new IdentityError("RATE_LIMITED", { retryAfterSeconds: String(cfg.attemptWindowSeconds) });
  }
}

export async function recordFailure(tx: Tx, now: Date, kind: AttemptKind, staffId: string | null, source: string): Promise<void> {
  await tx.execute(sql`INSERT INTO auth_attempts (kind, staff_id, source, at) VALUES (${kind}, ${staffId}::uuid, ${source}, ${now.toISOString()})`);
}
