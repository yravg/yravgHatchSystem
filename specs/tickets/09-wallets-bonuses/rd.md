# HS-T09 — Dompet IDR, bonus dan batas belanja offline

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-09 | HS-09 | AC-HS-09 | HS-C09 | V1 / ticket |
| FR-SENET-22 | HS-09 | AC-FR-SENET-22 | HS-C09 | V1 / ticket |
| FR-SENET-26 | HS-09 | AC-FR-SENET-26 | HS-C09 | V1 / ticket |
| FR-SENET-27 | HS-09 | AC-FR-SENET-27 | HS-C09 | V1 / ticket |
| FR-SENET-92 | HS-09 | AC-FR-SENET-92 | HS-C09 | V1 / ticket |
| FR-SENET-94 | HS-09 | AC-FR-SENET-94 | HS-C09 | V1 / ticket |
| FR-SENET-103 | HS-09 | AC-FR-SENET-103 | HS-C09 | V1 / ticket |
| FR-SENET-120 | HS-09 | AC-FR-SENET-120 | HS-C09 | V1 / ticket |
| F053 | HS-09 | AC-F053 | HS-C09 | V1 / ticket |
| F054 | HS-09 | AC-F054 | HS-C09 | V1 / ticket |
| F055 | HS-09 | AC-F055 | HS-C09 | V1 / ticket |
| F066 | HS-09 | AC-F066 | HS-C09 | V1 / ticket |
| F067 | HS-09 | AC-F067 | HS-C09 | V1 / ticket |
| F130 | HS-09 | AC-F130 | HS-C09 | V1 / ticket |
| F258 | HS-09 | AC-F258 | HS-C09 | V1 / ticket |
| F259 | HS-09 | AC-F259 | HS-C09 | V1 / ticket |
| HS-GAP-05 | HS-09 | AC-HS-GAP-05 | HS-C09 | V1 / ticket |


## Behaviour
- **HS-09 / AC-HS-09** — Dompet IDR, bonus dan batas belanja offline. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-22 / AC-FR-SENET-22** — Online top-up via QR. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Shell Top up → Online tab → amount → QR → payment page. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:9vyxKFZXNIk@01:25.
- **FR-SENET-26 / AC-FR-SENET-26** — Main balance wallet. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Player prepaid balance; spent on time, passes, shop. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@09:03.
- **FR-SENET-27 / AC-FR-SENET-27** — Bonus balance. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Separate promotional wallet; top-up bonuses (e.g. top up 50 get 5). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:k6XdbbMy67w@00:00; yt:26EXyqvEFLw@11:42.
- **FR-SENET-92 / AC-FR-SENET-92** — Bonus codes. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Single-use codes (up to 5,000 per batch) adding a fixed bonus amount, e.g. as compensation; not counted as revenue. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:31361745324828.
- **FR-SENET-94 / AC-FR-SENET-94** — Top-up bonus tiers. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Fixed or % bonus for a top-up amount/range; one scheme active at a time. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: How to set up top-up bonuses?.
- **FR-SENET-103 / AC-FR-SENET-103** — No balance transfer between accounts. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Not supported; refund and top up the correct account instead. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: Is it possible to transfer funds.
- **FR-SENET-120 / AC-FR-SENET-120** — Scheduled resets & top-up presets. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Uji interpretasi sendiri: Organisation settings include scheduled resets and top-up preset amounts. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:22778889420572.
- **F053 / AC-F053** — Prepaid rupiah wallet. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Prepaid rupiah wallet diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F053; others=AlfSmartBilling [A1].
- **F054 / AC-F054** — Wallet top-up. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Wallet top-up diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F054; others=iCafeCloud [I1].
- **F055 / AC-F055** — Wallet spend and refund ledger. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Wallet spend and refund ledger diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F055; others=Not verified; proposed requirement.
- **F066 / AC-F066** — Wallet double-spend prevention. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Wallet double-spend prevention diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F066; others=Not verified; proposed requirement.
- **F067 / AC-F067** — No silent negative wallet balance. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: No silent negative wallet balance diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F067; others=Not verified; proposed requirement.
- **F130 / AC-F130** — Top-up bonus. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Top-up bonus diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F130; others=iCafeCloud [I1].
- **F258 / AC-F258** — Conflict-safe offline wallet policy. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Conflict-safe offline wallet policy diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F258; others=Not verified; proposed requirement.
- **F259 / AC-F259** — Cross-branch wallet consistency. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Asersi spesifik: Cross-branch wallet consistency diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F259; others=Not verified; proposed requirement.
- **HS-GAP-05 / AC-HS-GAP-05** — Budget wallet offline tanpa double-spend lintas cabang. Target: Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/wallets/; packages/domain/wallet/; apps/web/app/dompet/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C09. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T07: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D03, D07, D15; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
INSUFFICIENT_BALANCE

Design alias owned: HS-C09 — Dompet IDR, bonus dan batas belanja offline.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T07: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T52: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T52. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-05, HS-SCR-ADM-18, HS-SCR-CSH-06, HS-SCR-CUS-07, HS-SCR-KSK-02
Components: HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-021, HS-CMP-023, HS-CMP-039
Touches (design primary): HS-CMP-011
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
