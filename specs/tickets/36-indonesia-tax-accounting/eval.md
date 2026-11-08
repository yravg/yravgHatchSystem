# Eval HS-T36 — Akuntansi dan laporan pajak Indonesia

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 36` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-36.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-36 / AC-HS-36: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis.
- [ ] FR-SENET-12 / AC-FR-SENET-12: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Uji interpretasi sendiri: Billing rules, cashier config, tax settings (detail UNKNOWN). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-24 / AC-FR-SENET-24: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Uji interpretasi sendiri: Software cash register integrations (vendor names on page). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F182 / AC-F182: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Asersi spesifik: Accounting export diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F183 / AC-F183: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Asersi spesifik: Tax and service charge settings diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-002 / AC-FR-KULA-002: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Target rincian sendiri: Pemetaan akun dan pajak berversi dapat diekspor sebagai draft untuk review akuntan.
- [ ] FR-KULA-003 / AC-FR-KULA-003: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Target rincian sendiri: Jurnal memiliki debit=kredit dan saldo akun dapat direkonsiliasi ke sumber transaksi.
- [ ] FR-KULA-004 / AC-FR-KULA-004: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis. Target rincian sendiri: Export Coretax berlabel draft menyatakan schema dan periode, tanpa pengiriman ke DJP.
- [ ] FR-KULA-388 / AC-FR-KULA-388: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis.
- [ ] FR-KULA-393 / AC-FR-KULA-393: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis.
- [ ] FR-KULA-470 / AC-FR-KULA-470: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis.
- [ ] FR-KULA-479 / AC-FR-KULA-479: General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis.

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
