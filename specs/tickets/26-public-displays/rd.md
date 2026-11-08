# HS-T26 — Billboard, customer display dan privasi

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-26 | HS-26 | AC-HS-26 | HS-C26 | V1 / ticket |
| FR-KPS-57 | HS-26 | AC-KPS-57 | HS-C26 | V1 / ticket |
| F227 | HS-26 | AC-F227 | HS-C26 | V2 / deferred |
| F232 | HS-26 | AC-F232 | HS-C26 | V1 / ticket |
| F278 | HS-26 | AC-F278 | HS-C26 | V2 / deferred |
| FR-KULA-259 | HS-26 | AC-FR-KULA-259 | HS-C26 | V1 / ticket |
| FR-KULA-273 | HS-26 | AC-FR-KULA-273 | HS-C26 | V1 / ticket |
| FR-KULA-285 | HS-26 | AC-FR-KULA-285 | HS-C26 | V1 / ticket |
| FR-KULA-379 | HS-26 | AC-FR-KULA-379 | HS-C26 | V1 / ticket |
| FR-KULA-380 | HS-26 | AC-FR-KULA-380 | HS-C26 | V1 / ticket |


## Behaviour
- **HS-26 / AC-HS-26** — Billboard, customer display dan privasi. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-57 / AC-KPS-57** — Realtime lobby station billboard, zones and announcements. Target: Start/pause/stop unit; public billboard shows correct availability/countdown and approved redacted customer identity. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **F227 / AC-F227** — Commercial signage kiosk integration. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Asersi spesifik: Commercial signage kiosk integration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F227; others=Not verified; proposed requirement.
- **F232 / AC-F232** — Lobby station availability billboard. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Asersi spesifik: Lobby station availability billboard diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F232; others=Not verified; proposed requirement.
- **F278 / AC-F278** — Permission-sensitive lobby privacy. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Asersi spesifik: Permission-sensitive lobby privacy diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F278; others=Not verified; proposed requirement.
- **FR-KULA-259 / AC-FR-KULA-259** — Billboard, customer display dan privasi — referensi FR-KULA-259. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Target rincian sendiri: Waiting-room display read-only menyatakan station/status/remaining yang aman, promo own content dan alias opt-in. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/7-strategi-jitu-menggandakan-omzet-rental-playstation-dan-mencegah-kebocoran-billing.
- **FR-KULA-273 / AC-FR-KULA-273** — Billboard, customer display dan privasi — referensi FR-KULA-273. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-285 / AC-FR-KULA-285** — Billboard, customer display dan privasi — referensi FR-KULA-285. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-379 / AC-FR-KULA-379** — Billboard, customer display dan privasi — referensi FR-KULA-379. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-380 / AC-FR-KULA-380** — Billboard, customer display dan privasi — referensi FR-KULA-380. Target: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
apps/web/app/layar/; services/api/src/display-projections/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C26. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T05: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T14: kontrak dan hasil merge harus diterima sebelum dispatch.

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

Design alias owned: HS-C26 — Billboard, customer display dan privasi.

Design alias owned: KPS-C15 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T05: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T14: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-13, HS-SCR-ADM-19, HS-SCR-CFD-01, HS-SCR-CSH-01, HS-SCR-KSK-05, HS-SCR-LBY-01, HS-SCR-LBY-02, HS-SCR-LBY-03
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-009, HS-CMP-019, HS-CMP-023, HS-CMP-038, HS-CMP-039, HS-CMP-040, HS-CMP-042
Touches (design primary): HS-SCR-LBY-01, HS-SCR-LBY-02, HS-SCR-LBY-03, HS-SCR-CFD-01, HS-CMP-040, HS-CMP-042
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
