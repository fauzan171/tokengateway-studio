import { z } from "zod";
import type { Manifest } from "../contracts/campaign.schema";
import { issue, type StudioIssue } from "../contracts/errors";

const STORAGE_KEY = "tokengateway.studio.v1";
const STORAGE_VERSION = 1;

/** Envelope written to localStorage. Versioned so a future shape can migrate. */
const storedSchema = z.strictObject({
  version: z.literal(STORAGE_VERSION),
  savedAt: z.string(),
  campaigns: z.array(z.unknown()),
  activeCampaignId: z.string().nullable(),
  preferences: z.unknown().optional(),
});

export interface StoredPayload {
  campaigns: unknown[];
  activeCampaignId: string | null;
  preferences?: unknown;
}

export type LoadOutcome =
  | { ok: true; payload: StoredPayload; savedAt: string }
  | { ok: false; issues: readonly StudioIssue[] };

/**
 * Storage adapter. Every failure mode returns an issue instead of throwing so
 * the shell can show a recoverable banner rather than losing the session.
 */
export function loadDrafts(): LoadOutcome {
  let rawValue: string | null;
  try {
    rawValue = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return {
      ok: false,
      issues: [
        issue(
          "STORAGE_UNAVAILABLE",
          "",
          "Local storage tidak tersedia (mode privat atau diblokir). Draft tidak bisa dipulihkan.",
        ),
      ],
    };
  }

  if (rawValue === null) {
    return { ok: true, payload: { campaigns: [], activeCampaignId: null }, savedAt: "" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawValue);
  } catch {
    return {
      ok: false,
      issues: [
        issue(
          "STORAGE_CORRUPT",
          "",
          "Draft tersimpan tidak bisa dibaca (JSON rusak). Draft lama dibiarkan utuh sampai kamu menimpanya.",
        ),
      ],
    };
  }

  const result = storedSchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      issues: [
        issue(
          "STORAGE_CORRUPT",
          "",
          `Struktur draft tersimpan tidak dikenal (versi ${String((parsed as { version?: unknown })?.version ?? "?")}).`,
        ),
      ],
    };
  }

  return {
    ok: true,
    payload: {
      campaigns: result.data.campaigns,
      activeCampaignId: result.data.activeCampaignId,
      preferences: result.data.preferences,
    },
    savedAt: result.data.savedAt,
  };
}

export type SaveOutcome =
  | { ok: true; savedAt: string }
  | { ok: false; issues: readonly StudioIssue[] };

export function saveDrafts(payload: StoredPayload): SaveOutcome {
  const savedAt = new Date().toISOString();
  const body = JSON.stringify({
    version: STORAGE_VERSION,
    savedAt,
    campaigns: payload.campaigns,
    activeCampaignId: payload.activeCampaignId,
    preferences: payload.preferences,
  });

  try {
    window.localStorage.setItem(STORAGE_KEY, body);
    return { ok: true, savedAt };
  } catch (e) {
    const quota = e instanceof DOMException && /quota|exceeded/i.test(e.name + e.message);
    return {
      ok: false,
      issues: [
        quota
          ? issue("STORAGE_QUOTA", "", "Penyimpanan penuh. Hapus campaign lama atau unduh manifest JSON dulu.")
          : issue("STORAGE_UNAVAILABLE", "", "Gagal menyimpan draft ke local storage."),
      ],
    };
  }
}

export function clearDrafts(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing recoverable to do */
  }
}

/** Serialize a manifest for download. Canonical ordering comes from the caller. */
export function downloadJson(filename: string, text: string): void {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function manifestFilename(manifest: Manifest): string {
  return `${manifest.campaignId}.manifest.json`;
}
