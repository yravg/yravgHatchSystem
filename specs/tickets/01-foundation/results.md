# Results - ticket 01 (worker run, not yet independently checked)

Branch `t01-foundation`. Status is owned by the router; this file records only what was run.

## Commands run (worktree, Windows, Node 24.14.1, pnpm 10.33.0)
| Command | Exit | Log |
|---|---|---|
| `pnpm lint` | 0 | evidence/lint.log |
| `pnpm typecheck` | 0 | evidence/typecheck.log |
| `pnpm test` | 0 (7 files, 66 tests) | evidence/test.log |
| `pnpm validate:spec` | 0 (16764 passed, 0 errors) | evidence/validate-spec.log |
| `pnpm test:ticket -- 01` | 3 INCOMPLETE (52 PASS lines, 2 external BLOCKED) | evidence/test-ticket.log |
| `pnpm --filter @yravg/web build`, then `pnpm exec playwright test tests/e2e/ticket-01.spec.ts` | 0 (1 passed) | evidence/playwright.log, playwright-trace.zip, scaffold-home.svg |

## BLOCKED (not PASS)
- Kotlin canonical equality (`gradle --no-daemon :contracts:test` in agents/android-tv): gradle not on PATH; `E:/tools/hatch-env.sh` did not exist. Sources written, never compiled or run.
- .NET canonical equality (`dotnet test`, `dotnet build HatchAgents.slnx` in agents): dotnet not on PATH, same reason. Sources never compiled or run.
- So cross-language identical payloads are proven only against hand-computed golden files on the TypeScript side.
- PostgreSQL migration forward and rollback: N/A, ticket 01 has no tables.
- No Gradle wrapper committed (needs a Gradle run to generate); CI uses setup-gradle 8.10.2.

## Deviations and notes
- Node 24.14.1 locally; spec names Node 26 LTS candidate. CI pins 24.14.1 too.
- `tools/validate_spec.py` is unchanged. It bans node_modules, build output and .png, so `pnpm validate:spec` runs it on a temp copy of tracked and unignored files. This also keeps VALIDATION.json/md unwritten.
- The screenshot is an SVG wrapper around the PNG for the same reason.
- Assumptions (marked in code): error codes VALIDATION_FAILED (400), REVISION_CONFLICT (409), INTERNAL_ERROR (500) are not in the spec text. Brand.* colours are provisional.
- Domain tests were written together with the implementation, not run red first. Red-first was observed only for the contracts generated files, the ui tokens file and the protocol test.
- Playwright uses installed Edge (`PW_CHANNEL`, CI uses chrome). First e2e run failed on a favicon 404; fixed with `apps/web/app/icon.svg`.
- The disk on E: was at 100% during the run (ENOSPC once on test and validate:spec); the reruns above succeeded.
