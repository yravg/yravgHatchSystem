# Changelog

## Unreleased
- Imported HatchSystem specification v0.2 (363 files) into the repo root; README and MIT LICENSE unchanged.
- tools/validate_spec.py: Windows path fix for the design-shots allow-list, the repo's own .git is no longer reported as a packaged artifact, and the ticket status check now requires board.md and rd.md to agree instead of requiring draft.
- T01 (foundation monorepo and domain contracts) marked ready on owner approval; roadmap and handoff added under docs/.
- T01 foundation: pnpm workspace with strict TypeScript, lint, typecheck, vitest and a ticket dispatcher (`pnpm test:ticket -- 01` fails on missing, skipped or failing mandatory tests); one JSON Schema protocol source with generators for TypeScript, Kotlin and .NET plus a canonical-JSON equality check; domain money, envelope, idempotency and tenant/permission/revision guards; Fastify, worker and Next.js scaffolds; UI tokens for the two T01 components; Gradle and .NET shells; CI workflow. No product flow.
