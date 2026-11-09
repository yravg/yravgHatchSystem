using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hatch.Contracts;

namespace Hatch.VenueEdge;

/// <summary>
/// Contract: the venue edge command path (CONTRACTS section 5).
/// Order for every command: (A) cheap checks, (B) one SQLite transaction that records the command, advances the device
/// sequence and queues the RECEIVED ack, (C) only then may any ack leave, (D) apply, (E) one transaction that stores the
/// result and the final ack. A crash between any two steps is safe: B and E are atomic, acks are sent from the outbox
/// at-least-once, and a retried command id finds its row and never applies twice.
/// Time: a running lease is counted on the MONOTONIC clock only. A reboot (different BootId) locks the picture and asks
/// for recovery; time resumes only after trusted reconciliation and never above the last checkpoint.
/// </summary>
public sealed class EdgeRuntime : IDisposable
{
    private readonly EdgeOptions o;
    private readonly SemaphoreSlim gate = new(1, 1);
    private readonly Dictionary<string, StationRow> stations = new();
    private long lastCheckpointMono;

    public EdgeStore Store { get; }
    public TimeTrust Time { get; }
    public string BootId => o.BootId;

    private EdgeRuntime(EdgeOptions options)
    {
        o = options; Store = new EdgeStore(o.DbPath); Time = new TimeTrust(o.Mono); lastCheckpointMono = o.Mono.NowMs;
        // Same-boot restarts keep the anchor: the monotonic clock did not reset, so the trust is still valid.
        Time.Persist = (utc, m) => Store.Atomic(tx => { tx.Meta("trust_utc", Iso.Format(utc)); tx.Meta("trust_mono", m.ToString(CultureInfo.InvariantCulture)); });
    }

    public static EdgeRuntime Open(EdgeOptions options)
    {
        var rt = new EdgeRuntime(options);
        rt.Boot();
        return rt;
    }

    private DateTimeOffset Now => Time.IsTrusted ? Time.TrustedNow : o.Wall.UtcNow;
    private string Stamp => Iso.Format(Now);

    private void Boot()
    {
        var sameBoot = Store.GetMeta("boot_id") == o.BootId;
        foreach (var s in Store.Stations()) stations[s.StationId] = s;
        if (sameBoot && Store.GetMeta("trust_utc") is { } u && Store.GetMeta("trust_mono") is { } m)
            Time.Restore(DateTimeOffset.Parse(u, CultureInfo.InvariantCulture), long.Parse(m, CultureInfo.InvariantCulture));
        Store.Atomic(tx =>
        {
            tx.Meta("boot_id", o.BootId);
            foreach (var s in stations.Values)
            {
                if (!sameBoot && s.State is StationState.Running or StationState.Paused)
                {
                    // Reboot: the monotonic base is gone and the wall clock is not evidence. Keep the checkpoint, lock, wait.
                    s.State = StationState.RecoveryRequired; s.LockReason = "RECOVERY_REQUIRED";
                    tx.SaveStation(s); tx.Event(Stamp, "lease.recovery_required", s.StationId);
                }
            }
        });
        // Fail closed at every start, whatever the stored state says; a running lease re-unlocks only after this point.
        foreach (var s in stations.Values)
        {
            if (s.State == StationState.Running) SetPicture(true);
            else SetPicture(false);
        }
    }

    private void SetPicture(bool unlocked)
    {
        try { o.Display.SetPictureUnlocked(unlocked); }
        catch (Exception) when (unlocked) { try { o.Display.SetPictureUnlocked(false); } catch (Exception) { /* nothing more to do: stays locked */ } throw; }
    }

    /// <summary>Binds a station to its paired device. A new station starts locked.</summary>
    public void RegisterStation(string stationId, string deviceId)
    {
        Store.RegisterStation(stationId, deviceId);
        stations[stationId] = Store.Stations().First(x => x.StationId == stationId);
    }

    // ---------- views ----------
    private static long Remaining(StationRow s, long monoNow) =>
        s.State == StationState.Running ? Math.Max(0, s.RemainingMs - (monoNow - s.AnchorMono)) : s.RemainingMs;

    public StationView View(string stationId)
    {
        var s = stations[stationId];
        return new StationView(s.State, Remaining(s, o.Mono.NowMs) / 1000, s.Revision, o.Display.PictureUnlocked && s.State == StationState.Running, s.State == StationState.Running ? null : s.LockReason);
    }

    // ---------- money / issuing ----------
    public bool AuthorizeMoney(MoneyAction action) => OfflinePolicy.Allows(action, o.Network.CloudReachable);

    /// <summary>The edge signs a lease with its own key under its own epoch. Refused offline (allowance 0), fenced, or without trusted time.</summary>
    public SessionLease IssueLease(string stationId, string deviceId, string sessionId, long remainingSeconds, long revision)
    {
        if (!o.Network.CloudReachable) throw new EdgeRefusal("OFFLINE_NOT_ALLOWED");
        if (!Time.IsTrusted) throw new EdgeRefusal("TIME_UNTRUSTED");
        if (Store.Fenced) throw new EdgeRefusal("EDGE_FENCED");
        if (o.Signer is null) throw new EdgeRefusal("NO_SIGNER");
        var now = Time.TrustedNow;
        var unsigned = new SessionLease
        {
            ProtocolVersion = 1, LeaseId = Guid.NewGuid().ToString(), TenantId = "", OutletId = "", StationId = stationId, DeviceId = deviceId, SessionId = sessionId,
            AuthorityEpoch = Store.OwnEpoch!.Value, Revision = revision, Mode = LeaseMode.FIXED, RemainingSecondsAtIssue = remainingSeconds,
            IssuedAt = Iso.Format(now), NotAfter = Iso.Format(now.AddSeconds(remainingSeconds)), Permissions = new List<LeasePermission> { LeasePermission.DISPLAY_GAME },
            KeyId = o.SignerKeyId, Signature = "",
        };
        return unsigned with { Signature = B64u.Encode(o.Signer.Sign(System.Text.Encoding.UTF8.GetBytes(LeaseCodec.Payload(unsigned)))) };
    }

    // ---------- time ----------
    /// <summary>Authoritative reconciliation or approved trusted clock evidence. Re-anchors trusted time, then lets stations that
    /// were waiting for recovery continue with min(checkpoint, signed deadline, authoritative remaining). Never more.</summary>
    public void Reconcile(DateTimeOffset trustedUtc, string source, long? authoritativeRemainingSeconds = null)
    {
        gate.Wait();
        try
        {
            Time.Establish(trustedUtc, source);
            var mono = o.Mono.NowMs;
            Store.Atomic(tx =>
            {
                foreach (var s in stations.Values.Where(x => x.State == StationState.RecoveryRequired))
                {
                    var rem = s.RemainingMs;
                    if (s.NotAfter is { } na) rem = Math.Min(rem, (long)(Iso.Parse(na) - trustedUtc).TotalMilliseconds);
                    if (authoritativeRemainingSeconds is { } a) rem = Math.Min(rem, a * 1000);
                    if (rem <= 0) { s.State = StationState.Locked; s.LockReason = "EXPIRED"; s.RemainingMs = 0; tx.Event(Stamp, "lease.expired", s.StationId); }
                    else { s.State = StationState.Running; s.LockReason = null; s.RemainingMs = rem; s.AnchorMono = mono; tx.Event(Stamp, "lease.reconciled", s.StationId); }
                    tx.SaveStation(s);
                }
            });
            foreach (var s in stations.Values) { if (s.State == StationState.Running) SetPicture(true); else if (s.State == StationState.Locked) SetPicture(false); }
        }
        finally { gate.Release(); }
    }

    /// <summary>Enforces local expiry and writes a checkpoint now and then. Safe to call as often as wanted.</summary>
    public void Tick()
    {
        gate.Wait();
        try
        {
            var mono = o.Mono.NowMs;
            var due = mono - lastCheckpointMono >= o.CheckpointSeconds * 1000L;
            Store.Atomic(tx =>
            {
                foreach (var s in stations.Values.Where(x => x.State == StationState.Running))
                {
                    var rem = Remaining(s, mono);
                    if (rem <= 0)
                    {
                        s.State = StationState.Locked; s.LockReason = "EXPIRED"; s.RemainingMs = 0; tx.SaveStation(s); tx.Event(Stamp, "lease.expired", s.StationId);
                        SetPicture(false); BestEffortCec(tx);
                    }
                    else if (due) { s.RemainingMs = rem; s.AnchorMono = mono; tx.SaveStation(s); }
                }
            });
            if (due) lastCheckpointMono = mono;
        }
        finally { gate.Release(); }
    }

    private void BestEffortCec(EdgeStore.Tx tx)
    {
        if (o.Cec is null) return;
        try { o.Cec.Standby(); } catch (Exception) { tx.Event(Stamp, "cec.optional.failed"); } // never the only path, never fatal
    }

    // ---------- commands ----------
    private DeviceAck Ack(SessionCommand c, AckStatus status, string? error = null) => new()
    {
        ProtocolVersion = 1, CommandId = c.CommandId, DeviceId = c.DeviceId, AuthorityEpoch = c.AuthorityEpoch, Sequence = c.Sequence, DesiredRevision = c.DesiredRevision,
        Status = status, VerificationLevel = o.Display.Level, BootId = o.BootId, ObservedAt = Stamp, ErrorCode = error,
    };
    private static string Json(DeviceAck a) => JsonSerializer.Serialize(a, LeaseCodec.Options);

    public async Task<DeviceAck> HandleAsync(SessionCommand c, CancellationToken ct = default)
    {
        await gate.WaitAsync(ct);
        try
        {
            DeviceAck final;
            if (Store.Command(c.CommandId) is { } seen)
            {
                if (seen.FinalAck is not null) final = JsonSerializer.Deserialize<DeviceAck>(seen.FinalAck, LeaseCodec.Options)!; // duplicate: same answer, no effect
                else final = Apply(c);                                                                                          // died after B: finish once
            }
            else if (EarlyReject(c) is { } code)
            {
                final = Ack(c, AckStatus.FAILED, code);
                Store.Atomic(tx =>
                {
                    tx.Exec("INSERT INTO commands (command_id, device_id, sequence, status, final_ack, received_at) VALUES ($c, $d, $s, 'FAILED', $f, $a)",
                        ("$c", c.CommandId), ("$d", c.DeviceId), ("$s", c.Sequence), ("$f", Json(final)), ("$a", Stamp));
                    tx.Outbox(Stamp, c.CommandId, "FAILED", Json(final)); tx.Event(Stamp, "command.rejected", c.StationId, code);
                });
            }
            else
            {
                Store.Atomic(tx =>
                {
                    tx.Exec("INSERT INTO commands (command_id, device_id, sequence, status, received_at) VALUES ($c, $d, $s, 'RECEIVED', $a)",
                        ("$c", c.CommandId), ("$d", c.DeviceId), ("$s", c.Sequence), ("$a", Stamp));
                    tx.Exec("INSERT INTO device_seq (device_id, last_sequence) VALUES ($d, $s) ON CONFLICT (device_id) DO UPDATE SET last_sequence = $s", ("$d", c.DeviceId), ("$s", c.Sequence));
                    tx.Outbox(Stamp, c.CommandId, "RECEIVED", Json(Ack(c, AckStatus.RECEIVED))); tx.Event(Stamp, "command.received", c.StationId, c.Action.ToString());
                    o.Faults?.At("before-commit");
                });
                o.Faults?.At("after-commit");
                await FlushCoreAsync(ct); // RECEIVED leaves only now, after the commit
                final = Apply(c);
            }
            await FlushCoreAsync(ct);
            return final;
        }
        finally { gate.Release(); }
    }

    private string? EarlyReject(SessionCommand c)
    {
        if (!stations.TryGetValue(c.StationId, out var s)) return "STATION_MISMATCH";
        if (s.DeviceId != c.DeviceId) return "DEVICE_MISMATCH";
        if (Store.IsRevoked(c.DeviceId)) return "DEVICE_REVOKED";
        if (c.AuthorityEpoch < Store.ObservedEpoch) return "STALE_EPOCH";
        if (c.AuthorityEpoch > Store.ObservedEpoch) return "EPOCH_UNKNOWN";
        if (c.Sequence <= Store.LastSequence(c.DeviceId)) return "SEQUENCE_REPLAY";
        if (Time.IsTrusted && Time.TrustedNow > Iso.Parse(c.ExpiresAt)) return "COMMAND_EXPIRED";
        if (c.Action == CommandAction.SAFE_CONTROL) return "SAFE_CONTROL_UNSUPPORTED"; // no arbitrary shell, URL or script
        if (c.ExpectedRevision != s.Revision) return "REVISION_CONFLICT";
        return null;
    }

    private DeviceAck Apply(SessionCommand c)
    {
        var s = stations[c.StationId];
        var mono = o.Mono.NowMs;
        string? fail = null;
        var kind = "";
        long? newRemainingMs = null; string? notAfter = null, leaseJson = null;
        var picture = o.Display.PictureUnlocked;

        switch (c.Action)
        {
            case CommandAction.PREPARE: kind = "lease.prepared"; break;
            case CommandAction.START:
            case CommandAction.EXTEND:
                fail = CheckGrant(c, s, out newRemainingMs, out notAfter, out leaseJson);
                if (fail is null) { picture = true; kind = c.Action == CommandAction.START ? "lease.started" : "lease.extended"; }
                break;
            case CommandAction.PAUSE:
                if (s.State != StationState.Running) fail = "INVALID_TRANSITION";
                else { newRemainingMs = Remaining(s, mono); picture = false; kind = "lease.paused"; }
                break;
            case CommandAction.RESUME:
                if (s.State == StationState.RecoveryRequired) fail = "RECOVERY_REQUIRED";
                else if (s.State != StationState.Paused) fail = "INVALID_TRANSITION";
                else if (!Time.IsTrusted) fail = "TIME_UNTRUSTED";
                else { picture = true; kind = "lease.resumed"; }
                break;
            case CommandAction.END: picture = false; newRemainingMs = 0; kind = "lease.ended"; break;
            case CommandAction.LOCK: picture = false; kind = "lease.locked"; break;
            default: fail = "UNSUPPORTED"; break;
        }

        if (fail is null && c.Action is CommandAction.START or CommandAction.RESUME or CommandAction.EXTEND && picture)
        {
            try { SetPicture(true); } catch (Exception) { fail = "DISPLAY_FAILED"; }
        }
        else if (fail is null && !picture) SetPicture(false); // lock before we claim anything

        DeviceAck final;
        if (fail is not null)
        {
            final = Ack(c, AckStatus.FAILED, fail);
            Store.Atomic(tx => { Finish(tx, c, final, "FAILED"); tx.Event(Stamp, "command.failed", c.StationId, fail); });
            return final;
        }

        switch (c.Action)
        {
            case CommandAction.START: case CommandAction.EXTEND:
                s.State = StationState.Running; s.RemainingMs = newRemainingMs!.Value; s.AnchorMono = mono; s.LockReason = null; s.NotAfter = notAfter; s.LeaseJson = leaseJson; break;
            case CommandAction.PAUSE: s.State = StationState.Paused; s.RemainingMs = newRemainingMs!.Value; s.LockReason = "PAUSED"; break;
            case CommandAction.RESUME: s.State = StationState.Running; s.AnchorMono = mono; s.LockReason = null; break;
            case CommandAction.END: s.State = StationState.Locked; s.RemainingMs = 0; s.LockReason = "ENDED"; break;
            case CommandAction.LOCK: s.State = StationState.Locked; s.RemainingMs = Remaining(s, mono); s.LockReason = "LOCKED"; break;
        }
        s.Revision = c.DesiredRevision;
        final = Ack(c, AckStatus.APPLIED);
        Store.Atomic(tx =>
        {
            tx.SaveStation(s); if (kind != "") tx.Event(Stamp, kind, c.StationId);
            Finish(tx, c, final, "APPLIED");
        });
        return final;
    }

    private void Finish(EdgeStore.Tx tx, SessionCommand c, DeviceAck final, string status)
    {
        tx.Exec("UPDATE commands SET status = $s, final_ack = $f WHERE command_id = $c", ("$s", status), ("$f", Json(final)), ("$c", c.CommandId));
        tx.Outbox(Stamp, c.CommandId, status, Json(final));
    }

    /// <summary>START and EXTEND are grants: they need the cloud, trusted time, an unfenced edge, a ready display and a lease that verifies.</summary>
    private string? CheckGrant(SessionCommand c, StationRow s, out long? remainingMs, out string? notAfter, out string? leaseJson)
    {
        remainingMs = null; notAfter = null; leaseJson = null;
        if (!OfflinePolicy.Allows(MoneyAction.NewStart, o.Network.CloudReachable)) return "OFFLINE_NOT_ALLOWED";
        if (!Time.IsTrusted) return "TIME_UNTRUSTED";
        if (Store.Fenced) return "EDGE_FENCED";
        if (c.Action == CommandAction.START && s.State != StationState.Locked) return "INVALID_TRANSITION";
        if (c.Action == CommandAction.EXTEND && s.State is not (StationState.Running or StationState.Paused)) return "INVALID_TRANSITION";
        if (c.Lease is not { } l) return "LEASE_REQUIRED";
        if (!o.Display.Probe()) return "DEVICE_NOT_READY";
        if (l.DeviceId != c.DeviceId || l.StationId != c.StationId) return "LEASE_DEVICE_MISMATCH";
        if (l.Revision != c.DesiredRevision) return "REVISION_CONFLICT";
        var now = Time.TrustedNow;
        switch (LeaseVerifier.Verify(l, Store.TrustBundle(), now, Store.ObservedEpoch))
        {
            case LeaseRejection.UNKNOWN_SIGNER: return "LEASE_UNKNOWN_SIGNER";
            case LeaseRejection.BAD_SIGNATURE: return "LEASE_BAD_SIGNATURE";
            case LeaseRejection.STALE_EPOCH: return "STALE_EPOCH";
            case LeaseRejection.EXPIRED: return "LEASE_EXPIRED";
            case LeaseRejection.NOT_YET_VALID: return "LEASE_NOT_YET_VALID";
        }
        var na = Iso.Parse(l.NotAfter);
        var viaIssue = l.RemainingSecondsAtIssue * 1000 - Math.Max(0, (long)(now - Iso.Parse(l.IssuedAt)).TotalMilliseconds);
        remainingMs = Math.Max(0, Math.Min(viaIssue, (long)(na - now).TotalMilliseconds));
        notAfter = l.NotAfter; leaseJson = JsonSerializer.Serialize(l, LeaseCodec.Options);
        return null;
    }

    // ---------- outbox (at-least-once) ----------
    public async Task FlushOutboxAsync(CancellationToken ct = default)
    {
        await gate.WaitAsync(ct);
        try { await FlushCoreAsync(ct); } finally { gate.Release(); }
    }

    private async Task FlushCoreAsync(CancellationToken ct)
    {
        foreach (var (id, payload) in Store.Unsent())
        {
            try { await o.Sink.SendAsync(JsonSerializer.Deserialize<DeviceAck>(payload, LeaseCodec.Options)!, ct); }
            catch (Exception e) when (e is not OperationCanceledException) { return; } // stays queued, retried on the next flush
            Store.MarkSent(id, Stamp);
        }
    }

    public void Dispose() => Store.Dispose();
}
