# Build Prompts — Dua Sesi Terpisah

Urutan terbaru dari pemilik: **dashboard dulu, content design system setelahnya**. Prompt lama yang menggabungkan design-system foundations dan build awal telah digantikan oleh dua file berikut.

1. [08_DASHBOARD_BUILD_PROMPT.md](08_DASHBOARD_BUILD_PROMPT.md) — web dashboard Creative Studio dengan campaign CRUD, editor, logical draft preview, persistence, dan JSON import/export.
2. [09_CONTENT_DESIGN_SYSTEM_PROMPT.md](09_CONTENT_DESIGN_SYSTEM_PROMPT.md) — token engine, lima blueprints, showcase, generation rules, dan native render proof; kemudian integrasi ke dashboard.

Jalankan satu prompt per sesi. Dashboard menyediakan kontrak data/renderer; content design system mengisi implementasi visualnya. UI dashboard dan artwork konten mempunyai scope CSS/token terpisah.

**Konfigurasi model sebelum running:** untuk model dengan limit output 4096, set batas output client/API ke **2048 token per request**, maksimal 4096. Jangan mengirim 32000. Aturan pada kedua prompt membagi pekerjaan menjadi bagian kecil, tetapi tidak bisa mengubah parameter API yang dikirim client secara otomatis.

Konfigurasi lokal Claude Code sudah disiapkan di `.claude/settings.local.json`: `CLAUDE_CODE_MAX_OUTPUT_TOKENS=2048` dan `MAX_THINKING_TOKENS=0`. Konfigurasi ini berlaku untuk proyek ini; model, endpoint, dan credential tidak diubah. Restart Claude Code dari folder proyek sebelum mencoba kembali. File sudah diperiksa sebagai JSON, tetapi request API belum diuji. Untuk client selain Claude Code, konfigurasi ini tidak otomatis berlaku.

## Prompt pendek untuk memulai

Dashboard:

```text
Baca briefs/08_DASHBOARD_BUILD_PROMPT.md dan periksa kode proyek yang sudah ada.
Lanjutkan pekerjaan dashboard yang belum selesai sesuai brief.
Kerjakan satu bagian kecil per respons dan tulis perubahan langsung ke file proyek.
Jangan mencetak seluruh kode. Laporkan perubahan dan hasil pemeriksaan secara singkat.
```

Content design system:

```text
Baca briefs/09_CONTENT_DESIGN_SYSTEM_PROMPT.md dan dokumen rujukannya.
Periksa dashboard yang sudah ada, lalu mulai dari token warna, tipografi, dan font lokal.
Kerjakan satu bagian kecil per respons dan tulis perubahan langsung ke file proyek.
Jangan mencetak seluruh kode. Laporkan perubahan dan hasil pemeriksaan secara singkat.
```

Prompt pembuka yang pendek mengarahkan agent untuk membaca brief dari disk. Ini membutuhkan agent yang memiliki akses file proyek; membaca file tidak mengubah batas output request.

Jika memakai **Claude Code CLI**, keluar dari sesi lama, lalu jalankan dari folder proyek:

```bash
CLAUDE_CODE_MAX_OUTPUT_TOKENS=2048 MAX_THINKING_TOKENS=0 claude --continue
```

Ini menerapkan konfigurasi pada proses client yang baru. Pada gateway pihak ketiga, `MAX_THINKING_TOKENS=0` menghilangkan parameter thinking; batas output ditetapkan melalui `CLAUDE_CODE_MAX_OUTPUT_TOKENS`. [Referensi resmi Claude Code](https://code.claude.com/docs/en/env-vars).

Perintah ini khusus Claude Code CLI. Client/extension lain memerlukan pengaturan sesuai aplikasi yang digunakan. Jika request masih mengirim 32000, konfigurasi belum efektif atau lapisan lain menimpa nilainya; jangan menganggap perubahan prompt memperbaiki API 400. Verifikasi nilai request tanpa membagikan API key.

Ini masih paket prompt. Tidak ada scaffolding atau implementasi yang dijalankan saat menulis file-file ini.
