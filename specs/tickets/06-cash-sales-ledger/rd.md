# HS-T06 — POS, kas dan buku pembayaran append-only

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-06 | HS-06 | AC-HS-06 | HS-C06 | MVP / ticket |
| FR-KPS-06 | HS-06 | AC-KPS-06 | HS-C06 | MVP / ticket |
| FR-KPS-07 | HS-06 | AC-KPS-07 | HS-C06 | MVP / ticket |
| FR-KPS-36 | HS-06 | AC-KPS-36 | HS-C06 | MVP / ticket |
| FR-SENET-97 | HS-06 | AC-FR-SENET-97 | HS-C06 | MVP / ticket |
| F042 | HS-06 | AC-F042 | HS-C06 | MVP / ticket |
| F043 | HS-06 | AC-F043 | HS-C06 | MVP / ticket |
| F044 | HS-06 | AC-F044 | HS-C06 | MVP / ticket |
| F045 | HS-06 | AC-F045 | HS-C06 | MVP / ticket |
| F048 | HS-06 | AC-F048 | HS-C06 | MVP / ticket |
| F049 | HS-06 | AC-F049 | HS-C06 | MVP / ticket |
| F056 | HS-06 | AC-F056 | HS-C06 | MVP / ticket |
| F057 | HS-06 | AC-F057 | HS-C06 | MVP / ticket |
| F058 | HS-06 | AC-F058 | HS-C06 | MVP / ticket |
| F059 | HS-06 | AC-F059 | HS-C06 | MVP / ticket |
| F065 | HS-06 | AC-F065 | HS-C06 | MVP / ticket |
| F158 | HS-06 | AC-F158 | HS-C06 | MVP / ticket |
| FR-KULA-065 | HS-06 | AC-FR-KULA-065 | HS-C06 | MVP / ticket |
| FR-KULA-186 | HS-06 | AC-FR-KULA-186 | HS-C06 | MVP / ticket |
| FR-KULA-194 | HS-06 | AC-FR-KULA-194 | HS-C06 | MVP / ticket |
| FR-KULA-197 | HS-06 | AC-FR-KULA-197 | HS-C06 | MVP / ticket |
| FR-KULA-198 | HS-06 | AC-FR-KULA-198 | HS-C06 | MVP / ticket |
| FR-KULA-200 | HS-06 | AC-FR-KULA-200 | HS-C06 | MVP / ticket |
| FR-KULA-201 | HS-06 | AC-FR-KULA-201 | HS-C06 | MVP / ticket |
| FR-KULA-202 | HS-06 | AC-FR-KULA-202 | HS-C06 | MVP / ticket |
| FR-KULA-234 | HS-06 | AC-FR-KULA-234 | HS-C06 | MVP / ticket |
| FR-KULA-250 | HS-06 | AC-FR-KULA-250 | HS-C06 | MVP / ticket |
| FR-KULA-323 | HS-06 | AC-FR-KULA-323 | HS-C06 | MVP / ticket |
| FR-KULA-352 | HS-06 | AC-FR-KULA-352 | HS-C06 | MVP / ticket |
| FR-KULA-419 | HS-06 | AC-FR-KULA-419 | HS-C06 | MVP / ticket |
| FR-KULA-462 | HS-06 | AC-FR-KULA-462 | HS-C06 | MVP / ticket |


## Behaviour
- **HS-06 / AC-HS-06** — POS, kas dan buku pembayaran append-only. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-06 / AC-KPS-06** — Prepaid packages. Target: Take package payment first; session cannot be marked paid twice on retry; additional consumption remains separately due. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-KPS-07 / AC-KPS-07** — Postpaid checkout. Target: Run session before payment; stop freezes charge and checkout settles the outstanding rental balance once. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-KPS-36 / AC-KPS-36** — Split payments, deposits and unpaid balances. Target: Pay part cash and part transfer; allocations sum to bill and overpayment is rejected or handled by approved change policy. Evidence: shared integration; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SHARED-FAQ.
- **FR-SENET-97 / AC-FR-SENET-97** — Receipt refund (permissioned). Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Uji interpretasi sendiri: Enable Refund in settings; refund by receipt number with password confirmation. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010905080.
- **F042 / AC-F042** — Extra-controller rental charges. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Extra-controller rental charges diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F042; others=iCafeCloud [I2].
- **F043 / AC-F043** — Group multi-station bill. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Group multi-station bill diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F043; others=Not verified; proposed requirement.
- **F044 / AC-F044** — Complimentary staff-approved session. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Complimentary staff-approved session diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F044; others=Not verified; proposed requirement.
- **F045 / AC-F045** — Manual adjustment reason and audit. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Manual adjustment reason and audit diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F045; others=Not verified; proposed requirement.
- **F048 / AC-F048** — Cash payment and change. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Cash payment and change diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F048; others=CECO [C1].
- **F049 / AC-F049** — Bank-transfer recording. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Bank-transfer recording diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F049; others=CECO [C1].
- **F056 / AC-F056** — Partial deposit payment. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Partial deposit payment diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F056; others=PIKaPOS [P1].
- **F057 / AC-F057** — Split payment methods. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Split payment methods diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F057; others=Not verified; proposed requirement.
- **F058 / AC-F058** — Partial refund. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Partial refund diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F058; others=Not verified; proposed requirement.
- **F059 / AC-F059** — Full refund with approval. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Full refund with approval diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F059; others=Not verified; proposed requirement.
- **F065 / AC-F065** — Append-only financial entries. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Append-only financial entries diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F065; others=Not verified; proposed requirement.
- **F158 / AC-F158** — Manager approval for voids refunds free time. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Asersi spesifik: Manager approval for voids refunds free time diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F158; others=Not verified; proposed requirement.
- **FR-KULA-065 / AC-FR-KULA-065** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-065. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: DP dicatat sebagai liability dan dialokasikan ke tagihan tepat satu kali; pending tidak sama dengan paid. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-186 / AC-FR-KULA-186** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-186. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Scanner keyboard/kamera yang disetujui menambah SKU tepat sekali; permission denied punya fallback pencarian. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-toko.
- **FR-KULA-194 / AC-FR-KULA-194** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-194. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Kasir dapat barcode/search, park/resume cart, pilih varian dan checkout dengan tender terverifikasi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-toko.
- **FR-KULA-197 / AC-FR-KULA-197** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-197. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Keranjang varian/add-on/barcode mengkalkulasi quote; cash/QRIS/transfer-pending/credit terpisah; shortcut sendiri dapat diubah. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-create-transaction`, public bundle).
- **FR-KULA-198 / AC-FR-KULA-198** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-198. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Override harga memerlukan permission/approval scoped, reason dan harga awal/baru diaudit; tidak memakai PIN universal. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-edit-price-checkout`, public bundle).
- **FR-KULA-200 / AC-FR-KULA-200** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-200. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Split tender hanya final bila jumlah alokasi valid memenuhi tagihan; hanya kas memiliki kembalian. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-split-payment`, public bundle).
- **FR-KULA-201 / AC-FR-KULA-201** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-201. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Penjualan kredit mensyaratkan member dan persetujuan limit/tempo; outstanding bukan paid cash, collection membentuk event baru. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-customer-credit`, public bundle).
- **FR-KULA-202 / AC-FR-KULA-202** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-202. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Void sebelum final dan retur sesudah final berbeda; retur menunjuk item/qty asal, restock hanya barang layak, refund mengikuti provider proof. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-void-refund`, public bundle).
- **FR-KULA-234 / AC-FR-KULA-234** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-234. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Target rincian sendiri: Cart dapat ditunda/dilanjutkan oleh cashier berizin; item price revalidation membuat perubahan quote jelas. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-250 / AC-FR-KULA-250** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-250. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/bayar-diawal-vs-bayar-diakhir-bisnis-rental-plus-minus-dan-rekomendasi.
- **FR-KULA-323 / AC-FR-KULA-323** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-323. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-352 / AC-FR-KULA-352** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-352. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-419 / AC-FR-KULA-419** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-419. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-462 / AC-FR-KULA-462** — POS, kas dan buku pembayaran append-only — referensi FR-KULA-462. Target: Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/sales/; services/api/src/ledger/; apps/web/app/pembayaran/; packages/domain/money/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C06. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T04: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D01, D06, D15; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
IDEMPOTENCY_CONFLICT

Design alias owned: HS-C06 — POS, kas dan buku pembayaran append-only.

Design alias owned: KPS-C04 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T04: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T48: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T48. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-04, HS-SCR-ADM-09, HS-SCR-CSH-02, HS-SCR-CSH-03, HS-SCR-CSH-05, HS-SCR-CSH-09, HS-SCR-KSK-03, HS-SCR-OWN-02
Components: HS-CMP-003, HS-CMP-004, HS-CMP-005, HS-CMP-006, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-013, HS-CMP-017, HS-CMP-018, HS-CMP-023, HS-CMP-024, HS-CMP-039, HS-CMP-058
Touches (design primary): HS-SCR-CSH-05, HS-SCR-CSH-09, HS-CMP-008, HS-CMP-010, HS-CMP-018
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
