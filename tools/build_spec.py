from pathlib import Path
import csv,json,re,hashlib,datetime,collections
ROOT=Path('/workspace/documentation/hatchsystem'); GRAB=Path('/workspace/grab')
def table(headers,rows):
 def clean(x):return str(x).replace('|','/').replace('\n',' ')
 return '| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |\n'+'\n'.join('| '+' | '.join(clean(x) for x in row)+' |' for row in rows)+'\n'
def mdrows(path,prefix):
 rows=[]
 for line in path.read_text().splitlines():
  if line.startswith('| '+prefix): rows.append([s.strip() for s in line.strip().strip('|').split('|')])
 return rows
# ID; slug; Indonesian outcome; phase; dependencies; mode; decisions; allowed paths; operational acceptance fixture
DATA=[
(1,'foundation','Fondasi monorepo dan kontrak domain','MVP',[], 'solo',[], 'package.json; pnpm-workspace.yaml; packages/contracts/; packages/domain/; tests/contracts/; .github/workflows/', 'Clone bersih: install terkunci, lint, typecheck, unit test dan validasi spesifikasi lulus. Generator skema menghasilkan payload identik untuk TypeScript, Kotlin dan .NET; tidak ada rahasia pada fixture.'),
(2,'identity-tenancy','Identitas, tenant dan otorisasi per outlet','MVP',[1],'solo',['D02','D16'], 'services/api/src/identity/; services/api/src/tenancy/; apps/web/app/akses/; packages/domain/auth/', 'Kasir outlet A menerima 403 saat meminta laporan owner atau resource tenant B, termasuk ID yang ditebak. Teknisi hanya melihat perangkat; kitchen hanya order; perangkat tidak dapat membuat pembayaran.'),
(3,'stations-catalog','Katalog stasiun, aset, zona dan denah','MVP',[2],'solo',['D04'], 'services/api/src/stations/; apps/web/app/stasiun/; packages/domain/station/', 'Satu meja memiliki PS4 dan PS5, satu pilihan konsol per sesi; denah menampilkan tersedia, dipesan, mulai, aktif, jeda, selesai, dibersihkan dan perawatan. Filter jenis/game bekerja; readiness berasal dari capability probe, bukan pembelian plan.'),
(4,'rates-quotes','Tarif versi, paket dan kutipan biaya','MVP',[3],'solo',['D01','D03'], 'services/api/src/rates/; apps/web/app/tarif/; packages/domain/pricing/', 'Fixture sandbox Rp12.000/jam, sesi open 90 menit menghasilkan Rp18.000 tanpa biaya tambahan. Promo malam lintas tengah malam memakai zona outlet. Quote kedaluwarsa ditolak QUOTE_STALE; versi harga aktif tidak mengubah sesi lama.'),
(5,'session-lifecycle','Sesi fixed/open, jeda, pindah dan berhenti','MVP',[3,4,20],'team',['D01','D06','D07'], 'services/api/src/sessions/; apps/web/app/kasir/; packages/domain/session/; tests/session/', 'Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih.'),
(6,'cash-sales-ledger','POS, kas dan buku pembayaran append-only','MVP',[2,4],'solo',['D01','D06','D15'], 'services/api/src/sales/; services/api/src/ledger/; apps/web/app/pembayaran/; packages/domain/money/', 'Rp50.000 kas dan Rp25.000 pembayaran terverifikasi melunasi tagihan Rp75.000. Hanya tender tunai boleh menghasilkan kembalian. Retur memakai reversal baru, tidak UPDATE saldo historis; request diulang tidak menggandakan jurnal atau stok.'),
(7,'midtrans-qris','QRIS Midtrans sandbox dan rekonsiliasi','MVP',[6],'solo',['D06','D15'], 'services/api/src/payments/; services/worker/src/payments/; apps/web/app/pembayaran/qris/', 'Signature salah tidak mengubah saldo. Callback sah dideduplikasi dan status dikonfirmasi melalui sandbox provider adapter. Pending/expire/fraud-deny tidak membuka stasiun. Settlement terlambat tidak menduduki unit yang sudah dialokasikan; buat refund-pending terpantau.'),
(8,'receipts-printing','Struk, cetak ulang dan jembatan printer','MVP',[6,20],'solo',[], 'services/api/src/receipts/; apps/web/app/struk/; agents/venue-edge/Printing/; tests/printing/', 'PDF dan ESC/POS 58/80 mm memuat item, alokasi bayar dan sisa; putus printer masuk antrean cetak. Cetak ulang 3 kali tetap satu transaksi. Bluetooth/USB/LAN ditawarkan hanya lewat bridge/perangkat yang tersertifikasi, bukan klaim browser universal.'),
(9,'wallets-bonuses','Dompet IDR, bonus dan batas belanja offline','V1',[6,7,20],'solo',['D03','D07','D15'], 'services/api/src/wallets/; packages/domain/wallet/; apps/web/app/dompet/', 'Saldo utama Rp50.000 dan bonus Rp5.000 tersimpan terpisah. Dua redeem Rp40.000 serentak hanya satu berhasil. Tidak ada transfer antarmember default; refund dan top-up koreksi berotorisasi. Offline allowance default nol; tidak ada double-spend lintas cabang.'),
(10,'saved-time','Tabungan waktu, penebusan dan kedaluwarsa','V1',[5,6],'solo',['D03'], 'services/api/src/time-credits/; packages/domain/time-credit/; apps/web/app/member/waktu/', 'Paket lunas 120 menit berhenti setelah 45 memberi 75 menit sekali; redeem30 menyisakan45. Bucket belum lunas/kedaluwarsa/kategori salah ditolak. Refund tidak boleh menyisakan sekaligus uang dan hak waktu untuk pembayaran yang sama.'),
(11,'members-loyalty','Member, reward, tingkat dan voucher','V1',[6,9,10],'solo',['D03','D10','D16'], 'services/api/src/members/; services/api/src/loyalty/; apps/web/app/member/', 'Identitas member dicari tanpa URL nomor telepon. Transaksi lunas memberi poin sekali; reversal membalik poin. Reward barang/waktu terpisah dari uang bonus; diskon personal versus grup memakai maksimum, bukan stacking, pada fixture. Expiry dan rasio tetap config yang harus disetujui.'),
(12,'bookings','Reservasi, deposit, buffer dan no-show','V1',[3,4,6],'solo',['D10'], 'services/api/src/bookings/; apps/web/app/reservasi/; apps/web/app/pesan/', 'Dua checkout slot sama menghasilkan satu konfirmasi. Interval half-open dengan buffer, hold5menit, check-in window10menit adalah fixture; walk-in menolak overlap reservasi sah. Booking terlarang tidak memblokir walk-in; deposit adalah liability sampai diterapkan/dikembalikan.'),
(13,'customer-self-service','Portal pelanggan dan akses QR/receipt','V1',[5,7,9,12],'solo',['D10','D16'], 'services/api/src/customer-access/; apps/web/app/pelanggan/; apps/web/app/unit/', 'Guest memilih durasi, mendapat quote, membayar QRIS sandbox, lalu akses hanya setelah settlement dan applied ACK. Token QR sekali pakai kedaluwarsa, terikat station/booking/tenant. Bulk start memberi hasil per unit; tidak mengulang pembayaran untuk unit yang gagal.'),
(14,'food-kitchen','Pesanan F&B, tagihan gabungan dan KDS','MVP',[5,6,15],'team',[], 'services/api/src/orders/; apps/web/app/menu/; apps/web/app/dapur/; packages/domain/order/', 'Dua minuman ditambahkan saat bermain tanpa reset timer; satu struk dengan sewa. Pesanan QR satu kali meski retry. Kitchen mengubah baru→diterima→diproses→siap→diantar; pembatalan/stock-out terlihat dan mengembalikan reservasi stok sekali.'),
(15,'inventory-recipes','Produk, stok, resep dan costing','MVP',[6],'solo',['D17'], 'services/api/src/inventory/; apps/web/app/stok/; packages/domain/inventory/', 'Jual2 minuman resep 100ml susu mengurangi200ml sekali. Retur layak stok membuat reversal; bahan terbuang memakai write-off. Opname menghitung event penjualan yang terjadi saat hitung fisik, tidak menimpa stok secara buta. Costing moving-average fixture; FIFO V1 dengan migrasi versi.'),
(16,'procurement-transfers','Supplier, PO, penerimaan dan mutasi gudang','V1',[15,33],'solo',['D17'], 'services/api/src/procurement/; apps/web/app/pengadaan/', 'PO2 karton isi24 diterima48 pcs, invoice supplier liability48 unit harga yang disetujui. Terima parsial tidak menutup sisa. Mutasi10 mengurangi sumber dan mencatat in-transit; tujuan menambah sekali saat receive, bukan saat kirim.'),
(17,'shifts-cash','Shift kasir dan serah terima sesi aktif','MVP',[6,8],'solo',['D08'], 'services/api/src/shifts/; apps/web/app/shift/', 'Float100k + kas200k - pengeluaran20k = drawer280k; pembayaran nonkas50k tidak menambah drawer. Tutup tidak menghentikan sesi aktif; handover actor dicatat. X laporan interim, close snapshot immutable; selisih0 maupun nonzero dapat dijelaskan jujur.'),
(18,'reports-finance','Laporan owner, utilisasi dan liability','V1',[17,15],'solo',['D08','D17'], 'services/api/src/reports/; apps/web/app/laporan/; services/worker/src/exports/', 'Unit dipakai2jam dari jam tersedia10jam =20%; jam maintenance dipisahkan dan denominator ditampilkan. Revenue, deposit/wallet liability, bonus dan F&B tidak dicampur. Filter cabang/periode/shift, CSV/XLSX/PDF mengikat snapshot dan hak akses.'),
(19,'pairing-capabilities','Pairing aman dan capability probe','MVP',[2,3],'solo',['D04','D09'], 'services/api/src/devices/; agents/android-tv/app/src/main/java/id/yravg/hatch/setup/; apps/web/app/perangkat/', 'Kode pairing acak8digit berlaku5menit, maksimum5 percobaan/menit/perangkat; approve staff mengikat station. Reuse ditolak, revocation menghapus otoritas. Input test gagal/izin overlay ditolak menampilkan perlu penyiapan, bukan siap.'),
(20,'venue-edge-leases','Venue edge, lease offline dan otoritas tunggal','MVP',[1,2,19],'team',['D06','D07','D09'], 'agents/venue-edge/; services/api/src/edge/; packages/contracts/leases/; tests/faults/edge/', 'SQLite WAL menyimpan event sebelum ACK. Lease bertanda tangan mengikat tenant/outlet/station/session/revision dan batas waktu. Hilang WAN sesi aktif tetap sampai deadline; reboot tanpa bukti waktu terpercaya fail-closed picture dan tampil recovery. Fencing epoch mencegah dua edge menguasai unit. Start/extension offline memakai authorisation yang eksplisit; default ditolak.'),
(21,'android-tv-agent','Agent Kotlin Android/Google TV dan expiry','MVP',[19,20],'team',['D04','D06','D09'], 'agents/android-tv/; tests/hardware/android-tv/', 'Standby, mulai, aktif, jeda dan selesai berbeda; input dipilih melalui API publik yang didukung. APPLIED mengindikasikan input teramati jika API tersedia, bukan bukti optik; tingkat verifikasi dicatat. Expiry selalu mengunci gambar, bukan daya konsol. Ukur Home-return pada model tersertifikasi, tandai tidak didukung jika gagal, tanpa akses tersembunyi.'),
(22,'tv-remote-media','Remote TV aman, timer dan media sendiri','V1',[21],'solo',['D04','D09'], 'agents/android-tv/app/src/main/java/id/yravg/hatch/remote/; services/api/src/device-commands/; apps/web/app/perangkat/remote/', 'Volume/mute dapat ACK atau unsupported. Sleep hanya idle; blackout tidak disebut electrical standby. Restart/manual input perlu teknisi berotorisasi dan alasan; tidak menghapus lease. Pesan di-escape, media own-brand dibatasi ukuran/tipe dan cache aman.'),
(23,'external-tv-adapters','Adapter CEC/HDMI/IR untuk LG dan Samsung','MVP',[19,20],'team',['D04','D12'], 'agents/venue-edge/Adapters/; hardware-lab/adapters/; apps/web/app/perangkat/adaptor/', 'LG dan Samsung menggunakan jalur eksternal yang tersertifikasi per firmware/topologi; HDMI switch blank-source tidak memutus konsol. CEC/IR tanpa state feedback diberi level commanded-only, bukan applied-verified. Uji4K120/HDR/VRR/HDCP; fallback manual jelas, tanpa stripping DRM.'),
(24,'fleet-updates','Kesehatan fleet, update bertanda tangan dan rollback','V1',[20,21],'solo',['D12'], 'services/api/src/fleet/; services/worker/src/releases/; agents/venue-edge/Updates/; agents/android-tv/app/src/main/java/id/yravg/hatch/update/', 'Manifest/payload signature salah ditolak UPDATE_REJECTED. Canary idle-only1% fixture; active session tidak dipaksa upgrade. Healthcheck gagal mengembalikan versi sebelumnya dengan audit. Poll fallback30detik fixture hanya saat socket terputus tetapi WAN ada; tidak dianggap offline remote control.'),
(25,'chat-notifications','Chat operator, alarm dan notifikasi berizin','V1',[5,14],'solo',['D10','D16'], 'services/api/src/messages/; services/worker/src/notifications/; apps/web/app/bantuan/', 'Pelanggan unitA tidak dapat membaca chatB. Pesan pending terlihat lalu retry sekali dengan idempotency. Browser audio ditolak memberi indikator visual dan tombol test. Push/WA/Telegram hanya sandbox sink atau manual draft sampai owner mengaktifkan connector, penerima dan consent.'),
(26,'public-displays','Billboard, customer display dan privasi','V1',[5,14],'solo',['D10','D16'], 'apps/web/app/layar/; services/api/src/display-projections/', 'Perubahan start/pause/stop tampak pada lobby sesuai revision. Tampilkan alias opt-in saja; nomorHP, saldo, biaya pribadi dan nama lengkap diredaksi. Token signage read-only dapat dicabut; customer checkout display menampilkan bill terikat kasir tanpa auth staff.'),
(27,'windows-seat','Windows seat lock dan player shell','V1',[20,5],'team',['D11','D12','D16'], 'agents/windows-seat/; tests/windows-seat/', 'Windows11 test VM: service least-privilege terpisah UI, login member/receipt, lock screen pribadi tidak menjeda billing, logout mengakhiri sesi. Restart meneruskan sisa sah; WOL/idle shutdown hanya PC, tidak konsol. Remote support memerlukan consent per sesi.'),
(28,'game-library-licenses','Katalog game dan integrasi lisensi sah','V1',[3,27],'solo',['D18'], 'services/api/src/games/; agents/windows-seat/Launcher/; apps/web/app/game/', 'Katalog per zona/stasiun/filter game dan age label menggunakan metadata sendiri/berizin. Dua seat satu lisensi tidak berjalan serentak; akun pribadi tidak disimpan pusat. Pool dinonaktifkan bila izin komersial judul tidak terbukti; tidak ada bypass DRM atau auto-login kredensial curian.'),
(29,'pc-content-imaging','Patching, image PC dan save portability','V2',[27,28],'solo',['D18','D19'], 'integrations/pc-imaging/; agents/windows-seat/Content/; apps/web/app/teknisi/image/', 'Integrasi API sistem image berlisensi, bukan implementasi PXE baru. Update dijadwalkan idle pada sandbox; rollback snapshot teruji. Cloud saves game offline hanya opt-in dengan kuota/enkripsi/retensi, tidak menyalin kredensial launcher.'),
(30,'security-privacy-backups','Keamanan, privasi, audit dan restore','MVP',[2,6,20],'solo',['D09','D16','D20'], 'services/api/src/security/; services/api/src/privacy/; services/worker/src/backups/; packages/domain/audit/; docs/security/', 'Kunci perangkat diputar/dicabut; TLS/mTLS atau identitas setara divalidasi. PIN/hash dan recovery code tidak masuk log. Restore backup terisolasi membuktikan ledger utuh. Erasure menghapus profil yang layak tetapi mempertahankan jurnal legal tersamarkan; retention belum disetujui memblokir produksi.'),
(31,'certification-qa','Sertifikasi hardware dan QA lintas alur','V1',[5,7,8,14,17,18,21,22,23,24,25,26,27,30,41],'team',['D04','D06','D07','D12'], 'hardware-lab/; tests/e2e/; tests/faults/; docs/certification/', 'Dua review independen pada build merge: sesi→makanan→bayar→shift plus outage, duplicate/out-of-order, proses mati, jam mundur, no-ACK, revoke izin dan restore. Setiap model/firmware punya rekaman hasil, latency dan video-mode pass/fail; emulator tidak dapat meluluskan hardware.'),
(32,'tournaments-community','Turnamen, bracket dan komunitas','V1',[11,12,26],'solo',['D10'], 'services/api/src/events/; apps/web/app/komunitas/; apps/web/app/turnamen/', 'Empat peserta, knockout dan hasil terotorisasi menempatkan match pada stasiun tanpa bentrok rental. Biaya masuk/prize memakai ledger. Liga/score/double-elimination V2; ranking opted-in, sengketa hasil tidak diubah diam-diam.'),
(33,'branches-entitlements','Multi-cabang, konfigurasi dan entitlement sendiri','V1',[2,3],'solo',['D05','D07'], 'services/api/src/organisations/; apps/web/app/owner/; apps/web/app/pengaturan/', 'Owner membandingkan outlet yang sah; konfigurasi diwariskan dengan override versi. Batas agent di sandbox dapat1untuk uji PLAN_LIMIT, tidak menyalin plan vendor. Subscription komersial disabled; konflik kuota TV vendor dicatat di D05, bukan diselesaikan dengan hardcode.'),
(34,'take-home-assets','Sewa bawa pulang dan custody aset','V2',[3,6,12],'solo',['D10','D16','D21'], 'services/api/src/asset-rentals/; apps/web/app/aset/sewa/', 'PS5 dan2controller dicatat serial/foto kondisi saat keluar/kembali; deposit liability, biaya kerusakan perlu review dan dispute. Pengiriman/overdue per kebijakan; fotoKTP/GPS kontinu disabled. Tidak mengunci handheld Switch hanya dengan TV.'),
(35,'hris-payroll','Staf, kehadiran dan payroll ekspor','V1',[2,17],'solo',['D16','D22'], 'services/api/src/hris/; apps/web/app/staf/; services/worker/src/payroll/', 'Clock-in/out manual berotorisasi, jadwal/leave/overtime dan kasbon ledger terpisah. GPS/selfie opsional memerlukan consent dan retensi approved. Formula gaji/profit share versi; ekspor draft tidak mengirim uang atau melapor pajak.'),
(36,'indonesia-tax-accounting','Akuntansi dan laporan pajak Indonesia','V1',[6,18],'solo',['D17','D22'], 'services/api/src/accounting/; apps/web/app/akuntansi/; services/worker/src/tax-exports/', 'General-ledger debit=kredit, revenue bukan wallet topup. Ekspor pajak/Coretax/SPT berlabel draft, schema/version dan tarif per bisnis approval akuntan. Tidak memakai asumsi PPN11% dari vendor sebagai hukum; tidak submit DJP otomatis.'),
(37,'ai-assistants','AI helper dengan preview dan persetujuan','V2',[15,18,30],'solo',['D16','D23'], 'services/api/src/assistants/; apps/web/app/asisten/', 'OCR invoice menghasilkan draft item/qty/harga beserta confidence, bukan posting stock. Restock/bundling/forecast/segmentasi/voice POS hanya rekomendasi; pembayaran, diskon dan pesan tidak dijalankan oleh AI. Default provider mock; biaya, data keluar dan provider perlu approval.'),
(38,'android-mobile-kiosk','Pilot agent HP/tablet rental','V2',[20,30],'solo',['D04','D11','D12'], 'agents/android-mobile/; tests/hardware/android-mobile/', 'Device milik venue provisioned sah: allowlist game, timer dan expiry lock; DPC hanya model yang mendukung. Tidak menyadap data pelanggan; pilot label tegas. Tidak menyamakan APK TV dengan mobile.'),
(39,'native-tv-feasibility','Feasibility native webOS dan Tizen','V2',[23,30],'solo',['D04','D12','D19'], 'apps/tv-webos/; apps/tv-tizen/; hardware-lab/native-tv/', 'Proof-of-concept API publik dan distribusi legal pada model bernama. LG global overlay belum dijamin; Tizen foreground PiP bukan kiosk. Jika tidak lulus tulis unsupported dengan bukti, rute eksternal tetap tersedia. Tidak rooting, mode developer abadi atau hidden API.'),
(40,'kiosk-ios-wrapper','Kios mandiri dan coverage iOS','V2',[13,26,30],'solo',['D11','D19'], 'apps/web/app/kios/; apps/mobile-wrapper/; tests/e2e/ios/', 'Customer PWA diuji Safari iPhone/iPad untuk booking/order/receipt; native iOS hanya jika push/peripheral membuktikan kebutuhan. Kios managed owned device reset token setelah transaksi; tidak menyimpan data kartu. App-store publish tetap di luar izin.'),
(41,'migration-recovery','Migrasi dry-run, rekonsiliasi dan rollback','V1',[6,9,10,15,30],'solo',['D16','D20'], 'services/api/src/imports/; apps/web/app/impor/; tools/migrate/; tests/migration/', 'CSV preview memetakan member/wallet/time-credit/produk; impor ulang hash/fileId tidak menggandakan saldo. Snapshot pra-import dan rollback menggunakan reversal berjejak. Tidak mengimpor APK, screenshot vendor atau password lawas. RPO/RTO dipraktikkan, bukan janji.'),
(42,'api-sso-integrations','API publik, SSO dan integrasi berizin','V1',[2,6,30],'solo',['D16','D24'], 'services/api/src/public-api/; services/api/src/sso/; packages/contracts/openapi/', 'Token API scoped read-only default, pagination/cursor dan audit. SSO Microsoft/Google optional PKCE/state/nonce/OIDC resmi; demo mock tanpa login di box. Webhook keluar signed, retry idempotent, tidak membuka port LAN publik.'),
(43,'advanced-commerce','B2B, konsinyasi dan unit grosir','V2',[15,16,18],'solo',['D17'], 'services/api/src/commerce/; apps/web/app/niaga/', 'Beli1dus24pcs/jual1pcs menjaga basis stok; supplier consignment settlement memisah pemilik stok dan utang. Invoice/delivery-note B2B bukan bukti pembayaran. Serial controller dan garansi menggunakan asset registry, bukan workflow bengkel.'),
(44,'content-localisation','Konten venue, feedback dan Bahasa Indonesia','V1',[2,25,26],'solo',['D10','D16'], 'apps/web/messages/; services/api/src/content/; apps/web/app/konten/', 'Bahasa Indonesia default, English pilihan; waktu outlet/IDR konsisten. News window, survey/link berizin, opt-out marketing, reduced motion dan keyboard/D-pad focus. Form eksternal dibuka tanpa auto-submit atau PII prefill; review satu per transaksi sah.'),
(45,'operator-runbook','Runbook operator, sandbox dan bantuan','MVP',[1,3,19],'solo',[], 'docs/operator/; apps/web/app/bantuan/panduan/; tools/simulator/', 'Owner/kasir/teknisi dapat menyiapkan fixture8unit, menjalankan simulator tanpa perangkat vendor, membaca kegagalan izin/network dan emergency stop yang aman. Panduan brand sendiri tidak menyalin screenshot/copy vendor. Training tidak menyentuh tenant produksi.')]
T={str(n).zfill(2):dict(id=str(n).zfill(2),slug=slug,title=title,phase=phase,deps=[str(d).zfill(2) for d in deps],mode=mode,decisions=decisions,touches=touches,fixture=fixture) for n,slug,title,phase,deps,mode,decisions,touches,fixture in DATA}
DEC=[
('D01','Money','Tarif, pembulatan, minimum, pause, overtime dan promo','Sandbox: Rp12.000/jam, prorata detik dibulatkan sekali ke rupiah terdekat saat final; minimum0, pause tidak ditagih, late fee0, maksimum satu promo; produksi perlu owner.'),
('D02','Security','Peran, outlet dan override','Owner semua outlet tenant; kasir sesi/checkout, kitchen order, teknisi device; manager approve refund/manual harga; deny default.'),
('D03','Money','Saved time, wallet/bonus, expiry dan redemption','Detik internal; bucket satu kategori/satu outlet; expiry30hari fixture saja; tanpa cash-out/transfer; bonus terpisah; produksi owner.'),
('D04','Hardware/security','Model TV, adapter dan native LG/Samsung','Android TV native minimal Android8 kandidat; hanya allowlist firmware setelah uji; LG/Samsung via external adapter; native conditional; tidak ada model certified saat dokumen ini.'),
('D05','Money','Plan, agent caps, harga dan kontradiksi TV-agent vendor','Jangan salin harga/plan. Vendor page Pro2agent vs flag Enterprise-only dan angka Enterprise berbeda. Sandbox cap configurable; commercial billing disabled sampai disetujui.'),
('D06','Money/security','ACK, timeout, reservasi dan kompensasi','Reserve unit dahulu; start menunggu APPLIED. Timeout10detik fixture, retry command sama; charge settled gagal aktivasi → refund_pending otomatis tanpa grant time; external refund disetujui/rekonsiliasi, bukan klaim dana sudah kembali.'),
('D07','Money/security','Otoritas edge, lease, clock dan offline','Satu edge fenced/outlet; lease Ed25519; aktif sah berlanjut; offline start/extend/wallet allowance0 default. Cash food offline boleh antre; tidak mengklaim remote cloud offline.'),
('D08','Money','Shift, variance, timezone dan handover','Asia/Jakarta fixture outlet, business-day04:00; UTC simpan; sesi tidak diputus close; atribusi revenue per completion, pembayaran per shift penerima; catat handover. Owner tetapkan zona per outlet.'),
('D09','Security','Emergency offline override','Kode recovery unik tersimpan hash, dual-role owner/manager, sekali pakai, grace maksimal5menit fixture; alasan dan event wajib; tidak ada PIN universal.'),
('D10','Money/data','Deposit, cancellation/no-show, leaderboard','Guest booking boleh tanpa akun; hold5menit/window10menit fixture; free cancellation sebelum start dan no-show forfeit disabled sampai owner. Display alias opt-in; no auto walk-in ban.'),
('D11','Scope','Phase Windows/mobile/native包装/iOS','Windows V1, Android rental-mobile V2 pilot; iOS PWA V1, wrapper V2 conditional; jangan buat client native tanpa alasan.'),
('D12','Security/spend','Signing, rollout dan lab perangkat','Signed manifest/payload, idle-only canary1%; rollback. Lab/hardware dan sertifikat pembelian memerlukan approval; tidak belanja dari prompt.'),
('D13','Architecture','Stack dan edge wajib untuk garansi offline','Next.js+TS web, Fastify Node/Postgres/Drizzle API, .NET10 edge SQLite, Kotlin native; edge diperlukan untuk mode certified-offline. Cloud-only manual-billing mode berlabel terbatas.'),
('D14','Evidence','Input partial/route-only, rentang parity','Inventory sumber adalah kandidat; no runtime proof. Semua144star ditelusuri ke kapabilitas generik, false positive pet/craft bukan modul bisnis baru. Refine v0.2 setelah evidence.'),
('D15','Money','QRIS Midtrans, merchant dan refund','Sandbox saja; ServerKey untuk API dan Signature Secret Key terpisah untuk signature webhook menurut access-keys28Oct2026 (docs lama konflik). Verifikasi signature+GET status+merchant/amount/currency; uji vector terpisah dan rotasi, no silent key fallback. Merchant/live/refund perlu approval; refund pending sampai provider confirms.'),
('D16','Security/data','Data region, consent, retention dan identitas','ID upload/geolocation kontinu off; logs pseudonymous; sesi pelanggan minimal, rekening/kartu tak disimpan. Usulan chat30hari/logs90hari/ledger sesuai hukum perlu owner; D16 memblokir produksi.'),
('D17','Money','Costing, inventory dan kebijakan akuntansi','Moving average MVP, FIFO selectable V1 effective-version; tidak recalc sejarah; accountant set chart/tax rules. Harga biaya tidak ditampilkan pelanggan.'),
('D18','Legal/security','Game license pools, akun dan cleanup','Pool game disabled sampai hak komersial publisher diverifikasi; akun personal tidak disimpan server; screenshot/shell cleanup bukan jaminan konsol logout.'),
('D19','Scope/spend','Native-TV store distribution dan integrasi diskless','External certified path dulu; native-TV hanya proof API publik+izin store. Integrasikan tools berlisensi bukan clone boot stack; no devmode production bypass.'),
('D20','Data/security','Backup, restore dan RPO/RTO','Target pilot RPO15menit/RTO60menit usulan, daily full+WAL archive terenkripsi; restore drill wajib. Bukan SLA sebelum diukur.'),
('D21','Money/data','Sewa bawa pulang, deposit, kerusakan','V2, checklist/foto/serial; deposit liability, damage fee review manual; tanpa ID scan wajib/GPS customer.'),
('D22','Money/data','HRIS/payroll dan pajak Indonesia','Ekspor draft saja; formula, consent dan retention approval; tidak membayar gaji, tidak submit DJP. Jangan hardcode PPN dari situs vendor.'),
('D23','Money/data','AI provider dan data keluar','Mock default; OCR draft/forecast advisory; tanpa pembayaran, pesan atau mutasi otomatis. Provider/budget/PII approval terpisah.'),
('D24','Security','SSO, public API dan remote support','OIDC resmi optional; API scopes least privilege; remote PC consent per sesi; jangan sign-in di box/room atau buka ADB publik.')]
# Strict intake before writing ticket folders.
KPS=json.loads((GRAB/'kulapos-rental-ps/INVENTORY.json').read_text())['features']
SEN=mdrows(GRAB/'senet/INVENTORY.md','FR-SENET-')
KULA=mdrows(GRAB/'kulapos-full/INVENTORY.md','FR-KULA-')
KULA_OWN=json.loads((ROOT/'tools/kula-own-targets.json').read_text())
MKT=list(csv.DictReader((GRAB/'ps-rental-market/MASTER-FEATURE-MATRIX.csv').open()))
SM={r[0]:(r[3],r[4]) for r in mdrows(GRAB/'senet/research/MATRIX-SENET.md','F') if re.fullmatch('F[0-9]{3}',r[0])}
# Own vertical-slice canonical requirements; source rows remain aliases, not a misleading count of unique product features.
R=[]
def add(id,title,ticket,source,phase=None,evidence='own normative proposal',acceptance=None,disposition=None,reason='',label=None):
 t=T[str(ticket).zfill(2)];phase=phase or t['phase'];disp=disposition or ('deferred' if phase=='V2' else 'ticket')
 R.append(dict(id=id,title=title,canonical='HS-'+t['id'],ticket=t['id'],component='HS-C'+t['id'],phase=phase,disposition=disp,reason=reason or ('V2; tidak diperlukan untuk pilot MVP/V1, perlu approval keputusan/feasibility sebelum ready.' if disp=='deferred' else 'Dimiliki satu vertical slice; alias tidak menambah implementasi ganda.'),source=source,evidence=evidence,acceptance=acceptance or t['fixture'],source_label=label or title))
for tid,t in T.items():add('HS-'+tid,t['title'],tid,'Master PRD own design',acceptance=t['fixture'])
# KPS exact ownership overrides.
KP={1:3,2:3,3:3,4:5,5:5,6:6,7:6,8:5,9:5,10:5,11:5,12:4,13:4,14:4,15:4,16:14,17:14,18:14,19:14,20:15,21:11,22:10,23:10,24:10,25:11,26:12,27:12,28:12,29:17,30:17,31:18,32:33,33:2,34:8,35:7,36:6,37:21,38:19,39:19,40:21,41:21,42:21,43:21,44:21,45:22,46:22,47:22,48:22,49:22,50:20,51:20,52:20,53:24,54:24,55:25,56:25,57:26,58:32,59:32,60:27,61:38,62:23,63:39,64:20,65:19,66:5,67:33,68:30,69:12}
for x in KPS:
 n=int(x['id'].split('-')[-1]);tid=KP[n]
 ac=x['acceptance_fixture']
 if n==35:ac='QRIS/transfer tampil pending sampai settlement Midtrans sandbox diverifikasi server; pemilihan metode atau screenshot tidak pernah dianggap paid. Cash manual dicatat dengan aktor.'
 if n==38:ac=T['19']['fixture']+' Kode vendor4digit/10menit hanya observasi; spesifikasi sendiri8digit/5menit.'
 if n==53:ac=T['24']['fixture']+' Bukan salinan konstanta internal vendor.'
 if n==63:ac=T['39']['fixture']
 add(x['id'],x['feature'],tid,'KPS authored inventory: '+x['source'],evidence=x['evidence_status']+'; public behaviour only, no binary implementation reference',acceptance=ac)
 R[-1]['acceptance_id']=x['acceptance_id'];R[-1]['superseded_ticket']='KPS-T'+x['ticket']
# SENET exact mapping, including disputed/unknown modules.
SE={1:2,2:33,3:27,4:27,5:27,6:3,7:22,8:3,9:4,10:4,11:13,12:36,13:17,14:13,15:5,16:13,17:13,18:13,19:11,20:13,21:13,22:9,23:7,24:36,25:25,26:9,27:9,28:11,29:11,30:12,31:12,32:12,33:13,34:12,35:12,36:12,37:12,38:13,39:33,40:44,41:14,42:15,43:14,44:25,45:2,46:11,47:18,48:18,49:28,50:28,51:29,52:29,53:27,54:27,55:39,56:5,57:13,58:21,59:24,60:18,61:23,62:3,63:27,64:41,65:45,66:44,67:42,68:30,69:32,70:40,71:23,72:13,73:19,74:33,75:22,76:22,77:20,78:21,79:23,80:23,81:23,82:5,83:13,84:5,85:27,86:4,87:4,88:4,89:10,90:11,91:11,92:9,93:11,94:9,95:17,96:17,97:6,98:8,99:14,100:14,101:15,102:11,103:9,104:11,105:12,106:12,107:12,108:27,109:30,110:42,111:27,112:27,113:3,114:44,115:27,116:28,117:29,118:27,119:42,120:9,121:4,122:12,123:13,124:11,125:44,126:13,127:18,128:18,129:18}
for x in SEN:
 if len(x)!=5:raise ValueError(('SEN parse',x))
 id,title,beh,plat,src=x;n=int(id.split('-')[-1]);tid=SE.get(n,45)
 ev='pending verification' if ('UNKNOWN' in beh or plat=='UNKNOWN' or n in (55,59,65,66,69,70,71,74,81)) else 'authored public docs/transcript claim; not runtime verified'
 ac=T[str(tid).zfill(2)]['fixture']
 # Preserve behavioural subconditions as tests, not vendor UI copy; clear precedence for own approved defaults.
 ac+=' Uji interpretasi sendiri: '+beh+'. Gunakan kebijakan master jika batas/angka/perilaku sumber berbeda; jangan implementasikan nama/copy vendor.'
 if n in (71,79,81):ac=T['23']['fixture']+' Senet melarang CEC pada jalur TV-app tertentu dan controller lama tidak120Hz; catat kontradiksi, jangan adopsi batas/HDCP-off sebagai workaround.'
 if n==55:ac=T['39']['fixture']+' Klaim Samsung sumber bukan bukti setup/certified; Android tetap dimiliki T21, LG coming-soon bukan shipped.'
 if n==68:ac=T['30']['fixture']+' Region dipilih owner D16, bukan wajib menyalin EU hosting vendor.'
 add(id,title,tid,src,evidence=ev,acceptance=ac)
# Matrix mapping by exact category/semantic vocabulary; order intentionally prioritises hardware and money.
def classify(text,category=''):
 s=(text+' '+category).lower()
 rules=[(39,['webos','tizen']), (38,['rental-phone','mobile agent','phone/tablet rental']), (29,['diskless','image pc','game update','game deployment','cloud game save']), (28,['game license','game-account','license pool','game launch','game library','game catalogue','age limits']), (27,['windows','pc wake','pc lock','launcher','client pc','printing for customer']), (23,['cec','ir tv','ir blaster','hdmi switch','smart plug','external','non-android','4k120','hdr','hdcp']), (24,['rollout','rollback','agent version','signed agent update','health alert','firmware inventory']), (19,['pairing','capability','permission setup','revocation','device identity']), (21,['standby lock','home','overlay','android tv','tv agent','d-pad','admin pin']), (22,['volume','mute','tv power','screen lock','sleep','tv remote']), (20,['lease','offline','reconnect','monotonic','command','fencing','power outage','clock rollback','session authority']), (34,['take-home','delivery','damage','condition photos','security deposit','asset tracking','accessory','overdue','custody']), (32,['tournament','bracket','league','seeding','spectator','prize','rank greeting','leaderboard']), (35,['payroll','attendance','clock-in','geofenc','overtime','staff cash advance','profit distribution']), (36,['tax','coretax','general ledger','accounting']), (37,['ai ','forecast','ocr','restock advisor','voice pos']), (41,['migration','import preview','restore drill','recovery objective']), (42,['sso','open api','public api','webhook integrations']), (30,['privacy','retention','erasure','encrypt','mfa','backup','security','audit trail','sensitive','segmentation','least-privilege','secret','remote assistance','data export','emergency local']), (2,['role-based','tenant isolation','branch-scoped staff']), (33,['branch comparison','multi-branch','franchise','outlet setup','branch stock','entitlement']), (10,['saved unused','time-credit','time balances','saved time']), (9,['wallet','top-up','topup','bonus balance','double-spend']), (7,['qris','e-wallet','payment provider','webhook signature','settlement','late settlement','payment expiry']), (6,['payment','refund','cash sale','append-only financial','negative','manual adjustment','cash payment','transfer recording']), (8,['receipt','printer','thermal','printing','pdf receipt']), (17,['shift','cash drawer','handover','cash expenses']), (18,['report','utilization','valuation','liability','margin','revenue','excel csv','export','peak-hour']), (12,['book','reservation','no-show','waitlist','check-in','late-arrival','reschedule','checkout hold']), (13,['self-service','customer live remaining','customer request extension','customer installable','qr login']), (11,['member','loyalty','voucher','reward','referral','birthday','family','spending history','marketing consent']), (14,['food','kitchen','f&b','menu','order status','combined rental','customer order','allergies','queue']), (16,['supplier','purchase','goods receiving','stock transfer']), (15,['stock','inventory','product','recipe','sku','barcode','costing','wastage']), (25,['chat','call operator','notification','warning','cashier alert']), (26,['lobby','billboard','signage','customer display','public display']), (4,['tariff','price','rate','rounding','minimum charge','happy hour','overnight package','holiday','promo']), (40,['kiosk','ios','mobile wrapper']), (44,['localization','localisation','reduced motion','accessible','consent','public venue','news','surveys','review']), (45,['training','sandbox','runbook','support']), (3,['station','zone','floor','console assignment','controller asset','maintenance']), (5,['session','prepaid','postpaid','bill','group','pause','extend','grace period'])]
 for tid,words in rules:
  if any(w in s for w in words):return tid
 return 18 if category=='Staff & finance' else 45
# Explicit human-reviewed ownership prevents category words (e.g. "wallet & payments") hijacking unrelated requirements.
MM={}
def mm(a,b,t):
 for n in range(a,b+1):MM[n]=t
for a,b,t in [(1,1,2),(2,14,3),(15,18,5),(19,23,4),(24,32,5),(33,35,10),(36,37,20),(38,41,4),(42,45,6),(46,46,5),(47,47,7),(48,49,6),(50,52,7),(53,55,9),(56,59,6),(60,64,7),(65,65,6),(66,67,9),(68,69,20),(70,70,7),(71,71,13),(72,72,3),(73,90,12),(91,93,13),(94,95,25),(96,103,15),(104,106,16),(107,110,15),(111,111,16),(112,121,14),(122,129,11),(130,130,9),(131,140,11),(141,155,32),(156,157,2),(158,158,6),(159,162,17),(163,163,30),(164,166,35),(167,171,8),(172,181,18),(182,183,36),(184,186,19),(187,188,21),(189,189,19),(190,190,21),(191,191,19),(192,195,21),(196,198,20),(199,199,22),(200,204,23),(205,208,21),(209,215,27),(216,216,29),(217,218,28),(219,220,27),(221,221,29),(222,223,38),(224,226,39),(227,227,26),(228,228,20),(229,229,13),(230,230,18),(231,231,40),(232,232,26),(233,238,20),(239,256,30),(257,257,20),(258,259,9),(260,268,34),(269,269,16),(270,270,33),(271,272,42),(273,273,41),(274,274,45),(275,277,44),(278,278,26),(279,279,31),(280,280,45),(281,281,24),(282,282,18),(283,283,3),(284,284,25)]:mm(a,b,t)
MM.update({6:4,14:19,28:21,37:5,119:8,177:33,248:41,254:24})
assert len(MM)==284
for x in MKT:
 n=int(x['id'][1:]);tid=MM[n];phase=T[str(tid).zfill(2)]['phase']
 if x['priority']=='V2':phase='V2'
 if tid in (19,20,21,23,30):phase='MVP'
 if n in (144,145,146,155):phase='V2'
 reason='Triase master: source '+x['priority']+' → '+phase+'; primary owner HS-T'+str(tid).zfill(2)+'. '+('V2 karena integrasi/feasibility/operasi non-pilot, menunggu keputusan owner.' if phase=='V2' else 'Ikuti dependency dan scope fase canonical; baseline safety tetap MVP.')
 add(x['id'],x['feature'],tid,'Market matrix '+x['id']+'; others='+x['others'],phase=phase,evidence=x['evidence_status'],acceptance=T[str(tid).zfill(2)]['fixture']+' Asersi spesifik: '+x['feature']+' diwujudkan dengan fixture yang dapat diulang; catat expected/actual dan dampak ledger/device.',reason=reason)
 R[-1]['source_priority']=x['priority']
 R[-1]['senet_comparison']=SM.get(x['id'],('pending verification','No refreshed source row'))
# KULA shared core + all starred aliases. Detect false-positive star tags and explicitly scope to reusable concept only.
false_star={10:18,63:12,81:15,93:12,94:11,99:11,105:18,114:18,115:12,138:18,140:12,146:12,176:17,183:8,269:12,273:26,339:12,343:12,406:18,499:18}
route_map={264:27,265:16,266:21,267:21,268:21,276:12,277:12,278:12,280:15,281:45,282:43,283:25,284:44,285:26,286:11,287:11,288:18,290:27,291:21,292:18,293:18,294:7,295:14,296:14,297:20,298:35,299:35,300:35,301:35,302:35,303:35,304:35,305:35,306:35,307:34,308:15,310:15,311:16,312:5,315:40,316:44,318:11,322:14,323:6,324:8,325:25,326:45,327:45,328:14,329:14,330:14,331:14,332:14,333:7,334:14,335:18,336:44,337:27,338:27,350:16,351:14,352:6,355:14,356:14,360:15,361:15,362:15,363:15,364:15,365:11,366:11,367:11,368:11,369:11,370:11,372:16,373:16,374:16,375:16,376:16,377:16,378:5,379:26,380:26,381:13,382:3,383:32,384:32,385:45,386:45,387:18,388:36,389:18,390:18,391:35,392:43,393:36,394:11,397:18,398:15,399:18,400:11,401:18,403:18,407:18,408:18,409:18,410:18,411:18,412:34,413:17,415:15,416:15,417:18,419:6,420:44,421:44,422:43,423:37,424:35,426:3,427:33,428:2,429:37,431:35,432:4,433:33,434:11,435:7,437:8,438:33,439:14,440:35,441:30,442:33,443:25,444:37,445:37,446:37,447:37,448:37,449:37,450:37,451:35,452:35,453:35,454:15,455:15,456:33,457:16,458:8,462:6,463:45,464:21,465:21,466:45,467:39,468:39,469:2,470:36,471:37,472:37,474:18,475:37,476:35,477:35,478:43,479:36,480:11,484:18,485:15,486:4,487:37,488:33,489:18,490:11,491:11,492:18,494:7,495:18,498:8,500:33,501:18,502:5,503:44,504:18,505:14,506:18,507:35,508:18,509:30,510:37,511:34,512:17,514:15,515:15,516:37,517:33,518:25,519:18}
fixed={1:18,2:36,3:36,4:36,5:18,6:18,7:18,8:18,9:18,11:18,12:15,13:15,14:34,15:17,16:18,17:18,18:43,19:18,20:11,21:11,22:35,23:35,31:18,32:15,33:15,34:15,35:11,36:30,37:35,38:11,39:25,40:35,41:37,42:37,43:37,44:37,45:37,46:5,47:21,48:12,49:14,50:14,51:14,52:14,53:14,54:15,55:18,64:14,65:6,70:35,71:35,72:35,73:35,74:35,75:35,76:35,77:35,78:35,186:6,187:15,188:8,189:16,190:16,191:18,192:15,193:18,194:6,195:17,196:15,197:6,198:6,199:11,200:6,201:6,202:6,203:8,204:43,205:11,206:11,207:11,208:10,209:5,210:19,211:10,212:14,213:22,214:12,215:15,216:15,217:43,218:15,219:15,220:16,221:16,222:14,223:14,224:18,225:18,226:18,227:17,228:2,229:35,230:8,231:8,232:42,233:20,234:6,235:8,236:15,237:18,238:33,239:16,240:16,241:14,242:37,243:37,244:37,245:37,246:37,247:21,248:33,249:45,250:6,251:5,252:21,253:14,254:21,255:21,256:20,257:4,258:4,259:26,260:32,261:10,262:25,263:14}
for x in KULA:
 if len(x)!=9:raise ValueError(('KULA parse',x))
 id,star,module,title,beh,industries,tier,plat,src=x;n=int(id.split('-')[-1]);isstar='⭐' in star
 tid=false_star.get(n) or fixed.get(n) or route_map.get(n)
 industry=module.startswith('Industry:') or ('[' in industries and 'all' not in industries and 'rental' not in industries and 'fnb' not in industries)
 if not tid and isstar:tid=classify(title,module)
 reason='';disp=None
 if not tid:
  tid=45;disp='out-of-scope';reason='Industri non-gaming (apotek/medis/pet/laundry/bengkel/craft/photobox), testimonial, atau route tanpa kapabilitas relevan; tidak menjadi fitur produk.'
 phase=T[str(tid).zfill(2)]['phase']
 if n in false_star:
  reason='Tag star upstream false-positive lintas industri: traceability tetap in-scope sebagai alias kapabilitas generik '+T[str(tid).zfill(2)]['title']+'; TIDAK membangun pet/medis/barber/craft/bengkel literal.'
  phase='V1' if phase=='V2' else phase
 if n>=264 and tid and not disp:ev='pending verification; route name only; own interpreted requirement, not vendor behaviour proof'
 else:ev='pending verification' if 'UNKNOWN' in beh else 'public authored summary; not runtime verified'
 if not disp and phase=='V2':disp='deferred'
 ac=T[str(tid).zfill(2)]['fixture']
 if disp=='out-of-scope':ac='Tidak membuat route/modul industri ini; verifikasi alias tetap terdaftar dengan alasan out-of-scope dan tidak dipromosikan ke ticket implementasi.'
 # source labels retained only as provenance; no marketing body, bundle code or source UI wording imported.
 if not disp and n not in false_star and str(n) in KULA_OWN:
  ac+=' Target rincian sendiri: '+KULA_OWN[str(n)]
 own_title=T[str(tid).zfill(2)]['title']+' — referensi '+id
 add(id,own_title,tid,src,phase=phase,evidence=ev,acceptance=ac,disposition=disp,reason=reason,label=title)
 R[-1]['upstream_star']=isstar
GAPS=[(31,'Katalog sertifikasi model+firmware dengan bukti publik'),(5,'ACK aktivasi dan kompensasi kegagalan'),(20,'Lease offline bertanda tangan dan reboot-safe deadline'),(20,'Rekonsiliasi offline deterministik tanpa double charge'),(9,'Budget wallet offline tanpa double-spend lintas cabang'),(23,'Satu kontrak adaptor lintas Android/CEC/HDMI/IR/manual'),(23,'Sertifikasi HDMI4K120/HDR/VRR/HDCP latency'),(31,'Fleet simulator dan fault injection berulang'),(24,'Update signed canary dan rollback'),(18,'Audit payment/session/adjustment/wallet liability'),(30,'Emergency override lokal berjangka dan audit'),(30,'Privasi default, retention, erasure dan lobby redaction'),(34,'Custody aset sewa beserta damage dispute'),(27,'Verifikasi cleanup sesi tanpa shared personal credentials'),(41,'Migration dry-run, rollback dan restore drills')]
for i,(tid,title) in enumerate(GAPS,1):add(f'HS-GAP-{i:02}',title,tid,'Own differentiation requirement; NOT a claim both competitors lack it')
# Stable alias AC identity; preserve AC-KPS.
for r in R:
 if 'acceptance_id' not in r:r['acceptance_id']='AC-'+r['id']
# Inventory completed before ticket generation; capture every row including exclusions.
(ROOT/'specs/requirements.json').write_text(json.dumps(R,ensure_ascii=False,indent=2))
with (ROOT/'specs/requirements.csv').open('w',newline='') as f:
 fields=['id','canonical','ticket','component','phase','disposition','title','acceptance_id','acceptance','source','evidence','reason']
 w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(R)
counts=collections.Counter(r['disposition'] for r in R)
meta={'source_counts':{'FR-KPS':len(KPS),'FR-SENET':len(SEN),'FR-KULA':len(KULA),'market_F':len(MKT)},'total_traceability_rows':len(R),'canonical_vertical_slices':len(T),'own_gap_requirements':15,'dispositions':dict(counts),'starred_kula_rows':sum('⭐' in x[1] for x in KULA)}
(ROOT/'specs/summary.json').write_text(json.dumps(meta,indent=2))
# Source intake hashes allow late refresh detection; no raw/private material copied.
paths=[GRAB/'kulapos-rental-ps'/x for x in ['HANDOFF.md','PRD.md','INVENTORY.json','PARITY-CHECKLIST.md','NOTES.md','WORKFLOWS.md']]+[GRAB/'kulapos-full'/x for x in ['HANDOFF.md','INVENTORY.md','PRICING.md','SHARED-CORE.md','WORKFLOWS.md','APPS.md']]+[GRAB/'senet'/x for x in ['HANDOFF.md','INVENTORY.md','APPS.md','WORKFLOWS.md','research/MATRIX-SENET.md','research/HARDWARE-OFFLINE.md']]+[GRAB/'ps-rental-market'/x for x in ['MASTER-FEATURE-MATRIX.csv','README.md','TV-CONSOLE-CONTROL.md','SOURCES.md']]
manifest=[]
for p in paths:
 if p.exists():manifest.append({'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'mtime_local':datetime.datetime.fromtimestamp(p.stat().st_mtime).isoformat()+'+08:00'})
(ROOT/'sources/intake-manifest.json').write_text(json.dumps(manifest,indent=2))
(ROOT/'sources/PROVENANCE.md').write_text('# Provenance dan batas clean-room\n\nHanya ringkasan perilaku publik dan requirement sendiri. Tidak membawa raw/pages/private, APK, bundle JS, subtitle mentah, screenshot/logo/font/copy/code vendor. Ada ringkasan upstream TV-AGENT yang mendiskusikan static APK: dibaca hanya untuk batas risiko, tidak dijadikan instruksi implementasi, tidak disalin ke paket. Konstanta/strategi internal tidak diadopsi. Implementasi native harus memakai dokumentasi SDK publik dan spike sendiri.\n\n'+table(['Input','Jumlah','Status'],[(k,v,'snapshot; lihat INPUT-STATUS.md') for k,v in meta['source_counts'].items()])+'\nNama/ID sumber tersimpan hanya di dokumen traceability, tidak di UI/brand/namespace runtime. Seluruh520row KULA dipertahankan; star bukan bukti relevansi literal. Source route-only tidak berarti fitur teruji, dan testimonial tidak menjadi requirement produk. Masing-masing row punya satu primary owner atau deferral/out-of-scope.\n\nID source SRC-*/V1/BUNDLE* diselesaikan ke pack rental research/SOURCES.md; URL KULA/SENET ke ledger asli; market source IDs ke sumber daftar terlampir. Jangan panggil endpoint vendor dari agent/build.\n')
# Generated acceptance catalog: individual KPS fixtures preserved; source unknowns clearly own defaults.
(ROOT/'specs/ACCEPTANCE.md').write_text('# Katalog acceptance normatif — draft\n\nFixture uang/keamanan/data adalah ASSUMPTION; keputusan owner lebih tinggi dari fixture sumber. Per-row source ID bukan perintah menyalin UI. Semua expected adalah target build, BUKAN hasil tes yang sudah lulus.\n\n'+table(['Requirement','Acceptance','Target teramati','Primary ticket','Disposition'],[(r['id'],r['acceptance_id'],r['acceptance'],r['ticket'],r['disposition']) for r in R]))
# Components and gates have explicit one-owner crosswalk, no accidental legacy ID collapse.
legacy_comps={1:2,2:3,3:5,4:6,5:4,6:14,7:10,8:12,9:17,10:19,11:21,12:22,13:24,14:25,15:26,16:32,17:27,18:31}
COMP=[(f'HS-C{k}',k,t['title']) for k,t in T.items()]+[(f'KPS-C{i:02}',str(t).zfill(2),'Legacy proposed component alias; no extra visual specification') for i,t in legacy_comps.items()]
GATES=[('AUTH_FORBIDDEN',403,2),('PLAN_LIMIT',409,33),('STATION_BUSY',409,5),('INVALID_TRANSITION',409,5),('PAYMENT_UNCONFIRMED',409,7),('QUOTE_STALE',409,4),('CREDIT_INELIGIBLE',409,10),('BOOKING_CONFLICT',409,12),('DEVICE_UNSUPPORTED',422,19),('DEVICE_PERMISSION_REQUIRED',422,19),('ACTIVATION_TIMEOUT',202,21),('UPDATE_REJECTED',422,24),('OFFLINE_ACTION_UNAVAILABLE',409,20),('LEASE_EXPIRED',409,20),('COMMAND_STALE',409,20),('PAIRING_EXPIRED',410,19),('INSUFFICIENT_BALANCE',409,9),('IDEMPOTENCY_CONFLICT',409,6),('REFUND_PENDING',202,7),('DATA_RETENTION_UNAPPROVED',409,30)]
NG=[('NG01','Tidak ada brand/logo/copy/code/APK/assets vendor dalam produk'),('NG02','Tidak ada live payment keys, pembayaran nyata, deployment atau store publish'),('NG03','Tidak pernah memutus listrik konsol, rooting/hidden API/DRM bypass'),('NG04','Tidak ada modul apotek/medis/pet/laundry/barber/bengkel/craft literal'),('NG05','Tidak ada klaim universal TV lock/native webOS/Tizen/iOS agent tanpa bukti'),('NG06','Tidak ada auto-message, payroll transfer, DJP submit, AI autonomous mutation')]
COV=table(['ID','Canonical','Primary ticket','Phase','Disposition','Reason'],[(r['id'],r['canonical'],r['ticket'],r['phase'],r['disposition'],r['reason']) for r in R])
COV+='\n## Acceptance IDs\n'+table(['AC ID','Requirement','Ticket','Disposition'],[(r['acceptance_id'],r['id'],r['ticket'],r['disposition']) for r in R])
COV+='\n## Component crosswalk\n'+table(['Component','Ticket','Meaning'],COMP)
COV+='\n## Gate coverage\n'+table(['Gate','HTTP','Ticket'],GATES)
COV+='\n## Non-goals\n'+table(['ID','Out-of-scope','Policy owner'],[(a,b,'30 safety audit; not feature implementation') for a,b in NG])
COV+='\n## Goals\n'+table(['Goal','Primary tickets'],[('G01','03,04,05,06,07,14,17'),('G02','19,20,21,23,24,31'),('G03','09,10,11,12,13,25,26'),('G04','27,28,29,32,33'),('G05','30,35,36,37,39,40,41,42,43,44,45')])
(ROOT/'specs/tickets/COVERAGE.md').write_text('# Coverage v0.1 — sumber tidak hilang\n\n'+json.dumps(meta,ensure_ascii=False)+'\n\nSetiap source/canonical row mempunyai tepat satu disposition. `ticket` berarti scope MVP/V1 draft; `deferred` V2 masih mendapat owning draft ticket, bukan siap dibangun; `out-of-scope` hanya dikumpulkan dalam audit T45, bukan fitur implementasi. Jumlah row mencakup alias berulang, bukan klaim1062fitur unik.\n\n'+COV)
(ROOT/'specs/ID-CROSSWALK.md').write_text('# ID crosswalk v0.1\n\nFR-KPS, FR-KULA, FR-SENET, market F, HS canonical dan HS-GAP tidak boleh diratakan/renumber. Semua mapping lengkap di requirements.csv dan COVERAGE.md. Legacy T01..T18 selalu diberi prefix KPS-T; ticket baru HS-T01..45. KPS-C legacy bukan HS-C; marker star lintas industri dinormalisasi ke konsep umum, tidak membuat domain pet/medis.\n\n'+table(['Requirement/source','Own canonical','New ticket','Design','Legacy source ticket'],[(r['id'],r['canonical'],'HS-T'+r['ticket'],r['component'],r.get('superseded_ticket','—')) for r in R]))
# Draft supersession trace, hashes instead of copying upstream implementation notes.
legacy=[]
for p in sorted((GRAB/'kulapos-rental-ps/specs/tickets').glob('*/rd.md')):
 old=p.parent.name[:2];owners=sorted({r['ticket'] for r in R if r.get('superseded_ticket')=='KPS-T'+old})
 legacy.append((f'KPS-T{old}',', '.join('HS-T'+k for k in owners),str(p),hashlib.sha256(p.read_bytes()).hexdigest()))
(ROOT/'specs/SUPERSESSION.md').write_text('# Supersession — 18 draft rental tickets\n\nMaster board ini menggantikan18draft upstream untuk HatchSystem; tidak mengubah folder upstream. Reuse: fixtureAC dan perilaku yang aman, pemisahan state payment/device, evidence browser/hardware. Tidak reuse static APK implementation/asset atau keputusan yang belum dikunci. Keputusan baru terpusat di DECISIONS.md.\n\n'+table(['Superseded ID','Master owners','Original authored draft','SHA256'],legacy))
(ROOT/'DECISIONS.md').write_text('# Keputusan terbuka — semua ASSUMPTION, bukan persetujuan\n\nOwner: Enrico/Product untuk money/security/data; teknisi/desain memberi evidence, bukan mengunci kebijakan sendiri. D01–D12 dipertahankan dari rental pack, D13–D24 tambahan. Rekomendasi ini hanya fixture/sandbox; sampai owner memilih, ticket terkait tetap draft. Arsitektur baseline mengikuti request master, tetapi perubahan stack perlu catatan keputusan.\n\n'+table(['ID','Class','Choice still open','Recommended default'],DEC))
# Functional tickets; ticket contracts written before parallelisation; placeholders only for future results.
for tid,t in T.items():
 p=ROOT/'specs/tickets'/f'{tid}-{t["slug"]}';p.mkdir(exist_ok=True)
 own=[r for r in R if r['ticket']==tid and r['disposition']!='out-of-scope']
 excluded=[r for r in R if r['ticket']==tid and r['disposition']=='out-of-scope']
 gates=[a for a,b,c in GATES if str(c).zfill(2)==tid]
 cross=table(['Requirement','Own canonical','Acceptance','Design','Phase / disposition'],[(r['id'],r['canonical'],r['acceptance_id'],r['component'],r['phase']+' / '+r['disposition']) for r in own])
 behavior='\n'.join(f'- **{r["id"]} / {r["acceptance_id"]}** — {r["title"]}. Target: {r["acceptance"]} Evidence: {r["evidence"]}; sumber: {r["source"]}.' for r in own)
 rd=f'''# HS-T{tid} — {t['title']}

Status: **draft**
Mode: **{t['mode']}**
Phase: {t['phase']}

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: {t['fixture']} Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
{cross}

## Behaviour
{behavior}

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
{t['touches']}
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C{tid}. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
'''+ ('\n'.join('- HS-T'+d+': kontrak dan hasil merge harus diterima sebelum dispatch.' for d in t['deps']) or '- Tidak ada; bootstrap setelah human ready.')+f'''

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: {', '.join(t['decisions']) or 'Tidak ada kebijakan uang/keamanan/data spesifik yang baru; tetap perlu human ready.'}; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. {len(excluded)} row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
{', '.join(gates) or 'Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.'}
'''
 (p/'rd.md').write_text(rd)
 checks='\n'.join(f'- [ ] {r["id"]} / {r["acceptance_id"]}: {r["acceptance"]}' for r in own)
 cmds=f'''1. `python3 tools/validate_spec.py` — PASS; tidak boleh memperbaiki validator untuk menyembunyikan gap.
2. `pnpm lint && pnpm typecheck && pnpm test:ticket -- {tid}` — exit0, semua ID owned punya test evidence. T01 wajib membuat scripts ini dan dispatcher manifest; tes domain, bukan grep tautologi.
3. `pnpm exec playwright test tests/e2e/ticket-{tid}.spec.ts` untuk flow web yang disentuh — browser nyata headless/headed, screenshot dan trace; jika tanpa web dokumentasikan N/A dengan alasan, bukan fabricated pass.
'''
 if tid in ['19','20','21','22','23','24','31','38','39']:
  cmds+='4. Native: `./gradlew testDebugUnitTest assembleDebug` di agent Kotlin yang relevan atau `dotnet test` pada agent .NET. Uji fisik model/firmware/topologi memakai hardware-lab; simulator membuktikan protocol saja, tidak meluluskan picture control. Tanpa perangkat: tandai BLOCKED_HARDWARE dan jangan done.\n'
 elif tid in ['27','29']:
  cmds+='4. `dotnet test` di solusi Windows relevan; flow lock/login/reboot/cleanup pada Windows11 VM lalu mesin pilot. Jangan menganggap screenshot browser menguji Windows service.\n'
 ev=f'''# Eval HS-T{tid} — {t['title']}

## Checks
{cmds}
## Acceptance per requirement
{checks}

## Edge / failure cases
- [ ] Cross-tenant ID, role tanpa izin dan stale version tidak membuat side effect.
- [ ] Retry/duplicate/reorder dengan idempotency key sama tidak menggandakan event, debit, receipt, order atau unlock.
- [ ] Payload sama key berbeda boleh hanya jika bisnis sah; key sama payload berbeda →409 IDEMPOTENCY_CONFLICT.
- [ ] Kosong/loading/error/pending/offline, saldo tidak cukup, data stale dan izin browser ditolak punya UI jujur, fokus keyboard/D-pad dan reduced motion.
- [ ] Fixed/open × prepaid/postpaid: waktu/bayar/expiry sesuai PRD; manual station tidak pura-pura mendapat device ACK.
- [ ] Gates: {', '.join(gates) or 'shared AUTH_FORBIDDEN dan validation envelope'}, assert status/code/messageKey tanpa rahasia.
- [ ] V2 alias yang ditunda tetap disabled/absent dalam release MVP/V1 dan tercatat alasan, bukan TODO tersembunyi.

## Evidence
Simpan `evidence/requirements-evidence.json` dengan key setiap ID scope yang dikerjakan dan fields testPath,command,exitCode,expected,actual,artifact,verificationLevel. Tambahkan stdout lengkap, Playwright trace/screenshot layar penting dan note data fixture. Hardware: device model/firmware, topologi, permission, elapsed measurement dan rekaman; tanpa user PII/vendor assets. Catat ke results.md, jangan tulis PASS sebelum tes dijalankan.

## Definition of done
- [ ] Scope aktif di rd.md dipenuhi; alias/deferred tidak disalahhitung sebagai implementasi.
- [ ] Eval command benar-benar berjalan dan evidence dapat dibuka; tidak ada skipped test yang wajib.
- [ ] Migrasi forward+rollback teruji sandbox; secrets/log redaction dicek.
- [ ] Team contract disetujui sebelum worker paralel bila mode team.
- [ ] Router memeriksa eval; Merger integrasi; Checker uji flow dan tetangga pada hasil merge.
- [ ] Bug gagal dikirim kembali ke worker yang sama; Reproducer ulang2kali dengan evidence.
- [ ] Human-approved phase dan keputusan lock tidak dilanggar; board+rd berubah done hanya setelah bukti.
'''
 (p/'eval.md').write_text(ev)
 (p/'results.md').write_text('# Results — NOT STARTED\n\nBelum ada implementasi/tes. Isi hasil nyata saat runtime; structural spec validation bukan product acceptance.\n')
 (p/'evidence').mkdir(exist_ok=True);(p/'evidence/README.md').write_text('Evidence belum ada. Tidak ada screenshot/test result palsu.\n')
 if t['mode']=='team':
  (p/'contract.md').write_text(f'''# Team contract HS-T{tid} — proposed, not yet agreed

Status: **draft — must be agreed before parallel work**.

Shared goal: {t['fixture']}

Worker A owns API/domain paths in rd.md; Worker B owns native/web consumer paths. Tester owns tests/e2e/ticket-{tid}.spec.ts plus protocol/hardware fixtures, not business policy. No two workers edit the same file; freeze generated schemas through T01 owner before consumer work. Separate branches/worktrees required; proposed split may be refined only inside this ticket's fixed scope.

Interface: CONTRACTS.md version1; SessionCommand/SessionLease/DeviceAck, revision/epoch and payment states MUST match. No field rename, gate change or new dependency without router/spec review. Shared migrations submitted by Worker A; Worker B consumes generated schema. Sign contract with worker names, branch, schema hash, assigned files and integration test sequence before code.

Integration order: contract/schema fixture accepted → provider tests → consumers against shared simulator → merge provider then consumer → independent Checker on merged build. A received ACK is not applied. Device fault cannot become paid activation success. Conflict: stop overlap, notify router, keep both worktrees intact; do not overwrite another worker.
''')
# Single primary assignment for out-of-scope rows; still mentioned in audit ticket to satisfy all-ID validator.
ex=[r for r in R if r['disposition']=='out-of-scope']
(ROOT/'specs/tickets/45-operator-runbook/EXCLUSIONS.md').write_text('# Explicit out-of-scope source rows — audit only\n\n'+table(['ID','Source label','Reason'],[(r['id'],r['source_label'],r['reason']) for r in ex]))
(ROOT/'specs/tickets/45-operator-runbook/rd.md').write_text((ROOT/'specs/tickets/45-operator-runbook/rd.md').read_text()+'\n## Exclusion audit references\n'+', '.join(r['id'] for r in ex)+'\nThese are exclusion records only, never implementation mandates.\n')
# source component/gate/NG references are owned in tickets too.
for comp,tid,meaning in COMP:
 p=ROOT/'specs/tickets'/f'{tid}-{T[tid]["slug"]}'/'rd.md'
 p.write_text(p.read_text()+f'\nDesign alias owned: {comp} — {meaning}.\n')
(ROOT/'specs/tickets/30-security-privacy-backups/rd.md').write_text((ROOT/'specs/tickets/30-security-privacy-backups/rd.md').read_text()+'\n## Global non-goal safety audit\n'+ '\n'.join(f'- {a}: {b}' for a,b in NG)+'\n')
# Topological board order explicit; no draft dispatch and no invented ready approval.
order=[];pending=set(T)
while pending:
 ready=sorted(k for k in pending if set(T[k]['deps'])<=set(order))
 if not ready:raise ValueError('dependency cycle')
 for k in ready:order.append(k);pending.remove(k)
(ROOT/'specs/ticket-manifest.json').write_text(json.dumps({'tickets':list(T.values()),'topological_order':order,'components':COMP,'gates':GATES,'non_goals':NG},ensure_ascii=False,indent=2))
boardrows=[]
for tid in order:
 t=T[tid];runs='waits on '+', '.join(t['deps'])+' (merged contracts/evals)' if t['deps'] else 'alongside only independent approved foundations'
 boardrows.append((tid,f'[{t["title"]}]({tid}-{t["slug"]}/rd.md)','draft',t['mode'],runs,t['phase']+'; '+(', '.join(t['decisions']) or 'human ready needed')))
(ROOT/'specs/tickets/board.md').write_text('# HatchSystem master board v0.1\n\nSemua45ticket **draft**. Hanya human dapat promote selected rows ke ready (board DAN rd). Keputusan money/security/data tetap blocker. Urutan dependency di bawah bukan izin dispatch. Bila tak ada ready, router berhenti dan laporkan, bukan self-promote.\n\nStart Watchdog FIRST (timer≈10menit), router tidak coding/decompose, worker satu tiket/worktree, team contract sebelum paralel, eval fail→worker sama, Merger kemudian Checker browser+device. Reproducer reproduksi2kali. Model murah untuk scope jelas bila tersedia; tidak mengurangi evidence.\n\n'+table(['ID','Name','Status','Mode','Runs','Notes'],boardrows)+'\n## Coverage summary\n'+json.dumps(meta,ensure_ascii=False)+'\n\nSemua requirement/AC/component/gate/non-goal ada [COVERAGE.md](COVERAGE.md); source aliases di ../ID-CROSSWALK.md; exclusions/deferred reason tidak hilang. KPS-T01..18 superseded, jangan jalankan keduanya. Tujuan G01–G05 tercakup. Non-goals NG01..NG06 jangan diubah menjadi fitur.\n\nParallel hanya bila seluruh dependency done dan Touches/contract tidak overlap. Jangan membaca baris alongside sebagai izin menulis shared checkout. V2 tetap tidak dirilis walau ticketnya punya aliasMVP: selesaikan sub-scope fase yang disetujui, bukan seluruh daftar.\n')
print(json.dumps(meta,ensure_ascii=False,indent=2))
