/* Bounded fit + safe geometry validation for content renderers.
   Deterministic: fixed shrink steps from tokens, no DOM measurement —
   layout is computed from character estimates, then verified by tests.
   ponytail: heuristic wrap estimate, swap to canvas measureText during
   capture route (P4.2) if accuracy matters. */
import { TYPE } from "../../design/tokens";
import type { Rect } from "../../contracts/formats";
import { issue, type StudioIssue } from "../../contracts/errors";

export interface FitResult {
  fontSize: number;
  lineHeight: number;
  /** Estimated wrapped line count at the fitted size. */
  lines: number;
  issues: readonly StudioIssue[];
}

/** Approximate chars-per-line at a given font size for a given width. */
function charsPerLine(width: number, fontSize: number): number {
  return Math.max(1, Math.floor(width / (fontSize * 0.55)));
}

/**
 * Shrink-only bounded fit: starts at the role's preferred size, steps down to
 * min in 2px increments, never below the role minimum. Never grows text.
 */
export function fitText(opts: {
  text: string;
  width: number;
  height: number;
  role: keyof typeof TYPE;
}): FitResult {
  const spec = TYPE[opts.role];
  const issues: StudioIssue[] = [];
  let size = spec.preferred;
  let lines = 0;
  for (; size >= spec.min; size -= 2) {
    const cpl = charsPerLine(opts.width, size);
    lines = opts.text.split("\n").reduce((sum, para) => sum + Math.max(1, Math.ceil(para.length / cpl)), 0);
    if (lines * spec.lineHeight * size <= opts.height) break;
  }
  if (size < spec.min) {
    size = spec.min;
    issues.push(issue("TEXT_OVERFLOW", "", `Teks melebihi slot pada ukuran minimum ${spec.min}px`));
  }
  return { fontSize: size, lineHeight: spec.lineHeight, lines, issues };
}

/** All slot rects must sit inside the protected rectangle. */
export function slotsWithinSafe(slots: readonly Rect[], safe: Rect): StudioIssue[] {
  const out: StudioIssue[] = [];
  for (const s of slots) {
    if (
      s.x < safe.x ||
      s.y < safe.y ||
      s.x + s.width > safe.x + safe.width ||
      s.y + s.height > safe.y + safe.height
    ) {
      out.push(
        issue("TEXT_OVERFLOW", "safe", `Slot ${s.x},${s.y} ${s.width}x${s.height} keluar dari safe rectangle`),
      );
    }
  }
  return out;
}

/** Exact-match highlight guard: must appear exactly once in the title. */
export function highlightCount(title: string, highlight: string): number {
  if (!highlight) return 0;
  return title.split(highlight).length - 1;
}
