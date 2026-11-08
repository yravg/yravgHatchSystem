# Eval HS-T53

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 53` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-53 / AC-HS-53: Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.
- [ ] HS-V02-06 / AC-HS-V02-06: Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
