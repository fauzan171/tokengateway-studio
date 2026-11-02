import type { ReactNode } from "react";
import { useStudio } from "../store";
import { validateDoc, overallStatus, type SlideStatus } from "../validation";
import { readSlides } from "../state";
import { Button, EmptyState, Panel, StatusChip, formatDate } from "../ui";
import { FIXTURES } from "../fixtures";
import type { Manifest } from "../../contracts/campaign.schema";

export function OverviewPage({ onNavigate }: { onNavigate: (id: "campaigns" | "editor") => void }): ReactNode {
  const { state, create, importText, notify, setActive } = useStudio();

  if (state.campaigns.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-[20px] font-bold tracking-tight">Overview</h1>
        <EmptyState
          title="Belum ada campaign"
          body="Buat campaign kosong untuk mulai mengedit, atau muat fixture sample dari brief untuk melihat bentuk dokumen yang valid."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="primary" onClick={() => create("Campaign baru")}>
                Create Campaign
              </Button>
            </div>
          }
        />
        <Panel title="Fixture sample">
          <p className="text-[13px] text-[var(--muted)]">
            Fixture berasal dari briefs/06_CAMPAIGN_BRIEFS.md. Sample bukan bukti checkout atau inference sukses.
          </p>
          <ul className="mt-3 space-y-2">
            {FIXTURES.map((f) => (
              <li key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--line)] px-3 py-2">
                <div>
                  <p className="text-[14px] font-medium">{f.label}</p>
                  <p className="text-[12px] text-[var(--muted)]">{f.note}</p>
                </div>
                <Button
                  onClick={() => {
                    const issues = importText(JSON.stringify(f.manifest satisfies Manifest));
                    if (issues.length > 0) notify("error", issues[0]!.message);
                    else notify("ok", `${f.label} dimuat.`);
                  }}
                >
                  Muat
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    );
  }

  const perCampaign = state.campaigns.map((c) => ({ campaign: c, validation: validateDoc(c.doc) }));
  const totalSlides = perCampaign.reduce((sum, c) => sum + c.validation.counts.total, 0);
  const totals = perCampaign.reduce(
    (acc, c) => ({
      valid: acc.valid + c.validation.counts.valid,
      draft: acc.draft + c.validation.counts.draft,
      error: acc.error + c.validation.counts.error,
    }),
    { valid: 0, draft: 0, error: 0 },
  );

  const recent = [...perCampaign]
    .sort((a, b) => b.campaign.updatedAt.localeCompare(a.campaign.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold tracking-tight">Overview</h1>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate("campaigns")}>Lihat semua campaign</Button>
          <Button variant="primary" onClick={() => create("Campaign baru")}>
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Campaign" value={state.campaigns.length} />
        <Stat label="Slide" value={totalSlides} />
        <Stat label="Valid" value={totals.valid} status="valid" />
        <Stat label="Draft" value={totals.draft} status="draft" />
      </div>

      {totals.error > 0 && (
        <Panel title="Slide dengan error schema">
          <p role="alert" className="text-[14px] text-[var(--danger)]">
            {totals.error} slide gagal validasi. Buka editor untuk melihat path error.
          </p>
          <ul className="mt-2 space-y-1 text-[13px] text-[var(--muted)]">
            {perCampaign
              .filter((c) => c.validation.counts.error > 0)
              .map((c) => (
                <li key={c.campaign.id}>
                  {c.campaign.name}: {c.validation.counts.error} slide ·{" "}
                  {c.validation.slides
                    .filter((s) => s.status === "error")
                    .map((s) => s.id)
                    .join(", ")}
                </li>
              ))}
          </ul>
        </Panel>
      )}

      <Panel title="Recent campaigns">
        <ul className="divide-y divide-[var(--line)]">
          {recent.map(({ campaign, validation }) => (
            <li key={campaign.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium">{campaign.name}</p>
                <p className="text-[12px] text-[var(--muted)]">
                  {validation.counts.total} slide · diubah {formatDate(campaign.updatedAt)}
                </p>
              </div>
              <StatusChip status={overallStatus(validation)} />
              <Button
                onClick={() => {
                  setActive(campaign.id);
                  onNavigate("editor");
                }}
              >
                Open Editor
              </Button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Stat({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status?: SlideStatus;
}): ReactNode {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
      <p className="text-[12px] uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-[24px] font-bold">
        {value}
        {status && <StatusChip status={status} />}
      </p>
    </div>
  );
}

/** Slides helper re-exported for the header summary in this page. */
export function campaignSlideCount(doc: unknown): number {
  return readSlides(doc).length;
}
