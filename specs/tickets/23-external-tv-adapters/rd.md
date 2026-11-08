# HS-T23 — Adapter CEC/HDMI/IR untuk LG dan Samsung

Status: **draft**
Mode: **team**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-23 | HS-23 | AC-HS-23 | HS-C23 | MVP / ticket |
| FR-KPS-62 | HS-23 | AC-KPS-62 | HS-C23 | MVP / ticket |
| FR-SENET-61 | HS-23 | AC-FR-SENET-61 | HS-C23 | MVP / ticket |
| FR-SENET-71 | HS-23 | AC-FR-SENET-71 | HS-C23 | MVP / ticket |
| FR-SENET-79 | HS-23 | AC-FR-SENET-79 | HS-C23 | MVP / ticket |
| FR-SENET-80 | HS-23 | AC-FR-SENET-80 | HS-C23 | MVP / ticket |
| FR-SENET-81 | HS-23 | AC-FR-SENET-81 | HS-C23 | MVP / ticket |
| F200 | HS-23 | AC-F200 | HS-C23 | MVP / ticket |
| F201 | HS-23 | AC-F201 | HS-C23 | MVP / ticket |
| F202 | HS-23 | AC-F202 | HS-C23 | MVP / ticket |
| F203 | HS-23 | AC-F203 | HS-C23 | MVP / ticket |
| F204 | HS-23 | AC-F204 | HS-C23 | MVP / ticket |
| HS-GAP-06 | HS-23 | AC-HS-GAP-06 | HS-C23 | MVP / ticket |
| HS-GAP-07 | HS-23 | AC-HS-GAP-07 | HS-C23 | MVP / ticket |


## Behaviour
- **HS-23 / AC-HS-23** — Adapter CEC/HDMI/IR untuk LG dan Samsung. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-62 / AC-KPS-62** — Non-Android TV external-box path. Target: Record exact HDMI topology and approved box model; no blanket promise for ordinary Android STB without verified video/control path. Evidence: documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: SRC-01.
- **FR-SENET-61 / AC-FR-SENET-61** — Legacy SENET Controller box. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Uji interpretasi sendiri: HDMI hardware between console and TV, USB power, Wi-Fi hotspot setup, appears on map as Console. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:Nqu_ooblw0g@00:00; yt:aDqEQjB4zQU@00:00.
- **FR-SENET-71 / AC-FR-SENET-71** — Smart plug / HDMI-CEC / TV power control. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround. Evidence: pending verification; sumber: help:12082262464924; GP tech.enes.senettv.
- **FR-SENET-79 / AC-FR-SENET-79** — HDMI-CEC must be disabled. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:12082262464924.
- **FR-SENET-80 / AC-FR-SENET-80** — Controller box Wi-Fi provisioning. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Uji interpretasi sendiri: Legacy HDMI box: own hotspot, setup page 192.168.4.1, enter Wi-Fi + org API domain, auto-authorises on the map; 2.4 GHz only. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360011002559.
- **FR-SENET-81 / AC-FR-SENET-81** — Controller video limits. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround. Evidence: pending verification; sumber: help:360011002779.
- **F200 / AC-F200** — CEC TV power adapter. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: CEC TV power adapter diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F200; others=iCafeCloud [I2].
- **F201 / AC-F201** — IR TV power adapter. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: IR TV power adapter diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F201; others=Not verified; proposed requirement.
- **F202 / AC-F202** — HDMI switch blank-source fallback. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: HDMI switch blank-source fallback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F202; others=AlfSmartBilling [A1]; Omegasoft [O1].
- **F203 / AC-F203** — TV-only smart plug fallback. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: TV-only smart plug fallback diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F203; others=CECO [C1]; AlfSmartBilling [A1]; iCafeCloud [I2].
- **F204 / AC-F204** — Certified 4K120 HDR VRR HDMI path. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Asersi spesifik: Certified 4K120 HDR VRR HDMI path diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F204; others=Not verified; proposed requirement.
- **HS-GAP-06 / AC-HS-GAP-06** — Satu kontrak adaptor lintas Android/CEC/HDMI/IR/manual. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.
- **HS-GAP-07 / AC-HS-GAP-07** — Sertifikasi HDMI4K120/HDR/VRR/HDCP latency. Target: LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM. Evidence: own normative proposal; sumber: Own differentiation requirement; NOT a claim both competitors lack it.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
agents/venue-edge/Adapters/; hardware-lab/adapters/; apps/web/app/perangkat/adaptor/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C23. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T19: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T20: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04, D12; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C23 — Adapter CEC/HDMI/IR untuk LG dan Samsung.

## MVP external certification boundary
hardware/CERTIFICATION.md wajib. LG/Samsung support berarti exact certified external topology, bukan universal native agent. No-feedback commanded-only; owner-authorised operator attestation tidak jadi optical proof.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T19: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T20: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-03, HS-SCR-ADM-12, HS-SCR-ADP-01, HS-SCR-ADP-02
Components: HS-CMP-023, HS-CMP-026, HS-CMP-027, HS-CMP-029, HS-CMP-031, HS-CMP-032
Touches (design primary): HS-SCR-ADP-01, HS-SCR-ADP-02, HS-CMP-029
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D28: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
