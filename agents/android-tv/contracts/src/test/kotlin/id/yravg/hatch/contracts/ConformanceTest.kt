package id.yravg.hatch.contracts

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.encodeToJsonElement
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

/** Parse each shared fixture into the generated model, re-serialise, and compare with the golden canonical JSON. */
class ConformanceTest {
    private val json = Json { ignoreUnknownKeys = false; explicitNulls = false }

    private fun res(path: String): String =
        checkNotNull(javaClass.classLoader.getResource(path)) { "missing $path" }.readText().trim()

    private inline fun <reified T> roundTrip(name: String) {
        val model = json.decodeFromString<T>(res("$name.json"))
        assertEquals(res("canonical/$name.json"), Canonical.of(json.encodeToJsonElement(model)), name)
    }

    @Test fun lease() = roundTrip<SessionLease>("lease")
    @Test fun command() = roundTrip<SessionCommand>("command")
    @Test fun ack() = roundTrip<DeviceAck>("ack")
    @Test fun error() = roundTrip<ErrorEnvelope>("error")
    @Test fun payment() = roundTrip<PaymentAmount>("payment")

    @Test fun unknownMemberIsRejected() {
        assertFailsWith<Exception> {
            json.decodeFromString<PaymentAmount>("""{"amountIDR":"1","currency":"IDR","extra":1}""")
        }
    }
}
