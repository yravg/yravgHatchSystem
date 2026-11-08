# HS-T07 — QRIS Midtrans sandbox dan rekonsiliasi

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-07 | HS-07 | AC-HS-07 | HS-C07 | MVP / ticket |
| FR-KPS-35 | HS-07 | AC-KPS-35 | HS-C07 | MVP / ticket |
| FR-SENET-23 | HS-07 | AC-FR-SENET-23 | HS-C07 | MVP / ticket |
| F047 | HS-07 | AC-F047 | HS-C07 | MVP / ticket |
| F050 | HS-07 | AC-F050 | HS-C07 | MVP / ticket |
| F051 | HS-07 | AC-F051 | HS-C07 | MVP / ticket |
| F052 | HS-07 | AC-F052 | HS-C07 | MVP / ticket |
| F060 | HS-07 | AC-F060 | HS-C07 | MVP / ticket |
| F061 | HS-07 | AC-F061 | HS-C07 | MVP / ticket |
| F062 | HS-07 | AC-F062 | HS-C07 | MVP / ticket |
| F063 | HS-07 | AC-F063 | HS-C07 | MVP / ticket |
| F064 | HS-07 | AC-F064 | HS-C07 | MVP / ticket |
| F070 | HS-07 | AC-F070 | HS-C07 | MVP / ticket |
| FR-KULA-294 | HS-07 | AC-FR-KULA-294 | HS-C07 | MVP / ticket |
| FR-KULA-333 | HS-07 | AC-FR-KULA-333 | HS-C07 | MVP / ticket |
| FR-KULA-435 | HS-07 | AC-FR-KULA-435 | HS-C07 | MVP / ticket |
| FR-KULA-494 | HS-07 | AC-FR-KULA-494 | HS-C07 | MVP / ticket |


## Behaviour
- **HS-07 / AC-HS-07** — QRIS Midtrans sandbox dan rekonsiliasi. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-35 / AC-KPS-35** — Cash, QRIS and transfer method integration. Target: QRIS/transfer tampil pending sampai settlement Midtrans sandbox diverifikasi server; pemilihan metode atau screenshot tidak pernah dianggap paid. Cash manual dicatat dengan aktor. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-24; SHARED-FAQ.
- **FR-SENET-23 / AC-FR-SENET-23** — Payment gateway integrations. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Uji interpretasi sendiri: Regional gateways (Stripe, Square, Mercado Pago, MoMo, Kaspi, Payme, KakaoPay, LiqPay, Papara, etc.) enabled via support. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/payments-systems; yt:9vyxKFZXNIk@00:25.
- **F047 / AC-F047** — Refund or credit when device activation fails. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Refund or credit when device activation fails diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F047; others=Not verified; proposed requirement.
- **F050 / AC-F050** — QRIS payment recording. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: QRIS payment recording diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F050; others=CECO [C1].
- **F051 / AC-F051** — Dynamic QRIS verified webhook. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Dynamic QRIS verified webhook diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F051; others=AlfSmartBilling [A1].
- **F052 / AC-F052** — E-wallet payments. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: E-wallet payments diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F052; others=CECO [C1].
- **F060 / AC-F060** — Payment expiry and late settlement. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Payment expiry and late settlement diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F060; others=Not verified; proposed requirement.
- **F061 / AC-F061** — Webhook signature verification. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Webhook signature verification diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F061; others=Not verified; proposed requirement.
- **F062 / AC-F062** — Webhook deduplication. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Webhook deduplication diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F062; others=Not verified; proposed requirement.
- **F063 / AC-F063** — Settlement reconciliation. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Settlement reconciliation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F063; others=Not verified; proposed requirement.
- **F064 / AC-F064** — Never accept screenshot as payment proof. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Never accept screenshot as payment proof diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F064; others=Not verified; proposed requirement.
- **F070 / AC-F070** — Payment provider outage fallback. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Payment provider outage fallback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F070; others=Not verified; proposed requirement.
- **FR-KULA-294 / AC-FR-KULA-294** — QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-294. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-333 / AC-FR-KULA-333** — QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-333. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-435 / AC-FR-KULA-435** — QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-435. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-494 / AC-FR-KULA-494** — QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-494. Target: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/payments/; services/worker/src/payments/; apps/web/app/pembayaran/qris/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C07. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D06, D15; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
PAYMENT_UNCONFIRMED, REFUND_PENDING

Design alias owned: HS-C07 — QRIS Midtrans sandbox dan rekonsiliasi.

## Kontrak provider wajib
CONTRACTS.md §6 normatif. Signature Secret Key terpisah dari ServerKey menurut access-keys28Oct2026; dokumen notification lama konflik. D15 harus menyelesaikan account/schema/vector sandbox sebelum ready. Tidak ada silent fallback key.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T48: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T48. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-08, HS-SCR-ADM-16, HS-SCR-ADM-24, HS-SCR-CFD-01, HS-SCR-CSH-02, HS-SCR-CSH-05, HS-SCR-CSH-14, HS-SCR-CUS-03, HS-SCR-KSK-04
Components: HS-CMP-004, HS-CMP-005, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-013, HS-CMP-015, HS-CMP-021, HS-CMP-023, HS-CMP-039, HS-CMP-042, HS-CMP-049, HS-CMP-050, HS-CMP-054, HS-CMP-058
Touches (design primary): HS-CMP-009
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
