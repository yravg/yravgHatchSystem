// Contract: pure T53 core, no I/O, no clock of its own, integer bigint only (no floats in quantities or money).
//   consumptionFor  recipe lines x order quantity = exact base-unit consumption (two 100 ml drinks use 200 ml).
//   issueCost       D17 moving average (SANDBOX FIXTURE): cost = floor(value * qty / onHand); the remainder stays in stock
//                   value so nothing is lost; issuing the last unit takes all remaining value. History is never recalculated:
//                   the caller stores the cost it got on the move.
//   businessDay     D08 (SANDBOX FIXTURE): the outlet's local clock minus the cutoff (default 04:00), as YYYY-MM-DD.
//   drawerExpected  the cash drawer is opening float + cash sales - cash refunds paid out. QRIS never enters it.
import { DomainError } from "../errors.ts";

export interface RecipeLine { stockItemId: string; qtyBase: bigint }
export interface StockState { onHand: bigint; valueIdr: bigint }

const bad = (field: string): never => { throw new DomainError("VALIDATION_FAILED", { field }); };

export function consumptionFor(recipe: readonly RecipeLine[], orderQty: bigint): RecipeLine[] {
  if (orderQty <= 0n) bad("qty");
  return recipe.map((l) => {
    if (l.qtyBase <= 0n) bad("recipe");
    return { stockItemId: l.stockItemId, qtyBase: l.qtyBase * orderQty };
  });
}

/** Throws REVISION_CONFLICT (negative_stock) when more than on hand is issued: stock never goes negative. */
export function issueCost(state: StockState, qty: bigint): { costIdr: bigint; onHand: bigint; valueIdr: bigint } {
  if (qty <= 0n) bad("qty");
  if (qty > state.onHand) throw new DomainError("REVISION_CONFLICT", { reason: "negative_stock" });
  const costIdr = qty === state.onHand ? state.valueIdr : (state.valueIdr * qty) / state.onHand;
  return { costIdr, onHand: state.onHand - qty, valueIdr: state.valueIdr - costIdr };
}

export function receiveValue(state: StockState, qty: bigint, totalCostIdr: bigint): StockState {
  if (qty <= 0n) bad("qty");
  if (totalCostIdr < 0n) bad("totalCostIdr");
  return { onHand: state.onHand + qty, valueIdr: state.valueIdr + totalCostIdr };
}

export const BUSINESS_DAY_CUTOFF_MINUTES = 240; // D08 fixture: 04:00 local

export function businessDay(at: Date, timeZone: string, cutoffMinutes = BUSINESS_DAY_CUTOFF_MINUTES): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(at);
  const n = (t: string): number => Number(parts.find((p) => p.type === t)?.value);
  // Local wall clock as if it were UTC, minus the cutoff; only the calendar date of the result is read.
  const shifted = new Date(Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute"), n("second")) - cutoffMinutes * 60_000);
  return shifted.toISOString().slice(0, 10);
}

export const drawerExpected = (i: { openingFloatIdr: bigint; cashSalesIdr: bigint; cashRefundsPaidIdr: bigint }): bigint =>
  i.openingFloatIdr + i.cashSalesIdr - i.cashRefundsPaidIdr;
