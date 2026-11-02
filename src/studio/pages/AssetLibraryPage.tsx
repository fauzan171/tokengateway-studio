import type { ReactNode } from "react";
import { ASSET_REGISTRY, type AssetStatus } from "../../assets/registry";
import { BLUEPRINT_LIST } from "../../blueprints/registry";
import { Panel } from "../ui";

const STATUS_LABEL: Record<AssetStatus, string> = {
  APPROVED_VECTOR: "APPROVED VECTOR",
  RASTER_REFERENCE: "RASTER REFERENCE",
  MISSING: "BELUM ADA",
  UNAPPROVED: "UNAPPROVED",
};

const STATUS_CLASS: Record<AssetStatus, string> = {
  APPROVED_VECTOR: "border-[var(--ok)] text-[var(--ok)]",
  RASTER_REFERENCE: "border-[var(--warn)] text-[var(--warn)]",
  MISSING: "border-[var(--danger)] text-[var(--danger)]",
  UNAPPROVED: "border-[var(--danger)] text-[var(--danger)]",
};

export function AssetLibraryPage(): ReactNode {
  const requiredIds = new Set(BLUEPRINT_LIST.flatMap((b) => b.requiredAssetIds));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[20px] font-bold tracking-tight">Asset Library</h1>
        <p className="text-[13px] text-[var(--muted)]">
          Inventory read-only. Upload dan manipulasi gambar belum tersedia di milestone ini.
        </p>
      </div>

      <Panel title="Status pengadaan">
        <ul className="space-y-2 text-[14px]">
          <li className="rounded-lg border border-[var(--warn)] px-3 py-2 text-[var(--warn)]">
            Logo TokenGateway yang tersedia adalah <strong>JPEG raster</strong>, bukan vector. Menempel raster ke
            dalam SVG tidak memenuhi syarat master vector.
          </li>
          <li className="rounded-lg border border-[var(--danger)] px-3 py-2 text-[var(--danger)]">
            Empat mark pihak ketiga (<code>glm.z</code>, <code>deepseek.whale</code>, <code>gemini.sparkle</code>,{" "}
            <code>qris.badge</code>) belum diakuisisi. Bentuk yang ditebak dari nama provider tidak diterima.
          </li>
          <li className="rounded-lg border border-[var(--line)] px-3 py-2">
            Placeholder teks bukan official logo dan tidak pernah diekspor sebagai asset final.
          </li>
        </ul>
      </Panel>

      <Panel title={`Required asset IDs (${ASSET_REGISTRY.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <caption className="sr-only">Daftar asset wajib beserta status dan provenance</caption>
            <thead>
              <tr className="border-b border-[var(--line)] text-[12px] uppercase tracking-wide text-[var(--muted)]">
                <th scope="col" className="py-2 pr-3">Asset ID</th>
                <th scope="col" className="py-2 pr-3">Label</th>
                <th scope="col" className="py-2 pr-3">Owner</th>
                <th scope="col" className="py-2 pr-3">Status</th>
                <th scope="col" className="py-2 pr-3">Diperlukan oleh</th>
                <th scope="col" className="py-2">Provenance</th>
              </tr>
            </thead>
            <tbody>
              {ASSET_REGISTRY.map((asset) => (
                <tr key={asset.id} className="border-b border-[var(--line)] align-top">
                  <td className="py-2 pr-3"><code>{asset.id}</code></td>
                  <td className="py-2 pr-3">{asset.label}</td>
                  <td className="py-2 pr-3">{asset.owner}</td>
                  <td className="py-2 pr-3">
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[asset.status]}`}>
                      {STATUS_LABEL[asset.status]}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    {requiredIds.has(asset.id)
                      ? BLUEPRINT_LIST.filter((b) => b.requiredAssetIds.includes(asset.id))
                          .map((b) => b.key)
                          .join(", ")
                      : "—"}
                  </td>
                  <td className="py-2 text-[12px] text-[var(--muted)]">
                    <p>{asset.source}</p>
                    <p>Diambil {asset.retrievedAt}</p>
                    <p className="mt-1">{asset.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {ASSET_REGISTRY.some((a) => a.path) && (
        <Panel title="Referensi lokal">
          {ASSET_REGISTRY.filter((a) => a.path).map((asset) => (
            <div key={asset.id} className="space-y-2">
              <p className="text-[13px] text-[var(--muted)]">
                <code>{asset.id}</code> — {asset.path}
              </p>
              <img
                src={asset.path}
                alt="Logo referensi TokenGateway (JPEG, bukan vector)"
                className="max-w-[420px] rounded-lg border border-[var(--line)]"
              />
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}
