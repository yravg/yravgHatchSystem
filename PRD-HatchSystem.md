# yravg HatchSystem — PRD v0.2

Status: **draft / siap review spesifikasi, bukan siap produksi**. Bahasa Indonesia terlebih dahulu. Snapshot8November2026 (UTC+8). Repo target https://github.com/yravg/yravgHatchSystem . Pemilik keputusan: Enrico. Paket ini menggantikan18draft ticket rental sebelumnya; lihat specs/SUPERSESSION.md. Tidak menulis repo atau melakukan build produk dalam pekerjaan spesifikasi ini.

## 1. Tujuan, personas dan ukuran keberhasilan

- **G01 — Operasi rental akurat:** kasir membuka/memperpanjang/menjeda/memindahkan/mengakhiri sesi fixed/open, prepaid/postpaid, menjual F&B, membayar dan menutup shift tanpa ledger ganda.
- **G02 — Kendali perangkat dapat dipercaya:** readiness nyata, expiry lokal, lease offline terbatas, bukti ACK terukur, hardware tersertifikasi dan fallback jujur.
- **G03 — Pelanggan mandiri:** booking/deposit, member, wallet/time-credit terpisah, QR order, waktu tersisa, bantuan dan receipt tanpa menyebarkan data pribadi.
- **G04 — Gaming center lintas platform:** PC Windows, konsol PS4/PS5/Xbox/Switch, katalog/lisensi sah, turnamen dan multi-cabang; tidak sekadar timer POS.
- **G05 — Bisnis aman dan dapat dipulihkan:** inventori/pengadaan, laporan owner, audit, backup/restore, payroll dan pajak draft; Bahasa Indonesia; integrasi terbuka terkontrol.

| Persona | Pekerjaan utama | Batas |
|---|---|---|
| Owner/pemilik | outlet, tarif, margin/utilisasi, liability wallet, staf, policy, perangkat | setujui money/security/data; tidak menjadi user universal lintas tenant |
| Kasir | denah live, quote, sesi, order, tender, struk, shift/handover | tidak mengubah jurnal, menyetujui refund sendiri atau melihat payroll |
| Customer/pelanggan | booking, check-in, bayar QRIS, start/extend, order F&B, member/time/wallet | guest scope satu booking/sesi; member hanya datanya sendiri |
| Technician/teknisi | pairing, probe input, topology, health, diagnosa/update, recovery | tidak membaca transaksi lengkap/PII/payroll; tindakan remote diaudit |
| Kitchen | antrean masak, stok habis, siap/antar | hanya item/kode meja, bukan profil/saldo |
| Manager | override terbatas, refund approval, rekonsiliasi dan serah terima | reason+audit, tidak bisa menghapus jurnal |

Done pilot: simulator8station berjalan E2E; dua start concurrent tidak double-book/debit; ledger seimbang; callback retry tidak menggandakan nilai; sesi tidak bertambah setelah reboot/jam mundur; expired lease mengunci gambar pada kombinasi hardware yang lulus. Target p95 cloud mutation<500ms dan command ACK<2s pada LAN fixture, timeout10s; ini target uji, bukan SLA. RPO15menit/RTO60menit usulan D20 harus dibuktikan. Tidak mengklaim integrasi/hardware lulus berdasarkan dokumen saja.

## 2. Scope, evidence dan aturan clean-room

Sumber adalah perilaku/flow publik dan ringkasan riset, bukan instruksi menyalin produk. Own yravg brand/UI/copy/code. Tidak memakai aset, logo, screenshot, bundle JS, APK, kode hasil decompile, private API, firmware atau root/DRM bypass vendor. Nama/ID competitor hanya provenance. Semua angka policy adalah fixture draft sampai keputusan money/security/data D01–D32 yang relevan dikunci. Sumber yang bertentangan tidak menjadi alasan melemahkan keselamatan.

Baseline69FR-KPS,129FR-SENET,520FR-KULA dan284marketF disimpan tanpa renumber. Ditambah54canonical vertical slices +15own differentiation +18own v0.2 requirements = **1089traceability records**, bukan1089fitur unik. Deduplikasi melalui canonical HS-01..54. Semua144star rental/gaming FR-KULA tetap ditelusuri;20tag lintas-industri terlihat false-positive dan ditafsirkan sebagai kapabilitas umum (booking/report/stock/handover), bukan permintaan membuat pet/medical/craft/barber modules. Detail per alias dan alasannya ada COVERAGE.

840row masuk ticket MVP/V1,104deferred V2,145out-of-scope. Semua54ticket draft, tidak otomatis boleh dispatch. Exclusion145row diaudit T45, tidak dibangun. Semua FR-KPS tetap AC source tersendiri; angka source yang tidak aman diganti policy master dengan catatan crosswalk. route-only/UNKNOWN = pending verification, **bukan parity terbukti**. Senet punya aplikasi customer iOS; jangan mengklaim iOS absent. CEC pada satu jalur TV-app Senet harus dinonaktifkan; itu bukan protokol lock universal. Native LG/Tizen belum dibuktikan; dokumentasi coming-soon bukan shipped. Lima belas own gap bukan klaim kedua vendor tidak punya fitur tersebut.

Non-goals: NG01 competitor assets/code; NG02 live money/deploy/store publish; NG03 console mains/root/DRM bypass; NG04 literal unrelated industry modules; NG05 universal unsupported native TV claims; NG06 autonomous external messages/payroll/DJP/AI mutation. Kepemilikan safety T30; exclusion audit T45.

## 3. Produk/aplikasi yang harus tersedia

| App/surface | Tech & delivery | Fase / batas |
|---|---|---|
| Web owner/admin | Next.js supported16, TypeScript, responsive | MVP config dasar; V1 laporan/branch/payroll/tax |
| Cashier PWA | shared web app + server authoritative realtime | MVP; install optional, jangan janji offline service worker menyelesaikan ledger |
| Customer PWA | shared responsive Safari/Chrome, secure scoped tokens | V1 booking/member/wallet/time/start/order/receipt; iOS Safari wajib diuji |
| Kitchen display / QR ordering | web KDS + QR scoped guest order | MVP KDS staff; V1 public QR/customer flow |
| Lobby/status/waiting-room + customer checkout display | read-only web kiosk projections | V1 redacted identities, signed scoped token; status station terpisah kitchen queue |
| Node/Postgres API + worker | Fastify Node26 LTS candidate, Postgres supported major, Drizzle, transactional outbox | MVP server domain; pinned versions verified at setup |
| Venue edge / gateway | .NET10 LTS Windows/Linux service, SQLite WAL, outbound TLS | MVP; staff-approved PIN pairing, lease authority/fencing, USB/LAN printers/adapters; Windows gateway mandatory supported target |
| Android/Google TV agent | native Kotlin/Android SDK, own signed APK | MVP only certified built-in HDMI/input APIs; setup can require legal Device Owner provisioning on supported owned devices |
| Windows PC seat agent | .NET10 service + separate UI shell, signed installer | V1 Windows11 target; gaming PC only idle power ops, privacy lock ≠ pause billing |
| External LG/Samsung adapter | edge plugin protocol; certified CEC USB/HDMI matrix blank input/IR | MVP explicit launch path on named topology; does not require TV-native overlay privilege |
| Native webOS/Tizen | own web app with official SDK only | V2 conditional feasibility/distribution; unsupported if cannot enforce reliable expiry/input/Home |
| Android mobile rental agent | Kotlin, owned venue phone/tablet managed mode | V2 pilot separate from TV agent, no hidden surveillance |
| Self-service kiosk | hardened shared web app on managed owned device | V2 unattended payment policy; clear customer tokens after use |
| Native iOS/Android customer wrapper | optional Capacitor/native wrapper after evidence | V2 only real PWA limitation; no mandatory native app for booking |
| Member/public booking/receipt pages | same customer PWA bounded scopes | V1 own routes; no duplicate apps per page |
| Hardware simulator / operator runbook | protocol simulator + Bahasa training fixtures | MVP no competitor hardware/account prerequisite |

LG/Samsung **tested external path** and iOS **first-class PWA test coverage** are product commitments; no unsupported assertion that others lack iOS or that native TV lockdown is universal. Device/OS minimum candidates must pass certification before marketing.

## 4. Alur normatif dan persyaratan fungsional

### 4.1 Setup dan pairing
Owner creates outlet+timezone, rates and station with console choices, games/zone, onlineBookable flag. Technician pairs edge, then TV/PC through single-use expiring challenge (own8digit/5minute fixture,5attempts/min/device); staff approves station mapping and public key. Probe permissions/input/boot recovery/topology; badge setup_required/unsupported/ready is based on actual capability, not subscription level. Revocation invalidates subsequent commands. Permission denied/Home escape must be visible and block certified status.

### 4.2 Kasir dan sesi
Denah has available/reserved/starting/active/paused/finished/cleaning/maintenance, searchable/filterable. One station can contain PS4+PS5 but one active choice/session. Quote stores immutable ruleVersion, mode, duration and price breakdown. Rate per station/category/day/member, hourly/package/happy-hour/holiday/overnight, minimum and rounding; promotions cannot silently stack. Fixed/open and prepaid/postpaid are independent axes, both evaled. Prepaid waits verified payment; start waits valid activation result. Pause/extend/move/end are server transitions with optimistic revision and ledger-safe retries. Early stop may bank eligible **paid unused** time separately from wallet, per D03. Open sessions display projected bill and bounded current lease. Active food charges survive move. Group split/merge bills preserve lines/payment allocations. Manual billing explicitly says TV unmanaged; no fake readiness.

### 4.3 Checkout, pembayaran, struk dan shift
Cash, split tender and verified QRIS Midtrans. Manual bank-transfer note remains pending unless verified supported provider integration exists; screenshots are never settlement. Integer IDR ledger, refunds by reversal and authorisation. Reserve station before payment/grant; late settlement cannot steal station. Failed activation settled payment -> refund_pending, never pretend refunded. Print58/80mm via certified edge bridge/PDF; reprint no sale duplication. Shift float, cash in/out, X interim and immutable close, variance explanation, continuing sessions/handover actor. Cash and revenue/time liability are distinct.

### 4.4 Pelanggan, wallet/time, booking/loyalty
Wallet main/bonus and saved-time buckets are different units/accounts. No negative balance/double-spend; paid/expiry/category eligibility checked. Membership tiers, points, reward goods/time, promos/vouchers, consent-based birthdays/referrals and history. Public availability per station/game; hold, multi-station reservation, buffers, deposit, cancellation/reschedule/check-in/no-show/waitlist; walk-in and booking share concurrency authority. Guest QR access scoped/expiring, bulk start reports per-unit failures without duplicate charge. Customer sees actual remaining/time bill, extends after settlement, requests assistance/orders, uses member/receipt pages. Ranking/public alias opt-in only.

### 4.5 F&B, stok, pengadaan
Catalogue variants/barcode/unit conversion, menu photo own/authorised, allergen notes. Stock/recipes/base units; reserve on accepted order, consume on fulfil; one receipt for rental+F&B, KDS new/accepted/preparing/ready/delivered and cancellation/stock-out. Moving-average MVP, versioned FIFO V1 optional. PO/supplier partial goods receiving, transfer in-transit, stocktake while sales occur, waste and return reversals. B2B/consignment/advanced wholesale V2. No stock overwrite hiding event history.

### 4.6 Owner/gaming center/shared core
Tenant/outlet RBAC and inherited configuration; own agent caps/plans configurable but commercial subscriptions disabled. Utilisation denominator explicitly shows maintenance hours; revenue/margin/payment method/product/shift/member/liability/station reports and CSV/XLSX/PDF snapshots. Windows seat member/receipt login, game library/license concurrency if legally authorised, WOL/idle shutdown PC only, customer privacy lock still billed, consent remote assistance. Basic tournament knockout V1 with match station reservation, fee/prize ledger and disputes; leagues/advanced formats V2. HRIS schedules/leave/manual attendance/overtime/cash advance and draft payroll V1, GPS/selfie disabled absent policy. Indonesian GL/tax/Coretax/SPT export draft, accountant-approved schema/rates, no filing/payment. AI OCR/restock/forecast/segment/voice advisory V2 mock/preview only. Shared marketing is opt-in, outbound connector sandbox/no automatic messages.

### 4.7 Fleet, recovery dan API
Signed manifest/payload, idle-only canary+rollback, exact build/model inventory, reconnect reconciliation, technician audit. Crash/reboot/clock/network/permission revoke/update failure cases mandatory. Migration preview/dedup/source hash, rollback by reversal and isolated backup restore drill. OIDC/public API scoped read-only defaults, official provider only. Owned content/news/review/survey and Bahasa/English keyboard/D-pad/reduced-motion/accessibility. All source-specific targets and individual ACs follow in §12 and specs/ACCEPTANCE.md; source aliases never silently dropped.

## 5. Arsitektur dan batas otoritas

Cloud API/Postgres is tenant financial/booking source of truth. Browser is not authority. Edge holds only scoped device state and permitted offline queue, signs bounded leases under cloud-delegated authority; one fenced epoch/outlet. Agent enforces local deadline, reports state and cannot mint payment/time. Outbox events at-least-once, effect idempotent. SQLite WAL durable before durable ACK. TLS and enrolled device identity, outbound connection (no public LAN port). Service worker may cache UI/reference data but cannot turn stale wallet/booking into approval. App read-model can be eventually consistent; financial writes and station reserve transactional. See CONTRACTS.md for payloads, endpoints and authoritative schemas.

Baseline monorepo apps/web; services/api,worker; packages/domain,contracts,ui; agents/venue-edge,android-tv,windows-seat; hardware-lab; tests/contracts/e2e/faults/hardware. CI establishes lint/typecheck/unit/integration/contract/e2e and native build/tests. No code/framework exists in inspected repo main; these are proposed stack/conventions, not discovered modules. Version references: https://nodejs.org/en/about/previous-releases ; https://nextjs.org/support-policy ; https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core . Verify exact supported patches when implementing; lockfile required.

## 6. Data model, API dan integritas

Normative companion CONTRACTS.md §§1–6 specifies entities, constraints, route families, wire schema and QRIS verification. Required aggregates: tenant/outlet/zone/staff grants; station/console/assets; immutable rate+quote; session/events; sale/items/allocations; balanced ledger; payment intent/webhook/refund; main/bonus wallet/time buckets; member/points; booking/holds; product/recipe/base units/stock movements/PO/receipts/transfers; order/KDS; shift/cashclose; device/pairing/capability; edge/epoch/lease/commands/ACK; tournament/match/prize; audit/backup/import. Foreign keys tenant-scoped; row access never inferred solely from client IDs. API version1, generated OpenAPI/JSON Schema, cursor lists, error gate and requestId. Bigint money as decimal string, seconds duration, UTC timestamps, IANA outlet timezone. Append-only journals with reversal, transaction+outbox same commit, unique source-event idempotency, expectedRevision for conflicts.

Financial gate reference: AUTH_FORBIDDEN, PLAN_LIMIT, STATION_BUSY, INVALID_TRANSITION, PAYMENT_UNCONFIRMED, QUOTE_STALE, CREDIT_INELIGIBLE, BOOKING_CONFLICT, DEVICE_UNSUPPORTED, DEVICE_PERMISSION_REQUIRED, ACTIVATION_TIMEOUT, UPDATE_REJECTED, OFFLINE_ACTION_UNAVAILABLE, LEASE_EXPIRED, COMMAND_STALE, PAIRING_EXPIRED, INSUFFICIENT_BALANCE, IDEMPOTENCY_CONFLICT, REFUND_PENDING, DATA_RETENTION_UNAPPROVED. Each gate has owner/status in COVERAGE, observable UI and tests, not raw server error copy.

## 7. Keamanan dan pembayaran Indonesia

Deny-default tenant+outlet RBAC, owner MFA/recovery, secure HttpOnly staff cookies/CSRF, short-lived scoped customer tokens, rate limits/device pairing lockout. Encryption in transit/at rest and secret manager/OS keystore runtime, no keys in frontend/log/repo. Signing/revocation/rotation with bounded grace, audit overrides, least privilege installer/service. QRIS Midtrans sandbox: current access-keys docs changed28Oct2026 to separate webhook Signature Secret Key from API ServerKey; verify exact-string SHA512 then authenticated status+merchant/order/amount/currency, dedup and out-of-order protection. See CONTRACTS §6 and D15; older doc examples conflict. Never silently fallback to API key after failed signature. Live merchant activation/refunds separately approved, callbacks do not trust screenshots/client state.

Privacy: minimal guest alias, no default KTP/photos/GPS/selfie/background surveillance; profile erasure separates legally retained journal pseudonyms. Retention/data-region/RPO decisions must be approved before production. Lobby redacts names/phones/balance; chat station-bound escaped, media restricted, logs redact secrets/PII. AI external provider and remote assistance require consent/budget; game commercial license independently checked. No autonomous tax filing/payroll transfer/message.

## 8. Offline, expiry dan recovery

- Valid fixed lease continues without WAN until signed deadline; monotonic clock plus safe persisted checkpoint, not client countdown authority. Open session lease is short/renewed; WAN expiry safely locks, no endless postpaid grant.
- Offline new start/extend/wallet/deposit/refund default forbidden (allowance0). Cash F&B capture can queue under authorised local shift budget after D07 approval, but must show unconfirmed stock/payment sync; baseline no stock oversell promise across disconnected tills. No assumption that cloud cashier works offline merely because Android overlay does.
- Reboot without trusted time fails closed picture; no full-duration reset. Power loss/cloud outage/reordered duplicate commands/split brain reconcile deterministic by epoch+revision, no double charge/dual unlock. Long-lived authority cannot instantly revoke disconnected device; TTL residual risk documented.
- ACK stages RECEIVED/APPLIED/FAILED + verification level; never equate command delivery/API response to optical proof. No feedback CEC/IR is commanded-only, manual attestation separately authorised. Unsafe unknown state gets recovery, not green active.
- Backup isolated restore, import preview/hash idempotency and reversal rollback; proposed pilotRPO15m/RTO60m must be measured. Emergency override unique/short/role-approved audited, no universal PIN.

## 9. Hardware/control certification

Initially **zero certified hardware combinations**. hardware/CERTIFICATION.csv is initial candidate test list, not support claim. Certify exact model+firmware+OS+topology+adapter hardware/driver+video mode+agent build and retain results. T21/T23 own MVP certification for their surface; T31 adds final V1 integrated matrix/regression, not permission to skip MVP lab tests.

Android/Google TV third-party foreground app/overlay does not automatically own HDMI/Home/input. Device Owner lock-task requires legitimate provisioning on supported owned models, often reset/enterprise capability; accessibility/overlay grant user-revocable and not a hidden kiosk bypass. Normal streaming box has HDMI OUTPUT, not passthrough overlay for PS video. TV-native app input switch support model-dependent; no global input lock guarantee. Use public Android APIs only, no root/always-on ADB.

LG webOS dev-mode apps are time-limited development; normal foreground app cannot promise overlay over other HDMI inputs, Home trap or immutable kiosk. Samsung Tizen similarly subject to foreground/input/security/distribution restrictions. Native conditional spike; external adapter path first. CEC supports selected power/source commands, not cryptographic access control; IR has line-of-sight/no state feedback, HDMI switch can blank path but must prove signal compatibility. TV-only smart relay last-resort qualified installation, **never console mains**. Physical TV remote/cable/undocked Switch bypass acknowledged; technician lockable cabinet/cable policy separate from software.

PS4/PS5/Xbox/Switch remain powered and gameplay state intact; gating TV picture does not log out personal accounts or save/stop game. CEC console may wake/change source unexpectedly; test vendor/model setting combinations and no forced electrical shutdown. 4K120/HDR/VRR/ALLM/HDCP, audio/eARC and reconnect latency tested; never turn off HDCP/strip DRM to claim pass. External adapter limited video modes labelled, not hidden downgrade.

Public feasibility references: https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode ; https://developer.android.com/reference/android/view/WindowManager.LayoutParams#TYPE_APPLICATION_OVERLAY ; https://developer.android.com/reference/android/hardware/hdmi/HdmiControlManager ; https://webostv.developer.lge.com/develop/getting-started/developer-mode-app ; https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/tvwindow-api.html . Reverify model-specific official API/distribution at spike.

## 10. Fase, gates dan keputusan

MVP: foundation/auth/station/rate, session fixed/open, cash+QRIS sandbox ledger/receipt/shift, F&B/KDS/recipe stock, secure pairing/edge, Kotlin TV and external LG/Samsung adapter path, security/backups/operator simulator. Windows gateway included edge; hardware integration is blocked until tested, sandbox-only prototype can run simulated devices with SIMULATED badge. Pilot go-live requires explicit production approval separate from this package.

V1: wallet/bonus/time/member/loyalty, public booking/customer+iOS PWA/QR order, notifications/display, Windows seat/game catalogue/legal licensing, branch/procurement/reports, signed fleet updates, basic tournament, HRIS/tax draft exports, API/SSO, migration and integrated hardware QA. V2: native webOS/Tizen feasibility, Android mobile rental, unattended kiosk/native wrappers, advanced PC image/cloud saves, takehome custody, AI advisory and advanced wholesale/tournament. Each row phase in COVERAGE overrides loose marketing buckets. V2 ticket remains draft/deferred with reason, no worker sneak-in.

Open decisions D01–D12 carried, D13–D32 added; full options/defaults/owner in DECISIONS.md. All ASSUMPTION until owner review. D05 expressly records contradictory TV-agent tier/price evidence; choose own yravg plans instead of inheriting contradiction. Money/security/data decisions are the only necessary policy questions to human; technical reversible setup can be stubbed only when human explicitly permits assumption and ready status. **No self-promotion draft→ready.**

## 11. Router workflow dan acceptance gates

Board order is dependency/topological order, not purely ticket number. Watchdog starts first; router never writes code/decomposes; one worker per ready ticket/worktree, teams agree contract before parallel work. Every ticket rd/eval owns source IDs/AC/design/gates, proposed file scope, dependencies, exclusions and decisions. Eval failure back to same worker; merger+independent checker real browser/native/hardware proof; reproducer twice for bugs. Done only after all active AC expected/actual, evidence and merged neighbour-flow check. Build results currently NOT STARTED. Structural spec validator only proves references/completeness, not runtime correctness.

Precedence: safety+locked owner decisions > CONTRACTS normative invariants > own canonical PRD behavior > per-row source AC interpretation. Never quietly drop source subcapability due generic canonical alias; if conflict/UNKNOWN remains, keep draft and record exact unresolved item. Shared contracts change requires coordinated revision and regenerate clients.

## 12. Registre lengkap requirement dan crosswalk

Tabel berikut adalah seluruh source/canonical/own-gap registry normatif dengan satu primary disposition/owner. Target acceptance lengkap per ID ada **specs/ACCEPTANCE.md** dan **specs/requirements.json/csv**, dimasukkan sebagai bagian PRD ini (bukan optional reference). Source label hanya provenance perilaku, tidak berarti teks UI harus sama. Kolom tiket untuk out-of-scope berarti audit owner saja. Lihat COVERAGE untuk setiap AC ID, komponen HS-C/KPS-C, gate dan NG/G01..G05. specs/ID-CROSSWALK.md mempertahankan namespace source; specs/SUPERSESSION.md memetakan18draft lama ke54baru.


### v0.2 merge amendment — higher precedence than v0.1 scope text

Full snapshot:1002source aliases+54canonical+15own-gap+18own-v0.2 =1089records, not unique features. Nine headless tickets46..54 extract backend/native logic so UI-hold does not deadlock auth→station→edge. Original45IDs remain integration owners, their source AC unchanged except stronger detailed acceptance. All54draft. Read specs/COORDINATION.md and specs/V02-CHANGES.md.

Senet billing/minimum/rounding/zone-level, booking deposit/settings/no-show and X/Z get own exact tests. Rational internal calculation, integer IDR final; never clone vendor inconsistent fractional examples. Console transfer is an own requirement. Staff2FA, outbound signed webhooks, QRIS and Bahasa explicitly required.

TV provisioning states UNPROVISIONED_APP vs PROVISIONED_UNPAIRED vs PAIRED separate from billing. Supported venue-managed provisioned-unpaired must remain picture-locked and recover after reboot; normal permissions retained on certified setup, revoked permission detected and fallback/repair, no hidden grant. Offline lease independent of network polling. CEC OPTIONAL NEVER REQUIRED: setup CEC off on BOTH TV+console and prove lock while off. CEC-only power feature may be unsupported without degrading independent lock. No console mains.

Design v0.2 FINAL snapshot in specs/design:82screens,58wireframed,58components; exact required-reading and primary-owner/consumer map in every UI rd. DS-GATE-FINAL accepted by latest owner steering; no incoming placeholder or design hold remains. Brand colours alone provisional until logo. Backend/edge/contracts first, UI after dependencies and human-ready. Security/money rules outrank illustrative design policy; D32 separates8digit pairing fixture from6digitTOTP.

| Requirement | Own canonical | Kemampuan sendiri | Primary ticket | Phase | Disposition | AC |
| --- | --- | --- | --- | --- | --- | --- |
| HS-01 | HS-01 | Fondasi monorepo dan kontrak domain | 01 | MVP | ticket | AC-HS-01 |
| HS-02 | HS-02 | Identitas, tenant dan otorisasi per outlet | 02 | MVP | ticket | AC-HS-02 |
| HS-03 | HS-03 | Katalog stasiun, aset, zona dan denah | 03 | MVP | ticket | AC-HS-03 |
| HS-04 | HS-04 | Tarif versi, paket dan kutipan biaya | 04 | MVP | ticket | AC-HS-04 |
| HS-05 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti | 05 | MVP | ticket | AC-HS-05 |
| HS-06 | HS-06 | POS, kas dan buku pembayaran append-only | 06 | MVP | ticket | AC-HS-06 |
| HS-07 | HS-07 | QRIS Midtrans sandbox dan rekonsiliasi | 07 | MVP | ticket | AC-HS-07 |
| HS-08 | HS-08 | Struk, cetak ulang dan jembatan printer | 08 | MVP | ticket | AC-HS-08 |
| HS-09 | HS-09 | Dompet IDR, bonus dan batas belanja offline | 09 | V1 | ticket | AC-HS-09 |
| HS-10 | HS-10 | Tabungan waktu, penebusan dan kedaluwarsa | 10 | V1 | ticket | AC-HS-10 |
| HS-11 | HS-11 | Member, reward, tingkat dan voucher | 11 | V1 | ticket | AC-HS-11 |
| HS-12 | HS-12 | Reservasi, deposit, buffer dan no-show | 12 | V1 | ticket | AC-HS-12 |
| HS-13 | HS-13 | Portal pelanggan dan akses QR/receipt | 13 | V1 | ticket | AC-HS-13 |
| HS-14 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS | 14 | MVP | ticket | AC-HS-14 |
| HS-15 | HS-15 | Produk, stok, resep dan costing | 15 | MVP | ticket | AC-HS-15 |
| HS-16 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang | 16 | V1 | ticket | AC-HS-16 |
| HS-17 | HS-17 | Shift kasir dan serah terima sesi aktif | 17 | MVP | ticket | AC-HS-17 |
| HS-18 | HS-18 | Laporan owner, utilisasi dan liability | 18 | V1 | ticket | AC-HS-18 |
| HS-19 | HS-19 | Pairing aman dan capability probe | 19 | MVP | ticket | AC-HS-19 |
| HS-20 | HS-20 | Venue edge, lease offline dan otoritas tunggal | 20 | MVP | ticket | AC-HS-20 |
| HS-21 | HS-21 | Agent Kotlin Android/Google TV dan expiry | 21 | MVP | ticket | AC-HS-21 |
| HS-22 | HS-22 | Remote TV aman, timer dan media sendiri | 22 | V1 | ticket | AC-HS-22 |
| HS-23 | HS-23 | Adapter CEC/HDMI/IR untuk LG dan Samsung | 23 | MVP | ticket | AC-HS-23 |
| HS-24 | HS-24 | Kesehatan fleet, update bertanda tangan dan rollback | 24 | V1 | ticket | AC-HS-24 |
| HS-25 | HS-25 | Chat operator, alarm dan notifikasi berizin | 25 | V1 | ticket | AC-HS-25 |
| HS-26 | HS-26 | Billboard, customer display dan privasi | 26 | V1 | ticket | AC-HS-26 |
| HS-27 | HS-27 | Windows seat lock dan player shell | 27 | V1 | ticket | AC-HS-27 |
| HS-28 | HS-28 | Katalog game dan integrasi lisensi sah | 28 | V1 | ticket | AC-HS-28 |
| HS-29 | HS-29 | Patching, image PC dan save portability | 29 | V2 | deferred | AC-HS-29 |
| HS-30 | HS-30 | Keamanan, privasi, audit dan restore | 30 | MVP | ticket | AC-HS-30 |
| HS-31 | HS-31 | Sertifikasi hardware dan QA lintas alur | 31 | V1 | ticket | AC-HS-31 |
| HS-32 | HS-32 | Turnamen, bracket dan komunitas | 32 | V1 | ticket | AC-HS-32 |
| HS-33 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri | 33 | V1 | ticket | AC-HS-33 |
| HS-34 | HS-34 | Sewa bawa pulang dan custody aset | 34 | V2 | deferred | AC-HS-34 |
| HS-35 | HS-35 | Staf, kehadiran dan payroll ekspor | 35 | V1 | ticket | AC-HS-35 |
| HS-36 | HS-36 | Akuntansi dan laporan pajak Indonesia | 36 | V1 | ticket | AC-HS-36 |
| HS-37 | HS-37 | AI helper dengan preview dan persetujuan | 37 | V2 | deferred | AC-HS-37 |
| HS-38 | HS-38 | Pilot agent HP/tablet rental | 38 | V2 | deferred | AC-HS-38 |
| HS-39 | HS-39 | Feasibility native webOS dan Tizen | 39 | V2 | deferred | AC-HS-39 |
| HS-40 | HS-40 | Kios mandiri dan coverage iOS | 40 | V2 | deferred | AC-HS-40 |
| HS-41 | HS-41 | Migrasi dry-run, rekonsiliasi dan rollback | 41 | V1 | ticket | AC-HS-41 |
| HS-42 | HS-42 | API publik, SSO dan integrasi berizin | 42 | V1 | ticket | AC-HS-42 |
| HS-43 | HS-43 | B2B, konsinyasi dan unit grosir | 43 | V2 | deferred | AC-HS-43 |
| HS-44 | HS-44 | Konten venue, feedback dan Bahasa Indonesia | 44 | V1 | ticket | AC-HS-44 |
| HS-45 | HS-45 | Runbook operator, sandbox dan bantuan | 45 | MVP | ticket | AC-HS-45 |
| FR-KPS-01 | HS-03 | Rental service products with minute/hour/day price basis and separate cost basis | 03 | MVP | ticket | AC-KPS-01 |
| FR-KPS-02 | HS-03 | Named unit/table/room mapped to rentable product | 03 | MVP | ticket | AC-KPS-02 |
| FR-KPS-03 | HS-03 | Multi-console selection on one shared table | 03 | MVP | ticket | AC-KPS-03 |
| FR-KPS-04 | HS-05 | Fixed-duration countdown | 05 | MVP | ticket | AC-KPS-04 |
| FR-KPS-05 | HS-05 | Open-ended elapsed-time billing | 05 | MVP | ticket | AC-KPS-05 |
| FR-KPS-06 | HS-06 | Prepaid packages | 06 | MVP | ticket | AC-KPS-06 |
| FR-KPS-07 | HS-06 | Postpaid checkout | 06 | MVP | ticket | AC-KPS-07 |
| FR-KPS-08 | HS-05 | Extend running session | 05 | MVP | ticket | AC-KPS-08 |
| FR-KPS-09 | HS-05 | Pause and resume | 05 | MVP | ticket | AC-KPS-09 |
| FR-KPS-10 | HS-05 | Move session to another unit preserving time and bill | 05 | MVP | ticket | AC-KPS-10 |
| FR-KPS-11 | HS-05 | Early stop and end state | 05 | MVP | ticket | AC-KPS-11 |
| FR-KPS-12 | HS-04 | Hourly/minute/day pricing configuration | 04 | MVP | ticket | AC-KPS-12 |
| FR-KPS-13 | HS-04 | Happy-hour schedule and overnight packages | 04 | MVP | ticket | AC-KPS-13 |
| FR-KPS-14 | HS-04 | Member-specific tariffs or discount tiers | 04 | MVP | ticket | AC-KPS-14 |
| FR-KPS-15 | HS-04 | Overtime/late-fee configuration | 04 | MVP | ticket | AC-KPS-15 |
| FR-KPS-16 | HS-14 | Add catalogue items while rental timer runs | 14 | MVP | ticket | AC-KPS-16 |
| FR-KPS-17 | HS-14 | Merge rental and F&B into one checkout | 14 | MVP | ticket | AC-KPS-17 |
| FR-KPS-18 | HS-14 | Group/merge multiple rental bills | 14 | MVP | ticket | AC-KPS-18 |
| FR-KPS-19 | HS-14 | QR-table self-ordering and kitchen routing | 14 | MVP | ticket | AC-KPS-19 |
| FR-KPS-20 | HS-15 | Stock/recipe deductions for rental food sales | 15 | MVP | ticket | AC-KPS-20 |
| FR-KPS-21 | HS-11 | Member lookup and play/purchase history | 11 | V1 | ticket | AC-KPS-21 |
| FR-KPS-22 | HS-10 | Save unused prepaid minutes to member time credit | 10 | V1 | ticket | AC-KPS-22 |
| FR-KPS-23 | HS-10 | Redeem saved time and view remaining balance | 10 | V1 | ticket | AC-KPS-23 |
| FR-KPS-24 | HS-10 | Time-credit expiry policy | 10 | V1 | ticket | AC-KPS-24 |
| FR-KPS-25 | HS-11 | Loyalty points integration | 11 | V1 | ticket | AC-KPS-25 |
| FR-KPS-26 | HS-12 | Customer booking portal with unit availability | 12 | V1 | ticket | AC-KPS-26 |
| FR-KPS-27 | HS-12 | Cashier reservation management and arrival conversion | 12 | V1 | ticket | AC-KPS-27 |
| FR-KPS-28 | HS-12 | Booking no-show blacklist without blocking walk-in sale | 12 | V1 | ticket | AC-KPS-28 |
| FR-KPS-29 | HS-17 | Per-shift rental payments and extension audit | 17 | MVP | ticket | AC-KPS-29 |
| FR-KPS-30 | HS-17 | Cash vs non-cash reconciliation and opening float | 17 | MVP | ticket | AC-KPS-30 |
| FR-KPS-31 | HS-18 | Per-station occupancy, sales and maintenance analytics | 18 | V1 | ticket | AC-KPS-31 |
| FR-KPS-32 | HS-33 | Remote owner dashboard and multi-outlet integration | 33 | V1 | ticket | AC-KPS-32 |
| FR-KPS-33 | HS-02 | Restricted cashier/admin/owner capabilities | 02 | MVP | ticket | AC-KPS-33 |
| FR-KPS-34 | HS-08 | Thermal/PDF and digital receipt integration | 08 | MVP | ticket | AC-KPS-34 |
| FR-KPS-35 | HS-07 | Cash, QRIS and transfer method integration | 07 | MVP | ticket | AC-KPS-35 |
| FR-KPS-36 | HS-06 | Split payments, deposits and unpaid balances | 06 | MVP | ticket | AC-KPS-36 |
| FR-KPS-37 | HS-21 | Installable Android TV / Google TV APK | 21 | MVP | ticket | AC-KPS-37 |
| FR-KPS-38 | HS-19 | PIN pairing binds agent to station; displayed PIN expires after 10 minutes and can refresh | 19 | MVP | ticket | AC-KPS-38 |
| FR-KPS-39 | HS-19 | HDMI port configuration, explicit test-lock/test-unlock, and ready status | 19 | MVP | ticket | AC-KPS-39 |
| FR-KPS-40 | HS-21 | Switch to console HDMI when session starts | 21 | MVP | ticket | AC-KPS-40 |
| FR-KPS-41 | HS-21 | Locked standby, paused and finished screens | 21 | MVP | ticket | AC-KPS-41 |
| FR-KPS-42 | HS-21 | Active-session Home/launcher guard | 21 | MVP | ticket | AC-KPS-42 |
| FR-KPS-43 | HS-21 | PIN-protected administrative exit | 21 | MVP | ticket | AC-KPS-43 |
| FR-KPS-44 | HS-21 | Timer overlay with position and opacity settings | 21 | MVP | ticket | AC-KPS-44 |
| FR-KPS-45 | HS-22 | On-TV time warnings and operator messages | 22 | V1 | ticket | AC-KPS-45 |
| FR-KPS-46 | HS-22 | Remote volume up/down/mute | 22 | V1 | ticket | AC-KPS-46 |
| FR-KPS-47 | HS-22 | Idle eco sleep / wake / power controls | 22 | V1 | ticket | AC-KPS-47 |
| FR-KPS-48 | HS-22 | Remote agent restart and manual/temporary HDMI, Home/navigation controls | 22 | V1 | ticket | AC-KPS-48 |
| FR-KPS-49 | HS-22 | Owner-provided standby backgrounds and store identity | 22 | V1 | ticket | AC-KPS-49 |
| FR-KPS-50 | HS-20 | Boot/reboot and package-replacement recovery | 20 | MVP | ticket | AC-KPS-50 |
| FR-KPS-51 | HS-20 | Local active timer continues during internet outage | 20 | MVP | ticket | AC-KPS-51 |
| FR-KPS-52 | HS-20 | Realtime connection, heartbeats, acknowledgement and reconnect | 20 | MVP | ticket | AC-KPS-52 |
| FR-KPS-53 | HS-24 | Fallback HTTP polling while socket is unhealthy | 24 | V1 | ticket | AC-KPS-53 |
| FR-KPS-54 | HS-24 | In-app agent update download/install flow | 24 | V1 | ticket | AC-KPS-54 |
| FR-KPS-55 | HS-25 | Cashier spoken/beep session warnings | 25 | V1 | ticket | AC-KPS-55 |
| FR-KPS-56 | HS-25 | Station QR chat with operator reply and audio alert | 25 | V1 | ticket | AC-KPS-56 |
| FR-KPS-57 | HS-26 | Realtime lobby station billboard, zones and announcements | 26 | V1 | ticket | AC-KPS-57 |
| FR-KPS-58 | HS-32 | Member playtime leaderboard and TV rank greeting | 32 | V1 | ticket | AC-KPS-58 |
| FR-KPS-59 | HS-32 | Tournament entrants, fee, bracket, score, prize and station assignment | 32 | V1 | ticket | AC-KPS-59 |
| FR-KPS-60 | HS-27 | Windows PC Agent lock/timer and remote lifecycle commands | 27 | V1 | ticket | AC-KPS-60 |
| FR-KPS-61 | HS-38 | Android phone/tablet rental agent and game allowlist (pilot) | 38 | V2 | deferred | AC-KPS-61 |
| FR-KPS-62 | HS-23 | Non-Android TV external-box path | 23 | MVP | ticket | AC-KPS-62 |
| FR-KPS-63 | HS-39 | Native LG webOS / Samsung Tizen TV agent | 39 | V2 | deferred | AC-KPS-63 |
| FR-KPS-64 | HS-20 | Local cashier queue and shared offline-sync integration | 20 | MVP | ticket | AC-KPS-64 |
| FR-KPS-65 | HS-19 | Capability-aware station errors and unsupported hardware states | 19 | MVP | ticket | AC-KPS-65 |
| FR-KPS-66 | HS-05 | Concurrent cashier actions and idempotent command safety | 05 | MVP | ticket | AC-KPS-66 |
| FR-KPS-67 | HS-33 | Rental unit / TV-PC agent slot limits and plan gates | 33 | V1 | ticket | AC-KPS-67 |
| FR-KPS-68 | HS-30 | Audit export and privacy-safe diagnostics | 30 | MVP | ticket | AC-KPS-68 |
| FR-KPS-69 | HS-12 | Per-station installed-game catalogue, online-bookable flag and customer game filters | 12 | V1 | ticket | AC-KPS-69 |
| FR-SENET-01 | HS-02 | Cloud admin panel (CAP) | 02 | MVP | ticket | AC-FR-SENET-01 |
| FR-SENET-02 | HS-33 | Multi-location management | 33 | V1 | ticket | AC-FR-SENET-02 |
| FR-SENET-03 | HS-27 | E-Launcher client install | 27 | V1 | ticket | AC-FR-SENET-03 |
| FR-SENET-04 | HS-27 | Shell player interface | 27 | V1 | ticket | AC-FR-SENET-04 |
| FR-SENET-05 | HS-27 | Security restriction levels | 27 | V1 | ticket | AC-FR-SENET-05 |
| FR-SENET-06 | HS-03 | Venue map | 03 | MVP | ticket | AC-FR-SENET-06 |
| FR-SENET-07 | HS-22 | Remote device commands | 22 | V1 | ticket | AC-FR-SENET-07 |
| FR-SENET-08 | HS-03 | Zones | 03 | MVP | ticket | AC-FR-SENET-08 |
| FR-SENET-09 | HS-04 | Hourly rates / peak-off-peak | 04 | MVP | ticket | AC-FR-SENET-09 |
| FR-SENET-10 | HS-04 | Passes / packages | 04 | MVP | ticket | AC-FR-SENET-10 |
| FR-SENET-11 | HS-13 | Pass promotion popup | 13 | V1 | ticket | AC-FR-SENET-11 |
| FR-SENET-12 | HS-36 | Flexible billing, cashier & tax settings | 36 | V1 | ticket | AC-FR-SENET-12 |
| FR-SENET-13 | HS-17 | Cash desk with shifts | 17 | MVP | ticket | AC-FR-SENET-13 |
| FR-SENET-14 | HS-13 | Receipt-based session | 13 | V1 | ticket | AC-FR-SENET-14 |
| FR-SENET-15 | HS-05 | Post-paid session | 05 | MVP | ticket | AC-FR-SENET-15 |
| FR-SENET-16 | HS-13 | Bulk session start | 13 | V1 | ticket | AC-FR-SENET-16 |
| FR-SENET-17 | HS-13 | Mandatory registration toggle | 13 | V1 | ticket | AC-FR-SENET-17 |
| FR-SENET-18 | HS-13 | Self-registration at PC | 13 | V1 | ticket | AC-FR-SENET-18 |
| FR-SENET-19 | HS-11 | Admin-created accounts | 11 | V1 | ticket | AC-FR-SENET-19 |
| FR-SENET-20 | HS-13 | QR login | 13 | V1 | ticket | AC-FR-SENET-20 |
| FR-SENET-21 | HS-13 | Scan-and-pay (guest) | 13 | V1 | ticket | AC-FR-SENET-21 |
| FR-SENET-22 | HS-09 | Online top-up via QR | 09 | V1 | ticket | AC-FR-SENET-22 |
| FR-SENET-23 | HS-07 | Payment gateway integrations | 07 | MVP | ticket | AC-FR-SENET-23 |
| FR-SENET-24 | HS-36 | Cash register (fiscal) integrations | 36 | V1 | ticket | AC-FR-SENET-24 |
| FR-SENET-25 | HS-25 | SMS/messaging integrations | 25 | V1 | ticket | AC-FR-SENET-25 |
| FR-SENET-26 | HS-09 | Main balance wallet | 09 | V1 | ticket | AC-FR-SENET-26 |
| FR-SENET-27 | HS-09 | Bonus balance | 09 | V1 | ticket | AC-FR-SENET-27 |
| FR-SENET-28 | HS-11 | Promo codes | 11 | V1 | ticket | AC-FR-SENET-28 |
| FR-SENET-29 | HS-11 | Level-based loyalty | 11 | V1 | ticket | AC-FR-SENET-29 |
| FR-SENET-30 | HS-12 | Booking (admin map mode) | 12 | V1 | ticket | AC-FR-SENET-30 |
| FR-SENET-31 | HS-12 | System booking | 12 | V1 | ticket | AC-FR-SENET-31 |
| FR-SENET-32 | HS-12 | Booking deposit & no-show fee | 12 | V1 | ticket | AC-FR-SENET-32 |
| FR-SENET-33 | HS-13 | Booking unlock code | 13 | V1 | ticket | AC-FR-SENET-33 |
| FR-SENET-34 | HS-12 | Booking list, reminders, Excel export | 12 | V1 | ticket | AC-FR-SENET-34 |
| FR-SENET-35 | HS-12 | Booking timeline | 12 | V1 | ticket | AC-FR-SENET-35 |
| FR-SENET-36 | HS-12 | Booking settings | 12 | V1 | ticket | AC-FR-SENET-36 |
| FR-SENET-37 | HS-12 | Group booking | 12 | V1 | ticket | AC-FR-SENET-37 |
| FR-SENET-38 | HS-13 | Senet ID mobile app + web portal | 13 | V1 | ticket | AC-FR-SENET-38 |
| FR-SENET-39 | HS-33 | Per-venue feature toggles in app | 33 | V1 | ticket | AC-FR-SENET-39 |
| FR-SENET-40 | HS-44 | News & push notifications | 44 | V1 | ticket | AC-FR-SENET-40 |
| FR-SENET-41 | HS-14 | In-seat shop / F&B | 14 | MVP | ticket | AC-FR-SENET-41 |
| FR-SENET-42 | HS-15 | Stock control | 15 | MVP | ticket | AC-FR-SENET-42 |
| FR-SENET-43 | HS-14 | Combos / upsells | 14 | MVP | ticket | AC-FR-SENET-43 |
| FR-SENET-44 | HS-25 | Player–staff chat | 25 | V1 | ticket | AC-FR-SENET-44 |
| FR-SENET-45 | HS-02 | Staff roles & permissions | 02 | MVP | ticket | AC-FR-SENET-45 |
| FR-SENET-46 | HS-11 | Customer list & activity logs | 11 | V1 | ticket | AC-FR-SENET-46 |
| FR-SENET-47 | HS-18 | Reports | 18 | V1 | ticket | AC-FR-SENET-47 |
| FR-SENET-48 | HS-18 | KPI dashboard / executive dashboard | 18 | V1 | ticket | AC-FR-SENET-48 |
| FR-SENET-49 | HS-28 | Game library (content cards) | 28 | V1 | ticket | AC-FR-SENET-49 |
| FR-SENET-50 | HS-28 | Game licence pool | 28 | V1 | ticket | AC-FR-SENET-50 |
| FR-SENET-51 | HS-29 | Game Update | 29 | V2 | deferred | AC-FR-SENET-51 |
| FR-SENET-52 | HS-29 | SENET Boot diskless/hybrid | 29 | V2 | deferred | AC-FR-SENET-52 |
| FR-SENET-53 | HS-27 | Shell branding | 27 | V1 | ticket | AC-FR-SENET-53 |
| FR-SENET-54 | HS-27 | Shell session lock | 27 | V1 | ticket | AC-FR-SENET-54 |
| FR-SENET-55 | HS-39 | Console App on Smart TV | 39 | V2 | deferred | AC-FR-SENET-55 |
| FR-SENET-56 | HS-05 | Console session pause/resume | 05 | MVP | ticket | AC-FR-SENET-56 |
| FR-SENET-57 | HS-13 | Console self-login (QR/receipt/app) | 13 | V1 | ticket | AC-FR-SENET-57 |
| FR-SENET-58 | HS-21 | Session-ending notifications | 21 | MVP | ticket | AC-FR-SENET-58 |
| FR-SENET-59 | HS-24 | Console monitoring & alerts | 24 | V1 | ticket | AC-FR-SENET-59 |
| FR-SENET-60 | HS-18 | Per-console reports | 18 | V1 | ticket | AC-FR-SENET-60 |
| FR-SENET-61 | HS-23 | Legacy SENET Controller box | 23 | MVP | ticket | AC-FR-SENET-61 |
| FR-SENET-62 | HS-03 | VR stations | 03 | MVP | ticket | AC-FR-SENET-62 |
| FR-SENET-63 | HS-27 | Secured remote access | 27 | V1 | ticket | AC-FR-SENET-63 |
| FR-SENET-64 | HS-41 | Data migration service | 41 | V1 | ticket | AC-FR-SENET-64 |
| FR-SENET-65 | HS-45 | Managed service | 45 | MVP | ticket | AC-FR-SENET-65 |
| FR-SENET-66 | HS-44 | Media Network ads | 44 | V1 | ticket | AC-FR-SENET-66 |
| FR-SENET-67 | HS-42 | SSO (Enterprise) | 42 | V1 | ticket | AC-FR-SENET-67 |
| FR-SENET-68 | HS-30 | EU data hosting | 30 | MVP | ticket | AC-FR-SENET-68 |
| FR-SENET-69 | HS-32 | Tournaments module | 32 | V1 | ticket | AC-FR-SENET-69 |
| FR-SENET-70 | HS-40 | Kiosk / self-service terminal | 40 | V2 | deferred | AC-FR-SENET-70 |
| FR-SENET-71 | HS-23 | Smart plug / HDMI-CEC / TV power control | 23 | MVP | ticket | AC-FR-SENET-71 |
| FR-SENET-72 | HS-13 | Console portal | 13 | V1 | ticket | AC-FR-SENET-72 |
| FR-SENET-73 | HS-19 | TV app activation by install code | 19 | MVP | ticket | AC-FR-SENET-73 |
| FR-SENET-74 | HS-33 | Console add-on per device | 33 | V1 | ticket | AC-FR-SENET-74 |
| FR-SENET-75 | HS-22 | Staff notifications/warnings to console TV | 22 | V1 | ticket | AC-FR-SENET-75 |
| FR-SENET-76 | HS-22 | Smart TV login-screen image | 22 | V1 | ticket | AC-FR-SENET-76 |
| FR-SENET-77 | HS-20 | Console session survives TV/console restart | 20 | MVP | ticket | AC-FR-SENET-77 |
| FR-SENET-78 | HS-21 | TV app overlay lock | 21 | MVP | ticket | AC-FR-SENET-78 |
| FR-SENET-79 | HS-23 | HDMI-CEC must be disabled | 23 | MVP | ticket | AC-FR-SENET-79 |
| FR-SENET-80 | HS-23 | Controller box Wi-Fi provisioning | 23 | MVP | ticket | AC-FR-SENET-80 |
| FR-SENET-81 | HS-23 | Controller video limits | 23 | MVP | ticket | AC-FR-SENET-81 |
| FR-SENET-82 | HS-05 | Session transfer between PCs | 05 | MVP | ticket | AC-FR-SENET-82 |
| FR-SENET-83 | HS-13 | Access code (receipt) sessions | 13 | V1 | ticket | AC-FR-SENET-83 |
| FR-SENET-84 | HS-05 | Extend postpaid / remove time limits | 05 | MVP | ticket | AC-FR-SENET-84 |
| FR-SENET-85 | HS-27 | Unlimited session (billing off) | 27 | V1 | ticket | AC-FR-SENET-85 |
| FR-SENET-86 | HS-04 | One-time minimum payment | 04 | MVP | ticket | AC-FR-SENET-86 |
| FR-SENET-87 | HS-04 | Per-minute billing with configurable rounding | 04 | MVP | ticket | AC-FR-SENET-87 |
| FR-SENET-88 | HS-04 | Time-period rates | 04 | MVP | ticket | AC-FR-SENET-88 |
| FR-SENET-89 | HS-10 | Zone levels for passes | 10 | V1 | ticket | AC-FR-SENET-89 |
| FR-SENET-90 | HS-11 | Group discount by user type | 11 | V1 | ticket | AC-FR-SENET-90 |
| FR-SENET-91 | HS-11 | Loyalty cashback | 11 | V1 | ticket | AC-FR-SENET-91 |
| FR-SENET-92 | HS-09 | Bonus codes | 09 | V1 | ticket | AC-FR-SENET-92 |
| FR-SENET-93 | HS-11 | Discount promo codes with max uses | 11 | V1 | ticket | AC-FR-SENET-93 |
| FR-SENET-94 | HS-09 | Top-up bonus tiers | 09 | V1 | ticket | AC-FR-SENET-94 |
| FR-SENET-95 | HS-17 | Cash register shifts with opening float | 17 | MVP | ticket | AC-FR-SENET-95 |
| FR-SENET-96 | HS-17 | X-report / Z-report | 17 | MVP | ticket | AC-FR-SENET-96 |
| FR-SENET-97 | HS-06 | Receipt refund (permissioned) | 06 | MVP | ticket | AC-FR-SENET-97 |
| FR-SENET-98 | HS-08 | Receipt printing/templates | 08 | MVP | ticket | AC-FR-SENET-98 |
| FR-SENET-99 | HS-14 | Kitchen/bar order printing | 14 | MVP | ticket | AC-FR-SENET-99 |
| FR-SENET-100 | HS-14 | Order board with statuses | 14 | MVP | ticket | AC-FR-SENET-100 |
| FR-SENET-101 | HS-15 | Inventory log, write-off, barcode | 15 | MVP | ticket | AC-FR-SENET-101 |
| FR-SENET-102 | HS-11 | User ban | 11 | V1 | ticket | AC-FR-SENET-102 |
| FR-SENET-103 | HS-09 | No balance transfer between accounts | 09 | V1 | ticket | AC-FR-SENET-103 |
| FR-SENET-104 | HS-11 | Configurable registration fields | 11 | V1 | ticket | AC-FR-SENET-104 |
| FR-SENET-105 | HS-12 | Booking settings: buffer, check-in window, pre-lock, min/max length, schedule | 12 | V1 | ticket | AC-FR-SENET-105 |
| FR-SENET-106 | HS-12 | Booking cancellation with deposit refund | 12 | V1 | ticket | AC-FR-SENET-106 |
| FR-SENET-107 | HS-12 | Booking on busy devices with free-time estimate | 12 | V1 | ticket | AC-FR-SENET-107 |
| FR-SENET-108 | HS-27 | Login screen shows upcoming booking | 27 | V1 | ticket | AC-FR-SENET-108 |
| FR-SENET-109 | HS-30 | Action log | 30 | MVP | ticket | AC-FR-SENET-109 |
| FR-SENET-110 | HS-42 | Public API | 42 | V1 | ticket | AC-FR-SENET-110 |
| FR-SENET-111 | HS-27 | PC Wake-on-LAN / auto shutdown / auto restart | 27 | V1 | ticket | AC-FR-SENET-111 |
| FR-SENET-112 | HS-27 | Remote access with consent prompt | 27 | V1 | ticket | AC-FR-SENET-112 |
| FR-SENET-113 | HS-03 | Map interior elements & mobile map | 03 | MVP | ticket | AC-FR-SENET-113 |
| FR-SENET-114 | HS-44 | Shell surveys | 44 | V1 | ticket | AC-FR-SENET-114 |
| FR-SENET-115 | HS-27 | Auto logout from launchers/browsers | 27 | V1 | ticket | AC-FR-SENET-115 |
| FR-SENET-116 | HS-28 | Content display schedule & age limits | 28 | V1 | ticket | AC-FR-SENET-116 |
| FR-SENET-117 | HS-29 | Cloud game saves (offline games) | 29 | V2 | deferred | AC-FR-SENET-117 |
| FR-SENET-118 | HS-27 | Printing for customers | 27 | V1 | ticket | AC-FR-SENET-118 |
| FR-SENET-119 | HS-42 | SSO for staff/students | 42 | V1 | ticket | AC-FR-SENET-119 |
| FR-SENET-120 | HS-09 | Scheduled resets & top-up presets | 09 | V1 | ticket | AC-FR-SENET-120 |
| FR-SENET-121 | HS-04 | Time zone drives rates/passes | 04 | MVP | ticket | AC-FR-SENET-121 |
| FR-SENET-122 | HS-12 | Venue working hours vs sessions | 12 | V1 | ticket | AC-FR-SENET-122 |
| FR-SENET-123 | HS-13 | Senet ID web portal | 13 | V1 | ticket | AC-FR-SENET-123 |
| FR-SENET-124 | HS-11 | Senet ID loyalty widget | 11 | V1 | ticket | AC-FR-SENET-124 |
| FR-SENET-125 | HS-44 | Interface languages | 44 | V1 | ticket | AC-FR-SENET-125 |
| FR-SENET-126 | HS-13 | Multi-receipt bulk login | 13 | V1 | ticket | AC-FR-SENET-126 |
| FR-SENET-127 | HS-18 | Session history per PC | 18 | V1 | ticket | AC-FR-SENET-127 |
| FR-SENET-128 | HS-18 | Dashboard widgets | 18 | V1 | ticket | AC-FR-SENET-128 |
| FR-SENET-129 | HS-18 | Reports to Excel | 18 | V1 | ticket | AC-FR-SENET-129 |
| F001 | HS-02 | Tenant isolation | 02 | MVP | ticket | AC-F001 |
| F002 | HS-03 | Outlet setup | 03 | MVP | ticket | AC-F002 |
| F003 | HS-03 | Outlet timezone and business-day cutoff | 03 | MVP | ticket | AC-F003 |
| F004 | HS-03 | Zone and floor layout | 03 | MVP | ticket | AC-F004 |
| F005 | HS-03 | Station type PS4 PS5 Xbox Switch PC VR | 03 | MVP | ticket | AC-F005 |
| F006 | HS-04 | Station categories and tariffs | 04 | MVP | ticket | AC-F006 |
| F007 | HS-03 | Station online offline heartbeat | 03 | MVP | ticket | AC-F007 |
| F008 | HS-03 | Available occupied paused expired status | 03 | MVP | ticket | AC-F008 |
| F009 | HS-03 | Maintenance unavailable status | 03 | MVP | ticket | AC-F009 |
| F010 | HS-03 | Station photo and label | 03 | MVP | ticket | AC-F010 |
| F011 | HS-03 | Station search and filters | 03 | MVP | ticket | AC-F011 |
| F012 | HS-03 | Multi-console assignment per table | 03 | MVP | ticket | AC-F012 |
| F013 | HS-03 | Separate TV console controller asset records | 03 | MVP | ticket | AC-F013 |
| F014 | HS-19 | Agent capability and firmware inventory | 19 | MVP | ticket | AC-F014 |
| F015 | HS-05 | Open-ended count-up sessions | 05 | MVP | ticket | AC-F015 |
| F016 | HS-05 | Fixed-duration countdown sessions | 05 | MVP | ticket | AC-F016 |
| F017 | HS-05 | Prepaid sessions | 05 | MVP | ticket | AC-F017 |
| F018 | HS-05 | Postpaid sessions | 05 | MVP | ticket | AC-F018 |
| F019 | HS-04 | Per-minute billing | 04 | MVP | ticket | AC-F019 |
| F020 | HS-04 | Per-hour billing | 04 | MVP | ticket | AC-F020 |
| F021 | HS-04 | Configurable minimum charge | 04 | MVP | ticket | AC-F021 |
| F022 | HS-04 | Configurable billing rounding | 04 | MVP | ticket | AC-F022 |
| F023 | HS-04 | Category-specific prices | 04 | MVP | ticket | AC-F023 |
| F024 | HS-05 | Pause and resume | 05 | MVP | ticket | AC-F024 |
| F025 | HS-05 | Extend active session | 05 | MVP | ticket | AC-F025 |
| F026 | HS-05 | Transfer active session to another station | 05 | MVP | ticket | AC-F026 |
| F027 | HS-05 | Preserve F&B on session transfer | 05 | MVP | ticket | AC-F027 |
| F028 | HS-21 | Warning before time expires | 21 | MVP | ticket | AC-F028 |
| F029 | HS-05 | Automatic expiry lock | 05 | MVP | ticket | AC-F029 |
| F030 | HS-05 | Grace period policy | 05 | MVP | ticket | AC-F030 |
| F031 | HS-05 | Cashier manual end session | 05 | MVP | ticket | AC-F031 |
| F032 | HS-05 | Customer early end request | 05 | MVP | ticket | AC-F032 |
| F033 | HS-10 | Saved unused time credit | 10 | V1 | ticket | AC-F033 |
| F034 | HS-10 | Separate time balances by station category | 10 | V1 | ticket | AC-F034 |
| F035 | HS-10 | Time-credit expiry rules | 10 | V1 | ticket | AC-F035 |
| F036 | HS-20 | Session recovery after agent reboot | 20 | MVP | ticket | AC-F036 |
| F037 | HS-05 | Prevent simultaneous sessions on one station | 05 | MVP | ticket | AC-F037 |
| F038 | HS-04 | Rate snapshot on session start | 04 | MVP | ticket | AC-F038 |
| F039 | HS-04 | Happy hour schedules | 04 | MVP | ticket | AC-F039 |
| F040 | HS-04 | Overnight packages crossing midnight | 04 | MVP | ticket | AC-F040 |
| F041 | HS-04 | Weekend holiday tariffs | 04 | MVP | ticket | AC-F041 |
| F042 | HS-06 | Extra-controller rental charges | 06 | MVP | ticket | AC-F042 |
| F043 | HS-06 | Group multi-station bill | 06 | MVP | ticket | AC-F043 |
| F044 | HS-06 | Complimentary staff-approved session | 06 | MVP | ticket | AC-F044 |
| F045 | HS-06 | Manual adjustment reason and audit | 06 | MVP | ticket | AC-F045 |
| F046 | HS-05 | Session start waits for device acknowledgement | 05 | MVP | ticket | AC-F046 |
| F047 | HS-07 | Refund or credit when device activation fails | 07 | MVP | ticket | AC-F047 |
| F048 | HS-06 | Cash payment and change | 06 | MVP | ticket | AC-F048 |
| F049 | HS-06 | Bank-transfer recording | 06 | MVP | ticket | AC-F049 |
| F050 | HS-07 | QRIS payment recording | 07 | MVP | ticket | AC-F050 |
| F051 | HS-07 | Dynamic QRIS verified webhook | 07 | MVP | ticket | AC-F051 |
| F052 | HS-07 | E-wallet payments | 07 | MVP | ticket | AC-F052 |
| F053 | HS-09 | Prepaid rupiah wallet | 09 | V1 | ticket | AC-F053 |
| F054 | HS-09 | Wallet top-up | 09 | V1 | ticket | AC-F054 |
| F055 | HS-09 | Wallet spend and refund ledger | 09 | V1 | ticket | AC-F055 |
| F056 | HS-06 | Partial deposit payment | 06 | MVP | ticket | AC-F056 |
| F057 | HS-06 | Split payment methods | 06 | MVP | ticket | AC-F057 |
| F058 | HS-06 | Partial refund | 06 | MVP | ticket | AC-F058 |
| F059 | HS-06 | Full refund with approval | 06 | MVP | ticket | AC-F059 |
| F060 | HS-07 | Payment expiry and late settlement | 07 | MVP | ticket | AC-F060 |
| F061 | HS-07 | Webhook signature verification | 07 | MVP | ticket | AC-F061 |
| F062 | HS-07 | Webhook deduplication | 07 | MVP | ticket | AC-F062 |
| F063 | HS-07 | Settlement reconciliation | 07 | MVP | ticket | AC-F063 |
| F064 | HS-07 | Never accept screenshot as payment proof | 07 | MVP | ticket | AC-F064 |
| F065 | HS-06 | Append-only financial entries | 06 | MVP | ticket | AC-F065 |
| F066 | HS-09 | Wallet double-spend prevention | 09 | V1 | ticket | AC-F066 |
| F067 | HS-09 | No silent negative wallet balance | 09 | V1 | ticket | AC-F067 |
| F068 | HS-20 | Offline cash sale | 20 | MVP | ticket | AC-F068 |
| F069 | HS-20 | Offline digital-payment pending state | 20 | MVP | ticket | AC-F069 |
| F070 | HS-07 | Payment provider outage fallback | 07 | MVP | ticket | AC-F070 |
| F071 | HS-13 | Public venue profile | 13 | V1 | ticket | AC-F071 |
| F072 | HS-03 | Game catalogue per venue | 03 | MVP | ticket | AC-F072 |
| F073 | HS-12 | Live station availability | 12 | V1 | ticket | AC-F073 |
| F074 | HS-12 | Reserve specific station | 12 | V1 | ticket | AC-F074 |
| F075 | HS-12 | Reserve whole room | 12 | V1 | ticket | AC-F075 |
| F076 | HS-12 | Multi-station group booking | 12 | V1 | ticket | AC-F076 |
| F077 | HS-12 | Booking slot conflict prevention | 12 | V1 | ticket | AC-F077 |
| F078 | HS-12 | Temporary checkout hold expiry | 12 | V1 | ticket | AC-F078 |
| F079 | HS-12 | Booking deposit | 12 | V1 | ticket | AC-F079 |
| F080 | HS-12 | Cancellation policy | 12 | V1 | ticket | AC-F080 |
| F081 | HS-12 | No-show policy | 12 | V1 | ticket | AC-F081 |
| F082 | HS-12 | Booking-specific blacklist preserving walk-ins | 12 | V1 | ticket | AC-F082 |
| F083 | HS-12 | Waitlist and queue | 12 | V1 | ticket | AC-F083 |
| F084 | HS-12 | Customer check-in | 12 | V1 | ticket | AC-F084 |
| F085 | HS-12 | Late-arrival release | 12 | V1 | ticket | AC-F085 |
| F086 | HS-12 | Reschedule booking | 12 | V1 | ticket | AC-F086 |
| F087 | HS-12 | Guest booking without account | 12 | V1 | ticket | AC-F087 |
| F088 | HS-12 | Booking confirmation notification | 12 | V1 | ticket | AC-F088 |
| F089 | HS-12 | Booking reminder notification | 12 | V1 | ticket | AC-F089 |
| F090 | HS-12 | Customer booking history | 12 | V1 | ticket | AC-F090 |
| F091 | HS-13 | Unit QR self-service session start | 13 | V1 | ticket | AC-F091 |
| F092 | HS-13 | Customer live remaining-time view | 13 | V1 | ticket | AC-F092 |
| F093 | HS-13 | Customer request extension | 13 | V1 | ticket | AC-F093 |
| F094 | HS-25 | Customer call operator | 25 | V1 | ticket | AC-F094 |
| F095 | HS-25 | Customer cashier chat | 25 | V1 | ticket | AC-F095 |
| F096 | HS-15 | Product categories | 15 | MVP | ticket | AC-F096 |
| F097 | HS-15 | Product cost and selling price | 15 | MVP | ticket | AC-F097 |
| F098 | HS-15 | Product photo | 15 | MVP | ticket | AC-F098 |
| F099 | HS-15 | SKU barcode scanning | 15 | MVP | ticket | AC-F099 |
| F100 | HS-15 | Product variants and toppings | 15 | MVP | ticket | AC-F100 |
| F101 | HS-15 | Stock on hand | 15 | MVP | ticket | AC-F101 |
| F102 | HS-15 | Low-stock alerts | 15 | MVP | ticket | AC-F102 |
| F103 | HS-15 | Stock movement history | 15 | MVP | ticket | AC-F103 |
| F104 | HS-16 | Supplier records | 16 | V1 | ticket | AC-F104 |
| F105 | HS-16 | Purchase orders | 16 | V1 | ticket | AC-F105 |
| F106 | HS-16 | Goods receiving | 16 | V1 | ticket | AC-F106 |
| F107 | HS-15 | Stocktake | 15 | MVP | ticket | AC-F107 |
| F108 | HS-15 | FIFO or moving-average costing | 15 | MVP | ticket | AC-F108 |
| F109 | HS-15 | Recipe ingredient deduction | 15 | MVP | ticket | AC-F109 |
| F110 | HS-15 | Wastage and spoilage log | 15 | MVP | ticket | AC-F110 |
| F111 | HS-16 | Branch stock transfers | 16 | V1 | ticket | AC-F111 |
| F112 | HS-14 | QR table menu | 14 | MVP | ticket | AC-F112 |
| F113 | HS-14 | Customer F&B ordering | 14 | MVP | ticket | AC-F113 |
| F114 | HS-14 | Attach F&B to active session | 14 | MVP | ticket | AC-F114 |
| F115 | HS-14 | Combined rental and food bill | 14 | MVP | ticket | AC-F115 |
| F116 | HS-14 | Kitchen order display | 14 | MVP | ticket | AC-F116 |
| F117 | HS-14 | Order status accepted preparing ready delivered | 14 | MVP | ticket | AC-F117 |
| F118 | HS-14 | Kitchen order rejection and refund | 14 | MVP | ticket | AC-F118 |
| F119 | HS-08 | Kitchen receipt routing | 08 | MVP | ticket | AC-F119 |
| F120 | HS-14 | Out-of-stock menu suppression | 14 | MVP | ticket | AC-F120 |
| F121 | HS-14 | Customer order notes and allergies | 14 | MVP | ticket | AC-F121 |
| F122 | HS-11 | Member registration | 11 | V1 | ticket | AC-F122 |
| F123 | HS-11 | Member tier pricing | 11 | V1 | ticket | AC-F123 |
| F124 | HS-11 | Loyalty point earning | 11 | V1 | ticket | AC-F124 |
| F125 | HS-11 | Loyalty reward redemption | 11 | V1 | ticket | AC-F125 |
| F126 | HS-11 | Voucher fixed discount | 11 | V1 | ticket | AC-F126 |
| F127 | HS-11 | Voucher percentage discount | 11 | V1 | ticket | AC-F127 |
| F128 | HS-11 | Voucher free time | 11 | V1 | ticket | AC-F128 |
| F129 | HS-11 | Voucher redemption limits | 11 | V1 | ticket | AC-F129 |
| F130 | HS-09 | Top-up bonus | 09 | V1 | ticket | AC-F130 |
| F131 | HS-11 | Membership subscriptions | 11 | V1 | ticket | AC-F131 |
| F132 | HS-11 | Member game history | 11 | V1 | ticket | AC-F132 |
| F133 | HS-11 | Member spending history | 11 | V1 | ticket | AC-F133 |
| F134 | HS-11 | Member leaderboard | 11 | V1 | ticket | AC-F134 |
| F135 | HS-11 | TV member rank greeting | 11 | V1 | ticket | AC-F135 |
| F136 | HS-11 | Marketing consent and opt-out | 11 | V1 | ticket | AC-F136 |
| F137 | HS-11 | Lapsed-customer reminders | 11 | V1 | ticket | AC-F137 |
| F138 | HS-11 | Referral programme | 11 | V1 | ticket | AC-F138 |
| F139 | HS-11 | Birthday reward | 11 | V1 | ticket | AC-F139 |
| F140 | HS-11 | Family or guardian account | 11 | V1 | ticket | AC-F140 |
| F141 | HS-32 | Tournament registration | 32 | V2 | deferred | AC-F141 |
| F142 | HS-32 | Tournament entry fees | 32 | V2 | deferred | AC-F142 |
| F143 | HS-32 | Single elimination bracket | 32 | V2 | deferred | AC-F143 |
| F144 | HS-32 | Double elimination bracket | 32 | V2 | deferred | AC-F144 |
| F145 | HS-32 | Round robin league | 32 | V2 | deferred | AC-F145 |
| F146 | HS-32 | Score-based competition | 32 | V2 | deferred | AC-F146 |
| F147 | HS-32 | Match scheduling to physical stations | 32 | V2 | deferred | AC-F147 |
| F148 | HS-32 | Player check-in and no-shows | 32 | V2 | deferred | AC-F148 |
| F149 | HS-32 | Seeding and byes | 32 | V2 | deferred | AC-F149 |
| F150 | HS-32 | Result entry and dispute review | 32 | V2 | deferred | AC-F150 |
| F151 | HS-32 | Prize accounting | 32 | V2 | deferred | AC-F151 |
| F152 | HS-32 | Public bracket and leaderboard | 32 | V2 | deferred | AC-F152 |
| F153 | HS-32 | Spectator display | 32 | V2 | deferred | AC-F153 |
| F154 | HS-32 | Event station block booking | 32 | V2 | deferred | AC-F154 |
| F155 | HS-32 | Community recurring leagues | 32 | V2 | deferred | AC-F155 |
| F156 | HS-02 | Role-based permissions | 02 | MVP | ticket | AC-F156 |
| F157 | HS-02 | Branch-scoped staff access | 02 | MVP | ticket | AC-F157 |
| F158 | HS-06 | Manager approval for voids refunds free time | 06 | MVP | ticket | AC-F158 |
| F159 | HS-17 | Cash drawer opening float | 17 | MVP | ticket | AC-F159 |
| F160 | HS-17 | Shift close and cash variance | 17 | MVP | ticket | AC-F160 |
| F161 | HS-17 | Staff handover notes | 17 | MVP | ticket | AC-F161 |
| F162 | HS-17 | Cash expenses | 17 | MVP | ticket | AC-F162 |
| F163 | HS-30 | Staff activity audit | 30 | MVP | ticket | AC-F163 |
| F164 | HS-35 | Clock-in attendance | 35 | V1 | ticket | AC-F164 |
| F165 | HS-35 | Geofenced attendance optional | 35 | V1 | ticket | AC-F165 |
| F166 | HS-35 | Payroll export | 35 | V1 | ticket | AC-F166 |
| F167 | HS-08 | Cashier thermal receipt | 08 | MVP | ticket | AC-F167 |
| F168 | HS-08 | PDF receipt | 08 | MVP | ticket | AC-F168 |
| F169 | HS-08 | Bluetooth printer support | 08 | MVP | ticket | AC-F169 |
| F170 | HS-08 | LAN printer support | 08 | MVP | ticket | AC-F170 |
| F171 | HS-08 | Printer offline queue | 08 | MVP | ticket | AC-F171 |
| F172 | HS-18 | Revenue per station report | 18 | V1 | ticket | AC-F172 |
| F173 | HS-18 | Utilization and idle-time report | 18 | V1 | ticket | AC-F173 |
| F174 | HS-18 | Peak-hour report | 18 | V1 | ticket | AC-F174 |
| F175 | HS-18 | Payment-method report | 18 | V1 | ticket | AC-F175 |
| F176 | HS-18 | F&B gross margin report | 18 | V1 | ticket | AC-F176 |
| F177 | HS-33 | Branch comparison | 33 | V1 | ticket | AC-F177 |
| F178 | HS-18 | Inventory valuation report | 18 | V1 | ticket | AC-F178 |
| F179 | HS-18 | Wallet liability report | 18 | V1 | ticket | AC-F179 |
| F180 | HS-18 | Refund and void report | 18 | V1 | ticket | AC-F180 |
| F181 | HS-18 | Excel CSV export | 18 | V1 | ticket | AC-F181 |
| F182 | HS-36 | Accounting export | 36 | V1 | ticket | AC-F182 |
| F183 | HS-36 | Tax and service charge settings | 36 | V1 | ticket | AC-F183 |
| F184 | HS-19 | Android TV pairing code | 19 | MVP | ticket | AC-F184 |
| F185 | HS-19 | Pairing approval and short code expiry | 19 | MVP | ticket | AC-F185 |
| F186 | HS-19 | Signed device identity and revocation | 19 | MVP | ticket | AC-F186 |
| F187 | HS-21 | Foreground standby lock screen | 21 | MVP | ticket | AC-F187 |
| F188 | HS-21 | Admin PIN exit with rate limit | 21 | MVP | ticket | AC-F188 |
| F189 | HS-19 | HDMI input switching capability probe | 19 | MVP | ticket | AC-F189 |
| F190 | HS-21 | Active-session return-to-HDMI guard | 21 | MVP | ticket | AC-F190 |
| F191 | HS-19 | Overlay permission setup diagnostics | 19 | MVP | ticket | AC-F191 |
| F192 | HS-21 | Device-owner kiosk supported-model path | 21 | MVP | ticket | AC-F192 |
| F193 | HS-21 | Boot recovery and watchdog | 21 | MVP | ticket | AC-F193 |
| F194 | HS-21 | Local monotonic expiry timer | 21 | MVP | ticket | AC-F194 |
| F195 | HS-21 | Offline active-session enforcement | 21 | MVP | ticket | AC-F195 |
| F196 | HS-20 | Signed session lease and expiry | 20 | MVP | ticket | AC-F196 |
| F197 | HS-20 | Tamper and clock rollback detection | 20 | MVP | ticket | AC-F197 |
| F198 | HS-20 | Agent heartbeat and last-command ACK | 20 | MVP | ticket | AC-F198 |
| F199 | HS-22 | TV volume and mute control | 22 | V1 | ticket | AC-F199 |
| F200 | HS-23 | CEC TV power adapter | 23 | MVP | ticket | AC-F200 |
| F201 | HS-23 | IR TV power adapter | 23 | MVP | ticket | AC-F201 |
| F202 | HS-23 | HDMI switch blank-source fallback | 23 | MVP | ticket | AC-F202 |
| F203 | HS-23 | TV-only smart plug fallback | 23 | MVP | ticket | AC-F203 |
| F204 | HS-23 | Certified 4K120 HDR VRR HDMI path | 23 | MVP | ticket | AC-F204 |
| F205 | HS-21 | Physical remote and input bypass test | 21 | MVP | ticket | AC-F205 |
| F206 | HS-21 | Agent version rollout and rollback | 21 | MVP | ticket | AC-F206 |
| F207 | HS-21 | Screen lock does not cut console power | 21 | MVP | ticket | AC-F207 |
| F208 | HS-21 | Manual operator fallback | 21 | MVP | ticket | AC-F208 |
| F209 | HS-27 | Windows seat lock agent | 27 | V1 | ticket | AC-F209 |
| F210 | HS-27 | Windows member game launcher | 27 | V1 | ticket | AC-F210 |
| F211 | HS-27 | Windows remaining-time HUD | 27 | V1 | ticket | AC-F211 |
| F212 | HS-27 | Windows customer food ordering | 27 | V1 | ticket | AC-F212 |
| F213 | HS-27 | Windows cashier chat | 27 | V1 | ticket | AC-F213 |
| F214 | HS-27 | Windows remote restart and shutdown | 27 | V1 | ticket | AC-F214 |
| F215 | HS-27 | Windows reboot session recovery | 27 | V1 | ticket | AC-F215 |
| F216 | HS-29 | Windows game update orchestration | 29 | V2 | deferred | AC-F216 |
| F217 | HS-28 | Licensed game-account pool integration | 28 | V2 | deferred | AC-F217 |
| F218 | HS-28 | Game launch concurrency limits | 28 | V1 | ticket | AC-F218 |
| F219 | HS-27 | Per-session user-data cleanup | 27 | V1 | ticket | AC-F219 |
| F220 | HS-27 | Windows Wake-on-LAN | 27 | V1 | ticket | AC-F220 |
| F221 | HS-29 | Diskless boot integration not reimplementation | 29 | V2 | deferred | AC-F221 |
| F222 | HS-38 | Android rental-phone allowed-game launcher | 38 | V2 | deferred | AC-F222 |
| F223 | HS-38 | Android rental-phone kiosk expiry lock | 38 | V2 | deferred | AC-F223 |
| F224 | HS-39 | webOS foreground app prototype | 39 | V2 | deferred | AC-F224 |
| F225 | HS-39 | webOS supported HDMI control feasibility gate | 39 | V2 | deferred | AC-F225 |
| F226 | HS-39 | Tizen foreground HDMI PiP prototype | 39 | V2 | deferred | AC-F226 |
| F227 | HS-26 | Commercial signage kiosk integration | 26 | V2 | deferred | AC-F227 |
| F228 | HS-20 | Raspberry Pi edge controller | 20 | MVP | ticket | AC-F228 |
| F229 | HS-13 | Customer installable PWA | 13 | V1 | ticket | AC-F229 |
| F230 | HS-18 | Owner mobile dashboard | 18 | V1 | ticket | AC-F230 |
| F231 | HS-40 | Self-service kiosk | 40 | V2 | deferred | AC-F231 |
| F232 | HS-26 | Lobby station availability billboard | 26 | V1 | ticket | AC-F232 |
| F233 | HS-20 | Local venue session authority | 20 | MVP | ticket | AC-F233 |
| F234 | HS-20 | Durable offline command queue | 20 | MVP | ticket | AC-F234 |
| F235 | HS-20 | Reconnect event reconciliation | 20 | MVP | ticket | AC-F235 |
| F236 | HS-20 | Duplicate command idempotency | 20 | MVP | ticket | AC-F236 |
| F237 | HS-20 | Stale command and replay rejection | 20 | MVP | ticket | AC-F237 |
| F238 | HS-20 | Sequence-numbered station state | 20 | MVP | ticket | AC-F238 |
| F239 | HS-30 | Mutual authentication for device transport | 30 | MVP | ticket | AC-F239 |
| F240 | HS-30 | Outbound-only edge connectivity | 30 | MVP | ticket | AC-F240 |
| F241 | HS-30 | Device network segmentation | 30 | MVP | ticket | AC-F241 |
| F242 | HS-30 | Least-privilege hardware adapters | 30 | MVP | ticket | AC-F242 |
| F243 | HS-30 | Encrypted secrets at rest | 30 | MVP | ticket | AC-F243 |
| F244 | HS-30 | No payment or account secrets in client logs | 30 | MVP | ticket | AC-F244 |
| F245 | HS-30 | Staff MFA | 30 | MVP | ticket | AC-F245 |
| F246 | HS-30 | Owner recovery procedure | 30 | MVP | ticket | AC-F246 |
| F247 | HS-30 | Encrypted backups | 30 | MVP | ticket | AC-F247 |
| F248 | HS-41 | Restore drill | 41 | V1 | ticket | AC-F248 |
| F249 | HS-30 | Consent-aware customer data retention | 30 | MVP | ticket | AC-F249 |
| F250 | HS-30 | Customer data export and erasure | 30 | MVP | ticket | AC-F250 |
| F251 | HS-30 | Sensitive ID upload disabled by default | 30 | MVP | ticket | AC-F251 |
| F252 | HS-30 | No persistent customer location tracking by default | 30 | MVP | ticket | AC-F252 |
| F253 | HS-30 | Remote assistance explicit approval | 30 | MVP | ticket | AC-F253 |
| F254 | HS-24 | Signed agent updates | 24 | V1 | ticket | AC-F254 |
| F255 | HS-30 | Audit trail export | 30 | MVP | ticket | AC-F255 |
| F256 | HS-30 | Emergency local override with audit | 30 | MVP | ticket | AC-F256 |
| F257 | HS-20 | Power outage recovery | 20 | MVP | ticket | AC-F257 |
| F258 | HS-09 | Conflict-safe offline wallet policy | 09 | V1 | ticket | AC-F258 |
| F259 | HS-09 | Cross-branch wallet consistency | 09 | V1 | ticket | AC-F259 |
| F260 | HS-34 | Take-home console rental | 34 | V2 | deferred | AC-F260 |
| F261 | HS-34 | Rental security deposit | 34 | V2 | deferred | AC-F261 |
| F262 | HS-34 | Condition photos at checkout and return | 34 | V2 | deferred | AC-F262 |
| F263 | HS-34 | Serial-number asset tracking | 34 | V2 | deferred | AC-F263 |
| F264 | HS-34 | Accessory issue return checklist | 34 | V2 | deferred | AC-F264 |
| F265 | HS-34 | Damage fee dispute workflow | 34 | V2 | deferred | AC-F265 |
| F266 | HS-34 | Delivery scheduling | 34 | V2 | deferred | AC-F266 |
| F267 | HS-34 | Delivery distance fee | 34 | V2 | deferred | AC-F267 |
| F268 | HS-34 | Rental overdue reminders | 34 | V2 | deferred | AC-F268 |
| F269 | HS-16 | Multi-branch stock and asset transfer | 16 | V2 | deferred | AC-F269 |
| F270 | HS-33 | Franchise consolidated reporting | 33 | V2 | deferred | AC-F270 |
| F271 | HS-42 | Open API | 42 | V2 | deferred | AC-F271 |
| F272 | HS-42 | Webhook integrations | 42 | V2 | deferred | AC-F272 |
| F273 | HS-41 | Migration import preview and rollback | 41 | V2 | deferred | AC-F273 |
| F274 | HS-45 | Operator training sandbox | 45 | V2 | deferred | AC-F274 |
| F275 | HS-44 | Indonesian English localization | 44 | V2 | deferred | AC-F275 |
| F276 | HS-44 | Accessible keyboard and TV D-pad navigation | 44 | V2 | deferred | AC-F276 |
| F277 | HS-44 | Reduced motion support | 44 | V2 | deferred | AC-F277 |
| F278 | HS-26 | Permission-sensitive lobby privacy | 26 | V2 | deferred | AC-F278 |
| F279 | HS-31 | Hardware compatibility certification catalogue | 31 | V2 | deferred | AC-F279 |
| F280 | HS-45 | Agent simulator and fault-injection harness | 45 | V2 | deferred | AC-F280 |
| F281 | HS-24 | Health alerts for controller batteries | 24 | V2 | deferred | AC-F281 |
| F282 | HS-18 | Energy consumption reporting | 18 | V2 | deferred | AC-F282 |
| F283 | HS-03 | Maintenance service tickets | 03 | V2 | deferred | AC-F283 |
| F284 | HS-25 | Public status and incident notifications | 25 | V2 | deferred | AC-F284 |
| FR-KULA-001 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-001 | 18 | V1 | ticket | AC-FR-KULA-001 |
| FR-KULA-002 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-002 | 36 | V1 | ticket | AC-FR-KULA-002 |
| FR-KULA-003 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-003 | 36 | V1 | ticket | AC-FR-KULA-003 |
| FR-KULA-004 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-004 | 36 | V1 | ticket | AC-FR-KULA-004 |
| FR-KULA-005 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-005 | 18 | V1 | ticket | AC-FR-KULA-005 |
| FR-KULA-006 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-006 | 18 | V1 | ticket | AC-FR-KULA-006 |
| FR-KULA-007 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-007 | 18 | V1 | ticket | AC-FR-KULA-007 |
| FR-KULA-008 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-008 | 18 | V1 | ticket | AC-FR-KULA-008 |
| FR-KULA-009 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-009 | 18 | V1 | ticket | AC-FR-KULA-009 |
| FR-KULA-010 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-010 | 18 | V1 | ticket | AC-FR-KULA-010 |
| FR-KULA-011 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-011 | 18 | V1 | ticket | AC-FR-KULA-011 |
| FR-KULA-012 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-012 | 15 | MVP | ticket | AC-FR-KULA-012 |
| FR-KULA-013 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-013 | 15 | MVP | ticket | AC-FR-KULA-013 |
| FR-KULA-014 | HS-34 | Sewa bawa pulang dan custody aset — referensi FR-KULA-014 | 34 | V2 | deferred | AC-FR-KULA-014 |
| FR-KULA-015 | HS-17 | Shift kasir dan serah terima sesi aktif — referensi FR-KULA-015 | 17 | MVP | ticket | AC-FR-KULA-015 |
| FR-KULA-016 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-016 | 18 | V1 | ticket | AC-FR-KULA-016 |
| FR-KULA-017 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-017 | 18 | V1 | ticket | AC-FR-KULA-017 |
| FR-KULA-018 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-018 | 43 | V2 | deferred | AC-FR-KULA-018 |
| FR-KULA-019 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-019 | 18 | V1 | ticket | AC-FR-KULA-019 |
| FR-KULA-020 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-020 | 11 | V1 | ticket | AC-FR-KULA-020 |
| FR-KULA-021 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-021 | 11 | V1 | ticket | AC-FR-KULA-021 |
| FR-KULA-022 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-022 | 35 | V1 | ticket | AC-FR-KULA-022 |
| FR-KULA-023 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-023 | 35 | V1 | ticket | AC-FR-KULA-023 |
| FR-KULA-024 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-024 | 45 | MVP | out-of-scope | AC-FR-KULA-024 |
| FR-KULA-025 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-025 | 45 | MVP | out-of-scope | AC-FR-KULA-025 |
| FR-KULA-026 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-026 | 45 | MVP | out-of-scope | AC-FR-KULA-026 |
| FR-KULA-027 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-027 | 45 | MVP | out-of-scope | AC-FR-KULA-027 |
| FR-KULA-028 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-028 | 45 | MVP | out-of-scope | AC-FR-KULA-028 |
| FR-KULA-029 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-029 | 45 | MVP | out-of-scope | AC-FR-KULA-029 |
| FR-KULA-030 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-030 | 45 | MVP | out-of-scope | AC-FR-KULA-030 |
| FR-KULA-031 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-031 | 18 | V1 | ticket | AC-FR-KULA-031 |
| FR-KULA-032 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-032 | 15 | MVP | ticket | AC-FR-KULA-032 |
| FR-KULA-033 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-033 | 15 | MVP | ticket | AC-FR-KULA-033 |
| FR-KULA-034 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-034 | 15 | MVP | ticket | AC-FR-KULA-034 |
| FR-KULA-035 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-035 | 11 | V1 | ticket | AC-FR-KULA-035 |
| FR-KULA-036 | HS-30 | Keamanan, privasi, audit dan restore — referensi FR-KULA-036 | 30 | MVP | ticket | AC-FR-KULA-036 |
| FR-KULA-037 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-037 | 35 | V1 | ticket | AC-FR-KULA-037 |
| FR-KULA-038 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-038 | 11 | V1 | ticket | AC-FR-KULA-038 |
| FR-KULA-039 | HS-25 | Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-039 | 25 | V1 | ticket | AC-FR-KULA-039 |
| FR-KULA-040 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-040 | 35 | V1 | ticket | AC-FR-KULA-040 |
| FR-KULA-041 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-041 | 37 | V2 | deferred | AC-FR-KULA-041 |
| FR-KULA-042 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-042 | 37 | V2 | deferred | AC-FR-KULA-042 |
| FR-KULA-043 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-043 | 37 | V2 | deferred | AC-FR-KULA-043 |
| FR-KULA-044 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-044 | 37 | V2 | deferred | AC-FR-KULA-044 |
| FR-KULA-045 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-045 | 37 | V2 | deferred | AC-FR-KULA-045 |
| FR-KULA-046 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-046 | 05 | MVP | ticket | AC-FR-KULA-046 |
| FR-KULA-047 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-047 | 21 | MVP | ticket | AC-FR-KULA-047 |
| FR-KULA-048 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-048 | 12 | V1 | ticket | AC-FR-KULA-048 |
| FR-KULA-049 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-049 | 14 | MVP | ticket | AC-FR-KULA-049 |
| FR-KULA-050 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-050 | 14 | MVP | ticket | AC-FR-KULA-050 |
| FR-KULA-051 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-051 | 14 | MVP | ticket | AC-FR-KULA-051 |
| FR-KULA-052 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-052 | 14 | MVP | ticket | AC-FR-KULA-052 |
| FR-KULA-053 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-053 | 14 | MVP | ticket | AC-FR-KULA-053 |
| FR-KULA-054 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-054 | 15 | MVP | ticket | AC-FR-KULA-054 |
| FR-KULA-055 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-055 | 18 | V1 | ticket | AC-FR-KULA-055 |
| FR-KULA-056 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-056 | 45 | MVP | out-of-scope | AC-FR-KULA-056 |
| FR-KULA-057 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-057 | 45 | MVP | out-of-scope | AC-FR-KULA-057 |
| FR-KULA-058 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-058 | 45 | MVP | out-of-scope | AC-FR-KULA-058 |
| FR-KULA-059 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-059 | 45 | MVP | out-of-scope | AC-FR-KULA-059 |
| FR-KULA-060 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-060 | 45 | MVP | out-of-scope | AC-FR-KULA-060 |
| FR-KULA-061 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-061 | 45 | MVP | out-of-scope | AC-FR-KULA-061 |
| FR-KULA-062 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-062 | 45 | MVP | out-of-scope | AC-FR-KULA-062 |
| FR-KULA-063 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-063 | 12 | V1 | ticket | AC-FR-KULA-063 |
| FR-KULA-064 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-064 | 14 | MVP | ticket | AC-FR-KULA-064 |
| FR-KULA-065 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-065 | 06 | MVP | ticket | AC-FR-KULA-065 |
| FR-KULA-066 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-066 | 45 | MVP | out-of-scope | AC-FR-KULA-066 |
| FR-KULA-067 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-067 | 45 | MVP | out-of-scope | AC-FR-KULA-067 |
| FR-KULA-068 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-068 | 45 | MVP | out-of-scope | AC-FR-KULA-068 |
| FR-KULA-069 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-069 | 45 | MVP | out-of-scope | AC-FR-KULA-069 |
| FR-KULA-070 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-070 | 35 | V1 | ticket | AC-FR-KULA-070 |
| FR-KULA-071 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-071 | 35 | V1 | ticket | AC-FR-KULA-071 |
| FR-KULA-072 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-072 | 35 | V1 | ticket | AC-FR-KULA-072 |
| FR-KULA-073 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-073 | 35 | V1 | ticket | AC-FR-KULA-073 |
| FR-KULA-074 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-074 | 35 | V1 | ticket | AC-FR-KULA-074 |
| FR-KULA-075 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-075 | 35 | V1 | ticket | AC-FR-KULA-075 |
| FR-KULA-076 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-076 | 35 | V1 | ticket | AC-FR-KULA-076 |
| FR-KULA-077 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-077 | 35 | V1 | ticket | AC-FR-KULA-077 |
| FR-KULA-078 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-078 | 35 | V1 | ticket | AC-FR-KULA-078 |
| FR-KULA-079 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-079 | 45 | MVP | out-of-scope | AC-FR-KULA-079 |
| FR-KULA-080 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-080 | 45 | MVP | out-of-scope | AC-FR-KULA-080 |
| FR-KULA-081 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-081 | 15 | MVP | ticket | AC-FR-KULA-081 |
| FR-KULA-082 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-082 | 45 | MVP | out-of-scope | AC-FR-KULA-082 |
| FR-KULA-083 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-083 | 45 | MVP | out-of-scope | AC-FR-KULA-083 |
| FR-KULA-084 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-084 | 45 | MVP | out-of-scope | AC-FR-KULA-084 |
| FR-KULA-085 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-085 | 45 | MVP | out-of-scope | AC-FR-KULA-085 |
| FR-KULA-086 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-086 | 45 | MVP | out-of-scope | AC-FR-KULA-086 |
| FR-KULA-087 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-087 | 45 | MVP | out-of-scope | AC-FR-KULA-087 |
| FR-KULA-088 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-088 | 45 | MVP | out-of-scope | AC-FR-KULA-088 |
| FR-KULA-089 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-089 | 45 | MVP | out-of-scope | AC-FR-KULA-089 |
| FR-KULA-090 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-090 | 45 | MVP | out-of-scope | AC-FR-KULA-090 |
| FR-KULA-091 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-091 | 45 | MVP | out-of-scope | AC-FR-KULA-091 |
| FR-KULA-092 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-092 | 45 | MVP | out-of-scope | AC-FR-KULA-092 |
| FR-KULA-093 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-093 | 12 | V1 | ticket | AC-FR-KULA-093 |
| FR-KULA-094 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-094 | 11 | V1 | ticket | AC-FR-KULA-094 |
| FR-KULA-095 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-095 | 45 | MVP | out-of-scope | AC-FR-KULA-095 |
| FR-KULA-096 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-096 | 45 | MVP | out-of-scope | AC-FR-KULA-096 |
| FR-KULA-097 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-097 | 45 | MVP | out-of-scope | AC-FR-KULA-097 |
| FR-KULA-098 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-098 | 45 | MVP | out-of-scope | AC-FR-KULA-098 |
| FR-KULA-099 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-099 | 11 | V1 | ticket | AC-FR-KULA-099 |
| FR-KULA-100 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-100 | 45 | MVP | out-of-scope | AC-FR-KULA-100 |
| FR-KULA-101 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-101 | 45 | MVP | out-of-scope | AC-FR-KULA-101 |
| FR-KULA-102 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-102 | 45 | MVP | out-of-scope | AC-FR-KULA-102 |
| FR-KULA-103 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-103 | 45 | MVP | out-of-scope | AC-FR-KULA-103 |
| FR-KULA-104 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-104 | 45 | MVP | out-of-scope | AC-FR-KULA-104 |
| FR-KULA-105 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-105 | 18 | V1 | ticket | AC-FR-KULA-105 |
| FR-KULA-106 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-106 | 45 | MVP | out-of-scope | AC-FR-KULA-106 |
| FR-KULA-107 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-107 | 45 | MVP | out-of-scope | AC-FR-KULA-107 |
| FR-KULA-108 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-108 | 45 | MVP | out-of-scope | AC-FR-KULA-108 |
| FR-KULA-109 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-109 | 45 | MVP | out-of-scope | AC-FR-KULA-109 |
| FR-KULA-110 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-110 | 45 | MVP | out-of-scope | AC-FR-KULA-110 |
| FR-KULA-111 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-111 | 45 | MVP | out-of-scope | AC-FR-KULA-111 |
| FR-KULA-112 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-112 | 45 | MVP | out-of-scope | AC-FR-KULA-112 |
| FR-KULA-113 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-113 | 45 | MVP | out-of-scope | AC-FR-KULA-113 |
| FR-KULA-114 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-114 | 18 | V1 | ticket | AC-FR-KULA-114 |
| FR-KULA-115 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-115 | 12 | V1 | ticket | AC-FR-KULA-115 |
| FR-KULA-116 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-116 | 45 | MVP | out-of-scope | AC-FR-KULA-116 |
| FR-KULA-117 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-117 | 45 | MVP | out-of-scope | AC-FR-KULA-117 |
| FR-KULA-118 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-118 | 45 | MVP | out-of-scope | AC-FR-KULA-118 |
| FR-KULA-119 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-119 | 45 | MVP | out-of-scope | AC-FR-KULA-119 |
| FR-KULA-120 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-120 | 45 | MVP | out-of-scope | AC-FR-KULA-120 |
| FR-KULA-121 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-121 | 45 | MVP | out-of-scope | AC-FR-KULA-121 |
| FR-KULA-122 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-122 | 45 | MVP | out-of-scope | AC-FR-KULA-122 |
| FR-KULA-123 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-123 | 45 | MVP | out-of-scope | AC-FR-KULA-123 |
| FR-KULA-124 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-124 | 45 | MVP | out-of-scope | AC-FR-KULA-124 |
| FR-KULA-125 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-125 | 45 | MVP | out-of-scope | AC-FR-KULA-125 |
| FR-KULA-126 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-126 | 45 | MVP | out-of-scope | AC-FR-KULA-126 |
| FR-KULA-127 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-127 | 45 | MVP | out-of-scope | AC-FR-KULA-127 |
| FR-KULA-128 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-128 | 45 | MVP | out-of-scope | AC-FR-KULA-128 |
| FR-KULA-129 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-129 | 45 | MVP | out-of-scope | AC-FR-KULA-129 |
| FR-KULA-130 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-130 | 45 | MVP | out-of-scope | AC-FR-KULA-130 |
| FR-KULA-131 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-131 | 45 | MVP | out-of-scope | AC-FR-KULA-131 |
| FR-KULA-132 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-132 | 45 | MVP | out-of-scope | AC-FR-KULA-132 |
| FR-KULA-133 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-133 | 45 | MVP | out-of-scope | AC-FR-KULA-133 |
| FR-KULA-134 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-134 | 45 | MVP | out-of-scope | AC-FR-KULA-134 |
| FR-KULA-135 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-135 | 45 | MVP | out-of-scope | AC-FR-KULA-135 |
| FR-KULA-136 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-136 | 45 | MVP | out-of-scope | AC-FR-KULA-136 |
| FR-KULA-137 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-137 | 45 | MVP | out-of-scope | AC-FR-KULA-137 |
| FR-KULA-138 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-138 | 18 | V1 | ticket | AC-FR-KULA-138 |
| FR-KULA-139 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-139 | 45 | MVP | out-of-scope | AC-FR-KULA-139 |
| FR-KULA-140 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-140 | 12 | V1 | ticket | AC-FR-KULA-140 |
| FR-KULA-141 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-141 | 45 | MVP | out-of-scope | AC-FR-KULA-141 |
| FR-KULA-142 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-142 | 45 | MVP | out-of-scope | AC-FR-KULA-142 |
| FR-KULA-143 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-143 | 45 | MVP | out-of-scope | AC-FR-KULA-143 |
| FR-KULA-144 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-144 | 45 | MVP | out-of-scope | AC-FR-KULA-144 |
| FR-KULA-145 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-145 | 45 | MVP | out-of-scope | AC-FR-KULA-145 |
| FR-KULA-146 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-146 | 12 | V1 | ticket | AC-FR-KULA-146 |
| FR-KULA-147 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-147 | 45 | MVP | ticket | AC-FR-KULA-147 |
| FR-KULA-148 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-148 | 45 | MVP | ticket | AC-FR-KULA-148 |
| FR-KULA-149 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-149 | 45 | MVP | ticket | AC-FR-KULA-149 |
| FR-KULA-150 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-150 | 45 | MVP | ticket | AC-FR-KULA-150 |
| FR-KULA-151 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-151 | 45 | MVP | ticket | AC-FR-KULA-151 |
| FR-KULA-152 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-152 | 45 | MVP | ticket | AC-FR-KULA-152 |
| FR-KULA-153 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-153 | 45 | MVP | ticket | AC-FR-KULA-153 |
| FR-KULA-154 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-154 | 12 | V1 | ticket | AC-FR-KULA-154 |
| FR-KULA-155 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-155 | 35 | V1 | ticket | AC-FR-KULA-155 |
| FR-KULA-156 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-156 | 12 | V1 | ticket | AC-FR-KULA-156 |
| FR-KULA-157 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-157 | 45 | MVP | ticket | AC-FR-KULA-157 |
| FR-KULA-158 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-158 | 14 | MVP | ticket | AC-FR-KULA-158 |
| FR-KULA-159 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-159 | 05 | MVP | ticket | AC-FR-KULA-159 |
| FR-KULA-160 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-160 | 45 | MVP | out-of-scope | AC-FR-KULA-160 |
| FR-KULA-161 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-161 | 45 | MVP | ticket | AC-FR-KULA-161 |
| FR-KULA-162 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-162 | 45 | MVP | ticket | AC-FR-KULA-162 |
| FR-KULA-163 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-163 | 45 | MVP | out-of-scope | AC-FR-KULA-163 |
| FR-KULA-164 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-164 | 45 | MVP | ticket | AC-FR-KULA-164 |
| FR-KULA-165 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-165 | 45 | MVP | out-of-scope | AC-FR-KULA-165 |
| FR-KULA-166 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-166 | 14 | MVP | ticket | AC-FR-KULA-166 |
| FR-KULA-167 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-167 | 45 | MVP | ticket | AC-FR-KULA-167 |
| FR-KULA-168 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-168 | 05 | MVP | ticket | AC-FR-KULA-168 |
| FR-KULA-169 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-169 | 45 | MVP | out-of-scope | AC-FR-KULA-169 |
| FR-KULA-170 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-170 | 45 | MVP | out-of-scope | AC-FR-KULA-170 |
| FR-KULA-171 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-171 | 45 | MVP | out-of-scope | AC-FR-KULA-171 |
| FR-KULA-172 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-172 | 45 | MVP | out-of-scope | AC-FR-KULA-172 |
| FR-KULA-173 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-173 | 45 | MVP | out-of-scope | AC-FR-KULA-173 |
| FR-KULA-174 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-174 | 45 | MVP | out-of-scope | AC-FR-KULA-174 |
| FR-KULA-175 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-175 | 45 | MVP | out-of-scope | AC-FR-KULA-175 |
| FR-KULA-176 | HS-17 | Shift kasir dan serah terima sesi aktif — referensi FR-KULA-176 | 17 | MVP | ticket | AC-FR-KULA-176 |
| FR-KULA-177 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-177 | 45 | MVP | out-of-scope | AC-FR-KULA-177 |
| FR-KULA-178 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-178 | 45 | MVP | out-of-scope | AC-FR-KULA-178 |
| FR-KULA-179 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-179 | 45 | MVP | out-of-scope | AC-FR-KULA-179 |
| FR-KULA-180 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-180 | 45 | MVP | out-of-scope | AC-FR-KULA-180 |
| FR-KULA-181 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-181 | 45 | MVP | out-of-scope | AC-FR-KULA-181 |
| FR-KULA-182 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-182 | 45 | MVP | out-of-scope | AC-FR-KULA-182 |
| FR-KULA-183 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-183 | 08 | MVP | ticket | AC-FR-KULA-183 |
| FR-KULA-184 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-184 | 45 | MVP | out-of-scope | AC-FR-KULA-184 |
| FR-KULA-185 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-185 | 45 | MVP | out-of-scope | AC-FR-KULA-185 |
| FR-KULA-186 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-186 | 06 | MVP | ticket | AC-FR-KULA-186 |
| FR-KULA-187 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-187 | 15 | MVP | ticket | AC-FR-KULA-187 |
| FR-KULA-188 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-188 | 08 | MVP | ticket | AC-FR-KULA-188 |
| FR-KULA-189 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-189 | 16 | V1 | ticket | AC-FR-KULA-189 |
| FR-KULA-190 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-190 | 16 | V1 | ticket | AC-FR-KULA-190 |
| FR-KULA-191 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-191 | 18 | V1 | ticket | AC-FR-KULA-191 |
| FR-KULA-192 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-192 | 15 | MVP | ticket | AC-FR-KULA-192 |
| FR-KULA-193 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-193 | 18 | V1 | ticket | AC-FR-KULA-193 |
| FR-KULA-194 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-194 | 06 | MVP | ticket | AC-FR-KULA-194 |
| FR-KULA-195 | HS-17 | Shift kasir dan serah terima sesi aktif — referensi FR-KULA-195 | 17 | MVP | ticket | AC-FR-KULA-195 |
| FR-KULA-196 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-196 | 15 | MVP | ticket | AC-FR-KULA-196 |
| FR-KULA-197 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-197 | 06 | MVP | ticket | AC-FR-KULA-197 |
| FR-KULA-198 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-198 | 06 | MVP | ticket | AC-FR-KULA-198 |
| FR-KULA-199 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-199 | 11 | V1 | ticket | AC-FR-KULA-199 |
| FR-KULA-200 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-200 | 06 | MVP | ticket | AC-FR-KULA-200 |
| FR-KULA-201 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-201 | 06 | MVP | ticket | AC-FR-KULA-201 |
| FR-KULA-202 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-202 | 06 | MVP | ticket | AC-FR-KULA-202 |
| FR-KULA-203 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-203 | 08 | MVP | ticket | AC-FR-KULA-203 |
| FR-KULA-204 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-204 | 43 | V2 | deferred | AC-FR-KULA-204 |
| FR-KULA-205 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-205 | 11 | V1 | ticket | AC-FR-KULA-205 |
| FR-KULA-206 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-206 | 11 | V1 | ticket | AC-FR-KULA-206 |
| FR-KULA-207 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-207 | 11 | V1 | ticket | AC-FR-KULA-207 |
| FR-KULA-208 | HS-10 | Tabungan waktu, penebusan dan kedaluwarsa — referensi FR-KULA-208 | 10 | V1 | ticket | AC-FR-KULA-208 |
| FR-KULA-209 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-209 | 05 | MVP | ticket | AC-FR-KULA-209 |
| FR-KULA-210 | HS-19 | Pairing aman dan capability probe — referensi FR-KULA-210 | 19 | MVP | ticket | AC-FR-KULA-210 |
| FR-KULA-211 | HS-10 | Tabungan waktu, penebusan dan kedaluwarsa — referensi FR-KULA-211 | 10 | V1 | ticket | AC-FR-KULA-211 |
| FR-KULA-212 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-212 | 14 | MVP | ticket | AC-FR-KULA-212 |
| FR-KULA-213 | HS-22 | Remote TV aman, timer dan media sendiri — referensi FR-KULA-213 | 22 | V1 | ticket | AC-FR-KULA-213 |
| FR-KULA-214 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-214 | 12 | V1 | ticket | AC-FR-KULA-214 |
| FR-KULA-215 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-215 | 15 | MVP | ticket | AC-FR-KULA-215 |
| FR-KULA-216 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-216 | 15 | MVP | ticket | AC-FR-KULA-216 |
| FR-KULA-217 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-217 | 43 | V2 | deferred | AC-FR-KULA-217 |
| FR-KULA-218 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-218 | 15 | MVP | ticket | AC-FR-KULA-218 |
| FR-KULA-219 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-219 | 15 | MVP | ticket | AC-FR-KULA-219 |
| FR-KULA-220 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-220 | 16 | V1 | ticket | AC-FR-KULA-220 |
| FR-KULA-221 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-221 | 16 | V1 | ticket | AC-FR-KULA-221 |
| FR-KULA-222 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-222 | 14 | MVP | ticket | AC-FR-KULA-222 |
| FR-KULA-223 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-223 | 14 | MVP | ticket | AC-FR-KULA-223 |
| FR-KULA-224 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-224 | 18 | V1 | ticket | AC-FR-KULA-224 |
| FR-KULA-225 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-225 | 18 | V1 | ticket | AC-FR-KULA-225 |
| FR-KULA-226 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-226 | 18 | V1 | ticket | AC-FR-KULA-226 |
| FR-KULA-227 | HS-17 | Shift kasir dan serah terima sesi aktif — referensi FR-KULA-227 | 17 | MVP | ticket | AC-FR-KULA-227 |
| FR-KULA-228 | HS-02 | Identitas, tenant dan otorisasi per outlet — referensi FR-KULA-228 | 02 | MVP | ticket | AC-FR-KULA-228 |
| FR-KULA-229 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-229 | 35 | V1 | ticket | AC-FR-KULA-229 |
| FR-KULA-230 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-230 | 08 | MVP | ticket | AC-FR-KULA-230 |
| FR-KULA-231 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-231 | 08 | MVP | ticket | AC-FR-KULA-231 |
| FR-KULA-232 | HS-42 | API publik, SSO dan integrasi berizin — referensi FR-KULA-232 | 42 | V1 | ticket | AC-FR-KULA-232 |
| FR-KULA-233 | HS-20 | Venue edge, lease offline dan otoritas tunggal — referensi FR-KULA-233 | 20 | MVP | ticket | AC-FR-KULA-233 |
| FR-KULA-234 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-234 | 06 | MVP | ticket | AC-FR-KULA-234 |
| FR-KULA-235 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-235 | 08 | MVP | ticket | AC-FR-KULA-235 |
| FR-KULA-236 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-236 | 15 | MVP | ticket | AC-FR-KULA-236 |
| FR-KULA-237 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-237 | 18 | V1 | ticket | AC-FR-KULA-237 |
| FR-KULA-238 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-238 | 33 | V1 | ticket | AC-FR-KULA-238 |
| FR-KULA-239 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-239 | 16 | V1 | ticket | AC-FR-KULA-239 |
| FR-KULA-240 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-240 | 16 | V1 | ticket | AC-FR-KULA-240 |
| FR-KULA-241 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-241 | 14 | MVP | ticket | AC-FR-KULA-241 |
| FR-KULA-242 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-242 | 37 | V2 | deferred | AC-FR-KULA-242 |
| FR-KULA-243 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-243 | 37 | V2 | deferred | AC-FR-KULA-243 |
| FR-KULA-244 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-244 | 37 | V2 | deferred | AC-FR-KULA-244 |
| FR-KULA-245 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-245 | 37 | V2 | deferred | AC-FR-KULA-245 |
| FR-KULA-246 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-246 | 37 | V2 | deferred | AC-FR-KULA-246 |
| FR-KULA-247 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-247 | 21 | MVP | ticket | AC-FR-KULA-247 |
| FR-KULA-248 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-248 | 33 | V1 | ticket | AC-FR-KULA-248 |
| FR-KULA-249 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-249 | 45 | MVP | ticket | AC-FR-KULA-249 |
| FR-KULA-250 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-250 | 06 | MVP | ticket | AC-FR-KULA-250 |
| FR-KULA-251 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-251 | 05 | MVP | ticket | AC-FR-KULA-251 |
| FR-KULA-252 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-252 | 21 | MVP | ticket | AC-FR-KULA-252 |
| FR-KULA-253 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-253 | 14 | MVP | ticket | AC-FR-KULA-253 |
| FR-KULA-254 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-254 | 21 | MVP | ticket | AC-FR-KULA-254 |
| FR-KULA-255 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-255 | 21 | MVP | ticket | AC-FR-KULA-255 |
| FR-KULA-256 | HS-20 | Venue edge, lease offline dan otoritas tunggal — referensi FR-KULA-256 | 20 | MVP | ticket | AC-FR-KULA-256 |
| FR-KULA-257 | HS-04 | Tarif versi, paket dan kutipan biaya — referensi FR-KULA-257 | 04 | MVP | ticket | AC-FR-KULA-257 |
| FR-KULA-258 | HS-04 | Tarif versi, paket dan kutipan biaya — referensi FR-KULA-258 | 04 | MVP | ticket | AC-FR-KULA-258 |
| FR-KULA-259 | HS-26 | Billboard, customer display dan privasi — referensi FR-KULA-259 | 26 | V1 | ticket | AC-FR-KULA-259 |
| FR-KULA-260 | HS-32 | Turnamen, bracket dan komunitas — referensi FR-KULA-260 | 32 | V1 | ticket | AC-FR-KULA-260 |
| FR-KULA-261 | HS-10 | Tabungan waktu, penebusan dan kedaluwarsa — referensi FR-KULA-261 | 10 | V1 | ticket | AC-FR-KULA-261 |
| FR-KULA-262 | HS-25 | Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-262 | 25 | V1 | ticket | AC-FR-KULA-262 |
| FR-KULA-263 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-263 | 14 | MVP | ticket | AC-FR-KULA-263 |
| FR-KULA-264 | HS-27 | Windows seat lock dan player shell — referensi FR-KULA-264 | 27 | V1 | ticket | AC-FR-KULA-264 |
| FR-KULA-265 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-265 | 16 | V1 | ticket | AC-FR-KULA-265 |
| FR-KULA-266 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-266 | 21 | MVP | ticket | AC-FR-KULA-266 |
| FR-KULA-267 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-267 | 21 | MVP | ticket | AC-FR-KULA-267 |
| FR-KULA-268 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-268 | 21 | MVP | ticket | AC-FR-KULA-268 |
| FR-KULA-269 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-269 | 12 | V1 | ticket | AC-FR-KULA-269 |
| FR-KULA-270 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-270 | 45 | MVP | out-of-scope | AC-FR-KULA-270 |
| FR-KULA-271 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-271 | 45 | MVP | out-of-scope | AC-FR-KULA-271 |
| FR-KULA-272 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-272 | 45 | MVP | out-of-scope | AC-FR-KULA-272 |
| FR-KULA-273 | HS-26 | Billboard, customer display dan privasi — referensi FR-KULA-273 | 26 | V1 | ticket | AC-FR-KULA-273 |
| FR-KULA-274 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-274 | 45 | MVP | out-of-scope | AC-FR-KULA-274 |
| FR-KULA-275 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-275 | 45 | MVP | out-of-scope | AC-FR-KULA-275 |
| FR-KULA-276 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-276 | 12 | V1 | ticket | AC-FR-KULA-276 |
| FR-KULA-277 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-277 | 12 | V1 | ticket | AC-FR-KULA-277 |
| FR-KULA-278 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-278 | 12 | V1 | ticket | AC-FR-KULA-278 |
| FR-KULA-279 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-279 | 45 | MVP | out-of-scope | AC-FR-KULA-279 |
| FR-KULA-280 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-280 | 15 | MVP | ticket | AC-FR-KULA-280 |
| FR-KULA-281 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-281 | 45 | MVP | ticket | AC-FR-KULA-281 |
| FR-KULA-282 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-282 | 43 | V2 | deferred | AC-FR-KULA-282 |
| FR-KULA-283 | HS-25 | Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-283 | 25 | V1 | ticket | AC-FR-KULA-283 |
| FR-KULA-284 | HS-44 | Konten venue, feedback dan Bahasa Indonesia — referensi FR-KULA-284 | 44 | V1 | ticket | AC-FR-KULA-284 |
| FR-KULA-285 | HS-26 | Billboard, customer display dan privasi — referensi FR-KULA-285 | 26 | V1 | ticket | AC-FR-KULA-285 |
| FR-KULA-286 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-286 | 11 | V1 | ticket | AC-FR-KULA-286 |
| FR-KULA-287 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-287 | 11 | V1 | ticket | AC-FR-KULA-287 |
| FR-KULA-288 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-288 | 18 | V1 | ticket | AC-FR-KULA-288 |
| FR-KULA-289 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-289 | 45 | MVP | out-of-scope | AC-FR-KULA-289 |
| FR-KULA-290 | HS-27 | Windows seat lock dan player shell — referensi FR-KULA-290 | 27 | V1 | ticket | AC-FR-KULA-290 |
| FR-KULA-291 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-291 | 21 | MVP | ticket | AC-FR-KULA-291 |
| FR-KULA-292 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-292 | 18 | V1 | ticket | AC-FR-KULA-292 |
| FR-KULA-293 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-293 | 18 | V1 | ticket | AC-FR-KULA-293 |
| FR-KULA-294 | HS-07 | QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-294 | 07 | MVP | ticket | AC-FR-KULA-294 |
| FR-KULA-295 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-295 | 14 | MVP | ticket | AC-FR-KULA-295 |
| FR-KULA-296 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-296 | 14 | MVP | ticket | AC-FR-KULA-296 |
| FR-KULA-297 | HS-20 | Venue edge, lease offline dan otoritas tunggal — referensi FR-KULA-297 | 20 | MVP | ticket | AC-FR-KULA-297 |
| FR-KULA-298 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-298 | 35 | V1 | ticket | AC-FR-KULA-298 |
| FR-KULA-299 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-299 | 35 | V1 | ticket | AC-FR-KULA-299 |
| FR-KULA-300 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-300 | 35 | V1 | ticket | AC-FR-KULA-300 |
| FR-KULA-301 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-301 | 35 | V1 | ticket | AC-FR-KULA-301 |
| FR-KULA-302 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-302 | 35 | V1 | ticket | AC-FR-KULA-302 |
| FR-KULA-303 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-303 | 35 | V1 | ticket | AC-FR-KULA-303 |
| FR-KULA-304 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-304 | 35 | V1 | ticket | AC-FR-KULA-304 |
| FR-KULA-305 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-305 | 35 | V1 | ticket | AC-FR-KULA-305 |
| FR-KULA-306 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-306 | 35 | V1 | ticket | AC-FR-KULA-306 |
| FR-KULA-307 | HS-34 | Sewa bawa pulang dan custody aset — referensi FR-KULA-307 | 34 | V2 | deferred | AC-FR-KULA-307 |
| FR-KULA-308 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-308 | 15 | MVP | ticket | AC-FR-KULA-308 |
| FR-KULA-309 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-309 | 45 | MVP | out-of-scope | AC-FR-KULA-309 |
| FR-KULA-310 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-310 | 15 | MVP | ticket | AC-FR-KULA-310 |
| FR-KULA-311 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-311 | 16 | V1 | ticket | AC-FR-KULA-311 |
| FR-KULA-312 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-312 | 05 | MVP | ticket | AC-FR-KULA-312 |
| FR-KULA-313 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-313 | 45 | MVP | out-of-scope | AC-FR-KULA-313 |
| FR-KULA-314 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-314 | 45 | MVP | out-of-scope | AC-FR-KULA-314 |
| FR-KULA-315 | HS-40 | Kios mandiri dan coverage iOS — referensi FR-KULA-315 | 40 | V2 | deferred | AC-FR-KULA-315 |
| FR-KULA-316 | HS-44 | Konten venue, feedback dan Bahasa Indonesia — referensi FR-KULA-316 | 44 | V1 | ticket | AC-FR-KULA-316 |
| FR-KULA-317 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-317 | 45 | MVP | out-of-scope | AC-FR-KULA-317 |
| FR-KULA-318 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-318 | 11 | V1 | ticket | AC-FR-KULA-318 |
| FR-KULA-319 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-319 | 45 | MVP | out-of-scope | AC-FR-KULA-319 |
| FR-KULA-320 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-320 | 45 | MVP | out-of-scope | AC-FR-KULA-320 |
| FR-KULA-321 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-321 | 45 | MVP | out-of-scope | AC-FR-KULA-321 |
| FR-KULA-322 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-322 | 14 | MVP | ticket | AC-FR-KULA-322 |
| FR-KULA-323 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-323 | 06 | MVP | ticket | AC-FR-KULA-323 |
| FR-KULA-324 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-324 | 08 | MVP | ticket | AC-FR-KULA-324 |
| FR-KULA-325 | HS-25 | Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-325 | 25 | V1 | ticket | AC-FR-KULA-325 |
| FR-KULA-326 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-326 | 45 | MVP | ticket | AC-FR-KULA-326 |
| FR-KULA-327 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-327 | 45 | MVP | ticket | AC-FR-KULA-327 |
| FR-KULA-328 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-328 | 14 | MVP | ticket | AC-FR-KULA-328 |
| FR-KULA-329 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-329 | 14 | MVP | ticket | AC-FR-KULA-329 |
| FR-KULA-330 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-330 | 14 | MVP | ticket | AC-FR-KULA-330 |
| FR-KULA-331 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-331 | 14 | MVP | ticket | AC-FR-KULA-331 |
| FR-KULA-332 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-332 | 14 | MVP | ticket | AC-FR-KULA-332 |
| FR-KULA-333 | HS-07 | QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-333 | 07 | MVP | ticket | AC-FR-KULA-333 |
| FR-KULA-334 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-334 | 14 | MVP | ticket | AC-FR-KULA-334 |
| FR-KULA-335 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-335 | 18 | V1 | ticket | AC-FR-KULA-335 |
| FR-KULA-336 | HS-44 | Konten venue, feedback dan Bahasa Indonesia — referensi FR-KULA-336 | 44 | V1 | ticket | AC-FR-KULA-336 |
| FR-KULA-337 | HS-27 | Windows seat lock dan player shell — referensi FR-KULA-337 | 27 | V1 | ticket | AC-FR-KULA-337 |
| FR-KULA-338 | HS-27 | Windows seat lock dan player shell — referensi FR-KULA-338 | 27 | V1 | ticket | AC-FR-KULA-338 |
| FR-KULA-339 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-339 | 12 | V1 | ticket | AC-FR-KULA-339 |
| FR-KULA-340 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-340 | 45 | MVP | out-of-scope | AC-FR-KULA-340 |
| FR-KULA-341 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-341 | 45 | MVP | out-of-scope | AC-FR-KULA-341 |
| FR-KULA-342 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-342 | 45 | MVP | out-of-scope | AC-FR-KULA-342 |
| FR-KULA-343 | HS-12 | Reservasi, deposit, buffer dan no-show — referensi FR-KULA-343 | 12 | V1 | ticket | AC-FR-KULA-343 |
| FR-KULA-344 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-344 | 45 | MVP | out-of-scope | AC-FR-KULA-344 |
| FR-KULA-345 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-345 | 45 | MVP | out-of-scope | AC-FR-KULA-345 |
| FR-KULA-346 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-346 | 45 | MVP | out-of-scope | AC-FR-KULA-346 |
| FR-KULA-347 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-347 | 45 | MVP | out-of-scope | AC-FR-KULA-347 |
| FR-KULA-348 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-348 | 45 | MVP | out-of-scope | AC-FR-KULA-348 |
| FR-KULA-349 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-349 | 45 | MVP | out-of-scope | AC-FR-KULA-349 |
| FR-KULA-350 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-350 | 16 | V1 | ticket | AC-FR-KULA-350 |
| FR-KULA-351 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-351 | 14 | MVP | ticket | AC-FR-KULA-351 |
| FR-KULA-352 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-352 | 06 | MVP | ticket | AC-FR-KULA-352 |
| FR-KULA-353 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-353 | 45 | MVP | out-of-scope | AC-FR-KULA-353 |
| FR-KULA-354 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-354 | 45 | MVP | out-of-scope | AC-FR-KULA-354 |
| FR-KULA-355 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-355 | 14 | MVP | ticket | AC-FR-KULA-355 |
| FR-KULA-356 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-356 | 14 | MVP | ticket | AC-FR-KULA-356 |
| FR-KULA-357 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-357 | 45 | MVP | out-of-scope | AC-FR-KULA-357 |
| FR-KULA-358 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-358 | 45 | MVP | out-of-scope | AC-FR-KULA-358 |
| FR-KULA-359 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-359 | 45 | MVP | out-of-scope | AC-FR-KULA-359 |
| FR-KULA-360 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-360 | 15 | MVP | ticket | AC-FR-KULA-360 |
| FR-KULA-361 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-361 | 15 | MVP | ticket | AC-FR-KULA-361 |
| FR-KULA-362 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-362 | 15 | MVP | ticket | AC-FR-KULA-362 |
| FR-KULA-363 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-363 | 15 | MVP | ticket | AC-FR-KULA-363 |
| FR-KULA-364 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-364 | 15 | MVP | ticket | AC-FR-KULA-364 |
| FR-KULA-365 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-365 | 11 | V1 | ticket | AC-FR-KULA-365 |
| FR-KULA-366 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-366 | 11 | V1 | ticket | AC-FR-KULA-366 |
| FR-KULA-367 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-367 | 11 | V1 | ticket | AC-FR-KULA-367 |
| FR-KULA-368 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-368 | 11 | V1 | ticket | AC-FR-KULA-368 |
| FR-KULA-369 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-369 | 11 | V1 | ticket | AC-FR-KULA-369 |
| FR-KULA-370 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-370 | 11 | V1 | ticket | AC-FR-KULA-370 |
| FR-KULA-371 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-371 | 45 | MVP | out-of-scope | AC-FR-KULA-371 |
| FR-KULA-372 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-372 | 16 | V1 | ticket | AC-FR-KULA-372 |
| FR-KULA-373 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-373 | 16 | V1 | ticket | AC-FR-KULA-373 |
| FR-KULA-374 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-374 | 16 | V1 | ticket | AC-FR-KULA-374 |
| FR-KULA-375 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-375 | 16 | V1 | ticket | AC-FR-KULA-375 |
| FR-KULA-376 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-376 | 16 | V1 | ticket | AC-FR-KULA-376 |
| FR-KULA-377 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-377 | 16 | V1 | ticket | AC-FR-KULA-377 |
| FR-KULA-378 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-378 | 05 | MVP | ticket | AC-FR-KULA-378 |
| FR-KULA-379 | HS-26 | Billboard, customer display dan privasi — referensi FR-KULA-379 | 26 | V1 | ticket | AC-FR-KULA-379 |
| FR-KULA-380 | HS-26 | Billboard, customer display dan privasi — referensi FR-KULA-380 | 26 | V1 | ticket | AC-FR-KULA-380 |
| FR-KULA-381 | HS-13 | Portal pelanggan dan akses QR/receipt — referensi FR-KULA-381 | 13 | V1 | ticket | AC-FR-KULA-381 |
| FR-KULA-382 | HS-03 | Katalog stasiun, aset, zona dan denah — referensi FR-KULA-382 | 03 | MVP | ticket | AC-FR-KULA-382 |
| FR-KULA-383 | HS-32 | Turnamen, bracket dan komunitas — referensi FR-KULA-383 | 32 | V1 | ticket | AC-FR-KULA-383 |
| FR-KULA-384 | HS-32 | Turnamen, bracket dan komunitas — referensi FR-KULA-384 | 32 | V1 | ticket | AC-FR-KULA-384 |
| FR-KULA-385 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-385 | 45 | MVP | ticket | AC-FR-KULA-385 |
| FR-KULA-386 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-386 | 45 | MVP | ticket | AC-FR-KULA-386 |
| FR-KULA-387 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-387 | 18 | V1 | ticket | AC-FR-KULA-387 |
| FR-KULA-388 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-388 | 36 | V1 | ticket | AC-FR-KULA-388 |
| FR-KULA-389 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-389 | 18 | V1 | ticket | AC-FR-KULA-389 |
| FR-KULA-390 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-390 | 18 | V1 | ticket | AC-FR-KULA-390 |
| FR-KULA-391 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-391 | 35 | V1 | ticket | AC-FR-KULA-391 |
| FR-KULA-392 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-392 | 43 | V2 | deferred | AC-FR-KULA-392 |
| FR-KULA-393 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-393 | 36 | V1 | ticket | AC-FR-KULA-393 |
| FR-KULA-394 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-394 | 11 | V1 | ticket | AC-FR-KULA-394 |
| FR-KULA-395 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-395 | 45 | MVP | out-of-scope | AC-FR-KULA-395 |
| FR-KULA-396 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-396 | 45 | MVP | out-of-scope | AC-FR-KULA-396 |
| FR-KULA-397 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-397 | 18 | V1 | ticket | AC-FR-KULA-397 |
| FR-KULA-398 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-398 | 15 | MVP | ticket | AC-FR-KULA-398 |
| FR-KULA-399 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-399 | 18 | V1 | ticket | AC-FR-KULA-399 |
| FR-KULA-400 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-400 | 11 | V1 | ticket | AC-FR-KULA-400 |
| FR-KULA-401 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-401 | 18 | V1 | ticket | AC-FR-KULA-401 |
| FR-KULA-402 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-402 | 45 | MVP | out-of-scope | AC-FR-KULA-402 |
| FR-KULA-403 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-403 | 18 | V1 | ticket | AC-FR-KULA-403 |
| FR-KULA-404 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-404 | 45 | MVP | out-of-scope | AC-FR-KULA-404 |
| FR-KULA-405 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-405 | 45 | MVP | out-of-scope | AC-FR-KULA-405 |
| FR-KULA-406 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-406 | 18 | V1 | ticket | AC-FR-KULA-406 |
| FR-KULA-407 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-407 | 18 | V1 | ticket | AC-FR-KULA-407 |
| FR-KULA-408 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-408 | 18 | V1 | ticket | AC-FR-KULA-408 |
| FR-KULA-409 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-409 | 18 | V1 | ticket | AC-FR-KULA-409 |
| FR-KULA-410 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-410 | 18 | V1 | ticket | AC-FR-KULA-410 |
| FR-KULA-411 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-411 | 18 | V1 | ticket | AC-FR-KULA-411 |
| FR-KULA-412 | HS-34 | Sewa bawa pulang dan custody aset — referensi FR-KULA-412 | 34 | V2 | deferred | AC-FR-KULA-412 |
| FR-KULA-413 | HS-17 | Shift kasir dan serah terima sesi aktif — referensi FR-KULA-413 | 17 | MVP | ticket | AC-FR-KULA-413 |
| FR-KULA-414 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-414 | 45 | MVP | out-of-scope | AC-FR-KULA-414 |
| FR-KULA-415 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-415 | 15 | MVP | ticket | AC-FR-KULA-415 |
| FR-KULA-416 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-416 | 15 | MVP | ticket | AC-FR-KULA-416 |
| FR-KULA-417 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-417 | 18 | V1 | ticket | AC-FR-KULA-417 |
| FR-KULA-418 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-418 | 45 | MVP | out-of-scope | AC-FR-KULA-418 |
| FR-KULA-419 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-419 | 06 | MVP | ticket | AC-FR-KULA-419 |
| FR-KULA-420 | HS-44 | Konten venue, feedback dan Bahasa Indonesia — referensi FR-KULA-420 | 44 | V1 | ticket | AC-FR-KULA-420 |
| FR-KULA-421 | HS-44 | Konten venue, feedback dan Bahasa Indonesia — referensi FR-KULA-421 | 44 | V1 | ticket | AC-FR-KULA-421 |
| FR-KULA-422 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-422 | 43 | V2 | deferred | AC-FR-KULA-422 |
| FR-KULA-423 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-423 | 37 | V2 | deferred | AC-FR-KULA-423 |
| FR-KULA-424 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-424 | 35 | V1 | ticket | AC-FR-KULA-424 |
| FR-KULA-425 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-425 | 45 | MVP | out-of-scope | AC-FR-KULA-425 |
| FR-KULA-426 | HS-03 | Katalog stasiun, aset, zona dan denah — referensi FR-KULA-426 | 03 | MVP | ticket | AC-FR-KULA-426 |
| FR-KULA-427 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-427 | 33 | V1 | ticket | AC-FR-KULA-427 |
| FR-KULA-428 | HS-02 | Identitas, tenant dan otorisasi per outlet — referensi FR-KULA-428 | 02 | MVP | ticket | AC-FR-KULA-428 |
| FR-KULA-429 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-429 | 37 | V2 | deferred | AC-FR-KULA-429 |
| FR-KULA-430 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-430 | 45 | MVP | out-of-scope | AC-FR-KULA-430 |
| FR-KULA-431 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-431 | 35 | V1 | ticket | AC-FR-KULA-431 |
| FR-KULA-432 | HS-04 | Tarif versi, paket dan kutipan biaya — referensi FR-KULA-432 | 04 | MVP | ticket | AC-FR-KULA-432 |
| FR-KULA-433 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-433 | 33 | V1 | ticket | AC-FR-KULA-433 |
| FR-KULA-434 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-434 | 11 | V1 | ticket | AC-FR-KULA-434 |
| FR-KULA-435 | HS-07 | QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-435 | 07 | MVP | ticket | AC-FR-KULA-435 |
| FR-KULA-436 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-436 | 45 | MVP | out-of-scope | AC-FR-KULA-436 |
| FR-KULA-437 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-437 | 08 | MVP | ticket | AC-FR-KULA-437 |
| FR-KULA-438 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-438 | 33 | V1 | ticket | AC-FR-KULA-438 |
| FR-KULA-439 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-439 | 14 | MVP | ticket | AC-FR-KULA-439 |
| FR-KULA-440 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-440 | 35 | V1 | ticket | AC-FR-KULA-440 |
| FR-KULA-441 | HS-30 | Keamanan, privasi, audit dan restore — referensi FR-KULA-441 | 30 | MVP | ticket | AC-FR-KULA-441 |
| FR-KULA-442 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-442 | 33 | V1 | ticket | AC-FR-KULA-442 |
| FR-KULA-443 | HS-25 | Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-443 | 25 | V1 | ticket | AC-FR-KULA-443 |
| FR-KULA-444 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-444 | 37 | V2 | deferred | AC-FR-KULA-444 |
| FR-KULA-445 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-445 | 37 | V2 | deferred | AC-FR-KULA-445 |
| FR-KULA-446 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-446 | 37 | V2 | deferred | AC-FR-KULA-446 |
| FR-KULA-447 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-447 | 37 | V2 | deferred | AC-FR-KULA-447 |
| FR-KULA-448 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-448 | 37 | V2 | deferred | AC-FR-KULA-448 |
| FR-KULA-449 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-449 | 37 | V2 | deferred | AC-FR-KULA-449 |
| FR-KULA-450 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-450 | 37 | V2 | deferred | AC-FR-KULA-450 |
| FR-KULA-451 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-451 | 35 | V1 | ticket | AC-FR-KULA-451 |
| FR-KULA-452 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-452 | 35 | V1 | ticket | AC-FR-KULA-452 |
| FR-KULA-453 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-453 | 35 | V1 | ticket | AC-FR-KULA-453 |
| FR-KULA-454 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-454 | 15 | MVP | ticket | AC-FR-KULA-454 |
| FR-KULA-455 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-455 | 15 | MVP | ticket | AC-FR-KULA-455 |
| FR-KULA-456 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-456 | 33 | V1 | ticket | AC-FR-KULA-456 |
| FR-KULA-457 | HS-16 | Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-457 | 16 | V1 | ticket | AC-FR-KULA-457 |
| FR-KULA-458 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-458 | 08 | MVP | ticket | AC-FR-KULA-458 |
| FR-KULA-459 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-459 | 45 | MVP | out-of-scope | AC-FR-KULA-459 |
| FR-KULA-460 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-460 | 45 | MVP | out-of-scope | AC-FR-KULA-460 |
| FR-KULA-461 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-461 | 45 | MVP | out-of-scope | AC-FR-KULA-461 |
| FR-KULA-462 | HS-06 | POS, kas dan buku pembayaran append-only — referensi FR-KULA-462 | 06 | MVP | ticket | AC-FR-KULA-462 |
| FR-KULA-463 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-463 | 45 | MVP | ticket | AC-FR-KULA-463 |
| FR-KULA-464 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-464 | 21 | MVP | ticket | AC-FR-KULA-464 |
| FR-KULA-465 | HS-21 | Agent Kotlin Android/Google TV dan expiry — referensi FR-KULA-465 | 21 | MVP | ticket | AC-FR-KULA-465 |
| FR-KULA-466 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-466 | 45 | MVP | ticket | AC-FR-KULA-466 |
| FR-KULA-467 | HS-39 | Feasibility native webOS dan Tizen — referensi FR-KULA-467 | 39 | V2 | deferred | AC-FR-KULA-467 |
| FR-KULA-468 | HS-39 | Feasibility native webOS dan Tizen — referensi FR-KULA-468 | 39 | V2 | deferred | AC-FR-KULA-468 |
| FR-KULA-469 | HS-02 | Identitas, tenant dan otorisasi per outlet — referensi FR-KULA-469 | 02 | MVP | ticket | AC-FR-KULA-469 |
| FR-KULA-470 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-470 | 36 | V1 | ticket | AC-FR-KULA-470 |
| FR-KULA-471 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-471 | 37 | V2 | deferred | AC-FR-KULA-471 |
| FR-KULA-472 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-472 | 37 | V2 | deferred | AC-FR-KULA-472 |
| FR-KULA-473 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-473 | 45 | MVP | out-of-scope | AC-FR-KULA-473 |
| FR-KULA-474 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-474 | 18 | V1 | ticket | AC-FR-KULA-474 |
| FR-KULA-475 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-475 | 37 | V2 | deferred | AC-FR-KULA-475 |
| FR-KULA-476 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-476 | 35 | V1 | ticket | AC-FR-KULA-476 |
| FR-KULA-477 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-477 | 35 | V1 | ticket | AC-FR-KULA-477 |
| FR-KULA-478 | HS-43 | B2B, konsinyasi dan unit grosir — referensi FR-KULA-478 | 43 | V2 | deferred | AC-FR-KULA-478 |
| FR-KULA-479 | HS-36 | Akuntansi dan laporan pajak Indonesia — referensi FR-KULA-479 | 36 | V1 | ticket | AC-FR-KULA-479 |
| FR-KULA-480 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-480 | 11 | V1 | ticket | AC-FR-KULA-480 |
| FR-KULA-481 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-481 | 45 | MVP | out-of-scope | AC-FR-KULA-481 |
| FR-KULA-482 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-482 | 45 | MVP | out-of-scope | AC-FR-KULA-482 |
| FR-KULA-483 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-483 | 45 | MVP | out-of-scope | AC-FR-KULA-483 |
| FR-KULA-484 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-484 | 18 | V1 | ticket | AC-FR-KULA-484 |
| FR-KULA-485 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-485 | 15 | MVP | ticket | AC-FR-KULA-485 |
| FR-KULA-486 | HS-04 | Tarif versi, paket dan kutipan biaya — referensi FR-KULA-486 | 04 | MVP | ticket | AC-FR-KULA-486 |
| FR-KULA-487 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-487 | 37 | V2 | deferred | AC-FR-KULA-487 |
| FR-KULA-488 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-488 | 33 | V1 | ticket | AC-FR-KULA-488 |
| FR-KULA-489 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-489 | 18 | V1 | ticket | AC-FR-KULA-489 |
| FR-KULA-490 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-490 | 11 | V1 | ticket | AC-FR-KULA-490 |
| FR-KULA-491 | HS-11 | Member, reward, tingkat dan voucher — referensi FR-KULA-491 | 11 | V1 | ticket | AC-FR-KULA-491 |
| FR-KULA-492 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-492 | 18 | V1 | ticket | AC-FR-KULA-492 |
| FR-KULA-493 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-493 | 45 | MVP | out-of-scope | AC-FR-KULA-493 |
| FR-KULA-494 | HS-07 | QRIS Midtrans sandbox dan rekonsiliasi — referensi FR-KULA-494 | 07 | MVP | ticket | AC-FR-KULA-494 |
| FR-KULA-495 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-495 | 18 | V1 | ticket | AC-FR-KULA-495 |
| FR-KULA-496 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-496 | 45 | MVP | out-of-scope | AC-FR-KULA-496 |
| FR-KULA-497 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-497 | 45 | MVP | out-of-scope | AC-FR-KULA-497 |
| FR-KULA-498 | HS-08 | Struk, cetak ulang dan jembatan printer — referensi FR-KULA-498 | 08 | MVP | ticket | AC-FR-KULA-498 |
| FR-KULA-499 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-499 | 18 | V1 | ticket | AC-FR-KULA-499 |
| FR-KULA-500 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-500 | 33 | V1 | ticket | AC-FR-KULA-500 |
| FR-KULA-501 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-501 | 18 | V1 | ticket | AC-FR-KULA-501 |
| FR-KULA-502 | HS-05 | Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-502 | 05 | MVP | ticket | AC-FR-KULA-502 |
| FR-KULA-503 | HS-44 | Konten venue, feedback dan Bahasa Indonesia — referensi FR-KULA-503 | 44 | V1 | ticket | AC-FR-KULA-503 |
| FR-KULA-504 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-504 | 18 | V1 | ticket | AC-FR-KULA-504 |
| FR-KULA-505 | HS-14 | Pesanan F&B, tagihan gabungan dan KDS — referensi FR-KULA-505 | 14 | MVP | ticket | AC-FR-KULA-505 |
| FR-KULA-506 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-506 | 18 | V1 | ticket | AC-FR-KULA-506 |
| FR-KULA-507 | HS-35 | Staf, kehadiran dan payroll ekspor — referensi FR-KULA-507 | 35 | V1 | ticket | AC-FR-KULA-507 |
| FR-KULA-508 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-508 | 18 | V1 | ticket | AC-FR-KULA-508 |
| FR-KULA-509 | HS-30 | Keamanan, privasi, audit dan restore — referensi FR-KULA-509 | 30 | MVP | ticket | AC-FR-KULA-509 |
| FR-KULA-510 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-510 | 37 | V2 | deferred | AC-FR-KULA-510 |
| FR-KULA-511 | HS-34 | Sewa bawa pulang dan custody aset — referensi FR-KULA-511 | 34 | V2 | deferred | AC-FR-KULA-511 |
| FR-KULA-512 | HS-17 | Shift kasir dan serah terima sesi aktif — referensi FR-KULA-512 | 17 | MVP | ticket | AC-FR-KULA-512 |
| FR-KULA-513 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-513 | 45 | MVP | out-of-scope | AC-FR-KULA-513 |
| FR-KULA-514 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-514 | 15 | MVP | ticket | AC-FR-KULA-514 |
| FR-KULA-515 | HS-15 | Produk, stok, resep dan costing — referensi FR-KULA-515 | 15 | MVP | ticket | AC-FR-KULA-515 |
| FR-KULA-516 | HS-37 | AI helper dengan preview dan persetujuan — referensi FR-KULA-516 | 37 | V2 | deferred | AC-FR-KULA-516 |
| FR-KULA-517 | HS-33 | Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-517 | 33 | V1 | ticket | AC-FR-KULA-517 |
| FR-KULA-518 | HS-25 | Chat operator, alarm dan notifikasi berizin — referensi FR-KULA-518 | 25 | V1 | ticket | AC-FR-KULA-518 |
| FR-KULA-519 | HS-18 | Laporan owner, utilisasi dan liability — referensi FR-KULA-519 | 18 | V1 | ticket | AC-FR-KULA-519 |
| FR-KULA-520 | HS-45 | Runbook operator, sandbox dan bantuan — referensi FR-KULA-520 | 45 | MVP | out-of-scope | AC-FR-KULA-520 |
| HS-GAP-01 | HS-31 | Katalog sertifikasi model+firmware dengan bukti publik | 31 | V1 | ticket | AC-HS-GAP-01 |
| HS-GAP-02 | HS-05 | ACK aktivasi dan kompensasi kegagalan | 05 | MVP | ticket | AC-HS-GAP-02 |
| HS-GAP-03 | HS-20 | Lease offline bertanda tangan dan reboot-safe deadline | 20 | MVP | ticket | AC-HS-GAP-03 |
| HS-GAP-04 | HS-20 | Rekonsiliasi offline deterministik tanpa double charge | 20 | MVP | ticket | AC-HS-GAP-04 |
| HS-GAP-05 | HS-09 | Budget wallet offline tanpa double-spend lintas cabang | 09 | V1 | ticket | AC-HS-GAP-05 |
| HS-GAP-06 | HS-23 | Satu kontrak adaptor lintas Android/CEC/HDMI/IR/manual | 23 | MVP | ticket | AC-HS-GAP-06 |
| HS-GAP-07 | HS-23 | Sertifikasi HDMI4K120/HDR/VRR/HDCP latency | 23 | MVP | ticket | AC-HS-GAP-07 |
| HS-GAP-08 | HS-31 | Fleet simulator dan fault injection berulang | 31 | V1 | ticket | AC-HS-GAP-08 |
| HS-GAP-09 | HS-24 | Update signed canary dan rollback | 24 | V1 | ticket | AC-HS-GAP-09 |
| HS-GAP-10 | HS-18 | Audit payment/session/adjustment/wallet liability | 18 | V1 | ticket | AC-HS-GAP-10 |
| HS-GAP-11 | HS-30 | Emergency override lokal berjangka dan audit | 30 | MVP | ticket | AC-HS-GAP-11 |
| HS-GAP-12 | HS-30 | Privasi default, retention, erasure dan lobby redaction | 30 | MVP | ticket | AC-HS-GAP-12 |
| HS-GAP-13 | HS-34 | Custody aset sewa beserta damage dispute | 34 | V2 | deferred | AC-HS-GAP-13 |
| HS-GAP-14 | HS-27 | Verifikasi cleanup sesi tanpa shared personal credentials | 27 | V1 | ticket | AC-HS-GAP-14 |
| HS-GAP-15 | HS-41 | Migration dry-run, rollback dan restore drills | 41 | V1 | ticket | AC-HS-GAP-15 |
| HS-46 | HS-46 | API identitas, tenancy dan staff 2FA | 46 | MVP | ticket | AC-HS-46 |
| HS-47 | HS-47 | API stasiun, tarif rasional dan minimum payment | 47 | MVP | ticket | AC-HS-47 |
| HS-48 | HS-48 | Ledger dan Midtrans QRIS server tanpa UI | 48 | MVP | ticket | AC-HS-48 |
| HS-49 | HS-49 | Koordinator sesi dan console-to-seat transfer API | 49 | MVP | ticket | AC-HS-49 |
| HS-50 | HS-50 | Gateway edge dan pairing/lease core headless | 50 | MVP | ticket | AC-HS-50 |
| HS-51 | HS-51 | Kotlin TV provisioning, reboot dan offline core | 51 | MVP | ticket | AC-HS-51 |
| HS-52 | HS-52 | Booking, deposit, wallet dan pass eligibility API | 52 | V1 | ticket | AC-HS-52 |
| HS-53 | HS-53 | API stok, pesanan dan X/Z shift close | 53 | MVP | ticket | AC-HS-53 |
| HS-54 | HS-54 | Kontrak, simulator dan fault-check headless | 54 | MVP | ticket | AC-HS-54 |
| HS-V02-01 | HS-47 | Pembulatan IDR rasional/versioned | 47 | MVP | ticket | AC-HS-V02-01 |
| HS-V02-02 | HS-47 | Minimum payment dengan covered-duration block | 47 | MVP | ticket | AC-HS-V02-02 |
| HS-V02-03 | HS-52 | Zone-level pass eligibility | 52 | V1 | ticket | AC-HS-V02-03 |
| HS-V02-04 | HS-52 | Booking settings lengkap | 52 | V1 | ticket | AC-HS-V02-04 |
| HS-V02-05 | HS-52 | Deposit dan no-show per seat | 52 | V1 | ticket | AC-HS-V02-05 |
| HS-V02-06 | HS-53 | X/Z report scoped dan repeat-safe | 53 | MVP | ticket | AC-HS-V02-06 |
| HS-V02-07 | HS-46 | Staff 2FA dan recovery | 46 | MVP | ticket | AC-HS-V02-07 |
| HS-V02-08 | HS-42 | Signed outgoing webhooks | 42 | V1 | ticket | AC-HS-V02-08 |
| HS-V02-09 | HS-49 | Pindah sesi konsol antar-seat | 49 | MVP | ticket | AC-HS-V02-09 |
| HS-V02-10 | HS-51 | Provisioned-unpaired tetap locked | 51 | MVP | ticket | AC-HS-V02-10 |
| HS-V02-11 | HS-51 | Reboot dan overlay permission persistence | 51 | MVP | ticket | AC-HS-V02-11 |
| HS-V02-12 | HS-50 | Offline lease dengan clock/reboot proof | 50 | MVP | ticket | AC-HS-V02-12 |
| HS-V02-13 | HS-51 | Lock independen dari HDMI-CEC | 51 | MVP | ticket | AC-HS-V02-13 |
| HS-V02-14 | HS-45 | Status video dan evidence ledger | 45 | MVP | ticket | AC-HS-V02-14 |
| HS-V02-15 | HS-01 | Final Design v0.2 intake dan UI-after-backend sequencing | 01 | MVP | ticket | AC-HS-V02-15 |
| HS-V02-16 | HS-44 | Bahasa Indonesia-first per surface | 44 | V1 | ticket | AC-HS-V02-16 |
| HS-V02-17 | HS-48 | QRIS provider Indonesia terverifikasi | 48 | MVP | ticket | AC-HS-V02-17 |
| HS-V02-18 | HS-24 | Polling state-aware bukan salinan vendor | 24 | V1 | ticket | AC-HS-V02-18 |
