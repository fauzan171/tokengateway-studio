import type { ReactNode } from "react";
import { LAYOUT_KEYS, PROFILE_IDS, type FormatId, type LayoutKey, type SafeProfile } from "../contracts/formats";
import type { Slide } from "../contracts/campaign.schema";
import { issue, type StudioIssue } from "../contracts/errors";
import { findAsset, isExportableAsset } from "../assets/registry";
import { findFact } from "../facts/registry";
import {
  DRAFT_BADGE,
  DRAFT_RENDERER_BLOCKED_REASON,
  type LayoutRenderer,
  type RenderContext,
  type RenderResult,
  type SlotRegion,
} from "../canvas/renderer";
import { stackRects } from "../canvas/geometry";
import { BLUEPRINTS } from "./catalog";
import type { SlotDescriptor } from "./descriptors";

/* ── path read ──────────────────────────────────────────────────────────── */

/** Supports `title` and `models[].label`. Returns a flat string list. */
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

/* ── draft composition ──────────────────────────────────────────────────── */

/** Weight is a share of the safe height; kinds keep the stack deterministic. */
function weightFor(slot: SlotDescriptor): number {
  if (slot.kind === "list") return 3;
  if (slot.kind === "longtext") return 2;
  return 1;
}

const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

function renderDraft(slide: Slide, ctx: RenderContext): RenderResult {
  const descriptor = BLUEPRINTS[slide.layout];
  const issues: StudioIssue[] = [];
  const { safe } = ctx;

  /* Resolve assets and facts for this layout, keeping unresolved ones pending. */
  const assetStatuses = descriptor.requiredAssetIds.map((id) => ({ id, record: findAsset(id) }));
  const missingAssets = assetStatuses.filter((a) => !isExportableAsset(a.id));
  for (const a of missingAssets) {
    issues.push(
      issue(
        a.record?.status === "RASTER_REFERENCE" ? "ASSET_NOT_VECTOR" : "ASSET_MISSING",
        `assets.${a.id}`,
        `${a.record?.label ?? a.id}: ${a.record?.status === "RASTER_REFERENCE" ? "raster reference, bukan vector" : "belum ada file approved"}`,
      ),
    );
  }

  const factIds = new Set<string>(descriptor.requiredFactIds);
  const collect = (slot: SlotDescriptor, props: unknown): void => {
    if (slot.kind === "factRef") {
      for (const value of readPath(props, slot.path)) factIds.add(value);
    }
    if (slot.kind === "list" && slot.item) {
      const listSplit = slot.path.indexOf("[].");
      const head = listSplit === -1 ? slot.path.replace("[]", "") : slot.path.slice(0, listSplit);
      const arr = (props as Record<string, unknown>)[head];
      if (Array.isArray(arr)) {
        for (const item of arr) for (const child of slot.item) collect(child, item);
      }
    }
  };
  for (const slot of descriptor.slots) collect(slot, slide.props);

  const unresolvedFacts: string[] = [];
  for (const factId of factIds) {
    if (!factId) continue;
    const fact = findFact(factId);
    if (!fact) {
      issues.push(issue("FACT_MISSING", `facts.${factId}`, `Fact "${factId}" tidak ada di snapshot`));
      unresolvedFacts.push(factId);
    } else if (fact.status === "PENDING") {
      issues.push(issue("FACT_UNVERIFIED", `facts.${factId}`, `Fact "${factId}" masih PENDING: ${fact.claim}`));
      unresolvedFacts.push(factId);
    }
  }

  /* Deterministic slot stack inside the protected rectangle. */
  const slots: SlotRegion[] = [];
  const boxes: ReactNode[] = [];
  const visible = descriptor.slots.filter((s) => readPath(slide.props, s.path).length > 0);
  const rects = stackRects(
    safe.height,
    { x: safe.x, y: safe.y, width: safe.width, gap: 16 },
    visible.map((s) => ({ weight: weightFor(s) })),
  );

  visible.forEach((slot, index) => {
    const rect = rects[index]!;
    const values = readPath(slide.props, slot.path);
    const path = `props.${slot.path}`;
    slots.push({ path, label: slot.label, rect });
    boxes.push(
      <div
        key={path}
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          boxSizing: "border-box",
          border: "1px dashed rgba(22, 221, 226, 0.55)",
          borderRadius: 10,
          padding: "12px 16px",
          overflow: "hidden",
          background: "rgba(32, 40, 50, 0.72)",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#16DDE2",
          }}
        >
          {slot.label}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: slot.kind === "list" ? 22 : 30,
            lineHeight: 1.28,
            color: "#F4F7FA",
            marginTop: 4,
            whiteSpace: "pre-wrap",
          }}
        >
          {values.join("\n")}
        </div>
      </div>,
    );
  });

  const readiness: RenderResult["readiness"] = {
    status: "draft",
    finalExportAvailable: false,
    errors: issues,
    blockedReason: DRAFT_RENDERER_BLOCKED_REASON,
  };

  const badge = (
    <div
      key="__badge"
      style={{
        position: "absolute",
        left: safe.x,
        top: safe.y - 34,
        fontFamily: MONO,
        fontSize: 16,
        letterSpacing: "0.06em",
        color: "#FFB020",
      }}
    >
      {DRAFT_BADGE}
    </div>
  );

  return { content: [badge, ...boxes], readiness, slots };
}

/* ── renderers ──────────────────────────────────────────────────────────── */

function makeRenderer(key: LayoutKey): LayoutRenderer {
  return {
    key,
    version: BLUEPRINTS[key].version,
    supportedFormats: PROFILE_IDS.map(
      (id) => (id === "IG_CAROUSEL" ? "IG_CAROUSEL" : "VERTICAL") as FormatId,
    ).slice(0, 2),
    render: renderDraft,
  };
}

export const draftRenderers: Record<LayoutKey, LayoutRenderer> = Object.fromEntries(
  LAYOUT_KEYS.map((key) => [key, makeRenderer(key)]),
) as Record<LayoutKey, LayoutRenderer>;

export function renderSlide(slide: Slide, ctx: RenderContext): RenderResult {
  return draftRenderers[slide.layout].render(slide, ctx);
}

export function makeRenderContext(
  profile: SafeProfile,
  overrides: Partial<RenderContext> = {},
): RenderContext {
  return {
    profile,
    safe: {
      x: profile.inset.left,
      y: profile.inset.top,
      width: profile.canvas.width - profile.inset.left - profile.inset.right,
      height: profile.canvas.height - profile.inset.top - profile.inset.bottom,
    },
    format: profile.format,
    designRevision: "swiss-tech-v1",
    factsRevision: "product-facts-v1",
    revision: 0,
    mode: "preview",
    ...overrides,
  };
}
