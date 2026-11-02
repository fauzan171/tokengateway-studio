import { useMemo, useState, type ReactNode } from "react";
import { useStudio } from "../store";
import { validateDoc, overallStatus } from "../validation";
import { readCampaignName } from "../state";
import { Button, EmptyState, Field, Notice, Panel, StatusChip, formatDate } from "../ui";

export function CampaignsPage({ onNavigate }: { onNavigate: (id: "editor") => void }): ReactNode {
  const { state, active, create, duplicate, rename, remove, setActive, notify, restoreDeleted, dismissDeleted } =
    useStudio();
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return state.campaigns
      .map((campaign) => ({ campaign, validation: validateDoc(campaign.doc) }))
      .filter(({ campaign }) =>
        needle === "" ? true : campaign.name.toLowerCase().includes(needle) || campaign.id.includes(needle),
      );
  }, [state.campaigns, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[20px] font-bold tracking-tight">Campaigns</h1>
        <div className="flex flex-wrap items-end gap-2">
          <div className="w-56">
            <Field label="Cari campaign" htmlFor="campaign-search">
              <input
                id="campaign-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="nama atau ID"
                aria-label="Cari campaign"
              />
            </Field>
          </div>
          <div className="w-56">
            <Field label="Nama campaign baru" htmlFor="campaign-new-name">
              <input
                id="campaign-new-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="mis. Campaign F"
              />
            </Field>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              create(newName.trim() || "Campaign baru");
              setNewName("");
              notify("ok", "Campaign dibuat.");
            }}
          >
            Create
          </Button>
        </div>
      </div>

      {state.recentlyDeleted && (
        <Notice kind="info" onDismiss={dismissDeleted}>
          <div className="flex flex-wrap items-center gap-3">
            <span>“{state.recentlyDeleted.name}” dihapus.</span>
            <Button
              onClick={() => {
                restoreDeleted();
                notify("ok", "Campaign dipulihkan.");
              }}
            >
              Undo hapus
            </Button>
          </div>
        </Notice>
      )}

      {rows.length === 0 ? (
        <EmptyState
          title={state.campaigns.length === 0 ? "Belum ada campaign" : "Tidak ada hasil"}
          body={
            state.campaigns.length === 0
              ? "Buat campaign pertama untuk mulai mengedit slide."
              : "Tidak ada campaign yang cocok dengan pencarian."
          }
        />
      ) : (
        <Panel title={`${rows.length} campaign`}>
          <ul className="divide-y divide-[var(--line)]">
            {rows.map(({ campaign, validation }) => (
              <li key={campaign.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  {renamingId === campaign.id ? (
                    <div className="flex flex-wrap items-end gap-2">
                      <div className="w-64">
                        <Field label="Nama baru" htmlFor={`rename-${campaign.id}`}>
                          <input
                            id={`rename-${campaign.id}`}
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                          />
                        </Field>
                      </div>
                      <Button
                        onClick={() => {
                          const next = renameValue.trim();
                          if (next) rename(campaign.id, next);
                          setRenamingId(null);
                        }}
                      >
                        Simpan nama
                      </Button>
                      <Button variant="ghost" onClick={() => setRenamingId(null)}>
                        Batal
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="truncate text-[15px] font-medium">
                        {campaign.name}
                        {campaign.id === active?.id && (
                          <span className="ml-2 text-[12px] text-[var(--brand-cyan)]">aktif</span>
                        )}
                      </p>
                      <p className="text-[12px] text-[var(--muted)]">
                        ID {campaign.id} · {validation.counts.total} slide · diubah {formatDate(campaign.updatedAt)}
                      </p>
                      <p className="mt-1 text-[12px] text-[var(--muted)]">
                        Formats: {formatsOf(campaign.doc)} · Validation: {validation.counts.valid} valid,{" "}
                        {validation.counts.draft} draft, {validation.counts.error} error
                      </p>
                    </>
                  )}
                </div>

                <StatusChip status={overallStatus(validation)} />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => {
                      setActive(campaign.id);
                      onNavigate("editor");
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    onClick={() => {
                      setRenamingId(campaign.id);
                      setRenameValue(campaign.name);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    onClick={() => {
                      duplicate(campaign.id);
                      notify("ok", "Campaign diduplikasi dengan ID dan slide ID baru.");
                    }}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      remove(campaign.id);
                      notify("info" as "ok", `“${campaign.name}” dihapus.`);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {state.campaigns.length > 0 && (
        <p className="text-[12px] text-[var(--muted)]">
          Duplicate membuat campaign ID dan slide ID baru; rename tidak mengubah ID mana pun.
        </p>
      )}
    </div>
  );
}

function formatsOf(doc: unknown): string {
  if (typeof doc !== "object" || doc === null) return "—";
  const record = doc as Record<string, unknown>;
  const formats = Array.isArray(record.formats) ? record.formats.map(String) : [];
  const profiles = Array.isArray(record.verticalProfiles) ? record.verticalProfiles.map(String) : [];
  const name = readCampaignName(doc);
  void name;
  return [...formats, ...profiles].join(", ") || "—";
}
