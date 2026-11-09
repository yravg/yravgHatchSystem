// Contract: tenant/outlet scoped ledger HTTP API. tenantId and outletId come from the session, never the body.
// Money in JSON is a decimal string. Corrections are reversal transactions only; a posted line is never edited.
// Payment-managed transactions are not reversible here: the payment flow owns them (refund stays pending).
import { DomainError, idrToJson, parseIdr, reverseLines, type JournalLine } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { IdentityDeps } from "../identity/service.ts";
import { idParam, makeHttp, opt_, parse, req_, text, type Rule } from "../rates/http.ts";
import { loadTransaction, postTransaction, type TxnRow } from "./service.ts";

const MAX_IDR = 1_000_000_000_000n; // ASSUMPTION: sandbox ceiling, not a business rule
const money: Rule = (v) => { try { const n = parseIdr(v); return n <= MAX_IDR ? n : undefined; } catch { return undefined; } };
const linesRule: Rule = (v) => {
  if (!Array.isArray(v) || v.length < 2 || v.length > 20) return undefined;
  v.forEach((l) => parse(l, { account: req_(text(1, 40)), debitIdr: req_(money), creditIdr: req_(money) }));
  return v;
};

const view = (t: TxnRow, lines: JournalLine[]) => ({
  transactionId: t.id, sourceEvent: t.source_event, kind: t.kind, reversalOf: t.reversal_of, reason: t.reason, createdAt: new Date(t.created_at).toISOString(),
  lines: lines.map((l) => ({ account: l.account, debitIdr: idrToJson(l.debitIdr), creditIdr: idrToJson(l.creditIdr) })),
});

export function registerLedger(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1/ledger";

  app.post(`${P}/transactions`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "ledger.post" });
    const b = parse<{ sourceEvent: string; lines: { account: string; debitIdr: string; creditIdr: string }[]; reason?: string }>(req.body, { sourceEvent: req_(text(1, 200)), lines: req_(linesRule), reason: opt_(text(1, 200)) });
    const lines = b.lines.map((l) => ({ account: l.account, debitIdr: parseIdr(l.debitIdr), creditIdr: parseIdr(l.creditIdr) }));
    return http.mutate(req, p, b, async (tx) => {
      const r = await postTransaction(tx, { tenantId: p.tenantId, outletId: p.outletId, sourceEvent: b.sourceEvent, kind: "manual", ...(b.reason ? { reason: b.reason } : {}), actorId: p.staffId, lines, now: http.now() });
      if (!r.created) throw new DomainError("REVISION_CONFLICT", { reason: "duplicate_source_event" });
      const got = await loadTransaction(tx, p.tenantId, p.outletId, r.transactionId);
      if (!got) throw new DomainError("INTERNAL_ERROR");
      return { data: view(got.txn, got.lines), revision: 1 };
    });
  });

  app.post(`${P}/transactions/:transactionId/reversal`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "ledger.reverse" });
    const id = idParam(req, "transactionId");
    const b = parse<{ reason: string }>(req.body, { reason: req_(text(1, 200)) });
    return http.mutate(req, p, b, async (tx) => {
      const orig = await loadTransaction(tx, p.tenantId, p.outletId, id);
      if (!orig) throw new DomainError("NOT_FOUND");
      if (orig.txn.kind !== "manual") throw new DomainError("REVISION_CONFLICT", { reason: orig.txn.kind === "reversal" ? "already_a_reversal" : "payment_ledger_managed" });
      const r = await postTransaction(tx, { tenantId: p.tenantId, outletId: p.outletId, sourceEvent: `reversal:${id}`, kind: "reversal", reversalOf: id, reason: b.reason, actorId: p.staffId, lines: reverseLines(orig.lines), now: http.now() });
      if (!r.created) throw new DomainError("REVISION_CONFLICT", { reason: "already_reversed" });
      const got = await loadTransaction(tx, p.tenantId, p.outletId, r.transactionId);
      if (!got) throw new DomainError("INTERNAL_ERROR");
      return { data: view(got.txn, got.lines), revision: 1 };
    });
  });

  app.get(`${P}/transactions/:transactionId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "ledger.read" });
    const got = await loadTransaction(http.db, p.tenantId, p.outletId, idParam(req, "transactionId"));
    if (!got) throw new DomainError("NOT_FOUND");
    return http.send(req, view(got.txn, got.lines));
  });

  app.get(`${P}/balances`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "ledger.read" });
    const rows = (await http.db.execute(sql`SELECT account, balance FROM ledger_balances WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ORDER BY account`)).rows as unknown as { account: string; balance: string }[];
    return http.send(req, { balances: rows.map((r) => ({ account: r.account, balanceIdr: String(r.balance) })) });
  });
}
