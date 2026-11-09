# HS-T47 — API stasiun, tarif rasional dan minimum payment

Status: **ready**
Mode: **solo**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-47 | HS-47 | AC-HS-47 | HS-C47 | MVP / ticket |
| HS-V02-01 | HS-47 | AC-HS-V02-01 | HS-C47 | MVP / ticket |
| HS-V02-02 | HS-47 | AC-HS-V02-02 | HS-C47 | MVP / ticket |

## Behaviour
- **HS-47 / AC-HS-47** — One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.
- **HS-V02-01 / AC-HS-V02-01** — One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.
- **HS-V02-02 / AC-HS-V02-02** — Fixture minimum5.000/30min then12.000/hour;20min=5.000,30min=5.000,40min=7.000; pause does not consume covered minutes. Minimum once/session even retry/reconnect/zone-transfer; insufficient balance cannot activate. D26 approval before production.

## Touches
services/api/src/stations/; services/api/src/rates/; packages/domain/pricing/; tests/pricing/
Komponen HS-C47.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T46: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D01, D26; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.
