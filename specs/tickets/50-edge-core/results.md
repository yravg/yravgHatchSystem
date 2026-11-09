# HS-T50 results — edge gateway, pairing and lease core (headless)

Worker: single worker, branch `t50-edge`. Status of the ticket is NOT changed here. Hardware and true offline are BLOCKED, not passed.

## What was built
- `services/api/src/devices`, `services/api/src/edge`, migration `0004_edge_devices`: device slots, pairing challenge (8 digits, 5 min, staff approval, refresh revokes old code, 5 wrong attempts/min/device, code stored as HMAC), per-device Ed25519 key pinned at approval, revocation (also fences the authority holder), one fenced authority epoch per outlet, device-signed ACK intake (stale or future epoch rejected, duplicate ACK idempotent).
- `packages/contracts/leases`: Ed25519 lease signing/verification over RFC 8785 canonical JSON, plus a signing vector (`vector.json`, throwaway key discarded) verified by TypeScript AND .NET. Schema and generated TS/Kotlin/.NET files are untouched.
- `agents/venue-edge` (.NET 10 library) + `agents/Hatch.VenueEdge.Tests` (xunit, in HatchAgents.slnx): SQLite WAL + synchronous FULL, persist-before-ACK outbox, append-only events, lease runtime on the monotonic clock, reboot fails closed, offline allowance 0, fenced epoch, optional CEC, simulated display, refusing network handler.

## Gates (exit codes; full logs in evidence/)
| Command | Exit | Result |
|---|---|---|
| pnpm install --frozen-lockfile | 0 | lockfile unchanged |
| pnpm lint | 0 | |
| pnpm typecheck | 0 | |
| pnpm test | 0 | 168 tests passed (was 147 before T50) |
| pnpm test:ticket -- 50 | 0 | OK, includes the .NET external check |
| pnpm test:ticket -- 47 | 0 | OK |
| pnpm test:ticket -- 46 | 0 | OK |
| python3 tools/validate_spec.py (clean git archive of HEAD) | 0 | errors: [] |
| migration up / down / up on hatch_t50 | 0 / 0 / 0 | 0001, 0002, 0004 |
| cd agents && dotnet build HatchAgents.slnx | 0 | 0 errors |
| cd agents && dotnet test HatchAgents.slnx | 0 | Contracts 6/6, VenueEdge 41/41 (45/45 after fix round 1) |

## Red first
- `evidence/red-api-tests.txt`: 16 of 16 API tests failed before any route or migration existed (exit 1).
- `evidence/red-dotnet-tests.txt`: .NET solution build failed (12 errors, edge types missing) before the library existed (exit 1).
- Mutation check: making the offline policy always allow and adding 5 s to the running remaining failed 12 of 41 .NET tests, then was reverted.

## Honest limits
- Kill-before/after-commit is IN-PROCESS crash injection at the commit boundary followed by reopening the database file. It is simulator evidence, not a real `kill -9` of a process.
- Offline proof (AC-HS-V02-12) is SIMULATOR evidence: an in-process HttpMessageHandler refuses every connection (5 attempts, 5 refused, 0 sent). `unshare -rn` is not permitted for user dev here (`evidence/true-offline-attempt.txt`), and the host route table is unchanged, so no real egress block exists. A TRUE offline test with Ethernet unplugged on real venue hardware is BLOCKED (missing hardware).
- Display adapter is a simulator, verification level SIMULATED. No CEC hardware, TV or console was touched; the edge has no console-power method at all.
- The edge is a library with a tick/reconcile API. A Windows service / Linux systemd host wrapper, real WebSocket/mTLS transport, an OS secure key store (TPM/DPAPI) and the HTTP client that posts ACKs to `/api/v1/edge/acks` are NOT built here.
- Not checked: Windows execution, Kotlin Gradle build (no Kotlin change), Playwright (no UI).
- Residual risks: a crash can lose up to CheckpointSeconds (30) of consumed time after a reboot (the customer gains at most that); API pairing code is only 8 digits, protected by the 5/min/device limit and staff approval; an unauthenticated device can refresh a pending challenge (denial of service on pairing only).
- Shared-file additions: tests/pricing/migrate.test.ts also lists the migration names (T47 test), so its expected list now includes 0004; T48 will add 0003 and the Merger resolves the lines.

## Fix round 1 (Checker defect D1)
- Defect: `Boot()` rewrote `boot_id` on the first open after a reboot but kept `trust_utc`/`trust_mono`; a process restart inside the new boot then restored the stale anchor (`restored-same-boot`) and an expired lease replayed as APPLIED with the picture unlocked.
- Fix (one root cause): in the same transaction that records the new boot id, `Boot()` now deletes `trust_utc` and `trust_mono` when the boot id changed (`EdgeStore.Tx.DeleteMeta`). Trust returns only via a fresh `Time.Establish`, which persists a new anchor for that boot.
- Red first: `evidence/red-d1-dotnet-tests.txt` (3 of 4 new tests failed on the old code). Green: `StaleTrustRegressionTests` 4/4, VenueEdge 45/45.
- Same-bug sweep: the only place that restores time trust is `TimeTrust.Restore`, called once from `Boot()` (now same-boot only with a surviving anchor). Station/lease state restore keeps `AnchorMono` but every reboot turns Running/Paused into RecoveryRequired, and reconcile only resumes after `Establish`. No other path restores trust or lease validity.
- Gates after the fix: see `evidence/gate-exitcodes-fix1.txt`. `pnpm test:ticket -- 48` exits 1 ("no mandatory tests registered for ticket 48"): T48 is not on this branch (separate worktree), so this gate cannot pass here. Reported as a failed gate, not hidden.
- Scope note from the Checker: the WebSocket/mTLS transport, service host and ACK HTTP client are not required by T50's AC and belong to T20 (CONTRACTS section 5 transport line carried there). Recorded, not built.
