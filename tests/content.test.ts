import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LAYOUT_KEYS, SAFE_PROFILES, PROFILE_IDS, safeRect } from "../src/contracts/formats";
import type { Slide } from "../src/contracts/campaign.schema";
import { getRenderer, RENDERERS } from "../src/blueprints/registry";
import { contentRenderers } from "../src/blueprints/content/renderers";
import { makeRenderContext } from "../src/blueprints/draft-renderers";
import { fitText, highlightCount, slotsWithinSafe } from "../src/blueprints/content/fit";
import { campaignASample, comparisonDraftSample, emptyCampaign } from "../src/studio/fixtures";
import { CodeWindow } from "../src/blueprints/content/primitives";
import type { LayoutKey } from "../src/contracts/formats";

function normalSlide(key: LayoutKey): Slide {
  const fromSample = campaignASample.slides.find((s) => s.layout === key);
  if (fromSample) return fromSample;
  return {
    id: `n-${key}`,
    layout: key,
    props: {
      title: "Judul normal.",
      highlight: "normal",
      categoryTag: "TOKENGATEWAY",
      subline: "Subline normal.",
      comparatorFactId: "f99-comparator-pending",
      offerFactId: "f02-entry-glm-offer",
      leftLabel: "Kiri",
      rightLabel: "Kanan",
      rows: [
        { left: "a", right: "b" },
        { left: "c", right: "d" },
      ],
      note: "Catatan.",
      quotaLabel: "Kuota paket",
      supportingText: "Teks pendukung.",
      ctaLabel: "Lihat paket",
      ctaTargetFactId: "f03-payment-qris",
      windowTitle: "T",
      steps: ["satu", "dua"],
      caption: "Caption.",
      models: [
        { provider: "GLM", availabilityFactId: "f11-provider-catalog", label: "G", description: "d", capabilityFactIds: [] },
        { provider: "DEEPSEEK", availabilityFactId: "f11-provider-catalog", label: "D", description: "d", capabilityFactIds: [] },
        { provider: "GEMINI", availabilityFactId: "f11-provider-catalog", label: "M", description: "d", capabilityFactIds: [] },
      ],
    },
  } as never;
}

describe("content renderers — readiness gating", () => {
  it("registers all five layouts and never claims final export", () => {
    expect(Object.keys(contentRenderers).sort()).toEqual([...LAYOUT_KEYS].sort());
    for (const key of LAYOUT_KEYS) {
      for (const profileId of PROFILE_IDS) {
        const result = getRenderer(key).render(normalSlide(key), makeRenderContext(SAFE_PROFILES[profileId]));
        expect(result.readiness.finalExportAvailable, `${key}/${profileId}`).toBe(false);
        expect(result.readiness.status).toBe("draft");
      }
    }
  });

  it("keeps every slot rect inside the protected rectangle on all profiles", () => {
    for (const key of LAYOUT_KEYS) {
      for (const profileId of PROFILE_IDS) {
        const profile = SAFE_PROFILES[profileId];
        const result = getRenderer(key).render(normalSlide(key), makeRenderContext(profile));
        const safe = safeRect(profile);
        for (const slot of result.slots) {
          expect(slot.rect.x, `${key}/${profileId}`).toBeGreaterThanOrEqual(safe.x);
          expect(slot.rect.y).toBeGreaterThanOrEqual(safe.y);
          expect(slot.rect.x + slot.rect.width).toBeLessThanOrEqual(safe.x + safe.width);
        }
        expect(slotsWithinSafe(result.slots.map((s) => s.rect), safe)).toEqual([]);
      }
    }
  });

  it("RENDERERS and getRenderer agree", () => {
    for (const key of LAYOUT_KEYS) expect(getRenderer(key)).toBe(RENDERERS[key]);
  });
});

describe("content renderers — error and pending states", () => {
  it("flags an exact-match highlight violation", () => {
    const slide = {
      id: "bad-highlight",
      layout: "HERO_HOOK",
      props: { title: "Mulai dari Rp10.000.", highlight: "tidak-ada", categoryTag: "T", subline: "s" },
    } as Slide;
    const result = getRenderer("HERO_HOOK").render(slide, makeRenderContext(SAFE_PROFILES.IG_CAROUSEL));
    expect(result.readiness.errors.some((e) => e.path === "props.highlight")).toBe(true);
    expect(result.readiness.finalExportAvailable).toBe(false);
  });

  it("keeps CODE_MOCKUP draft while the integration fact is PENDING", () => {
    const slide = campaignASample.slides.find((s) => s.layout === "CODE_MOCKUP")!;
    const result = getRenderer("CODE_MOCKUP").render(slide, makeRenderContext(SAFE_PROFILES.IG_STORY));
    expect(result.readiness.errors.some((e) => e.code === "FACT_UNVERIFIED")).toBe(true);
    expect(result.readiness.finalExportAvailable).toBe(false);
  });

  it("reports missing third-party marks rather than faking them", () => {
    const slide = campaignASample.slides.find((s) => s.layout === "MODEL_CATALOG")!;
    const result = getRenderer("MODEL_CATALOG").render(slide, makeRenderContext(SAFE_PROFILES.IG_CAROUSEL));
    expect(result.readiness.errors.some((e) => e.code === "ASSET_MISSING")).toBe(true);
  });

  it("renders every fixture slide without throwing", () => {
    for (const fixture of [emptyCampaign, campaignASample, comparisonDraftSample]) {
      for (const slide of fixture.slides) {
        const result = getRenderer(slide.layout).render(slide as Slide, makeRenderContext(SAFE_PROFILES.TIKTOK));
        expect(result.content, `${fixture.campaignId}/${slide.id}`).toBeTruthy();
      }
    }
  });
});

describe("CodeWindow — no invented shell/config", () => {
  it("shows the exact fact endpoint, no fabricated export commands", () => {
    const html = renderToStaticMarkup(
      createElement(CodeWindow, {
        windowTitle: "T",
        baseUrlFactId: "f01-base-url",
        modelId: "glm-5.3-flash",
        steps: ["a", "b"],
      }),
    );
    expect(html).toContain("https://tokengateway.ai.id/v1");
    expect(html).toContain("YOUR_TOKEN_GATEWAY_KEY");
    expect(html).not.toMatch(/export\s/);
    expect(html).not.toContain("OPENAI_BASE_URL");
    expect(html).not.toContain("OPENAI_MODEL");
    expect(html).not.toContain("API_KEY=$");
    expect(html).not.toContain("$ ");
  });
});

describe("fit helpers", () => {
  it("shrinks only, never below the role minimum", () => {
    const fit = fitText({ text: "x".repeat(4000), width: 400, height: 100, role: "layoutTitle" });
    expect(fit.fontSize).toBeGreaterThanOrEqual(44);
    expect(fit.issues.some((i) => i.code === "TEXT_OVERFLOW")).toBe(true);
  });

  it("counts exact highlight occurrences", () => {
    expect(highlightCount("Mulai dari Rp10.000.", "Rp10.000")).toBe(1);
    expect(highlightCount("aa", "a")).toBe(2);
    expect(highlightCount("aa", "")).toBe(0);
  });
});
