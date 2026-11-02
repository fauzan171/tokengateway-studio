# Brief Produk — TokenGateway

## Ringkasan

TokenGateway adalah gateway API AI dengan console untuk memilih paket, mendapatkan kuota token, membuat API key, serta menghubungkan aplikasi atau coding tools ke endpoint yang kompatibel dengan format OpenAI dan Anthropic. Base URL yang dipublikasikan adalah **`https://tokengateway.ai.id/v1`**. [Sumber: dokumentasi produk](https://tokengateway.ai.id/docs).

Paket publik menggunakan **kuota token, daftar model yang diizinkan, dan masa berlaku**. Rp10.000 pada snapshot riset adalah harga **Pass Kilat GLM 5.3 Flash 50M**, dengan 50.000.000 token dan masa berlaku 7 hari. Jangan mengubahnya menjadi klaim saldo tanpa batas waktu atau akses semua model. [Sumber: katalog paket](https://tokengateway.ai.id/api/v1/catalog/packages).

## Masalah yang ingin diselesaikan

Rekomendasi positioning untuk developer Indonesia yang ingin mulai mencoba API AI dari paket kecil, memakai QRIS, dan mempertahankan workflow coding yang sudah mereka gunakan. Friksi audiens berikut adalah hipotesis untuk konten, bukan hasil wawancara yang sudah dilakukan:

- Sulit menentukan paket awal dan model yang bisa diakses.
- Bingung membedakan kuota paket, context window, input/output token, dan masa berlaku.
- Perlu contoh base URL serta API key yang jelas untuk menghubungkan tool.
- Ingin cara pembayaran lokal dengan nilai awal yang terjangkau.
- Tidak ingin mencoba banyak endpoint berbeda hanya untuk berganti model yang tersedia.

## Audiens prioritas

| Audiens | Kebutuhan | Konten yang membantu |
|---|---|---|
| Developer mahasiswa/junior | Mulai dengan biaya paket kecil; memahami setup | Entry offer GLM, langkah pertama, istilah token |
| Freelancer/indie builder | Menguji workflow dan memilih paket | Demo request, paket coding, akses model |
| Pengguna Cursor/Cline/Roo Code | Menghubungkan editor ke gateway | Tutorial yang menyebut versi tool dan provider configuration |
| Builder aplikasi AI | Endpoint, autentikasi, streaming, troubleshooting | Contoh SDK, request pertama, membaca error |

Audiens utama untuk seri pertama: developer individu. Hindari menyiratkan SLA enterprise atau keandalan produksi kritis yang belum dibuktikan.

## Positioning yang diusulkan

**Kalimat utama:** “API AI buat workflow coding kamu. Pilih paket, bayar pakai QRIS.”

**Kalimat pendukung:** “Paket mulai Rp10.000. Kuota, model, dan masa berlaku jelas sebelum beli.”

**Pesan teknis:** “Satu base URL untuk request OpenAI-compatible dan Anthropic-compatible.”

Harga Rp10.000 harus disertai konteks paket GLM ketika ditampilkan bersama provider lain. “Tanpa kartu kredit” adalah mandat pemilik dari brief awal, dengan QRIS sebagai jalur pembayaran yang dipublikasikan. Riset ini belum menguji seluruh metode atau transaksi checkout.

## Pilar value proposition

| Pilar | Bukti produk | Cara mengatakannya |
|---|---|---|
| Awal yang terjangkau | Entry pass Rp10.000 / 50M / 7 hari | “Mulai dari paket GLM Rp10.000.” |
| Pembayaran lokal | Pricing menyebut QRIS DOKU | “Bayar paket pakai QRIS.” |
| Integrasi praktis | Docs mempublikasikan satu base URL dan dua format API | “Hubungkan aplikasi ke endpoint yang sama.” |
| Paket yang spesifik | Katalog memuat kuota, model IDs, validity | “Pilih akses model sesuai paket.” |
| Kendali penggunaan | Docs merujuk API keys, usage, saldo dan izin model | “Kelola key dan pantau penggunaan di console.” |

Ini tidak membuktikan “termurah”, “tercepat”, “unlimited”, “bebas gagal”, “semua fitur Cursor gratis”, atau “pengganti langganan editor”. Jangan memakai klaim itu.

## Alur pengguna yang perlu dijelaskan

1. Buka [halaman paket](https://tokengateway.ai.id/pricing).
2. Pilih paket dengan memperhatikan harga, kuota, model yang diizinkan, dan masa berlaku.
3. Login/daftar dan verifikasi email. Public UI mengharuskan email terverifikasi untuk pembelian.
4. Tinjau ringkasan pesanan, termasuk biaya layanan, lalu lanjutkan ke QRIS DOKU.
5. Setelah pembayaran berhasil, UI menyatakan paket aktif. Aktivasi aktual belum diuji dalam riset read-only ini.
6. Buat API key lewat console, pilih model sesuai izin paket/key, dan sambungkan aplikasi menggunakan base URL dokumentasi.
7. Cek respons pertama dan pantau penggunaan; gunakan request ID untuk troubleshooting sesuai dokumentasi.

Keberadaan login dan verifikasi email tidak boleh disembunyikan oleh copy “langsung pakai tanpa daftar”. Jika beberapa paket dibeli bersamaan, UI menyatakan semuanya aktif bersamaan setelah QRIS terbayar; jangan menjanjikan masa berlaku berurutan.

## Ruang lingkup integrasi

Dokumentasi TokenGateway membahas OpenAI SDK, Anthropic SDK, REST, streaming SSE, Claude Code, OpenCode, Codex, Cursor, Cline/Roo Code, dan 9router. Ini bukti bahwa integrasi didokumentasikan oleh gateway, bukan bukti bahwa setiap konfigurasi/version tool sudah dijalankan dalam riset ini. [Sumber: docs](https://tokengateway.ai.id/docs).

Konten pertama sebaiknya menggunakan request SDK sederhana dan nilai base URL yang jelas. Tutorial Cursor yang spesifik menu/provider memerlukan verifikasi di versi target sebelum dipublikasikan, karena petunjuk publik menyebut konfigurasi Anthropic API Key dan Override Base URL. Jangan otomatis menggantinya dengan langkah OpenAI yang diasumsikan.

## CTA dan tujuan konversi

- Awareness: “Lihat paket di tokengateway.ai.id/pricing.”
- Education: “Baca cara setup di tokengateway.ai.id/docs.”
- Purchase intent: “Cek paket GLM 50M dan rincian checkout.”
- Activation: “Kirim request pertama dengan model sesuai paketmu.”

Gunakan satu CTA utama per konten. Target pengukuran yang diusulkan: kunjungan pricing/docs, signup dan verifikasi email, checkout yang dimulai, pembayaran berhasil, API key pertama, request pertama yang sukses. Instrumentasi dan baseline belum diperiksa; jangan menulis persentase konversi seolah sudah tersedia.

## Pertanyaan operasional yang masih pending

Definisi penghitungan `grant_tokens` terhadap input/output/cached/reasoning; pooling kuota bundling; waktu mulai masa berlaku yang ditegakkan backend; perilaku sisa kuota saat expiry; refund; hasil pembayaran/aktivasi aktual; versi integrasi editor yang diuji; identitas upstream model. Gunakan hanya informasi yang ada sambil menunggu klarifikasi atau bukti operasional.
