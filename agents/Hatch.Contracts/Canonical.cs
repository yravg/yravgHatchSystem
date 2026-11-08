using System;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;

namespace Hatch.Contracts;

/// <summary>RFC 8785 canonical JSON for the protocol subset (integers, strings, booleans, null, arrays, objects).</summary>
public static class Canonical
{
    public static string Of(JsonNode? node) => node switch
    {
        null => "null",
        JsonArray a => "[" + string.Join(",", a.Select(Of)) + "]",
        // Ordinal comparison is UTF-16 code unit order, as JCS requires.
        JsonObject o => "{" + string.Join(",", o.OrderBy(p => p.Key, StringComparer.Ordinal)
            .Select(p => Quote(p.Key) + ":" + Of(p.Value))) + "}",
        JsonValue v => v.TryGetValue<string>(out var s) ? Quote(s) : v.ToJsonString(),
        _ => throw new NotSupportedException(node.GetType().Name),
    };

    private static string Quote(string s)
    {
        var b = new StringBuilder("\"");
        foreach (var c in s)
        {
            switch (c)
            {
                case '"': b.Append("\\\""); break;
                case '\\': b.Append("\\\\"); break;
                case '\b': b.Append("\\b"); break;
                case '\f': b.Append("\\f"); break;
                case '\n': b.Append("\\n"); break;
                case '\r': b.Append("\\r"); break;
                case '\t': b.Append("\\t"); break;
                default:
                    if (c < ' ') b.Append("\\u").Append(((int)c).ToString("x4"));
                    else b.Append(c);
                    break;
            }
        }
        return b.Append('"').ToString();
    }
}
