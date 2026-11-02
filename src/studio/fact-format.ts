/**
 * Deterministic formatters. No floating-point currency arithmetic: IDR values
 * arrive as integers and are grouped by string insertion.
 */
export function formatIdr(amount: number): string {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error(`Nilai IDR harus integer nonnegatif: ${amount}`);
  }
  return "Rp" + amount.toLocaleString("id-ID").replace(/ /g, ".");
}

/** Quota display uses a spoken form plus the exact integer. */
export function formatQuota(tokens: number): { compact: string; exact: string } {
  const exact = tokens.toLocaleString("id-ID").replace(/ /g, ".");
  if (tokens >= 1_000_000_000 && tokens % 1_000_000_000 === 0) {
    return { compact: `${tokens / 1_000_000_000} miliar token`, exact: `${exact} token` };
  }
  if (tokens >= 1_000_000 && tokens % 1_000_000 === 0) {
    return { compact: `${tokens / 1_000_000} juta token`, exact: `${exact} token` };
  }
  return { compact: `${exact} token`, exact: `${exact} token` };
}

export function formatValidity(days: number): string {
  return `Berlaku ${days} hari`;
}

/** Domain only, resolved from the registry — payloads never carry a URL. */
export function domainOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}
