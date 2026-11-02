export const SCHEMA_VERSION = "1.0.0" as const;
export const DESIGN_REVISION = "swiss-tech-v1" as const;
export const FACTS_REVISION = "product-facts-v1" as const;

export const FORMAT_IDS = ["IG_CAROUSEL", "VERTICAL"] as const;
export type FormatId = (typeof FORMAT_IDS)[number];

export const VERTICAL_PROFILE_IDS = ["IG_STORY", "TIKTOK"] as const;
export type VerticalProfileId = (typeof VERTICAL_PROFILE_IDS)[number];

export const PROFILE_IDS = ["IG_CAROUSEL", "IG_STORY", "TIKTOK"] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];

export const LAYOUT_KEYS = [
  "HERO_HOOK",
  "PROBLEM_COMPARISON",
  "MODEL_CATALOG",
  "CODE_MOCKUP",
  "PRICING_OFFER",
] as const;
export type LayoutKey = (typeof LAYOUT_KEYS)[number];

export const PROFILE_LABELS: Record<ProfileId, string> = {
  IG_CAROUSEL: "Feed 4:5",
  IG_STORY: "Story 9:16",
  TIKTOK: "TikTok 9:16",
};

/** Canvas and safe insets in CSS pixels. EXECUTION_PLAN.md §4.2. */
export interface SafeProfile {
  id: ProfileId;
  format: FormatId;
  label: string;
  canvas: { width: number; height: number };
  inset: { left: number; top: number; right: number; bottom: number };
}

export const SAFE_PROFILES: Record<ProfileId, SafeProfile> = {
  IG_CAROUSEL: {
    id: "IG_CAROUSEL",
    format: "IG_CAROUSEL",
    label: "Feed 4:5",
    canvas: { width: 1080, height: 1350 },
    inset: { left: 80, top: 80, right: 80, bottom: 80 },
  },
  IG_STORY: {
    id: "IG_STORY",
    format: "VERTICAL",
    label: "Story 9:16",
    canvas: { width: 1080, height: 1920 },
    inset: { left: 80, top: 140, right: 80, bottom: 160 },
  },
  TIKTOK: {
    id: "TIKTOK",
    format: "VERTICAL",
    label: "TikTok 9:16 (conservative)",
    canvas: { width: 1080, height: 1920 },
    inset: { left: 80, top: 140, right: 180, bottom: 420 },
  },
};

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function safeRect(profile: SafeProfile): Rect {
  const { canvas, inset } = profile;
  return {
    x: inset.left,
    y: inset.top,
    width: canvas.width - inset.left - inset.right,
    height: canvas.height - inset.top - inset.bottom,
  };
}

/** Slide formats map to a default preview profile. */
export function defaultProfileFor(format: FormatId): ProfileId {
  return format === "IG_CAROUSEL" ? "IG_CAROUSEL" : "IG_STORY";
}
