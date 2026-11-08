# HS-T17 — Shift kasir dan serah terima sesi aktif

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-17 | HS-17 | AC-HS-17 | HS-C17 | MVP / ticket |
| FR-KPS-29 | HS-17 | AC-KPS-29 | HS-C17 | MVP / ticket |
| FR-KPS-30 | HS-17 | AC-KPS-30 | HS-C17 | MVP / ticket |
| FR-SENET-13 | HS-17 | AC-FR-SENET-13 | HS-C17 | MVP / ticket |
| FR-SENET-95 | HS-17 | AC-FR-SENET-95 | HS-C17 | MVP / ticket |
| FR-SENET-96 | HS-17 | AC-FR-SENET-96 | HS-C17 | MVP / ticket |
| F159 | HS-17 | AC-F159 | HS-C17 | MVP / ticket |
| F160 | HS-17 | AC-F160 | HS-C17 | MVP / ticket |
| F161 | HS-17 | AC-F161 | HS-C17 | MVP / ticket |
| F162 | HS-17 | AC-F162 | HS-C17 | MVP / ticket |
| FR-KULA-015 | HS-17 | AC-FR-KULA-015 | HS-C17 | MVP / ticket |
| FR-KULA-176 | HS-17 | AC-FR-KULA-176 | HS-C17 | MVP / ticket |
| FR-KULA-195 | HS-17 | AC-FR-KULA-195 | HS-C17 | MVP / ticket |
| FR-KULA-227 | HS-17 | AC-FR-KULA-227 | HS-C17 | MVP / ticket |
| FR-KULA-413 | HS-17 | AC-FR-KULA-413 | HS-C17 | MVP / ticket |
| FR-KULA-512 | HS-17 | AC-FR-KULA-512 | HS-C17 | MVP / ticket |


## Behaviour
- **HS-17 / AC-HS-17** — Shift kasir dan serah terima sesi aktif. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-29 / AC-KPS-29** — Per-shift rental payments and extension audit. Target: Filter shift; extensions, sales and settlement are attributed consistently even when shift crosses midnight. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01; SRC-08.
- **FR-KPS-30 / AC-KPS-30** — Cash vs non-cash reconciliation and opening float. Target: Open with IDR 100,000, receive IDR 200,000 cash and IDR 50,000 non-cash, pay out IDR 20,000; expected drawer is IDR 280,000. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-08.
- **FR-SENET-13 / AC-FR-SENET-13** — Cash desk with shifts. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Uji interpretasi sendiri: Staff opens register shift, sells time/passes/items, records cash or card; reconcile end of day. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@05:57.
- **FR-SENET-95 / AC-FR-SENET-95** — Cash register shifts with opening float. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Uji interpretasi sendiri: Open shift per cash register with an opening balance; close; cash deposits/withdrawals need a comment. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360020519219.
- **FR-SENET-96 / AC-FR-SENET-96** — X-report / Z-report. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Uji interpretasi sendiri: X = interim, repeatable; Z = closes all open cashier shifts (once per 24 h with a fiscal printer). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360011020979; help:360010904480.
- **F159 / AC-F159** — Cash drawer opening float. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Asersi spesifik: Cash drawer opening float diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F159; others=Not verified; proposed requirement.
- **F160 / AC-F160** — Shift close and cash variance. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Asersi spesifik: Shift close and cash variance diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F160; others=CECO [C1]; Gizmo [Z1].
- **F161 / AC-F161** — Staff handover notes. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Asersi spesifik: Staff handover notes diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F161; others=Not verified; proposed requirement.
- **F162 / AC-F162** — Cash expenses. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Asersi spesifik: Cash expenses diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F162; others=Not verified; proposed requirement.
- **FR-KULA-015 / AC-FR-KULA-015** — Shift kasir dan serah terima sesi aktif — referensi FR-KULA-015. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-176 / AC-FR-KULA-176** — Shift kasir dan serah terima sesi aktif — referensi FR-KULA-176. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-servis-elektronik.
- **FR-KULA-195 / AC-FR-KULA-195** — Shift kasir dan serah terima sesi aktif — referensi FR-KULA-195. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-toko.
- **FR-KULA-227 / AC-FR-KULA-227** — Shift kasir dan serah terima sesi aktif — referensi FR-KULA-227. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Target rincian sendiri: Close shift menghitung float+cash-in-cash-out, variance dan alasan; sesi aktif diteruskan via handover. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `reports-shift-close`, public bundle).
- **FR-KULA-413 / AC-FR-KULA-413** — Shift kasir dan serah terima sesi aktif — referensi FR-KULA-413. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-512 / AC-FR-KULA-512** — Shift kasir dan serah terima sesi aktif — referensi FR-KULA-512. Target: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/shifts/; apps/web/app/shift/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C17. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T08: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D08; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C17 — Shift kasir dan serah terima sesi aktif.

Design alias owned: KPS-C09 — Legacy proposed component alias; no extra visual specification.

## Verified policy acceptance v0.2
- FR-SENET-95 / AC-FR-SENET-95: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Uji interpretasi sendiri: Open shift per cash register with an opening balance; close; cash deposits/withdrawals need a comment. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.
- FR-SENET-96 / AC-FR-SENET-96: Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur. Uji interpretasi sendiri: X = interim, repeatable; Z = closes all open cashier shifts (once per 24 h with a fiscal printer). Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: Two drinks using100ml recipe consume200ml once. X repeated3times does not close shift or mutate ledger. Z atomically snapshots scoped register/business-day only after approved open-shift policy; active sessions carry forward, QRIS pending reported separate, duplicate Z returns same closeId. Cash drawer ignores QRIS, refund/transfer conflict is audited. No final KDS/POS UI.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T08: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T53: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T53. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-08, HS-SCR-ADM-17, HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-CSH-14, HS-SCR-OWN-02
Components: HS-CMP-017, HS-CMP-018, HS-CMP-021, HS-CMP-023, HS-CMP-049, HS-CMP-050
Touches (design primary): HS-SCR-CSH-08, HS-SCR-CSH-13, HS-SCR-CSH-14, HS-CMP-017, HS-CMP-049, HS-CMP-050
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D30: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.
