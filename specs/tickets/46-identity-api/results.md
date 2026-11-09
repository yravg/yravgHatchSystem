# HS-T46 results (worker report, not yet Merger/Checker accepted)

Status of the ticket is unchanged; the router changes board.md and rd.md after Merger and Checker.
Branch `t46-identity`, base b4e70b1. Verification level: automated integration on real PostgreSQL 18.6 with fixture secrets and a fixture clock. No UI, browser, hardware, real authenticator or real account was involved.

## Gate commands (full list with exit codes: evidence/gates.txt)
| Command | Exit | Result |
| --- | --- | --- |
| pnpm install --frozen-lockfile | 0 | lockfile includes drizzle-orm 0.45.4, pg 8.23.1, @types/pg 8.23.1 (exact pins) |
| pnpm lint | 0 | |
| pnpm typecheck | 0 | |
| pnpm test | 0 | 10 files, 113 tests (66 T01 + 47 new) |
| pnpm test:ticket -- 46 | 0 | 50 mandatory checks PASS, none missing/skipped |
| python3 -I tools/validate_spec.py, in this worktree | **1** | 17602/17603. Only failing check: "no prohibited vendor/raw/binary artifacts"; all 21604 flagged paths are under `node_modules/` created by `pnpm install`. Validator not edited. |
| same validator on `git archive HEAD` (no node_modules) | 0 | PASS 16764/16764 |
| migration up / down / up on hatch_t46 | 0 / 0 / 0 | 11 -> 1 -> 11 tables |
| git push origin t46-identity | **128** | `Permission denied (publickey)`: deploy key not added. Commits are local only. |

## Acceptance
| Requirement | Evidence (tests/identity/...) |
| --- | --- |
| AC-HS-46 role/outlet/tenant server-side | identity.test.ts "sessions and tenancy" (tenant/outlet from session, unknown body members rejected, outlet choice limited to grants, 403 vs 404, grant revoked takes effect next request, CSRF, logout); migrate.test.ts (composite FKs block cross-tenant children; only owner may span outlets) |
| AC-HS-46 TOTP enrol/recovery/revocation, step-up for owner/refund approvals | enrol-confirm, pending-login challenge, step-up TTL (`/test/refund-approve` stands in for T48), recovery once and no step-up, owner revoke with audit and session kill |
| AC-HS-46 10 wrong attempts, replay, recovery hash-only | per-actor and per-source locks, 11th attempt 429 even with the right code, lock lifts after the window; replay rejected; recovery codes stored as HMAC only |
| AC-HS-V02-07 server time, narrow skew, verified enrolment | totp.test.ts RFC 6238 vectors, skew +-1 step; unconfirmed factor cannot challenge |
| AC-HS-V02-07 fail closed, no secret in logs, fixture secrets only | unreadable or missing factor gives 403 MFA_REQUIRED; log capture test; every secret in tests/identity/support.ts is labelled FIXTURE |
| AC-HS-V02-07 support cannot bypass | no support role or endpoint; only an owner with a fresh step-up can revoke another member, with a reason, an audit row (append-only trigger) and all target sessions killed |
| T01 gap: same key + different payload is 409 over HTTP, also concurrent | idempotency.ts uses a Postgres unique row inserted in the effect's transaction; tests for sequential and concurrent (different and same payload) |
| Edge cases | clock rollback (session dies, accepted code stays rejected), two app instances racing one code (exactly one wins), restarted instance keeps sessions and replay guard, stale revision 409, cross-tenant 404, revoked permission |

Mutation check (5 deliberate breaks, all caught): evidence/mutation-check.txt.

## Decisions I made that need owner lock (ASSUMPTION, recommended fixtures only)
- Roles needing a second factor: owner and manager. Step-up permissions: refund.approve, price.override, staff.manage, mfa.revoke.other, outlet.config. Permission strings per role are in services/api/src/tenancy/permissions.ts (D02 text only names the roles).
- Numbers: step-up 300 s, session 12 h, attempt window 15 min, 10 recovery codes of 80 bits, TOTP SHA1/6 digits/30 s with +-1 step skew.
- A replay is stricter than the contract: the accepted TOTP step must be greater than the last accepted one (monotonic), not just unused.
- Recovery code login gives NO step-up. Revoking your own factor also needs step-up.
- New error codes outside the T01 catalog (kept local in identity/errors.ts so packages/domain is untouched): UNAUTHENTICATED 401, RATE_LIMITED 429, MFA_REQUIRED, STEP_UP_REQUIRED, MFA_INVALID, MFA_ALREADY_ENROLLED.
- POST/DELETE /auth/session take no Idempotency-Key (a replayed login would have to store a session token). All other mutations require it; its sealed snapshot is stored in Postgres.
- Fixture login is email + password (scrypt). OIDC is D24 and not built.

## Not checked / not done
- Test-first was not followed: tests were written after the code (substitute: mutation check above).
- No Row Level Security; isolation is explicit tenant-scoped queries plus composite foreign keys.
- No server bootstrap exists in the repo, so nothing reads the 32-byte server key from the environment yet; callers pass `IdentityDeps.key`. Key rotation and storage are unaddressed.
- Source rate limiting uses `req.ip`; behind a proxy Fastify `trustProxy` must be configured by whoever deploys, otherwise every client shares one source.
- Sole owner who loses both authenticator and recovery codes has no API path (by design); an out-of-band audited procedure needs an owner policy.
- No load, timing-attack or fuzz testing; no real authenticator app was used; T02 consumption not exercised.
- hatch_t46 public schema is left migrated (up). No servers or test runners were left running.
- Git author: no git identity was configured in this worktree or the project checkout, contrary to the brief. I did not change config; commits use GIT_AUTHOR_*/GIT_COMMITTER_* environment values "Claude Sonnet 5.5 <noreply@anthropic.com>". The lead may rewrite the author.
