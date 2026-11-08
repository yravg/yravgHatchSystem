# Eval HS-T02 — Identitas, tenant dan otorisasi per outlet

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 02` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-02.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-02 / AC-HS-02: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran.
- [ ] FR-KPS-33 / AC-KPS-33: Cashier denied pricing edits and sensitive reports server-side; authorised override records actor and reason.
- [ ] FR-SENET-01 / AC-FR-SENET-01: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Uji interpretasi sendiri: Browser-based admin hub holding PCs, game library, pricing, users; manage from anywhere. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-45 / AC-FR-SENET-45: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Uji interpretasi sendiri: Custom roles with granular permissions (manager vs cashier). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F001 / AC-F001: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Asersi spesifik: Tenant isolation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F156 / AC-F156: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Asersi spesifik: Role-based permissions diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F157 / AC-F157: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Asersi spesifik: Branch-scoped staff access diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-228 / AC-FR-KULA-228: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran. Target rincian sendiri: Staff grants mengontrol endpoint dan menu; menyembunyikan menu saja tidak memenuhi otorisasi.
- [ ] FR-KULA-428 / AC-FR-KULA-428: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran.
- [ ] FR-KULA-469 / AC-FR-KULA-469: Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: AUTH_FORBIDDEN, assert status/code/messageKey tanpa rahasia.
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
