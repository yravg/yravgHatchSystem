# Eval HS-T51

## Checks
`python3 tools/validate_spec.py`; `pnpm lint && pnpm typecheck && pnpm test:ticket -- 51` once T01 establishes real scripts. Require API/contract/domain tests, not ID grep. Native scope: `dotnet test` / Android `./gradlew testDebugUnitTest assembleDebug`; physical checks where specified.

## Acceptance per requirement
- [ ] HS-51 / AC-HS-51: Venue-owned supported provisioned-unpaired profile shows neutral locked setup, Home/Back/input cannot reach console; UNPROVISIONED ordinary app never claims kiosk security. Managed supported setup survives3cold reboots with normal overlay permission retained or supported adapter keeps picture gated. Revoked permission => not-ready/repair, never force grant. WAN expiry and replay/reboot tested with Ethernet also blocked. CEC off on both TV+console, no HDMI-CEC dependency. Functional neutral test harness only, final UI owned by original integration ticket.
- [ ] HS-V02-10 / AC-HS-V02-10: UNPROVISIONED_APP is installer/setup, no kiosk claim. Venue-owned PROVISIONED_UNPAIRED locks picture without payment/backend pairing, retains only technician setup escape with audited local credential. Pairing timeout/refresh/HTTP200locked payload does not grant play; physical Home/Back/input tests required.
- [ ] HS-V02-11 / AC-HS-V02-11: Three cold reboots on exact certified model/firmware return to locked provisioning/valid session state without manual relaunch or regrant under supported provisioning. Permission missing/revoked => capability fail and lock via certified fallback; never programmatic hidden permission grant. Partial unsupported result forbids certification.
- [ ] HS-V02-13 / AC-HS-V02-13: Venue setup records CEC off on BOTH TV and console. Start/pause/expire/stop/reboot lock proven while CEC disabled; console wake/input challenge cannot bypass. If CEC-specific optional power driver unsupported, advertise unsupported power command but keep lock over native/HDMI/IR route; never require CEC or console mains.

## Edge / failure cases
Duplicate/reordered/stale requests; cross-tenant; permission revoked; timeout/provider outage; wrong/replayed signature; split brain; clock rollback; process death/reboot; invalid transition; no negative balances. No UI proof fabricated.

## Evidence
results.md and evidence/requirements-evidence.json per owned requirement: testPath, command, exitCode, expected, actual, artifact, verificationLevel; actual model/firmware for hardware, fixture/simulator explicitly labelled. Never vendor images/credentials.

## Definition of done
All active owned AC pass, migrations/rollback checked, same-worker fixes complete, Merger+independent Checker accepts API/native artifact. No final-product visual claim. Missing mandatory target means blocked. Human-ready and decision locks recorded.
