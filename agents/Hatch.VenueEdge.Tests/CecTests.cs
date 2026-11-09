using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Xunit;

namespace Hatch.VenueEdge.Tests;

/// <summary>D28: HDMI-CEC is optional and never required. Start, pause, expire and reboot lock must work with no CEC
/// driver at all, and with a driver that fails. No console mains is ever switched.</summary>
public class CecTests
{
    [Fact]
    public async Task With_no_cec_driver_start_pause_expire_and_reboot_all_lock_the_picture()
    {
        using var r = new Rig();
        r.Rt.Store.RecordCecAttestation(tvCecOff: true, consoleCecOff: true, attestedBy: "operator:fixture");
        await r.StartAsync(300);
        Assert.True(r.Display.PictureUnlocked);
        await r.Rt.HandleAsync(r.Cmd(CommandAction.PAUSE, null, 1, 2));
        Assert.False(r.Display.PictureUnlocked);
        await r.Rt.HandleAsync(r.Cmd(CommandAction.RESUME, null, 2, 3));
        r.Clock.Pass(300); r.Rt.Tick();
        Assert.False(r.Display.PictureUnlocked);
        r.Reboot();
        Assert.False(r.Display.PictureUnlocked);
        Assert.Equal(new CecAttestation(true, true, "operator:fixture"), r.Rt.Store.CecAttestationRecord());
        Assert.Empty(r.Display.PowerCalls); // the simulator records any console power request: there must be none
    }

    [Fact]
    public async Task A_failing_optional_cec_driver_cannot_stop_the_independent_lock()
    {
        var cec = new ThrowingCec();
        using var r = new Rig { Cec = cec };
        r.Rt.Dispose(); r.Rt = r.Open();
        await r.StartAsync(60);
        r.Clock.Pass(60); r.Rt.Tick();
        Assert.False(r.Display.PictureUnlocked);
        Assert.Equal("EXPIRED", r.Rt.View(Rig.Station).LockReason);
        Assert.True(cec.Calls > 0); // the optional driver really was tried and really failed
        Assert.Contains("cec.optional.failed", r.Rt.Store.EventKinds());
        Assert.Empty(r.Display.PowerCalls);
    }

    [Fact]
    public void The_display_adapter_is_a_labelled_simulator_and_has_no_console_power_method()
    {
        Assert.Equal("SIMULATOR", new SimulatedDisplay().Label);
        Assert.DoesNotContain(typeof(IDisplayAdapter).GetMethods(), m => m.Name.Contains("Console", System.StringComparison.OrdinalIgnoreCase) || m.Name.Contains("Mains", System.StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task A_display_that_is_not_ready_blocks_the_start_so_no_billing_begins_without_activation()
    {
        using var r = new Rig();
        r.Display.Ready = false;
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, r.Lease(1), 0, 1));
        Assert.Equal("DEVICE_NOT_READY", ack.ErrorCode);
        Assert.Equal(StationState.Locked, r.Rt.View(Rig.Station).State);
    }
}
