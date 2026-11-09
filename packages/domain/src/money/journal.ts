// Contract: pure double-entry rules in integer IDR (bigint). A journal is a list of lines with exactly one positive
// side each; the sum of debits equals the sum of credits; nothing is ever edited, a correction is a swapped-side
// reversal. Accounts are a fixed whitelist with a normal side; the running balance of each stays non-negative.
// Sandbox fixture policy: the chart of accounts is a recommended fixture, not an approved accounting policy (D06/D17).
import { DomainError } from "../errors.ts";

export const ACCOUNTS = {
  cash: "debit",
  provider_clearing: "debit",
  sales_revenue: "credit",
  refund_payable: "credit",
} as const;
export type Account = keyof typeof ACCOUNTS;
export const isAccount = (v: unknown): v is Account => typeof v === "string" && Object.hasOwn(ACCOUNTS, v);

export interface JournalLine { account: string; debitIdr: bigint; creditIdr: bigint }

const bad = (field: string): never => { throw new DomainError("VALIDATION_FAILED", { field }); };

export function assertBalanced(lines: readonly JournalLine[]): void {
  if (lines.length < 2) bad("lines");
  let debit = 0n;
  let credit = 0n;
  for (const l of lines) {
    if (!isAccount(l.account)) bad("account");
    if (l.debitIdr < 0n || l.creditIdr < 0n) bad("amountIDR");
    if ((l.debitIdr > 0n) === (l.creditIdr > 0n)) bad("line"); // both sides or neither
    debit += l.debitIdr;
    credit += l.creditIdr;
  }
  if (debit !== credit) bad("balance");
}

/** The immutable correction: same accounts and amounts with the sides swapped. */
export const reverseLines = (lines: readonly JournalLine[]): JournalLine[] =>
  lines.map((l) => ({ account: l.account, debitIdr: l.creditIdr, creditIdr: l.debitIdr }));

/** Signed effect of a line on its account's balance, in the account's normal-side terms. */
export function balanceDelta(l: JournalLine): bigint {
  return isAccount(l.account) && ACCOUNTS[l.account] === "debit" ? l.debitIdr - l.creditIdr : l.creditIdr - l.debitIdr;
}

/** A payment settles at most what is still due on the quote or charge; the rest is excess (never revenue). */
export function allocatePayment(i: { amountDueIdr: bigint; allocatedIdr: bigint; paymentIdr: bigint }): { allocatedIdr: bigint; excessIdr: bigint } {
  if (i.amountDueIdr < 0n || i.allocatedIdr < 0n || i.paymentIdr < 0n || i.allocatedIdr > i.amountDueIdr) bad("allocation");
  const open = i.amountDueIdr - i.allocatedIdr;
  const allocatedIdr = i.paymentIdr < open ? i.paymentIdr : open;
  return { allocatedIdr, excessIdr: i.paymentIdr - allocatedIdr };
}
