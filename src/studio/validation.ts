import { parseManifest, type Manifest } from "../contracts/campaign.schema";
import type { StudioIssue } from "../contracts/errors";
import { findFact } from "../facts/registry";
import { isExportableAsset } from "../assets/registry";
import { BLUEPRINTS } from "../blueprints/registry";

export type SlideStatus = "valid" | "draft" | "error";

export interface SlideValidation {
  index: number;
  id: string;
  layout: string;
  status: SlideStatus;
  issues: readonly StudioIssue[];
}

export interface CampaignValidation {
  parseOk: boolean;
  manifest: Manifest | null;
  issues: readonly StudioIssue[];
  slides: readonly SlideValidation[];
  counts: { total: number; valid: number; draft: number; error: number };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Asset/fact gates that keep a slide in draft rather than failing it outright. */
function gatingIssues(slide: unknown): StudioIssue[] {
  const out: StudioIssue[] = [];
  if (!isRecord(slide)) return out;
  const layout = slide.layout;
  if (typeof layout !== "string" || !(layout in BLUEPRINTS)) return out;
  const descriptor = BLUEPRINTS[layout as keyof typeof BLUEPRINTS];

  for (const assetId of descriptor.requiredAssetIds) {
    if (!isExportableAsset(assetId)) {
      out.push({
        code: "ASSET_MISSING",
        path: `assets.${assetId}`,
        message: `Asset "${assetId}" belum approved: final export diblokir.`,
      });
    }
  }

  /* Fact references present in this slide's props. */
  const props = isRecord(slide.props) ? slide.props : {};
  const referenced = new Set<string>();
  const walk = (value: unknown, key: string): void => {
    if (Array.isArray(value)) {
      for (const item of value) walk(item, key);
      return;
    }
    if (isRecord(value)) {
      for (const [k, v] of Object.entries(value)) walk(v, k);
      return;
    }
    if (typeof value === "string" && /FactId$/.test(key)) referenced.add(value);
  };
  walk(props, "");

  for (const factId of referenced) {
    const fact = findFact(factId);
    if (!fact) {
      out.push({
        code: "FACT_MISSING",
        path: `facts.${factId}`,
        message: `Fact "${factId}" tidak ada di snapshot product facts.`,
      });
    } else if (fact.status === "PENDING") {
      out.push({
        code: "FACT_UNVERIFIED",
        path: `facts.${factId}`,
        message: `Fact "${factId}" masih PENDING: ${fact.claim}`,
      });
    }
  }
  return out;
}

/** Slide-level issues from a whole-document parse, filtered to one index. */
function issuesForSlide(issues: readonly StudioIssue[], index: number): StudioIssue[] {
  const prefixes = [`slides.${index}.`, `slides.${index}`];
  return issues.filter((i) => i.path.startsWith(prefixes[0]!) || i.path === prefixes[1]);
}

export function validateDoc(doc: unknown): CampaignValidation {
  const result = parseManifest(doc);
  const rawSlides = isRecord(doc) && Array.isArray(doc.slides) ? doc.slides : [];

  const slides: SlideValidation[] = rawSlides.map((slide, index) => {
    const layout = isRecord(slide) && typeof slide.layout === "string" ? slide.layout : "(tidak dikenal)";
    const id = isRecord(slide) && typeof slide.id === "string" ? slide.id : `#${index + 1}`;
    const own = result.ok ? [] : issuesForSlide(result.issues, index);
    const gating = gatingIssues(slide);
    const issues = [...own, ...gating];

    /**
     * A slide can be schema-valid and still be a draft: unresolved assets and
     * unverified fact references block export without breaking editing.
     */
    const status: SlideStatus =
      own.length > 0 ? "error" : gating.length > 0 ? "draft" : "valid";
    return { index, id, layout, status, issues };
  });

  const counts = {
    total: slides.length,
    valid: slides.filter((s) => s.status === "valid").length,
    draft: slides.filter((s) => s.status === "draft").length,
    error: slides.filter((s) => s.status === "error").length,
  };

  return {
    parseOk: result.ok,
    manifest: result.ok ? result.manifest : null,
    issues: result.ok ? [] : result.issues,
    slides,
    counts,
  };
}

/** Whole-document readiness summary for the Overview page. */
export function overallStatus(v: CampaignValidation): SlideStatus {
  if (!v.parseOk || v.counts.error > 0) return "error";
  if (v.counts.draft > 0) return "draft";
  return "valid";
}
