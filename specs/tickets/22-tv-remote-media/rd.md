# HS-T22 — Remote TV aman, timer dan media sendiri

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-22 | HS-22 | AC-HS-22 | HS-C22 | V1 / ticket |
| FR-KPS-45 | HS-22 | AC-KPS-45 | HS-C22 | V1 / ticket |
| FR-KPS-46 | HS-22 | AC-KPS-46 | HS-C22 | V1 / ticket |
| FR-KPS-47 | HS-22 | AC-KPS-47 | HS-C22 | V1 / ticket |
| FR-KPS-48 | HS-22 | AC-KPS-48 | HS-C22 | V1 / ticket |
| FR-KPS-49 | HS-22 | AC-KPS-49 | HS-C22 | V1 / ticket |
| FR-SENET-07 | HS-22 | AC-FR-SENET-07 | HS-C22 | V1 / ticket |
| FR-SENET-75 | HS-22 | AC-FR-SENET-75 | HS-C22 | V1 / ticket |
| FR-SENET-76 | HS-22 | AC-FR-SENET-76 | HS-C22 | V1 / ticket |
| F199 | HS-22 | AC-F199 | HS-C22 | V1 / ticket |
| FR-KULA-213 | HS-22 | AC-FR-KULA-213 | HS-C22 | V1 / ticket |


## Behaviour
- **HS-22 / AC-HS-22** — Remote TV aman, timer dan media sendiri. Target: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Evidence: own normative proposal; sumber: Master PRD own design.
- **FR-KPS-45 / AC-KPS-45** — On-TV time warnings and operator messages. Target: At approved warning threshold show once; operator message is escaped and cannot execute markup. Evidence: static+documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-24.
- **FR-KPS-46 / AC-KPS-46** — Remote volume up/down/mute. Target: Send volume command to selected unit; action is acknowledged or explicit unsupported error is returned. Evidence: static+documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-07.
- **FR-KPS-47 / AC-KPS-47** — Idle eco sleep / wake / power controls. Target: Sleep idle unit, then wake; active-session sleep is refused; distinguish blackout overlay from actual hardware standby. Evidence: static+documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-07.
- **FR-KPS-48 / AC-KPS-48** — Remote agent restart and manual/temporary HDMI, Home/navigation controls. Target: Authorised restart/manual input action logs actor and result; never permanently discards live session lease. Evidence: static+documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-07.
- **FR-KPS-49 / AC-KPS-49** — Owner-provided standby backgrounds and store identity. Target: Upload own permitted image via shared media flow; disconnected agent keeps cached safe background, not vendor art. Evidence: static+documented; public behaviour only, no binary implementation reference; sumber: KPS authored inventory: APK1; SRC-01.
- **FR-SENET-07 / AC-FR-SENET-07** — Remote device commands. Target: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Uji interpretasi sendiri: From map: start/end session, logout, lock/unlock, sell pass, power on/off, remote connect; multi-select. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: yt:26EXyqvEFLw@03:33.
- **FR-SENET-75 / AC-FR-SENET-75** — Staff notifications/warnings to console TV. Target: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Uji interpretasi sendiri: Send messages to a console screen from the map. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:360010865560.
- **FR-SENET-76 / AC-FR-SENET-76** — Smart TV login-screen image. Target: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Uji interpretasi sendiri: Custom image (≤10 MB) for the TV app login screen, set in Sign-in experience. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor. Evidence: authored public docs/transcript claim; not runtime verified; sumber: help:26052144991516.
- **F199 / AC-F199** — TV volume and mute control. Target: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Asersi spesifik: TV volume and mute control diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F199; others=CECO [C1].
- **FR-KULA-213 / AC-FR-KULA-213** — Remote TV aman, timer dan media sendiri — referensi FR-KULA-213. Target: Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman. Target rincian sendiri: Aksi remote input/volume/mute memeriksa capability, actor dan session safety; response unsupported bukan fake success. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `rental-virtual-remote`, public bundle).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
agents/android-tv/app/src/main/java/id/yravg/hatch/remote/; services/api/src/device-commands/; apps/web/app/perangkat/remote/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C22. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T21: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D04, D09; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C22 — Remote TV aman, timer dan media sendiri.

Design alias owned: KPS-C12 — Legacy proposed component alias; no extra visual specification.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T21: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-13, HS-SCR-ADM-19, HS-SCR-CSH-03, HS-SCR-PCA-04, HS-SCR-TVA-03, HS-SCR-TVA-05, HS-SCR-TVA-09
Components: HS-CMP-003, HS-CMP-006, HS-CMP-023, HS-CMP-032, HS-CMP-034, HS-CMP-038, HS-CMP-043
Touches (design primary): HS-SCR-TVA-05, HS-SCR-TVA-09, HS-CMP-034, HS-CMP-038
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
