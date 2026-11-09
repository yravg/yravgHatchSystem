// Contract: pure pricing core (packages/domain/src/pricing). Inputs: rule {ratePerHourIdr, minimum?}, segments of
// {seconds, paused, ratePerHourIdr?}. Output: integer IDR as bigint, rounded ONCE at the end (nearest rupiah, half up).
// EVERY money figure in this file is a SANDBOX FIXTURE (D01, D26): production money policy is not approved.
import { describe, expect, it } from "vitest";
import {
  billableSeconds, canActivate, canTransferZone, quoteSession, rational, roundHalfUp, type RateRule,
} from "@yravg/domain";

const MIN = 60n;
const H = 3600n;
const plain: RateRule = { ratePerHourIdr: 10_000n }; // sandbox fixture Rp10.000/hour
const withMinimum: RateRule = { ratePerHourIdr: 12_000n, minimum: { amountIdr: 5_000n, coveredSeconds: 30n * MIN } }; // sandbox fixture
const run = (s: bigint) => [{ seconds: s, paused: false }];

describe("exact rational pricing", () => {
  it("Rp10.000/hour for 61 s is 610000/3600 and rounds once to Rp169", () => {
    const q = quoteSession(plain, run(61n));
    expect(q.exact).toEqual({ numerator: 610_000n, denominator: 3_600n }); // not reduced to a rounded figure
    expect(q.amountIdr).toBe(169n);
  });

  it("rounds once at the end: many small segments do not add up rounding error", () => {
    const parts = Array.from({ length: 61 }, () => ({ seconds: 1n, paused: false }));
    expect(quoteSession(plain, parts).amountIdr).toBe(169n); // rounding each second would give 61 x 3 = 183
    expect(quoteSession(plain, parts).exact).toEqual(quoteSession(plain, run(61n)).exact);
  });

  it("half rupiah rounds up, below half rounds down", () => {
    expect(roundHalfUp(rational(1n, 2n))).toBe(1n);
    expect(roundHalfUp(rational(499n, 1000n))).toBe(0n);
    expect(roundHalfUp(rational(5n, 2n))).toBe(3n);
    expect(roundHalfUp(rational(0n, 7n))).toBe(0n);
  });

  it("rejects a zero denominator and negative inputs", () => {
    expect(() => rational(1n, 0n)).toThrow();
    expect(() => quoteSession(plain, [{ seconds: -1n, paused: false }])).toThrow();
    expect(() => quoteSession({ ratePerHourIdr: -1n }, run(1n))).toThrow();
  });

  it("stays exact above 2^53", () => {
    const big: RateRule = { ratePerHourIdr: 9_007_199_254_740_993n };
    expect(quoteSession(big, run(H)).amountIdr).toBe(9_007_199_254_740_993n);
  });
});

describe("minimum payment (sandbox fixture Rp5.000 covers 30 min, then Rp12.000/hour)", () => {
  it("20 min = 5.000, 30 min = 5.000, 40 min = 7.000", () => {
    expect(quoteSession(withMinimum, run(20n * MIN)).amountIdr).toBe(5_000n);
    expect(quoteSession(withMinimum, run(30n * MIN)).amountIdr).toBe(5_000n);
    expect(quoteSession(withMinimum, run(40n * MIN)).amountIdr).toBe(7_000n);
  });

  it("pause time is not billable and does not consume covered minutes", () => {
    const segs = [
      { seconds: 20n * MIN, paused: false },
      { seconds: 50n * MIN, paused: true },
      { seconds: 10n * MIN, paused: false },
    ];
    expect(billableSeconds(segs)).toBe(30n * MIN);
    expect(quoteSession(withMinimum, segs).amountIdr).toBe(5_000n); // still inside the 30 covered minutes
    expect(quoteSession(withMinimum, [...segs, { seconds: 10n * MIN, paused: false }]).amountIdr).toBe(7_000n);
  });

  it("the minimum applies once per session across reconnect, retry and zone transfer", () => {
    const reconnect = [{ seconds: 15n * MIN, paused: false }, { seconds: 15n * MIN, paused: false }, { seconds: 10n * MIN, paused: false }];
    expect(quoteSession(withMinimum, reconnect).amountIdr).toBe(7_000n); // one 5.000, not two
    expect(quoteSession(withMinimum, reconnect).amountIdr).toBe(quoteSession(withMinimum, reconnect).amountIdr); // retry is the same figure
    // transfer to a cheaper zone after 20 min: no new minimum, no retroactive repricing; later time uses the new rate
    const transfer = [{ seconds: 20n * MIN, paused: false }, { seconds: 20n * MIN, paused: false, ratePerHourIdr: 6_000n }];
    expect(quoteSession(withMinimum, transfer).amountIdr).toBe(5_000n + 1_000n); // 10 min beyond cover at 6.000/h
  });

  it("is disabled by default: no minimum, a 1 s session costs its exact share", () => {
    expect(quoteSession(plain, run(1n)).amountIdr).toBe(3n); // 10000/3600 = 2.78 -> 3
    expect(quoteSession(plain, run(0n)).amountIdr).toBe(0n);
  });

  it("a session with no billable time costs nothing even with a minimum enabled", () => {
    expect(quoteSession(withMinimum, [{ seconds: 600n, paused: true }]).amountIdr).toBe(0n);
  });

  it("a transfer may only go to an equal or lower rate (D26 downward only)", () => {
    expect(canTransferZone(12_000n, 6_000n)).toBe(true);
    expect(canTransferZone(12_000n, 12_000n)).toBe(true);
    expect(canTransferZone(6_000n, 12_000n)).toBe(false);
  });
});

describe("activation balance check", () => {
  it("insufficient balance cannot activate and reports the shortfall", () => {
    expect(canActivate(4_999n, 5_000n)).toEqual({ ok: false, reason: "INSUFFICIENT_BALANCE", shortfallIdr: 1n });
  });
  it("enough balance activates", () => {
    expect(canActivate(5_000n, 5_000n)).toEqual({ ok: true });
  });
  it("a negative balance or requirement is invalid, never activates", () => {
    expect(() => canActivate(-1n, 0n)).toThrow();
    expect(() => canActivate(0n, -1n)).toThrow();
  });
});
