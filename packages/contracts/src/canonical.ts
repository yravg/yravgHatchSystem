// Canonical JSON (RFC 8785 JCS) for signing and cross-language payload equality.
// shortcut: numbers must be safe integers (protocol has no floats; money is a decimal string),
// so JCS's float serialisation is not implemented. Upgrade when a float field enters the schema.
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) throw new Error(`canonicalJson: ${value} is not a safe integer`);
    return String(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    const members = Object.keys(o)
      .filter((k) => o[k] !== undefined)
      .sort() // default sort compares UTF-16 code units, as JCS requires
      .map((k) => `${JSON.stringify(k)}:${canonicalJson(o[k])}`);
    return `{${members.join(",")}}`;
  }
  throw new Error(`canonicalJson: unsupported ${typeof value}`);
}
