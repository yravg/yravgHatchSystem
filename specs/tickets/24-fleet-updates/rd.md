# HS-T24 — Kesehatan fleet, update bertanda tangan dan rollback

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-24 | HS-24 | AC-HS-24 | HS-C24 | V1 / ticket |
| FR-KPS-53 | HS-24 | AC-KPS-53 | HS-C24 | V1 / ticket |
| FR-KPS-54 | HS-24 | AC-KPS-54 | HS-C24 | V1 / ticket |
| FR-SENET-59 | HS-24 | AC-FR-SENET-59 | HS-C24 | V1 / ticket |
| F254 | HS-24 | AC-F254 | HS-C24 | V1 / ticket |
| F281 | HS-24 | AC-F281 | HS-C24 | V2 / deferred |
| HS-GAP-09 | HS-24 | AC-HS-GAP-09 | HS-C24 | V1 / ticket |


## Behaviour
- **HS-24 / AC-HS-24** — Kesehatan fleet, update bertanda tangan dan rollback. Target: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-53 / AC-KPS-53** — Fallback HTTP polling while socket is unhealthy. Target: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Bukan salinan konstanta internal vendor. Evidence: static; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1.
- **FR-KPS-54 / AC-KPS-54** — In-app agent update download/install flow. Target: Mock update manifest and signed payload; reject bad hash/signature and do not install in active session without explicit approved policy. Evidence: static; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1.
- **FR-SENET-59 / AC-FR-SENET-59** — Console monitoring & alerts. Target: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Uji interpretasi sendiri: Per-console performance tracking, disconnection alerts, snapshot recovery. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: pending verification; sumber: https://senet.cloud/controllers.
- **F254 / AC-F254** — Signed agent updates. Target: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Asersi spesifik: Signed agent updates diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F254; others=Not verified; proposed requirement.
- **F281 / AC-F281** — Health alerts for controller batteries. Target: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Asersi spesifik: Health alerts for controller batteries diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F281; others=Not verified; proposed requirement.
- **HS-GAP-09 / AC-HS-GAP-09** — Update signed canary dan rollback. Target: Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/fleet/; services/worker/src/releases/; agents/venue-edge/Updates/; agents/android-tv/app/src/main/java/id/yravg/hatch/update/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C24. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T21: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D12; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
UPDATE_REJECTED

Design alias owned: HS-C24 — Kesehatan fleet, update bertanda tangan dan rollback.

Design alias owned: KPS-C13 — Legacy proposed component alias; no extra visual specification.

## v0.2 own requirement crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-V02-18 | HS-24 | AC-HS-V02-18 | HS-C24 | V1 / ticket |
- HS-V02-18 / AC-HS-V02-18: Own websocket preferred; bounded jittered backoff fallback uses state/network and documented budget. v0.1 30second fallback is a fixture not universal constant; unpaired cadence observed~3.352s competitor is provenance, not own default. No request amplification on boot/offline; retain ACK and lease deadline independent of network polling.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T21: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-CSH-01, HS-SCR-TVA-07, HS-SCR-TVA-10
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-031, HS-CMP-033, HS-CMP-036, HS-CMP-057, HS-CMP-058
Touches (design primary): HS-CMP-026
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
