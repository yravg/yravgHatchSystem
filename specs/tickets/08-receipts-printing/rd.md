# HS-T08 — Struk, cetak ulang dan jembatan printer

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-08 | HS-08 | AC-HS-08 | HS-C08 | MVP / ticket |
| FR-KPS-34 | HS-08 | AC-KPS-34 | HS-C08 | MVP / ticket |
| FR-SENET-98 | HS-08 | AC-FR-SENET-98 | HS-C08 | MVP / ticket |
| F119 | HS-08 | AC-F119 | HS-C08 | MVP / ticket |
| F167 | HS-08 | AC-F167 | HS-C08 | MVP / ticket |
| F168 | HS-08 | AC-F168 | HS-C08 | MVP / ticket |
| F169 | HS-08 | AC-F169 | HS-C08 | MVP / ticket |
| F170 | HS-08 | AC-F170 | HS-C08 | MVP / ticket |
| F171 | HS-08 | AC-F171 | HS-C08 | MVP / ticket |
| FR-KULA-183 | HS-08 | AC-FR-KULA-183 | HS-C08 | MVP / ticket |
| FR-KULA-188 | HS-08 | AC-FR-KULA-188 | HS-C08 | MVP / ticket |
| FR-KULA-203 | HS-08 | AC-FR-KULA-203 | HS-C08 | MVP / ticket |
| FR-KULA-230 | HS-08 | AC-FR-KULA-230 | HS-C08 | MVP / ticket |
| FR-KULA-231 | HS-08 | AC-FR-KULA-231 | HS-C08 | MVP / ticket |
| FR-KULA-235 | HS-08 | AC-FR-KULA-235 | HS-C08 | MVP / ticket |
| FR-KULA-324 | HS-08 | AC-FR-KULA-324 | HS-C08 | MVP / ticket |
| FR-KULA-437 | HS-08 | AC-FR-KULA-437 | HS-C08 | MVP / ticket |
| FR-KULA-458 | HS-08 | AC-FR-KULA-458 | HS-C08 | MVP / ticket |
| FR-KULA-498 | HS-08 | AC-FR-KULA-498 | HS-C08 | MVP / ticket |


## Behaviour
- **HS-08 / AC-HS-08** — Struk, cetak ulang dan jembatan printer. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-34 / AC-KPS-34** — Thermal/PDF and digital receipt integration. Target: Print to sandbox 58/80-mm adapter or PDF; print retry never creates another financial transaction. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 05:24–05:27; SHARED-FAQ.
- **FR-SENET-98 / AC-FR-SENET-98** — Receipt printing/templates. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Uji interpretasi sendiri: Thermal printer optional (Bixolon SRP-150, Vioteh VPT80 named); editable templates; reprint; PDF receipts. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010817400.
- **F119 / AC-F119** — Kitchen receipt routing. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Kitchen receipt routing diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F119; others=Not verified; proposed requirement.
- **F167 / AC-F167** — Cashier thermal receipt. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Cashier thermal receipt diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F167; others=CECO [C1]; PIKaPOS [P1].
- **F168 / AC-F168** — PDF receipt. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: PDF receipt diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F168; others=Not verified; proposed requirement.
- **F169 / AC-F169** — Bluetooth printer support. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Bluetooth printer support diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F169; others=CECO [C1]; PIKaPOS [P1].
- **F170 / AC-F170** — LAN printer support. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: LAN printer support diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F170; others=PIKaPOS [P1].
- **F171 / AC-F171** — Printer offline queue. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Printer offline queue diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F171; others=Not verified; proposed requirement.
- **FR-KULA-183 / AC-FR-KULA-183** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-183. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-servis-elektronik.
- **FR-KULA-188 / AC-FR-KULA-188** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-188. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Label rak/barcode dapat dicetak ulang tanpa perubahan transaksi atau stok. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-toko.
- **FR-KULA-203 / AC-FR-KULA-203** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-203. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Cetak ulang/link receipt tidak menggandakan sale; berbagi pesan adalah draft/manual sampai izin penerima/connector. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-reprint-receipt`, public bundle).
- **FR-KULA-230 / AC-FR-KULA-230** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-230. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Setup printer via edge bridge memilih protocol/paper58/80mm dan test print; browser tidak dijanjikan universal Bluetooth. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `settings-printer-setup`, public bundle).
- **FR-KULA-231 / AC-FR-KULA-231** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-231. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Header/footer/logo receipt menggunakan aset venue sendiri berizin; template tidak menyimpan competitor copy. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `settings-store-profile-receipt`, public bundle).
- **FR-KULA-235 / AC-FR-KULA-235** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-235. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Receipt thermal/link redacted dapat dibagikan manual, tidak mengirim pesan eksternal otomatis. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-324 / AC-FR-KULA-324** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-324. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-437 / AC-FR-KULA-437** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-437. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-458 / AC-FR-KULA-458** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-458. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-498 / AC-FR-KULA-498** — Struk, cetak ulang dan jembatan printer — referensi FR-KULA-498. Target: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/receipts/; apps/web/app/struk/; agents/venue-edge/Printing/; tests/printing/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C08. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: Tidak ada kebijakan uang/keamanan/data spesifik yang baru; tetap perlu human ready.; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C08 — Struk, cetak ulang dan jembatan printer.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T50: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T50. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-07, HS-SCR-ADM-13, HS-SCR-ADM-17, HS-SCR-CSH-05, HS-SCR-CSH-13, HS-SCR-CUS-08, HS-SCR-KDS-01, HS-SCR-KSK-05
Components: HS-CMP-007, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-023, HS-CMP-039, HS-CMP-041, HS-CMP-049, HS-CMP-058
Touches (design primary): HS-SCR-CUS-08
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
