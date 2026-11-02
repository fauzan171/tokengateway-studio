import raw from "./product-facts.json";
import { factRecordSchema, type FactRecord, type OfferFactValue } from "./facts.schema";

export interface PackageRecord {
  packageId: string;
  version: number;
  name: string;
  priceIdr: number;
  grantTokens: number;
  validityDays: number;
  category: string;
  label: string;
  modelIds: readonly string[];
}

export interface ModelRecord {
  modelId: string;
  name: string;
  inPackageSnapshot: boolean;
}

/** Typed static snapshot. Not a live feed: values are as of `snapshotDate`. */
export interface FactsSnapshot {
  snapshotDate: string;
  sourceUrls: readonly string[];
  notice: string;
  facts: readonly FactRecord[];
  byId: ReadonlyMap<string, FactRecord>;
  packages: readonly PackageRecord[];
  models: readonly ModelRecord[];
  pendingOperational: readonly string[];
}

/** Only the fact records are schema-checked here; the rest is a typed read of the bundled file. */
const facts = factRecordSchema.array().parse(raw.facts);

export const factsSnapshot: FactsSnapshot = {
  snapshotDate: raw.snapshotDate,
  sourceUrls: raw.sourceUrls,
  notice: raw.notice,
  facts,
  byId: new Map(facts.map((f) => [f.id, f])),
  packages: raw.packages,
  models: raw.models,
  pendingOperational: raw.pendingOperational,
};

export const SNAPSHOT_DATE = factsSnapshot.snapshotDate;

export function findFact(factId: string): FactRecord | undefined {
  return factsSnapshot.byId.get(factId);
}

export function offerValue(factId: string): OfferFactValue | undefined {
  return findFact(factId)?.value;
}
