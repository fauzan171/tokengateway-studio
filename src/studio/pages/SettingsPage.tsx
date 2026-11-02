import { useRef, useState, type ReactNode } from "react";
import { useStudio } from "../store";
import { clearDrafts } from "../persistence";
import { PROFILE_IDS, SAFE_PROFILES, type ProfileId } from "../../contracts/formats";
import { FIXTURES } from "../fixtures";
import { Button, Field, Notice, Panel } from "../ui";

export function SettingsPage(): ReactNode {
  const { state, setPreferences, resetPreferences, importText, exportManifest, notify, active } = useStudio();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importIssues, setImportIssues] = useState<readonly { path: string; message: string }[]>([]);
  const prefs = state.preferences;

  const onFile = async (file: File): Promise<void> => {
    const text = await file.text();
    const issues = importText(text);
    setImportIssues(issues);
    if (issues.length === 0) notify("ok", `Manifest “${file.name}” diimpor.`);
    else notify("error", "Import ditolak. Campaign aktif tidak diubah.");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[20px] font-bold tracking-tight">Settings</h1>

      <Panel title="Default preview">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Format default" htmlFor="pref-format">
            <select
              id="pref-format"
              value={prefs.defaultFormat}
              onChange={(e) =>
                setPreferences({ defaultFormat: e.target.value as "IG_CAROUSEL" | "VERTICAL" })
              }
            >
              <option value="IG_CAROUSEL">IG_CAROUSEL (4:5)</option>
              <option value="VERTICAL">VERTICAL (9:16)</option>
            </select>
          </Field>

          <Field label="Vertical profile default" htmlFor="pref-profile">
            <select
              id="pref-profile"
              value={prefs.defaultVerticalProfile}
              onChange={(e) =>
                setPreferences({ defaultVerticalProfile: e.target.value as "IG_STORY" | "TIKTOK" })
              }
            >
              <option value="IG_STORY">IG_STORY</option>
              <option value="TIKTOK">TIKTOK conservative</option>
            </select>
          </Field>

          <Field label="Zoom awal stage" htmlFor="pref-zoom" hint="10–100%">
            <input
              id="pref-zoom"
              type="number"
              min={10}
              max={100}
              value={Math.round(prefs.defaultZoom * 100)}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (Number.isFinite(value)) setPreferences({ defaultZoom: Math.min(1, Math.max(0.1, value / 100)) });
              }}
            />
          </Field>

          <Field label="Safe guides saat preview" htmlFor="pref-guides">
            <label className="flex items-center gap-2 text-[14px]">
              <input
                id="pref-guides"
                type="checkbox"
                className="h-4 w-4"
                checked={prefs.showSafeGuides}
                onChange={(e) => setPreferences({ showSafeGuides: e.target.checked })}
              />
              Tampilkan batas safe area (tidak pernah masuk export)
            </label>
          </Field>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => {
              resetPreferences();
              notify("ok", "Preferensi dikembalikan ke default.");
            }}
          >
            Reset preferensi
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
            <caption className="sr-only">Profil format dan inset yang dipakai</caption>
            <thead>
              <tr className="border-b border-[var(--line)] text-[12px] uppercase tracking-wide text-[var(--muted)]">
                <th scope="col" className="py-2 pr-3">Profile</th>
                <th scope="col" className="py-2 pr-3">Canvas (CSS px)</th>
                <th scope="col" className="py-2">Inset L/T/R/B</th>
              </tr>
            </thead>
            <tbody>
              {PROFILE_IDS.map((id: ProfileId) => {
                const p = SAFE_PROFILES[id];
                return (
                  <tr key={id} className="border-b border-[var(--line)]">
                    <td className="py-2 pr-3"><code>{id}</code></td>
                    <td className="py-2 pr-3 tabular-nums">{p.canvas.width}×{p.canvas.height}</td>
                    <td className="py-2 tabular-nums">
                      {p.inset.left}/{p.inset.top}/{p.inset.right}/{p.inset.bottom}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Import / export manifest">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
              e.target.value = "";
            }}
          />
          <Button onClick={() => fileRef.current?.click()}>Pilih file JSON…</Button>
          <Button
            variant="primary"
            disabled={!active}
            onClick={() => {
              const result = exportManifest();
              if (result.ok) notify("ok", "Manifest JSON diunduh.");
              else notify("error", result.issues[0]?.message ?? "Export gagal: manifest belum valid.");
            }}
          >
            Export manifest aktif
          </Button>
        </div>
        <p className="mt-2 text-[12px] text-[var(--muted)]">
          Batas 1 MiB. Import divalidasi terhadap schema penuh sebelum dipakai; import yang gagal tidak mengubah
          campaign aktif.
        </p>

        {importIssues.length > 0 && (
          <div className="mt-3">
            <Notice kind="error">
              Import ditolak:
              <ul className="mt-1 list-disc pl-5 text-[13px]">
                {importIssues.map((i, index) => (
                  <li key={index}>
                    <code>{i.path || "(root)"}</code> — {i.message}
                  </li>
                ))}
              </ul>
            </Notice>
          </div>
        )}
      </Panel>

      <Panel title="Draft recovery">
        <p className="text-[13px] text-[var(--muted)]">
          Draft disimpan otomatis di local storage ber-version. Tersimpan:{" "}
          {state.savedAt ? new Date(state.savedAt).toLocaleString("id-ID") : "belum pernah"} · status penyimpanan:{" "}
          {state.storage.status}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              clearDrafts();
              notify("ok", "Draft lokal dihapus. Muat ulang halaman untuk mulai bersih.");
            }}
          >
            Hapus draft lokal
          </Button>
        </div>
        <p className="mt-2 text-[12px] text-[var(--warn)]">
          Menghapus draft lokal tidak menyentuh manifest yang sudah diunduh, dan tidak menghapus campaign di memori
          sampai halaman dimuat ulang.
        </p>
      </Panel>

      <Panel title="Fixture sample">
        <ul className="space-y-2">
          {FIXTURES.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--line)] px-3 py-2">
              <div>
                <p className="text-[14px]">{f.label}</p>
                <p className="text-[12px] text-[var(--muted)]">{f.note}</p>
              </div>
              <Button
                onClick={() => {
                  const issues = importText(JSON.stringify(f.manifest));
                  setImportIssues(issues);
                  if (issues.length === 0) notify("ok", `${f.label} dimuat sebagai campaign.`);
                }}
              >
                Muat
              </Button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Di luar scope milestone ini">
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-[var(--muted)]">
          <li>AI provider atau API key setting — tidak ada di studio ini.</li>
          <li>Cloud auth, collaboration, backend database, dan payments.</li>
          <li>Export PNG dan batch render — renderer terpasang, tapi diblokir sampai aset/fakta/font/geometry lolos gate.</li>
        </ul>
      </Panel>
    </div>
  );
}
