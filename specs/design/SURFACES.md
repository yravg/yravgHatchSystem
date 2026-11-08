# HatchSystem SURFACES v0.1

Design Desk · 8 Nov 2026 (Asia/Shanghai) · status: draft for Grok Bot's merge

**Id rule.** Screens use `HS-SCR-<SURFACE>-NN`. These are **design-only ids** (a screen namespace, not requirements). Every screen is traced only to **source requirement ids** as they appear in the capture packs: `FR-KPS-NN` (Kula rental PS pack), `FR-KULA-NNN` (Kula full-site pack, ⭐ rental/gaming rows), `FR-SENET-NN` (Senet pack, partial — deep pass still running) and `FNNN` (market matrix, `MASTER-FEATURE-MATRIX.md`). No new requirement ids are invented; Grok's PRD publishes the crosswalk.

**Evidence caveat.** Kula captures are marketing pages, public tutorials and the public simulator, not the in-app cashier/admin. In-app parity screens below are inferred from those docs and must be re-checked once trial captures exist.

Standard states every screen must design for: empty · loading (`loaderFade`, 300 ms delay, no spinner) · offline · error · permission · success. Screen-specific states are listed per row.

## Surfaces (13)

| Code | Surface | Target | Wireframe |
|---|---|---|---|
| CSH | Cashier PWA — shared Next.js app (PRD §3, MVP) | Tablet 1280×800 + desktop 1440×900 | `wireframes/cashier.html` |
| ADM | Web owner/admin — Next.js (PRD §3, MVP config; V1 reports/branch/payroll/tax) | Desktop 1440×900 | `wireframes/admin.html` |
| CUS | Customer PWA: booking, member/wallet/time, QR order, receipt — iOS = this PWA in V1 (Safari tested) | Mobile 390×844 | `wireframes/customer.html` |
| KDS | Kitchen display (web KDS, MVP) | Landscape 1280×800 tablet/TV | `wireframes/kitchen.html` |
| LBY | Lobby / status / waiting-room board (read-only projection, V1, redacted) | 1080p TV 1920×1080 | `wireframes/lobby.html` |
| CFD | Customer checkout display (read-only projection, V1) | Second screen 1024×600 | `wireframes/customer-display.html` |
| KSK | Self-service kiosk (hardened shared web app, V2) | Portrait 1080×1920 (rendered 540×960 @2x) | `wireframes/kiosk.html` |
| TVA | Android / Google TV agent — native Kotlin (MVP, certified devices) | 1080p TV 1920×1080, D-pad | `wireframes/tv-agent.html` |
| ADP | LG / Samsung via certified external CEC/HDMI/IR adapter (edge plugin, MVP); native webOS/Tizen = V2 feasibility, no UI yet | 1080p TV + admin 1440×900 | `wireframes/tv-adapter.html` |
| PCA | Windows PC seat app — .NET service + UI shell (V1) | Desktop 1920×1080 | `wireframes/pc-agent.html` |
| GWY | Venue edge gateway (.NET) — PIN pairing + local health UI (MVP) | Desktop 1440×900 + local web | `wireframes/gateway.html` |
| OWN | Owner mobile view = responsive web admin (not a separate app) | Mobile 390×844 | `wireframes/owner.html` |
| MAG | Android phone/tablet rental agent (V2 pilot) | Mobile 390×844 | `wireframes/mobile-agent.html` |

## Screens (82)

### CSH · Cashier PWA — shared Next.js app (PRD §3, MVP)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-CSH-01 | Station grid (Meja & Unit) | empty (no units yet → link to admin), loading skeleton, offline banner + local timers, error per tile (agent offline), permission (read-only role), success | `CSH-01-tablet`, `CSH-01-desktop-offline` | F007, F008, F009, F011, F208, FR-KPS-02, FR-KPS-03, FR-KPS-04, FR-KPS-05, FR-KPS-08, FR-KPS-09, FR-KPS-11, FR-KPS-51, FR-KPS-55, FR-KPS-57, FR-KPS-65, FR-KPS-66, FR-KULA-046, FR-KULA-049, FR-KULA-147, FR-KULA-156, FR-KULA-157, FR-KULA-164, FR-KULA-167, FR-KULA-209, FR-KULA-296, FR-KULA-312, FR-KULA-378, FR-KULA-502, FR-SENET-06, FR-SENET-08, FR-SENET-113, FR-SENET-16, FR-SENET-59 |
| HS-SCR-CSH-02 | Start session sheet (paket / open billing, member, multi-console) | loading tariffs, error (unit busy / conflict), awaiting TV confirmation, activation failed → auto-credit, permission (needs manager for free session), success | `CSH-02-start`, `CSH-02-activation` | F012, F015, F016, F017, F018, F019, F020, F021, F022, F023, F037, F038, F042, F044, F046, F047, FR-KPS-01, FR-KPS-03, FR-KPS-04, FR-KPS-05, FR-KPS-06, FR-KPS-07, FR-KPS-12, FR-KPS-14, FR-KPS-21, FR-KPS-40, FR-KPS-66, FR-KULA-209, FR-KULA-250, FR-KULA-251, FR-KULA-254, FR-SENET-126, FR-SENET-14, FR-SENET-15, FR-SENET-83, FR-SENET-85, FR-SENET-86 |
| HS-SCR-CSH-03 | Running session detail (extend, pause, move, stop, remote) | loading, offline (queued commands), error (TV no ACK), permission, success | `CSH-03-detail` | F024, F025, F026, F027, F031, F045, F199, FR-KPS-08, FR-KPS-09, FR-KPS-10, FR-KPS-11, FR-KPS-15, FR-KPS-16, FR-KPS-46, FR-KPS-47, FR-KPS-48, FR-KULA-211, FR-KULA-212, FR-KULA-213, FR-KULA-222, FR-KULA-257, FR-KULA-263, FR-SENET-07, FR-SENET-56, FR-SENET-82, FR-SENET-84 |
| HS-SCR-CSH-04 | Add F&B to running session | empty category, loading, out-of-stock item, offline (local catalogue), success | `CSH-04-fnb` | F114, F115, F120, FR-KPS-16, FR-KPS-17, FR-KPS-20, FR-KULA-212, FR-KULA-253, FR-KULA-329, FR-SENET-41, FR-SENET-43 |
| HS-SCR-CSH-05 | Checkout & payment (cash / QRIS / transfer / split / deposit / tempo) | QRIS waiting, QRIS expired, QRIS paid (webhook), cash change, offline (cash only, digital pending), error, permission (discount over limit), success + receipt | `CSH-05-cash`, `CSH-05-qris` | F043, F048, F049, F050, F051, F052, F056, F057, F060, F064, F068, F069, F070, F167, F168, FR-KPS-07, FR-KPS-17, FR-KPS-18, FR-KPS-34, FR-KPS-35, FR-KPS-36, FR-KULA-065, FR-KULA-151, FR-KULA-159, FR-KULA-168, FR-KULA-199, FR-KULA-200, FR-KULA-201, FR-KULA-253, FR-SENET-12, FR-SENET-21, FR-SENET-23, FR-SENET-98 |
| HS-SCR-CSH-06 | Member lookup, time credit & wallet top-up | empty search, not found → register, loading, offline (wallet read-only), error (insufficient balance, no negative), success | `CSH-06-member` | F033, F034, F035, F053, F054, F055, F066, F067, F122, F123, F124, F125, F130, F258, FR-KPS-21, FR-KPS-22, FR-KPS-23, FR-KPS-24, FR-KPS-25, FR-KULA-205, FR-KULA-206, FR-KULA-208, FR-KULA-211, FR-KULA-261, FR-SENET-103, FR-SENET-19, FR-SENET-26, FR-SENET-27, FR-SENET-92, FR-SENET-94 |
| HS-SCR-CSH-07 | Bookings today & arrivals (check-in, no-show, waitlist) | empty, loading, offline, late arrival release, blacklist warning (walk-in still allowed), success | `CSH-07-bookings` | F082, F083, F084, F085, FR-KPS-27, FR-KPS-28, FR-KULA-147, FR-KULA-156, FR-SENET-107, FR-SENET-30, FR-SENET-33, FR-SENET-34, FR-SENET-35 |
| HS-SCR-CSH-08 | Shift open (float) & close (cash reconciliation, X/Z) | loading, variance warning, offline (close queued), permission, success + WhatsApp recap | `CSH-08-shift` | F159, F160, F161, F162, FR-KPS-29, FR-KPS-30, FR-KULA-015, FR-KULA-195, FR-KULA-227, FR-KULA-262, FR-KULA-413, FR-KULA-512, FR-SENET-13, FR-SENET-95, FR-SENET-96 |
| HS-SCR-CSH-09 | Void / refund / manager approval | permission (PIN required), error, success | spec only (states in COMPONENTS) | F058, F059, F158, FR-KULA-202, FR-SENET-97 |
| HS-SCR-CSH-10 | Station chat & alerts inbox | empty, new message (audio), offline, success | spec only (states in COMPONENTS) | F094, F095, FR-KPS-55, FR-KPS-56, FR-SENET-44 |
| HS-SCR-CSH-11 | Offline queue & sync review | offline, syncing, conflict, success | spec only (states in COMPONENTS) | F068, F069, F234, F235, F236, FR-KPS-64, FR-KPS-66 |
| HS-SCR-CSH-12 | No-show resolution (release unit, forfeit/return deposit) | pending (in grace), overdue, manager override, success | `CSH-12-noshow` | F081, F082, F085, FR-KPS-27, FR-KPS-28, FR-SENET-106, FR-SENET-32, FR-SENET-34 |
| HS-SCR-CSH-13 | X report (mid-shift) + 58 mm print preview | loading, printer offline (queued), success | `CSH-13-xreport` | F160, F167, F175, FR-KPS-29, FR-KPS-30, FR-KULA-015, FR-KULA-227, FR-SENET-96, FR-SENET-98 |
| HS-SCR-CSH-14 | Z report (end-of-day close) + print preview | blocked (open shifts), warnings (running sessions carried, QRIS pending), permission (manager), success | `CSH-14-zreport` | F003, F063, F160, F183, FR-KULA-195, FR-KULA-413, FR-SENET-122, FR-SENET-95, FR-SENET-96 |
| HS-SCR-CSH-15 | Console & session move to another seat | target busy, target TV no ACK → stay, tariff difference choice, success | `CSH-15-move` | F026, F027, F046, FR-KPS-10, FR-KPS-40, FR-SENET-82 |

### ADM · Web owner/admin — Next.js (PRD §3, MVP config; V1 reports/branch/payroll/tax)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-ADM-01 | Owner dashboard (live heatmap, revenue today, alerts) | empty (new venue), loading, offline (stale data stamp), error, success | `ADM-01-dashboard` | F073, F172, F173, F174, FR-KPS-31, FR-KPS-32, FR-KULA-001, FR-KULA-191, FR-KULA-193, FR-SENET-01, FR-SENET-128, FR-SENET-48 |
| HS-SCR-ADM-02 | Units & stations (catalogue, zones, floor map, games) | empty, loading, error, permission, plan limit reached | `ADM-02-units` | F002, F003, F004, F005, F006, F010, F012, F013, F014, F072, FR-KPS-01, FR-KPS-02, FR-KPS-03, FR-KPS-67, FR-KPS-69, FR-KULA-150, FR-KULA-214, FR-KULA-382, FR-SENET-06, FR-SENET-08, FR-SENET-113, FR-SENET-116, FR-SENET-49, FR-SENET-62, FR-SENET-72, FR-SENET-74 |
| HS-SCR-ADM-03 | Unit detail: agent health, capability, test lock/unlock | agent offline, unsupported capability, test running, success | spec only (states in COMPONENTS) | F014, F189, F190, F191, F198, F205, F206, F281, FR-KPS-39, FR-KPS-52, FR-KPS-53, FR-KPS-54, FR-KPS-65, FR-KULA-385, FR-KULA-386, FR-KULA-466, FR-SENET-59, FR-SENET-79 |
| HS-SCR-ADM-04 | Pricing, packages, happy hour, overtime | empty, validation error, overlap warning, success | `ADM-04-pricing` | F019, F020, F021, F022, F023, F030, F039, F040, F041, F042, FR-KPS-06, FR-KPS-12, FR-KPS-13, FR-KPS-14, FR-KPS-15, FR-KULA-148, FR-KULA-155, FR-KULA-250, FR-KULA-257, FR-KULA-258, FR-SENET-09, FR-SENET-10, FR-SENET-11, FR-SENET-121, FR-SENET-122, FR-SENET-87, FR-SENET-88, FR-SENET-89, FR-SENET-90 |
| HS-SCR-ADM-05 | Members, tiers, loyalty, vouchers | empty, loading, error, success | spec only (states in COMPONENTS) | F122, F123, F124, F125, F126, F127, F128, F129, F130, F131, F132, F133, F134, F135, F136, F137, F138, F139, F140, FR-KPS-14, FR-KPS-21, FR-KPS-24, FR-KPS-25, FR-KULA-021, FR-KULA-038, FR-KULA-094, FR-KULA-099, FR-KULA-205, FR-KULA-206, FR-KULA-207, FR-KULA-244, FR-KULA-368, FR-KULA-369, FR-KULA-370, FR-KULA-400, FR-KULA-434, FR-KULA-490, FR-KULA-491, FR-SENET-102, FR-SENET-104, FR-SENET-120, FR-SENET-17, FR-SENET-27, FR-SENET-28, FR-SENET-29, FR-SENET-46, FR-SENET-91, FR-SENET-92, FR-SENET-93, FR-SENET-94 |
| HS-SCR-ADM-06 | Booking settings & calendar | empty, conflict, loading, success | spec only (states in COMPONENTS) | F074, F075, F076, F077, F078, F079, F080, F081, F082, F086, F087, F088, F089, FR-KPS-26, FR-KPS-27, FR-KPS-28, FR-KPS-69, FR-KULA-048, FR-KULA-147, FR-KULA-156, FR-KULA-276, FR-KULA-278, FR-SENET-105, FR-SENET-106, FR-SENET-107, FR-SENET-30, FR-SENET-31, FR-SENET-32, FR-SENET-34, FR-SENET-35, FR-SENET-36 |
| HS-SCR-ADM-07 | Products, stock, recipes, suppliers | empty, low stock, loading, error, success | spec only (states in COMPONENTS) | F096, F097, F098, F099, F100, F101, F102, F103, F104, F105, F106, F107, F108, F109, F110, F111, FR-KPS-20, FR-KULA-053, FR-KULA-054, FR-KULA-055, FR-KULA-188, FR-KULA-218, FR-SENET-101, FR-SENET-42, FR-SENET-43 |
| HS-SCR-ADM-08 | Reports (revenue, occupancy, shifts, P&L, loyalty, wallet, F&B margin) | empty period, loading, export running, error, success | `ADM-08-reports` | F063, F172, F173, F174, F175, F176, F177, F178, F179, F180, F181, F182, FR-KPS-29, FR-KPS-31, FR-KPS-68, FR-KULA-001, FR-KULA-006, FR-KULA-015, FR-KULA-021, FR-KULA-152, FR-KULA-162, FR-KULA-225, FR-KULA-400, FR-KULA-407, FR-KULA-413, FR-KULA-501, FR-KULA-512, FR-SENET-127, FR-SENET-129, FR-SENET-47, FR-SENET-60, FR-SENET-96 |
| HS-SCR-ADM-09 | Staff, roles, shifts, attendance, payroll | empty, loading, permission, success | `ADM-09-staff` | F156, F157, F158, F163, F164, F165, F166, F245, FR-KPS-33, FR-KULA-070, FR-KULA-074, FR-KULA-075, FR-KULA-077, FR-KULA-078, FR-KULA-229, FR-KULA-300, FR-KULA-304, FR-KULA-305, FR-KULA-306, FR-SENET-119, FR-SENET-45, FR-SENET-67 |
| HS-SCR-ADM-10 | Tournaments (entrants, bracket, results, prizes) | empty, draft, live, dispute, completed | `ADM-10-tournament` | F141, F142, F143, F144, F145, F146, F147, F148, F149, F150, F151, F152, F153, F154, F155, FR-KPS-59, FR-KULA-260, FR-KULA-383, FR-KULA-384, FR-SENET-69 |
| HS-SCR-ADM-11 | Agents & pairing (TV, PC, gateway, mobile) + rollout | empty, pairing code expired, agent revoked, update failed, plan slots full | `ADM-11-agents` | F184, F185, F186, F206, F254, FR-KPS-37, FR-KPS-38, FR-KPS-50, FR-KPS-54, FR-KPS-60, FR-KPS-61, FR-KPS-67, FR-KULA-047, FR-KULA-210, FR-KULA-247, FR-KULA-264, FR-KULA-267, FR-KULA-268, FR-KULA-291, FR-KULA-337, FR-KULA-338, FR-KULA-464, FR-KULA-465, FR-SENET-03, FR-SENET-63, FR-SENET-73 |
| HS-SCR-ADM-12 | Hardware certification catalogue | empty, loading, uncertified warning, success | `ADM-12-cert` | F204, F279, FR-KPS-62, FR-KPS-63, FR-KPS-65 |
| HS-SCR-ADM-13 | Settings: venue, tax, printers, receipts, TV backgrounds, lobby, language, privacy | loading, error, success | spec only (states in COMPONENTS) | F003, F071, F169, F170, F171, F183, F249, F250, F251, F275, F276, F277, F278, FR-KPS-34, FR-KPS-49, FR-KPS-57, FR-SENET-02, FR-SENET-125, FR-SENET-24, FR-SENET-25, FR-SENET-39, FR-SENET-53, FR-SENET-76, FR-SENET-98, FR-SENET-99 |
| HS-SCR-ADM-14 | Audit log, diagnostics export, emergency override log | empty, loading, export running, success | `ADM-14-audit` | F163, F246, F247, F248, F255, F256, FR-KPS-68, FR-SENET-109 |
| HS-SCR-ADM-15 | Plan & entitlements | plan limit, upgrade, success | spec only (states in COMPONENTS) | FR-KPS-67 |
| HS-SCR-ADM-16 | Integrations, API, import, sandbox, status | empty, error, success | spec only (states in COMPONENTS) | F271, F272, F273, F274, F280, F284, FR-SENET-110, FR-SENET-23, FR-SENET-24, FR-SENET-25, FR-SENET-64 |
| HS-SCR-ADM-17 | Take-home rental assets (deposit, checklist, delivery, overdue) | empty, overdue, damage dispute, success | spec only (states in COMPONENTS) | F260, F261, F262, F263, F264, F265, F266, F267, F268, F283, FR-KULA-149, FR-KULA-153, FR-KULA-154, FR-KULA-176, FR-KULA-183 |
| HS-SCR-ADM-18 | Multi-outlet overview & branch comparison | single outlet, loading, success | spec only (states in COMPONENTS) | F111, F157, F177, F259, F269, F270, F282, FR-KPS-32, FR-SENET-02 |
| HS-SCR-ADM-19 | Announcements & news / push | empty, scheduled, sent | spec only (states in COMPONENTS) | F137, FR-KPS-45, FR-KPS-57, FR-SENET-114, FR-SENET-40, FR-SENET-66, FR-SENET-75 |
| HS-SCR-ADM-20 | Billing rules editor (rounding, minimum charge, zone × tier) with simulator | validation error, unsaved changes, success (new version) | `ADM-20-billing` | F019, F020, F021, F022, F023, F030, F038, FR-KPS-12, FR-KPS-14, FR-KPS-15, FR-SENET-09, FR-SENET-12, FR-SENET-121, FR-SENET-86, FR-SENET-87, FR-SENET-89, FR-SENET-90 |
| HS-SCR-ADM-21 | Booking deposit, cancellation & no-show policy | validation, success | `ADM-21-bookingpolicy` | F079, F080, F081, F082, F085, FR-KPS-26, FR-KPS-28, FR-SENET-105, FR-SENET-106, FR-SENET-32, FR-SENET-36 |
| HS-SCR-ADM-22 | Staff 2FA enrol (TOTP + backup codes) | code wrong, success | `ADM-22-2fa-enrol` | F245, FR-KPS-33, FR-SENET-45, FR-SENET-67 |
| HS-SCR-ADM-23 | Staff sign-in with 2FA | wrong code (rate-limited), locked, backup code, success | `ADM-23-2fa-login` | F245, F246, FR-KPS-33 |
| HS-SCR-ADM-24 | Webhooks settings (endpoints, signing secret, delivery log) | empty, failing endpoint, paused, test sent | `ADM-24-webhooks` | F061, F062, F271, F272, FR-SENET-110 |
| HS-SCR-ADM-25 | Tournament registration & check-in | registration open, unpaid, no-show → substitute, full | `ADM-25-tour-checkin` | F141, F142, F147, F148, F149, F154, FR-KPS-59, FR-KULA-260, FR-KULA-383, FR-KULA-384, FR-SENET-69 |

### CUS · Customer PWA: booking, member/wallet/time, QR order, receipt — iOS = this PWA in V1 (Safari tested)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-CUS-01 | Venue page & live availability | loading, offline, venue closed, success | spec only (states in COMPONENTS) | F071, F072, F073, F229, FR-KPS-26, FR-KPS-69, FR-KULA-048, FR-KULA-276, FR-KULA-278, FR-SENET-123, FR-SENET-38 |
| HS-SCR-CUS-02 | Book a unit: date, slot, games filter | no slots, conflict, hold timer, success | `CUS-02-book` | F074, F075, F076, F077, F078, F087, FR-KPS-26, FR-KPS-69, FR-KULA-093, FR-KULA-147, FR-KULA-156, FR-KULA-214, FR-SENET-105, FR-SENET-107, FR-SENET-37 |
| HS-SCR-CUS-03 | Deposit payment (QRIS) & booking confirmation with unlock code | QRIS waiting, expired, paid, cancelled + refund, success | `CUS-03-confirm` | F079, F080, F081, F086, F088, F089, F090, FR-KPS-26, FR-KPS-35, FR-SENET-106, FR-SENET-32, FR-SENET-33 |
| HS-SCR-CUS-04 | QR menu order from station | empty cart, out of stock, offline, order sent | `CUS-04-qrorder` | F112, F113, F120, F121, FR-KPS-19, FR-KULA-052, FR-KULA-053, FR-KULA-161, FR-KULA-263, FR-KULA-329, FR-KULA-334, FR-SENET-41, FR-SENET-43 |
| HS-SCR-CUS-05 | Order status | accepted, preparing, ready, delivered, rejected + refund | `CUS-05-status` | F117, F118, FR-KPS-19, FR-KULA-051, FR-KULA-241, FR-SENET-100 |
| HS-SCR-CUS-06 | My session: remaining time, extend request, call operator, chat | loading, offline (last known), success | `CUS-05-status` | F032, F091, F092, F093, F094, F095, FR-KPS-56, FR-KULA-381, FR-SENET-20 |
| HS-SCR-CUS-07 | Member card, wallet, time credit, points | not member → register, loading, success | `CUS-07-member` | F053, F090, F122, F124, F125, F131, F132, F133, F136, F139, F140, F250, FR-KPS-22, FR-KPS-23, FR-KPS-25, FR-KULA-094, FR-KULA-208, FR-KULA-261, FR-SENET-124, FR-SENET-26, FR-SENET-27, FR-SENET-29, FR-SENET-38 |
| HS-SCR-CUS-08 | Digital receipt | loading, not found, success | spec only (states in COMPONENTS) | F168, FR-KPS-34 |
| HS-SCR-CUS-09 | Leaderboard & tournaments | empty, registration open, live bracket | `CUS-09-tournament` | F134, F141, F142, F152, FR-KPS-58, FR-KPS-59, FR-KULA-260 |

### KDS · Kitchen display (web KDS, MVP)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-KDS-01 | Order board (Baru / Diproses / Siap / Diantar) | empty, offline, success | `KDS-01-board` | F116, F117, F118, F119, FR-KPS-19, FR-KULA-050, FR-KULA-051, FR-KULA-158, FR-KULA-166, FR-KULA-223, FR-KULA-241, FR-KULA-295, FR-SENET-100, FR-SENET-99 |
| HS-SCR-KDS-02 | Item 86 (habis) & reject with reason | success | spec only (states in COMPONENTS) | F118, F120, FR-KULA-050 |

### LBY · Lobby / status / waiting-room board (read-only projection, V1, redacted)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-LBY-01 | Station billboard (zones, status, remaining time) | empty, offline, privacy mode | `LBY-01-billboard` | F073, F232, F278, FR-KPS-57, FR-KULA-259, FR-KULA-379, FR-KULA-380, FR-SENET-06 |
| HS-SCR-LBY-02 | Waiting list & queue numbers | empty, success | spec only (states in COMPONENTS) | F083, FR-KULA-051, FR-KULA-241 |
| HS-SCR-LBY-03 | Tournament bracket spectator + leaderboard | empty, live | spec only (states in COMPONENTS) | F134, F152, F153, FR-KPS-58, FR-KPS-59, FR-KULA-260 |

### CFD · Customer checkout display (read-only projection, V1)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-CFD-01 | Order total & QRIS for customer | idle, items, QRIS, paid | `CFD-01-qris` | F050, F051, FR-KULA-285 |

### KSK · Self-service kiosk (hardened shared web app, V2)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-KSK-01 | Attract & sign in (QR / phone) | idle, loading, offline (cash at cashier) | `KSK-01-attract` | F231, FR-KULA-315, FR-SENET-18, FR-SENET-20, FR-SENET-70 |
| HS-SCR-KSK-02 | Top-up wallet (preset + bonus tiers) | success | `KSK-02-topup` | F054, F130, FR-SENET-120, FR-SENET-22, FR-SENET-26, FR-SENET-27, FR-SENET-94 |
| HS-SCR-KSK-03 | Pick unit & package | no free unit (waitlist), success | spec only (states in COMPONENTS) | F017, F073, F083, F091, FR-KPS-06, FR-SENET-10, FR-SENET-21 |
| HS-SCR-KSK-04 | QRIS pay & start | waiting, expired, paid, activation failed → credit | `KSK-04-qris` | F046, F047, F050, F051, F060, FR-KPS-35 |
| HS-SCR-KSK-05 | Done: access code & receipt | success | spec only (states in COMPONENTS) | F168, F227, FR-SENET-14, FR-SENET-83 |

### TVA · Android / Google TV agent — native Kotlin (MVP, certified devices)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-TVA-01 | Pairing code (PIN, 10-min expiry, refresh) | code expired, network down, paired | `TVA-01-pairing` | F184, F185, FR-KPS-37, FR-KPS-38, FR-KULA-210, FR-SENET-73 |
| HS-SCR-TVA-02 | Setup check (overlay permission, HDMI port, test lock) | permission missing, unsupported, passed | `TVA-02-setup`, `TVA-02b-permlost` | F189, F190, F191, F192, F205, FR-KPS-39, FR-KPS-65 |
| HS-SCR-TVA-03 | Standby lock (venue background, QR login, next booking) | offline, success | `TVA-03-standby` | F187, FR-KPS-41, FR-KPS-49, FR-KULA-247, FR-KULA-255, FR-SENET-108, FR-SENET-20, FR-SENET-55, FR-SENET-57, FR-SENET-76, FR-SENET-78 |
| HS-SCR-TVA-04 | Running: timer corner overlay | position/opacity variants, paused | `TVA-04-running` | F190, FR-KPS-40, FR-KPS-42, FR-KPS-44, FR-KULA-252, FR-KULA-254, FR-SENET-54, FR-SENET-56 |
| HS-SCR-TVA-05 | Ending soon (5-min) warning + extend hint | 5 min, 1 min | `TVA-05-warning` | F028, FR-KPS-45, FR-KPS-55, FR-SENET-58 |
| HS-SCR-TVA-06 | Overtime / finished lock | overtime fee counting, finished | `TVA-06-overtime` | F029, F030, FR-KPS-15, FR-KPS-41, FR-KULA-257 |
| HS-SCR-TVA-07 | Offline lease mode | lease valid, lease expiring, tamper detected | `TVA-07-offline` | F036, F193, F194, F195, F196, F197, FR-KPS-51, FR-KPS-52, FR-KPS-53, FR-SENET-77 |
| HS-SCR-TVA-08 | Emergency override & admin PIN exit | PIN entry, wrong PIN (rate-limited), override active | `TVA-08-override` | F188, F208, F256, FR-KPS-43, FR-KULA-255 |
| HS-SCR-TVA-09 | Operator message, F&B arrival, member rank greeting | message, greeting | spec only (states in COMPONENTS) | F135, FR-KPS-45, FR-KPS-58, FR-KULA-263, FR-SENET-40, FR-SENET-75 |
| HS-SCR-TVA-10 | Agent update & recovery | downloading, installing, failed | `TVA-10-bootrecover` | F193, F206, FR-KPS-50, FR-KPS-54 |

### ADP · LG / Samsung via certified external CEC/HDMI/IR adapter (edge plugin, MVP); native webOS/Tizen = V2 feasibility, no UI yet

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-ADP-01 | Adapter setup wizard (CEC / IR / HDMI switch / smart plug) | adapter not found, test failed, passed | `ADP-01-wizard` | F200, F201, F202, F203, F207, F224, F225, F226, F228, F242, FR-KPS-62, FR-KPS-63, FR-SENET-61, FR-SENET-71, FR-SENET-79, FR-SENET-80, FR-SENET-81 |
| HS-SCR-ADP-02 | Blank-source lock card (rendered by HDMI switch) | locked, unlocked | `ADP-02-lockcard` | F202, FR-KPS-62 |

### PCA · Windows PC seat app — .NET service + UI shell (V1)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-PCA-01 | Seat lock screen (login: QR / code / member) | offline, booked soon, success | `PCA-01-lock` | F209, FR-KPS-60, FR-KULA-264, FR-KULA-337, FR-KULA-338, FR-SENET-03, FR-SENET-04, FR-SENET-05, FR-SENET-108, FR-SENET-18, FR-SENET-20, FR-SENET-53, FR-SENET-54 |
| HS-SCR-PCA-02 | In-session HUD + launcher | 5-min warning, ending | `PCA-02-hud` | F210, F211, F216, F217, F218, F219, FR-KPS-60, FR-SENET-04, FR-SENET-11, FR-SENET-115, FR-SENET-116, FR-SENET-117, FR-SENET-49, FR-SENET-50, FR-SENET-51 |
| HS-SCR-PCA-03 | Food order & chat panel | success | spec only (states in COMPONENTS) | F212, F213, FR-SENET-118, FR-SENET-41, FR-SENET-44 |
| HS-SCR-PCA-04 | Remote assist consent & admin commands | consent prompt, restart | spec only (states in COMPONENTS) | F214, F215, F220, F253, FR-KPS-60, FR-SENET-07, FR-SENET-111, FR-SENET-112 |

### GWY · Venue edge gateway (.NET) — PIN pairing + local health UI (MVP)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-GWY-01 | Gateway PIN pairing | code expired, paired | `GWY-01-pair` | F228, F240, FR-KPS-52, FR-KPS-64 |
| HS-SCR-GWY-02 | Edge health & local authority | online, offline-authority, reconciling | `GWY-01-pair` | F233, F234, F235, F257, FR-KPS-51, FR-KPS-64 |

### OWN · Owner mobile view = responsive web admin (not a separate app)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-OWN-01 | Owner today (revenue, live units, alerts) | loading, offline, success | `OWN-01-today` | F230, FR-KPS-32, FR-KULA-262, FR-SENET-48 |
| HS-SCR-OWN-02 | Approvals & shift recap | empty, success | `OWN-01-today` | F158, F160, FR-KPS-29, FR-KPS-30, FR-KULA-262 |

### MAG · Android phone/tablet rental agent (V2 pilot)

| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |
|---|---|---|---|---|
| HS-SCR-MAG-01 | Allowed-games launcher + timer | success | `MAG-01-launcher` | F222, FR-KPS-61 |
| HS-SCR-MAG-02 | Expiry lock | locked | spec only (states in COMPONENTS) | F223, FR-KPS-61 |

## Coverage table

Keyed by source id, with the owning ticket from Grok's `specs/ID-CROSSWALK.md` (read-only). `→` screens that carry its UI. `no UI` = backend/policy only. `(normalised)` = Kula ⭐ row from another industry that the crosswalk normalises to a generic concept; it uses the generic screen named.

### FR-KPS (rental PS pack, 69)

| Req id | Feature | Ticket | UI screens |
|---|---|---|---|
| FR-KPS-01 | Rental service products with minute/hour/day price basis and separate cost basis | HS-T03 | → HS-SCR-CSH-02, HS-SCR-ADM-02 |
| FR-KPS-02 | Named unit/table/room mapped to rentable product | HS-T03 | → HS-SCR-CSH-01, HS-SCR-ADM-02 |
| FR-KPS-03 | Multi-console selection on one shared table | HS-T03 | → HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-ADM-02 |
| FR-KPS-04 | Fixed-duration countdown | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-02 |
| FR-KPS-05 | Open-ended elapsed-time billing | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-02 |
| FR-KPS-06 | Prepaid packages | HS-T06 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-KSK-03 |
| FR-KPS-07 | Postpaid checkout | HS-T06 | → HS-SCR-CSH-02, HS-SCR-CSH-05 |
| FR-KPS-08 | Extend running session | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-03 |
| FR-KPS-09 | Pause and resume | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-03 |
| FR-KPS-10 | Move session to another unit preserving time and bill | HS-T05 | → HS-SCR-CSH-03, HS-SCR-CSH-15 |
| FR-KPS-11 | Early stop and end state | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-03 |
| FR-KPS-12 | Hourly/minute/day pricing configuration | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-20 |
| FR-KPS-13 | Happy-hour schedule and overnight packages | HS-T04 | → HS-SCR-ADM-04 |
| FR-KPS-14 | Member-specific tariffs or discount tiers | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-20 |
| FR-KPS-15 | Overtime/late-fee configuration | HS-T04 | → HS-SCR-CSH-03, HS-SCR-ADM-04, HS-SCR-ADM-20, HS-SCR-TVA-06 |
| FR-KPS-16 | Add catalogue items while rental timer runs | HS-T14 | → HS-SCR-CSH-03, HS-SCR-CSH-04 |
| FR-KPS-17 | Merge rental and F&B into one checkout | HS-T14 | → HS-SCR-CSH-04, HS-SCR-CSH-05 |
| FR-KPS-18 | Group/merge multiple rental bills | HS-T14 | → HS-SCR-CSH-05 |
| FR-KPS-19 | QR-table self-ordering and kitchen routing | HS-T14 | → HS-SCR-CUS-04, HS-SCR-CUS-05, HS-SCR-KDS-01 |
| FR-KPS-20 | Stock/recipe deductions for rental food sales | HS-T15 | → HS-SCR-CSH-04, HS-SCR-ADM-07 |
| FR-KPS-21 | Member lookup and play/purchase history | HS-T11 | → HS-SCR-CSH-02, HS-SCR-CSH-06, HS-SCR-ADM-05 |
| FR-KPS-22 | Save unused prepaid minutes to member time credit | HS-T10 | → HS-SCR-CSH-06, HS-SCR-CUS-07 |
| FR-KPS-23 | Redeem saved time and view remaining balance | HS-T10 | → HS-SCR-CSH-06, HS-SCR-CUS-07 |
| FR-KPS-24 | Time-credit expiry policy | HS-T10 | → HS-SCR-CSH-06, HS-SCR-ADM-05 |
| FR-KPS-25 | Loyalty points integration | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-CUS-07 |
| FR-KPS-26 | Customer booking portal with unit availability | HS-T12 | → HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-01, HS-SCR-CUS-02, HS-SCR-CUS-03 |
| FR-KPS-27 | Cashier reservation management and arrival conversion | HS-T12 | → HS-SCR-CSH-07, HS-SCR-CSH-12, HS-SCR-ADM-06 |
| FR-KPS-28 | Booking no-show blacklist without blocking walk-in sale | HS-T12 | → HS-SCR-CSH-07, HS-SCR-CSH-12, HS-SCR-ADM-06, HS-SCR-ADM-21 |
| FR-KPS-29 | Per-shift rental payments and extension audit | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-ADM-08, HS-SCR-OWN-02 |
| FR-KPS-30 | Cash vs non-cash reconciliation and opening float | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-OWN-02 |
| FR-KPS-31 | Per-station occupancy, sales and maintenance analytics | HS-T18 | → HS-SCR-ADM-01, HS-SCR-ADM-08 |
| FR-KPS-32 | Remote owner dashboard and multi-outlet integration | HS-T33 | → HS-SCR-ADM-01, HS-SCR-ADM-18, HS-SCR-OWN-01 |
| FR-KPS-33 | Restricted cashier/admin/owner capabilities | HS-T02 | → HS-SCR-ADM-09, HS-SCR-ADM-22, HS-SCR-ADM-23 |
| FR-KPS-34 | Thermal/PDF and digital receipt integration | HS-T08 | → HS-SCR-CSH-05, HS-SCR-ADM-13, HS-SCR-CUS-08 |
| FR-KPS-35 | Cash, QRIS and transfer method integration | HS-T07 | → HS-SCR-CSH-05, HS-SCR-CUS-03, HS-SCR-KSK-04 |
| FR-KPS-36 | Split payments, deposits and unpaid balances | HS-T06 | → HS-SCR-CSH-05 |
| FR-KPS-37 | Installable Android TV / Google TV APK | HS-T21 | → HS-SCR-ADM-11, HS-SCR-TVA-01 |
| FR-KPS-38 | PIN pairing binds agent to station; displayed PIN expires after 10 minutes and can refresh | HS-T19 | → HS-SCR-ADM-11, HS-SCR-TVA-01 |
| FR-KPS-39 | HDMI port configuration, explicit test-lock/test-unlock, and ready status | HS-T19 | → HS-SCR-ADM-03, HS-SCR-TVA-02 |
| FR-KPS-40 | Switch to console HDMI when session starts | HS-T21 | → HS-SCR-CSH-02, HS-SCR-CSH-15, HS-SCR-TVA-04 |
| FR-KPS-41 | Locked standby, paused and finished screens | HS-T21 | → HS-SCR-TVA-03, HS-SCR-TVA-06 |
| FR-KPS-42 | Active-session Home/launcher guard | HS-T21 | → HS-SCR-TVA-04 |
| FR-KPS-43 | PIN-protected administrative exit | HS-T21 | → HS-SCR-TVA-08 |
| FR-KPS-44 | Timer overlay with position and opacity settings | HS-T21 | → HS-SCR-TVA-04 |
| FR-KPS-45 | On-TV time warnings and operator messages | HS-T22 | → HS-SCR-ADM-19, HS-SCR-TVA-05, HS-SCR-TVA-09 |
| FR-KPS-46 | Remote volume up/down/mute | HS-T22 | → HS-SCR-CSH-03 |
| FR-KPS-47 | Idle eco sleep / wake / power controls | HS-T22 | → HS-SCR-CSH-03 |
| FR-KPS-48 | Remote agent restart and manual/temporary HDMI, Home/navigation controls | HS-T22 | → HS-SCR-CSH-03 |
| FR-KPS-49 | Owner-provided standby backgrounds and store identity | HS-T22 | → HS-SCR-ADM-13, HS-SCR-TVA-03 |
| FR-KPS-50 | Boot/reboot and package-replacement recovery | HS-T20 | → HS-SCR-ADM-11, HS-SCR-TVA-10 |
| FR-KPS-51 | Local active timer continues during internet outage | HS-T20 | → HS-SCR-CSH-01, HS-SCR-TVA-07, HS-SCR-GWY-02 |
| FR-KPS-52 | Realtime connection, heartbeats, acknowledgement and reconnect | HS-T20 | → HS-SCR-ADM-03, HS-SCR-TVA-07, HS-SCR-GWY-01 |
| FR-KPS-53 | Fallback HTTP polling while socket is unhealthy | HS-T24 | → HS-SCR-ADM-03, HS-SCR-TVA-07 |
| FR-KPS-54 | In-app agent update download/install flow | HS-T24 | → HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-TVA-10 |
| FR-KPS-55 | Cashier spoken/beep session warnings | HS-T25 | → HS-SCR-CSH-01, HS-SCR-CSH-10, HS-SCR-TVA-05 |
| FR-KPS-56 | Station QR chat with operator reply and audio alert | HS-T25 | → HS-SCR-CSH-10, HS-SCR-CUS-06 |
| FR-KPS-57 | Realtime lobby station billboard, zones and announcements | HS-T26 | → HS-SCR-CSH-01, HS-SCR-ADM-13, HS-SCR-ADM-19, HS-SCR-LBY-01 |
| FR-KPS-58 | Member playtime leaderboard and TV rank greeting | HS-T32 | → HS-SCR-CUS-09, HS-SCR-LBY-03, HS-SCR-TVA-09 |
| FR-KPS-59 | Tournament entrants, fee, bracket, score, prize and station assignment | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09, HS-SCR-LBY-03 |
| FR-KPS-60 | Windows PC Agent lock/timer and remote lifecycle commands | HS-T27 | → HS-SCR-ADM-11, HS-SCR-PCA-01, HS-SCR-PCA-02, HS-SCR-PCA-04 |
| FR-KPS-61 | Android phone/tablet rental agent and game allowlist (pilot) | HS-T38 | → HS-SCR-ADM-11, HS-SCR-MAG-01, HS-SCR-MAG-02 |
| FR-KPS-62 | Non-Android TV external-box path | HS-T23 | → HS-SCR-ADM-12, HS-SCR-ADP-01, HS-SCR-ADP-02 |
| FR-KPS-63 | Native LG webOS / Samsung Tizen TV agent | HS-T39 | → HS-SCR-ADM-12, HS-SCR-ADP-01 |
| FR-KPS-64 | Local cashier queue and shared offline-sync integration | HS-T20 | → HS-SCR-CSH-11, HS-SCR-GWY-01, HS-SCR-GWY-02 |
| FR-KPS-65 | Capability-aware station errors and unsupported hardware states | HS-T19 | → HS-SCR-CSH-01, HS-SCR-ADM-03, HS-SCR-ADM-12, HS-SCR-TVA-02 |
| FR-KPS-66 | Concurrent cashier actions and idempotent command safety | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-11 |
| FR-KPS-67 | Rental unit / TV-PC agent slot limits and plan gates | HS-T33 | → HS-SCR-ADM-02, HS-SCR-ADM-11, HS-SCR-ADM-15 |
| FR-KPS-68 | Audit export and privacy-safe diagnostics | HS-T30 | → HS-SCR-ADM-08, HS-SCR-ADM-14 |
| FR-KPS-69 | Per-station installed-game catalogue, online-bookable flag and customer game filters | HS-T12 | → HS-SCR-ADM-02, HS-SCR-ADM-06, HS-SCR-CUS-01, HS-SCR-CUS-02 |

Totals: {'ui': 69} of 69

### FR-KULA ⭐ (full-site pack, 144 rental/gaming rows)

| Req id | Feature | Ticket | UI screens |
|---|---|---|---|
| FR-KULA-001 | Laba Rugi (`reports.profit_loss`) | HS-T18 | → HS-SCR-ADM-01, HS-SCR-ADM-08 |
| FR-KULA-006 | Piutang & Biaya (Keuangan) (`finance.cash_flow`) | HS-T18 | → HS-SCR-ADM-08 |
| FR-KULA-010 | Profit Workshop Craft (`reports.production_profit`) | HS-T18 | → HS-SCR-ADM-08, HS-SCR-ADM-01 (normalised) |
| FR-KULA-015 | Laporan Shift Kasir (`reports.shifts`) | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-ADM-08 |
| FR-KULA-021 | Laporan Poin Loyalitas (`reports.loyalty`) | HS-T11 | → HS-SCR-ADM-05, HS-SCR-ADM-08 |
| FR-KULA-038 | Setup Poin Loyalitas (`settings.loyalty`) | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-046 | Mode Rental / Timer (`rental`) | HS-T05 | → HS-SCR-CSH-01 |
| FR-KULA-047 | Kula TV Agent (Integrasi TV) (`rental.tv_agent`) | HS-T21 | → HS-SCR-ADM-11 |
| FR-KULA-048 | Reservasi Online (Portal Booking) (`rental.booking`) | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-01 |
| FR-KULA-049 | Manajemen Meja (`table_management`) | HS-T14 | → HS-SCR-CSH-01 |
| FR-KULA-050 | Kitchen Display System (`kitchen`) | HS-T14 | → HS-SCR-KDS-01, HS-SCR-KDS-02 |
| FR-KULA-051 | Sistem Antrian (`fnb.queue_system`) | HS-T14 | → HS-SCR-CUS-05, HS-SCR-KDS-01, HS-SCR-LBY-02 |
| FR-KULA-052 | Order Online / QR Menu (`fnb.online_order`) | HS-T14 | → HS-SCR-CUS-04 |
| FR-KULA-053 | Batch Pre-Order (PO) (`fnb.preorder`) | HS-T14 | → HS-SCR-ADM-07, HS-SCR-CUS-04 |
| FR-KULA-054 | Resep & HPP Produk (`recipe`) | HS-T15 | → HS-SCR-ADM-07 |
| FR-KULA-055 | Laporan HPP (COGS) Detail (`cogs_report`) | HS-T18 | → HS-SCR-ADM-07 |
| FR-KULA-063 | Pet Suite (Booking & Pet Data) (`pet_suite`) | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-065 | Sistem Uang Muka (DP) & Tagihan Pending (`dp_billing`) | HS-T06 | → HS-SCR-CSH-05 |
| FR-KULA-070 | Absen Saya (Clock In & Out Mandiri) (`hris.clockin`) | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-074 | Manajemen Shift & Toleransi Telat (`hris.shifts`) | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-075 | Kasbon Karyawan (`hris.cash_advances`) | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-077 | Penggajian (Slip Gaji) (`hris.payroll`) | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-078 | Pembagian Hasil (Profit Sharing) (`hris.profit_distribution`) | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-081 | Multi-Satuan Box/Strip/Tablet | HS-T15 | → HS-SCR-ADM-07, HS-SCR-CSH-04 (normalised) |
| FR-KULA-093 | Booking Slot Online dari HP | HS-T12 | → HS-SCR-CUS-02 |
| FR-KULA-094 | Loyalty Stamp Member | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| FR-KULA-099 | Loyalty Stamp Digital: 5 Kali Potong Gratis 1 Kali Tanpa Kartu Kertas | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-105 | Laporan Margin & Profit Bengkel | HS-T18 | → HS-SCR-ADM-08, HS-SCR-ADM-01 (normalised) |
| FR-KULA-114 | Fee Dokter & Laba Rugi | HS-T18 | → HS-SCR-ADM-08, HS-SCR-ADM-01 (normalised) |
| FR-KULA-115 | Booking konsultasi dokter | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-138 | Laba Rugi & Barang Terlaris | HS-T18 | → HS-SCR-ADM-08, HS-SCR-ADM-01 (normalised) |
| FR-KULA-140 | Booking Grooming | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-146 | Pet Hotel & Grooming: Penjadwalan Booking Kamar, Antrian Mandi & Deposit | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-147 | Manajemen Jadwal & Reservasi | HS-T45 | → HS-SCR-CSH-01, HS-SCR-CSH-07, HS-SCR-ADM-06, HS-SCR-CUS-02 |
| FR-KULA-148 | Tarif Sewa Jam, Hari, & Mingguan | HS-T45 | → HS-SCR-ADM-04 |
| FR-KULA-149 | Pencatatan Jaminan & Deposit | HS-T45 | → HS-SCR-ADM-17 |
| FR-KULA-150 | Katalog Barang & Varian Alat | HS-T45 | → HS-SCR-ADM-02 |
| FR-KULA-151 | Kasir POS Cetak Nota Struk | HS-T45 | → HS-SCR-CSH-05 |
| FR-KULA-152 | Laporan Pendapatan Unit Sewa | HS-T45 | → HS-SCR-ADM-08 |
| FR-KULA-153 | Kontrol Unit Sewa, Arsip Jaminan & Denda Keterlambatan Otomatis | HS-T45 | → HS-SCR-ADM-17 |
| FR-KULA-154 | SOP Check-in & Check-out Unit Sewa: Arsip Jaminan KTP & Deposit | HS-T12 | → HS-SCR-ADM-17 |
| FR-KULA-155 | Pengaturan Tarif Durasi Sewa: Jam-jaman, Harian, & Hitung Denda Overtime | HS-T35 | → HS-SCR-ADM-04 |
| FR-KULA-156 | Monitoring Kalender Ketersediaan Unit Sewa & Booking Real-time | HS-T12 | → HS-SCR-CSH-01, HS-SCR-CSH-07, HS-SCR-ADM-06, HS-SCR-CUS-02 |
| FR-KULA-157 | Manajemen Meja Interaktif | HS-T45 | → HS-SCR-CSH-01 |
| FR-KULA-158 | Kitchen Display Screen (KDS) | HS-T14 | → HS-SCR-KDS-01 |
| FR-KULA-159 | Split Bill & Join Table | HS-T05 | → HS-SCR-CSH-05 |
| FR-KULA-161 | Direct Order QR Code Meja | HS-T45 | → HS-SCR-CUS-04 |
| FR-KULA-162 | Laporan Profit & Terlaris | HS-T45 | → HS-SCR-ADM-08 |
| FR-KULA-164 | Status semua meja dalam satu layar | HS-T45 | → HS-SCR-CSH-01 |
| FR-KULA-166 | Sistem Kitchen Display (KDS) & Cetak Order Tiket Dapur Otomatis | HS-T14 | → HS-SCR-KDS-01 |
| FR-KULA-167 | Panduan Manajemen Meja, Pindah Meja & Reservasi Pelanggan | HS-T45 | → HS-SCR-CSH-01 |
| FR-KULA-168 | Fitur Split Bill Kasir Resto: Pisah Tagihan per Orang & per Item | HS-T05 | → HS-SCR-CSH-05 |
| FR-KULA-176 | Titik Checklist Serah Terima Meja Kasir | HS-T17 | → HS-SCR-ADM-17 |
| FR-KULA-183 | Cetak Stiker Label Unit & Struk Thermal | HS-T08 | → HS-SCR-ADM-17 |
| FR-KULA-188 | Cetak Stiker Label Harga Rak | HS-T08 | → HS-SCR-ADM-07 |
| FR-KULA-191 | Laporan Laba Rugi Real-time | HS-T18 | → HS-SCR-ADM-01 |
| FR-KULA-193 | Laba rugi langsung jadi | HS-T18 | → HS-SCR-ADM-01 |
| FR-KULA-195 | SOP Tutup Shift & Rekonsiliasi Kas Laci Kasir Harian | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-14 |
| FR-KULA-199 | Cara Memberikan Diskon pada Item atau Total Belanja | HS-T11 | → HS-SCR-CSH-05 |
| FR-KULA-200 | Cara Melakukan Split Payment (Multi Metode Bayar) | HS-T06 | → HS-SCR-CSH-05 |
| FR-KULA-201 | Cara Mencatat Penjualan Piutang / Kasbon Pelanggan (Tempo) | HS-T06 | → HS-SCR-CSH-05 |
| FR-KULA-202 | Cara Batal / Void Transaksi & Retur Barang | HS-T06 | → HS-SCR-CSH-09 |
| FR-KULA-205 | Cara Menambah Pelanggan & Mendaftarkan Member Baru | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05 |
| FR-KULA-206 | Cara Menggunakan & Menukarkan Poin Loyalitas Member di Kasir | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05 |
| FR-KULA-207 | Cara Mengatur Grup Pelanggan (Tier VIP & Diskon Khusus Member) | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-208 | Cara Menghubungkan Member di Rental PS (Simpan Sisa Waktu Main) | HS-T10 | → HS-SCR-CSH-06, HS-SCR-CUS-07 |
| FR-KULA-209 | Cara Memulai Sesi Rental PS (Billing Timer) | HS-T05 | → HS-SCR-CSH-01, HS-SCR-CSH-02 |
| FR-KULA-210 | Cara Menghubungkan Android TV / Google TV (Kula TV Agent APK) | HS-T19 | → HS-SCR-ADM-11, HS-SCR-TVA-01 |
| FR-KULA-211 | Cara Menjeda (Pause) & Simpan Sisa Waktu Rental (Time Credit) | HS-T10 | → HS-SCR-CSH-03, HS-SCR-CSH-06 |
| FR-KULA-212 | Cara Tambah Waktu Main & Pesan Makanan/Minuman di Meja Rental | HS-T14 | → HS-SCR-CSH-03, HS-SCR-CSH-04 |
| FR-KULA-213 | Cara Menggunakan Remote TV Virtual di Layar Kasir | HS-T22 | → HS-SCR-CSH-03 |
| FR-KULA-214 | Cara Mengatur Katalog Game per Meja & Portal Booking Online | HS-T12 | → HS-SCR-ADM-02, HS-SCR-CUS-02 |
| FR-KULA-218 | Cara Mengatur Resep & Bahan Baku (Potong Stok Otomatis F&B) | HS-T15 | → HS-SCR-ADM-07 |
| FR-KULA-222 | Cara Mengatur Denah Meja, Pindah Meja & Gabung Meja | HS-T14 | → HS-SCR-CSH-03 |
| FR-KULA-223 | Cara Menggunakan Kitchen Display System (KDS Layar Dapur) | HS-T14 | → HS-SCR-KDS-01 |
| FR-KULA-225 | Cara Membaca Laporan Laba Rugi (Profit & Loss) | HS-T18 | → HS-SCR-ADM-08 |
| FR-KULA-227 | Cara Tutup Shift Kasir & Rekap Uang Tunai (Laporan Shift) | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-13 |
| FR-KULA-229 | Cara Absensi Karyawan (Clock-in GPS & Selfie) | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-241 | Queue system & KDS | HS-T14 | → HS-SCR-CUS-05, HS-SCR-KDS-01, HS-SCR-LBY-02 |
| FR-KULA-244 | AI Voucher & Copywriter | HS-T37 | → HS-SCR-ADM-05 |
| FR-KULA-247 | TV lock via KULA TV Agent | HS-T21 | → HS-SCR-ADM-11, HS-SCR-TVA-03 |
| FR-KULA-250 | Package (prepaid) mode | HS-T06 | → HS-SCR-CSH-02, HS-SCR-ADM-04 |
| FR-KULA-251 | Open Billing (postpaid) mode | HS-T05 | → HS-SCR-CSH-02 |
| FR-KULA-252 | Timer visible on TV | HS-T21 | → HS-SCR-TVA-04 |
| FR-KULA-253 | Merge F&B bill into rental bill | HS-T14 | → HS-SCR-CSH-04, HS-SCR-CSH-05 |
| FR-KULA-254 | Auto HDMI switch ≤1 s | HS-T21 | → HS-SCR-CSH-02, HS-SCR-TVA-04 |
| FR-KULA-255 | Active Session Guard / PIN Exit Security Guard | HS-T21 | → HS-SCR-TVA-03, HS-SCR-TVA-08 |
| FR-KULA-256 | Cloud data store | HS-T20 | no UI — cloud data store (platform) |
| FR-KULA-257 | Late fee on overrun | HS-T04 | → HS-SCR-CSH-03, HS-SCR-ADM-04, HS-SCR-TVA-06 |
| FR-KULA-258 | Night/“begadang” packages, happy hour, student rates | HS-T04 | → HS-SCR-ADM-04 |
| FR-KULA-259 | Billboard TV status board | HS-T26 | → HS-SCR-LBY-01 |
| FR-KULA-260 | Tournament Bracket Manager | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09, HS-SCR-LBY-03 |
| FR-KULA-261 | Time Credit to WhatsApp member | HS-T10 | → HS-SCR-CSH-06, HS-SCR-CUS-07 |
| FR-KULA-262 | Shift recap to owner WhatsApp | HS-T25 | → HS-SCR-CSH-08, HS-SCR-OWN-01, HS-SCR-OWN-02 |
| FR-KULA-263 | F&B order to active TV number | HS-T14 | → HS-SCR-CSH-03, HS-SCR-CUS-04, HS-SCR-TVA-09 |
| FR-KULA-264 | /KulaPcAgent.exe | HS-T27 | → HS-SCR-ADM-11, HS-SCR-PCA-01 |
| FR-KULA-267 | /app-tv-production.apk | HS-T21 | → HS-SCR-ADM-11 |
| FR-KULA-268 | /app-tv.apk | HS-T21 | → HS-SCR-ADM-11 |
| FR-KULA-269 | /barber-booking/:storeId | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-273 | /bengkel/tv | HS-T26 | → HS-SCR-LBY-01, HS-SCR-ADM-13 (normalised) |
| FR-KULA-276 | /book-rental/:slug | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-01 |
| FR-KULA-278 | /booking/:slug | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-01 |
| FR-KULA-285 | /customer-view/:signageKey | HS-T26 | → HS-SCR-CFD-01 |
| FR-KULA-291 | /download-tv | HS-T21 | → HS-SCR-ADM-11 |
| FR-KULA-295 | /fnb/kds | HS-T14 | → HS-SCR-KDS-01 |
| FR-KULA-296 | /fnb/tables | HS-T14 | → HS-SCR-CSH-01 |
| FR-KULA-300 | /hris/clockin | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-304 | /hris/payroll | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-305 | /hris/profit-distribution | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-306 | /hris/shift-schedule | HS-T35 | → HS-SCR-ADM-09 |
| FR-KULA-312 | /kasir-rental-ps | HS-T05 | → HS-SCR-CSH-01 |
| FR-KULA-315 | /kiosk/:signageKey | HS-T40 | → HS-SCR-KSK-01 |
| FR-KULA-329 | /order-fnb | HS-T14 | → HS-SCR-CSH-04, HS-SCR-CUS-04 |
| FR-KULA-334 | /order/:storeId/:tableId | HS-T14 | → HS-SCR-CUS-04 |
| FR-KULA-337 | /pc | HS-T27 | → HS-SCR-ADM-11, HS-SCR-PCA-01 |
| FR-KULA-338 | /pc-agent | HS-T27 | → HS-SCR-ADM-11, HS-SCR-PCA-01 |
| FR-KULA-339 | /pet-bookings | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-343 | /pet-inpatient/:bookingId | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 (normalised) |
| FR-KULA-368 | /promotions/voucher/design/:id | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-369 | /promotions/voucher/edit/:id | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-370 | /promotions/voucher/new | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-378 | /rental | HS-T05 | → HS-SCR-CSH-01 |
| FR-KULA-379 | /rental-billboard/:signageKey | HS-T26 | → HS-SCR-LBY-01 |
| FR-KULA-380 | /rental-view/:signageKey | HS-T26 | → HS-SCR-LBY-01 |
| FR-KULA-381 | /rental/:slug/:unitId | HS-T13 | → HS-SCR-CUS-06 |
| FR-KULA-382 | /rental/pengaturan-rental | HS-T03 | → HS-SCR-ADM-02 |
| FR-KULA-383 | /rental/tournaments | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| FR-KULA-384 | /rental/tournaments/:id | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| FR-KULA-385 | /rental/troubleshoot-stik | HS-T45 | → HS-SCR-ADM-03 |
| FR-KULA-386 | /rental/tv-simulator | HS-T45 | → HS-SCR-ADM-03 |
| FR-KULA-400 | /reports/loyalty-points | HS-T11 | → HS-SCR-ADM-05, HS-SCR-ADM-08 |
| FR-KULA-406 | /reports/production-profit | HS-T18 | → HS-SCR-ADM-08, HS-SCR-ADM-01 (normalised) |
| FR-KULA-407 | /reports/profit-loss | HS-T18 | → HS-SCR-ADM-08 |
| FR-KULA-413 | /reports/shifts | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-14, HS-SCR-ADM-08 |
| FR-KULA-434 | /settings/loyalty | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-464 | /tv | HS-T21 | → HS-SCR-ADM-11 |
| FR-KULA-465 | /tv-agent | HS-T21 | → HS-SCR-ADM-11 |
| FR-KULA-466 | /tv-simulator | HS-T45 | → HS-SCR-ADM-03 |
| FR-KULA-490 | loyalty | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-491 | loyalty-points | HS-T11 | → HS-SCR-ADM-05 |
| FR-KULA-499 | production-profit | HS-T18 | → HS-SCR-ADM-08, HS-SCR-ADM-01 (normalised) |
| FR-KULA-501 | profit-loss | HS-T18 | → HS-SCR-ADM-08 |
| FR-KULA-502 | rental | HS-T05 | → HS-SCR-CSH-01 |
| FR-KULA-512 | shifts | HS-T17 | → HS-SCR-CSH-08, HS-SCR-ADM-08 |

Totals: {'ui': 128, 'normalised': 15, 'noui': 1} of 144

### FR-SENET (Senet pack, 129, partial)

| Req id | Feature | Ticket | UI screens |
|---|---|---|---|
| FR-SENET-01 | Cloud admin panel (CAP) | HS-T02 | → HS-SCR-ADM-01 |
| FR-SENET-02 | Multi-location management | HS-T33 | → HS-SCR-ADM-13, HS-SCR-ADM-18 |
| FR-SENET-03 | E-Launcher client install | HS-T27 | → HS-SCR-ADM-11, HS-SCR-PCA-01 |
| FR-SENET-04 | Shell player interface | HS-T27 | → HS-SCR-PCA-01, HS-SCR-PCA-02 |
| FR-SENET-05 | Security restriction levels | HS-T27 | → HS-SCR-PCA-01 |
| FR-SENET-06 | Venue map | HS-T03 | → HS-SCR-CSH-01, HS-SCR-ADM-02, HS-SCR-LBY-01 |
| FR-SENET-07 | Remote device commands | HS-T22 | → HS-SCR-CSH-03, HS-SCR-PCA-04 |
| FR-SENET-08 | Zones | HS-T03 | → HS-SCR-CSH-01, HS-SCR-ADM-02 |
| FR-SENET-09 | Hourly rates / peak-off-peak | HS-T04 | → HS-SCR-ADM-04, HS-SCR-ADM-20 |
| FR-SENET-10 | Passes / packages | HS-T04 | → HS-SCR-ADM-04, HS-SCR-KSK-03 |
| FR-SENET-11 | Pass promotion popup | HS-T13 | → HS-SCR-ADM-04, HS-SCR-PCA-02 |
| FR-SENET-12 | Flexible billing, cashier & tax settings | HS-T36 | → HS-SCR-CSH-05, HS-SCR-ADM-20 |
| FR-SENET-13 | Cash desk with shifts | HS-T17 | → HS-SCR-CSH-08 |
| FR-SENET-14 | Receipt-based session | HS-T13 | → HS-SCR-CSH-02, HS-SCR-KSK-05 |
| FR-SENET-15 | Post-paid session | HS-T05 | → HS-SCR-CSH-02 |
| FR-SENET-16 | Bulk session start | HS-T13 | → HS-SCR-CSH-01 |
| FR-SENET-17 | Mandatory registration toggle | HS-T13 | → HS-SCR-ADM-05 |
| FR-SENET-18 | Self-registration at PC | HS-T13 | → HS-SCR-KSK-01, HS-SCR-PCA-01 |
| FR-SENET-19 | Admin-created accounts | HS-T11 | → HS-SCR-CSH-06 |
| FR-SENET-20 | QR login | HS-T13 | → HS-SCR-CUS-06, HS-SCR-KSK-01, HS-SCR-TVA-03, HS-SCR-PCA-01 |
| FR-SENET-21 | Scan-and-pay (guest) | HS-T13 | → HS-SCR-CSH-05, HS-SCR-KSK-03 |
| FR-SENET-22 | Online top-up via QR | HS-T09 | → HS-SCR-KSK-02 |
| FR-SENET-23 | Payment gateway integrations | HS-T07 | → HS-SCR-CSH-05, HS-SCR-ADM-16 |
| FR-SENET-24 | Cash register (fiscal) integrations | HS-T36 | → HS-SCR-ADM-13, HS-SCR-ADM-16 |
| FR-SENET-25 | SMS/messaging integrations | HS-T25 | → HS-SCR-ADM-13, HS-SCR-ADM-16 |
| FR-SENET-26 | Main balance wallet | HS-T09 | → HS-SCR-CSH-06, HS-SCR-CUS-07, HS-SCR-KSK-02 |
| FR-SENET-27 | Bonus balance | HS-T09 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-CUS-07, HS-SCR-KSK-02 |
| FR-SENET-28 | Promo codes | HS-T11 | → HS-SCR-ADM-05 |
| FR-SENET-29 | Level-based loyalty | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| FR-SENET-30 | Booking (admin map mode) | HS-T12 | → HS-SCR-CSH-07, HS-SCR-ADM-06 |
| FR-SENET-31 | System booking | HS-T12 | → HS-SCR-ADM-06 |
| FR-SENET-32 | Booking deposit & no-show fee | HS-T12 | → HS-SCR-CSH-12, HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-03 |
| FR-SENET-33 | Booking unlock code | HS-T13 | → HS-SCR-CSH-07, HS-SCR-CUS-03 |
| FR-SENET-34 | Booking list, reminders, Excel export | HS-T12 | → HS-SCR-CSH-07, HS-SCR-CSH-12, HS-SCR-ADM-06 |
| FR-SENET-35 | Booking timeline | HS-T12 | → HS-SCR-CSH-07, HS-SCR-ADM-06 |
| FR-SENET-36 | Booking settings | HS-T12 | → HS-SCR-ADM-06, HS-SCR-ADM-21 |
| FR-SENET-37 | Group booking | HS-T12 | → HS-SCR-CUS-02 |
| FR-SENET-38 | Senet ID mobile app + web portal | HS-T13 | → HS-SCR-CUS-01, HS-SCR-CUS-07 |
| FR-SENET-39 | Per-venue feature toggles in app | HS-T33 | → HS-SCR-ADM-13 |
| FR-SENET-40 | News & push notifications | HS-T44 | → HS-SCR-ADM-19, HS-SCR-TVA-09 |
| FR-SENET-41 | In-seat shop / F&B | HS-T14 | → HS-SCR-CSH-04, HS-SCR-CUS-04, HS-SCR-PCA-03 |
| FR-SENET-42 | Stock control | HS-T15 | → HS-SCR-ADM-07 |
| FR-SENET-43 | Combos / upsells | HS-T14 | → HS-SCR-CSH-04, HS-SCR-ADM-07, HS-SCR-CUS-04 |
| FR-SENET-44 | Player–staff chat | HS-T25 | → HS-SCR-CSH-10, HS-SCR-PCA-03 |
| FR-SENET-45 | Staff roles & permissions | HS-T02 | → HS-SCR-ADM-09, HS-SCR-ADM-22 |
| FR-SENET-46 | Customer list & activity logs | HS-T11 | → HS-SCR-ADM-05 |
| FR-SENET-47 | Reports | HS-T18 | → HS-SCR-ADM-08 |
| FR-SENET-48 | KPI dashboard / executive dashboard | HS-T18 | → HS-SCR-ADM-01, HS-SCR-OWN-01 |
| FR-SENET-49 | Game library (content cards) | HS-T28 | → HS-SCR-ADM-02, HS-SCR-PCA-02 |
| FR-SENET-50 | Game licence pool | HS-T28 | → HS-SCR-PCA-02 |
| FR-SENET-51 | Game Update | HS-T29 | → HS-SCR-PCA-02 |
| FR-SENET-52 | SENET Boot diskless/hybrid | HS-T29 | no UI — diskless boot: out of scope (matches F221) |
| FR-SENET-53 | Shell branding | HS-T27 | → HS-SCR-ADM-13, HS-SCR-PCA-01 |
| FR-SENET-54 | Shell session lock | HS-T27 | → HS-SCR-TVA-04, HS-SCR-PCA-01 |
| FR-SENET-55 | Console App on Smart TV | HS-T39 | → HS-SCR-TVA-03 |
| FR-SENET-56 | Console session pause/resume | HS-T05 | → HS-SCR-CSH-03, HS-SCR-TVA-04 |
| FR-SENET-57 | Console self-login (QR/receipt/app) | HS-T13 | → HS-SCR-TVA-03 |
| FR-SENET-58 | Session-ending notifications | HS-T21 | → HS-SCR-TVA-05 |
| FR-SENET-59 | Console monitoring & alerts | HS-T24 | → HS-SCR-CSH-01, HS-SCR-ADM-03 |
| FR-SENET-60 | Per-console reports | HS-T18 | → HS-SCR-ADM-08 |
| FR-SENET-61 | Legacy SENET Controller box | HS-T23 | → HS-SCR-ADP-01 |
| FR-SENET-62 | VR stations | HS-T03 | → HS-SCR-ADM-02 |
| FR-SENET-63 | Secured remote access | HS-T27 | → HS-SCR-ADM-11 |
| FR-SENET-64 | Data migration service | HS-T41 | → HS-SCR-ADM-16 |
| FR-SENET-65 | Managed service | HS-T45 | no UI — managed service (business, not UI) |
| FR-SENET-66 | Media Network ads | HS-T44 | → HS-SCR-ADM-19 |
| FR-SENET-67 | SSO (Enterprise) | HS-T42 | → HS-SCR-ADM-09, HS-SCR-ADM-22 |
| FR-SENET-68 | EU data hosting | HS-T30 | no UI — EU hosting (platform) |
| FR-SENET-69 | Tournaments module | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| FR-SENET-70 | Kiosk / self-service terminal | HS-T40 | → HS-SCR-KSK-01 |
| FR-SENET-71 | Smart plug / HDMI-CEC / TV power control | HS-T23 | → HS-SCR-ADP-01 |
| FR-SENET-72 | Console portal | HS-T13 | → HS-SCR-ADM-02 |
| FR-SENET-73 | TV app activation by install code | HS-T19 | → HS-SCR-ADM-11, HS-SCR-TVA-01 |
| FR-SENET-74 | Console add-on per device | HS-T33 | → HS-SCR-ADM-02 |
| FR-SENET-75 | Staff notifications/warnings to console TV | HS-T22 | → HS-SCR-ADM-19, HS-SCR-TVA-09 |
| FR-SENET-76 | Smart TV login-screen image | HS-T22 | → HS-SCR-ADM-13, HS-SCR-TVA-03 |
| FR-SENET-77 | Console session survives TV/console restart | HS-T20 | → HS-SCR-TVA-07 |
| FR-SENET-78 | TV app overlay lock | HS-T21 | → HS-SCR-TVA-03 |
| FR-SENET-79 | HDMI-CEC must be disabled | HS-T23 | → HS-SCR-ADM-03, HS-SCR-ADP-01 |
| FR-SENET-80 | Controller box Wi-Fi provisioning | HS-T23 | → HS-SCR-ADP-01 |
| FR-SENET-81 | Controller video limits | HS-T23 | → HS-SCR-ADP-01 |
| FR-SENET-82 | Session transfer between PCs | HS-T05 | → HS-SCR-CSH-03, HS-SCR-CSH-15 |
| FR-SENET-83 | Access code (receipt) sessions | HS-T13 | → HS-SCR-CSH-02, HS-SCR-KSK-05 |
| FR-SENET-84 | Extend postpaid / remove time limits | HS-T05 | → HS-SCR-CSH-03 |
| FR-SENET-85 | Unlimited session (billing off) | HS-T27 | → HS-SCR-CSH-02 |
| FR-SENET-86 | One-time minimum payment | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-20 |
| FR-SENET-87 | Per-minute billing with configurable rounding | HS-T04 | → HS-SCR-ADM-04, HS-SCR-ADM-20 |
| FR-SENET-88 | Time-period rates | HS-T04 | → HS-SCR-ADM-04 |
| FR-SENET-89 | Zone levels for passes | HS-T10 | → HS-SCR-ADM-04, HS-SCR-ADM-20 |
| FR-SENET-90 | Group discount by user type | HS-T11 | → HS-SCR-ADM-04, HS-SCR-ADM-20 |
| FR-SENET-91 | Loyalty cashback | HS-T11 | → HS-SCR-ADM-05 |
| FR-SENET-92 | Bonus codes | HS-T09 | → HS-SCR-CSH-06, HS-SCR-ADM-05 |
| FR-SENET-93 | Discount promo codes with max uses | HS-T11 | → HS-SCR-ADM-05 |
| FR-SENET-94 | Top-up bonus tiers | HS-T09 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-KSK-02 |
| FR-SENET-95 | Cash register shifts with opening float | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-14 |
| FR-SENET-96 | X-report / Z-report | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-CSH-14, HS-SCR-ADM-08 |
| FR-SENET-97 | Receipt refund (permissioned) | HS-T06 | → HS-SCR-CSH-09 |
| FR-SENET-98 | Receipt printing/templates | HS-T08 | → HS-SCR-CSH-05, HS-SCR-CSH-13, HS-SCR-ADM-13 |
| FR-SENET-99 | Kitchen/bar order printing | HS-T14 | → HS-SCR-ADM-13, HS-SCR-KDS-01 |
| FR-SENET-100 | Order board with statuses | HS-T14 | → HS-SCR-CUS-05, HS-SCR-KDS-01 |
| FR-SENET-101 | Inventory log, write-off, barcode | HS-T15 | → HS-SCR-ADM-07 |
| FR-SENET-102 | User ban | HS-T11 | → HS-SCR-ADM-05 |
| FR-SENET-103 | No balance transfer between accounts | HS-T09 | → HS-SCR-CSH-06 |
| FR-SENET-104 | Configurable registration fields | HS-T11 | → HS-SCR-ADM-05 |
| FR-SENET-105 | Booking settings: buffer, check-in window, pre-lock, min/max length, schedule | HS-T12 | → HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-02 |
| FR-SENET-106 | Booking cancellation with deposit refund | HS-T12 | → HS-SCR-CSH-12, HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-03 |
| FR-SENET-107 | Booking on busy devices with free-time estimate | HS-T12 | → HS-SCR-CSH-07, HS-SCR-ADM-06, HS-SCR-CUS-02 |
| FR-SENET-108 | Login screen shows upcoming booking | HS-T27 | → HS-SCR-TVA-03, HS-SCR-PCA-01 |
| FR-SENET-109 | Action log | HS-T30 | → HS-SCR-ADM-14 |
| FR-SENET-110 | Public API | HS-T42 | → HS-SCR-ADM-16, HS-SCR-ADM-24 |
| FR-SENET-111 | PC Wake-on-LAN / auto shutdown / auto restart | HS-T27 | → HS-SCR-PCA-04 |
| FR-SENET-112 | Remote access with consent prompt | HS-T27 | → HS-SCR-PCA-04 |
| FR-SENET-113 | Map interior elements & mobile map | HS-T03 | → HS-SCR-CSH-01, HS-SCR-ADM-02 |
| FR-SENET-114 | Shell surveys | HS-T44 | → HS-SCR-ADM-19 |
| FR-SENET-115 | Auto logout from launchers/browsers | HS-T27 | → HS-SCR-PCA-02 |
| FR-SENET-116 | Content display schedule & age limits | HS-T28 | → HS-SCR-ADM-02, HS-SCR-PCA-02 |
| FR-SENET-117 | Cloud game saves (offline games) | HS-T29 | → HS-SCR-PCA-02 |
| FR-SENET-118 | Printing for customers | HS-T27 | → HS-SCR-PCA-03 |
| FR-SENET-119 | SSO for staff/students | HS-T42 | → HS-SCR-ADM-09 |
| FR-SENET-120 | Scheduled resets & top-up presets | HS-T09 | → HS-SCR-ADM-05, HS-SCR-KSK-02 |
| FR-SENET-121 | Time zone drives rates/passes | HS-T04 | → HS-SCR-ADM-04, HS-SCR-ADM-20 |
| FR-SENET-122 | Venue working hours vs sessions | HS-T12 | → HS-SCR-CSH-14, HS-SCR-ADM-04 |
| FR-SENET-123 | Senet ID web portal | HS-T13 | → HS-SCR-CUS-01 |
| FR-SENET-124 | Senet ID loyalty widget | HS-T11 | → HS-SCR-CUS-07 |
| FR-SENET-125 | Interface languages | HS-T44 | → HS-SCR-ADM-13 |
| FR-SENET-126 | Multi-receipt bulk login | HS-T13 | → HS-SCR-CSH-02 |
| FR-SENET-127 | Session history per PC | HS-T18 | → HS-SCR-ADM-08 |
| FR-SENET-128 | Dashboard widgets | HS-T18 | → HS-SCR-ADM-01 |
| FR-SENET-129 | Reports to Excel | HS-T18 | → HS-SCR-ADM-08 |

Totals: {'ui': 126, 'noui': 3} of 129

### Market matrix F001–F284

| Req id | Feature | Ticket | UI screens |
|---|---|---|---|
| F001 | Tenant isolation | HS-T02 | no UI — backend: tenant isolation |
| F002 | Outlet setup | HS-T03 | → HS-SCR-ADM-02 |
| F003 | Outlet timezone and business-day cutoff | HS-T03 | → HS-SCR-CSH-14, HS-SCR-ADM-02, HS-SCR-ADM-13 |
| F004 | Zone and floor layout | HS-T03 | → HS-SCR-ADM-02 |
| F005 | Station type PS4 PS5 Xbox Switch PC VR | HS-T03 | → HS-SCR-ADM-02 |
| F006 | Station categories and tariffs | HS-T04 | → HS-SCR-ADM-02 |
| F007 | Station online offline heartbeat | HS-T03 | → HS-SCR-CSH-01 |
| F008 | Available occupied paused expired status | HS-T03 | → HS-SCR-CSH-01 |
| F009 | Maintenance unavailable status | HS-T03 | → HS-SCR-CSH-01 |
| F010 | Station photo and label | HS-T03 | → HS-SCR-ADM-02 |
| F011 | Station search and filters | HS-T03 | → HS-SCR-CSH-01 |
| F012 | Multi-console assignment per table | HS-T03 | → HS-SCR-CSH-02, HS-SCR-ADM-02 |
| F013 | Separate TV console controller asset records | HS-T03 | → HS-SCR-ADM-02 |
| F014 | Agent capability and firmware inventory | HS-T19 | → HS-SCR-ADM-02, HS-SCR-ADM-03 |
| F015 | Open-ended count-up sessions | HS-T05 | → HS-SCR-CSH-02 |
| F016 | Fixed-duration countdown sessions | HS-T05 | → HS-SCR-CSH-02 |
| F017 | Prepaid sessions | HS-T05 | → HS-SCR-CSH-02, HS-SCR-KSK-03 |
| F018 | Postpaid sessions | HS-T05 | → HS-SCR-CSH-02 |
| F019 | Per-minute billing | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-20 |
| F020 | Per-hour billing | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-20 |
| F021 | Configurable minimum charge | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-20 |
| F022 | Configurable billing rounding | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-20 |
| F023 | Category-specific prices | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-04, HS-SCR-ADM-20 |
| F024 | Pause and resume | HS-T05 | → HS-SCR-CSH-03 |
| F025 | Extend active session | HS-T05 | → HS-SCR-CSH-03 |
| F026 | Transfer active session to another station | HS-T05 | → HS-SCR-CSH-03, HS-SCR-CSH-15 |
| F027 | Preserve F&B on session transfer | HS-T05 | → HS-SCR-CSH-03, HS-SCR-CSH-15 |
| F028 | Warning before time expires | HS-T21 | → HS-SCR-TVA-05 |
| F029 | Automatic expiry lock | HS-T05 | → HS-SCR-TVA-06 |
| F030 | Grace period policy | HS-T05 | → HS-SCR-ADM-04, HS-SCR-ADM-20, HS-SCR-TVA-06 |
| F031 | Cashier manual end session | HS-T05 | → HS-SCR-CSH-03 |
| F032 | Customer early end request | HS-T05 | → HS-SCR-CUS-06 |
| F033 | Saved unused time credit | HS-T10 | → HS-SCR-CSH-06 |
| F034 | Separate time balances by station category | HS-T10 | → HS-SCR-CSH-06 |
| F035 | Time-credit expiry rules | HS-T10 | → HS-SCR-CSH-06 |
| F036 | Session recovery after agent reboot | HS-T20 | → HS-SCR-TVA-07 |
| F037 | Prevent simultaneous sessions on one station | HS-T05 | → HS-SCR-CSH-02 |
| F038 | Rate snapshot on session start | HS-T04 | → HS-SCR-CSH-02, HS-SCR-ADM-20 |
| F039 | Happy hour schedules | HS-T04 | → HS-SCR-ADM-04 |
| F040 | Overnight packages crossing midnight | HS-T04 | → HS-SCR-ADM-04 |
| F041 | Weekend holiday tariffs | HS-T04 | → HS-SCR-ADM-04 |
| F042 | Extra-controller rental charges | HS-T06 | → HS-SCR-CSH-02, HS-SCR-ADM-04 |
| F043 | Group multi-station bill | HS-T06 | → HS-SCR-CSH-05 |
| F044 | Complimentary staff-approved session | HS-T06 | → HS-SCR-CSH-02 |
| F045 | Manual adjustment reason and audit | HS-T06 | → HS-SCR-CSH-03 |
| F046 | Session start waits for device acknowledgement | HS-T05 | → HS-SCR-CSH-02, HS-SCR-CSH-15, HS-SCR-KSK-04 |
| F047 | Refund or credit when device activation fails | HS-T07 | → HS-SCR-CSH-02, HS-SCR-KSK-04 |
| F048 | Cash payment and change | HS-T06 | → HS-SCR-CSH-05 |
| F049 | Bank-transfer recording | HS-T06 | → HS-SCR-CSH-05 |
| F050 | QRIS payment recording | HS-T07 | → HS-SCR-CSH-05, HS-SCR-CFD-01, HS-SCR-KSK-04 |
| F051 | Dynamic QRIS verified webhook | HS-T07 | → HS-SCR-CSH-05, HS-SCR-CFD-01, HS-SCR-KSK-04 |
| F052 | E-wallet payments | HS-T07 | → HS-SCR-CSH-05 |
| F053 | Prepaid rupiah wallet | HS-T09 | → HS-SCR-CSH-06, HS-SCR-CUS-07 |
| F054 | Wallet top-up | HS-T09 | → HS-SCR-CSH-06, HS-SCR-KSK-02 |
| F055 | Wallet spend and refund ledger | HS-T09 | → HS-SCR-CSH-06 |
| F056 | Partial deposit payment | HS-T06 | → HS-SCR-CSH-05 |
| F057 | Split payment methods | HS-T06 | → HS-SCR-CSH-05 |
| F058 | Partial refund | HS-T06 | → HS-SCR-CSH-09 |
| F059 | Full refund with approval | HS-T06 | → HS-SCR-CSH-09 |
| F060 | Payment expiry and late settlement | HS-T07 | → HS-SCR-CSH-05, HS-SCR-KSK-04 |
| F061 | Webhook signature verification | HS-T07 | → HS-SCR-ADM-24 |
| F062 | Webhook deduplication | HS-T07 | → HS-SCR-ADM-24 |
| F063 | Settlement reconciliation | HS-T07 | → HS-SCR-CSH-14, HS-SCR-ADM-08 |
| F064 | Never accept screenshot as payment proof | HS-T07 | → HS-SCR-CSH-05 |
| F065 | Append-only financial entries | HS-T06 | no UI — backend: append-only ledger (surfaced read-only in ADM-14 audit) |
| F066 | Wallet double-spend prevention | HS-T09 | → HS-SCR-CSH-06 |
| F067 | No silent negative wallet balance | HS-T09 | → HS-SCR-CSH-06 |
| F068 | Offline cash sale | HS-T20 | → HS-SCR-CSH-05, HS-SCR-CSH-11 |
| F069 | Offline digital-payment pending state | HS-T20 | → HS-SCR-CSH-05, HS-SCR-CSH-11 |
| F070 | Payment provider outage fallback | HS-T07 | → HS-SCR-CSH-05 |
| F071 | Public venue profile | HS-T13 | → HS-SCR-ADM-13, HS-SCR-CUS-01 |
| F072 | Game catalogue per venue | HS-T03 | → HS-SCR-ADM-02, HS-SCR-CUS-01 |
| F073 | Live station availability | HS-T12 | → HS-SCR-ADM-01, HS-SCR-CUS-01, HS-SCR-LBY-01, HS-SCR-KSK-03 |
| F074 | Reserve specific station | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 |
| F075 | Reserve whole room | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 |
| F076 | Multi-station group booking | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 |
| F077 | Booking slot conflict prevention | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 |
| F078 | Temporary checkout hold expiry | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 |
| F079 | Booking deposit | HS-T12 | → HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-03 |
| F080 | Cancellation policy | HS-T12 | → HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-03 |
| F081 | No-show policy | HS-T12 | → HS-SCR-CSH-12, HS-SCR-ADM-06, HS-SCR-ADM-21, HS-SCR-CUS-03 |
| F082 | Booking-specific blacklist preserving walk-ins | HS-T12 | → HS-SCR-CSH-07, HS-SCR-CSH-12, HS-SCR-ADM-06, HS-SCR-ADM-21 |
| F083 | Waitlist and queue | HS-T12 | → HS-SCR-CSH-07, HS-SCR-LBY-02, HS-SCR-KSK-03 |
| F084 | Customer check-in | HS-T12 | → HS-SCR-CSH-07 |
| F085 | Late-arrival release | HS-T12 | → HS-SCR-CSH-07, HS-SCR-CSH-12, HS-SCR-ADM-21 |
| F086 | Reschedule booking | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-03 |
| F087 | Guest booking without account | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-02 |
| F088 | Booking confirmation notification | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-03 |
| F089 | Booking reminder notification | HS-T12 | → HS-SCR-ADM-06, HS-SCR-CUS-03 |
| F090 | Customer booking history | HS-T12 | → HS-SCR-CUS-03, HS-SCR-CUS-07 |
| F091 | Unit QR self-service session start | HS-T13 | → HS-SCR-CUS-06, HS-SCR-KSK-03 |
| F092 | Customer live remaining-time view | HS-T13 | → HS-SCR-CUS-06 |
| F093 | Customer request extension | HS-T13 | → HS-SCR-CUS-06 |
| F094 | Customer call operator | HS-T25 | → HS-SCR-CSH-10, HS-SCR-CUS-06 |
| F095 | Customer cashier chat | HS-T25 | → HS-SCR-CSH-10, HS-SCR-CUS-06 |
| F096 | Product categories | HS-T15 | → HS-SCR-ADM-07 |
| F097 | Product cost and selling price | HS-T15 | → HS-SCR-ADM-07 |
| F098 | Product photo | HS-T15 | → HS-SCR-ADM-07 |
| F099 | SKU barcode scanning | HS-T15 | → HS-SCR-ADM-07 |
| F100 | Product variants and toppings | HS-T15 | → HS-SCR-ADM-07 |
| F101 | Stock on hand | HS-T15 | → HS-SCR-ADM-07 |
| F102 | Low-stock alerts | HS-T15 | → HS-SCR-ADM-07 |
| F103 | Stock movement history | HS-T15 | → HS-SCR-ADM-07 |
| F104 | Supplier records | HS-T16 | → HS-SCR-ADM-07 |
| F105 | Purchase orders | HS-T16 | → HS-SCR-ADM-07 |
| F106 | Goods receiving | HS-T16 | → HS-SCR-ADM-07 |
| F107 | Stocktake | HS-T15 | → HS-SCR-ADM-07 |
| F108 | FIFO or moving-average costing | HS-T15 | → HS-SCR-ADM-07 |
| F109 | Recipe ingredient deduction | HS-T15 | → HS-SCR-ADM-07 |
| F110 | Wastage and spoilage log | HS-T15 | → HS-SCR-ADM-07 |
| F111 | Branch stock transfers | HS-T16 | → HS-SCR-ADM-07, HS-SCR-ADM-18 |
| F112 | QR table menu | HS-T14 | → HS-SCR-CUS-04 |
| F113 | Customer F&B ordering | HS-T14 | → HS-SCR-CUS-04 |
| F114 | Attach F&B to active session | HS-T14 | → HS-SCR-CSH-04 |
| F115 | Combined rental and food bill | HS-T14 | → HS-SCR-CSH-04 |
| F116 | Kitchen order display | HS-T14 | → HS-SCR-KDS-01 |
| F117 | Order status accepted preparing ready delivered | HS-T14 | → HS-SCR-CUS-05, HS-SCR-KDS-01 |
| F118 | Kitchen order rejection and refund | HS-T14 | → HS-SCR-CUS-05, HS-SCR-KDS-01, HS-SCR-KDS-02 |
| F119 | Kitchen receipt routing | HS-T08 | → HS-SCR-KDS-01 |
| F120 | Out-of-stock menu suppression | HS-T14 | → HS-SCR-CSH-04, HS-SCR-CUS-04, HS-SCR-KDS-02 |
| F121 | Customer order notes and allergies | HS-T14 | → HS-SCR-CUS-04 |
| F122 | Member registration | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F123 | Member tier pricing | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05 |
| F124 | Loyalty point earning | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F125 | Loyalty reward redemption | HS-T11 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F126 | Voucher fixed discount | HS-T11 | → HS-SCR-ADM-05 |
| F127 | Voucher percentage discount | HS-T11 | → HS-SCR-ADM-05 |
| F128 | Voucher free time | HS-T11 | → HS-SCR-ADM-05 |
| F129 | Voucher redemption limits | HS-T11 | → HS-SCR-ADM-05 |
| F130 | Top-up bonus | HS-T09 | → HS-SCR-CSH-06, HS-SCR-ADM-05, HS-SCR-KSK-02 |
| F131 | Membership subscriptions | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F132 | Member game history | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F133 | Member spending history | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F134 | Member leaderboard | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-09, HS-SCR-LBY-03 |
| F135 | TV member rank greeting | HS-T11 | → HS-SCR-ADM-05, HS-SCR-TVA-09 |
| F136 | Marketing consent and opt-out | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F137 | Lapsed-customer reminders | HS-T11 | → HS-SCR-ADM-05, HS-SCR-ADM-19 |
| F138 | Referral programme | HS-T11 | → HS-SCR-ADM-05 |
| F139 | Birthday reward | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F140 | Family or guardian account | HS-T11 | → HS-SCR-ADM-05, HS-SCR-CUS-07 |
| F141 | Tournament registration | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09 |
| F142 | Tournament entry fees | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09 |
| F143 | Single elimination bracket | HS-T32 | → HS-SCR-ADM-10 |
| F144 | Double elimination bracket | HS-T32 | → HS-SCR-ADM-10 |
| F145 | Round robin league | HS-T32 | → HS-SCR-ADM-10 |
| F146 | Score-based competition | HS-T32 | → HS-SCR-ADM-10 |
| F147 | Match scheduling to physical stations | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| F148 | Player check-in and no-shows | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| F149 | Seeding and byes | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| F150 | Result entry and dispute review | HS-T32 | → HS-SCR-ADM-10 |
| F151 | Prize accounting | HS-T32 | → HS-SCR-ADM-10 |
| F152 | Public bracket and leaderboard | HS-T32 | → HS-SCR-ADM-10, HS-SCR-CUS-09, HS-SCR-LBY-03 |
| F153 | Spectator display | HS-T32 | → HS-SCR-ADM-10, HS-SCR-LBY-03 |
| F154 | Event station block booking | HS-T32 | → HS-SCR-ADM-10, HS-SCR-ADM-25 |
| F155 | Community recurring leagues | HS-T32 | → HS-SCR-ADM-10 |
| F156 | Role-based permissions | HS-T02 | → HS-SCR-ADM-09 |
| F157 | Branch-scoped staff access | HS-T02 | → HS-SCR-ADM-09, HS-SCR-ADM-18 |
| F158 | Manager approval for voids refunds free time | HS-T06 | → HS-SCR-CSH-09, HS-SCR-ADM-09, HS-SCR-OWN-02 |
| F159 | Cash drawer opening float | HS-T17 | → HS-SCR-CSH-08 |
| F160 | Shift close and cash variance | HS-T17 | → HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-CSH-14, HS-SCR-OWN-02 |
| F161 | Staff handover notes | HS-T17 | → HS-SCR-CSH-08 |
| F162 | Cash expenses | HS-T17 | → HS-SCR-CSH-08 |
| F163 | Staff activity audit | HS-T30 | → HS-SCR-ADM-09, HS-SCR-ADM-14 |
| F164 | Clock-in attendance | HS-T35 | → HS-SCR-ADM-09 |
| F165 | Geofenced attendance optional | HS-T35 | → HS-SCR-ADM-09 |
| F166 | Payroll export | HS-T35 | → HS-SCR-ADM-09 |
| F167 | Cashier thermal receipt | HS-T08 | → HS-SCR-CSH-05, HS-SCR-CSH-13 |
| F168 | PDF receipt | HS-T08 | → HS-SCR-CSH-05, HS-SCR-CUS-08, HS-SCR-KSK-05 |
| F169 | Bluetooth printer support | HS-T08 | → HS-SCR-ADM-13 |
| F170 | LAN printer support | HS-T08 | → HS-SCR-ADM-13 |
| F171 | Printer offline queue | HS-T08 | → HS-SCR-ADM-13 |
| F172 | Revenue per station report | HS-T18 | → HS-SCR-ADM-01, HS-SCR-ADM-08 |
| F173 | Utilization and idle-time report | HS-T18 | → HS-SCR-ADM-01, HS-SCR-ADM-08 |
| F174 | Peak-hour report | HS-T18 | → HS-SCR-ADM-01, HS-SCR-ADM-08 |
| F175 | Payment-method report | HS-T18 | → HS-SCR-CSH-13, HS-SCR-ADM-08 |
| F176 | F&B gross margin report | HS-T18 | → HS-SCR-ADM-08 |
| F177 | Branch comparison | HS-T33 | → HS-SCR-ADM-08, HS-SCR-ADM-18 |
| F178 | Inventory valuation report | HS-T18 | → HS-SCR-ADM-08 |
| F179 | Wallet liability report | HS-T18 | → HS-SCR-ADM-08 |
| F180 | Refund and void report | HS-T18 | → HS-SCR-ADM-08 |
| F181 | Excel CSV export | HS-T18 | → HS-SCR-ADM-08 |
| F182 | Accounting export | HS-T36 | → HS-SCR-ADM-08 |
| F183 | Tax and service charge settings | HS-T36 | → HS-SCR-CSH-14, HS-SCR-ADM-13 |
| F184 | Android TV pairing code | HS-T19 | → HS-SCR-ADM-11, HS-SCR-TVA-01 |
| F185 | Pairing approval and short code expiry | HS-T19 | → HS-SCR-ADM-11, HS-SCR-TVA-01 |
| F186 | Signed device identity and revocation | HS-T19 | → HS-SCR-ADM-11 |
| F187 | Foreground standby lock screen | HS-T21 | → HS-SCR-TVA-03 |
| F188 | Admin PIN exit with rate limit | HS-T21 | → HS-SCR-TVA-08 |
| F189 | HDMI input switching capability probe | HS-T19 | → HS-SCR-ADM-03, HS-SCR-TVA-02 |
| F190 | Active-session return-to-HDMI guard | HS-T21 | → HS-SCR-ADM-03, HS-SCR-TVA-02, HS-SCR-TVA-04 |
| F191 | Overlay permission setup diagnostics | HS-T19 | → HS-SCR-ADM-03, HS-SCR-TVA-02 |
| F192 | Device-owner kiosk supported-model path | HS-T21 | → HS-SCR-TVA-02 |
| F193 | Boot recovery and watchdog | HS-T21 | → HS-SCR-TVA-07, HS-SCR-TVA-10 |
| F194 | Local monotonic expiry timer | HS-T21 | → HS-SCR-TVA-07 |
| F195 | Offline active-session enforcement | HS-T21 | → HS-SCR-TVA-07 |
| F196 | Signed session lease and expiry | HS-T20 | → HS-SCR-TVA-07 |
| F197 | Tamper and clock rollback detection | HS-T20 | → HS-SCR-TVA-07 |
| F198 | Agent heartbeat and last-command ACK | HS-T20 | → HS-SCR-ADM-03 |
| F199 | TV volume and mute control | HS-T22 | → HS-SCR-CSH-03 |
| F200 | CEC TV power adapter | HS-T23 | → HS-SCR-ADP-01 |
| F201 | IR TV power adapter | HS-T23 | → HS-SCR-ADP-01 |
| F202 | HDMI switch blank-source fallback | HS-T23 | → HS-SCR-ADP-01, HS-SCR-ADP-02 |
| F203 | TV-only smart plug fallback | HS-T23 | → HS-SCR-ADP-01 |
| F204 | Certified 4K120 HDR VRR HDMI path | HS-T23 | → HS-SCR-ADM-12 |
| F205 | Physical remote and input bypass test | HS-T21 | → HS-SCR-ADM-03, HS-SCR-TVA-02 |
| F206 | Agent version rollout and rollback | HS-T21 | → HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-TVA-10 |
| F207 | Screen lock does not cut console power | HS-T21 | → HS-SCR-ADP-01 |
| F208 | Manual operator fallback | HS-T21 | → HS-SCR-CSH-01, HS-SCR-TVA-08 |
| F209 | Windows seat lock agent | HS-T27 | → HS-SCR-PCA-01 |
| F210 | Windows member game launcher | HS-T27 | → HS-SCR-PCA-02 |
| F211 | Windows remaining-time HUD | HS-T27 | → HS-SCR-PCA-02 |
| F212 | Windows customer food ordering | HS-T27 | → HS-SCR-PCA-03 |
| F213 | Windows cashier chat | HS-T27 | → HS-SCR-PCA-03 |
| F214 | Windows remote restart and shutdown | HS-T27 | → HS-SCR-PCA-04 |
| F215 | Windows reboot session recovery | HS-T27 | → HS-SCR-PCA-04 |
| F216 | Windows game update orchestration | HS-T29 | → HS-SCR-PCA-02 |
| F217 | Licensed game-account pool integration | HS-T28 | → HS-SCR-PCA-02 |
| F218 | Game launch concurrency limits | HS-T28 | → HS-SCR-PCA-02 |
| F219 | Per-session user-data cleanup | HS-T27 | → HS-SCR-PCA-02 |
| F220 | Windows Wake-on-LAN | HS-T27 | → HS-SCR-PCA-04 |
| F221 | Diskless boot integration not reimplementation | HS-T29 | no UI — explicitly not reimplemented (diskless boot) |
| F222 | Android rental-phone allowed-game launcher | HS-T38 | → HS-SCR-MAG-01 |
| F223 | Android rental-phone kiosk expiry lock | HS-T38 | → HS-SCR-MAG-02 |
| F224 | webOS foreground app prototype | HS-T39 | → HS-SCR-ADP-01 |
| F225 | webOS supported HDMI control feasibility gate | HS-T39 | → HS-SCR-ADP-01 |
| F226 | Tizen foreground HDMI PiP prototype | HS-T39 | → HS-SCR-ADP-01 |
| F227 | Commercial signage kiosk integration | HS-T26 | → HS-SCR-KSK-05 |
| F228 | Raspberry Pi edge controller | HS-T20 | → HS-SCR-ADP-01, HS-SCR-GWY-01 |
| F229 | Customer installable PWA | HS-T13 | → HS-SCR-CUS-01 |
| F230 | Owner mobile dashboard | HS-T18 | → HS-SCR-OWN-01 |
| F231 | Self-service kiosk | HS-T40 | → HS-SCR-KSK-01 |
| F232 | Lobby station availability billboard | HS-T26 | → HS-SCR-LBY-01 |
| F233 | Local venue session authority | HS-T20 | → HS-SCR-GWY-02 |
| F234 | Durable offline command queue | HS-T20 | → HS-SCR-CSH-11, HS-SCR-GWY-02 |
| F235 | Reconnect event reconciliation | HS-T20 | → HS-SCR-CSH-11, HS-SCR-GWY-02 |
| F236 | Duplicate command idempotency | HS-T20 | → HS-SCR-CSH-11 |
| F237 | Stale command and replay rejection | HS-T20 | no UI — backend: replay rejection |
| F238 | Sequence-numbered station state | HS-T20 | no UI — backend: sequence numbers |
| F239 | Mutual authentication for device transport | HS-T30 | no UI — backend: mTLS |
| F240 | Outbound-only edge connectivity | HS-T30 | → HS-SCR-GWY-01 |
| F241 | Device network segmentation | HS-T30 | no UI — network segmentation (install guide) |
| F242 | Least-privilege hardware adapters | HS-T30 | → HS-SCR-ADP-01 |
| F243 | Encrypted secrets at rest | HS-T30 | no UI — backend: secrets at rest |
| F244 | No payment or account secrets in client logs | HS-T30 | no UI — backend: no secrets in clients |
| F245 | Staff MFA | HS-T30 | → HS-SCR-ADM-09, HS-SCR-ADM-22, HS-SCR-ADM-23 |
| F246 | Owner recovery procedure | HS-T30 | → HS-SCR-ADM-14, HS-SCR-ADM-23 |
| F247 | Encrypted backups | HS-T30 | → HS-SCR-ADM-14 |
| F248 | Restore drill | HS-T41 | → HS-SCR-ADM-14 |
| F249 | Consent-aware customer data retention | HS-T30 | → HS-SCR-ADM-13 |
| F250 | Customer data export and erasure | HS-T30 | → HS-SCR-ADM-13, HS-SCR-CUS-07 |
| F251 | Sensitive ID upload disabled by default | HS-T30 | → HS-SCR-ADM-13 |
| F252 | No persistent customer location tracking by default | HS-T30 | no UI — policy: no location tracking (absence of UI is the requirement) |
| F253 | Remote assistance explicit approval | HS-T30 | → HS-SCR-PCA-04 |
| F254 | Signed agent updates | HS-T24 | → HS-SCR-ADM-11 |
| F255 | Audit trail export | HS-T30 | → HS-SCR-ADM-14 |
| F256 | Emergency local override with audit | HS-T30 | → HS-SCR-ADM-14, HS-SCR-TVA-08 |
| F257 | Power outage recovery | HS-T20 | → HS-SCR-GWY-02 |
| F258 | Conflict-safe offline wallet policy | HS-T09 | → HS-SCR-CSH-06 |
| F259 | Cross-branch wallet consistency | HS-T09 | → HS-SCR-ADM-18 |
| F260 | Take-home console rental | HS-T34 | → HS-SCR-ADM-17 |
| F261 | Rental security deposit | HS-T34 | → HS-SCR-ADM-17 |
| F262 | Condition photos at checkout and return | HS-T34 | → HS-SCR-ADM-17 |
| F263 | Serial-number asset tracking | HS-T34 | → HS-SCR-ADM-17 |
| F264 | Accessory issue return checklist | HS-T34 | → HS-SCR-ADM-17 |
| F265 | Damage fee dispute workflow | HS-T34 | → HS-SCR-ADM-17 |
| F266 | Delivery scheduling | HS-T34 | → HS-SCR-ADM-17 |
| F267 | Delivery distance fee | HS-T34 | → HS-SCR-ADM-17 |
| F268 | Rental overdue reminders | HS-T34 | → HS-SCR-ADM-17 |
| F269 | Multi-branch stock and asset transfer | HS-T16 | → HS-SCR-ADM-18 |
| F270 | Franchise consolidated reporting | HS-T33 | → HS-SCR-ADM-18 |
| F271 | Open API | HS-T42 | → HS-SCR-ADM-16, HS-SCR-ADM-24 |
| F272 | Webhook integrations | HS-T42 | → HS-SCR-ADM-16, HS-SCR-ADM-24 |
| F273 | Migration import preview and rollback | HS-T41 | → HS-SCR-ADM-16 |
| F274 | Operator training sandbox | HS-T45 | → HS-SCR-ADM-16 |
| F275 | Indonesian English localization | HS-T44 | → HS-SCR-ADM-13 |
| F276 | Accessible keyboard and TV D-pad navigation | HS-T44 | → HS-SCR-ADM-13 |
| F277 | Reduced motion support | HS-T44 | → HS-SCR-ADM-13 |
| F278 | Permission-sensitive lobby privacy | HS-T26 | → HS-SCR-ADM-13, HS-SCR-LBY-01 |
| F279 | Hardware compatibility certification catalogue | HS-T31 | → HS-SCR-ADM-12 |
| F280 | Agent simulator and fault-injection harness | HS-T45 | → HS-SCR-ADM-16 |
| F281 | Health alerts for controller batteries | HS-T24 | → HS-SCR-ADM-03 |
| F282 | Energy consumption reporting | HS-T18 | → HS-SCR-ADM-18 |
| F283 | Maintenance service tickets | HS-T03 | → HS-SCR-ADM-17 |
| F284 | Public status and incident notifications | HS-T25 | → HS-SCR-ADM-16 |

Totals: {'noui': 10, 'ui': 274} of 284

## Gap summary

Requirements with UI but no screen: **0**.
