# HS-T30 — Keamanan, privasi, audit dan restore

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-30 | HS-30 | AC-HS-30 | HS-C30 | MVP / ticket |
| FR-KPS-68 | HS-30 | AC-KPS-68 | HS-C30 | MVP / ticket |
| FR-SENET-68 | HS-30 | AC-FR-SENET-68 | HS-C30 | MVP / ticket |
| FR-SENET-109 | HS-30 | AC-FR-SENET-109 | HS-C30 | MVP / ticket |
| F163 | HS-30 | AC-F163 | HS-C30 | MVP / ticket |
| F239 | HS-30 | AC-F239 | HS-C30 | MVP / ticket |
| F240 | HS-30 | AC-F240 | HS-C30 | MVP / ticket |
| F241 | HS-30 | AC-F241 | HS-C30 | MVP / ticket |
| F242 | HS-30 | AC-F242 | HS-C30 | MVP / ticket |
| F243 | HS-30 | AC-F243 | HS-C30 | MVP / ticket |
| F244 | HS-30 | AC-F244 | HS-C30 | MVP / ticket |
| F245 | HS-30 | AC-F245 | HS-C30 | MVP / ticket |
| F246 | HS-30 | AC-F246 | HS-C30 | MVP / ticket |
| F247 | HS-30 | AC-F247 | HS-C30 | MVP / ticket |
| F249 | HS-30 | AC-F249 | HS-C30 | MVP / ticket |
| F250 | HS-30 | AC-F250 | HS-C30 | MVP / ticket |
| F251 | HS-30 | AC-F251 | HS-C30 | MVP / ticket |
| F252 | HS-30 | AC-F252 | HS-C30 | MVP / ticket |
| F253 | HS-30 | AC-F253 | HS-C30 | MVP / ticket |
| F255 | HS-30 | AC-F255 | HS-C30 | MVP / ticket |
| F256 | HS-30 | AC-F256 | HS-C30 | MVP / ticket |
| FR-KULA-036 | HS-30 | AC-FR-KULA-036 | HS-C30 | MVP / ticket |
| FR-KULA-441 | HS-30 | AC-FR-KULA-441 | HS-C30 | MVP / ticket |
| FR-KULA-509 | HS-30 | AC-FR-KULA-509 | HS-C30 | MVP / ticket |
| HS-GAP-11 | HS-30 | AC-HS-GAP-11 | HS-C30 | MVP / ticket |
| HS-GAP-12 | HS-30 | AC-HS-GAP-12 | HS-C30 | MVP / ticket |


## Behaviour
- **HS-30 / AC-HS-30** — Keamanan, privasi, audit dan restore. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-68 / AC-KPS-68** — Audit export and privacy-safe diagnostics. Target: Export session/payment/device incident audit with no PINs, tokens or unredacted customer identifiers in logs. Evidence: proposed; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: DESIGN-01.
- **FR-SENET-68 / AC-FR-SENET-68** — EU data hosting. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Region dipilih owner D16, bukan wajib menyalin EU hosting vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/switch.
- **FR-SENET-109 / AC-FR-SENET-109** — Action log. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Uji interpretasi sendiri: History of user actions and map activity, available to all orgs. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:26052144991516.
- **F163 / AC-F163** — Staff activity audit. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Staff activity audit diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F163; others=Revres Play [R1]; Omegasoft [O1].
- **F239 / AC-F239** — Mutual authentication for device transport. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Mutual authentication for device transport diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F239; others=Not verified; proposed requirement.
- **F240 / AC-F240** — Outbound-only edge connectivity. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Outbound-only edge connectivity diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F240; others=Not verified; proposed requirement.
- **F241 / AC-F241** — Device network segmentation. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Device network segmentation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F241; others=Not verified; proposed requirement.
- **F242 / AC-F242** — Least-privilege hardware adapters. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Least-privilege hardware adapters diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F242; others=Not verified; proposed requirement.
- **F243 / AC-F243** — Encrypted secrets at rest. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Encrypted secrets at rest diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F243; others=Not verified; proposed requirement.
- **F244 / AC-F244** — No payment or account secrets in client logs. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: No payment or account secrets in client logs diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F244; others=Not verified; proposed requirement.
- **F245 / AC-F245** — Staff MFA. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Staff MFA diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F245; others=Not verified; proposed requirement.
- **F246 / AC-F246** — Owner recovery procedure. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Owner recovery procedure diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F246; others=Not verified; proposed requirement.
- **F247 / AC-F247** — Encrypted backups. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Encrypted backups diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F247; others=Not verified; proposed requirement.
- **F249 / AC-F249** — Consent-aware customer data retention. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Consent-aware customer data retention diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F249; others=Not verified; proposed requirement.
- **F250 / AC-F250** — Customer data export and erasure. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Customer data export and erasure diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F250; others=Not verified; proposed requirement.
- **F251 / AC-F251** — Sensitive ID upload disabled by default. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Sensitive ID upload disabled by default diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F251; others=Not verified; proposed requirement.
- **F252 / AC-F252** — No persistent customer location tracking by default. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: No persistent customer location tracking by default diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F252; others=Not verified; proposed requirement.
- **F253 / AC-F253** — Remote assistance explicit approval. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Remote assistance explicit approval diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F253; others=Not verified; proposed requirement.
- **F255 / AC-F255** — Audit trail export. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Audit trail export diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F255; others=Not verified; proposed requirement.
- **F256 / AC-F256** — Emergency local override with audit. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Asersi spesifik: Emergency local override with audit diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F256; others=Not verified; proposed requirement.
- **FR-KULA-036 / AC-FR-KULA-036** — Keamanan, privasi, audit dan restore — referensi FR-KULA-036. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Target rincian sendiri: Log login mencatat hasil dan actor tanpa password/token; pembacaan owner berizin. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-441 / AC-FR-KULA-441** — Keamanan, privasi, audit dan restore — referensi FR-KULA-441. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-509 / AC-FR-KULA-509** — Keamanan, privasi, audit dan restore — referensi FR-KULA-509. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **HS-GAP-11 / AC-HS-GAP-11** — Emergency override lokal berjangka dan audit. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.
- **HS-GAP-12 / AC-HS-GAP-12** — Privasi default, retention, erasure dan lobby redaction. Target: Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/security/; services/api/src/privacy/; services/worker/src/backups/; packages/domain/audit/; docs/security/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C30. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D09, D16, D20; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
DATA_RETENTION_UNAPPROVED

Design alias owned: HS-C30 — Keamanan, privasi, audit dan restore.

## Global non-goal safety audit
- NG01: Tidak ada brand/logo/copy/code/APK/assets vendor dalam produk
- NG02: Tidak ada live payment keys, pembayaran nyata, deployment atau store publish
- NG03: Tidak pernah memutus listrik konsol, rooting/hidden API/DRM bypass
- NG04: Tidak ada modul apotek/medis/pet/laundry/barber/bengkel/craft literal
- NG05: Tidak ada klaim universal TV lock/native webOS/Tizen/iOS agent tanpa bukti
- NG06: Tidak ada auto-message, payroll transfer, DJP submit, AI autonomous mutation

## Safety scope
NG01..NG06 dimiliki untuk audit safety, bukan fitur. Source assets/binaries/private/raw folders tidak boleh masuk repo/paket build.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T46: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T50: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T46, HS-T50. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-08, HS-SCR-ADM-09, HS-SCR-ADM-13, HS-SCR-ADM-14, HS-SCR-ADM-22, HS-SCR-ADM-23, HS-SCR-ADP-01, HS-SCR-CUS-07, HS-SCR-GWY-01, HS-SCR-PCA-04, HS-SCR-TVA-08
Components: HS-CMP-011, HS-CMP-012, HS-CMP-021, HS-CMP-023, HS-CMP-028, HS-CMP-029, HS-CMP-030, HS-CMP-037, HS-CMP-043, HS-CMP-045, HS-CMP-052, HS-CMP-053
Touches (design primary): HS-SCR-ADM-14, HS-SCR-TVA-08, HS-CMP-028, HS-CMP-037
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
