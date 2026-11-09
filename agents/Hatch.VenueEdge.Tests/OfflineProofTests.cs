using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Xunit;

namespace Hatch.VenueEdge.Tests;

/// <summary>AC-HS-V02-12 on this VPS. SIMULATOR evidence: an in-process transport refuses EVERY connection the edge
/// attempts, the refusal is recorded before the scenario starts, and the scenario then runs with no server. This is
/// NOT a physical test: Ethernet unplugged on real venue hardware is BLOCKED (no hardware here).</summary>
public class OfflineProofTests
{
    [Fact]
    public async Task Offline_scenario_with_every_connection_refused()
    {
        using var r = new Rig();
        var link = new CloudLink(new Uri("https://cloud.hatch.invalid/api/v1/edge/acks"), new RefusingHandler(), r.Network);

        // 1. prove unreachability BEFORE the test
        for (var i = 0; i < 3; i++) await link.ProbeAsync();
        Assert.False(r.Network.CloudReachable);
        Assert.Equal(3, link.Proof.Attempts);
        Assert.Equal(3, link.Proof.Refused);
        Assert.Equal(0, link.Proof.Succeeded);
        Assert.Equal(0, link.Proof.BytesSent);

        // 2. a lease granted earlier (while online) finishes by its deadline
        r.Network.CloudReachable = true;
        await r.StartAsync(900);
        await link.ProbeAsync();
        Assert.False(r.Network.CloudReachable);
        r.Clock.Pass(300); r.Rt.Tick();
        Assert.Equal(600, r.Rt.View(Rig.Station).RemainingSeconds);

        // 3. no new grants
        var newStart = await r.Rt.HandleAsync(r.Cmd(CommandAction.START, r.Lease(9), 1, 9));
        var extend = await r.Rt.HandleAsync(r.Cmd(CommandAction.EXTEND, r.Lease(2, 3600), 1, 2));
        Assert.Equal("OFFLINE_NOT_ALLOWED", newStart.ErrorCode);
        Assert.Equal("OFFLINE_NOT_ALLOWED", extend.ErrorCode);

        // 4. rollback, duplicate and replay gain nothing
        var dup = r.Cmd(CommandAction.PAUSE, null, 1, 2);
        await r.Rt.HandleAsync(dup);
        await r.Rt.HandleAsync(dup);
        await r.Rt.HandleAsync(r.Cmd(CommandAction.RESUME, null, 2, 3));
        r.Clock.SetWall(r.Clock.UtcNow.AddHours(-5));
        r.Clock.PassMonoOnly(100); r.Rt.Tick();
        var afterRollback = r.Rt.View(Rig.Station).RemainingSeconds;
        Assert.Equal(500, afterRollback);

        // 5. reboot with the server still unreachable: fails closed, no reset, no resume
        r.Reboot();
        await link.ProbeAsync();
        var rebooted = r.Rt.View(Rig.Station);
        Assert.Equal(StationState.RecoveryRequired, rebooted.State);
        Assert.False(r.Display.PictureUnlocked);
        Assert.True(rebooted.RemainingSeconds <= afterRollback + 0 || rebooted.RemainingSeconds <= 600);
        Assert.NotEqual(900, rebooted.RemainingSeconds);
        Assert.Equal(0, link.Proof.Succeeded);

        var dir = Environment.GetEnvironmentVariable("HATCH_EVIDENCE_DIR");
        if (!string.IsNullOrEmpty(dir))
            File.WriteAllText(Path.Combine(dir, "offline-simulator-proof.json"), JsonSerializer.Serialize(new
            {
                label = "SIMULATOR: in-process transport that refuses every connection; NOT a physical Ethernet-unplugged test",
                physicalOfflineTest = "BLOCKED: no venue hardware available",
                linux = "unshare -rn is not permitted for user dev on this VPS (Operation not permitted on uid_map), so a network namespace could not be used",
                attempts = link.Proof.Attempts, refused = link.Proof.Refused, succeeded = link.Proof.Succeeded, bytesSent = link.Proof.BytesSent,
                lastError = link.Proof.LastError, remainingAfterRollback = afterRollback, remainingAfterReboot = rebooted.RemainingSeconds,
                stateAfterReboot = rebooted.State.ToString(),
            }, new JsonSerializerOptions { WriteIndented = true }));
    }

    [Fact]
    public async Task The_refusing_handler_really_throws_for_any_host()
    {
        var h = new RefusingHandler();
        using var http = new HttpClient(h);
        await Assert.ThrowsAsync<HttpRequestException>(() => http.GetAsync("http://127.0.0.1:1/"));
        await Assert.ThrowsAsync<HttpRequestException>(() => http.GetAsync("https://example.com/"));
        Assert.Equal(2, h.Attempts);
    }
}
