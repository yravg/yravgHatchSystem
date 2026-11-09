package id.yravg.hatch.core

import id.yravg.hatch.contracts.Canonical
import id.yravg.hatch.contracts.SessionLease
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.encodeToJsonElement
import java.security.KeyFactory
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import java.time.Instant
import java.util.Base64

// Contract: Ed25519 SessionLease verification, same rules as packages/contracts/leases (T50) and the .NET edge.
// Signed payload = RFC 8785 canonical JSON of the lease without `signature`; signature is detached base64url.
// Trust bundle pins keyId -> raw 32-byte public key; the keyId inside a payload alone is never trusted.

enum class LeaseRejection { UNKNOWN_SIGNER, BAD_SIGNATURE, STALE_EPOCH, EXPIRED, NOT_YET_VALID }

interface SignatureVerifier { fun verify(rawPublicKeyB64u: String, message: ByteArray, sigB64u: String): Boolean }

/** JDK 15+ Ed25519. On Android below API 33 inject a provider-backed verifier (see results.md). */
object JdkEd25519Verifier : SignatureVerifier {
    private val spkiPrefix = byteArrayOf(0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00)
    override fun verify(rawPublicKeyB64u: String, message: ByteArray, sigB64u: String): Boolean = try {
        val raw = Base64.getUrlDecoder().decode(rawPublicKeyB64u)
        require(raw.size == 32)
        val sig = Base64.getUrlDecoder().decode(sigB64u)
        val pub = KeyFactory.getInstance("Ed25519").generatePublic(X509EncodedKeySpec(spkiPrefix + raw))
        Signature.getInstance("Ed25519").run { initVerify(pub); update(message); verify(sig) }
    } catch (_: Exception) { false }
}

object LeaseVerifier {
    private val json = Json { explicitNulls = false }

    fun payload(lease: SessionLease): String {
        val obj = json.encodeToJsonElement(lease) as JsonObject
        return Canonical.of(JsonObject(obj.filterKeys { it != "signature" }))
    }

    /** Null when acceptable, otherwise the reason. Never throws on malformed signatures. */
    fun verify(
        lease: SessionLease, trust: Map<String, String>, now: Instant, currentEpoch: Long,
        verifier: SignatureVerifier = JdkEd25519Verifier,
    ): LeaseRejection? {
        val pinned = trust[lease.keyId] ?: return LeaseRejection.UNKNOWN_SIGNER
        if (!verifier.verify(pinned, payload(lease).toByteArray(), lease.signature)) return LeaseRejection.BAD_SIGNATURE
        if (lease.authorityEpoch < currentEpoch) return LeaseRejection.STALE_EPOCH
        if (now >= Instant.parse(lease.notAfter)) return LeaseRejection.EXPIRED
        if (now < Instant.parse(lease.issuedAt)) return LeaseRejection.NOT_YET_VALID
        return null
    }
}
