import { useMemo, type ReactNode } from "react";
import type { Slide } from "../../../contracts/campaign.schema";
import { SAFE_PROFILES, type ProfileId, type Rect } from "../../../contracts/formats";
import { renderSlide, makeRenderContext } from "../../../blueprints/draft-renderers";
import { DRAFT_BADGE } from "../../../canvas/renderer";

interface StageProps {
  slide: Slide | null;
  profileId: ProfileId;
  zoom: number;
  showGuides: boolean;
  revision: number;
  /** Set while the raw JSON editor holds an unparseable document. */
  stalePreview: boolean;
  onSelectSlot: (path: string) => void;
  selectedSlot: string | null;
  highlightedPath: string | null;
}

export function Stage({
  slide,
  profileId,
  zoom,
  showGuides,
  revision,
  stalePreview,
  onSelectSlot,
  selectedSlot,
  highlightedPath,
}: StageProps): ReactNode {
  const profile = SAFE_PROFILES[profileId];
  const ctx = useMemo(
    () => makeRenderContext(profile, { revision, mode: "preview" }),
    [profile, revision],
  );

  const result = useMemo(() => (slide ? renderSlide(slide, ctx) : null), [slide, ctx]);
  const safe: Rect = ctx.safe;

  if (!slide) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-[14px] text-[var(--muted)]">
        Pilih atau tambah slide untuk melihat stage.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {stalePreview && (
        <p role="status" className="rounded-lg border border-[var(--warn)] px-3 py-1 text-[13px] text-[var(--warn)]">
          Preview memakai versi valid terakhir. JSON di editor belum bisa dipakai.
        </p>
      )}

      <div className="shell-scroll overflow-auto rounded-xl border border-[var(--line)] bg-[var(--charcoal)] p-4">
        {/* Zoom wraps the canvas only: logical dimensions never change. */}
        <div
          style={{
            width: profile.canvas.width * zoom,
            height: profile.canvas.height * zoom,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: profile.canvas.width,
              height: profile.canvas.height,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              position: "relative",
              background: "#181D23",
              overflow: "hidden",
            }}
            data-canvas-profile={profile.id}
          >
            {/* Safe rectangle guide — preview overlay only, never exported. */}
            {showGuides && (
              <>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: safe.x,
                    top: safe.y,
                    width: safe.width,
                    height: safe.height,
                    border: "1px solid rgba(0, 102, 255, 0.85)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      `linear-gradient(to right, rgba(0,102,255,0.10) 0 ${safe.x}px, transparent ${safe.x}px ${safe.x + safe.width}px, rgba(0,102,255,0.10) ${safe.x + safe.width}px 100%)`,
                    pointerEvents: "none",
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 8,
                    bottom: 8,
                    font: "12px 'JetBrains Mono', monospace",
                    color: "#AEBBC8",
                  }}
                >
                  {profile.canvas.width}×{profile.canvas.height} · safe {safe.width}×{safe.height} ·
                  inset {profile.inset.left}/{profile.inset.top}/{profile.inset.right}/{profile.inset.bottom}
                </div>
              </>
            )}

            {result?.content}

            {/* Click targets over each logical slot region for slot selection. */}
            {result?.slots.map((slot) => (
              <button
                key={slot.path}
                type="button"
                aria-label={`Pilih slot ${slot.label}`}
                onClick={() => onSelectSlot(slot.path)}
                style={{
                  position: "absolute",
                  left: slot.rect.x,
                  top: slot.rect.y,
                  width: slot.rect.width,
                  height: slot.rect.height,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  outline:
                    selectedSlot === slot.path || highlightedPath === slot.path
                      ? "2px solid #16DDE2"
                      : "none",
                  outlineOffset: "-2px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--muted)]">
        <span>{DRAFT_BADGE}</span>
        <span>Profile: {profile.label}</span>
        <span>Zoom {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
