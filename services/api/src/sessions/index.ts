// Contract: public surface of the T49 session coordinator.
//   registerSessions(app, deps, opts)   the HTTP routes (called once from app.ts)
//   createSessionJobs(deps, opts)       sweep(): one reconcile pass per live session, each in its own transaction, so a
//                                       failure in one session never blocks another; reconcile(id): a single session.
// The sweep is what a worker runs every few seconds (ACK application, 10 s timeouts, lease renewal and expiry, fixed end,
// transfer progress, station release after a proven lock). It is at-least-once and idempotent.
import { sql } from "drizzle-orm";
import { connect } from "../identity/db.ts";
import type { IdentityDeps } from "../identity/service.ts";
import { reconcile, sweepTargets, type SessionsOptions } from "./service.ts";

export { registerSessions } from "./routes.ts";
export { SessionError } from "./errors.ts";
export type { SessionsOptions } from "./service.ts";

export function createSessionJobs(deps: IdentityDeps, opts: SessionsOptions = {}) {
  const db = connect(deps.pool);
  const now = deps.clock ?? (() => new Date());
  return {
    async sweep(): Promise<{ processed: number; failed: number }> {
      let processed = 0;
      let failed = 0;
      for (const t of await sweepTargets(db)) {
        try {
          await db.transaction(async (tx) => { await reconcile(tx, { now: now(), opts }, t, t.id); });
          processed++;
        } catch {
          failed++; // the next sweep retries; the cause is not logged with row data
        }
      }
      return { processed, failed };
    },
    async reconcile(id: string): Promise<void> {
      const row = (await db.execute(sql`SELECT tenant_id, outlet_id FROM sessions WHERE id = ${id}`)).rows[0] as { tenant_id: string; outlet_id: string } | undefined;
      if (!row) return;
      await db.transaction(async (tx) => { await reconcile(tx, { now: now(), opts }, { tenantId: row.tenant_id, outletId: row.outlet_id }, id); });
    },
  };
}
