# Eval HS-T48

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 48` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-48 / AC-HS-48: Balanced IDR journal, unique source event, immutable reversals and payment allocation. Distinct ServerKey/signature-secret fixture verifies callback plus merchant/order/amount/currency and GET status. Duplicate/out-of-order settlement credits once; provider-down remains pending. Mock/sandbox only; no frontend or real credentials.
- [ ] HS-V02-17 / AC-HS-V02-17: Midtrans sandbox dynamic QRIS only verified settlement+merchant/order/amount/currency, separate signature secret vs API ServerKey. No screenshots or clientredirect as payment proof; provider down pending; late settlement routes refund_pending not stolen station.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
