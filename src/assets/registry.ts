export type AssetStatus =
  | "APPROVED_VECTOR"
  | "RASTER_REFERENCE"
  | "MISSING"
  | "UNAPPROVED";

export interface AssetRecord {
  id: string;
  label: string;
  /** Who owns the mark. Only TokenGateway-owned marks may be drafted locally. */
  owner: "tokengateway" | "third-party";
  status: AssetStatus;
  /** Public path when a usable local file exists. */
  path?: string;
  source: string;
  retrievedAt: string;
  notes: string;
}

/**
 * Read-only inventory. No file in this session is an approved production vector:
 * the owner logo is a JPEG reference and third-party marks were not acquired.
 */
export const ASSET_REGISTRY: readonly AssetRecord[] = [
  {
    id: "tokengateway.mark",
    label: "TokenGateway hexagonal circuit node",
    owner: "tokengateway",
    status: "RASTER_REFERENCE",
    path: "/brand/tokengateway-logo-reference.jpeg",
    source: "briefs/assets/tokengateway-logo-reference.jpeg (owner-supplied JPEG, 2752x1536)",
    retrievedAt: "2026-10-12",
    notes:
      "JPEG, bukan vector. Latar gelap menyatu di gambar. Vector master belum disiapkan; menempel JPEG ke <image> di dalam SVG tidak memenuhi syarat.",
  },
  {
    id: "glm.z",
    label: "GLM angular Z",
    owner: "third-party",
    status: "MISSING",
    source: "belum diakuisisi; kandidat z.ai",
    retrievedAt: "2026-10-12",
    notes: "Varian white/cyan angular Z harus diverifikasi. Bentuk tebakan tidak diterima.",
  },
  {
    id: "deepseek.whale",
    label: "DeepSeek blue whale silhouette",
    owner: "third-party",
    status: "MISSING",
    source: "belum diakuisisi; kandidat deepseek.com",
    retrievedAt: "2026-10-12",
    notes: "Warna biru kanonik dipertahankan; tidak diseragamkan menjadi cyan.",
  },
  {
    id: "gemini.sparkle",
    label: "Gemini four-point sparkle",
    owner: "third-party",
    status: "MISSING",
    source: "belum diakuisisi; kandidat ai.google.dev",
    retrievedAt: "2026-10-12",
    notes: "Varian sparkle resmi harus dipastikan sebelum approval.",
  },
  {
    id: "qris.badge",
    label: "QRIS text badge",
    owner: "third-party",
    status: "MISSING",
    source: "belum diakuisisi; kandidat bi.go.id",
    retrievedAt: "2026-10-12",
    notes: "Harus word badge resmi, bukan QR matrix dekoratif.",
  },
];

export const ASSETS_BY_ID: ReadonlyMap<string, AssetRecord> = new Map(
  ASSET_REGISTRY.map((a) => [a.id, a]),
);

export function findAsset(id: string): AssetRecord | undefined {
  return ASSETS_BY_ID.get(id);
}

export function isExportableAsset(id: string): boolean {
  return findAsset(id)?.status === "APPROVED_VECTOR";
}
