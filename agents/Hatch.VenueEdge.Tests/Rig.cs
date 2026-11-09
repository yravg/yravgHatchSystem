using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;

namespace Hatch.VenueEdge.Tests;

// Everything here is a FIXTURE or SIMULATOR: fixed ids, throwaway Ed25519 keys made per run, a simulated display.
public sealed class ManualClock : IMonotonicClock, IWallClock
{
    public long NowMs { get; private set; } = 5_000_000;
    public DateTimeOffset UtcNow { get; set; } = new(2026, 11, 8, 14, 0, 0, TimeSpan.Zero);
    /// <summary>Real time passing: both clocks move.</summary>
    public void Pass(int seconds) { NowMs += seconds * 1000L; UtcNow = UtcNow.AddSeconds(seconds); }
    /// <summary>Someone changes the wall clock; the monotonic clock does not care.</summary>
    public void SetWall(DateTimeOffset t) => UtcNow = t;
    /// <summary>Only the monotonic clock moves (the wall clock was rolled back meanwhile).</summary>
    public void PassMonoOnly(int seconds) => NowMs += seconds * 1000L;
    /// <summary>A reboot: the monotonic clock restarts from a small number.</summary>
    public void Reboot() => NowMs = 3_000;
}

public sealed class Net : INetworkState { public bool CloudReachable { get; set; } = true; }

public sealed class RecordingSink : IAckSink
{
    public readonly List<DeviceAck> Sent = new();
    public Action<DeviceAck>? OnSend;
    public Task SendAsync(DeviceAck ack, CancellationToken ct = default) { OnSend?.Invoke(ack); Sent.Add(ack); return Task.CompletedTask; }
}

public sealed class CrashAt : IFaultInjector
{
    public string? Point;
    public void At(string point) { if (point == Point) { Point = null; throw new CrashException(point); } }
}
public sealed class CrashException : Exception { public CrashException(string p) : base("simulated process death at " + p) { } }

public sealed class ThrowingCec : ICecDriver
{
    public int Calls;
    public bool Supported => false;
    public void Standby() { Calls++; throw new InvalidOperationException("CEC unsupported on this TV/console (simulated)"); }
}

public sealed class Rig : IDisposable
{
    public const string Tenant = "11111111-1111-4111-8111-111111111111", Outlet = "22222222-2222-4222-8222-222222222222",
        Station = "33333333-3333-4333-8333-333333333333", Device = "44444444-4444-4444-8444-444444444444";
    public readonly string Dir = Path.Combine(Path.GetTempPath(), "t50-" + Guid.NewGuid().ToString("N"));
    public string Db => Path.Combine(Dir, "edge.db");
    public readonly ManualClock Clock = new();
    public readonly Net Network = new();
    public readonly RecordingSink Sink = new();
    public readonly SimulatedDisplay Display = new();
    public readonly CrashAt Faults = new();
    public readonly byte[] SignerSeed = Ed25519.NewSeed();
    public ICecDriver? Cec;
    public EdgeRuntime Rt;
    long seq;
    public string BootId = Guid.NewGuid().ToString();

    public Rig(bool trusted = true)
    {
        Directory.CreateDirectory(Dir);
        Rt = Open();
        Rt.Store.SetTrust("edge-key-v1", B64u.Encode(Ed25519.PublicKey(SignerSeed)));
        Rt.RegisterStation(Station, Device);
        Rt.Store.ClaimAuthority(7);
        if (trusted) Rt.Time.Establish(Clock.UtcNow, "fixture-reconciliation");
    }

    public EdgeRuntime Open() => EdgeRuntime.Open(new EdgeOptions
    {
        DbPath = Db, Mono = Clock, Wall = Clock, Sink = Sink, Display = Display, Network = Network, Cec = Cec, Faults = Faults,
        BootId = BootId, Signer = DeviceIdentity.FromSeed(SignerSeed),
    });

    /// <summary>A reboot of the process: same database, fresh runtime, monotonic clock restarted, wall clock left as it is.</summary>
    public EdgeRuntime Reboot() { Rt.Dispose(); Clock.Reboot(); BootId = Guid.NewGuid().ToString(); Display.PowerCycle(); Rt = Open(); return Rt; }

    public SessionLease Lease(long revision, long remaining = 1800, long epoch = 7, string device = Device, string keyId = "edge-key-v1", byte[]? seed = null, int? notAfterSeconds = null)
    {
        var now = Rt.Time.IsTrusted ? Rt.Time.TrustedNow : Clock.UtcNow;
        var unsigned = new SessionLease
        {
            ProtocolVersion = 1, LeaseId = Guid.NewGuid().ToString(), TenantId = Tenant, OutletId = Outlet, StationId = Station, DeviceId = device,
            SessionId = "55555555-5555-4555-8555-555555555555", AuthorityEpoch = epoch, Revision = revision, Mode = LeaseMode.FIXED,
            RemainingSecondsAtIssue = remaining, IssuedAt = Iso.Format(now), NotAfter = Iso.Format(now.AddSeconds(notAfterSeconds ?? (int)remaining)),
            Permissions = new List<LeasePermission> { LeasePermission.DISPLAY_GAME }, KeyId = keyId, Signature = "",
        };
        return LeaseCodec.Sign(unsigned, seed ?? SignerSeed);
    }

    public SessionCommand Cmd(CommandAction action, SessionLease? lease, long expected, long desired, long? sequence = null, string? id = null, long epoch = 7, string device = Device, string station = Station)
    {
        var now = Clock.UtcNow;
        return new SessionCommand
        {
            ProtocolVersion = 1, CommandId = id ?? Guid.NewGuid().ToString(), StationId = station, DeviceId = device, AuthorityEpoch = epoch,
            Sequence = sequence ?? ++seq, ExpectedRevision = expected, DesiredRevision = desired, Action = action, Lease = lease,
            IssuedAt = Iso.Format(now), ExpiresAt = Iso.Format(now.AddSeconds(30)), ActorRef = "staff:fixture-cashier",
        };
    }

    public async Task<DeviceAck> StartAsync(long remaining = 1800, long rev = 1)
    {
        var ack = await Rt.HandleAsync(Cmd(CommandAction.START, Lease(rev, remaining), rev - 1, rev));
        Assert(ack.Status == AckStatus.APPLIED, "start must apply, got " + ack.ErrorCode);
        return ack;
    }

    static void Assert(bool ok, string why) { if (!ok) throw new InvalidOperationException(why); }
    public void Dispose() { Rt.Dispose(); try { Directory.Delete(Dir, true); } catch (IOException) { } }
}
