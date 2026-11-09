# HS-T51 fault scenarios (SIMULATOR evidence)

Kotlin tests in `tests/faults/android-tv/kotlin` are compiled into `agents/android-tv/core` (see its build file) and run with
`cd agents/android-tv && ./gradlew :core:test`. They use a fake clock and an in-memory store, so they are **simulator evidence**:
WAN loss expiry, replay and duplicate leases, wall-clock rollback, three simulated cold reboots, reboot without trusted time,
process death inside one boot, stale epoch, untrusted signer. The physical equivalents are BLOCKED in `tests/hardware/android-tv`.
