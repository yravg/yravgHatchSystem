# v0.2 implementation ownership / sequencing

54tickets, all draft. Human alone marks ready in board+rd. No product implemented in this specification task. Watchdog first, router orchestrates only, one worker/worktree/ticket, team contract before parallel coding, fail→same worker, Merger→independent Checker.

## Why9 new backend tickets
Design was still arriving when v0.2 merge began. Keeping auth/station/edge APIs trapped inside unfinished UI tickets would deadlock backend work. New46..54 are independent backend/native slices that can reach done with API/native evidence, not fake partial-UI done. Original01..45 IDs/source ACs remain integration owners; accepted services are consumed, not rebuilt. Design v0.2 is now received/final, so no design hold remains. Backend-first separation still gives safe dependency/ownership boundaries.

01foundation →46identity →47catalog/pricing →48ledger/QRIS;50edge follows46/47;49session follows47/48/50;51Kotlin core follows50;53operations follows48/49;54backend contract/fault-check follows these.52booking/wallet is V1 and must not be pulled into MVP without phase approval. Original UI integrations wait their exact board deps. No exception allowing dispatch with merely partial dependencies.

-46 owns identity/tenancy/MFA server;02 owns its final UI/integration.
-47 owns station/rate/quote engine;03/04 use API and own forms/read-model integration.
-48 owns journal/payment workers;06/07 own checkout/QRIS screens and E2E integration.
-49 owns session transfer/ACK coordinator;05 owns cashier UX/E2E.
-50 owns pairing/edge/lease core;19/20 own setup/status/UI/integration. Device/adapters protocol API cannot be changed unilaterally.
-51 owns Kotlin lifecycle/provisioning/lease enforcement and neutral functional harness;21 owns final DesignTV screens/native integration. Hardware readiness still independently proven.
-52 owns booking/wallet/time-pass services;09/10/12 own integration and views.
-53 owns stock/order/shift services;14/15/17 own UI/E2E.
-54 owns contract/fault validation. It may add fixtures/test schema assertions, not redesign already accepted APIs. Contract change returns to implementation owner+T01 review.

Component primary ownership in DESIGN-CROSSWALK.json; consumers read-only by default. Shared component changes coordinate primary owner before parallel edits. HS-C domain aliases, KPS-C legacy and HS-CMP actual visual components are distinct. Brand tokens only, no raw copied palette.

Visual states are not domain states: offline/ending/overtime are projections. Show starting/activation_failed/cleaning/maintenance honestly even if8chip palette requires derived mapping. No cached paid/green-active, fake auto-credit/refunded, hidden offline wallet grants or unapproved CEC requirement. Source console transfer does not mean physically moving running game state to a different console; operator handles cable/hardware safely, no console shutdown.
