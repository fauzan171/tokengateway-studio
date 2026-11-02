# Prompt 1 — Build Web Dashboard Creative Studio Dulu

Jalankan ini terlebih dahulu. Targetnya dashboard lokal untuk mengelola campaign dan mengedit data konten. Artwork final dibangun melalui prompt kedua. Dashboard yang dimaksud adalah workspace pembuat konten TokenGateway; saldo/payment/account console tetap berada di website produk.

## Prompt siap salin

```text
Kamu adalah Principal Software Architect dan Frontend Engineer untuk TokenGateway Creative Studio.

BATAS OUTPUT DAN CARA KERJA
Model target memiliki maksimum output 4096 token per request. Konfigurasikan batas output
di client/API menjadi 2048 token bila konfigurasi itu berada dalam kendalimu; jangan meminta 32000.
Instruksi prompt ini tidak menggantikan konfigurasi request API. Jika client mengirim nilai
lebih besar dari4096, koreksi konfigurasi tersebut sebelum melanjutkan.
Kerjakan bertahap: foundation/schema -> shell/routes -> campaign CRUD/persistence -> editor -> verification.
Setiap respons/tool call harus pendek; baca file dalam bagian yang relevan dan pecah patch besar.
Tulis kode langsung ke workspace; jangan mencetak seluruh aplikasi atau seluruh file ke chat.
Jika satu bagian membutuhkan lebih banyak output, lanjutkan pada request berikutnya.
Simpan progress di file agar pekerjaan dapat dilanjutkan tanpa mengulang konteks panjang.
Update singkat; laporan akhir cukup hasil, cara menjalankan, pemeriksaan dan blocker.

TUGAS
Bangun web dashboard Creative Studio yang fungsional terlebih dahulu: workflow, campaign CRUD,
editor data, persistence dan renderer boundary. Kerjakan sampai aplikasi lokal bisa dijalankan.
Content design system/artwork akan dibangun dalam sesi TERPISAH sesudah dashboard siap.

BACA DULU
- briefs/README.md
- briefs/01_PRODUCT_BRIEF.md
- briefs/02_PACKAGES_AND_FACTS.md
- briefs/03_BRAND_GUIDELINES.md
- EXECUTION_PLAN.md, khususnya manifest schema dan registry contract.
- briefs/08_DASHBOARD_BUILD_PROMPT.md sebagai scope sesi ini.

Instruksi terbaru pemilik: dashboard dulu, content design system belakangan.
Ikuti urutan ini jika dokumen lama menyebut showcase/HERO harus lebih dahulu.
Kontrak data dan gerbang final export pada master plan tetap berlaku.

STACK DAN UI
Inspeksi workspace. Jika belum ada app, scaffold Vite + React + TypeScript strict,
Tailwind static classes dan runtime schema validation. Pilih versi kompatibel dengan Node,
gunakan satu package manager/lockfile. Jika app sudah ada, lanjutkan tanpa scaffold ulang.
UI workspace rapi: sidebar, header, main content, editor panel dan preview stage.
Gunakan biru/cyan logo pemilik secukupnya; UI typography14–16px, controls berlabel,
contrast terbaca, focus-visible dan keyboard navigation.
Desain UI aplikasi diperlukan agar dashboard nyaman dipakai. Polish artwork slide,
vectorisasi logo dan akuisisi semua provider marks tidak perlu menjadi blocker milestone ini.

HALAMAN DAN FUNGSI
1. Overview
   Jumlah campaign/slides dan draft/error/valid states berasal dari data lokal sebenarnya.
   Recent campaigns, Create Campaign, Open Editor dan empty state.
   Jangan membuat impressions, revenue atau API usage palsu.
2. Campaigns
   Create, rename, duplicate, search, open, delete dengan undo/recovery sederhana.
   Tampilkan jumlah slide, tanggal perubahan, formats/profiles dan validation status.
3. Campaign Editor
   Kiri: slide navigator; add/duplicate/reorder/delete dengan stable IDs.
   Tengah: stage, zoom/fit, 4:5/9:16 toggle, Story/TikTok profile, safe guides.
   Kanan: slot form dari blueprint descriptors dan raw JSON editor.
   Layout keys: HERO_HOOK, PROBLEM_COMPARISON, MODEL_CATALOG, CODE_MOCKUP, PRICING_OFFER.
   Preview sementara melalui renderer adapter; tampilkan slot data/logical bounds
   dengan label DRAFT — CONTENT DESIGN SYSTEM BELUM TERPASANG.
   Invalid JSON tetap di editor dengan path error; last-valid preview diberi label.
   Undo/redo, save status dan dirty-state handling harus bekerja.
4. Asset Library
   Inventory read-only: logo referensi dan required asset IDs, provenance/status.
   JPEG bukan vector, dan placeholder bukan official logo. Tidak wajib upload/manipulation.
5. Product Facts
   Snapshot paket bertipe dari brief/research: ID/version/models/IDR/quota/validity/source date.
   Tunjukkan snapshot date serta pending operational details; jangan menyebutnya live feed.
   Tidak perlu login website produksi, checkout POST atau API key pengguna.
6. Settings
   Default format/profile, preview preference dan draft recovery.
   Import/export JSON dan reset preference yang aman; tidak perlu AI-provider/key settings.

DATA DAN PERSISTENCE
Shared discriminated runtime schema mengikuti EXECUTION_PLAN.md.
Pisahkan draft yang boleh belum lengkap dari validated manifest untuk export JSON.
Versioned local storage dengan unavailable/quota-full/corrupt handling.
Save/reload/import/download nyata; import parse -> validate -> commit secara atomic.
Invalid import tidak merusak campaign aktif. Stable IDs tidak berubah saat rename/reorder;
duplicate membuat ID baru. Rapid edits/asynchronous results memakai revision identity.
Payload tidak memuat HTML, SVG markup, CSS classes, JavaScript atau real API keys.

BATAS INTEGRASI YANG WAJIB DIBUAT
- src/studio/: shell, pages, editor state, persistence, UI theme.
- src/contracts/: manifest schema/types/formats/errors.
- src/blueprints/: typed descriptors dan registry boundary.
- src/canvas/: native logical canvas, safe profiles dan renderer interface.
- src/design/: reserved untuk content tokens/typography sesi berikutnya.
Scope UI theme ke shell; global h1/body typography tidak boleh bocor ke canvas.
Renderer interface bertipe menerima normalized slide + RenderContext, mengembalikan
readiness/status/errors dan finalExportAvailable. Stage/editor memakai kontrak ini.
Placeholder mempunyai finalExportAvailable=false, status draft.
Sesi kedua mengganti renderer dengan real blueprints tanpa rewrite editor/persistence.

FORMAT DAN EXPORT
Feed1080x1350, inset80 semua sisi. Story1080x1920, L/R80, top140, bottom160.
TikTok conservative L80/top140/R180/bottom420. Semua dalam CSS pixels.
Zoom hanya wrapper; logical dimensions tetap. Export JSON valid harus berfungsi.
PNG/Playwright pipeline bukan deliverable sesi ini. Export PNG disabled dengan alasan jelas
“Content renderer belum tersedia”; jangan memberikan download/success pura-pura.

FIXTURES DAN SCOPE
Sediakan empty campaign dan sample berlabel dari Campaign A di briefs/06_CAMPAIGN_BRIEFS.md.
Harga/kuota/model mengacu snapshot; sample bukan bukti checkout/inference sukses.
Unresolved asset/fact/comparator tetap pending. Shell editor boleh dipakai untuk draft itu.
Milestone ini local single-user: cloud auth, collaboration, backend database, payments,
AI generation, social publishing, final artwork dan batch PNG tidak diperlukan.
Jangan membuat Generate AI yang hanya menghasilkan dummy tanpa label.

VERIFIKASI DAN DELIVERABLE
- Production build dan strict typecheck lulus.
- Focused checks: create/edit/save/reload/import/export JSON, stable IDs/reorder,
  invalid JSON recovery, storage failure dan renderer capability gating.
- Periksa UI desktop1440px/mobile390px bila browser tersedia; mobile panels boleh tabs.
- Semua menu dan aksi utama bekerja, empty/error/saved state jelas.
- Bila browser tooling tidak tersedia, jelaskan keterbatasan; jangan mengklaim visual test lulus.
- README: cara menjalankan lokal, scope selesai, dan renderer handoff untuk sesi berikutnya.
- Update status sebagai dashboard MVP, bukan studio production-ready.

Mulai inspeksi lalu implementasi secara mandiri sampai milestone dashboard lokal selesai.
Jangan deploy/publish atau mengubah website TokenGateway produksi.
```

## Hasil sesi

Web dashboard bisa membuat campaign, mengedit slide/JSON, menyimpan/memulihkan draft dan mendownload manifest valid. Preview artwork masih draft, tetapi workflow dan renderer contract sudah siap untuk prompt kedua.
