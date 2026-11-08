# HS-T01 — Fondasi monorepo dan kontrak domain

Status: **draft**
Mode: **solo**
Phase: MVP

## Mandate
Dokumen mengizinkan spesifikasi saja. Setelah owner mengubah row board DAN status ini ke ready serta mengunci keputusan terkait, worker membangun vertical slice ini dengan hasil teramati berikut: Clone bersih: install terkunci, lint, typecheck, unit test dan validasi spesifikasi lulus. Generator skema menghasilkan payload identik untuk TypeScript, Kotlin dan .NET; tidak ada rahasia pada fixture. Tidak membangun kapabilitas lain karena alias sumber mirip.

## ID crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-01 | HS-01 | AC-HS-01 | HS-C01 | MVP / ticket |


## Behaviour
- **HS-01 / AC-HS-01** — Fondasi monorepo dan kontrak domain. Target: Clone bersih: install terkunci, lint, typecheck, unit test dan validasi spesifikasi lulus. Generator skema menghasilkan payload identik untuk TypeScript, Kotlin dan .NET; tidak ada rahasia pada fixture. Evidence: own normative proposal; sumber: Master PRD own design.

Semua layar: loading, kosong, error, validasi, pending jaringan, disabled dengan alasan, saldo kurang, pembayaran belum pasti dan retry aman. Teks Bahasa Indonesia sendiri, tanpa brand/copy vendor. UI tak menyatakan aktif/paid/siap jika otoritas server/perangkat belum mengonfirmasi. Sumber UNKNOWN/route-only adalah interpretasi requirement sendiri, bukan klaim parity teruji.

## Touches
package.json; pnpm-workspace.yaml; packages/contracts/; packages/domain/; tests/contracts/; .github/workflows/
Migrasi tabel domain milik slice ini melalui services/api/drizzle/; generate contracts hanya lewat pemilik T01/protocol-review. Komponen HS-C01. Jangan mengubah kontrak shared sepihak setelah freeze.

## Must not touch
LICENSE/README asli tanpa alasan; private/raw/pages/APK/bundle/transcript/screenshot vendor; kredensial; produksi; kerja branch lain; pricing komersial/tax/retention yang belum disetujui. Tidak memanggil backend vendor. Tidak memutus daya konsol, membuka ADB permanen, menghindari OS/DRM/store rules.

## Deps
- Tidak ada; bootstrap setelah human ready.

## Decisions
- NORMATIVE safety: PRD §§2,6–10, CLAUDE.md dan CONTRACTS.md.
- ASSUMPTION / blocked: Tidak ada kebijakan uang/keamanan/data spesifik yang baru; tetap perlu human ready.; lihat DECISIONS.md untuk default dan pemilik.
- Sandbox fixtures di Behaviour bukan angka produksi. Pending verification sumber tidak boleh disamarkan menjadi hasil uji.

## Modes and edges
Session fixed/open dan prepaid/postpaid adalah sumbu independen; device-managed versus manual, WAN-up versus WAN-down, member versus guest, valid versus revoked device, Android versus external adapter dan per-outlet rate harus diuji bila slice memakainya. PC privacy lock tetap billable; pause sewa eksplisit mengikuti D01. Tidak ada silent fallback dari wallet/QRIS pending ke cash/paid. Tidak ada konversi saved time ke bonus money tanpa event sah.

## Out of scope
V2 tidak didispatch pada pilot. Industri non-gaming literal dan semua NG berlaku. 0 row out-of-scope hanya audit pada EXCLUSIONS.md, bukan implementasi.

## Gates owned
Tidak menambah gate baru; gunakan response envelope CONTRACTS.md.

Design alias owned: HS-C01 — Fondasi monorepo dan kontrak domain.

## Foundation scaffold ownership
T01 juga owns apps/web package/config, services/api+worker package/config, packages/ui scaffold, native Gradle/.NET solution/project shells, root lockfile dan shared test-runner config. Belum menulis product flow. Setelah freeze, dependency/shared-config requests direview pemilik kontrak+Merger, tidak diubah paralel oleh worker lain.

## v0.2 own requirement crosswalk
| Requirement | Own canonical | Acceptance | Design | Phase / disposition |
| --- | --- | --- | --- | --- |
| HS-V02-15 | HS-01 | AC-HS-V02-15 | HS-C01 | MVP / ticket |
- HS-V02-15 / AC-HS-V02-15: Final Design v0.2 accepted:82screens,58wireframed,58components; exact design reading+primary ownership mapped per ticket. No design wait/incoming placeholder. Backend46..54 and foundation01 precede original UI integration per deps/release. Brand colours provisional pending logo only; domain/security policy outranks illustrative fixtures. Human-ready still required.

## v0.2 dependency / ownership amendment (supersedes v0.1 backend scope)

## Design v0.2 required reading (final layout; brand provisional)
Read specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:
Screens: none; foundation tokens
Components: HS-CMP-023, HS-CMP-058
Touches (design primary): HS-CMP-023, HS-CMP-058
No design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.

Decision blocker D25: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.

Decision blocker D29: see DECISIONS.md; normative safety/accepted layout distinguished from open policy.
