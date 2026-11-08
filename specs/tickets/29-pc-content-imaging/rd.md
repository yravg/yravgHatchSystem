# HS-T29 — Patching, image PC dan save portability

Status: **draft**
Mode: **solo**
Phase: V2

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-29 | HS-29 | AC-HS-29 | HS-C29 | V2 / deferred |
| FR-SENET-51 | HS-29 | AC-FR-SENET-51 | HS-C29 | V2 / deferred |
| FR-SENET-52 | HS-29 | AC-FR-SENET-52 | HS-C29 | V2 / deferred |
| FR-SENET-117 | HS-29 | AC-FR-SENET-117 | HS-C29 | V2 / deferred |
| F216 | HS-29 | AC-F216 | HS-C29 | V2 / deferred |
| F221 | HS-29 | AC-F221 | HS-C29 | V2 / deferred |


## Behaviour
- **HS-29 / AC-HS-29** — Patching, image PC dan save portability. Target: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-51 / AC-FR-SENET-51** — Game Update. Target: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Uji interpretasi sendiri: Auto/manual patching for Steam, Epic, Riot etc., targeted by venue/zone/PC, runs during sessions. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/game-update.
- **FR-SENET-52 / AC-FR-SENET-52** — SENET Boot diskless/hybrid. Target: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Uji interpretasi sendiri: PCs boot from server image; clean on reboot; snapshots; saves follow player. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/senet-boot; yt:o1Z9De7lMvI@-.
- **FR-SENET-117 / AC-FR-SENET-117** — Cloud game saves (offline games). Target: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Uji interpretasi sendiri: SENET Boot uploads offline-game saves per user and restores them on any PC. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:11916974117916.
- **F216 / AC-F216** — Windows game update orchestration. Target: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Asersi spesifik: Windows game update orchestration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F216; others=Smartlaunch [S1]; iCafeCloud [I1]; Gizmo [Z1].
- **F221 / AC-F221** — Diskless boot integration not reimplementation. Target: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Asersi spesifik: Diskless boot integration not reimplementation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F221; others=ggLeap [G1].

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
integrations/pc-imaging/; agents/windows-seat/Content/; apps/web/app/teknisi/image/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C29. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T27: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T28: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D18, D19; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C29 — Patching, image PC dan save portability.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T27: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T28: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-PCA-02
Components: HS-CMP-034, HS-CMP-043
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
