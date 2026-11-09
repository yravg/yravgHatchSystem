// Contract: payments worker over the transactional outbox. One job per transaction: claim with FOR UPDATE SKIP LOCKED,
// run the handler, mark processed, schedule the next poll, commit. A crash or a thrown error rolls EVERYTHING back, so a
// job is never half applied; the failure (name and code only, never a body or key) is then recorded with exponential
// backoff and, after MAX_ATTEMPTS, dead-lettered. Delivery is at-least-once; handler effects are idempotent.
import { connect } from "../../../api/src/identity/db.ts";
import { claimJob, enqueue, markProcessed, PAYMENT_VERIFY, recordFailure, type Job } from "../../../api/src/payments/outbox.ts";
import { verifyIntent, type PaymentsDeps } from "../../../api/src/payments/settlement.ts";

export interface RunnerOptions {
  /** Test seam for process-death simulation: wraps the handler so a throw after the effect proves the rollback. */
  around?: (run: () => Promise<void>) => Promise<void>;
}
export interface DrainResult { done: number; retried: number; dead: number }

const errorTag = (e: unknown): string => {
  const x = e as { name?: string; reason?: string; code?: string };
  return `${x.name ?? "Error"}${x.reason ? `:${x.reason}` : ""}${x.code ? `:${x.code}` : ""}`.slice(0, 80);
};

export function createPaymentsRunner(deps: PaymentsDeps, opts: RunnerOptions = {}) {
  const db = connect(deps.pool);
  const now = deps.clock ?? (() => new Date());
  const around = opts.around ?? ((run: () => Promise<void>) => run());

  async function runOnce(): Promise<"none" | "done" | "retried" | "dead"> {
    let claimed: Job | undefined;
    try {
      const out = await db.transaction(async (tx) => {
        const job = await claimJob(tx, now());
        if (!job) return "none" as const;
        claimed = job;
        let nextAt: Date | undefined;
        await around(async () => {
          if (job.topic !== PAYMENT_VERIFY) throw new Error(`unknown outbox topic`);
          nextAt = (await verifyIntent(tx, deps, job.aggregate_id)).nextAt;
        });
        await markProcessed(tx, job.id, now());
        if (nextAt) await enqueue(tx, { tenantId: job.tenant_id, topic: job.topic, aggregateId: job.aggregate_id, availableAt: nextAt });
        return "done" as const;
      });
      return out;
    } catch (e) {
      if (!claimed) throw e;
      return (await recordFailure(db, claimed, errorTag(e), now())) ? "dead" : "retried";
    }
  }

  /** Runs jobs that are due until none is left (or `max` jobs). Jobs backing off or scheduled later are left alone. */
  async function drain(max = 200): Promise<DrainResult> {
    const r: DrainResult = { done: 0, retried: 0, dead: 0 };
    for (let n = 0; n < max; n++) {
      const o = await runOnce();
      if (o === "none") break;
      r[o]++;
    }
    return r;
  }

  return { runOnce, drain };
}

/** Production loop: drain, wait, repeat until aborted. Never throws out of the loop. */
export async function runPaymentsLoop(runner: { drain: () => Promise<DrainResult> }, o: { intervalMs: number; signal: AbortSignal }): Promise<void> {
  while (!o.signal.aborted) {
    await runner.drain().catch(() => undefined); // a failed pass is retried by the outbox; the loop must not die
    await new Promise<void>((ok) => { const t = setTimeout(ok, o.intervalMs); o.signal.addEventListener("abort", () => { clearTimeout(t); ok(); }, { once: true }); });
  }
}
