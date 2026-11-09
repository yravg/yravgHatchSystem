// Contract: immutable effective-dated rate-rule versions and stored quotes. Money in JSON is a decimal string, duration
// is integer seconds. A quote stores the rule version it used and is append-only, so a later version cannot change it.
// The minimum is disabled unless a version enables it (D26). All money figures in tests and docs are SANDBOX FIXTURES.
import { DomainError, idrToJson, parseIdr, quoteSession, type RateRule, type Segment } from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { Tx } from "../identity/db.ts";
import type { IdentityDeps, Principal } from "../identity/service.ts";
import { bad, bool, idParam, int, makeHttp, opt_, parse, req_, uuid, type Rule } from "./http.ts";

const MAX_IDR = 1_000_000_000_000n; // keeps every product inside bigint columns; ASSUMPTION sandbox ceiling, not a business rule
const MAX_SEGMENT_SECONDS = 31 * 24 * 3600;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

const money: Rule = (v) => { try { const n = parseIdr(v); return n <= MAX_IDR ? n : undefined; } catch { return undefined; } };
const minimumRule: Rule = (v) => {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return undefined;
  return parse(v, { amountIdr: req_(money), coveredSeconds: req_(int(0, 7 * 24 * 3600)) });
};
const segmentsRule: Rule = (v) =>
  Array.isArray(v) && v.length >= 1 && v.length <= 200 && v.every((s) => parse(s, { seconds: req_(int(0, MAX_SEGMENT_SECONDS)), paused: req_(bool) })) ? v : undefined;
const isoUtc: Rule = (v) => (typeof v === "string" && ISO_UTC.test(v) && !Number.isNaN(Date.parse(v)) ? v : undefined);

interface VersionRow { id: string; version: number; effective_from: Date; rate_per_hour_idr: string; minimum_enabled: boolean; minimum_amount_idr: string | null; minimum_covered_seconds: number | null }
const VCOLS = sql`id, version, effective_from, rate_per_hour_idr, minimum_enabled, minimum_amount_idr, minimum_covered_seconds`;

const versionView = (r: VersionRow) => ({
  id: r.id, version: r.version, effectiveFrom: new Date(r.effective_from).toISOString(), ratePerHourIdr: r.rate_per_hour_idr,
  minimum: r.minimum_enabled ? { amountIdr: String(r.minimum_amount_idr), coveredSeconds: r.minimum_covered_seconds } : null,
});

const toRule = (r: VersionRow): RateRule => ({
  ratePerHourIdr: BigInt(r.rate_per_hour_idr),
  ...(r.minimum_enabled ? { minimum: { amountIdr: BigInt(r.minimum_amount_idr as string), coveredSeconds: BigInt(r.minimum_covered_seconds as number) } } : {}),
});

interface QuoteRow extends VersionRow {
  quote_id: string; station_id: string; segments: { seconds: number; paused: boolean }[]; billable_seconds: string;
  exact_numerator: string; exact_denominator: string; amount_idr: string; minimum_applied: boolean; created_at: Date;
}

async function loadQuote(q: Pick<Tx, "execute">, p: Principal, id: string): Promise<QuoteRow | undefined> {
  return (await q.execute(sql`
    SELECT q.id AS quote_id, q.station_id, q.segments, q.billable_seconds, q.exact_numerator, q.exact_denominator, q.amount_idr, q.minimum_applied, q.created_at,
           r.id, r.version, r.effective_from, r.rate_per_hour_idr, r.minimum_enabled, r.minimum_amount_idr, r.minimum_covered_seconds
    FROM quotes q JOIN rate_rule_versions r ON r.id = q.rule_version_id AND r.tenant_id = q.tenant_id AND r.outlet_id = q.outlet_id
    WHERE q.id = ${id} AND q.tenant_id = ${p.tenantId} AND q.outlet_id = ${p.outletId}`)).rows[0] as QuoteRow | undefined;
}

const quoteView = (r: QuoteRow) => ({
  quoteId: r.quote_id, stationId: r.station_id, ruleVersion: versionView(r), segments: r.segments, billableSeconds: Number(r.billable_seconds),
  exact: { numerator: r.exact_numerator, denominator: r.exact_denominator }, amountIdr: r.amount_idr, minimumApplied: r.minimum_applied,
  roundingRule: "nearest-rupiah-half-up", createdAt: new Date(r.created_at).toISOString(),
});

export function registerRates(app: FastifyInstance, deps: IdentityDeps): void {
  const http = makeHttp(deps);
  const P = "/api/v1";

  app.post(`${P}/rate-rules`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "rate.manage" });
    const b = parse<{ ratePerHourIdr: string; minimum?: { amountIdr: string; coveredSeconds: number }; effectiveFrom?: string }>(req.body, {
      ratePerHourIdr: req_(money), minimum: opt_(minimumRule), effectiveFrom: opt_(isoUtc),
    });
    return http.mutate(req, p, b, async (tx) => {
      const now = http.now();
      const from = b.effectiveFrom ? new Date(b.effectiveFrom) : now;
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${p.tenantId + ":" + p.outletId}, 47))`); // serialises version numbering per outlet
      const last = (await tx.execute(sql`SELECT version, effective_from FROM rate_rule_versions WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ORDER BY version DESC LIMIT 1`)).rows[0] as { version: number; effective_from: Date } | undefined;
      if (last && from.getTime() <= new Date(last.effective_from).getTime()) bad("effectiveFrom");
      const m = b.minimum;
      const row = (await tx.execute(sql`
        INSERT INTO rate_rule_versions (id, tenant_id, outlet_id, version, effective_from, rate_per_hour_idr, minimum_enabled, minimum_amount_idr, minimum_covered_seconds, created_by, created_at)
        VALUES (${crypto.randomUUID()}, ${p.tenantId}, ${p.outletId}, ${(last?.version ?? 0) + 1}, ${from.toISOString()}, ${b.ratePerHourIdr}, ${m !== undefined},
                ${m ? m.amountIdr : null}, ${m ? m.coveredSeconds : null}, ${p.staffId}, ${now.toISOString()})
        RETURNING ${VCOLS}`)).rows[0] as unknown as VersionRow;
      return { data: versionView(row), revision: row.version };
    });
  });

  app.get(`${P}/rate-rules`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const rows = (await http.db.execute(sql`SELECT ${VCOLS} FROM rate_rule_versions WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} ORDER BY version`)).rows as unknown as VersionRow[];
    return http.send(req, { versions: rows.map(versionView) });
  });

  app.post(`${P}/quotes`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const b = parse<{ stationId: string; segments: { seconds: number; paused: boolean }[] }>(req.body, { stationId: req_(uuid), segments: req_(segmentsRule) });
    return http.mutate(req, p, b, async (tx) => {
      const station = (await tx.execute(sql`SELECT 1 FROM stations WHERE id = ${b.stationId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`)).rows[0];
      if (!station) throw new DomainError("NOT_FOUND");
      const now = http.now();
      const rule = (await tx.execute(sql`
        SELECT ${VCOLS} FROM rate_rule_versions WHERE tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} AND effective_from <= ${now.toISOString()}
        ORDER BY version DESC LIMIT 1`)).rows[0] as VersionRow | undefined;
      if (!rule) throw new DomainError("NOT_FOUND", { reason: "no_rate_rule" });
      const segs: Segment[] = b.segments.map((s) => ({ seconds: BigInt(s.seconds), paused: s.paused }));
      const out = quoteSession(toRule(rule), segs);
      const id = crypto.randomUUID();
      await tx.execute(sql`
        INSERT INTO quotes (id, tenant_id, outlet_id, station_id, rule_version_id, segments, billable_seconds, exact_numerator, exact_denominator, amount_idr, minimum_applied, created_by, created_at)
        VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${b.stationId}, ${rule.id}, ${JSON.stringify(b.segments)}::jsonb, ${out.billableSeconds.toString()}, ${out.exact.numerator.toString()},
                ${out.exact.denominator.toString()}, ${idrToJson(out.amountIdr)}, ${out.minimumApplied}, ${p.staffId}, ${now.toISOString()})`);
      return { data: quoteView((await loadQuote(tx, p, id)) as QuoteRow), revision: 1 };
    });
  });

  app.get(`${P}/quotes/:quoteId`, async (req) => {
    const p = await app.identity.authorize(req, { permission: "session.manage" });
    const row = await loadQuote(http.db, p, idParam(req, "quoteId"));
    if (!row) throw new DomainError("NOT_FOUND");
    return http.send(req, quoteView(row));
  });
}

