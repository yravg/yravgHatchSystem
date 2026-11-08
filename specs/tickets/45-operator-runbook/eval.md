# Eval HS-T45 — Runbook operator, sandbox dan bantuan

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 45` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-45.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-45 / AC-HS-45: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-SENET-65 / AC-FR-SENET-65: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Uji interpretasi sendiri: SENET engineers monitor, update, troubleshoot. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F274 / AC-F274: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Asersi spesifik: Operator training sandbox diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F280 / AC-F280: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Asersi spesifik: Agent simulator and fault-injection harness diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-147 / AC-FR-KULA-147: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-148 / AC-FR-KULA-148: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-149 / AC-FR-KULA-149: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-150 / AC-FR-KULA-150: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-151 / AC-FR-KULA-151: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-152 / AC-FR-KULA-152: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-153 / AC-FR-KULA-153: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-157 / AC-FR-KULA-157: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-161 / AC-FR-KULA-161: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-162 / AC-FR-KULA-162: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-164 / AC-FR-KULA-164: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-167 / AC-FR-KULA-167: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-249 / AC-FR-KULA-249: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Target rincian sendiri: Runbook bantuan dan contact support dapat dikonfigurasi; tidak menjanjikan support24/7 tanpa komitmen owner.
- [ ] FR-KULA-281 / AC-FR-KULA-281: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-326 / AC-FR-KULA-326: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-327 / AC-FR-KULA-327: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-385 / AC-FR-KULA-385: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-386 / AC-FR-KULA-386: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-463 / AC-FR-KULA-463: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.
- [ ] FR-KULA-466 / AC-FR-KULA-466: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.

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
| HS-V02-14 | HS-45 | AC-HS-V02-14 | HS-C45 | MVP / ticket |
- HS-V02-14 / AC-HS-V02-14: INPUT-STATUS derived from Senet videos/INDEX.md snapshot:70 unique=53videos+17webinars;17transcripts,4no-captions,49rate-limit retries. Preserve first71FR-SENET IDs and72..129. No claim watched/verified when only metadata available.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
