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
| T46 identity/tenancy/2FA API | done | worker t46-identity 528346d; Merger merge-t46 efe6a70 (no conflicts, all gates 0, validator 16764/16764 on git archive); Checker PASS (6/6 mutations caught, real HTTP 21/21, 0 secret hits, migration up/down/up, Kotlin JVM :contracts:test 6/6; Android BLOCKED no SDK). Evidence VPS /home/user/dev/HatchSystem/evidence/t46-checker/ |
| T47 stations/rational pricing/minimum API | done | worker t47-pricing 18d3b4b (red-first logged); Merger merge-t47 def55d2 (no conflicts, all gates 0, 147 tests, validator 16764/16764); Checker PASS (6 mutations caught, live HTTP 61s=Rp169, 20/30/40min=5000/5000/7000, 10 concurrent reserves = 1 winner, 6000 random cases 0 mismatches vs independent BigInt reference). Evidence VPS /home/user/dev/HatchSystem/evidence/t47-checker/ |
| T48 ledger/Midtrans QRIS sandbox | done | worker t48-ledger ec3b0d7 (red-first commit e73cbee); Merger merge-t48 2680a2e (no conflicts, 206 tests, validator 16764/16764); Checker PASS (11/12 mutations killed, 1 equivalent; 36/36 real-HTTP checks vs Checker's own loopback Midtrans mock; fail-closed startup). Evidence VPS /home/user/dev/HatchSystem/evidence/t48-checker/REPORT.md |
| T50 edge core (pairing, epoch, Ed25519 leases, .NET edge) | done | worker t50-edge bfdd84d; Checker round 1 FAIL D1 (stale time trust after reboot+restart); same-worker fix 1544500 (4 regression tests, red first); Merger merge-t50 d54c692 (227 tests, dotnet 6+45); Checker round 2 PASS (15 mutations, real-process SIGKILL/reboot/rollback); router re-ran all 45 VenueEdge tests inside an empty network namespace (no interface, no route; evidence/offline-netns-venueedge-tests.log). Physical Ethernet-unplugged venue test BLOCKED (no hardware). Evidence VPS /home/user/dev/HatchSystem/evidence/t50-checker/ |
| T49 session coordinator and console transfer API | done | worker t49-session 84b7089 (73 new tests, red first, 14/14 mutations); Merger merge-t49 ce2b6f1 (307 tests, CI 42564315011 green); Checker PASS (9/9 mutations, 46/46 real-HTTP checks incl. both T47 gaps closed: minimum once across transfer, INSUFFICIENT_BALANCE 409). Evidence VPS /home/user/dev/HatchSystem/evidence/t49-checker/ |
| T53 stock, orders and X/Z shift close API | done | worker t53-operations f35b33a (29 red tests first, 8/8 mutations); Merger merge-t53 180b738 (349 tests; CI 42572528680 green after rerun of a Kotlin download flake); Checker PASS (13/13 mutations, 35/35 real-HTTP checks; order QRIS needs provider status + merchant/order/amount/currency match). Evidence VPS /home/user/dev/HatchSystem/evidence/t53-checker/SUMMARY.md |

## Machine toolchain (2026-11-08)
node v24.14.1, pnpm 10.33.0, Python 3.11 (`python`, no `python3` on Windows), OpenJDK 11.
Missing: .NET SDK (dotnet host present, no SDK), JDK 17+, Gradle, Android SDK, PostgreSQL, Docker.

## Owner approvals (recorded)
- 2026-11-08: install missing dev tools under E:	ools (portable, no PATH/system changes).
- 2026-11-08: accept the Android SDK licence (`sdkmanager --licenses`) when T51 starts, not before. Covers SDK packages T51 needs; no other terms.
- 2026-11-09: allow agent SSH to hostinger-vps for building/testing (project-local allow rules in .claude/settings.local.json, not committed). Production containers stay untouched.
- 2026-11-09: owner marked T46, T47, T48, T50, T49, T51, T53, T54 ready (backend chain). Money rules for T47/T48 (D01, D15, D26): DECISIONS.md sandbox defaults as labelled fixtures only; production money policy stays unapproved. UI tickets stay draft.
- 2026-11-09: owner approved `claude update` on the VPS (2.1.283 to 2.1.319); owner logs in interactively.
- 2026-11-09: owner keeps both validator changes: 77deb83 (board+rd status agree instead of draft-only) and ci-fix 2871108 (scan git-tracked files in a checkout).
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

## Live previews (Tailscale only, yravgvps standard, user dev)
- Web: service hatchsystem-dev-web, http://100.108.253.30:33101/ (next dev from the preview checkout /home/user/dev/HatchSystem/yravgHatchSystem; UI tickets still draft, so scaffold only).
- API: service hatchsystem-api-dev-web, http://100.108.253.30:33103/api/v1/health, started by /home/user/dev/HatchSystem/run-preview-api.sh against database hatch_preview with fixture seed (services/api/scripts/seed-preview.ts). Walkthrough: docs/operator/api-preview.md. Logins only in /home/user/dev/HatchSystem/preview-credentials.txt (mode 600). Payments off. Verified 2026-11-09: health 200, login 200 (cashier), stations 200 (2), quote 5400 s = Rp18000, cross-tenant 404, wrong password 401, public IP refused.
- Update after a merge: git -C /home/user/dev/HatchSystem/yravgHatchSystem pull --ff-only origin spec-v0.2, pnpm install, then `vps-preview add` again (root) or restart the two units.
- The old root previews on 3100/3101 are stopped.

## Known failures / follow-ups
- CI not yet run on GitHub Actions; Playwright `chrome` channel in CI untested (Checker used bundled chromium).
- Node CI job runs test:ticket with --allow-blocked; Kotlin/.NET proven only by their own jobs.
- Idempotency 409 tested at domain level only, in-memory store; concurrent same-key untested (relevant from T46).
- Kotlin/C# not linted (ESLint ignores agents/).
- Validator flags node_modules inside a worktree; gates run it on a `git archive HEAD` export.
- T46: worker wrote tests after code (mutation check substitutes); no RLS (explicit scoped queries); trustProxy unset; no server key bootstrap; owner must lock role/MFA/step-up TTL assumptions in specs/tickets/46-identity-api/results.md before production.
- T47: zone-transfer minimum-once and insufficient-balance activation refusal proven only in the pure core; T49 must test both over its API. New permissions station.manage/rate.manage (manager gets station.manage) need owner D02 lock. Money values are sandbox fixtures (D01/D26 unapproved).
- T48 advisories: public Midtrans notification endpoint has no rate limit (add edge limit before production); no provider refund API (refunds stay pending, per D15); real Midtrans sandbox schema unverified (mock only); equal ServerKey and signature secret is accepted; T01 test:ticket matches test names by substring.
- 2026-11-09: VPS deploy key added (GitHub deploy key 169227887, read-write); VPS workers push directly.
- T50 advisories: WebSocket/mTLS transport, service host and ACK HTTP client not built (out of T50 AC; Checker 1 says T20, Checker 2 found no owner ticket; CONTRACTS section 5 transport must be carried by an owner-approved ticket); TimeTrust.Establish public and unauthenticated; dispatcher does not enforce .NET test names.
- T49 notes: migration 0005 widens T48's t48_intent_guard (adds settled to refund_pending only; Checker accepted). Not built, out of T49 AC: extend, wallet-paid starts (T52), manual billing, return-to-source recovery, worker sweep wiring.
- T53 notes: stock consumed on order accept, not reserve/fulfil as CONTRACTS describes (Checker: non-blocking; owner/T45 UI owner should decide); a duplicate Z with a different actual-cash amount silently returns the existing close (consider 409); 0006 down refuses once T53 ledger rows exist (by design); D08/D17/D30 are unapproved fixtures; order QRIS settles via staff verify that requires provider status match (no webhook path for orders).
- CI was red from T46 to T50 (no Postgres service in CI); ci-fix branch fbe6114 green (run 42559375437), merge pending.
- Android SDK absent on VPS: Android tasks blocked (T51 needs it; owner approved licence at T51).

## Next step
T46, T47, T48, T50 done. Merge ci-fix, then T49 and T51 in parallel; then T48 and T50 in parallel; then T49 and T51; then T53; then T54. Each needs its dependencies done (Merger + independent Checker) first.
