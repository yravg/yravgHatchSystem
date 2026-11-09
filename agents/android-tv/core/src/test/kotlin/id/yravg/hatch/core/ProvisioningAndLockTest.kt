package id.yravg.hatch.core

import id.yravg.hatch.contracts.LeasePermission
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertIs
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class ProvisioningAndLockTest {
    private fun trusted(c: TvCore, clock: FakeClock) = assertEquals(TimeResult.Ok, c.establishTrustedTime(clock.wall, "authority-reconcile"))

    @Test fun `PROVISIONED_UNPAIRED without a lease is locked with neutral setup, no pairing or payment needed`() {
        val core = TestKit.core()
        val d = core.decide()
        assertTrue(d.locked); assertEquals(LockReason.NO_LEASE, d.reason)
        assertEquals(SecurityClaim.MANAGED_KIOSK, d.securityClaim); assertFalse(d.consoleVisible)
        assertEquals(TvState.PROVISIONED_UNPAIRED, core.tvState())
        assertEquals(Readiness.READY, d.readiness)
    }

    @Test fun `Home Back and input are consumed while locked in the managed profile`() {
        val core = TestKit.core()
        for (k in listOf(TvKey.HOME, TvKey.BACK, TvKey.INPUT)) assertEquals(KeyDisposition.CONSUMED_LOCKED, core.handleKey(k), "$k")
    }

    @Test fun `UNPROVISIONED_APP never claims kiosk security and keys pass through honestly`() {
        val core = TestKit.core(profile = ProvisioningProfile.UNPROVISIONED_APP)
        val d = core.decide()
        assertEquals(SecurityClaim.NONE, d.securityClaim); assertEquals(Readiness.UNSUPPORTED, d.readiness)
        assertEquals(TvState.UNPROVISIONED_APP, core.tvState())
        assertEquals(KeyDisposition.PASS_THROUGH, core.handleKey(TvKey.HOME))
    }

    @Test fun `a valid lease unlocks for its remaining seconds on the monotonic clock then locks`() {
        val clock = FakeClock(); val signer = TestKit.Signer(); val core = TestKit.core(clock, signer = signer)
        trusted(core, clock)
        val r = core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 600)))
        assertIs<LeaseResult.Accepted>(r)
        assertFalse(core.decide().locked); assertEquals(600, core.decide().remainingSeconds)
        clock.advanceSeconds(599); assertFalse(core.decide().locked)
        clock.advanceSeconds(1); assertEquals(LockReason.EXPIRED, core.decide().reason); assertTrue(core.decide().locked)
    }

    @Test fun `a lease is refused without trusted time, for another device, without DISPLAY_GAME, or with a bad signature`() {
        val clock = FakeClock(); val signer = TestKit.Signer(); val core = TestKit.core(clock, signer = signer)
        val ok = signer.sign(TestKit.lease(issuedAt = clock.wall))
        assertEquals(LeaseResult.Rejected(RejectReason.TIME_UNTRUSTED), core.applyLease(ok))
        trusted(core, clock)
        assertEquals(LeaseResult.Rejected(RejectReason.WRONG_DEVICE), core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, device = "99999999-9999-4999-8999-999999999999"))))
        assertEquals(LeaseResult.Rejected(RejectReason.NO_PERMISSION), core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, perms = emptyList()))))
        assertEquals(LeaseResult.Rejected(RejectReason.BAD_SIGNATURE), core.applyLease(ok.copy(signature = TestKit.Signer().sign(ok).signature)))
        assertTrue(core.decide().locked)
    }

    @Test fun `pairing HTTP 200 with a locked payload, timeout and refresh never grant play`() {
        val clock = FakeClock(); val core = TestKit.core(clock)
        core.pairing.begin("12345678"); assertEquals(PairingState.WAITING, core.pairing.state())
        assertEquals(PairingOutcome.NoGrant, core.onPairingHttp(200, """{"state":"LOCKED"}"""))
        assertEquals(PairingOutcome.NoGrant, core.onPairingHttp(200, """{"state":"LOCKED","lease":null}"""))
        assertEquals(PairingOutcome.NoGrant, core.onPairingHttp(500, "oops"))
        assertEquals(PairingOutcome.NoGrant, core.onPairingHttp(200, "not json"))
        clock.advanceSeconds(301); assertEquals(PairingState.EXPIRED, core.pairing.state()); assertTrue(core.decide().locked)
        core.pairing.refresh("87654321"); assertFalse(core.pairing.codeValid("12345678")); assertTrue(core.pairing.codeValid("87654321"))
        assertTrue(core.decide().locked)
    }

    @Test fun `HTTP 200 carrying a lease only plays when the lease itself verifies`() {
        val clock = FakeClock(); val signer = TestKit.Signer(); val core = TestKit.core(clock, signer = signer)
        trusted(core, clock)
        val good = signer.sign(TestKit.lease(issuedAt = clock.wall))
        val body = { l: id.yravg.hatch.contracts.SessionLease -> """{"state":"PAIRED","lease":${kotlinx.serialization.json.Json.encodeToString(id.yravg.hatch.contracts.SessionLease.serializer(), l)}}""" }
        assertEquals(PairingOutcome.Applied(LeaseResult.Rejected(RejectReason.BAD_SIGNATURE)), core.onPairingHttp(200, body(good.copy(signature = TestKit.Signer().sign(good).signature))))
        assertTrue(core.decide().locked)
        assertIs<PairingOutcome.Applied>(core.onPairingHttp(200, body(good))); assertFalse(core.decide().locked)
    }

    @Test fun `revoked state locks and needs repair, only a lease with a higher epoch after re-provisioning may play`() {
        val clock = FakeClock(); val signer = TestKit.Signer(); val core = TestKit.core(clock, signer = signer)
        trusted(core, clock); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall)))
        core.revoke()
        assertEquals(LockReason.REVOKED, core.decide().reason); assertEquals(TvState.REVOKED, core.tvState())
        assertEquals(LeaseResult.Rejected(RejectReason.REVOKED), core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, revision = 9))))
    }

    @Test fun `pause end and lock commands lock immediately without CEC and a later lease resumes`() {
        val clock = FakeClock(); val signer = TestKit.Signer(); val core = TestKit.core(clock, signer = signer, cec = ExplodingCecDriver())
        trusted(core, clock); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 900, revision = 1)))
        for (reason in listOf(LockReason.PAUSED, LockReason.STOPPED, LockReason.LOCK_COMMAND)) {
            core.lock(reason); assertEquals(reason, core.decide().reason); assertTrue(core.decide().locked)
            val rev = 10L + reason.ordinal
            assertIs<LeaseResult.Accepted>(core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall, seconds = 900, revision = rev))))
            assertFalse(core.decide().locked)
        }
        assertNotNull(core.decide()); assertNull(core.decide().reason)
    }
}
