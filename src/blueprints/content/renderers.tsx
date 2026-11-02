/* Real five-layout content renderers. Vertical re-layout per profile — never
   a stretched feed. Interface-compatible with LayoutRenderer/RenderResult.
   finalExportAvailable stays false: asset approvals and font provenance sign-off
   are pending (see assets/registry.ts, public/fonts/provenance.json). */
import type { ReactNode } from "react";
import type { Slide } from "../../contracts/campaign.schema";
import type { StudioIssue } from "../../contracts/errors";
import type { Rect, SafeProfile } from "../../contracts/formats";
import { findAsset } from "../../assets/registry";
import { findFact } from "../../facts/registry";
import {
  CONTENT_BADGE,
  CONTENT_RENDERER_BLOCKED_REASON,
  type LayoutRenderer,
  type RenderContext,
  type RenderResult,
  type SlotRegion,
} from "../../canvas/renderer";
import { BLUEPRINTS } from "../catalog";
import type { SlotDescriptor } from "../descriptors";
import { fitText, highlightCount, slotsWithinSafe } from "./fit";
import {
  BrandLockup,
  CategoryTag,
  CodeWindow,
  ComparisonPanel,
  CTAFooter,
  Headline,
  ModelCard,
  PriceBlock,
  QRISBadge,
  QuotaBlock,
  ThirdPartyMarkSlot,
  offerOf,
} from "./primitives";

/* ── path read (same contract as draft renderer) ────────────────────────── */
function readPath(props: unknown, path: string): string[] {
  const listSplit = path.indexOf("[].");
  if (listSplit !== -1) {
    const head = path.slice(0, listSplit);
    const rest = path.slice(listSplit + 3);
    const arr = (props as Record<string, unknown>)[head];
    if (!Array.isArray(arr)) return [];
    return arr.map((item) => readPath(item, rest).join(" ")).filter(Boolean);
  }
  const value = (props as Record<string, unknown>)[path];
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.map((v) => String(v));
  return [String(value)];
}

function collectFactIds(slot: SlotDescriptor, props: unknown, into: Set<string>): void {
  if (slot.kind === "factRef") {
    for (const v of readPath(props, slot.path)) if (v) into.add(v);
  }
  if (slot.kind === "list" && slot.item) {
    const split = slot.path.indexOf("[].");
    const head = split === -1 ? slot.path.replace("[]", "") : slot.path.slice(0, split);
    const arr = (props as Record<string, unknown>)[head];
    if (Array.isArray(arr)) for (const item of arr) for (const child of slot.item) collectFactIds(child, item, into);
  }
}

/** Registry-level gating identical to validation.ts: keep draft, keep blocked. */
function gatingIssues(slide: Slide): StudioIssue[] {
  const out: StudioIssue[] = [];
  const descriptor = BLUEPRINTS[slide.layout];
  for (const assetId of descriptor.requiredAssetIds) {
    const rec = findAsset(assetId);
    if (!rec) out.push({ code: "ASSET_MISSING", path: `assets.${assetId}`, message: `Asset "${assetId}" belum approved.` });
    else if (rec.status === "RASTER_REFERENCE")
      out.push({ code: "ASSET_NOT_VECTOR", path: `assets.${assetId}`, message: `${rec.label}: raster reference, bukan vector.` });
    else if (rec.status !== "APPROVED_VECTOR")
      out.push({ code: "ASSET_MISSING", path: `assets.${assetId}`, message: `${rec.label}: belum ada file approved.` });
  }
  const factIds = new Set<string>(descriptor.requiredFactIds);
  for (const slot of descriptor.slots) collectFactIds(slot, slide.props, factIds);
  for (const factId of factIds) {
    if (!factId) continue;
    const fact = findFact(factId);
    if (!fact) out.push({ code: "FACT_MISSING", path: `facts.${factId}`, message: `Fact "${factId}" tidak ada di snapshot.` });
    else if (fact.status === "PENDING")
      out.push({ code: "FACT_UNVERIFIED", path: `facts.${factId}`, message: `Fact "${factId}" masih PENDING: ${fact.claim}` });
  }
  return out;
}

/* ── per-profile vertical stack builder ──────────────────────────────────── */
interface Panel {
  id: string;
  label: string;
  node: ReactNode;
  /** Estimated height share of the safe area. */
  weight: number;
  fit?: { text: string; role: Parameters<typeof fitText>[0]["role"] };
}

function stackPanels(panels: readonly Panel[], safe: Rect, gap: number): { rects: Rect[]; heightUsed: number } {
  const total = panels.reduce((s, p) => s + p.weight, 0) || 1;
  const gaps = gap * Math.max(0, panels.length - 1);
  const available = Math.max(0, safe.height - gaps);
  const bottom = safe.y + safe.height;
  let cursor = safe.y;
  const rects = panels.map((p, i) => {
    const h = Math.round((available * p.weight) / total);
    // Last panel takes the remainder so rounding never pushes it past safe.
    const height = i === panels.length - 1 ? Math.max(0, bottom - cursor) : h;
    const r: Rect = { x: safe.x, y: cursor, width: safe.width, height };
    cursor += height + gap;
    return r;
  });
  return { rects, heightUsed: cursor - gap - safe.y };
}

function slotRegion(rect: Rect, path: string, label: string): SlotRegion {
  return { path: `props.${path}`, label, rect };
}

/* ── HERO_HOOK ───────────────────────────────────────────────────────────── */
function renderHeroHook(slide: Slide, ctx: RenderContext): RenderResult {
  const p = slide.props as Record<string, string>;
  const issues: StudioIssue[] = [];
  const safe = ctx.safe;
  const panels: Panel[] = [];
  const tag = p.categoryTag ?? "";
  const title = p.title ?? "";
  const highlight = p.highlight ?? "";
  const subline = p.subline ?? "";

  const hlCount = highlightCount(title, highlight);
  if (highlight && hlCount !== 1) {
    issues.push({ code: "TEXT_OVERFLOW", path: "props.highlight", message: `Highlight harus muncul tepat sekali di title (ditemukan ${hlCount}).` });
  }

  const titleFit = fitText({ text: title, width: safe.width, height: safe.height * 0.34, role: "layoutTitle" });
  issues.push(...titleFit.issues);

  panels.push(
    { id: "categoryTag", label: "Category tag", weight: 0.8, node: tag ? <CategoryTag tag={tag} /> : null },
    {
      id: "title",
      label: "Title",
      weight: 3,
      node: (
        <div style={{ fontSize: titleFit.fontSize, lineHeight: titleFit.lineHeight }}>
          <Headline title={title} highlight={highlight} role="layoutTitle" />
        </div>
      ),
    },
    {
      id: "subline",
      label: "Subline",
      weight: 1.6,
      node: (
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: 30,
            lineHeight: 1.35,
            color: "#AEBBC8",
            whiteSpace: "pre-wrap",
          }}
        >
          {subline}
        </div>
      ),
    },
  );

  const { rects } = stackPanels(panels, safe, 32);
  const slots: SlotRegion[] = [];
  const nodes: ReactNode[] = panels.map((panel, i) => {
    const rect = rects[i]!;
    slots.push(slotRegion(rect, panel.id, panel.label));
    return (
      <div key={panel.id} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, overflow: "hidden" }}>
        {panel.node}
      </div>
    );
  });

  return finish(slide, ctx, issues, slots, [
    ...nodes,
    <div
      key="__brand"
      style={{
        position: "absolute",
        left: safe.x,
        top: safe.y + safe.height - 48,
        width: safe.width,
        fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
        fontSize: 22,
        color: "#F4F7FA",
      }}
    >
      <BrandLockup asset={findAsset("tokengateway.mark")} />
    </div>,
  ]);
}

/* ── PROBLEM_COMPARISON ──────────────────────────────────────────────────── */
function renderComparison(slide: Slide, ctx: RenderContext): RenderResult {
  const p = slide.props as {
    title?: string;
    comparatorFactId?: string;
    offerFactId?: string;
    leftLabel?: string;
    rightLabel?: string;
    rows?: { left: string; right: string }[];
    note?: string;
  };
  const issues: StudioIssue[] = [];
  const safe = ctx.safe;
  const comparator = findFact(p.comparatorFactId ?? "");
  const offer = offerOf(p.offerFactId ?? "");

  const comparatorCell =
    comparator && comparator.status !== "PENDING" && comparator.value ? (
      <PriceBlock factId={p.comparatorFactId!} />
    ) : (
      <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace", fontSize: 20, color: "#FFB020" }}>
        Comparator belum terverifikasi — angka tidak ditampilkan.
      </div>
    );
  const offerCell = offer ? <PriceBlock factId={p.offerFactId!} /> : null;

  const titleFit = fitText({ text: p.title ?? "", width: safe.width, height: safe.height * 0.16, role: "layoutTitle" });
  issues.push(...titleFit.issues);

  const panels: Panel[] = [
    { id: "title", label: "Title", weight: 1.2, node: <Headline title={p.title ?? ""} highlight="" role="layoutTitle" /> },
    {
      id: "rows",
      label: "Comparison",
      weight: 3.2,
      node: (
        <ComparisonPanel
          leftLabel={p.leftLabel ?? ""}
          rightLabel={p.rightLabel ?? ""}
          rows={p.rows ?? []}
          leftCell={comparatorCell}
          rightCell={offerCell}
        />
      ),
    },
    {
      id: "note",
      label: "Note",
      weight: 0.9,
      node: (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, lineHeight: 1.35, color: "#AEBBC8", whiteSpace: "pre-wrap" }}>
          {p.note ?? ""}
        </div>
      ),
    },
  ];

  const { rects } = stackPanels(panels, safe, 28);
  const slots: SlotRegion[] = [];
  const nodes: ReactNode[] = panels.map((panel, i) => {
    const rect = rects[i]!;
    slots.push(slotRegion(rect, panel.id, panel.label));
    return (
      <div key={panel.id} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, overflow: "hidden" }}>
        {panel.node}
      </div>
    );
  });
  return finish(slide, ctx, issues, slots, nodes);
}

/* ── MODEL_CATALOG ───────────────────────────────────────────────────────── */
function renderCatalog(slide: Slide, ctx: RenderContext): RenderResult {
  const p = slide.props as {
    title?: string;
    subline?: string;
    models?: { provider: string; label: string; description: string }[];
  };
  const issues: StudioIssue[] = [];
  const safe = ctx.safe;
  const titleFit = fitText({ text: p.title ?? "", width: safe.width, height: safe.height * 0.12, role: "layoutTitle" });
  issues.push(...titleFit.issues);

  const panels: Panel[] = [
    { id: "title", label: "Title", weight: 1, node: <Headline title={p.title ?? ""} highlight="" role="layoutTitle" /> },
  ];
  for (const [i, m] of (p.models ?? []).entries()) {
    panels.push({
      id: `models[].${i}`,
      label: `Model ${i + 1}`,
      weight: 1.4,
      node: (
        <ModelCard
          provider={m.provider}
          label={m.label}
          description={m.description}
          markSlot={<ThirdPartyMarkSlot asset={findAsset(m.provider === "GLM" ? "glm.z" : m.provider === "DEEPSEEK" ? "deepseek.whale" : "gemini.sparkle")} />}
        />
      ),
    });
  }

  const { rects } = stackPanels(panels, safe, 20);
  const slots: SlotRegion[] = [];
  const nodes: ReactNode[] = panels.map((panel, i) => {
    const rect = rects[i]!;
    slots.push(slotRegion(rect, panel.id, panel.label));
    return (
      <div key={panel.id} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, overflow: "hidden" }}>
        {panel.node}
      </div>
    );
  });
  return finish(slide, ctx, issues, slots, nodes);
}

/* ── CODE_MOCKUP ─────────────────────────────────────────────────────────── */
function renderCode(slide: Slide, ctx: RenderContext): RenderResult {
  const p = slide.props as {
    title?: string;
    integrationFactId?: string;
    windowTitle?: string;
    steps?: string[];
    caption?: string;
  };
  const issues: StudioIssue[] = [];
  const safe = ctx.safe;
  const integration = findFact(p.integrationFactId ?? "");
  if (integration?.status === "PENDING") {
    issues.push({
      code: "FACT_UNVERIFIED",
      path: "props.integrationFactId",
      message: `Integrasi "${p.integrationFactId}" masih PENDING — langkah tool spesifik tidak ditampilkan.`,
    });
  }
  // ponytail: model id hardcoded glm-5.3-flash; swap to availability fact when
  // CODE_MOCKUP schema grows a modelFactId slot.
  const titleFit = fitText({ text: p.title ?? "", width: safe.width, height: safe.height * 0.12, role: "layoutTitle" });
  issues.push(...titleFit.issues);

  const panels: Panel[] = [
    { id: "title", label: "Title", weight: 1, node: <Headline title={p.title ?? ""} highlight="" role="layoutTitle" /> },
    {
      id: "window",
      label: "Code window",
      weight: 3,
      node: (
        <CodeWindow
          windowTitle={p.windowTitle ?? "TokenGateway — API Setup"}
          baseUrlFactId="f01-base-url"
          modelId="glm-5.3-flash"
          steps={p.steps ?? []}
        />
      ),
    },
    {
      id: "caption",
      label: "Caption",
      weight: 0.8,
      node: (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, lineHeight: 1.35, color: "#AEBBC8", whiteSpace: "pre-wrap" }}>
          {p.caption ?? ""}
        </div>
      ),
    },
  ];

  const { rects } = stackPanels(panels, safe, 24);
  const slots: SlotRegion[] = [];
  const nodes: ReactNode[] = panels.map((panel, i) => {
    const rect = rects[i]!;
    slots.push(slotRegion(rect, panel.id, panel.label));
    return (
      <div key={panel.id} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, overflow: "hidden" }}>
        {panel.node}
      </div>
    );
  });
  return finish(slide, ctx, issues, slots, nodes);
}

/* ── PRICING_OFFER ───────────────────────────────────────────────────────── */
function renderPricing(slide: Slide, ctx: RenderContext): RenderResult {
  const p = slide.props as {
    title?: string;
    offerFactId?: string;
    quotaLabel?: string;
    supportingText?: string;
    ctaLabel?: string;
    ctaTargetFactId?: string;
    termsNote?: string;
  };
  const issues: StudioIssue[] = [];
  const safe = ctx.safe;
  const offer = offerOf(p.offerFactId ?? "");
  const ctaTarget = findFact(p.ctaTargetFactId ?? "");
  const titleFit = fitText({ text: p.title ?? "", width: safe.width, height: safe.height * 0.12, role: "layoutTitle" });
  issues.push(...titleFit.issues);

  const panels: Panel[] = [
    { id: "title", label: "Title", weight: 1, node: <Headline title={p.title ?? ""} highlight="" role="layoutTitle" /> },
    {
      id: "offer",
      label: "Offer",
      weight: 2.2,
      node: (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace", fontSize: 24, color: "#AEBBC8" }}>
            {p.quotaLabel}
          </div>
          <QuotaBlock offer={offer} />
          <PriceBlock factId={p.offerFactId ?? ""} />
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, lineHeight: 1.35, color: "#F4F7FA" }}>
            {p.supportingText}
          </div>
        </div>
      ),
    },
    { id: "qris", label: "QRIS", weight: 0.9, node: <QRISBadge asset={findAsset("qris.badge")} /> },
    {
      id: "terms",
      label: "Terms",
      weight: 0.9,
      node: (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, lineHeight: 1.35, color: "#AEBBC8", whiteSpace: "pre-wrap" }}>
          {p.termsNote ?? ""}
          {ctaTarget ? ` ${ctaTarget.claim}` : ""}
        </div>
      ),
    },
  ];

  const { rects } = stackPanels(panels, safe, 24);
  const slots: SlotRegion[] = [];
  const nodes: ReactNode[] = panels.map((panel, i) => {
    const rect = rects[i]!;
    slots.push(slotRegion(rect, panel.id, panel.label));
    return (
      <div key={panel.id} style={{ position: "absolute", left: rect.x, top: rect.y, width: rect.width, height: rect.height, overflow: "hidden" }}>
        {panel.node}
      </div>
    );
  });
  nodes.push(
    <div key="__cta" style={{ position: "absolute", left: safe.x, top: safe.y + safe.height - 88, width: safe.width }}>
      <CTAFooter label={p.ctaLabel ?? ""} />
    </div>,
  );
  return finish(slide, ctx, issues, slots, nodes);
}

/* ── shared finish: readiness, safe check, badge ─────────────────────────── */
function finish(
  slide: Slide,
  ctx: RenderContext,
  issues: StudioIssue[],
  slots: readonly SlotRegion[],
  nodes: readonly ReactNode[],
): RenderResult {
  const gating = gatingIssues(slide);
  const allIssues = [...gating, ...issues];
  const geometry = slotsWithinSafe(slots.map((s) => s.rect), ctx.safe);
  const readiness: RenderResult["readiness"] = {
    status: "draft",
    finalExportAvailable: false, // gated until asset/fact/font/geometry approvals pass
    errors: [...allIssues, ...geometry],
    blockedReason: CONTENT_RENDERER_BLOCKED_REASON,
  };
  const badge = (
    <div
      key="__badge"
      style={{
        position: "absolute",
        left: ctx.safe.x,
        top: Math.max(4, ctx.safe.y - 34),
        fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
        fontSize: 16,
        letterSpacing: "0.06em",
        color: "#FFB020",
      }}
    >
      {CONTENT_BADGE}
    </div>
  );
  return { content: [badge, ...nodes], readiness, slots };
}

function makeRenderer(key: Slide["layout"], render: (slide: Slide, ctx: RenderContext) => RenderResult): LayoutRenderer {
  return {
    key,
    version: BLUEPRINTS[key].version,
    supportedFormats: ["IG_CAROUSEL", "VERTICAL"],
    render,
  };
}

export const contentRenderers: Record<Slide["layout"], LayoutRenderer> = {
  HERO_HOOK: makeRenderer("HERO_HOOK", renderHeroHook),
  PROBLEM_COMPARISON: makeRenderer("PROBLEM_COMPARISON", renderComparison),
  MODEL_CATALOG: makeRenderer("MODEL_CATALOG", renderCatalog),
  CODE_MOCKUP: makeRenderer("CODE_MOCKUP", renderCode),
  PRICING_OFFER: makeRenderer("PRICING_OFFER", renderPricing),
};

export type { SafeProfile };
