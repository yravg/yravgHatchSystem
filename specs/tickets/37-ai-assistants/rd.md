# HS-T37 — AI helper dengan preview dan persetujuan

Status: **draft**
Mode: **solo**
Phase: V2

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-37 | HS-37 | AC-HS-37 | HS-C37 | V2 / deferred |
| FR-KULA-041 | HS-37 | AC-FR-KULA-041 | HS-C37 | V2 / deferred |
| FR-KULA-042 | HS-37 | AC-FR-KULA-042 | HS-C37 | V2 / deferred |
| FR-KULA-043 | HS-37 | AC-FR-KULA-043 | HS-C37 | V2 / deferred |
| FR-KULA-044 | HS-37 | AC-FR-KULA-044 | HS-C37 | V2 / deferred |
| FR-KULA-045 | HS-37 | AC-FR-KULA-045 | HS-C37 | V2 / deferred |
| FR-KULA-242 | HS-37 | AC-FR-KULA-242 | HS-C37 | V2 / deferred |
| FR-KULA-243 | HS-37 | AC-FR-KULA-243 | HS-C37 | V2 / deferred |
| FR-KULA-244 | HS-37 | AC-FR-KULA-244 | HS-C37 | V2 / deferred |
| FR-KULA-245 | HS-37 | AC-FR-KULA-245 | HS-C37 | V2 / deferred |
| FR-KULA-246 | HS-37 | AC-FR-KULA-246 | HS-C37 | V2 / deferred |
| FR-KULA-423 | HS-37 | AC-FR-KULA-423 | HS-C37 | V2 / deferred |
| FR-KULA-429 | HS-37 | AC-FR-KULA-429 | HS-C37 | V2 / deferred |
| FR-KULA-444 | HS-37 | AC-FR-KULA-444 | HS-C37 | V2 / deferred |
| FR-KULA-445 | HS-37 | AC-FR-KULA-445 | HS-C37 | V2 / deferred |
| FR-KULA-446 | HS-37 | AC-FR-KULA-446 | HS-C37 | V2 / deferred |
| FR-KULA-447 | HS-37 | AC-FR-KULA-447 | HS-C37 | V2 / deferred |
| FR-KULA-448 | HS-37 | AC-FR-KULA-448 | HS-C37 | V2 / deferred |
| FR-KULA-449 | HS-37 | AC-FR-KULA-449 | HS-C37 | V2 / deferred |
| FR-KULA-450 | HS-37 | AC-FR-KULA-450 | HS-C37 | V2 / deferred |
| FR-KULA-471 | HS-37 | AC-FR-KULA-471 | HS-C37 | V2 / deferred |
| FR-KULA-472 | HS-37 | AC-FR-KULA-472 | HS-C37 | V2 / deferred |
| FR-KULA-475 | HS-37 | AC-FR-KULA-475 | HS-C37 | V2 / deferred |
| FR-KULA-487 | HS-37 | AC-FR-KULA-487 | HS-C37 | V2 / deferred |
| FR-KULA-510 | HS-37 | AC-FR-KULA-510 | HS-C37 | V2 / deferred |
| FR-KULA-516 | HS-37 | AC-FR-KULA-516 | HS-C37 | V2 / deferred |


## Behaviour
- **HS-37 / AC-HS-37** — AI helper dengan preview dan persetujuan. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KULA-041 / AC-FR-KULA-041** — AI helper dengan preview dan persetujuan — referensi FR-KULA-041. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-042 / AC-FR-KULA-042** — AI helper dengan preview dan persetujuan — referensi FR-KULA-042. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-043 / AC-FR-KULA-043** — AI helper dengan preview dan persetujuan — referensi FR-KULA-043. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-044 / AC-FR-KULA-044** — AI helper dengan preview dan persetujuan — referensi FR-KULA-044. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-045 / AC-FR-KULA-045** — AI helper dengan preview dan persetujuan — referensi FR-KULA-045. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-242 / AC-FR-KULA-242** — AI helper dengan preview dan persetujuan — referensi FR-KULA-242. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-243 / AC-FR-KULA-243** — AI helper dengan preview dan persetujuan — referensi FR-KULA-243. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-244 / AC-FR-KULA-244** — AI helper dengan preview dan persetujuan — referensi FR-KULA-244. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-245 / AC-FR-KULA-245** — AI helper dengan preview dan persetujuan — referensi FR-KULA-245. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-246 / AC-FR-KULA-246** — AI helper dengan preview dan persetujuan — referensi FR-KULA-246. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-423 / AC-FR-KULA-423** — AI helper dengan preview dan persetujuan — referensi FR-KULA-423. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-429 / AC-FR-KULA-429** — AI helper dengan preview dan persetujuan — referensi FR-KULA-429. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-444 / AC-FR-KULA-444** — AI helper dengan preview dan persetujuan — referensi FR-KULA-444. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-445 / AC-FR-KULA-445** — AI helper dengan preview dan persetujuan — referensi FR-KULA-445. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-446 / AC-FR-KULA-446** — AI helper dengan preview dan persetujuan — referensi FR-KULA-446. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-447 / AC-FR-KULA-447** — AI helper dengan preview dan persetujuan — referensi FR-KULA-447. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-448 / AC-FR-KULA-448** — AI helper dengan preview dan persetujuan — referensi FR-KULA-448. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-449 / AC-FR-KULA-449** — AI helper dengan preview dan persetujuan — referensi FR-KULA-449. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-450 / AC-FR-KULA-450** — AI helper dengan preview dan persetujuan — referensi FR-KULA-450. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-471 / AC-FR-KULA-471** — AI helper dengan preview dan persetujuan — referensi FR-KULA-471. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-472 / AC-FR-KULA-472** — AI helper dengan preview dan persetujuan — referensi FR-KULA-472. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-475 / AC-FR-KULA-475** — AI helper dengan preview dan persetujuan — referensi FR-KULA-475. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-487 / AC-FR-KULA-487** — AI helper dengan preview dan persetujuan — referensi FR-KULA-487. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-510 / AC-FR-KULA-510** — AI helper dengan preview dan persetujuan — referensi FR-KULA-510. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-516 / AC-FR-KULA-516** — AI helper dengan preview dan persetujuan — referensi FR-KULA-516. Target: OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/assistants/; apps/web/app/asisten/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C37. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T15: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T18: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T30: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D16, D23; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C37 — AI helper dengan preview dan persetujuan.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T15: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T18: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T30: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-05
Components: HS-CMP-012, HS-CMP-023
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
