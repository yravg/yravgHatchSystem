# Input status v0.2 — final local merge

8November2026, Asia/Shanghai (UTC+8). All packs received. Latest owner steering authorises Drive delivery AFTER local validation into the HatchSystem/v0.2 folder; delivery receipt separate from this source snapshot. Complete capture does not make all vendor claims runtime verified.

## Senet verified pack
- FR-SENET-01..71 preserved;72..129 deep-pass extension retained. Total129 (already present in v0.1 registry; v0.2 strengthens individual ACs rather than renumbering).
-362help-centre articles; APPS, WORKFLOWS, HARDWARE-OFFLINE and all284 MATRIX-SENET rows merged. Billing rounding/minimum/zone level, booking settings/deposit/no-show, X/Z reporting now have exact own target tests.
- Video source of truth: `/workspace/grab/senet/videos/INDEX.md`: **70unique official uploads =53videos+17webinars;17with transcripts,4with no captions,49with captions awaiting retry after YouTube HTTP429**. Metadata/transcript availability is not a claim of watching every video.
- Android8+ overlay (`tech.enes.senettv`), foreground dependence, CEC off on TV AND console. No smart-plug/IR path offered/documented. LG coming-soon; Samsung native listing/setup unverified.
- Legacy HDMI controller:2.4GHz only,4K60YUV420, no120Hz, vendor asks HDCP/HDR off. HatchSystem must not strip DRM or adopt this downgrade as compatibility proof.
- Cloud-only billing baseline/no local session server or supported offline mode documented. Paid offline TV expiry guarantees remain unverified from public docs. Owner brief identifies no activation confirmation/automatic compensation; source docs establish **no documented ACK gate or automatic refund**, not a tested proof of every internal implementation.
- QRIS/Indonesian providers, Bahasa Indonesia, tournaments, staff2FA, outgoing webhooks and console seat-transfer are explicit HatchSystem requirements. Source absence/UNKNOWN distinctions remain in the merged matrix; not all are independently proven competitor absences. Senet customer iOS app exists.

## Kula TV emulator observations
Source `/workspace/grab/kulapos-rental-ps/tv-agent-emulator/INSTALL-REPORT.md`, including final offline follow-up. Only observable features/flows used; no APK/code/screenshot copied into build package.
- UNPAIRED ONLY: normal remote grant of overlay permission;4digit PIN10min with Refresh action visible (not activated); Home exits, Back remains; no unpaired relaunch after reboot; permission reset on this emulator. Not a universal model bug finding.
- Unpaired online observation185seconds:55pairing checks, mean3.352s (range3.346–3.462s). A60second fallback was not observed here and may concern another/paired state; cannot verify that hypothesis. Own cadence is independent configurable policy.
- **Paired lock and HDMI control: unverified, pending trial**. No trial/signup performed.
- **Offline behaviour: unverified — true-offline test BLOCKED.** Production AndroidTV API34 image refused root; iptables/ip6tables denied, remount/hosts alternatives unavailable. No rules/hosts changes occurred. Ethernet remained connected/validated; no offline interval/banner/backoff/PIN-loss result exists. Earlier Wi-Fi/airplane toggles were not a true-offline test either. No privileged workaround is requested by this spec.
- Own native-agent acceptance exceeds this unpaired baseline only on legitimate managed/certified topology: provisioned-but-unpaired picture lock; Home/Back/input protection; normal permission persistence/reboot recovery; permission-lost fail/repair; signed local offline lease expiry. Ordinary unprovisioned consumer app cannot promise kiosk privileges.

## Kula full + rental + market
69FR-KPS,520FR-KULA/all144star,284market aliases retained; unrelated industry-only rows explicitly out-of-scope. Some star labels are normalised generic reusable concepts, not medical/pet/craft modules. Full-site comparison interactions/teaser blogs, route-only behavior and Gateway/Mobile internals remain source limits, not new verified runtime facts. Static APK implementation excluded. No competitor brand/code/assets shipped.

## Design final received
`/workspace/design/hatchsystem/hatchsystem-design-v0.2.zip` used locally; no download needed. specs/design now contains Design v0.2: **82screens,58wireframed screens,58HS-CMP components**. Exact primary-owner/consumer crosswalk in COVERAGE and each original UI ticket. Layout final per owner steering; **UI does not wait for design anymore**, but follows accepted backend/edge/contracts and human ticket readiness. Brand colours alone provisional until logo; no incoming-v0.2 placeholder. Sample money/PIN/security values cannot override CONTRACTS/DECISIONS. Archive hash in sources/design-intake.json.

## Repo and portability
Inspected main had only README + MIT LICENSE, no existing app stack/modules/CI/CLAUDE/AGENTS. No repo writes or builds performed. tools/validate_spec.py is portable/offline; historical research generators require box-only inputs and must not overwrite reviewed tickets. Product/browser/native/hardware execution NOT STARTED. Source timestamps/hashes in intake manifest; upstream raw/binaries/transcripts are not package dependencies.
