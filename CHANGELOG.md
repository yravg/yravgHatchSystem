# Changelog

## Unreleased
- T46 identity, tenancy and staff 2FA API (`services/api/src/identity`, `tenancy`): cookie sessions with CSRF header, server-derived tenant/outlet, role grants, TOTP enrol/confirm/challenge/recover/revoke with sealed secrets, single-use hashed recovery codes, step-up TTL, replay guard, 10-attempt limits per actor and per source, audit trail, and a Postgres idempotency store that returns 409 for same-key/different-payload including concurrent requests. Fixture secrets only; migrations 0001 up/down tested on `hatch_t46`.
- Owner marked the backend chain ready: T46, T47, T48, T50, T49, T51, T53, T54 (board.md and rd.md). T47/T48 money values are sandbox fixtures only.
- Tailscale-only preview of the T01 web scaffold and API health probe on the build VPS (ports 3100/3101, not public); recorded in docs/handoff.
- T01 marked done after Merger (e96d0fe) and independent Checker PASS; spec-v0.2 now contains the T01 foundation.
- Imported HatchSystem specification v0.2 (363 files) into the repo root; README and MIT LICENSE unchanged.
- tools/validate_spec.py: Windows path fix for the design-shots allow-list, the repo's own .git is no longer reported as a packaged artifact, and the ticket status check now requires board.md and rd.md to agree instead of requiring draft.
- T01 (foundation monorepo and domain contracts) marked ready on owner approval; roadmap and handoff added under docs/.
- T01 foundation: pnpm workspace with strict TypeScript, lint, typecheck, vitest and a ticket dispatcher (`pnpm test:ticket -- 01` fails on missing, skipped or failing mandatory tests); one JSON Schema protocol source with generators for TypeScript, Kotlin and .NET plus a canonical-JSON equality check; domain money, envelope, idempotency and tenant/permission/revision guards; Fastify, worker and Next.js scaffolds; UI tokens for the two T01 components; Gradle and .NET shells; CI workflow. No product flow.
- T01 verification on Linux: Kotlin and .NET canonical-equality run and pass; Gradle 9.9.0 wrapper committed; Node pinned to 26.13.0; binary evidence is git-ignored. Linux Playwright smoke is BLOCKED (missing system libraries).
- T01 follow-up: .NET SDK pinned by global.json (10.0.403), CI actions pinned to commit SHAs.
