"""Campus-specific examples and 2026 evidence for the presentation."""

WORKFORCE = 'https://www.pwc.com/gx/en/news-room/press-releases/2026/companies-risk-losing-ai-savvy-employees.html'
CEO = 'https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-global-ceo-survey.html'
WTI = 'https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization'

MAJORS = [
 ('tech', 'Data Science', 'Dari data berantakan<br>ke <em>insight yang bisa dicek.</em>', 'Dashboard pengeluaran organisasi', 'Bersihkan CSV dummy, cari pola per kategori, lalu jelaskan temuan.', 'Notebook + grafik + penjelasan asumsi.', 'Bantu tulis pipeline pandas untuk CSV dummy. Cek missing value, duplikat, dan total. Pisahkan temuan dari dugaan. Jangan mengisi data kosong tanpa menjelaskan alasannya.', 'Cocokkan total ke data mentah. Cegah data leakage saat mencoba prediksi.'),
 ('tech', 'Artificial Intelligence', 'Jangan cuma pakai model.<br><em>Ukur hasilnya.</em>', 'Asisten FAQ kegiatan kampus', 'Susun dataset pertanyaan dan bandingkan jawaban beberapa konfigurasi.', 'Prototipe + 20 pertanyaan evaluasi + hasil pengujian.', 'Rancang evaluasi asisten FAQ. Gunakan dokumen acara sebagai satu-satunya sumber. Buat pertanyaan normal, ambigu, dan di luar dokumen. Jika info tidak ada, jawab tidak tahu.', 'Pisahkan data evaluasi. Catat jawaban salah dan sumber yang dipakai.'),
 ('tech', 'Computer Science', 'Dari error panjang<br>ke <em>fix yang kamu pahami.</em>', 'Aplikasi kas organisasi', 'Minta bantuan desain fungsi, debugging, test, dan review diff.', 'Fitur tambah transaksi + test input dan total.', 'Saya punya fungsi tambah transaksi. Cari penyebab nominal negatif bisa masuk. Jelaskan dulu akar masalahnya, usulkan perubahan kecil, lalu tulis kasus uji.', 'Jalankan test dan baca perubahan kode. Jangan simpan API key di frontend.'),
 ('tech', 'Information Systems', 'Masalah bisnis dulu.<br><em>Baru sistemnya.</em>', 'Alur peminjaman alat kampus', 'Ubah kebutuhan pengguna menjadi proses, skema data, dan acceptance criteria.', 'Diagram proses + ERD + backlog fitur.', 'Dari kebutuhan peminjaman alat ini, buat alur persetujuan dan skema data. Tanyakan aturan yang belum jelas. Pisahkan hak mahasiswa, admin, dan petugas.', 'Cek aturan dengan pengguna. Uji izin akses dan status transaksi.'),
 ('tech', 'Electrical Engineering', 'Data sensor masuk.<br><em>Analisisnya masuk akal?</em>', 'Pemantauan energi ruang kelas', 'Bantu susun parsing log sensor dan interpretasi pola konsumsi.', 'Script analisis + grafik daya dan energi.', 'Gunakan log sensor dummy dengan timestamp, tegangan, dan arus. Jelaskan asumsi untuk estimasi energi, bedakan watt dan kWh, lalu tulis kode analisis.', 'Cek satuan, interval sampling, dan asumsi faktor daya. Validasi dengan dosen atau lab.'),
 ('tech', 'Industrial Engineering', 'Antrian panjang?<br><em>Cari bottleneck-nya.</em>', 'Simulasi antrean kantin', 'Bantu susun model proses, skenario kapasitas, dan analisis waktu tunggu.', 'Simulasi + perbandingan skenario layanan.', 'Buat rancangan simulasi antrean dari data waktu kedatangan dan layanan dummy. Jelaskan asumsi. Bandingkan satu dan dua loket tanpa mengarang hasil pengukuran.', 'Jalankan simulasi berulang. Bedakan hasil model dari observasi lapangan.'),
 ('tech', 'Environmental Engineering and Sustainability', 'Isu lingkungan.<br><em>Mulai dari data lokal.</em>', 'Audit sampah kegiatan kampus', 'Kelompokkan catatan sampah dan hitung skenario pengurangan.', 'Dashboard kategori + usulan intervensi.', 'Analisis data sampah dummy per jenis dan berat. Tunjukkan konversi satuan, asumsi, dan data yang masih kurang. Buat skenario pengurangan dengan label simulasi.', 'Cek data timbangan dan metode sampling. Faktor emisi harus punya sumber.'),
 ('nontech', 'Finance and Investment', 'Baca laporan.<br><em>Uji asumsi valuasi.</em>', 'Analisis perusahaan untuk tugas kelas', 'Bantu ekstrak angka publik dan susun skenario proyeksi.', 'Tabel rasio + sensitivitas asumsi + ringkasan risiko.', 'Dari laporan perusahaan yang saya berikan, susun rasio keuangan. Cantumkan halaman asal angka. Buat skenario berdasarkan asumsi yang saya tentukan, bukan target harga karangan.', 'Hitung ulang di spreadsheet. Ini latihan akademik, bukan rekomendasi investasi.'),
 ('nontech', 'Accounting', 'Rekonsiliasi dulu.<br><em>Baru percaya totalnya.</em>', 'Cek pembukuan kegiatan kampus', 'Bantu petakan transaksi dummy ke kategori dan tandai selisih.', 'Lembar rekonsiliasi + daftar transaksi perlu dicek.', 'Bandingkan buku kas dan mutasi dummy ini. Tandai nominal, tanggal, atau transaksi yang tidak cocok. Jangan membuat jurnal penyesuaian tanpa bukti pendukung.', 'Cocokkan ke bukti transaksi. Selisih adalah petunjuk pemeriksaan, bukan bukti fraud.'),
 ('nontech', 'Communication', 'Pesannya jelas.<br><em>Audiensnya siapa?</em>', 'Kampanye acara organisasi', 'Bantu susun pesan untuk mahasiswa, sponsor, dan media kampus.', 'Message map + draft konten + rencana respons.', 'Buat tiga versi pesan dari brief acara yang sama untuk mahasiswa baru, sponsor, dan media kampus. Pertahankan fakta. Jelaskan pilihan nada dan ajakan tiap audiens.', 'Verifikasi tanggal, narasumber, dan kutipan. Uji pemahaman pada teman.'),
 ('nontech', 'Digital Business', 'Banyak ide bisnis.<br><em>Mana yang perlu diuji?</em>', 'Eksperimen landing page usaha kampus', 'Bantu susun hipotesis, variasi pesan, dan rencana pengukuran.', 'Dua konsep halaman + rencana eksperimen.', 'Untuk ide usaha ini, pisahkan asumsi pelanggan, masalah, dan penawaran. Rancang eksperimen kecil dengan metrik keberhasilan. Jangan mengarang hasil wawancara atau konversi.', 'Uji pada pengguna nyata. Jangan menyimpulkan dari klik yang terlalu sedikit.'),
 ('nontech', 'Business Management', 'Strateginya menarik.<br><em>Operasionalnya siap?</em>', 'Rencana usaha bazar kampus', 'Bantu strukturkan model bisnis, proses kerja, dan skenario biaya.', 'Rencana operasi + anggaran + peta risiko.', 'Susun rencana bazar dengan budget yang saya berikan. Pisahkan biaya tetap dan variabel, daftar asumsi penjualan, serta risiko operasional. Tunjukkan rumus break-even.', 'Cek angka dengan spreadsheet dan harga pemasok. Proyeksi bukan penjualan aktual.'),
 ('nontech', 'Visual Communication Design', 'Banyak alternatif.<br><em>Tetap punya arah.</em>', 'Identitas visual acara kampus', 'Bantu susun creative brief, arah konsep, dan alasan pemilihan desain.', 'Creative brief + tiga arah konsep + karya final.', 'Dari brief acara ini, buat tiga arah konsep visual dalam bentuk deskripsi. Jelaskan audiens, hierarki pesan, tipografi, dan alasan tiap arah. Hindari meniru identitas brand lain.', 'Desain final tetap dikerjakan di tool desain. Cek hak aset, lisensi, dan keterbacaan.'),
 ('nontech', 'Business Law', 'Bedah klausul.<br><em>Buka sumber hukumnya.</em>', 'Review kontrak fiktif untuk kelas', 'Bantu tandai istilah ambigu dan susun pertanyaan untuk diskusi.', 'Matriks klausul + isu + bahan verifikasi.', 'Review kontrak fiktif ini untuk diskusi kelas. Tandai kewajiban, tenggat, dan klausul ambigu. Pisahkan isi kontrak dari interpretasi. Jangan mengarang pasal atau putusan.', 'Buka aturan dan putusan resmi yang relevan. Diskusikan dengan dosen; bukan opini hukum final.'),
 ('nontech', 'Psychology', 'Dengar pola ceritanya.<br><em>Jangan lompat ke label.</em>', 'Analisis wawancara simulasi', 'Bantu coding tema dari transkrip sintetis dan membandingkan interpretasi.', 'Codebook + kutipan pendukung + refleksi bias.', 'Dari transkrip simulasi ini, usulkan tema dan kutipan pendukung. Pisahkan observasi dari interpretasi. Tulis alternatif penjelasan. Jangan memberi diagnosis atau label klinis.', 'Gunakan data sintetis atau anonim. Bandingkan coding dengan pembaca lain dan bimbingan dosen.'),
]


def enrich(slides, label, head, para, rows, prompt):
    def slide(title, body, notes, theme='', source=''):
        return dict(title=title, body=body, notes=notes, theme=theme, source=source)

    def stat(title, number, heading, text, callout, notes, source):
        return slide(title, label('Realita industri / Data terbitan 2026')+
            f'<div class="split"><div class="stat">{number}<span>%</span></div><div>'+
            head(heading)+para(text)+'</div></div><div class="callout">'+callout+'</div>', notes, '', source)

    evidence = [
        stat('2026: AI sudah jadi bagian dari kerja', '64', 'AI sudah masuk<br><em>keseharian kerja.</em>',
             'Pekerja dalam survei global PwC memakai AI di tempat kerja dalam 12 bulan terakhir.',
             'Naik 10 poin persentase dari tahun sebelumnya. Mulai latihan sebelum masuk dunia kerja.',
             'PwC, rilis 29 September 2026. Survei 49.364 pekerja, 48 negara dan wilayah, 29 sektor; pengumpulan data Mei–Juni 2026. Angka 64% adalah laporan pekerja selama 12 bulan, bukan persentase perusahaan atau penggunaan harian. Tidak menyatakan semua perusahaan telah memakai AI.',
             'PwC / Global Workforce Hopes and Fears 2026 / 29 September 2026 · Referensi di akhir'),
        stat('Perusahaan juga sedang mengejar pace', '42', 'Perusahaan juga<br><em>takut kalah cepat.</em>',
             'CEO menyebut kecepatan transformasi mengikuti teknologi, termasuk AI, sebagai kekhawatiran utama.',
             'Tekanan beradaptasi sudah ada. Latihan workflow AI jadi bekal yang relevan sejak kuliah.',
             'PwC Global CEO Survey 2026, terbit Januari 2026, 4.454 CEO di 95 negara dan wilayah; data September–November 2025. Angka 42% tentang kekhawatiran transformasi, bukan adopsi AI. Sumber juga menyebut banyak organisasi belum mendapat manfaat finansial; penggunaan AI bukan jaminan sukses.',
             'PwC / Global CEO Survey 2026 / Januari 2026 · Referensi di akhir'),
        stat('Pace cepat butuh kebiasaan belajar', '65', 'Perubahannya cepat.<br><em>Belajarnya berlanjut.</em>',
             'Pengguna AI dalam survei Microsoft takut tertinggal jika tidak cepat memakai AI untuk beradaptasi.',
             'Mulai kecil → uji hasil → perbaiki cara kerja → ulangi. Bangun kebiasaan, bukan sekali ikut tren.',
             'Microsoft Work Trend Index 2026, 5 Mei 2026. Survei 20.000 pekerja pengguna AI di 10 negara. Angka 65% merupakan persepsi pengguna AI, bukan bukti 65% semua pekerja pasti tertinggal atau kehilangan pekerjaan.',
             'Microsoft / Work Trend Index 2026 / 5 Mei 2026 · Referensi di akhir'),
    ]
    route = slide('Pilih jalur sesuai kelas kamu', label('Campus Session / 15 jurusan')+
        head('Jurusan beda.<br><em>Pintu masuk AI beda.</em>')+
        '<div class="two"><div class="route-panel"><b>Tech & engineering</b><p>Data Science · AI · Computer Science · Information Systems · Electrical Engineering · Industrial Engineering · Environmental Engineering & Sustainability</p></div><div class="route-panel"><b>Bisnis, kreatif & humaniora</b><p>Finance & Investment · Accounting · Communication · Digital Business · Business Management · DKV · Business Law · Psychology</p></div></div>'+
        para('Buka Overview (O), pilih jurusan kelasmu. Slide lain boleh langsung dilewati.'),
        'Deck modular. Untuk kelas campuran, pilih 2–3 contoh tiap kelompok. Untuk kelas spesifik, ambil satu jurusan lalu kembali ke produk. Tidak perlu membacakan semua slide. Kelompok navigasi bukan klasifikasi akademik resmi kampus.')

    branches = []
    for group, title, subtitle in [('tech', 'Bangun sistemnya.<br><em>Uji cara kerjanya.</em>', 'Bagian tech & engineering'), ('nontech', 'Paham masalahnya.<br><em>Perkuat keputusanmu.</em>', 'Bagian bisnis, kreatif & humaniora')]:
        branches.append(slide(subtitle, label(subtitle)+head(title)+para('Pilih contoh yang dekat dengan jurusanmu. Setiap slide berdiri sendiri.')+
            '<div class="section-index">'+('CODE / DATA / SYSTEMS' if group=='tech' else 'BUSINESS / PEOPLE / COMMUNICATION')+'</div>',
            'Pembatas bagian. Lewati bagian ini melalui overview jika tidak relevan dengan kelas. Contoh adalah rancangan latihan, bukan klaim kurikulum atau kemampuan fitur otomatis gateway.', 'section-break'))
        for track, major, heading, project, activity, output, example, check in MAJORS:
            if track != group:
                continue
            body = label(('Tech & engineering' if group=='tech' else 'Bisnis, kreatif & humaniora')+' / '+major+' (S1)')+head(heading)
            body += '<div class="two"><div>'+rows([('Proyek kampus', project), ('AI bantu apa?', activity), ('Hasil latihan', output)])+'</div>'+prompt(example)+'</div>'
            body += '<div class="major-check"><b>Cek sebelum percaya</b><span>'+check+'</span></div>'
            branches.append(slide(major+' / '+project, body,
                f'Contoh latihan untuk {major} berdasarkan konteks jurusan yang diberikan pemilik. Bukan studi kasus industri atau proyek yang sudah diimplementasikan. {check} AI di sini membantu teks, kode, atau struktur analisis. Eksekusi, desain, simulasi dan verifikasi dilakukan di tool yang sesuai. API TokenGateway perlu aplikasi atau tool kompatibel, bukan otomatis seluruh fitur produk konsumen.',
                'major '+('major-tech' if group=='tech' else 'major-nontech')))
    bridge = slide('Bagaimana mahasiswa nonteknis memakai gateway?', label('Hubungkan latihan ke produk')+
        head('Tech bikin alurnya.<br><em>Semua bisa pakai hasilnya.</em>')+rows([
            ('Mahasiswa tech', 'Hubungkan API ke script, aplikasi, atau tool yang mendukung custom endpoint.'),
            ('Mahasiswa nonteknis', 'Gunakan aplikasi atau client yang mendukung endpoint gateway, lalu kerjakan prompt sesuai bidangmu.'),
            ('Kolaborasi lintas jurusan', 'Tim tech bangun prototype; tim bidang lain menentukan kebutuhan dan mengecek kualitas hasil.')])+
        '<div class="callout">TokenGateway menyediakan akses API. Fitur upload, desain, browsing, dan eksekusi kode bergantung pada aplikasi yang dipakai.</div>',
        'Bantu peserta nonteknis memahami persyaratan setup. Jangan menjanjikan chatbot siap pakai, pengganti Canva, akun premium pihak lain atau fitur analisis file otomatis. Tunjukkan dokumentasi integrasi yang sesuai.')
    refs = slide('Referensi data industri 2026', label('Sumber 2026 / dapat diklik')+head('Data baru.<br><em>Cakupannya jelas.</em>')+
        '<div class="research-sources">'+''.join(f'<a href="{url}" target="_blank" rel="noopener"><b>{title}</b><span>{text}</span><small>{url}</small></a>' for url,title,text in [
            (WORKFORCE, '64% / PwC / 29 September 2026', '49.364 pekerja, 48 negara/wilayah, 29 sektor. Data Mei–Juni 2026. Memakai AI di tempat kerja dalam 12 bulan terakhir.'),
            (CEO, '42% / PwC / Januari 2026', '4.454 CEO, 95 negara/wilayah. Data September–November 2025. Kekhawatiran transformasi mengikuti teknologi, termasuk AI.'),
            (WTI, '65% / Microsoft / 5 Mei 2026', '20.000 pekerja pengguna AI di 10 negara. Persepsi takut tertinggal jika tidak cepat beradaptasi dengan AI.')])+'</div>',
        'Sumber dibuka dan diperiksa pada 21 Oktober 2026. Bedakan tahun publikasi dari periode pengumpulan data. Tidak ada generalisasi bahwa seluruh perusahaan sudah menggunakan AI.', 'research')

    # Keep the original product narrative and all 21 packages after the optional campus examples.
    result = slides[:2]+evidence+slides[3:6]+[route]+branches+slides[6:9]+[bridge]+slides[9:-1]+[refs, slides[-1]]
    for item in result:
        if item['title']=='Deadline besok. Skill kamu sampai mana?':
            item['body']=item['body'].replace('<div class="cover-stamp">', '<div class="cover-stamp"><img class="cover-logo" src="assets/tokengateway-logo.png" alt="Logo TokenGateway">')
            item['notes']='Buka dengan angkat tangan: siapa yang pernah buka AI saat deadline? Deck modular untuk 15 jurusan. Jalur ringkas 25–35 menit memakai 1–3 slide jurusan; versi lengkap sekitar 50–65 menit. Gunakan O untuk lompat ke jurusan, produk, atau katalog.'
    return result
