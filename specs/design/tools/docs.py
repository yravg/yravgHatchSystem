import re
import sys,json,collections;sys.path.insert(0,'.')
import data
from tokens import T
D='/workspace/design/hatchsystem/'
FR=json.load(open('/tmp/frames.json'))
frames_by_scr=collections.defaultdict(list)
for fid,w,h in FR:
  sur,num=fid.split('-')[0],fid.split('-')[1]
  for s in data.SCREENS:
    code=s[0].split('-')[2]; n=s[0].split('-')[3]
    num=re.match(r'\d+',num).group(0)
    if code==sur and (n==num or (sur in('CUS','GWY','OWN') and fid.startswith(f"{sur}-{num}") and n in {'05':['05','06'],'01':['01','02']}.get(num,[num]))):
      frames_by_scr[s[0]].append(fid)
names={}
for f in ['kps','kula','sn','mx']:
  for l in open(f'/tmp/{f}.tsv'):
    p=l.rstrip('\n').split('\t'); names[p[0]]=p[1] if f in('kps',) else (p[2] if f=='mx' else (p[2] if f=='kula' else p[1]))
cov=collections.defaultdict(list)
for s in data.SCREENS:
  for r in s[4]+data.EXTRA.get(s[0],[]): 
    if s[0] not in cov[r]: cov[r].append(s[0])
ids={f:[l.split('\t')[0] for l in open(f'/tmp/{f}.tsv')] for f in ['kps','kula','sn','mx']}
sur={c:(n,v,fn) for c,n,v,fn in data.SURFACES}
o=["# HatchSystem SURFACES v0.1","","Design Desk · 8 Nov 2026 (Asia/Shanghai) · status: draft for Grok Bot's merge","",
"**Id rule.** Screens use `HS-SCR-<SURFACE>-NN`. These are **design-only ids** (a screen namespace, not requirements). Every screen is traced only to **source requirement ids** as they appear in the capture packs: `FR-KPS-NN` (Kula rental PS pack), `FR-KULA-NNN` (Kula full-site pack, ⭐ rental/gaming rows), `FR-SENET-NN` (Senet pack, partial — deep pass still running) and `FNNN` (market matrix, `MASTER-FEATURE-MATRIX.md`). No new requirement ids are invented; Grok's PRD publishes the crosswalk.","",
"**Evidence caveat.** Kula captures are marketing pages, public tutorials and the public simulator, not the in-app cashier/admin. In-app parity screens below are inferred from those docs and must be re-checked once trial captures exist.","",
"Standard states every screen must design for: empty · loading (`loaderFade`, 300 ms delay, no spinner) · offline · error · permission · success. Screen-specific states are listed per row.","",
f"## Surfaces ({len(data.SURFACES)})","","| Code | Surface | Target | Wireframe |","|---|---|---|---|"]
for c,n,v,fn in data.SURFACES: o.append(f"| {c} | {n} | {v} | `wireframes/{fn}` |")
o+=["",f"## Screens ({len(data.SCREENS)})",""]
for c,n,v,fn in data.SURFACES:
  o+=[f"### {c} · {n}","","| Screen | Name | Specific states | Wireframe frames | Traces (source ids) |","|---|---|---|---|---|"]
  for s in data.SCREENS:
    if s[1]==c:
      tr=s[4]+data.EXTRA.get(s[0],[]); fr=", ".join(f"`{x}`" for x in frames_by_scr.get(s[0],[])) or "spec only (states in COMPONENTS)"
      o.append(f"| {s[0]} | {s[2]} | {s[3]} | {fr} | {', '.join(sorted(set(tr)))} |")
  o.append("")
xw=json.load(open('/tmp/xw.json'))
tick_scr=collections.defaultdict(collections.Counter)
for r,sc in cov.items():
  for x in sc: tick_scr[xw.get(r)][x]+=1
norm={}
for r in data.OTHER_INDUSTRY:
  t=xw.get(r); top=[k for k,_ in tick_scr[t].most_common(2)]
  if top: norm[r]=top; cov[r]=top
total=0;ui=0
o+=["## Coverage table","","Keyed by source id, with the owning ticket from Grok's `specs/ID-CROSSWALK.md` (read-only). `→` screens that carry its UI. `no UI` = backend/policy only. `(normalised)` = Kula ⭐ row from another industry that the crosswalk normalises to a generic concept; it uses the generic screen named.",""]
labels={'kps':'FR-KPS (rental PS pack, 69)','kula':'FR-KULA ⭐ (full-site pack, 144 rental/gaming rows)','sn':'FR-SENET (Senet pack, 129, partial)','mx':'Market matrix F001–F284'}
stats={}
for f in ['kps','kula','sn','mx']:
  o+=[f"### {labels[f]}","","| Req id | Feature | Ticket | UI screens |","|---|---|---|---|"]
  c=collections.Counter()
  for r in ids[f]:
    if r in norm: v="→ "+", ".join(cov[r])+" (normalised)";c['normalised']+=1
    elif r in cov: v="→ "+", ".join(cov[r]);c['ui']+=1
    elif r in data.NO_UI: v="no UI — "+data.NO_UI[r];c['noui']+=1
    elif r in data.OTHER_INDUSTRY: v="out of scope — other industry";c['oos']+=1
    else: v="**GAP**";c['gap']+=1
    o.append(f"| {r} | {names.get(r,'').replace('|','/')} | {xw.get(r,'?')} | {v} |")
  stats[f]=dict(c,total=len(ids[f]));o+=["",f"Totals: {dict(c)} of {len(ids[f])}",""]
gaps=sum(s.get('gap',0) for s in stats.values())
o+=["## Gap summary","",f"Requirements with UI but no screen: **{gaps}**.",""]
open(D+'SURFACES.md','w').write("\n".join(o))
tickets=collections.defaultdict(set)
for r,sc in cov.items():
  if r in xw: tickets[xw[r]].update(sc)
json.dump({k:sorted(v) for k,v in tickets.items()},open('/tmp/tickets.json','w'))
json.dump({'stats':stats,'screens':len(data.SCREENS),'frames':len(FR),'gaps':gaps,'fmap':frames_by_scr},open('/tmp/stats.json','w'))
print(stats,gaps,sum(1 for s in data.SCREENS if frames_by_scr.get(s[0])))
