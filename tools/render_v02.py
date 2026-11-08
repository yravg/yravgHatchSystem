from pathlib import Path
import json,re,csv,collections,hashlib,datetime
R=Path(__file__).resolve().parents[1]
def load(p):return json.loads((R/p).read_text())
def save(p,d):(R/p).write_text(json.dumps(d,ensure_ascii=False,indent=2))
def table(h,rows):
 def c(x):return str(x).replace('|','/').replace('\n',' ')
 return '| '+' | '.join(h)+' |\n| '+' | '.join(['---']*len(h))+' |\n'+''.join('| '+' | '.join(c(x) for x in row)+' |\n' for row in rows)
m=load('specs/ticket-manifest.json');T={t['id']:t for t in m['tickets']};req=load('specs/requirements.json');items=m['design_items']
newac='Final Design v0.2 accepted:82screens,58wireframed,58components; exact design reading+primary ownership mapped per ticket. No design wait/incoming placeholder. Backend46..54 and foundation01 precede original UI integration per deps/release. Brand colours provisional pending logo only; domain/security policy outranks illustrative fixtures. Human-ready still required.'
x=next(x for x in req if x['id']=='HS-V02-15');old=x['acceptance'];x['acceptance']=newac;x['title']='Final Design v0.2 intake dan UI-after-backend sequencing'
# Replace superseded provisional hold language in authored operative docs, not historical generation source or imported originals.
for p in [R/'PRD-HatchSystem.md',R/'specs/tickets/01-foundation/rd.md',R/'specs/tickets/01-foundation/eval.md']:
 s=p.read_text().replace(old,newac);p.write_text(s)
# Add relevant new decisions and CEC/offline requirements to original consuming tickets.
extra_dec={1:['D25','D29'],2:['D25'],4:['D26'],10:['D26'],12:['D31'],17:['D30'],19:['D27','D28','D32'],20:['D27','D28'],21:['D27','D28','D32'],23:['D28'],46:['D25'],47:['D26'],49:['D26'],50:['D27','D28','D32'],51:['D27','D28','D32'],52:['D31'],53:['D30']}
for k,values in extra_dec.items():
 tid=str(k).zfill(2);T[tid]['decisions']=sorted(set(T[tid]['decisions']+values));p=R/'specs/tickets'/f'{tid}-{T[tid]["slug"]}'/'rd.md';s=p.read_text()
 for v in values:
  if not re.search(r'(?<![\w-])'+v+r'(?![\w-])',s):s+='\nDecision blocker '+v+': see DECISIONS.md; normative safety/accepted layout distinguished from open policy.\n'
 s=s.replace('Final product UI, provisional design implementation','Final product UI (owned by original integration ticket), competitor assets').replace('Product screens/skin/tokens implementation (held D25)','Product screens/skin implementation (separate UI-owner ticket after backend)')
 p.write_text(s)
for tid in ['19','20','21','23','45']:
 p=R/'specs/tickets'/f'{tid}-{T[tid]["slug"]}'
 section='\n## CEC/offline/provisioning integration v0.2\nSetup requires recorded CEC OFF on TV AND console. CEC is OPTIONAL NEVER REQUIRED. Native/HDMI/IR lock must pass start/pause/expiry/stop/reboot with CEC disabled. Optional CEC TV-power command may report unsupported without weakening independent picture lock. Provisioned-but-unpaired managed TV remains locked, three cold boots keep normal permission or certified fallback; permission loss blocks readiness/repair. Pairing HTTP locked is not actual lock evidence. True offline test proves ALL interfaces (including Ethernet) disconnected; no root/privateAPI/forced grant or console mains. Kula paired/HDMI pending trial; emulator offline test blocked, not a fail/pass runtime result.\n'
 for name in ['rd.md','eval.md']:
  f=p/name;s=f.read_text();s=s.split('\n## CEC/offline/provisioning integration v0.2')[0];f.write_text(s+section)
save('specs/requirements.json',req)
with (R/'specs/requirements.csv').open('w',newline='') as f:
 fields=['id','canonical','ticket','component','phase','disposition','title','acceptance_id','acceptance','source','evidence','reason'];w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(req)
m['tickets']=list(T.values());save('specs/ticket-manifest.json',m)
meta=load('specs/summary.json');meta.update(design_screens=82,design_components=58,wireframed_screens=58,design_status='v0.2 final layout; brand provisional',dispositions=dict(collections.Counter(x['disposition'] for x in req)));save('specs/summary.json',meta)
cov='# Coverage v0.2\n\n'+json.dumps(meta,ensure_ascii=False)+'\n\nOne primary requirement owner. DS-GATE-FINAL owned by Design Desk (not Build), ACCEPTED v0.2. Brand provisional only; UI follows done backend deps and human-ready. Source namespaces unchanged; source aliases not unique features.\n\n'
cov+=table(['ID','Canonical','Primary ticket','Phase','Disposition','Reason'],[(x['id'],x['canonical'],x['ticket'],x['phase'],x['disposition'],x['reason']) for x in req])
cov+='\n## Acceptance IDs\n'+table(['AC ID','Requirement','Ticket','Disposition'],[(x['acceptance_id'],x['id'],x['ticket'],x['disposition']) for x in req])+'\n## Component crosswalk\n'+table(['Component','Ticket','Meaning'],m['components'])
cov+='\n## Design screen/component crosswalk\n'+table(['Design ID','Kind','Primary ticket','Consumers','Disposition','Reason'],[(d['id'],d['kind'],d['primary_ticket'],','.join(d['consumers']),d['disposition'],d['reason']) for d in items])
cov+='\n## Gate coverage\n'+table(['Gate','HTTP','Ticket'],m['gates'])+'\n| DS-GATE-FINAL | N/A | Design Desk / ACCEPTED v0.2 |\n'
cov+='\n## Non-goals\n'+table(['ID','Out-of-scope','Policy owner'],[(a,b,'30 safety audit') for a,b in m['non_goals']])+'\n## Goals\n'+table(['Goal','Primary tickets'],[('G01','03,04,05,06,07,14,17,47,48,49,53'),('G02','19,20,21,23,24,31,50,51,54'),('G03','09,10,11,12,13,25,26,52'),('G04','27,28,29,32,33'),('G05','30,35,36,37,39,40,41,42,43,44,45,46')]);(R/'specs/tickets/COVERAGE.md').write_text(cov)
(R/'specs/ACCEPTANCE.md').write_text('# Acceptance v0.2 — targets, not results\n\nOwner policy locks required; final layout accepted, brand provisional.\n\n'+table(['Requirement','Acceptance','Target','Owner','Disposition'],[(x['id'],x['acceptance_id'],x['acceptance'],x['ticket'],x['disposition']) for x in req]))
(R/'specs/ID-CROSSWALK.md').write_text('# ID crosswalk v0.2\n\nAll source IDs preserved. HS-C domain aliases != HS-CMP visual component IDs; HS-SCR screens not extra functional requirements. Backend46..54 separate implementation ownership; original45 UI/integration owners consume services.\n\n'+table(['Requirement/source','Own canonical','Ticket','Design alias','Legacy source ticket'],[(x['id'],x['canonical'],'HS-T'+x['ticket'],x['component'],x.get('superseded_ticket','—')) for x in req])+'\n## Design crosswalk\n'+table(['Design ID','Primary ticket','Consumers','Scope'],[(d['id'],'HS-T'+d['primary_ticket'],','.join(d['consumers']),d['reason']) for d in items]))
board='# HatchSystem board v0.2\n\n54tickets all draft. Human promotes BOTH board+rd; design acceptance not readiness. Watchdog FIRST; router no code/decomposition; worktrees; team contract; same-worker fixes; Merger+Checker; Reproducer twice. Within approved release do backend/edge/contracts lane first, then UI integrations. V1 T52 stays outside MVP unless owner approves.\n\n'
board+=table(['ID','Name','Status','Mode','Runs','Notes','Lane'],[(tid,'['+T[tid]['title']+']('+tid+'-'+T[tid]['slug']+'/rd.md)','draft',T[tid]['mode'],'waits on '+', '.join(T[tid]['deps'])+' (done artifacts)' if T[tid]['deps'] else 'alongside independent approved work only',T[tid]['phase']+'; '+', '.join(T[tid]['decisions']),T[tid]['execution_lane']) for tid in m['topological_order']])
board+='\n## Coverage summary\n'+json.dumps(meta,ensure_ascii=False)+'\n\n[COVERAGE.md](COVERAGE.md), ../ID-CROSSWALK.md, ../COORDINATION.md, ../design/DESIGN-NOTE.md. DS-GATE-FINAL ACCEPTED:82screens/58wireframed/58components; brand colours provisional only, no design wait. NG01..NG06 remain out-of-scope. Backend46..53 implement services; original UI tickets consume, no duplicate APIs. All deps must really be done.\n';(R/'specs/tickets/board.md').write_text(board)
p=R/'PRD-HatchSystem.md';s=p.read_text();s=s[:s.index('| Requirement | Own canonical |')]
s=s.replace('45canonical vertical slices +15own differentiation = **1089traceability records**','54canonical vertical slices +15own differentiation +18own v0.2 requirements = **1089traceability records**').replace('HS-01..45','HS-01..54').replace('45canonical vertical slices','54canonical vertical slices')
# Replace migration-era provisional-design amendment wholesale.
a=s.index('Design v0.1 snapshot in specs/design') if 'Design v0.1 snapshot in specs/design' in s else -1
if a>=0:
 b=s.index('\n\n',a);s=s[:a]+'Design v0.2 FINAL snapshot in specs/design:82screens,58wireframed,58components; exact required-reading and primary-owner/consumer map in every UI rd. DS-GATE-FINAL accepted by latest owner steering; no incoming placeholder or design hold remains. Brand colours alone provisional until logo. Backend/edge/contracts first, UI after dependencies and human-ready. Security/money rules outrank illustrative design policy; D32 separates8digit pairing fixture from6digitTOTP.'+s[b:]
s+=table(['Requirement','Own canonical','Kemampuan sendiri','Primary ticket','Phase','Disposition','AC'],[(x['id'],x['canonical'],x['title'],x['ticket'],x['phase'],x['disposition'],x['acceptance_id']) for x in req]);p.write_text(s)
# Senet column complete for all284 original market entries; source UNKNOWN remains UNKNOWN.
mat=[]
for line in Path('/workspace/grab/senet/research/MATRIX-SENET.md').read_text().splitlines():
 c=[x.strip() for x in line.strip('|').split('|')]
 if c and re.fullmatch('F[0-9]{3}',c[0]):mat.append(c)
sm={x[0]:x for x in mat};rows=list(csv.DictReader(Path('/workspace/grab/ps-rental-market/MASTER-FEATURE-MATRIX.csv').open()));rby={x['id']:x for x in req}
for x in rows:
 c=sm[x['id']];x['Senet?']=c[3];x['Senet evidence']=c[4];x['Hatch priority']=rby[x['id']]['phase'];x['Hatch ticket']=rby[x['id']]['ticket'];x['Kula?']='Source aliases in requirements.json; pending exact-feature verification' if x['Kula?'].startswith('TBD') else x['Kula?']
 rby[x['id']]['senet_comparison']=[c[3],c[4]]
with (R/'specs/MASTER-FEATURE-MATRIX.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,list(rows[0]));w.writeheader();w.writerows(rows)
(R/'specs/MASTER-FEATURE-MATRIX.md').write_text('# Merged market matrix v0.2\n\nSenet all284rows filled from verified pack; yes/no/UNKNOWN are source-status, not own test results. Exact Kula feature match not inferred merely from common canonical owner.\n\n'+table(list(rows[0]),[list(x.values()) for x in rows]));save('specs/requirements.json',req)
# Refreshed source snapshots, no vendor raw or binaries included.
old=load('sources/intake-manifest.json');paths={x['path'] for x in old}
paths.update(['/workspace/grab/senet/videos/INDEX.md','/workspace/grab/kulapos-rental-ps/tv-agent-emulator/INSTALL-REPORT.md','/workspace/design/hatchsystem/hatchsystem-design-v0.2.zip'])
for id in ['10373656174876','360010819900','360010934959','26291453315228','360010860620','360011020979','360010904480']:
 paths.update(str(p) for p in Path('/workspace/grab/senet/docs/help').glob(id+'-*.md'))
out=[]
for path in sorted(paths):
 p=Path(path)
 if p.exists():out.append({'path':path,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'mtime_local':datetime.datetime.fromtimestamp(p.stat().st_mtime,datetime.timezone(datetime.timedelta(hours=8))).isoformat()})
save('sources/intake-manifest.json',out)
print('rendered local v0.2',len(req),'requirements',len(T),'tickets',len(items),'design IDs')
