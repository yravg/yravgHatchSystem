# Eval HS-T22 — Remote TV aman, timer dan media sendiri

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 22` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-22.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
4. Native: `./gradlew testDebugUnitTest assembleDebug` di agent Kotlin yang relevan atau `dotnet test` pada agent .NET. Uji fisik model/firmware/topologi memakai hardware-lab; simulator membuktikan protocol saja, tidak meluluskan picture control. Tanpa perangkat: tandai BLOCKED_HARDWARE dan jangan done.

## Acceptance per requirement
- [ ] HS-22 / AC-HS-22: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman.
- [ ] FR-KPS-45 / AC-KPS-45: At approved warning threshold show once; operator message is escaped and cannot execute markup.
- [ ] FR-KPS-46 / AC-KPS-46: Send volume command to selected unit; action is acknowledged or explicit unsupported error is returned.
- [ ] FR-KPS-47 / AC-KPS-47: Sleep idle unit, then wake; active-session sleep is refused; distinguish blackout overlay from actual hardware standby.
- [ ] FR-KPS-48 / AC-KPS-48: Authorised restart/manual input action logs actor and result; never permanently discards live session lease.
- [ ] FR-KPS-49 / AC-KPS-49: Upload own permitted image via shared media flow; disconnected agent keeps cached safe background, not vendor art.
- [ ] FR-SENET-07 / AC-FR-SENET-07: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Uji interpretasi sendiri: From map: start/end session, logout, lock/unlock, sell pass, power on/off, remote connect; multi-select. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-75 / AC-FR-SENET-75: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Uji interpretasi sendiri: Send messages to a console screen from the map. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-76 / AC-FR-SENET-76: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Uji interpretasi sendiri: Custom image (≤10 MB) for the TV app login screen, set in Sign-in experience. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F199 / AC-F199: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Asersi spesifik: TV volume and mute control diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-213 / AC-FR-KULA-213: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Target rincian sendiri: Aksi remote input/volume/mute memeriksa capability, actor dan session safety; response unsupported bukan fake success.

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
