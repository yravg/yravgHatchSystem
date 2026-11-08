# HS-T05 — Sesi fixed/open, jeda, pindah dan berhenti

Status: **draft**
Mode: **team**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-05 | HS-05 | AC-HS-05 | HS-C05 | MVP / ticket |
| FR-KPS-04 | HS-05 | AC-KPS-04 | HS-C05 | MVP / ticket |
| FR-KPS-05 | HS-05 | AC-KPS-05 | HS-C05 | MVP / ticket |
| FR-KPS-08 | HS-05 | AC-KPS-08 | HS-C05 | MVP / ticket |
| FR-KPS-09 | HS-05 | AC-KPS-09 | HS-C05 | MVP / ticket |
| FR-KPS-10 | HS-05 | AC-KPS-10 | HS-C05 | MVP / ticket |
| FR-KPS-11 | HS-05 | AC-KPS-11 | HS-C05 | MVP / ticket |
| FR-KPS-66 | HS-05 | AC-KPS-66 | HS-C05 | MVP / ticket |
| FR-SENET-15 | HS-05 | AC-FR-SENET-15 | HS-C05 | MVP / ticket |
| FR-SENET-56 | HS-05 | AC-FR-SENET-56 | HS-C05 | MVP / ticket |
| FR-SENET-82 | HS-05 | AC-FR-SENET-82 | HS-C05 | MVP / ticket |
| FR-SENET-84 | HS-05 | AC-FR-SENET-84 | HS-C05 | MVP / ticket |
| F015 | HS-05 | AC-F015 | HS-C05 | MVP / ticket |
| F016 | HS-05 | AC-F016 | HS-C05 | MVP / ticket |
| F017 | HS-05 | AC-F017 | HS-C05 | MVP / ticket |
| F018 | HS-05 | AC-F018 | HS-C05 | MVP / ticket |
| F024 | HS-05 | AC-F024 | HS-C05 | MVP / ticket |
| F025 | HS-05 | AC-F025 | HS-C05 | MVP / ticket |
| F026 | HS-05 | AC-F026 | HS-C05 | MVP / ticket |
| F027 | HS-05 | AC-F027 | HS-C05 | MVP / ticket |
| F029 | HS-05 | AC-F029 | HS-C05 | MVP / ticket |
| F030 | HS-05 | AC-F030 | HS-C05 | MVP / ticket |
| F031 | HS-05 | AC-F031 | HS-C05 | MVP / ticket |
| F032 | HS-05 | AC-F032 | HS-C05 | MVP / ticket |
| F037 | HS-05 | AC-F037 | HS-C05 | MVP / ticket |
| F046 | HS-05 | AC-F046 | HS-C05 | MVP / ticket |
| FR-KULA-046 | HS-05 | AC-FR-KULA-046 | HS-C05 | MVP / ticket |
| FR-KULA-159 | HS-05 | AC-FR-KULA-159 | HS-C05 | MVP / ticket |
| FR-KULA-168 | HS-05 | AC-FR-KULA-168 | HS-C05 | MVP / ticket |
| FR-KULA-209 | HS-05 | AC-FR-KULA-209 | HS-C05 | MVP / ticket |
| FR-KULA-251 | HS-05 | AC-FR-KULA-251 | HS-C05 | MVP / ticket |
| FR-KULA-312 | HS-05 | AC-FR-KULA-312 | HS-C05 | MVP / ticket |
| FR-KULA-378 | HS-05 | AC-FR-KULA-378 | HS-C05 | MVP / ticket |
| FR-KULA-502 | HS-05 | AC-FR-KULA-502 | HS-C05 | MVP / ticket |
| HS-GAP-02 | HS-05 | AC-HS-GAP-02 | HS-C05 | MVP / ticket |


## Behaviour
- **HS-05 / AC-HS-05** — Sesi fixed/open, jeda, pindah dan berhenti. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-04 / AC-KPS-04** — Fixed-duration countdown. Target: Start 120-minute package; countdown and end timestamp agree across cashier and agent simulator. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:07–04:21.
- **FR-KPS-05 / AC-KPS-05** — Open-ended elapsed-time billing. Target: Run open session for 90 minutes at IDR 12,000/hour; stop quotes IDR 18,000 before fees under approved no-rounding fixture. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:07–04:15; SRC-24.
- **FR-KPS-08 / AC-KPS-08** — Extend running session. Target: Add 60 minutes to 30 remaining; resulting remaining time is 90 minutes, with one extension audit event. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:42–04:49.
- **FR-KPS-09 / AC-KPS-09** — Pause and resume. Target: Pause fixed session for 10 minutes; billable elapsed time remains unchanged until resume under approved fixture. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:50–04:52.
- **FR-KPS-10 / AC-KPS-10** — Move session to another unit preserving time and bill. Target: Move A to vacant B; same session ID, paid amounts, remaining time and F&B follow; occupied B rejects atomically. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:52–04:55.
- **FR-KPS-11 / AC-KPS-11** — Early stop and end state. Target: Stop halfway through package; unit enters finished/cleaning stage, charge is frozen, credit action is offered only if eligible. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:55–05:16.
- **FR-KPS-66 / AC-KPS-66** — Concurrent cashier actions and idempotent command safety. Target: Two cashiers start same station simultaneously; exactly one wins; losing request receives conflict without charge. Evidence: proposed; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: DESIGN-01.
- **FR-SENET-15 / AC-FR-SENET-15** — Post-paid session. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Uji interpretasi sendiri: Start limited or unlimited session, extend, settle in virtual cash desk after. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:fA_AwlF1brA@02:24.
- **FR-SENET-56 / AC-FR-SENET-56** — Console session pause/resume. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Uji interpretasi sendiri: Pause and resume console sessions. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: https://senet.cloud/controllers.
- **FR-SENET-82 / AC-FR-SENET-82** — Session transfer between PCs. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Uji interpretasi sendiri: Move a running session to another free PC; the rate/pass is re-evaluated for the new zone; not available for consoles. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:20311279798300.
- **FR-SENET-84 / AC-FR-SENET-84** — Extend postpaid / remove time limits. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Uji interpretasi sendiri: Extend one or many postpaid sessions by a set time, or remove limits until staff stop it. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help: How to Extend a Postpaid Session.
- **F015 / AC-F015** — Open-ended count-up sessions. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Open-ended count-up sessions diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F015; others=CECO [C1]; PIKaPOS [P1].
- **F016 / AC-F016** — Fixed-duration countdown sessions. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Fixed-duration countdown sessions diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F016; others=CECO [C1]; PIKaPOS [P1]; BillingPS [B1].
- **F017 / AC-F017** — Prepaid sessions. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Prepaid sessions diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F017; others=iCafeCloud [I1].
- **F018 / AC-F018** — Postpaid sessions. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Postpaid sessions diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F018; others=BillingPS [B1]; iCafeCloud [I1].
- **F024 / AC-F024** — Pause and resume. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Pause and resume diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F024; others=CECO [C1].
- **F025 / AC-F025** — Extend active session. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Extend active session diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F025; others=CECO [C1].
- **F026 / AC-F026** — Transfer active session to another station. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Transfer active session to another station diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F026; others=CECO [C1].
- **F027 / AC-F027** — Preserve F&B on session transfer. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Preserve F&B on session transfer diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F027; others=AlfSmartBilling [A1].
- **F029 / AC-F029** — Automatic expiry lock. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Automatic expiry lock diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F029; others=Not verified; proposed requirement.
- **F030 / AC-F030** — Grace period policy. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Grace period policy diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F030; others=Not verified; proposed requirement.
- **F031 / AC-F031** — Cashier manual end session. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Cashier manual end session diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F031; others=Not verified; proposed requirement.
- **F032 / AC-F032** — Customer early end request. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Customer early end request diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F032; others=Not verified; proposed requirement.
- **F037 / AC-F037** — Prevent simultaneous sessions on one station. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Prevent simultaneous sessions on one station diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F037; others=Not verified; proposed requirement.
- **F046 / AC-F046** — Session start waits for device acknowledgement. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Asersi spesifik: Session start waits for device acknowledgement diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F046; others=Not verified; proposed requirement.
- **FR-KULA-046 / AC-FR-KULA-046** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-046. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-159 / AC-FR-KULA-159** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-159. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-168 / AC-FR-KULA-168** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-168. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-209 / AC-FR-KULA-209** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-209. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Target rincian sendiri: Station kosong dapat direserve untuk fixed atau open, dengan billing/ACK state terpisah dan quote tersimpan. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `rental-start-session`, public bundle).
- **FR-KULA-251 / AC-FR-KULA-251** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-251. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/bayar-diawal-vs-bayar-diakhir-bisnis-rental-plus-minus-dan-rekomendasi.
- **FR-KULA-312 / AC-FR-KULA-312** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-312. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-378 / AC-FR-KULA-378** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-378. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-502 / AC-FR-KULA-502** — Sesi fixed/open, jeda, pindah dan berhenti — referensi FR-KULA-502. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **HS-GAP-02 / AC-HS-GAP-02** — ACK aktivasi dan kompensasi kegagalan. Target: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/sessions/; apps/web/app/kasir/; packages/domain/session/; tests/session/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C05. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T03: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T04: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D01, D06, D07; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
STATION_BUSY, INVALID_TRANSITION

Design alias owned: HS-C05 — Sesi fixed/open, jeda, pindah dan berhenti.

Design alias owned: KPS-C03 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T03: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T04: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T49: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T49. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-04, HS-SCR-ADM-20, HS-SCR-CSH-01, HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-CSH-05, HS-SCR-CSH-11, HS-SCR-CSH-15, HS-SCR-CUS-06, HS-SCR-KSK-03, HS-SCR-KSK-04, HS-SCR-TVA-04, HS-SCR-TVA-06
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-013, HS-CMP-019, HS-CMP-020, HS-CMP-024, HS-CMP-033, HS-CMP-035, HS-CMP-039, HS-CMP-046, HS-CMP-051, HS-CMP-058
Touches (design primary): HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-CSH-15, HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-051
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
