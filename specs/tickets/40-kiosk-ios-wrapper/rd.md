# HS-T40 — Kios mandiri dan coverage iOS

Status: **draft**
Mode: **solo**
Phase: V2

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Customer PWA diuji Safari iPhone/iPad untuk booking/order/receipt; native iOS hanya jika push/peripheral membuktikan kebutuhan. Kios managed owned device reset token setelah transaksi; tidak menyimpan data kartu. App-store publish tetap di luar izin. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-40 | HS-40 | AC-HS-40 | HS-C40 | V2 / deferred |
| FR-SENET-70 | HS-40 | AC-FR-SENET-70 | HS-C40 | V2 / deferred |
| F231 | HS-40 | AC-F231 | HS-C40 | V2 / deferred |
| FR-KULA-315 | HS-40 | AC-FR-KULA-315 | HS-C40 | V2 / deferred |


## Behaviour
- **HS-40 / AC-HS-40** — Kios mandiri dan coverage iOS. Target: Customer PWA diuji Safari iPhone/iPad untuk booking/order/receipt; native iOS hanya jika push/peripheral membuktikan kebutuhan. Kios managed owned device reset token setelah transaksi; tidak menyimpan data kartu. App-store publish tetap di luar izin. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-70 / AC-FR-SENET-70** — Kiosk / self-service terminal. Target: Customer PWA diuji Safari iPhone/iPad untuk booking/order/receipt; native iOS hanya jika push/peripheral membuktikan kebutuhan. Kios managed owned device reset token setelah transaksi; tidak menyimpan data kartu. App-store publish tetap di luar izin. Uji interpretasi sendiri: QR login explicitly needs no kiosk; dedicated kiosk app UNKNOWN. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: pending verification; sumber: https://senet.cloud/mobile-app.
- **F231 / AC-F231** — Self-service kiosk. Target: Customer PWA diuji Safari iPhone/iPad untuk booking/order/receipt; native iOS hanya jika push/peripheral membuktikan kebutuhan. Kios managed owned device reset token setelah transaksi; tidak menyimpan data kartu. App-store publish tetap di luar izin. Asersi spesifik: Self-service kiosk diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F231; others=Not verified; proposed requirement.
- **FR-KULA-315 / AC-FR-KULA-315** — Kios mandiri dan coverage iOS — referensi FR-KULA-315. Target: Customer PWA diuji Safari iPhone/iPad untuk booking/order/receipt; native iOS hanya jika push/peripheral membuktikan kebutuhan. Kios managed owned device reset token setelah transaksi; tidak menyimpan data kartu. App-store publish tetap di luar izin. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
apps/web/app/kios/; apps/mobile-wrapper/; tests/e2e/ios/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C40. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T13: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T26: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D11, D19; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C40 — Kios mandiri dan coverage iOS.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T13: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T26: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-KSK-01, HS-SCR-KSK-02, HS-SCR-KSK-03, HS-SCR-KSK-04, HS-SCR-KSK-05
Components: HS-CMP-039
Touches (design primary): HS-SCR-KSK-01, HS-SCR-KSK-02, HS-SCR-KSK-03, HS-SCR-KSK-04, HS-SCR-KSK-05, HS-CMP-039
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
