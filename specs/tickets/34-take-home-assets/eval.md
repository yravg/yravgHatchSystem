# Eval HS-T34 — Sewa bawa pulang dan custody aset

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 34` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-34.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-34 / AC-HS-34: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.
- [ ] F260 / AC-F260: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Take-home console rental diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F261 / AC-F261: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Rental security deposit diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F262 / AC-F262: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Condition photos at checkout and return diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F263 / AC-F263: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Serial-number asset tracking diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F264 / AC-F264: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Accessory issue return checklist diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F265 / AC-F265: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Damage fee dispute workflow diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F266 / AC-F266: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Delivery scheduling diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F267 / AC-F267: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Delivery distance fee diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F268 / AC-F268: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV. Asersi spesifik: Rental overdue reminders diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-014 / AC-FR-KULA-014: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.
- [ ] FR-KULA-307 / AC-FR-KULA-307: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.
- [ ] FR-KULA-412 / AC-FR-KULA-412: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.
- [ ] FR-KULA-511 / AC-FR-KULA-511: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.
- [ ] HS-GAP-13 / AC-HS-GAP-13: PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.

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
