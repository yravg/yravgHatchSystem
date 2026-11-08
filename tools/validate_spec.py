#!/usr/bin/env python3
"""Portable structural specification check, not product/runtime tests. No network/secrets."""
from pathlib import Path
import collections,datetime,hashlib,json,re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]; checks=[]
def check(label,ok,detail=''):
 checks.append({'check':label,'pass':bool(ok),'detail':detail})
 if not ok:errors.append(label+(': '+str(detail) if detail else ''))
def read(p):
 p=ROOT/p
 if not p.exists():errors.append('missing file '+str(p.relative_to(ROOT)));return ''
 return p.read_text()
def contains(text,id):return re.search(r'(?<![A-Za-z0-9-])'+re.escape(id)+r'(?![A-Za-z0-9-])',text) is not None
required=['PRD-HatchSystem.md','CONTRACTS.md','DECISIONS.md','CLAUDE.md','BUILD-PROMPT.md','INPUT-STATUS.md','hardware/CERTIFICATION.md','hardware/CERTIFICATION.csv','specs/SHARED-CORE-TRIAGE.md','specs/SUPERSESSION.md','specs/ACCEPTANCE.md','specs/ID-CROSSWALK.md','specs/tickets/board.md','specs/tickets/COVERAGE.md','sources/intake-manifest.json']
for x in required:check('file '+x,(ROOT/x).is_file())
r=json.loads(read('specs/requirements.json'));m=json.loads(read('specs/ticket-manifest.json'));meta=json.loads(read('specs/summary.json'))
ids=[x['id'] for x in r];rid=set(ids);byid={x['id']:x for x in r}; tickets={x['id']:x for x in m['tickets']}
check('unique requirement IDs',len(ids)==len(rid));check('unique AC IDs',len({x['acceptance_id'] for x in r})==len(r))
expected={f'FR-KPS-{i:02}' for i in range(1,70)}|{f'FR-KULA-{i:03}' for i in range(1,521)}|{f'FR-SENET-{i:02}' for i in range(1,130)}|{f'F{i:03}' for i in range(1,285)}|{f'HS-{i:02}' for i in range(1,55)}|{f'HS-GAP-{i:02}' for i in range(1,16)}|{f'HS-V02-{i:02}' for i in range(1,19)}
check('complete namespace snapshot exact',rid==expected,{'missing':sorted(expected-rid),'extra':sorted(rid-expected)})
coverage=read('specs/tickets/COVERAGE.md');prd=read('PRD-HatchSystem.md');accept=read('specs/ACCEPTANCE.md');cross=read('specs/ID-CROSSWALK.md');board=read('specs/tickets/board.md')
# Parse primary ownership rows, not a tautological substring count across AC section.
cr={}
for line in coverage.split('## Acceptance IDs')[0].splitlines():
 cells=[x.strip() for x in line.strip('|').split('|')]
 if cells and cells[0] in rid:cr.setdefault(cells[0],[]).append(cells)
check('every coverage requirement exactly one disposition',set(cr)==rid and all(len(x)==1 for x in cr.values()))
for x in r:
 id=x['id'];tid=x['ticket'];t=tickets.get(tid)
 check('owner exists '+id,bool(t))
 if not t:continue
 p=ROOT/'specs/tickets'/f'{tid}-{t["slug"]}'
 for name,text in [('PRD',prd),('coverage',coverage),('acceptance',accept),('crosswalk',cross)]:check(name+' has '+id,contains(text,id))
 check('AC coverage '+id,contains(coverage,x['acceptance_id']) and contains(accept,x['acceptance_id']))
 if id in cr:
  cells=cr[id][0];check('coverage owner/phase/disposition '+id,len(cells)>=6 and cells[1:5]==[x['canonical'],tid,x['phase'],x['disposition']])
 check('disposition valid '+id,x['disposition'] in ('ticket','deferred','out-of-scope'))
 check('own canonical/component '+id,x['canonical']=='HS-'+tid and x['component']=='HS-C'+tid)
 check('nonempty acceptance '+id,len(x['acceptance'])>=30)
 if x['disposition']!='ticket':check('defer/exclusion reason '+id,len(x['reason'])>=20)
 if x['disposition']=='deferred':check('V2 deferred '+id,x['phase']=='V2')
 if x['disposition']=='ticket':check('phase not V2 owner '+id,x['phase'] in ('MVP','V1') and t['phase']!='V2')
 if x['disposition']=='out-of-scope':check('ticket audit has exclusion '+id,contains((p/'EXCLUSIONS.md').read_text(),id))
 else:
  rd=(p/'rd.md').read_text();ev=(p/'eval.md').read_text()
  check('ticket rd requirement+AC '+id,contains(rd,id) and contains(rd,x['acceptance_id']))
  check('ticket eval requirement+AC '+id,contains(ev,id) and contains(ev,x['acceptance_id']))
  owners=[]
  for other in tickets.values():
   text=(ROOT/'specs/tickets'/f'{other["id"]}-{other["slug"]}'/'rd.md').read_text()
   if re.search(r'^\| '+re.escape(id)+r' \|',text,re.M):owners.append(other['id'])
  check('single primary rd table owner '+id,owners==[tid],owners)
star=[x for x in r if x.get('upstream_star')]
check('all 144 starred KULA in scope',len(star)==144 and all(x['disposition']!='out-of-scope' for x in star))
check('summary actual counts',meta['total_traceability_rows']==len(r) and meta['dispositions']==dict(collections.Counter(x['disposition'] for x in r)))
check('54 ticket folders',len(tickets)==54 and len(list((ROOT/'specs/tickets').glob('*/rd.md')))==54)
rd_headers=['Mandate','ID crosswalk','Behaviour','Touches','Must not touch','Deps','Decisions','Out of scope'];eval_headers=['Checks','Edge / failure cases','Evidence','Definition of done']
for tid,t in tickets.items():
 p=ROOT/'specs/tickets'/f'{tid}-{t["slug"]}'
 for name in ['rd.md','eval.md','results.md','evidence/README.md']:check('ticket '+tid+' '+name,(p/name).is_file())
 rd=(p/'rd.md').read_text();ev=(p/'eval.md').read_text()
 # Owner promotion moves a ticket past draft; board and rd must still agree on one known status.
 st=re.search(r'^Status: \*\*(draft|ready|in progress|blocked|done)\*\*',rd,re.M)
 check('board+rd status agree '+tid,bool(st) and re.search(r'^\| '+tid+r' \|.*\| '+st.group(1)+r' \| '+t['mode']+r' \|',board,re.M))
 check('rd headings '+tid,all('## '+h in rd for h in rd_headers));check('eval headings '+tid,all('## '+h in ev for h in eval_headers))
 check('mode '+tid,'Mode: **'+t['mode']+'**' in rd)
 if t['mode']=='team':check('team contract '+tid,(p/'contract.md').is_file())
 check('deps valid '+tid,all(d in tickets and d!=tid for d in t['deps']))
 for d in t['deps']:check('deps rd '+tid+'→'+d,'HS-T'+d in rd)
 for dec in t['decisions']:check('decision exists '+tid+' '+dec,contains(read('DECISIONS.md'),dec) and contains(rd,dec))
order=m['topological_order'];check('topological membership',len(order)==len(tickets) and set(order)==set(tickets))
check('DAG dependency order',all(order.index(d)<order.index(tid) for tid,t in tickets.items() for d in t['deps']))
for cid,tid,label in m['components']:
 rd=read(f'specs/tickets/{tid}-{tickets[tid]["slug"]}/rd.md')
 check('component coverage '+cid,contains(coverage,cid) and contains(rd,cid))
for gate,http,tid0 in m['gates']:
 tid=str(tid0).zfill(2);p=f'specs/tickets/{tid}-{tickets[tid]["slug"]}/'
 check('gate coverage '+gate,contains(coverage,gate) and contains(read(p+'rd.md'),gate) and contains(read(p+'eval.md'),gate))
for ng,meaning in m['non_goals']:
 check('non-goal coverage '+ng,contains(coverage,ng) and contains(prd,ng))
for i in range(1,6):check('goal coverage G0'+str(i),contains(coverage,'G0'+str(i)) and contains(prd,'G0'+str(i)))
for i in range(1,33):check('decision D'+str(i).zfill(2),contains(read('DECISIONS.md'),'D'+str(i).zfill(2)))
# No unknown requirement/AC ID in authored master files. Exclude generator strings with template expressions.
pattern=r'(?<![A-Za-z0-9-])(?:FR-KPS-\d{2}|FR-KULA-\d{3}|FR-SENET-\d{2,3}|HS-GAP-\d{2}|HS-V02-\d{2}|HS-\d{2}|F\d{3})(?![A-Za-z0-9-])'
acids={x['acceptance_id'] for x in r};acpattern=r'(?<![A-Za-z0-9-])AC-(?:KPS-\d{2}|FR-KULA-\d{3}|FR-SENET-\d{2,3}|HS-GAP-\d{2}|HS-V02-\d{2}|HS-\d{2}|F\d{3})(?![A-Za-z0-9-])'
for p in ROOT.rglob('*.md'):
 if p.name=='VALIDATION.md':continue
 text=p.read_text();dangling=set(re.findall(pattern,text))-rid;danglingac=set(re.findall(acpattern,text))-acids
 check('no dangling IDs '+str(p.relative_to(ROOT)),not dangling and not danglingac,sorted(dangling|danglingac))
# Never package upstream raw/implementation/media.
banned_ext={'.apk','.exe','.dll','.so','.srt','.png','.jpg','.jpeg','.webp','.mp4','.woff','.woff2','.pem','.key'}
# as_posix: Windows separators broke the shots allow-list; the repo's own top-level .git is not a packaged artifact.
bad=[p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file() and p.relative_to(ROOT).parts[0]!='.git' and ((p.suffix.lower() in banned_ext and not (p.suffix.lower()=='.png' and p.relative_to(ROOT).as_posix().startswith('specs/design/wireframes/shots/'))) or any(c in ('raw','private','pages','node_modules','.git') for c in p.relative_to(ROOT).parts))]
check('no prohibited vendor/raw/binary artifacts',not bad,bad)
check('prompt preserves human readiness','only human-ready' in read('BUILD-PROMPT.md') and 'All54tickets supplied draft' in read('BUILD-PROMPT.md'))
check('separate Midtrans signature secret','Signature Secret Key' in read('CONTRACTS.md') and 'no silent key fallback' in read('BUILD-PROMPT.md'))
# v0.2 design and verified matrix checks.
ditems=m['design_items'];did={d['id'] for d in ditems}
surfaces=read('specs/design/SURFACES.md');components=read('specs/design/COMPONENTS.md')
actualscreens=set(re.findall(r'^\| (HS-SCR-[A-Z]+-\d{2}) \|',surfaces,re.M));actualcmps=set(re.findall(r'^\| (HS-CMP-\d{3}) \|',components,re.M))
check('design82screen58component exact inventory',len(actualscreens)==82 and len(actualcmps)==58 and did==actualscreens|actualcmps)
check('unique design primary',len(ditems)==len(did))
for d in ditems:
 tid=d['primary_ticket'];rd=read(f'specs/tickets/{tid}-{tickets[tid]["slug"]}/rd.md')
 check('design primary touch '+d['id'],contains(rd,d['id']) and contains(coverage,d['id']) and contains(cross,d['id']))
 check('design consumers valid '+d['id'],all(c in tickets for c in d['consumers']))
 check('design source aliases known '+d['id'],set(d['source_ids'])<=rid)
for tid in [f'{i:02}' for i in range(1,46)]:
 rd=read(f'specs/tickets/{tid}-{tickets[tid]["slug"]}/rd.md')
 check('UI required reading '+tid,'specs/design/DESIGN-NOTE.md' in rd and 'SURFACES.md' in rd and 'COMPONENTS.md' in rd and 'Design v0.2 required reading' in rd)
check('design final accepted/no hold',m['design_gate']['status']=='ACCEPTED' and all(not t.get('ui_hold') for t in tickets.values()) and (ROOT/'specs/design/FINAL-APPROVAL.json').exists() and not (ROOT/'specs/design/V02-SLOT.md').exists())
for tid in [f'{i:02}' for i in range(46,55)]:check('backend lane '+tid,tickets[tid]['execution_lane']=='backend-first')
import csv
matrix=list(csv.DictReader((ROOT/'specs/MASTER-FEATURE-MATRIX.csv').open()))
check('284Senet matrix rows complete',len(matrix)==284 and {x['id'] for x in matrix}=={f'F{i:03}' for i in range(1,285)} and all(x['Senet?'] in ('yes','no','UNKNOWN') and x['Senet evidence'] for x in matrix))
status=read('INPUT-STATUS.md')
check('video truth70/17/4/49',all(x in status for x in ['70unique','53videos+17webinars','17with transcripts','4with no captions','49with captions']) and not re.search(r'16\s*(?:/|of)\s*(?:21|70)|5 missing|54video',status,re.I))
check('Kula offline blocked/unverified','Offline behaviour: unverified' in status and 'BLOCKED' in status and 'Paired lock and HDMI control: unverified, pending trial' in status)
for tid in ['19','20','21','23','45','50','51']:
 rd=read(f'specs/tickets/{tid}-{tickets[tid]["slug"]}/rd.md');ev=read(f'specs/tickets/{tid}-{tickets[tid]["slug"]}/eval.md')
 check('CEC off criterion '+tid,'CEC' in rd and 'CEC' in ev and ('off' in rd.lower() or 'disabled' in rd.lower()))
for p in [ROOT/'BUILD-PROMPT.md',ROOT/'CLAUDE.md']:
 check('final sequencing '+p.name,'v0.2' in p.read_text() and 'backend' in p.read_text().lower())
result={'status':'PASS' if not errors else 'FAIL','scope':'Structural specification traceability only; no runtime/browser/hardware/payment tests performed','checked_at_Asia_Shanghai':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(),'requirements':len(r),'canonical_vertical_slices':54,'own_gap_requirements':15,'tickets':len(tickets),'team_tickets':sum(t['mode']=='team' for t in tickets.values()),'dispositions':dict(collections.Counter(x['disposition'] for x in r)),'checks':len(checks),'passed':sum(c['pass'] for c in checks),'errors':errors,'details':checks}
(ROOT/'VALIDATION.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
(ROOT/'VALIDATION.md').write_text('# Structural validation\n\n'+result['status']+' — '+str(result['passed'])+'/'+str(result['checks'])+' checks.\n\n'+result['scope']+'\n\nTimestamp: '+result['checked_at_Asia_Shanghai']+' (UTC+8).\n\n'+json.dumps({k:v for k,v in result.items() if k not in ('details','errors')},ensure_ascii=False,indent=2)+'\n\nErrors: '+json.dumps(errors,ensure_ascii=False)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='details'},ensure_ascii=False,indent=2));sys.exit(1 if errors else 0)
