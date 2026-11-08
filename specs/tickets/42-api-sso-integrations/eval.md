# Eval HS-T42 — API publik, SSO dan integrasi berizin

## Checks
1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- 42` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-42.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.

## Acceptance per requirement
- [ ] HS-42 / AC-HS-42: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik.
- [ ] FR-SENET-67 / AC-FR-SENET-67: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Uji interpretasi sendiri: Microsoft / Google SSO. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-110 / AC-FR-SENET-110: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Uji interpretasi sendiri: Public API covering top-ups, balance history and report queries. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] FR-SENET-119 / AC-FR-SENET-119: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Uji interpretasi sendiri: Microsoft Entra ID / Google Workspace sign-in; invite staff via SSO. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.
- [ ] F271 / AC-F271: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Asersi spesifik: Open API diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] F272 / AC-F272: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Asersi spesifik: Webhook integrations diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.
- [ ] FR-KULA-232 / AC-FR-KULA-232: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Target rincian sendiri: Google OIDC optional memakai official flow/state/nonce/PKCE, tanpa signup/account tindakan otomatis saat build.

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
| HS-V02-08 | HS-42 | AC-HS-V02-08 | HS-C42 | V1 / ticket |
- HS-V02-08 / AC-HS-V02-08: Outbox webhook with eventId/version, per-subscriber HMAC SHA256 keyId/timestamp/body signature, bounded retry/exponential backoff/dead-letter and dedup consumer fixture. Signed endpoint URL allowlist/public-network SSRF protections, disabled default sandbox sink, owner approves recipients/data/keys before external sends.

## Design v0.2 evidence
Read accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.
