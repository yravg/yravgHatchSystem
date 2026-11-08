from pathlib import Path
import json,re,zipfile,shutil,hashlib,datetime
R=Path(__file__).resolve().parents[1];z=Path('/workspace/design/hatchsystem/hatchsystem-design-v0.2.zip');d=R/'specs/design'
# Replace only this task's own provisional snapshot; never copy competing app assets.
shutil.rmtree(d);d.mkdir()
files=[]
with zipfile.ZipFile(z) as a:
 for x in a.infolist():
  p=Path(x.filename)
  if x.is_dir() or '__pycache__' in p.parts:continue
  rel=Path(*p.parts[1:]);assert not rel.is_absolute() and '..' not in rel.parts
  dst=d/rel;dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(a.read(x));files.append(str(rel))
m=json.loads((R/'specs/ticket-manifest.json').read_text());T={x['id']:x for x in m['tickets']};old={x['id']:x['primary_ticket'] for x in m['design_items']};consumer={}
for line in (d/'DESIGN-NOTE.md').read_text().splitlines():
 c=[v.strip() for v in line.strip('|').split('|')]
 if c and re.fullmatch('HS-T[0-9]{2}',c[0]):consumer[c[0][4:]]={'screens':sorted(set(re.findall(r'HS-SCR-[A-Z]+-\d{2}',c[2]))),'components':sorted(set(re.findall(r'HS-CMP-\d{3}',c[3]+(' '+c[2] if 'no screen' in c[2] else ''))))}
screens={}
for line in (d/'SURFACES.md').read_text().splitlines():
 c=[v.strip() for v in line.strip('|').split('|')]
 if c and re.fullmatch(r'HS-SCR-[A-Z]+-\d{2}',c[0]):screens[c[0]]=c
cmps=sorted(set(re.findall(r'^\| (HS-CMP-\d{3}) \|',(d/'COMPONENTS.md').read_text(),re.M)))
primary_new={'HS-SCR-CSH-12':'12','HS-SCR-CSH-13':'17','HS-SCR-CSH-14':'17','HS-SCR-CSH-15':'05','HS-SCR-ADM-20':'04','HS-SCR-ADM-21':'12','HS-SCR-ADM-22':'02','HS-SCR-ADM-23':'02','HS-SCR-ADM-24':'42','HS-SCR-ADM-25':'32'}
primary_new.update({f'HS-CMP-{46+i:03}':t for i,t in enumerate(['04','12','12','17','17','05','02','02','42','32','21','21','01'])})
items=[]
for id in list(screens)+cmps:
 kind='screen' if id in screens else 'component';tid=old.get(id) or primary_new[id]
 consumer.setdefault(tid,{'screens':[],'components':[]});key='screens' if kind=='screen' else 'components';consumer[tid][key]=sorted(set(consumer[tid][key]+[id]))
 items.append(dict(id=id,kind=kind,primary_ticket=tid,consumers=sorted(k for k,v in consumer.items() if id in v[key]),disposition='deferred' if T[tid]['phase']=='V2' else 'ticket',phase=T[tid]['phase'],source_ids=sorted(set(re.findall(r'(?<![\w-])(?:FR-KPS-\d{2}|FR-KULA-\d{3}|FR-SENET-\d{2,3}|F\d{3})(?![\w-])',screens[id][-1]))) if kind=='screen' else [],reason='Final Design v0.2 accepted by owner steering; brand colours provisional only. Single primary owner, other tickets consumers.'))
assert len(screens)==82 and len(cmps)==58
for tid,t in T.items():
 if int(tid)<=45:
  t['ui_hold']=False;t['execution_lane']='foundation-backend-first' if tid=='01' else 'ui-after-backend'
  p=R/'specs/tickets'/f'{tid}-{t["slug"]}'/'rd.md';s=p.read_text();s=s.split('\n## Design required reading / UI HOLD')[0]
  c=consumer[tid];s+='\n## Design v0.2 required reading (final layout; brand provisional)\nRead specs/design/DESIGN-NOTE.md (merge precedence), DESIGN.md and exact sections of SURFACES.md and COMPONENTS.md:\nScreens: '+(', '.join(c['screens']) or 'none; foundation tokens')+'\nComponents: '+(', '.join(c['components']) or 'none')+'\nTouches (design primary): '+', '.join(x['id'] for x in items if x['primary_ticket']==tid)+'\nNo design wait remains: implement after backend/edge/contracts dependencies and human readiness. Brand.* tokens provisional until logo; no competitor assets/copy. HS-C domain aliases != HS-CMP visual IDs. Security/money/ACK policies in CONTRACTS/DECISIONS override sample wireframe values; PIN format D32, CEC optional/off by default, refund_pending not returned cash, no anonymous bypass.\n';p.write_text(s)
  p=p.parent/'eval.md';s=p.read_text();s=s.split('\n## Final-design gate')[0];s+='\n## Design v0.2 evidence\nRead accepted design intake hash; real-browser/native screen evidence for mapped screens/components and empty/loading/error/offline/permission states. Layout final, brand provisional is not a blocker. Validate eight-digit/5minute pairing fixture over visual six-character sample until owner decides D32; no fake optical ACK/refunded or cached paid state. Screen money/security uses CONTRACTS, not sample wireframe figures.\n';p.write_text(s)
m.update(design_items=items,design_gate={'id':'DS-GATE-FINAL','disposition':'owned by Design Desk (not Build)','status':'ACCEPTED','version':'v0.2 final layout; brand provisional'},tickets=list(T.values()))
(R/'specs/ticket-manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2));(d/'DESIGN-CROSSWALK.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
intake={'version':'0.2 final layout; brand colours provisional','source':str(z),'source_sha256':hashlib.sha256(z.read_bytes()).hexdigest(),'files':files,'screens':82,'components':58,'wireframed_screens':58,'approved_by':'owner steering2026-11-08: Design v0.2 final; UI no longer waits','checked_at_Asia_Shanghai':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat()}
(R/'sources/design-intake.json').write_text(json.dumps(intake,ensure_ascii=False,indent=2));(d/'FINAL-APPROVAL.json').write_text(json.dumps(intake,ensure_ascii=False,indent=2))
amend='''> MERGE NOTE v0.2 (normative): owner accepted Design v0.2 layout; UI design hold removed. Brand colours remain provisional pending logo, not a delivery blocker. This stable archive has82screens,58wireframed screens and58components; some original file-list captions still say46frames and are superseded by this count and RENDER-CHECK. Nine backend-first tickets46..54 were added after Design Desk mapped the original45; they have no final product screens. All original45 rd files list exact screen/component required reading. Money/security/domain contracts override illustrative design policy: no fake auto-refund, CEC optional/off at TV+console, managed provisioning required for kiosk claims, eight-digit5minute fixture vs visual six-character sample is D32. Design states are visual projections, not replacements for domain/device/financial states.\n\n'''
p=d/'DESIGN-NOTE.md';p.write_text(amend+p.read_text())
print('accepted82screens/58components from local final archive')
