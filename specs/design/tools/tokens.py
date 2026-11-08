import json
T={
"brand":{"$description":"PROVISIONAL slot: replace with logo-derived palette when Enrico supplies the logo",
  "primary":"#B4532A","primary-hover":"#9A4521","primary-ink":"#FFFFFF","primary-tint":"#F6E7DF","on-dark":"#E8875C"},
"light":{"canvas":"#FAF9F5","surface":"#FFFFFF","surface-2":"#F3F0E8","line":"#E6E2D8","line-strong":"#C9C3B5",
  "ink":"#1F1F1F","ink-dim":"#55524C","ink-faint":"#76726A","slate":"#4A5B72","ok":"#2F7A4F","warn":"#8A5A0B","danger":"#8E3B24","focus":"#1D5FD1"},
"dark":{"canvas":"#121110","surface":"#1E1C1A","surface-2":"#2A2724","line":"#3A3632","ink":"#F4F1EA","ink-dim":"#C9C3B8","ink-faint":"#9C968C","focus":"#FFD54A"},
"state":{
 "idle":{"tv":"#A9B8CC","on":"#FFFFFF","fg":"#3E4C60","bg":"#E9EDF2","solid":"#4A5B72","icon":"○","id":"Kosong","en":"Free"},
 "booked":{"tv":"#C3B0E6","on":"#FFFFFF","fg":"#5A3F8C","bg":"#EEE8F7","solid":"#6B4FA0","icon":"◆","id":"Dipesan","en":"Booked"},
 "running":{"tv":"#7FD3A0","on":"#FFFFFF","fg":"#1F5E3A","bg":"#E3F1E8","solid":"#2F7A4F","icon":"▶","id":"Main","en":"Running"},
 "ending":{"tv":"#F2C063","on":"#1F1F1F","fg":"#7A4E06","bg":"#FBEFD6","solid":"#C8901E","icon":"◔","id":"Hampir habis","en":"Ending soon"},
 "overtime":{"tv":"#FF8A80","on":"#FFFFFF","fg":"#8F1D17","bg":"#FBE3E1","solid":"#B3261E","icon":"!","id":"Lewat waktu","en":"Overtime"},
 "paused":{"tv":"#8DB8E8","on":"#FFFFFF","fg":"#2C5785","bg":"#E3EDF8","solid":"#3A6EA5","icon":"‖","id":"Jeda","en":"Paused"},
 "offline":{"tv":"#B5B5B5","on":"#FFFFFF","fg":"#4D4D4D","bg":"#ECECEC","solid":"#6B6B6B","icon":"⊘","id":"Offline","en":"Offline"},
 "maintenance":{"tv":"#CDB59C","on":"#FFFFFF","fg":"#5C4A3A","bg":"#EFE9E3","solid":"#7A6450","icon":"✕","id":"Perbaikan","en":"Maintenance"}},
"type":{"family":"Inter, 'Noto Sans', system-ui, sans-serif","mono":"'JetBrains Mono', 'DejaVu Sans Mono', ui-monospace, monospace",
 "ops":{"xs":"12px/16px","sm":"14px/20px","md":"16px/24px","lg":"20px/28px","xl":"24px/32px","2xl":"32px/40px","num":"28px/32px"},
 "tv":{"body":"28px/36px","label":"24px/32px","title":"44px/52px","timer":"96px/100px","timer-corner":"40px/44px","hero":"72px/80px"}},
"space":{"0":"0","1":"4px","2":"8px","3":"12px","4":"16px","5":"20px","6":"24px","8":"32px","10":"40px","12":"48px","16":"64px","tv-safe":"5%"},
"radius":{"sm":"6px","md":"8px","lg":"12px","xl":"16px","pill":"999px"},
"elevation":{"0":"none","1":"0 1px 2px rgba(31,31,31,.06)","2":"0 4px 12px rgba(31,31,31,.08)","3":"0 12px 32px rgba(31,31,31,.14)","tv":"0 8px 32px rgba(0,0,0,.5)"},
"focus":{"ops":"0 0 0 2px #FFFFFF, 0 0 0 4px #1D5FD1","tv":"0 0 0 4px #121110, 0 0 0 8px #FFD54A","tv-scale":"1.04"},
"size":{"touch-min":"44px","cashier-tile-min":"168px","tv-focus-min":"72px"},
"motion":{"ease-out":"cubic-bezier(0.2,0,0,1)","ease-in":"cubic-bezier(0.55,0,1,0.45)","ease-cross":"cubic-bezier(0.4,0,0.6,1)",
 "pageEnter":"400ms cubic-bezier(0.25,0.24,0.16,1.02) / spring 300/34","tabPill":"430ms cubic-bezier(0.29,0.35,0.14,1.17) / spring 280/27",
 "segmentToggle":"290ms cubic-bezier(0.24,0.16,0.22,1) / spring 420/38","modalOpen":"260ms cubic-bezier(0.23,0.09,0.29,0.96) / spring 380/34",
 "modalClose":"120ms cubic-bezier(0.55,0,1,0.45)","chartDataChange":"0ms","hoverTooltip":"0ms","loaderFade":"delay 300ms, in 160ms, min 500ms, out 120ms",
 "tvFocus":"120ms cubic-bezier(0.2,0,0,1) (transform+box-shadow only)","toastEnter":"= modalOpen","timerTick":"0ms (numbers never tween)"},
}
def w3c(o):
  if isinstance(o,dict):
    return {k:(w3c(v) if isinstance(v,dict) else {"$value":v}) for k,v in o.items() if not k.startswith('$')} | ({"$description":o["$description"]} if "$description" in o else {})
  return o
json.dump(w3c(T),open('../tokens.json','w'),indent=1,ensure_ascii=False)
L=[":root{","  /* brand.* = PROVISIONAL (logo pending) */"]
for k,v in T["brand"].items():
  if not k.startswith('$'): L.append(f"  --hs-brand-{k}:{v};")
for k,v in T["light"].items(): L.append(f"  --hs-{k}:{v};")
for k,o in T["state"].items():
  for p in("fg","bg","solid","tv","on"): L.append(f"  --hs-state-{k}-{p}:{o[p]};")
L.append(f"  --hs-font:{T['type']['family']};\n  --hs-mono:{T['type']['mono']};")
for k,v in T["space"].items(): L.append(f"  --hs-space-{k}:{v};")
for k,v in T["radius"].items(): L.append(f"  --hs-radius-{k}:{v};")
for k,v in T["elevation"].items(): L.append(f"  --hs-elev-{k}:{v};")
L.append(f"  --hs-focus-ops:{T['focus']['ops']};\n  --hs-focus-tv:{T['focus']['tv']};")
L.append("  --yr-ease-out:cubic-bezier(0.2,0,0,1);\n  --yr-ease-in:cubic-bezier(0.55,0,1,0.45);\n  --yr-ease-cross:cubic-bezier(0.4,0,0.6,1);\n  --yr-page-move-ms:400ms;\n  --yr-modal-open-ms:260ms;\n  --yr-modal-close-ms:120ms;\n  --hs-tv-focus-ms:120ms;")
L.append("}")
L.append(".hs-dark,[data-theme=tv]{"+"".join(f"--hs-{k}:{v};" for k,v in T["dark"].items())+"--hs-brand-primary:var(--hs-brand-on-dark);}")
L.append("@media (prefers-reduced-motion:reduce){:root{--yr-page-move-ms:0ms;--yr-modal-open-ms:120ms;--yr-modal-close-ms:0ms;--hs-tv-focus-ms:0ms}}")
L.append("/* Tailwind v4: @theme inline { --color-brand: var(--hs-brand-primary); --color-canvas: var(--hs-canvas); ... } */")
L.append("@theme inline{--color-brand:var(--hs-brand-primary);--color-canvas:var(--hs-canvas);--color-surface:var(--hs-surface);--color-ink:var(--hs-ink);--color-line:var(--hs-line);"+"".join(f"--color-state-{k}:var(--hs-state-{k}-solid);" for k in T['state'])+"--radius-md:var(--hs-radius-md);--font-sans:var(--hs-font);}")
open('../tailwind.tokens.css','w').write("\n".join(L)+"\n")
