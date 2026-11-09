package id.yravg.hatch.faults

import id.yravg.hatch.core.*
import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertIs
import kotlin.test.assertTrue

/** SIMULATOR evidence (fake clock, in-memory store). Physical cold reboot / Ethernet-unplugged runs are BLOCKED, see tests/hardware/android-tv. */
class FaultScenariosTest {
    private val signer = TestKit.Signer()
    private fun boot(clock: FakeClock, store: StateStore) = TestKit.core(clock, store, signer)

    @Test fun `WAN loss lets a valid lease expire locally then locks and never extends`() {
        val clock = FakeClock(); val core = boot(clock, MemoryStore())
        core.establishTrustedTime(clock.wall, "t"); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 120)))
        // WAN down: no more leases, no pairing responses
        clock.advanceSeconds(119); assertFalse(core.decide().locked)
        clock.advanceSeconds(2); assertEquals(LockReason.EXPIRED, core.decide().reason)
        clock.advanceSeconds(3600); assertTrue(core.decide().locked)
    }

    @Test fun `a replayed lease neither extends nor revives, duplicates are idempotent`() {
        val clock = FakeClock(); val core = boot(clock, MemoryStore())
        core.establishTrustedTime(clock.wall, "t")
        val l = signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 300, revision = 4))
        assertIs<LeaseResult.Accepted>(core.applyLease(l))
        clock.advanceSeconds(200)
        assertIs<LeaseResult.Accepted>(core.applyLease(l)) // duplicate delivery
        assertEquals(100, core.decide().remainingSeconds)  // not reset to 300
        assertEquals(LeaseResult.Rejected(RejectReason.STALE_REVISION), core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, revision = 3))))
        clock.advanceSeconds(101); assertTrue(core.decide().locked)
        assertEquals(LeaseResult.Rejected(RejectReason.EXPIRED), core.applyLease(l)) // replay after expiry
        assertTrue(core.decide().locked)
    }

    @Test fun `wall clock rollback and untrusted time changes add no seconds`() {
        val clock = FakeClock(); val core = boot(clock, MemoryStore())
        core.establishTrustedTime(clock.wall, "t"); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 300)))
        clock.advanceSeconds(250)
        clock.wall = clock.wall.minusSeconds(86_400) // user winds the wall clock back a day
        assertEquals(50, core.decide().remainingSeconds)
        assertEquals(TimeResult.ClockRollback, core.establishTrustedTime(clock.wall, "ntp-spoof"))
        assertEquals(50, core.decide().remainingSeconds)
        clock.advanceSeconds(51); assertTrue(core.decide().locked)
    }

    @Test fun `three cold reboots return to locked state with no relaunch and no regained seconds`() {
        val clock = FakeClock(); val store = MemoryStore(); var core = boot(clock, store)
        core.establishTrustedTime(clock.wall, "t")
        val l = signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 600, revision = 2))
        core.applyLease(l); clock.advanceSeconds(100); core.checkpoint()
        repeat(3) { n ->
            clock.reboot(wallAfter = Instant.parse("2020-01-01T00:00:00Z")) // wrong wall time after boot
            core = boot(clock, store)                                       // process restarts by itself
            assertEquals(LockReason.REBOOT_RECOVERY, core.decide().reason, "reboot ${n + 1}")
            assertEquals(SecurityClaim.MANAGED_KIOSK, core.decide().securityClaim)
            assertEquals(KeyDisposition.CONSUMED_LOCKED, core.handleKey(TvKey.HOME))
            // a wrong wall clock is not trusted evidence: still locked, and a lease cannot be accepted
            assertEquals(LeaseResult.Rejected(RejectReason.TIME_UNTRUSTED), core.applyLease(l))
        }
        // trusted time returns 400s after issue: the SAME lease gives what is left of its window, capped by the checkpoint
        val back = TestKit.T0.plusSeconds(400)
        clock.wall = back
        assertEquals(TimeResult.Ok, core.establishTrustedTime(back, "authority-reconcile"))
        assertIs<LeaseResult.Accepted>(core.applyLease(l))
        assertEquals(200, core.decide().remainingSeconds) // lease window minus real elapsed time, never the full 600 again
    }

    @Test fun `reboot without trusted time fails closed even when the stored lease would still be valid by wall clock`() {
        val clock = FakeClock(); val store = MemoryStore(); var core = boot(clock, store)
        core.establishTrustedTime(clock.wall, "t"); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 3600)))
        clock.reboot(wallAfter = clock.wall.plusSeconds(10)); core = boot(clock, store)
        assertTrue(core.decide().locked); assertEquals(0, core.decide().remainingSeconds)
        // process death inside the new boot must not restore the dead boot's trust (T50 D1)
        core = boot(clock, store)
        assertTrue(core.decide().locked); assertEquals(LeaseResult.Rejected(RejectReason.TIME_UNTRUSTED), core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, revision = 8))))
    }

    @Test fun `same boot process death keeps trust and the running lease`() {
        val clock = FakeClock(); val store = MemoryStore(); var core = boot(clock, store)
        core.establishTrustedTime(clock.wall, "t"); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 600)))
        clock.advanceSeconds(100); core = boot(clock, store)
        assertFalse(core.decide().locked); assertEquals(500, core.decide().remainingSeconds)
    }

    @Test fun `stale epoch, cross-device and split-brain leases are refused`() {
        val clock = FakeClock(); val core = boot(clock, MemoryStore())
        core.establishTrustedTime(clock.wall, "t")
        assertIs<LeaseResult.Accepted>(core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, epoch = 5, revision = 1, session = "55555555-5555-4555-8555-555555555551"))))
        core.lock(LockReason.LOCK_COMMAND)
        // an old edge (epoch 4) tries to unlock a different session
        assertEquals(LeaseResult.Rejected(RejectReason.STALE_EPOCH), core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, epoch = 4, revision = 1, session = "55555555-5555-4555-8555-555555555552"))))
        assertTrue(core.decide().locked)
    }

    @Test fun `untrusted signer key id in the payload alone is never trusted`() {
        val clock = FakeClock(); val core = boot(clock, MemoryStore()); core.establishTrustedTime(clock.wall, "t")
        val rogue = TestKit.Signer().sign(TestKit.lease(issuedAt = clock.wall)) // signed by a key not in the trust bundle, same keyId
        assertEquals(LeaseResult.Rejected(RejectReason.BAD_SIGNATURE), core.applyLease(rogue))
        assertEquals(LeaseResult.Rejected(RejectReason.UNKNOWN_SIGNER), core.applyLease(rogue.copy(keyId = "evil")))
    }
}
