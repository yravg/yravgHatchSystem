// Contract: pure pricing core, no I/O, no floats, no clock.
//   rule     { ratePerHourIdr: bigint, minimum?: { amountIdr, coveredSeconds } }  (minimum absent = disabled, D26 default)
//   segments { seconds, paused, ratePerHourIdr? }[]  in session order; a segment rate overrides the rule rate (zone transfer)
//   result   { exact: numerator/denominator, amountIdr, billableSeconds, minimumApplied }
// Rounding rule (D01 sandbox): the exact rational is rounded ONCE, to the nearest rupiah with half rounding up.
// Money figures in tests and docs are SANDBOX FIXTURES; production money policy (D01, D26) is NOT approved.
// D26: the minimum applies once per session (never again on retry, reconnect or transfer); a transfer never reprices
// earlier time; paused time is not billable and consumes none of the covered seconds.
import { DomainError } from "../errors.ts";

export interface Rational { numerator: bigint; denominator: bigint }

export interface MinimumRule { amountIdr: bigint; coveredSeconds: bigint }
export interface RateRule { ratePerHourIdr: bigint; minimum?: MinimumRule }
export interface Segment { seconds: bigint; paused: boolean; ratePerHourIdr?: bigint }

export interface SessionQuote { exact: Rational; amountIdr: bigint; billableSeconds: bigint; minimumApplied: boolean }

const SECONDS_PER_HOUR = 3600n;
const invalid = (field: string): never => { throw new DomainError("VALIDATION_FAILED", { field }); };

export function rational(numerator: bigint, denominator: bigint): Rational {
  if (denominator <= 0n) invalid("denominator");
  if (numerator < 0n) invalid("numerator");
  return { numerator, denominator };
}

/** Nearest rupiah, half up. The only rounding step in the module. */
export function roundHalfUp(r: Rational): bigint {
  return (2n * r.numerator + r.denominator) / (2n * r.denominator);
}

export const billableSeconds = (segments: readonly Segment[]): bigint =>
  segments.reduce((sum, s) => (s.seconds < 0n ? invalid("seconds") : s.paused ? sum : sum + s.seconds), 0n);

export function quoteSession(rule: RateRule, segments: readonly Segment[]): SessionQuote {
  if (rule.ratePerHourIdr < 0n) invalid("ratePerHourIdr");
  const m = rule.minimum;
  if (m && (m.amountIdr < 0n || m.coveredSeconds < 0n)) invalid("minimum");
  const billable = billableSeconds(segments);
  // Every term is "IDR x seconds" over one hour, so the common denominator stays 3600 and nothing is rounded early.
  let numerator = 0n;
  let covered = m?.coveredSeconds ?? 0n;
  const minimumApplied = m !== undefined && billable > 0n;
  if (minimumApplied) numerator += m.amountIdr * SECONDS_PER_HOUR;
  for (const s of segments) {
    if (s.paused) continue;
    const rate = s.ratePerHourIdr ?? rule.ratePerHourIdr;
    if (rate < 0n) invalid("ratePerHourIdr");
    const free = minimumApplied ? (covered < s.seconds ? covered : s.seconds) : 0n;
    covered -= free;
    numerator += (s.seconds - free) * rate;
  }
  const exact = rational(numerator, SECONDS_PER_HOUR);
  return { exact, amountIdr: roundHalfUp(exact), billableSeconds: billable, minimumApplied };
}

/** D26: a zone transfer passes downward only; a dearer target is refused. */
export const canTransferZone = (fromRatePerHourIdr: bigint, toRatePerHourIdr: bigint): boolean => toRatePerHourIdr <= fromRatePerHourIdr;

export type ActivationCheck = { ok: true } | { ok: false; reason: "INSUFFICIENT_BALANCE"; shortfallIdr: bigint };

/** Pure gate for the session coordinator (T49): a balance below what activation needs cannot activate. */
export function canActivate(balanceIdr: bigint, requiredIdr: bigint): ActivationCheck {
  if (balanceIdr < 0n) invalid("balanceIdr");
  if (requiredIdr < 0n) invalid("requiredIdr");
  return balanceIdr >= requiredIdr ? { ok: true } : { ok: false, reason: "INSUFFICIENT_BALANCE", shortfallIdr: requiredIdr - balanceIdr };
}
