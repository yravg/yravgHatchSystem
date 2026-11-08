# Results - ticket 01 (worker run, not yet independently checked)

Branch `t01-foundation`. Status is owned by the router; this file records only what was run.

## Linux run (VPS, Ubuntu 24.04), logs in evidence/vps/
Versions: node v26.13.0 (and system v24.21.0 for step 1), pnpm 10.33.0, OpenJDK 21.0.13, Gradle 9.9.0, dotnet 10.0.403.
| Command | Exit | Log |
|---|---|---|
| node 24: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm test` | 0, 0, 0 (66 tests) | vps/node24-install-lint-typecheck-test.log |
| node 24: `pnpm typecheck` | 1: the nested `pnpm -r` could not find `pnpm` on PATH (corepack, no shim). Environment fault, rerun on node 26 with a pnpm shim = 0 | same log |
| node 26: `pnpm lint`, `pnpm typecheck`, `pnpm test` (7 files, 66 tests), `pnpm validate:spec` (16764 passed, 0 errors), `pnpm --filter @yravg/web build` | 0 each | vps/node26-gates-and-playwright.log |
| `gradle wrapper --gradle-version 9.9.0`, then `./gradlew --no-daemon :contracts:test` in agents/android-tv | 0 (ConformanceTest 6 tests, 0 failures) | vps/kotlin-gradle.log |
| `dotnet build HatchAgents.slnx` / `dotnet test Hatch.Contracts.Tests/Hatch.Contracts.Tests.csproj` in agents | 0 (0 warnings, 0 errors) / 0 (6 passed) | vps/dotnet.log |
| `pnpm test:ticket -- 01` (gradle and dotnet on PATH) | 0: all mandatory tests PASS, kotlin-canonical-equality PASS, dotnet-canonical-equality PASS | vps/test-ticket-01.log |
| Clean clone (`git clone` of commit a949248, fresh `pnpm install --frozen-lockfile`, lint, typecheck, test, `test:ticket -- 01`, `./gradlew :contracts:test`) | 0 for every command | vps/clean-clone.log |
| `PW_CHANNEL=chromium pnpm exec playwright test tests/e2e/ticket-01.spec.ts` | 1: BLOCKED, see below | vps/node26-gates-and-playwright.log |

TypeScript, Kotlin and .NET each parse the shared fixtures in packages/contracts/fixtures and re-emit canonical JSON; Kotlin and .NET compare it byte for byte with packages/contracts/fixtures/canonical/*.json (the TypeScript goldens), and the TypeScript test checks the same files. No Kotlin or .NET source needed a fix.

Gradle wrapper: agents/android-tv/gradle/wrapper/gradle-wrapper.jar sha256 621008afc4f5d59357fcf06ffa644dd5aade5e091bdc363742710445f73cdaf8 equals the value published at https://services.gradle.org/distributions/gradle-9.9.0-wrapper.jar.sha256. `distributionSha256Sum` pins the 9.9.0 bin zip.

## Earlier Windows laptop run (Node 24.14.1), logs in evidence/laptop/
lint 0, typecheck 0, test 0 (66), validate:spec 0, Playwright smoke 0 (Edge, 1 passed). Its `test:ticket` was INCOMPLETE (exit 3) because gradle and dotnet were missing; superseded by the Linux run.

## BLOCKED (not PASS)
- Playwright smoke on Linux: `pnpm exec playwright install chromium` succeeded (exit 0), but chromium and chrome-headless-shell fail to launch: `error while loading shared libraries: libatk-1.0.so.0` (also missing: libatk-bridge-2.0, libXcomposite, libXdamage, libXfixes, libXrandr, libgbm, libasound, libatspi). Installing them needs apt, which this host forbids. The only passing browser smoke is the laptop Edge run. `pnpm test:e2e` in CI (ubuntu-24.04 with PW_CHANNEL=chrome) is not yet proven.
- PostgreSQL migration forward and rollback: N/A, ticket 01 has no tables.

## Screenshot and trace
The PNG-in-SVG wrapper is removed. The laptop run PNG and trace are untracked under evidence/artifacts/ (git-ignored); sha256, size and command are in requirements-evidence.json. The PNG was recovered from the wrapper (commit af2d076), not re-rendered, so it is the laptop render.

## Deviations and notes
- Node pin moved to 26.13.0 (.nvmrc, engines `>=26.13.0`, CI) after every gate passed on node v26.13.0. Laptop developers on Node 24 now get an engines warning.
- `tools/validate_spec.py` is unchanged. It bans node_modules, build output and .png, so `pnpm validate:spec` runs it on a temp copy of tracked and unignored files.
- Assumptions (marked in code): error codes VALIDATION_FAILED (400), REVISION_CONFLICT (409), INTERNAL_ERROR (500) are not in the spec text. Brand.* colours are provisional.
- Domain tests were written together with the implementation, not run red first. Red-first was observed only for the contracts generated files, the ui tokens file and the protocol test.
- CI: kotlin job now uses ./gradlew; node job still passes `--allow-blocked` to test:ticket because gradle/dotnet are covered by their own jobs.
- Commit identity on the VPS: git user.email was not set (a tool guard blocked the owner address), commits use a GitHub noreply address; re-author if needed.

## Checker follow-up fixes (branch t01-fix, Linux VPS, evidence/vps/checker-fixes.log)
- global.json pins .NET SDK 10.0.403 with rollForward disable (build did not break; dotnet --version in the repo and in agents/ prints 10.0.403). CI dotnet job uses global-json-file.
- Every uses: in ci.yml is pinned to a full commit SHA with the tag in a comment (SHAs from git ls-remote, annotated tags peeled). Not run: the workflow itself (needs GitHub).
- tools/validate-spec.ts comment corrected (validator change in 77deb83 is a router change pending owner confirmation).
- Rerun, all exit 0: install --frozen-lockfile, lint, typecheck, test, validate:spec, test:ticket -- 01, dotnet build (0 errors), dotnet test (6 passed), ./gradlew --rerun-tasks :contracts:test.
