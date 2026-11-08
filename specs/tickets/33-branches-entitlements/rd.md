# HS-T33 — Multi-cabang, konfigurasi dan entitlement sendiri

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-33 | HS-33 | AC-HS-33 | HS-C33 | V1 / ticket |
| FR-KPS-32 | HS-33 | AC-KPS-32 | HS-C33 | V1 / ticket |
| FR-KPS-67 | HS-33 | AC-KPS-67 | HS-C33 | V1 / ticket |
| FR-SENET-02 | HS-33 | AC-FR-SENET-02 | HS-C33 | V1 / ticket |
| FR-SENET-39 | HS-33 | AC-FR-SENET-39 | HS-C33 | V1 / ticket |
| FR-SENET-74 | HS-33 | AC-FR-SENET-74 | HS-C33 | V1 / ticket |
| F177 | HS-33 | AC-F177 | HS-C33 | V1 / ticket |
| F270 | HS-33 | AC-F270 | HS-C33 | V2 / deferred |
| FR-KULA-238 | HS-33 | AC-FR-KULA-238 | HS-C33 | V1 / ticket |
| FR-KULA-248 | HS-33 | AC-FR-KULA-248 | HS-C33 | V1 / ticket |
| FR-KULA-427 | HS-33 | AC-FR-KULA-427 | HS-C33 | V1 / ticket |
| FR-KULA-433 | HS-33 | AC-FR-KULA-433 | HS-C33 | V1 / ticket |
| FR-KULA-438 | HS-33 | AC-FR-KULA-438 | HS-C33 | V1 / ticket |
| FR-KULA-442 | HS-33 | AC-FR-KULA-442 | HS-C33 | V1 / ticket |
| FR-KULA-456 | HS-33 | AC-FR-KULA-456 | HS-C33 | V1 / ticket |
| FR-KULA-488 | HS-33 | AC-FR-KULA-488 | HS-C33 | V1 / ticket |
| FR-KULA-500 | HS-33 | AC-FR-KULA-500 | HS-C33 | V1 / ticket |
| FR-KULA-517 | HS-33 | AC-FR-KULA-517 | HS-C33 | V1 / ticket |


## Behaviour
- **HS-33 / AC-HS-33** — Multi-cabang, konfigurasi dan entitlement sendiri. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-32 / AC-KPS-32** — Remote owner dashboard and multi-outlet integration. Target: Owner switches authorised outlet; sessions and takings are scoped, with no cross-tenant access. Evidence: shared integration; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01; SHARED-FAQ.
- **FR-KPS-67 / AC-KPS-67** — Rental unit / TV-PC agent slot limits and plan gates. Target: At approved sandbox unit/agent cap next activation returns explicit plan gate; hardware capability is never inferred from plan purchase. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-SENET-02 / AC-FR-SENET-02** — Multi-location management. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Uji interpretasi sendiri: One account runs several venues; sync settings, news, pricing, content across locations. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/pricing; https://senet.cloud/controllers (FAQ).
- **FR-SENET-39 / AC-FR-SENET-39** — Per-venue feature toggles in app. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Uji interpretasi sendiri: Venue enables/disables top-ups, passes, bookings, notifications. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/mobile-app (FAQ).
- **FR-SENET-74 / AC-FR-SENET-74** — Console add-on per device. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Uji interpretasi sendiri: Console management is a paid add-on sized by device count (Edit subscription → Prepare invoice). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: pending verification; sumber: help:7547084790172.
- **F177 / AC-F177** — Branch comparison. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Asersi spesifik: Branch comparison diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F177; others=Revres Play [R1]; Omegasoft [O1]; ggLeap [G1]; Gizmo-provider [Z3].
- **F270 / AC-F270** — Franchise consolidated reporting. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Asersi spesifik: Franchise consolidated reporting diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F270; others=Not verified; proposed requirement.
- **FR-KULA-238 / AC-FR-KULA-238** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-238. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Target rincian sendiri: Dashboard cabang memisahkan outlet dan membandingkan metric seragam tanpa data tenant lain. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-248 / AC-FR-KULA-248** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-248. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Target rincian sendiri: Own entitlement changes efektif berversi; tidak meniru harga/kuota atau menagih subscription live. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-427 / AC-FR-KULA-427** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-427. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-433 / AC-FR-KULA-433** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-433. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-438 / AC-FR-KULA-438** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-438. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-442 / AC-FR-KULA-442** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-442. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-456 / AC-FR-KULA-456** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-456. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-488 / AC-FR-KULA-488** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-488. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-500 / AC-FR-KULA-500** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-500. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-517 / AC-FR-KULA-517** — Multi-cabang, konfigurasi dan entitlement sendiri — referensi FR-KULA-517. Target: Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/organisations/; apps/web/app/owner/; apps/web/app/pengaturan/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C33. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T03: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D05, D07; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
PLAN_LIMIT

Design alias owned: HS-C33 — Multi-cabang, konfigurasi dan entitlement sendiri.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T03: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-01, HS-SCR-ADM-02, HS-SCR-ADM-08, HS-SCR-ADM-11, HS-SCR-ADM-13, HS-SCR-ADM-15, HS-SCR-ADM-18, HS-SCR-OWN-01
Components: HS-CMP-021, HS-CMP-022, HS-CMP-023, HS-CMP-026
Touches (design primary): HS-SCR-ADM-13, HS-SCR-ADM-15, HS-SCR-ADM-18
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
