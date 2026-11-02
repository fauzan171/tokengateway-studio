import { useMemo, type ReactNode } from "react";
import { campaignDevSample, campaignNightLaunchSample } from "../fixtures";
import { getRenderer } from "../../blueprints/registry";
import { makeRenderContext } from "../../blueprints/draft-renderers";
import { SAFE_PROFILES } from "../../contracts/formats";

/* ponytail: hidden capture route (#/export/<campaignId>), draft badge stripped.
   Screenshot output = draft proof, bukan final export. Upgrade: gate on
   finalExportAvailable once assets/fonts are approved. */

const CAMPAIGNS = [campaignDevSample, campaignNightLaunchSample];

function SlideCanvas({ slide }: { slide: import("../../contracts/campaign.schema").Slide }): ReactNode {
  const profile = SAFE_PROFILES.IG_CAROUSEL;
  const ctx = useMemo(() => makeRenderContext(profile, { mode: "capture" }), [profile]);
  const result = useMemo(
    () => (slide ? getRenderer(slide.layout).render(slide, ctx) : null),
    [slide, ctx],
  );
  if (!result) return null;
  return (
    <div
      data-tg-canvas
      style={{
        width: profile.canvas.width,
        height: profile.canvas.height,
        position: "relative",
        overflow: "hidden",
        background: "#181D23",
      }}
    >
      {result.content}
    </div>
  );
}

export function ExportPage({ campaignId }: { campaignId: string }): ReactNode {
  const campaign = CAMPAIGNS.find((c) => c.campaignId === campaignId);
  if (!campaign) {
    return <p style={{ color: "#FF5A5F", padding: 32 }}>Campaign tidak dikenal: {campaignId}</p>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: 32, background: "#0E1114" }}>
      {campaign.slides.map((s, i) => (
        <div data-tg-slide={i} key={s.id}>
          <SlideCanvas slide={s} />
        </div>
      ))}
    </div>
  );
}
