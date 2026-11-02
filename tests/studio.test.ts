import { describe, expect, it } from "vitest";
import {
  DEFAULT_PREFERENCES,
  initialState,
  readSlideId,
  readSlides,
  reducer,
  withSlides,
  type StudioState,
} from "../src/studio/state";
import { validateDoc } from "../src/studio/validation";
import { renderSlide, makeRenderContext } from "../src/blueprints/draft-renderers";
import { SAFE_PROFILES, safeRect } from "../src/contracts/formats";
import { BLUEPRINTS } from "../src/blueprints/registry";
import { formatIdr, formatQuota } from "../src/studio/fact-format";
import { campaignASample, emptyCampaign } from "../src/studio/fixtures";
import type { Manifest } from "../src/contracts/campaign.schema";
import { LAYOUT_KEYS } from "../src/contracts/formats";
import { factsSnapshot } from "../src/facts/registry";

function seeded(): StudioState {
  return reducer(initialState(), {
    type: "hydrate",
    campaigns: [{ id: "c-1", name: "C1", doc: emptyCampaign, updatedAt: "2026-10-12T00:00:00.000Z" }],
    activeId: "c-1",
    savedAt: "",
  });
}

describe("campaign lifecycle", () => {
  it("keeps campaign and slide IDs stable across rename and reorder", () => {
    let state = seeded();
    const originalIds = readSlides(state.campaigns[0]!.doc).map(readSlideId);

    state = reducer(state, { type: "renameCampaign", id: "c-1", name: "Nama baru" });
    expect(state.campaigns[0]!.id).toBe("c-1");
    expect(readSlides(state.campaigns[0]!.doc).map(readSlideId)).toEqual(originalIds);

    const reversed = [...readSlides(state.campaigns[0]!.doc)].reverse();
    state = reducer(state, {
      type: "setDoc",
      doc: withSlides(state.campaigns[0]!.doc, reversed),
      campaignId: "c-1",
    });
    expect(new Set(readSlides(state.campaigns[0]!.doc).map(readSlideId))).toEqual(new Set(originalIds));
  });

  it("mints new campaign and slide IDs on duplicate", () => {
    let state = seeded();
    state = reducer(state, {
      type: "hydrate",
      campaigns: [
        { id: "c-1", name: "C1", doc: campaignASample, updatedAt: "2026-10-12T00:00:00.000Z" },
      ],
      activeId: "c-1",
      savedAt: "",
    });
    state = reducer(state, { type: "duplicateCampaign", id: "c-1" });
    const copy = state.campaigns[0]!;

    expect(copy.id).not.toBe("c-1");
    const copyIds = readSlides(copy.doc).map(readSlideId).filter((id): id is string => id !== null);
    const sourceIds = campaignASample.slides.map((s) => s.id);
    expect(copyIds.some((id) => sourceIds.includes(id))).toBe(false);
    expect(copyIds).toHaveLength(sourceIds.length);
  });

  it("supports undo and redo of document edits", () => {
    let state = seeded();
    const original = state.campaigns[0]!.doc;
    const edited = { ...(original as object), name: "Diubah" };

    state = reducer(state, { type: "setDoc", doc: edited, campaignId: "c-1" });
    expect((state.campaigns[0]!.doc as { name: string }).name).toBe("Diubah");

    state = reducer(state, { type: "undo" });
    expect((state.campaigns[0]!.doc as { name: string }).name).toBe("Campaign baru");

    state = reducer(state, { type: "redo" });
    expect((state.campaigns[0]!.doc as { name: string }).name).toBe("Diubah");
  });

  it("keeps a deleted campaign recoverable", () => {
    let state = seeded();
    state = reducer(state, { type: "deleteCampaign", id: "c-1" });
    expect(state.campaigns).toHaveLength(0);
    expect(state.recentlyDeleted?.id).toBe("c-1");

    state = reducer(state, { type: "restoreDeleted" });
    expect(state.campaigns).toHaveLength(1);
    expect(state.recentlyDeleted).toBe(null);
  });

  it("creates a campaign with a stable id and the fixture's slide shape", () => {
    const state = reducer(initialState(), { type: "createCampaign", name: "Campaign F" });
    const created = state.campaigns[0]!;
    expect(created.id).toMatch(/^campaign-f-[a-z0-9]{6}$/);
    expect((created.doc as Manifest).campaignId).toBe(created.id);
    expect(readSlides(created.doc).length).toBe(1);
  });

  it("resets preferences without touching campaigns", () => {
    let state = seeded();
    state = reducer(state, { type: "setPreferences", preferences: { defaultZoom: 0.9 } });
    expect(state.preferences.defaultZoom).toBe(0.9);
    state = reducer(state, { type: "resetPreferences" });
    expect(state.preferences).toEqual(DEFAULT_PREFERENCES);
    expect(state.campaigns).toHaveLength(1);
  });
});

describe("renderer capability gating", () => {
  it("never claims final export is available from the draft renderer", () => {
    for (const key of LAYOUT_KEYS) {
      const profile = SAFE_PROFILES.IG_CAROUSEL;
      const slide = slideFor(key);
      const result = renderSlide(slide, makeRenderContext(profile));
      expect(result.readiness.finalExportAvailable, key).toBe(false);
      expect(result.readiness.status).toBe("draft");
      expect(result.readiness.blockedReason).toBe("Content renderer belum tersedia");
    }
  });

  it("places every slot inside the protected rectangle", () => {
    const profile = SAFE_PROFILES.TIKTOK;
    const safe = safeRect(profile);
    const result = renderSlide(slideFor("HERO_HOOK"), makeRenderContext(profile));
    expect(result.slots.length).toBeGreaterThan(0);
    for (const slot of result.slots) {
      expect(slot.rect.x).toBeGreaterThanOrEqual(safe.x);
      expect(slot.rect.y).toBeGreaterThanOrEqual(safe.y);
      expect(slot.rect.x + slot.rect.width).toBeLessThanOrEqual(safe.x + safe.width);
    }
  });

  it("reports missing assets rather than pretending they resolve", () => {
    const result = renderSlide(slideFor("MODEL_CATALOG"), makeRenderContext(SAFE_PROFILES.IG_CAROUSEL));
    expect(result.readiness.errors.length).toBeGreaterThan(0);
    expect(result.readiness.errors.some((e) => e.code === "ASSET_MISSING" || e.code === "ASSET_NOT_VECTOR")).toBe(
      true,
    );
  });
});

describe("declared geometry matches the brief", () => {
  it("matches EXECUTION_PLAN.md section 4.2", () => {
    expect(SAFE_PROFILES.IG_CAROUSEL.canvas).toEqual({ width: 1080, height: 1350 });
    expect(SAFE_PROFILES.IG_CAROUSEL.inset).toEqual({ left: 80, top: 80, right: 80, bottom: 80 });
    expect(SAFE_PROFILES.IG_STORY.inset).toEqual({ left: 80, top: 140, right: 80, bottom: 160 });
    expect(SAFE_PROFILES.TIKTOK.inset).toEqual({ left: 80, top: 140, right: 180, bottom: 420 });
    expect(safeRect(SAFE_PROFILES.IG_CAROUSEL)).toEqual({ x: 80, y: 80, width: 920, height: 1190 });
    expect(safeRect(SAFE_PROFILES.TIKTOK)).toEqual({ x: 80, y: 140, width: 820, height: 1360 });
  });

  it("has three distinct vertical inset profiles", () => {
    expect(SAFE_PROFILES.IG_STORY.canvas.width).toBe(SAFE_PROFILES.TIKTOK.canvas.width);
    expect(SAFE_PROFILES.IG_STORY.inset.right).not.toBe(SAFE_PROFILES.TIKTOK.inset.right);
  });
});

describe("deterministic formatting", () => {
  it("formats IDR without floating-point arithmetic", () => {
    expect(formatIdr(10000)).toBe("Rp10.000");
    expect(formatIdr(129000)).toBe("Rp129.000");
    expect(() => formatIdr(-1)).toThrow();
    expect(() => formatIdr(10000.5)).toThrow();
  });

  it("keeps quota value and unit together", () => {
    expect(formatQuota(50_000_000).compact).toBe("50 juta token");
    expect(formatQuota(1_000_000_000).compact).toBe("1 miliar token");
    expect(formatQuota(65_000_000).compact).toBe("65 juta token");
    expect(formatQuota(65_000_001).compact).toBe("65.000.001 token");
  });
});

describe("validation of the sample", () => {
  it("counts Campaign A slides as draft because assets are unapproved", () => {
    const validation = validateDoc(campaignASample);
    expect(validation.counts.total).toBe(5);
    expect(validation.counts.draft + validation.counts.valid).toBe(5);
    expect(validation.counts.error).toBe(0);
  });
});

/* helpers */

function slideFor(key: (typeof LAYOUT_KEYS)[number]) {
  const fromSample = campaignASample.slides.find((s) => s.layout === key);
  if (fromSample) return fromSample;
  const fallback: Record<string, unknown> = {
    PROBLEM_COMPARISON: {
      title: "T",
      comparatorFactId: "f99-comparator-pending",
      offerFactId: "f02-entry-glm-offer",
      leftLabel: "L",
      rightLabel: "R",
      rows: [
        { left: "a", right: "b" },
        { left: "c", right: "d" },
      ],
    },
  };
  return {
    id: `${key}-test`,
    layout: key,
    props: {
      title: "Judul uji yang cukup panjang untuk ukuran kanvas.",
      highlight: "uji",
      categoryTag: "TEST",
      subline: "Subline uji.",
      quotaLabel: "Kuota paket",
      supportingText: "Teks pendukung.",
      ctaLabel: "Lihat paket",
      ctaTargetFactId: "f03-payment-qris",
      offerFactId: "f02-entry-glm-offer",
      windowTitle: "T",
      steps: ["satu", "dua"],
      models: [
        { provider: "GLM", availabilityFactId: "f11-provider-catalog", label: "G", description: "d", capabilityFactIds: [] },
        { provider: "DEEPSEEK", availabilityFactId: "f11-provider-catalog", label: "D", description: "d", capabilityFactIds: [] },
        { provider: "GEMINI", availabilityFactId: "f11-provider-catalog", label: "M", description: "d", capabilityFactIds: [] },
      ],
      ...(fallback[key] as object | undefined),
    },
  } as never;
}

describe("blueprint registry", () => {
  it("declares exactly the five initial layout keys", () => {
    expect(Object.keys(BLUEPRINTS).sort()).toEqual([...LAYOUT_KEYS].sort());
  });

  it("keeps every declared fact reference real", () => {
    for (const key of LAYOUT_KEYS) {
      for (const factId of BLUEPRINTS[key].requiredFactIds) {
        expect(factsSnapshot.byId.has(factId), `${key} -> ${factId}`).toBe(true);
      }
    }
  });
});
