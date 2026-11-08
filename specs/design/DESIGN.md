# HatchSystem DESIGN.md v0.2 — design system source of truth

Design Desk · v0.2 8 Nov 2026 22:30 (Asia/Shanghai) · v0.1 kept on Drive as history · product: PS rental / gaming-centre management for `yravg/yravgHatchSystem` · files: `tokens.json`, `tailwind.tokens.css`, `SURFACES.md`, `COMPONENTS.md`, `wireframes/`.

> **PROVISIONAL — brand.** Enrico's logo has not been supplied. Every brand colour lives in the `brand.*` slot. Placeholder = yravg clay `#B4532A` on canvas `#FAF9F5`. When the logo lands, derive `brand.primary / primary-hover / primary-tint / on-dark` from it, rerun `tools/tokens.py` (it re-checks contrast) and re-render. Nothing else in the system references a raw brand hex.

> **Clean room.** Features and flows match Kula/Senet; nothing visual is lifted. Kula's site is dark navy with purple/blue/green accents — we deliberately use a warm neutral ops theme, a warm-black TV theme and our own state palette. No Kula/Senet name, logo, copy, icon or code is used. All copy is written fresh.

## 1. Principles
1. **Operator speed first.** A cashier starts, extends or checks out a session in ≤3 taps from the station grid. The grid is the home; everything else is a right-side sheet over it so the floor stays visible.
2. **Glanceable at 3 m.** TV and lobby read from the sofa: body ≥24 px at 1080p (we use 28), timers 40–96 px mono, 5 % safe area.
3. **State is never colour alone.** Each session state = icon glyph + Bahasa word + colour (+ hatch for maintenance). Works for colour-blind staff and on bad TVs.
4. **Truth over optimism.** Timer starts only after the device confirms. Payment is "paid" only from the bank notification, never a screenshot. Offline is shown plainly with what still works.
5. **Anti-AI-slop.** No gradients on UI chrome, no glassmorphism, no emoji as icons in product UI, no lorem ipsum, no stock "dashboard" filler cards; every number on screen is one an operator acts on. Sample data is realistic Indonesian rental-shop data.
6. **Console safety.** We lock the screen, never cut console power (saves corrupt). Copy says so on lock/overtime screens.

## 2. Colour
### 2.1 Brand slot (PROVISIONAL)
| token | value |
|---|---|
| `brand.primary` | `#B4532A` |
| `brand.primary-hover` | `#9A4521` |
| `brand.primary-ink` | `#FFFFFF` |
| `brand.primary-tint` | `#F6E7DF` |
| `brand.on-dark` | `#E8875C` |

### 2.2 Light ops theme (cashier, admin, customer, kiosk, KDS, CFD, owner)
| token | value |
|---|---|
| `canvas` | `#FAF9F5` |
| `surface` | `#FFFFFF` |
| `surface-2` | `#F3F0E8` |
| `line` | `#E6E2D8` |
| `line-strong` | `#C9C3B5` |
| `ink` | `#1F1F1F` |
| `ink-dim` | `#55524C` |
| `ink-faint` | `#76726A` |
| `slate` | `#4A5B72` |
| `ok` | `#2F7A4F` |
| `warn` | `#8A5A0B` |
| `danger` | `#8E3B24` |
| `focus` | `#1D5FD1` |

### 2.3 Dark TV / lobby theme (`[data-theme=tv]`, also PC/phone agents)
| token | value |
|---|---|
| `canvas` | `#121110` |
| `surface` | `#1E1C1A` |
| `surface-2` | `#2A2724` |
| `line` | `#3A3632` |
| `ink` | `#F4F1EA` |
| `ink-dim` | `#C9C3B8` |
| `ink-faint` | `#9C968C` |
| `focus` | `#FFD54A` |

### 2.4 Semantic session states
| state | icon | Bahasa | EN | light chip (fg on bg) | solid (TV chip / tile rule) | text on dark |
|---|---|---|---|---|---|---|
| `idle` | ○ | Kosong | Free | `#3E4C60` on `#E9EDF2` | `#4A5B72` (text `#FFFFFF`) | `#A9B8CC` |
| `booked` | ◆ | Dipesan | Booked | `#5A3F8C` on `#EEE8F7` | `#6B4FA0` (text `#FFFFFF`) | `#C3B0E6` |
| `running` | ▶ | Main | Running | `#1F5E3A` on `#E3F1E8` | `#2F7A4F` (text `#FFFFFF`) | `#7FD3A0` |
| `ending` | ◔ | Hampir habis | Ending soon | `#7A4E06` on `#FBEFD6` | `#C8901E` (text `#1F1F1F`) | `#F2C063` |
| `overtime` | ! | Lewat waktu | Overtime | `#8F1D17` on `#FBE3E1` | `#B3261E` (text `#FFFFFF`) | `#FF8A80` |
| `paused` | ‖ | Jeda | Paused | `#2C5785` on `#E3EDF8` | `#3A6EA5` (text `#FFFFFF`) | `#8DB8E8` |
| `offline` | ⊘ | Offline | Offline | `#4D4D4D` on `#ECECEC` | `#6B6B6B` (text `#FFFFFF`) | `#B5B5B5` |
| `maintenance` | ✕ | Perbaikan | Maintenance | `#5C4A3A` on `#EFE9E3` | `#7A6450` (text `#FFFFFF`) | `#CDB59C` |

Contrast (checked by script): all light chips ≥6.3:1; text on solid ≥4.35:1 for 24 px+ TV chips (ending uses dark ink → 5.9:1); state text on dark surface ≥7.4:1; `ink-faint` on canvas 4.55:1; brand white-on-clay 4.99:1; brand-on-dark 7.23:1.

Maintenance also uses a 45° hatch; booked uses ◆; overtime uses "!" plus "+" before the time.

## 3. Type
Family `Inter, 'Noto Sans', system-ui, sans-serif`; numbers `'JetBrains Mono', 'DejaVu Sans Mono', ui-monospace, monospace` with tabular figures.

| ops token | size/line | use |
|---|---|---|
| `xs` | 12px/16px | captions, table meta |
| `sm` | 14px/20px | body dense, tables |
| `md` | 16px/24px | body |
| `lg` | 20px/28px | section titles |
| `xl` | 24px/32px | sheet titles |
| `2xl` | 32px/40px | page titles |
| `num` | 28px/32px | KPI & money values |

| tv token | size/line | use |
|---|---|---|
| `body` | 28px/36px | TV body (≥24 rule) |
| `label` | 24px/32px | TV chips, footers (minimum) |
| `title` | 44px/52px | TV titles |
| `timer` | 96px/100px | overtime/finished timer |
| `timer-corner` | 40px/44px | running corner timer |
| `hero` | 72px/80px | lock-screen headline |

## 4. Spacing, radius, elevation, focus
Spacing 4-px scale: `0`=0, `1`=4px, `2`=8px, `3`=12px, `4`=16px, `5`=20px, `6`=24px, `8`=32px, `10`=40px, `12`=48px, `16`=64px, `tv-safe`=5%.
Radius: `sm`=6px, `md`=8px, `lg`=12px, `xl`=16px, `pill`=999px.
Elevation: `0`=`none`; `1`=`0 1px 2px rgba(31,31,31,.06)`; `2`=`0 4px 12px rgba(31,31,31,.08)`; `3`=`0 12px 32px rgba(31,31,31,.14)`; `tv`=`0 8px 32px rgba(0,0,0,.5)`.
Focus: ops `0 0 0 2px #FFFFFF, 0 0 0 4px #1D5FD1` (visible on every focusable, never removed); TV `0 0 0 4px #121110, 0 0 0 8px #FFD54A` + scale 1.04. Sizes: `touch-min`=44px, `cashier-tile-min`=168px, `tv-focus-min`=72px.

## 5. Motion (reuses yravg motion tokens v1 names)
| token | value |
|---|---|
| `ease-out` | cubic-bezier(0.2,0,0,1) |
| `ease-in` | cubic-bezier(0.55,0,1,0.45) |
| `ease-cross` | cubic-bezier(0.4,0,0.6,1) |
| `pageEnter` | 400ms cubic-bezier(0.25,0.24,0.16,1.02) / spring 300/34 |
| `tabPill` | 430ms cubic-bezier(0.29,0.35,0.14,1.17) / spring 280/27 |
| `segmentToggle` | 290ms cubic-bezier(0.24,0.16,0.22,1) / spring 420/38 |
| `modalOpen` | 260ms cubic-bezier(0.23,0.09,0.29,0.96) / spring 380/34 |
| `modalClose` | 120ms cubic-bezier(0.55,0,1,0.45) |
| `chartDataChange` | 0ms |
| `hoverTooltip` | 0ms |
| `loaderFade` | delay 300ms, in 160ms, min 500ms, out 120ms |
| `tvFocus` | 120ms cubic-bezier(0.2,0,0,1) (transform+box-shadow only) |
| `toastEnter` | = modalOpen |
| `timerTick` | 0ms (numbers never tween) |

Rules carried over: nothing loops (no spinners/pulses — loaders are static text/bars), exits shorter than enters, timers and money change in one frame, animate named properties only, `prefers-reduced-motion` → fades only. TV: focus move 120 ms transform+shadow; toasts use `modalOpen`; no parallax/scroll motion on TV (cheap SoCs drop frames).

## 6. Copy — Bahasa Indonesia first
- Write ID first, EN second (`/en` via i18n keys). Plain, friendly, "kamu" for players, neutral imperative for staff ("Tutup shift", "Tambah waktu").
- Key vocabulary: Unit / Meja, Sesi, Paket, Open billing, Tambah waktu, Jeda, Pindah unit, Saldo waktu, Dompet, Poin, Booking, DP, Check-in, Tutup shift, Selisih, Override darurat, Lewat waktu, Hampir habis, Kosong, Perbaikan.
- Money: `Rp58.000` — "Rp", no space, dot thousands, no decimals (`Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0})` then strip the space). Negative: `−Rp2.000` (true minus). Time: 24 h `21:15`; durations `2 j 15 mnt`; timers `HH:MM:SS`; overtime `+00:06`.
- Dates: `Min 8 Nov`, `8 Nov 2026`. Timezone = outlet timezone (WIB/WITA/WIT label shown in admin).
- Errors say what happened + what still works + next step. No blame, no codes in the headline (codes go in details).

## 7. Accessibility
- WCAG 2.2 AA on all ops surfaces; keyboard-complete cashier (shortcuts: `/` search, `N` new session on focused tile, `Esc` close sheet).
- **TV 10-ft rules:** body ≥24 px at 1080p (render check measured min 24 px on all TV frames except the LOGO placeholder), 5 % safe area on all sides, D-pad focus order left→right, top→bottom, primary action receives initial focus, Back always = close/cancel, no hover reliance, focus never lost (trap inside dialogs), long-press not required.
- Kiosk: primary targets ≥96 px, 60 s idle → attract, text ≥28 px.
- Reduced motion honoured live. Audio alerts (cashier) always paired with visual.

## 8. Offline & sync patterns
| situation | UI pattern |
|---|---|
| Cashier loses cloud, gateway alive | Grey offline banner (⊘ + since time + "timer tetap jalan di TV" + queued count). Start/extend/stop still work via local authority; QRIS disabled → cash only; digital payments go "pending". |
| Device ACK missing | Activation panel waits ≤15 s, then auto-credit + retry/move/manual (gap F046/F047). |
| TV loses network mid-session | Corner timer adds "⊘ Offline"; bottom card states signed lease end time; locks at lease end even offline (gap F196); tamper/clock rollback → lock. |
| Server fully down, customer paid | Manager emergency override on TV via D-pad PIN, audited (gap F256). |
| Reconnect | Queue drains; conflicts shown in Offline queue sheet for staff decision; never silent overwrite. |
| Stale data in admin/owner | "Data per 21:02" stamp, values kept, not blanked. |

## 9. Surfaces
13 surfaces / 82 screens: see `SURFACES.md`. Components `HS-CMP-001…058`: see `COMPONENTS.md`.

## 10. TV agent lock rules per state (v0.2, aligned with Grok spec)
Our agent locks right after setup, even before pairing. It relaunches itself after a reboot, re-checks the draw-over permission, and enforces session time offline. Kula's agent, seen unpaired in an emulator, behaves differently: HOME exits, it does not relaunch after reboot, and the overlay grant reset. We design against those gaps.

| State | Screen | HOME | BACK | Reboot | Network lost |
|---|---|---|---|---|---|
| Setup / unpaired | TVA-01 pairing (6-char code, visible countdown bar, auto refresh, QR) | stays (locked) | stays | auto-relaunch to TVA-01 | stays; "offline" note, code refresh paused |
| Permission missing | TVA-02b recovery guide (numbered D-pad steps) | stays | stays | re-checked on every boot | — |
| Standby (paired, no session) | TVA-03 lock | stays | stays | relaunch → TVA-03 | TVA-03 + offline tag |
| Running | TVA-04 corner timer over HDMI | returns to HDMI (guard) | passes to the game | TVA-10 recovery → resume, restart time not billed | TVA-07 signed lease, locks at lease end |
| Ending / overtime / finished | TVA-05 / TVA-06 | locked | locked | resumes the same state | lease rules |
| Admin exit / emergency | TVA-08 PIN (rate-limited, audited) | — | cancels | — | works offline (local PIN hash) |

Setup checklist (TVA-02) includes **"Matikan HDMI-CEC di TV dan konsol"**. CEC is optional and is left on only when a CEC adapter is used, because otherwise the console can grab the HDMI input back.

Pending, needs a paired Kula trial or real hardware: Kula's paired-session lock, its offline behaviour (Grabber's server-cut test was blocked on the production emulator image), its HDMI-CEC handling and its account settings.

## 11. Differentiators, made visible
- **Activation confirm and auto-compensation.** The step list in CSH-02 and KSK-04 is always shown, never hidden behind a spinner. It also appears in the move flow (CSH-15). Trust strip HS-CMP-058.
- **Offline lease.** The TV shows the lease end time (TVA-07) and the gateway shows the local authority (GWY-02).
- **Indonesia / QRIS.** QRIS is the first payment tab. The copy says "Lunas dari bank, bukan screenshot". QRIS also appears on the customer display and kiosk, and the Z report shows PB1 tax.
- **Seat/console move.** CSH-15 moves the console and session to another seat. Senet only documents PC-to-PC transfer.
