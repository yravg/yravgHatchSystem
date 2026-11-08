// Generates TypeScript, Kotlin and .NET types from packages/contracts/schema/protocol.schema.json.
// Run: pnpm gen:contracts   (writes)   |   node packages/contracts/scripts/generate.ts --check   (fails on drift)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Node = Record<string, unknown>;
type Ty =
  | { k: "string" | "int" | "bool" }
  | { k: "ref"; name: string }
  | { k: "list"; of: Ty }
  | { k: "map" };
type Def =
  | { kind: "alias"; name: string }
  | { kind: "enum"; name: string; values: string[] }
  | { kind: "record"; name: string; props: { name: string; ty: Ty; optional: boolean }[] };

const here = dirname(fileURLToPath(import.meta.url));
export const contractsRoot = join(here, "..");
const HEADER = "GENERATED from packages/contracts/schema/protocol.schema.json by `pnpm gen:contracts`. Do not edit.";

const only = (n: Node, allowed: string[], where: string): void => {
  for (const key of Object.keys(n)) {
    if (!allowed.includes(key)) throw new Error(`generator: unsupported keyword "${key}" at ${where}`);
  }
};

function parseTy(n: Node, where: string): Ty {
  if (typeof n["$ref"] === "string") {
    only(n, ["$ref"], where);
    return { k: "ref", name: n["$ref"].replace("#/$defs/", "") };
  }
  switch (n["type"]) {
    case "string":
      only(n, ["type", "pattern"], where);
      return { k: "string" };
    case "integer":
      only(n, ["type"], where);
      return { k: "int" };
    case "boolean":
      only(n, ["type"], where);
      return { k: "bool" };
    case "array":
      only(n, ["type", "items"], where);
      return { k: "list", of: parseTy(n["items"] as Node, where + "[]") };
    case "object": {
      only(n, ["type", "additionalProperties"], where);
      const ap = n["additionalProperties"] as Node | undefined;
      if (ap?.["type"] !== "string") throw new Error(`generator: inline object at ${where} must be a string map`);
      return { k: "map" };
    }
    default:
      throw new Error(`generator: unsupported type at ${where}`);
  }
}

export function parseSchema(schema: Node): Def[] {
  const defs = schema["$defs"] as Record<string, Node>;
  return Object.entries(defs).map(([name, n]): Def => {
    if (n["type"] === "object") {
      only(n, ["type", "additionalProperties", "required", "properties"], name);
      if (n["additionalProperties"] !== false) throw new Error(`generator: ${name} must set additionalProperties:false`);
      const required = n["required"] as string[];
      const props = Object.entries(n["properties"] as Record<string, Node>).map(([p, pn]) => ({
        name: p,
        ty: parseTy(pn, `${name}.${p}`),
        optional: !required.includes(p),
      }));
      for (const r of required) if (!props.some((p) => p.name === r)) throw new Error(`${name}: required ${r} undefined`);
      return { kind: "record", name, props };
    }
    if (n["type"] === "string" && n["enum"]) {
      only(n, ["type", "enum"], name);
      const values = n["enum"] as string[];
      for (const v of values) if (!/^[A-Z][A-Z0-9_]*$/.test(v)) throw new Error(`${name}: enum value ${v} must be UPPER_SNAKE`);
      return { kind: "enum", name, values };
    }
    if (n["type"] === "string") {
      only(n, ["type", "pattern"], name);
      return { kind: "alias", name };
    }
    throw new Error(`generator: unsupported def ${name}`);
  });
}

const pascal = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function ts(defs: Def[]): string {
  const t = (y: Ty): string =>
    y.k === "string" ? "string" : y.k === "int" ? "number" : y.k === "bool" ? "boolean"
    : y.k === "ref" ? y.name : y.k === "list" ? `${t(y.of)}[]` : "Record<string, string>";
  const out = [`// ${HEADER}`, ""];
  for (const d of defs) {
    if (d.kind === "alias") out.push(`export type ${d.name} = string;`);
    else if (d.kind === "enum") out.push(`export type ${d.name} = ${d.values.map((v) => `"${v}"`).join(" | ")};`);
    else {
      out.push(`export interface ${d.name} {`);
      for (const p of d.props) out.push(`  ${p.name}${p.optional ? "?" : ""}: ${t(p.ty)};`);
      out.push("}");
    }
  }
  return out.join("\n") + "\n";
}

function kotlin(defs: Def[]): string {
  const t = (y: Ty): string =>
    y.k === "string" ? "String" : y.k === "int" ? "Long" : y.k === "bool" ? "Boolean"
    : y.k === "ref" ? y.name : y.k === "list" ? `List<${t(y.of)}>` : "Map<String, String>";
  const out = [`// ${HEADER}`, "package id.yravg.hatch.contracts", "", "import kotlinx.serialization.Serializable", ""];
  for (const d of defs) {
    if (d.kind === "alias") out.push(`typealias ${d.name} = String`);
    else if (d.kind === "enum") out.push("@Serializable", `enum class ${d.name} { ${d.values.join(", ")} }`);
    else {
      out.push("@Serializable", `data class ${d.name}(`);
      out.push(d.props.map((p) => `    val ${p.name}: ${t(p.ty)}${p.optional ? "? = null" : ""}`).join(",\n"));
      out.push(")");
    }
    out.push("");
  }
  return out.join("\n");
}

function dotnet(defs: Def[]): string {
  const t = (y: Ty): string =>
    y.k === "string" ? "string" : y.k === "int" ? "long" : y.k === "bool" ? "bool"
    : y.k === "ref" ? (defs.find((d) => d.name === y.name)?.kind === "alias" ? "string" : y.name)
    : y.k === "list" ? `List<${t(y.of)}>` : "Dictionary<string, string>";
  const out = [
    `// <auto-generated>${HEADER}</auto-generated>`, "#nullable enable",
    "using System.Collections.Generic;", "using System.Text.Json.Serialization;", "", "namespace Hatch.Contracts;", "",
  ];
  for (const d of defs) {
    if (d.kind === "alias") continue; // aliases are plain strings in C#; the pattern is enforced by the schema
    if (d.kind === "enum") {
      out.push("[JsonConverter(typeof(JsonStringEnumConverter))]", `public enum ${d.name} { ${d.values.join(", ")} }`);
    } else {
      out.push(`public sealed record ${d.name}`, "{");
      for (const p of d.props) {
        out.push(`    [JsonPropertyName("${p.name}")]`);
        out.push(p.optional
          ? `    public ${t(p.ty)}? ${pascal(p.name)} { get; init; }`
          : `    public required ${t(p.ty)} ${pascal(p.name)} { get; init; }`);
      }
      out.push("}");
    }
    out.push("");
  }
  return out.join("\n");
}

export function generate(schema: Node): Record<string, string> {
  const defs = parseSchema(schema);
  return {
    "generated/typescript/protocol.ts": ts(defs),
    "generated/kotlin/id/yravg/hatch/contracts/Protocol.kt": kotlin(defs),
    "generated/dotnet/Protocol.cs": dotnet(defs),
  };
}

export const loadSchema = (): Node =>
  JSON.parse(readFileSync(join(contractsRoot, "schema", "protocol.schema.json"), "utf8")) as Node;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const files = generate(loadSchema());
  const check = process.argv.includes("--check");
  let drift = 0;
  for (const [rel, text] of Object.entries(files)) {
    const path = join(contractsRoot, rel);
    if (check) {
      let cur = "";
      try { cur = readFileSync(path, "utf8"); } catch { /* missing counts as drift */ }
      if (cur !== text) { console.error(`drift: ${rel}`); drift++; }
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, text);
      console.log(`wrote ${rel}`);
    }
  }
  process.exit(drift ? 1 : 0);
}
