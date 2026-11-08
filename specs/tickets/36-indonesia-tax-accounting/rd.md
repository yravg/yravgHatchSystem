# HS-T36 — Akuntansi dan laporan pajak Indonesia

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-36 | HS-36 | AC-HS-36 | HS-C36 | V1 / ticket |
| FR-SENET-12 | HS-36 | AC-FR-SENET-12 | HS-C36 | V1 / ticket |
| FR-SENET-24 | HS-36 | AC-FR-SENET-24 | HS-C36 | V1 / ticket |
| F182 | HS-36 | AC-F182 | HS-C36 | V1 / ticket |
| F183 | HS-36 | AC-F183 | HS-C36 | V1 / ticket |
| FR-KULA-002 | HS-36 | AC-FR-KULA-002 | HS-C36 | V1 / ticket |
| FR-KULA-003 | HS-36 | AC-FR-KULA-003 | HS-C36 | V1 / ticket |
| FR-KULA-004 | HS-36 | AC-FR-KULA-004 | HS-C36 | V1 / ticket |
| FR-KULA-388 | HS-36 | AC-FR-KULA-388 | HS-C36 | V1 / ticket |
| FR-KULA-393 | HS-36 | AC-FR-KULA-393 | HS-C36 | V1 / ticket |
| FR-KULA-470 | HS-36 | AC-FR-KULA-470 | HS-C36 | V1 / ticket |
| FR-KULA-479 | HS-36 | AC-FR-KULA-479 | HS-C36 | V1 / ticket |


## Behaviour
- **HS-36 / AC-HS-36** — Akuntansi dan laporan pajak Indonesia. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-12 / AC-FR-SENET-12** — Flexible billing, cashier & tax settings. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Uji interpretasi sendiri: Billing rules, cashier config, tax settings (detail UNKNOWN). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: pending verification; sumber: https://senet.cloud/pricing.
- **FR-SENET-24 / AC-FR-SENET-24** — Cash register (fiscal) integrations. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Uji interpretasi sendiri: Software cash register integrations (vendor names on page). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/payments-systems.
- **F182 / AC-F182** — Accounting export. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Asersi spesifik: Accounting export diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F182; others=Not verified; proposed requirement.
- **F183 / AC-F183** — Tax and service charge settings. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Asersi spesifik: Tax and service charge settings diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F183; others=Not verified; proposed requirement.
- **FR-KULA-002 / AC-FR-KULA-002** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-002. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Target rincian sendiri: Pemetaan akun dan pajak berversi dapat diekspor sebagai draft untuk review akuntan. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-003 / AC-FR-KULA-003** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-003. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Target rincian sendiri: Jurnal memiliki debit=kredit dan saldo akun dapat direkonsiliasi ke sumber transaksi. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-004 / AC-FR-KULA-004** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-004. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Target rincian sendiri: Export Coretax berlabel draft menyatakan schema dan periode, tanpa pengiriman ke DJP. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-388 / AC-FR-KULA-388** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-388. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-393 / AC-FR-KULA-393** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-393. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-470 / AC-FR-KULA-470** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-470. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-479 / AC-FR-KULA-479** — Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-479. Target: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/accounting/; apps/web/app/akuntansi/; services/worker/src/tax-exports/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C36. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T18: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D17, D22; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C36 — Akuntansi dan laporan pajak Indonesia.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T18: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-08, HS-SCR-ADM-13, HS-SCR-ADM-16, HS-SCR-ADM-20, HS-SCR-CSH-05, HS-SCR-CSH-14
Components: HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-021, HS-CMP-023, HS-CMP-024, HS-CMP-046, HS-CMP-049, HS-CMP-050, HS-CMP-058
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
