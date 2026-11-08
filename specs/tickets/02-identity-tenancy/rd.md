# HS-T02 — Identitas, tenant dan otorisasi per outlet

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-02 | HS-02 | AC-HS-02 | HS-C02 | MVP / ticket |
| FR-KPS-33 | HS-02 | AC-KPS-33 | HS-C02 | MVP / ticket |
| FR-SENET-01 | HS-02 | AC-FR-SENET-01 | HS-C02 | MVP / ticket |
| FR-SENET-45 | HS-02 | AC-FR-SENET-45 | HS-C02 | MVP / ticket |
| F001 | HS-02 | AC-F001 | HS-C02 | MVP / ticket |
| F156 | HS-02 | AC-F156 | HS-C02 | MVP / ticket |
| F157 | HS-02 | AC-F157 | HS-C02 | MVP / ticket |
| FR-KULA-228 | HS-02 | AC-FR-KULA-228 | HS-C02 | MVP / ticket |
| FR-KULA-428 | HS-02 | AC-FR-KULA-428 | HS-C02 | MVP / ticket |
| FR-KULA-469 | HS-02 | AC-FR-KULA-469 | HS-C02 | MVP / ticket |


## Behaviour
- **HS-02 / AC-HS-02** — Identitas, tenant dan otorisasi per outlet. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-33 / AC-KPS-33** — Restricted cashier/admin/owner capabilities. Target: Cashier denied pricing edits and sensitive reports server-side; authorised override records actor and reason. Evidence: shared integration; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SHARED-FAQ.
- **FR-SENET-01 / AC-FR-SENET-01** — Cloud admin panel (CAP). Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Uji interpretasi sendiri: Browser-based admin hub holding PCs, game library, pricing, users; manage from anywhere. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/senet; yt:26EXyqvEFLw@00:36.
- **FR-SENET-45 / AC-FR-SENET-45** — Staff roles & permissions. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Uji interpretasi sendiri: Custom roles with granular permissions (manager vs cashier). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@09:06.
- **F001 / AC-F001** — Tenant isolation. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Asersi spesifik: Tenant isolation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F001; others=Revres Play [R1].
- **F156 / AC-F156** — Role-based permissions. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Asersi spesifik: Role-based permissions diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F156; others=Revres Play [R1]; Omegasoft [O1].
- **F157 / AC-F157** — Branch-scoped staff access. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Asersi spesifik: Branch-scoped staff access diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F157; others=Revres Play [R1].
- **FR-KULA-228 / AC-FR-KULA-228** — Identitas, tenant dan otorisasi per outlet — referensi FR-KULA-228. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Target rincian sendiri: Staff grants mengontrol endpoint dan menu; menyembunyikan menu saja tidak memenuhi otorisasi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `settings-staff-access`, public bundle).
- **FR-KULA-428 / AC-FR-KULA-428** — Identitas, tenant dan otorisasi per outlet — referensi FR-KULA-428. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-469 / AC-FR-KULA-469** — Identitas, tenant dan otorisasi per outlet — referensi FR-KULA-469. Target: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/identity/; services/api/src/tenancy/; apps/web/app/akses/; packages/domain/auth/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C02. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T01: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D02, D16; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
AUTH_FORBIDDEN

Design alias owned: HS-C02 — Identitas, tenant dan otorisasi per outlet.

Design alias owned: KPS-C01 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T01: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T46: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T46. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-01, HS-SCR-ADM-09, HS-SCR-ADM-18, HS-SCR-ADM-22, HS-SCR-ADM-23
Components: HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-052, HS-CMP-053
Touches (design primary): HS-SCR-ADM-22, HS-SCR-ADM-23, HS-CMP-052, HS-CMP-053
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D25: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.
