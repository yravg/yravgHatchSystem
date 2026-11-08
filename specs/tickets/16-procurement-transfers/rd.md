# HS-T16 — Supplier, PO, penerimaan dan mutasi gudang

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-16 | HS-16 | AC-HS-16 | HS-C16 | V1 / ticket |
| F104 | HS-16 | AC-F104 | HS-C16 | V1 / ticket |
| F105 | HS-16 | AC-F105 | HS-C16 | V1 / ticket |
| F106 | HS-16 | AC-F106 | HS-C16 | V1 / ticket |
| F111 | HS-16 | AC-F111 | HS-C16 | V1 / ticket |
| F269 | HS-16 | AC-F269 | HS-C16 | V2 / deferred |
| FR-KULA-189 | HS-16 | AC-FR-KULA-189 | HS-C16 | V1 / ticket |
| FR-KULA-190 | HS-16 | AC-FR-KULA-190 | HS-C16 | V1 / ticket |
| FR-KULA-220 | HS-16 | AC-FR-KULA-220 | HS-C16 | V1 / ticket |
| FR-KULA-221 | HS-16 | AC-FR-KULA-221 | HS-C16 | V1 / ticket |
| FR-KULA-239 | HS-16 | AC-FR-KULA-239 | HS-C16 | V1 / ticket |
| FR-KULA-240 | HS-16 | AC-FR-KULA-240 | HS-C16 | V1 / ticket |
| FR-KULA-265 | HS-16 | AC-FR-KULA-265 | HS-C16 | V1 / ticket |
| FR-KULA-311 | HS-16 | AC-FR-KULA-311 | HS-C16 | V1 / ticket |
| FR-KULA-350 | HS-16 | AC-FR-KULA-350 | HS-C16 | V1 / ticket |
| FR-KULA-372 | HS-16 | AC-FR-KULA-372 | HS-C16 | V1 / ticket |
| FR-KULA-373 | HS-16 | AC-FR-KULA-373 | HS-C16 | V1 / ticket |
| FR-KULA-374 | HS-16 | AC-FR-KULA-374 | HS-C16 | V1 / ticket |
| FR-KULA-375 | HS-16 | AC-FR-KULA-375 | HS-C16 | V1 / ticket |
| FR-KULA-376 | HS-16 | AC-FR-KULA-376 | HS-C16 | V1 / ticket |
| FR-KULA-377 | HS-16 | AC-FR-KULA-377 | HS-C16 | V1 / ticket |
| FR-KULA-457 | HS-16 | AC-FR-KULA-457 | HS-C16 | V1 / ticket |


## Behaviour
- **HS-16 / AC-HS-16** — Supplier, PO, penerimaan dan mutasi gudang. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: own normative proposal; sumber: Master PRD own design.
- **F104 / AC-F104** — Supplier records. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Supplier records diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F104; others=Not verified; proposed requirement.
- **F105 / AC-F105** — Purchase orders. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Purchase orders diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F105; others=Not verified; proposed requirement.
- **F106 / AC-F106** — Goods receiving. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Goods receiving diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F106; others=Not verified; proposed requirement.
- **F111 / AC-F111** — Branch stock transfers. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Branch stock transfers diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F111; others=Not verified; proposed requirement.
- **F269 / AC-F269** — Multi-branch stock and asset transfer. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Asersi spesifik: Multi-branch stock and asset transfer diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F269; others=Not verified; proposed requirement.
- **FR-KULA-189 / AC-FR-KULA-189** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-189. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Reorder menghasilkan draft PO dari low-stock, bukan pembelian otomatis. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-toko.
- **FR-KULA-190 / AC-FR-KULA-190** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-190. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Draft PO memiliki supplier/item/qty/harga dan approval sebelum dikirim keluar. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-toko.
- **FR-KULA-220 / AC-FR-KULA-220** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-220. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: PO dipenuhi lewat goods receipt parsial; qty yang belum diterima tetap outstanding dan retry tidak double-stock. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `stock-purchase-order`, public bundle).
- **FR-KULA-221 / AC-FR-KULA-221** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-221. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Transfer menaruh stok in-transit; tujuan menerima sekali setelah konfirmasi, cancel mempunyai reversal. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `stock-transfer-mutation`, public bundle).
- **FR-KULA-239 / AC-FR-KULA-239** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-239. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Saran restock berversi menjelaskan window/model dan data kurang; supplier order tetap draft approval. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-240 / AC-FR-KULA-240** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-240. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Target rincian sendiri: Mutasi antar outlet membawa cost layer yang tepat tanpa menulis ulang cost penjualan lama. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-265 / AC-FR-KULA-265** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-265. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-311 / AC-FR-KULA-311** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-311. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-350 / AC-FR-KULA-350** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-350. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-372 / AC-FR-KULA-372** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-372. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-373 / AC-FR-KULA-373** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-373. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-374 / AC-FR-KULA-374** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-374. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-375 / AC-FR-KULA-375** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-375. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-376 / AC-FR-KULA-376** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-376. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-377 / AC-FR-KULA-377** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-377. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-457 / AC-FR-KULA-457** — Supplier, PO, penerimaan dan mutasi gudang — referensi FR-KULA-457. Target: PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/procurement/; apps/web/app/pengadaan/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C16. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T15: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T33: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D17; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C16 — Supplier, PO, penerimaan dan mutasi gudang.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T15: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T33: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-07, HS-SCR-ADM-18
Components: HS-CMP-007, HS-CMP-021, HS-CMP-023
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
