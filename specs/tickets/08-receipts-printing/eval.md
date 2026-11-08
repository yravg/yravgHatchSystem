# Eval HS-T08 — Struk, cetak ulang dan jembatan printer

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 08` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-08.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-08 / AC-HS-08: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.
- [ ] FR-KPS-34 / AC-KPS-34: Print to sandbox 58/80-mm adapter or PDF; print retry never creates another financial transaction.
- [ ] FR-SENET-98 / AC-FR-SENET-98: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Uji interpretasi sendiri: Thermal printer optional (Bixolon SRP-150, Vioteh VPT80 named); editable templates; reprint; PDF receipts. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F119 / AC-F119: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Kitchen receipt routing diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F167 / AC-F167: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Cashier thermal receipt diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F168 / AC-F168: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: PDF receipt diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F169 / AC-F169: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Bluetooth printer support diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F170 / AC-F170: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: LAN printer support diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F171 / AC-F171: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Asersi spesifik: Printer offline queue diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-183 / AC-FR-KULA-183: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.
- [ ] FR-KULA-188 / AC-FR-KULA-188: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Label rak/barcode dapat dicetak ulang tanpa perubahan transaksi atau stok.
- [ ] FR-KULA-203 / AC-FR-KULA-203: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Cetak ulang/link receipt tidak menggandakan sale; berbagi pesan adalah draft/manual sampai izin penerima/connector.
- [ ] FR-KULA-230 / AC-FR-KULA-230: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Setup printer via edge bridge memilih protocol/paper58/80mm dan test print; browser tidak dijanjikan universal Bluetooth.
- [ ] FR-KULA-231 / AC-FR-KULA-231: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Header/footer/logo receipt menggunakan aset venue sendiri berizin; template tidak menyimpan competitor copy.
- [ ] FR-KULA-235 / AC-FR-KULA-235: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal. Target rincian sendiri: Receipt thermal/link redacted dapat dibagikan manual, tidak mengirim pesan eksternal otomatis.
- [ ] FR-KULA-324 / AC-FR-KULA-324: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.
- [ ] FR-KULA-437 / AC-FR-KULA-437: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.
- [ ] FR-KULA-458 / AC-FR-KULA-458: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.
- [ ] FR-KULA-498 / AC-FR-KULA-498: PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.

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
