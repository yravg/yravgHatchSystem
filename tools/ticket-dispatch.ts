// Ticket dispatcher: `pnpm test:ticket -- NN`.
// Reads tests/tickets.manifest.json, runs the mandatory tests of ticket NN for real and exits non-zero when any
// mandatory test is missing, skipped, todo, failed, or was never executed. It does not grep for IDs.
// Exit codes: 0 all mandatory checks passed | 1 failure or missing | 3 passed but an external check is BLOCKED.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface TestRef { file: string; names: string[] }
export interface External { id: string; tool: string; cwd: string; command: string[]; note: string }
export interface Requirement { acceptance: string; tests: TestRef[]; external?: External[] }
export interface Ticket { title: string; requirements: Record<string, Requirement> }
export type Manifest = Record<string, Ticket>;
export interface VitestReport {
  testResults: { name: string; assertionResults: { fullName: string; status: string }[] }[];
}
export interface Row { requirement: string; acceptance: string; file: string; name: string; status: "PASS" | "FAIL" | "MISSING" | "SKIPPED" | "NOT_RUN" }

const norm = (p: string): string => p.replace(/\\/g, "/");

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
  if (files.every(exists)) {
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
      const r = spawnSync(x.command[0] ?? x.tool, x.command.slice(1), { cwd: join(root, x.cwd), stdio: "inherit", shell: process.platform === "win32" });
      const ok = r.status === 0;
      if (!ok) problems.push(`${req}: external check ${x.id} failed (exit ${r.status})`);
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
