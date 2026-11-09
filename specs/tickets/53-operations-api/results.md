# HS-T53 results — stock, orders and X/Z shift close API

Worker: T53 (single worker, contract.md AGREED). Ticket status NOT changed (board/rd untouched). All evidence is
**fixture/simulator**: Postgres `hatch_t53`, a local Midtrans mock, no hardware, no live key, no UI. Money, quantities, costs,
D08/D17/D30 behaviour are SANDBOX FIXTURES, not owner-approved production policy.

## What was built
- Migration 0006 (up/down/up proven): stock, menu/recipe versions, orders, order payments/refunds, registers, shifts,
  D30 policy versions, day closes, ops audit. Widens only the T48 ledger kind CHECK (order_sale, order_refund, order_refund_paid).
- `packages/domain/src/order` pure core; `services/api/src/{inventory,orders,shifts}` routes and services (API only, no UI).
- Additive shared edits: app.ts (one registration + error class), permissions.ts (stock.manage, stock.read, shift.operate,
  shift.policy), ledger/service.ts (LedgerKind union), payments/settlement.ts (`settlementAccepted` exported, reused not copied),
  manifest, four migrate tests, CHANGELOG.

## Evidence (exit codes in evidence/logs/gates.txt)
lint 0; typecheck 0; pnpm test 0 (34 files, 349 tests); test:ticket 53/49/50/48/47/46 all 0; validator on clean git-archive
export 0; hatch_t53 migration up/down/up 0. Red-first: evidence/logs/red-first.log (29 failing before code, commit before feature
commit). Mutations: 8/8 caught (evidence/logs/mutations.log). See requirements-evidence.json.

## Deviations and honest limits
- Orders consume stock when **accepted**; CONTRACTS section 2 describes reserve-on-accept then consume-on-fulfil. Reserve/fulfil not built.
- Refund = pending record + Dr sales_revenue / Cr refund_payable (the T48 late-settlement pattern), proof posts the payout.
  This is not `reverseLines` of the sale, because a reversal would claim money left the drawer/provider before proof. No provider refund call (D15).
- Order QRIS settles only via staff-triggered `.../verify` (authenticated provider status). The Midtrans notification webhook
  does not know order payments (it resolves T48 intents only); no worker poll for order QRIS. Mock provider only; real sandbox schema unverified.
- Offline cash orders are refused (`OFFLINE_NOT_ALLOWED`), per CONTRACTS section 5 default; no offline queue exists.
- Stock quantities are integer base units, not rational strings; no stocktake, PO, goods receipt, transfer, FIFO.
- Transfer "conflict" = open T49 transfers at Z time are listed and audited (T49 transfer code not modified); sessions in tests are SQL-seeded rows, not driven through T49 flows/devices.
- No RLS (explicit scoped queries, as T46). Migration 0006 down fails by design if T53 ledger kinds exist (append-only journal).
- Not checked: real browser/UI (none), hardware, true offline, concurrency load beyond the DB locks, CI run (see handoff report).

## Open owner decisions (not approved)
- **D30 open-shift policy is NOT owner-locked.** Implemented as versioned tenant-scoped policy; default fixture `block_if_other_open`
  (POST /shift-close-policies); Z refuses with SHIFT_CLOSE_POLICY_MISSING when no version exists. Owner/accountant must lock scope and mode.
- D08 (zone, 04:00 cut, per-outlet zone) and D17 (moving average; FIFO V1) remain fixtures. D02 lock for the new permissions
  (cashier gets shift.operate/stock.read; owner-only shift.policy) is open.
