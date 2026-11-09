package id.yravg.hatch.core

import id.yravg.hatch.contracts.SessionLease
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.decodeFromJsonElement
import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/** The T50 signing vector (public key only) must verify in Kotlin exactly as it does in TypeScript and .NET. */
class LeaseVectorTest {
    private val root = Json.parseToJsonElement(checkNotNull(javaClass.classLoader.getResource("vector.json")).readText()).jsonObject
    private val lease = Json.decodeFromJsonElement<SessionLease>(root["lease"]!!)
    private val pub = root["publicKey"]!!.jsonPrimitive.content

    @Test fun `kotlin canonical payload equals the committed canonical payload`() =
        assertEquals(root["canonicalPayload"]!!.jsonPrimitive.content, LeaseVerifier.payload(lease))

    @Test fun `the committed vector verifies against the pinned key`() =
        assertEquals(null, LeaseVerifier.verify(lease, mapOf(lease.keyId to pub), Instant.parse("2026-11-08T14:10:00Z"), 7))

    @Test fun `a changed second or a wrong or unknown key is rejected`() {
        val trust = mapOf(lease.keyId to pub)
        val now = Instant.parse("2026-11-08T14:10:00Z")
        assertEquals(LeaseRejection.BAD_SIGNATURE, LeaseVerifier.verify(lease.copy(notAfter = "2026-11-08T14:30:01Z"), trust, now, 7))
        assertEquals(LeaseRejection.UNKNOWN_SIGNER, LeaseVerifier.verify(lease, emptyMap(), now, 7))
        assertEquals(LeaseRejection.BAD_SIGNATURE, LeaseVerifier.verify(lease, mapOf(lease.keyId to TestKit.Signer().rawPublic), now, 7))
    }

    @Test fun `stale epoch expired and future leases are rejected and garbage never throws`() {
        val trust = mapOf(lease.keyId to pub)
        assertEquals(LeaseRejection.STALE_EPOCH, LeaseVerifier.verify(lease, trust, Instant.parse("2026-11-08T14:10:00Z"), 8))
        assertEquals(LeaseRejection.EXPIRED, LeaseVerifier.verify(lease, trust, Instant.parse("2026-11-08T14:30:00Z"), 7))
        assertEquals(LeaseRejection.NOT_YET_VALID, LeaseVerifier.verify(lease, trust, Instant.parse("2026-11-08T13:59:59Z"), 7))
        assertEquals(LeaseRejection.BAD_SIGNATURE, LeaseVerifier.verify(lease.copy(signature = "!!notbase64"), trust, Instant.parse("2026-11-08T14:10:00Z"), 7))
        assertFalse(JdkEd25519Verifier.verify("short", "x".toByteArray(), "AAAA"))
        assertTrue(true)
    }
}
