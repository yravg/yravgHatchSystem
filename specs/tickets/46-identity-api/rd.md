# HS-T46 — API identitas, tenancy dan staff 2FA

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Role outlet+tenant enforced server-side; staff TOTP enrollment/recovery/revocation and step-up for owner/refund approvals tested without real account. 10 wrong OTP attempts rate-limited; replay rejected; recovery codes single-use/hash only. Existing T02 consumes this API after accepted backend dependencies.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-46 | HS-46 | AC-HS-46 | HS-C46 | MVP / ticket |
| HS-V02-07 | HS-46 | AC-HS-V02-07 | HS-C46 | MVP / ticket |

## Behaviour
- **HS-46 / AC-HS-46** — Role outlet+tenant enforced server-side; staff TOTP enrollment/recovery/revocation and step-up for owner/refund approvals tested without real account. 10 wrong OTP attempts rate-limited; replay rejected; recovery codes single-use/hash only. Existing T02 consumes this API after accepted backend dependencies.
- **HS-V02-07 / AC-HS-V02-07** — TOTP uses trusted server time, narrow skew, verified enrollment; recovery single-use hashes; replayed OTP rejected within accepted step; step-up expiry. Fail closed if second factor missing, rate limits per actor/source, no secret in logs, fixture secrets only. Support cannot bypass without approved audited recovery.

## Touches
services/api/src/identity/; services/api/src/tenancy/; tests/identity/
Komponen HS-C46.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T01: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D02, D16; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.

Decision D25: DECISIONS.md (accepted/normative vs open policy state controls readiness).
