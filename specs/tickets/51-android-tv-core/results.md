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
