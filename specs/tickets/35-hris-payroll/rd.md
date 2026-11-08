# HS-T35 — Staf, kehadiran dan payroll ekspor

Status: **draft**
Mode: **solo**
Phase: V1

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-35 | HS-35 | AC-HS-35 | HS-C35 | V1 / ticket |
| F164 | HS-35 | AC-F164 | HS-C35 | V1 / ticket |
| F165 | HS-35 | AC-F165 | HS-C35 | V1 / ticket |
| F166 | HS-35 | AC-F166 | HS-C35 | V1 / ticket |
| FR-KULA-022 | HS-35 | AC-FR-KULA-022 | HS-C35 | V1 / ticket |
| FR-KULA-023 | HS-35 | AC-FR-KULA-023 | HS-C35 | V1 / ticket |
| FR-KULA-037 | HS-35 | AC-FR-KULA-037 | HS-C35 | V1 / ticket |
| FR-KULA-040 | HS-35 | AC-FR-KULA-040 | HS-C35 | V1 / ticket |
| FR-KULA-070 | HS-35 | AC-FR-KULA-070 | HS-C35 | V1 / ticket |
| FR-KULA-071 | HS-35 | AC-FR-KULA-071 | HS-C35 | V1 / ticket |
| FR-KULA-072 | HS-35 | AC-FR-KULA-072 | HS-C35 | V1 / ticket |
| FR-KULA-073 | HS-35 | AC-FR-KULA-073 | HS-C35 | V1 / ticket |
| FR-KULA-074 | HS-35 | AC-FR-KULA-074 | HS-C35 | V1 / ticket |
| FR-KULA-075 | HS-35 | AC-FR-KULA-075 | HS-C35 | V1 / ticket |
| FR-KULA-076 | HS-35 | AC-FR-KULA-076 | HS-C35 | V1 / ticket |
| FR-KULA-077 | HS-35 | AC-FR-KULA-077 | HS-C35 | V1 / ticket |
| FR-KULA-078 | HS-35 | AC-FR-KULA-078 | HS-C35 | V1 / ticket |
| FR-KULA-155 | HS-35 | AC-FR-KULA-155 | HS-C35 | V1 / ticket |
| FR-KULA-229 | HS-35 | AC-FR-KULA-229 | HS-C35 | V1 / ticket |
| FR-KULA-298 | HS-35 | AC-FR-KULA-298 | HS-C35 | V1 / ticket |
| FR-KULA-299 | HS-35 | AC-FR-KULA-299 | HS-C35 | V1 / ticket |
| FR-KULA-300 | HS-35 | AC-FR-KULA-300 | HS-C35 | V1 / ticket |
| FR-KULA-301 | HS-35 | AC-FR-KULA-301 | HS-C35 | V1 / ticket |
| FR-KULA-302 | HS-35 | AC-FR-KULA-302 | HS-C35 | V1 / ticket |
| FR-KULA-303 | HS-35 | AC-FR-KULA-303 | HS-C35 | V1 / ticket |
| FR-KULA-304 | HS-35 | AC-FR-KULA-304 | HS-C35 | V1 / ticket |
| FR-KULA-305 | HS-35 | AC-FR-KULA-305 | HS-C35 | V1 / ticket |
| FR-KULA-306 | HS-35 | AC-FR-KULA-306 | HS-C35 | V1 / ticket |
| FR-KULA-391 | HS-35 | AC-FR-KULA-391 | HS-C35 | V1 / ticket |
| FR-KULA-424 | HS-35 | AC-FR-KULA-424 | HS-C35 | V1 / ticket |
| FR-KULA-431 | HS-35 | AC-FR-KULA-431 | HS-C35 | V1 / ticket |
| FR-KULA-440 | HS-35 | AC-FR-KULA-440 | HS-C35 | V1 / ticket |
| FR-KULA-451 | HS-35 | AC-FR-KULA-451 | HS-C35 | V1 / ticket |
| FR-KULA-452 | HS-35 | AC-FR-KULA-452 | HS-C35 | V1 / ticket |
| FR-KULA-453 | HS-35 | AC-FR-KULA-453 | HS-C35 | V1 / ticket |
| FR-KULA-476 | HS-35 | AC-FR-KULA-476 | HS-C35 | V1 / ticket |
| FR-KULA-477 | HS-35 | AC-FR-KULA-477 | HS-C35 | V1 / ticket |
| FR-KULA-507 | HS-35 | AC-FR-KULA-507 | HS-C35 | V1 / ticket |


## Behaviour
- **HS-35 / AC-HS-35** — Staf, kehadiran dan payroll ekspor. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: own normative proposal; sumber: Master PRD own design.
- **F164 / AC-F164** — Clock-in attendance. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Asersi spesifik: Clock-in attendance diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F164; others=Revres Play [R1].
- **F165 / AC-F165** — Geofenced attendance optional. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Asersi spesifik: Geofenced attendance optional diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F165; others=Revres Play [R1].
- **F166 / AC-F166** — Payroll export. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Asersi spesifik: Payroll export diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device. Evidence: Vendor claim only; sumber: Market matrix F166; others=Revres Play [R1].
- **FR-KULA-022 / AC-FR-KULA-022** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-022. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Target dan hasil aktual periode sama ditampilkan dengan formula pencapaian. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-023 / AC-FR-KULA-023** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-023. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Atribusi penjualan per staf tidak membocorkan profil payroll ke kasir lain. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-037 / AC-FR-KULA-037** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-037. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Target staf mempunyai periode/metric/version dan tidak otomatis mengubah gaji. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-040 / AC-FR-KULA-040** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-040. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Konfigurasi metric staf berversi, perubahan tidak menulis ulang payroll yang sudah difinalisasi. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-070 / AC-FR-KULA-070** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-070. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Staf berizin clock-in/out manual dan koreksi memerlukan alasan serta audit. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-071 / AC-FR-KULA-071** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-071. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Rekap kehadiran menyebut jadwal, aktual dan koreksi terpisah. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-072 / AC-FR-KULA-072** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-072. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Data pekerjaan staf tidak terbaca kitchen/customer/technician. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-073 / AC-FR-KULA-073** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-073. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Lokasi/selfie hadir opsional dan disabled sampai consent/retention approved; mode manual tetap tersedia. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-074 / AC-FR-KULA-074** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-074. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Jadwal shift dan toleransi terlambat berversi, tanpa mematikan sesi pelanggan saat pergantian. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-075 / AC-FR-KULA-075** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-075. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Kasbon staf tercatat terpisah dari piutang pelanggan dan pelunasan dapat ditelusuri. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-076 / AC-FR-KULA-076** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-076. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Permintaan cuti/lembur mempunyai approval dan tidak otomatis mengirim transfer bank. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-077 / AC-FR-KULA-077** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-077. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Slip gaji draft merinci komponen/potongan dan formula versi, tidak membayar gaji. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-078 / AC-FR-KULA-078** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-078. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Bagi hasil memakai formula disetujui dan preview, tidak mengambil uang otomatis. Evidence: pending verification; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (KM list).
- **FR-KULA-155 / AC-FR-KULA-155** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-155. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/industry/kasir-rental.
- **FR-KULA-229 / AC-FR-KULA-229** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-229. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Target rincian sendiri: Attendance manual tersedia; kamera/GPS opt-in hanya setelah policy approved dan denied permission tidak memaksa pengawasan. Evidence: public authored summary; not runtime verified; sumber: https://kulapos.id/tutorial (in-app tutorial `hris-clockin-attendance`, public bundle).
- **FR-KULA-298 / AC-FR-KULA-298** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-298. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-299 / AC-FR-KULA-299** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-299. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-300 / AC-FR-KULA-300** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-300. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-301 / AC-FR-KULA-301** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-301. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-302 / AC-FR-KULA-302** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-302. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-303 / AC-FR-KULA-303** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-303. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-304 / AC-FR-KULA-304** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-304. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-305 / AC-FR-KULA-305** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-305. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-306 / AC-FR-KULA-306** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-306. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-391 / AC-FR-KULA-391** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-391. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-424 / AC-FR-KULA-424** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-424. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-431 / AC-FR-KULA-431** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-431. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-440 / AC-FR-KULA-440** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-440. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-451 / AC-FR-KULA-451** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-451. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-452 / AC-FR-KULA-452** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-452. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-453 / AC-FR-KULA-453** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-453. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-476 / AC-FR-KULA-476** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-476. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-477 / AC-FR-KULA-477** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-477. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).
- **FR-KULA-507 / AC-FR-KULA-507** — Staf, kehadiran dan payroll ekspor — referensi FR-KULA-507. Target: Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak. Evidence: pending verification; route name only; own interpreted requirement, not vendor behaviour proof; sumber: https://kulapos.id/assets/index-kX8vYQTH.js (router).

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
services/api/src/hris/; apps/web/app/staf/; services/worker/src/payroll/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C35. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- HS-T02: kontrak dan hasil merge harus diterima sebelum dispatch.
- HS-T17: kontrak dan hasil merge harus diterima sebelum dispatch.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: D16, D22; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C35 — Staf, kehadiran dan payroll ekspor.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)
- HS-T02: done prerequisite; consumes accepted artifact, no duplicate service implementation.
- HS-T17: done prerequisite; consumes accepted artifact, no duplicate service implementation.

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: HS-SCR-ADM-04, HS-SCR-ADM-09
Components: HS-CMP-023, HS-CMP-024
Touches (design primary): HS-SCR-ADM-09
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.
