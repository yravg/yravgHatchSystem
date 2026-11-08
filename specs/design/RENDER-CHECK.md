# RENDER-CHECK v0.2

Run 8 Nov 2026, about 22:30 (Asia/Shanghai). Same method as v0.1: Playwright drove the box's headless Chrome at each frame's native size, an automatic check looked for overflow and clipping, and then I opened each new and changed PNG myself.

## Result: 59 frames (13 new, 4 changed), 59 pass, 0 fail

## v0.2 defects found and fixed
| # | Frame | Defect seen | Fix |
|---|---|---|---|
| 14 | ADM-22-2fa-enrol | The two cards overflowed below the frame (auto-detected) because the grid used 100 % height under the top bar | `calc(100% - 56px)`, cards aligned to start |
| 15 | TVA-01-pairing | Adding the countdown bar left a `div` unclosed, so the QR panel dropped below the PIN and overlapped the footer. The auto-check missed this; I caught it by eye | Closed the tag and re-rendered; layout is correct |
| 16 | TVA-02-setup | No CEC step | Added the "Matikan HDMI-CEC di TV dan konsol" row, which fits within the 5 % safe area |

## v0.1 log (history)
## Defects found and fixed (iterations)
| # | Frame | Defect seen | Fix |
|---|---|---|---|
| 1 | all | "LOGO" placeholder text overflowed its 32 px box | placeholder label 8 px (it is a slot, not content) |
| 2 | CSH-03-detail | action grid buttons "F&B" / "Gabung tagihan" overflowed sheet (auto-detected) | `min-width:0` in sheets, shorter labels |
| 3 | ADM-* | every sidebar item rendered as active (string bug) | rebuilt nav, one active item |
| 4 | ADM-* | admin top bar showed cashier identity | owner identity on admin |
| 5 | TVA-01, TVA-02, TVA-08, KSK-02, GWY-01, OWN-01, MAG-01 | inline styles with spaces were unquoted → pairing digits tiny, borders missing | quoted all attributes; re-rendered |
| 6 | LBY-01 | timers overflowed right-hand tiles (auto-detected); lower half empty | `minmax(0,1fr)` columns, rows fill height, timer 46 px |
| 7 | PCA-01 | frame rendered blank (safe-area wrapper not positioned) | frame given TV class |
| 8 | OWN-01 | heatmap tiles were colour-only (violates state rule) | added icon + state word |
| 9 | CSH-01-desktop | 6 columns squeezed "Hampir habis" chip into unit name | 5 columns at 1440, no-wrap names |
| 10 | CSH-03 | "Stop & simpan sisa ke member" clipped | label "Stop · simpan sisa" |
| 11 | KSK-01/04 | state chips 16 px on a 1080-wide kiosk | XL chip variant 28 px |
| 12 | CSH-02-activation | failure example named a different unit | same unit (PS5-04) |
| 13 | KDS-01 | order age 13 px too small at kitchen distance | 15 px |


## TV 10-ft
New TV frames (TVA-02b, TVA-10) use 24–64 px text and the 5 % safe area. The focus ring sits on the primary action.

## Not checked
Real TV hardware. Kula's paired and offline behaviour: Grabber's server-cut test was blocked on the production emulator image, so it is pending.

## Frames
| file | frame | v0.2 | png | auto-check |
|---|---|---|---|---|
| `admin.html` | `ADM-01-dashboard` | — | `wireframes/shots/ADM-01-dashboard.png` | pass |
| `admin.html` | `ADM-02-units` | — | `wireframes/shots/ADM-02-units.png` | pass |
| `admin.html` | `ADM-04-pricing` | — | `wireframes/shots/ADM-04-pricing.png` | pass |
| `admin.html` | `ADM-08-reports` | — | `wireframes/shots/ADM-08-reports.png` | pass |
| `admin.html` | `ADM-09-staff` | — | `wireframes/shots/ADM-09-staff.png` | pass |
| `admin.html` | `ADM-10-tournament` | — | `wireframes/shots/ADM-10-tournament.png` | pass |
| `admin.html` | `ADM-11-agents` | — | `wireframes/shots/ADM-11-agents.png` | pass |
| `admin.html` | `ADM-12-cert` | — | `wireframes/shots/ADM-12-cert.png` | pass |
| `admin.html` | `ADM-14-audit` | — | `wireframes/shots/ADM-14-audit.png` | pass |
| `admin.html` | `ADM-20-billing` | NEW | `wireframes/shots/ADM-20-billing.png` | pass |
| `admin.html` | `ADM-21-bookingpolicy` | NEW | `wireframes/shots/ADM-21-bookingpolicy.png` | pass |
| `admin.html` | `ADM-22-2fa-enrol` | NEW | `wireframes/shots/ADM-22-2fa-enrol.png` | pass |
| `admin.html` | `ADM-23-2fa-login` | NEW | `wireframes/shots/ADM-23-2fa-login.png` | pass |
| `admin.html` | `ADM-24-webhooks` | NEW | `wireframes/shots/ADM-24-webhooks.png` | pass |
| `admin.html` | `ADM-25-tour-checkin` | NEW | `wireframes/shots/ADM-25-tour-checkin.png` | pass |
| `cashier.html` | `CSH-01-tablet` | — | `wireframes/shots/CSH-01-tablet.png` | pass |
| `cashier.html` | `CSH-01-desktop-offline` | — | `wireframes/shots/CSH-01-desktop-offline.png` | pass |
| `cashier.html` | `CSH-02-start` | — | `wireframes/shots/CSH-02-start.png` | pass |
| `cashier.html` | `CSH-02-activation` | — | `wireframes/shots/CSH-02-activation.png` | pass |
| `cashier.html` | `CSH-03-detail` | — | `wireframes/shots/CSH-03-detail.png` | pass |
| `cashier.html` | `CSH-04-fnb` | — | `wireframes/shots/CSH-04-fnb.png` | pass |
| `cashier.html` | `CSH-05-cash` | changed | `wireframes/shots/CSH-05-cash.png` | pass |
| `cashier.html` | `CSH-05-qris` | changed | `wireframes/shots/CSH-05-qris.png` | pass |
| `cashier.html` | `CSH-06-member` | — | `wireframes/shots/CSH-06-member.png` | pass |
| `cashier.html` | `CSH-07-bookings` | — | `wireframes/shots/CSH-07-bookings.png` | pass |
| `cashier.html` | `CSH-08-shift` | — | `wireframes/shots/CSH-08-shift.png` | pass |
| `cashier.html` | `CSH-12-noshow` | NEW | `wireframes/shots/CSH-12-noshow.png` | pass |
| `cashier.html` | `CSH-13-xreport` | NEW | `wireframes/shots/CSH-13-xreport.png` | pass |
| `cashier.html` | `CSH-14-zreport` | NEW | `wireframes/shots/CSH-14-zreport.png` | pass |
| `cashier.html` | `CSH-15-move` | NEW | `wireframes/shots/CSH-15-move.png` | pass |
| `customer-display.html` | `CFD-01-qris` | — | `wireframes/shots/CFD-01-qris.png` | pass |
| `customer.html` | `CUS-02-book` | — | `wireframes/shots/CUS-02-book.png` | pass |
| `customer.html` | `CUS-03-confirm` | — | `wireframes/shots/CUS-03-confirm.png` | pass |
| `customer.html` | `CUS-04-qrorder` | — | `wireframes/shots/CUS-04-qrorder.png` | pass |
| `customer.html` | `CUS-05-status` | — | `wireframes/shots/CUS-05-status.png` | pass |
| `customer.html` | `CUS-07-member` | — | `wireframes/shots/CUS-07-member.png` | pass |
| `customer.html` | `CUS-09-tournament` | NEW | `wireframes/shots/CUS-09-tournament.png` | pass |
| `gateway.html` | `GWY-01-pair` | — | `wireframes/shots/GWY-01-pair.png` | pass |
| `kiosk.html` | `KSK-01-attract` | — | `wireframes/shots/KSK-01-attract.png` | pass |
| `kiosk.html` | `KSK-02-topup` | — | `wireframes/shots/KSK-02-topup.png` | pass |
| `kiosk.html` | `KSK-04-qris` | — | `wireframes/shots/KSK-04-qris.png` | pass |
| `kitchen.html` | `KDS-01-board` | — | `wireframes/shots/KDS-01-board.png` | pass |
| `lobby.html` | `LBY-01-billboard` | — | `wireframes/shots/LBY-01-billboard.png` | pass |
| `mobile-agent.html` | `MAG-01-launcher` | — | `wireframes/shots/MAG-01-launcher.png` | pass |
| `owner.html` | `OWN-01-today` | — | `wireframes/shots/OWN-01-today.png` | pass |
| `pc-agent.html` | `PCA-01-lock` | — | `wireframes/shots/PCA-01-lock.png` | pass |
| `pc-agent.html` | `PCA-02-hud` | — | `wireframes/shots/PCA-02-hud.png` | pass |
| `tv-adapter.html` | `ADP-01-wizard` | — | `wireframes/shots/ADP-01-wizard.png` | pass |
| `tv-adapter.html` | `ADP-02-lockcard` | — | `wireframes/shots/ADP-02-lockcard.png` | pass |
| `tv-agent.html` | `TVA-01-pairing` | changed | `wireframes/shots/TVA-01-pairing.png` | pass |
| `tv-agent.html` | `TVA-02-setup` | changed | `wireframes/shots/TVA-02-setup.png` | pass |
| `tv-agent.html` | `TVA-02b-permlost` | NEW | `wireframes/shots/TVA-02b-permlost.png` | pass |
| `tv-agent.html` | `TVA-03-standby` | — | `wireframes/shots/TVA-03-standby.png` | pass |
| `tv-agent.html` | `TVA-04-running` | — | `wireframes/shots/TVA-04-running.png` | pass |
| `tv-agent.html` | `TVA-05-warning` | — | `wireframes/shots/TVA-05-warning.png` | pass |
| `tv-agent.html` | `TVA-06-overtime` | — | `wireframes/shots/TVA-06-overtime.png` | pass |
| `tv-agent.html` | `TVA-07-offline` | — | `wireframes/shots/TVA-07-offline.png` | pass |
| `tv-agent.html` | `TVA-08-override` | — | `wireframes/shots/TVA-08-override.png` | pass |
| `tv-agent.html` | `TVA-10-bootrecover` | NEW | `wireframes/shots/TVA-10-bootrecover.png` | pass |
