# Keputusan terbuka — semua ASSUMPTION, bukan persetujuan

Owner: Enrico/Product untuk money/security/data; teknisi/desain memberi evidence, bukan mengunci kebijakan sendiri. D01–D12 dipertahankan dari rental pack, D13–D24 tambahan. Rekomendasi ini hanya fixture/sandbox; sampai owner memilih, ticket terkait tetap draft. Arsitektur baseline mengikuti request master, tetapi perubahan stack perlu catatan keputusan.

| ID | Class | Choice still open | Recommended default |
| --- | --- | --- | --- |
| D01 | Money | Tarif, pembulatan, minimum, pause, overtime dan promo | Sandbox: Rp12.000/jam, prorata detik dibulatkan sekali ke rupiah terdekat saat final; minimum0, pause tidak ditagih, late fee0, maksimum satu promo; produksi perlu owner. |
| D02 | Security | Peran, outlet dan override | Owner semua outlet tenant; kasir sesi/checkout, kitchen order, teknisi device; manager approve refund/manual harga; deny default. |
| D03 | Money | Saved time, wallet/bonus, expiry dan redemption | Detik internal; bucket satu kategori/satu outlet; expiry30hari fixture saja; tanpa cash-out/transfer; bonus terpisah; produksi owner. |
| D04 | Hardware/security | Model TV, adapter dan native LG/Samsung | Android TV native minimal Android8 kandidat; hanya allowlist firmware setelah uji; LG/Samsung via external adapter; native conditional; tidak ada model certified saat dokumen ini. |
| D05 | Money | Plan, agent caps, harga dan kontradiksi TV-agent vendor | Jangan salin harga/plan. Vendor page Pro2agent vs flag Enterprise-only dan angka Enterprise berbeda. Sandbox cap configurable; commercial billing disabled sampai disetujui. |
| D06 | Money/security | ACK, timeout, reservasi dan kompensasi | Reserve unit dahulu; start menunggu APPLIED. Timeout10detik fixture, retry command sama; charge settled gagal aktivasi → refund_pending otomatis tanpa grant time; external refund disetujui/rekonsiliasi, bukan klaim dana sudah kembali. |
| D07 | Money/security | Otoritas edge, lease, clock dan offline | Satu edge fenced/outlet; lease Ed25519; aktif sah berlanjut; offline start/extend/wallet allowance0 default. Cash food offline boleh antre; tidak mengklaim remote cloud offline. |
| D08 | Money | Shift, variance, timezone dan handover | Asia/Jakarta fixture outlet, business-day04:00; UTC simpan; sesi tidak diputus close; atribusi revenue per completion, pembayaran per shift penerima; catat handover. Owner tetapkan zona per outlet. |
| D09 | Security | Emergency offline override | Kode recovery unik tersimpan hash, dual-role owner/manager, sekali pakai, grace maksimal5menit fixture; alasan dan event wajib; tidak ada PIN universal. |
| D10 | Money/data | Deposit, cancellation/no-show, leaderboard | Guest booking boleh tanpa akun; hold5menit/window10menit fixture; free cancellation sebelum start dan no-show forfeit disabled sampai owner. Display alias opt-in; no auto walk-in ban. |
| D11 | Scope | Phase Windows/mobile/native包装/iOS | Windows V1, Android rental-mobile V2 pilot; iOS PWA V1, wrapper V2 conditional; jangan buat client native tanpa alasan. |
| D12 | Security/spend | Signing, rollout dan lab perangkat | Signed manifest/payload, idle-only canary1%; rollback. Lab/hardware dan sertifikat pembelian memerlukan approval; tidak belanja dari prompt. |
| D13 | Architecture | Stack dan edge wajib untuk garansi offline | Next.js+TS web, Fastify Node/Postgres/Drizzle API, .NET10 edge SQLite, Kotlin native; edge diperlukan untuk mode certified-offline. Cloud-only manual-billing mode berlabel terbatas. |
| D14 | Evidence | Input partial/route-only, rentang parity | Inventory sumber adalah kandidat; no runtime proof. Semua144star ditelusuri ke kapabilitas generik, false positive pet/craft bukan modul bisnis baru. Refine v0.2 setelah evidence. |
| D15 | Money | QRIS Midtrans, merchant dan refund | Sandbox saja; ServerKey untuk API dan Signature Secret Key terpisah untuk signature webhook menurut access-keys28Oct2026 (docs lama konflik). Verifikasi signature+GET status+merchant/amount/currency; uji vector terpisah dan rotasi, no silent key fallback. Merchant/live/refund perlu approval; refund pending sampai provider confirms. |
| D16 | Security/data | Data region, consent, retention dan identitas | ID upload/geolocation kontinu off; logs pseudonymous; sesi pelanggan minimal, rekening/kartu tak disimpan. Usulan chat30hari/logs90hari/ledger sesuai hukum perlu owner; D16 memblokir produksi. |
| D17 | Money | Costing, inventory dan kebijakan akuntansi | Moving average MVP, FIFO selectable V1 effective-version; tidak recalc sejarah; accountant set chart/tax rules. Harga biaya tidak ditampilkan pelanggan. |
| D18 | Legal/security | Game license pools, akun dan cleanup | Pool game disabled sampai hak komersial publisher diverifikasi; akun personal tidak disimpan server; screenshot/shell cleanup bukan jaminan konsol logout. |
| D19 | Scope/spend | Native-TV store distribution dan integrasi diskless | External certified path dulu; native-TV hanya proof API publik+izin store. Integrasikan tools berlisensi bukan clone boot stack; no devmode production bypass. |
| D20 | Data/security | Backup, restore dan RPO/RTO | Target pilot RPO15menit/RTO60menit usulan, daily full+WAL archive terenkripsi; restore drill wajib. Bukan SLA sebelum diukur. |
| D21 | Money/data | Sewa bawa pulang, deposit, kerusakan | V2, checklist/foto/serial; deposit liability, damage fee review manual; tanpa ID scan wajib/GPS customer. |
| D22 | Money/data | HRIS/payroll dan pajak Indonesia | Ekspor draft saja; formula, consent dan retention approval; tidak membayar gaji, tidak submit DJP. Jangan hardcode PPN dari situs vendor. |
| D23 | Money/data | AI provider dan data keluar | Mock default; OCR draft/forecast advisory; tanpa pembayaran, pesan atau mutasi otomatis. Provider/budget/PII approval terpisah. |
| D24 | Security | SSO, public API dan remote support | OIDC resmi optional; API scopes least privilege; remote PC consent per sesi; jangan sign-in di box/room atau buka ADB publik. |

## v0.2 decisions / amendments

D01/D03/D08/D10/D15/D24 remain open policy locks, expanded below. Sandbox fixtures do not authorise production. D25 design-layout acceptance is locked by latest owner steering; this is not blanket ticket-readiness approval.

| ID | State / owner | Decision / recommended default |
|---|---|---|
| D25 | LOCKED layout; brand provisional / owner+Design Desk | Accept final local Design v0.2 hash,82screens,58wireframed,58components. UI no longer waits for design, follows backend deps and human-ready. Brand.* replace after logo with contrast/rerender; no blocking placeholder. Domain/security rules outrank sample figures. |
| D26 | ASSUMPTION money / owner | Rational sub-rupiah accumulation, integer IDR final rounding once; min-payment optional disabled default. When enabled fixtureRp5.000 covers30billable minutes, thenRp12.000/hour extra. Zone passes downward only within approved category; no retroactive repricing or extra minimum on transfer. |
| D27 | ASSUMPTION security/hardware / owner | Venue-owned legitimate managed provisioning required for provisioned-unpaired kiosk lock/reboot guarantees. Ordinary unprovisioned consumer app not certified. Preserve normal overlay grant on supported models; revoked permission fails readiness and repairs/fallback, never hidden grant/root. |
| D28 | NORMATIVE safety / owner request | HDMI-CEC optional, never required. Default setup CEC OFF on TV AND console; must prove start/pause/expire/reboot lock while off. Optional CEC power driver may be unsupported; independent lock route remains. No console mains. |
| D29 | NORMATIVE planning / spec | Nine backend-first tickets46..54 extract service ownership from existing45integration tickets; IDs/source AC retained. No partial-done dependency loophole. All draft until human-ready. |
| D30 | ASSUMPTION money / owner+accountant | X nonmutating repeatable. Z scoped register/outlet/business-day; propose block if other open shifts in chosen scope until manager handover/close. No organisation-wide close or fiscal24h regulation inherited blindly. Active sessions preserved, cash float/QRIS pending separate. |
| D31 | ASSUMPTION money/data / owner | Deposit disabled default; optional basis fixed or percent per-seat hourly quote, explicit release-vs-apply policy. Fixture25% hourly rate, per-seat rounding once. Arrival releases hold once; no-show/latecancel forfeiture disabled until owner-approved disclosed policy. |
| D32 | ASSUMPTION security / owner | Existing8numeric-digit/5minute pairing+staff approval fixture takes precedence over Design6character sample. Keep8box responsive anatomy pending explicit policy lock; challenge refresh revokes old code,5attempts/min/device. TOTP remains6digits and must not be conflated with pairing. |
