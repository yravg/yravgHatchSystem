using System.Linq;
using System.Threading.Tasks;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Microsoft.Data.Sqlite;
using Xunit;

namespace Hatch.VenueEdge.Tests;

/// <summary>AC-HS-50: every event/outbox row is durable BEFORE the ACK leaves. Process death is injected in-process at
/// the commit boundary and the database is reopened from the file (simulator evidence, not a real kill -9).</summary>
public class PersistBeforeAckTests
{
    static long Count(Rig r, string sql)
    {
        using var c = new SqliteConnection($"Data Source={r.Db};Mode=ReadOnly");
        c.Open();
        using var cmd = c.CreateCommand(); cmd.CommandText = sql;
        return (long)cmd.ExecuteScalar()!;
    }

    [Fact]
    public void Database_is_wal_with_full_synchronous()
    {
        using var r = new Rig();
        using var c = new SqliteConnection($"Data Source={r.Db}"); c.Open();
        using var m = c.CreateCommand(); m.CommandText = "PRAGMA journal_mode"; Assert.Equal("wal", (string)m.ExecuteScalar()!);
        Assert.Equal("FULL", r.Rt.Store.SynchronousMode);
    }

    [Fact]
    public async Task The_outbox_row_is_committed_before_the_sink_sees_the_ack()
    {
        using var r = new Rig();
        long seenInOutbox = -1;
        r.Sink.OnSend = a => seenInOutbox = Count(r, $"SELECT count(*) FROM outbox WHERE command_id = '{a.CommandId}' AND status = '{a.Status}'");
        await r.StartAsync();
        Assert.NotEmpty(r.Sink.Sent);
        Assert.Equal(1, seenInOutbox); // read through a second connection: it was already committed
    }

    [Fact]
    public async Task Death_before_commit_leaves_nothing_and_sends_nothing_then_the_retry_works()
    {
        using var r = new Rig();
        var cmd = r.Cmd(CommandAction.START, r.Lease(1), 0, 1);
        r.Faults.Point = "before-commit";
        await Assert.ThrowsAsync<CrashException>(() => r.Rt.HandleAsync(cmd));
        Assert.Empty(r.Sink.Sent);
        r.Rt.Dispose();
        Assert.Equal(0, Count(r, "SELECT count(*) FROM outbox"));
        Assert.Equal(0, Count(r, "SELECT count(*) FROM commands"));
        r.Rt = r.Open();
        var ack = await r.Rt.HandleAsync(cmd);
        Assert.Equal(AckStatus.APPLIED, ack.Status);
        Assert.Equal(1, Count(r, $"SELECT count(*) FROM outbox WHERE command_id = '{cmd.CommandId}' AND status = 'RECEIVED'"));
    }

    [Fact]
    public async Task Death_after_commit_keeps_the_row_resends_from_the_outbox_and_applies_once()
    {
        using var r = new Rig();
        var cmd = r.Cmd(CommandAction.START, r.Lease(1), 0, 1);
        r.Faults.Point = "after-commit";
        await Assert.ThrowsAsync<CrashException>(() => r.Rt.HandleAsync(cmd));
        Assert.Empty(r.Sink.Sent); // the ack never left
        r.Rt.Dispose();
        Assert.Equal(1, Count(r, $"SELECT count(*) FROM outbox WHERE command_id = '{cmd.CommandId}' AND status = 'RECEIVED' AND sent_at IS NULL"));
        r.Rt = r.Open();
        await r.Rt.FlushOutboxAsync();
        Assert.Contains(r.Sink.Sent, a => a.CommandId == cmd.CommandId && a.Status == AckStatus.RECEIVED);
        // the controller retries the same command (at-least-once): one effect, no second RECEIVED row
        var ack = await r.Rt.HandleAsync(cmd);
        Assert.Equal(AckStatus.APPLIED, ack.Status);
        await r.Rt.HandleAsync(cmd);
        Assert.Equal(1, Count(r, $"SELECT count(*) FROM outbox WHERE command_id = '{cmd.CommandId}' AND status = 'RECEIVED'"));
        Assert.Equal(1, Count(r, $"SELECT count(*) FROM outbox WHERE command_id = '{cmd.CommandId}' AND status = 'APPLIED'"));
        Assert.Equal(1800, r.Rt.View(Rig.Station).RemainingSeconds);
    }

    [Fact]
    public async Task Events_are_append_only_and_ordered()
    {
        using var r = new Rig();
        await r.StartAsync();
        r.Rt.HandleAsync(r.Cmd(CommandAction.PAUSE, null, 1, 2)).GetAwaiter().GetResult();
        var kinds = r.Rt.Store.EventKinds();
        Assert.True(kinds.IndexOf("lease.started") >= 0 && kinds.IndexOf("lease.started") < kinds.IndexOf("lease.paused"));
        Assert.Throws<SqliteException>(() => r.Rt.Store.Unsafe("UPDATE events SET kind = 'x'"));
        Assert.Throws<SqliteException>(() => r.Rt.Store.Unsafe("DELETE FROM events"));
    }
}
