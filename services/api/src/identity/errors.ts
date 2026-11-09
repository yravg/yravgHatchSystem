// Identity-only failures that the T01 domain catalog does not name (401, 429 and MFA states). Same envelope shape as
// DomainError (CONTRACTS section 1). ASSUMPTION: code names are ours until protocol review freezes them.
const CATALOG = {
  UNAUTHENTICATED: { status: 401, messageKey: "error.unauthenticated", retryable: false },
  MFA_REQUIRED: { status: 403, messageKey: "error.mfaRequired", retryable: false },
  STEP_UP_REQUIRED: { status: 403, messageKey: "error.stepUpRequired", retryable: false },
  MFA_INVALID: { status: 403, messageKey: "error.mfaInvalid", retryable: false },
  MFA_ALREADY_ENROLLED: { status: 409, messageKey: "error.mfaAlreadyEnrolled", retryable: false },
  RATE_LIMITED: { status: 429, messageKey: "error.rateLimited", retryable: true },
} as const;

export type IdentityErrorCode = keyof typeof CATALOG;

export class IdentityError extends Error {
  readonly code: IdentityErrorCode;
  readonly status: number;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, string>>;

  constructor(code: IdentityErrorCode, details: Record<string, string> = {}) {
    super(code);
    this.code = code;
    this.status = CATALOG[code].status;
    this.messageKey = CATALOG[code].messageKey;
    this.retryable = CATALOG[code].retryable;
    this.details = details;
  }
}
