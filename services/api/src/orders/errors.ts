// T53-only failures that the shared catalogs do not name. Same envelope shape as DomainError (CONTRACTS section 1).
// ASSUMPTION: the code names are ours until protocol review freezes them.
const CATALOG = {
  SHIFT_CLOSE_POLICY_MISSING: { status: 409, messageKey: "error.shift.closePolicyMissing", retryable: false },
  OPEN_SHIFTS_BLOCK: { status: 409, messageKey: "error.shift.openShiftsBlock", retryable: false },
  SHIFT_NOT_OPEN: { status: 409, messageKey: "error.shift.notOpen", retryable: false },
  DAY_CLOSED: { status: 409, messageKey: "error.shift.dayClosed", retryable: false },
  OFFLINE_NOT_ALLOWED: { status: 409, messageKey: "error.order.offlineNotAllowed", retryable: false },
  PAYMENTS_NOT_CONFIGURED: { status: 409, messageKey: "error.order.paymentsNotConfigured", retryable: false },
} as const;

export type OperationsErrorCode = keyof typeof CATALOG;

export class OperationsError extends Error {
  readonly code: OperationsErrorCode;
  readonly status: number;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, string>>;
  constructor(code: OperationsErrorCode, details: Record<string, string> = {}) {
    super(code);
    this.code = code;
    this.status = CATALOG[code].status;
    this.messageKey = CATALOG[code].messageKey;
    this.retryable = CATALOG[code].retryable;
    this.details = details;
  }
}
