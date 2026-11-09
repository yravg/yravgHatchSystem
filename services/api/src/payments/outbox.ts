// Contract: transactional outbox. A job row is written in the same transaction as the state change that needs it, so a
// crash never loses it. Delivery is AT-LEAST-ONCE: a job may run twice, therefore every handler effect is idempotent.
// One open job per (topic, aggregate): a new request pulls the due time forward instead of piling up.
import { sql } from "drizzle-orm";
import type { Tx } from "../identity/db.ts";

export const MAX_ATTEMPTS = 8;
export const PAYMENT_VERIFY = "payment.verify";

export async function enqueue(tx: Tx, j: { tenantId: string | null; topic: string; aggregateId: string; availableAt: Date }): Promise<void> {
  await tx.execute(sql`
    INSERT INTO outbox (tenant_id, topic, aggregate_id, available_at) VALUES (${j.tenantId}, ${j.topic}, ${j.aggregateId}, ${j.availableAt.toISOString()})
    ON CONFLICT (topic, aggregate_id) WHERE processed_at IS NULL AND dead_at IS NULL
    DO UPDATE SET available_at = LEAST(outbox.available_at, EXCLUDED.available_at)`);
}

/** Exponential backoff in seconds: 60, 120, 240 ... capped at one hour. */
export const backoffSeconds = (attempts: number): number => Math.min(3600, 30 * 2 ** attempts);

export interface Job { id: string; topic: string; aggregate_id: string; attempts: number; tenant_id: string | null }

/** Claims the next due job. The row stays locked until the caller's transaction ends, so a crash releases it. */
export async function claimJob(tx: Tx, now: Date): Promise<Job | undefined> {
  return (await tx.execute(sql`
    SELECT id, topic, aggregate_id, attempts, tenant_id FROM outbox
    WHERE processed_at IS NULL AND dead_at IS NULL AND available_at <= ${now.toISOString()}
    ORDER BY available_at, id LIMIT 1 FOR UPDATE SKIP LOCKED`)).rows[0] as unknown as Job | undefined;
}

export const markProcessed = async (tx: Tx, id: string, now: Date): Promise<void> => {
  await tx.execute(sql`UPDATE outbox SET processed_at = ${now.toISOString()} WHERE id = ${id}`);
};

/** Records a failed attempt after the job transaction rolled back. Returns true when the job was dead-lettered. */
export async function recordFailure(q: Pick<Tx, "execute">, job: Job, tag: string, now: Date): Promise<boolean> {
  const attempts = job.attempts + 1;
  const dead = attempts >= MAX_ATTEMPTS;
  await q.execute(sql`
    UPDATE outbox SET attempts = ${attempts}, last_error = ${tag}, available_at = ${new Date(now.getTime() + backoffSeconds(attempts) * 1000).toISOString()},
                      dead_at = ${dead ? now.toISOString() : null}
    WHERE id = ${job.id} AND processed_at IS NULL`);
  return dead;
}
