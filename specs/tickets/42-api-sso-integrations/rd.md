# HS-T42 — API publik, SSO dan integrasi berizin

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-42 | HS-42 | AC-HS-42 | HS-C42 | V1 / ticket |
| FR-SENET-67 | HS-42 | AC-FR-SENET-67 | HS-C42 | V1 / ticket |
| FR-SENET-110 | HS-42 | AC-FR-SENET-110 | HS-C42 | V1 / ticket |
| FR-SENET-119 | HS-42 | AC-FR-SENET-119 | HS-C42 | V1 / ticket |
| F271 | HS-42 | AC-F271 | HS-C42 | V2 / deferred |
| F272 | HS-42 | AC-F272 | HS-C42 | V2 / deferred |
| FR-KULA-232 | HS-42 | AC-FR-KULA-232 | HS-C42 | V1 / ticket |


## Behaviour
- **HS-42 / AC-HS-42** — API publik, SSO dan integrasi berizin. Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-67 / AC-FR-SENET-67** — SSO (Enterprise). Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Uji interpretasi sendiri: Microsoft / Google SSO. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/pricing.
- **FR-SENET-110 / AC-FR-SENET-110** — Public API. Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Uji interpretasi sendiri: Public API covering top-ups, balance history and report queries. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:12471597297308; help:20970824326300.
- **FR-SENET-119 / AC-FR-SENET-119** — SSO for staff/students. Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Uji interpretasi sendiri: Microsoft Entra ID / Google Workspace sign-in; invite staff via SSO. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: SSO articles.
- **F271 / AC-F271** — Open API. Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Asersi spesifik: Open API diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F271; others=ggLeap [G1]; Gizmo-provider [Z3].
- **F272 / AC-F272** — Webhook integrations. Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Asersi spesifik: Webhook integrations diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F272; others=Not verified; proposed requirement.
- **FR-KULA-232 / AC-FR-KULA-232** — API publik, SSO dan integrasi berizin — referensi FR-KULA-232. Target: Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik. Target rincian sendiri: Google OIDC optional memakai official flow/state/nonce/PKCE, tanpa signup/account tindakan otomatis saat build. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `settings-google-login`, public bundle).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/public-api/; services/api/src/sso/; packages/contracts/openapi/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C42. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D16, D24; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C42 — API publik, SSO dan integrasi berizin.

## v0.2 own requirement crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-V02-08 | HS-42 | AC-HS-V02-08 | HS-C42 | V1 / ticket |
- HS-V02-08 / AC-HS-V02-08: Outbox webhook with eventId/version, per-subscriber HMAC SHA256 keyId/timestamp/body signature, bounded retry/exponential backoff/dead-letter and dedup consumer fixture. Signed endpoint URL allowlist/public-network SSRF protections, disabled default sandbox sink, owner approves recipients/data/keys before external sends.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-09, HS-SCR-ADM-16, HS-SCR-ADM-22, HS-SCR-ADM-24
Components: HS-CMP-023, HS-CMP-052, HS-CMP-053, HS-CMP-054
Touches (design primary): HS-SCR-ADM-16, HS-SCR-ADM-24, HS-CMP-054
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
