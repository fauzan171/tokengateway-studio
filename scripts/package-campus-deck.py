from pathlib import Path
from html import escape
from PIL import Image
from pypdf import PdfReader
import json,zipfile
root=Path(__file__).resolve().parent.parent
out=root/'output/presentasi-mahasiswa'
slides=json.loads((out/'slide-manifest.json').read_text())
count=len(slides)
assert len(PdfReader(out/'TokenGateway-Campus.pdf').pages)==count
images=sorted(out.glob('slide-*.png'))
assert len(images)==count
assert all(Image.open(p).size==(1920,1080) for p in images)
head='''<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Overview TokenGateway Campus</title><style>body{margin:30px;background:#181d23;color:#f4f7fa;font:16px system-ui}a{color:#16dde2}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:24px}img{width:100%;height:auto}h1{font-size:32px}a:focus-visible{outline:3px solid #16dde2}main a{text-decoration:none}</style><h1>TokenGateway / Campus Session</h1>'''
head+=f'<p>{count} slide modular · <a href="TokenGateway-Campus.html">Buka HTML</a> · <a href="TokenGateway-Campus.pdf">Buka PDF</a></p><p>Tech & engineering: 10–17 · Bisnis, kreatif & humaniora: 18–26 · Semua paket: 36–39</p><main>'
(out/'overview.html').write_text(head+''.join(f'<a href="TokenGateway-Campus.html#{s["number"]}"><img src="slide-{s["number"]:02d}.png" alt="{escape(s["title"])}" loading="lazy"><p>{s["number"]:02d} / {escape(s["title"])}</p></a>' for s in slides)+'</main></html>')
majors=[s for s in slides if s['theme'].startswith('major ')]
guide='# Pilih slide sesuai kelas\n\nMulai 01–08, lalu O untuk memilih jurusan. Setelah contoh, lompat ke 29–30, lalu 31–44 untuk produk. Katalog 36–39 bisa dibuka saat Q&A. Referensi ada di 45–46.\n\n| Slide | Jurusan / contoh |\n|---|---|\n'
guide+=''.join(f'| {s["number"]:02d} | {s["title"]} |\n' for s in majors)
guide+='\n## Contoh jalur singkat\n\n- Kelas tech: 01–08 → 10 → jurusan terpilih 11–17 → 27–29 → 31–35 → 40–44.\n- Kelas nonteknis: 01–08 → 18 → jurusan terpilih 19–26 → 29–35 → 40–41 → 43–44.\n- Kelas campuran: 01–09 → 11, 13, 21, 23 → 29–35 → 40–44.\n\nTombol O menampilkan judul dan nomor semua slide. N membuka catatan pembicara. Gunakan hanya contoh yang relevan. Skenario jurusan adalah usulan latihan, bukan janji fitur aplikasi konsumen di gateway.\n'
(out/'panduan-pilih-slide.md').write_text(guide)
with zipfile.ZipFile(root/'output/TokenGateway-Campus-Session.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in sorted(out.iterdir()):
  if f.is_file():z.write(f,'TokenGateway-Campus/'+f.name)
with zipfile.ZipFile(root/'output/TokenGateway-Campus-Session.zip') as z:assert z.testzip() is None
print(f'PASS: {count} pages and PNGs; overview and route guide updated; ZIP integrity OK')
