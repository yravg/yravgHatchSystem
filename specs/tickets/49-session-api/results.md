# HS-T49 results

Status field in board.md and rd.md is NOT changed by this worker. Branch `t49-session`, base 65b3e1c (T46, T47, T48, T50 done).
All devices are SIMULATORS, all money and timings are SANDBOX FIXTURES (D01, D06, D07, D26 production policy unapproved). No hardware, no live provider, no UI.

## Gates (exit codes, logs in evidence/gates/)
install --frozen-lockfile 0 | lint 0 | typecheck 0 | pnpm test 0 (26 files, 300 tests) | test:ticket 49, 50, 48, 47, 46 all 0 | validator on clean `git archive` export 0 (16764/16764) | migration up/down/up on hatch_t49 all 0 (evidence/migration-up-down-up.log).
Red first: evidence/red-first-domain.log and red-first-api.log (every test failed before code existed). Mutation check: 14 of 14 mutations killed (evidence/mutation-log.txt).
Tests: tests/session = 73 (domain 19, start 24, running 11, transfer 16, migration 3).

## What is implemented
- Pure core `packages/domain/src/session`: ten-state machine, billing clock (rollback never adds time), lease window (OPEN 120 s horizon, renewal from 60 s), verification levels, tariffDelta quote (downward only, minimum once).
- `services/api/src/sessions` + migration 0005: POST /sessions (202), GET /sessions/{id}, GET .../commands, POST .../reconcile, POST .../actions (pause, resume, end, cancel, retry, checkout, clean, release, recover, move), POST .../transfer-quotes, POST /zone-rates; `createSessionJobs().sweep()`.
- Start: quote TTL, one live session per station (DB index), seat device and edge authority required, T48 settled intent + T47 canActivate (INSUFFICIENT_BALANCE with shortfall) over HTTP; session, command, lease claims and outbox row commit atomically. Billing starts only at APPLIED (RECEIVED does not); COMMANDED_ONLY is labelled limited; SIMULATED refused unless the fixture enables it.
- 10 s timeout leaves STARTING/TIMED_OUT; retry keeps the commandId. FAILED ack or cancel: ACTIVATION_FAILED, station freed on device failure or after a proven lock, settled payment to refund_pending via T48 tables (no refund is claimed).
- Fencing: lock-type commands supersede unlock commands; ACKs for superseded, wrong-device, wrong-epoch, wrong-revision or wrong-sequence commands are rejected and recorded.
- Transfer: frozen quote accepted first, destination reserved, source lease revoked and LOCK issued, destination lease only after a proven lock or the source's bounded lease expiry; failure leaves RECOVERY locked with a destination LOCK; DB allows one granted lease per session and per station. Minimum charged once (HTTP test). Only LOCK and START are ever issued (CEC off, D28); view says gameplayContinuity not_guaranteed.

## Decisions and deviations the Merger/owner must see
- Migration 0005 replaces `t48_intent_guard()` to allow settled to refund_pending (down restores the T48 body). No T48 file edited.
- Own `session_outbox` table: the T48 payments runner claims every row of the shared outbox and would dead-letter unknown topics.
- Leases: the cloud records authorised claims; the edge signs (test shows a claim signed and verified with the T50 lease code). Edge transport (T20) is not built, so commands wait in session_commands/outbox and the tests act as the edge.
- `zone_rate_versions` (POST /zone-rates, rate.manage) added so a transfer tariffDelta can be non-zero; start quotes still use the outlet rate. Transfer delta is recorded on the session; no ledger posting or refund for it.
- Not implemented: extend (not in AC), wallet-paid starts (T52), manual billing (needs owner policy; manualMode true is 403), return-to-source recovery.
- Cancel after an unseen applied START returns the payment to refund_pending at once; the station stays held until the lock is proven.
- A transfer quote is stale if the session revision changed (a renewal can do that on OPEN sessions); the client re-quotes.
- Session sweep is not wired into services/worker (outside T49 file list).
- New error codes STATION_BUSY, QUOTE_STALE, PAYMENT_UNCONFIRMED, INSUFFICIENT_BALANCE, INVALID_TRANSITION, DEVICE_UNAVAILABLE, TRANSFER_REFUSED are our names (409).
- F&B lineage is proven only as session-id stability using a test-only FK table; T53 owns real F&B.

## Blocked / not checked
Physical seat/TV/console hardware, true offline venue test, WebSocket/mTLS transport, real Midtrans sandbox, any UI, concurrency beyond the tested cases.
