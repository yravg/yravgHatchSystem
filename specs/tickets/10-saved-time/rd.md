# HS-T10 — Tabungan waktu, penebusan dan kedaluwarsa

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-10 | HS-10 | AC-HS-10 | HS-C10 | V1 / ticket |
| FR-KPS-22 | HS-10 | AC-KPS-22 | HS-C10 | V1 / ticket |
| FR-KPS-23 | HS-10 | AC-KPS-23 | HS-C10 | V1 / ticket |
| FR-KPS-24 | HS-10 | AC-KPS-24 | HS-C10 | V1 / ticket |
| FR-SENET-89 | HS-10 | AC-FR-SENET-89 | HS-C10 | V1 / ticket |
| F033 | HS-10 | AC-F033 | HS-C10 | V1 / ticket |
| F034 | HS-10 | AC-F034 | HS-C10 | V1 / ticket |
| F035 | HS-10 | AC-F035 | HS-C10 | V1 / ticket |
| FR-KULA-208 | HS-10 | AC-FR-KULA-208 | HS-C10 | V1 / ticket |
| FR-KULA-211 | HS-10 | AC-FR-KULA-211 | HS-C10 | V1 / ticket |
| FR-KULA-261 | HS-10 | AC-FR-KULA-261 | HS-C10 | V1 / ticket |


## Behaviour
- **HS-10 / AC-HS-10** — Tabungan waktu, penebusan dan kedaluwarsa. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-22 / AC-KPS-22** — Save unused prepaid minutes to member time credit. Target: Paid 120-minute session stops after 45; save 75 minutes exactly once, subject to approved granularity. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 04:59–05:16.
- **FR-KPS-23 / AC-KPS-23** — Redeem saved time and view remaining balance. Target: Redeem 30 of 75 saved minutes; balance becomes 45 and replay of redemption cannot double-spend. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01; V1 05:32–05:46.
- **FR-KPS-24 / AC-KPS-24** — Time-credit expiry policy. Target: Approved 30-day test bucket becomes unavailable at expiry; expired and usable balances are shown separately. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 05:38–05:46.
- **FR-SENET-89 / AC-FR-SENET-89** — Zone levels for passes. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Uji interpretasi sendiri: A pass from a lower-level zone can't be used in a higher-level zone; higher-level passes work in lower zones. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010819900.
- **F033 / AC-F033** — Saved unused time credit. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Asersi spesifik: Saved unused time credit diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F033; others=CECO [C1]; AlfSmartBilling [A1].
- **F034 / AC-F034** — Separate time balances by station category. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Asersi spesifik: Separate time balances by station category diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F034; others=AlfSmartBilling [A1].
- **F035 / AC-F035** — Time-credit expiry rules. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Asersi spesifik: Time-credit expiry rules diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F035; others=AlfSmartBilling [A1].
- **FR-KULA-208 / AC-FR-KULA-208** — Tabungan waktu, penebusan dan kedaluwarsa — referensi FR-KULA-208. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Target rincian sendiri: Sisa durasi paket lunas ditabung hanya ke member yang benar, tepat satu kali saat stop eligible. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `customers-save-time-rental`, public bundle).
- **FR-KULA-211 / AC-FR-KULA-211** — Tabungan waktu, penebusan dan kedaluwarsa — referensi FR-KULA-211. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Target rincian sendiri: Pause menyimpan remaining; stop eligible membuat time bucket, sesi berikut redeem atomik dan expiry/category diperiksa. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `rental-time-credit`, public bundle).
- **FR-KULA-261 / AC-FR-KULA-261** — Tabungan waktu, penebusan dan kedaluwarsa — referensi FR-KULA-261. Target: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Target rincian sendiri: Time credit tidak bergantung WhatsApp; identifier member scoped dan redeem tanpa duplikasi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/blog/7-strategi-jitu-menggandakan-omzet-rental-playstation-dan-mencegah-kebocoran-billing.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/time-credits/; packages/domain/time-credit/; apps/web/app/member/waktu/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C10. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T05: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T06: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D03; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
CREDIT_INELIGIBLE

Design alias owned: HS-C10 — Tabungan waktu, penebusan dan kedaluwarsa.

Design alias owned: KPS-C07 — Legacy proposed component alias; no extra visual specification.

## Verified policy acceptance v0.2
- FR-SENET-89 / AC-FR-SENET-89: Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama. Uji interpretasi sendiri: A pass from a lower-level zone can't be used in a higher-level zone; higher-level passes work in lower zones. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Normative v0.2 detail: Level1 pass→level2 denied before debit/command; level2→level1 allowed only configured compatible category. Same seconds retained, no cash conversion/extra discount stacking. Frozen session quote; transfer re-evaluates only under approved delta quote, never retroactively reprices.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T05: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T06: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T52: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T52. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-04, HS-SCR-ADM-05, HS-SCR-ADM-20, HS-SCR-CSH-03, HS-SCR-CSH-06, HS-SCR-CUS-07
Components: HS-CMP-003, HS-CMP-006, HS-CMP-011, HS-CMP-012, HS-CMP-013, HS-CMP-023, HS-CMP-024, HS-CMP-046
Touches (design primary): 
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D26: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.
