# HS-T45 — Runbook operator, sandbox dan bantuan

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-45 | HS-45 | AC-HS-45 | HS-C45 | MVP / ticket |
| FR-SENET-65 | HS-45 | AC-FR-SENET-65 | HS-C45 | MVP / ticket |
| F274 | HS-45 | AC-F274 | HS-C45 | V2 / deferred |
| F280 | HS-45 | AC-F280 | HS-C45 | V2 / deferred |
| FR-KULA-147 | HS-45 | AC-FR-KULA-147 | HS-C45 | MVP / ticket |
| FR-KULA-148 | HS-45 | AC-FR-KULA-148 | HS-C45 | MVP / ticket |
| FR-KULA-149 | HS-45 | AC-FR-KULA-149 | HS-C45 | MVP / ticket |
| FR-KULA-150 | HS-45 | AC-FR-KULA-150 | HS-C45 | MVP / ticket |
| FR-KULA-151 | HS-45 | AC-FR-KULA-151 | HS-C45 | MVP / ticket |
| FR-KULA-152 | HS-45 | AC-FR-KULA-152 | HS-C45 | MVP / ticket |
| FR-KULA-153 | HS-45 | AC-FR-KULA-153 | HS-C45 | MVP / ticket |
| FR-KULA-157 | HS-45 | AC-FR-KULA-157 | HS-C45 | MVP / ticket |
| FR-KULA-161 | HS-45 | AC-FR-KULA-161 | HS-C45 | MVP / ticket |
| FR-KULA-162 | HS-45 | AC-FR-KULA-162 | HS-C45 | MVP / ticket |
| FR-KULA-164 | HS-45 | AC-FR-KULA-164 | HS-C45 | MVP / ticket |
| FR-KULA-167 | HS-45 | AC-FR-KULA-167 | HS-C45 | MVP / ticket |
| FR-KULA-249 | HS-45 | AC-FR-KULA-249 | HS-C45 | MVP / ticket |
| FR-KULA-281 | HS-45 | AC-FR-KULA-281 | HS-C45 | MVP / ticket |
| FR-KULA-326 | HS-45 | AC-FR-KULA-326 | HS-C45 | MVP / ticket |
| FR-KULA-327 | HS-45 | AC-FR-KULA-327 | HS-C45 | MVP / ticket |
| FR-KULA-385 | HS-45 | AC-FR-KULA-385 | HS-C45 | MVP / ticket |
| FR-KULA-386 | HS-45 | AC-FR-KULA-386 | HS-C45 | MVP / ticket |
| FR-KULA-463 | HS-45 | AC-FR-KULA-463 | HS-C45 | MVP / ticket |
| FR-KULA-466 | HS-45 | AC-FR-KULA-466 | HS-C45 | MVP / ticket |


## Behaviour
- **HS-45 / AC-HS-45** — Runbook operator, sandbox dan bantuan. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-SENET-65 / AC-FR-SENET-65** — Managed service. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Uji interpretasi sendiri: SENET engineers monitor, update, troubleshoot. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: pending verification; sumber: https://senet.cloud/daily-managed-service.
- **F274 / AC-F274** — Operator training sandbox. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Asersi spesifik: Operator training sandbox diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F274; others=Not verified; proposed requirement.
- **F280 / AC-F280** — Agent simulator and fault-injection harness. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Asersi spesifik: Agent simulator and fault-injection harness diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F280; others=Not verified; proposed requirement.
- **FR-KULA-147 / AC-FR-KULA-147** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-147. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-148 / AC-FR-KULA-148** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-148. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-149 / AC-FR-KULA-149** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-149. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-150 / AC-FR-KULA-150** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-150. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-151 / AC-FR-KULA-151** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-151. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-152 / AC-FR-KULA-152** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-152. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-153 / AC-FR-KULA-153** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-153. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-157 / AC-FR-KULA-157** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-157. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-161 / AC-FR-KULA-161** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-161. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-162 / AC-FR-KULA-162** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-162. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-164 / AC-FR-KULA-164** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-164. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-167 / AC-FR-KULA-167** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-167. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-restoran.
- **FR-KULA-249 / AC-FR-KULA-249** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-249. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Target rincian sendiri: Runbook bantuan dan contact support dapat dikonfigurasi; tidak menjanjikan support24/7 tanpa komitmen owner. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/ (rendered).
- **FR-KULA-281 / AC-FR-KULA-281** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-281. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-326 / AC-FR-KULA-326** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-326. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-327 / AC-FR-KULA-327** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-327. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-385 / AC-FR-KULA-385** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-385. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-386 / AC-FR-KULA-386** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-386. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-463 / AC-FR-KULA-463** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-463. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-466 / AC-FR-KULA-466** — Runbook operator, sandbox dan bantuan — referensi FR-KULA-466. Target: Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
docs/operator/; apps/web/app/bantuan/panduan/; tools/simulator/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C45. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T01: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T03: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T19: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: Tidak ada kebijakan uang/keamanan/data spesifik yang baru; tetap perlu human ready.; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 145 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

## Exclusion audit references
FR-KULA-024, FR-KULA-025, FR-KULA-026, FR-KULA-027, FR-KULA-028, FR-KULA-029, FR-KULA-030, FR-KULA-056, FR-KULA-057, FR-KULA-058, FR-KULA-059, FR-KULA-060, FR-KULA-061, FR-KULA-062, FR-KULA-066, FR-KULA-067, FR-KULA-068, FR-KULA-069, FR-KULA-079, FR-KULA-080, FR-KULA-082, FR-KULA-083, FR-KULA-084, FR-KULA-085, FR-KULA-086, FR-KULA-087, FR-KULA-088, FR-KULA-089, FR-KULA-090, FR-KULA-091, FR-KULA-092, FR-KULA-095, FR-KULA-096, FR-KULA-097, FR-KULA-098, FR-KULA-100, FR-KULA-101, FR-KULA-102, FR-KULA-103, FR-KULA-104, FR-KULA-106, FR-KULA-107, FR-KULA-108, FR-KULA-109, FR-KULA-110, FR-KULA-111, FR-KULA-112, FR-KULA-113, FR-KULA-116, FR-KULA-117, FR-KULA-118, FR-KULA-119, FR-KULA-120, FR-KULA-121, FR-KULA-122, FR-KULA-123, FR-KULA-124, FR-KULA-125, FR-KULA-126, FR-KULA-127, FR-KULA-128, FR-KULA-129, FR-KULA-130, FR-KULA-131, FR-KULA-132, FR-KULA-133, FR-KULA-134, FR-KULA-135, FR-KULA-136, FR-KULA-137, FR-KULA-139, FR-KULA-141, FR-KULA-142, FR-KULA-143, FR-KULA-144, FR-KULA-145, FR-KULA-160, FR-KULA-163, FR-KULA-165, FR-KULA-169, FR-KULA-170, FR-KULA-171, FR-KULA-172, FR-KULA-173, FR-KULA-174, FR-KULA-175, FR-KULA-177, FR-KULA-178, FR-KULA-179, FR-KULA-180, FR-KULA-181, FR-KULA-182, FR-KULA-184, FR-KULA-185, FR-KULA-270, FR-KULA-271, FR-KULA-272, FR-KULA-274, FR-KULA-275, FR-KULA-279, FR-KULA-289, FR-KULA-309, FR-KULA-313, FR-KULA-314, FR-KULA-317, FR-KULA-319, FR-KULA-320, FR-KULA-321, FR-KULA-340, FR-KULA-341, FR-KULA-342, FR-KULA-344, FR-KULA-345, FR-KULA-346, FR-KULA-347, FR-KULA-348, FR-KULA-349, FR-KULA-353, FR-KULA-354, FR-KULA-357, FR-KULA-358, FR-KULA-359, FR-KULA-371, FR-KULA-395, FR-KULA-396, FR-KULA-402, FR-KULA-404, FR-KULA-405, FR-KULA-414, FR-KULA-418, FR-KULA-425, FR-KULA-430, FR-KULA-436, FR-KULA-459, FR-KULA-460, FR-KULA-461, FR-KULA-473, FR-KULA-481, FR-KULA-482, FR-KULA-483, FR-KULA-493, FR-KULA-496, FR-KULA-497, FR-KULA-513, FR-KULA-520
These are exclusion records only, never implementation mandates.

Design alias owned: HS-C45 — Runbook operator, sandbox dan bantuan.

## v0.2 own requirement crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-V02-14 | HS-45 | AC-HS-V02-14 | HS-C45 | MVP / ticket |
- HS-V02-14 / AC-HS-V02-14: INPUT-STATUS derived from Senet videos/INDEX.md snapshot:70 unique=53videos+17webinars;17transcripts,4no-captions,49rate-limit retries. Preserve first71FR-SENET IDs and72..129. No claim watched/verified when only metadata available.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T01: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T03: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T19: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-02, HS-SCR-ADM-03, HS-SCR-ADM-04, HS-SCR-ADM-06, HS-SCR-ADM-08, HS-SCR-ADM-16, HS-SCR-ADM-17, HS-SCR-CSH-01, HS-SCR-CSH-05, HS-SCR-CSH-07, HS-SCR-CUS-02, HS-SCR-CUS-04, HS-SCR-KDS-01, HS-SCR-KDS-02
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-007, HS-CMP-008, HS-CMP-009, HS-CMP-010, HS-CMP-014, HS-CMP-016, HS-CMP-019, HS-CMP-021, HS-CMP-023, HS-CMP-024, HS-CMP-026, HS-CMP-031, HS-CMP-058
Touches (design primary): HS-SCR-KDS-01, HS-SCR-KDS-02
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
