import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { importManifestText, type Manifest } from "../contracts/campaign.schema";
import type { StudioIssue } from "../contracts/errors";
import { loadDrafts, saveDrafts, downloadJson, manifestFilename } from "./persistence";
import { DEFAULT_PREFERENCES, initialState, reducer, type CampaignDoc, type Preferences } from "./state";

interface StudioContextValue {
  state: ReturnType<typeof reducer>;
  active: CampaignDoc | null;
  /** Parse + gate result for the active document, recomputed on change. */
  save: () => void;
  create: (name: string) => void;
  duplicate: (id: string) => void;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  setActive: (id: string | null) => void;
  setDoc: (doc: unknown) => void;
  commitManifest: (manifest: Manifest) => void;
  importText: (text: string) => readonly StudioIssue[];
  exportManifest: () => { ok: boolean; issues: readonly StudioIssue[] };
  setPreferences: (p: Partial<Preferences>) => void;
  resetPreferences: () => void;
  restoreDeleted: () => void;
  dismissDeleted: () => void;
  dismissNotice: () => void;
  notice: { kind: "ok" | "error" | "info"; text: string } | null;
  notify: (kind: "ok" | "error" | "info", text: string) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: { children: ReactNode }): ReactNode {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [notice, setNotice] = useState<{ kind: "ok" | "error" | "info"; text: string } | null>(null);
  const hydrated = useRef(false);

  /* Hydrate once from local storage. */
  useEffect(() => {
    const outcome = loadDrafts();
    if (outcome.ok) {
      const campaigns = outcome.payload.campaigns.filter(isCampaignDoc);
      const prefs = isPreferences(outcome.payload.preferences)
        ? outcome.payload.preferences
        : DEFAULT_PREFERENCES;
      dispatch({
        type: "hydrate",
        campaigns,
        activeId: outcome.payload.activeCampaignId,
        preferences: prefs,
        savedAt: outcome.savedAt,
      });
    } else {
      dispatch({
        type: "storageError",
        status: storageStatusOf(outcome.issues),
        message: outcome.issues[0]?.message ?? "",
      });
      setNotice({ kind: "error", text: outcome.issues[0]?.message ?? "Storage bermasalah." });
    }
    hydrated.current = true;
  }, []);

  /* Persist after every mutation, once hydration has finished. */
  useEffect(() => {
    if (!hydrated.current) return;
    const outcome = saveDrafts({
      campaigns: state.campaigns,
      activeCampaignId: state.activeId,
      preferences: state.preferences,
    });
    if (outcome.ok) {
      dispatch({ type: "storageOk", savedAt: outcome.savedAt });
    } else {
      dispatch({ type: "storageError", status: storageStatusOf(outcome.issues), message: outcome.issues[0]?.message ?? "" });
    }
  }, [state.campaigns, state.activeId, state.preferences]);

  const active = useMemo(
    () => state.campaigns.find((c) => c.id === state.activeId) ?? null,
    [state.campaigns, state.activeId],
  );

  const notify = useCallback((kind: "ok" | "error" | "info", text: string) => {
    setNotice({ kind, text });
  }, []);

  const importText = useCallback((text: string): readonly StudioIssue[] => {
    const result = importManifestText(text);
    if (!result.ok) {
      // Invalid import never touches the active campaign.
      return result.issues;
    }
    const manifest = result.manifest;
    const existing = state.campaigns.find((c) => c.id === manifest.campaignId);
    if (existing) {
      dispatch({ type: "replaceDoc", campaignId: existing.id, doc: manifest, name: manifest.name });
    } else {
      const fresh: CampaignDoc = {
        id: manifest.campaignId,
        name: manifest.name,
        doc: manifest,
        updatedAt: new Date().toISOString(),
      };
      dispatch({
        type: "hydrate",
        campaigns: [fresh, ...state.campaigns],
        activeId: fresh.id,
        preferences: state.preferences,
        savedAt: state.savedAt,
      });
    }
    return [];
  }, [state.campaigns, state.preferences, state.savedAt]);

  const exportManifest = useCallback((): { ok: boolean; issues: readonly StudioIssue[] } => {
    if (!active) return { ok: false, issues: [] };
    const result = importManifestText(JSON.stringify(active.doc));
    if (!result.ok) return { ok: false, issues: result.issues };
    downloadJson(manifestFilename(result.manifest), result.normalized);
    return { ok: true, issues: [] };
  }, [active]);

  const value: StudioContextValue = {
    state,
    active,
    save: () => {
      const outcome = saveDrafts({
        campaigns: state.campaigns,
        activeCampaignId: state.activeId,
        preferences: state.preferences,
      });
      if (outcome.ok) {
        dispatch({ type: "storageOk", savedAt: outcome.savedAt });
        notify("ok", "Draft tersimpan.");
      } else {
        notify("error", outcome.issues[0]?.message ?? "Gagal menyimpan.");
      }
    },
    create: (name) => dispatch({ type: "createCampaign", name }),
    duplicate: (id) => dispatch({ type: "duplicateCampaign", id }),
    rename: (id, name) => dispatch({ type: "renameCampaign", id, name }),
    remove: (id) => dispatch({ type: "deleteCampaign", id }),
    setActive: (id) => dispatch({ type: "setActive", id }),
    setDoc: (doc) => {
      if (state.activeId) dispatch({ type: "setDoc", doc, campaignId: state.activeId });
    },
    commitManifest: (manifest) => {
      if (state.activeId) {
        dispatch({ type: "replaceDoc", campaignId: state.activeId, doc: manifest, name: manifest.name });
      }
    },
    importText,
    exportManifest,
    setPreferences: (p) => dispatch({ type: "setPreferences", preferences: p }),
    resetPreferences: () => dispatch({ type: "resetPreferences" }),
    restoreDeleted: () => dispatch({ type: "restoreDeleted" }),
    dismissDeleted: () => dispatch({ type: "dismissDeleted" }),
    dismissNotice: () => setNotice(null),
    notice,
    notify,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const context = useContext(StudioContext);
  if (!context) throw new Error("useStudio harus dipakai di dalam StudioProvider");
  return context;
}

/* ── type guards for hydrated data ──────────────────────────────────────── */

function isCampaignDoc(value: unknown): value is CampaignDoc {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.name === "string" && typeof v.updatedAt === "string";
}

function isPreferences(value: unknown): value is Preferences {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.defaultFormat === "IG_CAROUSEL" || v.defaultFormat === "VERTICAL") &&
    (v.defaultVerticalProfile === "IG_STORY" || v.defaultVerticalProfile === "TIKTOK") &&
    typeof v.showSafeGuides === "boolean" &&
    typeof v.defaultZoom === "number"
  );
}

function storageStatusOf(issues: readonly StudioIssue[]): "unavailable" | "corrupt" | "quota" {
  const code = issues[0]?.code;
  if (code === "STORAGE_CORRUPT") return "corrupt";
  if (code === "STORAGE_QUOTA") return "quota";
  return "unavailable";
}
