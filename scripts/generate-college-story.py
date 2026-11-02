from pathlib import Path
import base64,json
from weasyprint import HTML
import pypdfium2 as pdfium
R=Path(__file__).resolve().parent.parent
O=R/'output/08-story-project-kuliah'
p=next(p for p in json.load(open('/tmp/tg-packages-28.json'))['packages'] if p['package_id']=='pass-glm-5.3-flash-50m')
price='Rp'+f"{p['terms']['price_idr']:,}".replace(',','.')
def data(path,mime):return 'data:'+mime+';base64,'+base64.b64encode((R/path).read_bytes()).decode()
fonts=''.join('@font-face{font-family:Jakarta;font-weight:'+str(w)+';src:url('+data(f'public/fonts/jakarta-{w}.woff2','font/woff2')+')}' for w in [400,600,700,800])
zai=data('output/02-bahan-desain/04-hermes-integrasi/assets/zai.svg','image/svg+xml')
logo=data('public/presentasi-mahasiswa/assets/tokengateway-logo.png','image/png')
s= '''<!doctype html><html lang="id"><meta charset="utf-8"><title>Ada project kuliah? — TokenGateway</title><style>FONTS
@page{size:1080px 1920px;margin:0}*{box-sizing:border-box}body{margin:0;background:#181d23;color:#f4f7fa;font-family:Jakarta,sans-serif}.canvas{position:relative;width:1080px;height:1920px}.brand{position:absolute;left:80px;top:150px;height:56px;font-size:30px;font-weight:800;display:flex;align-items:center;gap:18px}.brand img{width:66px;height:52px;object-fit:contain}.brand span{color:#16dde2}.label{position:absolute;right:80px;top:167px;font-size:20px;color:#aebbc8;letter-spacing:2px}h1,p{margin:0}h1{font-size:100px;line-height:1.08;letter-spacing:-4px;font-weight:800}em{font-style:normal;color:#16dde2}.block{position:absolute;left:80px;right:80px}.task{font-size:48px;line-height:1.42;font-weight:700;letter-spacing:-1px}.arrow{color:#16dde2;margin-right:20px}.promise{border-top:2px solid #344250;border-bottom:2px solid #344250;padding:30px 0}.promise p{font-size:36px;line-height:1.45}.muted{color:#aebbc8}.small{font-size:25px;line-height:1.5}.offer{background:#202832;border:2px solid #344250;border-radius:20px;padding:32px 36px}.provider{display:flex;align-items:center;gap:22px}.provider .mark{background:#fff;width:82px;height:82px;padding:16px;border-radius:12px}.provider img{width:50px;height:50px}.model{font-size:32px;font-weight:700}.price{font-size:120px;letter-spacing:-5px;line-height:1.1;font-weight:800;color:#16dde2}.cta{background:#16dde2;color:#181d23;padding:22px 20px;text-align:center;font-size:34px;font-weight:800;border-radius:10px}
</style><body><main class="canvas"><div class="brand"><div>Token<span>Gateway</span></div></div><div class="label">AI UNTUK MAHASISWA</div>
<div class="block" style="top:285px"><h1>Ada project<br><em>kuliah?</em></h1></div>
<div class="block task" style="top:555px"><p><span class="arrow">↗</span>Ngolah data?</p><p><span class="arrow">↗</span>Bikin sistem atau aplikasi?</p></div>
<div class="block promise" style="top:740px"><p>AI bantu ngerjain.<br><b>Kamu harus bisa<br>mempertanggungjawabkan.</b></p><p style="font-size:29px;color:#16dde2;margin-top:20px">Pahami alurnya. Uji hasilnya. Bisa jelasin.</p></div>
<div class="block offer" style="top:1045px"><div class="provider"><div class="mark"><img src="ZAI" alt="Logo Z.ai"></div><div><p class="model">GLM 5.3 Flash</p><p class="small muted">Paket API AI mulai</p></div></div><p class="price" style="margin-top:20px">PRICE</p><p style="font-size:29px;margin-top:14px">QUOTA juta token <span class="muted">/</span> DAYS hari <span class="muted">/</span> Bayar QRIS</p><p class="small muted" style="margin-top:16px">Belum termasuk biaya layanan checkout.</p></div>
<div class="block" style="top:1485px"><div class="cta">Mulai di tokengateway.ai.id</div><p class="small muted" style="margin-top:18px;text-align:center">Daftar → beli paket → setup API key.</p></div>
<div class="block" style="top:1705px"><p class="small muted" style="text-align:center">Ikuti aturan dosen. Jelaskan bantuan AI sesuai ketentuan.</p></div>
</main></body></html>'''
for k,v in [('FONTS',fonts),('LOGO',logo),('ZAI',zai),('PRICE',price),('QUOTA',str(p['grant_tokens']//1000000)),('DAYS',str(p['terms']['validity_days']))]:s=s.replace(k,v)
(O/'story.html').write_text(s)
doc=HTML(string=s).render();assert len(doc.pages)==1
issues=[]
for b in doc.pages[0]._page_box.descendants():
 if type(b).__name__=='TextBox' and b.text.strip():
  if b.position_x<79 or b.position_x+b.width>1001 or b.position_y<139 or b.position_y+b.height>1761:issues.append((b.text,b.position_x,b.position_y,b.width,b.height))
assert not issues,issues
pdf=pdfium.PdfDocument(doc.write_pdf());im=pdf[0].render(scale=4/3).to_pil();assert im.size==(1080,1920);im.save(O/'Story-Project-Kuliah.png')
(O/'sumber-dan-panduan.txt').write_text('Harga dicek 28 Oktober 2026 dari https://tokengateway.ai.id/api/v1/catalog/packages\n'+json.dumps(p,ensure_ascii=False,indent=2)+'\n\nLogo Z.ai dan TokenGateway memakai aset yang sudah tersedia dalam project. Nama model mengikuti label katalog TokenGateway.\n\nPNG 1080×1920, batas teks diperiksa dan font tertanam dalam HTML. Tambahkan stiker Link Instagram di ruang kosong sekitar y=1650 ke https://tokengateway.ai.id/pricing dengan teks Lihat paket.\nPesan tanggung jawab adalah kewajiban pengguna: pahami, uji dan jelaskan; bukan jaminan kebenaran output AI.\n')
print(O/'Story-Project-Kuliah.png')
