// GENERATED from packages/contracts/schema/protocol.schema.json by `pnpm gen:contracts`. Do not edit.

export type Uuid = string;
export type UtcTimestamp = string;
export type Money = string;
export interface PaymentAmount {
  amountIDR: Money;
  currency: Currency;
}
export type Currency = "IDR";
export interface ErrorBody {
  code: string;
  messageKey: string;
  retryable: boolean;
  details: Record<string, string>;
}
export interface ErrorEnvelope {
  error: ErrorBody;
  requestId: string;
}
export type LeaseMode = "FIXED" | "OPEN";
export type LeasePermission = "DISPLAY_GAME";
export interface SessionLease {
  protocolVersion: number;
  leaseId: Uuid;
  tenantId: Uuid;
  outletId: Uuid;
  stationId: Uuid;
  deviceId: Uuid;
  sessionId: Uuid;
  authorityEpoch: number;
  revision: number;
  mode: LeaseMode;
  remainingSecondsAtIssue: number;
  issuedAt: UtcTimestamp;
  notAfter: UtcTimestamp;
  permissions: LeasePermission[];
  keyId: string;
  signature: string;
}
export type CommandAction = "PREPARE" | "START" | "PAUSE" | "RESUME" | "EXTEND" | "END" | "LOCK" | "SAFE_CONTROL";
export interface SessionCommand {
  protocolVersion: number;
  commandId: Uuid;
  stationId: Uuid;
  deviceId: Uuid;
  authorityEpoch: number;
  sequence: number;
  expectedRevision: number;
  desiredRevision: number;
  action: CommandAction;
  lease?: SessionLease;
  issuedAt: UtcTimestamp;
  expiresAt: UtcTimestamp;
  actorRef: string;
}
export type AckStatus = "RECEIVED" | "APPLIED" | "FAILED";
export type VerificationLevel = "SIMULATED" | "COMMANDED_ONLY" | "API_OBSERVED" | "OPERATOR_ATTESTED" | "LAB_VERIFIED";
export interface DeviceAck {
  protocolVersion: number;
  commandId: Uuid;
  deviceId: Uuid;
  authorityEpoch: number;
  sequence: number;
  desiredRevision: number;
  status: AckStatus;
  verificationLevel: VerificationLevel;
  observedInput?: string;
  bootId: Uuid;
  observedAt: UtcTimestamp;
  errorCode?: string;
}
