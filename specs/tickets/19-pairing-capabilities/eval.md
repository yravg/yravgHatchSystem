# Eval HS-T19 — Pairing aman dan capability probe

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 19` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-19.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
4. Native: `./gradlew testDebugUnitTest assembleDebug` di agent Kotlin yang relevan atau `dotnet test` pada agent .NET. Uji fisik model/firmware/topologi memakai hardware-lab; simulator membuktikan protocol saja, tidak meluluskan picture control. Tanpa perangkat: tandai BLOCKED_HARDWARE dan jangan done.

## Acceptance per requirement
- [ ] HS-19 / AC-HS-19: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap.
- [ ] FR-KPS-38 / AC-KPS-38: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Kode vendor4digit/10menit hanya observasi; spesifikasi sendiri8digit/5menit.
- [ ] FR-KPS-39 / AC-KPS-39: Select target HDMI port; ready card stores port and failed capability check cannot be shown as ready.
- [ ] FR-KPS-65 / AC-KPS-65: Agent without overlay/input capability shows setup-required, not connected-ready; UI offers safe manual billing only if approved.
- [ ] FR-SENET-73 / AC-FR-SENET-73: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Uji interpretasi sendiri: TV app shows a code; staff enter it in Map → Configuration → Settings → Activate; device becomes type Console in the default console zone. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F014 / AC-F014: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Agent capability and firmware inventory diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F184 / AC-F184: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Android TV pairing code diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F185 / AC-F185: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Pairing approval and short code expiry diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F186 / AC-F186: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Signed device identity and revocation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F189 / AC-F189: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: HDMI input switching capability probe diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F191 / AC-F191: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Overlay permission setup diagnostics diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-210 / AC-FR-KULA-210: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Target rincian sendiri: Pairing lewat challenge sekali pakai dan staff approval; own8digit/5minute fixture, permission probe wajib, bukan konstanta vendor.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: DEVICE_UNSUPPORTED, DEVICE_PERMISSION_REQUIRED, PAIRING_EXPIRED, assert status/code/messageKey tanpa rahasia.
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

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
