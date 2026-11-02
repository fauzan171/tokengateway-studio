# TokenGateway — Paket Brief untuk Creative Studio

Tanggal riset: **12 Oktober 2026**. Semua dokumen ini adalah brief dan patokan implementasi; aplikasi, design tokens JSON, komponen, dan desain final belum dibuat.

## Mulai dari sini

Tujuan studio: membuat konten TokenGateway yang mudah dikenali, jelas menawarkan paket yang benar, dan bisa dirender konsisten untuk Instagram carousel serta TikTok/Story. Gunakan logo yang diberikan pemilik sebagai acuan identitas. Bangun tampilan Swiss-tech yang rapi dengan biru, cyan, charcoal, tipografi tegas, serta komponen modular.

**Prioritas konten pertama:** GLM 5.3 Flash, **50 juta token**, **harga paket Rp10.000**, **berlaku 7 hari**, pembayaran QRIS. Harga paket dan biaya layanan checkout harus dibedakan. Referensi data: [katalog paket publik](https://tokengateway.ai.id/api/v1/catalog/packages).

## Urutan baca

| Dokumen | Yang diputuskan |
|---|---|
| [01_PRODUCT_BRIEF.md](01_PRODUCT_BRIEF.md) | Produk, audiens, positioning, alur pengguna, dan batas klaim |
| [02_PACKAGES_AND_FACTS.md](02_PACKAGES_AND_FACTS.md) | Snapshot seluruh paket, model ID, harga, kuota, masa berlaku, dan status bukti |
| [03_BRAND_GUIDELINES.md](03_BRAND_GUIDELINES.md) | Logo, warna, typography, gaya bahasa, dan aturan brand |
| [04_DESIGN_SYSTEM_BRIEF.md](04_DESIGN_SYSTEM_BRIEF.md) | Token architecture, komponen, layout, state, ukuran, serta kriteria penerimaan |
| [05_CONTENT_STRATEGY.md](05_CONTENT_STRATEGY.md) | Arah konten, pillar, prioritas eksperimen, CTA, dan pengukuran |
| [06_CAMPAIGN_BRIEFS.md](06_CAMPAIGN_BRIEFS.md) | Brief carousel dan adaptasi vertical, dengan copy awal yang bisa diisi ke slot |
| [07_BUILD_PROMPT.md](07_BUILD_PROMPT.md) | Indeks dua prompt build yang terpisah |
| [08_DASHBOARD_BUILD_PROMPT.md](08_DASHBOARD_BUILD_PROMPT.md) | Prompt pertama: web dashboard dan workflow campaign |
| [09_CONTENT_DESIGN_SYSTEM_PROMPT.md](09_CONTENT_DESIGN_SYSTEM_PROMPT.md) | Prompt kedua: patokan visual konten dan renderer blueprints |
| [sources/WEBSITE_RESEARCH.md](sources/WEBSITE_RESEARCH.md) | Cara riset, URL sumber, snapshot data, keterbatasan dan konflik sumber |
| [../EXECUTION_PLAN.md](../EXECUTION_PLAN.md) | Arsitektur teknis, roadmap, kontrak dan quality gates |

## Aturan sumber kebenaran

1. **Identitas:** logo yang disediakan pemilik dan aturan eksplisit pada percakapan.
2. **Produk dan paket:** fakta bertanggal di `02_PACKAGES_AND_FACTS.md`, ditelusuri ke snapshot riset publik. Refresh sumber sebelum publikasi karena harga/model bisa berubah.
3. **Visual:** `03_BRAND_GUIDELINES.md` dan `04_DESIGN_SYSTEM_BRIEF.md`. Nilai warna di sini adalah normalisasi desain yang diusulkan dari JPEG, bukan file brand master yang sudah ada.
4. **Teknis:** `EXECUTION_PLAN.md`. Catatan riset terbaru mengoreksi asumsi awal tentang top-up dan data yang sebelumnya belum ditemukan.
5. **Konten:** rekomendasi dan copy dalam `05`–`06` adalah materi kerja, bukan bukti fitur atau angka performa.

Jika sumber bertentangan, catat konflik, gunakan wording yang bisa dibuktikan, dan jangan diam-diam memilih klaim yang lebih menarik.

## Batas pekerjaan saat ini

Logo referensi telah disimpan sebagai [JPEG lokal](assets/tokengateway-logo-reference.jpeg). Belum ada SVG baru, pengubahan gambar, kode aplikasi, instalasi paket, transaksi pembayaran, login akun, atau publikasi konten. Riset website dilakukan read-only lewat HTML, bundle publik untuk menemukan sumber katalog, dan GET katalog publik; browser interaktif tidak tersedia pada sesi riset.

Urutan terbaru pemilik: jalankan `08_DASHBOARD_BUILD_PROMPT.md` terlebih dahulu untuk dashboard campaign/editor dengan draft renderer adapter. Sesudahnya jalankan `09_CONTENT_DESIGN_SYSTEM_PROMPT.md` untuk patokan visual konten, lima blueprints dan integrasi preview. UI dashboard dan artwork konten memakai scope token/CSS terpisah. Renderer batch lengkap mengikuti milestone teknis setelah keduanya siap.
