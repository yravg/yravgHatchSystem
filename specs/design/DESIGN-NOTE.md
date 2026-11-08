> MERGE NOTE v0.2 (normative): owner accepted Design v0.2 layout; UI design hold removed. Brand colours remain provisional pending logo, not a delivery blocker. This stable archive has82screens,58wireframed screens (59rendered frames) and58components; some original file-list captions still say46frames and are superseded by this count and RENDER-CHECK. Nine backend-first tickets46..54 were added after Design Desk mapped the original45; they have no final product screens. All original45 rd files list exact screen/component required reading. Money/security/domain contracts override illustrative design policy: no fake auto-refund, CEC optional/off at TV+console, managed provisioning required for kiosk claims, eight-digit5minute fixture vs visual six-character sample is D32. Design states are visual projections, not replacements for domain/device/financial states.

# DESIGN-NOTE v0.2 — handoff to Grok Bot's merge

Design Desk · v0.2, 8 Nov 2026 22:30 (Asia/Shanghai). v0.1 is kept on Drive as history. Box path: `/workspace/design/hatchsystem/`.


## What changed in v0.2
- **New screens (10):**
  - CSH-12 no-show, CSH-13 X report, CSH-14 Z report (both with a 58 mm print preview), CSH-15 console/seat move.
  - ADM-20 billing rules (rounding, minimum charge, zone × tier, with a simulator), ADM-21 booking deposit and no-show policy, ADM-22 2FA enrol, ADM-23 2FA sign-in, ADM-24 webhooks, ADM-25 tournament registration and check-in.
- **New frames (13):** the 10 screens above, plus CUS-09 tournament (customer), TVA-02b permission recovery and TVA-10 boot recovery.
- **Changed frames:**
  - TVA-01: visible PIN countdown bar, version and agent-ID footer, "locked until paired" rule.
  - TVA-02: added the CEC-off step.
  - CSH-05: QRIS is now the first tab.
  - index.html: new differentiators section.
- **New components:** HS-CMP-046 to 058.
- **DESIGN.md:** §10 TV lock rules per state, §11 how the differentiators are made visible.
- **Senet:** re-ran coverage on Grabber2's verified pack. All 129 FR-SENET ids, including the new or redefined 72–129, are covered, with 0 gaps.

## KULA TV Agent emulator findings: used (flows only, clean-room)
Source: `/workspace/grab/kulapos-rental-ps/tv-agent-emulator/INSTALL-REPORT.md` and the 1920×1080 shots with their text dumps.

| What Kula does | What we do instead |
|---|---|
| Unpaired screen shows a 4-digit PIN, valid 10 min, with a single focusable "Refresh PIN" button | 6-character code, QR, visible countdown bar, two focusable actions, initial focus on the primary one |
| HOME exits to the Android TV home screen while unpaired | Locked from setup: HOME and BACK do not leave |
| No relaunch after reboot while unpaired | Auto-relaunch on every boot |
| Draw-over permission reset after reboot | Permission re-check screen with a D-pad guide (TVA-02b) |
| Version and agent ID shown in a footer | We kept this pattern |

**Pending (needs a Kula trial or hardware):** paired-session lock, offline behaviour (Grabber's server-cut test was BLOCKED on the production emulator image), HDMI-CEC handling, account settings. TVA-04 to TVA-08 stay designed to Grok's spec until then.

## Files
- `DESIGN.md` — system SoT (principles, colour incl. light ops + dark TV, 8 session states, type, spacing, radius, elevation, focus, motion, Bahasa copy rules, a11y/TV 10-ft, offline patterns, `Rp58.000` format).
- `tokens.json` (W3C design-tokens `$value` style) · `tailwind.tokens.css` (CSS vars `--hs-*`, `--yr-*` motion, `[data-theme=tv]`, Tailwind v4 `@theme inline`).
- `SURFACES.md` — 46 wireframe frames, 13 surfaces, 82 screens (`HS-SCR-*`, design-only ids) with states and source-id traces + full coverage table.
- `COMPONENTS.md` — `HS-CMP-001…058`.
- `wireframes/` — 13 HTML files + `index.html`; `wireframes/shots/*.png` (46).
- `RENDER-CHECK.md` — headless render + visual review log.
- `tools/` — generators (`tokens.py`, `wf.py`, `data.py`, `docs.py`, `comps.py`, `shoot.py`); rerun after the logo lands.

## Id rules (per your PRD constraint)
Screens and coverage cite **only source ids**: FR-KPS-*, FR-KULA-*, FR-SENET-*, matrix F001–F284. No new requirement ids. HS-SCR / HS-CMP are design namespaces only — please map them in your crosswalk.

## Coverage, keyed by source id (ticket from Grok's ID-CROSSWALK)
| pack | total | UI → screen | normalised → generic screen | no UI | GAP |
|---|---|---|---|---|---|
| FR-KPS | 69 | 69 | 0 | 0 | 0 |
| FR-KULA ⭐ | 144 | 128 | 15 | 1 | 0 |
| FR-SENET (verified pack, all 129) | 129 | 126 | 0 | 3 | 0 |
| Matrix F | 284 | 274 | 0 | 10 | 0 |

Normalised = 15 Kula ⭐ rows from other industries (pet/barber/clinic booking, pharmacy multi-unit, workshop & craft profit, bengkel TV). Per the crosswalk they map to generic concepts, so they point at the generic screen of their ticket (e.g. booking → ADM-06/CUS-02). No-UI rows (16) are backend/policy items such as webhook signatures, mTLS, secrets at rest and the diskless boot that is not being rebuilt. Each one has its reason in SURFACES.md.

## Surface ↔ PRD §3 app alignment
| PRD app | Design surface(s) | Phase |
|---|---|---|
| Web owner/admin (Next.js) | ADM, OWN (responsive admin, not a separate app) | MVP / V1 |
| Cashier PWA (shared web app) | CSH | MVP |
| Customer PWA (booking, member/wallet/time, QR order, receipt; **iOS = this PWA in V1**) | CUS | V1 |
| Kitchen display / QR ordering | KDS + CUS-04/05 | MVP KDS, V1 public QR |
| Lobby/status/waiting-room + customer checkout display | LBY, CFD | V1 |
| Venue edge / gateway (.NET) pairing UI | GWY | MVP |
| Android/Google TV agent (Kotlin) | TVA | MVP |
| External LG/Samsung adapter | ADP | MVP |
| Native webOS/Tizen | none yet (V2 feasibility); ADP-02 lock card is the interim | V2 |
| Windows PC seat agent | PCA | V1 |
| Android mobile rental agent | MAG | V2 pilot |
| Self-service kiosk | KSK | V2 |
| Hardware simulator / operator runbook | ADM-03 (test lock / simulator), ADM-16 (sandbox) | MVP |

## Ticket → design map (board HS-T01…45; no new tickets on the board as of 22:30)
| Ticket | Title (from board) | Screens (HS-SCR) | Components | Wireframe files |
|---|---|---|---|---|
| HS-T01 | Fondasi monorepo dan kontrak domain | no screens — consumes `tokens.json` + `tailwind.tokens.css` (design foundation) | — | — |
| HS-T02 | Identitas, tenant dan otorisasi per outlet | HS-SCR-ADM-01, HS-SCR-ADM-09, HS-SCR-ADM-18, HS-SCR-ADM-22, HS-SCR-ADM-23 | HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-052, HS-CMP-053 | `wireframes/admin.html` |
| HS-T03 | Katalog stasiun, aset, zona dan denah | HS-SCR-ADM-02, HS-SCR-ADM-13, HS-SCR-ADM-17, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-14, HS-SCR-CUS-01, HS-SCR-LBY-01 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-013, HS-CMP-019, HS-CMP-022, HS-CMP-023, HS-CMP-040, HS-CMP-049, HS-CMP-050, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/lobby.html` |
| HS-T04 | Tarif versi, paket dan kutipan biaya | HS-SCR-ADM-02, HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-20, HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-KSK-03, HS-SCR-TVA-06 | HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-012, HS-CMP-013, HS-CMP-023, HS-CMP-024, HS-CMP-035, HS-CMP-039, HS-CMP-046, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/tv-agent.html` |
| HS-T05 | Sesi fixed/open, jeda, pindah dan berhenti | HS-SCR-ADM-04, HS-SCR-ADM-20, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-CSH-05, HS-SCR-CSH-11, HS-SCR-CSH-15, HS-SCR-CUS-06, HS-SCR-KSK-03, HS-SCR-KSK-04, HS-SCR-TVA-04, HS-SCR-TVA-06 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-013, HS-CMP-019, HS-CMP-020, HS-CMP-024, HS-CMP-033, HS-CMP-035, HS-CMP-039, HS-CMP-046, HS-CMP-051, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer.html`, `wireframes/kiosk.html`, `wireframes/tv-agent.html` |
| HS-T06 | POS, kas dan buku pembayaran append-only | HS-SCR-ADM-04, HS-SCR-ADM-09, HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-CSH-05, HS-SCR-CSH-09, HS-SCR-KSK-03, HS-SCR-OWN-02 | HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-013, HS-CMP-017, HS-CMP-018, HS-CMP-023, HS-CMP-024, HS-CMP-039, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/owner.html` |
| HS-T07 | QRIS Midtrans sandbox dan rekonsiliasi | HS-SCR-ADM-08, HS-SCR-ADM-16, HS-SCR-ADM-24, HS-SCR-CFD-01, HS-SCR-CSH-02, HS-SCR-CSH-05, HS-SCR-CSH-14, HS-SCR-CUS-03, HS-SCR-KSK-04 | HS-CMP-004, HS-CMP-005, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-013, HS-CMP-015, HS-CMP-021, HS-CMP-023, HS-CMP-039, HS-CMP-042, HS-CMP-049, HS-CMP-050, HS-CMP-054, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer-display.html`, `wireframes/customer.html`, `wireframes/kiosk.html` |
| HS-T08 | Struk, cetak ulang dan jembatan printer | HS-SCR-ADM-07, HS-SCR-ADM-13, HS-SCR-ADM-17, HS-SCR-CSH-05, HS-SCR-CSH-13, HS-SCR-CUS-08, HS-SCR-KDS-01, HS-SCR-KSK-05 | HS-CMP-007, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-023, HS-CMP-039, HS-CMP-041, HS-CMP-049, HS-CMP-058 | `wireframes/cashier.html`, `wireframes/kitchen.html` |
| HS-T09 | Dompet IDR, bonus dan batas belanja offline | HS-SCR-ADM-05, HS-SCR-ADM-18, HS-SCR-CSH-06, HS-SCR-CUS-07, HS-SCR-KSK-02 | HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-021, HS-CMP-023, HS-CMP-039 | `wireframes/cashier.html`, `wireframes/customer.html`, `wireframes/kiosk.html` |
| HS-T10 | Tabungan waktu, penebusan dan kedaluwarsa | HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-20, HS-SCR-CSH-03, HS-SCR-CSH-06, HS-SCR-CUS-07 | HS-CMP-003, HS-CMP-006, HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-023, HS-CMP-024, HS-CMP-046 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer.html` |
| HS-T11 | Member, reward, tingkat dan voucher | HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-08, HS-SCR-ADM-19, HS-SCR-ADM-20, HS-SCR-CSH-02, HS-SCR-CSH-05, HS-SCR-CSH-06, HS-SCR-CUS-07, HS-SCR-CUS-09, HS-SCR-LBY-03, HS-SCR-TVA-09 | HS-CMP-004, HS-CMP-005, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-021, HS-CMP-023, HS-CMP-024, HS-CMP-025, HS-CMP-038, HS-CMP-040, HS-CMP-046, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer.html` |
| HS-T12 | Reservasi, deposit, buffer dan no-show | HS-SCR-ADM-01, HS-SCR-ADM-02, HS-SCR-ADM-04, HS-SCR-ADM-06, HS-SCR-ADM-17, HS-SCR-ADM-21, HS-SCR-CSH-01, HS-SCR-CSH-07, HS-SCR-CSH-12, HS-SCR-CSH-14, HS-SCR-CUS-01, HS-SCR-CUS-02, HS-SCR-CUS-03, HS-SCR-CUS-07, HS-SCR-KSK-03, HS-SCR-LBY-01, HS-SCR-LBY-02 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-009, HS-CMP-011, HS-CMP-012, HS-CMP-014, HS-CMP-015, HS-CMP-016, HS-CMP-019, HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-024, HS-CMP-039, HS-CMP-040, HS-CMP-047, HS-CMP-048, HS-CMP-049, HS-CMP-050 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer.html`, `wireframes/lobby.html` |
| HS-T13 | Portal pelanggan dan akses QR/receipt | HS-SCR-ADM-02, HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-13, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-05, HS-SCR-CSH-07, HS-SCR-CUS-01, HS-SCR-CUS-03, HS-SCR-CUS-06, HS-SCR-CUS-07, HS-SCR-KSK-01, HS-SCR-KSK-03, HS-SCR-KSK-05, HS-SCR-PCA-01, HS-SCR-PCA-02, HS-SCR-TVA-03 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-015, HS-CMP-016, HS-CMP-019, HS-CMP-020, HS-CMP-022, HS-CMP-023, HS-CMP-024, HS-CMP-032, HS-CMP-034, HS-CMP-039, HS-CMP-043, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer.html`, `wireframes/kiosk.html`, `wireframes/pc-agent.html`, `wireframes/tv-agent.html` |
| HS-T14 | Pesanan F&B, tagihan gabungan dan KDS | HS-SCR-ADM-07, HS-SCR-ADM-13, HS-SCR-CSH-01, HS-SCR-CSH-03, HS-SCR-CSH-04, HS-SCR-CSH-05, HS-SCR-CUS-04, HS-SCR-CUS-05, HS-SCR-KDS-01, HS-SCR-KDS-02, HS-SCR-LBY-02, HS-SCR-PCA-03, HS-SCR-TVA-09 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-006, HS-CMP-007, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-019, HS-CMP-020, HS-CMP-023, HS-CMP-038, HS-CMP-040, HS-CMP-041, HS-CMP-043, HS-CMP-058 | `wireframes/cashier.html`, `wireframes/customer.html`, `wireframes/kitchen.html` |
| HS-T15 | Produk, stok, resep dan costing | HS-SCR-ADM-07, HS-SCR-CSH-04 | HS-CMP-007, HS-CMP-023 | `wireframes/cashier.html` |
| HS-T16 | Supplier, PO, penerimaan dan mutasi gudang | HS-SCR-ADM-07, HS-SCR-ADM-18 | HS-CMP-007, HS-CMP-021, HS-CMP-023 | — |
| HS-T17 | Shift kasir dan serah terima sesi aktif | HS-SCR-ADM-08, HS-SCR-ADM-17, HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-CSH-14, HS-SCR-OWN-02 | HS-CMP-017, HS-CMP-018, HS-CMP-021, HS-CMP-023, HS-CMP-049, HS-CMP-050 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/owner.html` |
| HS-T18 | Laporan owner, utilisasi dan liability | HS-SCR-ADM-01, HS-SCR-ADM-07, HS-SCR-ADM-08, HS-SCR-ADM-18, HS-SCR-CSH-13, HS-SCR-OWN-01 | HS-CMP-007, HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-049 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/owner.html` |
| HS-T19 | Pairing aman dan capability probe | HS-SCR-ADM-02, HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-ADM-12, HS-SCR-CSH-01, HS-SCR-TVA-01, HS-SCR-TVA-02 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-027, HS-CMP-030, HS-CMP-031, HS-CMP-056, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/tv-agent.html` |
| HS-T20 | Venue edge, lease offline dan otoritas tunggal | HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-ADP-01, HS-SCR-CSH-01, HS-SCR-CSH-05, HS-SCR-CSH-11, HS-SCR-GWY-01, HS-SCR-GWY-02, HS-SCR-TVA-07, HS-SCR-TVA-10 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-029, HS-CMP-030, HS-CMP-031, HS-CMP-033, HS-CMP-036, HS-CMP-045, HS-CMP-057, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/gateway.html`, `wireframes/tv-adapter.html`, `wireframes/tv-agent.html` |
| HS-T21 | Agent Kotlin Android/Google TV dan expiry | HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-ADP-01, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-15, HS-SCR-TVA-01, HS-SCR-TVA-02, HS-SCR-TVA-03, HS-SCR-TVA-04, HS-SCR-TVA-05, HS-SCR-TVA-06, HS-SCR-TVA-07, HS-SCR-TVA-08, HS-SCR-TVA-10 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-013, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-029, HS-CMP-030, HS-CMP-031, HS-CMP-032, HS-CMP-033, HS-CMP-034, HS-CMP-035, HS-CMP-036, HS-CMP-037, HS-CMP-051, HS-CMP-056, HS-CMP-057, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/tv-adapter.html`, `wireframes/tv-agent.html` |
| HS-T22 | Remote TV aman, timer dan media sendiri | HS-SCR-ADM-13, HS-SCR-ADM-19, HS-SCR-CSH-03, HS-SCR-PCA-04, HS-SCR-TVA-03, HS-SCR-TVA-05, HS-SCR-TVA-09 | HS-CMP-003, HS-CMP-006, HS-CMP-023, HS-CMP-032, HS-CMP-034, HS-CMP-038, HS-CMP-043 | `wireframes/cashier.html`, `wireframes/tv-agent.html` |
| HS-T23 | Adapter CEC/HDMI/IR untuk LG dan Samsung | HS-SCR-ADM-03, HS-SCR-ADM-12, HS-SCR-ADP-01, HS-SCR-ADP-02 | HS-CMP-023, HS-CMP-026, HS-CMP-027, HS-CMP-029, HS-CMP-031, HS-CMP-032 | `wireframes/admin.html`, `wireframes/tv-adapter.html` |
| HS-T24 | Kesehatan fleet, update bertanda tangan dan rollback | HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-CSH-01, HS-SCR-TVA-07, HS-SCR-TVA-10 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-031, HS-CMP-033, HS-CMP-036, HS-CMP-057, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/tv-agent.html` |
| HS-T25 | Chat operator, alarm dan notifikasi berizin | HS-SCR-ADM-13, HS-SCR-ADM-16, HS-SCR-CSH-01, HS-SCR-CSH-08, HS-SCR-CSH-10, HS-SCR-CUS-06, HS-SCR-OWN-01, HS-SCR-OWN-02, HS-SCR-PCA-03, HS-SCR-TVA-05 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-007, HS-CMP-017, HS-CMP-018, HS-CMP-019, HS-CMP-020, HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-034, HS-CMP-043 | `wireframes/cashier.html`, `wireframes/customer.html`, `wireframes/owner.html`, `wireframes/tv-agent.html` |
| HS-T26 | Billboard, customer display dan privasi | HS-SCR-ADM-13, HS-SCR-ADM-19, HS-SCR-CFD-01, HS-SCR-CSH-01, HS-SCR-KSK-05, HS-SCR-LBY-01 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-009, HS-CMP-019, HS-CMP-023, HS-CMP-038, HS-CMP-039, HS-CMP-040, HS-CMP-042 | `wireframes/cashier.html`, `wireframes/customer-display.html`, `wireframes/lobby.html` |
| HS-T27 | Windows seat lock dan player shell | HS-SCR-ADM-11, HS-SCR-ADM-13, HS-SCR-CSH-02, HS-SCR-PCA-01, HS-SCR-PCA-02, HS-SCR-PCA-03, HS-SCR-PCA-04, HS-SCR-TVA-03, HS-SCR-TVA-04 | HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-007, HS-CMP-013, HS-CMP-020, HS-CMP-023, HS-CMP-026, HS-CMP-032, HS-CMP-033, HS-CMP-034, HS-CMP-043, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/pc-agent.html`, `wireframes/tv-agent.html` |
| HS-T28 | Katalog game dan integrasi lisensi sah | HS-SCR-ADM-02, HS-SCR-PCA-02 | HS-CMP-023, HS-CMP-034, HS-CMP-043 | `wireframes/admin.html`, `wireframes/pc-agent.html` |
| HS-T29 | Patching, image PC dan save portability | HS-SCR-PCA-02 | HS-CMP-034, HS-CMP-043 | `wireframes/pc-agent.html` |
| HS-T30 | Keamanan, privasi, audit dan restore | HS-SCR-ADM-08, HS-SCR-ADM-09, HS-SCR-ADM-13, HS-SCR-ADM-14, HS-SCR-ADM-22, HS-SCR-ADM-23, HS-SCR-ADP-01, HS-SCR-CUS-07, HS-SCR-GWY-01, HS-SCR-PCA-04, HS-SCR-TVA-08 | HS-CMP-011, HS-CMP-012, HS-CMP-021, HS-CMP-023, HS-CMP-028, HS-CMP-029, HS-CMP-030, HS-CMP-037, HS-CMP-043, HS-CMP-045, HS-CMP-052, HS-CMP-053 | `wireframes/admin.html`, `wireframes/customer.html`, `wireframes/gateway.html`, `wireframes/tv-adapter.html`, `wireframes/tv-agent.html` |
| HS-T31 | Sertifikasi hardware dan QA lintas alur | HS-SCR-ADM-12 | HS-CMP-027 | `wireframes/admin.html` |
| HS-T32 | Turnamen, bracket dan komunitas | HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09, HS-SCR-LBY-03, HS-SCR-TVA-09 | HS-CMP-025, HS-CMP-038, HS-CMP-040, HS-CMP-055 | `wireframes/admin.html`, `wireframes/customer.html` |
| HS-T33 | Multi-cabang, konfigurasi dan entitlement sendiri | HS-SCR-ADM-01, HS-SCR-ADM-02, HS-SCR-ADM-08, HS-SCR-ADM-11, HS-SCR-ADM-13, HS-SCR-ADM-15, HS-SCR-ADM-18, HS-SCR-OWN-01 | HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-026 | `wireframes/admin.html`, `wireframes/owner.html` |
| HS-T34 | Sewa bawa pulang dan custody aset | HS-SCR-ADM-17 | HS-CMP-023 | — |
| HS-T35 | Staf, kehadiran dan payroll ekspor | HS-SCR-ADM-04, HS-SCR-ADM-09 | HS-CMP-023, HS-CMP-024 | `wireframes/admin.html` |
| HS-T36 | Akuntansi dan laporan pajak Indonesia | HS-SCR-ADM-08, HS-SCR-ADM-13, HS-SCR-ADM-16, HS-SCR-ADM-20, HS-SCR-CSH-05, HS-SCR-CSH-14 | HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-021, HS-CMP-023, HS-CMP-024, HS-CMP-046, HS-CMP-049, HS-CMP-050, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html` |
| HS-T37 | AI helper dengan preview dan persetujuan | HS-SCR-ADM-05 | HS-CMP-012, HS-CMP-023 | — |
| HS-T38 | Pilot agent HP/tablet rental | HS-SCR-ADM-11, HS-SCR-MAG-01, HS-SCR-MAG-02 | HS-CMP-026, HS-CMP-044 | `wireframes/admin.html`, `wireframes/mobile-agent.html` |
| HS-T39 | Feasibility native webOS dan Tizen | HS-SCR-ADM-12, HS-SCR-ADP-01, HS-SCR-TVA-03 | HS-CMP-027, HS-CMP-029, HS-CMP-032 | `wireframes/admin.html`, `wireframes/tv-adapter.html`, `wireframes/tv-agent.html` |
| HS-T40 | Kios mandiri dan coverage iOS | HS-SCR-KSK-01 | HS-CMP-039 | `wireframes/kiosk.html` |
| HS-T41 | Migrasi dry-run, rekonsiliasi dan rollback | HS-SCR-ADM-14, HS-SCR-ADM-16 | HS-CMP-023, HS-CMP-028 | `wireframes/admin.html` |
| HS-T42 | API publik, SSO dan integrasi berizin | HS-SCR-ADM-09, HS-SCR-ADM-16, HS-SCR-ADM-22, HS-SCR-ADM-24 | HS-CMP-023, HS-CMP-052, HS-CMP-053, HS-CMP-054 | `wireframes/admin.html` |
| HS-T43 | B2B, konsinyasi dan unit grosir | no screen in v0.1 — reuse ADM-07 product/stock patterns (HS-CMP-023) | — | — |
| HS-T44 | Konten venue, feedback dan Bahasa Indonesia | HS-SCR-ADM-13, HS-SCR-ADM-19, HS-SCR-TVA-09 | HS-CMP-023, HS-CMP-038 | — |
| HS-T45 | Runbook operator, sandbox dan bantuan | HS-SCR-ADM-02, HS-SCR-ADM-03, HS-SCR-ADM-04, HS-SCR-ADM-06, HS-SCR-ADM-08, HS-SCR-ADM-16, HS-SCR-ADM-17, HS-SCR-CSH-01, HS-SCR-CSH-05, HS-SCR-CSH-07, HS-SCR-CUS-02, HS-SCR-CUS-04 | HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-007, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-014, HS-CMP-016, HS-CMP-019, HS-CMP-021, HS-CMP-023, HS-CMP-024, HS-CMP-026, HS-CMP-031, HS-CMP-058 | `wireframes/admin.html`, `wireframes/cashier.html`, `wireframes/customer.html` |

Grok's files under `/workspace/documentation/hatchsystem/` were read only, never edited.
