using System;
using System.Linq;
using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Xunit;

namespace Hatch.VenueEdge.Tests;

public class LeaseTests
{
    [Fact]
    public async Task A_valid_signed_lease_unlocks_the_picture_and_the_ack_is_labelled_simulated()
    {
        using var r = new Rig();
        Assert.False(r.Display.PictureUnlocked);
        var ack = await r.StartAsync();
        Assert.Equal(VerificationLevel.SIMULATED, ack.VerificationLevel);
        Assert.True(r.Display.PictureUnlocked);
        Assert.Equal(new StationView(StationState.Running, 1800, 1, true, null), r.Rt.View(Rig.Station));
        Assert.Equal("SIMULATOR", r.Display.Label);
    }

    [Theory]
    [InlineData("bad-signature", "LEASE_BAD_SIGNATURE")]
    [InlineData("unknown-signer", "LEASE_UNKNOWN_SIGNER")]
    [InlineData("other-device", "LEASE_DEVICE_MISMATCH")]
    [InlineData("stale-epoch", "STALE_EPOCH")]
    [InlineData("no-lease", "LEASE_REQUIRED")]
    public async Task A_lease_that_does_not_verify_is_refused_and_the_picture_stays_locked(string kind, string code)
    {
        using var r = new Rig();
        SessionLease? lease = kind switch
        {
            "bad-signature" => r.Lease(1, seed: Ed25519.NewSeed()),
            "unknown-signer" => r.Lease(1, keyId: "someone-else"),
            "other-device" => r.Lease(1, device: "44444444-4444-4444-8444-444444444445"),
            "stale-epoch" => r.Lease(1, epoch: 6),
            _ => null,
        };
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, lease, 0, 1, epoch: kind == "stale-epoch" ? 6 : 7));
        Assert.Equal(AckStatus.FAILED, ack.Status);
        Assert.Equal(code, ack.ErrorCode);
        Assert.False(r.Display.PictureUnlocked);
        Assert.Equal(StationState.Locked, r.Rt.View(Rig.Station).State);
    }

    [Fact]
    public async Task A_tampered_second_count_is_refused()
    {
        using var r = new Rig();
        var good = r.Lease(1);
        var tampered = good with { RemainingSecondsAtIssue = 7200 };
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, tampered, 0, 1));
        Assert.Equal("LEASE_BAD_SIGNATURE", ack.ErrorCode);
    }

    [Fact]
    public async Task A_revoked_device_is_refused()
    {
        using var r = new Rig();
        r.Rt.Store.RevokeDevice(Rig.Device);
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, r.Lease(1), 0, 1));
        Assert.Equal("DEVICE_REVOKED", ack.ErrorCode);
        Assert.False(r.Display.PictureUnlocked);
    }

    [Fact]
    public async Task A_command_for_another_station_is_refused()
    {
        using var r = new Rig();
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, r.Lease(1), 0, 1, station: "33333333-3333-4333-8333-333333333334"));
        Assert.Equal("STATION_MISMATCH", ack.ErrorCode);
    }

    [Fact]
    public async Task Wan_down_the_valid_lease_runs_to_its_deadline_then_locks_locally()
    {
        using var r = new Rig();
        await r.StartAsync(remaining: 600);
        r.Network.CloudReachable = false;
        r.Clock.Pass(599); r.Rt.Tick();
        Assert.True(r.Display.PictureUnlocked);
        Assert.Equal(1, r.Rt.View(Rig.Station).RemainingSeconds);
        r.Clock.Pass(1); r.Rt.Tick();
        Assert.False(r.Display.PictureUnlocked);
        var v = r.Rt.View(Rig.Station);
        Assert.Equal(StationState.Locked, v.State);
        Assert.Equal("EXPIRED", v.LockReason);
        Assert.Equal(0, v.RemainingSeconds);
        Assert.Contains("lease.expired", r.Rt.Store.EventKinds());
    }

    [Fact]
    public async Task Offline_new_start_extend_and_money_actions_are_refused_with_allowance_zero()
    {
        using var r = new Rig();
        r.Network.CloudReachable = false;
        var start = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, r.Lease(1), 0, 1));
        Assert.Equal("OFFLINE_NOT_ALLOWED", start.ErrorCode);
        Assert.False(r.Display.PictureUnlocked);
        r.Network.CloudReachable = true;
        await r.StartAsync();
        r.Network.CloudReachable = false;
        var extend = await r.Rt.HandleAsync(r.Cmd(CommandAction.EXTEND, r.Lease(2, 3600), 1, 2));
        Assert.Equal("OFFLINE_NOT_ALLOWED", extend.ErrorCode);
        Assert.Equal(1800, r.Rt.View(Rig.Station).RemainingSeconds);
        Assert.False(r.Rt.AuthorizeMoney(MoneyAction.WalletSpend));
        Assert.False(r.Rt.AuthorizeMoney(MoneyAction.Refund));
        Assert.False(r.Rt.AuthorizeMoney(MoneyAction.NewStart));
        Assert.Equal(0, OfflinePolicy.AllowanceIdr);
        r.Network.CloudReachable = true;
        Assert.True(r.Rt.AuthorizeMoney(MoneyAction.WalletSpend));
        Assert.Throws<EdgeRefusal>(() => { r.Network.CloudReachable = false; r.Rt.IssueLease(Rig.Station, Rig.Device, "55555555-5555-4555-8555-555555555555", 600, 2); });
    }

    [Fact]
    public async Task Online_extend_with_a_higher_revision_applies_and_a_replay_of_it_adds_nothing()
    {
        using var r = new Rig();
        await r.StartAsync(600);
        r.Clock.Pass(100);
        var ext = r.Cmd(CommandAction.EXTEND, r.Lease(2, 900), 1, 2);
        Assert.Equal(AckStatus.APPLIED, (await r.Rt.HandleAsync(ext)).Status);
        Assert.Equal(900, r.Rt.View(Rig.Station).RemainingSeconds);
        r.Clock.Pass(60);
        // same command again: dedup, no effect
        await r.Rt.HandleAsync(ext);
        Assert.Equal(840, r.Rt.View(Rig.Station).RemainingSeconds);
        // same lease under a new command id and a fresh sequence: revision no longer matches
        var replay = await r.Rt.HandleAsync(r.Cmd(CommandAction.EXTEND, ext.Lease, 1, 2));
        Assert.Equal(AckStatus.FAILED, replay.Status);
        Assert.Equal("REVISION_CONFLICT", replay.ErrorCode);
        Assert.Equal(840, r.Rt.View(Rig.Station).RemainingSeconds);
    }

    [Fact]
    public async Task A_replayed_or_reordered_sequence_is_refused()
    {
        using var r = new Rig();
        var start = r.Cmd(CommandAction.START, r.Lease(1), 0, 1, sequence: 10);
        await r.Rt.HandleAsync(start);
        var older = await r.Rt.HandleAsync(r.Cmd(CommandAction.PAUSE, null, 1, 2, sequence: 9));
        Assert.Equal("SEQUENCE_REPLAY", older.ErrorCode);
        Assert.Equal(StationState.Running, r.Rt.View(Rig.Station).State);
    }

    [Fact]
    public async Task Wall_clock_rollback_in_the_same_boot_cannot_gain_a_second()
    {
        using var r = new Rig();
        await r.StartAsync(1000);
        r.Clock.SetWall(r.Clock.UtcNow.AddHours(-3));
        r.Clock.PassMonoOnly(100);
        r.Rt.Tick();
        Assert.Equal(900, r.Rt.View(Rig.Station).RemainingSeconds);
        r.Clock.SetWall(r.Clock.UtcNow.AddHours(+9)); // forward jump does not steal time either
        Assert.Equal(900, r.Rt.View(Rig.Station).RemainingSeconds);
    }

    [Fact]
    public async Task Pause_freezes_the_remaining_time_and_resume_continues_it()
    {
        using var r = new Rig();
        await r.StartAsync(600);
        r.Clock.Pass(100);
        await r.Rt.HandleAsync(r.Cmd(CommandAction.PAUSE, null, 1, 2));
        Assert.False(r.Display.PictureUnlocked);
        r.Clock.Pass(5000);
        r.Rt.Tick();
        Assert.Equal(500, r.Rt.View(Rig.Station).RemainingSeconds);
        await r.Rt.HandleAsync(r.Cmd(CommandAction.RESUME, null, 2, 3));
        Assert.True(r.Display.PictureUnlocked);
        r.Clock.Pass(10);
        Assert.Equal(490, r.Rt.View(Rig.Station).RemainingSeconds);
    }

    [Fact]
    public async Task End_and_lock_commands_lock_the_picture()
    {
        using var r = new Rig();
        await r.StartAsync();
        Assert.Equal(AckStatus.APPLIED, (await r.Rt.HandleAsync(r.Cmd(CommandAction.LOCK, null, 1, 2))).Status);
        Assert.False(r.Display.PictureUnlocked);
        Assert.Equal("LOCKED", r.Rt.View(Rig.Station).LockReason);
    }

    [Fact]
    public async Task A_safe_control_command_is_not_executed()
    {
        using var r = new Rig();
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.SAFE_CONTROL, null, 0, 0));
        Assert.Equal("SAFE_CONTROL_UNSUPPORTED", ack.ErrorCode);
    }

    [Fact]
    public async Task A_stale_expected_revision_is_a_conflict()
    {
        using var r = new Rig();
        await r.StartAsync();
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.PAUSE, null, 0, 2));
        Assert.Equal("REVISION_CONFLICT", ack.ErrorCode);
    }

    [Fact]
    public async Task A_command_past_its_expiry_is_refused_when_time_is_trusted()
    {
        using var r = new Rig();
        var cmd = r.Cmd(CommandAction.START, r.Lease(1), 0, 1);
        r.Clock.Pass(31);
        var ack = await r.Rt.HandleAsync(cmd);
        Assert.Equal("COMMAND_EXPIRED", ack.ErrorCode);
    }

    [Fact]
    public async Task A_fenced_edge_stops_granting_and_refuses_starts()
    {
        using var r = new Rig();
        await r.StartAsync();
        r.Rt.Store.ObserveEpoch(8); // another edge holds a higher epoch now
        Assert.True(r.Rt.Store.Fenced);
        var ack = await r.Rt.HandleAsync(r.Cmd(CommandAction.EXTEND, r.Lease(2), 1, 2, epoch: 8));
        Assert.Equal(AckStatus.FAILED, ack.Status);
        Assert.Equal("EDGE_FENCED", ack.ErrorCode);
        Assert.Throws<EdgeRefusal>(() => r.Rt.IssueLease(Rig.Station, Rig.Device, "55555555-5555-4555-8555-555555555555", 600, 2));
        // a command that still carries the old epoch is stale
        var stale = await r.Rt.HandleAsync(r.Cmd(CommandAction.PAUSE, null, 1, 2, epoch: 7));
        Assert.Equal("STALE_EPOCH", stale.ErrorCode);
    }

    [Fact]
    public async Task The_edge_issues_a_lease_its_own_trust_bundle_accepts()
    {
        using var r = new Rig();
        var lease = r.Rt.IssueLease(Rig.Station, Rig.Device, "55555555-5555-4555-8555-555555555555", 600, 1);
        Assert.Equal(7, lease.AuthorityEpoch);
        Assert.Equal("edge-key-v1", lease.KeyId);
        Assert.Null(LeaseVerifier.Verify(lease, r.Rt.Store.TrustBundle(), r.Clock.UtcNow, 7));
        Assert.Equal(AckStatus.APPLIED, (await r.Rt.HandleAsync(r.Cmd(CommandAction.START, lease, 0, 1))).Status);
    }
}
