# HS-T49 — Koordinator sesi dan console-to-seat transfer API

Status: **done**
Mode: **team**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Reserve→STARTING→APPLIED→ACTIVE before billing. Console moves A→B only after source revoke/lock evidence, destination capacity/quote eligibility and new bounded lease; crash recovery never grants two valid playback leases. Target no-ACK leaves recovery/locked and no duplicate charge; same sessionId/F&B/payment lineage preserved. Source protocol fence makes stale old ACK unusable.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-49 | HS-49 | AC-HS-49 | HS-C49 | MVP / ticket |
| HS-V02-09 | HS-49 | AC-HS-V02-09 | HS-C49 | MVP / ticket |

## Behaviour
- **HS-49 / AC-HS-49** — Reserve→STARTING→APPLIED→ACTIVE before billing. Console moves A→B only after source revoke/lock evidence, destination capacity/quote eligibility and new bounded lease; crash recovery never grants two valid playback leases. Target no-ACK leaves recovery/locked and no duplicate charge; same sessionId/F&B/payment lineage preserved. Source protocol fence makes stale old ACK unusable.
- **HS-V02-09 / AC-HS-V02-09** — Transfer tests PS5 station A→B with CEC disabled, same sessionId and F&B, deterministic tariffDelta quote accepted before action. Source gate revoked/locked before destination grant; no-ACK/source-unreachable cannot create duplicate playable seats. Target failure shows recoverable locked state; do not claim uninterrupted gameplay on different console.

## Touches
services/api/src/sessions/; packages/domain/session/; tests/session/
Komponen HS-C49.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T47: accepted done artifact before dispatch.
- HS-T48: accepted done artifact before dispatch.
- HS-T50: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D01, D06, D07, D26; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.
