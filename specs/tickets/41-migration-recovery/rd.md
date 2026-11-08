# HS-T41 — Migrasi dry-run, rekonsiliasi dan rollback

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-41 | HS-41 | AC-HS-41 | HS-C41 | V1 / ticket |
| FR-SENET-64 | HS-41 | AC-FR-SENET-64 | HS-C41 | V1 / ticket |
| F248 | HS-41 | AC-F248 | HS-C41 | V1 / ticket |
| F273 | HS-41 | AC-F273 | HS-C41 | V2 / deferred |
| HS-GAP-15 | HS-41 | AC-HS-GAP-15 | HS-C41 | V1 / ticket |


## Behaviour
- **HS-41 / AC-HS-41** — Migrasi dry-run, rekonsiliasi dan rollback. Target: CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-64 / AC-FR-SENET-64** — Data migration service. Target: CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji. Uji interpretasi sendiri: Overnight migration of guests, balances, passes, pricing, bonuses from other software. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/switch.
- **F248 / AC-F248** — Restore drill. Target: CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji. Asersi spesifik: Restore drill diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F248; others=Not verified; proposed requirement.
- **F273 / AC-F273** — Migration import preview and rollback. Target: CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji. Asersi spesifik: Migration import preview and rollback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F273; others=Not verified; proposed requirement.
- **HS-GAP-15 / AC-HS-GAP-15** — Migration dry-run, rollback dan restore drills. Target: CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/imports/; apps/web/app/impor/; tools/migrate/; tests/migration/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C41. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T09: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T10: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T15: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D16, D20; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C41 — Migrasi dry-run, rekonsiliasi dan rollback.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T09: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T10: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T15: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-14, HS-SCR-ADM-16
Components: HS-CMP-023, HS-CMP-028
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
