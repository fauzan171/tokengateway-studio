import { newCampaignId, newSlideId } from "./ids";
import { emptyCampaign } from "./fixtures";
import type { LayoutKey } from "../contracts/formats";

/* ── shapes ─────────────────────────────────────────────────────────────── */

/**
 * A campaign as held in the studio. `doc` is the working JSON and may be
 * incomplete or temporarily invalid; `name` is kept outside it so rename
 * still works while the document is broken.
 */
export interface CampaignDoc {
  id: string;
  name: string;
  doc: unknown;
  updatedAt: string;
}

export interface Preferences {
  defaultFormat: "IG_CAROUSEL" | "VERTICAL";
  defaultVerticalProfile: "IG_STORY" | "TIKTOK";
  showSafeGuides: boolean;
  defaultZoom: number;
}

export const DEFAULT_PREFERENCES: Preferences = {
  defaultFormat: "IG_CAROUSEL",
  defaultVerticalProfile: "IG_STORY",
  showSafeGuides: true,
  defaultZoom: 0.4,
};

export type StorageStatus = "ok" | "unavailable" | "corrupt" | "quota";

export interface StudioState {
  campaigns: CampaignDoc[];
  activeId: string | null;
  preferences: Preferences;
  storage: { status: StorageStatus; message?: string };
  /** Undo/redo for the active document only. */
  history: { past: unknown[]; future: unknown[] };
  /** Monotonic counter; async results carrying an older revision are discarded. */
  docRevision: number;
  savedAt: string;
  /** Soft-deleted campaign available for one-step recovery. */
  recentlyDeleted: CampaignDoc | null;
}

export const HISTORY_LIMIT = 50;

export function initialState(): StudioState {
  return {
    campaigns: [],
    activeId: null,
    preferences: DEFAULT_PREFERENCES,
    storage: { status: "ok" },
    history: { past: [], future: [] },
    docRevision: 0,
    savedAt: "",
    recentlyDeleted: null,
  };
}

/* ── actions ────────────────────────────────────────────────────────────── */

export type Action =
  | { type: "hydrate"; campaigns: CampaignDoc[]; activeId: string | null; preferences?: Preferences; savedAt: string }
  | { type: "storageError"; status: StorageStatus; message: string }
  | { type: "storageOk"; savedAt: string }
  | { type: "createCampaign"; name: string }
  | { type: "duplicateCampaign"; id: string }
  | { type: "renameCampaign"; id: string; name: string }
  | { type: "deleteCampaign"; id: string }
  | { type: "restoreDeleted" }
  | { type: "dismissDeleted" }
  | { type: "setActive"; id: string | null }
  | { type: "setDoc"; doc: unknown; campaignId: string }
  | { type: "replaceDoc"; doc: unknown; campaignId: string; name: string }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "setPreferences"; preferences: Partial<Preferences> }
  | { type: "resetPreferences" };

const MAX_HISTORY = HISTORY_LIMIT;

function nowIso(): string {
  return new Date().toISOString();
}

function pushHistory(
  history: StudioState["history"],
  previous: unknown,
): StudioState["history"] {
  const past = [...history.past, previous];
  if (past.length > MAX_HISTORY) past.splice(0, past.length - MAX_HISTORY);
  return { past, future: [] };
}

function touch(campaign: CampaignDoc, doc: unknown): CampaignDoc {
  return { ...campaign, doc, updatedAt: nowIso() };
}

/* ── reducer ────────────────────────────────────────────────────────────── */

export function reducer(state: StudioState, action: Action): StudioState {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        campaigns: action.campaigns,
        activeId: action.activeId,
        preferences: action.preferences ?? state.preferences,
        savedAt: action.savedAt,
        history: { past: [], future: [] },
      };

    case "storageError":
      return { ...state, storage: { status: action.status, message: action.message } };

    case "storageOk":
      return { ...state, storage: { status: "ok" }, savedAt: action.savedAt };

    case "createCampaign": {
      const id = newCampaignId(action.name);
      const fresh: CampaignDoc = {
        id,
        name: action.name,
        // The fixture envelope carries a placeholder ID; the stable one lives here.
        doc: { ...emptyCampaign, campaignId: id, name: action.name, slides: emptyCampaign.slides.map((s) => ({ ...s })) },
        updatedAt: nowIso(),
      };
      return {
        ...state,
        campaigns: [fresh, ...state.campaigns],
        activeId: id,
        history: { past: [], future: [] },
        docRevision: state.docRevision + 1,
      };
    }

    case "duplicateCampaign": {
      const source = state.campaigns.find((c) => c.id === action.id);
      if (!source) return state;
      const id = newCampaignId(source.name);
      // New campaign ID and new slide IDs; nothing is shared with the source.
      const doc = cloneWithNewIds(source.doc, id, `${source.name} (copy)`);
      const copy: CampaignDoc = {
        id,
        name: `${source.name} (copy)`,
        doc,
        updatedAt: nowIso(),
      };
      return {
        ...state,
        campaigns: [copy, ...state.campaigns],
        activeId: id,
        history: { past: [], future: [] },
        docRevision: state.docRevision + 1,
      };
    }

    case "renameCampaign": {
      const campaigns = state.campaigns.map((c) =>
        c.id === action.id
          ? { ...c, name: action.name, doc: renameInDoc(c.doc, action.name), updatedAt: nowIso() }
          : c,
      );
      return { ...state, campaigns };
    }

    case "deleteCampaign": {
      const target = state.campaigns.find((c) => c.id === action.id);
      if (!target) return state;
      const campaigns = state.campaigns.filter((c) => c.id !== action.id);
      const activeId = state.activeId === action.id ? (campaigns[0]?.id ?? null) : state.activeId;
      return { ...state, campaigns, activeId, recentlyDeleted: target };
    }

    case "restoreDeleted": {
      if (!state.recentlyDeleted) return state;
      return {
        ...state,
        campaigns: [state.recentlyDeleted, ...state.campaigns],
        activeId: state.recentlyDeleted.id,
        recentlyDeleted: null,
      };
    }

    case "dismissDeleted":
      return { ...state, recentlyDeleted: null };

    case "setActive":
      return { ...state, activeId: action.id, history: { past: [], future: [] } };

    case "setDoc": {
      const current = state.campaigns.find((c) => c.id === action.campaignId);
      if (!current) return state;
      const campaign = touch(current, action.doc);
      return {
        ...state,
        campaigns: state.campaigns.map((c) => (c.id === campaign.id ? campaign : c)),
        history: pushHistory(state.history, current.doc),
        docRevision: state.docRevision + 1,
      };
    }

    case "replaceDoc": {
      // Import/commit path: history is reset because the document identity changed.
      const current = state.campaigns.find((c) => c.id === action.campaignId);
      if (!current) return state;
      const campaign: CampaignDoc = {
        ...current,
        name: action.name,
        doc: action.doc,
        updatedAt: nowIso(),
      };
      return {
        ...state,
        campaigns: state.campaigns.map((c) => (c.id === campaign.id ? campaign : c)),
        history: { past: [], future: [] },
        docRevision: state.docRevision + 1,
      };
    }

    case "undo": {
      const previous = state.history.past.at(-1);
      if (previous === undefined || !state.activeId) return state;
      const current = state.campaigns.find((c) => c.id === state.activeId);
      if (!current) return state;
      return {
        ...state,
        campaigns: state.campaigns.map((c) => (c.id === current.id ? touch(c, previous) : c)),
        history: {
          past: state.history.past.slice(0, -1),
          future: [current.doc, ...state.history.future],
        },
        docRevision: state.docRevision + 1,
      };
    }

    case "redo": {
      const next = state.history.future[0];
      if (next === undefined || !state.activeId) return state;
      const current = state.campaigns.find((c) => c.id === state.activeId);
      if (!current) return state;
      return {
        ...state,
        campaigns: state.campaigns.map((c) => (c.id === current.id ? touch(c, next) : c)),
        history: {
          past: pushHistory({ past: state.history.past, future: [] }, current.doc).past,
          future: state.history.future.slice(1),
        },
        docRevision: state.docRevision + 1,
      };
    }

    case "setPreferences":
      return { ...state, preferences: { ...state.preferences, ...action.preferences } };

    case "resetPreferences":
      return { ...state, preferences: DEFAULT_PREFERENCES };

    default:
      return state;
  }
}

/* ── doc helpers ────────────────────────────────────────────────────────── */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function renameInDoc(doc: unknown, name: string): unknown {
  if (!isRecord(doc)) return doc;
  return { ...doc, name };
}

/** Deep copy with a new campaign ID and fresh slide IDs. Stable IDs elsewhere survive. */
function cloneWithNewIds(doc: unknown, campaignId: string, name: string): unknown {
  const cloned = structuredClone(doc);
  if (!isRecord(cloned)) return cloned;
  const slides = Array.isArray(cloned.slides) ? cloned.slides : [];
  return {
    ...cloned,
    campaignId,
    name,
    slides: slides.map((slide) => {
      if (!isRecord(slide)) return slide;
      const layout = typeof slide.layout === "string" ? (slide.layout as LayoutKey) : "HERO_HOOK";
      return { ...slide, id: newSlideId(layout) };
    }),
  };
}

/** Read the ordered slides out of a possibly-invalid document. */
export function readSlides(doc: unknown): unknown[] {
  if (!isRecord(doc)) return [];
  return Array.isArray(doc.slides) ? doc.slides : [];
}

export function readSlideId(slide: unknown): string | null {
  if (!isRecord(slide)) return null;
  return typeof slide.id === "string" ? slide.id : null;
}

export function readSlideLayout(slide: unknown): LayoutKey | null {
  if (!isRecord(slide)) return null;
  const layout = slide.layout;
  return typeof layout === "string" ? (layout as LayoutKey) : null;
}

export function withSlides(doc: unknown, slides: unknown[]): unknown {
  if (!isRecord(doc)) return doc;
  return { ...doc, slides };
}

export function readCampaignId(doc: unknown): string | null {
  if (!isRecord(doc)) return null;
  return typeof doc.campaignId === "string" ? doc.campaignId : null;
}

export function readCampaignName(doc: unknown): string | null {
  if (!isRecord(doc)) return null;
  return typeof doc.name === "string" ? doc.name : null;
}
