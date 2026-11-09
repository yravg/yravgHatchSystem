# HS-T53 — API stok, pesanan dan X/Z shift close

Status: **ready**
Mode: **team**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-53 | HS-53 | AC-HS-53 | HS-C53 | MVP / ticket |
| HS-V02-06 | HS-53 | AC-HS-V02-06 | HS-C53 | MVP / ticket |

## Behaviour
- **HS-53 / AC-HS-53** — Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.
- **HS-V02-06 / AC-HS-V02-06** — Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.

## Touches
services/api/src/inventory/; services/api/src/orders/; services/api/src/shifts/; packages/domain/order/
Komponen HS-C53.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T48: accepted done artifact before dispatch.
- HS-T49: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D08, D17, D30; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.
