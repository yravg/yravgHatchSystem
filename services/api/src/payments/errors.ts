// Payment-only failures that the T01 catalog does not name. Same envelope shape as DomainError (CONTRACTS section 1).
// ASSUMPTION: the code name is ours until protocol review freezes it.
const CATALOG = {
  PROVIDER_UNAVAILABLE: { status: 503, messageKey: "error.providerUnavailable", retryable: true },
} as const;

export type PaymentErrorCode = keyof typeof CATALOG;

export class PaymentError extends Error {
  readonly code: PaymentErrorCode;
  readonly status: number;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, string>>;
  constructor(code: PaymentErrorCode, details: Record<string, string> = {}) {
    super(code);
    this.code = code;
    this.status = CATALOG[code].status;
    this.messageKey = CATALOG[code].messageKey;
    this.retryable = CATALOG[code].retryable;
    this.details = details;
  }
}

/** Thrown by the provider client for network errors, timeouts, auth failures and 5xx. Carries no body, key or URL. */
export class ProviderError extends Error {
  readonly reason: "network" | "timeout" | "auth" | "http" | "shape";
  constructor(reason: "network" | "timeout" | "auth" | "http" | "shape") { super(`provider ${reason}`); this.name = "ProviderError"; this.reason = reason; }
}
