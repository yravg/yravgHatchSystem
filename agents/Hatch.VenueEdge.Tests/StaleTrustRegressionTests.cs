using System;
using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Xunit;

namespace Hatch.VenueEdge.Tests;

/// <summary>Regression for Checker defect D1 (AC-HS-50, AC-HS-V02-12): time trust never survives a reboot, not even through a later process restart.</summary>
public class StaleTrustRegressionTests
{
    [Fact]
    public async Task D1_reboot_then_process_restart_in_new_boot_does_not_restore_stale_trust_or_accept_an_expired_lease()
    {
        using var r = new Rig();
        var lease1 = r.Lease(1, 1800);
        Assert.Equal(AckStatus.APPLIED, (await r.Rt.HandleAsync(r.Cmd(CommandAction.START, lease1, 0, 1))).Status);
        Assert.Equal(AckStatus.APPLIED, (await r.Rt.HandleAsync(r.Cmd(CommandAction.END, null, 1, 2))).Status);
        r.Clock.Pass(3600);                  // an hour of downtime; lease1 is long expired
        r.Reboot();
        Assert.False(r.Rt.Time.IsTrusted);
        r.Rt.Dispose(); r.Clock.PassMonoOnly(5000);
        r.Rt = r.Open();                     // process restart inside the SAME new boot, no reconciliation yet
        Assert.False(r.Rt.Time.IsTrusted);
        Assert.NotEqual("restored-same-boot", r.Rt.Time.Source);
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, lease1, 2, 1, id: Guid.NewGuid().ToString()));
        Assert.Equal(AckStatus.FAILED, ack.Status);
        Assert.False(r.Display.PictureUnlocked);
    }

    [Fact]
    public async Task D1_running_lease_stays_locked_in_recovery_across_reboot_and_a_restart_in_the_new_boot()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Clock.Pass(300); r.Rt.Tick();
        r.Reboot();
        r.Rt.Dispose(); r.Clock.PassMonoOnly(5000);
        r.Rt = r.Open();
        Assert.False(r.Rt.Time.IsTrusted);
        Assert.Equal(StationState.RecoveryRequired, r.Rt.View(Rig.Station).State);
        Assert.False(r.Display.PictureUnlocked);
    }

    [Fact]
    public async Task Same_boot_process_restart_still_keeps_trust_established_in_that_boot()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Rt.Dispose(); r.Clock.Pass(10);
        r.Rt = r.Open();                     // same BootId: monotonic clock did not reset
        Assert.True(r.Rt.Time.IsTrusted);
    }

    [Fact]
    public async Task Fresh_trusted_time_after_reboot_and_restart_is_the_only_way_trust_returns()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Reboot(); r.Rt.Dispose(); r.Rt = r.Open();
        Assert.False(r.Rt.Time.IsTrusted);
        r.Rt.Time.Establish(r.Clock.UtcNow, "fixture-reconciliation");
        Assert.True(r.Rt.Time.IsTrusted);
        r.Rt.Dispose(); r.Rt = r.Open();     // another restart in this boot now legitimately restores the fresh anchor
        Assert.True(r.Rt.Time.IsTrusted);
    }
}
