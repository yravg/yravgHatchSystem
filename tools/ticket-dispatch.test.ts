import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate, type Ticket, type VitestReport } from "./ticket-dispatch.ts";

const ticket: Ticket = {
  title: "t",
  requirements: { "HS-X": { acceptance: "AC-HS-X", tests: [{ file: "a/b.test.ts", names: ["does the thing"] }] } },
};
const report = (...results: [string, string][]): VitestReport => ({
  testResults: [{ name: "C:\\repo\\a\\b.test.ts", assertionResults: results.map(([fullName, status]) => ({ fullName, status })) }],
});
const yes = (): boolean => true;

describe("ticket dispatcher", () => {
  it("passes only when every named mandatory test ran and passed", () => {
    expect(evaluate(ticket, report(["suite does the thing", "passed"]), yes).problems).toEqual([]);
  });
  it("fails when a mandatory test file is missing", () => {
    const r = evaluate(ticket, undefined, () => false);
    expect(r.problems.join("\n")).toMatch(/mandatory test file missing: a\/b.test.ts/);
    expect(r.rows[0]?.status).toBe("MISSING");
  });
  it("fails when the named test is absent from a file that did run (an ID in a comment is not a test)", () => {
    const r = evaluate(ticket, report(["suite something else", "passed"]), yes);
    expect(r.rows[0]?.status).toBe("MISSING");
    expect(r.problems.length).toBeGreaterThan(0);
  });
  it("fails on failed, skipped and todo results", () => {
    for (const status of ["failed", "skipped", "todo"]) {
      expect(evaluate(ticket, report(["suite does the thing", status]), yes).problems.length, status).toBeGreaterThan(0);
    }
  });
  it("fails on any skipped test in a mandatory file, even an unnamed one", () => {
    const r = evaluate(ticket, report(["suite does the thing", "passed"], ["suite other", "skipped"]), yes);
    expect(r.problems.join("\n")).toMatch(/skipped/);
  });
  it("fails when the report never ran the file", () => {
    expect(evaluate(ticket, { testResults: [] }, yes).rows[0]?.status).toBe("NOT_RUN");
  });
  it("fails a requirement that registers no tests", () => {
    const empty: Ticket = { title: "t", requirements: { "HS-X": { acceptance: "AC", tests: [] } } };
    expect(evaluate(empty, undefined, yes).problems.join()).toMatch(/no mandatory tests/);
  });
});

describe("ticket dispatcher CLI exit codes", () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, [join(import.meta.dirname, "ticket-dispatch.ts"), ...args], { encoding: "utf8" });

  it("exits 1 for a ticket with nothing registered", () => {
    const r = run("99");
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/no mandatory tests registered for ticket 99/);
  });
  it("exits 1 when the manifest points at a test file that does not exist", () => {
    const dir = mkdtempSync(join(tmpdir(), "dispatch-test-"));
    try {
      const manifest = join(dir, "m.json");
      writeFileSync(manifest, JSON.stringify({ "98": { ...ticket, requirements: { "HS-X": { acceptance: "AC", tests: [{ file: "tests/does-not-exist.test.ts", names: ["x"] }] } } } }));
      const r = run("98", "--manifest", manifest);
      expect(r.status).toBe(1);
      expect(r.stderr).toMatch(/mandatory test file missing/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
