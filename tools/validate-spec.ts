// `pnpm validate:spec`: runs tools/validate_spec.py (router change in commit 77deb83, pending owner confirmation: the ticket status check now requires board.md and rd.md to agree) on Windows and Linux.
// The validator walks every file under the repo root and bans node_modules, build output and .png outside the
// design shots. So it runs on a temporary copy of the tracked and unignored files, which also keeps it from
// rewriting VALIDATION.json/md in the working tree. A clean clone has no such files, so the result is identical.
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const list = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "buffer", maxBuffer: 64 * 1024 * 1024 });
if (list.status !== 0) { console.error("validate:spec needs a git checkout"); process.exit(1); }

const copy = mkdtempSync(join(tmpdir(), "hatch-spec-"));
let code = 1;
try {
  for (const rel of list.stdout.toString("utf8").split("\0").filter(Boolean)) {
    const dest = join(copy, rel);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(join(root, rel), dest);
  }
  // `python3` does not exist on this Windows machine; Linux CI has it.
  const python = process.platform === "win32" ? "python" : "python3";
  const r = spawnSync(python, ["-X", "utf8", "tools/validate_spec.py"], { cwd: copy, stdio: "inherit", env: { ...process.env, PYTHONUTF8: "1" } });
  code = r.status ?? 1;
} finally {
  rmSync(copy, { recursive: true, force: true });
}
process.exit(code);
