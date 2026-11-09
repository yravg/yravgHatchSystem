# HatchSystem board v0.2

54tickets all draft. Human promotes BOTH board+rd; design acceptance not readiness. Watchdog FIRST; router no code/decomposition; worktrees; team contract; same-worker fixes; Merger+Checker; Reproducer twice. Within approved release do backend/edge/contracts lane first, then UI integrations. V1 T52 stays outside MVP unless owner approves.

| ID | Name | Status | Mode | Runs | Notes | Lane |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | [Fondasi monorepo dan kontrak domain](01-foundation/rd.md) | done | solo | alongside independent approved work only | MVP; D25, D29 | foundation-backend-first |
| 46 | [API identitas, tenancy dan staff 2FA](46-identity-api/rd.md) | done | solo | waits on 01 (done artifacts) | MVP; D02, D16, D25 | backend-first |
| 47 | [API stasiun, tarif rasional dan minimum payment](47-catalog-pricing-api/rd.md) | done | solo | waits on 46 (done artifacts) | MVP; D01, D26 | backend-first |
| 48 | [Ledger dan Midtrans QRIS server tanpa UI](48-ledger-payments-api/rd.md) | done | team | waits on 46, 47 (done artifacts) | MVP; D06, D15, D17 | backend-first |
| 50 | [Gateway edge dan pairing/lease core headless](50-edge-core/rd.md) | ready | team | waits on 46, 47 (done artifacts) | MVP; D04, D07, D09, D27, D28, D32 | backend-first |
| 49 | [Koordinator sesi dan console-to-seat transfer API](49-session-api/rd.md) | ready | team | waits on 47, 48, 50 (done artifacts) | MVP; D01, D06, D07, D26 | backend-first |
| 51 | [Kotlin TV provisioning, reboot dan offline core](51-android-tv-core/rd.md) | ready | team | waits on 50 (done artifacts) | MVP; D04, D09, D27, D28, D32 | backend-first |
| 52 | [Booking, deposit, wallet dan pass eligibility API](52-booking-wallet-api/rd.md) | draft | team | waits on 47, 48, 49 (done artifacts) | V1; D03, D10, D26, D31 | backend-first |
| 53 | [API stok, pesanan dan X/Z shift close](53-operations-api/rd.md) | ready | team | waits on 48, 49 (done artifacts) | MVP; D08, D17, D30 | backend-first |
| 54 | [Kontrak, simulator dan fault-check headless](54-backend-contract-check/rd.md) | ready | solo | waits on 46, 47, 48, 49, 50, 51, 53 (done artifacts) | MVP; D04, D06, D07, D29 | backend-first |
| 02 | [Identitas, tenant dan otorisasi per outlet](02-identity-tenancy/rd.md) | draft | solo | waits on 01, 46 (done artifacts) | MVP; D02, D16, D25 | ui-after-backend |
| 03 | [Katalog stasiun, aset, zona dan denah](03-stations-catalog/rd.md) | draft | solo | waits on 02, 47 (done artifacts) | MVP; D04 | ui-after-backend |
| 04 | [Tarif versi, paket dan kutipan biaya](04-rates-quotes/rd.md) | draft | solo | waits on 03, 47 (done artifacts) | MVP; D01, D03, D26 | ui-after-backend |
| 06 | [POS, kas dan buku pembayaran append-only](06-cash-sales-ledger/rd.md) | draft | solo | waits on 02, 04, 48 (done artifacts) | MVP; D01, D06, D15 | ui-after-backend |
| 07 | [QRIS Midtrans sandbox dan rekonsiliasi](07-midtrans-qris/rd.md) | draft | solo | waits on 06, 48 (done artifacts) | MVP; D06, D15 | ui-after-backend |
| 12 | [Reservasi, deposit, buffer dan no-show](12-bookings/rd.md) | draft | solo | waits on 03, 04, 06, 52 (done artifacts) | V1; D10, D31 | ui-after-backend |
| 15 | [Produk, stok, resep dan costing](15-inventory-recipes/rd.md) | draft | solo | waits on 06, 53 (done artifacts) | MVP; D17 | ui-after-backend |
| 19 | [Pairing aman dan capability probe](19-pairing-capabilities/rd.md) | draft | solo | waits on 02, 03, 50 (done artifacts) | MVP; D04, D09, D27, D28, D32 | ui-after-backend |
| 20 | [Venue edge, lease offline dan otoritas tunggal](20-venue-edge-leases/rd.md) | draft | team | waits on 01, 02, 19, 50 (done artifacts) | MVP; D06, D07, D09, D27, D28 | ui-after-backend |
| 05 | [Sesi fixed/open, jeda, pindah dan berhenti](05-session-lifecycle/rd.md) | draft | team | waits on 03, 04, 20, 49 (done artifacts) | MVP; D01, D06, D07 | ui-after-backend |
| 08 | [Struk, cetak ulang dan jembatan printer](08-receipts-printing/rd.md) | draft | solo | waits on 06, 20, 50 (done artifacts) | MVP;  | ui-after-backend |
| 09 | [Dompet IDR, bonus dan batas belanja offline](09-wallets-bonuses/rd.md) | draft | solo | waits on 06, 07, 20, 52 (done artifacts) | V1; D03, D07, D15 | ui-after-backend |
| 10 | [Tabungan waktu, penebusan dan kedaluwarsa](10-saved-time/rd.md) | draft | solo | waits on 05, 06, 52 (done artifacts) | V1; D03, D26 | ui-after-backend |
| 11 | [Member, reward, tingkat dan voucher](11-members-loyalty/rd.md) | draft | solo | waits on 06, 09, 10 (done artifacts) | V1; D03, D10, D16 | ui-after-backend |
| 13 | [Portal pelanggan dan akses QR/receipt](13-customer-self-service/rd.md) | draft | solo | waits on 05, 07, 09, 12 (done artifacts) | V1; D10, D16 | ui-after-backend |
| 14 | [Pesanan F&B, tagihan gabungan dan KDS](14-food-kitchen/rd.md) | draft | team | waits on 05, 06, 15, 53 (done artifacts) | MVP;  | ui-after-backend |
| 17 | [Shift kasir dan serah terima sesi aktif](17-shifts-cash/rd.md) | draft | solo | waits on 06, 08, 53 (done artifacts) | MVP; D08, D30 | ui-after-backend |
| 18 | [Laporan owner, utilisasi dan liability](18-reports-finance/rd.md) | draft | solo | waits on 15, 17 (done artifacts) | V1; D08, D17 | ui-after-backend |
| 21 | [Agent Kotlin Android/Google TV dan expiry](21-android-tv-agent/rd.md) | draft | team | waits on 19, 20, 51 (done artifacts) | MVP; D04, D06, D09, D27, D28, D32 | ui-after-backend |
| 22 | [Remote TV aman, timer dan media sendiri](22-tv-remote-media/rd.md) | draft | solo | waits on 21 (done artifacts) | V1; D04, D09 | ui-after-backend |
| 23 | [Adapter CEC/HDMI/IR untuk LG dan Samsung](23-external-tv-adapters/rd.md) | draft | team | waits on 19, 20 (done artifacts) | MVP; D04, D12, D28 | ui-after-backend |
| 24 | [Kesehatan fleet, update bertanda tangan dan rollback](24-fleet-updates/rd.md) | draft | solo | waits on 20, 21 (done artifacts) | V1; D12 | ui-after-backend |
| 25 | [Chat operator, alarm dan notifikasi berizin](25-chat-notifications/rd.md) | draft | solo | waits on 05, 14 (done artifacts) | V1; D10, D16 | ui-after-backend |
| 26 | [Billboard, customer display dan privasi](26-public-displays/rd.md) | draft | solo | waits on 05, 14 (done artifacts) | V1; D10, D16 | ui-after-backend |
| 27 | [Windows seat lock dan player shell](27-windows-seat/rd.md) | draft | team | waits on 05, 20 (done artifacts) | V1; D11, D12, D16 | ui-after-backend |
| 28 | [Katalog game dan integrasi lisensi sah](28-game-library-licenses/rd.md) | draft | solo | waits on 03, 27 (done artifacts) | V1; D18 | ui-after-backend |
| 29 | [Patching, image PC dan save portability](29-pc-content-imaging/rd.md) | draft | solo | waits on 27, 28 (done artifacts) | V2; D18, D19 | ui-after-backend |
| 30 | [Keamanan, privasi, audit dan restore](30-security-privacy-backups/rd.md) | draft | solo | waits on 02, 06, 20, 46, 50 (done artifacts) | MVP; D09, D16, D20 | ui-after-backend |
| 32 | [Turnamen, bracket dan komunitas](32-tournaments-community/rd.md) | draft | solo | waits on 11, 12, 26 (done artifacts) | V1; D10 | ui-after-backend |
| 33 | [Multi-cabang, konfigurasi dan entitlement sendiri](33-branches-entitlements/rd.md) | draft | solo | waits on 02, 03 (done artifacts) | V1; D05, D07 | ui-after-backend |
| 16 | [Supplier, PO, penerimaan dan mutasi gudang](16-procurement-transfers/rd.md) | draft | solo | waits on 15, 33 (done artifacts) | V1; D17 | ui-after-backend |
| 34 | [Sewa bawa pulang dan custody aset](34-take-home-assets/rd.md) | draft | solo | waits on 03, 06, 12 (done artifacts) | V2; D10, D16, D21 | ui-after-backend |
| 35 | [Staf, kehadiran dan payroll ekspor](35-hris-payroll/rd.md) | draft | solo | waits on 02, 17 (done artifacts) | V1; D16, D22 | ui-after-backend |
| 36 | [Akuntansi dan laporan pajak Indonesia](36-indonesia-tax-accounting/rd.md) | draft | solo | waits on 06, 18 (done artifacts) | V1; D17, D22 | ui-after-backend |
| 37 | [AI helper dengan preview dan persetujuan](37-ai-assistants/rd.md) | draft | solo | waits on 15, 18, 30 (done artifacts) | V2; D16, D23 | ui-after-backend |
| 38 | [Pilot agent HP/tablet rental](38-android-mobile-kiosk/rd.md) | draft | solo | waits on 20, 30 (done artifacts) | V2; D04, D11, D12 | ui-after-backend |
| 39 | [Feasibility native webOS dan Tizen](39-native-tv-feasibility/rd.md) | draft | solo | waits on 23, 30 (done artifacts) | V2; D04, D12, D19 | ui-after-backend |
| 40 | [Kios mandiri dan coverage iOS](40-kiosk-ios-wrapper/rd.md) | draft | solo | waits on 13, 26, 30 (done artifacts) | V2; D11, D19 | ui-after-backend |
| 41 | [Migrasi dry-run, rekonsiliasi dan rollback](41-migration-recovery/rd.md) | draft | solo | waits on 06, 09, 10, 15, 30 (done artifacts) | V1; D16, D20 | ui-after-backend |
| 31 | [Sertifikasi hardware dan QA lintas alur](31-certification-qa/rd.md) | draft | team | waits on 05, 07, 08, 14, 17, 18, 21, 22, 23, 24, 25, 26, 27, 30, 41, 54 (done artifacts) | V1; D04, D06, D07, D12 | ui-after-backend |
| 42 | [API publik, SSO dan integrasi berizin](42-api-sso-integrations/rd.md) | draft | solo | waits on 02, 06, 30 (done artifacts) | V1; D16, D24 | ui-after-backend |
| 43 | [B2B, konsinyasi dan unit grosir](43-advanced-commerce/rd.md) | draft | solo | waits on 15, 16, 18 (done artifacts) | V2; D17 | ui-after-backend |
| 44 | [Konten venue, feedback dan Bahasa Indonesia](44-content-localisation/rd.md) | draft | solo | waits on 02, 25, 26 (done artifacts) | V1; D10, D16 | ui-after-backend |
| 45 | [Runbook operator, sandbox dan bantuan](45-operator-runbook/rd.md) | draft | solo | waits on 01, 03, 19 (done artifacts) | MVP;  | ui-after-backend |

## Coverage summary
{"source_counts": {"FR-KPS": 69, "FR-SENET": 129, "FR-KULA": 520, "market_F": 284}, "total_traceability_rows": 1089, "canonical_vertical_slices": 54, "own_gap_requirements": 15, "dispositions": {"ticket": 840, "deferred": 104, "out-of-scope": 145}, "starred_kula_rows": 144, "version": "0.2", "own_v02_requirements": 18, "design_screens": 82, "design_components": 58, "tickets": 54, "wireframed_screens": 58, "design_status": "v0.2 final layout; brand provisional"}

[COVERAGE.md](COVERAGE.md), ../ID-CROSSWALK.md, ../COORDINATION.md, ../design/DESIGN-NOTE.md. DS-GATE-FINAL ACCEPTED:82screens/58wireframed/58components; brand colours provisional only, no design wait. NG01..NG06 remain out-of-scope. Backend46..53 implement services; original UI tickets consume, no duplicate APIs. All deps must really be done.
