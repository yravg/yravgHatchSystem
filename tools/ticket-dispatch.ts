// Ticket dispatcher: `pnpm test:ticket -- NN`.
// Reads tests/tickets.manifest.json, runs the mandatory tests of ticket NN for real and exits non-zero when any
// mandatory test is missing, skipped, todo, failed, or was never executed. It does not grep for IDs.
// Exit codes: 0 all mandatory checks passed | 1 failure or missing | 3 passed but an external check is BLOCKED.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface TestRef { file: string; names: string[] }
/**
 * An external (Gradle / .NET) check. `mandatory` names each test that must have run and passed, matched as a substring of
 * `<class>::<test name>` in the reports under `reportDirs` (JUnit XML `*.xml` or .NET `*.trx`, relative to `cwd`). Report files are
 * deleted before the command runs, so only fresh results count. `minTests` is a floor on the number of passing test cases.
 * Declaring none of this needs the explicit opt-out `exitCodeOnly: true`: a bare exit code does not prove which tests ran.
 */
export interface External {
  id: string; tool: string; cwd: string; command: string[]; note: string;
  reportDirs?: string[]; mandatory?: string[]; minTests?: number; exitCodeOnly?: boolean;
}
export interface Requirement { acceptance: string; tests: TestRef[]; external?: External[] }
export interface Ticket { title: string; requirements: Record<string, Requirement> }
export type Manifest = Record<string, Ticket>;
export interface VitestReport {
  testResults: { name: string; assertionResults: { fullName: string; status: string }[] }[];
}
export interface Row { requirement: string; acceptance: string; file: string; name: string; status: "PASS" | "FAIL" | "MISSING" | "SKIPPED" | "NOT_RUN" }

const norm = (p: string): string => p.replace(/\\/g, "/");

export interface Case { id: string; status: "passed" | "failed" | "skipped" }

const unxml = (v: string): string => v.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n))).replace(/&amp;/g, "&");
const attr = (tag: string, name: string): string | undefined => {
  const m = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(tag);
  return m?.[1] === undefined ? undefined : unxml(m[1]);
};

/** Pure: JUnit XML (Gradle, JUnit logger) and Visual Studio TRX (`dotnet test --logger trx`) to flat cases. */
export function parseReport(file: string, text: string): Case[] {
  const out: Case[] = [];
  if (file.endsWith(".trx")) {
    for (const m of text.matchAll(/<UnitTestResult\b[^>]*>/g)) {
      const name = attr(m[0], "testName"); const outcome = attr(m[0], "outcome");
      if (name === undefined) continue;
      out.push({ id: name, status: outcome === "Passed" ? "passed" : outcome === "NotExecuted" ? "skipped" : "failed" });
    }
    return out;
  }
  for (const m of text.matchAll(/<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const name = attr(m[1] ?? "", "name"); if (name === undefined) continue;
    const body = m[3] ?? "";
    const status = /<(failure|error)\b/.test(body) ? "failed" : /<skipped\b/.test(body) ? "skipped" : "passed";
    out.push({ id: `${attr(m[1] ?? "", "classname") ?? ""}::${name}`, status });
  }
  return out;
}

/** Pure: judge an external check's reports against its mandatory list. Missing, skipped or failed names are problems. */
export function evaluateExternal(req: string, x: External, cases: Case[]): { rows: Row[]; problems: string[] } {
  const rows: Row[] = []; const problems: string[] = [];
  if (!x.mandatory?.length && !x.exitCodeOnly) problems.push(`${req}: external ${x.id} names no mandatory tests (list them, or opt out with exitCodeOnly)`);
  for (const name of x.mandatory ?? []) {
    const hits = cases.filter((c) => c.id.includes(name));
    const status: Row["status"] = hits.length === 0 ? "MISSING" : hits.some((h) => h.status === "failed") ? "FAIL" : hits.some((h) => h.status === "skipped") ? "SKIPPED" : "PASS";
    if (status !== "PASS") problems.push(`${req}: external ${x.id} :: "${name}" is ${status}`);
    rows.push({ requirement: req, acceptance: x.id, file: x.id, name, status });
  }
  const passed = cases.filter((c) => c.status === "passed").length;
  if (x.minTests !== undefined && passed < x.minTests) problems.push(`${req}: external ${x.id} ran ${passed} passing test(s), at least ${x.minTests} required`);
  for (const c of cases) if (c.status === "skipped") problems.push(`${req}: external ${x.id} :: "${c.id}" is skipped (skipped tests are not allowed)`);
  return { rows, problems };
}

function reportFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((e) => {
    const f = join(dir, e);
    return statSync(f).isDirectory() ? reportFiles(f) : /\.(xml|trx)$/.test(e) ? [f] : [];
  });
}

/** Pure: judge a vitest JSON report against the mandatory list. */
export function evaluate(ticket: Ticket, report: VitestReport | undefined, fileExists: (f: string) => boolean): { rows: Row[]; problems: string[] } {
  const rows: Row[] = [];
  const problems: string[] = [];
  const reportFor = (file: string) => report?.testResults.find((r) => norm(r.name).endsWith(`/${norm(file)}`));
  for (const [req, def] of Object.entries(ticket.requirements)) {
    if (def.tests.length === 0 && !(def.external?.length)) problems.push(`${req}: no mandatory tests registered`);
    for (const t of def.tests) {
      if (!fileExists(t.file)) {
        problems.push(`${req}: mandatory test file missing: ${t.file}`);
        for (const name of t.names) rows.push({ requirement: req, acceptance: def.acceptance, file: t.file, name, status: "MISSING" });
        continue;
      }
      const fileReport = reportFor(t.file);
      for (const name of t.names) {
        const hits = fileReport?.assertionResults.filter((a) => a.fullName.includes(name)) ?? [];
        let status: Row["status"] = "PASS";
        if (!fileReport) status = "NOT_RUN";
        else if (hits.length === 0) status = "MISSING";
        else if (hits.some((h) => h.status === "failed")) status = "FAIL";
        else if (hits.some((h) => h.status !== "passed")) status = "SKIPPED";
        if (status !== "PASS") problems.push(`${req}: ${t.file} :: "${name}" is ${status}`);
        rows.push({ requirement: req, acceptance: def.acceptance, file: t.file, name, status });
      }
      for (const a of fileReport?.assertionResults ?? []) {
        if (a.status === "skipped" || a.status === "todo" || a.status === "pending") problems.push(`${t.file}: "${a.fullName}" is ${a.status} (skipped tests are not allowed in a mandatory file)`);
      }
    }
  }
  return { rows, problems };
}

function main(argv: string[]): number {
  const args = argv.filter((a) => a !== "--");
  const flag = (n: string): string | undefined => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const id = args.find((a, i) => /^\d+$/.test(a) && args[i - 1] !== "--manifest" && args[i - 1] !== "--out");
  const ticketId = id?.padStart(2, "0");
  if (!ticketId) { console.error("usage: pnpm test:ticket -- NN [--manifest file] [--out report.json] [--allow-blocked]"); return 1; }
  const manifestPath = resolve(root, flag("--manifest") ?? "tests/tickets.manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest;
  const ticket = manifest[ticketId];
  if (!ticket) { console.error(`FAIL: no mandatory tests registered for ticket ${ticketId}`); return 1; }

  const exists = (f: string): boolean => existsSync(join(root, f));
  const files = [...new Set(Object.values(ticket.requirements).flatMap((r) => r.tests.map((t) => t.file)))];
  let report: VitestReport | undefined;
  if (files.length > 0 && files.every(exists)) { // no files: external-only ticket; `vitest run` with no filter would run the whole suite
    const dir = mkdtempSync(join(tmpdir(), "ticket-dispatch-"));
    const out = join(dir, "report.json");
    const vitest = join(dirname(createRequire(join(root, "package.json")).resolve("vitest/package.json")), "vitest.mjs");
    const r = spawnSync(process.execPath, [vitest, "run", ...files, "--reporter=json", `--outputFile=${out}`], { cwd: root, stdio: ["ignore", "inherit", "inherit"] });
    if (existsSync(out)) report = JSON.parse(readFileSync(out, "utf8")) as VitestReport;
    rmSync(dir, { recursive: true, force: true });
    if (r.status !== 0 && !report) console.error("vitest produced no report");
  }
  const { rows, problems } = evaluate(ticket, report, exists);

  let blocked = 0;
  const externals: { requirement: string; id: string; status: string; note: string }[] = [];
  for (const [req, def] of Object.entries(ticket.requirements)) {
    for (const x of def.external ?? []) {
      const have = spawnSync(x.tool, ["--version"], { cwd: root, shell: process.platform === "win32" }).status === 0;
      if (!have) { blocked++; externals.push({ requirement: req, id: x.id, status: "BLOCKED", note: `${x.tool} not on PATH. Run: ${x.command.join(" ")} (cwd ${x.cwd}). ${x.note}` }); continue; }
      const dirs = (x.reportDirs ?? []).map((d) => resolve(root, x.cwd, d));
      for (const d of dirs) for (const f of reportFiles(d)) rmSync(f, { force: true }); // stale results must never count
      const r = spawnSync(x.command[0] ?? x.tool, x.command.slice(1), { cwd: resolve(root, x.cwd), stdio: "inherit", shell: process.platform === "win32" });
      const cases = dirs.flatMap(reportFiles).flatMap((f) => parseReport(f, readFileSync(f, "utf8")));
      const ev = evaluateExternal(req, x, cases);
      rows.push(...ev.rows); problems.push(...ev.problems);
      const ok = r.status === 0 && ev.problems.length === 0;
      if (r.status !== 0) problems.push(`${req}: external check ${x.id} failed (exit ${r.status})`);
      externals.push({ requirement: req, id: x.id, status: ok ? "PASS" : "FAIL", note: x.note });
    }
  }

  console.log(`\nticket ${ticketId}: ${ticket.title}`);
  for (const r of rows) console.log(`${r.status.padEnd(8)} ${r.requirement} / ${r.acceptance}  ${r.file} :: ${r.name}`);
  for (const x of externals) console.log(`${x.status.padEnd(8)} ${x.requirement} external ${x.id}: ${x.note}`);
  for (const p of problems) console.error(`PROBLEM: ${p}`);
  const outFile = flag("--out");
  if (outFile) writeFileSync(resolve(root, outFile), JSON.stringify({ ticket: ticketId, rows, externals, problems }, null, 2) + "\n");

  if (problems.length > 0) { console.error(`\nFAIL ticket ${ticketId}`); return 1; }
  if (blocked > 0 && !args.includes("--allow-blocked")) { console.error(`\nINCOMPLETE ticket ${ticketId}: ${blocked} external check(s) BLOCKED (not a pass)`); return 3; }
  console.log(`\nOK ticket ${ticketId}${blocked ? ` (with ${blocked} BLOCKED external check(s), allowed by flag)` : ""}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) process.exit(main(process.argv.slice(2)));
