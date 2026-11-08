# HatchSystem COMPONENTS v0.2

Design Desk · 8 Nov 2026 · `HS-CMP-001` … `HS-CMP-058` (component ids only; not requirements).

Base: **shadcn/ui** (Radix) for web/PWA surfaces — Sheet, Dialog, Tabs/ToggleGroup (segments), Table, Badge, Button, Command (search), Calendar, Toast (Sonner), Form. TV agent (Kotlin, Compose for TV) and PC agent (Windows) re-implement the same anatomy with the same tokens; they do not use shadcn.

Shared rules: touch targets ≥44 px (cashier ≥56 px for primary), TV focusables ≥72 px tall with `focus.tv` ring + 1.04 scale; every state shown as icon + text + colour; money as `Rp58.000` (mono, tabular); numbers never tween.

| Id | Component | Surfaces | shadcn base | Anatomy | Variants | States | Wireframe |
|---|---|---|---|---|---|---|---|
| HS-CMP-001 | Station tile | CSH, ADM, OWN | Card | name · console/category · state chip (icon+text) · big mono time · sub-line · running amount · quick action | 6 px left rule in state solid; maintenance adds hatch | 8 session states + selected (focus ring) + stale (offline: time greyed with '≈') | CSH-01, ADM-01, OWN-01 |
| HS-CMP-002 | Session state chip | all | Badge | icon glyph + Bahasa label; never colour alone | sm (ops 13px), lg (16px), tv (24px solid fill), xl (kiosk 28px) | idle/booked/running/ending/overtime/paused/offline/maintenance | all |
| HS-CMP-003 | Session timer | CSH, CUS, TVA, PCA | — | mono digits, tabular; countdown or +overtime; progress bar | inline, hero (56px), tv-corner (40px), tv-full (96px) | running, ending (≤5 min), overtime (+), paused (frozen + '‖'), offline (local clock, lease stamp) | CSH-03, TVA-04..07, CUS-05 |
| HS-CMP-004 | Start session sheet | CSH | Sheet (right, 480px) | mode segment (Paket/Open), package grid, member row, options (use time credit, extra controller), summary, rate-lock note, CTA | prepaid, postpaid, multi-console table, bulk start | loading tariffs, unit-busy conflict, needs manager PIN | CSH-02 |
| HS-CMP-005 | Activation confirm panel | CSH, KSK | Inline steps | payment ✓ → command sent ✓ → waiting for TV ACK (seconds) → running; failure card with retry/move/manual | — | waiting, confirmed, failed → auto credit (gap F046/F047) | CSH-02-activation |
| HS-CMP-006 | Extend / pause / move action grid | CSH | Button group | +30m/+1j/+2j/custom; Jeda, Pindah unit, F&B, Remote TV, Pesan, Gabung | — | disabled when offline-only command unsupported | CSH-03 |
| HS-CMP-007 | F&B catalogue picker | CSH, CUS, PCA | Sheet / page | category chips, search/scan, product cards (photo, price, 'Habis'), line notes, send CTA | attached to session, takeaway | out of stock, offline catalogue cache | CSH-04, CUS-04 |
| HS-CMP-008 | Checkout sheet | CSH | Sheet (560px) | bill lines (rental, F&B, discounts), total, method segment, method panel, receipt actions | cash, QRIS, transfer, split, tempo (deposit/pending) | discount over limit → manager PIN, offline → cash only | CSH-05 |
| HS-CMP-009 | QRIS payment panel | CSH, CFD, KSK, CUS | Panel | QR, amount, countdown chip, 'paid only on bank notification' note | small (cashier), large (CFD/kiosk) | waiting, expired → regenerate, paid, provider down → fallback | CSH-05-qris, CFD-01, KSK-04 |
| HS-CMP-010 | Cash keypad & change | CSH | Panel | received amount, quick-amount buttons, change callout | — | insufficient | CSH-05-cash |
| HS-CMP-011 | Top-up sheet | CSH, KSK, CUS | Sheet / page | current balance, preset tiles with bonus tier, balance-after, pay CTA | cashier, kiosk XL | no negative balance, conflict-safe offline (read-only) | CSH-06, KSK-02 |
| HS-CMP-012 | Member card | CSH, CUS | Card | name, tier chip, QR id, time credit (per category + expiry), wallet, points, rank | compact row, full card (dark) | not member → register CTA, consent toggle | CSH-06, CUS-07 |
| HS-CMP-013 | Member search | CSH | Combobox | phone/name search, result rows, + register | — | empty, not found | CSH-06 |
| HS-CMP-014 | Booking slot picker | CUS, ADM | Grid | date, unit filter segment, game filter chips, slot buttons, hold summary | customer, admin calendar/timeline | no slots, conflict, hold timer expiring | CUS-02 |
| HS-CMP-015 | Booking confirmation & unlock code | CUS | Card | status chip, big code, details table, policy copy, calendar/reschedule/cancel | — | paid, cancelled + refund | CUS-03 |
| HS-CMP-016 | Arrivals table | CSH | Table | time, name, unit, deposit, status chip, action | — | waiting, arrived, no-show (release), booking-blacklist (walk-in allowed) | CSH-07 |
| HS-CMP-017 | Shift close & drawer count | CSH, OWN | Two-column form | expected (float, cash, QRIS, transfer, expenses), denomination count, variance banner + reason, close CTA | open shift (float), X report, Z close | variance requires reason, offline → close queued | CSH-08 |
| HS-CMP-018 | Manager approval (PIN) | CSH, OWN | Dialog / card | action, amount, requester + reason, approve/deny | inline PIN (cashier), push card (owner) | rate-limited after 3 wrong | OWN-01 |
| HS-CMP-019 | Offline banner & sync queue | CSH, GWY, all ops | Banner + sheet | icon, since-time, what still works, queued count, 'Lihat antrean' | banner, sheet list | offline, syncing, conflict → review | CSH-01-desktop-offline, GWY-01 |
| HS-CMP-020 | Chat & alert inbox | CSH, PCA, CUS | Panel | thread list per station, audio-alert toggle, quick replies | — | new message, unread | spec (CSH-10) |
| HS-CMP-021 | KPI stat card | ADM, OWN | Card | label, mono value, delta line (icon + text) | — | loading, stale | ADM-01 |
| HS-CMP-022 | Live station heatmap | ADM, OWN | Grid | per-unit mini tile: name + icon + state word on state tint | admin 6-col, owner 4-col | all 8 states | ADM-01, OWN-01 |
| HS-CMP-023 | Data table | ADM | Table (shadcn Table + TanStack) | header, rows, inline chips, row actions, export | dense, comfortable | empty, loading, error | ADM-02/08/09/11/12/14 |
| HS-CMP-024 | Tariff & package editor | ADM | Form + cards | category rates (per-hour, minimum, rounding), overtime rule, schedule packages | happy hour, overnight, student, weekend | overlap warning (cheapest wins), validation | ADM-04 |
| HS-CMP-025 | Tournament bracket | ADM, LBY, CUS | Diagram | rounds columns, match cards (players, scores, station, time) | single/double elimination, round robin list | draft, live, dispute, done | ADM-10 |
| HS-CMP-026 | Agent device row & rollout bar | ADM | Table + card | device, type, unit, version, capability flags, heartbeat; staged rollout card with pause/rollback | TV, PC, gateway, mobile, adapter | offline, update failed (auto rollback), slot limit | ADM-11 |
| HS-CMP-027 | Hardware certification row | ADM | Table | model, OS, lock method, HDMI switch, power control, cert chip | — | certified, certified-with-adapter, unsupported, untested | ADM-12 |
| HS-CMP-028 | Audit log row | ADM | Table | time, actor, action (override highlighted), unit, reason, exports | — | — | ADM-14 |
| HS-CMP-029 | Adapter setup wizard | ADM (ADP) | Stepper | TV type → adapter choice → tests; signal-path diagram | CEC, IR, HDMI switch, TV-only smart plug | adapter not found, test failed | ADP-01 |
| HS-CMP-030 | TV pairing code | TVA, GWY | Full screen | logo slot, title, instruction, 6-char code boxes, expiry, network/version, actions, QR | TV (6 chars), gateway (6 digit PIN) | expired → new code, network down | TVA-01, GWY-01 |
| HS-CMP-031 | TV setup checklist | TVA | List | rows: icon, check name, result, fix action (focusable) | — | pass, fail (fix), pending | TVA-02 |
| HS-CMP-032 | TV lock overlay (standby) | TVA, ADP | Full screen | venue background (owner image), lock icon, title, instruction, next booking, self-pay QR | Android overlay, adapter-rendered card | standby, paused, finished, offline | TVA-03, ADP-02 |
| HS-CMP-033 | TV timer corner | TVA | Overlay | state icon + mono time (+ offline tag) | 4 corners, opacity 60–95% | running, ending, offline lease | TVA-04, TVA-07 |
| HS-CMP-034 | TV ending-soon toast | TVA, PCA | Bottom bar | icon, title, body, extend QR | 5 min, 1 min | — | TVA-05 |
| HS-CMP-035 | TV overtime / finished screen | TVA | Full screen | icon, title, chip, +time, fee copy, console-safe note | overtime, finished | — | TVA-06 |
| HS-CMP-036 | TV offline-lease notice | TVA | Bottom card | offline icon, what still works, lease end time | — | valid, expiring, tamper detected → lock | TVA-07 |
| HS-CMP-037 | TV D-pad PIN pad | TVA | Grid | masked digit boxes, reason, lockout note, 3×4 keypad | admin exit, emergency override | wrong PIN, rate-limited, active | TVA-08 |
| HS-CMP-038 | TV message toast | TVA | Toast | operator message / F&B arriving / member rank greeting | — | — | spec (TVA-09) |
| HS-CMP-039 | Kiosk shell | KSK | Page | logo, language, XL heading, body, primary XL CTA (≥96px), back | attract, flow step | idle timeout → attract (60 s) | KSK-01..04 |
| HS-CMP-040 | Lobby billboard tile | LBY | Tile | unit, category, solid state chip, large time/‘Siap’ | — | 8 states; privacy mode hides names | LBY-01 |
| HS-CMP-041 | Kitchen order card | KDS | Card | order no., station, time + age, items with notes, next-step CTA | Baru, Dimasak, Siap, Diantar | late (>target) red border + '!' text | KDS-01 |
| HS-CMP-042 | Customer display layout | CFD | Split | bill lines + total | QRIS panel | idle (venue promo), items, QRIS, paid | — | CFD-01 |
| HS-CMP-043 | PC seat lock & HUD | PCA | Full screen / floating | login fields, QR, booking notice; HUD: user, chip, time, wallet ≈ time, food/chat/end | — | booked soon, 5 min, ending | PCA-01, PCA-02 |
| HS-CMP-044 | Phone allowed-games launcher | MAG | Grid | timer header, allowed app grid, policy note | — | expiry lock | MAG-01 |
| HS-CMP-045 | Edge health list | GWY | Card | cloud link, local authority, queue, agents, clock sync | — | online, offline-authority, reconciling | GWY-01 |
| HS-CMP-046 | Billing rule simulator | ADM | Card | inputs (category, tier, minutes) → counted minutes, rate, gross, rounded, billed; minimum-charge example | — | recomputes instantly (no tween) | ADM-20 |
| HS-CMP-047 | Policy setting row | ADM | Form row (Select/ToggleGroup) | label, value control, helper; customer-facing copy preview card | segment, select, number | validation | ADM-21 |
| HS-CMP-048 | No-show resolution sheet | CSH | Sheet | booking facts, 3 action cards (release+forfeit, wait, cancel without fee w/ PIN), history toggle | — | in grace, overdue, override | CSH-12 |
| HS-CMP-049 | Report + thermal preview | CSH, ADM | Split card | KPI cards, category table, actions; 58/80 mm receipt preview in mono | X (mid-shift), Z (day close) | printer offline → queued | CSH-13, CSH-14 |
| HS-CMP-050 | Day-close checklist | CSH | List | pass/warn/fail rows with inline fix actions; close CTA disabled until blockers clear | — | blocked, warnings, ready | CSH-14 |
| HS-CMP-051 | Seat move dialog | CSH | Sheet | from/to cards, tariff-difference segment, automatic step list (lock old → switch HDMI → ACK → resume), safety note | — | target busy, no ACK → stays | CSH-15 |
| HS-CMP-052 | 2FA enrol | ADM | Two cards | QR + manual key, 6-digit OTP, backup codes grid with download/print, confirm checkbox | — | wrong code, done | ADM-22 |
| HS-CMP-053 | OTP input | ADM, GWY | Input group | 6 boxes, auto-advance, paste support, error banner with remaining attempts | — | error, locked | ADM-23 |
| HS-CMP-054 | Webhook endpoint row + delivery log | ADM | Table + card | URL, events, status chip, last result, test; signing secret (masked, rotate); delivery log with resend | — | active, failing, paused | ADM-24 |
| HS-CMP-055 | Tournament registration & check-in | ADM, CUS | Table / form | entrant rows (member, fee chip, check-in chip, seed), substitutes; customer form with fee + QRIS | — | open, full, unpaid, no-show | ADM-25, CUS-09 |
| HS-CMP-056 | TV permission recovery guide | TVA | Full screen | warning title, why, numbered D-pad steps, primary 'open settings', side status card | — | permission lost (after reboot), restored | TVA-02b |
| HS-CMP-057 | TV boot recovery | TVA | Full screen | logo, title, step list (auto-launch, permission, fetch remaining time), last-known time | — | recovering, recovered, needs permission | TVA-10 |
| HS-CMP-058 | Trust strip (differentiator) | CSH, TVA, KSK | Inline | icon + one-line proof: 'Timer mulai setelah TV konfirmasi', 'Izin main sampai 21:56 (offline)', 'Lunas dari bank, bukan screenshot', PIN countdown bar | activation, lease, QRIS, pairing | — | CSH-02, CSH-05, TVA-01, TVA-07 |
