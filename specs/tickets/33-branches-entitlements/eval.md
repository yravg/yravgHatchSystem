# Eval HS-T33 — Multi-cabang, konfigurasi dan entitlement sendiri

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 33` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-33.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-33 / AC-HS-33: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KPS-32 / AC-KPS-32: Owner switches authorised outlet; sessions and takings are scoped, with no cross-tenant access.
- [ ] FR-KPS-67 / AC-KPS-67: At approved sandbox unit/agent cap next activation returns explicit plan gate; hardware capability is never inferred from plan purchase.
- [ ] FR-SENET-02 / AC-FR-SENET-02: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Uji interpretasi sendiri: One account runs several venues; sync settings, news, pricing, content across locations. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-39 / AC-FR-SENET-39: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Uji interpretasi sendiri: Venue enables/disables top-ups, passes, bookings, notifications. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-74 / AC-FR-SENET-74: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Uji interpretasi sendiri: Console management is a paid add-on sized by device count (Edit subscription → Prepare invoice). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F177 / AC-F177: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Asersi spesifik: Branch comparison diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F270 / AC-F270: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Asersi spesifik: Franchise consolidated reporting diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-238 / AC-FR-KULA-238: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Target rincian sendiri: Dashboard cabang memisahkan outlet dan membandingkan metric seragam tanpa data tenant lain.
- [ ] FR-KULA-248 / AC-FR-KULA-248: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Target rincian sendiri: Own entitlement changes efektif berversi; tidak meniru harga/kuota atau menagih subscription live.
- [ ] FR-KULA-427 / AC-FR-KULA-427: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-433 / AC-FR-KULA-433: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-438 / AC-FR-KULA-438: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-442 / AC-FR-KULA-442: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-456 / AC-FR-KULA-456: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-488 / AC-FR-KULA-488: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-500 / AC-FR-KULA-500: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.
- [ ] FR-KULA-517 / AC-FR-KULA-517: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: PLAN_LIMIT, assert status/code/messageKey tanpa rahasia.
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
