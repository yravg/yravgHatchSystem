using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Crypto.Signers;

namespace Hatch.VenueEdge;

public static class B64u
{
    public static string Encode(byte[] b) => Convert.ToBase64String(b).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    public static byte[] Decode(string s)
    {
        var t = s.Replace('-', '+').Replace('_', '/');
        return Convert.FromBase64String(t.PadRight(t.Length + (4 - t.Length % 4) % 4, '='));
    }
}

/// <summary>Ed25519 (RFC 8032) over a 32 byte seed. BouncyCastle is pure managed, so Windows and Linux behave the same.</summary>
public static class Ed25519
{
    public static byte[] NewSeed() => RandomNumberGenerator.GetBytes(32);
    public static byte[] PublicKey(byte[] seed) => new Ed25519PrivateKeyParameters(seed, 0).GeneratePublicKey().GetEncoded();

    public static byte[] Sign(byte[] seed, byte[] message)
    {
        var s = new Ed25519Signer();
        s.Init(true, new Ed25519PrivateKeyParameters(seed, 0));
        s.BlockUpdate(message, 0, message.Length);
        return s.GenerateSignature();
    }

    /// <summary>False for any malformed key or signature; never throws.</summary>
    public static bool Verify(byte[] publicKey, byte[] message, byte[] signature)
    {
        try
        {
            if (publicKey.Length != 32 || signature.Length != 64) return false;
            var s = new Ed25519Signer();
            s.Init(false, new Ed25519PublicKeyParameters(publicKey, 0));
            s.BlockUpdate(message, 0, message.Length);
            return s.VerifySignature(signature);
        }
        catch (Exception) { return false; }
    }
}

public interface IKeyStore { byte[]? Load(); void Save(byte[] seed); }

/// <summary>Seed in a file only the service account can read (0600 on Unix). On Windows the service ACL (not set here) must
/// restrict it; a TPM/DPAPI store is a later hardening step. Keys are generated at runtime and never leave this store.</summary>
public sealed class FileKeyStore : IKeyStore
{
    private readonly string path;
    public FileKeyStore(string path) => this.path = path;
    public byte[]? Load() => File.Exists(path) ? B64u.Decode(File.ReadAllText(path).Trim()) : null;
    public void Save(byte[] seed)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(Path.GetFullPath(path))!);
        var o = new FileStreamOptions { Mode = FileMode.CreateNew, Access = FileAccess.Write };
        if (!OperatingSystem.IsWindows()) o.UnixCreateMode = UnixFileMode.UserRead | UnixFileMode.UserWrite;
        using var f = new FileStream(path, o);
        f.Write(Encoding.ASCII.GetBytes(B64u.Encode(seed)));
    }
}

public sealed class DeviceIdentity
{
    private readonly byte[] seed;
    private DeviceIdentity(byte[] seed) { this.seed = seed; PublicKeyB64u = B64u.Encode(Ed25519.PublicKey(seed)); }
    public string PublicKeyB64u { get; }

    public static DeviceIdentity FromSeed(byte[] seed) => new(seed);
    public static DeviceIdentity LoadOrCreate(IKeyStore store)
    {
        var seed = store.Load();
        if (seed is null) { seed = Ed25519.NewSeed(); store.Save(seed); }
        return new DeviceIdentity(seed);
    }

    public byte[] Sign(byte[] message) => Ed25519.Sign(seed, message);

    /// <summary>Proof of possession for POST /devices/{id}/pairing-challenge (same text the API verifies).</summary>
    public string PairingProof(string deviceId) =>
        B64u.Encode(Sign(Encoding.UTF8.GetBytes($"hatch-pair-v1:{deviceId}:{PublicKeyB64u}")));
}
