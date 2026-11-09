// Contract: pure double-entry rules in integer IDR (bigint). Every figure is a SANDBOX FIXTURE.
import { DomainError, allocatePayment, assertBalanced, reverseLines, type JournalLine } from "@yravg/domain";
import { describe, expect, it } from "vitest";

const L = (account: string, d: bigint, c: bigint): JournalLine => ({ account, debitIdr: d, creditIdr: c });

describe("journal rules", () => {
  it("an unbalanced journal is refused", () => {
    expect(() => assertBalanced([L("cash", 100n, 0n), L("sales_revenue", 0n, 99n)])).toThrow(DomainError);
    expect(() => assertBalanced([L("cash", 100n, 0n)])).toThrow(DomainError);
    expect(() => assertBalanced([])).toThrow(DomainError);
    expect(() => assertBalanced([L("cash", 100n, 0n), L("sales_revenue", 0n, 100n)])).not.toThrow();
  });

  it("a line must carry exactly one positive side and never a negative amount", () => {
    expect(() => assertBalanced([L("cash", 100n, 100n), L("sales_revenue", 0n, 0n)])).toThrow(DomainError);
    expect(() => assertBalanced([L("cash", 0n, 0n), L("sales_revenue", 0n, 0n)])).toThrow(DomainError);
    expect(() => assertBalanced([L("cash", -5n, 0n), L("sales_revenue", 0n, -5n)])).toThrow(DomainError);
    expect(() => assertBalanced([L("nope", 5n, 0n), L("sales_revenue", 0n, 5n)])).toThrow(DomainError);
  });

  it("reverseLines swaps the sides and the result is still balanced", () => {
    const orig = [L("cash", 700n, 0n), L("sales_revenue", 0n, 700n)];
    const rev = reverseLines(orig);
    expect(rev).toEqual([L("cash", 0n, 700n), L("sales_revenue", 700n, 0n)]);
    expect(() => assertBalanced(rev)).not.toThrow();
    expect(orig[0]).toEqual(L("cash", 700n, 0n)); // input untouched
  });

  it("allocation never exceeds what is still due", () => {
    expect(allocatePayment({ amountDueIdr: 10_000n, allocatedIdr: 0n, paymentIdr: 10_000n })).toEqual({ allocatedIdr: 10_000n, excessIdr: 0n });
    expect(allocatePayment({ amountDueIdr: 10_000n, allocatedIdr: 4_000n, paymentIdr: 10_000n })).toEqual({ allocatedIdr: 6_000n, excessIdr: 4_000n });
    expect(allocatePayment({ amountDueIdr: 10_000n, allocatedIdr: 10_000n, paymentIdr: 500n })).toEqual({ allocatedIdr: 0n, excessIdr: 500n });
    expect(() => allocatePayment({ amountDueIdr: 10_000n, allocatedIdr: 11_000n, paymentIdr: 1n })).toThrow(DomainError);
  });

  it("stays exact above 2^53", () => {
    const big = 9_007_199_254_740_993n;
    expect(() => assertBalanced([L("cash", big, 0n), L("sales_revenue", 0n, big)])).not.toThrow();
    expect(() => assertBalanced([L("cash", big, 0n), L("sales_revenue", 0n, big - 1n)])).toThrow(DomainError);
  });
});
