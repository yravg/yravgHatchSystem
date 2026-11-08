# Eval HS-T26 — Billboard, customer display dan privasi

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 26` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-26.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-26 / AC-HS-26: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff.
- [ ] FR-KPS-57 / AC-KPS-57: Start/pause/stop unit; public billboard shows correct availability/countdown and approved redacted customer identity.
- [ ] F227 / AC-F227: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Asersi spesifik: Commercial signage kiosk integration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F232 / AC-F232: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Asersi spesifik: Lobby station availability billboard diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F278 / AC-F278: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Asersi spesifik: Permission-sensitive lobby privacy diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-259 / AC-FR-KULA-259: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff. Target rincian sendiri: Waiting-room display read-only menyatakan station/status/remaining yang aman, promo own content dan alias opt-in.
- [ ] FR-KULA-273 / AC-FR-KULA-273: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff.
- [ ] FR-KULA-285 / AC-FR-KULA-285: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff.
- [ ] FR-KULA-379 / AC-FR-KULA-379: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff.
- [ ] FR-KULA-380 / AC-FR-KULA-380: Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff.

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
