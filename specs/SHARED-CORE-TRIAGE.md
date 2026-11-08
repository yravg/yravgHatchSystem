# Shared-core triage — alasan fase

Basis upstream SHARED-CORE.md; row FR-KULA individual tetap di COVERAGE dan requirements.json. Ini alasan desain sendiri, bukan plan/pricing vendor. Ticket owner menentukan semua acceptance; URL/route-only claim belum runtime proof.

| Kapabilitas | Fase | Owner | Alasan / batas |
|---|---|---|---|
| Checkout, barcode/search, cart park, variant/add-on, custom price approval | MVP |06|Kasir dasar; price override audited, reason dan permission |
| Diskon item/total, promo approval | MVP/V1 |04,11|Pricing snapshot MVP; earned loyalty V1 |
| Split tender, pending bank transfer/EDC note | MVP |06,07|Cash/verified QRIS; manual note tidak paid tanpa proof |
| Piutang customer/tab, deposit allocation | MVP/V1 |06,12|Separate receivable/liability; limit/tempo policy owner |
| Void/refund/item returns | MVP |06|Append-only reversal, external refund pending sampai verified |
| Thermal/PDF/link receipt | MVP |08|Certified bridge; no universal web Bluetooth |
| WA receipt/send | V1 |25|Draft/sandbox; actual send butuh consent/action approval |
| Offline checkout queue | MVP |20|Edge durable; new credit/start allowance0 default, no generic full offline claim |
| B2B invoices/delivery notes | V2 |43|Bukan inti venue walk-in, tetap audit/defer |
| Product/category/barcode/variants/base stock | MVP |15|F&B/peripheral core |
| Multi-unit simple conversion | MVP |15|Recipe/stock exact base unit; advanced wholesale V2 |
| Wholesale tiers/consignment settlement | V2 |43|Cost/ownership complexity bukan pilot |
| Stock events, opname, low-stock, recipes/HPP | MVP |15|Event cutoff+version cost, tanpa histori overwrite |
| Serial/custody takehome | V2 |34|Asset setup MVP03; rental custody/deposit/dispute later |
| PO, invoice supplier, partial goods receiving | V1 |16|Procurement after stock stable |
| Branch/gudang transfer and cost layers | V1 |16|Requires multi-outlet auth33 |
| CRM/member groups, points/expiry/rewards | V1 |11|Wallet/time not merged; consent minimal |
| Customer profiling/segmentation | V1/V2 |11,37|Historical report allowed; AI advisory V2 |
| Reviews/member pages | V1 |44,13|Scoped and opt-in public alias |
| Chat | V1 |25|Station-bound token; retention approval |
| Vouchers/designer, referral/birthday offers | V1 |11|Own templates, no autonomous outbound campaign |
| GL, accounting/tax/Coretax exports | V1 |36|Draft accountant review, no tax filing/legal-rate guess |
| P&L/COGS/cashflow/receivable/expenses | V1 |18|Ledger source, wallet/deposit not revenue |
| Item/category/topseller/monthly/heatmap/BEP/targets | V1 |18,35|Explicit formulas; target/commission data scoped |
| Shift report/drawer/handover | MVP |17|Daily cashier operation |
| CSV/PDF/multi-sheet XLSX | V1 |18|Async scoped snapshots; export metadata |
| Staff permissions/login audit | MVP |02,30|Server security from first slice |
| Schedule/late tolerance/leave/overtime/payroll/payslip/profit share | V1 |35|Draft export only, formula approval |
| GPS/geofence/selfie attendance | V1 optional |35|Disabled absent consent/retention; manual attendance first |
| Staff cash advances | V1 |35|Separate receivable, no autonomous payout |
| AI invoice OCR/restock/bundling/forecast/voice/copy | V2 |37|Mock preview-only; owner provider/budget/data approval |
| Multi-store/owner config/dashboard | V1 |33,18|Tenant isolation MVP02; comparison later |
| Telegram/WA/push/notification | V1 |25|Sandbox/draft, explicit approved recipients |
| Printer/store-profile/own receipt assets | MVP |08|No competitor footer or branded template |
| Public QR ordering | V1 |13,14|KDS cashier order MVP; customer auth/token after V1 |
| Delivery map/order logistics | V1/V2 |14,34|Venue QR pickup V1; external courier/takehome V2, no paid booking |
| Omnichannel/marketplace integrations | Out of scope |45 audit|No approved channel/provider contract; request new ticket if needed |
| SaaS commercial subscription/invoicing | Out of live scope |33|Config entitlement V1 only, own prices D05 unresolved |
| Customer checkout/lobby/waiting boards | V1 |26|Read-only redacted projections |
| Unattended selfservice kiosk | V2 |40|Fraud/session-reset/hardware readiness later |
| PWA/admin/mobile browser | MVP/V1 |01,13|Shared web; iOS Safari PWA explicit V1 |
| Changelog/training/diagnostics | MVP/V1 |45,44|Own docs, no copied tutorials |
| Google/Microsoft SSO/public API | V1 |42|OfficialOIDC/scoped API, no signup in build |
| Vendor reseller white-label/admin referral business | Out of scope |45 audit|Not a gaming venue requirement, not vendor-company clone |
| Literal pharmacy/patient/pet/laundry/repair/craft/photobox | Out of scope |45 audit|Not product domain; reusable abstract capabilities tracked separately |

MVP/V1 source candidates moved V2 have explicit owning ticket/reason in COVERAGE. This table does not create extra source IDs or new hidden scope.
