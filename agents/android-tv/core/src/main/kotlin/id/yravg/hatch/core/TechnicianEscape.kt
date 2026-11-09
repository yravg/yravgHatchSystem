package id.yravg.hatch.core

import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

// Contract: the ONLY way out of the managed locked setup screen. It opens setup, never the console picture.
// Credential is local, stored as a salted PBKDF2 hash (D09 style: no universal PIN, no plaintext). Every enrol, grant and
// denial is audited with actor/reason and never contains the credential. 5 wrong attempts per minute lock the escape out.

enum class EscapeResult { NOT_ENROLLED, DENIED, LOCKED_OUT, GRANTED_SETUP_ONLY }

@Serializable data class AuditEntry(val type: String, val actor: String, val reason: String, val atUtc: String, val bootId: String)

@Serializable private data class TechState(val salt: String? = null, val hash: String? = null, val audit: List<AuditEntry> = emptyList())

class TechnicianEscape(private val store: StateStore, private val clock: DeviceClock) {
    private val json = Json
    private var st: TechState = store.load(KEY)?.let { json.decodeFromString<TechState>(it) } ?: TechState()
    private val failures = ArrayDeque<Long>()
    private var setupUntilMono: Long? = null
    private var setupBoot: String? = null

    fun enrol(credential: String, actor: String) {
        require(credential.length >= 8) { "technician credential too short" }
        val salt = ByteArray(16).also { SecureRandom().nextBytes(it) }
        val enc = Base64.getEncoder()
        st = st.copy(salt = enc.encodeToString(salt), hash = enc.encodeToString(derive(credential, salt)))
        record("escape.enrolled", actor, "credential enrolled")
    }

    fun attempt(credential: String, reason: String): EscapeResult {
        val salt = st.salt ?: return EscapeResult.NOT_ENROLLED
        val now = clock.monotonicMs()
        while (failures.isNotEmpty() && now - failures.first() >= 60_000) failures.removeFirst()
        if (failures.size >= 5) { record("escape.lockedout", "technician", reason); return EscapeResult.LOCKED_OUT }
        val ok = MessageDigest.isEqual(derive(credential, Base64.getDecoder().decode(salt)), Base64.getDecoder().decode(st.hash))
        if (!ok) { failures.addLast(now); record("escape.denied", "technician", reason); return EscapeResult.DENIED }
        failures.clear()
        setupUntilMono = now + SETUP_WINDOW_MS; setupBoot = clock.bootId()
        record("escape.granted", "technician", reason)
        return EscapeResult.GRANTED_SETUP_ONLY
    }

    fun setupOpen(): Boolean = setupBoot == clock.bootId() && (setupUntilMono?.let { clock.monotonicMs() < it } ?: false)
    fun audit(): List<AuditEntry> = st.audit

    private fun record(type: String, actor: String, reason: String) {
        st = st.copy(audit = st.audit + AuditEntry(type, actor, reason, clock.wallUtc().toString(), clock.bootId()))
        store.save(KEY, json.encodeToString(st))
    }

    private fun derive(credential: String, salt: ByteArray): ByteArray =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(PBEKeySpec(credential.toCharArray(), salt, 120_000, 256)).encoded

    companion object { const val KEY = "technician"; const val SETUP_WINDOW_MS = 300_000L }
}
