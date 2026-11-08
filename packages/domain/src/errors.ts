import type { ErrorEnvelope } from "@yravg/contracts";

// CONTRACTS section 1 fixes AUTH_FORBIDDEN (403), cross-tenant 404 and IDEMPOTENCY_CONFLICT (409).
// ASSUMPTION: VALIDATION_FAILED (400) and REVISION_CONFLICT (409) are our names for the "validation envelope"
// and "stale version" cases, which CONTRACTS does not name. Owner/protocol review may rename before freeze.
const CATALOG = {
  AUTH_FORBIDDEN: { status: 403, messageKey: "error.authForbidden", retryable: false },
  NOT_FOUND: { status: 404, messageKey: "error.notFound", retryable: false },
  VALIDATION_FAILED: { status: 400, messageKey: "error.validationFailed", retryable: false },
  REVISION_CONFLICT: { status: 409, messageKey: "error.revisionConflict", retryable: false },
  IDEMPOTENCY_CONFLICT: { status: 409, messageKey: "error.idempotencyConflict", retryable: false },
  INTERNAL_ERROR: { status: 500, messageKey: "error.internal", retryable: true },
} as const;

export type ErrorCode = keyof typeof CATALOG;

// Details must never carry PII, stack traces, tokens or keys (CONTRACTS section 1).
const FORBIDDEN_DETAIL_KEY = /token|secret|password|key|stack|authorization|cookie/i;

export class DomainError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly messageKey: string;
  readonly retryable: boolean;
  readonly details: Readonly<Record<string, string>>;

  constructor(code: ErrorCode, details: Record<string, string> = {}) {
    super(code);
    for (const k of Object.keys(details)) {
      if (FORBIDDEN_DETAIL_KEY.test(k)) throw new Error(`details key "${k}" is not allowed in an error envelope`);
    }
    this.code = code;
    this.status = CATALOG[code].status;
    this.messageKey = CATALOG[code].messageKey;
    this.retryable = CATALOG[code].retryable;
    this.details = details;
  }
}

export const failure = (err: DomainError, requestId: string): ErrorEnvelope => ({
  error: { code: err.code, messageKey: err.messageKey, retryable: err.retryable, details: { ...err.details } },
  requestId,
});

// shortcut: SuccessEnvelope is generic over data, which the protocol schema subset cannot express; hand-typed here.
export interface SuccessEnvelope<T> {
  data: T;
  revision: number;
  requestId: string;
  serverTime: string;
}

export const success = <T>(
  data: T,
  meta: { revision: number; requestId: string; serverTime: Date },
): SuccessEnvelope<T> => ({
  data,
  revision: meta.revision,
  requestId: meta.requestId,
  serverTime: meta.serverTime.toISOString().replace(/\.\d{3}Z$/, "Z"),
});
