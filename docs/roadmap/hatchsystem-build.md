# HatchSystem build roadmap (spec v0.2)

Goal: build yravg HatchSystem from specification v0.2 in this repo.
Source of truth: BUILD-PROMPT.md, CLAUDE.md, specs/COORDINATION.md, specs/tickets/board.md.
This file only fixes the order; the spec files own scope and acceptance.

## Rules
- Only tickets the owner marks ready in BOTH board.md and rd.md are dispatched.
- One worker per ticket, own branch and git worktree. Failed eval goes back to the same worker.
- Merger integrates; an independent Checker proves the merged result. Missing hardware = blocked, never pass.
- Money/payment policy (D01, D03, D10, D15, D26, D30, D31) stays unapproved: labelled fixtures and mocks only.

## Order (backend/edge/contracts first, then UI integrations)
1. T01 foundation monorepo and domain contracts. Acceptance: rd/eval of 01-foundation.
2. T46 identity/tenancy/staff 2FA API (after T01 done).
3. T47 stations, rational tariff, minimum payment API (after T46).
4. T48 ledger and Midtrans QRIS sandbox server; T50 edge pairing/lease core (both after T46, T47).
5. T49 session coordinator (after T47, T48, T50); T51 Kotlin TV core (after T50).
6. T53 operations API (after T48, T49).
7. T54 contract/simulator/fault check (after 46-51, 53).
8. Original UI tickets 02..45 by their board dependencies. T52 (V1) only with owner phase approval.

## Open questions (owner)
- Each next ticket needs owner readiness.
- Machine toolchain: .NET 10 SDK, JDK 17+, Android SDK, PostgreSQL are not installed (see handoff).
