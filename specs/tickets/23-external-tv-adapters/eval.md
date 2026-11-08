# Eval HS-T23 — Adapter CEC/HDMI/IR untuk LG dan Samsung

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 23` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-23.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
4. Native: `./gradlew testDebugUnitTest assembleDebug` di agent Kotlin yang relevan atau `dotnet test` pada agent .NET. Uji fisik model/firmware/topologi memakai hardware-lab; simulator membuktikan protocol saja, tidak meluluskan picture control. Tanpa perangkat: tandai BLOCKED_HARDWARE dan jangan done.

## Acceptance per requirement
- [ ] HS-23 / AC-HS-23: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM.
- [ ] FR-KPS-62 / AC-KPS-62: Record exact HDMI topology and approved box model; no blanket promise for ordinary Android STB without verified video/control path.
- [ ] FR-SENET-61 / AC-FR-SENET-61: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Uji interpretasi sendiri: HDMI hardware between console and TV, USB power, Wi-Fi hotspot setup, appears on map as Console. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-71 / AC-FR-SENET-71: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround.
- [ ] FR-SENET-79 / AC-FR-SENET-79: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround.
- [ ] FR-SENET-80 / AC-FR-SENET-80: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Uji interpretasi sendiri: Legacy HDMI box: own hotspot, setup page 192.168.4.1, enter Wi-Fi + org API domain, auto-authorises on the map; 2.4 GHz only. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-81 / AC-FR-SENET-81: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround.
- [ ] F200 / AC-F200: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: CEC TV power adapter diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F201 / AC-F201: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: IR TV power adapter diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F202 / AC-F202: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: HDMI switch blank-source fallback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F203 / AC-F203: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: TV-only smart plug fallback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F204 / AC-F204: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: Certified 4K120 HDR VRR HDMI path diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] HS-GAP-06 / AC-HS-GAP-06: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM.
- [ ] HS-GAP-07 / AC-HS-GAP-07: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM.

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

## MVP LG/Samsung checks
Uji named LG dan Samsung model/firmware via selected adapter, 4K120/HDR/VRR/HDCP/audio/eARC or explicit unsupported mode. No HDCP stripping, no console mains. Missing hardware = blocked, never certified.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
