# Eval HS-T39 — Feasibility native webOS dan Tizen

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 39` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-39.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
4. Native: `./gradlew testDebugUnitTest assembleDebug` di agent Kotlin yang relevan atau `dotnet test` pada agent .NET. Uji fisik model/firmware/topologi memakai hardware-lab; simulator membuktikan protocol saja, tidak meluluskan picture control. Tanpa perangkat: tandai BLOCKED_HARDWARE dan jangan done.

## Acceptance per requirement
- [ ] HS-39 / AC-HS-39: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API.
- [ ] FR-KPS-63 / AC-KPS-63: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API.
- [ ] FR-SENET-55 / AC-FR-SENET-55: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Klaim Samsung sumber bukan bukti setup/certified; Android tetap dimiliki T21, LG coming-soon bukan shipped.
- [ ] F224 / AC-F224: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Asersi spesifik: webOS foreground app prototype diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F225 / AC-F225: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Asersi spesifik: webOS supported HDMI control feasibility gate diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F226 / AC-F226: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Asersi spesifik: Tizen foreground HDMI PiP prototype diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-467 / AC-FR-KULA-467: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API.
- [ ] FR-KULA-468 / AC-FR-KULA-468: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API.

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
