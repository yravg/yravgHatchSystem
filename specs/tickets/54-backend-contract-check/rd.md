# HS-T54 — Kontrak, simulator dan fault-check headless

Status: **ready**
Mode: **solo**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Fresh clone generates TS/Kotlin/.NET payload schemas; contract fixtures and fault scenarios run twice with expected/actual evidence. No fake browser/UI pass. API/auth/payment/session/edge/TV/shift accepted artifacts and signed version manifest are consumed by original UI tickets after final design; missing physical test means uncertified/blocked, not simulated pass.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-54 | HS-54 | AC-HS-54 | HS-C54 | MVP / ticket |

## Behaviour
- **HS-54 / AC-HS-54** — Fresh clone generates TS/Kotlin/.NET payload schemas; contract fixtures and fault scenarios run twice with expected/actual evidence. No fake browser/UI pass. API/auth/payment/session/edge/TV/shift accepted artifacts and signed version manifest are consumed by original UI tickets after final design; missing physical test means uncertified/blocked, not simulated pass.

## Touches
packages/contracts/; tests/contracts/; tests/faults/; tools/simulator/
Komponen HS-C54.

## Must not touch
Final product UI, provisional design implementation, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T46: accepted done artifact before dispatch.
- HS-T47: accepted done artifact before dispatch.
- HS-T48: accepted done artifact before dispatch.
- HS-T49: accepted done artifact before dispatch.
- HS-T50: accepted done artifact before dispatch.
- HS-T51: accepted done artifact before dispatch.
- HS-T53: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D04, D06, D07, D29; DECISIONS.md.

## Out of scope
Product screens/skin/tokens implementation (held D25), external deployment/actions, V2, actual hardware certification absent named device proof.
