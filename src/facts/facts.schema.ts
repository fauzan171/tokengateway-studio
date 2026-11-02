import { z } from "zod";

export const FACT_VERIFICATION = ["PUBLIC", "OWNER", "PENDING"] as const;
export type FactVerification = (typeof FACT_VERIFICATION)[number];

/** Structured offer kinds. A wallet top-up is never converted to a token quota. */
export const offerFactSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("TOKEN_BUNDLE"),
    priceIdr: z.number().int().nonnegative(),
    tokenQuota: z.number().int().positive(),
    quotaUnit: z.literal("token"),
    modelIds: z.array(z.string()).min(1),
    validityDays: z.number().int().positive(),
  }),
  z.strictObject({
    kind: z.literal("TOPUP_CREDIT"),
    priceIdr: z.number().int().nonnegative(),
    creditIdr: z.number().int().positive(),
  }),
]);
export type OfferFactValue = z.infer<typeof offerFactSchema>;

export const factRecordSchema = z.strictObject({
  id: z.string().min(1),
  claim: z.string().min(1),
  status: z.enum(FACT_VERIFICATION),
  source: z.string().min(1),
  verifiedAt: z.string().min(1),
  /** Optional structured value; offer facts use it. */
  value: offerFactSchema.optional(),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});
export type FactRecord = z.infer<typeof factRecordSchema>;

export const factsRegistrySchema = z.strictObject({
  factsRevision: z.literal("product-facts-v1"),
  snapshotDate: z.string(),
  sourceUrl: z.string(),
  facts: z.array(factRecordSchema),
});
export type FactsRegistry = z.infer<typeof factsRegistrySchema>;
