# Eval HS-T44 — Konten venue, feedback dan Bahasa Indonesia

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 44` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-44.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-44 / AC-HS-44: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.
- [ ] FR-SENET-40 / AC-FR-SENET-40: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Uji interpretasi sendiri: Posts with availability period shown in Shell and app; push. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-66 / AC-FR-SENET-66: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Uji interpretasi sendiri: Advertising placements across SENET ecosystem. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-114 / AC-FR-SENET-114: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Uji interpretasi sendiri: Embed a Google Form survey in Shell (set up via support); session keeps running. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-125 / AC-FR-SENET-125: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Uji interpretasi sendiri: Includes Arabic and Slovenian additions plus EN/RU/UK/ES/PT/TR/VI help locales; Indonesian not found. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F275 / AC-F275: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Asersi spesifik: Indonesian English localization diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F276 / AC-F276: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Asersi spesifik: Accessible keyboard and TV D-pad navigation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F277 / AC-F277: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah. Asersi spesifik: Reduced motion support diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-284 / AC-FR-KULA-284: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.
- [ ] FR-KULA-316 / AC-FR-KULA-316: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.
- [ ] FR-KULA-336 / AC-FR-KULA-336: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.
- [ ] FR-KULA-420 / AC-FR-KULA-420: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.
- [ ] FR-KULA-421 / AC-FR-KULA-421: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.
- [ ] FR-KULA-503 / AC-FR-KULA-503: Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.

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

## v0.2 own requirement crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-V02-16 | HS-44 | AC-HS-V02-16 | HS-C44 | V1 / ticket |
- HS-V02-16 / AC-HS-V02-16: Bahasa default for all errors/labels/receipts/TV/customer, no competitor text or hardcoded English. IDR format and outlet timezone consistent; English optional. Screen-reader/focus/D-pad and reduced-motion tests on mapped final screens.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.
