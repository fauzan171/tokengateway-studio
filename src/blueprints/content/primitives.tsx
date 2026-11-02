/* Content primitives — renderable building blocks used by the five blueprint
   renderers and the showcase. Plain props only; commercial values always come
   from fact references, never hardcoded here. Text sizes are NATIVE canvas
   sizes in CSS px (canvas units == CSS px at DPR 1). */
import type { ReactNode } from "react";
import type { AssetRecord } from "../../assets/registry";
import { findFact } from "../../facts/registry";
import type { OfferFactValue } from "../../facts/facts.schema";
import { formatIdr, formatQuota, formatValidity } from "../../studio/fact-format";
import { TYPE } from "../../design/tokens";

export const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";
export const FONT_STACKS: Record<"sans" | "mono", string> = { sans: SANS, mono: MONO };

/* ── BrandLockup ─────────────────────────────────────────────────────────── */
export const BRAND_LOCKUP_MIN = 96;

/**
 * Owner mark slot. The only owner asset is a RASTER_REFERENCE JPEG plus a
 * draft vector pending owner approval — never presented as approved.
 */
export function BrandLockup({
  asset,
  scale = 1,
  showProvenance = false,
}: {
  asset: AssetRecord | undefined;
  scale?: number;
  showProvenance?: boolean;
}): ReactNode {
  if (!asset) {
    return (
      <div data-asset-slot="missing" style={{ fontFamily: MONO, fontSize: 16, color: "#FFB020" }}>
        ASSET TIDAK ADA
      </div>
    );
  }
  const isDraft = asset.status !== "APPROVED_VECTOR";
  return (
    <div data-asset-slot={asset.id} data-asset-status={asset.status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {asset.path ? (
        <img
          src={asset.path}
          alt={asset.label}
          style={{ width: Math.round(BRAND_LOCKUP_MIN * scale), height: "auto", borderRadius: 8 }}
        />
      ) : (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: "#FFB020",
            border: "1px dashed #FFB020",
            padding: "8px 12px",
            display: "inline-block",
          }}
        >
          {asset.label} — slot belum tersedia
        </div>
      )}
      <div>
        {isDraft && <div style={{ fontFamily: MONO, fontSize: 14, color: "#FFB020" }}>DRAFT — belum approved</div>}
        {showProvenance && (
          <div style={{ fontFamily: MONO, fontSize: 14, color: "#AEBBC8", maxWidth: 420 }}>{asset.source}</div>
        )}
      </div>
    </div>
  );
}

/* ── Headline (exact highlight) ──────────────────────────────────────────── */
export function Headline({
  title,
  highlight,
  role = "heroTitle",
}: {
  title: string;
  highlight: string;
  role?: keyof typeof TYPE;
}): ReactNode {
  const spec = TYPE[role];
  const style: React.CSSProperties = {
    fontFamily: FONT_STACKS[spec.family === "mono" ? "mono" : "sans"],
    fontWeight: spec.weight,
    fontSize: spec.preferred,
    lineHeight: spec.lineHeight,
    color: "#F4F7FA",
    whiteSpace: "pre-wrap",
  };
  if (!highlight || !title.includes(highlight)) return <div style={style}>{title}</div>;
  const parts = title.split(highlight);
  return (
    <div style={style}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span style={{ color: "#16DDE2" }}>{highlight}</span>}
        </span>
      ))}
    </div>
  );
}

/* ── CategoryTag ─────────────────────────────────────────────────────────── */
export function CategoryTag({ tag }: { tag: string }): ReactNode {
  const spec = TYPE.tag;
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: SANS,
        fontWeight: spec.weight,
        fontSize: spec.preferred,
        lineHeight: spec.lineHeight,
        letterSpacing: "0.06em",
        color: "#16DDE2",
        border: "2px solid #16DDE2",
        borderRadius: 10,
        padding: "4px 12px",
      }}
    >
      {tag.toUpperCase()}
    </div>
  );
}

/* ── ModelCard ───────────────────────────────────────────────────────────── */
export function ModelCard({
  provider,
  label,
  description,
  markSlot,
}: {
  provider: string;
  label: string;
  description: string;
  markSlot: ReactNode;
}): ReactNode {
  return (
    <div
      style={{
        border: "1px solid #33404E",
        borderRadius: 16,
        background: "#202832",
        padding: 24,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        columnGap: 20,
        alignItems: "center",
      }}
    >
      <div style={{ minWidth: 72, display: "grid", placeItems: "center" }}>{markSlot}</div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: "#F4F7FA" }}>{label}</div>
        <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 400, lineHeight: 1.32, color: "#AEBBC8" }}>
          {description}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 18, color: "#5B6B7B", marginTop: 2 }}>{provider}</div>
      </div>
    </div>
  );
}

/* ── ThirdPartyMarkSlot — labeled missing, never a guessed mark ──────────── */
export function ThirdPartyMarkSlot({ asset }: { asset: AssetRecord | undefined }): ReactNode {
  if (!asset) return null;
  return (
    <div
      data-asset-slot={asset.id}
      data-asset-status={asset.status}
      style={{
        minWidth: 64,
        minHeight: 64,
        border: "1px dashed #FF5A5F",
        borderRadius: 10,
        display: "grid",
        placeItems: "center",
        padding: 6,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 12, color: "#FF5A5F", lineHeight: 1.3 }}>
        {asset.id}
        <br />
        BELUM TERSEDIA
      </div>
    </div>
  );
}

/* ── PriceBlock ──────────────────────────────────────────────────────────── */
export function PriceBlock({ factId }: { factId: string }): ReactNode {
  const fact = findFact(factId);
  const value = fact?.value;
  if (!fact || fact.status === "PENDING" || !value) {
    return (
      <div style={{ fontFamily: MONO, fontSize: 22, color: "#FFB020" }}>
        Harga menunggu fact terverifikasi ({factId || "tanpa ID"})
      </div>
    );
  }
  const spec = TYPE.price;
  return (
    <div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: spec.weight,
          fontSize: spec.preferred,
          lineHeight: spec.lineHeight,
          color: "#F4F7FA",
        }}
      >
        {formatIdr(value.priceIdr)}
      </div>
      <FeeNote />
    </div>
  );
}

/** f08-service-fee is the only fee source; wording mirrors fixture terms. */
export function FeeNote(): ReactNode {
  const fee = findFact("f08-service-fee");
  return (
    <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 24, lineHeight: 1.35, color: "#AEBBC8" }}>
      {fee ? "Harga paket belum termasuk biaya layanan checkout." : "Biaya layanan belum terverifikasi."}
    </div>
  );
}

/* ── QuotaBlock ──────────────────────────────────────────────────────────── */
export function QuotaBlock({ offer }: { offer: OfferFactValue | undefined }): ReactNode {
  if (!offer || offer.kind !== "TOKEN_BUNDLE") {
    return (
      <div style={{ fontFamily: MONO, fontSize: 28, color: "#FFB020" }}>Kuota menunggu fact terverifikasi</div>
    );
  }
  const spec = TYPE.quota;
  const q = formatQuota(offer.tokenQuota);
  return (
    <div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: spec.weight,
          fontSize: spec.preferred,
          lineHeight: spec.lineHeight,
          color: "#16DDE2",
        }}
      >
        {q.compact}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: "#AEBBC8" }}>
        {formatValidity(offer.validityDays)}
      </div>
    </div>
  );
}

export function offerOf(factId: string): OfferFactValue | undefined {
  return findFact(factId)?.value;
}

/* ── QRISBadge — draft word badge only, no QR matrix ─────────────────────── */
export function QRISBadge({ asset }: { asset: AssetRecord | undefined }): ReactNode {
  if (!asset || asset.status !== "APPROVED_VECTOR") {
    return (
      <div data-asset-slot="qris.badge" data-asset-status={asset?.status ?? "MISSING"}>
        <div style={{ background: "#FFFFFF", borderRadius: 12, padding: 16, display: "inline-block" }}>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#181D23" }}>Bayar dengan QRIS</span>
          <div style={{ fontFamily: MONO, fontSize: 14, color: "#FF5A5F", marginTop: 4 }}>
            Badge resmi belum diakuisisi — draft label, bukan logo
          </div>
        </div>
      </div>
    );
  }
  return <img src={asset.path} alt={asset.label} />;
}

/* ── CodeWindow ──────────────────────────────────────────────────────────── */
export function CodeWindow({
  windowTitle,
  baseUrlFactId,
  modelId,
  steps,
}: {
  windowTitle: string;
  baseUrlFactId: string;
  modelId: string;
  steps: readonly string[];
}): ReactNode {
  const baseUrlClaim = findFact(baseUrlFactId)?.claim ?? "Base URL belum tersedia di registry.";
  // Exact endpoint from the fact claim (no reconstruction, no appended path).
  const baseUrlValue = baseUrlClaim.replace(/^Base URL\s*/i, "");
  const spec = TYPE.code;
  const lineStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontWeight: spec.weight,
    fontSize: spec.preferred,
    lineHeight: spec.lineHeight,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  };
  return (
    <div style={{ border: "1px solid #33404E", borderRadius: 16, background: "#1B222B", overflow: "hidden" }}>
      <div style={{ background: "#202832", padding: "8px 16px", fontFamily: MONO, fontSize: 18, color: "#AEBBC8" }}>
        {windowTitle}
      </div>
      <div style={{ padding: 24, display: "grid", gap: 6 }}>
        <div style={lineStyle}>
          <span style={{ color: "#5B6B7B" }}>Base URL: </span>
          <span style={{ color: "#F4F7FA" }}>{baseUrlValue}</span>
        </div>
        <div style={lineStyle}>
          <span style={{ color: "#5B6B7B" }}>Model: </span>
          <span style={{ color: "#F4F7FA" }}>{modelId}</span>
        </div>
        <div style={lineStyle}>
          <span style={{ color: "#5B6B7B" }}>API key: </span>
          <span style={{ color: "#16DDE2" }}>YOUR_TOKEN_GATEWAY_KEY</span>
        </div>
        <div style={{ ...lineStyle, color: "#AEBBC8", marginTop: 8 }}>
          {steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}
        </div>
      </div>
    </div>
  );
}

/* ── ComparisonPanel ─────────────────────────────────────────────────────── */
export function ComparisonPanel({
  leftLabel,
  rightLabel,
  rows,
  leftCell,
  rightCell,
}: {
  leftLabel: string;
  rightLabel: string;
  rows: readonly { left: string; right: string }[];
  leftCell: ReactNode;
  rightCell: ReactNode;
}): ReactNode {
  const head = (text: string, accent: boolean): ReactNode => (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 26,
        color: accent ? "#16DDE2" : "#AEBBC8",
        borderBottom: "2px solid #33404E",
        paddingBottom: 8,
      }}
    >
      {text}
    </div>
  );
  const cell = (text: string): ReactNode => (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 28,
        lineHeight: 1.32,
        color: "#F4F7FA",
        padding: "10px 0",
        borderBottom: "1px solid #33404E",
      }}
    >
      {text}
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 32 }}>
      {head(leftLabel, false)}
      {head(rightLabel, true)}
      {rows.map((row, i) => (
        <div key={i} style={{ display: "contents" }}>
          {cell(row.left)}
          {cell(row.right)}
        </div>
      ))}
      <div style={{ padding: "14px 0 0" }}>{leftCell}</div>
      <div style={{ padding: "14px 0 0" }}>{rightCell}</div>
    </div>
  );
}

/* ── CTAFooter ───────────────────────────────────────────────────────────── */
export function CTAFooter({ label, sub }: { label: string; sub?: string }): ReactNode {
  const spec = TYPE.footer;
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div
        style={{
          display: "inline-block",
          justifySelf: "start",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 32,
          color: "#181D23",
          background: "#16DDE2",
          borderRadius: 10,
          padding: "10px 24px",
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: SANS,
            fontWeight: spec.weight,
            fontSize: spec.preferred,
            lineHeight: spec.lineHeight,
            color: "#AEBBC8",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
