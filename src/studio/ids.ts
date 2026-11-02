const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Short, stable, collision-resistant slug suffix. IDs are minted once and
 * never regenerated on rename or reorder.
 */
export function newSuffix(length = 6): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length];
  return out;
}

export function newSlideId(layout: string): string {
  return `${layout.toLowerCase().replace(/_/g, "-")}-${newSuffix()}`;
}

export function newCampaignId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${slug || "campaign"}-${newSuffix()}`;
}

/** Campaign IDs must stay stable across rename, so only the suffix carries identity. */
export function campaignIdFrom(currentId: string): string {
  return currentId;
}

/** Copy-on-duplicate: the caller supplies the new ID, the source keeps its own. */
export function duplicateSuffix(id: string): string {
  return id.replace(/-[a-z0-9]{6}$/, "") + "-" + newSuffix();
}
