# Eval HS-T07 — QRIS Midtrans sandbox dan rekonsiliasi

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 07` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-07.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-07 / AC-HS-07: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau.
- [ ] FR-KPS-35 / AC-KPS-35: QRIS/transfer tampil pending sampai settlement Midtrans sandbox diverifikasi server; pemilihan metode atau screenshot tidak pernah dianggap paid. Cash manual dicatat dengan aktor.
- [ ] FR-SENET-23 / AC-FR-SENET-23: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Uji interpretasi sendiri: Regional gateways (Stripe, Square, Mercado Pago, MoMo, Kaspi, Payme, KakaoPay, LiqPay, Papara, etc.) enabled via support. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F047 / AC-F047: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Refund or credit when device activation fails diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F050 / AC-F050: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: QRIS payment recording diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F051 / AC-F051: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Dynamic QRIS verified webhook diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F052 / AC-F052: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: E-wallet payments diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F060 / AC-F060: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Payment expiry and late settlement diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F061 / AC-F061: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Webhook signature verification diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F062 / AC-F062: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Webhook deduplication diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F063 / AC-F063: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Settlement reconciliation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F064 / AC-F064: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Never accept screenshot as payment proof diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F070 / AC-F070: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau. Asersi spesifik: Payment provider outage fallback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-294 / AC-FR-KULA-294: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau.
- [ ] FR-KULA-333 / AC-FR-KULA-333: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau.
- [ ] FR-KULA-435 / AC-FR-KULA-435: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau.
- [ ] FR-KULA-494 / AC-FR-KULA-494: Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: PAYMENT_UNCONFIRMED, REFUND_PENDING, assert status/code/messageKey tanpa rahasia.
- [ ] V2 alias yang ditunda tetap disabled/absent dalam release MVP/V1 dan tercatat alasan, bukan TODO tersembunyi.

## Evidence
Simpan `evidence/requirements-evidence.json` dengan key setiap ID scope yang dikerjakan dan fields testPath,command,exitCode,expected,actual,artifact,verificationLevel. Tambahkan stdout lengkap, Playwright trace/screenshot layar penting dan note data fixture. Hardware: device model/firmware, topologi, permission, elapsed measurement dan rekaman; tanpa user PII/vendor assets. Catat ke results.md, jangan tulis PASS sebelum tes dijalankan.

## Definition of done
- [ ] Scope aktif di rd.md dipenuhi; alias/deferred tidak disalahhitung sebagai implementasi.
- [ ] Eval command benar-benar berjalan dan evidence dapat dibuka; tidak ada skipped test yang wajib.
- [ ] Migrasi forward+rollback teruji sandbox; secrets/log redaction dicek.
- [ ] Team contract disetujui sebelum worker paralel bila mode team.
- [ ] Router memeriksa eval; Merger integrasi; Checker uji flow dan tetangga pada hasil merge.
- [ ] Bug gagal dikirim kembali ke worker yang sama; Reproducer ulang2kali dengan evidence.
- [ ] Human-approved phase dan keputusan lock tidak dilanggar; board+rd berubah done hanya setelah bukti.

## Vector QRIS tambahan wajib
Uji serverKey≠signatureSecret; equal legacy values; rotation current+previous dalam bounded window; wrong signature/merchant/amount/currency/order; duplicate dan pending-after-settlement; GET status timeout; settle-after-booking-expiry; refund_pending bukan refunded. Assert ledger credit once, station tidak aktif tanpa approved ACK, secrets tidak di log.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.
