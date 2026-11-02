import { z } from "zod";
import {
  DESIGN_REVISION,
  FACTS_REVISION,
  FORMAT_IDS,
  LAYOUT_KEYS,
  SCHEMA_VERSION,
  VERTICAL_PROFILE_IDS,
} from "./formats";
import { issue, type StudioIssue } from "./errors";

/* ── primitives ─────────────────────────────────────────────────────────── */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slug = z
  .string()
  .min(1, "ID tidak boleh kosong")
  .max(64, "ID maksimal 64 karakter")
  .regex(SLUG_RE, "ID harus slug huruf kecil, angka dan tanda hubung");

/** Rejects control characters and HTML-ish payloads from any user copy field. */
const plainText = (max: number, label: string) =>
  z
    .string()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`)
    .refine((v) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(v), {
      message: `${label} memuat karakter kontrol`,
    })
    .refine((v) => !/<\s*\/?\s*[a-zA-Z!]/.test(v), {
      message: `${label} tidak boleh memuat markup HTML/SVG`,
    });

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, `${label} maksimal ${max} karakter`)
    .refine((v) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(v), {
      message: `${label} memuat karakter kontrol`,
    })
    .refine((v) => !/<\s*\/?\s*[a-zA-Z!]/.test(v), {
      message: `${label} tidak boleh memuat markup HTML/SVG`,
    })
    .optional();

/** Rejects payload keys that must never travel in a manifest. */
const NO_SECRET_RE = /(sk-[A-Za-z0-9]{8,}|tk-gw-[A-Za-z0-9]{6,}|BEGIN [A-Z ]*PRIVATE KEY)/;

/* ── layout prop schemas ────────────────────────────────────────────────── */

const heroHookProps = z.strictObject({
  title: plainText(110, "Title"),
  highlight: plainText(30, "Highlight"),
  categoryTag: plainText(36, "Category tag"),
  subline: plainText(180, "Subline"),
});

const comparisonRow = z.strictObject({
  left: plainText(70, "Kolom kiri"),
  right: plainText(70, "Kolom kanan"),
});

const problemComparisonProps = z.strictObject({
  title: plainText(80, "Title"),
  comparatorFactId: slug,
  offerFactId: slug,
  leftLabel: plainText(32, "Label kiri"),
  rightLabel: plainText(32, "Label kanan"),
  rows: z.array(comparisonRow).min(2, "Minimal 2 baris").max(3, "Maksimal 3 baris"),
  note: optionalText(140, "Note"),
});

const providerEnum = z.enum(["GLM", "DEEPSEEK", "GEMINI"]);

const catalogModel = z.strictObject({
  provider: providerEnum,
  availabilityFactId: slug,
  label: plainText(32, "Label model"),
  description: plainText(90, "Deskripsi model"),
  capabilityFactIds: z.array(slug).default([]),
});

const modelCatalogProps = z.strictObject({
  title: plainText(80, "Title"),
  subline: optionalText(140, "Subline"),
  models: z
    .array(catalogModel)
    .length(3, "Harus tepat 3 model")
    .refine((ms) => new Set(ms.map((m) => m.provider)).size === 3, {
      message: "Provider harus unik: GLM, DEEPSEEK, GEMINI masing-masing sekali",
    }),
});

const codeMockupProps = z.strictObject({
  title: plainText(80, "Title"),
  integrationFactId: slug,
  windowTitle: optionalText(40, "Window title"),
  steps: z.array(plainText(90, "Step")).min(2, "Minimal 2 langkah").max(4, "Maksimal 4 langkah"),
  caption: optionalText(140, "Caption"),
});

const pricingOfferProps = z.strictObject({
  title: plainText(80, "Title"),
  offerFactId: slug,
  quotaLabel: plainText(32, "Label kuota"),
  supportingText: plainText(140, "Supporting text"),
  ctaLabel: plainText(40, "Label CTA"),
  ctaTargetFactId: slug,
  termsNote: optionalText(180, "Terms note"),
});

/* ── slide ──────────────────────────────────────────────────────────────── */

/** Only copy slots are patchable per format. Assets, prices and facts are not. */
const formatOverridePatch = z.strictObject({
  title: optionalText(110, "Title"),
  subline: optionalText(180, "Subline"),
});

const formatOverrides = z
  .record(z.enum([...FORMAT_IDS, "ALL"]), formatOverridePatch)
  .optional();

const slideSchema = z.discriminatedUnion("layout", [
  z.strictObject({
    id: slug,
    layout: z.literal("HERO_HOOK"),
    props: heroHookProps,
    formatOverrides,
  }),
  z.strictObject({
    id: slug,
    layout: z.literal("PROBLEM_COMPARISON"),
    props: problemComparisonProps,
    formatOverrides,
  }),
  z.strictObject({
    id: slug,
    layout: z.literal("MODEL_CATALOG"),
    props: modelCatalogProps,
    formatOverrides,
  }),
  z.strictObject({
    id: slug,
    layout: z.literal("CODE_MOCKUP"),
    props: codeMockupProps,
    formatOverrides,
  }),
  z.strictObject({
    id: slug,
    layout: z.literal("PRICING_OFFER"),
    props: pricingOfferProps,
    formatOverrides,
  }),
]);

const campaignEnvelope = z.strictObject({
  schemaVersion: z.literal(SCHEMA_VERSION),
  campaignId: slug,
  name: plainText(100, "Nama campaign"),
  locale: z.literal("id-ID"),
  designRevision: z.literal(DESIGN_REVISION),
  factsRevision: z.literal(FACTS_REVISION),
  formats: z.array(z.enum(FORMAT_IDS)).min(1, "Pilih minimal satu format"),
  verticalProfiles: z.array(z.enum(VERTICAL_PROFILE_IDS)).default([]),
  slides: z.array(slideSchema).min(1, "Minimal 1 slide").max(30, "Maksimal 30 slide"),
});

export const manifestSchema = campaignEnvelope
  .refine((m) => new Set(m.formats).size === m.formats.length, {
    message: "Format tidak boleh duplikat",
    path: ["formats"],
  })
  .refine((m) => new Set(m.verticalProfiles).size === m.verticalProfiles.length, {
    message: "Vertical profile tidak boleh duplikat",
    path: ["verticalProfiles"],
  })
  .refine((m) => !m.formats.includes("VERTICAL") || m.verticalProfiles.length > 0, {
    message: "Format VERTICAL butuh minimal satu vertical profile",
    path: ["verticalProfiles"],
  })
  .refine((m) => new Set(m.slides.map((s) => s.id)).size === m.slides.length, {
    message: "ID slide harus unik",
    path: ["slides"],
  })
  .refine((m) => !m.slides.some((s) => NO_SECRET_RE.test(JSON.stringify(s.props))), {
    message: "Payload memuat nilai yang menyerupai kredensial nyata",
    path: ["slides"],
  });

export type Manifest = z.infer<typeof manifestSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type LayoutProps<K extends (typeof LAYOUT_KEYS)[number]> = Extract<
  Slide,
  { layout: K }
>["props"];
export type HeroHookProps = LayoutProps<"HERO_HOOK">;
export type ProblemComparisonProps = LayoutProps<"PROBLEM_COMPARISON">;
export type ModelCatalogProps = LayoutProps<"MODEL_CATALOG">;
export type CodeMockupProps = LayoutProps<"CODE_MOCKUP">;
export type PricingOfferProps = LayoutProps<"PRICING_OFFER">;

/* ── drafting (incomplete allowed) ──────────────────────────────────────── */

/** Every envelope field optional; a draft may be half-authored. */
export const draftSchema = campaignEnvelope.partial({
  name: true,
  formats: true,
  slides: true,
});
export type Draft = z.infer<typeof draftSchema>;

/* ── parse helpers ──────────────────────────────────────────────────────── */

export const MAX_MANIFEST_BYTES = 1024 * 1024;

export type ParseResult =
  | { ok: true; manifest: Manifest; issues: readonly StudioIssue[] }
  | { ok: false; issues: readonly StudioIssue[] };

function zodToIssues(error: z.ZodError): StudioIssue[] {
  return error.issues.map((i) => {
    const path = i.path.join(".");
    const code =
      i.path.includes("layout") && i.code === "invalid_union"
        ? ("UNKNOWN_LAYOUT" as const)
        : ("SCHEMA_INVALID" as const);
    return issue(code, path, path ? `${path}: ${i.message}` : i.message);
  });
}

function dedupeIssues(issues: readonly StudioIssue[]): StudioIssue[] {
  const seen = new Set<string>();
  return issues.filter((i) => {
    const key = `${i.code}|${i.path}|${i.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Parse unvalidated JSON into a full manifest. Never throws. */
export function parseManifest(value: unknown): ParseResult {
  const result = manifestSchema.safeParse(value);
  if (result.success) return { ok: true, manifest: result.data, issues: [] };

  const issues = dedupeIssues(zodToIssues(result.error));
  const dupes = result.error.issues.some((i) => i.message === "ID slide harus unik");
  if (dupes) issues.unshift(issue("DUPLICATE_SLIDE_ID", "slides", "ID slide harus unik"));
  return { ok: false, issues };
}

export type ImportResult =
  | { ok: true; manifest: Manifest; normalized: string }
  | { ok: false; issues: readonly StudioIssue[] };

/** Import: size gate → JSON parse → schema validate → canonical string. */
export function importManifestText(text: string): ImportResult {
  if (new TextEncoder().encode(text).length > MAX_MANIFEST_BYTES) {
    return {
      ok: false,
      issues: [issue("IMPORT_TOO_LARGE", "", "File melebihi batas 1 MiB")],
    };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return {
      ok: false,
      issues: [issue("JSON_PARSE", "", e instanceof Error ? e.message : "JSON tidak valid")],
    };
  }
  const result = parseManifest(parsed);
  if (!result.ok) return { ok: false, issues: result.issues };
  return { ok: true, manifest: result.manifest, normalized: canonicalJson(result.manifest) };
}

/** Deterministic key ordering; used for export and round-trip equality. */
export function canonicalJson(value: unknown): string {
  const normalize = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(normalize);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(v as Record<string, unknown>).sort()) {
        const child = (v as Record<string, unknown>)[key];
        if (child !== undefined) out[key] = normalize(child);
      }
      return out;
    }
    return v;
  };
  return JSON.stringify(normalize(value), null, 2);
}
