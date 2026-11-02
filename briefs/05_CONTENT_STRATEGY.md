# Strategi Konten — TokenGateway

## Rekomendasi utama

Mulai dari pesan yang konkret: **“GLM 5.3 Flash, 50 juta token, harga paket Rp10.000, berlaku 7 hari, bayar pakai QRIS.”** Produk menjadi mudah dipahami ketika nominal disertai apa yang didapat, model yang bisa dipakai, dan ketentuannya. [Sumber offer](https://tokengateway.ai.id/api/v1/catalog/packages).

Arah kreatif yang diusulkan: **“Paket AI buat workflow coding kamu.”** Gunakan QRIS sebagai kemudahan pembayaran dan angka entry sebagai hook. Kemudian tunjukkan cara mulai memakai API. Jangan membuka semua konten dengan daftar panjang model atau jargon proxy.

Tujuan awal: menarik developer yang relevan ke pricing/docs, membantu mereka memahami paket, dan mendorong request pertama. Tidak ada data performa konten/ads yang diperiksa; ini prioritas eksperimen, bukan prediksi konversi atau “jam posting terbaik”.

## Pilar konten

| Pilar | Pertanyaan audiens | Angle | Bukti / guardrail |
|---|---|---|---|
| Mulai kecil | Berapa biaya awalnya? | Entry GLM Rp10.000 | Selalu 50M, 7 hari, harga paket, note fee |
| Pembayaran lokal | Bisa bayar pakai apa? | Pilih paket lalu QRIS | Pricing; login dan email verification tidak disembunyikan |
| Integrasi | Diisi apa di aplikasi? | Satu base URL, key, model ID | Docs; langkah exact tool dicek di versi target |
| Pilih paket | Model mana yang dapat akses? | Single/pass vs bundling | Package IDs dan allowlist; tidak menjanjikan semua model |
| Token literacy | 50 juta token itu apa? | Bedakan kuota dan context window | Jangan mengonversi menjadi prompt/lines/hours tanpa data |
| Kontrol dan diagnosis | Kenapa request gagal? | Key, izin model, quota, request ID | Docs; jangan mengarang usage/account screenshot |

## Seri pilot yang disarankan

Urutan ini adalah backlog konten, bukan jadwal publikasi otomatis. Mulai dengan enam unit; review hasil sebelum menambah frekuensi atau paid ads.

| Prioritas | Unit | Format | CTA utama | Yang ingin dipelajari |
|---|---|---|---|---|
| 1 | Kenalan lewat paket GLM Rp10.000 | 5-slide IG carousel + vertical cutdowns | Lihat paket GLM | Apakah offer lengkap menghasilkan kunjungan pricing? |
| 2 | Cara beli paket lewat QRIS | 5-slide tutorial | Buka halaman paket | Di langkah mana orang bingung/login terhenti? |
| 3 | Base URL dan request pertama | 4-slide tutorial | Baca docs | Apakah orang lanjut ke setup, bukan hanya klik harga? |
| 4 | Satu model atau bundling? | 4–5-slide comparison paket sendiri | Bandingkan paket | Model/masa berlaku mana paling relevan? |
| 5 | Kuota token beda dari context window | 4-slide edukasi | Cek detail paket | Apakah orang memahami batas paket? |
| 6 | Request ditolak? Cek tiga hal ini | 4-slide troubleshooting | Buka docs error | Apakah konten membantu aktivasi dan support? |

Topik tambahan setelah flow diuji: voucher/traktir teman, contoh kerja di Cline, demo streaming, dan account usage. Hindari menjadikan fitur pending sebagai promise atau headline peluncuran.

## Hook bank

Contoh berikut merupakan rekomendasi copy; angka mengacu snapshot yang harus di-refresh sebelum tayang:

- “Mulai pakai API AI dari Rp10.000.”
- “GLM 5.3 Flash. 50 juta token. 7 hari.”
- “Pilih paket. Bayar pakai QRIS.”
- “Base URL-nya satu. Modelnya sesuai paketmu.”
- “Sebelum beli: cek model, kuota, dan masa berlaku.”
- “Kuota token bukan jumlah prompt.”
- “Request ditolak? Cek paket dan izin model.”

Untuk hook “mulai Rp10.000”, slide/caption pendamping harus mengidentifikasi entry GLM dan biaya layanan. Jangan menempatkan “Rp10.000” tepat di bawah tiga logo sehingga pembaca menyimpulkan semua provider mendapat harga itu.

## Pola cerita carousel

Hook → bukti/penjelasan → langkah atau pilihan → offer yang lengkap → satu CTA. Setiap slide membawa satu gagasan utama. Variasikan komposisi lewat headline, model cards, code panel dan offer panel; bukan lewat dekorasi baru pada setiap slide.

Untuk konten baru, utamakan headline 4–9 kata bila makna tetap jelas, satu subline, dan satu fakta utama. Angka ini rekomendasi editorial, bukan batas runtime; contract slot dan hasil fitting tetap menentukan. Footer berupa marka brand dan tujuan aksi, bukan paragraf disclaimer sulit dibaca.

## Adaptasi platform

| Format | Cara menyampaikan | Hasil studio |
|---|---|---|
| IG carousel 4:5 | Urutan edukasi/offer; pembaca swipe | PNG 1080×1350 logical, native output 2160×2700 |
| IG Story 9:16 | Satu pesan per frame; CTA menuju link sticker oleh penerbit | PNG 1080×1920 logical, native output 2160×3840 |
| TikTok vertical | Urutan photo content atau background untuk video yang dibuat terpisah | PNG 9:16 dengan action-rail/caption exclusions |

PNG bukan MP4. Studio tahap awal membuat aset statis. Narasi, musik, video demo, link sticker, caption platform, dan publishing ditambahkan oleh penerbit atau tahap tooling lain. Jangan menjanjikan semua itu selesai dari screenshot renderer.

Di IG/TikTok, CTA “link di bio” hanya dipakai setelah profil benar-benar mengarah ke halaman yang dimaksud. Pada desain, domain/path dapat ditulis jelas. Jangan mengasumsikan teks URL dalam image dapat diklik.

## Eksperimen yang masuk akal

- Hook A: harga entry. Hook B: QRIS. Pertahankan offer, visual, format dan CTA yang sama supaya perbedaan lebih mudah ditafsirkan.
- CTA A: “Lihat paket GLM”. CTA B: “Cek kuota & masa berlaku”. Gunakan tujuan landing yang sama jika ingin membandingkan wording.
- Edukasi A: request SDK pertama. Edukasi B: setup tool setelah versi target diuji. Ukur kunjungan docs dan aktivasi request, jangan menyebut pembanding kausal jika audience/distribution berbeda.

Ukur reach, saves, shares, profile/landing visits, serta tahap signup/payment/request bila analitik tersedia. Nilai konten berdasarkan perilaku yang sesuai tujuan. Jangan menyimpulkan pemenang dari satu angka likes atau sampel kecil; jumlah sampel dan durasi keputusan ditentukan setelah baseline tersedia.

## Publication checklist

- Offer masih ada pada katalog; model ID, harga, kuota, expiry dan note biaya cocok.
- Logo TokenGateway sesuai referensi; provider dan QRIS assets autentik.
- Fitur disebut dengan scope bukti yang benar; tidak menyiratkan partnership vendor atau full editor subscription replacement.
- Tidak ada key nyata, account email, invoice, usage atau testimonial palsu pada mockup.
- Angka dan ketentuan terbaca saat dilihat pada ponsel, dengan safe profile yang sesuai.
- CTA menuju halaman yang benar; caption/bio/sticker dilakukan di platform oleh penerbit.
- Copy yang berubah diperiksa ulang; snapshot dan tanggal publikasi direkam.

## Yang sengaja belum ditetapkan

Frekuensi/jam posting, budget ads, influencer/UGC, testimoni, target ROAS, hasil benchmark, dan kalender tayang tidak berasal dari riset ini. Paket brief menyediakan konten dan desain untuk pilot; keputusan distribusi dapat diambil setelah aset dan flow pengguna siap.
