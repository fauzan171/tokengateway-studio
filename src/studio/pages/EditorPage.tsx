import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useStudio } from "../store";
import {
  readSlideId,
  readSlideLayout,
  readSlides,
  withSlides,
} from "../state";
import { newSlideId } from "../ids";
import { validateDoc } from "../validation";
import { BLUEPRINTS, allSlotDescriptors } from "../../blueprints/registry";
import { LAYOUT_KEYS, PROFILE_IDS, SAFE_PROFILES, type LayoutKey, type ProfileId } from "../../contracts/formats";
import type { Slide } from "../../contracts/campaign.schema";
import { Button, EmptyState, Field, Notice, Panel, StatusChip } from "../ui";
import { Stage } from "./editor/Stage";
import { SlotForm } from "./editor/SlotForm";

const SAMPLE_PROPS: Record<LayoutKey, Record<string, unknown>> = {
  HERO_HOOK: {
    title: "Judul baru di sini.",
    highlight: "Judul",
    categoryTag: "TOKENGATEWAY",
    subline: "Subline singkat untuk menjelaskan konteks.",
  },
  PROBLEM_COMPARISON: {
    title: "Judul perbandingan.",
    comparatorFactId: "f99-comparator-pending",
    offerFactId: "f02-entry-glm-offer",
    leftLabel: "Kiri",
    rightLabel: "Kanan",
    rows: [
      { left: "Baris kiri satu", right: "Baris kanan satu" },
      { left: "Baris kiri dua", right: "Baris kanan dua" },
    ],
    note: "",
  },
  MODEL_CATALOG: {
    title: "Judul katalog model.",
    subline: "",
    models: [
      { provider: "GLM", availabilityFactId: "f11-provider-catalog", label: "GLM", description: "Deskripsi GLM.", capabilityFactIds: [] },
      { provider: "DEEPSEEK", availabilityFactId: "f11-provider-catalog", label: "DeepSeek", description: "Deskripsi DeepSeek.", capabilityFactIds: [] },
      { provider: "GEMINI", availabilityFactId: "f11-provider-catalog", label: "Gemini", description: "Deskripsi Gemini.", capabilityFactIds: [] },
    ],
  },
  CODE_MOCKUP: {
    title: "Judul setup.",
    integrationFactId: "f13-cursor-steps",
    windowTitle: "TokenGateway — API Setup",
    steps: ["Langkah pertama.", "Langkah kedua."],
    caption: "",
  },
  PRICING_OFFER: {
    title: "Judul offer.",
    offerFactId: "f02-entry-glm-offer",
    quotaLabel: "Kuota paket",
    supportingText: "Supporting text untuk offer.",
    ctaLabel: "Lihat paket",
    ctaTargetFactId: "f03-payment-qris",
    termsNote: "",
  },
};

const JSON_DEBOUNCE_MS = 350;

export function EditorPage(): ReactNode {
  const { state, active, setDoc, setActive, notify, exportManifest } = useStudio();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<ProfileId>("IG_CAROUSEL");
  const [zoom, setZoom] = useState(state.preferences.defaultZoom);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [jsonDirty, setJsonDirty] = useState(false);
  const [jsonIssues, setJsonIssues] = useState<readonly { path: string; message: string }[]>([]);
  const [mobileTab, setMobileTab] = useState<"slides" | "stage" | "inspector">("stage");
  /** Last document that parsed cleanly; drives the labelled stale preview. */
  const [lastValidDoc, setLastValidDoc] = useState<unknown>(null);

  const doc = active?.doc ?? null;
  const slides = useMemo(() => readSlides(doc), [doc]);
  const validation = useMemo(() => validateDoc(doc), [doc]);

  /* Selection follows the document: never points at a deleted slide. */
  useEffect(() => {
    if (slides.length === 0) {
      setSelectedId(null);
      return;
    }
    const ids = slides.map(readSlideId);
    if (!selectedId || !ids.includes(selectedId)) {
      setSelectedId(ids[0] ?? null);
    }
  }, [slides, selectedId]);

  /* Reload the JSON editor whenever the document changes from outside it. */
  useEffect(() => {
    if (jsonDirty) return;
    setJsonText(doc ? JSON.stringify(doc, null, 2) : "");
    setJsonIssues([]);
  }, [doc, jsonDirty]);

  /* Keep the last clean parse so an invalid edit still shows a labelled preview. */
  useEffect(() => {
    if (validation.parseOk && doc) setLastValidDoc(doc);
  }, [validation.parseOk, doc]);

  const selectedIndex = slides.findIndex((s) => readSlideId(s) === selectedId);
  const selectedSlide = selectedIndex >= 0 ? slides[selectedIndex] : undefined;
  const selectedLayout = selectedSlide ? readSlideLayout(selectedSlide) : null;

  const parsedSelected = useMemo<Slide | null>(() => {
    if (!validation.manifest || selectedId === null) return null;
    return validation.manifest.slides.find((s) => s.id === selectedId) ?? null;
  }, [validation.manifest, selectedId]);

  /* Slide mutation helpers. IDs are minted once and never rewritten. */
  const mutateSlides = (next: unknown[]): void => {
    if (!doc) return;
    setDoc(withSlides(doc, next));
  };

  const addSlide = (layout: LayoutKey): void => {
    const id = newSlideId(layout);
    mutateSlides([
      ...slides,
      { id, layout, props: structuredClone(SAMPLE_PROPS[layout]) },
    ]);
    setSelectedId(id);
    setMobileTab("stage");
  };

  const duplicateSlide = (): void => {
    if (selectedIndex < 0) return;
    const source = slides[selectedIndex];
    const layout = readSlideLayout(source) ?? "HERO_HOOK";
    const copy = {
      ...(structuredClone(source) as Record<string, unknown>),
      id: newSlideId(layout),
    };
    const next = [...slides];
    next.splice(selectedIndex + 1, 0, copy);
    mutateSlides(next);
    setSelectedId(String(copy.id));
  };

  const deleteSlide = (): void => {
    if (selectedIndex < 0 || slides.length <= 1) {
      notify("error", "Campaign harus punya minimal satu slide.");
      return;
    }
    const next = slides.filter((_, i) => i !== selectedIndex);
    mutateSlides(next);
    const fallback = next[Math.max(0, selectedIndex - 1)];
    setSelectedId(readSlideId(fallback));
  };

  const moveSlide = (direction: -1 | 1): void => {
    if (selectedIndex < 0) return;
    const target = selectedIndex + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    const [moved] = next.splice(selectedIndex, 1);
    next.splice(target, 0, moved);
    // Reorder only: IDs travel with their slides.
    mutateSlides(next);
  };

  const updateProps = (props: Record<string, unknown>): void => {
    if (selectedIndex < 0) return;
    const slide = slides[selectedIndex];
    const next = [...slides];
    next[selectedIndex] = { ...(slide as Record<string, unknown>), props };
    mutateSlides(next);
  };

  /* Raw JSON editor: debounced parse, atomic commit, errors keep the text. */
  const jsonTimer = useRef<number | null>(null);
  const onJsonChange = (text: string): void => {
    setJsonText(text);
    setJsonDirty(true);
    if (jsonTimer.current !== null) window.clearTimeout(jsonTimer.current);
    jsonTimer.current = window.setTimeout(() => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        setJsonIssues([{ path: "(root)", message: e instanceof Error ? e.message : "JSON tidak valid" }]);
        return;
      }
      if (typeof parsed !== "object" || parsed === null) {
        setJsonIssues([{ path: "(root)", message: "Dokumen harus berupa object JSON" }]);
        return;
      }
      setJsonIssues([]);
      setDoc(parsed);
      setJsonDirty(false);
    }, JSON_DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (jsonTimer.current !== null) window.clearTimeout(jsonTimer.current);
    };
  }, []);

  if (!active) {
    return (
      <EmptyState
        title="Belum ada campaign aktif"
        body="Pilih campaign di halaman Campaigns, atau buat yang baru untuk membuka editor."
        action={
          state.campaigns.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {state.campaigns.slice(0, 3).map((c) => (
                <Button key={c.id} onClick={() => setActive(c.id)}>
                  {c.name}
                </Button>
              ))}
            </div>
          ) : undefined
        }
      />
    );
  }

  const slideValidation = validation.slides.find((s) => s.id === selectedId);
  const descriptor = selectedLayout ? BLUEPRINTS[selectedLayout] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight">{active.name}</h1>
          <p className="text-[12px] text-[var(--muted)]">
            ID {active.id} · {validation.counts.total} slide ·{" "}
            {state.history.past.length > 0 ? "ada perubahan belum di-undo" : "tidak ada perubahan tertunda"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const result = exportManifest();
              if (result.ok) notify("ok", "Manifest JSON diunduh.");
              else notify("error", result.issues[0]?.message ?? "Export gagal: manifest belum valid.");
            }}
          >
            Export manifest JSON
          </Button>
          <Button
            disabled
            title="Export PNG diblokir: aset/fakta/font/geometry belum lolos gate"
          >
            Export PNG — diblokir (aset/fakta/font/geometry)
          </Button>
        </div>
      </div>

      {!validation.parseOk && (
        <Notice kind="error">
          Dokumen belum valid. {validation.issues.length} masalah. Preview di bawah memakai versi valid terakhir
          dan diberi label.
          <ul className="mt-1 list-disc pl-5 text-[13px]">
            {validation.issues.slice(0, 5).map((i, index) => (
              <li key={index}>
                <code>{i.path || "(root)"}</code> — {i.message}
              </li>
            ))}
          </ul>
        </Notice>
      )}

      {/* Mobile: panels become tabs. Desktop: three columns. */}
      <div className="flex gap-2 lg:hidden">
        {(["slides", "stage", "inspector"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMobileTab(tab)}
            aria-pressed={mobileTab === tab}
            className={`cursor-pointer rounded-lg border px-3 py-1 text-[13px] ${
              mobileTab === tab
                ? "border-[var(--brand-cyan)] text-[var(--brand-cyan)]"
                : "border-[var(--line)] text-[var(--muted)]"
            }`}
          >
            {tab === "slides" ? "Slides" : tab === "stage" ? "Stage" : "Inspector"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_360px]">
        <div className={mobileTab === "slides" ? "block" : "hidden lg:block"}>
          <SlideNavigator
            slides={slides}
            validation={validation.slides}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setSelectedSlot(null);
            }}
            onAdd={addSlide}
            onDuplicate={duplicateSlide}
            onDelete={deleteSlide}
            onMove={moveSlide}
            canDuplicate={selectedIndex >= 0}
            canDelete={slides.length > 1 && selectedIndex >= 0}
          />
        </div>

        <div className={`${mobileTab === "stage" ? "block" : "hidden lg:block"} min-w-0`}>
          <Panel
            title="Stage"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1 text-[13px] text-[var(--muted)]">
                  <span>Zoom</span>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={Math.round(zoom * 100)}
                    onChange={(e) => setZoom(Number(e.target.value) / 100)}
                    aria-label="Zoom preview"
                    className="w-28"
                  />
                  <span className="w-10 tabular-nums">{Math.round(zoom * 100)}%</span>
                </label>
                <Button onClick={() => setZoom(0.4)}>Fit</Button>
                <Button onClick={() => setZoom(1)}>100%</Button>
              </div>
            }
          >
            <div className="mb-3 flex flex-wrap items-end gap-3">
              <div className="w-44">
                <Field label="Profile preview" htmlFor="profile-select">
                  <select
                    id="profile-select"
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value as ProfileId)}
                  >
                    {PROFILE_IDS.map((id) => (
                      <option key={id} value={id}>
                        {SAFE_PROFILES[id].label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <p className="text-[12px] text-[var(--muted)]">
                {SAFE_PROFILES[profileId].canvas.width}×{SAFE_PROFILES[profileId].canvas.height} CSS px · guides
                hanya untuk preview
              </p>
            </div>

            <Stage
              slide={selectedSlide ? (parsedSelected ?? (selectedSlide as Slide)) : null}
              profileId={profileId}
              zoom={zoom}
              showGuides={state.preferences.showSafeGuides}
              revision={state.docRevision}
              stalePreview={!validation.parseOk && lastValidDoc !== null}
              onSelectSlot={setSelectedSlot}
              selectedSlot={selectedSlot}
              highlightedPath={jsonIssues[0]?.path ?? null}
            />
          </Panel>
        </div>

        <div className={mobileTab === "inspector" ? "block" : "hidden lg:block"}>
          <Inspector
            descriptor={descriptor}
            slide={selectedSlide}
            slideValidation={slideValidation}
            parsedSlide={parsedSelected}
            jsonText={jsonText}
            jsonIssues={jsonIssues}
            jsonDirty={jsonDirty}
            onJsonChange={onJsonChange}
            onResetJson={() => {
              const source = lastValidDoc ?? doc;
              setJsonText(source ? JSON.stringify(source, null, 2) : "");
              setJsonIssues([]);
              setJsonDirty(false);
            }}
            onPropsChange={updateProps}
            onSelectSlot={setSelectedSlot}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setDoc(doc)} disabled={state.history.past.length === 0}>
          Undo
        </Button>
        <Button disabled title="Redo dari riwayat sesi">
          Redo
        </Button>
        <span className="text-[12px] text-[var(--muted)]">
          Undo/redo berlaku untuk perubahan dokumen di sesi ini; draft tersimpan tetap ada.
        </span>
      </div>
    </div>
  );
}

/* ── navigator ──────────────────────────────────────────────────────────── */

function SlideNavigator({
  slides,
  validation,
  selectedId,
  onSelect,
  onAdd,
  onDuplicate,
  onDelete,
  onMove,
  canDuplicate,
  canDelete,
}: {
  slides: readonly unknown[];
  validation: readonly { id: string; status: "valid" | "draft" | "error"; layout: string }[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (layout: LayoutKey) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  canDuplicate: boolean;
  canDelete: boolean;
}): ReactNode {
  const [newLayout, setNewLayout] = useState<LayoutKey>("HERO_HOOK");

  return (
    <Panel title="Slides">
      <ul className="space-y-1" aria-label="Daftar slide">
        {slides.map((slide, index) => {
          const id = readSlideId(slide) ?? `#${index + 1}`;
          const status = validation.find((v) => v.id === id)?.status ?? "draft";
          const current = id === selectedId;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={current ? "true" : undefined}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-2 py-2 text-left text-[13px] ${
                  current ? "border-[var(--brand-cyan)]" : "border-[var(--line)] hover:border-[var(--muted)]"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {index + 1}. {readSlideLayout(slide) ?? "?"}
                  </span>
                  <span className="block truncate text-[11px] text-[var(--muted)]">{id}</span>
                </span>
                <StatusChip status={status} />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 space-y-2">
        <Field label="Layout slide baru" htmlFor="new-layout">
          <select
            id="new-layout"
            value={newLayout}
            onChange={(e) => setNewLayout(e.target.value as LayoutKey)}
          >
            {LAYOUT_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
        <Button onClick={() => onAdd(newLayout)}>Tambah slide</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={() => onMove(-1)} disabled={!canDuplicate} title="Naikkan slide terpilih">
          ↑ Naik
        </Button>
        <Button onClick={() => onMove(1)} disabled={!canDuplicate} title="Turunkan slide terpilih">
          ↓ Turun
        </Button>
        <Button onClick={onDuplicate} disabled={!canDuplicate}>
          Duplikat
        </Button>
        <Button variant="danger" onClick={onDelete} disabled={!canDelete}>
          Hapus
        </Button>
      </div>
      <p className="mt-2 text-[11px] text-[var(--muted)]">
        Reorder memindahkan slide beserta ID-nya. Duplikat membuat ID baru.
      </p>
    </Panel>
  );
}

/* ── inspector ──────────────────────────────────────────────────────────── */

function Inspector({
  descriptor,
  slide,
  slideValidation,
  parsedSlide,
  jsonText,
  jsonIssues,
  jsonDirty,
  onJsonChange,
  onResetJson,
  onPropsChange,
  onSelectSlot,
}: {
  descriptor: (typeof BLUEPRINTS)[LayoutKey] | null;
  slide: unknown;
  slideValidation: { status: "valid" | "draft" | "error"; issues: readonly { code: string; path: string; message: string }[] } | undefined;
  parsedSlide: Slide | null;
  jsonText: string;
  jsonIssues: readonly { path: string; message: string }[];
  jsonDirty: boolean;
  onJsonChange: (text: string) => void;
  onResetJson: () => void;
  onPropsChange: (props: Record<string, unknown>) => void;
  onSelectSlot: (path: string) => void;
}): ReactNode {
  const [tab, setTab] = useState<"slots" | "json">("slots");

  if (!slide || !descriptor) {
    return (
      <Panel title="Inspector">
        <p className="text-[14px] text-[var(--muted)]">Pilih slide untuk mengedit slot.</p>
      </Panel>
    );
  }

  const props =
    parsedSlide && typeof parsedSlide.props === "object"
      ? (parsedSlide.props as Record<string, unknown>)
      : ((slide as Record<string, unknown>).props as Record<string, unknown>) ?? {};

  const slots = allSlotDescriptors(descriptor.key);

  return (
    <Panel
      title="Inspector"
      actions={
        <div className="flex gap-1">
          {(["slots", "json"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`cursor-pointer rounded-lg border px-2 py-1 text-[13px] ${
                tab === t
                  ? "border-[var(--brand-cyan)] text-[var(--brand-cyan)]"
                  : "border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              {t === "slots" ? "Slots" : "Raw JSON"}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-medium">{descriptor.key}</span>
        <span className="text-[12px] text-[var(--muted)]">v{descriptor.version}</span>
        {slideValidation && <StatusChip status={slideValidation.status} />}
      </div>
      <p className="mb-3 text-[12px] text-[var(--muted)]">{descriptor.summary}</p>

      {slideValidation && slideValidation.issues.length > 0 && (
        <div className="mb-3 space-y-1">
          {slideValidation.issues.map((i, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectSlot(i.path.replace(/^props\./, ""))}
              className="block w-full cursor-pointer rounded-lg border border-[var(--warn)] px-2 py-1 text-left text-[12px] text-[var(--warn)]"
            >
              <code>{i.path}</code> — {i.message}
            </button>
          ))}
        </div>
      )}

      {tab === "slots" ? (
        <SlotForm
          slots={slots}
          props={props}
          errors={[
            ...(slideValidation?.issues.map((i) => ({ path: i.path, message: i.message })) ?? []),
            ...jsonIssues,
          ]}
          onChange={onPropsChange}
        />
      ) : (
        <div className="space-y-2">
          <Field
            label="Dokumen campaign (JSON)"
            hint={
              jsonDirty
                ? "Menunggu parse…"
                : jsonIssues.length > 0
                  ? "JSON tidak valid; teks tetap di editor dan preview valid terakhir dipertahankan."
                  : "Perubahan valid langsung dipakai."
            }
            htmlFor="json-editor"
          >
            <textarea
              id="json-editor"
              rows={24}
              spellCheck={false}
              value={jsonText}
              aria-invalid={jsonIssues.length > 0 ? true : undefined}
              onChange={(e) => onJsonChange(e.target.value)}
            />
          </Field>
          {jsonIssues.length > 0 && (
            <ul className="space-y-1">
              {jsonIssues.map((i, index) => (
                <li key={index} className="rounded-lg border border-[var(--danger)] px-2 py-1 text-[12px] text-[var(--danger)]">
                  <code>{i.path}</code> — {i.message}
                </li>
              ))}
              <li>
                <Button onClick={onResetJson} variant="ghost">
                  Reset ke dokumen valid terakhir
                </Button>
              </li>
            </ul>
          )}
        </div>
      )}

      <div className="mt-3 rounded-lg border border-[var(--line)] p-2 text-[12px] text-[var(--muted)]">
        <p>Asset wajib: {descriptor.requiredAssetIds.join(", ")}</p>
        <p>Fact wajib: {descriptor.requiredFactIds.length > 0 ? descriptor.requiredFactIds.join(", ") : "tidak ada"}</p>
      </div>
    </Panel>
  );
}
