/* Content design system showcase. Read-only inspection surface: it reads the
   same token, font, asset, fact and blueprint sources the renderers use — no
   duplicated values, no campaign mutation. Hash route `#/design-system`. */
import { useMemo, useState, type ReactNode } from "react";
import {
  LAYOUT_KEYS,
  PROFILE_IDS,
  PROFILE_LABELS,
  SAFE_PROFILES,
  safeRect,
  type LayoutKey,
  type ProfileId,
} from "../../contracts/formats";
import type { Slide } from "../../contracts/campaign.schema";
import { COLOR, SPACE, TYPE, tokens } from "../../design/tokens";
import { REQUIRED_FACES } from "../../design/fonts";
import provenance from "../../../public/fonts/provenance.json";
import { ASSET_REGISTRY, findAsset } from "../../assets/registry";
import { BLUEPRINTS, getRenderer, requiredAssetIdsFor, requiredFactIdsFor } from "../../blueprints/registry";
import { makeRenderContext } from "../../blueprints/draft-renderers";
import { contentRenderers } from "../../blueprints/content/renderers";
import { factsSnapshot, SNAPSHOT_DATE } from "../../facts/registry";
import { campaignASample, comparisonDraftSample } from "../fixtures";
import { Panel } from "../ui";
import { formatIdr, formatQuota, formatValidity } from "../fact-format";
import {
  BrandLockup,
  CategoryTag,
  CodeWindow,
  ComparisonPanel,
  CTAFooter,
  Headline,
  ModelCard,
  PriceBlock,
  QRISBadge,
  QuotaBlock,
  ThirdPartyMarkSlot,
  offerOf,
} from "../../blueprints/content/primitives";

/* ── fixtures: normal / boundary / error / pending ───────────────────────── */

const FILLER = " dan seterusnya tanpa klaim berlebihan";

/** Pad to an exact character budget with neutral filler (never a claim). */
function pad(seed: string, n: number): string {
  return (seed + FILLER.repeat(8)).slice(0, n);
}

const NORMAL: Record<LayoutKey, Record<string, unknown>> = {
  HERO_HOOK: {
    title: "Mulai pakai API AI dari Rp10.000.",
    highlight: "Rp10.000",
    categoryTag: "PAKET GLM 5.3 FLASH",
    subline:
      "50 juta token. Berlaku 7 hari. Bayar pakai QRIS. Harga paket belum termasuk biaya layanan checkout.",
  },
  PROBLEM_COMPARISON: {
    title: "Bayar per bulan, atau bayar paket?",
    comparatorFactId: "f99-comparator-pending",
    offerFactId: "f02-entry-glm-offer",
    leftLabel: "Langganan bulanan",
    rightLabel: "Paket TokenGateway",
    rows: [
      { left: "Tagihan berulang tiap bulan", right: "Beli paket sesuai kebutuhan" },
      { left: "Perlu kartu kredit", right: "Bayar pakai QRIS" },
    ],
    note: "Comparator belum terverifikasi. Angka tidak ditampilkan.",
  },
  MODEL_CATALOG: {
    title: "Pilih model sesuai paketmu.",
    subline: "Akses dan harga mengikuti paket. Rp10.000 khusus pass GLM 5.3 Flash 50M.",
    models: [
      { provider: "GLM", availabilityFactId: "f11-provider-catalog", label: "GLM 5.3 Flash", description: "Entry pass: 50 juta token, berlaku 7 hari.", capabilityFactIds: ["f06-model-access"] },
      { provider: "DEEPSEEK", availabilityFactId: "f11-provider-catalog", label: "DeepSeek V4.1 Flash", description: "Tersedia pada pass dan paket bundling dalam katalog.", capabilityFactIds: ["f06-model-access"] },
      { provider: "GEMINI", availabilityFactId: "f11-provider-catalog", label: "Gemini 3.8 Flash", description: "Ada pass tersendiri. Cek kuota dan masa berlaku sebelum beli.", capabilityFactIds: ["f06-model-access"] },
    ],
  },
  CODE_MOCKUP: {
    title: "Hubungkan aplikasi ke gateway.",
    integrationFactId: "f13-cursor-steps",
    windowTitle: "TokenGateway — API Setup",
    steps: [
      "Buat API key di console.",
      "Isi base URL pada aplikasi yang kompatibel.",
      "Pilih model sesuai akses paket dan key.",
    ],
    caption: "Ikuti petunjuk integrasi tool kamu di dokumentasi TokenGateway.",
  },
  PRICING_OFFER: {
    title: "Paket awal GLM 5.3 Flash.",
    offerFactId: "f02-entry-glm-offer",
    quotaLabel: "Kuota paket",
    supportingText: "Akses model glm-5.3-flash. Bayar paket pakai QRIS.",
    ctaLabel: "Lihat paket GLM",
    ctaTargetFactId: "f03-payment-qris",
    termsNote: "Harga paket. Belum termasuk biaya layanan checkout. Akses model mengikuti paket dan API key.",
  },
};

/** Boundary: every free-text slot at its schema maximum. */
const BOUNDARY: Record<LayoutKey, Record<string, unknown>> = {
  HERO_HOOK: {
    title: pad("Judul panjang tepat batas. ", 110),
    highlight: pad("Rp10.000", 30),
    categoryTag: pad("PAKET", 36).toUpperCase(),
    subline: pad("Subline panjang tepat batas dengan ketentuan dan catatan biaya layanan checkout. ", 180),
  },
  PROBLEM_COMPARISON: {
    title: pad("Judul perbandingan panjang. ", 80),
    comparatorFactId: "f99-comparator-pending",
    offerFactId: "f02-entry-glm-offer",
    leftLabel: pad("Langganan bulanan", 32),
    rightLabel: pad("Paket TokenGateway", 32),
    rows: [
      { left: pad("Baris kiri satu ", 70), right: pad("Baris kanan satu ", 70) },
      { left: pad("Baris kiri dua ", 70), right: pad("Baris kanan dua ", 70) },
      { left: pad("Baris kiri tiga ", 70), right: pad("Baris kanan tiga ", 70) },
    ],
    note: pad("Catatan panjang tepat batas. ", 140),
  },
  MODEL_CATALOG: {
    title: pad("Judul katalog panjang. ", 80),
    subline: pad("Subline katalog panjang. ", 140),
    models: [
      { provider: "GLM", availabilityFactId: "f11-provider-catalog", label: pad("GLM 5.3 Flash", 32), description: pad("Deskripsi model panjang ", 90), capabilityFactIds: ["f06-model-access"] },
      { provider: "DEEPSEEK", availabilityFactId: "f11-provider-catalog", label: pad("DeepSeek V4.1 Flash", 32), description: pad("Deskripsi model panjang ", 90), capabilityFactIds: ["f06-model-access"] },
      { provider: "GEMINI", availabilityFactId: "f11-provider-catalog", label: pad("Gemini 3.8 Flash", 32), description: pad("Deskripsi model panjang ", 90), capabilityFactIds: ["f06-model-access"] },
    ],
  },
  CODE_MOCKUP: {
    title: pad("Judul code mockup panjang. ", 80),
    integrationFactId: "f13-cursor-steps",
    windowTitle: pad("TokenGateway — API Setup", 40),
    steps: [
      pad("Langkah satu yang sangat panjang ", 90),
      pad("Langkah dua yang sangat panjang ", 90),
      pad("Langkah tiga yang sangat panjang ", 90),
      pad("Langkah empat yang sangat panjang ", 90),
    ],
    caption: pad("Caption panjang tepat batas. ", 140),
  },
  PRICING_OFFER: {
    title: pad("Judul penawaran panjang. ", 80),
    offerFactId: "f02-entry-glm-offer",
    quotaLabel: pad("Kuota paket", 32),
    supportingText: pad("Teks pendukung panjang tepat batas. ", 140),
    ctaLabel: pad("Lihat paket GLM", 40),
    ctaTargetFactId: "f03-payment-qris",
    termsNote: pad("Harga paket. Belum termasuk biaya layanan checkout. ", 180),
  },
};

/** Error: invalid highlight, missing fact reference. */
const ERROR: Record<LayoutKey, Record<string, unknown>> = {
  ...NORMAL,
  HERO_HOOK: { ...(NORMAL.HERO_HOOK as object), highlight: "tidak-ada-di-judul" },
  PROBLEM_COMPARISON: { ...(NORMAL.PROBLEM_COMPARISON as object), comparatorFactId: "f-tidak-ada" },
  PRICING_OFFER: { ...(NORMAL.PRICING_OFFER as object), offerFactId: "f-tidak-ada" },
};

/** Pending: unverified comparator / integration facts stay draft. */
const PENDING: Record<LayoutKey, Record<string, unknown>> = {
  ...NORMAL,
  PROBLEM_COMPARISON: { ...(NORMAL.PROBLEM_COMPARISON as object), comparatorFactId: "f99-comparator-pending" },
  CODE_MOCKUP: { ...(NORMAL.CODE_MOCKUP as object), integrationFactId: "f13-cursor-steps" },
};

const SCENARIOS = [
  { id: "normal", label: "Normal", props: NORMAL, note: "Copy produksi yang lolos schema." },
  { id: "boundary", label: "Boundary", props: BOUNDARY, note: "Semua slot pada batas karakter maksimum." },
  { id: "error", label: "Error", props: ERROR, note: "Highlight tidak cocok, fact reference tidak ada." },
  { id: "pending", label: "Pending", props: PENDING, note: "Comparator dan integrasi belum terverifikasi." },
] as const;

type ScenarioId = (typeof SCENARIOS)[number]["id"];

function slideFor(key: LayoutKey, scenario: ScenarioId): Slide {
  return {
    id: `showcase-${key}-${scenario}`,
    layout: key,
    props: SCENARIOS.find((s) => s.id === scenario)!.props[key],
  } as Slide;
}

/* ── canvas preview: real renderer, zoom on wrapper only ─────────────────── */

function CanvasPreview({
  slide,
  profileId,
  zoom = 0.34,
  showGuides = false,
}: {
  slide: Slide;
  profileId: ProfileId;
  zoom?: number;
  showGuides?: boolean;
}): ReactNode {
  const profile = SAFE_PROFILES[profileId];
  const safe = safeRect(profile);
  const ctx = useMemo(() => makeRenderContext(profile, { mode: "preview" }), [profile]);
  const result = useMemo(() => getRenderer(slide.layout).render(slide, ctx), [slide, ctx]);

  return (
    <div className="space-y-1">
      <div
        className="shell-scroll overflow-auto rounded-xl border border-[var(--line)] bg-[var(--charcoal)] p-3"
        data-showcase-canvas={profileId}
      >
        <div style={{ width: profile.canvas.width * zoom, height: profile.canvas.height * zoom, margin: "0 auto" }}>
          <div
            data-tg-canvas
            data-canvas-profile={profile.id}
            style={{
              width: profile.canvas.width,
              height: profile.canvas.height,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              position: "relative",
              overflow: "hidden",
              background: COLOR.bg,
            }}
          >
            {showGuides && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: safe.x,
                  top: safe.y,
                  width: safe.width,
                  height: safe.height,
                  border: "1px solid rgba(0,102,255,0.85)",
                  pointerEvents: "none",
                }}
              />
            )}
            {result.content}
          </div>
        </div>
      </div>
      <p className="text-[12px] text-[var(--muted)]">
        {profile.label} · {profile.canvas.width}×{profile.canvas.height} · safe {safe.width}×{safe.height} ·
        zoom {Math.round(zoom * 100)}% · status {result.readiness.status} · final export{" "}
        {result.readiness.finalExportAvailable ? "tersedia" : "diblokir"}
        {result.readiness.errors.length > 0 ? ` · ${result.readiness.errors.length} issue` : ""}
      </p>
    </div>
  );
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }): ReactNode {
  return (
    <section id={id} className="space-y-3 scroll-mt-20">
      <div>
        <h2 className="text-[18px] font-bold tracking-tight">{title}</h2>
        {lead && <p className="text-[13px] text-[var(--muted)]">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── 1. Typography ───────────────────────────────────────────────────────── */

function TypographySection(): ReactNode {
  const faces = REQUIRED_FACES;
  const fileByFace: Record<string, string> = {
    "Plus Jakarta Sans-400": "jakarta-400.woff2",
    "Plus Jakarta Sans-500": "jakarta-500.woff2",
    "Plus Jakarta Sans-600": "jakarta-600.woff2",
    "Plus Jakarta Sans-700": "jakarta-700.woff2",
    "Plus Jakarta Sans-800": "jakarta-800.woff2",
    "JetBrains Mono-400": "jbmono-400.woff2",
    "JetBrains Mono-500": "jbmono-500.woff2",
    "JetBrains Mono-700": "jbmono-700.woff2",
  };
  const hashByFile = provenance.files as Record<string, string>;

  return (
    <Section
      id="typography"
      title="Typography"
      lead={`Delapan WOFF2 lokal, ${faces.length} weight. Sumber: public/fonts/provenance.json (${provenance.license}).`}
    >
      <Panel title={`Font faces — ${provenance.sources["Plus Jakarta Sans"] ? "2 keluarga" : ""}`}>
        <div className="space-y-5">
          {(["Plus Jakarta Sans", "JetBrains Mono"] as const).map((family) => (
            <div key={family}>
              <p className="text-[13px] font-semibold">{family}</p>
              <p className="text-[12px] text-[var(--muted)]">{provenance.sources[family]}</p>
              <div className="mt-2 space-y-2">
                {faces
                  .filter((f) => f.family === family)
                  .map((f) => {
                    const file = fileByFace[`${f.family}-${f.weight}`]!;
                    return (
                      <div
                        key={file}
                        className="grid gap-2 rounded-lg border border-[var(--line)] bg-[var(--charcoal)] p-3 sm:grid-cols-[1fr_auto]"
                        style={{ fontFamily: `"${f.family}", sans-serif`, fontWeight: f.weight }}
                      >
                        <div>
                          <p style={{ fontSize: 40, lineHeight: 1.2 }}>
                            Rp10.000 · 50 juta token · glm-5.3-flash
                          </p>
                          <p style={{ fontSize: 22, lineHeight: 1.3 }}>
                            Aa Bb Cc 0123456789 — {f.family} {f.weight}
                          </p>
                          <p className="mt-1 text-[11px] text-[var(--muted)]" style={{ fontFamily: "inherit", fontWeight: 400 }}>
                            {file} · native {f.weight} · <span title={hashByFile[file]}>{hashByFile[file]?.slice(0, 16)}…</span>
                          </p>
                        </div>
                        <div className="text-right text-[12px] text-[var(--muted)]" style={{ fontWeight: 400 }}>
                          weight {f.weight}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Type scale — role canvas (CSS px @ 1080 lebar)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                <th scope="col" className="py-2 pr-3">Role</th>
                <th scope="col" className="py-2 pr-3">Family</th>
                <th scope="col" className="py-2 pr-3">Preferred</th>
                <th scope="col" className="py-2 pr-3">Min</th>
                <th scope="col" className="py-2 pr-3">Weight</th>
                <th scope="col" className="py-2 pr-3">Line-height</th>
                <th scope="col" className="py-2">Contoh</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(TYPE) as (keyof typeof TYPE)[]).map((role) => {
                const spec = TYPE[role];
                return (
                  <tr key={role} className="border-b border-[var(--line)] align-baseline">
                    <td className="py-2 pr-3"><code>{role}</code></td>
                    <td className="py-2 pr-3">{spec.family}</td>
                    <td className="py-2 pr-3">{spec.preferred}px</td>
                    <td className="py-2 pr-3">{spec.min}px</td>
                    <td className="py-2 pr-3">{spec.weight}</td>
                    <td className="py-2 pr-3">{spec.lineHeight}</td>
                    <td className="py-2">
                      <span
                        style={{
                          fontFamily: spec.family === "mono" ? "'JetBrains Mono', monospace" : "'Plus Jakarta Sans', sans-serif",
                          fontWeight: spec.weight,
                          fontSize: Math.min(spec.preferred, 34),
                          lineHeight: spec.lineHeight,
                        }}
                      >
                        {role === "price"
                          ? formatIdr(10000)
                          : role === "quota"
                            ? formatQuota(50_000_000).compact
                            : role === "code"
                              ? "glm-5.3-flash"
                              : "Contoh teks Indonesia."}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </Section>
  );
}

/* ── 2. Tokens ───────────────────────────────────────────────────────────── */

const COLOR_ROLES: readonly { key: keyof typeof COLOR; role: string }[] = [
  { key: "bg", role: "canvas.background" },
  { key: "surface", role: "surface.card" },
  { key: "surfaceElevated", role: "surface.elevated" },
  { key: "line", role: "border.default" },
  { key: "textPrimary", role: "text.primary" },
  { key: "textSecondary", role: "text.secondary" },
  { key: "accent", role: "accent.highlight" },
  { key: "brandBlue", role: "accent.brand" },
  { key: "warn", role: "state.warn" },
  { key: "error", role: "state.error" },
  { key: "mutedSurface", role: "surface.muted" },
];

function TokensSection(): ReactNode {
  return (
    <Section
      id="tokens"
      title="Tokens"
      lead={`Satu sumber: src/design/tokens.json (revisi ${tokens.revision}). Showcase membaca nilai langsung; tidak ada duplikasi.`}
    >
      <Panel title="Warna dan semantic role">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_ROLES.map(({ key, role }) => (
            <div key={key} className="flex items-center gap-3 rounded-lg border border-[var(--line)] p-2">
              <span
                aria-hidden="true"
                className="inline-block h-10 w-10 shrink-0 rounded-md border border-[var(--line)]"
                style={{ background: COLOR[key] }}
              />
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{role}</p>
                <p className="text-[12px] text-[var(--muted)]">
                  <code>{key}</code> · {COLOR[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Spacing, radius, border">
          <dl className="space-y-2 text-[13px]">
            <div>
              <dt className="text-[var(--muted)]">spacing (px)</dt>
              <dd className="flex flex-wrap gap-1">
                {SPACE.map((s) => (
                  <span key={s} className="rounded border border-[var(--line)] px-2 py-0.5">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">radius</dt>
              <dd>
                card {tokens.radius.card} · panel {tokens.radius.panel} · chip {tokens.radius.chip}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">border</dt>
              <dd>
                rule {tokens.border.rule}px · emphasis {tokens.border.emphasis}px
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">fit</dt>
              <dd>
                maxIterations {tokens.fit.maxIterations} · urutan {tokens.fit.gapStepOrder.join(" → ")}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Clear space dan container mark">
          <ul className="space-y-2 text-[13px]">
            <li className="rounded-lg border border-[var(--accent)] px-3 py-2">
              Clear space mark minimum <strong>25% tinggi mark</strong> pada semua sisi, di luar batas artwork
              (briefs/03_BRAND_GUIDELINES.md). Ini <em>bukan</em> spacing UI {tokens.assets.clearSpace}px.
            </li>
            <li className="rounded-lg border border-[var(--line)] px-3 py-2">
              Container mark minimum <code>logoContainerMin</code> {tokens.assets.logoContainerMin}px. Spotlight
              180–280px sesuai brand guidelines.
            </li>
            <li className="rounded-lg border border-[var(--line)] px-3 py-2">
              Plaque QRIS: bg {tokens.assets.qrisPlaque.bg}, padding {tokens.assets.qrisPlaque.padding}px, radius{" "}
              {tokens.assets.qrisPlaque.radius}px.
            </li>
          </ul>
        </Panel>
      </div>

      <Panel title="Format dan safe profiles">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                <th scope="col" className="py-2 pr-3">Profile</th>
                <th scope="col" className="py-2 pr-3">Canvas CSS</th>
                <th scope="col" className="py-2 pr-3">Inset L/T/R/B</th>
                <th scope="col" className="py-2 pr-3">Safe content</th>
                <th scope="col" className="py-2">Export DPR 2</th>
              </tr>
            </thead>
            <tbody>
              {PROFILE_IDS.map((id) => {
                const p = SAFE_PROFILES[id];
                const safe = safeRect(p);
                return (
                  <tr key={id} className="border-b border-[var(--line)]">
                    <td className="py-2 pr-3">{PROFILE_LABELS[id]}</td>
                    <td className="py-2 pr-3">
                      {p.canvas.width} × {p.canvas.height}
                    </td>
                    <td className="py-2 pr-3">
                      {p.inset.left}/{p.inset.top}/{p.inset.right}/{p.inset.bottom}
                    </td>
                    <td className="py-2 pr-3">
                      {safe.width} × {safe.height}
                    </td>
                    <td className="py-2">
                      {p.canvas.width * 2} × {p.canvas.height * 2}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[12px] text-[var(--muted)]">
          Feed 1080×1350, Story dan TikTok 1080×1920. TikTok inset tambahan untuk action rail/caption, direkomendasikan
          proyek. Vertical di-re-layout, bukan stretch dari feed.
        </p>
      </Panel>
    </Section>
  );
}

/* ── 3. Assets ───────────────────────────────────────────────────────────── */

function AssetCard({ asset }: { asset: (typeof ASSET_REGISTRY)[number] }): ReactNode {
  const requiredBy = LAYOUT_KEYS.filter((k) => requiredAssetIdsFor(k).includes(asset.id));
  return (
    <div className="space-y-2 rounded-lg border border-[var(--line)] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <code className="text-[13px]">{asset.id}</code>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
            asset.status === "APPROVED_VECTOR"
              ? "border-[var(--ok)] text-[var(--ok)]"
              : asset.status === "RASTER_REFERENCE"
                ? "border-[var(--warn)] text-[var(--warn)]"
                : "border-[var(--danger)] text-[var(--danger)]"
          }`}
        >
          {asset.status}
        </span>
        <span className="text-[11px] text-[var(--muted)]">{asset.owner}</span>
      </div>
      <p className="text-[13px]">{asset.label}</p>
      {asset.path ? (
        <img
          src={asset.path}
          alt={`${asset.label} — ${asset.status}`}
          className="max-w-[360px] rounded-lg border border-[var(--line)]"
        />
      ) : (
        <ThirdPartyMarkSlot asset={asset} />
      )}
      <dl className="space-y-1 text-[12px] text-[var(--muted)]">
        <div>
          <dt className="inline font-medium">source: </dt>
          <dd className="inline">{asset.source}</dd>
        </div>
        <div>
          <dt className="inline font-medium">retrievedAt: </dt>
          <dd className="inline">{asset.retrievedAt}</dd>
        </div>
        <div>
          <dt className="inline font-medium">required by: </dt>
          <dd className="inline">{requiredBy.length ? requiredBy.join(", ") : "—"}</dd>
        </div>
        <div>{asset.notes}</div>
      </dl>
    </div>
  );
}

function AssetsSection(): ReactNode {
  return (
    <Section
      id="assets"
      title="Assets dan provenance"
      lead="Tidak ada aset pihak ketiga yang diakuisisi dalam pekerjaan ini. Mark tebakan tidak diterima; slot ditampilkan sebagai belum tersedia."
    >
      <Panel title="Status approval">
        <ul className="space-y-2 text-[13px]">
          <li className="rounded-lg border border-[var(--warn)] px-3 py-2 text-[var(--warn)]">
            Logo TokenGateway yang tersedia adalah JPEG raster referensi; vector master masih draft, belum approved pemilik.
          </li>
          <li className="rounded-lg border border-[var(--danger)] px-3 py-2 text-[var(--danger)]">
            Empat mark pihak ketiga (glm.z, deepseek.whale, gemini.sparkle, qris.badge) belum diakuisisi. Slot kosong,
            bukan logo tiruan.
          </li>
        </ul>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-2">
        {ASSET_REGISTRY.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      <Panel title="Owner mark — ukuran kecil dan besar">
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <p className="mb-1 text-[12px] text-[var(--muted)]">Kecil (logoContainerMin)</p>
              <BrandLockup asset={findAsset("tokengateway.mark")} scale={1} showProvenance />
            </div>
            <div>
              <p className="mb-1 text-[12px] text-[var(--muted)]">Besar (spotlight)</p>
              <BrandLockup asset={findAsset("tokengateway.mark")} scale={2.2} showProvenance />
            </div>
          </div>
          <div>
            <p className="mb-1 text-[12px] text-[var(--muted)]">Vector draft (path-based, belum approved)</p>
            <img
              src="/brand/tokengateway-mark.svg"
              alt="TokenGateway draft vector — pending owner approval"
              className="max-w-[420px] rounded-lg border border-[var(--warn)]"
            />
            <p className="mt-1 text-[12px] text-[var(--warn)]">
              Draft vector heksagonal/circuit-node. Belum menjadi master approved; tidak diekspor sebagai aset final.
            </p>
          </div>
        </div>
      </Panel>
    </Section>
  );
}

/* ── 4. Content primitives ───────────────────────────────────────────────── */

const offer = offerOf("f02-entry-glm-offer");

function PrimitiveRow({
  name,
  source,
  props,
  anatomy,
  children,
}: {
  name: string;
  source: string;
  props: string;
  anatomy: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="rounded-xl border border-[var(--line)] p-3">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <h3 className="text-[15px] font-semibold">{name}</h3>
        <code className="text-[12px] text-[var(--muted)]">{source}</code>
      </div>
      <div
        className="rounded-lg border border-dashed border-[var(--line)] p-4"
        style={{ background: COLOR.bg, color: COLOR.textPrimary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {children}
      </div>
      <dl className="mt-2 space-y-1 text-[12px] text-[var(--muted)]">
        <div>
          <dt className="inline font-medium">props: </dt>
          <dd className="inline">{props}</dd>
        </div>
        <div>
          <dt className="inline font-medium">anatomy: </dt>
          <dd className="inline">{anatomy}</dd>
        </div>
      </dl>
    </div>
  );
}

function PrimitivesSection(): ReactNode {
  return (
    <Section
      id="primitives"
      title="Komponen konten"
      lead="Sepuluh primitive render. Nilai komersial selalu dari fact reference; tidak ada HTML/CSS/SVG bebas dari payload."
    >
      <div className="grid gap-3">
        <PrimitiveRow
          name="BrandLockup"
          source="primitives.tsx"
          props="asset: AssetRecord, scale?, showProvenance?"
          anatomy="mark owner + label status draft + provenance. Slot kosong bila aset hilang."
        >
          <BrandLockup asset={findAsset("tokengateway.mark")} scale={0.6} showProvenance />
        </PrimitiveRow>

        <PrimitiveRow
          name="Headline"
          source="primitives.tsx"
          props="title: string, highlight: string, role?"
          anatomy="plain text, substring highlight cyan tepat sekali. Normal dan overflow."
        >
          <div className="space-y-2">
            <Headline title="Mulai pakai API AI dari Rp10.000." highlight="Rp10.000" role="layoutTitle" />
            <p className="text-[12px] text-[var(--warn)]">
              Overflow: highlight "tidak-ada" tidak muncul di title → issue TEXT_OVERFLOW, tidak di-highlight.
            </p>
          </div>
        </PrimitiveRow>

        <PrimitiveRow
          name="CategoryTag"
          source="primitives.tsx"
          props="tag: string"
          anatomy="outline cyan, uppercase, letter-spacing. State normal."
        >
          <CategoryTag tag="Paket GLM 5.3 Flash" />
        </PrimitiveRow>

        <PrimitiveRow
          name="ModelCard"
          source="primitives.tsx"
          props="provider, label, description, markSlot: ReactNode"
          anatomy="mark slot + label mono + description sans + provider. Mark pihak ketiga tampil sebagai slot kosong."
        >
          <ModelCard
            provider="GLM"
            label="GLM 5.3 Flash"
            description="Entry pass: 50 juta token, berlaku 7 hari."
            markSlot={<ThirdPartyMarkSlot asset={findAsset("glm.z")} />}
          />
        </PrimitiveRow>

        <PrimitiveRow
          name="PriceBlock"
          source="primitives.tsx"
          props="factId: string"
          anatomy="integer IDR sans + FeeNote. Draft bila fact PENDING/tidak ada."
        >
          <div className="space-y-3">
            <PriceBlock factId="f02-entry-glm-offer" />
            <div className="border-t border-dashed border-[var(--line)] pt-3">
              <p className="mb-1 text-[12px] text-[var(--muted)]">Draft — fact tidak ada:</p>
              <PriceBlock factId="f-tidak-ada" />
            </div>
          </div>
        </PrimitiveRow>

        <PrimitiveRow
          name="QuotaBlock"
          source="primitives.tsx"
          props="offer: OfferFactValue | undefined"
          anatomy="kuota mono + validity terpisah. Draft bila bukan TOKEN_BUNDLE."
        >
          <div className="space-y-3">
            <QuotaBlock offer={offer} />
            <div className="border-t border-dashed border-[var(--line)] pt-3">
              <p className="mb-1 text-[12px] text-[var(--muted)]">Draft — offer tidak ada:</p>
              <QuotaBlock offer={undefined} />
            </div>
          </div>
        </PrimitiveRow>

        <PrimitiveRow
          name="QRISBadge"
          source="primitives.tsx"
          props="asset: AssetRecord | undefined"
          anatomy="plaque putih + label draft. Tanpa QR matrix. Aset resmi belum ada → export diblokir."
        >
          <QRISBadge asset={findAsset("qris.badge")} />
        </PrimitiveRow>

        <PrimitiveRow
          name="CodeWindow"
          source="primitives.tsx"
          props="windowTitle, baseUrlFactId, modelId, steps: readonly string[]"
          anatomy="header window + ringkasan config (base URL exact dari fact, model, key placeholder) + langkah bernomor. Tanpa perintah shell."
        >
          <CodeWindow
            windowTitle="TokenGateway — API Setup"
            baseUrlFactId="f01-base-url"
            modelId="glm-5.3-flash"
            steps={["Buat API key di console.", "Isi base URL pada aplikasi yang kompatibel.", "Pilih model sesuai akses paket dan key."]}
          />
        </PrimitiveRow>

        <PrimitiveRow
          name="ComparisonPanel"
          source="primitives.tsx"
          props="leftLabel, rightLabel, rows, leftCell, rightCell"
          anatomy="dua kolom align, header + rows + cell harga. Kolom kiri draft bila comparator belum terverifikasi."
        >
          <ComparisonPanel
            leftLabel="Langganan bulanan"
            rightLabel="Paket TokenGateway"
            rows={[
              { left: "Tagihan berulang tiap bulan", right: "Beli paket sesuai kebutuhan" },
              { left: "Perlu kartu kredit", right: "Bayar pakai QRIS" },
            ]}
            leftCell={<span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: COLOR.warn }}>Comparator belum terverifikasi.</span>}
            rightCell={<PriceBlock factId="f02-entry-glm-offer" />}
          />
        </PrimitiveRow>

        <PrimitiveRow
          name="CTAFooter"
          source="primitives.tsx"
          props="label: string, sub?: string"
          anatomy="satu aksi cyan + label charcoal, sub opsional."
        >
          <CTAFooter label="Lihat paket GLM" sub="Akses model mengikuti paket dan API key." />
        </PrimitiveRow>
      </div>
    </Section>
  );
}

/* ── 5. Blueprints — five layouts × three profiles ───────────────────────── */

function BlueprintSection(): ReactNode {
  const [key, setKey] = useState<LayoutKey>("HERO_HOOK");
  const [scenario, setScenario] = useState<ScenarioId>("normal");
  const [profile, setProfile] = useState<ProfileId>("IG_CAROUSEL");
  const [guides, setGuides] = useState(false);

  const slide = slideFor(key, scenario);
  const descriptor = BLUEPRINTS[key];
  const ctx = makeRenderContext(SAFE_PROFILES[profile]);
  const result = getRenderer(key).render(slide, ctx);

  return (
    <Section
      id="blueprints"
      title="Blueprint"
      lead="Lima layout nyata dirender oleh renderer konten yang sama dengan editor, pada tiga safe profile. Setiap layout di-re-layout vertikal, bukan stretch."
    >
      <Panel title="Pilih layout, scenario, profile">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {LAYOUT_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKey(k)}
                aria-pressed={key === k}
                className={`cursor-pointer rounded-lg border px-3 py-1 text-[13px] ${
                  key === k ? "border-[var(--brand-cyan)] text-[var(--text)]" : "border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScenario(s.id)}
                aria-pressed={scenario === s.id}
                className={`cursor-pointer rounded-lg border px-3 py-1 text-[13px] ${
                  scenario === s.id ? "border-[var(--brand-cyan)] text-[var(--text)]" : "border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                {s.label}
              </button>
            ))}
            <span className="text-[12px] text-[var(--muted)]">
              {SCENARIOS.find((s) => s.id === scenario)!.note}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {PROFILE_IDS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProfile(p)}
                aria-pressed={profile === p}
                className={`cursor-pointer rounded-lg border px-3 py-1 text-[13px] ${
                  profile === p ? "border-[var(--brand-cyan)] text-[var(--text)]" : "border-[var(--line)] text-[var(--muted)]"
                }`}
              >
                {PROFILE_LABELS[p]}
              </button>
            ))}
            <label className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
              <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} />
              Safe guides (preview)
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CanvasPreview slide={slide} profileId={profile} zoom={0.34} showGuides={guides} />
        <div className="space-y-3">
          <Panel title="Diagnostics">
            <ul className="space-y-1 text-[12px]">
              <li>
                status: <code>{result.readiness.status}</code> · final export:{" "}
                <code>{String(result.readiness.finalExportAvailable)}</code>
              </li>
              <li>blockedReason: {result.readiness.blockedReason}</li>
              <li>slots: {result.slots.length}</li>
            </ul>
            {result.readiness.errors.length > 0 && (
              <ul className="mt-2 space-y-1 text-[12px] text-[var(--warn)]">
                {result.readiness.errors.map((e, i) => (
                  <li key={i}>
                    <code>{e.code}</code> {e.path ? `· ${e.path}` : ""} — {e.message}
                  </li>
                ))}
              </ul>
            )}
            {result.readiness.errors.length === 0 && (
              <p className="mt-2 text-[12px] text-[var(--muted)]">Tidak ada issue pada scenario ini.</p>
            )}
          </Panel>

          <Panel title="Slot descriptor">
            <ul className="space-y-1 text-[12px]">
              {descriptor.slots.map((s) => (
                <li key={s.path} className="flex justify-between gap-2">
                  <span>
                    <code>{s.path}</code> {s.required ? "*" : ""}
                  </span>
                  <span className="text-[var(--muted)]">
                    {s.kind}
                    {s.maxLength ? ` · maks ${s.maxLength}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Dependencies">
            <p className="text-[12px] text-[var(--muted)]">
              assets: {requiredAssetIdsFor(key).join(", ") || "—"}
            </p>
            <p className="text-[12px] text-[var(--muted)]">
              facts: {requiredFactIdsFor(key).join(", ") || "—"}
            </p>
            <p className="mt-1 text-[12px] text-[var(--muted)]">
              renderer v{contentRenderers[key].version} · formats {contentRenderers[key].supportedFormats.join(", ")}
            </p>
          </Panel>
        </div>
      </div>
    </Section>
  );
}

/* ── 6. Generator handoff ────────────────────────────────────────────────── */

function GeneratorSection(): ReactNode {
  return (
    <Section
      id="generator"
      title="Patokan generator"
      lead="Kontrak untuk generator konten: kunci/slot diizinkan, batas teks, highlight, referensi aset/fakta, format dan penanganan overflow. Tidak ada layanan AI generasi di milestone ini."
    >
      <Panel title="Kontrak">
        <ul className="space-y-2 text-[13px]">
          <li>
            <strong>Schema:</strong> <code>src/contracts/campaign.schema.ts</code> (strict, slug ID, tolak
            markup/credential).
          </li>
          <li>
            <strong>Registry:</strong> <code>src/blueprints/catalog.ts</code> + <code>descriptors.ts</code> —
            allowlist lima layout, slot, batas karakter, asset/fact IDs.
          </li>
          <li>
            <strong>Renderer:</strong> <code>src/blueprints/content/renderers.tsx</code> melalui{" "}
            <code>getRenderer</code>/<code>RENDERERS</code>.
          </li>
          <li>
            <strong>Aturan lengkap:</strong> <code>CONTENT_GENERATION_RULES.md</code>.
          </li>
        </ul>
      </Panel>

      <Panel title="Fact snapshot (harga, kuota, validity)">
        <p className="text-[12px] text-[var(--muted)]">
          Snapshot {SNAPSHOT_DATE}. Bukan live feed. Nilai komersial hanya dari fact reference.
        </p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                <th scope="col" className="py-2 pr-3">Fact</th>
                <th scope="col" className="py-2 pr-3">Status</th>
                <th scope="col" className="py-2">Claim</th>
              </tr>
            </thead>
            <tbody>
              {factsSnapshot.facts.map((f) => (
                <tr key={f.id} className="border-b border-[var(--line)] align-top">
                  <td className="py-2 pr-3"><code>{f.id}</code></td>
                  <td className="py-2 pr-3">
                    <span className={f.status === "PENDING" ? "text-[var(--warn)]" : "text-[var(--ok)]"}>{f.status}</span>
                  </td>
                  <td className="py-2">{f.claim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Specimen offer dari fact snapshot">
        <div className="space-y-1 text-[13px]">
          <p>Label: GLM 5.3 Flash</p>
          <p>Kuota: {offer ? formatQuota(offer.kind === "TOKEN_BUNDLE" ? offer.tokenQuota : 0).compact : "—"}</p>
          <p>Harga paket: {offer && offer.kind === "TOKEN_BUNDLE" ? formatIdr(offer.priceIdr) : "—"}</p>
          <p>Masa berlaku: {offer && offer.kind === "TOKEN_BUNDLE" ? formatValidity(offer.validityDays) : "—"}</p>
          <p>Terms: Harga paket belum termasuk biaya layanan checkout (f08).</p>
          <p className="text-[12px] text-[var(--muted)]">
            Semua angka dari satu package ID (pass-glm-5.3-flash-50m), bukan gabungan nilai termurah.
          </p>
        </div>
      </Panel>

      <Panel title="Contoh payload dan penanganan error">
        <pre className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--charcoal)] p-3 text-[12px] text-[var(--muted)]">
{`// valid — HERO_HOOK
{ "id": "hook", "layout": "HERO_HOOK",
  "props": { "title": "Mulai dari Rp10.000.", "highlight": "Rp10.000",
             "categoryTag": "PAKET GLM", "subline": "50 juta token. 7 hari." } }

// invalid — highlight tidak ada di title
{ "title": "Mulai dari Rp10.000.", "highlight": "tidak-ada" }
// → issue TEXT_OVERFLOW pada props.highlight; final export diblokir.`}
        </pre>
        <p className="mt-2 text-[12px] text-[var(--muted)]">
          Overflow tidak memakai ellipsis/crop: renderer menurunkan ukuran font bertahap hingga minimum; gagal
          menghasilkan <code>TEXT_OVERFLOW</code> dan memblokir export.
        </p>
      </Panel>

      <Panel title="Campaign A — contoh draft">
        <p className="text-[12px] text-[var(--muted)]">
          {campaignASample.name} · {campaignASample.slides.length} slide. Slide A3 CODE_MOCKUP tetap draft: fact
          integrasi Cursor PENDING.
        </p>
        <ul className="mt-2 space-y-1 text-[12px]">
          {campaignASample.slides.map((s) => {
            const r = getRenderer(s.layout).render(s, makeRenderContext(SAFE_PROFILES.IG_CAROUSEL));
            return (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  <code>{s.id}</code> · {s.layout}
                </span>
                <span className={r.readiness.status === "draft" ? "text-[var(--warn)]" : "text-[var(--ok)]"}>
                  {r.readiness.status} · {r.readiness.errors.length} issue
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Campaign E — comparison draft">
        <p className="text-[12px] text-[var(--muted)]">
          {comparisonDraftSample.name}. Comparator $20/bulan belum punya bukti; slide tetap draft.
        </p>
        <ul className="mt-2 space-y-1 text-[12px]">
          {comparisonDraftSample.slides.map((s) => {
            const r = getRenderer(s.layout).render(s, makeRenderContext(SAFE_PROFILES.IG_CAROUSEL));
            return (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  <code>{s.id}</code> · {s.layout}
                </span>
                <span className={r.readiness.status === "draft" ? "text-[var(--warn)]" : "text-[var(--ok)]"}>
                  {r.readiness.status} · {r.readiness.errors.length} issue
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
    </Section>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

export function DesignSystemPage(): ReactNode {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[20px] font-bold tracking-tight">Content Design System</h1>
        <p className="text-[13px] text-[var(--muted)]">
          Patokan generator konten: font, token, aset, sepuluh primitive, dan lima blueprint pada tiga safe profile.
          Halaman ini read-only; tidak mengubah campaign. Renderer nyata terpasang, tetapi final export tetap diblokir
          sampai aset, fakta, provenance font dan geometry lolos gate.
        </p>
      </div>

      <nav aria-label="Bagian design system" className="flex flex-wrap gap-2 text-[13px]">
        {[
          ["typography", "Typography"],
          ["tokens", "Tokens"],
          ["assets", "Assets"],
          ["primitives", "Komponen"],
          ["blueprints", "Blueprint"],
          ["generator", "Generator"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#/design-system`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id!)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-lg border border-[var(--line)] px-3 py-1 text-[var(--muted)] hover:text-[var(--text)]"
          >
            {label}
          </a>
        ))}
      </nav>

      <TypographySection />
      <TokensSection />
      <AssetsSection />
      <PrimitivesSection />
      <BlueprintSection />
      <GeneratorSection />

      <p className="text-[12px] text-[var(--muted)]">
        Semua nilai dibaca dari sumber yang sama dengan renderer: tokens.json, provenance.json, assets/registry.ts,
        facts/product-facts.json, blueprints/catalog.ts.
      </p>
    </div>
  );
}


