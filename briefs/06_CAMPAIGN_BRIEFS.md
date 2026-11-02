# Campaign Briefs — Materi Awal untuk Creative Studio

Tanggal fakta: 12 Oktober 2026. Semua materi di bawah adalah draft copy/layout; belum dirender atau dipublikasikan. Refresh [fakta paket](02_PACKAGES_AND_FACTS.md) sebelum export final. Field mapping mengikuti [kontrak master plan](../EXECUTION_PLAN.md); fact IDs di sini adalah register brief, bukan file runtime yang sudah diimplementasikan.

## Campaign A — Mulai dengan GLM Rp10.000

**Prioritas:** pertama. **Audiens:** developer individu yang belum memakai TokenGateway. **Tujuan:** memahami entry offer lalu mengunjungi pricing. **Format:** lima slide carousel; masing-masing mendapat re-layout vertical. **CTA:** lihat paket GLM. **Sumber offer:** `pass-glm-5.3-flash-50m` v1. [Katalog publik](https://tokengateway.ai.id/api/v1/catalog/packages).

### Slide A1 — Hook · `HERO_HOOK`

| Slot | Copy |
|---|---|
| `title` | Mulai pakai API AI dari Rp10.000. |
| `highlight` | Rp10.000 |
| `categoryTag` | PAKET GLM 5.3 FLASH |
| `subline` | 50 juta token. Berlaku 7 hari. Bayar pakai QRIS. Harga paket belum termasuk biaya layanan checkout. |

Arahan visual: header kecil dengan brand lockup; title besar kiri; satu highlight cyan; terms tetap terbaca. Tidak ada logo provider lain pada frame ini.

### Slide A2 — Pilihan model · `MODEL_CATALOG`

| Slot | Copy |
|---|---|
| `title` | Pilih model sesuai paketmu. |
| `subline` | Akses dan harga mengikuti paket. Rp10.000 khusus pass GLM 5.3 Flash 50M. |
| GLM label | GLM 5.3 Flash |
| GLM description | Entry pass: 50 juta token, berlaku 7 hari. |
| DeepSeek label | DeepSeek V4.1 Flash |
| DeepSeek description | Tersedia pada pass dan paket bundling dalam katalog. |
| Gemini label | Gemini 3.8 Flash |
| Gemini description | Ada pass tersendiri. Cek kuota dan masa berlaku sebelum beli. |

Provider marks harus autentik. Ini label katalog gateway, bukan benchmark atau jaminan upstream. Jangan memasukkan semua provider ke offer Rp10.000. GLM availability di entry pass; DeepSeek contoh pada All-Star Flash/pass; Gemini pada `pass-gemini-3.8-flash-50m`.

### Slide A3 — Setup ringkas · `CODE_MOCKUP`

| Slot | Copy / nilai |
|---|---|
| `title` | Hubungkan aplikasi ke gateway. |
| `windowTitle` | TokenGateway — API Setup |
| Code base URL | `https://tokengateway.ai.id/v1` |
| Code model | `glm-5.3-flash` |
| Code key | `YOUR_TOKEN_GATEWAY_KEY` |
| Step 1 | Buat API key di console. |
| Step 2 | Isi base URL pada aplikasi yang kompatibel. |
| Step 3 | Pilih model sesuai akses paket dan key. |
| `caption` | Ikuti petunjuk integrasi tool kamu di dokumentasi TokenGateway. |

Base URL/model dapat ditampilkan sebagai configuration summary. Registry `CODE_MOCKUP` awal mensyaratkan integration fact yang terverifikasi; verifikasi workflow tool target sebelum menjadikan slide ini tutorial spesifik Cursor. Jika belum, jadikan specimen berlabel draft pada showcase dan tahan export slide itu. Tidak ada fake shell command untuk “mengaktifkan Cursor”.

### Slide A4 — Offer lengkap · `PRICING_OFFER`

| Slot / resolved fact | Copy / nilai |
|---|---|
| `title` | Paket awal GLM 5.3 Flash. |
| `quotaLabel` | Kuota paket |
| Quota | 50.000.000 token; display utama boleh “50 juta token” |
| Price | `10000` IDR → Rp10.000 |
| Validity | Berlaku 7 hari |
| `supportingText` | Akses model glm-5.3-flash. Bayar paket pakai QRIS. |
| `ctaLabel` | Lihat paket GLM |
| `ctaTargetFactId` target | `https://tokengateway.ai.id/pricing` |
| `termsNote` | Harga paket. Belum termasuk biaya layanan checkout. Akses model mengikuti paket dan API key. |

Layout: quota mono + price sans; label “harga paket” dekat nominal; validity terpisah dan jelas; QRIS word badge; CTA footer. Terms mendapat region khusus. Jangan menggambar QR code dekoratif.

### Slide A5 — Langkah berikutnya · `HERO_HOOK`

| Slot | Copy |
|---|---|
| `title` | Cek paket. Mulai request pertama. |
| `highlight` | request pertama |
| `categoryTag` | TOKENGATEWAY |
| `subline` | Lihat akses model, kuota, masa berlaku, dan rincian bayar di tokengateway.ai.id/pricing. |

CTA mengikuti pricing; jangan mengubahnya menjadi perintah bayar di komentar/DM. Brand lockup konsisten, tanpa tambahan kartu dekoratif.

### Caption draft A

Mulai coba API AI dengan Pass Kilat GLM 5.3 Flash: 50 juta token, harga paket Rp10.000, berlaku 7 hari.

Pembayaran melalui QRIS. Harga paket belum termasuk biaya layanan checkout. Akses model mengikuti paket dan API key kamu.

Cek detail paket di tokengateway.ai.id/pricing. Untuk setup aplikasi, baca tokengateway.ai.id/docs.

CTA utama caption tetap pricing. Pada platform yang tidak membuat URL caption clickable, gunakan lokasi link yang benar-benar tersedia pada akun.

### Vertical cutdowns A

- **Frame V1 — offer:** GLM 5.3 Flash / 50 juta token / Rp10.000 / 7 hari / QRIS / note fee / lihat paket. Gunakan pricing layout, bukan menumpuk A1–A5 pada satu image.
- **Frame V2 — setup:** satu base URL yang terlihat lengkap, model ID dan key placeholder; arahkan ke docs setelah langkah tool diuji.
- **Frame V3 — catalog:** tiga model cards dan access note, tanpa headline Rp10.000.

Story CTA ditempatkan dalam safe content dan penerbit bisa menambahkan link sticker. TikTok memakai profile dengan right/bottom exclusions. Output tetap PNG statis.

## Campaign B — Cara Beli Paket lewat QRIS

**Audiens:** orang yang sudah tertarik tetapi belum tahu alur. **Tujuan:** mengurangi kebingungan sebelum checkout. **Format:** lima slide. **CTA:** buka pricing. **Status:** draft tutorial; walkthrough/login/payment result aktual belum diuji.

| Slide | Blueprint | Pesan utama | Isi yang wajib tampak |
|---|---|---|---|
| B1 | HERO_HOOK | Pilih paket. Bayar pakai QRIS. | Harga, kuota, model dan expiry perlu dicek |
| B2 | HERO_HOOK | Login dan verifikasi email dulu. | Langkah verifikasi email dari public pricing UI |
| B3 | PRICING_OFFER | Periksa rincian sebelum bayar. | Paket entry + validity + fee note; actual checkout total tidak dipalsukan |
| B4 | HERO_HOOK | Lanjutkan pembayaran melalui QRIS. | CTA DOKU sesuai UI; jangan menampilkan QR palsu atau invoice nyata pengguna |
| B5 | HERO_HOOK | Setelah pembayaran, cek paket di akun. | Situs menyatakan aktivasi setelah pembayaran; lalu buat key dan baca docs |

Untuk tutorial final, lakukan walkthrough target environment dan gunakan capture/schematic yang sesuai. Jika schematic, label “Ilustrasi alur”. Jangan mengubah CTA/badge screenshot menjadi sertifikasi independen QRIS/DOKU.

## Campaign C — Request API Pertama

**Audiens:** developer yang sudah punya akses. **Tujuan:** menuju first successful request. **Format:** empat slide. **CTA:** dokumentasi. **Status:** draft; nilai endpoint bersumber docs, request model belum dijalankan.

| Slide | Blueprint | Pesan utama | Isi |
|---|---|---|---|
| C1 | HERO_HOOK | Base URL-nya satu. | Highlight base URL; OpenAI/Anthropic-compatible sesuai dokumentasi |
| C2 | CODE_MOCKUP | Isi key dan pilih model. | `https://tokengateway.ai.id/v1`, model sesuai paket, key placeholder |
| C3 | CODE_MOCKUP | Kirim request pertama. | Contoh SDK kecil yang diverifikasi; tidak ada key nyata |
| C4 | HERO_HOOK | Cek akses kalau request ditolak. | Quota, model allowlist, auth; tautan bagian error docs |

Gate: `CODE_MOCKUP` tidak mengiklankan langkah SDK yang belum diuji sebagai sukses. Jika library kemudian membutuhkan variant SDK-example terpisah dari Cursor-setup, definisikan contract dan fixture-nya secara eksplisit; jangan memperluas payload menjadi free-form HTML.

## Campaign D — Pilih Pass atau Bundling

**Audiens:** calon pembeli yang membandingkan paket internal. **Tujuan:** membaca allowlist/validity sebelum memilih. **Status:** recommendation content; bukan perbandingan vendor eksternal.

Contoh yang bisa dibandingkan dari satu snapshot: entry GLM 50M / Rp10.000 / 7 hari versus All-Star Flash 100M / Rp24.000 / 10 hari dengan tiga model IDs. Ini pilihan berbeda; jangan menghitung “lebih hemat” dari harga/kuota saja karena model dan masa berlaku juga berbeda.

Urutan: hook → offer entry GLM → offer All-Star → periksa model/kuota/expiry → pricing CTA. Gunakan dua `PRICING_OFFER` terpisah. Schema `PROBLEM_COMPARISON` awal mengharuskan comparator fact; jangan memaksakan comparison paket internal ke contract harga eksternal tanpa perubahan schema yang teruji.

## Campaign E — `$20/bulan + CC` versus QRIS

**Status: HOLD, tidak siap tayang.** Blueprint tetap termasuk library desain, tetapi materi belum memiliki nama produk/plan pembanding, price source, billing interval dan card requirement yang terverifikasi. Kuota TokenGateway tidak setara otomatis dengan langganan aplikasi.

Untuk showcase bisa menggunakan label “DRAFT — comparator belum terverifikasi” di luar canvas final. Untuk publication, lengkapi fact record, qualification, sumber bertanggal dan copy review. Jangan mengubah `$20` menjadi angka IDR memakai kurs tebakan.

## Handoff konten ke implementasi

1. Resolve fakta dari package ID, bukan hardcoded campuran provider/harga.
2. Masukkan copy ke slot schema. `HERO_HOOK.highlight` harus match tepat sekali.
3. Tampilkan draft label untuk missing approved assets atau integration facts.
4. Uji format/profile, text overflow dan terms readability pada ponsel.
5. Export hanya setelah fact/asset/readiness gates lengkap; simpan evidence dan render report.

Tidak ada jadwal tayang atau publishing otomatis dalam file ini. Campaign A adalah pilot pertama; B/C menyusul setelah alur operasional yang dijelaskan benar-benar diuji.
