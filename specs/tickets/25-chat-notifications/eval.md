# Eval HS-T25 — Chat operator, alarm dan notifikasi berizin

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 25` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-25.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-25 / AC-HS-25: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent.
- [ ] FR-KPS-55 / AC-KPS-55: At threshold/end sound identifies station; denied browser audio permission gives visible warning and test button.
- [ ] FR-KPS-56 / AC-KPS-56: Customer sends help request; assigned cashier gets station-tagged unread badge and can reply without exposing other stations.
- [ ] FR-SENET-25 / AC-FR-SENET-25: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Uji interpretasi sendiri: SMS/Viber/email providers for codes and messages. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-44 / AC-FR-SENET-44: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Uji interpretasi sendiri: Direct chat and remote assistance from Shell. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F094 / AC-F094: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Asersi spesifik: Customer call operator diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F095 / AC-F095: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Asersi spesifik: Customer cashier chat diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F284 / AC-F284: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Asersi spesifik: Public status and incident notifications diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-039 / AC-FR-KULA-039: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Target rincian sendiri: Adapter Telegram default sandbox sink; aktivasi membutuhkan penerima/consent dan approval terpisah.
- [ ] FR-KULA-262 / AC-FR-KULA-262: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent. Target rincian sendiri: Rekap shift menjadi preview notification; external recipient/connector/send memerlukan approval terpisah.
- [ ] FR-KULA-283 / AC-FR-KULA-283: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent.
- [ ] FR-KULA-325 / AC-FR-KULA-325: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent.
- [ ] FR-KULA-443 / AC-FR-KULA-443: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent.
- [ ] FR-KULA-518 / AC-FR-KULA-518: Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent.

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
