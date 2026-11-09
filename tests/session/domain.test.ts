// Contract: T49 pure session core (packages/domain/src/session). All money and timings are SANDBOX FIXTURES (D01, D06, D07, D26).
import { describe, expect, it } from "vitest";
import {
  assertTransition, billingAllowed, canTransition, clockElapsed, leaseWindow, lockProven, pauseClock, renewalDue, resumeClock,
  SESSION_STATES, SESSION_TIMING, startClock, tariffDeltaQuote, InvalidTransitionError, type BillingClock,
} from "@yravg/domain";

const T0 = new Date(Date.UTC(2026, 10, 9, 3, 0, 0));
const at = (s: number): Date => new Date(T0.getTime() + s * 1000);

describe("session state machine (CONTRACTS section 3)", () => {
  it("declares exactly the ten contract states", () => {
    expect([...SESSION_STATES].sort()).toEqual(
      ["ACTIVATION_FAILED", "ACTIVE", "AVAILABLE", "CHECKOUT_PENDING", "CLEANING", "FINISHED", "PAUSED", "RECOVERY", "RESERVED", "STARTING"]);
  });

  it("allows the main chain AVAILABLE to AVAILABLE through every state", () => {
    const chain = ["AVAILABLE", "RESERVED", "STARTING", "ACTIVE", "PAUSED", "ACTIVE", "FINISHED", "CHECKOUT_PENDING", "CLEANING", "AVAILABLE"] as const;
    for (let i = 0; i + 1 < chain.length; i++) expect(canTransition(chain[i]!, chain[i + 1]!), `${chain[i]} -> ${chain[i + 1]}`).toBe(true);
  });

  it("allows the failure branches STARTING to ACTIVATION_FAILED to RECOVERY or AVAILABLE, and ACTIVE to RECOVERY", () => {
    expect(canTransition("STARTING", "ACTIVATION_FAILED")).toBe(true);
    expect(canTransition("ACTIVATION_FAILED", "RECOVERY")).toBe(true);
    expect(canTransition("ACTIVATION_FAILED", "AVAILABLE")).toBe(true);
    expect(canTransition("ACTIVE", "RECOVERY")).toBe(true);
    expect(canTransition("RECOVERY", "FINISHED")).toBe(true);
  });

  it("rejects every transition outside the table, including self transitions", () => {
    const bad: [string, string][] = [
      ["AVAILABLE", "ACTIVE"], ["AVAILABLE", "STARTING"], ["RESERVED", "ACTIVE"], ["STARTING", "PAUSED"], ["STARTING", "FINISHED"],
      ["ACTIVE", "STARTING"], ["ACTIVE", "AVAILABLE"], ["PAUSED", "STARTING"], ["FINISHED", "ACTIVE"], ["FINISHED", "PAUSED"],
      ["CHECKOUT_PENDING", "ACTIVE"], ["CLEANING", "ACTIVE"], ["ACTIVATION_FAILED", "ACTIVE"], ["ACTIVE", "ACTIVE"], ["AVAILABLE", "AVAILABLE"],
    ];
    for (const [a, b] of bad) expect(canTransition(a as never, b as never), `${a} -> ${b}`).toBe(false);
    expect(() => assertTransition("FINISHED", "ACTIVE")).toThrow(InvalidTransitionError);
  });
});

describe("billing clock", () => {
  const idle: BillingClock = { accruedSeconds: 0, runningSince: null };

  it("accrues only while running and stops on pause", () => {
    const c1 = startClock(idle, at(0));
    expect(clockElapsed(c1, at(100))).toBe(100);
    const c2 = pauseClock(c1, at(100));
    expect(clockElapsed(c2, at(5000))).toBe(100);
    const c3 = resumeClock(c2, at(5000));
    expect(clockElapsed(c3, at(5030))).toBe(130);
  });

  it("starting a running clock again does not reset it", () => {
    const c1 = startClock(idle, at(0));
    expect(clockElapsed(startClock(c1, at(50)), at(60))).toBe(60);
  });

  it("a wall clock that moves back never yields negative or extra time", () => {
    const c1 = startClock(idle, at(100));
    expect(clockElapsed(c1, at(40))).toBe(0);
    const c2 = pauseClock(c1, at(40));
    expect(c2.accruedSeconds).toBe(0);
    expect(c2.runningSince).toBeNull();
  });
});

describe("lease window (D07 fixture: 60 s renewal, 120 s horizon)", () => {
  it("fixture constants are the contract values", () => {
    expect(SESSION_TIMING).toMatchObject({ ackTimeoutSeconds: 10, renewSeconds: 60, horizonSeconds: 120 });
  });

  it("an OPEN lease never reaches past the 120 s horizon", () => {
    const w = leaseWindow({ mode: "OPEN", remainingSeconds: 0, now: at(0) });
    expect(w.notAfter.getTime()).toBe(at(120).getTime());
    expect(w.remainingSecondsAtIssue).toBe(0);
  });

  it("a FIXED lease ends at the remaining entitlement plus the ACK window, no more", () => {
    const w = leaseWindow({ mode: "FIXED", remainingSeconds: 1800, now: at(0) });
    expect(w.notAfter.getTime()).toBe(at(1810).getTime());
    expect(w.remainingSecondsAtIssue).toBe(1800);
  });

  it("renewal is due from 60 s after issue", () => {
    expect(renewalDue(at(0), at(59))).toBe(false);
    expect(renewalDue(at(0), at(60))).toBe(true);
  });
});

describe("verification levels", () => {
  it("API_OBSERVED, OPERATOR_ATTESTED, LAB_VERIFIED and labelled COMMANDED_ONLY may start billing; SIMULATED only when the fixture allows it", () => {
    for (const l of ["API_OBSERVED", "OPERATOR_ATTESTED", "LAB_VERIFIED", "COMMANDED_ONLY"] as const) expect(billingAllowed(l, false)).toBe(true);
    expect(billingAllowed("SIMULATED", false)).toBe(false);
    expect(billingAllowed("SIMULATED", true)).toBe(true);
  });

  it("COMMANDED_ONLY never proves a lock, so it cannot release a source seat", () => {
    expect(lockProven("COMMANDED_ONLY", true)).toBe(false);
    expect(lockProven("API_OBSERVED", false)).toBe(true);
    expect(lockProven("SIMULATED", false)).toBe(false);
    expect(lockProven("SIMULATED", true)).toBe(true);
  });
});

describe("tariffDelta quote (D26: downward only, minimum once)", () => {
  const rule = { ratePerHourIdr: 12_000n };

  it("same rate: delta zero and the total is unchanged", () => {
    const q = tariffDeltaQuote({ rule, elapsedSeconds: 1800, totalSeconds: 3600, targetRatePerHourIdr: 12_000n });
    expect(q).toMatchObject({ ok: true, deltaIdr: 0n, baseAmountIdr: 12_000n, newAmountIdr: 12_000n });
  });

  it("cheaper destination reprices only the remaining time and is deterministic", () => {
    const a = tariffDeltaQuote({ rule, elapsedSeconds: 1800, totalSeconds: 3600, targetRatePerHourIdr: 6_000n });
    const b = tariffDeltaQuote({ rule, elapsedSeconds: 1800, totalSeconds: 3600, targetRatePerHourIdr: 6_000n });
    expect(a).toEqual(b);
    expect(a).toMatchObject({ ok: true, deltaIdr: -3000n, baseAmountIdr: 12_000n, newAmountIdr: 9_000n });
  });

  it("the minimum is charged once across the transfer, not again for the destination", () => {
    const withMin = { ratePerHourIdr: 12_000n, minimum: { amountIdr: 5_000n, coveredSeconds: 1800n } };
    const q = tariffDeltaQuote({ rule: withMin, elapsedSeconds: 1800, totalSeconds: 3600, targetRatePerHourIdr: 6_000n });
    expect(q).toMatchObject({ ok: true, baseAmountIdr: 11_000n, newAmountIdr: 8_000n, deltaIdr: -3000n, minimumApplied: true });
  });

  it("a dearer destination is refused (zone passes downward only) and nothing is quoted", () => {
    const q = tariffDeltaQuote({ rule, elapsedSeconds: 600, totalSeconds: 3600, targetRatePerHourIdr: 15_000n });
    expect(q).toEqual({ ok: false, reason: "UPWARD_ZONE" });
  });

  it("an OPEN session has no remaining entitlement: delta zero, the new rate applies from the transfer on", () => {
    const q = tariffDeltaQuote({ rule, elapsedSeconds: 900, totalSeconds: null, targetRatePerHourIdr: 6_000n });
    expect(q).toMatchObject({ ok: true, deltaIdr: 0n, futureRatePerHourIdr: 6_000n });
  });

  it("elapsed beyond the entitlement leaves no remaining time to reprice", () => {
    const q = tariffDeltaQuote({ rule, elapsedSeconds: 5000, totalSeconds: 3600, targetRatePerHourIdr: 6_000n });
    expect(q).toMatchObject({ ok: true, deltaIdr: 0n });
  });
});
