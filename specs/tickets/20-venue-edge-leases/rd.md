# HS-T20 — Venue edge, lease offline dan otoritas tunggal

Status: **draft**
Mode: **team**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-20 | HS-20 | AC-HS-20 | HS-C20 | MVP / ticket |
| FR-KPS-50 | HS-20 | AC-KPS-50 | HS-C20 | MVP / ticket |
| FR-KPS-51 | HS-20 | AC-KPS-51 | HS-C20 | MVP / ticket |
| FR-KPS-52 | HS-20 | AC-KPS-52 | HS-C20 | MVP / ticket |
| FR-KPS-64 | HS-20 | AC-KPS-64 | HS-C20 | MVP / ticket |
| FR-SENET-77 | HS-20 | AC-FR-SENET-77 | HS-C20 | MVP / ticket |
| F036 | HS-20 | AC-F036 | HS-C20 | MVP / ticket |
| F068 | HS-20 | AC-F068 | HS-C20 | MVP / ticket |
| F069 | HS-20 | AC-F069 | HS-C20 | MVP / ticket |
| F196 | HS-20 | AC-F196 | HS-C20 | MVP / ticket |
| F197 | HS-20 | AC-F197 | HS-C20 | MVP / ticket |
| F198 | HS-20 | AC-F198 | HS-C20 | MVP / ticket |
| F228 | HS-20 | AC-F228 | HS-C20 | MVP / ticket |
| F233 | HS-20 | AC-F233 | HS-C20 | MVP / ticket |
| F234 | HS-20 | AC-F234 | HS-C20 | MVP / ticket |
| F235 | HS-20 | AC-F235 | HS-C20 | MVP / ticket |
| F236 | HS-20 | AC-F236 | HS-C20 | MVP / ticket |
| F237 | HS-20 | AC-F237 | HS-C20 | MVP / ticket |
| F238 | HS-20 | AC-F238 | HS-C20 | MVP / ticket |
| F257 | HS-20 | AC-F257 | HS-C20 | MVP / ticket |
| FR-KULA-233 | HS-20 | AC-FR-KULA-233 | HS-C20 | MVP / ticket |
| FR-KULA-256 | HS-20 | AC-FR-KULA-256 | HS-C20 | MVP / ticket |
| FR-KULA-297 | HS-20 | AC-FR-KULA-297 | HS-C20 | MVP / ticket |
| HS-GAP-03 | HS-20 | AC-HS-GAP-03 | HS-C20 | MVP / ticket |
| HS-GAP-04 | HS-20 | AC-HS-GAP-04 | HS-C20 | MVP / ticket |


## Behaviour
- **HS-20 / AC-HS-20** — Venue edge, lease offline dan otoritas tunggal. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-50 / AC-KPS-50** — Boot/reboot and package-replacement recovery. Target: Reboot paired device with unexpired lease; recover correct remaining time, not the original full duration. Evidence: static; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1.
- **FR-KPS-51 / AC-KPS-51** — Local active timer continues during internet outage. Target: Disconnect internet halfway through fixed session; local expiry still locks and reconnect reconciles without granting extra time. Evidence: documented+static; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-01.
- **FR-KPS-52 / AC-KPS-52** — Realtime connection, heartbeats, acknowledgement and reconnect. Target: Drop socket and restore it; stale/out-of-order commands cannot roll back session revision and connection health is explicit. Evidence: static; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-01.
- **FR-KPS-64 / AC-KPS-64** — Local cashier queue and shared offline-sync integration. Target: Offline pending cash transaction syncs once; do not claim remote TV controls work while cloud is unreachable. Evidence: shared integration; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01; SHARED-FAQ.
- **FR-SENET-77 / AC-FR-SENET-77** — Console session survives TV/console restart. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Uji interpretasi sendiri: Active sessions are preserved after a console restart. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:20970824326300.
- **F036 / AC-F036** — Session recovery after agent reboot. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Session recovery after agent reboot diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F036; others=Not verified; proposed requirement.
- **F068 / AC-F068** — Offline cash sale. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Offline cash sale diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F068; others=Revres Play [R1]; PIKaPOS [P1]; Gizmo-provider [Z3].
- **F069 / AC-F069** — Offline digital-payment pending state. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Offline digital-payment pending state diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F069; others=Not verified; proposed requirement.
- **F196 / AC-F196** — Signed session lease and expiry. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Signed session lease and expiry diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F196; others=Not verified; proposed requirement.
- **F197 / AC-F197** — Tamper and clock rollback detection. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Tamper and clock rollback detection diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F197; others=Not verified; proposed requirement.
- **F198 / AC-F198** — Agent heartbeat and last-command ACK. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Agent heartbeat and last-command ACK diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F198; others=Not verified; proposed requirement.
- **F228 / AC-F228** — Raspberry Pi edge controller. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Raspberry Pi edge controller diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F228; others=Not verified; proposed requirement.
- **F233 / AC-F233** — Local venue session authority. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Local venue session authority diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F233; others=Gizmo-provider [Z3].
- **F234 / AC-F234** — Durable offline command queue. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Durable offline command queue diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F234; others=Not verified; proposed requirement.
- **F235 / AC-F235** — Reconnect event reconciliation. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Reconnect event reconciliation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F235; others=Not verified; proposed requirement.
- **F236 / AC-F236** — Duplicate command idempotency. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Duplicate command idempotency diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F236; others=Not verified; proposed requirement.
- **F237 / AC-F237** — Stale command and replay rejection. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Stale command and replay rejection diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F237; others=Not verified; proposed requirement.
- **F238 / AC-F238** — Sequence-numbered station state. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Sequence-numbered station state diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F238; others=Not verified; proposed requirement.
- **F257 / AC-F257** — Power outage recovery. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Asersi spesifik: Power outage recovery diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F257; others=Not verified; proposed requirement.
- **FR-KULA-233 / AC-FR-KULA-233** — Venue edge, lease offline dan otoritas tunggal — referensi FR-KULA-233. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Target rincian sendiri: Offline UI menampilkan queued/unconfirmed; sync idempotent, offline monetary authority mengikuti allowance D07, bukan klaim full POS otomatis. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-256 / AC-FR-KULA-256** — Venue edge, lease offline dan otoritas tunggal — referensi FR-KULA-256. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Target rincian sendiri: State disinkronkan melalui API+Postgres milik yravg; tidak bergantung backend vendor atau wajib Supabase. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/trik-meningkatkan-omset-rental-ps-tv-billing-otomatis.
- **FR-KULA-297 / AC-FR-KULA-297** — Venue edge, lease offline dan otoritas tunggal — referensi FR-KULA-297. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **HS-GAP-03 / AC-HS-GAP-03** — Lease offline bertanda tangan dan reboot-safe deadline. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.
- **HS-GAP-04 / AC-HS-GAP-04** — Rekonsiliasi offline deterministik tanpa double charge. Target: SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
agents/venue-edge/; services/api/src/edge/; packages/contracts/leases/; tests/faults/edge/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C20. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T01: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T19: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D06, D07, D09; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
OFFLINE_ACTION_UNAVAILABLE, LEASE_EXPIRED, COMMAND_STALE

Design alias owned: HS-C20 — Venue edge, lease offline dan otoritas tunggal.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T01: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T19: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T50: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T50. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-ADP-01, HS-SCR-CSH-01, HS-SCR-CSH-05, HS-SCR-CSH-11, HS-SCR-GWY-01, HS-SCR-GWY-02, HS-SCR-TVA-07, HS-SCR-TVA-10
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-029, HS-CMP-030, HS-CMP-031, HS-CMP-033, HS-CMP-036, HS-CMP-045, HS-CMP-057, HS-CMP-058
Touches (design primary): HS-SCR-CSH-11, HS-SCR-TVA-07, HS-SCR-GWY-01, HS-SCR-GWY-02, HS-CMP-019, HS-CMP-036, HS-CMP-045
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D27: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

Decision blocker D28: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
