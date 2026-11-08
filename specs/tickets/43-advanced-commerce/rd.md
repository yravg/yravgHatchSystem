# HS-T43 — B2B, konsinyasi dan unit grosir

Status: **draft**
Mode: **solo**
Phase: V2

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-43 | HS-43 | AC-HS-43 | HS-C43 | V2 / deferred |
| FR-KULA-018 | HS-43 | AC-FR-KULA-018 | HS-C43 | V2 / deferred |
| FR-KULA-204 | HS-43 | AC-FR-KULA-204 | HS-C43 | V2 / deferred |
| FR-KULA-217 | HS-43 | AC-FR-KULA-217 | HS-C43 | V2 / deferred |
| FR-KULA-282 | HS-43 | AC-FR-KULA-282 | HS-C43 | V2 / deferred |
| FR-KULA-392 | HS-43 | AC-FR-KULA-392 | HS-C43 | V2 / deferred |
| FR-KULA-422 | HS-43 | AC-FR-KULA-422 | HS-C43 | V2 / deferred |
| FR-KULA-478 | HS-43 | AC-FR-KULA-478 | HS-C43 | V2 / deferred |


## Behaviour
- **HS-43 / AC-HS-43** — B2B, konsinyasi dan unit grosir. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KULA-018 / AC-FR-KULA-018** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-018. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-204 / AC-FR-KULA-204** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-204. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `pos-sales-invoices`, public bundle).
- **FR-KULA-217 / AC-FR-KULA-217** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-217. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `product-multi-unit`, public bundle).
- **FR-KULA-282 / AC-FR-KULA-282** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-282. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-392 / AC-FR-KULA-392** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-392. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-422 / AC-FR-KULA-422** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-422. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-478 / AC-FR-KULA-478** — B2B, konsinyasi dan unit grosir — referensi FR-KULA-478. Target: Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/commerce/; apps/web/app/niaga/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C43. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T15: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T16: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T18: kontrak dan hasil merge harus diterima sebelum dispatch.

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

Design alias owned: HS-C43 — B2B, konsinyasi dan unit grosir.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T15: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T16: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T18: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: none; foundation tokens
Components: HS-CMP-023
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
