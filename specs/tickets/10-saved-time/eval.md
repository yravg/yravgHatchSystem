# Eval HS-T10 — Tabungan waktu, penebusan dan kedaluwarsa

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 10` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-10.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-10 / AC-HS-10: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama.
- [ ] FR-KPS-22 / AC-KPS-22: Paid 120-minute session stops after 45; save 75 minutes exactly once, subject to approved granularity.
- [ ] FR-KPS-23 / AC-KPS-23: Redeem 30 of 75 saved minutes; balance becomes 45 and replay of redemption cannot double-spend.
- [ ] FR-KPS-24 / AC-KPS-24: Approved 30-day test bucket becomes unavailable at expiry; expired and usable balances are shown separately.
- [ ] FR-SENET-89 / AC-FR-SENET-89: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Uji interpretasi sendiri: A pass from a lower-level zone can't be used in a higher-level zone; higher-level passes work in lower zones. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F033 / AC-F033: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Asersi spesifik: Saved unused time credit diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F034 / AC-F034: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Asersi spesifik: Separate time balances by station category diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F035 / AC-F035: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Asersi spesifik: Time-credit expiry rules diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-208 / AC-FR-KULA-208: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Target rincian sendiri: Sisa durasi paket lunas ditabung hanya ke member yang benar, tepat satu kali saat stop eligible.
- [ ] FR-KULA-211 / AC-FR-KULA-211: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Target rincian sendiri: Pause menyimpan remaining; stop eligible membuat time bucket, sesi berikut redeem atomik dan expiry/category diperiksa.
- [ ] FR-KULA-261 / AC-FR-KULA-261: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Target rincian sendiri: Time credit tidak bergantung WhatsApp; identifier member scoped dan redeem tanpa duplikasi.

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: CREDIT_INELIGIBLE, assert status/code/messageKey tanpa rahasia.
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

## Verified policy acceptance v0.2
- FR-SENET-89 / AC-FR-SENET-89: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Uji interpretasi sendiri: A pass from a lower-level zone can't be used in a higher-level zone; higher-level passes work in lower zones. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: Level1 pass→level2 denied before debit/command; level2→level1 allowed only configured compatible category. Same seconds retained, no cash conversion/extra discount stacking. Frozen session quote; transfer re-evaluates only under approved delta quote, never retroactively reprices.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.
