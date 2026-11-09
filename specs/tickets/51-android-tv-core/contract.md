# HS-T51 team contract — AGREED

Agreed: 2026-11-09T04:20:00Z. Single worker (Claude Sonnet 5.5, Orca task_52e12306c371) on branch `t51-android-tv`; no second worker joins without a new contract.
Protocol revision: v1 (CONTRACTS section 5, generated Kotlin from packages/contracts). No schema change.

## Exact file ownership (T51 only)
- `agents/android-tv/settings.gradle.kts`, `agents/android-tv/build.gradle.kts` (adds `:core`, `:app`; wrapper and `:contracts` stay as is)
- `agents/android-tv/core/**` pure Kotlin JVM module, package `id.yravg.hatch.core` (provisioning, lease verification, time trust, lock decision, technician escape, CEC record, state store)
- `agents/android-tv/app/**` Android module, namespace `id.yravg.hatch`, functional neutral harness screen only (no product UI)
- `tests/faults/android-tv/**` fault-scenario Kotlin tests, compiled into `:core` test source set
- `tests/hardware/android-tv/**` physical procedures and result templates (all BLOCKED, none certified)
- `specs/tickets/51-android-tv-core/{contract.md,results.md,evidence/**}` (status line in rd.md and board is NOT changed)

## Shared files (additive lines only, Merger resolves line conflicts)
- `tests/tickets.manifest.json`: own entry "51" only
- `CHANGELOG.md`: one Unreleased line
- Not touched: `services/api/src/app.ts`, `services/api/src/tenancy/permissions.ts` (no API route here), `tests/identity/migrate.test.ts` (T51 adds no migration; T49 owns 0005), any `packages/contracts` schema.

## Fixtures
- Ed25519 lease vector: read-only from `packages/contracts/leases/vector.json` (public key only; T50-owned). Runtime test keys are generated in-test and never stored.
- Technician credentials in tests are throwaway literals, stored only as salted hashes by the code under test.

## Rules
No UI, no network ADB, no root, no hidden permission grant, no live keys. Hardware not available => BLOCKED, never pass.
