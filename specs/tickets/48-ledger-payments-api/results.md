# HS-T48 results

Branch `t48-ledger`, based on origin/spec-v0.2 at dc83479 (T46, T47 done). Ticket status is NOT changed here; only a human promotes or closes it.
Everything below is **fixture/simulator evidence**: a local mock Midtrans on 127.0.0.1, real PostgreSQL (`hatch_t48`), HTTP through Fastify. No real provider, key, payment or hardware was involved. Money values are sandbox fixtures; D06, D15 and D17 production policy is NOT approved.

## Red first
`evidence/red-run.txt`: before any implementation `vitest run tests/ledger tests/payments` failed (5 files, 21 failing tests, missing modules and functions).

## Gates (every exit code recorded in evidence/*.log)
| Command | Exit |
| --- | --- |
| pnpm install --frozen-lockfile | 0 (no dependency change) |
| pnpm lint | 0 |
| pnpm typecheck | 0 |
| pnpm test | 0 (18 files, 206 tests) |
| pnpm test:ticket -- 48 / 47 / 46 | 0 / 0 / 0 |
| validate_spec.py on a clean git-archive export | 0 (16764 checks, 0 errors) |
| migration up, down, up on hatch_t48 | 0, 0, 0 |

T48 tests: 59 (journal 5, migration 5, ledger API 11, config 6, payments 32).

## What was built
- Migration 0003: append-only `ledger_transactions`/`ledger_entries` with a deferred constraint trigger (balanced, at least 2 lines), UNIQUE (tenant, source_event), UNIQUE reversal_of, `ledger_balances` with CHECK balance >= 0, `payment_intents` (frozen fields, guarded transitions, one live intent per quote), `payment_allocations`, `refunds` (refunded only with a provider proof reference, which no code sets), `provider_events` (dedup by order id + raw hash), `outbox`.
- Ledger API (`ledger.read|post|reverse`, owner and manager): post, reverse, get, balances. Corrections are reversals only; reversal of a payment-managed or reversal transaction is refused.
- Payments: intent create/get/abandon, signature-gated notification endpoint, refunds list. Value is granted only in `settlement.ts`: authenticated GET, order/merchant/amount/currency/payment type match, settlement + fraud status, then one guarded transition. Late or reassigned settlement posts to `refund_payable` and a pending refund row.
- Worker (`services/worker/src/payments`): outbox runner, claim with SKIP LOCKED, one transaction per job, exponential backoff, dead letter after 8 attempts, production loop.
- Config: ServerKey and Signature Secret are separate, no fallback, startup throws without a signature secret, only loopback or the Midtrans sandbox host is accepted as base URL.

## Decisions and assumptions (not owner-approved)
- Chart of accounts (cash, provider_clearing, sales_revenue, refund_payable), 15 minute intent TTL, 30 s poll, 1 h late-payment watch, 8 attempts, permission names `ledger.*` and use of `checkout` for intents are recommended fixtures.
- `ledger.reverse` does not require step-up (the manager and owner roles already need MFA). Owner may want step-up here.
- A charge that the provider accepted but whose response we lost leaves an orphan QR at the provider; a payment to it arrives as an `unknown_order` event (stored, nothing granted) for manual reconciliation.

## Not checked / blocked / out of scope
- Real Midtrans sandbox or production: never contacted by design. Behaviour against the true provider schema (QRIS fraud_status handling, status codes) is verified only against the mock; CONTRACTS section 6 still asks for doc/account verification before readiness.
- The provider refund API is deliberately absent: refunds stay pending and nothing claims money returned.
- Public notification endpoint has no rate limit or IP allow-list (signature check only).
- The worker loop is not wired into a deployed service/systemd unit; true process kill, reboot and offline behaviour were simulated by rollback, not by killing a process. No hardware, no UI, no Windows/Android/.NET targets are touched by this ticket.
- Real-browser and device checks: not applicable (no UI).
