import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluate, evaluateExternal, parseReport, type External, type Ticket, type VitestReport } from "./ticket-dispatch.ts";

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

const junit = (cases: [string, string, string?][]): string =>
  `<?xml version="1.0"?><testsuite name="s">${cases.map(([c, n, extra]) => `<testcase name="${n}" classname="${c}"${extra ? `>${extra}</testcase>` : "/>"}`).join("")}</testsuite>`;
const ext = (over: Partial<External> = {}): External => ({ id: "x", tool: "t", cwd: ".", command: ["t"], note: "", mandatory: ["A::one()", "B::two()"], ...over });

describe("external named tests (D1: a bare exit code proves nothing)", () => {
  const all = parseReport("r.xml", junit([["A", "one()"], ["B", "two()"]]));
  it("passes when every named test ran and passed", () => {
    expect(evaluateExternal("HS-X", ext(), all).problems).toEqual([]);
  });
  it("deleting one named test is MISSING and a problem", () => {
    const r = evaluateExternal("HS-X", ext(), parseReport("r.xml", junit([["A", "one()"]])));
    expect(r.rows.find((x) => x.name === "B::two()")?.status).toBe("MISSING");
    expect(r.problems.join()).toMatch(/B::two\(\)" is MISSING/);
  });
  it("a failed, errored or skipped named test is a problem", () => {
    for (const extra of ["<failure message='x'/>", "<error message='x'/>", "<skipped/>"]) {
      expect(evaluateExternal("HS-X", ext(), parseReport("r.xml", junit([["A", "one()"], ["B", "two()", extra]]))).problems.length, extra).toBeGreaterThan(0);
    }
  });
  it("any skipped test in the reports is a problem, even an unnamed one", () => {
    expect(evaluateExternal("HS-X", ext(), parseReport("r.xml", junit([["A", "one()"], ["B", "two()"], ["C", "other()", "<skipped/>"]]))).problems.join()).toMatch(/skipped/);
  });
  it("minTests is a floor on passing cases", () => {
    expect(evaluateExternal("HS-X", ext({ minTests: 3 }), all).problems.join()).toMatch(/at least 3/);
    expect(evaluateExternal("HS-X", ext({ minTests: 2 }), all).problems).toEqual([]);
  });
  it("an external naming no tests is a problem unless it opts out explicitly", () => {
    expect(evaluateExternal("HS-X", ext({ mandatory: undefined }), all).problems.join()).toMatch(/names no mandatory tests/);
    expect(evaluateExternal("HS-X", ext({ mandatory: undefined, exitCodeOnly: true }), all).problems).toEqual([]);
  });
  it("parses .NET TRX outcomes and XML-escaped names", () => {
    const trx = `<TestRun><Results><UnitTestResult testName="N.C.Ok" outcome="Passed"/><UnitTestResult testName="N.C.Bad" outcome="Failed"/><UnitTestResult testName="N.C.Skip" outcome="NotExecuted"/></Results></TestRun>`;
    expect(parseReport("a.trx", trx)).toEqual([{ id: "N.C.Ok", status: "passed" }, { id: "N.C.Bad", status: "failed" }, { id: "N.C.Skip", status: "skipped" }]);
    expect(parseReport("a.xml", junit([["A", "x &amp; y()"]]))[0]?.id).toBe("A::x & y()");
  });
});

describe("ticket dispatcher CLI with a real external command (self-test)", () => {
  const dir = mkdtempSync(join(tmpdir(), "dispatch-ext-"));
  const gen = join(dir, "gen.mjs");
  // The fake test runner writes a JUnit report with the cases named in its arguments, like a Gradle run would.
  writeFileSync(gen, `import {mkdirSync,writeFileSync} from "node:fs";import {join} from "node:path";mkdirSync(join(process.argv[2],"out"),{recursive:true});
writeFileSync(join(process.argv[2],"out","TEST-s.xml"),'<testsuite>'+process.argv.slice(3).map(n=>'<testcase name="'+n+'" classname="S"/>').join("")+'</testsuite>');`);
  const manifestFor = (emit: string[]): string => {
    const m = join(dir, `m-${emit.length}.json`);
    writeFileSync(m, JSON.stringify({ "97": { title: "t", requirements: { "HS-X": { acceptance: "AC", tests: [], external: [{
      id: "fake", tool: process.execPath, cwd: dir, command: [process.execPath, gen, dir, ...emit], reportDirs: ["out"],
      mandatory: ["S::alpha()", "S::beta()"], note: "fake runner",
    }] } } } }));
    return m;
  };
  const run = (m: string) => spawnSync(process.execPath, [join(import.meta.dirname, "ticket-dispatch.ts"), "97", "--manifest", m], { encoding: "utf8" });
  it("exit 0 when both named tests are in the fresh report", () => {
    expect(run(manifestFor(["alpha()", "beta()"])).status).toBe(0);
  });
  it("exit 1 when one named test is deleted although the command itself exits 0", () => {
    const r = run(manifestFor(["alpha()"]));
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/"S::beta\(\)" is MISSING/);
  });
  it("a stale report from an earlier run never counts", () => {
    mkdirSync(join(dir, "out"), { recursive: true });
    writeFileSync(join(dir, "out", "TEST-old.xml"), junit([["S", "beta()"]]));
    const m = join(dir, "m-stale.json");
    writeFileSync(m, JSON.stringify({ "97": { title: "t", requirements: { "HS-X": { acceptance: "AC", tests: [], external: [{ id: "noop", tool: process.execPath, cwd: dir, command: [process.execPath, "-e", "0"], reportDirs: ["out"], mandatory: ["S::beta()"], note: "" }] } } } }));
    expect(run(m).status).toBe(1);
  });
  it("cleanup", () => { rmSync(dir, { recursive: true, force: true }); });
});
