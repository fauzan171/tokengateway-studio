# Paket dan Fakta Produk — Snapshot 12 Oktober 2026

## Cara membaca status

**PUBLIC** berarti ditemukan pada sumber publik TokenGateway; bukan transaksi atau request model yang sudah diuji. **OWNER** berarti mandat pemilik pada percakapan. **PENDING** berarti belum dibuktikan atau ada konflik. Harga dan katalog di bawah harus diperiksa ulang sebelum publikasi.

Sumber paket: [GET katalog paket](https://tokengateway.ai.id/api/v1/catalog/packages). Sumber model: [GET katalog model](https://tokengateway.ai.id/api/v1/catalog/models). Keduanya diakses tanpa login dan mengembalikan HTTP 200. Data snapshot beserta hash ada di [WEBSITE_RESEARCH.md](sources/WEBSITE_RESEARCH.md).

## Offer prioritas

| Field | Nilai snapshot |
|---|---|
| Nama | Pass Kilat GLM 5.3 Flash 50M |
| Package ID | `pass-glm-5.3-flash-50m` |
| Version | 1 |
| Harga paket | **Rp10.000** |
| Kuota tercantum | **50.000.000 token** |
| Masa berlaku tercantum | **7 hari** |
| Model ID | `glm-5.3-flash` |
| Bentuk produk | Paket kuota dengan model dan masa berlaku; bukan klaim wallet credit universal |
| Pembayaran | Pricing mempublikasikan QRIS DOKU; transaksi tidak dijalankan |

Copy ringkas yang disarankan: **“GLM 5.3 Flash. 50 juta token. Harga paket Rp10.000. Berlaku 7 hari.”**

Jangan mengganti nama model dalam offer ini menjadi DeepSeek/Gemini. Jika provider lain tampil pada slide yang sama, jelaskan bahwa harga dan aksesnya mengikuti paket masing-masing.

## Harga paket dan total bayar

Bundle publik yang digunakan halaman pricing memberi label biaya layanan **0,8%** dan rumus `ceil(subtotal × 0.008)`; total UI adalah subtotal + biaya layanan. Untuk satu paket Rp10.000, simulasi rumus UI menghasilkan Rp80 biaya dan Rp10.080 total. **Ini simulasi UI yang dipublikasikan, bukan invoice checkout yang sudah diverifikasi.**

Pada creative offer, tampilkan “harga paket” dekat nominal dan catatan **“Belum termasuk biaya layanan checkout.”** Tutorial checkout boleh menjelaskan rincian biaya mengikuti ringkasan pesanan. Jangan menulis “total bayar Rp10.000”, “tanpa biaya tambahan”, atau memperlakukan label biaya layanan sebagai penjelasan hukum/regulasi QRIS. [Sumber halaman pricing](https://tokengateway.ai.id/pricing); bundle yang diperiksa direkam pada catatan riset.

## Katalog lengkap

Grant token berasal dari field `grant_tokens`; price dan validity berasal dari `terms`. Bundling mencantumkan beberapa model, tetapi kebijakan pembagian/pooling kuota belum diperiksa. Label kategori `single` berasal dari katalog dan tidak boleh ditafsirkan otomatis sebagai tepat satu model ID.

| Nama paket | Harga paket | Kuota token | Berlaku | Kategori | Model IDs | Package ID / versi |
|---|---:|---:|---:|---|---|---|
| Paket Kilat All-Star Flash | Rp24.000 | 100.000.000 | 10 hari | bundling / bundling | `deepseek-v4.1-flash`, `glm-5.3-flash`, `qwen3.8-flash` | `pkg-allstar-flash-100m` / v2 |
| Paket Super Flash | Rp39.000 | 300.000.000 | 14 hari | bundling / bundling | `deepseek-v4.1-flash`, `glm-5.3-flash`, `qwen3.8-flash` | `pkg-super-flash-300m` / v1 |
| Paket Coder & Architect | Rp35.000 | 50.000.000 | 14 hari | bundling / bundling | `deepseek-v4-pro`, `qwen3-coder`, `qwen3.8-flash` | `pkg-coder-architect-50m` / v1 |
| Paket Deep Reasoning | Rp39.000 | 40.000.000 | 14 hari | bundling / bundling | `deepseek-v4-pro`, `glm-5.3` | `pkg-deep-reasoning-40m` / v1 |
| Pass Kilat GLM 5.3 Flash 50M | Rp10.000 | 50.000.000 | 7 hari | pass / single | `glm-5.3-flash` | `pass-glm-5.3-flash-50m` / v1 |
| Pass DeepSeek Flash 150M | Rp22.000 | 150.000.000 | 10 hari | pass / single | `deepseek-v4-flash`, `deepseek-v4.1-flash` | `pass-deepseek-flash-150m` / v1 |
| Pass GLM 5.3 Flash 120M | Rp22.000 | 120.000.000 | 10 hari | pass / single | `glm-5.3-flash` | `pass-glm-5.3-flash-120m` / v1 |
| Pass Titan Flash 1 Miliar | Rp95.000 | 1.000.000.000 | 30 hari | pass / single | `deepseek-v4.1-flash` | `pass-titan-flash-1b` / v1 |
| Pass Gemini 3.8 Flash 50M | Rp27.000 | 50.000.000 | 10 hari | pass / single | `gemini-3.8-flash` | `pass-gemini-3.8-flash-50m` / v2 |
| Pass Gemini 3.7 Flash 60M | Rp25.000 | 60.000.000 | 10 hari | pass / single | `gemini-3.7-flash` | `pass-gemini-3.7-flash-60m` / v1 |
| Pass GLM 5.2 Fast 60M | Rp24.000 | 60.000.000 | 10 hari | pass / single | `glm-5.2` | `pass-glm-5.2-60m` / v1 |
| Pass Qwen 3 Coder 60M | Rp25.000 | 60.000.000 | 14 hari | pass / single | `qwen3-coder` | `pass-qwen3-coder-60m` / v1 |
| Pass DeepSeek V4 Pro 65M | Rp32.000 | 65.000.000 | 14 hari | pass / single | `deepseek-v4-pro` | `pass-deepseek-v4-pro-65m` / v1 |
| Pass GLM 5.3 Reasoning 40M | Rp32.000 | 40.000.000 | 14 hari | pass / single | `glm-5.3` | `pass-glm-5.3-40m` / v1 |
| Pass GPT-6 Luna 60M | Rp22.000 | 60.000.000 | 10 hari | pass / single | `gpt-6-luna` | `pass-gpt-6-luna-60m` / v1 |
| Paket Generasi GPT-6 Frontier 20M | Rp69.000 | 20.000.000 | 14 hari | bundling / bundling | `gpt-6-astra`, `gpt-6-luna`, `gpt-6-sol`, `gpt-6.1-sol` | `pkg-gpt6-frontier-20m` / v1 |
| Paket Generasi GPT-6 Frontier 30M | Rp129.000 | 30.000.000 | 21 hari | bundling / bundling | `gpt-6-astra`, `gpt-6-luna`, `gpt-6-sol`, `gpt-6.1-sol` | `pkg-gpt6-frontier-30m` / v1 |
| Pass GPT-6 Sol 50M | Rp35.000 | 50.000.000 | 14 hari | pass / single | `gpt-6-sol` | `pass-gpt-6-sol-50m` / v2 |
| Pass Kimi K3 Flagship 50M | Rp29.000 | 50.000.000 | 10 hari | pass / single | `kimi-k3` | `pass-kimi-k3-50m` / v2 |
| Pass GPT-6.1 Sol Flagship 25M | Rp49.000 | 25.000.000 | 14 hari | pass / single | `gpt-6.1-sol` | `pass-gpt-6.1-sol-25m` / v1 |
| Pass GPT-6 Astra Flagship 15M | Rp65.000 | 15.000.000 | 14 hari | pass / single | `gpt-6-astra` | `pass-gpt-6-astra-15m` / v1 |

## Katalog model yang dipublikasikan

Terdapat 18 model pada snapshot publik. Nama dan ID berikut adalah label **gateway**. UI model sendiri menyatakan identitas/versi produsen belum seluruhnya terverifikasi independen dan batas efektif berasal dari katalog layanan. Jangan menyatakan akses resmi/kemitraan produsen, benchmark, atau spesifikasi universal berdasarkan label ini saja.

Semua field `price` pada snapshot model bernilai `null`; UI menjelaskan pembelian melalui paket, bukan tarif per-token. Jangan menghitung atau mengiklankan tarif input/output per 1 juta token yang tidak dipublikasikan.

| Nama publik | Model ID | Tercantum pada paket publik | Tags katalog |
|---|---|---|---|
| DeepSeek V4 Flash | `deepseek-v4-flash` | Ya | Reasoning, Coding, Tools |
| DeepSeek V4 Pro | `deepseek-v4-pro` | Ya | Reasoning, Coding, Tools |
| DeepSeek V4.1 Flash | `deepseek-v4.1-flash` | Ya | Vision, Reasoning, Coding, Tools |
| Google Gemini 3.7 Flash | `gemini-3.7-flash` | Ya | Vision, Reasoning, Tools |
| Google Gemini 3.8 Flash | `gemini-3.8-flash` | Ya | Vision, Reasoning, Coding, Tools |
| GLM 5.2 Fast | `glm-5.2` | Ya | Tools |
| GLM 5.3 | `glm-5.3` | Ya | Reasoning, Coding, Tools |
| GLM 5.3 Flash | `glm-5.3-flash` | Ya | Vision, Reasoning, Coding, Tools |
| GPT-5.4 Mini Fast | `gpt-5.4-mini` | Belum pada snapshot paket | Vision, Reasoning, Coding, Tools |
| OpenAI GPT-6 Astra | `gpt-6-astra` | Ya | Vision, Reasoning, Coding, Tools |
| OpenAI GPT-6 Luna | `gpt-6-luna` | Ya | Vision, Reasoning, Coding, Tools |
| OpenAI GPT-6 Sol | `gpt-6-sol` | Ya | Vision, Reasoning, Coding, Tools |
| OpenAI GPT-6.1 Sol | `gpt-6.1-sol` | Ya | Vision, Reasoning, Coding, Tools |
| Kimi K2.7 Code | `kimi-k2.7-code` | Belum pada snapshot paket | Vision, Reasoning, Coding, Tools |
| Kimi K3 | `kimi-k3` | Ya | Vision, Reasoning, Tools |
| Qwen 3.8 Max Flagship | `qwen-3-8-max` | Belum pada snapshot paket | Reasoning, Coding, Tools |
| Qwen 3 Coder 480B | `qwen3-coder` | Ya | Coding, Tools |
| Qwen 3.8 Flash | `qwen3.8-flash` | Ya | Vision, Reasoning, Coding, Tools |

Katalog publik tidak menjamin semua model dapat dipanggil oleh satu akun. Dokumentasi menyatakan izin mengikuti akun, paket aktif, dan API key. `GET /v1/models` dengan kredensial sendiri adalah sumber akses akun; endpoint itu tidak dipanggil dalam riset tanpa kredensial ini.

## Register klaim untuk konten

| ID fakta | Klaim | Status dan sumber | Penggunaan |
|---|---|---|---|
| F01 | Base URL `https://tokengateway.ai.id/v1` | PUBLIC / docs | Aman sebagai nilai dokumentasi; bukan uptime guarantee |
| F02 | Harga entry GLM Rp10.000 / 50M / 7 hari | PUBLIC / paket | Tampilkan bersama model, masa berlaku dan note biaya |
| F03 | Pembayaran QRIS DOKU | PUBLIC / pricing | Bisa dijadikan CTA metode pembayaran; transaksi aktual pending |
| F04 | Tanpa kartu kredit | OWNER / brief awal; jalur QRIS publik tersedia | Gunakan untuk jalur QRIS, bukan audit seluruh payment provider |
| F05 | OpenAI-compatible dan Anthropic-compatible endpoints | PUBLIC / docs | Jelaskan kompatibilitas format; tidak menjamin seluruh tool/fitur |
| F06 | Akses model mengikuti paket/key | PUBLIC / docs | Cantumkan pada catalog dan troubleshooting |
| F07 | Email verification sebelum membeli | PUBLIC / pricing UI | Wajib ada pada tutorial pembelian |
| F08 | Biaya layanan UI 0,8%, pembulatan ke atas | PUBLIC / pricing client bundle | Note harga dan contoh UI; final invoice pending |
| F09 | Paket aktif bersamaan setelah QRIS terbayar | PUBLIC / pricing wording | Klaim situs; hasil transaksi dan waktu aktivasi pending |
| F10 | Streaming SSE didokumentasikan | PUBLIC / docs | Konten edukasi; demo operasional belum dilakukan |
| F11 | GLM, DeepSeek, Gemini tercantum dalam katalog dan paket | PUBLIC / katalog | Nama/provider sesuai katalog; tidak menyiratkan satu harga untuk semua |
| F12 | API keys dan usage tersedia sebagai bagian console | PUBLIC / docs dan public UI source | Jelaskan workflow; tidak memakai angka usage/dashboard palsu |
| F13 | Menu spesifik Cursor dan client-version compatibility | PUBLIC petunjuk docs, operasional PENDING | Tutorial step-by-step perlu uji versi target |
| F14 | Voucher/traktir teman | PUBLIC UI source | Kandidat konten tahap lanjut; delivery/receipt pending |

## Konflik dan detail yang tidak boleh ditebak

- Source home-client masih memuat teks “Pembayaran belum tersedia” sementara pricing memuat checkout QRIS DOKU. Itu konflik copy antar source; belum diketahui cabang runtime mana yang sedang tampil. Untuk brief pembayaran gunakan pricing yang relevan, atribusikan sebagai informasi publik, dan jangan menjanjikan semua status runtime sudah diuji.
- Docs mengidentifikasi prefix virtual key `tk-gw-*`, tetapi sebagian contoh Claude Code memakai `sk-gw-...`. Gunakan placeholder `YOUR_TOKEN_GATEWAY_KEY` pada creative; jangan memvalidasi atau mengiklankan prefix lain sebelum klarifikasi.
- Docs merujuk Claude Code dan contoh Claude, sedangkan komponen publik menyebut Claude segera tersedia dan snapshot model/paket tidak berisi Claude. **Jangan jadikan Claude sebagai model yang tersedia sekarang dalam iklan katalog.** Protokol Anthropic-compatible tidak berarti paket Claude tersedia.
- `grant_tokens` belum menjelaskan penghitungan input, output, cached, dan reasoning token. Tidak boleh dikonversi menjadi “berapa prompt”, “berapa baris kode”, atau “berapa hari pasti cukup”.
- Masa berlaku memiliki angka pada katalog; perilaku rollover, stacking, refund, transfer, dan expiry kuota belum diverifikasi. Tidak boleh dijanjikan “tidak hangus”.
- Comparator `$20/month + kartu kredit` belum disertai produk/plan dan bukti terkini. Blueprint comparison tetap disiapkan untuk design testing dengan draft label, tetapi tidak menjadi materi publik siap tayang.
- Nama versi gateway tidak menjadi sertifikat bahwa upstream identik dengan model vendor tertentu. Prioritaskan konten manfaat workflow dan paket yang jelas daripada klaim kualitas model.

## Refresh sebelum publish

Ambil ulang dua endpoint katalog publik, cocokkan `package_id`, versi, model IDs, harga, grant, validity, serta note biaya pada pricing. Jika berubah, update dokumen ini dan copy terkait; simpan snapshot dan tanggal. Jika endpoint gagal atau paket hilang, tahan konten offer tersebut. Tidak perlu membeli paket hanya untuk refresh katalog.
