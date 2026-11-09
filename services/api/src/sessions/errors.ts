// Session-only failures that the shared catalogs do not name (CONTRACTS section 4: STATION_BUSY, QUOTE_STALE,
// PAYMENT_UNCONFIRMED; section 2/9: INSUFFICIENT_BALANCE; section 4: INVALID_TRANSITION). Same envelope shape as DomainError.
// ASSUMPTION: DEVICE_UNAVAILABLE and TRANSFER_REFUSED are our names until protocol review freezes them.
const CATALOG = {
  STATION_BUSY: { status: 409, messageKey: "error.session.stationBusy", retryable: false },
  QUOTE_STALE: { status: 409, messageKey: "error.session.quoteStale", retryable: false },
  PAYMENT_UNCONFIRMED: { status: 409, messageKey: "error.session.paymentUnconfirmed", retryable: true },
  INSUFFICIENT_BALANCE: { status: 409, messageKey: "error.session.insufficientBalance", retryable: false },
  INVALID_TRANSITION: { status: 409, messageKey: "error.session.invalidTransition", retryable: false },
  DEVICE_UNAVAILABLE: { status: 409, messageKey: "error.session.deviceUnavailable", retryable: true },
  TRANSFER_REFUSED: { status: 409, messageKey: "error.session.transferRefused", retryable: false },
} as const;

export type SessionErrorCode = keyof typeof CATALOG;

export class SessionError extends Error {
  readonly code: SessionErrorCode;
  readonly status: number;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, string>>;

  constructor(code: SessionErrorCode, details: Record<string, string> = {}) {
    super(code);
    this.code = code;
    this.status = CATALOG[code].status;
    this.messageKey = CATALOG[code].messageKey;
    this.retryable = CATALOG[code].retryable;
    this.details = details;
  }
}
