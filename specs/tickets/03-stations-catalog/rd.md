# HS-T03 — Katalog stasiun, aset, zona dan denah

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-03 | HS-03 | AC-HS-03 | HS-C03 | MVP / ticket |
| FR-KPS-01 | HS-03 | AC-KPS-01 | HS-C03 | MVP / ticket |
| FR-KPS-02 | HS-03 | AC-KPS-02 | HS-C03 | MVP / ticket |
| FR-KPS-03 | HS-03 | AC-KPS-03 | HS-C03 | MVP / ticket |
| FR-SENET-06 | HS-03 | AC-FR-SENET-06 | HS-C03 | MVP / ticket |
| FR-SENET-08 | HS-03 | AC-FR-SENET-08 | HS-C03 | MVP / ticket |
| FR-SENET-62 | HS-03 | AC-FR-SENET-62 | HS-C03 | MVP / ticket |
| FR-SENET-113 | HS-03 | AC-FR-SENET-113 | HS-C03 | MVP / ticket |
| F002 | HS-03 | AC-F002 | HS-C03 | MVP / ticket |
| F003 | HS-03 | AC-F003 | HS-C03 | MVP / ticket |
| F004 | HS-03 | AC-F004 | HS-C03 | MVP / ticket |
| F005 | HS-03 | AC-F005 | HS-C03 | MVP / ticket |
| F007 | HS-03 | AC-F007 | HS-C03 | MVP / ticket |
| F008 | HS-03 | AC-F008 | HS-C03 | MVP / ticket |
| F009 | HS-03 | AC-F009 | HS-C03 | MVP / ticket |
| F010 | HS-03 | AC-F010 | HS-C03 | MVP / ticket |
| F011 | HS-03 | AC-F011 | HS-C03 | MVP / ticket |
| F012 | HS-03 | AC-F012 | HS-C03 | MVP / ticket |
| F013 | HS-03 | AC-F013 | HS-C03 | MVP / ticket |
| F072 | HS-03 | AC-F072 | HS-C03 | MVP / ticket |
| F283 | HS-03 | AC-F283 | HS-C03 | V2 / deferred |
| FR-KULA-382 | HS-03 | AC-FR-KULA-382 | HS-C03 | MVP / ticket |
| FR-KULA-426 | HS-03 | AC-FR-KULA-426 | HS-C03 | MVP / ticket |


## Behaviour
- **HS-03 / AC-HS-03** — Katalog stasiun, aset, zona dan denah. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-01 / AC-KPS-01** — Rental service products with minute/hour/day price basis and separate cost basis. Target: Create a service at IDR 12,000/hour and IDR 4,000 cost/hour; rental picker includes it and report separates sales from cost. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 00:06–01:42.
- **FR-KPS-02 / AC-KPS-02** — Named unit/table/room mapped to rentable product. Target: Create PS5 Room A linked to hourly service; station card shows that service and its rate. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 01:49–02:30.
- **FR-KPS-03 / AC-KPS-03** — Multi-console selection on one shared table. Target: Configure PS4 and PS5 at one table; choose PS5 for a session and preserve that console identity in history. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-SENET-06 / AC-FR-SENET-06** — Venue map. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Uji interpretasi sendiri: Drag floor plan of PCs/consoles/VR; live free/in-session/reserved status. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@02:56.
- **FR-SENET-08 / AC-FR-SENET-08** — Zones. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Uji interpretasi sendiri: Group devices (hardware tier, VIP room, console zone) with own rates and content. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@03:49.
- **FR-SENET-62 / AC-FR-SENET-62** — VR stations. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Uji interpretasi sendiri: VR placed on map and managed like other devices. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@03:17.
- **FR-SENET-113 / AC-FR-SENET-113** — Map interior elements & mobile map. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Uji interpretasi sendiri: Walls, reception, couches, tables placed on the map (not billed); map usable on mobile by press-and-hold. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:19524801878940; help:20970824326300.
- **F002 / AC-F002** — Outlet setup. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Outlet setup diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F002; others=Not verified; proposed requirement.
- **F003 / AC-F003** — Outlet timezone and business-day cutoff. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Outlet timezone and business-day cutoff diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F003; others=Not verified; proposed requirement.
- **F004 / AC-F004** — Zone and floor layout. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Zone and floor layout diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F004; others=Not verified; proposed requirement.
- **F005 / AC-F005** — Station type PS4 PS5 Xbox Switch PC VR. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Station type PS4 PS5 Xbox Switch PC VR diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F005; others=Not verified; proposed requirement.
- **F007 / AC-F007** — Station online offline heartbeat. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Station online offline heartbeat diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F007; others=Not verified; proposed requirement.
- **F008 / AC-F008** — Available occupied paused expired status. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Available occupied paused expired status diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F008; others=Not verified; proposed requirement.
- **F009 / AC-F009** — Maintenance unavailable status. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Maintenance unavailable status diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F009; others=Not verified; proposed requirement.
- **F010 / AC-F010** — Station photo and label. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Station photo and label diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F010; others=CECO [C1].
- **F011 / AC-F011** — Station search and filters. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Station search and filters diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F011; others=CECO [C1].
- **F012 / AC-F012** — Multi-console assignment per table. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Multi-console assignment per table diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F012; others=Not verified; proposed requirement.
- **F013 / AC-F013** — Separate TV console controller asset records. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Separate TV console controller asset records diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F013; others=Not verified; proposed requirement.
- **F072 / AC-F072** — Game catalogue per venue. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Game catalogue per venue diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F072; others=Not verified; proposed requirement.
- **F283 / AC-F283** — Maintenance service tickets. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Asersi spesifik: Maintenance service tickets diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F283; others=Not verified; proposed requirement.
- **FR-KULA-382 / AC-FR-KULA-382** — Katalog stasiun, aset, zona dan denah — referensi FR-KULA-382. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-426 / AC-FR-KULA-426** — Katalog stasiun, aset, zona dan denah — referensi FR-KULA-426. Target: Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/stations/; apps/web/app/stasiun/; packages/domain/station/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C03. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C03 — Katalog stasiun, aset, zona dan denah.

Design alias owned: KPS-C02 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T47: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T47. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-02, HS-SCR-ADM-13, HS-SCR-ADM-17, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-14, HS-SCR-CUS-01, HS-SCR-LBY-01
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-013, HS-CMP-019, HS-CMP-022, HS-CMP-023, HS-CMP-040, HS-CMP-049, HS-CMP-050, HS-CMP-058
Touches (design primary): HS-SCR-CSH-01, HS-SCR-ADM-02, HS-CMP-001, HS-CMP-002
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
