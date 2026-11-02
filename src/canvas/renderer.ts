import type { ReactNode } from "react";
import type { Slide } from "../contracts/campaign.schema";
import type { StudioIssue } from "../contracts/errors";
import type { FormatId, LayoutKey, Rect, SafeProfile } from "../contracts/formats";

/**
 * Renderer contract. The studio stage and the editor both consume this shape;
 * session two swaps the placeholder implementations without touching the
 * editor or persistence layers.
 */

export type RenderMode = "preview" | "capture";

export interface RenderContext {
  profile: SafeProfile;
  /** Protected rectangle in logical CSS pixels. */
  safe: Rect;
  format: FormatId;
  designRevision: string;
  factsRevision: string;
  /** Monotonic revision so stale async results can be discarded. */
  revision: number;
  mode: RenderMode;
}

/** One addressable region inside the canvas, used for guides and diagnostics. */
export interface SlotRegion {
  /** Path into slide props, e.g. `props.title`. */
  path: string;
  label: string;
  rect: Rect;
}

export type RenderStatus = "draft" | "ready" | "error";

export interface RenderReadiness {
  status: RenderStatus;
  /**
   * True only when a production renderer can emit a final artifact.
   * The draft adapter always returns false.
   */
  finalExportAvailable: boolean;
  errors: readonly StudioIssue[];
  /** Reason surfaced in the UI when final export is unavailable. */
  blockedReason?: string;
}

export interface RenderResult {
  content: ReactNode;
  readiness: RenderReadiness;
  slots: readonly SlotRegion[];
}

export interface LayoutRenderer {
  key: LayoutKey;
  version: string;
  supportedFormats: readonly FormatId[];
  render: (slide: Slide, ctx: RenderContext) => RenderResult;
}

export const DRAFT_RENDERER_BLOCKED_REASON =
  "Content renderer belum tersedia";

export const DRAFT_BADGE = "DRAFT — CONTENT DESIGN SYSTEM BELUM TERPASANG";

/**
 * Real content renderers exist but stay blocked: unapproved assets, PENDING
 * facts, pending font provenance sign-off and unsafe geometry all gate export.
 */
export const CONTENT_RENDERER_BLOCKED_REASON =
  "Final export diblokir: aset, fakta, provenance font atau geometry belum lolos gate.";

export const CONTENT_BADGE = "DRAFT — FINAL EXPORT DIBLOKIR (ASET/FAKTA/FONT/GEOMETRY)";
