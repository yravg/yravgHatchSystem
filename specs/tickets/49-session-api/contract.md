# HS-T49 team contract — AGREED

Agreed: 2026-11-09T05:00:00Z. Mode `team`, single worker (Claude Sonnet 5.5 session on the build VPS). No second worker joins without a new contract here.
Parallel ticket: T51 (separate worktree). T49 owns migration number 0005; T51 adds no API migration.

## Exact file list (T49 owns)
- `services/api/src/sessions/**` (routes, service, jobs, errors, config)
- `services/api/src/identity/migrations/0005_sessions.up.sql`, `0005_sessions.down.sql` (migration runner lives in identity/; only these two files are added)
- `packages/domain/src/session/**` (pure state machine, billing clock, lease window, transfer tariff delta)
- `tests/session/**` (own support, own database `hatch_t49`, one schema per test file)
- `specs/tickets/49-session-api/results.md`, `specs/tickets/49-session-api/evidence/**`, this file

## Shared files: additive lines only (Merger resolves line-level conflicts)
- `services/api/src/app.ts`: one `sessions` option, one route registration, `SessionError` added to the existing error-handler `instanceof` list.
- `services/api/src/tenancy/permissions.ts`: only T49's own new permissions (none unless needed).
- `packages/domain/src/index.ts`: one `export * from "./session/index.ts"` line.
- `tests/tickets.manifest.json`: the `"49"` entry only.
- `tests/identity/migrate.test.ts`, `tests/pricing/migrate.test.ts`, `tests/ledger/migrate.test.ts`, `tests/edge/migrate.test.ts`: only the expected-migration list gains `0005_sessions`.
- `CHANGELOG.md`: one Unreleased line.
- Migration 0005 replaces the function `t48_intent_guard()` to allow `settled -> refund_pending` (needed for "a settled payment whose start fails goes to refund_pending"); its down file restores the T48 body verbatim. No T48 migration file is edited.

## Not touched
`packages/contracts` schemas (no protocol change), `services/api/src/{edge,devices,payments,ledger,stations,rates,identity}` sources, `services/worker`, `agents/**`, validator, UI.

## Fixture ownership
All timings and money are sandbox fixtures: ACK timeout 10 s, open-lease renewal 60 s, horizon 120 s, transfer-quote TTL 300 s, quote TTL 900 s. D01/D06/D07/D26 production policy is NOT approved. Test data lives in `tests/session/support.ts` (own DB `hatch_t49`).

## Protocol agreement
- No change to `SessionCommand`/`DeviceAck`/`SessionLease`. The cloud records authorised lease claims; the enrolled edge signs (CONTRACTS section 5). ACK intake stays T50's `POST /api/v1/edge/acks`; T49 reads `edge_acks` and applies them (reconcile), so it never edits T50 code.
- Edge transport (WebSocket/mTLS, desired-state delivery) is not in T49 (T20); tests use a simulator edge that reads commands and posts signed ACKs.
- Error gates (our names, ASSUMPTION until protocol review): `STATION_BUSY`, `QUOTE_STALE`, `PAYMENT_UNCONFIRMED`, `INSUFFICIENT_BALANCE`, `INVALID_TRANSITION`, `DEVICE_UNAVAILABLE`, `TRANSFER_REFUSED`, all 409.
