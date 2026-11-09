using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Hatch.Contracts;

namespace Hatch.VenueEdge;

public static class Iso
{
    public static string Format(DateTimeOffset t) => t.UtcDateTime.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", CultureInfo.InvariantCulture);
    public static DateTimeOffset Parse(string s) => DateTimeOffset.Parse(s, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal);
}

public enum LeaseRejection { UNKNOWN_SIGNER, BAD_SIGNATURE, STALE_EPOCH, EXPIRED, NOT_YET_VALID }

/// <summary>Signs and checks SessionLease exactly as packages/contracts/leases does: RFC 8785 canonical JSON without the
/// signature member, detached base64url Ed25519.</summary>
public static class LeaseCodec
{
    public static readonly JsonSerializerOptions Options = new()
    {
        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public static string Payload(SessionLease lease)
    {
        var node = (JsonObject)JsonSerializer.SerializeToNode(lease, Options)!;
        node.Remove("signature");
        return Canonical.Of(node);
    }

    public static SessionLease Sign(SessionLease unsigned, byte[] seed) =>
        unsigned with { Signature = B64u.Encode(Ed25519.Sign(seed, Encoding.UTF8.GetBytes(Payload(unsigned)))) };
}

public static class LeaseVerifier
{
    /// <summary>Null when acceptable. The keyId inside the lease only selects a PINNED key; it is never trusted on its own.</summary>
    public static LeaseRejection? Verify(SessionLease lease, IReadOnlyDictionary<string, string> trust, DateTimeOffset now, long currentEpoch)
    {
        if (!trust.TryGetValue(lease.KeyId, out var pinned)) return LeaseRejection.UNKNOWN_SIGNER;
        byte[] pub, sig;
        try { pub = B64u.Decode(pinned); sig = B64u.Decode(lease.Signature); } catch (FormatException) { return LeaseRejection.BAD_SIGNATURE; }
        if (!Ed25519.Verify(pub, Encoding.UTF8.GetBytes(LeaseCodec.Payload(lease)), sig)) return LeaseRejection.BAD_SIGNATURE;
        if (lease.AuthorityEpoch < currentEpoch) return LeaseRejection.STALE_EPOCH;
        if (now >= Iso.Parse(lease.NotAfter)) return LeaseRejection.EXPIRED;
        if (now < Iso.Parse(lease.IssuedAt)) return LeaseRejection.NOT_YET_VALID;
        return null;
    }
}
