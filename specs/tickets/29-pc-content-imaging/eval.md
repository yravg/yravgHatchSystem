# Eval HS-T29 — Patching, image PC dan save portability

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 29` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-29.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
4. `dotnet test` di solusi Windows relevan; flow lock/login/reboot/cleanup pada Windows11 VM lalu mesin pilot. Jangan menganggap screenshot browser menguji Windows service.

## Acceptance per requirement
- [ ] HS-29 / AC-HS-29: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher.
- [ ] FR-SENET-51 / AC-FR-SENET-51: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Uji interpretasi sendiri: Auto/manual patching for Steam, Epic, Riot etc., targeted by venue/zone/PC, runs during sessions. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-52 / AC-FR-SENET-52: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Uji interpretasi sendiri: PCs boot from server image; clean on reboot; snapshots; saves follow player. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-117 / AC-FR-SENET-117: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Uji interpretasi sendiri: SENET Boot uploads offline-game saves per user and restores them on any PC. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F216 / AC-F216: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Asersi spesifik: Windows game update orchestration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F221 / AC-F221: Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher. Asersi spesifik: Diskless boot integration not reimplementation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.

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
