import { DomainError } from "./errors.ts";

// Money is integer rupiah. JSON carries it as a decimal string so JavaScript never rounds it.
const DECIMAL = /^(0|[1-9][0-9]*)$/;

export function parseIdr(value: unknown): bigint {
  if (typeof value !== "string" || !DECIMAL.test(value)) {
    throw new DomainError("VALIDATION_FAILED", { field: "amountIDR" });
  }
  return BigInt(value);
}

export function idrToJson(amount: bigint): string {
  if (amount < 0n) throw new DomainError("VALIDATION_FAILED", { field: "amountIDR" });
  return amount.toString();
}
