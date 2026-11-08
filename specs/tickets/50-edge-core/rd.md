# HS-T50 — Gateway edge dan pairing/lease core headless

Status: **draft**
Mode: **team**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Windows/Linux .NET10 SQLite WAL persists before ACK; challenge8digits/5minutes fixture, device keys/revoke, one outlet epoch. WAN drop valid lease expires locally; reboot without trusted time locks picture. Offline new start/extend/spend zero. CEC is optional; adapter path continues with CEC off at TV+console. No settings UI or real console power operation.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-50 | HS-50 | AC-HS-50 | HS-C50 | MVP / ticket |
| HS-V02-12 | HS-50 | AC-HS-V02-12 | HS-C50 | MVP / ticket |

## Behaviour
- **HS-50 / AC-HS-50** — Windows/Linux .NET10 SQLite WAL persists before ACK; challenge8digits/5minutes fixture, device keys/revoke, one outlet epoch. WAN drop valid lease expires locally; reboot without trusted time locks picture. Offline new start/extend/spend zero. CEC is optional; adapter path continues with CEC off at TV+console. No settings UI or real console power operation.
- **HS-V02-12 / AC-HS-V02-12** — Block ALL external interfaces including emulator Ethernet, prove route/status and server unreachability before test. Valid lease finishes by deadline; no new grants; clock rollback/reboot/duplicate/replay cannot gain seconds. Reboot untrusted time fail closed. Evidence distinguishes true offline from Wi-Fi-only toggle.

## Touches
agents/venue-edge/; services/api/src/devices/; services/api/src/edge/; packages/contracts/leases/; tests/faults/edge/
Komponen HS-C50.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T46: accepted done artifact before dispatch.
- HS-T47: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D04, D07, D09, D28; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.

Decision blocker D27: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

Decision blocker D32: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.
