"""Presentation visuals are conceptual teaching diagrams, never product screenshots."""
from html import escape

CYAN = '#16dde2'
TEXT = '#f4f7fa'
MUTED = '#aebbc8'
SURFACE = '#26303c'


def text(x, y, value, size=24, color=TEXT, weight=400):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}">{escape(value)}</text>'


def rect(x, y, w, h, fill=SURFACE, stroke='none'):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'


def line(x, y, xx, yy, color=MUTED):
    return f'<path d="M{x} {y} L{xx} {yy}" stroke="{color}" stroke-width="3" fill="none"/>'


def box(x, y, w, h, title, sub='', accent=False):
    return rect(x,y,w,h, '#123d45' if accent else SURFACE)+text(x+24,y+44,title,27,CYAN if accent else TEXT,600)+(text(x+24,y+80,sub,20,MUTED) if sub else '')


def diagram(kind):
    s = ''
    if kind == 'data':
        s=text(35,50,'DATA MASUK',20,MUTED)+text(420,50,'POLA MULAI TERLIHAT',20,CYAN)
        for i,(name,w) in enumerate([('Konsumsi',220),('Alat',170),('Transport',110)]):
            y=95+i*88
            s+=rect(35,y,290,60)+text(55,y+39,name,24)+line(350,y+30,390,y+30)+rect(420,y,w,60,CYAN)
        s+=text(35,405,'Rapikan → analisis → cek ulang',28)
    elif kind == 'ai':
        s=box(40,70,260,110,'Dokumen acara','Sumber yang dipakai')+box(430,70,280,110,'Pertanyaan','Kapan? Di mana?')
        s+=line(170,190,170,235)+line(570,190,570,235)+line(170,235,570,235)+line(370,235,370,275)
        s+=box(170,280,410,115,'Jawaban + rujukan','Tidak ada info? Bilang belum tahu.',True)
    elif kind == 'code':
        s=text(40,52,'KASUS UJI',22,MUTED)+box(40,80,670,100,'Nominal: −10.000','Tolak input negatif',True)
        s+=box(40,205,670,100,'Nominal: 50.000','Simpan transaksi valid')
        s+=text(40,370,'Baca diff. Jalankan test. Pahami fix.',28)
    elif kind == 'systems':
        for x,title,sub in [(25,'Mahasiswa','Ajukan alat'),(280,'Petugas','Cek stok'),(535,'Disetujui','Catat pinjaman')]:
            s+=box(x,135,220,130,title,sub,x==535)
        s+=line(250,200,273,200,CYAN)+line(505,200,528,200,CYAN)
        s+=text(35,365,'Siapa boleh melakukan apa?',30)
    elif kind == 'energy':
        s=text(40,55,'POLA DAYA RUANG KELAS',22,MUTED)+line(60,335,710,335)+line(60,335,60,90)
        s+='<path d="M60 290 L130 290 L130 185 L230 185 L230 120 L340 120 L340 190 L455 190 L455 285 L580 285 L580 235 L700 235" fill="none" stroke="#16dde2" stroke-width="7"/>'
        s+=text(65,385,'Waktu',22,MUTED)+text(410,405,'Daya ≠ energi',30,CYAN,600)
    elif kind == 'queue':
        s=text(35,55,'ALUR LAYANAN',22,MUTED)
        for i in range(6):s+=rect(40+i*78,115,48,48,CYAN if i<3 else SURFACE)
        s+=box(575,90,140,100,'Loket','Layanan')+line(510,140,560,140,CYAN)
        s+=box(40,270,310,110,'Ubah skenario','Jumlah loket / waktu layanan')+box(405,270,310,110,'Bandingkan','Waktu tunggu simulasi',True)
    elif kind == 'environment':
        s=text(35,50,'PISAHKAN DATA SAMPAH',22,MUTED)
        for x,t,sub in [(35,'Organik','Timbang'),(280,'Daur ulang','Kelompokkan'),(525,'Residu','Catat')]:
            s+=rect(x,110,210,215)+rect(x,110,210,12,CYAN)+text(x+20,185,t,27)+text(x+20,280,sub,22,MUTED)
        s+=text(35,405,'Dari kilogram ke rencana aksi.',29)
    elif kind == 'finance':
        s=text(35,52,'SATU MODEL, BEBERAPA SKENARIO',22,MUTED)
        for i,(a,b) in enumerate([('Konservatif','Asumsi lebih rendah'),('Dasar','Asumsi acuan'),('Optimistis','Asumsi lebih tinggi')]):
            s+=box(40,85+i*102,670,84,a,'',i==1)+text(345,138+i*102,b,24,MUTED)
    elif kind == 'accounting':
        s=text(40,55,'BUKU KAS',24,MUTED)+text(430,55,'MUTASI',24,MUTED)
        for i,(a,b) in enumerate([('50.000','50.000'),('75.000','75.000'),('100.000','?')]):
            y=85+i*100
            s+=rect(40,y,270,70)+text(70,y+46,a,30)+line(335,y+35,395,y+35,CYAN)+rect(425,y,285,70,'#123d45' if i==2 else SURFACE)+text(455,y+46,b,30,CYAN if i==2 else TEXT)
        s+=text(40,414,'Selisih? Cek bukti transaksinya.',28)
    elif kind == 'communication':
        s=box(220,35,320,95,'Satu pesan inti','Fakta tetap sama',True)
        for x,t,sub in [(25,'Mahasiswa','Apa manfaatnya?'),(280,'Sponsor','Apa nilai kerja samanya?'),(535,'Media','Apa nilai beritanya?')]:
            s+=line(380,140,x+110,220)+box(x,235,220,140,t,'')+text(x+15,330,sub,17,MUTED)
    elif kind == 'business':
        s=text(35,55,'UJI PESAN SEBELUM SCALE',23,MUTED)
        for x,name,title in [(40,'A','Fokus manfaat'),(405,'B','Fokus masalah')]:
            s+=rect(x,90,310,250)+text(x+25,155,name,54,CYAN,700)+text(x+25,205,title,26)
            s+=rect(x+25,250,260,45,'#16dde2')+text(x+45,280,'Uji ke pengguna',22,'#181d23',600)
        s+=text(40,410,'Hipotesis → eksperimen → bukti',28)
    elif kind == 'management':
        s=box(35,55,310,120,'Biaya tetap','Sewa + perlengkapan')+box(405,55,310,120,'Biaya variabel','Bahan per produk')
        s+=line(185,185,185,235)+line(555,185,555,235)+line(185,235,555,235)+line(370,235,370,275)
        s+=box(125,285,490,115,'Berapa harus terjual?','Hitung break-even dari asumsi.',True)
    elif kind == 'design':
        for i,(x,title,sub) in enumerate([(40,'BERANI','Tipografi dominan'),(285,'TENANG','Ruang lebih lega'),(530,'EKSPRESIF','Komposisi dinamis')]):
            s+=rect(x,65,210,280,'#ecf1ee' if i==1 else SURFACE)
            s+=text(x+18,125,'ACARA',28,'#181d23' if i==1 else CYAN,700)+text(x+18,160,'KAMPUS',28,'#181d23' if i==1 else TEXT,700)
            s+=rect(x+18,200,174,10,'#006c70' if i==1 else CYAN)+text(x+18,293,title,19,'#181d23' if i==1 else TEXT)
            s+=text(x,395,sub,17,MUTED)
    elif kind == 'law':
        s=rect(100,40,560,360)+text(140,100,'KONTRAK FIKTIF',25,MUTED)
        for i,w in enumerate([440,380,430,320]):s+=rect(140,135+i*44,w,12,'#607080')
        s+=rect(130,305,490,60,'#123d45')+text(150,344,'“Segera” itu kapan?',30,CYAN,600)
        s+=text(100,435,'Tandai ambigu. Verifikasi sumber.',25)
    elif kind == 'psychology':
        s=text(40,55,'TRANSKRIP SINTETIS',22,MUTED)
        s+=box(40,85,670,100,'“Saya sulit mulai tugas.”','Kutipan, bukan diagnosis.')
        for x,title,sub in [(40,'Observasi','Pernyataan peserta'),(405,'Interpretasi','Perlu diuji lagi')]:s+=box(x,245,305,125,title,sub,x==40)
        s+=line(375,295,390,295,CYAN)
    return '<figure class="project-visual"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 460" width="760" height="460" role="img" aria-label="'+escape(kind)+' / ilustrasi konsep" font-family="sans-serif">'+s+'</svg><figcaption>Ilustrasi konsep · bukan hasil pengujian produk</figcaption></figure>'


PROJECTS = {
 'Data Science': ('data','Baca pola.<br><em>Cek angkanya.</em>','CSV berantakan','Dashboard yang bisa dijelaskan','Rapikan → temukan pola → hitung ulang','Bantu bersihkan CSV ini dan jelaskan 3 temuan beserta cara mengeceknya.'),
 'Artificial Intelligence': ('ai','Bikin asisten.<br><em>Ukur jawabannya.</em>','Dokumen kegiatan','Asisten FAQ dengan rujukan','Dokumen → tanya jawab → evaluasi','Jawab dari dokumen ini saja. Jika informasinya tidak ada, bilang belum tahu.'),
 'Computer Science': ('code','Error ketemu.<br><em>Fix-nya paham.</em>','Input transaksi salah','Fitur valid + kasus uji','Baca error → ubah kode → jalankan test','Cari penyebab input negatif lolos. Usulkan fix kecil dan kasus ujinya.'),
 'Information Systems': ('systems','Dari kebutuhan<br>ke <em>alur yang jelas.</em>','Peminjaman alat manual','Alur persetujuan + skema data','Tanya pengguna → petakan proses → uji akses','Ubah kebutuhan peminjaman alat menjadi alur, skema data, dan hak akses.'),
 'Electrical Engineering': ('energy','Sensor nyala.<br><em>Datanya cerita apa?</em>','Log sensor dummy','Grafik daya + asumsi energi','Baca log → cek satuan → analisis','Bantu analisis log sensor ini. Bedakan daya dan energi, tulis asumsi yang dipakai.'),
 'Industrial Engineering': ('queue','Antreannya panjang.<br><em>Macetnya di mana?</em>','Antrean kantin','Perbandingan skenario layanan','Petakan → simulasikan → bandingkan','Rancang simulasi satu dan dua loket. Nyatakan asumsi, jangan mengarang hasil.'),
 'Environmental Engineering and Sustainability': ('environment','Sampah tercatat.<br><em>Aksinya lebih tepat.</em>','Catatan sampah acara','Rencana pengurangan berbasis data','Timbang → kelompokkan → susun aksi','Kelompokkan data sampah ini dan susun skenario pengurangan dengan asumsi jelas.'),
 'Finance and Investment': ('finance','Baca bisnisnya.<br><em>Uji asumsinya.</em>','Laporan perusahaan','Rasio + skenario proyeksi','Ambil angka → hitung → uji skenario','Susun rasio dari laporan ini. Tunjukkan asal angka dan rumusnya.'),
 'Accounting': ('accounting','Totalnya beda?<br><em>Telusuri buktinya.</em>','Dua catatan transaksi','Daftar selisih yang perlu dicek','Cocokkan → tandai → periksa bukti','Bandingkan buku kas dan mutasi dummy. Tandai transaksi yang tidak cocok.'),
 'Communication': ('communication','Satu acara.<br><em>Tiga cara bercerita.</em>','Brief acara kampus','Pesan untuk tiga audiens','Pahami audiens → tulis → uji pesan','Tulis pesan untuk mahasiswa, sponsor, dan media. Fakta acara harus sama.'),
 'Digital Business': ('business','Idenya menarik.<br><em>Buktinya apa?</em>','Dua ide penawaran','Eksperimen kecil yang terukur','Hipotesis → uji → pelajari','Rancang eksperimen dua pesan penawaran. Pilih metrik, jangan mengarang hasil.'),
 'Business Management': ('management','Mau buka usaha?<br><em>Hitung dulu.</em>','Rencana bazar kampus','Anggaran + rencana operasi','Biaya → asumsi → break-even','Pisahkan biaya tetap dan variabel untuk bazar ini. Jelaskan rumus break-even.'),
 'Visual Communication Design': ('design','Banyak opsi.<br><em>Satu arah yang kuat.</em>','Brief acara kampus','Tiga arah konsep visual','Brief → eksplorasi → pilih alasan','Usulkan tiga arah konsep dari brief ini. Jelaskan audiens dan hierarki pesannya.'),
 'Business Law': ('law','Klausul abu-abu?<br><em>Tanya lebih tajam.</em>','Kontrak fiktif','Daftar isu untuk diskusi kelas','Baca → tandai → verifikasi','Tandai klausul ambigu dalam kontrak ini. Jangan mengarang pasal atau putusan.'),
 'Psychology': ('psychology','Temukan tema.<br><em>Jangan buru-buru label.</em>','Wawancara sintetis','Tema + kutipan pendukung','Baca → coding → bandingkan','Usulkan tema dari transkrip ini. Pisahkan observasi dan interpretasi, tanpa diagnosis.'),
}


def refresh(slides, majors, label, head, para):
    for s in slides:
        if not s['theme'].startswith('major '):
            continue
        major=s['title'].split(' / ')[0]
        kind,title,before,after,flow,example=PROJECTS[major]
        original=next(m for m in majors if m[1]==major)
        s['notes']+='\n\nPrompt lengkap untuk dibacakan atau disalin: '+original[6]+'\n\nApa yang dibantu AI: '+original[4]+'\nValidasi: '+original[7]
        body=label(major+' / ide proyek kampus')+head(title)
        body+='<div class="visual-split"><div class="project-story"><span class="story-label">Mulai dari</span><p>'+before+'</p><div class="story-rule"></div><span class="story-label">Bawa pulang</span><h2>'+after+'</h2><div class="project-flow">'+flow+'</div></div>'+diagram(kind)+'</div>'
        body+='<div class="prompt-strip"><b>Coba tanya AI</b><span>'+example+'</span></div>'
        body+='<p class="visual-check">'+original[7]+'</p>'
        s['body']=body
        s['theme']+=' visual-major visual-'+kind

    for i in [3,4]:
        slides[i]['theme']+=' stat-light' if i==3 else 'stat-blue'
    # Dense instructions stay in presenter notes; the screen carries the central idea.
    for s in slides:
        if s['title']=='Bisa prompt itu baru awal':
            s['body']=label('Skill AI yang kepakai')+head('Jangan berhenti<br>di <em>“jawabannya ada”.</em>')+'<div class="skill-steps"><div><b>01</b><h2>Kasih konteks</h2><p>Apa tujuanmu?</p></div><div><b>02</b><h2>Uji hasilnya</h2><p>Mana buktinya?</p></div><div><b>03</b><h2>Jelaskan balik</h2><p>Kamu paham?</p></div></div>'
        if s['title']=='Dari tugas kampus ke skill kerja':
            s['body']=label('Bekal sebelum masuk dunia kerja')+head('Tugas hari ini.<br><em>Portofolio besok.</em>')+'<div class="skill-pairs"><div><span>Tech</span><h2>Bangun fitur.<br>Uji kodenya.</h2></div><div><span>Nonteknis</span><h2>Bedah masalah.<br>Jelaskan keputusan.</h2></div></div>'+para('Mulai dari satu masalah kampus yang kamu kenal.')
        if s['title']=='Pilih jalur sesuai kelas kamu':
            s['body']=label('15 jurusan / pilih yang dekat denganmu')+head('Kamu mau<br><em>bikin apa?</em>')+'<div class="route-poster"><div><b>01</b><h2>Sistem &<br>teknologi</h2><p>Data · AI · aplikasi · engineering</p></div><div><b>02</b><h2>Bisnis &<br>manusia</h2><p>Keuangan · komunikasi · desain · perilaku</p></div></div>'+para('Tekan O. Pilih jurusanmu. Langsung masuk contohnya.')
        if s['title']=='Kenalan dengan TokenGateway':
            s['body']=label('Kenalan dengan TokenGateway')+head('Ide kamu.<br><em>Dikasih akses AI.</em>')+'<div class="gateway-poster"><div><b>Aplikasi / tool</b><span>Tempat kamu bekerja</span></div><strong>TokenGateway<span>API + paket token</span></strong><div><b>Model AI</b><span>Sesuai paket yang dipilih</span></div></div>'+para('Pilih paket. Bayar QRIS. Hubungkan API.')+'<p class="fine">Akses mengikuti paket, akun dan API key. Bukan langganan aplikasi premium pihak lain.</p>'
        if s['title']=='Challenge: pulang bawa satu karya':
            s['body']=label('Challenge / mulai minggu ini')+'<div class="challenge-poster"><div class="challenge-number">1</div><div>'+head('Masalah kecil.<br><em>Karya nyata.</em>')+para('Pilih → bikin → uji → demo')+'</div></div><div class="callout">Kalau bisa didemokan dan dijelaskan, kamu punya bahan portofolio.</div>'
    return slides


CSS = '''
.visual-major h1{font-size:84px;line-height:1.08;max-width:1550px;margin-bottom:30px}
.visual-major .eyebrow{font-size:21px;margin-bottom:22px}
.visual-split{display:grid;grid-template-columns:760px 1fr;gap:80px;align-items:center}
.project-visual{margin:0;background:#202832;border-radius:12px;padding:4px 20px 0}
.project-visual svg{display:block;width:100%;height:400px}
.project-visual figcaption{font-size:15px;color:#aebbc8;text-align:right;padding:0 15px 14px}
.project-story{padding-top:12px}
.story-label{font-size:20px;color:#aebbc8}
.project-story p{font-size:34px;margin:12px 0 20px;line-height:1.3}
.project-story h2{font-size:44px;line-height:1.25;color:#16dde2;margin:10px 0 25px;max-width:700px}
.story-rule{height:2px;width:90px;background:#16dde2;margin:22px 0}
.project-flow{font-size:23px;color:#aebbc8;margin-top:30px}
.prompt-strip{display:flex;gap:30px;align-items:center;border-top:1px solid #455463;margin-top:28px;padding:22px 0 0;font-size:23px;line-height:1.45}
.prompt-strip b{color:#16dde2;font-size:20px;flex-shrink:0}
.visual-check{font-size:17px;color:#aebbc8;line-height:1.5;margin:15px 0 0}
.visual-communication .project-visual,.visual-design .project-visual{background:#17383f}
.visual-finance .project-visual,.visual-management .project-visual{background:#14294b}
.stat-light{background:#ecf1ee;color:#181d23}.stat-light em,.stat-light .stat,.stat-light .brand i{color:#006c70}
.stat-light .eyebrow,.stat-light .footer,.stat-light .lead,.stat-light .split p{color:#475765}
.stat-light .callout{background:#dce5e2;border-color:#006c70}
.stat-blue{background:#112c59}.stat-blue .eyebrow,.stat-blue .footer,.stat-blue .lead{color:#d3dfec}
.stat-blue .callout{background:#163966}
.skill-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:60px;margin-top:70px}
.skill-steps>div{border-top:4px solid #16dde2;padding-top:22px}
.skill-steps b{font-size:70px;color:#16dde2;font-weight:800}.skill-steps h2{font-size:40px;margin:25px 0 15px}.skill-steps p{font-size:29px;color:#aebbc8}
.skill-pairs{display:grid;grid-template-columns:1fr 1fr;gap:100px;margin:60px 0 35px}
.skill-pairs>div{border-left:8px solid #16dde2;padding-left:35px}.skill-pairs span{font-size:23px;color:#aebbc8}.skill-pairs h2{font-size:53px;line-height:1.4}
.route-poster{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin-top:40px}.route-poster>div{display:grid;grid-template-columns:150px 1fr;column-gap:25px;border-top:2px solid #455463;padding-top:25px}.route-poster b{font-size:105px;line-height:1.1;color:#16dde2;grid-row:span 2}.route-poster h2{font-size:49px;margin:0 0 15px}.route-poster p{font-size:23px;color:#aebbc8;margin:0}
.gateway-poster{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:45px;align-items:center;margin:75px 0 55px}.gateway-poster>div{border-top:2px solid #455463;padding-top:30px;text-align:center}.gateway-poster b{font-size:35px}.gateway-poster span{display:block;font-size:21px;margin-top:20px;color:#aebbc8;font-weight:400}.gateway-poster strong{display:block;padding:50px 30px;background:#16dde2;color:#181d23;font-size:43px;text-align:center}.gateway-poster strong span{color:#181d23}
.challenge-poster{display:grid;grid-template-columns:470px 1fr;align-items:center;gap:75px;margin-top:50px}.challenge-number{font-size:440px;line-height:1;font-weight:800;color:#006c70;letter-spacing:-35px}.challenge-poster h1{font-size:96px}.challenge-poster .lead{font-size:39px;color:#475765}
'''
