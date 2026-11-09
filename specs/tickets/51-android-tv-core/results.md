# HS-T51 results — worker run (status NOT changed; awaiting Merger + independent Checker)

Evidence level: **SIMULATOR / JVM unit tests only.** No Android TV device, emulator acceleration or certified model exists here. Every physical check is **BLOCKED (missing hardware)** with a procedure in `tests/hardware/android-tv/README.md` (P1-P11). No model is certified. No UI proof is claimed.

## Delivered
- `agents/android-tv/core` (pure Kotlin, `id.yravg.hatch.core`): profiles `UNPROVISIONED_APP` / `PROVISIONED_UNPAIRED`, `TvCore` lock decision, Ed25519 `LeaseVerifier` (T50 vector), monotonic time trust (reboot clears trust in the same save as the new boot id; rollback refused; a lease resumed after reboot is capped by the checkpoint), pairing tracker (8 digits / 5 min), `TechnicianEscape` (PBKDF2 hash, audit, 5/min lockout, setup-only 5 min), CEC setup record and unsupported-power advertisement, read-only overlay probe, fallback lock route port.
- `agents/android-tv/app` (namespace `id.yravg.hatch`): neutral text harness, device-owner detection, lock task mode when device owner, boot receiver, BouncyCastle Ed25519 (works below API 33), manifest with only SYSTEM_ALERT_WINDOW + RECEIVE_BOOT_COMPLETED.
- `tests/faults/android-tv` (simulator fault scenarios), `tests/hardware/android-tv` (procedures, all BLOCKED), manifest entry "51", CHANGELOG line.

## Build and gates (exit codes)
| Command | Exit | Result |
|---|---|---|
| `pnpm install --frozen-lockfile` | 0 | lockfile unchanged |
| `pnpm lint` | 0 | |
| `pnpm typecheck` | 0 | |
| `pnpm test` | 0 | 21 files, 227 tests passed |
| `pnpm test:ticket -- 51` | 0 | 4 external checks PASS (gradle, simulator) |
| `pnpm test:ticket -- 50` / 48 / 47 / 46 | 0 / 0 / 0 / 0 | |
| validator on a clean `git archive HEAD` export, `python3 -I tools/validate_spec.py` | 0 | 16766 passed, 0 errors |
| `cd agents/android-tv && ./gradlew --no-daemon testDebugUnitTest assembleDebug :contracts:test --rerun-tasks` | 0 | core 31, app 6, contracts 6 tests; 0 failed, 0 skipped; app-debug.apk built |

Logs are in `evidence/`. Red-first: `evidence/red-first-core-compile.log` (364 compiler errors, tests written before any production code) and `evidence/red-first-app-compile.log`. Both red runs were compile failures (missing types), then green on the first implementation run.
Migration: T51 adds no migration; up/down/up is covered by `tests/identity/migrate.test.ts` inside `pnpm test` (exit 0). `hatch_t51` was not needed and not created.

## Android toolchain (exact)
Licences accepted once (`sdkmanager --licenses`, owner-approved). Installed: `platform-tools` 37.0.1, `platforms;android-36` rev 2, `build-tools;36.0.0`. Gradle 9.9.0 wrapper (unchanged), AGP 9.5.1, Kotlin 2.4.20 (bumped from 2.0.21 for all modules; plugin versions now declared once in `agents/android-tv/build.gradle.kts`; `:contracts/build.gradle.kts` edited only to drop its plugin versions, T01 conformance still 6/6 green), kotlinx-serialization-json 1.7.3, BouncyCastle bcprov-jdk18on 1.85, JDK 21.

## Blocked / not checked
- BLOCKED (no hardware): P1-P11 (physical Home/Back/input, 3 cold reboots on an exact model/firmware, Ethernet-unplugged offline, CEC-off with real TV+console, console wake/input challenge, permission revoke on device).
- Not run: APK install, real device-owner provisioning, `startLockTask`; `Settings.canDrawOverlays` and `BOOT_COUNT` behaviour (Android-framework glue is compiled, not executed). No Robolectric.
- No certified fallback lock route exists: `NoFallback` is wired, so a lost overlay reports `UNSUPPORTED`, which forbids certification.
- Trust bundle and device id are read from app storage written by venue provisioning; that provisioning step is not built here.
- Existing identity tests use one shared `hatch_t46` database with a schema per file; the parallel T49 worker may use it too.
- The clean export used `mktemp -d` instead of `rm -rf /tmp/t51-export` (same effect, nothing deleted).

## Fix round 1 (Checker defects D1, D2, CI)
- **D2.** New test `FaultScenariosTest::checkpoint cap alone stops a replay after reboot from gaining seconds when the trusted-time floor is lost` (floor wiped in the stored state, authority time earlier than the checkpoint: window arithmetic gives 590 s, the cap holds 500 s). Red with the cap at `TvCore.applyLease` removed (`evidence/red-first-checkpoint-cap.log`, exit 1, failure at FaultScenariosTest.kt:86), green with it restored (`evidence/green-checkpoint-cap.log`). The cap is defence in depth behind the trusted-time floor: with the floor intact no input reaches it, so the test models a lost floor and says so.
- **D1.** `tools/ticket-dispatch.ts`: an external entry lists `mandatory` test names (matched against `<class>::<test>`), `reportDirs` and `minTests`; the dispatcher deletes stale reports, runs the command, parses Gradle/JUnit XML or .NET TRX, and a missing, failed or skipped named test, any skipped test or too few passing tests is non-zero. An external without names must opt out with `exitCodeOnly`. Also fixed: an external-only ticket made `vitest run` run with no file filter (whole suite; recursion in the self-test). Manifest names filled for T51 (4 requirements), T50 (.NET core and offline) and T01. Self-tests: 11 new cases in `tools/ticket-dispatch.test.ts` including a CLI run with a fake runner where deleting one named test exits 1 although the command exits 0. Real check: moving `TechnicianEscapeTest.kt` away gives `pnpm test:ticket -- 51` exit 1, 5 MISSING and count 39 < 44 (`evidence/d1-delete-test-red.log`); restored, exit 0 (`evidence/test-ticket-51-fix1.log`).
- **CI.** kotlin job installs the Android SDK from Google's cmdline-tools 22.0 zip pinned by sha256 (only the `android-sdk-license` text is written; platforms;android-36, build-tools;36.0.0) and runs `./gradlew --no-daemon testDebugUnitTest assembleDebug :contracts:test`. All actions stay SHA-pinned.
- **Gates** (`evidence/fix1-gates.txt`): install 0, lint 0, typecheck 2 on first run (TS2379 in the new test) then 0 after the fix, `pnpm test` 0 (29 files, 318 tests), test:ticket 51/50/49/48/47/46 0, 01 `--allow-blocked` 0, validator on clean export 0, `dotnet test HatchAgents.slnx` 0 (6 + 45 passed), gradle `--rerun-tasks` 0 (44 tests, 0 failed, 0 skipped).
