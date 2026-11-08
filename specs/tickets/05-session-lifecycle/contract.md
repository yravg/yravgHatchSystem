# Team contract HS-T05 — proposed, not yet agreed

Status: **draft — must be agreed before parallel work**.

Shared goal: Dua kasir start bersamaan: satu sesi menang, satu STATION_BUSY tanpa debit. Tambah 60 menit pada sisa 30 = 90 tepat satu kali. Pindah ke unit terisi ditolak atomik; pindah sah mempertahankan sessionId, pembayaran dan makanan. Berhenti membekukan tagihan dan tidak langsung menandai unit bersih.

Worker A owns API/domain paths in rd.md; Worker B owns native/web consumer paths. Tester owns tests/e2e/ticket-05.spec.ts plus protocol/hardware fixtures, not business policy. No two workers edit the same file; freeze generated schemas through T01 owner before consumer work. Separate branches/worktrees required; proposed split may be refined only inside this ticket's fixed scope.

Interface: CONTRACTS.md version1; SessionCommand/SessionLease/DeviceAck, revision/epoch and payment states MUST match. No field rename, gate change or new dependency without router/spec review. Shared migrations submitted by Worker A; Worker B consumes generated schema. Sign contract with worker names, branch, schema hash, assigned files and integration test sequence before code.

Integration order: contract/schema fixture accepted → provider tests → consumers against shared simulator → merge provider then consumer → independent Checker on merged build. A received ACK is not applied. Device fault cannot become paid activation success. Conflict: stop overlap, notify router, keep both worktrees intact; do not overwrite another worker.
