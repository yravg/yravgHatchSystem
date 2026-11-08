import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DARK, LIGHT, buildCss, lookup, outPath, tokensJsonPath } from "../scripts/gen-tokens.ts";

const root = join(import.meta.dirname, "..", "..", "..");
const tokens = JSON.parse(readFileSync(tokensJsonPath, "utf8"));
const css = readFileSync(outPath, "utf8");
const published = readFileSync(join(root, "specs", "design", "tailwind.tokens.css"), "utf8");

const declarations = (text: string): Map<string, string> =>
  new Map([...text.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1] ?? "", (m[2] ?? "").trim()]));

const luminance = (hex: string): number => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (c[0] ?? 0) + 0.7152 * (c[1] ?? 0) + 0.0722 * (c[2] ?? 0);
};
const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};
const light = (name: string): string => lookup(tokens, `light.${name}`);
const brand = (name: string): string => lookup(tokens, `brand.${name}`);
const dark = (name: string): string => lookup(tokens, `dark.${name}`);

describe("packages/ui tokens (HS-CMP-023 data table, HS-CMP-058 trust strip)", () => {
  it("committed tokens.css equals a fresh build from specs/design/tokens.json", () => {
    expect(css).toBe(buildCss(tokens));
  });
  it("every value equals the design desk's published tailwind.tokens.css (no invented palette)", () => {
    const mine = declarations(css.split(".hs-dark")[0] ?? "");
    const theirs = declarations(published.split(".hs-dark")[0] ?? "");
    // Light tokens live in the published :root; compare every name both files declare.
    const shared = LIGHT.map(([, name]) => name).filter((name) => theirs.has(name));
    expect(shared.length).toBeGreaterThanOrEqual(24);
    for (const name of shared) expect(mine.get(name), name).toBe(theirs.get(name));
  });
  it("only hex colours that exist in tokens.json appear", () => {
    const allowed = new Set(JSON.stringify(tokens).match(/#[0-9A-Fa-f]{6}/g)?.map((h) => h.toUpperCase()));
    const used = css.match(/#[0-9A-Fa-f]{6}/g) ?? [];
    expect(used.length).toBeGreaterThan(10);
    expect(used.filter((h) => !allowed.has(h.toUpperCase()))).toEqual([]);
  });
  it("covers a dark counterpart for every dark-aware surface/ink token", () => {
    expect(DARK.map(([, v]) => v).every((v) => LIGHT.some(([, l]) => l === v))).toBe(true);
  });
  it("text pairs used by the table and the trust strip meet WCAG AA 4.5:1 (measured)", () => {
    const pairs: [string, string, string][] = [
      ["ink on surface", light("ink"), light("surface")],
      ["ink-dim on surface", light("ink-dim"), light("surface")],
      ["ink-faint on surface", light("ink-faint"), light("surface")],
      ["ink on surface-2 (zebra row)", light("ink"), light("surface-2")],
      ["primary-ink on primary", brand("primary-ink"), brand("primary")],
      ["ink on primary-tint (trust strip)", light("ink"), brand("primary-tint")],
      ["ok on surface", light("ok"), light("surface")],
      ["warn on surface", light("warn"), light("surface")],
      ["danger on surface", light("danger"), light("surface")],
      ["dark ink on dark surface", dark("ink"), dark("surface")],
      ["dark ink-dim on dark surface", dark("ink-dim"), dark("surface")],
      ["dark ink-faint on dark surface", dark("ink-faint"), dark("surface")],
      ["on-dark brand on dark surface", brand("on-dark"), dark("surface")],
    ];
    for (const [label, fg, bg] of pairs) expect(contrast(fg, bg), label).toBeGreaterThanOrEqual(4.5);
  });
});

describe("design v0.2 ownership and brand status (HS-V02-15)", () => {
  const crosswalk = JSON.parse(readFileSync(join(root, "specs", "design", "DESIGN-CROSSWALK.json"), "utf8")) as {
    id: string;
    primary_ticket: string;
  }[];
  it("ticket 01 is the primary owner of exactly HS-CMP-023 and HS-CMP-058 among its components", () => {
    const owned = crosswalk.filter((c) => c.id.startsWith("HS-CMP-") && c.primary_ticket === "01").map((c) => c.id);
    expect(owned.sort()).toEqual(["HS-CMP-023", "HS-CMP-058"]);
  });
  it("brand colours are declared provisional in the source tokens and in the generated file", () => {
    expect(tokens.brand.$description).toMatch(/PROVISIONAL/);
    expect(css).toMatch(/Brand\.\* is provisional/);
  });
  it("the web scaffold uses tokens only: no raw colour literal in apps/web/app", () => {
    const dir = join(root, "apps", "web", "app");
    const literals = readdirSync(dir).flatMap((f) =>
      (readFileSync(join(dir, f), "utf8").match(/#[0-9A-Fa-f]{3,8}|rgba?\(/g) ?? []).map((m) => `${f}:${m}`),
    );
    expect(literals).toEqual([]);
  });
});
