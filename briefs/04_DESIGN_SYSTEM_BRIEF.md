# Brief Design System — Fondasi Creative Studio TokenGateway

## Apa yang akan dibangun

**Urutan terbaru pemilik: web dashboard lebih dahulu; content design system dibangun pada sesi terpisah setelahnya.** Dokumen ini menetapkan bahasa visual artwork dan showcase, bukan scope implementasi dashboard awal. Gunakan [prompt dashboard](08_DASHBOARD_BUILD_PROMPT.md) untuk workflow dan [prompt content design system](09_CONTENT_DESIGN_SYSTEM_PROMPT.md) untuk sistem visual.

| Tahap | Produk hasil build | Yang bisa digunakan |
|---|---|---|
| A — Dashboard MVP terlebih dahulu | Campaign CRUD, editor, local persistence, JSON IO, draft preview adapter | Mengelola campaign sebelum artwork final tersedia |
| B — Content design system | Token, font, aset, primitives, showcase, lima blueprints | Patokan generator dan implementasi preview artwork |
| C — Integrasi production capture | Real renderer terhubung ke dashboard, batch PNG pipeline | Membuat batch konten dari campaign manifest |

Dashboard customer untuk saldo, API keys, usage, atau pembayaran merupakan fungsi website TokenGateway yang sudah ada. Brief ini memanfaatkan fakta produknya; scope build berikutnya adalah alat desain konten. Shell studio boleh terlihat seperti workspace, tetapi tidak perlu membuat ulang customer console.

## Design north star

“Developer tool yang jelas dan rapi, dengan identitas circuit-node biru/cyan.” Pengguna harus bisa memahami headline, paket, model, dan CTA dalam satu pandangan. Detail teknis muncul hanya ketika membantu setup atau pilihan paket.

Contoh visual internal yang harus disediakan: brand/typography sheet; component sheet; HERO 4:5; HERO 9:16; long-copy error; CTA/price specimen; approved asset sheet. Jangan menyamakan JPEG logo dengan keseluruhan komposisi—logo memberikan identitas, sedangkan slide tetap memakai grid dan typography.

## Token architecture

Gunakan **primitive → semantic → component**, dengan satu source of truth di `src/design/tokens.json` saat implementasi. CSS variables dihasilkan dari sumber ini; komponen tidak mengambil raw color atau spacing dari payload campaign.

| Layer | Contoh | Tanggung jawab |
|---|---|---|
| Primitive | `brand.blue`, `brand.cyan`, `neutral.charcoal`, `space.24` | Nilai dasar dari brand guidelines |
| Semantic | `canvas.background`, `text.primary`, `text.secondary`, `accent.highlight`, `action.primary.background` | Maksud penggunaan |
| Component | `hero.title.size`, `offer.price.size`, `modelCard.padding`, `editor.focusRing` | Aturan spesifik komponen |

Semantic mapping awal:

| Role | Mapping |
|---|---|
| `canvas.background` | charcoal `#181D23` |
| `surface.card` | surface `#202832` |
| `border.default` | line `#344250` |
| `text.primary` | text `#F4F7FA` |
| `text.secondary` | muted `#AEBBC8` |
| `accent.highlight` | cyan `#16DDE2` |
| `accent.brand` | blue `#0066FF` |
| `action.primary.background` | cyan |
| `action.primary.text` | charcoal |
| `state.selected.indicator` | blue; selalu ada label/shape tambahan |
| `focus.ring` | cyan, 2px dengan offset |

Palet menggantikan nilai awal provisional pada master plan dengan karakter dari logo pemilik. Font, dimensi, serta minimum safe insets master plan tetap berlaku.

## Spacing, border, dan komposisi

Canvas memakai step 8px dengan nilai 8, 16, 24, 32, 40, 48, 64, 80; 12px boleh untuk detail kecil. Card 24–40px padding; gap konten 24–48px; header/footer punya region tersendiri. Border 1–2px; radius utama 16px, kecil 8px; tag capsule boleh rounded penuh. Pilih satu grid dan baseline konsisten per blueprint.

Posisi critical edges menggunakan integer CSS pixels. Ruang kosong di vertical diperluas melalui layout, bukan memperbesar semua elemen feed dengan transform. Background memenuhi canvas, content tunduk safe profile. Jangan menambah drop shadow/blurring sebagai pengganti contrast atau hierarchy.

## Typography: canvas dan UI terpisah

| Role canvas 1080px | Typeface | Preferred | Minimum / batas |
|---|---|---:|---|
| HERO headline | Plus Jakarta Sans 700/800 | 96–112px | 64px; maksimum 4 baris |
| Section title | Plus Jakarta Sans 700 | 64–80px | 48px; maksimum 3 baris |
| Body/subline | Plus Jakarta Sans 400/500 | 32–38px | 28px |
| Price | Plus Jakarta Sans 700/800 | 96–112px | 64px |
| Quota | JetBrains Mono 500/600 | 48–64px | 40px |
| Code/base URL | JetBrains Mono 400/500 | 28–32px | 24px; seluruh endpoint terlihat |
| CTA | Plus Jakarta Sans 600/700 | 32–36px | 28px |
| Terms note | Plus Jakarta Sans 400/500 | 26–28px | 24px; bukan text samar |
| Header/category | Plus Jakarta Sans 600 | 28–32px | 24px |

Line height: headline 1.08–1.16; body 1.4–1.5; code 1.45. Default letter spacing netral; headline boleh -0.02em bila glyph tetap baik. Heading/tag tidak harus uppercase. Satu kata/phrase penting ditandai cyan, bukan seluruh judul.

Studio UI: body 14–16px, section heading 20–24px, field label 12–14px, mono editor 13–14px. Form tetap terbaca saat stage zoom kecil. UI font dan canvas font sama-sama local-loaded tetapi ukurannya tidak saling mengikuti.

## Format dan safe profiles

| Profile | Canvas CSS | Insets L/T/R/B | Safe content | Export DPR 2 |
|---|---|---|---|---|
| IG carousel | 1080 × 1350 | 80/80/80/80 | 920 × 1190 | 2160 × 2700 |
| IG Story | 1080 × 1920 | 80/140/80/160 | 920 × 1620 | 2160 × 3840 |
| TikTok conservative | 1080 × 1920 | 80/140/180/420 | 820 × 1360 | 2160 × 3840 |

TikTok insets tambahan adalah rekomendasi proyek untuk action rail/caption. Cocokkan dengan target-device overlay saat publikasi. Top 140/bottom 160 tetap merupakan minimum brief, bukan jaminan seluruh UI platform. Guides hanya preview dan tidak masuk PNG.

## Komponen fondasi

| Komponen | Isi dan aturan | State / varian |
|---|---|---|
| `BrandLockup` | Approved mark + teks TokenGateway; clear space | header, footer, spotlight |
| `Headline` | Plain text, optional exact highlight substring | default, measured-fit, overflow |
| `CategoryTag` | Label singkat; tidak berupa dekorasi kosong | outline, subtle |
| `ModelCard` | Official provider mark, nama, description | normal, unavailable draft |
| `PriceBlock` | Integer IDR; label “harga paket” | package-price, draft-missing-fact |
| `QuotaBlock` | Nilai kuota + token unit; validity terpisah | compact, expanded |
| `QRISBadge` | Official word badge, approved contrast plaque | standard; missing asset blocks export |
| `CodeWindow` | Mac-style header, mono code; secret placeholder | setup-summary, request-example |
| `CTAFooter` | Satu aksi + domain/path; terms slot | pricing, docs |
| `ComparisonPanel` | Dua kolom dengan row alignment | verified-comparison, labelled draft |

Logo TokenGateway mengacu file pemilik. GLM Z, DeepSeek whale, Gemini sparkle, dan QRIS tetap memerlukan approved vector. Missing official asset boleh dilabeli sebagai draft di showcase; tidak boleh diganti icon generik lalu dianggap final.

## Lima layout: tujuan desain

| Blueprint | Fokus | Struktur |
|---|---|---|
| `HERO_HOOK` | Satu pesan yang menarik perhatian | category → title/highlight → subline → footer |
| `PROBLEM_COMPARISON` | Perbandingan yang punya sumber | title → dua kolom → qualification → footer |
| `MODEL_CATALOG` | Pilihan provider yang tersedia menurut paket | title → tiga model cards → access note |
| `CODE_MOCKUP` | Nilai setup yang nyata | title → IDE card → caption → docs CTA |
| `PRICING_OFFER` | Model + kuota + harga + masa berlaku | offer title → quota/price → QRIS → terms → CTA |

Definisi props, character/line limits, serta bounded fitting mengikuti Chapter 2 [master plan](../EXECUTION_PLAN.md). Untuk content awal, `PROBLEM_COMPARISON` dengan `$20/month` tetap draft sampai bukti comparator lengkap. Library boleh disiapkan tanpa menjadikannya konten tayang.

## Aturan offer dari data produk

Tampilan pricing minimum menyertakan **nama/model paket, grant token, harga paket, masa berlaku, akses model, QRIS, CTA, serta catatan biaya layanan**. Jangan menempatkan validity/fee jauh dari nominal sehingga terlihat seperti hidden disclaimer.

Contoh specimen: label “GLM 5.3 Flash”, quota “50 juta token”, nominal “Rp10.000”, label “Harga paket”, metadata “Berlaku 7 hari”, terms “Belum termasuk biaya layanan checkout”, CTA “Lihat paket GLM”. Semua angka berasal dari satu package ID, bukan gabungan nilai termurah beberapa paket.

## Auto-fit dan error states

Muat font/asset → layout di native size → ukur slot → wrap → kurangi gap hingga batas → kurangi size hingga minimum → validasi seluruh bounds. Gagal fit menghasilkan `TEXT_OVERFLOW`, bukan clipping/ellipsis. Preview menandai slot error dan menahan export. Zoom berlaku pada wrapper preview, tidak pada canvas render.

Error harus mengidentifikasi slide, format/profile, JSON path/slot, penyebab dan tindakan perbaikan. Empty optional slot melakukan reflow terdefinisi. Required price, asset, API fact dan logo tidak mendapat dummy value yang lolos final export.

## State komponen interaktif studio

| Kontrol | Default | Hover/focus | Selected/active | Disabled/error |
|---|---|---|---|---|
| Primary action | Cyan bg, charcoal label | Visible border/focus ring | Label/status jelas | Reason text, tidak sekadar opacity |
| Secondary action | Surface + outline | Border/focus cyan | Surface terpilih | Tetap terbaca |
| Text/JSON editor | Label + helper, mono raw JSON | Focus ring; no layout jump | Valid revision tercatat | Field/path error; draft tetap bisa diedit |
| Format switch | Dua pilihan berlabel rasio | Keyboard focus | Indicator + label | Reason bila belum siap |
| Slide item | Nomor + nama/layout | Focus/hover outline | Border biru + selected label | Status draft/error ikon + teks |

Focus-visible wajib, keyboard navigation berurutan, controls HTML semantik, status disampaikan lewat teks. Touch target proyek minimal 44 × 44px untuk kontrol utama; ini pilihan ergonomi proyek, bukan pernyataan angka minimum universal. [Referensi target size W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Contrast dan pemeriksaan visual

Target minimal 4.5:1 untuk normal text dan 3:1 untuk large text sesuai [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Rasio perkiraan yang dihitung untuk warna solid awal: primary text/charcoal 15.77:1, muted/surface 7.61:1, cyan/charcoal 10.07:1. Uji ulang computed colors/state saat implementasi; transparansi dan perubahan warna hover bisa mengubah rasio. Ratio tidak menggantikan phone-size reading check.

## Showcase yang harus diserahkan pada build content design system

1. Identitas mark/wordmark serta palet dengan semantic role.
2. Typography dengan contoh copy bahasa Indonesia, kuota dan endpoint.
3. Komponen fondasi berikut state dan missing-resource treatment.
4. HERO dengan toggle feed/vertical, Story/TikTok safe guides, dan zoom.
5. Data specimen pricing menggunakan fact snapshot, terlihat jelas sebagai showcase data.
6. Long-copy fixture yang benar-benar gagal dengan error terbaca.

Showcase adalah web page untuk memeriksa content design system. Campaign editing menggunakan dashboard MVP yang sudah dibangun; real blueprints dipasang melalui renderer adapter yang sama. Batch capture lengkap menyusul integrasi.

## Definition of done fondasi content design system

- Token source dan generated CSS konsisten; warna hanya melalui role tokens.
- Bentuk logo mengikuti referensi; master vector tidak berisi raster wrapper. Asset provider yang pending terlihat sebagai pending.
- Font asli dimuat lokal; no synthetic weights; readiness tidak memakai fixed sleep.
- HERO terbaca dan aman pada kedua ukuran dan safe profiles; tidak ada transform pada native render canvas.
- Preview controls bisa dioperasikan dengan keyboard, state error jelas, dan tidak mengganti content data tanpa pemberitahuan.
- Production build/typecheck dan focused geometry/readiness checks lulus; tidak mengklaim renderer batch selesai jika baru proof capture.
- Hasilnya bisa dijalankan lokal dengan instruksi singkat; no deployment diperlukan untuk review fondasi.
