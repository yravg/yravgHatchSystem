// Self-check for the "no prohibited vendor/raw/binary artifacts" rule of tools/validate_spec.py.
// Runs the real validator on a throw-away git checkout copy and reads that one check's result from VALIDATION.json.
import { execFile, spawnSync } from "node:child_process";
import { promisify } from "node:util";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Each case runs the full validator (hundreds of files), so allow more than the 20 s default.
vi.setConfig({ testTimeout: 120_000, hookTimeout: 120_000 });

const repo = resolve(import.meta.dirname, "../..");
const CHECK = "no prohibited vendor/raw/binary artifacts";
let dir = "";

const git = (...a: string[]) => spawnSync("git", a, { cwd: dir, encoding: "utf8" });
// Async on purpose: a blocking spawn for ~20 s starves the vitest worker RPC and fails the run with an unhandled timeout.
const exec = promisify(execFile);
async function run(): Promise<{ pass: boolean; detail: unknown }> {
  await exec("python3", ["-X", "utf8", "tools/validate_spec.py"], { cwd: dir, env: { ...process.env, PYTHONUTF8: "1" } }).catch(() => undefined); // exit 1 is the expected FAIL case
  const res = JSON.parse(readFileSync(join(dir, "VALIDATION.json"), "utf8")) as { details: { check: string; pass: boolean; detail: unknown }[] };
  const c = res.details.find((d) => d.check === CHECK);
  if (!c) throw new Error("check not found in VALIDATION.json");
  return c;
}

describe("validate_spec.py prohibited-artifact scan", () => {
  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "spec-validator-"));
    const tracked = spawnSync("git", ["ls-files", "-z"], { cwd: repo, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).stdout.split("\0").filter(Boolean);
    for (const f of tracked) { mkdirSync(join(dir, f, ".."), { recursive: true }); cpSync(join(repo, f), join(dir, f)); }
    git("init", "-q");
    git("add", "-A");
  });
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("ignores an untracked node_modules", async () => {
    mkdirSync(join(dir, "node_modules/x"), { recursive: true });
    writeFileSync(join(dir, "node_modules/x/a.js"), "1");
    expect((await run()).pass).toBe(true);
  });

  it("still fails a tracked node_modules, raw and banned-extension file", async () => {
    for (const f of ["node_modules/y/b.js", "raw/c.txt", "vendor.apk"]) {
      mkdirSync(join(dir, f, ".."), { recursive: true });
      writeFileSync(join(dir, f), "1");
    }
    git("add", "-f", "-A");
    const c = await run();
    expect(c.pass).toBe(false);
    expect(JSON.stringify(c.detail)).toContain("node_modules/y/b.js");
    expect(JSON.stringify(c.detail)).toContain("raw/c.txt");
    expect(JSON.stringify(c.detail)).toContain("vendor.apk");
  });

  it("falls back to scanning every file when there is no .git", async () => {
    rmSync(join(dir, ".git"), { recursive: true, force: true });
    expect((await run()).pass).toBe(false);
  });
});
