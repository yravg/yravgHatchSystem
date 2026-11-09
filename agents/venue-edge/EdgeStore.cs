using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Data.Sqlite;

namespace Hatch.VenueEdge;

public sealed class StationRow
{
    public required string StationId { get; set; }
    public required string DeviceId { get; set; }
    public StationState State { get; set; } = StationState.Locked;
    public long Revision { get; set; }
    public long RemainingMs { get; set; }
    public long AnchorMono { get; set; }
    public string? LockReason { get; set; }
    public string? NotAfter { get; set; }
    public string? LeaseJson { get; set; }
}

public sealed record CommandRecord(string CommandId, string Status, string? FinalAck);

/// <summary>SQLite in WAL mode with synchronous=FULL: a committed row survives power loss. One connection, one lock.
/// Events are append-only (triggers refuse UPDATE and DELETE). The signing key is never stored here, only public keys.</summary>
public sealed class EdgeStore : IDisposable
{
    private readonly SqliteConnection db;
    private readonly object gate = new();

    public EdgeStore(string path)
    {
        db = new SqliteConnection($"Data Source={path};Pooling=False");
        db.Open();
        Exec("PRAGMA journal_mode=WAL");
        Exec("PRAGMA synchronous=FULL");
        Exec("""
            CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, kind TEXT NOT NULL, station_id TEXT, payload TEXT);
            CREATE TRIGGER IF NOT EXISTS events_no_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT, 'events are append-only'); END;
            CREATE TRIGGER IF NOT EXISTS events_no_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT, 'events are append-only'); END;
            CREATE TABLE IF NOT EXISTS outbox (id INTEGER PRIMARY KEY AUTOINCREMENT, command_id TEXT NOT NULL, status TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL, sent_at TEXT, UNIQUE (command_id, status));
            CREATE TABLE IF NOT EXISTS commands (command_id TEXT PRIMARY KEY, device_id TEXT NOT NULL, sequence INTEGER NOT NULL, status TEXT NOT NULL, final_ack TEXT, received_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS device_seq (device_id TEXT PRIMARY KEY, last_sequence INTEGER NOT NULL);
            CREATE TABLE IF NOT EXISTS stations (station_id TEXT PRIMARY KEY, device_id TEXT NOT NULL, state TEXT NOT NULL, revision INTEGER NOT NULL, remaining_ms INTEGER NOT NULL, anchor_mono_ms INTEGER NOT NULL, lock_reason TEXT, not_after TEXT, lease_json TEXT);
            CREATE TABLE IF NOT EXISTS trust (key_id TEXT PRIMARY KEY, public_key TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS revoked_devices (device_id TEXT PRIMARY KEY);
            CREATE TABLE IF NOT EXISTS cec_attestation (id INTEGER PRIMARY KEY CHECK (id = 1), tv_cec_off INTEGER NOT NULL, console_cec_off INTEGER NOT NULL, attested_by TEXT NOT NULL);
            """);
    }

    public string SynchronousMode => (Scalar("PRAGMA synchronous") switch { 0L => "OFF", 1L => "NORMAL", 2L => "FULL", 3L => "EXTRA", _ => "?" });

    private void Exec(string sql, params (string, object?)[] p) { lock (gate) { using var c = Cmd(sql, p); c.ExecuteNonQuery(); } }
    private object? Scalar(string sql, params (string, object?)[] p) { lock (gate) { using var c = Cmd(sql, p); return c.ExecuteScalar(); } }
    private SqliteCommand Cmd(string sql, (string, object?)[] p, SqliteTransaction? tx = null)
    {
        var c = db.CreateCommand(); c.CommandText = sql; c.Transaction = tx;
        foreach (var (n, v) in p) c.Parameters.AddWithValue(n, v ?? DBNull.Value);
        return c;
    }

    /// <summary>Runs the body in one transaction and commits when it returns. An exception rolls everything back.</summary>
    public void Atomic(Action<Tx> body)
    {
        lock (gate)
        {
            using var tx = db.BeginTransaction();
            body(new Tx(this, tx));
            tx.Commit();
        }
    }

    public sealed class Tx
    {
        private readonly EdgeStore s; private readonly SqliteTransaction t;
        internal Tx(EdgeStore s, SqliteTransaction t) { this.s = s; this.t = t; }
        public void Exec(string sql, params (string, object?)[] p) { using var c = s.Cmd(sql, p, t); c.ExecuteNonQuery(); }
        public void Event(string at, string kind, string? stationId = null, string? payload = null) =>
            Exec("INSERT INTO events (at, kind, station_id, payload) VALUES ($a, $k, $s, $p)", ("$a", at), ("$k", kind), ("$s", stationId), ("$p", payload));
        public void Outbox(string at, string commandId, string status, string payload) =>
            Exec("INSERT OR IGNORE INTO outbox (command_id, status, payload, created_at) VALUES ($c, $s, $p, $a)", ("$c", commandId), ("$s", status), ("$p", payload), ("$a", at));
        public void Meta(string key, string value) => Exec("INSERT INTO meta (key, value) VALUES ($k, $v) ON CONFLICT (key) DO UPDATE SET value = $v", ("$k", key), ("$v", value));
        public void SaveStation(StationRow r) => Exec("""
            INSERT INTO stations (station_id, device_id, state, revision, remaining_ms, anchor_mono_ms, lock_reason, not_after, lease_json)
            VALUES ($id, $d, $st, $rev, $rem, $an, $lr, $na, $lj)
            ON CONFLICT (station_id) DO UPDATE SET state = $st, revision = $rev, remaining_ms = $rem, anchor_mono_ms = $an, lock_reason = $lr, not_after = $na, lease_json = $lj
            """, ("$id", r.StationId), ("$d", r.DeviceId), ("$st", r.State.ToString()), ("$rev", r.Revision), ("$rem", r.RemainingMs), ("$an", r.AnchorMono),
            ("$lr", r.LockReason), ("$na", r.NotAfter), ("$lj", r.LeaseJson));
    }

    private List<T> Query<T>(string sql, Func<SqliteDataReader, T> map, params (string, object?)[] p)
    {
        lock (gate)
        {
            using var c = Cmd(sql, p); using var r = c.ExecuteReader();
            var o = new List<T>(); while (r.Read()) o.Add(map(r)); return o;
        }
    }

    public string? GetMeta(string key) => Scalar("SELECT value FROM meta WHERE key = $k", ("$k", key)) as string;
    public void SetMeta(string key, string value) => Atomic(t => t.Meta(key, value));

    // ---- authority epoch (D07: one fenced epoch per outlet) ----
    public long? OwnEpoch => GetMeta("own_epoch") is { } s ? long.Parse(s, CultureInfo.InvariantCulture) : null;
    public long ObservedEpoch => GetMeta("observed_epoch") is { } s ? long.Parse(s, CultureInfo.InvariantCulture) : 0;
    /// <summary>The cloud granted this edge the epoch. Both counters move together.</summary>
    public void ClaimAuthority(long epoch) => Atomic(t => { t.Meta("own_epoch", epoch.ToString(CultureInfo.InvariantCulture)); t.Meta("observed_epoch", epoch.ToString(CultureInfo.InvariantCulture)); });
    /// <summary>A higher epoch exists somewhere: remember it. If it is not ours the edge is fenced and stops granting.</summary>
    public void ObserveEpoch(long epoch) { if (epoch > ObservedEpoch) SetMeta("observed_epoch", epoch.ToString(CultureInfo.InvariantCulture)); }
    public bool Fenced => OwnEpoch is not { } own || own != ObservedEpoch;

    // ---- trust and revocation ----
    public void SetTrust(string keyId, string publicKeyB64u) => Exec("INSERT INTO trust (key_id, public_key) VALUES ($k, $p) ON CONFLICT (key_id) DO UPDATE SET public_key = $p", ("$k", keyId), ("$p", publicKeyB64u));
    public IReadOnlyDictionary<string, string> TrustBundle() { var d = new Dictionary<string, string>(); foreach (var (k, p) in Query("SELECT key_id, public_key FROM trust", r => (r.GetString(0), r.GetString(1)))) d[k] = p; return d; }
    public void RevokeDevice(string deviceId) => Exec("INSERT OR IGNORE INTO revoked_devices (device_id) VALUES ($d)", ("$d", deviceId));
    public bool IsRevoked(string deviceId) => Scalar("SELECT 1 FROM revoked_devices WHERE device_id = $d", ("$d", deviceId)) is not null;

    public void RecordCecAttestation(bool tvCecOff, bool consoleCecOff, string attestedBy) =>
        Exec("INSERT INTO cec_attestation (id, tv_cec_off, console_cec_off, attested_by) VALUES (1, $t, $c, $a) ON CONFLICT (id) DO UPDATE SET tv_cec_off = $t, console_cec_off = $c, attested_by = $a",
            ("$t", tvCecOff ? 1 : 0), ("$c", consoleCecOff ? 1 : 0), ("$a", attestedBy));
    public CecAttestation? CecAttestationRecord() => Query("SELECT tv_cec_off, console_cec_off, attested_by FROM cec_attestation", r => new CecAttestation(r.GetInt64(0) == 1, r.GetInt64(1) == 1, r.GetString(2))) is { Count: 1 } l ? l[0] : null;

    // ---- stations, commands, outbox ----
    public void RegisterStation(string stationId, string deviceId) =>
        Exec("INSERT INTO stations (station_id, device_id, state, revision, remaining_ms, anchor_mono_ms) VALUES ($s, $d, 'Locked', 0, 0, 0) ON CONFLICT (station_id) DO UPDATE SET device_id = $d", ("$s", stationId), ("$d", deviceId));

    public List<StationRow> Stations() => Query("SELECT station_id, device_id, state, revision, remaining_ms, anchor_mono_ms, lock_reason, not_after, lease_json FROM stations", r => new StationRow
    {
        StationId = r.GetString(0), DeviceId = r.GetString(1), State = Enum.Parse<StationState>(r.GetString(2)), Revision = r.GetInt64(3), RemainingMs = r.GetInt64(4),
        AnchorMono = r.GetInt64(5), LockReason = r.IsDBNull(6) ? null : r.GetString(6), NotAfter = r.IsDBNull(7) ? null : r.GetString(7), LeaseJson = r.IsDBNull(8) ? null : r.GetString(8),
    });

    public CommandRecord? Command(string commandId) => Query("SELECT command_id, status, final_ack FROM commands WHERE command_id = $c",
        r => new CommandRecord(r.GetString(0), r.GetString(1), r.IsDBNull(2) ? null : r.GetString(2)), ("$c", commandId)) is { Count: 1 } l ? l[0] : null;
    public long LastSequence(string deviceId) => Scalar("SELECT last_sequence FROM device_seq WHERE device_id = $d", ("$d", deviceId)) is long n ? n : -1;

    public List<(long Id, string Payload)> Unsent() => Query("SELECT id, payload FROM outbox WHERE sent_at IS NULL ORDER BY id", r => (r.GetInt64(0), r.GetString(1)));
    public void MarkSent(long id, string at) => Exec("UPDATE outbox SET sent_at = $a WHERE id = $i", ("$a", at), ("$i", id));
    public List<string> EventKinds() => Query("SELECT kind FROM events ORDER BY seq", r => r.GetString(0));

    /// <summary>Test hook: raw SQL so a test can prove the append-only triggers refuse to rewrite history.</summary>
    public void Unsafe(string sql) => Exec(sql);
    public void Checkpoint() => Exec("PRAGMA wal_checkpoint(TRUNCATE)");

    public void Dispose() { lock (gate) db.Dispose(); }
}
