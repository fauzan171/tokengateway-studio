import type { ReactNode } from "react";
import type { SlotDescriptor } from "../../../blueprints/descriptors";
import { Field } from "../../ui";

interface SlotFormProps {
  slots: readonly SlotDescriptor[];
  props: Record<string, unknown>;
  errors: readonly { path: string; message: string }[];
  onChange: (nextProps: Record<string, unknown>) => void;
}

function errorFor(errors: SlotFormProps["errors"], path: string): string | undefined {
  const needle = path.replace(/\[\]/g, "");
  return errors.find((e) => e.path.endsWith(needle))?.message;
}

function itemSlotPath(listPath: string, itemPath: string): string {
  return listPath + (itemPath ? "." + itemPath : "");
}

export function SlotForm({ slots, props, errors, onChange }: SlotFormProps): ReactNode {
  const setValue = (path: string, value: unknown): void => {
    onChange({ ...props, [path]: value });
  };

  const setListItem = (listPath: string, index: number, itemPath: string, value: unknown): void => {
    const current = Array.isArray(props[listPath]) ? [...(props[listPath] as unknown[])] : [];
    const item =
      typeof current[index] === "object" && current[index] !== null
        ? { ...(current[index] as Record<string, unknown>) }
        : {};
    if (itemPath) item[itemPath] = value;
    else current[index] = value;
    if (itemPath) current[index] = item;
    onChange({ ...props, [listPath]: current });
  };

  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const id = `slot-${slot.path.replace(/[^a-zA-Z0-9]/g, "-")}`;

        if (slot.kind === "list") {
          const items = Array.isArray(props[slot.path]) ? (props[slot.path] as unknown[]) : [];
          const canAdd = slot.maxItems === undefined || items.length < slot.maxItems;
          const canRemove = slot.minItems === undefined || items.length > slot.minItems;
          return (
            <fieldset key={slot.path} className="rounded-lg border border-[var(--line)] p-3">
              <legend className="px-1 text-[13px] font-medium text-[var(--muted)]">
                {slot.label} ({items.length})
              </legend>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="rounded-lg border border-[var(--line)] p-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[12px] text-[var(--muted)]">#{index + 1}</span>
                      {canRemove && (
                        <button
                          type="button"
                          className="cursor-pointer text-[12px] text-[var(--danger)]"
                          onClick={() => {
                            const next = items.filter((_, i) => i !== index);
                            setValue(slot.path, next);
                          }}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(slot.item ?? []).map((child) => {
                        const path = itemSlotPath(slot.path, child.path);
                        const value =
                          child.path === ""
                            ? String(item ?? "")
                            : String((item as Record<string, unknown>)?.[child.path] ?? "");
                        const error = errorFor(errors, path);
                        return (
                          <Field
                            key={path}
                            label={child.label}
                            hint={error ?? child.hint}
                            htmlFor={`${id}-${index}-${child.path}`}
                          >
                            <input
                              id={`${id}-${index}-${child.path}`}
                              type="text"
                              value={value}
                              aria-invalid={error ? true : undefined}
                              onChange={(e) =>
                                setListItem(slot.path, index, child.path, e.target.value)
                              }
                            />
                          </Field>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {canAdd && (
                <div className="mt-3">
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1 text-[13px]"
                    onClick={() => {
                      const blank =
                        slot.item && slot.item.length > 0
                          ? Object.fromEntries(slot.item.map((c) => [c.path, ""]))
                          : "";
                      setValue(slot.path, [...items, blank]);
                    }}
                  >
                    Tambah {slot.label.toLowerCase()}
                  </button>
                </div>
              )}
            </fieldset>
          );
        }

        const value = props[slot.path];
        const text = value === undefined || value === null ? "" : String(value);
        const error = errorFor(errors, slot.path);
        const hint = [error, slot.hint, slot.maxLength ? `Maks ${slot.maxLength} karakter` : null]
          .filter(Boolean)
          .join(" · ");

        return (
          <Field key={slot.path} label={slot.label + (slot.required ? " *" : "")} hint={hint} htmlFor={id}>
            {slot.kind === "longtext" ? (
              <textarea
                id={id}
                rows={3}
                value={text}
                aria-invalid={error ? true : undefined}
                onChange={(e) => setValue(slot.path, e.target.value)}
              />
            ) : (
              <input
                id={id}
                type="text"
                value={text}
                aria-invalid={error ? true : undefined}
                onChange={(e) => setValue(slot.path, e.target.value)}
              />
            )}
          </Field>
        );
      })}
    </div>
  );
}
