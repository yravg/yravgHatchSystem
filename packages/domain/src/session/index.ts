// Contract: pure T49 session core, no I/O, no clock of its own, no floats in money.
//   state machine  CONTRACTS section 3: AVAILABLE RESERVED STARTING ACTIVE PAUSED FINISHED CHECKOUT_PENDING CLEANING
//                  ACTIVATION_FAILED RECOVERY. Anything outside the table is InvalidTransitionError.
//   billing clock  { accruedSeconds, runningSince }. It runs only between an APPLIED unlock and the next lock. Time is
//                  passed in (trusted server time); a clock that moves back adds nothing and never subtracts.
//   lease window   fixture D07: OPEN lease max 120 s, renewed from 60 s; FIXED lease = remaining entitlement + ACK window.
//   levels         RECEIVED is not APPLIED. COMMANDED_ONLY may bill (labelled) but never proves a lock. SIMULATED is a
//                  fixture level and only counts when the caller enables it.
//   tariffDelta    transfer quote over the pure pricing core: the minimum is counted once (D26), only the remaining time is
//                  repriced, a dearer destination is refused. All timings and money are SANDBOX FIXTURES (D01, D06, D07, D26).
import { quoteSession, type RateRule, type Segment } from "../pricing/index.ts";

export const SESSION_STATES = [
  "AVAILABLE", "RESERVED", "STARTING", "ACTIVE", "PAUSED", "FINISHED", "CHECKOUT_PENDING", "CLEANING", "ACTIVATION_FAILED", "RECOVERY",
] as const;
export type SessionState = (typeof SESSION_STATES)[number];

const TRANSITIONS: Readonly<Record<SessionState, readonly SessionState[]>> = {
  AVAILABLE: ["RESERVED"],
  RESERVED: ["STARTING", "AVAILABLE"],
  STARTING: ["ACTIVE", "ACTIVATION_FAILED"],
  ACTIVE: ["PAUSED", "FINISHED", "RECOVERY"],
  PAUSED: ["ACTIVE", "FINISHED", "RECOVERY"],
  FINISHED: ["CHECKOUT_PENDING"],
  CHECKOUT_PENDING: ["CLEANING"],
  CLEANING: ["AVAILABLE"],
  ACTIVATION_FAILED: ["RECOVERY", "AVAILABLE"],
  RECOVERY: ["ACTIVE", "FINISHED", "AVAILABLE"],
};

export class InvalidTransitionError extends Error {
  readonly code = "INVALID_TRANSITION";
  constructor(readonly from: SessionState, readonly to: SessionState) {
    super(`INVALID_TRANSITION ${from} -> ${to}`);
  }
}

export const canTransition = (from: SessionState, to: SessionState): boolean => TRANSITIONS[from].includes(to);

export function assertTransition(from: SessionState, to: SessionState): void {
  if (!canTransition(from, to)) throw new InvalidTransitionError(from, to);
}

// ---- billing clock -------------------------------------------------------------------------------------------------
export interface BillingClock { accruedSeconds: number; runningSince: Date | null }

const secondsBetween = (from: Date, to: Date): number => Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000));

export const clockElapsed = (c: BillingClock, now: Date): number =>
  c.accruedSeconds + (c.runningSince ? secondsBetween(c.runningSince, now) : 0);

export const startClock = (c: BillingClock, at: Date): BillingClock => (c.runningSince ? c : { accruedSeconds: c.accruedSeconds, runningSince: at });
export const resumeClock = startClock;

export const pauseClock = (c: BillingClock, at: Date): BillingClock =>
  c.runningSince ? { accruedSeconds: c.accruedSeconds + secondsBetween(c.runningSince, at), runningSince: null } : c;

// ---- lease window (D07 fixture) ------------------------------------------------------------------------------------
export const SESSION_TIMING = {
  ackTimeoutSeconds: 10,
  renewSeconds: 60,
  horizonSeconds: 120,
  transferQuoteTtlSeconds: 300,
  quoteTtlSeconds: 900,
} as const;

export type LeaseMode = "FIXED" | "OPEN";

export function leaseWindow(i: { mode: LeaseMode; remainingSeconds: number; now: Date }): { notAfter: Date; remainingSecondsAtIssue: number } {
  const remaining = Math.max(0, Math.floor(i.remainingSeconds));
  const span = i.mode === "OPEN" ? SESSION_TIMING.horizonSeconds : remaining + SESSION_TIMING.ackTimeoutSeconds;
  return { notAfter: new Date(i.now.getTime() + span * 1000), remainingSecondsAtIssue: i.mode === "OPEN" ? 0 : remaining };
}

export const renewalDue = (issuedAt: Date, now: Date): boolean => now.getTime() - issuedAt.getTime() >= SESSION_TIMING.renewSeconds * 1000;

// ---- verification levels -------------------------------------------------------------------------------------------
export type VerificationLevel = "SIMULATED" | "COMMANDED_ONLY" | "API_OBSERVED" | "OPERATOR_ATTESTED" | "LAB_VERIFIED";

/** May an APPLIED ACK at this level start billing? COMMANDED_ONLY may, but the session is labelled limited. */
export const billingAllowed = (level: VerificationLevel, allowSimulated: boolean): boolean => level !== "SIMULATED" || allowSimulated;

/** Does an APPLIED ACK at this level prove the picture is locked? COMMANDED_ONLY never does. */
export const lockProven = (level: VerificationLevel, allowSimulated: boolean): boolean =>
  level === "COMMANDED_ONLY" ? false : level === "SIMULATED" ? allowSimulated : true;

/** Only observed or attested levels are device proof; COMMANDED_ONLY and SIMULATED are not. */
export const isDeviceProof = (level: VerificationLevel): boolean => level !== "COMMANDED_ONLY" && level !== "SIMULATED";

// ---- transfer tariffDelta quote ------------------------------------------------------------------------------------
export type TariffDeltaQuote =
  | { ok: false; reason: "UPWARD_ZONE" }
  | { ok: true; deltaIdr: bigint; baseAmountIdr: bigint; newAmountIdr: bigint; minimumApplied: boolean; remainingSeconds: number | null; futureRatePerHourIdr?: bigint };

export function tariffDeltaQuote(i: { rule: RateRule; elapsedSeconds: number; totalSeconds: number | null; targetRatePerHourIdr: bigint }): TariffDeltaQuote {
  const source = i.rule.ratePerHourIdr;
  if (i.targetRatePerHourIdr > source) return { ok: false, reason: "UPWARD_ZONE" };
  if (i.totalSeconds === null) {
    const q = quoteSession(i.rule, [{ seconds: BigInt(i.elapsedSeconds), paused: false }]);
    return { ok: true, deltaIdr: 0n, baseAmountIdr: q.amountIdr, newAmountIdr: q.amountIdr, minimumApplied: q.minimumApplied, remainingSeconds: null, futureRatePerHourIdr: i.targetRatePerHourIdr };
  }
  const used = Math.min(i.elapsedSeconds, i.totalSeconds);
  const remaining = Math.max(0, i.totalSeconds - used);
  const seg = (rate?: bigint): Segment[] => [
    { seconds: BigInt(used), paused: false },
    { seconds: BigInt(remaining), paused: false, ...(rate === undefined ? {} : { ratePerHourIdr: rate }) },
  ];
  const base = quoteSession(i.rule, seg());
  const next = quoteSession(i.rule, seg(i.targetRatePerHourIdr));
  return { ok: true, deltaIdr: next.amountIdr - base.amountIdr, baseAmountIdr: base.amountIdr, newAmountIdr: next.amountIdr, minimumApplied: next.minimumApplied, remainingSeconds: remaining };
}
