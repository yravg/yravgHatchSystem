# HS-T38 — Pilot agent HP/tablet rental

Status: **draft**
Mode: **solo**
Phase: V2

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Device milik venue provisioned sah: allowlist game, timer dan expiry lock; DPC hanya model yang mendukung. Tidak menyadap data pelanggan; pilot label tegas. Tidak menyamakan APK TV dengan mobile. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-38 | HS-38 | AC-HS-38 | HS-C38 | V2 / deferred |
| FR-KPS-61 | HS-38 | AC-KPS-61 | HS-C38 | V2 / deferred |
| F222 | HS-38 | AC-F222 | HS-C38 | V2 / deferred |
| F223 | HS-38 | AC-F223 | HS-C38 | V2 / deferred |


## Behaviour
- **HS-38 / AC-HS-38** — Pilot agent HP/tablet rental. Target: Device milik venue provisioned sah: allowlist game, timer dan expiry lock; DPC hanya model yang mendukung. Tidak menyadap data pelanggan; pilot label tegas. Tidak menyamakan APK TV dengan mobile. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-61 / AC-KPS-61** — Android phone/tablet rental agent and game allowlist (pilot). Target: Prototype allowlisted game launch with timer and lock at end; product must label pilot/unsupported device honestly. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **F222 / AC-F222** — Android rental-phone allowed-game launcher. Target: Device milik venue provisioned sah: allowlist game, timer dan expiry lock; DPC hanya model yang mendukung. Tidak menyadap data pelanggan; pilot label tegas. Tidak menyamakan APK TV dengan mobile. Asersi spesifik: Android rental-phone allowed-game launcher diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F222; others=Not verified; proposed requirement.
- **F223 / AC-F223** — Android rental-phone kiosk expiry lock. Target: Device milik venue provisioned sah: allowlist game, timer dan expiry lock; DPC hanya model yang mendukung. Tidak menyadap data pelanggan; pilot label tegas. Tidak menyamakan APK TV dengan mobile. Asersi spesifik: Android rental-phone kiosk expiry lock diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F223; others=Not verified; proposed requirement.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
agents/android-mobile/; tests/hardware/android-mobile/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C38. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04, D11, D12; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C38 — Pilot agent HP/tablet rental.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-11, HS-SCR-MAG-01, HS-SCR-MAG-02
Components: HS-CMP-026, HS-CMP-044
Touches (design primary): HS-SCR-MAG-01, HS-SCR-MAG-02, HS-CMP-044
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
