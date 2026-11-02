import { describe, expect, it } from "vitest";
import {
  canonicalJson,
  importManifestText,
  parseManifest,
} from "../src/contracts/campaign.schema";
import { campaignASample, campaignDevSample, campaignNightLaunchSample, comparisonDraftSample, emptyCampaign } from "../src/studio/fixtures";
import { validateDoc, overallStatus } from "../src/studio/validation";

describe("manifest contract", () => {
  it("accepts every fixture", () => {
    for (const fixture of [emptyCampaign, campaignASample, campaignDevSample, campaignNightLaunchSample, comparisonDraftSample]) {
      const result = parseManifest(fixture);
      expect(result.ok, `${fixture.campaignId}: ${JSON.stringify(result.ok ? [] : result.issues)}`).toBe(
        true,
      );
    }
  });

  it("rejects an unknown layout with a path", () => {
    const broken = {
      ...emptyCampaign,
      slides: [{ id: "x", layout: "NOT_A_LAYOUT", props: {} }],
    };
    const result = parseManifest(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.some((i) => i.path.startsWith("slides.0"))).toBe(true);
  });

  it("rejects duplicate slide IDs", () => {
    const broken = {
      ...emptyCampaign,
      slides: [emptyCampaign.slides[0], emptyCampaign.slides[0]],
    };
    const result = parseManifest(broken);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.some((i) => i.code === "DUPLICATE_SLIDE_ID")).toBe(true);
  });

  it("rejects HTML-ish copy and credential-like payloads", () => {
    const html = {
      ...emptyCampaign,
      slides: [
        {
          id: "hook",
          layout: "HERO_HOOK",
          props: {
            title: "<script>alert(1)</script>",
            highlight: "a",
            categoryTag: "T",
            subline: "s",
          },
        },
      ],
    };
    expect(parseManifest(html).ok).toBe(false);

    const secret = {
      ...emptyCampaign,
      slides: [
        {
          id: "hook",
          layout: "HERO_HOOK",
          props: {
            title: "Pakai key sk-abcdefgh12345678",
            highlight: "key",
            categoryTag: "T",
            subline: "s",
          },
        },
      ],
    };
    expect(parseManifest(secret).ok).toBe(false);
  });

  it("reports malformed JSON without throwing", () => {
    const result = importManifestText("{ not json");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues[0]!.code).toBe("JSON_PARSE");
  });

  it("rejects oversized imports", () => {
    const huge = JSON.stringify({ ...emptyCampaign, name: "a".repeat(1_100_000) });
    const result = importManifestText(huge);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues.some((i) => i.code === "IMPORT_TOO_LARGE" || i.code === "SCHEMA_INVALID")).toBe(
      true,
    );
  });

  it("round-trips through canonical JSON", () => {
    const first = importManifestText(JSON.stringify(campaignASample));
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = importManifestText(first.normalized);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.normalized).toBe(first.normalized);
    expect(canonicalJson(second.manifest)).toBe(first.normalized);
  });

  it("rejects an unsupported schema version with a migration message", () => {
    const result = parseManifest({ ...emptyCampaign, schemaVersion: "2.0.0" });
    expect(result.ok).toBe(false);
  });
});

describe("editor validation gating", () => {
  it("keeps Campaign A slide A3 in draft: integration fact is PENDING", () => {
    const validation = validateDoc(campaignASample);
    const a3 = validation.slides.find((s) => s.id === "a3-code-mockup");
    expect(a3?.status).toBe("draft");
    expect(a3?.issues.some((i) => i.code === "FACT_UNVERIFIED")).toBe(true);
  });

  it("marks the unresolved comparator slide as draft", () => {
    const validation = validateDoc(comparisonDraftSample);
    const slide = validation.slides.find((s) => s.id === "e1-comparison");
    expect(slide?.status).toBe("draft");
    expect(overallStatus(validation)).toBe("draft");
  });

  it("reports an invalid document without throwing", () => {
    const validation = validateDoc({ schemaVersion: "1.0.0", slides: "not-an-array" });
    expect(validation.parseOk).toBe(false);
    expect(overallStatus(validation)).toBe("error");
  });
});
