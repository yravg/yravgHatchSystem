# Kontrak domain/API/protokol v1 — draft normatif

Bahasa UI Indonesia; field protokol English agar lintas bahasa stabil. Seluruh policy uang/security/data masih ASSUMPTION sampai keputusan owner. Kontrak ini lebih tinggi dari interpretasi source row. Ticket01 membuat OpenAPI/JSON Schema dan generator TypeScript/Kotlin/.NET dari satu sumber; jangan menduplikasi tipe manual. Arsitektur request/response bukan kode vendor.

## 1. Identitas, nilai dan envelope

- ID opaque UUIDv7 atau UUIDv4 CSPRNG; tidak ada nomor telepon/merchant secret pada URL. Resource publik memakai token acak256bit, hash tersimpan, expiry dan scope.
- `tenantId`, `outletId` diturunkan dari authenticated context, tidak dipercaya dari client. Setiap FK domain membawa tenant/outlet; unique dan RLS/explicit server query scoped; per-request transactional tenant setting aman pada connection pool. Cross-tenant return404 agar tak membocorkan existence; role denial403.
- Uang final integer rupiah dalam Postgres BIGINT; JSON decimal string (contoh `"18000"`) agar tidak kehilangan precision JS. Durasi integer detik, tariff rational numerator/denominator dengan aritmetika integer. Rounding sekali sesuai rate version. Jangan memakai floating point untuk ledger.
- Waktu UTC RFC3339 di API, outlet IANA timezone untuk tarif/display/business-day; Asia/Jakarta hanya fixture outlet, bukan zona pelaporan chat. UI label zona outlet jelas.
- Mutation memakai `Idempotency-Key` acak UUID dan `If-Match`/`expectedRevision`. Key scoped tenant+actor+route, requestHash, response snapshot. Key sama/payload berbeda409, replay sama hasil sama. Dedup record finansial tidak kedaluwarsa sebelum retention ledger disetujui.
- Success `{data,revision,requestId,serverTime}`. Failure `{error:{code,messageKey,retryable,details},requestId}`. UI memetakan messageKey ke Bahasa sendiri. `details` tidak mengandung PII, stacktrace, token atau key.
- List cursor pagination default50/max200; snapshot timestamp; never unbounded export in request. Export job scoped, short-lived signed download dan audit.

## 2. Data model dan invariants

| Aggregate | Fields/relations utama | Constraints |
|---|---|---|
| Tenant, Outlet, Zone | timezone, businessDayCutoff, configVersion, zone type | Outlet belongs one tenant; no implicit cross-tenant sharing |
| Staff, RoleGrant, StaffSession | tenant/outlet scopes, permission, MFA state | Owner/manager/cashier/kitchen/technician are separate grants; device has no staff identity |
| Station, StationConsole, Asset | zone, game catalogue, onlineBookable, type, consoleId, serial, maintenance | One station active session at a time; console selection persisted; serial unique per tenant |
| RateRule, Quote | rational rate, minimum/rounding/promo precedence, version, expiresAt | Immutable applied snapshot, money/quantity nonnegative; quote must match station/category |
| Session, SessionEvent | stationId, memberId?, fixed/open, prepaid/postpaid, state, revision, billableSeconds, priceSnapshot | Append-only events; atomic move destination reservation; no separate duplicate bill on retry |
| Sale, SaleLine, Allocation | session/group lineage, qty, unit price, taxes/discounts, immutable finalisation | Allocations <=amountDue, cash over-tender tracked as change; refund <=settled minus prior refunds |
| LedgerTransaction, LedgerEntry | accounts, debit/creditIDR, sourceId, actor, reversalOf | Entries balanced atomically; sourceEvent unique; correction through reversal, never deletion |
| PaymentIntent, ProviderEvent, Refund | merchant, providerOrderId, amount,currency,status,rawHash | Unique tenant+provider+order; settlement match merchant/amount/currency; external refund pending until provider proof |
| Wallet, WalletEntry, OfflineAllowance | main/bonus, source, sequence, reservedBudget | Nonnegative available; bonus nonrevenue; no cross-branch offline spend without preallocated budget |
| TimeCreditBucket, TimeCreditEntry | member, category/outlet, paidSession, seconds, expiresAt | Cannot grant unpaid/refunded entitlement; no reuse; grant/redeem/reverse are atomic |
| Booking, BookingHold, BookingStation | interval, buffer, customer alias, deposit, status | Postgres exclusion over station+effective half-open interval for active reservations/holds; walk-in checks same authority |
| Product, UnitConversion, Recipe | baseUom, rational conversion, version, costs | Base stock unit canonical, no retroactive recipe recost; allergen note not medical guarantee |
| StockMovement, PO, GoodsReceipt, Transfer | qty, cost layers, ownership, inTransit | Append-only; receipt idempotent, no source+destination simultaneous credit |
| Order, KitchenTicket | station/session, status, sequence, items | Order accepted reserves stock, fulfil consumes reservation; cancel reversal exactly once |
| Shift, CashMovement, ShiftClose | cashier/register, openingFloat, expected/actual, variance, handover | Close immutable; noncash excluded; active sessions not killed by close |
| Device, PairingChallenge, CapabilityResult | platform/model/firmware, publicKey, station, input, revokedAt | Challenge expiry/attempt limit; connected != ready != applied |
| EdgeAuthority, DeviceCommand, DeviceAck | epoch, sequence, commandId, expiresAt, received/applied/failed | One fenced edge per outlet; stale revisions never unlock; applied evidence level recorded |
| SessionLease, DeviceEvent | claims/signature, bootId, monotonicAnchor, checkpoint | Trust expiry, not UI timer; offline reboot without trusted clock cannot extend paid time |
| Tournament, Match, Prize | participants, bracket, station booking, fees/results | Matches reserve through booking service; disputes audited, prizes ledger-backed |
| AuditEvent, Backup, ImportJob | actor, pseudonymous subject, source hash, evidence refs | Immutable safety trail; erasure separates profile from legally retained journal |

Data model ini mencakup seluruh vertical slice; V2 tables tidak perlu dimigrasikan sebelum fase disetujui. Uang deposit/wallet/time entitlement adalah liability, bukan penjualan otomatis. Perangkat hanya menerima session/device scopes; tidak boleh membaca seluruh member/payroll.

## 3. Session state machine

`AVAILABLE → RESERVED → STARTING → ACTIVE → PAUSED → ACTIVE → FINISHED → CHECKOUT_PENDING → CLEANING → AVAILABLE`. `STARTING → ACTIVATION_FAILED → RECOVERY/AVAILABLE` setelah kompensasi. Station maintenance dapat dipilih hanya ketika tidak active/reserved. Financial `pending/partially_paid/paid/refund_pending/refunded` adalah sumbu terpisah; tidak dikodekan ke warna station.

Start:
1. Reserve station secara atomik setelah quote valid; booking conflict check sama dengan walk-in.
2. Prepaid: payment terverifikasi atau saldo dibekukan/didebit; postpaid: staff authorised. Tidak membiarkan gateway bayar dahulu tanpa reserve/expiry yang konsisten.
3. Buat session `STARTING`, event/outbox dan command revision atomik. Kirim via edge; clock billable mulai hanya setelah APPLIED level yang diizinkan per adapter.
4. `RECEIVED` berarti command durable, bukan layar terbuka. `APPLIED` adalah observasi API/status yang tersedia, **bukan bukti optik** kecuali sensor/lab evidence. Adapter tanpa feedback diberi `COMMANDED_ONLY`; manual operator attestation perlu izin dan audit, tidak dipalsukan sebagai device proof.
5. Timeout10detik fixture membuat pending/failed, staff UI jujur; retry memakai commandId yang sama. Reconciliation memeriksa actual observed state sebelum me-release station. Pembayaran settled yang gagal start masuk refund_pending; tidak mengklaim dana sudah kembali.
6. Late ACK setelah cancellation/lease revoke ditolak; lock command revision lebih tinggi memenangi desired state.

Fixed ends at remaining entitlement zero; open billing memiliki lease pendek yang diperbarui berkala ketika authority online (fixture60detik renewal, max120detik horizon), sehingga open bukan indefinite-unlock offline. WAN loss: mode open tidak menjamin unlimited paid time; lock di expiry last lease dan catat billable actual. D07 approval wajib. Pause membuat clock tidak billable untuk fixture D01 dan mengunci gambar; PC user privacy-lock adalah aksi berbeda, billing lanjut. Move: reserve destination, revoke/fence and verify source locked, apply destination lease, commit transfer dengan fencing; failure tidak membuat dua stasiun unlocked. Jika tidak dapat membuktikan exclusivity, hentikan transfer/pending recovery, bukan memperluas waktu.

## 4. REST endpoint families (own routes)

Seluruh path `/api/v1`, auth staff/customer/device sesuai scope. Mutasi di bawah mewajibkan idempotency/revision kecuali webhook ditangani provider dedup. Tanda `{id}` opaque.

| Endpoint | Request inti | Response / gate | Owner |
|---|---|---|---|
| POST /auth/session; GET /me; DELETE /auth/session | login/logout fixture/OIDC session; CSRF protection | HttpOnly Secure SameSite cookie, actor grants; auth failure |02|
| GET/POST /outlets; GET/PATCH /outlets/{id}/config | timezone/configVersion | config snapshot; AUTH_FORBIDDEN |33|
| GET/POST /stations; PATCH /stations/{id} | zone, console references, gameIds, onlineBookable, expectedRevision | station read model, capability state |03|
| POST /quotes | stationId, consoleId, sessionMode, paymentMode, durationSeconds?, memberId? | quoteId, expiresAt, ruleVersion, lineItems, totalIDR |04|
| POST /sessions | quoteId, bookingId?, paymentIntentId?, manualMode:false |202 STARTING or409 STATION_BUSY/QUOTE_STALE/PAYMENT_UNCONFIRMED |05|
| POST /sessions/{id}/actions | kind pause/resume/extend/move/end; targetStationId?, addSeconds?, quoteId? |202 requested→device ACK or409 INVALID_TRANSITION; immutable events |05|
| POST /sales; POST /sales/{id}/allocations; POST /sales/{id}/refunds | source lines, cashTenderIDR, payment reference, reason | sale + ledger revision; no silent debt |06|
| POST /payment-intents; GET /payment-intents/{id} | sale/booking/walletTopup, quote, amountIDR | QR action URL from sandbox adapter, pending/status |07|
| POST /payments/midtrans/notifications | provider payload; signature not staff cookie |200 after durable valid event; invalid signature rejected, no credit |07|
| POST /payment-intents/{id}/reconcile | authorised staff/worker | provider status verified and idempotent projection |07|
| GET /receipts/{id}; POST /print-jobs | settled saleId, printerId | PDF/view or printJob pending/printed/failed, no ledger write |08|
| GET /members/{id}/wallet; POST /wallet-actions | main/bonus debit/topup/reversal reference | balance+sequence or INSUFFICIENT_BALANCE |09|
| GET /members/{id}/time-credits; POST /time-credit-actions | paid source session, bucket, seconds | grant/redeem/reverse once or CREDIT_INELIGIBLE |10|
| GET/POST /members; POST /loyalty/redemptions | permitted profile fields, rewardId, saleId | member/reward receipt; no auto marketing consent |11|
| GET /public/venues/{slug}/availability; POST /booking-holds | interval, stationIds, token/guestAlias | holdId expiry; BOOKING_CONFLICT |12|
| POST /bookings; POST /bookings/{id}/actions | holdId, deposit payment, confirm/cancel/check-in | status/deposit ledger; no-show policy version |12|
| POST /public/access-challenges; POST /public/session-starts | short-lived station/booking challenge, receipt token | scoped session credential, no tenant enumeration |13|
| POST /orders; GET /kitchen/orders; POST /orders/{id}/actions | items/baseUom, station session, notes, expectedRevision | order sequence and reserve/consume stock events |14|
| GET/POST /products; POST /inventory/movements; POST /stocktakes | quantity decimals as rational strings, reason/cost version | stock history, no arbitrary balance overwrite |15|
| POST /purchase-orders; POST /goods-receipts; POST /transfers/{id}/receive | PO/item qty and document reference | receipt/transfer revision + supplier liability |16|
| POST /shifts/open; POST /shifts/{id}/close; POST /shifts/{id}/handover | openingFloat/actualCash/reason/nextActor | immutable close/interim summaries |17|
| GET /reports/{kind}; POST /exports | snapshot, outlet/date scopes | jobId, redacted signed download URL |18|
| POST /device-challenges; POST /device-pairings; POST /devices/{id}/probes | code, staff approval, publicKey, capability request | binding, expiresAt, DEVICE_UNSUPPORTED/PERMISSION_REQUIRED |19|
| POST /edges/{id}/reconcile; GET /devices/{id}/desired-state | epoch, lastSequence, events | ordered delta/authoritative revision; stale rejected |20|
| POST /devices/{id}/acks; POST /devices/{id}/events | DeviceAck/DeviceEvent | durable ACK status, desired-state reconciliation |20/21|
| POST /devices/{id}/commands | safe volume/mute/input/idle/restart/message; actor reason | commandId or unsupported; active-session safety |22|
| POST /fleet/releases; POST /fleet/rollouts | signedManifest, target cohort, idleOnly | approval-required staged status/rollback |24|
| POST /messages; GET /messages; POST /notification-jobs | station-scoped token, escaped body, consent | unread/retry state, sandbox sink default |25|
| GET /displays/{token} | read-only scoped token | redacted public projections, no raw member identity |26|
| POST /games; POST /license-checkouts | owned metadata, permitted title/license slot | leased concurrent entitlement or denial |28|
| POST /privacy/exports; POST /privacy/erasures; POST /emergency-overrides | verified subject/admin, scope, reason, approved retention | job/temporary audit lease, no journal deletion |30|
| POST /events; POST /matches/{id}/results | approved bracket/booking, result/version | winner/dispute/ledger projection |32|
| POST /asset-rentals; POST /asset-rentals/{id}/return | serials/photos/deposit and condition | custody chain/draft damage review |34|
| POST /attendance; POST /payroll-exports | manual/optional consent-based observation | draft payslip, no transfer |35|
| POST /accounting-exports | tax schema version, scoped journal snapshot | draft export, never submit DJP |36|
| POST /assistant-drafts | permitted redacted input, mock provider default | draft recommendations only |37|
| POST /imports/preview; POST /imports/{id}/apply; POST /imports/{id}/rollback | source hash, mapping, approved import | audited idempotent batch/reversal |41|
| GET /public-api/reports; POST /sso/callback | scoped API/OIDC official | least-privilege data, verified state/nonce |42|

No new external side effects (payment/send/store upload) from build. Mock endpoints must not be confused with working integrations.

## 5. SessionLease / command / ACK wire contract

```json
{
  "protocolVersion": 1,
  "leaseId": "uuid",
  "tenantId": "uuid",
  "outletId": "uuid",
  "stationId": "uuid",
  "deviceId": "uuid",
  "sessionId": "uuid",
  "authorityEpoch": 7,
  "revision": 12,
  "mode": "FIXED",
  "remainingSecondsAtIssue": 1800,
  "issuedAt": "2026-11-08T14:00:00Z",
  "notAfter": "2026-11-08T14:30:00Z",
  "permissions": ["DISPLAY_GAME"],
  "keyId": "edge-key-v1",
  "signature": "base64url-detached-Ed25519-signature"
}
```

Example timestamps are UTC wire examples, not user-facing reporting. Sign canonical payload via JCS/RFC8785 (exclude signature); signing key not stored in web/mobile frontend. Cloud delegates bounded outlet signing authority to enrolled edge; edge secure key store, rotation/revocation, expiry and epoch. Device trust bundle pins approved signer, not arbitrary payload keyId. Public keys not secrets; private keys generated in runtime approval path, never included in spec/repo. Sequence/revision BIGINT transport as integer-safe string if beyond JSON safe range; fixture values small.

`SessionCommand={protocolVersion,commandId,stationId,deviceId,authorityEpoch,sequence,expectedRevision,desiredRevision,action,lease?,issuedAt,expiresAt,actorRef}`; action enum `PREPARE|START|PAUSE|RESUME|EXTEND|END|LOCK|SAFE_CONTROL`. Safe controls schema per adapter, no arbitrary shell command, URL fetch or script execution.

`DeviceAck={protocolVersion,commandId,deviceId,authorityEpoch,sequence,desiredRevision,status,verificationLevel,observedInput?,bootId,observedAt,errorCode?}`; status `RECEIVED|APPLIED|FAILED`; verification level `SIMULATED|COMMANDED_ONLY|API_OBSERVED|OPERATOR_ATTESTED|LAB_VERIFIED`. None imply live optical proof; LAB_VERIFIED refers certification result, not all commands. Protocol rejects ACK from revoked/mismatched device or obsolete epoch/revision.

Transport WebSocket over TLS plus mutually authenticated enrolled identity; outbound-only cloud connection. Device local channel must authenticate edge as well. SQLite WAL event/outbox persisted before successful durable response; at-least-once delivery with idempotent effects, never claim literal exactly-once networking.

Offline:
- Same boot: compare remaining monotonic duration and signed `notAfter`; cannot gain time by local wall-clock rollback. Store checkpoints and bootId.
- Reboot: wall-clock alone is untrusted. Require fresh authoritative reconciliation or approved trusted clock evidence; otherwise picture locks and cashier sees recovery, not original duration reset. No guarantee of restart-continuation when time trust is absent.
- WAN down active lease: expiry enforced locally. New offline start/extend/refund/wallet spend default refused; future preallocated budget feature needs D07 owner approval.
- Two edges/split brain: only highest valid fenced epoch can issue; old edge stops grant, agents reject stale epoch. Unreachable revocation cannot be instant; bounded lease/delegation TTL is residual risk owner must approve.
- Emergency override: independent short-lived local authorisation under D09 with append-only audit; not a universal PIN or hidden always-on backdoor.

## 6. Midtrans specifics — current docs and migration conflict

Checked2026-11-08. https://docs.midtrans.com/docs/access-keys says change28Oct2026: notification authentication uses **Signature Secret Key**, distinct from server API key. Older notification pages still show ServerKey formula. Therefore:

- Configure server-only `MIDTRANS_SERVER_KEY`, `MIDTRANS_SIGNATURE_SECRET_KEY_CURRENT`, optional previous signature secret for bounded rotation, `MIDTRANS_MERCHANT_ID`; do not silently fall back to another key when signature fails.
- `expected = SHA512(order_id + status_code + gross_amount + SignatureSecretKey)` using exact provider strings (do not round/reformat `gross_amount` before signing); constant-time compare. Pre-change accounts may initially have equal values; do not assume equality.
- Core API/sandbox auth uses ServerKey server-side. Verify merchant/order/amount/currency and authenticated GET status; bind tenant from stored payment intent, not arbitrary callback field.
- QRIS success requires settlement + acceptable fraud/status, matching reference; pending/expire/deny do not grant. Missing optional fraud field handled according to current QRIS account schema and status verification, never assume `capture` for QRIS simply because card docs use it.
- Persist webhook/event before200; duplicate callback returns200 without duplicate credit. Out-of-order pending after settlement never reverses valid paid status. Retry reconcile if provider unavailable; return safe pending, not success.
- Server HTTP notification scope and callback status check tested with fixture for separate signature/server keys, equal legacy values, rotation old/new, wrong amount/merchant, stale order, network timeout and replay.
- Sandbox only. Refund API action itself is external money movement when live; leave disabled pending explicit approval and account permission. Fraud/late-paid case enters controlled refund_pending queue.

Sources: https://docs.midtrans.com/docs/access-keys ; https://docs.midtrans.com/reference/qris ; https://docs.midtrans.com/docs/https-notification-webhooks . Record doc version/account verification in ticket07 before readiness; documentation inconsistency is D15, not permission to weaken verification.

## 7. v0.2 normative amendments

- Service implementation ownership:46identity,47catalog/pricing,48money/payments,49session coordinator,50edge,51nativeTV core,52booking/wallet/pass,53stock/orders/shift,54contract checks. Original45 consume, not duplicate APIs.
- Add `PassDefinition/PassEntitlement(zoneLevel,categoryAllowlist,seconds,version)` distinct from saved-time bucket. Higher-zone compatibility does not turn credits into rupiah; lower→higher denied before debit, downward only configured category.
- Rate snapshot adds `minimumPaymentIDR`, `coveredBillableSeconds`, `roundingMode`, `roundingUnitIDR`, `rationalRateNumerator/Denominator`, `effectiveVersion`. Minimum optional disabled default; once per session, not per retry/transfer. Accumulate rational billing; final integer rounding once. Policy changes never mutate historical quotes.
- BookingPolicy includes channel/group toggles,maxSeats,min/maxDuration,buffer,availability schedule,active-station future booking flag,checkInWindow,preBookingGuard,notification lead/interval,deposit basis and release-vs-apply/no-show version. Active session never forcibly pre-empted by a booking. System maintenance blocks have no member deposit. Cancellation reason audited.
- `GET /shifts/{id}/x-report` returns snapshot without closing or ledger mutation; `POST /registers/{id}/day-closes` uses idempotency+version and explicit close scope/policy, rejects unresolved open shifts unless approved handover, carries active sessions, captures pending digital payments separately. No broad hidden all-outlet close; no local tax law assumptions.
- `POST /auth/mfa/enroll|confirm|challenge|recover|revoke`: TOTP secret server-encrypted, fixture-only in tests; replay cache per step, rate limits, one-use hashed recovery codes, explicit step-up TTL. Session scopes recorded; no support bypass.
- `POST /webhook-subscriptions`, `GET /webhook-deliveries`, `POST /webhook-deliveries/{id}/retry`: outgoing fixture/sandbox sink only. `X-Hatch-Event-Id`, `X-Hatch-Timestamp`, `X-Hatch-Key-Id`, `X-Hatch-Signature = v1:HMAC_SHA256(secret,timestamp+'.'+rawBody)`; replay window5minutes fixture, unique eventId consumer dedup, TLS+SSRF validation/no private-network redirect target, retries/dead-letter. Never reuse Midtrans provider signature secret for our outgoing hooks.
- TV provisioning state `UNPROVISIONED_APP|PROVISIONED_UNPAIRED|PAIRED|REVOKED|REPAIR_REQUIRED`. Only legitimate certified managed setup promises provisioned-unpaired lock. No paid lease => picture locked; refresh/pairing HTTP result never grants gaming. Ordinary unprovisioned setup may exit honestly. Boot restores locked/remaining valid state; permission check never overrides user/OS revoke. Lost permission requires supported fallback or unsupported-certification result.
- CEC optional/never required. Setup checklist records TV and console CEC-off operator attestation; publicAPI probe if available, never invents console settings API. Test independent picture lock with CEC off. Explicit optional CEC profile cannot be sole expiry enforcement path.
- Transfer ordering supersedes older text: reserve destination+freeze approved delta quote; fence/revoke source grant and prove lock or bounded verified source expiry before destination grant. Unreachable source does NOT permit second active lease. Then apply destination/ACK and commit same session lineage. Destination failure leaves recoverable locked state, no duplicate charge. No optical/uninterrupted-gameplay promise from a different console.
- API+design precedence: API state verifiedpaid/refund_pending distinct from design illustrative auto-credit; visual8status chips are read-model projections, never replacement for domain states. Pairing formatD32 is separate from6digitTOTP.
