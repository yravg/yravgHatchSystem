# HS-T39 — Feasibility native webOS dan Tizen

Status: **draft**
Mode: **solo**
Phase: V2

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-39 | HS-39 | AC-HS-39 | HS-C39 | V2 / deferred |
| FR-KPS-63 | HS-39 | AC-KPS-63 | HS-C39 | V2 / deferred |
| FR-SENET-55 | HS-39 | AC-FR-SENET-55 | HS-C39 | V2 / deferred |
| F224 | HS-39 | AC-F224 | HS-C39 | V2 / deferred |
| F225 | HS-39 | AC-F225 | HS-C39 | V2 / deferred |
| F226 | HS-39 | AC-F226 | HS-C39 | V2 / deferred |
| FR-KULA-467 | HS-39 | AC-FR-KULA-467 | HS-C39 | V2 / deferred |
| FR-KULA-468 | HS-39 | AC-FR-KULA-468 | HS-C39 | V2 / deferred |


## Behaviour
- **HS-39 / AC-HS-39** — Feasibility native webOS dan Tizen. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-63 / AC-KPS-63** — Native LG webOS / Samsung Tizen TV agent. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Evidence: UNKNOWN; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: P3; P4.
- **FR-SENET-55 / AC-FR-SENET-55** — Console App on Smart TV. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Klaim Samsung sumber bukan bukti setup/certified; Android tetap dimiliki T21, LG coming-soon bukan shipped. Evidence: pending verification; sumber: https://senet.cloud/controllers.
- **F224 / AC-F224** — webOS foreground app prototype. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Asersi spesifik: webOS foreground app prototype diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F224; others=Not verified; proposed requirement.
- **F225 / AC-F225** — webOS supported HDMI control feasibility gate. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Asersi spesifik: webOS supported HDMI control feasibility gate diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F225; others=Not verified; proposed requirement.
- **F226 / AC-F226** — Tizen foreground HDMI PiP prototype. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Asersi spesifik: Tizen foreground HDMI PiP prototype diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F226; others=Not verified; proposed requirement.
- **FR-KULA-467 / AC-FR-KULA-467** — Feasibility native webOS dan Tizen — referensi FR-KULA-467. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-468 / AC-FR-KULA-468** — Feasibility native webOS dan Tizen — referensi FR-KULA-468. Target: Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
apps/tv-webos/; apps/tv-tizen/; hardware-lab/native-tv/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C39. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T23: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04, D12, D19; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C39 — Feasibility native webOS dan Tizen.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T23: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-12, HS-SCR-ADP-01, HS-SCR-TVA-03
Components: HS-CMP-027, HS-CMP-029, HS-CMP-032
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
