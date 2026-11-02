import type { ReactNode } from "react";
import { factsSnapshot, SNAPSHOT_DATE } from "../../facts/registry";
import { formatIdr, formatQuota, formatValidity } from "../fact-format";
import { Panel, StatusChip } from "../ui";

export function ProductFactsPage(): ReactNode {
  const { packages, models, facts, pendingOperational, sourceUrls } = factsSnapshot;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[20px] font-bold tracking-tight">Product Facts</h1>
        <p className="text-[13px] text-[var(--muted)]">
          Snapshot statis <strong>{SNAPSHOT_DATE}</strong>. Ini bukan live feed: nilai dibaca dari katalog publik
          pada tanggal tersebut dan harus di-refresh sebelum publikasi. Tidak ada login, checkout POST, atau API
          key pengguna di studio ini.
        </p>
      </div>

      <Panel title="Sumber dan keterbatasan">
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-[var(--muted)]">
          {sourceUrls.map((url) => (
            <li key={url}><code>{url}</code></li>
          ))}
          <li>Kategori <code>single</code> dari katalog tidak otomatis berarti tepat satu model ID.</li>
          <li>
            Harga paket bukan total checkout. Pricing mempublikasikan biaya layanan 0,8% dengan rumus{" "}
            <code>ceil(subtotal × 0.008)</code>; invoice aktual belum diverifikasi.
          </li>
        </ul>
      </Panel>

      <Panel title="Offer prioritas">
        {packages
          .filter((p) => p.packageId === "pass-glm-5.3-flash-50m")
          .map((p) => {
            const quota = formatQuota(p.grantTokens);
            return (
              <dl key={p.packageId} className="grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
                <Detail label="Nama" value={p.name} />
                <Detail label="Package ID" value={`${p.packageId} v${p.version}`} mono />
                <Detail label="Harga paket" value={formatIdr(p.priceIdr)} />
                <Detail label="Kuota" value={`${quota.compact} (${quota.exact})`} mono />
                <Detail label="Masa berlaku" value={formatValidity(p.validityDays)} />
                <Detail label="Model ID" value={p.modelIds.join(", ")} mono />
              </dl>
            );
          })}
        <p className="mt-3 text-[13px] text-[var(--warn)]">
          Tampilkan sebagai “harga paket”, bukan “total bayar”. Belum termasuk biaya layanan checkout.
        </p>
      </Panel>

      <Panel title={`Katalog paket (${packages.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <caption className="sr-only">Snapshot paket publik</caption>
            <thead>
              <tr className="border-b border-[var(--line)] text-[12px] uppercase tracking-wide text-[var(--muted)]">
                <th scope="col" className="py-2 pr-3">Paket</th>
                <th scope="col" className="py-2 pr-3">Harga</th>
                <th scope="col" className="py-2 pr-3">Kuota</th>
                <th scope="col" className="py-2 pr-3">Berlaku</th>
                <th scope="col" className="py-2 pr-3">Model IDs</th>
                <th scope="col" className="py-2">ID / versi</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.packageId} className="border-b border-[var(--line)] align-top">
                  <td className="py-2 pr-3">{p.name}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatIdr(p.priceIdr)}</td>
                  <td className="py-2 pr-3 tabular-nums">{formatQuota(p.grantTokens).exact}</td>
                  <td className="py-2 pr-3 tabular-nums">{p.validityDays} hari</td>
                  <td className="py-2 pr-3 text-[12px]"><code>{p.modelIds.join(", ")}</code></td>
                  <td className="py-2 text-[12px]"><code>{p.packageId}</code> v{p.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`Katalog model (${models.length})`}>
        <ul className="grid gap-1 text-[13px] sm:grid-cols-2">
          {models.map((m) => (
            <li key={m.modelId} className="flex flex-wrap items-baseline gap-2">
              <code className="text-[12px]">{m.modelId}</code>
              <span>{m.name}</span>
              {!m.inPackageSnapshot && (
                <span className="text-[11px] text-[var(--warn)]">belum pada snapshot paket</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-[var(--muted)]">
          Label gateway. Bukan sertifikat bahwa upstream identik dengan model vendor tertentu, dan bukan benchmark.
        </p>
      </Panel>

      <Panel title={`Register klaim (${facts.length})`}>
        <ul className="space-y-2">
          {facts.map((f) => (
            <li key={f.id} className="rounded-lg border border-[var(--line)] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <code className="text-[12px]">{f.id}</code>
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                  f.status === "PENDING"
                    ? "border-[var(--danger)] text-[var(--danger)]"
                    : f.status === "OWNER"
                      ? "border-[var(--brand-cyan)] text-[var(--brand-cyan)]"
                      : "border-[var(--ok)] text-[var(--ok)]"
                }`}>
                  {f.status}
                </span>
              </div>
              <p className="mt-1 text-[14px]">{f.claim}</p>
              <p className="text-[12px] text-[var(--muted)]">
                Sumber: {f.source} · diverifikasi {f.verifiedAt}
              </p>
              {f.value?.kind === "TOKEN_BUNDLE" && (
                <p className="mt-1 text-[12px] text-[var(--muted)]">
                  Structured: TOKEN_BUNDLE · {formatIdr(f.value.priceIdr)} ·{" "}
                  {formatQuota(f.value.tokenQuota).exact} · {f.value.modelIds.join(", ")} ·{" "}
                  {formatValidity(f.value.validityDays)}
                </p>
              )}
              {f.notes && <p className="mt-1 text-[12px] text-[var(--muted)]">{f.notes}</p>}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Pending operational details">
        <ul className="list-disc space-y-1 pl-5 text-[13px] text-[var(--warn)]">
          {pendingOperational.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-[var(--muted)]">
          Item di atas tidak boleh diubah menjadi klaim pasti di konten.
        </p>
      </Panel>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }): ReactNode {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-wide text-[var(--muted)]">{label}</dt>
      <dd className={mono ? "font-mono text-[13px]" : "text-[14px]"}>{value}</dd>
    </div>
  );
}

export function renderStatusChip(): ReactNode {
  return <StatusChip status="draft" label="SNAPSHOT" />;
}
