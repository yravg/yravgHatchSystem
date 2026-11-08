using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Hatch.Contracts;
using Xunit;

namespace Hatch.Contracts.Tests;

/// <summary>Parse each shared fixture into the generated model, re-serialise, compare with the golden canonical JSON.</summary>
public class ConformanceTests
{
    private static readonly JsonSerializerOptions Options = new()
    {
        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private static string Res(string path) =>
        File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "fixtures", path)).Trim();

    private static void RoundTrip<T>(string name)
    {
        var model = JsonSerializer.Deserialize<T>(Res(name + ".json"), Options);
        Assert.NotNull(model);
        Assert.Equal(Res("canonical/" + name + ".json"), Canonical.Of(JsonSerializer.SerializeToNode(model, Options)));
    }

    [Fact] public void Lease() => RoundTrip<SessionLease>("lease");
    [Fact] public void Command() => RoundTrip<SessionCommand>("command");
    [Fact] public void Ack() => RoundTrip<DeviceAck>("ack");
    [Fact] public void Error() => RoundTrip<ErrorEnvelope>("error");
    [Fact] public void Payment() => RoundTrip<PaymentAmount>("payment");

    [Fact]
    public void UnknownMemberIsRejected() =>
        Assert.ThrowsAny<JsonException>(() =>
            JsonSerializer.Deserialize<PaymentAmount>("""{"amountIDR":"1","currency":"IDR","extra":1}""", Options));
}
