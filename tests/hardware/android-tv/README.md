# HS-T51 physical checks — procedures and results (ALL BLOCKED)

Status of every check below: **BLOCKED (missing hardware)**. This VPS has no Android TV device, no emulator acceleration and no certified model.
Nothing here is a pass. No model is certified. Simulator/JVM results in `tests/faults/android-tv` are labelled SIMULATOR and never replace these.

Common setup (each procedure): record exact manufacturer, model, firmware/build, Android version, app build, provisioning method, topology (console -> HDMI -> TV, adapter if any), HDMI mode, date, tester.
Safety: never switch console mains. Setup records HDMI-CEC OFF on the TV and on the console before every run. No ADB over network; use USB debugging only on a bench unit, and never ship a unit with developer mode on.

| ID | AC | Check | Result |
|---|---|---|---|
| P1 | AC-HS-V02-10 | Managed provisioned-unpaired: neutral locked setup shows with no backend and no payment; Home, Back, Input/Source, Menu, Settings and Netflix-style app keys cannot reach the console picture | BLOCKED |
| P2 | AC-HS-V02-10 | Unprovisioned install shows installer/setup only and makes no kiosk claim; keys behave normally | BLOCKED |
| P3 | AC-HS-V02-10 | Pairing timeout, refresh and a server HTTP 200 carrying a locked payload keep the picture locked | BLOCKED |
| P4 | AC-HS-V02-10 | Technician escape: wrong credential denied and audited, five wrong in a minute lock out, correct credential opens setup only (never the picture) | BLOCKED |
| P5 | AC-HS-V02-11 | Three cold reboots (power pulled at the TV, not the console) on the exact certified model/firmware return to locked state or valid session state with no manual relaunch and no re-grant | BLOCKED |
| P6 | AC-HS-V02-11 | Revoke the overlay permission in OS settings: capability fail, not-ready/repair shown, picture locked via the certified fallback; the app never re-grants it | BLOCKED |
| P7 | AC-HS-51 | Ethernet unplugged while a lease runs: lease expires locally and locks; reboot while offline stays locked; no seconds regained | BLOCKED |
| P8 | AC-HS-51 | Replay a captured lease and roll the TV clock back (Settings, and NTP off): no extra seconds | BLOCKED |
| P9 | AC-HS-V02-13 | CEC OFF on TV and console recorded; start, pause, expire, stop and reboot all lock while CEC is off | BLOCKED |
| P10 | AC-HS-V02-13 | Console wake and input-change challenge (wake the console, press source buttons) cannot bypass the lock | BLOCKED |
| P11 | AC-HS-V02-13 | CEC power driver reported unsupported: the app advertises unsupported power but the lock route still works; console mains untouched | BLOCKED |

A partial or unsupported result on P1, P5, P6, P7 or P9 forbids certification of that model.

## How to run each check
1. **P1** Build `assembleDebug`, provision as device owner on a bench unit with the venue's supported method (for example the OEM managed provisioning flow). Boot with no network. Press each key listed, 10 times each, record the screen on a camera pointed at the TV. Expected: neutral locked setup every time.
2. **P2** Sideload without provisioning. Expected: harness shows `claim: NONE`, `readiness: UNSUPPORTED`; Home exits honestly.
3. **P3** Start pairing, wait 5 minutes (expired), refresh, then have a test server answer HTTP 200 `{"state":"LOCKED"}`. Expected: locked throughout.
4. **P4** Enter wrong credentials 5 times inside a minute, then the right one. Expected: DENIED x5, LOCKED_OUT, then after 60 s GRANTED_SETUP_ONLY; the audit file never contains the credential.
5. **P5** With a running lease and a checkpoint, cut TV power and restore, three times. Expected after each boot: no human action, locked `REBOOT_RECOVERY`, never more seconds than the lease window.
6. **P6** Revoke "Display over other apps". Expected: harness shows `PERMISSION_LOST` and `NOT_READY_REPAIR` (or `UNSUPPORTED` when no certified fallback exists); no auto re-grant.
7. **P7** Pull the Ethernet cable (and disable Wi-Fi) during a lease. Expected: lock at expiry; reboot offline stays locked.
8. **P8** Re-deliver the same signed lease after expiry and after a reboot; set the clock back one day. Expected: no added seconds.
9. **P9** Record CEC OFF on both devices, then run start, pause, expire, stop and reboot. Expected: lock holds each time.
10. **P10** Wake the console from standby and cycle TV inputs. Expected: no picture bypass.
11. **P11** Query capabilities. Expected: `cecPower: UNSUPPORTED`, `requiresCec: false`, `requiresConsoleMains: false`.

## Result template (copy one per run, store under `tests/hardware/android-tv/results/`, no photos with people, no secrets)
```
check: P#            date:            tester:
manufacturer/model:                  firmware/build:           android:
app build:           provisioning:                            topology:
hdmi mode:           cec tv/console: off/off
steps done:
expected:
actual:
latency min/p50/p95/max (ms):
home/back/input bypass seen: yes/no
result: PASS | FAIL | BLOCKED(reason)
evidence files (hash only in repo):
```
