import json,re,sys;sys.path.insert(0,'.');import data
t=json.load(open('/tmp/tickets.json'))
titles={}
import glob
for f in glob.glob('/workspace/documentation/hatchsystem/specs/tickets/*/rd.md'):
  m=re.match(r'# (HS-T\d+) — (.*)',open(f).readline().strip())
  if m: titles[m.group(1)]=m.group(2)
fmap=json.load(open('/tmp/stats.json'))['fmap']
SC={ # screen -> HS-CMP ids
'CSH-01':[1,2,3,19],'CSH-02':[4,5,13],'CSH-03':[3,6],'CSH-04':[7],'CSH-05':[8,9,10],'CSH-06':[11,12,13],'CSH-07':[16],'CSH-08':[17],'CSH-09':[18],'CSH-10':[20],'CSH-11':[19],
'ADM-01':[21,22],'ADM-02':[23],'ADM-03':[23,26,31],'ADM-04':[24],'ADM-05':[23,12],'ADM-06':[14,23],'ADM-07':[23,7],'ADM-08':[23,21],'ADM-09':[23],'ADM-10':[25],'ADM-11':[26],'ADM-12':[27],'ADM-13':[23],'ADM-14':[28],'ADM-15':[21],'ADM-16':[23],'ADM-17':[23],'ADM-18':[21,23],'ADM-19':[23,38],
'CUS-01':[2,22],'CUS-02':[14],'CUS-03':[9,15],'CUS-04':[7],'CUS-05':[3,20],'CUS-06':[3,20],'CUS-07':[12,11],'CUS-08':[8],'CUS-09':[25],
'KDS-01':[41],'KDS-02':[41],'LBY-01':[40],'LBY-02':[40],'LBY-03':[25,40],'CFD-01':[42,9],'KSK-01':[39],'KSK-02':[39,11],'KSK-03':[39],'KSK-04':[39,9,5],'KSK-05':[39],
'TVA-01':[30],'TVA-02':[31],'TVA-03':[32],'TVA-04':[33,3],'TVA-05':[34],'TVA-06':[35],'TVA-07':[36,33],'TVA-08':[37],'TVA-09':[38],'TVA-10':[31],
'ADP-01':[29],'ADP-02':[32],'PCA-01':[43],'PCA-02':[43,34],'PCA-03':[43,7,20],'PCA-04':[43],'GWY-01':[30,45],'GWY-02':[45,19],'OWN-01':[21,22],'OWN-02':[18,17],'MAG-01':[44],'MAG-02':[44],'CSH-12':[48,16],'CSH-13':[49],'CSH-14':[49,50],'CSH-15':[51,5],'ADM-20':[46,24],'ADM-21':[47],'ADM-22':[52,53],'ADM-23':[53],'ADM-24':[54],'ADM-25':[55,25]}
SC['TVA-02']+= [56];SC['TVA-10']+=[57];SC['TVA-01']+=[58];SC['CSH-02']+=[58];SC['TVA-07']+=[58];SC['CSH-05']+=[58]
WF={c:fn for c,n,v,fn in data.SURFACES}
rows=[]
for i in range(1,46):
  k='HS-T%02d'%i; scr=t.get(k,[])
  cm=sorted({c for x in scr for c in SC['-'.join(x.split('-')[2:4])]})
  files=sorted({WF[x.split('-')[2]] for x in scr if fmap.get(x)})
  if not scr: note={'HS-T01':'no screens — consumes `tokens.json` + `tailwind.tokens.css` (design foundation)','HS-T43':'no screen in v0.1 — reuse ADM-07 product/stock patterns (HS-CMP-023)'}.get(k,'—')
  else: note=''
  rows.append(f"| {k} | {titles.get(k,'')} | {', '.join(scr) or note} | {', '.join('HS-CMP-%03d'%c for c in cm) or '—'} | {', '.join('`wireframes/'+f+'`' for f in files) or '—'} |")
open('/tmp/ticket-table.md','w').write("| Ticket | Title (from board) | Screens (HS-SCR) | Components | Wireframe files |\n|---|---|---|---|---|\n"+"\n".join(rows)+"\n")
print(len(rows))
