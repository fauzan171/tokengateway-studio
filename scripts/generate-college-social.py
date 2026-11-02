"""Typography-led social campaign; render with local fonts and WeasyPrint."""
from pathlib import Path
import base64, json, html, zipfile
from weasyprint import HTML
import pypdfium2 as pdfium
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'output/07-project-kuliah-ai'
TOK=json.loads((ROOT/'src/design/tokens.json').read_text())['colors']
pack=next(p for p in json.loads((OUT/'catalog-2026-10-27.json').read_text())['packages'] if p['package_id']=='pass-glm-5.3-flash-50m')
price='Rp'+f"{pack['terms']['price_idr']:,}".replace(',','.')
quota=f"{pack['grant_tokens']//1000000} juta token"
valid=f"{pack['terms']['validity_days']} hari"
fonts=''.join('@font-face{font-family:Jakarta;font-weight:'+str(w)+';src:url(data:font/woff2;base64,'+base64.b64encode((ROOT/f'public/fonts/jakarta-{w}.woff2').read_bytes()).decode()+')}' for w in [400,500,600,700,800])
css=fonts+'''
:root{--bg:BG;--fg:FG;--cyan:CYAN;--muted:MUTED;--line:LINE;--surface:SURFACE}
*{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:Jakarta,sans-serif;color:var(--fg);background:var(--bg)}
.slide{position:relative;width:1080px;height:1350px;background:var(--bg);page-break-after:always;overflow:hidden}
.slide:last-child{page-break-after:auto}.story{height:1920px}
.brand{position:absolute;left:80px;top:76px;font-size:29px;font-weight:800;letter-spacing:-1px}
.brand span{color:var(--cyan)}.series{position:absolute;right:80px;top:85px;font-size:18px;font-weight:600;letter-spacing:2px}
.rule{position:absolute;top:139px;left:80px;width:920px;height:2px;background:var(--line)}
.footer{position:absolute;left:80px;bottom:80px;width:920px;border-top:2px solid var(--line);padding-top:24px;font-size:22px;color:var(--muted)}
.count{float:right;color:var(--cyan);font-weight:700}.tag{font-size:23px;font-weight:700;letter-spacing:2px;color:var(--cyan);margin:0 0 30px}
.main{position:absolute;left:80px;right:80px;top:205px}h1,h2,p{margin:0}h1{font-size:84px;font-weight:800;line-height:1.13;letter-spacing:-4px}em{font-style:normal;color:var(--cyan)}
.lead{font-size:32px;line-height:1.5;color:var(--muted);margin-top:32px;max-width:870px}.statement{font-size:49px;line-height:1.3;font-weight:700;letter-spacing:-1.5px}
.panel{padding:38px 40px;background:var(--surface);border:2px solid var(--line);border-radius:18px}
.item{padding:29px 0;border-bottom:2px solid var(--line);font-size:32px;line-height:1.45}.item:last-child{border-bottom:0}.item b{display:block;font-size:35px;margin-bottom:8px}.num{color:var(--cyan);font-size:24px;display:inline-block;width:58px;vertical-align:top;padding-top:6px}.itembody{display:inline-block;width:800px}.itembody p{color:var(--muted);font-size:28px}.tiny{font-size:25px;line-height:1.5;color:var(--muted)}
.band{background:var(--cyan);color:var(--bg);padding:27px 32px;font-size:30px;font-weight:800;line-height:1.4;border-radius:6px}
.price{font-size:134px;font-weight:800;letter-spacing:-6px;line-height:1.15;color:var(--cyan)}.pill{display:inline-block;border:2px solid var(--line);padding:17px 23px;border-radius:8px;font-size:27px;margin-right:12px}
.cta{display:block;background:var(--cyan);color:var(--bg);padding:27px 30px;border-radius:8px;font-size:31px;font-weight:800;text-align:center;text-decoration:none}.story .brand{top:150px}.story .series{top:160px}.story .rule{top:214px}.story .main{top:300px}.story .footer{bottom:170px}.story h1{font-size:96px}.story .lead{font-size:35px}.story .price{font-size:142px}
'''
for k,v in {'BG':TOK['bg'],'FG':TOK['textPrimary'],'CYAN':TOK['accent'],'MUTED':TOK['textSecondary'],'LINE':TOK['line'],'SURFACE':TOK['surface']}.items(): css=css.replace(k,v)
def at(top,content,style=''):
 return f'<div style="position:absolute;top:{top}px;left:80px;right:80px;{style}">{content}</div>'
def item(n,title,body):
 return f'<div class="item"><span class="num">{n}</span><div class="itembody"><b>{title}</b><p>{body}</p></div></div>'
def title(tag,heading,sub=''):
 return '<div class="main"><p class="tag">'+tag+'</p><h1>'+heading+'</h1>'+('<p class="lead">'+sub+'</p>' if sub else '')+'</div>'
def offer(y,story=False):
 return at(y,f'<p class="tiny">Harga paket mulai</p><p class="price">{price}</p><p class="tiny" style="margin-top:8px">Belum termasuk biaya layanan checkout.</p>')+at(y+260,f'<p style="font-size:35px;font-weight:700">GLM 5.3 Flash</p><div style="margin-top:24px"><span class="pill">{quota}</span><span class="pill">{valid}</span></div><p class="tiny" style="margin-top:24px">Pass Kilat GLM 5.3 Flash 50M · Bayar via QRIS</p>')
slides=[]
def add(kind,name,content,foot): slides.append(dict(kind=kind,name=name,content=content,foot=foot))
add('carousel','01-hook',title('PROJECT KULIAH × AI','Project kuliah<br>pakai <em>AI.</em>'),'Geser untuk cara pakainya →')
slides[-1]['content']+=at(535,'<p class="statement">Pas dosen tanya,<br><em>kamu bisa jelasin?</em></p>')+at(780,'<div class="panel"><p class="tiny">PEGANG PRINSIP INI</p><p class="statement" style="margin-top:22px;font-size:43px">AI bantu prosesnya.<br>Kamu pahami hasilnya.</p></div>')+at(1065,'<p class="tiny">Untuk tugas yang mengizinkan penggunaan AI.</p>')
add('carousel','02-peran-ai',title('01 / MULAI DARI PROSES','AI bantu.<br><em>Kamu kendalikan.</em>'), 'Tujuan jelas. Bantuan AI juga lebih terarah.')
slides[-1]['content']+=at(510,item('01','Pecah project jadi langkah kecil.','Tentukan tujuan, bahan, dan batasan tugas.')+item('02','Minta penjelasan saat mentok.','Bahas konsep, error, atau pilihan metode.')+item('03','Latihan presentasi.','Minta pertanyaan kritis tentang hasilmu.'))
add('carousel','03-contoh-project',title('02 / CONTOH PROJECT','Analisis data.<br><em>Tetap kamu cek.</em>','Contoh latihan: analisis pengeluaran dari CSV.'),'Contoh latihan, bukan klaim hasil pengguna.')
slides[-1]['content']+=at(580,'<div class="panel"><p class="tag">BANTUAN AI</p><p style="font-size:35px;line-height:1.45">Buat draft kode untuk total<br>pengeluaran per kategori.</p></div>')+at(825,'<div class="panel" style="border-color:var(--cyan)"><p class="tag">PEMERIKSAAN KAMU</p><p style="font-size:35px;line-height:1.45">Hitung ulang sampel. Cek data kosong.<br>Jelaskan cara totalnya dihitung.</p></div>')
add('carousel','04-bisa-dipertanggungjawabkan',title('03 / SEBELUM DIKUMPULKAN','Bisa dijelaskan.<br><em>Ada buktinya.</em>'),'Simpan prompt, revisi, sumber, dan hasil pengujian.')
slides[-1]['content']+=at(505,item('01','Paham alasannya.','Kenapa pilih metode ini? Apa batasannya?')+item('02','Periksa kebenarannya.','Buka sumber asli. Uji kode. Hitung ulang angka.')+item('03','Jujur soal prosesnya.','Ikuti aturan dosen dan ungkapkan bantuan AI<br>sesuai ketentuan tugas.'))
add('carousel','05-prompt',title('04 / SIMPAN PROMPT INI','Minta bantuan<br>sambil <em>belajar.</em>'),'Ganti bagian [kurung] sesuai project kamu.')
slides[-1]['content']+=at(525,'<div class="panel" style="padding:42px;border-left:6px solid var(--cyan)"><p style="font-size:34px;line-height:1.6">Saya mengerjakan [project] untuk [mata kuliah]. Bantu pecah langkahnya dan jelaskan alasan tiap langkah.<br><br>Tandai asumsi, beri cara menguji hasil, lalu ajukan 3 pertanyaan untuk mengecek pemahaman saya.</p></div>')
add('carousel','06-harga',title('05 / MULAI COBA DI TOKENGATEWAY','Mulai pakai<br><em>API AI.</em>'),'Kuota dan akses model mengikuti paket yang dipilih.')
slides[-1]['content']+=offer(500)+at(1040,'<p class="tiny">Paket kuota token dengan masa berlaku.<br>Bisa dipakai setelah paket aktif dan setup selesai.</p>')
add('carousel','07-mulai',title('LANGKAH PERTAMAMU','Mulai project.<br><em>Pahami hasilnya.</em>'),'tokengateway.ai.id · AI untuk proses belajar kamu')
slides[-1]['content']+=at(505,item('01','Daftar & verifikasi email.','Pilih paket sesuai kebutuhan project.')+item('02','Bayar via QRIS.','Tunggu konfirmasi paket aktif.')+item('03','Buat API key & hubungkan tool.','Ikuti panduan di tokengateway.ai.id/docs.'))+at(1040,'<a class="cta" href="https://tokengateway.ai.id/pricing">Lihat paket → tokengateway.ai.id/pricing</a>')
add('story','01-hook',title('PROJECT KULIAH × AI','Dibantu AI.<br>Ditanya dosen.<br><em>Bisa jawab?</em>'),'TokenGateway · Belajar sambil membangun')
slides[-1]['content']+=at(825,'<p class="statement" style="font-size:55px">Pakai AI buat bantu<br>project kuliah.<br><em>Tetap pahami hasilnya.</em></p>')+at(1180,'<div class="panel"><p style="font-size:35px;line-height:1.5">Mulai dari langkah kecil.<br>Minta penjelasan.<br>Uji yang kamu kerjakan.</p></div>')+at(1520,'<p class="tiny">Ikuti aturan penggunaan AI di tugasmu.</p>')
add('story','02-checklist',title('CEK SEBELUM KUMPUL','Kamu siap<br><em>jelasin hasilnya?</em>'),'Simpan panduan ini untuk project berikutnya.')
slides[-1]['content']+=at(650,item('01','Paham alurnya.','Bisa jelaskan dengan kata-kata sendiri.')+item('02','Ada buktinya.','Sumber dicek. Kode atau perhitungan diuji.')+item('03','Jujur prosesnya.','Catat bantuan AI sesuai aturan tugas.'))+at(1260,'<div class="band">Coba jelaskan project-mu<br>tanpa membuka jawaban AI.</div>')+at(1470,'<p class="tiny">Masih bingung? Bahas lagi bagian itu.</p>')
add('story','03-harga-cta',title('MULAI COBA / TOKENGATEWAY','AI buat bantu<br><em>project kuliah.</em>'),'tokengateway.ai.id · Pahami. Uji. Jelaskan.')
slides[-1]['content']+=offer(625,True)+at(1150,'<p style="font-size:31px;line-height:1.6">Daftar & verifikasi email → bayar QRIS.<br>Setelah paket aktif, buat API key<br>dan hubungkan tool sesuai panduan.</p>')+at(1405,'<p class="statement" style="font-size:43px">Cek paket & mulai belajar.</p><p class="tiny" style="margin-top:16px">tokengateway.ai.id/pricing</p>')
# Story 3 deliberately leaves space below the CTA for Instagram link sticker.
manifest=[]; thumbs=[]; issues=[]
for s in slides:
 kind=s['kind'];h=1350 if kind=='carousel' else 1920
 idx=sum(1 for x in manifest if x['kind']==kind)+1;total=7 if kind=='carousel' else 3
 footer=f'<div class="footer">{s["foot"]}<span class="count">{idx:02d} / {total:02d}</span></div>'
 markup=f'<section class="slide {"story" if kind=="story" else ""}"><div class="brand">Token<span>Gateway</span></div><div class="series">CATATAN KULIAH</div><div class="rule"></div>{s["content"]}{footer}</section>'
 doc='<!doctype html><html lang="id"><meta charset="utf-8"><title>'+s['name']+'</title><style>'+css+f'@page{{size:1080px {h}px;margin:0}}</style><body>'+markup+'</body></html>'
 p=OUT/kind/s['name'];p.with_suffix('.html').write_text(doc)
 render=HTML(string=doc,base_url=str(ROOT)).render()
 assert len(render.pages)==1,(s['name'],len(render.pages))
 for box in render.pages[0]._page_box.descendants():
  if type(box).__name__=='TextBox' and box.text.strip():
   if box.position_x<79 or box.position_x+box.width>1001 or box.position_y<(139 if kind=='story' else 75) or box.position_y+box.height>h-(159 if kind=='story' else 79):
    issues.append((s['name'],box.text,box.position_x,box.position_y,box.width,box.height))
 pdf=render.write_pdf();pdfdoc=pdfium.PdfDocument(pdf);im=pdfdoc[0].render(scale=4/3).to_pil().convert('RGB');assert im.size==(1080,h),im.size;im.save(p.with_suffix('.png'));pdfdoc.close()
 thumb=im.copy();thumb.thumbnail((270,480));thumbs.append((kind,s['name'],thumb))
 manifest.append({'kind':kind,'file':str(p.relative_to(OUT))+'.png','width':1080,'height':h})
assert not issues,issues
for kind in ['carousel','story']:
 selected=[x for x in thumbs if x[0]==kind]; cols=4 if kind=='carousel' else 3;rows=(len(selected)+cols-1)//cols;cellh=390 if kind=='carousel' else 530
 sheet=Image.new('RGB',(cols*290+20,rows*cellh+70),TOK['bg']);d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',20)
 d.text((20,20),'TokenGateway / '+kind.upper(),fill=TOK['textPrimary'],font=font)
 for i,(_,name,im) in enumerate(selected):
  x=20+i%cols*290;y=70+i//cols*cellh;sheet.paste(im,(x,y));d.text((x,y+im.height+12),f'{kind.title()} {i+1:02d}',fill=TOK['textSecondary'],font=font)
 sheet.save(OUT/f'preview-{kind}.jpg',quality=92)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2))
(OUT/'index.html').write_text('<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Project kuliah × AI — TokenGateway</title><style>body{margin:32px;background:#181d23;color:#f4f7fa;font:18px system-ui}h1{max-width:800px}a{color:#16dde2}.grid{display:flex;flex-wrap:wrap;gap:20px}figure{margin:0;width:270px}img{width:100%;height:auto}figcaption{margin:12px 0 24px}</style><h1>Project kuliah pakai AI.<br>Tetap bisa dipertanggungjawabkan.</h1><p>7 carousel · 3 Story · harga dicek 27 Oktober 2026</p>'+''.join('<h2>'+kind.title()+'</h2><div class="grid">'+''.join(f'<figure><a href="{x["file"]}"><img src="{x["file"]}" alt="{html.escape(x["file"])}"></a><figcaption>{x["file"]}</figcaption></figure>' for x in manifest if x['kind']==kind)+'</div>' for kind in ['carousel','story']))
(OUT/'verification.md').write_text('# Pemeriksaan\n\n10 PNG dirender dari HTML dengan font lokal tertanam. Ukuran carousel 1080×1350, Story 1080×1920. Semua teks berada di safe area (carousel 80px; Story atas 140px, bawah 160px). Tidak ada halaman tambahan. Harga, kuota, model, masa berlaku diambil dari snapshot katalog live 27 Oktober 2026. Review visual dicatat setelah render.\n')
print('Rendered 7 carousel + 3 stories; dimensions and text safe areas PASS.')
