using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using Hatch.Contracts;
using Hatch.VenueEdge;
using Xunit;

namespace Hatch.VenueEdge.Tests;

public class IdentityAndVectorTests
{
    [Fact]
    public void The_typescript_signed_vector_verifies_and_the_canonical_payload_is_byte_equal()
    {
        var doc = JsonDocument.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "vectors", "vector.json")));
        var root = doc.RootElement;
        var lease = JsonSerializer.Deserialize<SessionLease>(root.GetProperty("lease").GetRawText())!;
        Assert.Equal(root.GetProperty("canonicalPayload").GetString(), LeaseCodec.Payload(lease));
        var trust = new System.Collections.Generic.Dictionary<string, string> { [root.GetProperty("keyId").GetString()!] = root.GetProperty("publicKey").GetString()! };
        var inside = new DateTimeOffset(2026, 11, 8, 14, 10, 0, TimeSpan.Zero);
        Assert.Null(LeaseVerifier.Verify(lease, trust, inside, 7));
        Assert.Equal(LeaseRejection.BAD_SIGNATURE, LeaseVerifier.Verify(lease with { RemainingSecondsAtIssue = 1801 }, trust, inside, 7));
        Assert.Equal(LeaseRejection.STALE_EPOCH, LeaseVerifier.Verify(lease, trust, inside, 8));
        Assert.Equal(LeaseRejection.EXPIRED, LeaseVerifier.Verify(lease, trust, new DateTimeOffset(2026, 11, 8, 14, 30, 0, TimeSpan.Zero), 7));
    }

    [Fact]
    public void Device_key_is_generated_at_runtime_stored_owner_only_and_proves_possession()
    {
        var dir = Path.Combine(Path.GetTempPath(), "t50-key-" + Guid.NewGuid().ToString("N"));
        try
        {
            var store = new FileKeyStore(Path.Combine(dir, "device.key"));
            var id = DeviceIdentity.LoadOrCreate(store);
            var again = DeviceIdentity.LoadOrCreate(store);
            Assert.Equal(id.PublicKeyB64u, again.PublicKeyB64u);
            if (!OperatingSystem.IsWindows())
                Assert.Equal(UnixFileMode.UserRead | UnixFileMode.UserWrite, File.GetUnixFileMode(Path.Combine(dir, "device.key")));
            const string device = "44444444-4444-4444-8444-444444444444";
            var proof = id.PairingProof(device);
            Assert.True(Ed25519.Verify(B64u.Decode(id.PublicKeyB64u), System.Text.Encoding.UTF8.GetBytes($"hatch-pair-v1:{device}:{id.PublicKeyB64u}"), B64u.Decode(proof)));
            Assert.Equal(43, id.PublicKeyB64u.Length);
            Assert.Equal(86, proof.Length);
        }
        finally { if (Directory.Exists(dir)) Directory.Delete(dir, true); }
    }

    [Fact]
    public void The_private_seed_never_lands_in_the_edge_database()
    {
        using var r = new Rig();
        r.Rt.Store.Checkpoint();
        var bytes = File.ReadAllBytes(r.Db);
        var seed = r.SignerSeed;
        Assert.False(IndexOf(bytes, seed) >= 0);
    }

    static int IndexOf(byte[] hay, byte[] needle)
    {
        for (var i = 0; i + needle.Length <= hay.Length; i++)
            if (hay.AsSpan(i, needle.Length).SequenceEqual(needle)) return i;
        return -1;
    }
}
