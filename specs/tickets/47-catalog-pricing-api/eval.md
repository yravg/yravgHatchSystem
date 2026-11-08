# Eval HS-T47

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 47` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-47 / AC-HS-47: One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.
- [ ] HS-V02-01 / AC-HS-V02-01: One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.
- [ ] HS-V02-02 / AC-HS-V02-02: Fixture minimum5.000/30min then12.000/hour;20min=5.000,30min=5.000,40min=7.000; pause does not consume covered minutes. Minimum once/session even retry/reconnect/zone-transfer; insufficient balance cannot activate. D26 approval before production.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
