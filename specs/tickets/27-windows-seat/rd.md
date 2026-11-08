# HS-T27 — Windows seat lock dan player shell

Status: **draft**
Mode: **team**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-27 | HS-27 | AC-HS-27 | HS-C27 | V1 / ticket |
| FR-KPS-60 | HS-27 | AC-KPS-60 | HS-C27 | V1 / ticket |
| FR-SENET-03 | HS-27 | AC-FR-SENET-03 | HS-C27 | V1 / ticket |
| FR-SENET-04 | HS-27 | AC-FR-SENET-04 | HS-C27 | V1 / ticket |
| FR-SENET-05 | HS-27 | AC-FR-SENET-05 | HS-C27 | V1 / ticket |
| FR-SENET-53 | HS-27 | AC-FR-SENET-53 | HS-C27 | V1 / ticket |
| FR-SENET-54 | HS-27 | AC-FR-SENET-54 | HS-C27 | V1 / ticket |
| FR-SENET-63 | HS-27 | AC-FR-SENET-63 | HS-C27 | V1 / ticket |
| FR-SENET-85 | HS-27 | AC-FR-SENET-85 | HS-C27 | V1 / ticket |
| FR-SENET-108 | HS-27 | AC-FR-SENET-108 | HS-C27 | V1 / ticket |
| FR-SENET-111 | HS-27 | AC-FR-SENET-111 | HS-C27 | V1 / ticket |
| FR-SENET-112 | HS-27 | AC-FR-SENET-112 | HS-C27 | V1 / ticket |
| FR-SENET-115 | HS-27 | AC-FR-SENET-115 | HS-C27 | V1 / ticket |
| FR-SENET-118 | HS-27 | AC-FR-SENET-118 | HS-C27 | V1 / ticket |
| F209 | HS-27 | AC-F209 | HS-C27 | V1 / ticket |
| F210 | HS-27 | AC-F210 | HS-C27 | V1 / ticket |
| F211 | HS-27 | AC-F211 | HS-C27 | V1 / ticket |
| F212 | HS-27 | AC-F212 | HS-C27 | V1 / ticket |
| F213 | HS-27 | AC-F213 | HS-C27 | V1 / ticket |
| F214 | HS-27 | AC-F214 | HS-C27 | V1 / ticket |
| F215 | HS-27 | AC-F215 | HS-C27 | V1 / ticket |
| F219 | HS-27 | AC-F219 | HS-C27 | V1 / ticket |
| F220 | HS-27 | AC-F220 | HS-C27 | V1 / ticket |
| FR-KULA-264 | HS-27 | AC-FR-KULA-264 | HS-C27 | V1 / ticket |
| FR-KULA-290 | HS-27 | AC-FR-KULA-290 | HS-C27 | V1 / ticket |
| FR-KULA-337 | HS-27 | AC-FR-KULA-337 | HS-C27 | V1 / ticket |
| FR-KULA-338 | HS-27 | AC-FR-KULA-338 | HS-C27 | V1 / ticket |
| HS-GAP-14 | HS-27 | AC-HS-GAP-14 | HS-C27 | V1 / ticket |


## Behaviour
- **HS-27 / AC-HS-27** — Windows seat lock dan player shell. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-60 / AC-KPS-60** — Windows PC Agent lock/timer and remote lifecycle commands. Target: Windows simulator accepts session lease; restart resumes remaining time; physical-device certification is separate. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-SENET-03 / AC-FR-SENET-03** — E-Launcher client install. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Installer + unique installation key links each PC to the venue account. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:fKADoSC7NBk@00:00; yt:26EXyqvEFLw@01:09.
- **FR-SENET-04 / AC-FR-SENET-04** — Shell player interface. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Branded kiosk-style player UI on each PC: login, games, shop, passes, news. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/senet; yt:XZ67E7xIRRc@00:04.
- **FR-SENET-05 / AC-FR-SENET-05** — Security restriction levels. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Predefined levels lock desktop, Start, Task Manager, downloads, browsing; process blocking. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@02:04; https://senet.cloud/senet.
- **FR-SENET-53 / AC-FR-SENET-53** — Shell branding. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Logo/background per venue and per zone; favorites, avatars. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@14:32.
- **FR-SENET-54 / AC-FR-SENET-54** — Shell session lock. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Player locks screen; billing continues; logout ends. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:XZ67E7xIRRc@05:48.
- **FR-SENET-63 / AC-FR-SENET-63** — Secured remote access. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Remote connection to PCs. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/pricing.
- **FR-SENET-85 / AC-FR-SENET-85** — Unlimited session (billing off). Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Start unlimited sessions without login, billing disabled, resumes after PC reboot (edu use). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:23067820137756.
- **FR-SENET-108 / AC-FR-SENET-108** — Login screen shows upcoming booking. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Booked PCs show a reserved status on the login screen to stop early logins. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:26291453315228.
- **FR-SENET-111 / AC-FR-SENET-111** — PC Wake-on-LAN / auto shutdown / auto restart. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Power PCs on/off from the map; shut down idle PCs after N seconds; restart after a session ends. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:20254974508444; help:19524801878940.
- **FR-SENET-112 / AC-FR-SENET-112** — Remote access with consent prompt. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: VNC-style remote control of PCs on the same subnet; confirmation prompt on by default; support Remote Connector. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: PC Remote Access; Version 84.
- **FR-SENET-115 / AC-FR-SENET-115** — Auto logout from launchers/browsers. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Clears launcher/browser logins at session end. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: Auto Logout from Launchers and Browsers.
- **FR-SENET-118 / AC-FR-SENET-118** — Printing for customers. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Uji interpretasi sendiri: Paid document printing with print rates. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: SENET printing system User Manual.
- **F209 / AC-F209** — Windows seat lock agent. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows seat lock agent diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F209; others=AlfSmartBilling [A1].
- **F210 / AC-F210** — Windows member game launcher. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows member game launcher diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F210; others=ggLeap [G1]; iCafeCloud [I1].
- **F211 / AC-F211** — Windows remaining-time HUD. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows remaining-time HUD diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F211; others=Not verified; proposed requirement.
- **F212 / AC-F212** — Windows customer food ordering. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows customer food ordering diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F212; others=AlfSmartBilling [A1].
- **F213 / AC-F213** — Windows cashier chat. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows cashier chat diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F213; others=AlfSmartBilling [A1]; PanCafe [N1].
- **F214 / AC-F214** — Windows remote restart and shutdown. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows remote restart and shutdown diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F214; others=AlfSmartBilling [A1].
- **F215 / AC-F215** — Windows reboot session recovery. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows reboot session recovery diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F215; others=Not verified; proposed requirement.
- **F219 / AC-F219** — Per-session user-data cleanup. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Per-session user-data cleanup diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F219; others=Not verified; proposed requirement.
- **F220 / AC-F220** — Windows Wake-on-LAN. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Asersi spesifik: Windows Wake-on-LAN diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F220; others=PanCafe [N1].
- **FR-KULA-264 / AC-FR-KULA-264** — Windows seat lock dan player shell — referensi FR-KULA-264. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-290 / AC-FR-KULA-290** — Windows seat lock dan player shell — referensi FR-KULA-290. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-337 / AC-FR-KULA-337** — Windows seat lock dan player shell — referensi FR-KULA-337. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-338 / AC-FR-KULA-338** — Windows seat lock dan player shell — referensi FR-KULA-338. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **HS-GAP-14 / AC-HS-GAP-14** — Verifikasi cleanup sesi tanpa shared personal credentials. Target: Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
agents/windows-seat/; tests/windows-seat/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C27. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T05: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D11, D12, D16; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C27 — Windows seat lock dan player shell.

Design alias owned: KPS-C17 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T05: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-11, HS-SCR-ADM-13, HS-SCR-CSH-02, HS-SCR-PCA-01, HS-SCR-PCA-02, HS-SCR-PCA-03, HS-SCR-PCA-04, HS-SCR-TVA-03, HS-SCR-TVA-04
Components: HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-007, HS-CMP-013, HS-CMP-020, HS-CMP-023, HS-CMP-026, HS-CMP-032, HS-CMP-033, HS-CMP-034, HS-CMP-043, HS-CMP-058
Touches (design primary): HS-SCR-PCA-01, HS-SCR-PCA-02, HS-SCR-PCA-03, HS-SCR-PCA-04, HS-CMP-043
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
