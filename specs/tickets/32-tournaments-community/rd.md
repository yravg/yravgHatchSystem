# HS-T32 — Turnamen, bracket dan komunitas

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-32 | HS-32 | AC-HS-32 | HS-C32 | V1 / ticket |
| FR-KPS-58 | HS-32 | AC-KPS-58 | HS-C32 | V1 / ticket |
| FR-KPS-59 | HS-32 | AC-KPS-59 | HS-C32 | V1 / ticket |
| FR-SENET-69 | HS-32 | AC-FR-SENET-69 | HS-C32 | V1 / ticket |
| F141 | HS-32 | AC-F141 | HS-C32 | V2 / deferred |
| F142 | HS-32 | AC-F142 | HS-C32 | V2 / deferred |
| F143 | HS-32 | AC-F143 | HS-C32 | V2 / deferred |
| F144 | HS-32 | AC-F144 | HS-C32 | V2 / deferred |
| F145 | HS-32 | AC-F145 | HS-C32 | V2 / deferred |
| F146 | HS-32 | AC-F146 | HS-C32 | V2 / deferred |
| F147 | HS-32 | AC-F147 | HS-C32 | V2 / deferred |
| F148 | HS-32 | AC-F148 | HS-C32 | V2 / deferred |
| F149 | HS-32 | AC-F149 | HS-C32 | V2 / deferred |
| F150 | HS-32 | AC-F150 | HS-C32 | V2 / deferred |
| F151 | HS-32 | AC-F151 | HS-C32 | V2 / deferred |
| F152 | HS-32 | AC-F152 | HS-C32 | V2 / deferred |
| F153 | HS-32 | AC-F153 | HS-C32 | V2 / deferred |
| F154 | HS-32 | AC-F154 | HS-C32 | V2 / deferred |
| F155 | HS-32 | AC-F155 | HS-C32 | V2 / deferred |
| FR-KULA-260 | HS-32 | AC-FR-KULA-260 | HS-C32 | V1 / ticket |
| FR-KULA-383 | HS-32 | AC-FR-KULA-383 | HS-C32 | V1 / ticket |
| FR-KULA-384 | HS-32 | AC-FR-KULA-384 | HS-C32 | V1 / ticket |


## Behaviour
- **HS-32 / AC-HS-32** — Turnamen, bracket dan komunitas. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-58 / AC-KPS-58** — Member playtime leaderboard and TV rank greeting. Target: Eligible member session accrues approved scoring duration; leaderboard and greeting reflect opted-in display identity. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-KPS-59 / AC-KPS-59** — Tournament entrants, fee, bracket, score, prize and station assignment. Target: Create four-player tournament; advance match winners and reserve a compatible station without overlapping active rental. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-SENET-69 / AC-FR-SENET-69** — Tournaments module. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Uji interpretasi sendiri: Blog covers hosting tournaments; no tournament module confirmed on product pages. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: pending verification; sumber: https://senet.cloud/blog/how-to-host-an-esports-tournament.
- **F141 / AC-F141** — Tournament registration. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Tournament registration diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F141; others=Smartlaunch [S1]; Gizmo-provider [Z3].
- **F142 / AC-F142** — Tournament entry fees. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Tournament entry fees diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F142; others=Not verified; proposed requirement.
- **F143 / AC-F143** — Single elimination bracket. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Single elimination bracket diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F143; others=Revres Play [R1].
- **F144 / AC-F144** — Double elimination bracket. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Double elimination bracket diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F144; others=Not verified; proposed requirement.
- **F145 / AC-F145** — Round robin league. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Round robin league diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F145; others=Revres Play [R1].
- **F146 / AC-F146** — Score-based competition. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Score-based competition diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F146; others=Revres Play [R1].
- **F147 / AC-F147** — Match scheduling to physical stations. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Match scheduling to physical stations diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F147; others=Not verified; proposed requirement.
- **F148 / AC-F148** — Player check-in and no-shows. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Player check-in and no-shows diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F148; others=Not verified; proposed requirement.
- **F149 / AC-F149** — Seeding and byes. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Seeding and byes diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F149; others=Not verified; proposed requirement.
- **F150 / AC-F150** — Result entry and dispute review. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Result entry and dispute review diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F150; others=Not verified; proposed requirement.
- **F151 / AC-F151** — Prize accounting. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Prize accounting diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F151; others=Not verified; proposed requirement.
- **F152 / AC-F152** — Public bracket and leaderboard. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Public bracket and leaderboard diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F152; others=Revres Play [R1].
- **F153 / AC-F153** — Spectator display. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Spectator display diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F153; others=Not verified; proposed requirement.
- **F154 / AC-F154** — Event station block booking. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Event station block booking diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F154; others=Not verified; proposed requirement.
- **F155 / AC-F155** — Community recurring leagues. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Asersi spesifik: Community recurring leagues diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F155; others=Not verified; proposed requirement.
- **FR-KULA-260 / AC-FR-KULA-260** — Turnamen, bracket dan komunitas — referensi FR-KULA-260. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Target rincian sendiri: Knockout4peserta terkait slot station; bundle fee+minuman lewat sale line dan result dispute diaudit. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/7-strategi-jitu-menggandakan-omzet-rental-playstation-dan-mencegah-kebocoran-billing.
- **FR-KULA-383 / AC-FR-KULA-383** — Turnamen, bracket dan komunitas — referensi FR-KULA-383. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-384 / AC-FR-KULA-384** — Turnamen, bracket dan komunitas — referensi FR-KULA-384. Target: Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/events/; apps/web/app/komunitas/; apps/web/app/turnamen/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C32. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T11: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T12: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T26: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D10; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C32 — Turnamen, bracket dan komunitas.

Design alias owned: KPS-C16 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T11: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T12: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T26: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09, HS-SCR-LBY-03, HS-SCR-TVA-09
Components: HS-CMP-025, HS-CMP-038, HS-CMP-040, HS-CMP-055
Touches (design primary): HS-SCR-ADM-10, HS-SCR-ADM-25, HS-SCR-CUS-09, HS-CMP-025, HS-CMP-055
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
