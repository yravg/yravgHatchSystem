# Eval HS-T54

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 54` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-54 / AC-HS-54: Fresh clone generates TS/Kotlin/.NET payload schemas; contract fixtures and fault scenarios run twice with expected/actual evidence. No fake browser/UI pass. API/auth/payment/session/edge/TV/shift accepted artifacts and signed version manifest are consumed by original UI tickets after final design; missing physical test means uncertified/blocked, not simulated pass.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
