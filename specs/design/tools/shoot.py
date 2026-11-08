import sys,glob,json,os
from playwright.sync_api import sync_playwright
W='/workspace/design/hatchsystem/wireframes/'
files=sys.argv[1:] or sorted(os.path.basename(p) for p in glob.glob(W+'*.html') if not p.endswith('index.html'))
res=[]
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
  for fn in files:
    pg=b.new_page(viewport={'width':1980,'height':1200})
    pg.goto('file://'+W+fn);pg.wait_for_timeout(200)
    for el in pg.query_selector_all('section.frame'):
      fid=el.get_attribute('id')
      ov=el.evaluate("""f=>{const r=f.getBoundingClientRect();let o=[];f.querySelectorAll('*').forEach(e=>{const b=e.getBoundingClientRect();if(b.width&&(b.right>r.right+1||b.bottom>r.bottom+1))o.push((e.className||e.tagName)+':'+(e.textContent||'').trim().slice(0,30));if(e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflow!='visible'&&e!==f)o.push('scrollX:'+(e.className||e.tagName))});return o.slice(0,6)}""")
      el.screenshot(path=W+'shots/'+fid+'.png')
      res.append({'file':fn,'frame':fid,'overflow':ov})
    pg.close()
  b.close()
for r in res: print(r['frame'], 'OK' if not r['overflow'] else r['overflow'])
json.dump(res,open('/tmp/shoot.json','w'))
