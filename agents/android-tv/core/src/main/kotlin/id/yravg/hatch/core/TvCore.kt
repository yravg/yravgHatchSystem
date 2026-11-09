package id.yravg.hatch.core

import id.yravg.hatch.contracts.LeasePermission
import id.yravg.hatch.contracts.SessionLease
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import java.time.Instant

// Contract (HS-T51, CONTRACTS s5/s7, D04 D07 D09 D27 D28 D32):
//  * Play happens only while a verified lease is running on the MONOTONIC clock in the same boot. Nothing else grants play:
//    not an HTTP 200, not a pairing refresh, not the technician escape, not CEC, not a wall-clock change.
//  * A reboot drops the running lease (monotonic base is gone), clears time trust in the same save that records the new boot id,
//    and locks with REBOOT_RECOVERY until trusted time returns. Re-accepting the same lease is capped by the checkpoint.
//  * Lost/revoked overlay permission = capability failure: locked via the fallback route, repair required, never a grant.
//  * UNPROVISIONED_APP never claims kiosk security. Without CEC or console mains everything here still works.

enum class ProvisioningProfile { UNPROVISIONED_APP, PROVISIONED_UNPAIRED }
enum class TvState { UNPROVISIONED_APP, PROVISIONED_UNPAIRED, PAIRED, REVOKED, REPAIR_REQUIRED }
enum class SecurityClaim { NONE, MANAGED_KIOSK }
enum class Readiness { READY, NOT_READY_REPAIR, UNSUPPORTED }
enum class TvKey { HOME, BACK, INPUT, OTHER }
enum class KeyDisposition { CONSUMED_LOCKED, PASS_THROUGH }
enum class LockReason { NO_LEASE, EXPIRED, REBOOT_RECOVERY, PERMISSION_LOST, REVOKED, PAUSED, STOPPED, LOCK_COMMAND }
enum class RejectReason { UNKNOWN_SIGNER, BAD_SIGNATURE, STALE_EPOCH, EXPIRED, NOT_YET_VALID, TIME_UNTRUSTED, WRONG_DEVICE, NO_PERMISSION, STALE_REVISION, REVOKED }
enum class CecSetupStatus { NOT_RECORDED, CEC_NOT_OFF, BOTH_OFF }

sealed interface TimeResult { data object Ok : TimeResult; data object ClockRollback : TimeResult }
sealed interface LeaseResult {
    data class Accepted(val remainingSeconds: Long) : LeaseResult
    data class Rejected(val reason: RejectReason) : LeaseResult
}
sealed interface PairingOutcome {
    data object NoGrant : PairingOutcome
    data class Applied(val result: LeaseResult) : PairingOutcome
}

data class Decision(
    val locked: Boolean, val reason: LockReason?, val remainingSeconds: Long, val route: LockRoute,
    val readiness: Readiness, val securityClaim: SecurityClaim,
) { val consoleVisible: Boolean get() = !locked }

data class Capabilities(val lockRoute: LockRoute, val cecPower: PowerCapability, val requiresCec: Boolean, val requiresConsoleMains: Boolean)

@Serializable data class CecRecord(val tvCecOff: Boolean, val consoleCecOff: Boolean, val recordedBy: String, val recordedAtUtc: String)

@Serializable private data class Active(val leaseId: String, val sessionId: String, val revision: Long, val deadlineMono: Long, val checkpointRemainingMs: Long)
@Serializable private data class Dropped(val leaseId: String, val checkpointRemainingMs: Long)
@Serializable private data class Persisted(
    val bootId: String,
    val highestTrustedUtcMs: Long = 0,
    val anchorUtcMs: Long? = null,
    val anchorMono: Long? = null,
    val observedEpoch: Long = 0,
    val revoked: Boolean = false,
    val paired: Boolean = false,
    val active: Active? = null,
    val dropped: Dropped? = null,
    val lockReason: LockReason? = null,
    val highestRevision: Map<String, Long> = emptyMap(),
    val cec: CecRecord? = null,
)

class TvCore(
    private val profile: ProvisioningProfile,
    private val deviceId: String,
    private val clock: DeviceClock,
    private val store: StateStore,
    private val trust: Map<String, String>,
    private val permission: OverlayPermissionProbe,
    private val fallback: FallbackLockRoute,
    private val cec: CecPowerDriver = UnsupportedCecDriver,
    private val verifier: SignatureVerifier = JdkEd25519Verifier,
) {
    val pairing = PairingTracker(clock)
    private val json = Json { explicitNulls = false; ignoreUnknownKeys = true }
    private lateinit var st: Persisted

    /** Call at every process start. Needs no user action: this is the cold-boot recovery path. */
    fun boot() {
        val loaded = store.load(KEY)?.let { runCatching { json.decodeFromString<Persisted>(it) }.getOrNull() }
        val mono = clock.monotonicMs()
        st = when {
            loaded == null -> Persisted(bootId = clock.bootId())
            loaded.bootId != clock.bootId() -> loaded.afterReboot()
            loaded.anchorMono != null && mono < loaded.anchorMono -> loaded.afterReboot() // monotonic went backwards: unseen reboot
            else -> loaded
        }
        persist()
    }

    private fun Persisted.afterReboot() = copy(
        bootId = clock.bootId(), anchorUtcMs = null, anchorMono = null, active = null,
        dropped = active?.let { Dropped(it.leaseId, it.checkpointRemainingMs) } ?: dropped,
        lockReason = if (active != null || lockReason == LockReason.REBOOT_RECOVERY) LockReason.REBOOT_RECOVERY else lockReason,
    )

    private fun persist() = store.save(KEY, json.encodeToString(st))
    private fun trustedNowMs(): Long? = st.anchorUtcMs?.let { it + (clock.monotonicMs() - st.anchorMono!!) }

    /** Authoritative reconcile or other approved evidence. A time earlier than anything already trusted is refused. */
    fun establishTrustedTime(utc: Instant, source: String): TimeResult {
        val floor = maxOf(st.highestTrustedUtcMs, trustedNowMs() ?: 0)
        if (utc.toEpochMilli() < floor) return TimeResult.ClockRollback
        st = st.copy(anchorUtcMs = utc.toEpochMilli(), anchorMono = clock.monotonicMs(), highestTrustedUtcMs = utc.toEpochMilli())
        persist(); return TimeResult.Ok
    }

    fun applyLease(lease: SessionLease): LeaseResult {
        fun no(r: RejectReason) = LeaseResult.Rejected(r)
        if (st.revoked) return no(RejectReason.REVOKED)
        val nowMs = trustedNowMs() ?: return no(RejectReason.TIME_UNTRUSTED)
        if (lease.deviceId != deviceId) return no(RejectReason.WRONG_DEVICE)
        LeaseVerifier.verify(lease, trust, Instant.ofEpochMilli(nowMs), st.observedEpoch, verifier)?.let { return no(RejectReason.valueOf(it.name)) }
        if (LeasePermission.DISPLAY_GAME !in lease.permissions) return no(RejectReason.NO_PERMISSION)
        val mono = clock.monotonicMs()
        st.active?.takeIf { it.leaseId == lease.leaseId }?.let { return LeaseResult.Accepted(remainingSeconds(it, mono)) } // duplicate delivery
        val resumeAfterReboot = st.dropped?.leaseId == lease.leaseId
        if (!resumeAfterReboot && lease.revision <= (st.highestRevision[lease.sessionId] ?: Long.MIN_VALUE)) return no(RejectReason.STALE_REVISION)
        val window = Instant.parse(lease.notAfter).toEpochMilli() - nowMs
        val paidLeft = lease.remainingSecondsAtIssue * 1000 - (nowMs - Instant.parse(lease.issuedAt).toEpochMilli())
        var remaining = minOf(window, paidLeft)
        if (resumeAfterReboot) remaining = minOf(remaining, st.dropped!!.checkpointRemainingMs)
        if (remaining <= 0) return no(RejectReason.EXPIRED)
        st = st.copy(
            active = Active(lease.leaseId, lease.sessionId, lease.revision, mono + remaining, remaining), dropped = null, lockReason = null,
            paired = true, observedEpoch = maxOf(st.observedEpoch, lease.authorityEpoch),
            highestRevision = st.highestRevision + (lease.sessionId to maxOf(lease.revision, st.highestRevision[lease.sessionId] ?: Long.MIN_VALUE)),
        )
        persist() // persist before acknowledging
        return LeaseResult.Accepted((remaining + 999) / 1000)
    }

    /** HTTP success never grants play. Only a lease inside the body that passes applyLease can. */
    fun onPairingHttp(status: Int, body: String): PairingOutcome {
        if (status !in 200..299) return PairingOutcome.NoGrant
        val obj = runCatching { json.parseToJsonElement(body) as? JsonObject }.getOrNull() ?: return PairingOutcome.NoGrant
        val leaseEl = obj["lease"]?.takeIf { it is JsonObject } ?: return PairingOutcome.NoGrant
        val lease = runCatching { json.decodeFromJsonElement(SessionLease.serializer(), leaseEl) }.getOrNull() ?: return PairingOutcome.NoGrant
        return PairingOutcome.Applied(applyLease(lease))
    }

    /** PAUSE / END / LOCK commands: drop the running lease at once. A later higher-revision lease resumes. */
    fun lock(reason: LockReason) { st = st.copy(active = null, dropped = null, lockReason = reason); persist() }
    fun revoke() { st = st.copy(revoked = true, active = null, dropped = null, lockReason = LockReason.REVOKED); persist() }

    /** Record what is left so a reboot can never hand back more than this. Call periodically while playing. */
    fun checkpoint() {
        val a = st.active ?: return
        val left = (a.deadlineMono - clock.monotonicMs()).coerceAtLeast(0)
        st = st.copy(active = a.copy(checkpointRemainingMs = left), highestTrustedUtcMs = maxOf(st.highestTrustedUtcMs, trustedNowMs() ?: 0))
        persist()
    }

    private fun remainingSeconds(a: Active, mono: Long) = ((a.deadlineMono - mono).coerceAtLeast(0) + 999) / 1000

    private fun permissionOk() = permission.state() == PermissionState.GRANTED
    private fun route() = when {
        permissionOk() -> LockRoute.NATIVE_OVERLAY
        fallback.available() -> fallback.route
        else -> LockRoute.NONE
    }

    fun decide(): Decision {
        val claim = if (profile == ProvisioningProfile.PROVISIONED_UNPAIRED) SecurityClaim.MANAGED_KIOSK else SecurityClaim.NONE
        val readiness = readiness()
        fun locked(r: LockReason) = Decision(true, r, 0, route(), readiness, claim)
        if (st.revoked) return locked(LockReason.REVOKED)
        if (!permissionOk()) return locked(LockReason.PERMISSION_LOST)
        val a = st.active ?: return locked(st.lockReason ?: LockReason.NO_LEASE)
        val mono = clock.monotonicMs()
        return if (mono >= a.deadlineMono) locked(LockReason.EXPIRED)
        else Decision(false, null, remainingSeconds(a, mono), route(), readiness, claim)
    }

    fun handleKey(key: TvKey): KeyDisposition =
        if (profile == ProvisioningProfile.PROVISIONED_UNPAIRED && decide().locked) KeyDisposition.CONSUMED_LOCKED else KeyDisposition.PASS_THROUGH

    fun readiness(): Readiness = when {
        profile == ProvisioningProfile.UNPROVISIONED_APP -> Readiness.UNSUPPORTED
        st.revoked -> Readiness.NOT_READY_REPAIR
        !permissionOk() -> if (fallback.available()) Readiness.NOT_READY_REPAIR else Readiness.UNSUPPORTED
        else -> Readiness.READY
    }

    fun tvState(): TvState = when {
        profile == ProvisioningProfile.UNPROVISIONED_APP -> TvState.UNPROVISIONED_APP
        st.revoked -> TvState.REVOKED
        !permissionOk() -> TvState.REPAIR_REQUIRED
        st.paired -> TvState.PAIRED
        else -> TvState.PROVISIONED_UNPAIRED
    }

    fun capabilities() = Capabilities(route(), cec.capability(), requiresCec = false, requiresConsoleMains = false)

    fun recordCecSetup(tvCecOff: Boolean, consoleCecOff: Boolean, recordedBy: String) {
        st = st.copy(cec = CecRecord(tvCecOff, consoleCecOff, recordedBy, clock.wallUtc().toString())); persist()
    }
    fun cecRecord(): CecRecord? = st.cec
    fun cecSetupStatus() = when {
        st.cec == null -> CecSetupStatus.NOT_RECORDED
        st.cec!!.tvCecOff && st.cec!!.consoleCecOff -> CecSetupStatus.BOTH_OFF
        else -> CecSetupStatus.CEC_NOT_OFF
    }

    /** Software precondition only. Real certification also needs the physical results in tests/hardware/android-tv. */
    fun certificationAllowed() =
        profile == ProvisioningProfile.PROVISIONED_UNPAIRED && !st.revoked && permissionOk() && cecSetupStatus() == CecSetupStatus.BOTH_OFF

    companion object { const val KEY = "tvcore" }
}
