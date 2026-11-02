# Catatan Riset Website — TokenGateway

Tanggal: 12 Oktober 2026. Scope: halaman dan data publik produk; read-only, tanpa login, API key, checkout POST, atau perubahan website.

## Metode dan bukti

Browser interaktif tidak tersedia (inventory browser kosong). Web search/open juga tidak bisa mengambil domain, tetapi HTTP GET langsung berhasil. Pembacaan dilakukan melalui HTML publik, bundle JavaScript publik yang dimuat halaman untuk menemukan endpoint katalog dan wording UI, lalu GET endpoint katalog tanpa autentikasi. Ini bukan pengujian hydrated UI di browser dan bukan bukti transaksi/backend model berhasil.

| Sumber | Hasil | Informasi yang digunakan |
|---|---|---|
| [Home](https://tokengateway.ai.id/) | HTTP 200, SSR shell | Navigation Model/Paket/Docs, brand reference |
| [Pricing](https://tokengateway.ai.id/pricing) | HTTP 200, catalog client-loaded | QRIS DOKU, cart, login, note aktivasi; angka paket dari API publik |
| [Docs](https://tokengateway.ai.id/docs) | HTTP 200, teks SSR terbaca | Base URL, auth, model permissions, endpoints, SDK dan integrasi |
| [Models](https://tokengateway.ai.id/models) | HTTP 200, catalog client-loaded | Akses model; sumber katalog dan disclaimer melalui bundle publik |
| [Packages API](https://tokengateway.ai.id/api/v1/catalog/packages) | HTTP 200, 21 packages | Nama, ID, versi, grant, harga, masa berlaku, allowlist |
| [Models API](https://tokengateway.ai.id/api/v1/catalog/models) | HTTP 200, 18 models | ID, label, kemampuan katalog; bukan verifikasi upstream |

Bundle pricing yang ditemukan dari HTML: [436-0b62dd5d3bf8cde1.js](https://tokengateway.ai.id/_next/static/chunks/436-0b62dd5d3bf8cde1.js). Bundle API/catalog: [371-0586ccd6228119e7.js](https://tokengateway.ai.id/_next/static/chunks/371-0586ccd6228119e7.js). Bundle models: [page-1e8615cf1b1ba94e.js](https://tokengateway.ai.id/_next/static/chunks/app/models/page-1e8615cf1b1ba94e.js). Hash pada nama bundle bisa berubah saat deploy; URL ini adalah bukti snapshot, bukan dependency studio.

Pricing menghitung `serviceFee = Math.ceil(0.008 * subtotal)` dan `grandTotal = subtotal + serviceFee`; UI menyebut biaya layanan 0,8%. Nilai final invoice belum diperiksa. Login/email verification dan voucher controls dibaca dari source publik, bukan akun pribadi.

Docs mempublikasikan `POST /v1/chat/completions`, `POST /v1/messages`, `GET /v1/models`, Bearer atau `x-api-key`, dan streaming SSE. Tidak ada request inference yang dijalankan. Konfigurasi tool yang dicontohkan belum dites.

Konflik home payment wording, prefix key, Claude availability, serta batas upstream ada pada [register fakta](../02_PACKAGES_AND_FACTS.md). Jangan memakai source statis sebagai bukti cabang UI sudah terlihat pada browser atau fitur sudah lulus end-to-end.

## Snapshot paket

Hash SHA-256 byte respons asli: `67c827767ff8f7e2059bce2672c149e8f950e29e970cddbcab27a34b2922fa50`.

JSON berikut di-pretty-print untuk dibaca; hash di atas merujuk byte asli, bukan format Markdown.

```json
{
  "packages": [
    {
      "package_id": "pkg-allstar-flash-100m",
      "version": 2,
      "name": "Paket Kilat All-Star Flash",
      "grant_tokens": 100000000,
      "terms": {
        "category": "bundling",
        "package_type": "bundling",
        "price_idr": 24000,
        "validity_days": 10
      },
      "model_ids": [
        "deepseek-v4.1-flash",
        "glm-5.3-flash",
        "qwen3.8-flash"
      ]
    },
    {
      "package_id": "pkg-super-flash-300m",
      "version": 1,
      "name": "Paket Super Flash",
      "grant_tokens": 300000000,
      "terms": {
        "category": "bundling",
        "package_type": "bundling",
        "price_idr": 39000,
        "validity_days": 14
      },
      "model_ids": [
        "deepseek-v4.1-flash",
        "glm-5.3-flash",
        "qwen3.8-flash"
      ]
    },
    {
      "package_id": "pkg-coder-architect-50m",
      "version": 1,
      "name": "Paket Coder & Architect",
      "grant_tokens": 50000000,
      "terms": {
        "category": "bundling",
        "package_type": "bundling",
        "price_idr": 35000,
        "validity_days": 14
      },
      "model_ids": [
        "deepseek-v4-pro",
        "qwen3-coder",
        "qwen3.8-flash"
      ]
    },
    {
      "package_id": "pkg-deep-reasoning-40m",
      "version": 1,
      "name": "Paket Deep Reasoning",
      "grant_tokens": 40000000,
      "terms": {
        "category": "bundling",
        "package_type": "bundling",
        "price_idr": 39000,
        "validity_days": 14
      },
      "model_ids": [
        "deepseek-v4-pro",
        "glm-5.3"
      ]
    },
    {
      "package_id": "pass-glm-5.3-flash-50m",
      "version": 1,
      "name": "Pass Kilat GLM 5.3 Flash 50M",
      "grant_tokens": 50000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 10000,
        "validity_days": 7
      },
      "model_ids": [
        "glm-5.3-flash"
      ]
    },
    {
      "package_id": "pass-deepseek-flash-150m",
      "version": 1,
      "name": "Pass DeepSeek Flash 150M",
      "grant_tokens": 150000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 22000,
        "validity_days": 10
      },
      "model_ids": [
        "deepseek-v4-flash",
        "deepseek-v4.1-flash"
      ]
    },
    {
      "package_id": "pass-glm-5.3-flash-120m",
      "version": 1,
      "name": "Pass GLM 5.3 Flash 120M",
      "grant_tokens": 120000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 22000,
        "validity_days": 10
      },
      "model_ids": [
        "glm-5.3-flash"
      ]
    },
    {
      "package_id": "pass-titan-flash-1b",
      "version": 1,
      "name": "Pass Titan Flash 1 Miliar",
      "grant_tokens": 1000000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 95000,
        "validity_days": 30
      },
      "model_ids": [
        "deepseek-v4.1-flash"
      ]
    },
    {
      "package_id": "pass-gemini-3.8-flash-50m",
      "version": 2,
      "name": "Pass Gemini 3.8 Flash 50M",
      "grant_tokens": 50000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 27000,
        "validity_days": 10
      },
      "model_ids": [
        "gemini-3.8-flash"
      ]
    },
    {
      "package_id": "pass-gemini-3.7-flash-60m",
      "version": 1,
      "name": "Pass Gemini 3.7 Flash 60M",
      "grant_tokens": 60000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 25000,
        "validity_days": 10
      },
      "model_ids": [
        "gemini-3.7-flash"
      ]
    },
    {
      "package_id": "pass-glm-5.2-60m",
      "version": 1,
      "name": "Pass GLM 5.2 Fast 60M",
      "grant_tokens": 60000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 24000,
        "validity_days": 10
      },
      "model_ids": [
        "glm-5.2"
      ]
    },
    {
      "package_id": "pass-qwen3-coder-60m",
      "version": 1,
      "name": "Pass Qwen 3 Coder 60M",
      "grant_tokens": 60000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 25000,
        "validity_days": 14
      },
      "model_ids": [
        "qwen3-coder"
      ]
    },
    {
      "package_id": "pass-deepseek-v4-pro-65m",
      "version": 1,
      "name": "Pass DeepSeek V4 Pro 65M",
      "grant_tokens": 65000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 32000,
        "validity_days": 14
      },
      "model_ids": [
        "deepseek-v4-pro"
      ]
    },
    {
      "package_id": "pass-glm-5.3-40m",
      "version": 1,
      "name": "Pass GLM 5.3 Reasoning 40M",
      "grant_tokens": 40000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 32000,
        "validity_days": 14
      },
      "model_ids": [
        "glm-5.3"
      ]
    },
    {
      "package_id": "pass-gpt-6-luna-60m",
      "version": 1,
      "name": "Pass GPT-6 Luna 60M",
      "grant_tokens": 60000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 22000,
        "validity_days": 10
      },
      "model_ids": [
        "gpt-6-luna"
      ]
    },
    {
      "package_id": "pkg-gpt6-frontier-20m",
      "version": 1,
      "name": "Paket Generasi GPT-6 Frontier 20M",
      "grant_tokens": 20000000,
      "terms": {
        "category": "bundling",
        "package_type": "bundling",
        "price_idr": 69000,
        "validity_days": 14
      },
      "model_ids": [
        "gpt-6-astra",
        "gpt-6-luna",
        "gpt-6-sol",
        "gpt-6.1-sol"
      ]
    },
    {
      "package_id": "pkg-gpt6-frontier-30m",
      "version": 1,
      "name": "Paket Generasi GPT-6 Frontier 30M",
      "grant_tokens": 30000000,
      "terms": {
        "category": "bundling",
        "package_type": "bundling",
        "price_idr": 129000,
        "validity_days": 21
      },
      "model_ids": [
        "gpt-6-astra",
        "gpt-6-luna",
        "gpt-6-sol",
        "gpt-6.1-sol"
      ]
    },
    {
      "package_id": "pass-gpt-6-sol-50m",
      "version": 2,
      "name": "Pass GPT-6 Sol 50M",
      "grant_tokens": 50000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 35000,
        "validity_days": 14
      },
      "model_ids": [
        "gpt-6-sol"
      ]
    },
    {
      "package_id": "pass-kimi-k3-50m",
      "version": 2,
      "name": "Pass Kimi K3 Flagship 50M",
      "grant_tokens": 50000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 29000,
        "validity_days": 10
      },
      "model_ids": [
        "kimi-k3"
      ]
    },
    {
      "package_id": "pass-gpt-6.1-sol-25m",
      "version": 1,
      "name": "Pass GPT-6.1 Sol Flagship 25M",
      "grant_tokens": 25000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 49000,
        "validity_days": 14
      },
      "model_ids": [
        "gpt-6.1-sol"
      ]
    },
    {
      "package_id": "pass-gpt-6-astra-15m",
      "version": 1,
      "name": "Pass GPT-6 Astra Flagship 15M",
      "grant_tokens": 15000000,
      "terms": {
        "category": "pass",
        "package_type": "single",
        "price_idr": 65000,
        "validity_days": 14
      },
      "model_ids": [
        "gpt-6-astra"
      ]
    }
  ]
}
```

## Snapshot model

Hash SHA-256 byte respons asli: `3849722c55424bdae1ac7084de99ae2f7ec4f506cc305dc3f0e017d982903bfb`.

```json
{
  "models": [
    {
      "id": "deepseek-v4-flash",
      "name": "DeepSeek V4 Flash",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1000000,
        "max_input_tokens": 1000000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": false
      },
      "context_window": 1000000,
      "max_input_tokens": 1000000,
      "max_output_tokens": 128000
    },
    {
      "id": "deepseek-v4-pro",
      "name": "DeepSeek V4 Pro",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1000000,
        "max_input_tokens": 1000000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": false
      },
      "context_window": 1000000,
      "max_input_tokens": 1000000,
      "max_output_tokens": 128000
    },
    {
      "id": "deepseek-v4.1-flash",
      "name": "DeepSeek V4.1 Flash",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1048576,
        "max_input_tokens": 1048576,
        "max_output_tokens": 131072,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1048576,
      "max_input_tokens": 1048576,
      "max_output_tokens": 131072
    },
    {
      "id": "gemini-3.7-flash",
      "name": "Google Gemini 3.7 Flash",
      "price": null,
      "capabilities": {
        "reasoning": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": null,
      "max_input_tokens": null,
      "max_output_tokens": null
    },
    {
      "id": "gemini-3.8-flash",
      "name": "Google Gemini 3.8 Flash",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1048576,
        "max_input_tokens": 1048576,
        "max_output_tokens": 65536,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1048576,
      "max_input_tokens": 1048576,
      "max_output_tokens": 65536
    },
    {
      "id": "glm-5.2",
      "name": "GLM 5.2 Fast",
      "price": null,
      "capabilities": {
        "reasoning": false,
        "tags": [
          "Tools"
        ],
        "tools": true
      },
      "context_window": null,
      "max_input_tokens": null,
      "max_output_tokens": null
    },
    {
      "id": "glm-5.3",
      "name": "GLM 5.3",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1000000,
        "max_input_tokens": 1000000,
        "max_output_tokens": 131072,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": false
      },
      "context_window": 1000000,
      "max_input_tokens": 1000000,
      "max_output_tokens": 131072
    },
    {
      "id": "glm-5.3-flash",
      "name": "GLM 5.3 Flash",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1048576,
        "max_input_tokens": 1048576,
        "max_output_tokens": 131072,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1048576,
      "max_input_tokens": 1048576,
      "max_output_tokens": 131072
    },
    {
      "id": "gpt-5.4-mini",
      "name": "GPT-5.4 Mini Fast",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 400000,
        "max_input_tokens": 400000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 400000,
      "max_input_tokens": 400000,
      "max_output_tokens": 128000
    },
    {
      "id": "gpt-6-astra",
      "name": "OpenAI GPT-6 Astra",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1050000,
        "max_input_tokens": 1050000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1050000,
      "max_input_tokens": 1050000,
      "max_output_tokens": 128000
    },
    {
      "id": "gpt-6-luna",
      "name": "OpenAI GPT-6 Luna",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1050000,
        "max_input_tokens": 1050000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1050000,
      "max_input_tokens": 1050000,
      "max_output_tokens": 128000
    },
    {
      "id": "gpt-6-sol",
      "name": "OpenAI GPT-6 Sol",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1050000,
        "max_input_tokens": 1050000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1050000,
      "max_input_tokens": 1050000,
      "max_output_tokens": 128000
    },
    {
      "id": "gpt-6.1-sol",
      "name": "OpenAI GPT-6.1 Sol",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1050000,
        "max_input_tokens": 1050000,
        "max_output_tokens": 128000,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1050000,
      "max_input_tokens": 1050000,
      "max_output_tokens": 128000
    },
    {
      "id": "kimi-k2.7-code",
      "name": "Kimi K2.7 Code",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 262144,
        "max_input_tokens": 262144,
        "max_output_tokens": 131072,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 262144,
      "max_input_tokens": 262144,
      "max_output_tokens": 131072
    },
    {
      "id": "kimi-k3",
      "name": "Kimi K3",
      "price": null,
      "capabilities": {
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": null,
      "max_input_tokens": null,
      "max_output_tokens": null
    },
    {
      "id": "qwen-3-8-max",
      "name": "Qwen 3.8 Max Flagship",
      "price": null,
      "capabilities": {
        "coding": true,
        "reasoning": true,
        "tags": [
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true
      },
      "context_window": null,
      "max_input_tokens": null,
      "max_output_tokens": null
    },
    {
      "id": "qwen3-coder",
      "name": "Qwen 3 Coder 480B",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 256000,
        "max_input_tokens": 256000,
        "max_output_tokens": 65536,
        "reasoning": false,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": false
      },
      "context_window": 256000,
      "max_input_tokens": 256000,
      "max_output_tokens": 65536
    },
    {
      "id": "qwen3.8-flash",
      "name": "Qwen 3.8 Flash",
      "price": null,
      "capabilities": {
        "coding": true,
        "context_window": 1000000,
        "max_input_tokens": 1000000,
        "max_output_tokens": 131072,
        "reasoning": true,
        "streaming": true,
        "supports_streaming": true,
        "tags": [
          "Vision",
          "Reasoning",
          "Coding",
          "Tools"
        ],
        "tools": true,
        "vision": true
      },
      "context_window": 1000000,
      "max_input_tokens": 1000000,
      "max_output_tokens": 131072
    }
  ]
}
```

## Referensi pemilik

Logo pada percakapan telah disalin tanpa pengubahan ke [assets/tokengateway-logo-reference.jpeg](../assets/tokengateway-logo-reference.jpeg). Identitas logo diterima dari pemilik; format vector masih perlu disiapkan. Warna JPEG yang diamati mendekati biru RGB (2,102,252), cyan (22,221,226), dan charcoal (24,29,35); variasi JPEG membuatnya tidak tepat dijadikan nilai canonical otomatis.

Mandat awal pemilik: Indonesian API gateway, QRIS, tanpa kartu kredit, carousel 1080×1350 dengan inset 80px, vertical 1080×1920 dengan top 140px/bottom 160px, DPR 2, lima blueprint, dan estetika Swiss-tech. Fakta terbaru dari paket memperjelas kuota dan masa berlaku.
