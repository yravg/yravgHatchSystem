package id.yravg.hatch.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class TechnicianEscapeTest {
    private fun esc(clock: FakeClock = FakeClock(), store: StateStore = MemoryStore()) = TechnicianEscape(store, clock)

    @Test fun `no credential enrolled means the escape is closed`() =
        assertEquals(EscapeResult.NOT_ENROLLED, esc().attempt("anything", "setup"))

    @Test fun `credential is stored only as a salted hash and a correct attempt opens setup only, never the picture`() {
        val store = MemoryStore(); val e = esc(store = store); e.enrol("correct-horse-42", actor = "owner")
        assertTrue(store.data.values.none { it.contains("correct-horse-42") })
        assertEquals(EscapeResult.GRANTED_SETUP_ONLY, e.attempt("correct-horse-42", "swap router"))
        assertTrue(e.setupOpen())
        val core = TestKit.core(store = store)
        assertTrue(core.decide().locked); assertFalse(core.decide().consoleVisible)
    }

    @Test fun `wrong credential is denied, audited without the secret, and five wrong attempts per minute lock the escape out`() {
        val clock = FakeClock(); val e = esc(clock); e.enrol("correct-horse-42", "owner")
        repeat(5) { assertEquals(EscapeResult.DENIED, e.attempt("guess$it", "try")) }
        assertEquals(EscapeResult.LOCKED_OUT, e.attempt("correct-horse-42", "try"))
        assertTrue(e.audit().none { it.toString().contains("guess") || it.toString().contains("correct-horse") })
        assertEquals(5, e.audit().count { it.type == "escape.denied" })
        clock.advanceSeconds(61)
        assertEquals(EscapeResult.GRANTED_SETUP_ONLY, e.attempt("correct-horse-42", "again"))
    }

    @Test fun `every grant and enrolment is audited with actor and reason, and the setup window closes after five minutes`() {
        val clock = FakeClock(); val e = esc(clock); e.enrol("correct-horse-42", "owner")
        e.attempt("correct-horse-42", "swap router")
        assertEquals(listOf("escape.enrolled", "escape.granted"), e.audit().map { it.type })
        assertEquals("swap router", e.audit().last().reason)
        clock.advanceSeconds(299); assertTrue(e.setupOpen()); clock.advanceSeconds(2); assertFalse(e.setupOpen())
    }

    @Test fun `credential and audit survive a restart and a short credential is refused`() {
        val store = MemoryStore(); esc(store = store).enrol("correct-horse-42", "owner")
        val again = esc(store = store)
        assertEquals(EscapeResult.GRANTED_SETUP_ONLY, again.attempt("correct-horse-42", "r"))
        assertEquals(2, again.audit().size)
        assertFalse(runCatching { esc().enrol("123", "owner") }.isSuccess)
    }
}
