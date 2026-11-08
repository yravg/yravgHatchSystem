# Eval HS-T16 — Supplier, PO, penerimaan dan mutasi gudang

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 16` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-16.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-16 / AC-HS-16: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] F104 / AC-F104: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Supplier records diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F105 / AC-F105: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Purchase orders diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F106 / AC-F106: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Goods receiving diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F111 / AC-F111: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Branch stock transfers diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F269 / AC-F269: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Multi-branch stock and asset transfer diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-189 / AC-FR-KULA-189: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Reorder menghasilkan draft PO dari low-stock, bukan pembelian otomatis.
- [ ] FR-KULA-190 / AC-FR-KULA-190: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Draft PO memiliki supplier/item/qty/harga dan approval sebelum dikirim keluar.
- [ ] FR-KULA-220 / AC-FR-KULA-220: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: PO dipenuhi lewat goods receipt parsial; qty yang belum diterima tetap outstanding dan retry tidak double-stock.
- [ ] FR-KULA-221 / AC-FR-KULA-221: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Transfer menaruh stok in-transit; tujuan menerima sekali setelah konfirmasi, cancel mempunyai reversal.
- [ ] FR-KULA-239 / AC-FR-KULA-239: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Saran restock berversi menjelaskan window/model dan data kurang; supplier order tetap draft approval.
- [ ] FR-KULA-240 / AC-FR-KULA-240: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Mutasi antar outlet membawa cost layer yang tepat tanpa menulis ulang cost penjualan lama.
- [ ] FR-KULA-265 / AC-FR-KULA-265: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-311 / AC-FR-KULA-311: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-350 / AC-FR-KULA-350: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-372 / AC-FR-KULA-372: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-373 / AC-FR-KULA-373: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-374 / AC-FR-KULA-374: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-375 / AC-FR-KULA-375: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-376 / AC-FR-KULA-376: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-377 / AC-FR-KULA-377: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.
- [ ] FR-KULA-457 / AC-FR-KULA-457: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.

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
