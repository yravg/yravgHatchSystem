# Eval HS-T49

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 49` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-49 / AC-HS-49: Reserve→STARTING→APPLIED→ACTIVE before billing. Console moves A→B only after source revoke/lock evidence, destination capacity/quote eligibility and new bounded lease; crash recovery never grants two valid playback leases. Target no-ACK leaves recovery/locked and no duplicate charge; same sessionId/F&B/payment lineage preserved. Source protocol fence makes stale old ACK unusable.
- [ ] HS-V02-09 / AC-HS-V02-09: Transfer tests PS5 station A→B with CEC disabled, same sessionId and F&B, deterministic tariffDelta quote accepted before action. Source gate revoked/locked before destination grant; no-ACK/source-unreachable cannot create duplicate playable seats. Target failure shows recoverable locked state; do not claim uninterrupted gameplay on different console.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
