import type { LayoutKey } from "../contracts/formats";

export type SlotFieldKind = "text" | "longtext" | "factRef" | "assetRef" | "list";

export interface SlotDescriptor {
  /** Dot path into slide props, e.g. `title` or `models[].label`. */
  path: string;
  label: string;
  kind: SlotFieldKind;
  required: boolean;
  maxLength?: number;
  hint?: string;
  /** For `list` fields, the per-item slot descriptors. */
  item?: readonly SlotDescriptor[];
  /** For `list` fields. */
  minItems?: number;
  maxItems?: number;
}

export interface BlueprintDescriptor {
  key: LayoutKey;
  version: string;
  title: string;
  summary: string;
  slots: readonly SlotDescriptor[];
  /**
   * Asset IDs this layout needs at render time. Resolved by the registry,
   * never supplied by the campaign payload.
   */
  requiredAssetIds: readonly string[];
  /** Fact IDs that must resolve and be verified before final export. */
  requiredFactIds: readonly string[];
}
