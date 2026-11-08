package id.yravg.hatch.contracts

import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive

/** RFC 8785 canonical JSON for the protocol subset (integers, strings, booleans, null, arrays, objects). */
object Canonical {
    fun of(e: JsonElement): String = when (e) {
        is JsonNull -> "null"
        is JsonPrimitive -> if (e.isString) quote(e.content) else e.content
        is JsonArray -> e.joinToString(",", "[", "]") { of(it) }
        // Kotlin String ordering is UTF-16 code unit order, as JCS requires.
        is JsonObject -> e.entries.sortedBy { it.key }
            .joinToString(",", "{", "}") { quote(it.key) + ":" + of(it.value) }
    }

    private fun quote(s: String): String {
        val b = StringBuilder("\"")
        for (c in s) when {
            c == '"' -> b.append("\\\"")
            c == '\\' -> b.append("\\\\")
            c == '\b' -> b.append("\\b")
            c == '\u000C' -> b.append("\\f")
            c == '\n' -> b.append("\\n")
            c == '\r' -> b.append("\\r")
            c == '\t' -> b.append("\\t")
            c < ' ' -> b.append("\\u%04x".format(c.code))
            else -> b.append(c)
        }
        return b.append('"').toString()
    }
}
