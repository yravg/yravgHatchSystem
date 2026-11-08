# HS-T19 — Pairing aman dan capability probe

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-19 | HS-19 | AC-HS-19 | HS-C19 | MVP / ticket |
| FR-KPS-38 | HS-19 | AC-KPS-38 | HS-C19 | MVP / ticket |
| FR-KPS-39 | HS-19 | AC-KPS-39 | HS-C19 | MVP / ticket |
| FR-KPS-65 | HS-19 | AC-KPS-65 | HS-C19 | MVP / ticket |
| FR-SENET-73 | HS-19 | AC-FR-SENET-73 | HS-C19 | MVP / ticket |
| F014 | HS-19 | AC-F014 | HS-C19 | MVP / ticket |
| F184 | HS-19 | AC-F184 | HS-C19 | MVP / ticket |
| F185 | HS-19 | AC-F185 | HS-C19 | MVP / ticket |
| F186 | HS-19 | AC-F186 | HS-C19 | MVP / ticket |
| F189 | HS-19 | AC-F189 | HS-C19 | MVP / ticket |
| F191 | HS-19 | AC-F191 | HS-C19 | MVP / ticket |
| FR-KULA-210 | HS-19 | AC-FR-KULA-210 | HS-C19 | MVP / ticket |


## Behaviour
- **HS-19 / AC-HS-19** — Pairing aman dan capability probe. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-38 / AC-KPS-38** — PIN pairing binds agent to station; displayed PIN expires after 10 minutes and can refresh. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Kode vendor4digit/10menit hanya observasi; spesifikasi sendiri8digit/5menit. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 02:46–03:28; SRC-12; BUNDLE1 rental-android-tv-agent tutorial.
- **FR-KPS-39 / AC-KPS-39** — HDMI port configuration, explicit test-lock/test-unlock, and ready status. Target: Select target HDMI port; ready card stores port and failed capability check cannot be shown as ready. Evidence: transcript; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: V1 03:30–03:55; BUNDLE1 rental-android-tv-agent tutorial.
- **FR-KPS-65 / AC-KPS-65** — Capability-aware station errors and unsupported hardware states. Target: Agent without overlay/input capability shows setup-required, not connected-ready; UI offers safe manual billing only if approved. Evidence: proposed; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: DESIGN-01.
- **FR-SENET-73 / AC-FR-SENET-73** — TV app activation by install code. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Uji interpretasi sendiri: TV app shows a code; staff enter it in Map → Configuration → Settings → Activate; device becomes type Console in the default console zone. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:7547084790172.
- **F014 / AC-F014** — Agent capability and firmware inventory. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Agent capability and firmware inventory diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F014; others=Not verified; proposed requirement.
- **F184 / AC-F184** — Android TV pairing code. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Android TV pairing code diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F184; others=iCafeCloud [I2].
- **F185 / AC-F185** — Pairing approval and short code expiry. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Pairing approval and short code expiry diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F185; others=Not verified; proposed requirement.
- **F186 / AC-F186** — Signed device identity and revocation. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Signed device identity and revocation diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Recommended requirement; vendor support unverified; sumber: Market matrix F186; others=Not verified; proposed requirement.
- **F189 / AC-F189** — HDMI input switching capability probe. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: HDMI input switching capability probe diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F189; others=Not verified; proposed requirement.
- **F191 / AC-F191** — Overlay permission setup diagnostics. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Asersi spesifik: Overlay permission setup diagnostics diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F191; others=iCafeCloud [I2].
- **FR-KULA-210 / AC-FR-KULA-210** — Pairing aman dan capability probe — referensi FR-KULA-210. Target: Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap. Target rincian sendiri: Pairing lewat challenge sekali pakai dan staff approval; own8digit/5minute fixture, permission probe wajib, bukan konstanta vendor. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `rental-android-tv-agent`, public bundle).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/devices/; agents/android-tv/app/src/main/java/id/yravg/hatch/setup/; apps/web/app/perangkat/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C19. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T03: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04, D09; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
DEVICE_UNSUPPORTED, DEVICE_PERMISSION_REQUIRED, PAIRING_EXPIRED

Design alias owned: HS-C19 — Pairing aman dan capability probe.

Design alias owned: KPS-C10 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T03: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T50: done prerequisite; consumes accepted artifact, no duplicate service implementation.
Backend implementation extracted to HS-T50. This ticket owns end-to-end UI/integration acceptance and regression only; shared API changes through backend owner review.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-02, HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-ADM-12, HS-SCR-CSH-01, HS-SCR-TVA-01, HS-SCR-TVA-02
Components: HS-CMP-001, HS-CMP-002, HS-CMP-003, HS-CMP-019, HS-CMP-023, HS-CMP-026, HS-CMP-027, HS-CMP-030, HS-CMP-031, HS-CMP-056, HS-CMP-058
Touches (design primary): HS-SCR-ADM-03, HS-SCR-ADM-11, HS-SCR-TVA-01, HS-SCR-TVA-02, HS-CMP-030, HS-CMP-031
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D27: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

Decision blocker D28: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

## CEC/offline/provisioning integration v0.2
Setup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.
