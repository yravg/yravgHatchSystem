# HS-T48 — Ledger dan Midtrans QRIS server tanpa UI

Status: **done**
Mode: **team**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Balanced IDR journal, unique source event, immutable reversals and payment allocation. Distinct ServerKey/signature-secret fixture verifies callback plus merchant/order/amount/currency and GET status. Duplicate/out-of-order settlement credits once; provider-down remains pending. Mock/sandbox only; no frontend or real credentials.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-48 | HS-48 | AC-HS-48 | HS-C48 | MVP / ticket |
| HS-V02-17 | HS-48 | AC-HS-V02-17 | HS-C48 | MVP / ticket |

## Behaviour
- **HS-48 / AC-HS-48** — Balanced IDR journal, unique source event, immutable reversals and payment allocation. Distinct ServerKey/signature-secret fixture verifies callback plus merchant/order/amount/currency and GET status. Duplicate/out-of-order settlement credits once; provider-down remains pending. Mock/sandbox only; no frontend or real credentials.
- **HS-V02-17 / AC-HS-V02-17** — Midtrans sandbox dynamic QRIS only verified settlement+merchant/order/amount/currency, separate signature secret vs API ServerKey. No screenshots or clientredirect as payment proof; provider down pending; late settlement routes refund_pending not stolen station.

## Touches
services/api/src/ledger/; services/api/src/payments/; services/worker/src/payments/; packages/domain/money/
Komponen HS-C48.

## Must not touch
Final product UI, provisional design implementation, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T46: accepted done artifact before dispatch.
- HS-T47: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D06, D15, D17; DECISIONS.md.

## Out of scope
Product screens/skin/tokens implementation (held D25), external deployment/actions, V2, actual hardware certification absent named device proof.
