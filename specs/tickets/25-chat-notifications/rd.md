# HS-T25 — Chat operator, alarm dan notifikasi berizin

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-25 | HS-25 | AC-HS-25 | HS-C25 | V1 / ticket |
| FR-KPS-55 | HS-25 | AC-KPS-55 | HS-C25 | V1 / ticket |
| FR-KPS-56 | HS-25 | AC-KPS-56 | HS-C25 | V1 / ticket |
| FR-SENET-25 | HS-25 | AC-FR-SENET-25 | HS-C25 | V1 / ticket |
| FR-SENET-44 | HS-25 | AC-FR-SENET-44 | HS-C25 | V1 / ticket |
| F094 | HS-25 | AC-F094 | HS-C25 | V1 / ticket |
| F095 | HS-25 | AC-F095 | HS-C25 | V1 / ticket |
| F284 | HS-25 | AC-F284 | HS-C25 | V2 / deferred |
| FR-KULA-039 | HS-25 | AC-FR-KULA-039 | HS-C25 | V1 / ticket |
| FR-KULA-262 | HS-25 | AC-FR-KULA-262 | HS-C25 | V1 / ticket |
| FR-KULA-283 | HS-25 | AC-FR-KULA-283 | HS-C25 | V1 / ticket |
| FR-KULA-325 | HS-25 | AC-FR-KULA-325 | HS-C25 | V1 / ticket |
| FR-KULA-443 | HS-25 | AC-FR-KULA-443 | HS-C25 | V1 / ticket |
| FR-KULA-518 | HS-25 | AC-FR-KULA-518 | HS-C25 | V1 / ticket |


## Behaviour
- **HS-25 / AC-HS-25** — Chat operator, alarm dan notifikasi berizin. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-55 / AC-KPS-55** — Cashier spoken/beep session warnings. Target: At threshold/end sound identifies station; denied browser audio permission gives visible warning and test button. Evidence: transcript+documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 01:52–01:57, 02:30–02:41; SRC-23.
- **FR-KPS-56 / AC-KPS-56** — Station QR chat with operator reply and audio alert. Target: Customer sends help request; assigned cashier gets station-tagged unread badge and can reply without exposing other stations. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-16.
- **FR-SENET-25 / AC-FR-SENET-25** — SMS/messaging integrations. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Uji interpretasi sendiri: SMS/Viber/email providers for codes and messages. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/payments-systems.
- **FR-SENET-44 / AC-FR-SENET-44** — Player–staff chat. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Uji interpretasi sendiri: Direct chat and remote assistance from Shell. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/pricing; https://senet.cloud/gaming-centers.
- **F094 / AC-F094** — Customer call operator. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Asersi spesifik: Customer call operator diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F094; others=Revres Play [R1].
- **F095 / AC-F095** — Customer cashier chat. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Asersi spesifik: Customer cashier chat diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F095; others=CECO [C1].
- **F284 / AC-F284** — Public status and incident notifications. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Asersi spesifik: Public status and incident notifications diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F284; others=Not verified; proposed requirement.
- **FR-KULA-039 / AC-FR-KULA-039** — Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-039. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Target rincian sendiri: Adapter Telegram default sandbox sink; aktivasi membutuhkan penerima/consent dan approval terpisah. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-262 / AC-FR-KULA-262** — Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-262. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Target rincian sendiri: Rekap shift menjadi preview notification; external recipient/connector/send memerlukan approval terpisah. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/7-strategi-jitu-menggandakan-omzet-rental-playstation-dan-mencegah-kebocoran-billing.
- **FR-KULA-283 / AC-FR-KULA-283** — Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-283. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-325 / AC-FR-KULA-325** — Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-325. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-443 / AC-FR-KULA-443** — Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-443. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-518 / AC-FR-KULA-518** — Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-518. Target: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/messages/; services/worker/src/notifications/; apps/web/app/bantuan/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C25. Jangan mengubah kontrak shared sepihak setelah freeze.

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

Design alias owned: HS-C25 — Chat operator, alarm dan notifikasi berizin.

Design alias owned: KPS-C14 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T05: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T14: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-13, HS-SCR-ADM-16, HS-SCR-CSH-01, HS-SCR-CSH-08, HS-SCR-CSH-10, HS-SCR-CUS-06, HS-SCR-OWN-01, HS-SCR-OWN-02, HS-SCR-PCA-03, HS-SCR-TVA-05
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-007, HS-CMP-017, HS-CMP-018, HS-CMP-019, HS-CMP-020, HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-034, HS-CMP-043
Touches (design primary): HS-SCR-CSH-10, HS-CMP-020
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
