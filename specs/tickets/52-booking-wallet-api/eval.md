# Eval HS-T52

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 52` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-52 / AC-HS-52: Concurrent slot allocation wins once. Basic-zone pass cannot start VIP; VIP pass can start basic only with explicit compatible console/category and time seconds unchanged. Group deposit percent of per-seat hourly quote:Rp12.000 andRp18.000 at25%=Rp3.000+Rp4.500; checkout quote displays basis and rounding. Arrival releases hold once; no-show conversion disabled by default. Source-setting parity is configurable, not automatically enabled policy.
- [ ] HS-V02-03 / AC-HS-V02-03: Level1 pass→level2 denied before debit/command; level2→level1 allowed only configured compatible category. Same seconds retained, no cash conversion/extra discount stacking. Frozen session quote; transfer re-evaluates only under approved delta quote, never retroactively reprices.
- [ ] HS-V02-04 / AC-HS-V02-04: Settings version contains publicBooking/group enabled,maxSeats,min/maxDuration,buffer,allowFutureBookingOnBusy,checkInWindow,preBookingGuard,notificationLead/interval,weekday availability and deposit basis. Invalid overlaps/negative settings rejected. Active paid session is never pre-empted silently.
- [ ] HS-V02-05 / AC-HS-V02-05: Separate liability per seat, not percentage of whole duration unless policy chooses it. Staff cancel reason required. Arrival/first valid start returns/reserves/applies deposit exactly once according explicit policy. Cancel before cutoff returns; late cancel/no-show forfeiture disabled until D31 lock. Timer/job retry cannot both forfeit and return.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
