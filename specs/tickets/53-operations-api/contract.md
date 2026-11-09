# HS-T53 team contract — AGREED

Agreed: 2026-11-09T05:39:20Z. Mode "team" but exactly ONE worker (T53 worker, Claude Sonnet 5.5). No second worker joins without a new contract.

## Exact file list (disjoint, single owner)
- services/api/src/inventory/ (stock items, receipts, recipes, moves, costing, routes)
- services/api/src/orders/ (orders, order payments, order refunds, routes)
- services/api/src/shifts/ (registers, shifts, X report, Z day close, close policy, audit, routes)
- packages/domain/src/order/index.ts (pure: recipe consumption, moving-average cost, business day, drawer maths)
- services/api/src/identity/migrations/0006_operations.up.sql / .down.sql (migration number 0006 is T53's)
- tests/inventory/, tests/orders/, tests/shifts/
- specs/tickets/53-operations-api/{contract,results}.md, specs/tickets/53-operations-api/evidence/requirements-evidence.json

## Shared files (additive lines only; the Merger resolves line-level conflicts)
- services/api/src/app.ts: one import and one registration line for T53 routes.
- services/api/src/tenancy/permissions.ts: T53's own new permissions only (stock.manage, stock.read, shift.operate, shift.policy); no existing role is widened except by adding these.
- services/api/src/ledger/service.ts: only the LedgerKind union gains T53 kinds (order_sale, order_refund, order_refund_paid); no behaviour change.
- services/api/src/payments/settlement.ts: the keyword `export` added to `settlementAccepted` (reuse, not copy).
- packages/domain/src/index.ts: one export line.
- tests/tickets.manifest.json: T53 entry. tests/{identity,pricing,ledger,session}/migrate.test.ts: expected migration list gains 0006_operations.
- CHANGELOG.md: one Unreleased line.
- Migration 0006 widens the T48 ledger kind CHECK and nothing else of T48/T49; no other ticket's migration is edited.

## Fixture ownership
All money, quantities, costs, the D08 rule (Asia/Jakarta, cut 04:00), the D17 moving average and the D30 open-shift policy default are SANDBOX FIXTURES owned by this ticket's tests; none is owner-approved production policy. packages/contracts schemas are not touched.
