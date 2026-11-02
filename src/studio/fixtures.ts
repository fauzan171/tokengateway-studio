import type { Manifest } from "../contracts/campaign.schema";

/**
 * Fixtures are starting points, not proof of anything. Prices and quotas come
 * from the bundled snapshot; nothing here demonstrates a successful checkout,
 * inference request, or published content.
 */

/** Empty campaign: valid envelope, one minimal slide. */
export const emptyCampaign: Manifest = {
  schemaVersion: "1.0.0",
  campaignId: "campaign-baru",
  name: "Campaign baru",
  locale: "id-ID",
  designRevision: "swiss-tech-v1",
  factsRevision: "product-facts-v1",
  formats: ["IG_CAROUSEL"],
  verticalProfiles: [],
  slides: [
    {
      id: "hero-hook-000001",
      layout: "HERO_HOOK",
      props: {
        title: "Tulis judul di sini.",
        highlight: "judul",
        categoryTag: "TOKENGATEWAY",
        subline: "Tulis subline singkat di sini.",
      },
    },
  ],
};

/**
 * Campaign A from briefs/06_CAMPAIGN_BRIEFS.md.
 * CODE_MOCKUP slide A3 depends on f13-cursor-steps, which is still PENDING,
 * so that slide stays draft and cannot reach final export.
 */
export const campaignASample: Manifest = {
  schemaVersion: "1.0.0",
  campaignId: "campaign-a-glm-rp10000",
  name: "Campaign A — Mulai dengan GLM Rp10.000 (sample)",
  locale: "id-ID",
  designRevision: "swiss-tech-v1",
  factsRevision: "product-facts-v1",
  formats: ["IG_CAROUSEL", "VERTICAL"],
  verticalProfiles: ["IG_STORY", "TIKTOK"],
  slides: [
    {
      id: "a1-hook",
      layout: "HERO_HOOK",
      props: {
        title: "Mulai pakai API AI dari Rp10.000.",
        highlight: "Rp10.000",
        categoryTag: "PAKET GLM 5.3 FLASH",
        subline:
          "50 juta token. Berlaku 7 hari. Bayar pakai QRIS. Harga paket belum termasuk biaya layanan checkout.",
      },
    },
    {
      id: "a2-model-catalog",
      layout: "MODEL_CATALOG",
      props: {
        title: "Pilih model sesuai paketmu.",
        subline:
          "Akses dan harga mengikuti paket. Rp10.000 khusus pass GLM 5.3 Flash 50M.",
        models: [
          {
            provider: "GLM",
            availabilityFactId: "f11-provider-catalog",
            label: "GLM 5.3 Flash",
            description: "Entry pass: 50 juta token, berlaku 7 hari.",
            capabilityFactIds: ["f06-model-access"],
          },
          {
            provider: "DEEPSEEK",
            availabilityFactId: "f11-provider-catalog",
            label: "DeepSeek V4.1 Flash",
            description: "Tersedia pada pass dan paket bundling dalam katalog.",
            capabilityFactIds: ["f06-model-access"],
          },
          {
            provider: "GEMINI",
            availabilityFactId: "f11-provider-catalog",
            label: "Gemini 3.8 Flash",
            description: "Ada pass tersendiri. Cek kuota dan masa berlaku sebelum beli.",
            capabilityFactIds: ["f06-model-access"],
          },
        ],
      },
    },
    {
      id: "a3-code-mockup",
      layout: "CODE_MOCKUP",
      props: {
        title: "Hubungkan aplikasi ke gateway.",
        integrationFactId: "f13-cursor-steps",
        windowTitle: "TokenGateway — API Setup",
        steps: [
          "Buat API key di console.",
          "Isi base URL pada aplikasi yang kompatibel.",
          "Pilih model sesuai akses paket dan key.",
        ],
        caption: "Ikuti petunjuk integrasi tool kamu di dokumentasi TokenGateway.",
      },
    },
    {
      id: "a4-pricing-offer",
      layout: "PRICING_OFFER",
      props: {
        title: "Paket awal GLM 5.3 Flash.",
        offerFactId: "f02-entry-glm-offer",
        quotaLabel: "Kuota paket",
        supportingText: "Akses model glm-5.3-flash. Bayar paket pakai QRIS.",
        ctaLabel: "Lihat paket GLM",
        ctaTargetFactId: "f03-payment-qris",
        termsNote:
          "Harga paket. Belum termasuk biaya layanan checkout. Akses model mengikuti paket dan API key.",
      },
    },
    {
      id: "a5-next-step",
      layout: "HERO_HOOK",
      props: {
        title: "Cek paket. Mulai request pertama.",
        highlight: "request pertama",
        categoryTag: "TOKENGATEWAY",
        subline:
          "Lihat akses model, kuota, masa berlaku, dan rincian bayar di tokengateway.ai.id/pricing.",
      },
    },
  ],
};

/**
 * Draft-only comparison shell. The comparator fact is unresolved because no
 * verified $20/month product, plan, or billing evidence exists yet — the
 * slide is useful for layout work and stays blocked from export.
 */
export const comparisonDraftSample: Manifest = {
  schemaVersion: "1.0.0",
  campaignId: "campaign-e-comparison-draft",
  name: "Campaign E — Perbandingan (DRAFT, comparator belum terverifikasi)",
  locale: "id-ID",
  designRevision: "swiss-tech-v1",
  factsRevision: "product-facts-v1",
  formats: ["IG_CAROUSEL", "VERTICAL"],
  verticalProfiles: ["IG_STORY"],
  slides: [
    {
      id: "e1-comparison",
      layout: "PROBLEM_COMPARISON",
      props: {
        title: "Bayar per bulan, atau bayar paket?",
        comparatorFactId: "f99-comparator-pending",
        offerFactId: "f02-entry-glm-offer",
        leftLabel: "Langganan bulanan",
        rightLabel: "Paket TokenGateway",
        rows: [
          { left: "Tagihan berulang tiap bulan", right: "Beli paket sesuai kebutuhan" },
          { left: "Perlu kartu kredit", right: "Bayar pakai QRIS" },
        ],
        note: "Comparator belum terverifikasi. Angka tidak ditampilkan.",
      },
    },
    {
      id: "e2-offer",
      layout: "PRICING_OFFER",
      props: {
        title: "Paket awal GLM 5.3 Flash.",
        offerFactId: "f02-entry-glm-offer",
        quotaLabel: "Kuota paket",
        supportingText: "Akses model glm-5.3-flash. Bayar paket pakai QRIS.",
        ctaLabel: "Lihat paket GLM",
        ctaTargetFactId: "f03-payment-qris",
        termsNote: "Harga paket. Belum termasuk biaya layanan checkout.",
      },
    },
  ],
};

/**
 * Developer-focused campaign. CODE_MOCKUP uses f05 (OpenAI-compatible) and
 * f01 (base URL), both PUBLIC — no PENDING facts, so every slide can reach
 * final export once assets/fonts are approved.
 */
export const campaignDevSample: Manifest = {
  schemaVersion: "1.0.0",
  campaignId: "campaign-dev-openai-compatible",
  name: "Campaign Dev — API OpenAI-compatible, bayar QRIS",
  locale: "id-ID",
  designRevision: "swiss-tech-v1",
  factsRevision: "product-facts-v1",
  formats: ["IG_CAROUSEL", "VERTICAL"],
  verticalProfiles: ["IG_STORY", "TIKTOK"],
  slides: [
    {
      id: "d1-hook",
      layout: "HERO_HOOK",
      props: {
        title: "Satu API key untuk banyak model.",
        highlight: "Satu API key",
        categoryTag: "TOKENGATEWAY UNTUK DEVELOPER",
        subline:
          "Endpoint kompatibel OpenAI. Ganti base URL, lanjut coding. Bayar pakai QRIS, tanpa kartu kredit.",
      },
    },
    {
      id: "d2-code-mockup",
      layout: "CODE_MOCKUP",
      props: {
        title: "Ganti base URL, selesai.",
        integrationFactId: "f05-openai-compatible",
        windowTitle: "client.ts",
        steps: [
          "baseURL: https://tokengateway.ai.id/v1",
          "apiKey: dari console TokenGateway",
          "model: pilih sesuai akses paket kamu",
          "Jalankan request seperti biasa, streaming SSE didokumentasikan.",
        ],
        caption:
          "Format kompatibel OpenAI dan Anthropic. Akses model mengikuti paket, akun, dan API key.",
      },
    },
    {
      id: "d3-model-catalog",
      layout: "MODEL_CATALOG",
      props: {
        title: "Model dari tiga provider.",
        subline:
          "Satu gateway. Akses dan harga mengikuti paket yang kamu beli.",
        models: [
          {
            provider: "GLM",
            availabilityFactId: "f11-provider-catalog",
            label: "GLM 5.3 Flash",
            description: "Entry pass: 50 juta token, berlaku 7 hari.",
            capabilityFactIds: ["f06-model-access"],
          },
          {
            provider: "DEEPSEEK",
            availabilityFactId: "f11-provider-catalog",
            label: "DeepSeek V4.1 Flash",
            description: "Tersedia pada pass dan paket bundling dalam katalog.",
            capabilityFactIds: ["f06-model-access"],
          },
          {
            provider: "GEMINI",
            availabilityFactId: "f11-provider-catalog",
            label: "Gemini 3.8 Flash",
            description: "Ada pass tersendiri. Cek kuota dan masa berlaku sebelum beli.",
            capabilityFactIds: ["f06-model-access"],
          },
        ],
      },
    },
    {
      id: "d4-pricing-offer",
      layout: "PRICING_OFFER",
      props: {
        title: "Mulai dari GLM 5.3 Flash.",
        offerFactId: "f02-entry-glm-offer",
        quotaLabel: "Kuota paket",
        supportingText: "Akses model glm-5.3-flash. Bayar paket pakai QRIS.",
        ctaLabel: "Ambil API key di console",
        ctaTargetFactId: "f03-payment-qris",
        termsNote:
          "Harga paket. Belum termasuk biaya layanan checkout. Verifikasi email sebelum membeli.",
      },
    },
    {
      id: "d5-next-step",
      layout: "HERO_HOOK",
      props: {
        title: "Deploy malam ini juga.",
        highlight: "malam ini",
        categoryTag: "TOKENGATEWAY",
        subline:
          "Dokumentasi, API keys, dan usage ada di console. Lihat paket di tokengateway.ai.id/pricing.",
      },
    },
  ],
};

/**
 * Campaign F — "Night-before launch" (ide: brief C, request API pertama).
 * Semua fact PUBLIC. Kartu model di slide 4 menampilkan slot logo GLM,
 * DeepSeek, Gemini — logo resmi masih MISSING, slot tampil sebagai draft.
 */
export const campaignNightLaunchSample: Manifest = {
  schemaVersion: "1.0.0",
  campaignId: "campaign-night-launch",
  name: "Campaign F — Deploy Malam Ini (request API pertama)",
  locale: "id-ID",
  designRevision: "swiss-tech-v1",
  factsRevision: "product-facts-v1",
  formats: ["IG_CAROUSEL", "VERTICAL"],
  verticalProfiles: ["IG_STORY", "TIKTOK"],
  slides: [
    {
      id: "f1-hook",
      layout: "HERO_HOOK",
      props: {
        title: "Deploy malam ini. Besok sudah live.",
        highlight: "Deploy malam ini",
        categoryTag: "REQUEST API PERTAMA",
        subline:
          "Satu base URL. Satu API key. Model siap dipilih. Bayar pakai QRIS — tanpa kartu kredit.",
      },
    },
    {
      id: "f2-code-setup",
      layout: "CODE_MOCKUP",
      props: {
        title: "Isi key. Pilih model.",
        integrationFactId: "f05-openai-compatible",
        windowTitle: "client.ts",
        steps: [
          "Buat API key di console TokenGateway.",
          "Isi base URL pada aplikasi yang kompatibel.",
          "Pilih model sesuai akses paket dan key.",
        ],
        caption: "Endpoint kompatibel OpenAI dan Anthropic sesuai dokumentasi.",
      },
    },
    {
      id: "f3-code-request",
      layout: "CODE_MOCKUP",
      props: {
        title: "Kirim request pertama.",
        integrationFactId: "f10-streaming-sse",
        windowTitle: "request.ts",
        steps: [
          "Panggil endpoint chat seperti biasa.",
          "Streaming SSE didokumentasikan di docs.",
          "Kalau ditolak: cek kuota, allowlist model, dan auth.",
        ],
        caption: "API keys dan usage tersedia sebagai bagian console.",
      },
    },
    {
      id: "f4-model-catalog",
      layout: "MODEL_CATALOG",
      props: {
        title: "Tiga provider. Satu gateway.",
        subline: "Akses dan harga mengikuti paket yang kamu beli.",
        models: [
          {
            provider: "GLM",
            availabilityFactId: "f11-provider-catalog",
            label: "GLM 5.3 Flash",
            description: "Entry pass: 50 juta token, berlaku 7 hari.",
            capabilityFactIds: ["f06-model-access"],
          },
          {
            provider: "DEEPSEEK",
            availabilityFactId: "f11-provider-catalog",
            label: "DeepSeek V4.1 Flash",
            description: "Tersedia pada pass dan paket bundling dalam katalog.",
            capabilityFactIds: ["f06-model-access"],
          },
          {
            provider: "GEMINI",
            availabilityFactId: "f11-provider-catalog",
            label: "Gemini 3.8 Flash",
            description: "Ada pass tersendiri. Cek kuota dan masa berlaku sebelum beli.",
            capabilityFactIds: ["f06-model-access"],
          },
        ],
      },
    },
    {
      id: "f5-pricing-offer",
      layout: "PRICING_OFFER",
      props: {
        title: "Mulai dari GLM 5.3 Flash.",
        offerFactId: "f02-entry-glm-offer",
        quotaLabel: "Kuota paket",
        supportingText: "Akses model glm-5.3-flash. Bayar paket pakai QRIS.",
        ctaLabel: "Baca docs & ambil key",
        ctaTargetFactId: "f03-payment-qris",
        termsNote:
          "Harga paket. Belum termasuk biaya layanan checkout. Verifikasi email sebelum membeli.",
      },
    },
  ],
};

export const FIXTURES: readonly { id: string; label: string; note: string; manifest: Manifest }[] = [
  {
    id: "empty",
    label: "Empty campaign",
    note: "Satu slide minimal, siap diisi.",
    manifest: emptyCampaign,
  },
  {
    id: "campaign-a",
    label: "Campaign A — sample",
    note: "Lima slide dari briefs/06. Slide A3 tetap draft: fact integrasi Cursor masih PENDING.",
    manifest: campaignASample,
  },
  {
    id: "campaign-dev",
    label: "Campaign Dev — OpenAI-compatible",
    note: "Lima slide untuk developer. Semua fact PUBLIC, siap menuju export final.",
    manifest: campaignDevSample,
  },
  {
    id: "campaign-night-launch",
    label: "Campaign F — Deploy Malam Ini",
    note: "Lima slide request API pertama. Slide 4 punya kartu model GLM/DeepSeek/Gemini — logo resmi masih MISSING (slot draft).",
    manifest: campaignNightLaunchSample,
  },
  {
    id: "comparison-draft",
    label: "Campaign E — DRAFT",
    note: "Comparison shell. Comparator belum terverifikasi, export diblokir.",
    manifest: comparisonDraftSample,
  },
];
