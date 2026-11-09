// Contract: T53 pure order/stock/shift core (packages/domain/src/order). SANDBOX FIXTURES: D08 (Asia/Jakarta, cut 04:00),
// D17 (moving average). No I/O, integer bigint only.
import { describe, expect, it } from "vitest";
import { businessDay, consumptionFor, drawerExpected, issueCost, receiveValue } from "@yravg/domain";

describe("T53 pure core", () => {
  it("consumption scales recipe quantities by order quantity exactly", () => {
    const lines = consumptionFor([{ stockItemId: "milk", qtyBase: 100n }, { stockItemId: "ice", qtyBase: 30n }], 2n);
    expect(lines).toEqual([{ stockItemId: "milk", qtyBase: 200n }, { stockItemId: "ice", qtyBase: 60n }]);
    expect(() => consumptionFor([{ stockItemId: "milk", qtyBase: 100n }], 0n)).toThrow();
  });

  it("moving average issues cost proportionally and keeps the remainder in stock value", () => {
    // 1000 ml worth Rp5.000 -> 100 ml costs Rp500; 3 ml of 7 ml worth Rp10 costs floor(10*3/7)=4, remainder stays
    expect(issueCost({ onHand: 1000n, valueIdr: 5000n }, 100n)).toEqual({ costIdr: 500n, onHand: 900n, valueIdr: 4500n });
    expect(issueCost({ onHand: 7n, valueIdr: 10n }, 3n)).toEqual({ costIdr: 4n, onHand: 4n, valueIdr: 6n });
    expect(issueCost({ onHand: 7n, valueIdr: 10n }, 7n)).toEqual({ costIdr: 10n, onHand: 0n, valueIdr: 0n }); // last unit takes the rest
  });

  it("issuing more than on hand is refused and receipts add value", () => {
    expect(() => issueCost({ onHand: 50n, valueIdr: 100n }, 51n)).toThrow();
    expect(receiveValue({ onHand: 1000n, valueIdr: 5000n }, 1000n, 3000n)).toEqual({ onHand: 2000n, valueIdr: 8000n });
  });

  it("business day cuts at 04:00 Asia/Jakarta and survives UTC storage", () => {
    expect(businessDay(new Date("2026-11-09T03:00:00Z"), "Asia/Jakarta")).toBe("2026-11-09"); // 10:00 local
    expect(businessDay(new Date("2026-11-09T20:59:59Z"), "Asia/Jakarta")).toBe("2026-11-09"); // 03:59:59 on the 10th local, still the 9th
    expect(businessDay(new Date("2026-11-09T21:00:00Z"), "Asia/Jakarta")).toBe("2026-11-10"); // 04:00 local
    expect(businessDay(new Date("2026-11-09T21:00:00Z"), "Asia/Makassar")).toBe("2026-11-10"); // 05:00 local
    expect(businessDay(new Date("2026-11-09T19:30:00Z"), "Asia/Makassar")).toBe("2026-11-09"); // 03:30 local on the 10th
  });

  it("cash drawer expectation ignores QRIS entirely", () => {
    expect(drawerExpected({ openingFloatIdr: 100000n, cashSalesIdr: 40000n, cashRefundsPaidIdr: 5000n })).toBe(135000n);
  });
});
