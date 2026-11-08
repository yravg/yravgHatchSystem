# Eval HS-T46

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 46` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-46 / AC-HS-46: Role outlet+tenant enforced server-side; staff TOTP enrollment/recovery/revocation and step-up for owner/refund approvals tested without real account. 10 wrong OTP attempts rate-limited; replay rejected; recovery codes single-use/hash only. Existing T02 consumes this API after accepted backend dependencies.
- [ ] HS-V02-07 / AC-HS-V02-07: TOTP uses trusted server time, narrow skew, verified enrollment; recovery single-use hashes; replayed OTP rejected within accepted step; step-up expiry. Fail closed if second factor missing, rate limits per actor/source, no secret in logs, fixture secrets only. Support cannot bypass without approved audited recovery.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
