using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Hatch.Contracts;

namespace Hatch.VenueEdge;

public interface IMonotonicClock { long NowMs { get; } }
public interface IWallClock { DateTimeOffset UtcNow { get; } }
public sealed class SystemClocks : IMonotonicClock, IWallClock
{
    public long NowMs => System.Diagnostics.Stopwatch.GetTimestamp() * 1000 / System.Diagnostics.Stopwatch.Frequency;
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}

public interface INetworkState { bool CloudReachable { get; set; } }
public interface IAckSink { Task SendAsync(DeviceAck ack, CancellationToken ct = default); }
public interface IFaultInjector { void At(string point); }

/// <summary>The only thing the edge asks of a screen: let the picture through, or block it. There is deliberately no
/// console power method (never cut console mains; picture gating is not console shutdown).</summary>
public interface IDisplayAdapter
{
    string Label { get; }
    VerificationLevel Level { get; }
    bool PictureUnlocked { get; }
    bool Probe();
    void SetPictureUnlocked(bool unlocked);
}

/// <summary>OPTIONAL TV-side CEC power driver (D28). May be absent or unsupported; the lock never depends on it.</summary>
public interface ICecDriver { bool Supported { get; } void Standby(); }

/// <summary>SIMULATOR. No hardware is touched. PowerCalls stays empty by construction: nothing in the edge can request console power.</summary>
public sealed class SimulatedDisplay : IDisplayAdapter
{
    public string Label => "SIMULATOR";
    public VerificationLevel Level => VerificationLevel.SIMULATED;
    public bool PictureUnlocked { get; private set; }
    public bool Ready { get; set; } = true;
    public readonly List<string> PowerCalls = new();
    public bool Probe() => Ready;
    public void SetPictureUnlocked(bool unlocked) { if (unlocked && !Ready) throw new InvalidOperationException("display not ready"); PictureUnlocked = unlocked; }
    public void PowerCycle() => PictureUnlocked = false; // a restarted TV comes back with the picture blocked
}

public enum StationState { Locked, Running, Paused, RecoveryRequired }
public sealed record StationView(StationState State, long RemainingSeconds, long Revision, bool PictureUnlocked, string? LockReason);
public sealed record CecAttestation(bool TvCecOff, bool ConsoleCecOff, string AttestedBy);

public enum MoneyAction { NewStart, WalletSpend, Refund }

/// <summary>D07: offline allowance is zero. Online only means the cloud may be asked; the edge never decides money.</summary>
public static class OfflinePolicy
{
    public const long AllowanceIdr = 0;
    public static bool Allows(MoneyAction _, bool cloudReachable) => cloudReachable;
}

public sealed class EdgeRefusal : Exception
{
    public string Code { get; }
    public EdgeRefusal(string code) : base(code) => Code = code;
}

public sealed record EdgeOptions
{
    public required string DbPath { get; init; }
    public required IMonotonicClock Mono { get; init; }
    public required IWallClock Wall { get; init; }
    public required IAckSink Sink { get; init; }
    public required IDisplayAdapter Display { get; init; }
    public required INetworkState Network { get; init; }
    public DeviceIdentity? Signer { get; init; }
    public string SignerKeyId { get; init; } = "edge-key-v1";
    public ICecDriver? Cec { get; init; }
    public IFaultInjector? Faults { get; init; }
    /// <summary>Identifies the machine boot (Linux /proc/sys/kernel/random/boot_id). A process restart inside one boot keeps
    /// the monotonic clock; a different value means a reboot and the edge fails closed.</summary>
    public string BootId { get; init; } = Guid.NewGuid().ToString();
    public int CheckpointSeconds { get; init; } = 30;
}

/// <summary>Trusted time = a server/approved anchor plus MONOTONIC elapsed time. The wall clock is never consulted after the
/// anchor, so rolling it back or forward changes nothing. Untrusted until Establish runs, every boot.</summary>
public sealed class TimeTrust
{
    private readonly IMonotonicClock mono;
    private DateTimeOffset anchorUtc; private long anchorMono; private bool trusted;
    public TimeTrust(IMonotonicClock mono) => this.mono = mono;
    public bool IsTrusted => trusted;
    public string? Source { get; private set; }
    internal Action<DateTimeOffset, long>? Persist;
    public void Establish(DateTimeOffset trustedUtc, string source) { anchorUtc = trustedUtc; anchorMono = mono.NowMs; trusted = true; Source = source; Persist?.Invoke(trustedUtc, anchorMono); }
    internal void Restore(DateTimeOffset utc, long monoMs) { anchorUtc = utc; anchorMono = monoMs; trusted = true; Source = "restored-same-boot"; }
    internal (DateTimeOffset Utc, long Mono) Anchor => (anchorUtc, anchorMono);
    public DateTimeOffset TrustedNow => trusted ? anchorUtc.AddMilliseconds(mono.NowMs - anchorMono) : throw new InvalidOperationException("time is not trusted");
}

public sealed class NetworkProof
{
    public int Attempts, Refused, Succeeded;
    public long BytesSent;
    public string? LastError;
}

/// <summary>SIMULATOR transport: refuses every connection and sends nothing. Stands in for "all egress blocked".</summary>
public sealed class RefusingHandler : HttpMessageHandler
{
    public int Attempts;
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
    {
        Attempts++;
        throw new HttpRequestException("connection refused (simulated: all egress blocked)");
    }
}

/// <summary>Probes cloud reachability through whatever handler it is given and records the outcome as proof.</summary>
public sealed class CloudLink
{
    private readonly Uri endpoint; private readonly HttpClient http; private readonly INetworkState state;
    public NetworkProof Proof { get; } = new();
    public CloudLink(Uri endpoint, HttpMessageHandler handler, INetworkState state) { this.endpoint = endpoint; http = new HttpClient(handler); this.state = state; }
    public async Task ProbeAsync(CancellationToken ct = default)
    {
        Proof.Attempts++;
        try
        {
            using var res = await http.GetAsync(endpoint, ct);
            Proof.Succeeded++; state.CloudReachable = true;
        }
        catch (HttpRequestException e) { Proof.Refused++; Proof.LastError = e.Message; state.CloudReachable = false; }
    }
}
