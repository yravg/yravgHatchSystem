// Contract: T49 session coordinator (state in Postgres, effects only inside the caller's transaction).
//   Lease claims   the cloud records AUTHORISED lease claims; the enrolled edge signs them (CONTRACTS section 5). The cloud
//                  never holds a signing key. Edge transport (T20) is not here: commands wait in session_commands and
//                  session_outbox, ACKs arrive through T50's POST /edge/acks into edge_acks and are applied by reconcile().
//   Billing        the clock starts only when an ACK for the START/RESUME command is APPLIED at an accepted level, counted
//                  from the server receive time of that ACK. RECEIVED is not APPLIED. COMMANDED_ONLY is labelled limited.
//   Fencing        a lock-type command (PAUSE, LOCK, END) supersedes older unlock-type commands; an ACK for a superseded,
//                  cancelled, wrong-device, wrong-epoch, wrong-revision or wrong-sequence command is rejected and recorded.
//   Transfer       reserve destination, freeze the quote, revoke the source lease and issue LOCK, wait for a PROVEN lock (or
//                  for the source lease's bounded expiry), only then grant the destination lease and START there. The
//                  database allows one granted lease per session and per station, so a crash cannot create two.
//   Everything is at-least-once and idempotent: reconcile() may run twice or concurrently (row lock on the session).
// All timings and money are SANDBOX FIXTURES (D01, D06, D07, D26 are not approved).
import { randomUUID } from "node:crypto";
import {
  assertTransition, billingAllowed, canActivate, clockElapsed, DomainError, InvalidTransitionError, isDeviceProof, leaseWindow, lockProven,
  pauseClock, quoteSession, renewalDue, SESSION_TIMING, startClock, tariffDeltaQuote,
  type JournalLine, type LeaseMode, type RateRule, type SessionState, type VerificationLevel,
} from "@yravg/domain";
import { sql } from "drizzle-orm";
import type { Tx } from "../identity/db.ts";
import type { Principal } from "../identity/service.ts";
import { postTransaction } from "../ledger/service.ts";
import { SessionError } from "./errors.ts";

export interface SessionsOptions {
  /** A SIMULATED ACK counts as billing/lock proof only when a fixture enables it. Default false. */
  allowSimulated?: boolean;
  /** Is the venue edge reachable (authority online)? Default true. T20 will provide the real presence signal. */
  edgeOnline?: (tenantId: string, outletId: string) => boolean | Promise<boolean>;
  /** Test seams: throw to simulate a process crash at a precise point. */
  faults?: { afterStartInsert?: () => void; afterDestinationGrant?: () => void };
}
export interface Ctx { now: Date; opts: SessionsOptions }

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const rows = (r: { rows: unknown[] }): Row[] => r.rows as Row[];
const first = (r: { rows: unknown[] }): Row | undefined => r.rows[0] as Row | undefined;
const num = (v: unknown): number => Number(v);
const ts = (d: Date): string => d.toISOString();
export const iso = (d: Date | string): string => new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
const addS = (d: Date, s: number): Date => new Date(d.getTime() + s * 1000);

export interface S {
  id: string; tenantId: string; outletId: string; stationId: string; originStationId: string; deviceId: string; quoteId: string;
  paymentIntentId: string | null; paymentMode: string; mode: LeaseMode; state: SessionState; revision: number; fixedSeconds: number | null;
  accruedSeconds: number; runningSince: Date | null; amountIdr: bigint; tariffDeltaIdr: bigint; minimumApplied: boolean; finalAmountIdr: bigint | null;
  verificationLevel: VerificationLevel | null; recoveryReason: string | null; createdAt: Date;
}
const mapS = (r: Row): S => ({
  id: r["id"], tenantId: r["tenant_id"], outletId: r["outlet_id"], stationId: r["station_id"], originStationId: r["origin_station_id"], deviceId: r["device_id"],
  quoteId: r["quote_id"], paymentIntentId: r["payment_intent_id"], paymentMode: r["payment_mode"], mode: r["mode"], state: r["state"], revision: num(r["revision"]),
  fixedSeconds: r["fixed_seconds"] === null ? null : num(r["fixed_seconds"]), accruedSeconds: num(r["accrued_seconds"]),
  runningSince: r["running_since"] ? new Date(r["running_since"]) : null, amountIdr: BigInt(r["amount_idr"]), tariffDeltaIdr: BigInt(r["tariff_delta_idr"]),
  minimumApplied: r["minimum_applied"], finalAmountIdr: r["final_amount_idr"] === null ? null : BigInt(r["final_amount_idr"]),
  verificationLevel: r["verification_level"], recoveryReason: r["recovery_reason"], createdAt: new Date(r["created_at"]),
});

const loadSession = async (tx: Pick<Tx, "execute">, id: string, lock = false): Promise<S | undefined> => {
  const r = first(await tx.execute(lock
    ? sql`SELECT * FROM sessions WHERE id = ${id} FOR UPDATE`
    : sql`SELECT * FROM sessions WHERE id = ${id}`));
  return r ? mapS(r) : undefined;
};

/** Scope first (404 hides existence), lock the row so concurrent reconciles serialise. */
export async function lockSession(tx: Tx, p: { tenantId: string; outletId: string }, id: string): Promise<S> {
  const s = await loadSession(tx, id, true);
  if (!s || s.tenantId !== p.tenantId || s.outletId !== p.outletId) throw new DomainError("NOT_FOUND");
  return s;
}

const COLUMN: Record<string, string> = {
  state: "state", revision: "revision", accrued_seconds: "accrued_seconds", running_since: "running_since", amount_idr: "amount_idr",
  tariff_delta_idr: "tariff_delta_idr", minimum_applied: "minimum_applied", final_amount_idr: "final_amount_idr",
  verification_level: "verification_level", recovery_reason: "recovery_reason", station_id: "station_id", device_id: "device_id",
};
async function patch(tx: Tx, s: S, fields: Record<string, unknown>, now: Date): Promise<void> {
  const sets = Object.entries(fields).map(([k, v]) => {
    if (!(k in COLUMN)) throw new Error(`unknown session column ${k}`);
    return sql`${sql.raw(COLUMN[k] as string)} = ${v instanceof Date ? ts(v) : typeof v === "bigint" ? v.toString() : v}`;
  });
  await tx.execute(sql`UPDATE sessions SET ${sql.join(sets, sql`, `)}, updated_at = ${ts(now)} WHERE id = ${s.id}`);
  Object.assign(s, mapS(first(await tx.execute(sql`SELECT * FROM sessions WHERE id = ${s.id}`)) as Row));
}
const setState = async (tx: Tx, s: S, to: SessionState, extra: Record<string, unknown>, now: Date): Promise<void> => {
  try { assertTransition(s.state, to); } catch (e) { if (e instanceof InvalidTransitionError) throw new SessionError("INVALID_TRANSITION", { from: s.state, to }); throw e; }
  await patch(tx, s, { state: to, ...extra }, now);
};
const invalid = (s: S, what: string): never => { throw new SessionError("INVALID_TRANSITION", { from: s.state, action: what }); };

async function emit(tx: Tx, s: S, kind: string, data: Record<string, unknown>, now: Date): Promise<void> {
  await tx.execute(sql`INSERT INTO session_events (session_id, tenant_id, outlet_id, kind, data, at) VALUES (${s.id}, ${s.tenantId}, ${s.outletId}, ${kind}, ${JSON.stringify(data)}::jsonb, ${ts(now)})`);
}

// ---- stations --------------------------------------------------------------------------------------------------------
const releaseStation = async (tx: Tx, s: { tenantId: string; outletId: string }, stationId: string): Promise<void> => {
  await tx.execute(sql`UPDATE stations SET status = 'available', reserved_by = NULL, reserved_at = NULL, revision = revision + 1
    WHERE id = ${stationId} AND tenant_id = ${s.tenantId} AND outlet_id = ${s.outletId} AND status = 'reserved'`);
};

async function seatDevice(tx: Tx, tenantId: string, outletId: string, stationId: string): Promise<string> {
  const d = first(await tx.execute(sql`
    SELECT id FROM devices WHERE tenant_id = ${tenantId} AND outlet_id = ${outletId} AND station_id = ${stationId} AND kind = 'seat' AND status = 'active'
    ORDER BY approved_at, id LIMIT 1`));
  if (!d) throw new SessionError("DEVICE_UNAVAILABLE", { reason: "no_active_seat_device" });
  return d["id"] as string;
}

async function authority(tx: Tx, tenantId: string, outletId: string): Promise<number> {
  const a = first(await tx.execute(sql`
    SELECT a.epoch FROM outlet_authority a JOIN devices d ON d.id = a.edge_device_id AND d.status = 'active' AND d.kind = 'edge'
    WHERE a.tenant_id = ${tenantId} AND a.outlet_id = ${outletId} FOR SHARE OF a`));
  if (!a) throw new SessionError("DEVICE_UNAVAILABLE", { reason: "no_edge_authority" });
  return num(a["epoch"]);
}

async function stationBlocked(tx: Tx, stationId: string): Promise<boolean> {
  const live = first(await tx.execute(sql`SELECT 1 FROM sessions WHERE station_id = ${stationId} AND state NOT IN ('AVAILABLE', 'ACTIVATION_FAILED')`));
  const hold = first(await tx.execute(sql`SELECT 1 FROM session_station_holds WHERE station_id = ${stationId} AND released_at IS NULL`));
  return !!live || !!hold;
}

// ---- commands and leases ---------------------------------------------------------------------------------------------
export interface C {
  command_id: string; session_id: string; station_id: string; device_id: string; authority_epoch: string; sequence: string; expected_revision: number;
  desired_revision: number; action: string; purpose: string; status: string; issued_at: Date; expires_at: Date; applied_level: string | null;
  retries: number; ack_cursor: string; lease_id: string | null; transfer_id: string | null; actor_ref: string;
}

async function nextSequence(tx: Tx, tenantId: string, outletId: string): Promise<number> {
  const r = first(await tx.execute(sql`
    INSERT INTO session_counters (tenant_id, outlet_id, seq) VALUES (${tenantId}, ${outletId}, 1)
    ON CONFLICT (tenant_id, outlet_id) DO UPDATE SET seq = session_counters.seq + 1 RETURNING seq`)) as Row;
  return num(r["seq"]);
}

async function grantLease(tx: Tx, ctx: Ctx, s: S, g: { stationId: string; deviceId: string; revision: number; remaining: number; epoch: number; commandId: string }): Promise<string> {
  const w = leaseWindow({ mode: s.mode, remainingSeconds: g.remaining, now: ctx.now });
  await tx.execute(sql`UPDATE session_leases SET status = 'superseded' WHERE session_id = ${s.id} AND status = 'granted'`);
  const id = randomUUID();
  await tx.execute(sql`
    INSERT INTO session_leases (lease_id, session_id, tenant_id, outlet_id, station_id, device_id, revision, mode, remaining_seconds_at_issue, issued_at, not_after, status, authority_epoch, command_id)
    VALUES (${id}, ${s.id}, ${s.tenantId}, ${s.outletId}, ${g.stationId}, ${g.deviceId}, ${g.revision}, ${s.mode}, ${w.remainingSecondsAtIssue}, ${ts(ctx.now)}, ${ts(w.notAfter)}, 'granted', ${g.epoch}, ${g.commandId})`);
  return id;
}

const revokeGranted = async (tx: Tx, s: S, status: "revoked" | "expired" = "revoked"): Promise<void> => {
  await tx.execute(sql`UPDATE session_leases SET status = ${status} WHERE session_id = ${s.id} AND status = 'granted'`);
};

const remainingOf = (s: S, now: Date): number =>
  s.fixedSeconds === null ? 0 : Math.max(0, s.fixedSeconds - clockElapsed({ accruedSeconds: s.accruedSeconds, runningSince: s.runningSince }, now));

interface Issue {
  action: "START" | "PAUSE" | "RESUME" | "EXTEND" | "LOCK" | "END";
  purpose: string; deviceId: string; stationId: string; actor: string; withLease?: boolean; transferId?: string; initial?: boolean;
}
const LOCK_TYPE = new Set(["PAUSE", "LOCK", "END"]);

async function issue(tx: Tx, ctx: Ctx, s: S, i: Issue): Promise<C> {
  const epoch = await authority(tx, s.tenantId, s.outletId);
  const seq = await nextSequence(tx, s.tenantId, s.outletId);
  const desired = i.initial ? 1 : s.revision + 1;
  const expected = i.initial ? 0 : s.revision;
  if (!i.initial) await patch(tx, s, { revision: desired }, ctx.now);
  const commandId = randomUUID();
  const leaseId = i.withLease ? await grantLease(tx, ctx, s, { stationId: i.stationId, deviceId: i.deviceId, revision: desired, remaining: remainingOf(s, ctx.now), epoch, commandId }) : null;
  await tx.execute(sql`
    INSERT INTO session_commands (command_id, session_id, tenant_id, outlet_id, station_id, device_id, authority_epoch, sequence, expected_revision, desired_revision, action, purpose, issued_at, expires_at, lease_id, transfer_id, actor_ref)
    VALUES (${commandId}, ${s.id}, ${s.tenantId}, ${s.outletId}, ${i.stationId}, ${i.deviceId}, ${epoch}, ${seq}, ${expected}, ${desired}, ${i.action}, ${i.purpose}, ${ts(ctx.now)},
            ${ts(addS(ctx.now, SESSION_TIMING.ackTimeoutSeconds))}, ${leaseId}, ${i.transferId ?? null}, ${i.actor})`);
  if (LOCK_TYPE.has(i.action)) {
    // A higher lock revision wins: whatever unlock is still outstanding can no longer be applied.
    await tx.execute(sql`UPDATE session_commands SET status = 'SUPERSEDED' WHERE session_id = ${s.id} AND command_id <> ${commandId}
      AND status IN ('PENDING', 'RECEIVED', 'TIMED_OUT') AND action IN ('START', 'RESUME', 'EXTEND')`);
  }
  await tx.execute(sql`INSERT INTO session_outbox (tenant_id, outlet_id, session_id, command_id, topic, payload, available_at, created_at)
    VALUES (${s.tenantId}, ${s.outletId}, ${s.id}, ${commandId}, 'command.dispatch', ${JSON.stringify({ action: i.action, purpose: i.purpose })}::jsonb, ${ts(ctx.now)}, ${ts(ctx.now)})`);
  await emit(tx, s, "COMMAND_ISSUED", { commandId, action: i.action, purpose: i.purpose, desiredRevision: desired }, ctx.now);
  return first(await tx.execute(sql`SELECT * FROM session_commands WHERE command_id = ${commandId}`)) as unknown as C;
}

async function loadCommands(tx: Tx, sessionId: string): Promise<C[]> {
  return rows(await tx.execute(sql`SELECT * FROM session_commands WHERE session_id = ${sessionId} ORDER BY desired_revision, issued_at, command_id`)) as unknown as C[];
}
const loadCommand = async (tx: Tx, id: string | null): Promise<C | undefined> =>
  id ? (first(await tx.execute(sql`SELECT * FROM session_commands WHERE command_id = ${id}`)) as unknown as C | undefined) : undefined;

/** Re-send the same command: same commandId and desired revision, fresh sequence/epoch/expiry (CONTRACTS section 3, step 5). */
async function resend(tx: Tx, ctx: Ctx, s: S, c: C, withLease: boolean): Promise<void> {
  const epoch = await authority(tx, s.tenantId, s.outletId);
  const seq = await nextSequence(tx, s.tenantId, s.outletId);
  const leaseId = withLease ? await grantLease(tx, ctx, s, { stationId: c.station_id, deviceId: c.device_id, revision: c.desired_revision, remaining: remainingOf(s, ctx.now), epoch, commandId: c.command_id }) : c.lease_id;
  await tx.execute(sql`UPDATE session_commands SET status = 'PENDING', authority_epoch = ${epoch}, sequence = ${seq}, issued_at = ${ts(ctx.now)}, expires_at = ${ts(addS(ctx.now, SESSION_TIMING.ackTimeoutSeconds))},
    retries = retries + 1, lease_id = ${leaseId} WHERE command_id = ${c.command_id}`);
  await tx.execute(sql`INSERT INTO session_outbox (tenant_id, outlet_id, session_id, command_id, topic, payload, available_at, created_at)
    VALUES (${s.tenantId}, ${s.outletId}, ${s.id}, ${c.command_id}, 'command.dispatch', ${JSON.stringify({ action: c.action, purpose: c.purpose, retry: true })}::jsonb, ${ts(ctx.now)}, ${ts(ctx.now)})`);
  await emit(tx, s, "COMMAND_RESENT", { commandId: c.command_id }, ctx.now);
}

// ---- payment compensation --------------------------------------------------------------------------------------------
/** Settled payment whose start failed: refund_pending through T48's tables. NOTHING here claims money went back. */
async function compensatePayment(tx: Tx, ctx: Ctx, s: S, actorId: string | null): Promise<void> {
  if (!s.paymentIntentId) return;
  const intent = first(await tx.execute(sql`SELECT status, amount_idr FROM payment_intents WHERE id = ${s.paymentIntentId} FOR UPDATE`));
  if (!intent || intent["status"] !== "settled") return;
  const amount = BigInt(intent["amount_idr"]);
  const lines: JournalLine[] = [
    { account: "sales_revenue", debitIdr: amount, creditIdr: 0n },
    { account: "refund_payable", debitIdr: 0n, creditIdr: amount },
  ];
  await postTransaction(tx, { tenantId: s.tenantId, outletId: s.outletId, sourceEvent: `session:${s.id}:activation-failed`, kind: "manual", reason: "session_activation_failed", actorId, lines, now: ctx.now });
  await tx.execute(sql`INSERT INTO refunds (id, tenant_id, outlet_id, intent_id, amount_idr, status, reason, created_at)
    VALUES (${randomUUID()}, ${s.tenantId}, ${s.outletId}, ${s.paymentIntentId}, ${amount.toString()}, 'pending', 'session_activation_failed', ${ts(ctx.now)}) ON CONFLICT (intent_id) DO NOTHING`);
  await tx.execute(sql`UPDATE payment_intents SET status = 'refund_pending', revision = revision + 1 WHERE id = ${s.paymentIntentId} AND status = 'settled'`);
  await emit(tx, s, "PAYMENT_REFUND_PENDING", { intentId: s.paymentIntentId }, ctx.now);
}

async function activationFailed(tx: Tx, ctx: Ctx, s: S, reason: string, actorId: string | null, hold: { afterCommandId: string } | "release"): Promise<void> {
  await setState(tx, s, "ACTIVATION_FAILED", { recovery_reason: reason, running_since: null }, ctx.now);
  await revokeGranted(tx, s);
  if (hold === "release") await releaseStation(tx, s, s.stationId);
  else await tx.execute(sql`INSERT INTO session_station_holds (id, session_id, tenant_id, outlet_id, station_id, release_after_command_id, created_at)
    VALUES (${randomUUID()}, ${s.id}, ${s.tenantId}, ${s.outletId}, ${s.stationId}, ${hold.afterCommandId}, ${ts(ctx.now)}) ON CONFLICT DO NOTHING`);
  await emit(tx, s, "ACTIVATION_FAILED", { reason }, ctx.now);
  await compensatePayment(tx, ctx, s, actorId);
}

// ---- pricing helpers -------------------------------------------------------------------------------------------------
async function ruleOf(tx: Tx, s: S): Promise<RateRule> {
  const r = first(await tx.execute(sql`
    SELECT v.rate_per_hour_idr, v.minimum_enabled, v.minimum_amount_idr, v.minimum_covered_seconds FROM quotes q
    JOIN rate_rule_versions v ON v.id = q.rule_version_id WHERE q.id = ${s.quoteId}`)) as Row;
  return {
    ratePerHourIdr: BigInt(r["rate_per_hour_idr"]),
    ...(r["minimum_enabled"] ? { minimum: { amountIdr: BigInt(r["minimum_amount_idr"]), coveredSeconds: BigInt(r["minimum_covered_seconds"]) } } : {}),
  };
}

async function zoneRateOf(tx: Tx, tenantId: string, outletId: string, stationId: string, now: Date): Promise<bigint | null> {
  const r = first(await tx.execute(sql`
    SELECT z.rate_per_hour_idr FROM stations st JOIN zone_rate_versions z ON z.tenant_id = st.tenant_id AND z.outlet_id = st.outlet_id AND z.zone = st.zone
    WHERE st.id = ${stationId} AND st.tenant_id = ${tenantId} AND st.outlet_id = ${outletId} AND z.created_at <= ${ts(now)}
    ORDER BY z.created_at DESC, z.id DESC LIMIT 1`));
  return r ? BigInt(r["rate_per_hour_idr"]) : null;
}

const elapsedOf = (s: S, now: Date): number => {
  const e = clockElapsed({ accruedSeconds: s.accruedSeconds, runningSince: s.runningSince }, now);
  return s.fixedSeconds === null ? e : Math.min(e, s.fixedSeconds);
};

async function finalAmount(tx: Tx, s: S, elapsed: number): Promise<bigint> {
  if (s.mode === "FIXED") return s.amountIdr;
  return quoteSession(await ruleOf(tx, s), [{ seconds: BigInt(elapsed), paused: false }]).amountIdr;
}

// ---- ACK application -------------------------------------------------------------------------------------------------
interface AckRow { id: string; device_id: string; status: string; sequence: string; authority_epoch: string; body: Row; received_at: Date }

async function applyAcks(tx: Tx, ctx: Ctx, s: S): Promise<void> {
  for (const c of await loadCommands(tx, s.id)) {
    const acks = rows(await tx.execute(sql`SELECT id, device_id, status, sequence, authority_epoch, body, received_at FROM edge_acks
      WHERE command_id = ${c.command_id} AND tenant_id = ${s.tenantId} AND id > ${c.ack_cursor} ORDER BY id`)) as unknown as AckRow[];
    let cmd = c;
    for (const a of acks) {
      await processAck(tx, ctx, s, cmd, a);
      cmd = (await loadCommand(tx, c.command_id)) as C;
      await tx.execute(sql`UPDATE session_commands SET ack_cursor = ${a.id} WHERE command_id = ${c.command_id}`);
    }
  }
}

async function processAck(tx: Tx, ctx: Ctx, s: S, c: C, a: AckRow): Promise<void> {
  const level = a.body["verificationLevel"] as VerificationLevel;
  const reject = async (reason: string): Promise<void> => { await emit(tx, s, "ACK_REJECTED", { commandId: c.command_id, reason, status: a.status }, ctx.now); };
  if (a.device_id !== c.device_id) return reject("device_mismatch");
  if (c.status === "SUPERSEDED" || c.status === "CANCELLED") return reject("superseded");
  if (num(a.body["desiredRevision"]) !== c.desired_revision) return reject("revision_mismatch");
  if (num(a.authority_epoch) !== num(c.authority_epoch)) return reject("epoch_mismatch");
  if (num(a.sequence) !== num(c.sequence)) return reject("sequence_mismatch");
  if (c.status === "APPLIED" || c.status === "FAILED") return; // duplicate or reordered after the terminal ACK
  if (a.status === "RECEIVED") {
    if (c.status === "PENDING" || c.status === "TIMED_OUT") await tx.execute(sql`UPDATE session_commands SET status = 'RECEIVED' WHERE command_id = ${c.command_id}`);
    return;
  }
  if (a.status === "FAILED") {
    await tx.execute(sql`UPDATE session_commands SET status = 'FAILED' WHERE command_id = ${c.command_id}`);
    await emit(tx, s, "COMMAND_FAILED", { commandId: c.command_id, purpose: c.purpose }, ctx.now);
    return onFailed(tx, ctx, s, c);
  }
  if (!billingAllowed(level, ctx.opts.allowSimulated === true)) return reject("level_not_accepted");
  await tx.execute(sql`UPDATE session_commands SET status = 'APPLIED', applied_level = ${level} WHERE command_id = ${c.command_id}`);
  if (c.lease_id) await tx.execute(sql`UPDATE session_leases SET applied_at = ${ts(new Date(a.received_at))} WHERE lease_id = ${c.lease_id}`);
  await emit(tx, s, "COMMAND_APPLIED", { commandId: c.command_id, purpose: c.purpose, verificationLevel: level, deviceProof: isDeviceProof(level) }, ctx.now);
  return onApplied(tx, ctx, s, c, level, new Date(a.received_at));
}

async function onApplied(tx: Tx, ctx: Ctx, s: S, c: C, level: VerificationLevel, at: Date): Promise<void> {
  if (c.purpose === "start" && s.state === "STARTING") {
    const clock = startClock({ accruedSeconds: s.accruedSeconds, runningSince: s.runningSince }, at);
    await setState(tx, s, "ACTIVE", { running_since: clock.runningSince, verification_level: level }, ctx.now);
    await emit(tx, s, "ACTIVATED", { verificationLevel: level, limited: level === "COMMANDED_ONLY" }, ctx.now);
  } else if (c.purpose === "resume" && s.state === "PAUSED") {
    const clock = startClock({ accruedSeconds: s.accruedSeconds, runningSince: s.runningSince }, at);
    await setState(tx, s, "ACTIVE", { running_since: clock.runningSince }, ctx.now);
  } else if (c.purpose === "target_start") {
    await commitTransfer(tx, ctx, s, c, level, at);
  } else if (c.purpose === "source_lock" && !lockProven(level, ctx.opts.allowSimulated === true)) {
    await emit(tx, s, "LOCK_NOT_PROVEN", { commandId: c.command_id, verificationLevel: level }, ctx.now);
  }
}

async function onFailed(tx: Tx, ctx: Ctx, s: S, c: C): Promise<void> {
  if (c.purpose === "start" && s.state === "STARTING") {
    // The device reports it did not apply the START, so the station can be released at once.
    await activationFailed(tx, ctx, s, "device_failed", null, "release");
  } else if (c.purpose === "target_start") {
    const tr = await openTransfer(tx, s.id);
    if (tr && tr["status"] === "ACTIVATING_TARGET") await targetFailed(tx, ctx, s, tr, "target_failed");
  }
}

// ---- timeouts, time rules --------------------------------------------------------------------------------------------
async function expireCommands(tx: Tx, ctx: Ctx, s: S): Promise<void> {
  const r = rows(await tx.execute(sql`UPDATE session_commands SET status = 'TIMED_OUT' WHERE session_id = ${s.id} AND status IN ('PENDING', 'RECEIVED') AND expires_at <= ${ts(ctx.now)} RETURNING command_id, purpose`));
  for (const x of r) await emit(tx, s, "COMMAND_TIMED_OUT", { commandId: x["command_id"], purpose: x["purpose"] }, ctx.now);
}

const openTransfer = async (tx: Tx, sessionId: string): Promise<Row | undefined> =>
  first(await tx.execute(sql`SELECT * FROM session_transfers WHERE session_id = ${sessionId} AND status IN ('LOCKING_SOURCE', 'ACTIVATING_TARGET', 'SOURCE_UNPROVEN', 'TARGET_FAILED')`));

async function timeRules(tx: Tx, ctx: Ctx, s: S): Promise<void> {
  if (s.state !== "ACTIVE" || (await openTransfer(tx, s.id))) return;
  const clock = { accruedSeconds: s.accruedSeconds, runningSince: s.runningSince };
  if (s.mode === "FIXED" && s.fixedSeconds !== null && clockElapsed(clock, ctx.now) >= s.fixedSeconds) {
    await setState(tx, s, "FINISHED", { accrued_seconds: s.fixedSeconds, running_since: null, final_amount_idr: s.amountIdr }, ctx.now);
    await revokeGranted(tx, s, "expired");
    await issue(tx, ctx, s, { action: "LOCK", purpose: "end_lock", deviceId: s.deviceId, stationId: s.stationId, actor: "system:fixed-end" });
    await emit(tx, s, "FIXED_ENDED", { billableSeconds: s.fixedSeconds }, ctx.now);
    return;
  }
  if (s.mode !== "OPEN") return;
  const applied = first(await tx.execute(sql`SELECT max(not_after) AS until FROM session_leases WHERE session_id = ${s.id} AND device_id = ${s.deviceId} AND applied_at IS NOT NULL`));
  const until = applied?.["until"] ? new Date(applied["until"]) : null;
  if (until && ctx.now.getTime() >= until.getTime()) {
    // WAN loss or lost renewal: the seat locked itself at its last applied lease. Record the actual billable and lock.
    const billable = clockElapsed(pauseClock(clock, until), until);
    await setState(tx, s, "RECOVERY", { accrued_seconds: billable, running_since: null, recovery_reason: "lease_expired" }, ctx.now);
    await revokeGranted(tx, s, "expired");
    await issue(tx, ctx, s, { action: "LOCK", purpose: "expiry_lock", deviceId: s.deviceId, stationId: s.stationId, actor: "system:lease-expiry" });
    await emit(tx, s, "LEASE_EXPIRED", { billableSeconds: billable }, ctx.now);
    return;
  }
  const lease = first(await tx.execute(sql`SELECT issued_at FROM session_leases WHERE session_id = ${s.id} AND status = 'granted'`));
  if (lease && renewalDue(new Date(lease["issued_at"]), ctx.now) && (await ctx.opts.edgeOnline?.(s.tenantId, s.outletId)) !== false) {
    await issue(tx, ctx, s, { action: "EXTEND", purpose: "renew", deviceId: s.deviceId, stationId: s.stationId, actor: "system:renewal", withLease: true });
  }
}

// ---- transfer progress -----------------------------------------------------------------------------------------------
async function sourceProven(tx: Tx, ctx: Ctx, tr: Row): Promise<boolean> {
  const lock = await loadCommand(tx, tr["lock_command_id"]);
  if (lock && lock.status === "APPLIED" && lock.applied_level && lockProven(lock.applied_level as VerificationLevel, ctx.opts.allowSimulated === true)) return true;
  // Bounded expiry: the source seat has locked itself once EVERY lease it was ever sent (even unacknowledged or revoked) is past notAfter.
  const e = first(await tx.execute(sql`SELECT max(not_after) AS until FROM session_leases WHERE session_id = ${tr["session_id"]} AND device_id = ${tr["from_device_id"]}`));
  return !!e?.["until"] && ctx.now.getTime() >= new Date(e["until"]).getTime();
}

async function progressTransfer(tx: Tx, ctx: Ctx, s: S): Promise<void> {
  const tr = await openTransfer(tx, s.id);
  if (!tr) return;
  const touch = async (status: string, extra: Record<string, unknown> = {}): Promise<void> => {
    await tx.execute(sql`UPDATE session_transfers SET status = ${status}, failure_reason = ${(extra["failure_reason"] as string | undefined) ?? null}, updated_at = ${ts(ctx.now)} WHERE id = ${tr["id"]}`);
    tr["status"] = status;
  };
  if (tr["status"] === "LOCKING_SOURCE" || tr["status"] === "SOURCE_UNPROVEN") {
    if (await sourceProven(tx, ctx, tr)) { await grantDestination(tx, ctx, s, tr); return; }
    const lock = await loadCommand(tx, tr["lock_command_id"]);
    if (tr["status"] === "LOCKING_SOURCE" && lock && lock.status === "TIMED_OUT") {
      await touch("SOURCE_UNPROVEN", { failure_reason: "source_lock_unproven" });
      if (s.state === "ACTIVE") await setState(tx, s, "RECOVERY", { recovery_reason: "source_lock_unproven" }, ctx.now);
      await emit(tx, s, "TRANSFER_SOURCE_UNPROVEN", { transferId: tr["id"] }, ctx.now);
    }
  } else if (tr["status"] === "ACTIVATING_TARGET") {
    const start = await loadCommand(tx, tr["start_command_id"]);
    if (start && start.status === "TIMED_OUT") await targetFailed(tx, ctx, s, tr, "target_timeout");
  }
}

async function grantDestination(tx: Tx, ctx: Ctx, s: S, tr: Row): Promise<void> {
  const epoch = await authority(tx, s.tenantId, s.outletId);
  void epoch;
  if (s.state === "RECOVERY") await setState(tx, s, "ACTIVE", { recovery_reason: null }, ctx.now);
  const c = await issue(tx, ctx, s, { action: "START", purpose: "target_start", deviceId: tr["to_device_id"], stationId: tr["to_station_id"], actor: "system:transfer", withLease: true, transferId: tr["id"] });
  await tx.execute(sql`UPDATE session_transfers SET status = 'ACTIVATING_TARGET', start_command_id = ${c.command_id}, failure_reason = NULL, updated_at = ${ts(ctx.now)} WHERE id = ${tr["id"]}`);
  tr["status"] = "ACTIVATING_TARGET";
  tr["start_command_id"] = c.command_id;
  await emit(tx, s, "TRANSFER_DESTINATION_GRANTED", { transferId: tr["id"], commandId: c.command_id }, ctx.now);
  ctx.opts.faults?.afterDestinationGrant?.();
}

async function commitTransfer(tx: Tx, ctx: Ctx, s: S, c: C, level: VerificationLevel, at: Date): Promise<void> {
  const tr = await openTransfer(tx, s.id);
  if (!tr || tr["status"] !== "ACTIVATING_TARGET" || tr["start_command_id"] !== c.command_id) return;
  const from = s.stationId;
  const clock = startClock({ accruedSeconds: s.accruedSeconds, runningSince: null }, at);
  const delta = BigInt(tr["tariff_delta_idr"]);
  await patch(tx, s, {
    station_id: tr["to_station_id"], device_id: tr["to_device_id"], running_since: clock.runningSince, verification_level: level,
    tariff_delta_idr: s.tariffDeltaIdr + delta, amount_idr: s.amountIdr + delta, recovery_reason: null,
  }, ctx.now);
  await tx.execute(sql`UPDATE session_transfers SET status = 'COMMITTED', completed_at = ${ts(ctx.now)}, updated_at = ${ts(ctx.now)} WHERE id = ${tr["id"]}`);
  await releaseStation(tx, s, from);
  await emit(tx, s, "TRANSFER_COMMITTED", { transferId: tr["id"], fromStationId: from, toStationId: tr["to_station_id"], tariffDeltaIdr: delta.toString() }, ctx.now);
}

async function targetFailed(tx: Tx, ctx: Ctx, s: S, tr: Row, reason: string): Promise<void> {
  await revokeGranted(tx, s);
  await tx.execute(sql`UPDATE session_transfers SET status = 'TARGET_FAILED', failure_reason = ${reason}, updated_at = ${ts(ctx.now)} WHERE id = ${tr["id"]}`);
  tr["status"] = "TARGET_FAILED";
  // Make sure the destination is locked whatever it did with the START (a timeout may hide an applied command).
  await issue(tx, ctx, s, { action: "LOCK", purpose: "target_lock", deviceId: tr["to_device_id"], stationId: tr["to_station_id"], actor: "system:transfer", transferId: tr["id"] });
  if (s.state === "ACTIVE") await setState(tx, s, "RECOVERY", { recovery_reason: reason }, ctx.now);
  await emit(tx, s, "TRANSFER_TARGET_FAILED", { transferId: tr["id"], reason }, ctx.now);
}

// ---- station holds ---------------------------------------------------------------------------------------------------
async function releaseHolds(tx: Tx, ctx: Ctx, s: S): Promise<void> {
  for (const h of rows(await tx.execute(sql`SELECT id, station_id, release_after_command_id FROM session_station_holds WHERE session_id = ${s.id} AND released_at IS NULL`))) {
    const c = await loadCommand(tx, h["release_after_command_id"]);
    const ok = !c || (c.status === "APPLIED" && !!c.applied_level && lockProven(c.applied_level as VerificationLevel, ctx.opts.allowSimulated === true));
    if (!ok) continue;
    await releaseStation(tx, s, h["station_id"]);
    await tx.execute(sql`UPDATE session_station_holds SET released_at = ${ts(ctx.now)} WHERE id = ${h["id"]}`);
    await emit(tx, s, "STATION_RELEASED", { stationId: h["station_id"] }, ctx.now);
  }
}

/** One idempotent pass: apply ACKs, expire commands, move transfers forward, apply time rules, release proven holds. */
export async function reconcile(tx: Tx, ctx: Ctx, p: { tenantId: string; outletId: string }, id: string): Promise<S> {
  const s = await lockSession(tx, p, id);
  await applyAcks(tx, ctx, s);
  await expireCommands(tx, ctx, s);
  await progressTransfer(tx, ctx, s);
  await timeRules(tx, ctx, s);
  await releaseHolds(tx, ctx, s);
  return s;
}

// ---- start -----------------------------------------------------------------------------------------------------------
export const QUOTE_TTL_MS = SESSION_TIMING.quoteTtlSeconds * 1000;

export async function startSession(tx: Tx, ctx: Ctx, p: Principal, b: { quoteId: string; paymentMode: "payment" | "postpaid"; paymentIntentId?: string; sessionMode?: LeaseMode }): Promise<S> {
  const mode: LeaseMode = b.sessionMode ?? "FIXED";
  if (b.paymentMode === "payment" && !b.paymentIntentId) throw new DomainError("VALIDATION_FAILED", { field: "paymentIntentId" });
  if (b.paymentMode === "postpaid" && b.paymentIntentId) throw new DomainError("VALIDATION_FAILED", { field: "paymentIntentId" });
  if (b.paymentMode === "payment" && mode === "OPEN") throw new DomainError("VALIDATION_FAILED", { field: "sessionMode" });

  const q = first(await tx.execute(sql`SELECT id, station_id, amount_idr, billable_seconds, minimum_applied, created_at FROM quotes WHERE id = ${b.quoteId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`));
  if (!q) throw new DomainError("NOT_FOUND");
  if (ctx.now.getTime() - new Date(q["created_at"]).getTime() > QUOTE_TTL_MS) throw new SessionError("QUOTE_STALE", { reason: "expired" });
  if (first(await tx.execute(sql`SELECT 1 FROM sessions WHERE quote_id = ${b.quoteId}`))) throw new SessionError("QUOTE_STALE", { reason: "quote_used" });
  const stationId = q["station_id"] as string;

  const st = first(await tx.execute(sql`SELECT status, reserved_by FROM stations WHERE id = ${stationId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`));
  if (!st) throw new DomainError("NOT_FOUND");
  if (st["status"] === "retired") throw new SessionError("STATION_BUSY", { reason: "retired" });
  if (st["status"] === "reserved" && st["reserved_by"] !== p.staffId) throw new SessionError("STATION_BUSY", { reason: "reserved_by_other" });
  if (await stationBlocked(tx, stationId)) throw new SessionError("STATION_BUSY", { reason: "session_in_progress" });

  const deviceId = await seatDevice(tx, p.tenantId, p.outletId, stationId);
  await authority(tx, p.tenantId, p.outletId);

  let amount = BigInt(q["amount_idr"]);
  if (b.paymentMode === "payment") {
    const intent = first(await tx.execute(sql`SELECT id, quote_id, station_id, status FROM payment_intents WHERE id = ${b.paymentIntentId as string} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`));
    if (!intent) throw new DomainError("NOT_FOUND");
    if (intent["status"] !== "settled") throw new SessionError("PAYMENT_UNCONFIRMED", { status: String(intent["status"]) });
    const alloc = first(await tx.execute(sql`SELECT amount_idr FROM payment_allocations WHERE intent_id = ${intent["id"]}`));
    if (!alloc) throw new SessionError("PAYMENT_UNCONFIRMED", { reason: "no_allocation" });
    const check = canActivate(BigInt(alloc["amount_idr"]), amount);
    if (!check.ok) throw new SessionError("INSUFFICIENT_BALANCE", { shortfallIdr: check.shortfallIdr.toString() });
    if (intent["quote_id"] !== b.quoteId) throw new SessionError("PAYMENT_UNCONFIRMED", { reason: "payment_for_other_quote" });
    if (first(await tx.execute(sql`SELECT 1 FROM sessions WHERE payment_intent_id = ${b.paymentIntentId as string}`))) throw new SessionError("PAYMENT_UNCONFIRMED", { reason: "payment_already_used" });
  }
  if (mode === "FIXED" && num(q["billable_seconds"]) <= 0) throw new DomainError("VALIDATION_FAILED", { field: "quoteId" });
  if (mode === "OPEN") amount = 0n;

  if (st["status"] === "available") {
    await tx.execute(sql`UPDATE stations SET status = 'reserved', reserved_by = ${p.staffId}, reserved_at = ${ts(ctx.now)}, revision = revision + 1 WHERE id = ${stationId}`);
  }
  const id = randomUUID();
  await tx.execute(sql`
    INSERT INTO sessions (id, tenant_id, outlet_id, station_id, origin_station_id, device_id, quote_id, payment_intent_id, payment_mode, mode, state, revision, fixed_seconds, amount_idr, minimum_applied, created_by, created_at, updated_at)
    VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${stationId}, ${stationId}, ${deviceId}, ${b.quoteId}, ${b.paymentIntentId ?? null}, ${b.paymentMode}, ${mode}, 'STARTING', 1,
            ${mode === "FIXED" ? num(q["billable_seconds"]) : null}, ${amount.toString()}, ${mode === "FIXED" ? q["minimum_applied"] : false}, ${p.staffId}, ${ts(ctx.now)}, ${ts(ctx.now)})`);
  ctx.opts.faults?.afterStartInsert?.();
  const s = (await loadSession(tx, id)) as S;
  await emit(tx, s, "START_REQUESTED", { paymentMode: b.paymentMode, mode }, ctx.now);
  await issue(tx, ctx, s, { action: "START", purpose: "start", deviceId, stationId, actor: `staff:${p.staffId}`, withLease: true, initial: true });
  return s;
}

// ---- actions ---------------------------------------------------------------------------------------------------------
export interface ActionBody { kind: string; expectedRevision: number; targetStationId?: string; quoteId?: string; resolution?: "retry" | "end" }

const pendingOf = async (tx: Tx, sessionId: string, purpose: string): Promise<C | undefined> =>
  first(await tx.execute(sql`SELECT * FROM session_commands WHERE session_id = ${sessionId} AND purpose = ${purpose} AND status IN ('PENDING', 'RECEIVED', 'TIMED_OUT') ORDER BY desired_revision DESC LIMIT 1`)) as unknown as C | undefined;

export async function act(tx: Tx, ctx: Ctx, p: Principal, id: string, b: ActionBody): Promise<S> {
  let s = await lockSession(tx, p, id);
  if (s.revision !== b.expectedRevision) throw new DomainError("REVISION_CONFLICT");
  await reconcile(tx, ctx, p, id);
  s = (await loadSession(tx, id)) as S;
  const actor = `staff:${p.staffId}`;
  const open = await openTransfer(tx, s.id);
  const stop = async (): Promise<void> => {
    const c = pauseClock({ accruedSeconds: s.accruedSeconds, runningSince: s.runningSince }, ctx.now);
    await patch(tx, s, { accrued_seconds: s.fixedSeconds === null ? c.accruedSeconds : Math.min(c.accruedSeconds, s.fixedSeconds), running_since: null }, ctx.now);
  };
  switch (b.kind) {
    case "pause": {
      if (open) return invalid(s, "pause");
      if (s.state === "ACTIVE") {
        await stop();
        await setState(tx, s, "PAUSED", {}, ctx.now);
        await revokeGranted(tx, s);
        await issue(tx, ctx, s, { action: "PAUSE", purpose: "pause", deviceId: s.deviceId, stationId: s.stationId, actor });
      } else if (s.state === "PAUSED" && (await pendingOf(tx, s.id, "resume"))) {
        await revokeGranted(tx, s); // cancel the unlock that is still in flight
        await issue(tx, ctx, s, { action: "PAUSE", purpose: "pause", deviceId: s.deviceId, stationId: s.stationId, actor });
      } else return invalid(s, "pause");
      break;
    }
    case "resume": {
      if (open || s.state !== "PAUSED" || (await pendingOf(tx, s.id, "resume"))) return invalid(s, "resume");
      if (s.fixedSeconds !== null && remainingOf(s, ctx.now) <= 0) return invalid(s, "resume");
      await issue(tx, ctx, s, { action: "RESUME", purpose: "resume", deviceId: s.deviceId, stationId: s.stationId, actor, withLease: true });
      break;
    }
    case "end": {
      if (open || (s.state !== "ACTIVE" && s.state !== "PAUSED")) return invalid(s, "end");
      await stop();
      await setState(tx, s, "FINISHED", { final_amount_idr: await finalAmount(tx, s, elapsedOf(s, ctx.now)) }, ctx.now);
      await revokeGranted(tx, s);
      await issue(tx, ctx, s, { action: "LOCK", purpose: "end_lock", deviceId: s.deviceId, stationId: s.stationId, actor });
      break;
    }
    case "cancel": {
      if (s.state !== "STARTING") return invalid(s, "cancel");
      const lock = await issue(tx, ctx, s, { action: "LOCK", purpose: "cancel_lock", deviceId: s.deviceId, stationId: s.stationId, actor });
      await activationFailed(tx, ctx, s, "cancelled", p.staffId, { afterCommandId: lock.command_id });
      break;
    }
    case "retry": {
      const start = await pendingOf(tx, s.id, "start");
      if (s.state !== "STARTING" || !start || start.status !== "TIMED_OUT") return invalid(s, "retry");
      await resend(tx, ctx, s, start, true);
      break;
    }
    case "checkout": case "clean": case "release": {
      const [from, to] = b.kind === "checkout" ? ["FINISHED", "CHECKOUT_PENDING"] : b.kind === "clean" ? ["CHECKOUT_PENDING", "CLEANING"] : ["CLEANING", "AVAILABLE"];
      if (s.state !== from) return invalid(s, b.kind);
      await setState(tx, s, to as SessionState, {}, ctx.now);
      if (to === "AVAILABLE") await releaseStation(tx, s, s.stationId);
      await emit(tx, s, `SESSION_${to}`, {}, ctx.now);
      break;
    }
    case "recover": return recover(tx, ctx, p, s, open, b.resolution);
    case "move": return move(tx, ctx, p, s, open, b);
    default: throw new DomainError("VALIDATION_FAILED", { field: "kind" });
  }
  return s;
}

async function recover(tx: Tx, ctx: Ctx, p: Principal, s: S, open: Row | undefined, resolution: "retry" | "end" | undefined): Promise<S> {
  if (s.state !== "RECOVERY" || !resolution) return invalid(s, "recover");
  const actor = `staff:${p.staffId}`;
  if (resolution === "retry") {
    if (!open) return invalid(s, "recover.retry");
    if (open["status"] === "SOURCE_UNPROVEN") {
      const lock = (await loadCommand(tx, open["lock_command_id"])) as C;
      await resend(tx, ctx, s, lock, false);
      await tx.execute(sql`UPDATE session_transfers SET status = 'LOCKING_SOURCE', failure_reason = NULL, updated_at = ${ts(ctx.now)} WHERE id = ${open["id"]}`);
      await setState(tx, s, "ACTIVE", { recovery_reason: null }, ctx.now);
    } else if (open["status"] === "TARGET_FAILED") {
      await grantDestination(tx, ctx, s, open);
    } else return invalid(s, "recover.retry");
    return s;
  }
  // end: bill the frozen actual, lock what may still be playing, release what was never commanded.
  await setState(tx, s, "FINISHED", { final_amount_idr: await finalAmount(tx, s, elapsedOf(s, ctx.now)), recovery_reason: null }, ctx.now);
  await revokeGranted(tx, s);
  if (open) {
    await tx.execute(sql`UPDATE session_transfers SET status = 'ABORTED', completed_at = ${ts(ctx.now)}, updated_at = ${ts(ctx.now)} WHERE id = ${open["id"]}`);
    if (open["start_command_id"]) {
      const targetLock = first(await tx.execute(sql`SELECT command_id FROM session_commands WHERE session_id = ${s.id} AND purpose = 'target_lock' ORDER BY desired_revision DESC LIMIT 1`));
      const lockId = targetLock ? (targetLock["command_id"] as string) : (await issue(tx, ctx, s, { action: "LOCK", purpose: "target_lock", deviceId: open["to_device_id"], stationId: open["to_station_id"], actor, transferId: open["id"] })).command_id;
      await tx.execute(sql`INSERT INTO session_station_holds (id, session_id, tenant_id, outlet_id, station_id, release_after_command_id, created_at)
        VALUES (${randomUUID()}, ${s.id}, ${s.tenantId}, ${s.outletId}, ${open["to_station_id"]}, ${lockId}, ${ts(ctx.now)}) ON CONFLICT DO NOTHING`);
    } else {
      await releaseStation(tx, s, open["to_station_id"]);
    }
    if (open["status"] === "SOURCE_UNPROVEN" || open["status"] === "LOCKING_SOURCE") {
      const lock = await loadCommand(tx, open["lock_command_id"]);
      if (!lock || lock.status === "SUPERSEDED") await issue(tx, ctx, s, { action: "LOCK", purpose: "end_lock", deviceId: s.deviceId, stationId: s.stationId, actor });
    }
  } else {
    await issue(tx, ctx, s, { action: "LOCK", purpose: "end_lock", deviceId: s.deviceId, stationId: s.stationId, actor });
  }
  await emit(tx, s, "RECOVERY_ENDED", {}, ctx.now);
  return s;
}

// ---- transfer quote and move -----------------------------------------------------------------------------------------
async function transferTarget(tx: Tx, p: Principal, s: S, targetStationId: string): Promise<{ deviceId: string }> {
  if (targetStationId === s.stationId) throw new SessionError("TRANSFER_REFUSED", { reason: "same_station" });
  const ids = [s.stationId, targetStationId].sort();
  for (const sid of ids) await tx.execute(sql`SELECT 1 FROM stations WHERE id = ${sid} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId} FOR UPDATE`);
  const t = first(await tx.execute(sql`SELECT status FROM stations WHERE id = ${targetStationId} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`));
  if (!t) throw new DomainError("NOT_FOUND");
  if (t["status"] !== "available" || (await stationBlocked(tx, targetStationId))) throw new SessionError("STATION_BUSY", { reason: "target_not_available" });
  return { deviceId: await seatDevice(tx, p.tenantId, p.outletId, targetStationId) };
}

export async function transferQuote(tx: Tx, ctx: Ctx, p: Principal, id: string, targetStationId: string): Promise<Row> {
  const s = await lockSession(tx, p, id);
  if (s.state !== "ACTIVE" || (await openTransfer(tx, s.id))) return invalid(s, "transfer-quote");
  await transferTarget(tx, p, s, targetStationId);
  const rule = await ruleOf(tx, s);
  const target = (await zoneRateOf(tx, p.tenantId, p.outletId, targetStationId, ctx.now)) ?? rule.ratePerHourIdr;
  const elapsed = elapsedOf(s, ctx.now);
  const q = tariffDeltaQuote({ rule, elapsedSeconds: elapsed, totalSeconds: s.fixedSeconds, targetRatePerHourIdr: target });
  if (!q.ok) throw new SessionError("TRANSFER_REFUSED", { reason: "upward_zone" });
  const qid = randomUUID();
  const expires = addS(ctx.now, SESSION_TIMING.transferQuoteTtlSeconds);
  await tx.execute(sql`
    INSERT INTO session_transfer_quotes (id, session_id, tenant_id, outlet_id, from_station_id, to_station_id, session_revision, elapsed_seconds, total_seconds, source_rate_idr, target_rate_idr,
      base_amount_idr, new_amount_idr, delta_idr, minimum_applied, created_by, created_at, expires_at)
    VALUES (${qid}, ${s.id}, ${p.tenantId}, ${p.outletId}, ${s.stationId}, ${targetStationId}, ${s.revision}, ${elapsed}, ${s.fixedSeconds}, ${rule.ratePerHourIdr.toString()}, ${target.toString()},
      ${q.baseAmountIdr.toString()}, ${q.newAmountIdr.toString()}, ${q.deltaIdr.toString()}, ${q.minimumApplied}, ${p.staffId}, ${ts(ctx.now)}, ${ts(expires)})`);
  return {
    transferQuoteId: qid, sessionId: s.id, fromStationId: s.stationId, toStationId: targetStationId, deltaIdr: q.deltaIdr.toString(), baseAmountIdr: q.baseAmountIdr.toString(),
    newAmountIdr: q.newAmountIdr.toString(), minimumApplied: q.minimumApplied, elapsedSeconds: elapsed, totalSeconds: s.fixedSeconds, sourceRateIdr: rule.ratePerHourIdr.toString(),
    targetRateIdr: target.toString(), ...(q.futureRatePerHourIdr !== undefined ? { futureRatePerHourIdr: q.futureRatePerHourIdr.toString() } : {}),
    sessionRevision: s.revision, createdAt: iso(ctx.now), expiresAt: iso(expires),
  };
}

async function move(tx: Tx, ctx: Ctx, p: Principal, s: S, open: Row | undefined, b: ActionBody): Promise<S> {
  if (open || s.state !== "ACTIVE") return invalid(s, "move");
  if (!b.targetStationId || !b.quoteId) throw new DomainError("VALIDATION_FAILED", { field: b.quoteId ? "targetStationId" : "quoteId" });
  const tq = first(await tx.execute(sql`SELECT * FROM session_transfer_quotes WHERE id = ${b.quoteId} AND session_id = ${s.id} AND tenant_id = ${p.tenantId} AND outlet_id = ${p.outletId}`));
  if (!tq || tq["to_station_id"] !== b.targetStationId) throw new SessionError("QUOTE_STALE", { reason: "quote_not_for_this_move" });
  if (new Date(tq["expires_at"]).getTime() <= ctx.now.getTime()) throw new SessionError("QUOTE_STALE", { reason: "expired" });
  if (num(tq["session_revision"]) !== s.revision) throw new SessionError("QUOTE_STALE", { reason: "session_changed" });
  if (first(await tx.execute(sql`SELECT 1 FROM session_transfers WHERE transfer_quote_id = ${b.quoteId}`))) throw new SessionError("QUOTE_STALE", { reason: "quote_used" });
  const target = await transferTarget(tx, p, s, b.targetStationId);
  await authority(tx, p.tenantId, p.outletId);

  await tx.execute(sql`UPDATE stations SET status = 'reserved', reserved_by = ${p.staffId}, reserved_at = ${ts(ctx.now)}, revision = revision + 1 WHERE id = ${b.targetStationId}`);
  const c = pauseClock({ accruedSeconds: s.accruedSeconds, runningSince: s.runningSince }, ctx.now);
  await patch(tx, s, { accrued_seconds: s.fixedSeconds === null ? c.accruedSeconds : Math.min(c.accruedSeconds, s.fixedSeconds), running_since: null }, ctx.now);
  await revokeGranted(tx, s);
  const trId = randomUUID();
  const lock = await issue(tx, ctx, s, { action: "LOCK", purpose: "source_lock", deviceId: s.deviceId, stationId: s.stationId, actor: `staff:${p.staffId}` });
  await tx.execute(sql`
    INSERT INTO session_transfers (id, session_id, tenant_id, outlet_id, from_station_id, to_station_id, from_device_id, to_device_id, transfer_quote_id, status, tariff_delta_idr, lock_command_id, created_at, updated_at)
    VALUES (${trId}, ${s.id}, ${p.tenantId}, ${p.outletId}, ${s.stationId}, ${b.targetStationId}, ${s.deviceId}, ${target.deviceId}, ${b.quoteId}, 'LOCKING_SOURCE', ${BigInt(tq["delta_idr"]).toString()}, ${lock.command_id}, ${ts(ctx.now)}, ${ts(ctx.now)})`);
  await tx.execute(sql`UPDATE session_commands SET transfer_id = ${trId} WHERE command_id = ${lock.command_id}`);
  await emit(tx, s, "TRANSFER_REQUESTED", { transferId: trId, fromStationId: s.stationId, toStationId: b.targetStationId, tariffDeltaIdr: String(tq["delta_idr"]) }, ctx.now);
  return s;
}

// ---- read models -----------------------------------------------------------------------------------------------------
export async function sessionView(tx: Pick<Tx, "execute">, ctx: Ctx, id: string): Promise<Row> {
  const s = (await loadSession(tx, id)) as S;
  const start = first(await tx.execute(sql`SELECT command_id, status, applied_level, retries FROM session_commands WHERE session_id = ${id} AND purpose = 'start' ORDER BY desired_revision LIMIT 1`));
  const lease = first(await tx.execute(sql`SELECT * FROM session_leases WHERE session_id = ${id} AND status = 'granted'`));
  const tr = first(await tx.execute(sql`SELECT * FROM session_transfers WHERE session_id = ${id} ORDER BY created_at DESC, id DESC LIMIT 1`));
  const clock = { accruedSeconds: s.accruedSeconds, runningSince: s.runningSince };
  const elapsed = s.fixedSeconds === null ? clockElapsed(clock, ctx.now) : Math.min(clockElapsed(clock, ctx.now), s.fixedSeconds);
  return {
    sessionId: s.id, state: s.state, revision: s.revision, stationId: s.stationId, originStationId: s.originStationId, deviceId: s.deviceId, mode: s.mode,
    paymentMode: s.paymentMode, paymentIntentId: s.paymentIntentId, quoteId: s.quoteId, amountIdr: s.amountIdr.toString(), tariffDeltaIdr: s.tariffDeltaIdr.toString(),
    minimumApplied: s.minimumApplied, finalAmountIdr: s.finalAmountIdr === null ? null : s.finalAmountIdr.toString(),
    verificationLevel: s.verificationLevel, deviceProof: s.verificationLevel !== null && isDeviceProof(s.verificationLevel), limitedMode: s.verificationLevel === "COMMANDED_ONLY",
    recoveryReason: s.recoveryReason, createdAt: iso(s.createdAt),
    activation: start ? { commandId: start["command_id"], status: start["status"], verificationLevel: start["applied_level"], timedOut: start["status"] === "TIMED_OUT", retries: num(start["retries"]) } : null,
    clock: { running: s.runningSince !== null, billableSeconds: elapsed, remainingSeconds: s.fixedSeconds === null ? null : Math.max(0, s.fixedSeconds - elapsed) },
    lease: lease ? { leaseId: lease["lease_id"], revision: num(lease["revision"]), mode: lease["mode"], status: lease["status"], issuedAt: iso(lease["issued_at"]), notAfter: iso(lease["not_after"]), remainingSecondsAtIssue: num(lease["remaining_seconds_at_issue"]) } : null,
    transfer: tr ? { transferId: tr["id"], status: tr["status"], fromStationId: tr["from_station_id"], toStationId: tr["to_station_id"], tariffDeltaIdr: String(tr["tariff_delta_idr"]), failureReason: tr["failure_reason"], gameplayContinuity: "not_guaranteed" } : null,
  };
}

export async function commandViews(tx: Tx, sessionId: string): Promise<Row[]> {
  const out: Row[] = [];
  for (const c of await loadCommands(tx, sessionId)) {
    const lease = c.lease_id ? first(await tx.execute(sql`SELECT * FROM session_leases WHERE lease_id = ${c.lease_id}`)) : undefined;
    out.push({
      commandId: c.command_id, action: c.action, purpose: c.purpose, status: c.status, retries: c.retries, appliedLevel: c.applied_level,
      command: {
        protocolVersion: 1, commandId: c.command_id, stationId: c.station_id, deviceId: c.device_id, authorityEpoch: num(c.authority_epoch), sequence: num(c.sequence),
        expectedRevision: c.expected_revision, desiredRevision: c.desired_revision, action: c.action, issuedAt: iso(c.issued_at), expiresAt: iso(c.expires_at), actorRef: c.actor_ref,
      },
      leaseClaims: lease ? {
        protocolVersion: 1, leaseId: lease["lease_id"], tenantId: lease["tenant_id"], outletId: lease["outlet_id"], stationId: lease["station_id"], deviceId: lease["device_id"],
        sessionId: lease["session_id"], authorityEpoch: num(lease["authority_epoch"]), revision: num(lease["revision"]), mode: lease["mode"],
        remainingSecondsAtIssue: num(lease["remaining_seconds_at_issue"]), issuedAt: iso(lease["issued_at"]), notAfter: iso(lease["not_after"]), permissions: ["DISPLAY_GAME"],
      } : null,
    });
  }
  return out;
}

/** The ids that need a pass: live sessions, and any session still holding a station until a lock is proven. */
export async function sweepTargets(tx: Pick<Tx, "execute">): Promise<{ id: string; tenantId: string; outletId: string }[]> {
  return rows(await tx.execute(sql`
    SELECT id, tenant_id, outlet_id FROM sessions
    WHERE state IN ('STARTING', 'ACTIVE', 'PAUSED', 'RECOVERY', 'ACTIVATION_FAILED', 'FINISHED')
       OR id IN (SELECT session_id FROM session_station_holds WHERE released_at IS NULL)
    ORDER BY created_at, id`)).map((r) => ({ id: r["id"], tenantId: r["tenant_id"], outletId: r["outlet_id"] }));
}

export async function addZoneRate(tx: Tx, ctx: Ctx, p: Principal, zone: string, rate: bigint): Promise<Row> {
  const id = randomUUID();
  await tx.execute(sql`INSERT INTO zone_rate_versions (id, tenant_id, outlet_id, zone, rate_per_hour_idr, created_by, created_at)
    VALUES (${id}, ${p.tenantId}, ${p.outletId}, ${zone}, ${rate.toString()}, ${p.staffId}, ${ts(ctx.now)})`);
  return { zoneRateId: id, zone, ratePerHourIdr: rate.toString(), createdAt: iso(ctx.now) };
}
