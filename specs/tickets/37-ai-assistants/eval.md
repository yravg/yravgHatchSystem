# Eval HS-T37 — AI helper dengan preview dan persetujuan

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 37` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-37.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-37 / AC-HS-37: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-041 / AC-FR-KULA-041: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-042 / AC-FR-KULA-042: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-043 / AC-FR-KULA-043: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-044 / AC-FR-KULA-044: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-045 / AC-FR-KULA-045: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-242 / AC-FR-KULA-242: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-243 / AC-FR-KULA-243: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-244 / AC-FR-KULA-244: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-245 / AC-FR-KULA-245: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-246 / AC-FR-KULA-246: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-423 / AC-FR-KULA-423: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-429 / AC-FR-KULA-429: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-444 / AC-FR-KULA-444: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-445 / AC-FR-KULA-445: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-446 / AC-FR-KULA-446: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-447 / AC-FR-KULA-447: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-448 / AC-FR-KULA-448: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-449 / AC-FR-KULA-449: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-450 / AC-FR-KULA-450: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-471 / AC-FR-KULA-471: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-472 / AC-FR-KULA-472: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-475 / AC-FR-KULA-475: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-487 / AC-FR-KULA-487: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-510 / AC-FR-KULA-510: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.
- [ ] FR-KULA-516 / AC-FR-KULA-516: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: shared AUTH_FORBIDDEN dan validation envelope, assert status/code/messageKey tanpa rahasia.
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

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.
