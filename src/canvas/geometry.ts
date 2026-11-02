import type { Rect } from "../contracts/formats";

export function containsRect(outer: Rect, inner: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

export function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
  );
}

export interface StackOptions {
  x: number;
  y: number;
  width: number;
  gap: number;
}

export interface StackItem {
  /** Share of the remaining height this item receives. */
  weight: number;
}

export interface StackSlot extends Rect {
  index: number;
}

/**
 * Deterministic proportional stack used by the draft renderer to give every
 * slot a stable logical rectangle. Real blueprints replace this in session two.
 */
export function stackRects(height: number, opts: StackOptions, items: readonly StackItem[]): StackSlot[] {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0) || 1;
  const gaps = opts.gap * Math.max(0, items.length - 1);
  const available = Math.max(0, height - gaps);
  let cursor = opts.y;
  return items.map((item, index) => {
    const slotHeight = Math.round((available * item.weight) / totalWeight);
    const rect: StackSlot = {
      x: opts.x,
      y: cursor,
      width: opts.width,
      height: slotHeight,
      index,
    };
    cursor += slotHeight + opts.gap;
    return rect;
  });
}

/** Clamp a preview zoom so the wrapper never exceeds usable range. */
export function clampZoom(zoom: number): number {
  return Math.min(1, Math.max(0.1, zoom));
}
