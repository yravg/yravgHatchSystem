// Emits packages/ui/src/tokens.css: only the design tokens that HS-CMP-023 (data table) and HS-CMP-058
// (trust strip) need, copied from specs/design/tokens.json. Brand.* is PROVISIONAL until the logo lands;
// this file never invents or copies a palette from anywhere else.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Tree = { [k: string]: Tree | string; $value?: string };

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
export const tokensJsonPath = join(root, "specs", "design", "tokens.json");
export const outPath = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "tokens.css");

// [token path, css variable]. Names follow specs/design/tailwind.tokens.css.
export const LIGHT: [string, string][] = [
  ["brand.primary", "--hs-brand-primary"], ["brand.primary-hover", "--hs-brand-primary-hover"],
  ["brand.primary-ink", "--hs-brand-primary-ink"], ["brand.primary-tint", "--hs-brand-primary-tint"],
  ["brand.on-dark", "--hs-brand-on-dark"],
  ["light.canvas", "--hs-canvas"], ["light.surface", "--hs-surface"], ["light.surface-2", "--hs-surface-2"],
  ["light.line", "--hs-line"], ["light.line-strong", "--hs-line-strong"], ["light.ink", "--hs-ink"],
  ["light.ink-dim", "--hs-ink-dim"], ["light.ink-faint", "--hs-ink-faint"], ["light.ok", "--hs-ok"],
  ["light.warn", "--hs-warn"], ["light.danger", "--hs-danger"], ["light.focus", "--hs-focus"],
  ["type.family", "--hs-font"], ["type.mono", "--hs-mono"],
  ["type.ops.xs", "--hs-type-ops-xs"], ["type.ops.sm", "--hs-type-ops-sm"],
  ["space.2", "--hs-space-2"], ["space.3", "--hs-space-3"], ["space.4", "--hs-space-4"],
  ["radius.sm", "--hs-radius-sm"], ["radius.md", "--hs-radius-md"],
  ["size.touch-min", "--hs-size-touch-min"],
];
export const DARK: [string, string][] = [
  ["dark.canvas", "--hs-canvas"], ["dark.surface", "--hs-surface"], ["dark.surface-2", "--hs-surface-2"],
  ["dark.line", "--hs-line"], ["dark.ink", "--hs-ink"], ["dark.ink-dim", "--hs-ink-dim"],
  ["dark.ink-faint", "--hs-ink-faint"], ["dark.focus", "--hs-focus"],
];

export const lookup = (tree: Tree, path: string): string => {
  let node: Tree | string | undefined = tree;
  for (const part of path.split(".")) node = typeof node === "object" ? node[part] : undefined;
  const v = typeof node === "object" ? node.$value : undefined;
  if (typeof v !== "string") throw new Error(`token ${path} not found in tokens.json`);
  return v;
};

export function buildCss(tokens: Tree): string {
  const decl = (rows: [string, string][]): string => rows.map(([p, v]) => `  ${v}: ${lookup(tokens, p)};`).join("\n");
  return [
    "/* GENERATED from specs/design/tokens.json by `pnpm gen:tokens`. Do not edit. Brand.* is provisional (logo pending). */",
    ":root {",
    decl(LIGHT),
    "}",
    ".hs-dark {",
    decl(DARK),
    "  --hs-brand-primary: var(--hs-brand-on-dark);",
    "}",
    "",
  ].join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(outPath, buildCss(JSON.parse(readFileSync(tokensJsonPath, "utf8")) as Tree));
  console.log("wrote packages/ui/src/tokens.css");
}
