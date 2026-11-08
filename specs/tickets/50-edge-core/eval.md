# Eval HS-T50

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 50` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-50 / AC-HS-50: Windows/Linux .NET10 SQLite WAL persists before ACK; challenge8digits/5minutes fixture, device keys/revoke, one outlet epoch. WAN drop valid lease expires locally; reboot without trusted time locks picture. Offline new start/extend/spend zero. CEC is optional; adapter path continues with CEC off at TV+console. No settings UI or real console power operation.
- [ ] HS-V02-12 / AC-HS-V02-12: Block ALL external interfaces including emulator Ethernet, prove route/status and server unreachability before test. Valid lease finishes by deadline; no new grants; clock rollback/reboot/duplicate/replay cannot gain seconds. Reboot untrusted time fail closed. Evidence distinguishes true offline from Wi-Fi-only toggle.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
