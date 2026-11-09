package id.yravg.hatch.app

import id.yravg.hatch.contracts.SessionLease
import id.yravg.hatch.core.LeaseRejection
import id.yravg.hatch.core.LeaseVerifier
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromJsonElement
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse

/** The Android-safe verifier (no JDK Ed25519 needed, works below API 33) must agree with the T50 vector. */
class BcEd25519VerifierTest {
    private val root = Json.parseToJsonElement(checkNotNull(javaClass.classLoader.getResource("vector.json")).readText()).jsonObject
    private val lease = Json.decodeFromJsonElement<SessionLease>(root["lease"]!!)
    private val trust = mapOf(lease.keyId to root["publicKey"]!!.jsonPrimitive.content)
    private val now = Instant.parse("2026-11-08T14:10:00Z")

    @Test fun `the committed vector verifies`() = assertEquals(null, LeaseVerifier.verify(lease, trust, now, 7, BcEd25519Verifier))

    @Test fun `a changed second is BAD_SIGNATURE and garbage never throws`() {
        assertEquals(LeaseRejection.BAD_SIGNATURE, LeaseVerifier.verify(lease.copy(notAfter = "2026-11-08T14:30:01Z"), trust, now, 7, BcEd25519Verifier))
        assertEquals(LeaseRejection.BAD_SIGNATURE, LeaseVerifier.verify(lease.copy(signature = "!!"), trust, now, 7, BcEd25519Verifier))
        assertFalse(BcEd25519Verifier.verify("short", byteArrayOf(1), "AAAA"))
    }
}
