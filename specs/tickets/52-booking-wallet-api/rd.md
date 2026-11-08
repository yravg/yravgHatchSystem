# HS-T52 — Booking, deposit, wallet dan pass eligibility API

Status: **draft**
Mode: **team**
Phase: V1

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Concurrent slot allocation wins once. Basic-zone pass cannot start VIP; VIP pass can start basic only with explicit compatible console/category and time seconds unchanged. Group deposit percent of per-seat hourly quote:Rp12.000 andRp18.000 at25%=Rp3.000+Rp4.500; checkout quote displays basis and rounding. Arrival releases hold once; no-show conversion disabled by default. Source-setting parity is configurable, not automatically enabled policy.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-52 | HS-52 | AC-HS-52 | HS-C52 | V1 / ticket |
| HS-V02-03 | HS-52 | AC-HS-V02-03 | HS-C52 | V1 / ticket |
| HS-V02-04 | HS-52 | AC-HS-V02-04 | HS-C52 | V1 / ticket |
| HS-V02-05 | HS-52 | AC-HS-V02-05 | HS-C52 | V1 / ticket |

## Behaviour
- **HS-52 / AC-HS-52** — Concurrent slot allocation wins once. Basic-zone pass cannot start VIP; VIP pass can start basic only with explicit compatible console/category and time seconds unchanged. Group deposit percent of per-seat hourly quote:Rp12.000 andRp18.000 at25%=Rp3.000+Rp4.500; checkout quote displays basis and rounding. Arrival releases hold once; no-show conversion disabled by default. Source-setting parity is configurable, not automatically enabled policy.
- **HS-V02-03 / AC-HS-V02-03** — Level1 pass→level2 denied before debit/command; level2→level1 allowed only configured compatible category. Same seconds retained, no cash conversion/extra discount stacking. Frozen session quote; transfer re-evaluates only under approved delta quote, never retroactively reprices.
- **HS-V02-04 / AC-HS-V02-04** — Settings version contains publicBooking/group enabled,maxSeats,min/maxDuration,buffer,allowFutureBookingOnBusy,checkInWindow,preBookingGuard,notificationLead/interval,weekday availability and deposit basis. Invalid overlaps/negative settings rejected. Active paid session is never pre-empted silently.
- **HS-V02-05 / AC-HS-V02-05** — Separate liability per seat, not percentage of whole duration unless policy chooses it. Staff cancel reason required. Arrival/first valid start returns/reserves/applies deposit exactly once according explicit policy. Cancel before cutoff returns; late cancel/no-show forfeiture disabled until D31 lock. Timer/job retry cannot both forfeit and return.

## Touches
services/api/src/bookings/; services/api/src/wallets/; services/api/src/time-credits/; packages/domain/booking/
Komponen HS-C52.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T47: accepted done artifact before dispatch.
- HS-T48: accepted done artifact before dispatch.
- HS-T49: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D03, D10, D26, D31; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.
