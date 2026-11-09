using System;
using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Xunit;

namespace Hatch.VenueEdge.Tests;

/// <summary>Reboot without trusted time fails closed and never resets paid time (CONTRACTS section 5, D07).</summary>
public class RebootTests
{
    [Fact]
    public async Task Reboot_locks_the_picture_and_asks_for_recovery_instead_of_resetting_the_time()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Clock.Pass(600);
        r.Rt.Tick(); // checkpoint
        r.Reboot();
        var v = r.Rt.View(Rig.Station);
        Assert.False(r.Display.PictureUnlocked);
        Assert.Equal(StationState.RecoveryRequired, v.State);
        Assert.False(r.Rt.Time.IsTrusted);
        Assert.True(v.RemainingSeconds <= 1200, "never more than the checkpoint, got " + v.RemainingSeconds);
        Assert.NotEqual(1800, v.RemainingSeconds);
    }

    [Fact]
    public async Task A_plausible_wall_clock_after_reboot_does_not_unlock_anything()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Reboot();
        r.Clock.SetWall(new DateTimeOffset(2026, 11, 8, 14, 0, 1, TimeSpan.Zero)); // looks right, is not evidence
        r.Rt.Tick();
        Assert.False(r.Display.PictureUnlocked);
        Assert.Equal(StationState.RecoveryRequired, r.Rt.View(Rig.Station).State);
        var resume = await r.Rt.HandleAsync(r.Cmd(CommandAction.RESUME, null, 1, 2));
        Assert.Equal(AckStatus.FAILED, resume.Status);
        Assert.False(r.Display.PictureUnlocked);
    }

    [Fact]
    public async Task A_fresh_start_is_refused_while_time_is_untrusted()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Reboot();
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.EXTEND, r.Lease(2, 3600), 1, 2));
        Assert.Equal("TIME_UNTRUSTED", ack.ErrorCode);
        Assert.False(r.Display.PictureUnlocked);
    }

    [Fact]
    public async Task Trusted_reconciliation_resumes_with_no_more_than_the_checkpoint()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Clock.Pass(600);
        r.Rt.Tick();
        var before = r.Rt.View(Rig.Station).RemainingSeconds;
        Assert.Equal(1200, before);
        r.Reboot();
        r.Rt.Reconcile(r.Clock.UtcNow.AddSeconds(30), "fixture-server-time");
        var v = r.Rt.View(Rig.Station);
        Assert.Equal(StationState.Running, v.State);
        Assert.True(r.Display.PictureUnlocked);
        Assert.True(v.RemainingSeconds <= 1200);
        // authoritative remaining lower than the checkpoint wins
        r.Reboot();
        r.Rt.Reconcile(r.Clock.UtcNow.AddSeconds(30), "fixture-server-time", authoritativeRemainingSeconds: 100);
        Assert.Equal(100, r.Rt.View(Rig.Station).RemainingSeconds);
        // authoritative remaining higher than the checkpoint does NOT add time
        r.Reboot();
        r.Rt.Reconcile(r.Clock.UtcNow.AddSeconds(30), "fixture-server-time", authoritativeRemainingSeconds: 9999);
        Assert.True(r.Rt.View(Rig.Station).RemainingSeconds <= 100);
    }

    [Fact]
    public async Task Reconciliation_past_the_signed_deadline_stays_locked()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Reboot();
        r.Rt.Reconcile(new DateTimeOffset(2026, 11, 8, 14, 31, 0, TimeSpan.Zero), "fixture-server-time");
        Assert.False(r.Display.PictureUnlocked);
        var v = r.Rt.View(Rig.Station);
        Assert.Equal(StationState.Locked, v.State);
        Assert.Equal(0, v.RemainingSeconds);
    }

    [Fact]
    public async Task Rolling_the_wall_clock_back_after_reconcile_does_not_add_time()
    {
        using var r = new Rig();
        await r.StartAsync(1800);
        r.Reboot();
        r.Rt.Reconcile(r.Clock.UtcNow, "fixture-server-time");
        var start = r.Rt.View(Rig.Station).RemainingSeconds;
        r.Clock.SetWall(r.Clock.UtcNow.AddDays(-2));
        r.Clock.PassMonoOnly(50);
        Assert.Equal(start - 50, r.Rt.View(Rig.Station).RemainingSeconds);
    }
}
