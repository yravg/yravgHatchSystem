# HS-T28 — Katalog game dan integrasi lisensi sah

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-28 | HS-28 | AC-HS-28 | HS-C28 | V1 / ticket |
| FR-SENET-49 | HS-28 | AC-FR-SENET-49 | HS-C28 | V1 / ticket |
| FR-SENET-50 | HS-28 | AC-FR-SENET-50 | HS-C28 | V1 / ticket |
| FR-SENET-116 | HS-28 | AC-FR-SENET-116 | HS-C28 | V1 / ticket |
| F217 | HS-28 | AC-F217 | HS-C28 | V2 / deferred |
| F218 | HS-28 | AC-F218 | HS-C28 | V1 / ticket |


## Behaviour
- **HS-28 / AC-HS-28** — Katalog game dan integrasi lisensi sah. Target: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-49 / AC-FR-SENET-49** — Game library (content cards). Target: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Uji interpretasi sendiri: Ready-made game/app cards; categories; per zone/venue availability; age limits. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/game-update; yt:gNTC6Lg1LTE@00:00.
- **FR-SENET-50 / AC-FR-SENET-50** — Game licence pool. Target: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Uji interpretasi sendiri: Shared Steam/Epic accounts assigned to titles, or player's own login. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/game-update.
- **FR-SENET-116 / AC-FR-SENET-116** — Content display schedule & age limits. Target: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Uji interpretasi sendiri: Show/hide content by schedule; age restrictions. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: How to Set Up Content Display Schedule; Age Restrictions.
- **F217 / AC-F217** — Licensed game-account pool integration. Target: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Asersi spesifik: Licensed game-account pool integration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F217; others=ggLeap [G1]; iCafeCloud [I1]; Gizmo [Z1].
- **F218 / AC-F218** — Game launch concurrency limits. Target: Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian. Asersi spesifik: Game launch concurrency limits diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F218; others=iCafeCloud [I1].

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/games/; agents/windows-seat/Launcher/; apps/web/app/game/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C28. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T03: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T27: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D18; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C28 — Katalog game dan integrasi lisensi sah.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T03: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T27: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-02, HS-SCR-PCA-02
Components: HS-CMP-023, HS-CMP-034, HS-CMP-043
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
