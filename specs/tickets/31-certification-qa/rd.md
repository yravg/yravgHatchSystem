# HS-T31 — Sertifikasi hardware dan QA lintas alur

Status: **draft**
Mode: **team**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Dua review independen pada build merge: sesi→makanan→bayar→shift plus outage, duplicate/out-of-order, proses mati, jam mundur, no-ACK, revoke izin dan restore. Setiap model/firmware punya rekaman hasil, latency dan video-mode pass/fail; emulator tidak dapat meluluskan hardware. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-31 | HS-31 | AC-HS-31 | HS-C31 | V1 / ticket |
| F279 | HS-31 | AC-F279 | HS-C31 | V2 / deferred |
| HS-GAP-01 | HS-31 | AC-HS-GAP-01 | HS-C31 | V1 / ticket |
| HS-GAP-08 | HS-31 | AC-HS-GAP-08 | HS-C31 | V1 / ticket |


## Behaviour
- **HS-31 / AC-HS-31** — Sertifikasi hardware dan QA lintas alur. Target: Dua review independen pada build merge: sesi→makanan→bayar→shift plus outage, duplicate/out-of-order, proses mati, jam mundur, no-ACK, revoke izin dan restore. Setiap model/firmware punya rekaman hasil, latency dan video-mode pass/fail; emulator tidak dapat meluluskan hardware. Evidence: own normative proposal; sumber: Master PRD own design.
- **F279 / AC-F279** — Hardware compatibility certification catalogue. Target: Dua review independen pada build merge: sesi→makanan→bayar→shift plus outage, duplicate/out-of-order, proses mati, jam mundur, no-ACK, revoke izin dan restore. Setiap model/firmware punya rekaman hasil, latency dan video-mode pass/fail; emulator tidak dapat meluluskan hardware. Asersi spesifik: Hardware compatibility certification catalogue diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F279; others=Not verified; proposed requirement.
- **HS-GAP-01 / AC-HS-GAP-01** — Katalog sertifikasi model+firmware dengan bukti publik. Target: Dua review independen pada build merge: sesi→makanan→bayar→shift plus outage, duplicate/out-of-order, proses mati, jam mundur, no-ACK, revoke izin dan restore. Setiap model/firmware punya rekaman hasil, latency dan video-mode pass/fail; emulator tidak dapat meluluskan hardware. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.
- **HS-GAP-08 / AC-HS-GAP-08** — Fleet simulator dan fault injection berulang. Target: Dua review independen pada build merge: sesi→makanan→bayar→shift plus outage, duplicate/out-of-order, proses mati, jam mundur, no-ACK, revoke izin dan restore. Setiap model/firmware punya rekaman hasil, latency dan video-mode pass/fail; emulator tidak dapat meluluskan hardware. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
hardware-lab/; tests/e2e/; tests/faults/; docs/certification/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C31. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T05: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T07: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T08: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T14: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T17: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T18: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T21: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T22: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T23: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T24: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T25: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T26: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T27: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T41: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04, D06, D07, D12; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C31 — Sertifikasi hardware dan QA lintas alur.

Design alias owned: KPS-C18 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T05: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T07: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T08: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T14: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T17: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T18: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T21: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T22: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T23: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T24: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T25: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T26: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T27: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T41: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T54: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T54. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-12
Components: HS-CMP-027
Touches (design primary): HS-SCR-ADM-12, HS-CMP-027
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
