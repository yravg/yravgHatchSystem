// GENERATED from packages/contracts/schema/protocol.schema.json by `pnpm gen:contracts`. Do not edit.
package id.yravg.hatch.contracts

import kotlinx.serialization.Serializable

typealias Uuid = String

typealias UtcTimestamp = String

typealias Money = String

@Serializable
data class PaymentAmount(
    val amountIDR: Money,
    val currency: Currency
)

@Serializable
enum class Currency { IDR }

@Serializable
data class ErrorBody(
    val code: String,
    val messageKey: String,
    val retryable: Boolean,
    val details: Map<String, String>
)

@Serializable
data class ErrorEnvelope(
    val error: ErrorBody,
    val requestId: String
)

@Serializable
enum class LeaseMode { FIXED, OPEN }

@Serializable
enum class LeasePermission { DISPLAY_GAME }

@Serializable
data class SessionLease(
    val protocolVersion: Long,
    val leaseId: Uuid,
    val tenantId: Uuid,
    val outletId: Uuid,
    val stationId: Uuid,
    val deviceId: Uuid,
    val sessionId: Uuid,
    val authorityEpoch: Long,
    val revision: Long,
    val mode: LeaseMode,
    val remainingSecondsAtIssue: Long,
    val issuedAt: UtcTimestamp,
    val notAfter: UtcTimestamp,
    val permissions: List<LeasePermission>,
    val keyId: String,
    val signature: String
)

@Serializable
enum class CommandAction { PREPARE, START, PAUSE, RESUME, EXTEND, END, LOCK, SAFE_CONTROL }

@Serializable
data class SessionCommand(
    val protocolVersion: Long,
    val commandId: Uuid,
    val stationId: Uuid,
    val deviceId: Uuid,
    val authorityEpoch: Long,
    val sequence: Long,
    val expectedRevision: Long,
    val desiredRevision: Long,
    val action: CommandAction,
    val lease: SessionLease? = null,
    val issuedAt: UtcTimestamp,
    val expiresAt: UtcTimestamp,
    val actorRef: String
)

@Serializable
enum class AckStatus { RECEIVED, APPLIED, FAILED }

@Serializable
enum class VerificationLevel { SIMULATED, COMMANDED_ONLY, API_OBSERVED, OPERATOR_ATTESTED, LAB_VERIFIED }

@Serializable
data class DeviceAck(
    val protocolVersion: Long,
    val commandId: Uuid,
    val deviceId: Uuid,
    val authorityEpoch: Long,
    val sequence: Long,
    val desiredRevision: Long,
    val status: AckStatus,
    val verificationLevel: VerificationLevel,
    val observedInput: String? = null,
    val bootId: Uuid,
    val observedAt: UtcTimestamp,
    val errorCode: String? = null
)
