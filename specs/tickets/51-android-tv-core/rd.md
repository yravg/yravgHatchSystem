# HS-T51 — Kotlin TV provisioning, reboot dan offline core

Status: **draft**
Mode: **team**
Phase: MVP

## Mandate
Backend-first independent shippable slice, not permission to code yet; only human promotes ready. Venue-owned supported provisioned-unpaired profile shows neutral locked setup, Home/Back/input cannot reach console; UNPROVISIONED ordinary app never claims kiosk security. Managed supported setup survives3cold reboots with normal overlay permission retained or supported adapter keeps picture gated. Revoked permission => not-ready/repair, never force grant. WAN expiry and replay/reboot tested with Ethernet also blocked. CEC off on both TV+console, no HDMI-CEC dependency. Functional neutral test harness only, final UI owned by original integration ticket.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-51 | HS-51 | AC-HS-51 | HS-C51 | MVP / ticket |
| HS-V02-10 | HS-51 | AC-HS-V02-10 | HS-C51 | MVP / ticket |
| HS-V02-11 | HS-51 | AC-HS-V02-11 | HS-C51 | MVP / ticket |
| HS-V02-13 | HS-51 | AC-HS-V02-13 | HS-C51 | MVP / ticket |

## Behaviour
- **HS-51 / AC-HS-51** — Venue-owned supported provisioned-unpaired profile shows neutral locked setup, Home/Back/input cannot reach console; UNPROVISIONED ordinary app never claims kiosk security. Managed supported setup survives3cold reboots with normal overlay permission retained or supported adapter keeps picture gated. Revoked permission => not-ready/repair, never force grant. WAN expiry and replay/reboot tested with Ethernet also blocked. CEC off on both TV+console, no HDMI-CEC dependency. Functional neutral test harness only, final UI owned by original integration ticket.
- **HS-V02-10 / AC-HS-V02-10** — UNPROVISIONED_APP is installer/setup, no kiosk claim. Venue-owned PROVISIONED_UNPAIRED locks picture without payment/backend pairing, retains only technician setup escape with audited local credential. Pairing timeout/refresh/HTTP200locked payload does not grant play; physical Home/Back/input tests required.
- **HS-V02-11 / AC-HS-V02-11** — Three cold reboots on exact certified model/firmware return to locked provisioning/valid session state without manual relaunch or regrant under supported provisioning. Permission missing/revoked => capability fail and lock via certified fallback; never programmatic hidden permission grant. Partial unsupported result forbids certification.
- **HS-V02-13 / AC-HS-V02-13** — Venue setup records CEC off on BOTH TV and console. Start/pause/expire/stop/reboot lock proven while CEC disabled; console wake/input challenge cannot bypass. If CEC-specific optional power driver unsupported, advertise unsupported power command but keep lock over native/HDMI/IR route; never require CEC or console mains.

## Touches
agents/android-tv/; tests/hardware/android-tv/; tests/faults/android-tv/
Komponen HS-C51.

## Must not touch
Final product UI (owned by original integration ticket), competitor assets, competitor code/assets, live keys/payments, console mains, other worktrees; preserve LICENSE/README. Backend service ownership extracted here; old UI tickets consume accepted services, do not rebuild them.

## Deps
- HS-T50: accepted done artifact before dispatch.

## Decisions
NORMATIVE safety: CLAUDE.md, CONTRACTS.md; ASSUMPTION/blockers: D04, D09, D27, D28; DECISIONS.md.

## Out of scope
Product screens/skin implementation (separate UI-owner ticket after backend), external deployment/actions, V2, actual hardware certification absent named device proof.

Decision blocker D32: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.
