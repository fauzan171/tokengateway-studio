import type { LayoutKey } from "../contracts/formats";
import type { BlueprintDescriptor } from "./descriptors";

/** Static allowlist. JSON can only select a key, never inject a module path. */
export const BLUEPRINTS: Record<LayoutKey, BlueprintDescriptor> = {
  HERO_HOOK: {
    key: "HERO_HOOK",
    version: "1.0.0",
    title: "Hero hook",
    summary: "Kategori, judul dominan dengan satu highlight cyan, subline, footer brand.",
    requiredAssetIds: ["tokengateway.mark"],
    requiredFactIds: [],
    slots: [
      { path: "title", label: "Title", kind: "longtext", required: true, maxLength: 110, hint: "Maks 4 baris. Highlight harus muncul tepat sekali." },
      { path: "highlight", label: "Highlight", kind: "text", required: true, maxLength: 30, hint: "Substring dari title, ditampilkan cyan." },
      { path: "categoryTag", label: "Category tag", kind: "text", required: true, maxLength: 36, hint: "Maks 2 baris, huruf kapital." },
      { path: "subline", label: "Subline", kind: "longtext", required: true, maxLength: 180, hint: "Maks 4 baris. Terms tetap terbaca." },
    ],
  },

  PROBLEM_COMPARISON: {
    key: "PROBLEM_COMPARISON",
    version: "1.0.0",
    title: "Problem comparison",
    summary: "Dua kolom: friksi langganan/kartu di kiri, QRIS dan entry di kanan.",
    requiredAssetIds: ["qris.badge"],
    requiredFactIds: [],
    slots: [
      { path: "title", label: "Title", kind: "longtext", required: true, maxLength: 80 },
      { path: "comparatorFactId", label: "Comparator fact ID", kind: "factRef", required: true, hint: "Harus fact terverifikasi. $20/bulan belum punya bukti." },
      { path: "offerFactId", label: "Offer fact ID", kind: "factRef", required: true, hint: "Contoh: f02-entry-glm-offer." },
      { path: "leftLabel", label: "Label kiri", kind: "text", required: true, maxLength: 32 },
      { path: "rightLabel", label: "Label kanan", kind: "text", required: true, maxLength: 32 },
      {
        path: "rows",
        label: "Baris",
        kind: "list",
        required: true,
        minItems: 2,
        maxItems: 3,
        item: [
          { path: "left", label: "Kiri", kind: "text", required: true, maxLength: 70 },
          { path: "right", label: "Kanan", kind: "text", required: true, maxLength: 70 },
        ],
      },
      { path: "note", label: "Note", kind: "longtext", required: false, maxLength: 140 },
    ],
  },

  MODEL_CATALOG: {
    key: "MODEL_CATALOG",
    version: "1.0.0",
    title: "Model catalog",
    summary: "Tiga kartu model penuh lebar dengan provider mark autentik.",
    requiredAssetIds: ["glm.z", "deepseek.whale", "gemini.sparkle"],
    requiredFactIds: [],
    slots: [
      { path: "title", label: "Title", kind: "longtext", required: true, maxLength: 80 },
      { path: "subline", label: "Subline", kind: "longtext", required: false, maxLength: 140 },
      {
        path: "models",
        label: "Models",
        kind: "list",
        required: true,
        minItems: 3,
        maxItems: 3,
        item: [
          { path: "provider", label: "Provider", kind: "text", required: true, hint: "GLM, DEEPSEEK atau GEMINI — masing-masing sekali." },
          { path: "availabilityFactId", label: "Availability fact ID", kind: "factRef", required: true },
          { path: "label", label: "Label", kind: "text", required: true, maxLength: 32 },
          { path: "description", label: "Deskripsi", kind: "longtext", required: true, maxLength: 90 },
          { path: "capabilityFactIds", label: "Capability fact IDs", kind: "factRef", required: false },
        ],
      },
    ],
  },

  CODE_MOCKUP: {
    key: "CODE_MOCKUP",
    version: "1.0.0",
    title: "Code mockup",
    summary: "Kartu IDE dengan base URL dan model ID, key placeholder.",
    requiredAssetIds: ["tokengateway.mark"],
    requiredFactIds: ["f01-base-url"],
    slots: [
      { path: "title", label: "Title", kind: "longtext", required: true, maxLength: 80 },
      { path: "integrationFactId", label: "Integration fact ID", kind: "factRef", required: true, hint: "f13-cursor-steps masih PENDING: slide ini tidak bisa final export." },
      { path: "windowTitle", label: "Window title", kind: "text", required: false, maxLength: 40 },
      {
        path: "steps",
        label: "Langkah",
        kind: "list",
        required: true,
        minItems: 2,
        maxItems: 4,
        item: [{ path: "", label: "Langkah", kind: "text", required: true, maxLength: 90 }],
      },
      { path: "caption", label: "Caption", kind: "longtext", required: false, maxLength: 140 },
    ],
  },

  PRICING_OFFER: {
    key: "PRICING_OFFER",
    version: "1.0.0",
    title: "Pricing offer",
    summary: "Panel offer dominan: kuota mono, harga IDR sans, QRIS badge, CTA footer.",
    requiredAssetIds: ["qris.badge"],
    requiredFactIds: [],
    slots: [
      { path: "title", label: "Title", kind: "longtext", required: true, maxLength: 80 },
      { path: "offerFactId", label: "Offer fact ID", kind: "factRef", required: true, hint: "Contoh: f02-entry-glm-offer." },
      { path: "quotaLabel", label: "Label kuota", kind: "text", required: true, maxLength: 32, hint: "Label harus cocok dengan offer kind." },
      { path: "supportingText", label: "Supporting text", kind: "longtext", required: true, maxLength: 140 },
      { path: "ctaLabel", label: "Label CTA", kind: "text", required: true, maxLength: 40 },
      { path: "ctaTargetFactId", label: "CTA target fact ID", kind: "factRef", required: true },
      { path: "termsNote", label: "Terms note", kind: "longtext", required: false, maxLength: 180 },
    ],
  },
};

