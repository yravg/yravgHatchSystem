import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Shapes of credentials that must never appear in fixtures: private keys, provider server keys, cloud keys,
// quoted secret-like assignments, and long opaque base64 blobs (a real signature or key would look like this).
const PATTERNS: [string, RegExp][] = [
  ["private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["payment-provider-key", /\b(?:SB-)?Mid-(?:server|client)-[A-Za-z0-9_-]{8,}/],
  ["cloud-access-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["secret-assignment", /(?:secret|password|token|api[_-]?key)["']?\s*[:=]\s*["'][^"']{12,}["']/i],
  ["opaque-blob", /[A-Za-z0-9+/_-]{64,}={0,2}/],
];

export const findSecrets = (text: string): string[] =>
  PATTERNS.filter(([, re]) => re.test(text)).map(([name]) => name);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

describe("fixtures carry no secrets", () => {
  it("detector flags each secret shape (so a clean result means something)", () => {
    expect(findSecrets("-----BEGIN PRIVATE KEY-----")).toContain("private-key");
    expect(findSecrets("SB-Mid-server-abcdefgh12345678")).toContain("payment-provider-key");
    expect(findSecrets("AKIAABCDEFGHIJKLMNOP")).toContain("cloud-access-key");
    expect(findSecrets('{"password": "hunter2hunter2hunter2"}')).toContain("secret-assignment");
    expect(findSecrets("A".repeat(88))).toContain("opaque-blob");
    expect(findSecrets('{"signature":"FIXTURE-NOT-A-REAL-SIGNATURE"}')).toEqual([]);
  });

  it("every file under packages/contracts/fixtures is clean", () => {
    const dir = join(import.meta.dirname, "..", "..", "packages", "contracts", "fixtures");
    const found = walk(dir).map((f) => [f, findSecrets(readFileSync(f, "utf8"))] as const);
    expect(found.length).toBeGreaterThanOrEqual(10);
    expect(found.filter(([, hits]) => hits.length > 0)).toEqual([]);
  });
});
