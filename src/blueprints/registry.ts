import { LAYOUT_KEYS, type LayoutKey } from "../contracts/formats";
import { BLUEPRINTS } from "./catalog";
import type { BlueprintDescriptor, SlotDescriptor } from "./descriptors";
import type { LayoutRenderer } from "../canvas/renderer";
import { contentRenderers } from "./content/renderers";
import { renderSlide, makeRenderContext } from "./draft-renderers";
export { renderSlide, makeRenderContext };

/* Re-exported so callers have one registry entry point. */
export { BLUEPRINTS };
export type { BlueprintDescriptor, SlotDescriptor };

/** Static allowlist. JSON can only select a key, never inject a module path. */
export const BLUEPRINT_LIST: readonly BlueprintDescriptor[] = LAYOUT_KEYS.map((k) => BLUEPRINTS[k]);

/**
 * Real content renderers. Every layout stays draft/blocked until asset,
 * fact, font and geometry approvals pass; readiness gating is preserved.
 */
export const RENDERERS: Record<LayoutKey, LayoutRenderer> = contentRenderers;

export function getRenderer(key: LayoutKey): LayoutRenderer {
  return RENDERERS[key];
}

export function requiredAssetIdsFor(key: LayoutKey): readonly string[] {
  return BLUEPRINTS[key].requiredAssetIds;
}

export function requiredFactIdsFor(key: LayoutKey): readonly string[] {
  return BLUEPRINTS[key].requiredFactIds;
}

export function allSlotDescriptors(key: LayoutKey): readonly SlotDescriptor[] {
  return BLUEPRINTS[key].slots;
}
