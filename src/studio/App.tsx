import { useCallback, useEffect, useState, type ReactNode } from "react";
import { StudioProvider, useStudio } from "./store";
import { Button, Notice } from "./ui";
import { OverviewPage } from "./pages/OverviewPage";
import { CampaignsPage } from "./pages/CampaignsPage";
import { EditorPage } from "./pages/EditorPage";
import { AssetLibraryPage } from "./pages/AssetLibraryPage";
import { ProductFactsPage } from "./pages/ProductFactsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { ExportPage } from "./pages/ExportPage";
import { SNAPSHOT_DATE } from "../facts/registry";

function exportCampaignFromHash(): string | null {
  const m = window.location.hash.match(/^#\/export\/([a-z0-9-]+)$/);
  return m?.[1] ?? null;
}

type RouteId = "overview" | "campaigns" | "editor" | "assets" | "facts" | "design-system" | "settings";

const ROUTES: readonly { id: RouteId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "campaigns", label: "Campaigns" },
  { id: "editor", label: "Campaign Editor" },
  { id: "assets", label: "Asset Library" },
  { id: "facts", label: "Product Facts" },
  { id: "design-system", label: "Design System" },
  { id: "settings", label: "Settings" },
];

function routeFromHash(): RouteId {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const found = ROUTES.find((r) => r.id === raw);
  return found ? found.id : "overview";
}

export function App(): ReactNode {
  return (
    <StudioProvider>
      <Shell />
    </StudioProvider>
  );
}

function Shell(): ReactNode {
  const [route, setRoute] = useState<RouteId>(() => routeFromHash());
  const exportId = exportCampaignFromHash();
  if (exportId) return <ExportPage campaignId={exportId} />;
  const [navOpen, setNavOpen] = useState(false);
  const { active, state, save, exportManifest, notify } = useStudio();

  useEffect(() => {
    const onHash = (): void => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = useCallback((next: RouteId) => {
    window.location.hash = `#/${next}`;
    setRoute(next);
    setNavOpen(false);
  }, []);

  const storageBad =
    state.storage.status !== "ok" ? state.storage.message ?? "Penyimpanan bermasalah." : null;

  return (
    <div data-studio-shell className="flex min-h-screen flex-col">
      <Header
        onToggleNav={() => setNavOpen((v) => !v)}
        navOpen={navOpen}
        onSave={save}
        canSave={Boolean(active)}
        onExport={() => {
          const result = exportManifest();
          if (result.ok) notify("ok", "Manifest JSON diunduh.");
          else notify("error", result.issues[0]?.message ?? "Export gagal: manifest belum valid.");
        }}
        canExport={Boolean(active)}
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-0 px-4 py-4 lg:gap-6">
        <Sidebar route={route} onNavigate={go} open={navOpen} />
        <main className="shell-scroll min-w-0 flex-1">
          {storageBad && (
            <div className="mb-4">
              <Notice kind="error">
                {storageBad} Perubahan tetap ada di sesi ini, tetapi tidak akan dipulihkan setelah reload.
              </Notice>
            </div>
          )}
          {route === "overview" && <OverviewPage onNavigate={go} />}
          {route === "campaigns" && <CampaignsPage onNavigate={go} />}
          {route === "editor" && <EditorPage />}
          {route === "assets" && <AssetLibraryPage />}
          {route === "facts" && <ProductFactsPage />}
          {route === "design-system" && <DesignSystemPage />}
          {route === "settings" && <SettingsPage />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function Header({
  onToggleNav,
  navOpen,
  onSave,
  canSave,
  onExport,
  canExport,
}: {
  onToggleNav: () => void;
  navOpen: boolean;
  onSave: () => void;
  canSave: boolean;
  onExport: () => void;
  canExport: boolean;
}): ReactNode {
  const { state, notice, dismissNotice } = useStudio();
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--charcoal)]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggleNav}
          aria-expanded={navOpen}
          aria-controls="studio-nav"
          className="cursor-pointer rounded-lg border border-[var(--line)] px-2 py-1 text-[14px] lg:hidden"
        >
          Menu
        </button>

        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-6 w-6 rounded-md bg-[var(--brand-blue)]"
            style={{ boxShadow: "inset 0 0 0 2px var(--brand-cyan)" }}
          />
          <div className="leading-tight">
            <p className="text-[15px] font-bold tracking-tight">
              TokenGateway <span className="text-[var(--brand-cyan)]">Creative Studio</span>
            </p>
            <p className="text-[12px] text-[var(--muted)]">Dashboard MVP — local single-user</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-[12px] text-[var(--muted)] sm:inline">
            Tersimpan: {state.savedAt ? new Date(state.savedAt).toLocaleTimeString("id-ID") : "belum"}
          </span>
          <Button onClick={onSave} disabled={!canSave} title="Simpan draft ke local storage">
            Simpan
          </Button>
          <Button onClick={onExport} disabled={!canExport} variant="primary" title="Unduh manifest JSON">
            Export JSON
          </Button>
        </div>
      </div>

      {notice && (
        <div className="mx-auto mb-3 w-full max-w-[1600px] px-4">
          <Notice kind={notice.kind} onDismiss={dismissNotice}>
            {notice.text}
          </Notice>
        </div>
      )}
    </header>
  );
}

function Sidebar({
  route,
  onNavigate,
  open,
}: {
  route: RouteId;
  onNavigate: (id: RouteId) => void;
  open: boolean;
}): ReactNode {
  const { state, create } = useStudio();
  return (
    <nav
      id="studio-nav"
      aria-label="Navigasi utama"
      className={`${open ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-60`}
    >
      <ul className="space-y-1">
        {ROUTES.map((r) => {
          const current = r.id === route;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onNavigate(r.id)}
                aria-current={current ? "page" : undefined}
                className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[14px] transition-colors ${
                  current
                    ? "bg-[var(--surface)] font-semibold text-[var(--text)] shadow-[inset_2px_0_0_var(--brand-cyan)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                }`}
              >
                {r.label}
                {r.id === "campaigns" && (
                  <span className="ml-2 text-[12px] text-[var(--muted)]">{state.campaigns.length}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
        <p className="text-[13px] font-semibold">Mulai cepat</p>
        <p className="mt-1 text-[12px] text-[var(--muted)]">
          Campaign baru dibuat dari template kosong.
        </p>
        <div className="mt-3">
          <Button
            variant="primary"
            onClick={() => {
              create("Campaign baru");
              onNavigate("editor");
            }}
          >
            Create Campaign
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Footer(): ReactNode {
  return (
    <footer className="border-t border-[var(--line)] px-4 py-3">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--muted)]">
        <span>Product facts snapshot: {SNAPSHOT_DATE}</span>
        <span>Content renderer terpasang di registry; export final diblokir — aset/fakta/font/geometry belum lolos gate.</span>
        <span>Export PNG belum tersedia di milestone ini.</span>
      </div>
    </footer>
  );
}
