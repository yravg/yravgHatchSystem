import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contractsRoot, generate, loadSchema, parseSchema } from "../../packages/contracts/scripts/generate.ts";

const files = generate(loadSchema());
const defs = parseSchema(loadSchema());

describe("generated protocol sources", () => {
  it("committed files equal a fresh generation (no hand edits, no stale output)", () => {
    for (const [rel, text] of Object.entries(files)) {
      expect(readFileSync(join(contractsRoot, rel), "utf8"), rel).toBe(text);
    }
  });

  it("all three targets declare every schema type and every member name", () => {
    const ts = files["generated/typescript/protocol.ts"] ?? "";
    const kt = files["generated/kotlin/id/yravg/hatch/contracts/Protocol.kt"] ?? "";
    const cs = files["generated/dotnet/Protocol.cs"] ?? "";
    for (const d of defs) {
      expect(ts, `ts ${d.name}`).toContain(` ${d.name}`);
      expect(kt, `kt ${d.name}`).toContain(` ${d.name}`);
      if (d.kind !== "alias") expect(cs, `cs ${d.name}`).toContain(` ${d.name}`);
      if (d.kind === "record") {
        for (const p of d.props) {
          expect(ts).toContain(`${p.name}${p.optional ? "?" : ""}:`);
          expect(kt).toContain(`val ${p.name}:`);
          expect(cs).toContain(`[JsonPropertyName("${p.name}")]`);
        }
      }
      if (d.kind === "enum") for (const v of d.values) expect(`${ts}${kt}${cs}`).toContain(v);
    }
  });

  it("optional members are nullable in Kotlin and .NET, required members are not", () => {
    const kt = files["generated/kotlin/id/yravg/hatch/contracts/Protocol.kt"] ?? "";
    const cs = files["generated/dotnet/Protocol.cs"] ?? "";
    expect(kt).toContain("val lease: SessionLease? = null");
    expect(kt).toContain("val signature: String\n"); // required, no default
    expect(cs).toContain("public SessionLease? Lease { get; init; }");
    expect(cs).toContain("public required string Signature { get; init; }");
  });

  it("the generator refuses schema features it cannot map on all three targets", () => {
    const bad = structuredClone(loadSchema()) as { $defs: Record<string, Record<string, unknown>> };
    const lease = bad.$defs["Money"];
    if (lease) lease["minLength"] = 1;
    expect(() => generate(bad)).toThrow(/unsupported keyword "minLength"/);
  });
});
