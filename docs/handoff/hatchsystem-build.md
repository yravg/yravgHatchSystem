# HatchSystem build handoff

Roadmap: docs/roadmap/hatchsystem-build.md. Spec: BUILD-PROMPT.md, CLAUDE.md, specs/tickets/board.md.
Branch: spec-v0.2, pushed to origin (public) on owner approval 2026-11-09. Router session runs orchestration only.

## Status
| Step | State | Evidence |
| --- | --- | --- |
| Spec v0.2 import | done | commit afa5494; validator 16761/16761 |
| T01 marked ready (owner launcher approval) | done | board.md row 01 + 01-foundation/rd.md Status ready |
| T01 build | done | t01-foundation 5e2d6dc (laptop af2d076 + VPS Linux run); fixes f15270d, 4f45361 |
| T01 merge + independent check | done | Merger e96d0fe (no conflicts); Checker PASS on fresh clone incl. forced Kotlin rerun, .NET, mutation and gate-honesty tests, Playwright in mcr.microsoft.com/playwright:v1.65.0-noble |
| T01 status | done | board.md + 01-foundation/rd.md |

## Machine toolchain (2026-11-08)
node v24.14.1, pnpm 10.33.0, Python 3.11 (`python`, no `python3` on Windows), OpenJDK 11.
Missing: .NET SDK (dotnet host present, no SDK), JDK 17+, Gradle, Android SDK, PostgreSQL, Docker.

## Owner approvals (recorded)
- 2026-11-08: install missing dev tools under E:	ools (portable, no PATH/system changes).
- 2026-11-08: accept the Android SDK licence (`sdkmanager --licenses`) when T51 starts, not before. Covers SDK packages T51 needs; no other terms.
- 2026-11-09: allow agent SSH to hostinger-vps for building/testing (project-local allow rules in .claude/settings.local.json, not committed). Production containers stay untouched.
- Not approved: VPS deployment (staging later needs separate approval), any money/payment policy.

## Build host (from T01 Merger onward)
- Hostinger VPS `hostinger-vps` (KVM 2: 2 vCPU, 8 GB, Ubuntu 24.04 + Coolify), Orca host `ssh:hostinger-vps`.
- Checkout: /srv/hatch/repo (branch spec-v0.2). Validator there: 16764/16764.
- The VPS also runs production apps (schedmate, yraverage hub, milestone). Run every HatchSystem build/test through /srv/hatch/capped.sh (MemoryMax=3G, CPUQuota=150%, nice 10).
- No deploy, no public port, no Coolify app for HatchSystem without separate owner approval.
- 2026-11-09 owner asked for a Tailscale-only preview. Worktree /srv/hatch/wt/preview (c035189), both bound to the Tailscale IP only, run via capped.sh with setsid nohup (no systemd unit, so they stop on VPS reboot):
  - web `next start` http://100.108.253.30:3100/ (log /srv/hatch/out/preview-web.log)
  - API health http://100.108.253.30:3101/api/v1/health (/srv/hatch/out/preview-api.mjs, log preview-api.log)
  - Stop: `pkill -f "next start -H 100.108.253.30"; pkill -f preview-api.mjs`. Update: `git -C /srv/hatch/wt/preview checkout --detach origin/spec-v0.2`, rebuild, restart.

## Known failures / follow-ups
- Validator status-check change (77deb83) pending owner confirmation.
- CI not yet run on GitHub Actions; Playwright `chrome` channel in CI untested (Checker used bundled chromium).
- Node CI job runs test:ticket with --allow-blocked; Kotlin/.NET proven only by their own jobs.
- Idempotency 409 tested at domain level only, in-memory store; concurrent same-key untested (relevant from T46).
- Kotlin/C# not linted (ESLint ignores agents/).

## Next step
T46 (identity/tenancy/staff 2FA API) is the next eligible ticket. It needs explicit owner readiness in board.md and its rd.md before dispatch.
