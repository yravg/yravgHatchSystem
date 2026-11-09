package id.yravg.hatch.core

import id.yravg.hatch.contracts.Canonical
import id.yravg.hatch.contracts.LeaseMode
import id.yravg.hatch.contracts.LeasePermission
import id.yravg.hatch.contracts.SessionLease
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.encodeToJsonElement
import java.security.KeyPairGenerator
import java.security.PrivateKey
import java.security.Signature
import java.time.Instant
import java.util.Base64

/** Test double: monotonic ms + boot id + wall clock, all controllable. A reboot resets monotonic and changes the boot id. */
class FakeClock(var boot: String = "boot-1", var mono: Long = 1_000_000, var wall: Instant = TestKit.T0) : DeviceClock {
    private var boots = 1
    override fun bootId() = boot
    override fun monotonicMs() = mono
    override fun wallUtc() = wall
    fun advanceSeconds(s: Long) { mono += s * 1000; wall = wall.plusSeconds(s) }
    fun reboot(wallAfter: Instant) { boots++; boot = "boot-$boots"; mono = 4_000; wall = wallAfter }
}

class MemoryStore : StateStore {
    val data = HashMap<String, String>()
    override fun load(key: String) = data[key]
    override fun save(key: String, value: String) { data[key] = value }
}

class FakeProbe(var state: PermissionState = PermissionState.GRANTED) : OverlayPermissionProbe {
    override fun state() = state
}

class FakeFallback(override val route: LockRoute = LockRoute.HDMI_FALLBACK, var up: Boolean = true) : FallbackLockRoute {
    override fun available() = up
}

/** A CEC driver that fails the test if the lock path ever touches it. */
class ExplodingCecDriver : CecPowerDriver {
    override fun capability(): PowerCapability = error("lock path must not consult CEC")
    override fun powerOff(): Boolean = error("lock path must not call CEC")
}

object TestKit {
    val T0: Instant = Instant.parse("2026-11-09T10:00:00Z")
    const val DEVICE = "44444444-4444-4444-8444-444444444444"
    const val KEY_ID = "edge-key-test"
    private val json = Json { explicitNulls = false }
    private val b64 = Base64.getUrlEncoder().withoutPadding()

    class Signer {
        private val kp = KeyPairGenerator.getInstance("Ed25519").generateKeyPair()
        val priv: PrivateKey = kp.private
        val rawPublic: String = b64.encodeToString(kp.public.encoded.takeLast(32).toByteArray())
        fun sign(l: SessionLease): SessionLease {
            val s = Signature.getInstance("Ed25519"); s.initSign(priv)
            s.update(payload(l).toByteArray()); return l.copy(signature = b64.encodeToString(s.sign()))
        }
    }

    fun payload(l: SessionLease): String {
        val obj = json.encodeToJsonElement(l) as JsonObject
        return Canonical.of(JsonObject(obj.filterKeys { it != "signature" }))
    }

    fun lease(
        issuedAt: Instant = T0, seconds: Long = 1800, revision: Long = 1, epoch: Long = 1,
        leaseId: String = "aaaaaaaa-aaaa-4aaa-8aaa-%012d".format(revision), session: String = "55555555-5555-4555-8555-555555555555",
        device: String = DEVICE, notAfter: Instant = issuedAt.plusSeconds(seconds),
        perms: List<LeasePermission> = listOf(LeasePermission.DISPLAY_GAME),
    ) = SessionLease(
        protocolVersion = 1, leaseId = leaseId, tenantId = "11111111-1111-4111-8111-111111111111",
        outletId = "22222222-2222-4222-8222-222222222222", stationId = "33333333-3333-4333-8333-333333333333",
        deviceId = device, sessionId = session, authorityEpoch = epoch, revision = revision, mode = LeaseMode.FIXED,
        remainingSecondsAtIssue = seconds, issuedAt = issuedAt.toString(), notAfter = notAfter.toString(),
        permissions = perms, keyId = KEY_ID, signature = "",
    )

    fun core(
        clock: FakeClock = FakeClock(), store: StateStore = MemoryStore(), signer: Signer = Signer(),
        profile: ProvisioningProfile = ProvisioningProfile.PROVISIONED_UNPAIRED,
        probe: OverlayPermissionProbe = FakeProbe(), fallback: FallbackLockRoute = FakeFallback(),
        cec: CecPowerDriver = UnsupportedCecDriver,
    ): TvCore = TvCore(profile, DEVICE, clock, store, mapOf(KEY_ID to signer.rawPublic), probe, fallback, cec).also { it.boot() }
}
