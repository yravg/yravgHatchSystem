# HS-T13 — Portal pelanggan dan akses QR/receipt

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-13 | HS-13 | AC-HS-13 | HS-C13 | V1 / ticket |
| FR-SENET-11 | HS-13 | AC-FR-SENET-11 | HS-C13 | V1 / ticket |
| FR-SENET-14 | HS-13 | AC-FR-SENET-14 | HS-C13 | V1 / ticket |
| FR-SENET-16 | HS-13 | AC-FR-SENET-16 | HS-C13 | V1 / ticket |
| FR-SENET-17 | HS-13 | AC-FR-SENET-17 | HS-C13 | V1 / ticket |
| FR-SENET-18 | HS-13 | AC-FR-SENET-18 | HS-C13 | V1 / ticket |
| FR-SENET-20 | HS-13 | AC-FR-SENET-20 | HS-C13 | V1 / ticket |
| FR-SENET-21 | HS-13 | AC-FR-SENET-21 | HS-C13 | V1 / ticket |
| FR-SENET-33 | HS-13 | AC-FR-SENET-33 | HS-C13 | V1 / ticket |
| FR-SENET-38 | HS-13 | AC-FR-SENET-38 | HS-C13 | V1 / ticket |
| FR-SENET-57 | HS-13 | AC-FR-SENET-57 | HS-C13 | V1 / ticket |
| FR-SENET-72 | HS-13 | AC-FR-SENET-72 | HS-C13 | V1 / ticket |
| FR-SENET-83 | HS-13 | AC-FR-SENET-83 | HS-C13 | V1 / ticket |
| FR-SENET-123 | HS-13 | AC-FR-SENET-123 | HS-C13 | V1 / ticket |
| FR-SENET-126 | HS-13 | AC-FR-SENET-126 | HS-C13 | V1 / ticket |
| F071 | HS-13 | AC-F071 | HS-C13 | V1 / ticket |
| F091 | HS-13 | AC-F091 | HS-C13 | V1 / ticket |
| F092 | HS-13 | AC-F092 | HS-C13 | V1 / ticket |
| F093 | HS-13 | AC-F093 | HS-C13 | V1 / ticket |
| F229 | HS-13 | AC-F229 | HS-C13 | V1 / ticket |
| FR-KULA-381 | HS-13 | AC-FR-KULA-381 | HS-C13 | V1 / ticket |


## Behaviour
- **HS-13 / AC-HS-13** — Portal pelanggan dan akses QR/receipt. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-11 / AC-FR-SENET-11** — Pass promotion popup. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Optional popup offering passes right after a session starts. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:XZ67E7xIRRc@04:01.
- **FR-SENET-14 / AC-FR-SENET-14** — Receipt-based session. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Unregistered guest: right-click PC → authorize by receipt, set amount, pay, session auto-starts; receipt number used as login. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:fA_AwlF1brA@02:07; https://senet.cloud/controllers.
- **FR-SENET-16 / AC-FR-SENET-16** — Bulk session start. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Select several devices on map, start by receipt or post-pay at once. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:fA_AwlF1brA@02:47.
- **FR-SENET-17 / AC-FR-SENET-17** — Mandatory registration toggle. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Block session start without a venue account. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:fA_AwlF1brA@03:00.
- **FR-SENET-18 / AC-FR-SENET-18** — Self-registration at PC. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Not-registered button → email (or SMS phone) verify → account. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:fA_AwlF1brA@00:13; yt:Gtt3Iz1_fhg@00:24.
- **FR-SENET-20 / AC-FR-SENET-20** — QR login. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Unique on-screen QR per device; player scans with Senet ID to log in, no extra hardware. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/mobile-app (FAQ).
- **FR-SENET-21 / AC-FR-SENET-21** — Scan-and-pay (guest). Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Login screen: pick duration, price auto-calculated, scan QR, pay card/Apple/Google Pay. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:9vyxKFZXNIk@01:09.
- **FR-SENET-33 / AC-FR-SENET-33** — Booking unlock code. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Code emailed/in app; required to unlock device at session start; shareable to friends. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:iVBn7F-mHbE@02:02.
- **FR-SENET-38 / AC-FR-SENET-38** — Senet ID mobile app + web portal. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Single profile across venues; add venue by QR or code; top-up, passes, booking, history, news, push. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/mobile-app; yt:Gtt3Iz1_fhg@00:10.
- **FR-SENET-57 / AC-FR-SENET-57** — Console self-login (QR/receipt/app). Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Player starts console session by QR, receipt number or mobile app. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/controllers (FAQ).
- **FR-SENET-72 / AC-FR-SENET-72** — Console portal. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Staff web page listing consoles (black = free, grey = busy); start a session by receipt or account. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010982419.
- **FR-SENET-83 / AC-FR-SENET-83** — Access code (receipt) sessions. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Staff generate a receipt code for an amount, or reuse an existing one; guest types it at the login screen. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:18878058024220.
- **FR-SENET-123 / AC-FR-SENET-123** — Senet ID web portal. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: senet.id: balance, top-up, passes, booking PC/console, switch venues, news; each venue keeps its own balances. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: SENET ID [Web Portal].
- **FR-SENET-126 / AC-FR-SENET-126** — Multi-receipt bulk login. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Uji interpretasi sendiri: Select devices → Multiple login by receipt → one payment, individual receipt per device. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: Version 82.
- **F071 / AC-F071** — Public venue profile. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Asersi spesifik: Public venue profile diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F071; others=Revres Play [R1]; AlfSmartBilling [A1]; ggLeap [G1].
- **F091 / AC-F091** — Unit QR self-service session start. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Asersi spesifik: Unit QR self-service session start diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F091; others=AlfSmartBilling [A1]; iCafeCloud [I2].
- **F092 / AC-F092** — Customer live remaining-time view. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Asersi spesifik: Customer live remaining-time view diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F092; others=AlfSmartBilling [A1].
- **F093 / AC-F093** — Customer request extension. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Asersi spesifik: Customer request extension diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F093; others=Not verified; proposed requirement.
- **F229 / AC-F229** — Customer installable PWA. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Asersi spesifik: Customer installable PWA diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F229; others=Not verified; proposed requirement.
- **FR-KULA-381 / AC-FR-KULA-381** — Portal pelanggan dan akses QR/receipt — referensi FR-KULA-381. Target: Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/customer-access/; apps/web/app/pelanggan/; apps/web/app/unit/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C13. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T05: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T07: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T09: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T12: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D10, D16; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C13 — Portal pelanggan dan akses QR/receipt.

## iOS PWA V1
Safari iPhone/iPad wajib untuk booking, QRIS redirect-return, order/member/receipt, loading/offline/token expiry; native wrapper terpisah V2 T40. Senet sudah punya aplikasi iOS; bukan bukti competitor gap.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T05: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T07: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T09: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T12: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-02, HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-13, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-05, HS-SCR-CSH-07, HS-SCR-CUS-01, HS-SCR-CUS-03, HS-SCR-CUS-06, HS-SCR-CUS-07, HS-SCR-KSK-01, HS-SCR-KSK-03, HS-SCR-KSK-05, HS-SCR-PCA-01, HS-SCR-PCA-02, HS-SCR-TVA-03
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-015, HS-CMP-016, HS-CMP-019, HS-CMP-020, HS-CMP-022, HS-CMP-023, HS-CMP-024, HS-CMP-032, HS-CMP-034, HS-CMP-039, HS-CMP-043, HS-CMP-058
Touches (design primary): HS-SCR-CUS-01, HS-SCR-CUS-03, HS-SCR-CUS-06
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
