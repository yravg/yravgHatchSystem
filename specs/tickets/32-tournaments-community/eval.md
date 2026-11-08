# Eval HS-T32 — Turnamen, bracket dan komunitas

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 32` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-32.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-32 / AC-HS-32: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam.
- [ ] FR-KPS-58 / AC-KPS-58: Eligible member session accrues approved scoring duration; leaderboard and greeting reflect opted-in display identity.
- [ ] FR-KPS-59 / AC-KPS-59: Create four-player tournament; advance match winners and reserve a compatible station without overlapping active rental.
- [ ] FR-SENET-69 / AC-FR-SENET-69: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Uji interpretasi sendiri: Blog covers hosting tournaments; no tournament module confirmed on product pages. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F141 / AC-F141: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Tournament registration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F142 / AC-F142: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Tournament entry fees diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F143 / AC-F143: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Single elimination bracket diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F144 / AC-F144: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Double elimination bracket diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F145 / AC-F145: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Round robin league diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F146 / AC-F146: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Score-based competition diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F147 / AC-F147: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Match scheduling to physical stations diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F148 / AC-F148: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Player check-in and no-shows diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F149 / AC-F149: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Seeding and byes diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F150 / AC-F150: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Result entry and dispute review diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F151 / AC-F151: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Prize accounting diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F152 / AC-F152: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Public bracket and leaderboard diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F153 / AC-F153: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Spectator display diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F154 / AC-F154: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Event station block booking diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F155 / AC-F155: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Community recurring leagues diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-260 / AC-FR-KULA-260: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Target rincian sendiri: Knockout4peserta terkait slot station; bundle fee+minuman lewat sale line dan result dispute diaudit.
- [ ] FR-KULA-383 / AC-FR-KULA-383: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam.
- [ ] FR-KULA-384 / AC-FR-KULA-384: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam.

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
