# HS-T48 team contract — AGREED

Agreed: 2026-11-09T03:40:00Z. Mode `team`, single worker (Claude Sonnet 5.5, branch `t48-ledger`). No second worker joins without a new contract.
Parallel ticket: T50 (own worktree). T48 owns migration `0003`, T50 owns `0004`. Neither edits the other's migration.

## Files owned by this worker (exact list)
- `services/api/src/ledger/`: `routes.ts`, `service.ts`
- `services/api/src/payments/`: `config.ts`, `errors.ts`, `midtrans.ts`, `outbox.ts`, `settlement.ts`, `routes.ts`
- `services/api/src/identity/migrations/0003_ledger_payments.up.sql` and `.down.sql`
- `services/worker/src/payments/`: `runner.ts`, `index.ts`
- `packages/domain/src/money/`: `journal.ts`, `index.ts` (the existing `money.ts` stays untouched)
- `tests/ledger/`, `tests/payments/` (including the local mock provider `tests/payments/mock-midtrans.ts`)
- `specs/tickets/48-ledger-payments-api/` `contract.md`, `results.md`, `evidence/`

## Shared files: additive lines only (the Merger resolves line-level conflicts)
- `services/api/src/app.ts`: one `payments?` option, one error-handler branch, ledger and payments registration lines
- `services/api/src/tenancy/permissions.ts`: new permissions `ledger.read`, `ledger.post`, `ledger.reverse` (owner and manager) and nothing else
- `tests/tickets.manifest.json`: the `"48"` entry only
- `tests/identity/migrate.test.ts`, `tests/pricing/migrate.test.ts`: expected migration list only
- `packages/domain/src/index.ts`: one `export * from "./money/index.ts"` line
- `services/worker/src/index.ts`: one export line
- `CHANGELOG.md`: one Unreleased line

## Not touched
`packages/contracts` schemas (no shared-contract change, so T01 conformance stays as is), T46/T47 code, other migrations, UI.

## Fixture ownership
All keys, merchant ids and money values are labelled fixtures defined only in `tests/payments/` and `tests/ledger/`. Source code has no key defaults.
The mock provider is a loopback HTTP server owned by `tests/payments/mock-midtrans.ts`. No real Midtrans host is ever contacted.
Money values are sandbox fixtures; D06, D15 and D17 production policy is NOT approved.
