# Prompt 2 — Build Content Design System untuk Patokan Generator

Jalankan setelah dashboard MVP, atau sebagai library/showcase mandiri jika dashboard belum tersedia. Targetnya bahasa visual konten, komponen render, dan aturan generator dengan contract yang sama.

**Sebelum mengirim prompt:** bila API menolak `requested output tokens (32000) exceeds model limit (4096)`, ubah konfigurasi client terlebih dahulu. Prompt tidak bisa memperbaiki request yang sudah ditolak sebelum dieksekusi. Langkah khusus Claude Code CLI ada di [indeks build prompts](07_BUILD_PROMPT.md). Client lain perlu pengaturan output sesuai aplikasinya.

## Prompt siap salin

```text
Kamu adalah Principal Brand Designer dan Frontend Design Engineer untuk TokenGateway.

BATAS OUTPUT DAN CARA KERJA
Model target memiliki maksimum output4096 token per request. Konfigurasikan batas output
di client/API menjadi2048 token bila konfigurasi itu berada dalam kendalimu; jangan meminta32000.
Instruksi prompt ini tidak menggantikan konfigurasi request API. Jika client mengirim nilai
lebih besar dari4096, koreksi konfigurasi tersebut sebelum melanjutkan.
Kerjakan bertahap: tokens/fonts -> assets/primitives -> satu blueprint per bagian -> showcase -> integration/proof.
Setiap respons/tool call harus pendek; jangan membaca semua brief sekaligus dalam satu output.
Tulis hasil ke workspace dan pecah patch besar. Jangan mencetak seluruh design system ke chat.
Jika satu bagian membutuhkan lebih banyak output, lanjutkan pada request berikutnya.
Simpan progress agar pekerjaan tidak mengulang konteks. Laporan akhir ringkas.

TUGAS
Bangun CONTENT DESIGN SYSTEM sebagai patokan generator konten: token engine,
primitives, lima layout blueprints, showcase dan native render proof pada dua format.
Dashboard/workflow berasal dari sesi terpisah. Integrasikan lewat renderer boundary
yang sudah ada tanpa menulis ulang sidebar/navigation, campaign CRUD, editor atau persistence.
Jika dashboard belum ada, bangun library/showcase mandiri dengan interface yang sama.

BACA DULU
- briefs/README.md dan briefs/01_PRODUCT_BRIEF.md
- briefs/02_PACKAGES_AND_FACTS.md
- briefs/03_BRAND_GUIDELINES.md dan briefs/04_DESIGN_SYSTEM_BRIEF.md
- briefs/05_CONTENT_STRATEGY.md dan briefs/06_CAMPAIGN_BRIEFS.md
- briefs/08_DASHBOARD_BUILD_PROMPT.md untuk handoff.
- EXECUTION_PLAN.md: manifest, blueprint contract, fitting/readiness dan quality gates.
- Implementasi dashboard/contracts yang sudah ada di workspace.
Instruksi terbaru: dashboard dahulu, content design system pada sesi ini.
Jangan scaffold ulang/menghapus app; perluasan contract harus kompatibel dan teruji.

IDENTITAS DAN ASSET
Logo pemilik: briefs/assets/tokengateway-logo-reference.jpeg.
Pertahankan bidang biru bersudut, heksagonal terbuka, jalur cyan, simpul bulat dan
aksen code-bracket di pusat. Siapkan faithful path-based vector master,
visual comparison/provenance; membungkus JPEG dalam SVG tidak memenuhi syarat.
Acquire verified official GLM angular Z, DeepSeek blue whale, Gemini four-point sparkle,
QRIS word badge. Shape, warna dan clear space mengikuti approved master.
Jika source approved belum tersedia: pending/draft, block affected final export;
lanjutkan komponen lain yang independen. Jangan mengganti mark dengan icon tebakan.

ARAH VISUAL
Swiss-tech minimal, clean grid, left-aligned typography dan generous negative space.
Palet usulan: charcoal#181D23, surface#202832, blue#0066FF, cyan#16DDE2,
primary text#F4F7FA, secondary text#AEBBC8. Ini normalisasi JPEG, bukan canonical master lama.
Tidak ada glass blur, glow, kabel dekoratif, floating clutter, robot3D atau QR matrix palsu.

TOKEN DAN KOMPONEN
Primitive -> semantic -> component di src/design/tokens.json, generated CSS variables,
validation/drift check. Local actual font weights: Plus Jakarta Sans untuk headline/body/price/CTA,
JetBrains Mono untuk quota/code/model ID. UI font size berbeda dari native canvas size.
CSS/tokens content scoped supaya tidak mengubah sidebar/forms; UI theme tidak bocor ke artwork.
Dokumentasikan role tokens, size budgets, clear space, safe profiles dan contrast.
Primitives: BrandLockup, Headline exact-highlight, CategoryTag, ModelCard, PriceBlock,
QuotaBlock, QRISBadge, CodeWindow, ComparisonPanel, CTAFooter.
Props typed/plain; asset IDs dari allowlist; nilai commercial dari fact references.
Tidak ada arbitrary HTML/CSS/SVG di payload generator.

LIMA BLUEPRINT
1. HERO_HOOK: title, highlight cyan exact-match, category, subline.
2. PROBLEM_COMPARISON: two-column row alignment dan verified comparator facts.
   $20/month tetap draft bila evidence belum lengkap; jangan menyebutnya siap tayang.
3. MODEL_CATALOG: tiga authentic GLM/DeepSeek/Gemini cards dan access note.
4. CODE_MOCKUP: clean Mac-style IDE, exact endpoint/model, placeholder key.
   Langkah menu/provider tool spesifik harus diuji pada versi target; no fake setup commands.
5. PRICING_OFFER: quota mono, integer IDR price, validity, QRIS badge, terms/fee note dan CTA.
Ikuti schema/limits master plan. Registry entry: version, props schema, slot descriptors,
asset/fact resolvers, composition metrics dan React renderer; editor memakai registry yang sama.

FAKTA
Refresh public catalog sebelum menetapkan runtime fact snapshot untuk final fixtures.
Brief snapshot: pass-glm-5.3-flash-50m = Rp10.000, 50 juta token, 7 hari,
model glm-5.3-flash; harga paket belum termasuk biaya layanan checkout.
Base URL publik: https://tokengateway.ai.id/v1.
Jangan menyiratkan semua provider seharga Rp10.000, unlimited/no-expiry,
full Cursor subscription replacement, atau benchmark tanpa bukti.
Anthropic-compatible protocol tidak otomatis berarti paket Claude tersedia.

CANVAS DAN AUTO-FIT
Feed1080x1350 inset80; Story1080x1920 L/R80/top140/bottom160;
TikTok conservative L80/top140/R180/bottom420, semua dalam CSS pixels.
Re-layout per format; tidak stretch feed menjadi vertical.
Fonts/assets ready -> native measure -> wrap -> bounded gap/size fitting -> geometry validation.
No ellipsis/cropping/hidden overflow/horizontal code scrolling/font di bawah minimum.
Native export canvas tidak ditransform scale. Error mengidentifikasi slide/slot/profile
dan block final export. Preview zoom berada pada wrapper.

SHOWCASE DAN GENERATOR HANDOFF
Showcase: palet/role tokens, typography, logo/provenance, anatomy/states,
kelima blueprint feed/Story/TikTok, normal/boundary copy dan error/pending-asset fixtures,
offer/code specimens, dan Campaign A sebagai draft campaign sample.
Patokan generator berupa manifest schema + typed blueprint registry +
CONTENT_GENERATION_RULES.md: allowed keys/slots, text budgets, highlight rules,
fact/asset refs, formats/safe profiles, required price/validity/fee notes,
contoh valid/invalid payload dan cara menangani overflow.
Generator menghasilkan data terstruktur; HTML/layout tetap dimiliki registry.
AI text/image generation service tidak diperlukan untuk milestone ini.

INTEGRASI DAN CAPTURE PROOF
Ganti placeholder renderer dashboard melalui adapter yang sama.
finalExportAvailable=true hanya untuk job yang lolos data/asset/fact/font/geometry checks.
Jika stand-alone, dokumentasikan interface dan sediakan sample consumer.
Thin Playwright capture: exact native canvas, deviceScaleFactor2, scale=device,
PNG2160x2700 /2160x3840. Wait exact fonts/assets, revision/hash dan stable geometry;
fixed sleep bukan readiness. Jangan capture UI shell, guides atau zoomed preview.
Full batch CLI merupakan milestone lanjutan master plan; jangan mengklaimnya selesai
jika hanya proof capture. Pending jobs dilaporkan blocked/draft.

VERIFIKASI DAN OUTPUT
Production build/typecheck; focused schema/fit/readiness checks; fixtures untuk kelima layouts
pada kedua dimensions dan profile variants. Uji long title/URL/terms, missing props/font/logo,
safe bounds, numeric formatting dan exact PNG size.
Review screenshots bila browser tersedia; jangan menyebut source-code inspection sebagai visual test.
Jika dashboard sudah ada, verify editor/CRUD/import/export JSON tetap berfungsi setelah integrasi.
Deliver tokens/generated CSS, local fonts, asset registry/provenance, blueprints, showcase,
capture proof/report, CONTENT_GENERATION_RULES.md dan README.
Laporkan hasil nyata dan blocker, bukan mock output berlabel final.

Mulai inspeksi lalu implementasi sistem visual ini sampai milestone selesai.
Lanjutkan pekerjaan lokal yang diperlukan secara mandiri.
Jangan mengubah website produksi, deploy atau publish konten.
```

## Hasil sesi

Sistem visual reusable untuk merender campaign JSON sesuai brand, lengkap dengan lima layout yang bisa dipreview dashboard. Ini patokan generator; layanan AI generasi dan renderer batch lengkap adalah pekerjaan lanjutan.
