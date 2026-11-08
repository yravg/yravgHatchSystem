"""Reapply own normative additions after research-only build_spec.py; no network."""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'PRD-HatchSystem.md';s=p.read_text();s=s[:s.index('| Requirement | Own canonical |')]
s+='| Requirement | Own canonical | Kemampuan sendiri | Primary ticket | Phase | Disposition | AC |\n| --- | --- | --- | --- | --- | --- | --- |\n'
for x in json.loads((ROOT/'specs/requirements.json').read_text()):s+='| '+' | '.join(str(x[k]).replace('|','/').replace('\n',' ') for k in ['id','canonical','title','ticket','phase','disposition','acceptance_id'])+' |\n'
p.write_text(s)
additions={
 '07-midtrans-qris':('Kontrak provider wajib','CONTRACTS.md §6 normatif. Signature Secret Key terpisah dari ServerKey menurut access-keys28Oct2026; dokumen notification lama konflik. D15 harus menyelesaikan account/schema/vector sandbox sebelum ready. Tidak ada silent fallback key.','Vector QRIS tambahan wajib','Uji serverKey≠signatureSecret; equal legacy values; rotation current+previous dalam bounded window; wrong signature/merchant/amount/currency/order; duplicate dan pending-after-settlement; GET status timeout; settle-after-booking-expiry; refund_pending bukan refunded. Assert ledger credit once, station tidak aktif tanpa approved ACK, secrets tidak di log.'),
 '13-customer-self-service':('iOS PWA V1','Safari iPhone/iPad wajib untuk booking, QRIS redirect-return, order/member/receipt, loading/offline/token expiry; native wrapper terpisah V2 T40. Senet sudah punya aplikasi iOS; bukan bukti competitor gap.','Safari customer checks','Playwright WebKit + actual Safari iPhone/iPad version-named acceptance. Provider redirect-return tidak bergantung third-party cookie; privacy mode/session expiry jelas. Browser emulator saja tidak membuktikan camera/QR/native device integration.'),
 '21-android-tv-agent':('MVP certification boundary','hardware/CERTIFICATION.md dan CONTRACTS.md §5 wajib. T21 owns independent physical MVP certification; T31 later regression bukan izin menunda basic safety. Normal streaming box HDMI output tidak dapat overlay console input.','MVP hardware gate','Exact named TV model+firmware+agent build, built-in input topology; probe permission/Home/input/expiry/clock/reboot/WAN fail; console mains unchanged. No physical hardware means blocked certification, simulator labelled SIMULATED.'),
 '23-external-tv-adapters':('MVP external certification boundary','hardware/CERTIFICATION.md wajib. LG/Samsung support berarti exact certified external topology, bukan universal native agent. No-feedback commanded-only; owner-authorised operator attestation tidak jadi optical proof.','MVP LG/Samsung checks','Uji named LG dan Samsung model/firmware via selected adapter, 4K120/HDR/VRR/HDCP/audio/eARC or explicit unsupported mode. No HDCP stripping, no console mains. Missing hardware = blocked, never certified.'),
 '30-security-privacy-backups':('Safety scope','NG01..NG06 dimiliki untuk audit safety, bukan fitur. Source assets/binaries/private/raw folders tidak boleh masuk repo/paket build.','Non-goal verification','Review NG01..NG06, git diff/artifact manifest untuk vendor assets/code, live keys, console electrical commands, surveillance/autonomous external actions. Per-ID acceptance evidence must remain honest.')}
for slug,(rh,rb,eh,eb) in additions.items():
 for name,h,b in [('rd.md',rh,rb),('eval.md',eh,eb)]:
  p=ROOT/'specs/tickets'/slug/name;s=p.read_text();marker='\n## '+h+'\n';s=s.split(marker)[0];p.write_text(s+marker+b+'\n')
# Portable source ledger: extract URL refs only, not vendor copy/raw/static implementation.
src=Path('/workspace/grab/kulapos-rental-ps/research/SOURCES.md')
if src.exists():
 rows=[]
 for line in src.read_text().splitlines():
  cells=[x.strip() for x in line.strip('|').split('|')]
  if len(cells)>2 and re.fullmatch(r'(SRC-\d+|V1|SHARED-FAQ|SHARED-TUTORIAL|P\d+|C\d+|REPO)',cells[0]):rows.append((cells[0],cells[1]))
 (ROOT/'sources/RENTAL-URL-LEDGER.md').write_text('# Rental source IDs — URL ledger only\n\nStatic APK/bundle implementation evidence excluded. APK1/BUNDLE1 occurrences in historical source attribution are not implementation instructions or admissible runtime proof; use own publicSDK spike.\n\n| Source ID | Public URL |\n| --- | --- |\n'+''.join('| '+a+' | '+b+' |\n' for a,b in rows))
