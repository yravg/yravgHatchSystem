# HS-T47 results (worker report, not yet Merger/Checker accepted)

Status of the ticket is unchanged. Branch `t47-pricing`, base f7efd2c. Verification level: automated integration on real PostgreSQL, fixture clock and secrets. No UI, browser, hardware or real payment. **Every money figure (Rp10.000/hour, Rp12.000/hour, Rp5.000 minimum covering 30 minutes) is a sandbox fixture; production money policy (D01, D26) is NOT approved.**

## Gates (exit codes in evidence/gates.txt)
All exit 0 except `git push` (128, no access from this host; commits are local). `pnpm test` 13 files / 147 tests (34 new: pricing 14, api 18, migrate 2). `pnpm test:ticket -- 47` and `-- 46` OK. Validator on a clean export PASS 16764/16764. Migration CLI up/down/up on hatch_t47 passed.

## Red first
evidence/red-first-pricing-core.log: pricing core tests failed before code (the core functions did not exist). evidence/red-first-api.log: API tests failed with 404 before the routes existed.

## Acceptance
| Requirement | Evidence |
| --- | --- |
| AC-HS-47 / V02-01 one reserve wins | tests/pricing/api.test.ts: 12 concurrent real-HTTP reserves give one 200 and eleven 409 (one conditional UPDATE, Postgres row lock) |
| 61 s at Rp10.000/hour = 610000/3600 = Rp169, rounded once | pricing.test.ts and api.test.ts; 61 one-second parts also give 169 |
| rule version cannot alter an old quote | api.test.ts: GET of the old quote is identical after version 2; DB triggers refuse UPDATE/DELETE on rule versions and quotes |
| AC-HS-V02-02 minimum 5.000 / 30 min, then 12.000/hour | 20 min 5.000, 30 min 5.000, 40 min 7.000 (pure core and API); pause not billable and not consuming cover; once per session across retry, reconnect, zone transfer (pure core); disabled by default |
| insufficient balance cannot activate | pure `canActivate(balance, required)` returns INSUFFICIENT_BALANCE with shortfall; no sessions or wallets built |
| tenant/outlet scope, role denial | cross-tenant and cross-outlet 404, cashier 403 on create, body tenantId rejected, 401 without session |

## Decisions and assumptions (need owner lock)
- Rounding: nearest rupiah, half up, once at the end (D01 sandbox). Exact value keeps denominator 3600.
- New permissions: `station.manage` (owner, manager) and `rate.manage` (owner only) added to T46 permissions.ts; no existing role was widened. Read, reserve and quote use `session.manage`. `rate.manage` has no step-up (not in STEP_UP_PERMISSIONS): owner to decide.
- Station conflict (reserve of a taken station, duplicate name) uses REVISION_CONFLICT 409 with a `reason` detail; no new domain error code.
- A new rate version must have `effectiveFrom` later than the latest version. A quote uses the version effective at server time.
- Ceilings of Rp1.000.000.000.000 per money value and 31 days per segment are sandbox guards, not business rules.
- Changed T46's tests/identity/migrate.test.ts: it asserted the migration list was exactly `["0001_identity"]`, now lists both.

## Not checked
Zone transfer through HTTP (the quote API has one rule per outlet; transfer is proven in the pure core only). No per-station or per-category rule. No audit-event table beyond the append-only versions and quotes. No load test. Push to origin failed (access rights).
