# Prompt untuk Claude Code (vision-capable) — Lanjutkan Brand Vector Master TokenGateway

Salin seluruh blok di bawah garis ini ke Claude Code:

---

Lanjutkan pekerjaan brand vector master TokenGateway di `/Users/mekari/tokengateway/tokengateway-studio`.

## Konteks yang sudah selesai (JANGAN diubah/diulang)

- Font lokal selesai: `public/fonts/` berisi 8 WOFF2 (Plus Jakarta Sans 400/500/600/700/800, JetBrains Mono 400/500/700) + `provenance.json`. Sudah approved, pertahankan apa adanya.
- Token engine, schema contract, dashboard MVP sudah jalan. Jangan refactor di luar scope P0.2.
- Sesi sebelumnya (model text-only) sudah memverifikasi: website live `https://tokengateway.ai.id/brand/tokengateway-mark.svg` dan `/icon.svg` ternyata PNG base64 di dalam `<image>` — BUKAN vector asli, dilarang dipakai/ditelusur oleh brief.

## Tugas: P0.2 — TokenGateway vector master

1. BACA dulu spesifikasi wajib:
   - `briefs/03_BRAND_GUIDELINES.md` bagian "Anatomi logo yang harus dipertahankan", "Palet awal", dan aturan penggunaan mark (clear space, larangan transform).
   - `EXECUTION_PLAN.md` task P0.2 dan acceptance criteria-nya.
   - `src/assets/registry.ts` — status aset saat ini; record `tokengateway.mark` masih `RASTER_REFERENCE`.

2. LIHAT referensi visual: `briefs/assets/tokengateway-logo-reference.jpeg` (2752×1536, SHA-256 `87360b16fab6a535cf24830ebaa0ada6bd65ff290696099483bd0a9c570e4ed6`, latar gelap bagian gambar).
   Elemen yang harus dipertahankan (dari brief):
   - Dua bidang biru bersudut membentuk siluet heksagonal TERBUKA (bukan hexagon solid).
   - Jalur cyan dengan simpul bulat + hubungan diagonal membentuk rangkaian di pusat.
   - Sambungan cyan atas/bawah menyatu ritme rangka luar.
   - Aksen bracket/kode abu gelap di tengah + ruang negatifnya.
   - Ketebalan jalur, ukuran simpul, simetri, sudut, celah mengikuti referensi.

3. BUAT `public/brand/tokengateway-mark.svg`:
   - Path/shape asli, digambar manual mengikuti JPEG. DILARANG: wrapper `<image>`/base64, auto-trace mentah (potrace/vtracer output tanpa cleanup), bentuk stok "AI circuit", susunan node baru.
   - Keluarkan whitespace latar JPEG; bounding box = mark saja. Pertahankan aspect ratio.
   - Warna dari token yang dinormalisasi: biru `#0066FF`, cyan `#16DDE2`, abu bracket `#293744`. Kanvas target charcoal `#181D23` (jangan dipaksa masuk ke SVG).
   - ViewBox bersih, grup diberi id bermakna (mis. `hexagon-fields`, `circuit-nodes`, `bracket`).

4. VERIFIKASI struktural + visual:
   - Inspeksi SVG: tidak ada `<image>`, hanya path/shape; render benar di ukuran kecil (24px) dan besar.
   - Buat contact sheet sederhana (HTML/PNG) membandingkan draft vs JPEG berdampingan di atas latar `#181D23`, lalu TUNJUKKAN ke saya untuk approval. Tanpa approval saya, status TETAP bukan `APPROVED_VECTOR`.

5. SETELAH saya approve:
   - Update `src/assets/registry.ts`: status `tokengateway.mark` → `APPROVED_VECTOR`, path `/brand/tokengateway-mark.svg`, source mencatat "drafted from owner JPEG reference, approved <tanggal>".
   - Buat `public/brand/provenance.json` (atau gabung pola yang sudah ada) mencatat hash SHA-256 SVG final + sumber referensinya.
   - Update checklist P0.2 di `EXECUTION_PLAN.md` hanya untuk bagian TokenGateway mark.

6. JANGAN kerjakan 4 mark pihak ketiga (GLM Z, DeepSeek, Gemini, QRIS) kecuali saya minta — itu akuisisi terpisah dari sumber resmi.

## Aturan main

- Perubahan minimal, ikuti gaya kode existing. Jangan tambah dependency baru tanpa izin.
- Jalankan test/build yang relevan setelah ubah registry (`npm test` / `npm run build`).
- Kalau ada konflik antara brief dan apa yang terlihat di JPEG, berhenti dan tanya saya — jangan menebak.
