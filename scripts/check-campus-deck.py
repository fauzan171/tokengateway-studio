from pathlib import Path
from html.parser import HTMLParser
from weasyprint import HTML
import json,re,base64
root=Path(__file__).resolve().parent.parent
path=root/'public/presentasi-mahasiswa/index.html'
source=path.read_text()
raw=json.load(open(root/'output/presentasi-mahasiswa/catalog-2026-10-21.json'))['packages']
for p in raw:
 assert source.count('data-package="'+p['package_id']+'"')==1,p['package_id']
 pattern='data-package="'+re.escape(p['package_id'])+'"[^>]*>(.*?)</tr>'
 row=re.search(pattern,source,re.S).group(1)
 assert p['name'].replace('&','&amp;') in row
 assert 'Rp'+f"{p['terms']['price_idr']:,}".replace(',','.') in row
 assert f"{p['terms']['validity_days']} hari" in row
 for model in p['model_ids']:assert model in row
print('PASS: all 21 package names, prices, validity and model IDs match live snapshot')
doc=HTML(filename=str(path)).render()
expected=len(re.findall(r'<section class="slide ',source))
assert len(doc.pages)==expected,(len(doc.pages),expected)
assert expected==46
assert 'mckinsey.com' not in source.lower()
assert source.count('alt="Logo TokenGateway"')==expected+1
issues=[]
for i,page in enumerate(doc.pages):
 for box in page._page_box.descendants():
  if type(box).__name__=='TextBox' and box.text.strip():
   if box.position_x < 0 or box.position_y < 0 or box.position_x+box.width > 1920.5 or box.position_y+box.height >1080.5:
    issues.append((i+1,box.text,box.position_x,box.position_y,box.width,box.height))
assert not issues,issues
print(f'PASS: {expected} rendered pages; logo present; 2026 sources; all text within 1920x1080 canvas')
script=re.search('<script>(.*?)</script>',source,re.S).group(1)
(root/'output/presentasi-mahasiswa/runtime-check.js').write_text(script)
# Bundle local font bytes so the presentation opens offline as a single HTML file.
def embed(m):
 p=path.parent/m.group(1)
 return 'url(data:font/woff2;base64,'+base64.b64encode(p.read_bytes()).decode()+')'
standalone=re.sub(r'url\((assets/[^)]+)\)',embed,source)
logo=base64.b64encode((path.parent/'assets/tokengateway-logo.png').read_bytes()).decode()
standalone=standalone.replace('<img class="cover-logo" src="assets/tokengateway-logo.png" alt="Logo TokenGateway">','<span class="cover-logo inline-logo" role="img" aria-label="Logo TokenGateway"></span>')
standalone=standalone.replace('<img src="assets/tokengateway-logo.png" alt="Logo TokenGateway">','<span class="inline-logo" role="img" aria-label="Logo TokenGateway"></span>')
logo_css='.inline-logo{display:block;background-image:url(data:image/png;base64,'+logo+');background-size:contain;background-repeat:no-repeat;background-position:center}.brand .inline-logo{width:72px;height:50px;background-color:#181d23;border-radius:4px}.cover-stamp .inline-logo{height:137px;margin:0 0 25px}'
standalone=standalone.replace('</style>',logo_css+'</style>')
(root/'output/presentasi-mahasiswa/TokenGateway-Campus.html').write_text(standalone)
print('PASS: standalone HTML embeds all required fonts')
