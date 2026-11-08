# yravgHatchSystem — repository operating contract

Build yravg HatchSystem: Indonesian PS/console rental and gaming-center management. This file is intended at repo root. Existing inspected main: README.md + MIT LICENSE only; preserve both. Specs v0.2 are draft design, not implementation completion or approval of money/security/data defaults.

## Read first
1. PRD-HatchSystem.md, DECISIONS.md, CONTRACTS.md, INPUT-STATUS.md.
2. specs/tickets/board.md, COVERAGE.md, specs/ID-CROSSWALK.md and specs/requirements.json.
3. Selected ticket rd.md and eval.md; team contract.md before parallel work.

## Stack and layout
- pnpm workspace; Node26 LTS candidate (verify supported exact patch at install); strict TypeScript. Next.js16 supported stable for web, Fastify for separate API, Postgres + Drizzle, PostgreSQL outbox worker. Lock exact versions; no canary.
- apps/web: owner/admin, cashier PWA, customer booking/member/order PWA, KDS, customer/lobby screens. Bahasa Indonesia default; optional English. Route/component names own yravg design, never copied competitor routes merely for parity.
- services/api and services/worker; packages/domain, contracts, ui. Single generated protocol source for TS/Kotlin/.NET.
- agents/venue-edge: .NET10 LTS Windows/Linux worker + SQLite WAL. agents/windows-seat: least-privilege Windows service + separate UI. agents/android-tv: native Kotlin, own namespace id.yravg.hatch.
- hardware-lab adapter drivers for certified CEC/HDMI/IR/TV-only power fallback. Native webOS/Tizen, Android rental-phone agent, iOS wrapper and kiosk are conditional V2. iOS customer coverage starts with Safari PWA, not fictional native TV privileges.
- tests/contracts, tests/faults, tests/e2e, tests/hardware; docs/operator; tickets retain evidence.

## Domain conventions
Money integer IDR/BIGINT; JSON decimal strings; duration seconds; exact rational pricing, no floating point ledger. UTC storage, outlet IANA timezone and versioned business-day rule. Every aggregate tenant/outlet scoped; server authorises all actions. Append-only financial/time/inventory/audit events with reversal; never destructive correction. Transactional outbox, idempotency and expected revisions, not a promise of exactly-once transport.

Payment state, session state and device state are separate. Received ACK is not APPLIED; APPLIED records verification level, not unproven optical success. No start billing before approved device activation/attestation. Manual billing has an explicit limited-mode badge.

## Router/worker runtime — mandatory
- Only ready tickets can be dispatched. All supplied tickets start draft. Only human promotes both board and rd; never infer ready from “build everything”. Decisions affecting money/security/data need owner lock; recommended fixtures do not equal approval.
- Router talks to human and orchestrates, DOES NOT code or decompose tickets. Start Watchdog first (roughly10-minute progress timer); no runaway background work.
- One worker/ticket/branch/git worktree. Team workers agree contract.md and nonoverlapping file ownership before code. Merger integrates accepted work; Checker tests merged UI in real browser plus named hardware where required. Reproducer repeats bug twice on own worktree.
- Eval failure goes to same worker. Done requires every active AC, logs/screenshots/protocol/hardware proof and independent merge check, not worker assurance. Update status in board and rd together.
- Follow dependency graph, not numeric order alone. Parallel only when dependency contracts accepted and touches do not overlap. Do not implement V2 or exclusions in MVP/V1.
- Prefer efficient workers for precise tickets where possible; never weaken acceptance. Check available usage before automated work when permitted. At95% weekly use stop automated work; resume after reset under owner's policy. If usage unavailable, don't leak private usage or bypass access.

## Safety / clean-room
- Own yravg branding/design/code only. Competitor names/IDs may appear solely in reference provenance, not runtime branding/UI/package/dependency. Never import vendor APK, JS bundle, screenshots, fonts, logos, recovered code, source maps or private research directories.
- Public SDK/API only. No root/hidden privileges/DRM or licensing bypass; no forever developer-mode deployment; no open wireless ADB. Normal output-only Android box is not universal HDMI overlay hardware.
- NEVER cut console mains. TV picture gating/standby is not console shutdown, save protection or account cleanup. Treat Switch undocking as physical bypass. TV-only relay requires qualified installation and hardware approval; no live electrical work by software worker.
- Sandbox payments/mocks only; no live keys or transactions, deployment/store publication, paid services, signup, emails/messages, payroll transfers, DJP filing or external side effects without separate explicit owner approval.
- Midtrans server API key and signature secret are separate; current access-key docs say notification verifier uses Signature Secret Key after28Oct2026. No silent key fallback. Status/merchant/amount/currency verified before granting value.
- No secrets in client, localStorage, URLs, git, screenshots or logs. Per-device identity, signed leases, revocation/fencing and expiry required. Reboot without trusted time fails closed safely, not reset paid time.
- Retention/ID photos/GPS/selfie/game account licensing/remote support/AI data export require approved policy; defaults disabled where uncertain. Remote support explicit consent; no background surveillance.
- Preserve the original MIT LICENSE and avoid introducing third-party license-incompatible code.

## Build/eval commands to establish in ticket01
`pnpm install --frozen-lockfile` (after initial lock exists), `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:ticket -- NN`, `pnpm exec playwright test tests/e2e/ticket-NN.spec.ts`, `python3 tools/validate_spec.py`.
Native: relevant `dotnet test`; Kotlin `./gradlew testDebugUnitTest assembleDebug`. These are expected conventions, not already-existing repo scripts. Ticket dispatcher must fail for missing mandatory tests; grep-only ID occurrence is not a behavioural pass. Hardware not available means blocked, never fake pass.

## v0.2 sequencing and design
Read specs/COORDINATION.md, specs/V02-CHANGES.md, specs/design/DESIGN-NOTE.md and exact rd HS-SCR/HS-CMP reading lists. Final Design v0.2 accepted:82screens,58wireframed,58components; brand colours provisional pending logo but no UI design hold. Build backend/edge/contracts01,46..54 first in dependency/release order, then original UI integrations; no duplicate backend implementations. All54tickets draft until human-ready; design acceptance does not promote tickets. New D25..D32 rules and CONTRACTS §7 supersede conflicting sample design policy. Own CEC optional, setup TV+console CEC off, prove independent lock. Legitimate managed provisioned-unpaired lock, cold-boot recovery/normal permission persistence and actual Ethernet-inclusive offline tests; no root/forced permission. The specification-delivery upload is authorised by the latest owner steering; this is not permission for application uploads/deployments or future external actions.
