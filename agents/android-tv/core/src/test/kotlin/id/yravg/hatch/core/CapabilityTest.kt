package id.yravg.hatch.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertIs
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class CapabilityTest {
    private fun playing(probe: FakeProbe, fb: FakeFallback): Triple<TvCore, FakeClock, TestKit.Signer> {
        val clock = FakeClock(); val signer = TestKit.Signer()
        val core = TestKit.core(clock, signer = signer, probe = probe, fallback = fb)
        core.establishTrustedTime(clock.wall, "t"); core.applyLease(signer.sign(TestKit.lease(issuedAt = clock.wall)))
        return Triple(core, clock, signer)
    }

    @Test fun `missing or revoked overlay permission fails capability, locks via the fallback route and asks for repair`() {
        for (s in listOf(PermissionState.MISSING, PermissionState.REVOKED)) {
            val probe = FakeProbe(PermissionState.GRANTED); val (core) = playing(probe, FakeFallback(LockRoute.IR_FALLBACK))
            assertFalse(core.decide().locked)
            probe.state = s
            val d = core.decide()
            assertTrue(d.locked); assertEquals(LockReason.PERMISSION_LOST, d.reason)
            assertEquals(LockRoute.IR_FALLBACK, d.route); assertEquals(Readiness.NOT_READY_REPAIR, d.readiness)
            assertEquals(TvState.REPAIR_REQUIRED, core.tvState())
        }
    }

    @Test fun `no fallback means unsupported, certification is forbidden, and the picture is still reported locked`() {
        val probe = FakeProbe(PermissionState.REVOKED); val (core) = playing(probe, FakeFallback(up = false))
        val d = core.decide()
        assertTrue(d.locked); assertEquals(LockRoute.NONE, d.route); assertEquals(Readiness.UNSUPPORTED, d.readiness)
        assertFalse(core.certificationAllowed())
    }

    @Test fun `the permission probe can only read, there is no grant API`() {
        val names = OverlayPermissionProbe::class.java.methods.map { it.name.lowercase() }
        assertTrue(names.none { it.contains("grant") || it.contains("request") || it.contains("adb") || it.contains("root") }, "$names")
        assertEquals(listOf("state"), names.sorted())
    }

    @Test fun `CEC is optional, unsupported power is advertised and the lock route does not need CEC or console mains`() {
        val core = TestKit.core(cec = UnsupportedCecDriver)
        val c = core.capabilities()
        assertEquals(PowerCapability.UNSUPPORTED, c.cecPower); assertFalse(c.requiresCec); assertFalse(c.requiresConsoleMains)
        assertEquals(LockRoute.NATIVE_OVERLAY, c.lockRoute)
        assertFalse(UnsupportedCecDriver.powerOff())
    }

    @Test fun `venue setup records CEC off on both TV and console and anything else is flagged not certifiable`() {
        val core = TestKit.core()
        assertEquals(CecSetupStatus.NOT_RECORDED, core.cecSetupStatus()); assertFalse(core.certificationAllowed())
        core.recordCecSetup(tvCecOff = true, consoleCecOff = false, recordedBy = "tech-1")
        assertEquals(CecSetupStatus.CEC_NOT_OFF, core.cecSetupStatus())
        core.recordCecSetup(tvCecOff = true, consoleCecOff = true, recordedBy = "tech-1")
        assertEquals(CecSetupStatus.BOTH_OFF, core.cecSetupStatus())
        val rec = assertNotNull(core.cecRecord()); assertEquals("tech-1", rec.recordedBy)
        // lock still works whatever the CEC record says
        assertTrue(core.decide().locked)
    }
}
