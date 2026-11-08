# Eval HS-T24 — Kesehatan fleet, update bertanda tangan dan rollback

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 24` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-24.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
4. Native: `./gradlew testDebugUnitTest assembleDebug` di agent Kotlin yang relevan atau `dotnet test` pada agent .NET. Uji fisik model/firmware/topologi memakai hardware-lab; simulator membuktikan protocol saja, tidak meluluskan picture control. Tanpa perangkat: tandai BLOCKED_HARDWARE dan jangan done.

## Acceptance per requirement
- [ ] HS-24 / AC-HS-24: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control.
- [ ] FR-KPS-53 / AC-KPS-53: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Bukan salinan konstanta internal vendor.
- [ ] FR-KPS-54 / AC-KPS-54: Mock update manifest and signed payload; reject bad hash/signature and do not install in active session without explicit approved policy.
- [ ] FR-SENET-59 / AC-FR-SENET-59: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Uji interpretasi sendiri: Per-console performance tracking, disconnection alerts, snapshot recovery. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F254 / AC-F254: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Asersi spesifik: Signed agent updates diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F281 / AC-F281: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Asersi spesifik: Health alerts for controller batteries diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] HS-GAP-09 / AC-HS-GAP-09: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: UPDATE_REJECTED, assert status/code/messageKey tanpa rahasia.
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
| HS-V02-18 | HS-24 | AC-HS-V02-18 | HS-C24 | V1 / ticket |
- HS-V02-18 / AC-HS-V02-18: Own websocket preferred; bounded jittered backoff fallback uses state/network and documented budget. v0.1 30second fallback is a fixture not universal constant; unpaired cadence observed~3.352s competitor is provenance, not own default. No request amplification on boot/offline; retain ACK and lease deadline independent of network polling.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.
