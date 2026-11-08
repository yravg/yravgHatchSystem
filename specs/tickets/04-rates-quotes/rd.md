# HS-T04 — Tarif versi, paket dan kutipan biaya

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-04 | HS-04 | AC-HS-04 | HS-C04 | MVP / ticket |
| FR-KPS-12 | HS-04 | AC-KPS-12 | HS-C04 | MVP / ticket |
| FR-KPS-13 | HS-04 | AC-KPS-13 | HS-C04 | MVP / ticket |
| FR-KPS-14 | HS-04 | AC-KPS-14 | HS-C04 | MVP / ticket |
| FR-KPS-15 | HS-04 | AC-KPS-15 | HS-C04 | MVP / ticket |
| FR-SENET-09 | HS-04 | AC-FR-SENET-09 | HS-C04 | MVP / ticket |
| FR-SENET-10 | HS-04 | AC-FR-SENET-10 | HS-C04 | MVP / ticket |
| FR-SENET-86 | HS-04 | AC-FR-SENET-86 | HS-C04 | MVP / ticket |
| FR-SENET-87 | HS-04 | AC-FR-SENET-87 | HS-C04 | MVP / ticket |
| FR-SENET-88 | HS-04 | AC-FR-SENET-88 | HS-C04 | MVP / ticket |
| FR-SENET-121 | HS-04 | AC-FR-SENET-121 | HS-C04 | MVP / ticket |
| F006 | HS-04 | AC-F006 | HS-C04 | MVP / ticket |
| F019 | HS-04 | AC-F019 | HS-C04 | MVP / ticket |
| F020 | HS-04 | AC-F020 | HS-C04 | MVP / ticket |
| F021 | HS-04 | AC-F021 | HS-C04 | MVP / ticket |
| F022 | HS-04 | AC-F022 | HS-C04 | MVP / ticket |
| F023 | HS-04 | AC-F023 | HS-C04 | MVP / ticket |
| F038 | HS-04 | AC-F038 | HS-C04 | MVP / ticket |
| F039 | HS-04 | AC-F039 | HS-C04 | MVP / ticket |
| F040 | HS-04 | AC-F040 | HS-C04 | MVP / ticket |
| F041 | HS-04 | AC-F041 | HS-C04 | MVP / ticket |
| FR-KULA-257 | HS-04 | AC-FR-KULA-257 | HS-C04 | MVP / ticket |
| FR-KULA-258 | HS-04 | AC-FR-KULA-258 | HS-C04 | MVP / ticket |
| FR-KULA-432 | HS-04 | AC-FR-KULA-432 | HS-C04 | MVP / ticket |
| FR-KULA-486 | HS-04 | AC-FR-KULA-486 | HS-C04 | MVP / ticket |


## Behaviour
- **HS-04 / AC-HS-04** — Tarif versi, paket dan kutipan biaya. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-12 / AC-KPS-12** — Hourly/minute/day pricing configuration. Target: Switch price basis; quote uses configured basis and stores rule version on session. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 00:38–01:24.
- **FR-KPS-13 / AC-KPS-13** — Happy-hour schedule and overnight packages. Target: Select approved happy-hour/night fixture; quote identifies applicable rule and behaves deterministically across midnight. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01; SRC-11.
- **FR-KPS-14 / AC-KPS-14** — Member-specific tariffs or discount tiers. Target: Apply approved member discount; receipt shows base, discount and net without stacking beyond the chosen rule. Evidence: shared integration; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SHARED-FAQ.
- **FR-KPS-15 / AC-KPS-15** — Overtime/late-fee configuration. Target: Configured overrun rule produces an itemised fee; no fee is silently enabled for open sessions. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-24; V1 01:18–01:25.
- **FR-SENET-09 / AC-FR-SENET-09** — Hourly rates / peak-off-peak. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Per-zone hourly price; different peak vs off-peak pricing. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@04:00.
- **FR-SENET-10 / AC-FR-SENET-10** — Passes / packages. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Prepaid time bundles (e.g. 5-hour, weekend, monthly membership). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@04:41.
- **FR-SENET-86 / AC-FR-SENET-86** — One-time minimum payment. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Optional charge at session start per rate; prompts every minute until covered; can apply to staff. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010934959; changelog.
- **FR-SENET-87 / AC-FR-SENET-87** — Per-minute billing with configurable rounding. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Hourly rate debited per minute; money decimal places (default 4) and postpay rounding are configurable. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:10373656174876.
- **FR-SENET-88 / AC-FR-SENET-88** — Time-period rates. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Rate templates set per zone, day and time window (e.g. weekday vs weekend, 24 h). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010934959.
- **FR-SENET-121 / AC-FR-SENET-121** — Time zone drives rates/passes. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Venue time zone governs pass validity, rate schedules and bonuses. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: Why do you need to set up the correct time zone?.
- **F006 / AC-F006** — Station categories and tariffs. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Station categories and tariffs diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F006; others=Not verified; proposed requirement.
- **F019 / AC-F019** — Per-minute billing. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Per-minute billing diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F019; others=CECO [C1].
- **F020 / AC-F020** — Per-hour billing. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Per-hour billing diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F020; others=PIKaPOS [P1]; Omegasoft [O1].
- **F021 / AC-F021** — Configurable minimum charge. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Configurable minimum charge diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F021; others=PIKaPOS [P1].
- **F022 / AC-F022** — Configurable billing rounding. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Configurable billing rounding diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F022; others=PIKaPOS [P1].
- **F023 / AC-F023** — Category-specific prices. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Category-specific prices diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F023; others=PIKaPOS [P1].
- **F038 / AC-F038** — Rate snapshot on session start. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Rate snapshot on session start diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F038; others=Not verified; proposed requirement.
- **F039 / AC-F039** — Happy hour schedules. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Happy hour schedules diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F039; others=Omegasoft [O1].
- **F040 / AC-F040** — Overnight packages crossing midnight. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Overnight packages crossing midnight diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F040; others=Not verified; proposed requirement.
- **F041 / AC-F041** — Weekend holiday tariffs. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Asersi spesifik: Weekend holiday tariffs diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F041; others=Omegasoft [O1].
- **FR-KULA-257 / AC-FR-KULA-257** — Tarif versi, paket dan kutipan biaya — referensi FR-KULA-257. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Target rincian sendiri: Biaya overrun configurable/versioned; default0 sampai owner approve dan checkout memperlihatkan breakdown. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/trik-meningkatkan-omset-rental-ps-tv-billing-otomatis.
- **FR-KULA-258 / AC-FR-KULA-258** — Tarif versi, paket dan kutipan biaya — referensi FR-KULA-258. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Target rincian sendiri: Tarif malam/happy-hour/student diuji lintas tanggal/timezone; benefit kategori perlu permission/eligibility. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/7-strategi-jitu-menggandakan-omzet-rental-playstation-dan-mencegah-kebocoran-billing.
- **FR-KULA-432 / AC-FR-KULA-432** — Tarif versi, paket dan kutipan biaya — referensi FR-KULA-432. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-486 / AC-FR-KULA-486** — Tarif versi, paket dan kutipan biaya — referensi FR-KULA-486. Target: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/rates/; apps/web/app/tarif/; packages/domain/pricing/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C04. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T03: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D01, D03; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
QUOTE_STALE

Design alias owned: HS-C04 — Tarif versi, paket dan kutipan biaya.

Design alias owned: KPS-C05 — Legacy proposed component alias; no extra visual specification.

## Verified policy acceptance v0.2
- FR-SENET-86 / AC-FR-SENET-86: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Optional charge at session start per rate; prompts every minute until covered; can apply to staff. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: Fixture minimum5.000/30min then12.000/hour;20min=5.000,30min=5.000,40min=7.000; pause does not consume covered minutes. Minimum once/session even retry/reconnect/zone-transfer; insufficient balance cannot activate. D26 approval before production.
- FR-SENET-87 / AC-FR-SENET-87: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Hourly rate debited per minute; money decimal places (default 4) and postpay rounding are configurable. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.
- FR-SENET-88 / AC-FR-SENET-88: Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama. Uji interpretasi sendiri: Rate templates set per zone, day and time window (e.g. weekday vs weekend, 24 h). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: One station reserve wins under concurrency. Rate Rp10.000/hour,61seconds gives exact rational610000/3600 then final rounding once toRp169 fixture, never repeated rounding debit. MinimumRp5.000 covers30minutes:20minutes=5.000;40minutes at12.000/hour=7.000. Rule version cannot alter old quote. APIs only, no forms.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T03: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T47: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T47. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-02, HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-20, HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-KSK-03, HS-SCR-TVA-06
Components: HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-012, HS-CMP-013, HS-CMP-023, HS-CMP-024, HS-CMP-035, HS-CMP-039, HS-CMP-046, HS-CMP-058
Touches (design primary): HS-SCR-ADM-04, HS-SCR-ADM-20, HS-CMP-024, HS-CMP-046
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
