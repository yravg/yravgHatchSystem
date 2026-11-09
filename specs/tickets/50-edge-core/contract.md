# HS-T50 team contract — AGREED

Status: AGREED 2026-11-09T02:28:14Z by the single worker (agent: Claude Sonnet 5.5, worktree t50-edge). Mode stays "team" but there is ONE worker; no second worker joins without a new contract. Ticket status is not changed here (only a human promotes/marks done).

## Protocol
- Protocol revision: v1, CONTRACTS.md sections 1, 5, 7. No schema change: packages/contracts/schema/protocol.schema.json and generated TS/Kotlin/.NET stay byte-identical (generator --check drift stays green). The signing vector under packages/contracts/leases/ is additive.
- Error gate: unknown/stale/obsolete requests are rejected with a typed code, never a stack or secret.

## Exact file ownership (T50 only)
- agents/venue-edge/** (library), agents/Hatch.VenueEdge.Tests/** (xunit), agents/HatchAgents.slnx (one added Project line)
- services/api/src/devices/** (pairing, device keys, revocation), services/api/src/edge/** (authority epoch, ACK intake)
- services/api/src/identity/migrations/0004_edge_devices.{up,down}.sql (T50 owns migration number 0004; T48 owns 0003)
- packages/contracts/leases/** (Ed25519 lease signing vector + TS verifier)
- tests/faults/edge/** (API-side fault/edge tests), tests/edge/** (API tests for devices and edge)
- specs/tickets/50-edge-core/{contract,results}.md, evidence/requirements-evidence.json, CHANGELOG.md (one Unreleased line)

## Shared files (additive lines only; the Merger resolves line conflicts)
- services/api/src/app.ts: one route registration line (+ import)
- services/api/src/tenancy/permissions.ts: only T50's own new permissions
- tests/tickets.manifest.json: only the "50" entry
- tests/identity/migrate.test.ts: only the expected migration list
- CHANGELOG.md: one Unreleased line
Never edited: other tickets' migrations, packages/contracts schemas/generated files, validator, apps/*.

## Fixture ownership
All keys, seeds, codes and times in tests are FIXTURES owned by T50 under the paths above; none is a real secret. Test databases: hatch_t50 only, schemas dropped after each file.

## Scope guard
Headless only. No UI, no real console power operation, never console mains. CEC is an optional driver that may be absent. Display adapter is a SIMULATOR labelled as such. True physical offline (Ethernet unplugged on venue hardware) is BLOCKED (no hardware here) and is never reported as a pass.
