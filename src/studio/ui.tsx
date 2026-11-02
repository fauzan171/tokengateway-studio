import type { ReactNode } from "react";
import type { SlideStatus } from "./validation";

/* Shared shell primitives. Statically declared classes only: Tailwind must be
   able to see every class at build time, so no class name is built from data. */

export function Panel({
  title,
  actions,
  children,
  className = "",
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}): ReactNode {
  return (
    <section
      className={`rounded-xl border border-[var(--line)] bg-[var(--surface)] ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
          {title && <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = "default",
  disabled,
  type = "button",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}): ReactNode {
  const styles: Record<string, string> = {
    default:
      "border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--brand-cyan)] text-[var(--text)]",
    primary: "border border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white hover:brightness-110",
    ghost: "border border-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
    danger: "border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-[var(--charcoal)]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-[14px] font-medium transition-colors disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  /** `undefined` is allowed explicitly so call sites can pass a computed hint. */
  hint?: string | undefined;
  children: ReactNode;
  htmlFor?: string | undefined;
}): ReactNode {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1 block text-[13px] font-medium text-[var(--muted)]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-[var(--muted)]">{hint}</span>}
    </label>
  );
}

const STATUS_STYLES: Record<SlideStatus, string> = {
  valid: "border-[var(--ok)] text-[var(--ok)]",
  draft: "border-[var(--warn)] text-[var(--warn)]",
  error: "border-[var(--danger)] text-[var(--danger)]",
};

const STATUS_TEXT: Record<SlideStatus, string> = {
  valid: "VALID",
  draft: "DRAFT",
  error: "ERROR",
};

export function StatusChip({ status, label }: { status: SlideStatus; label?: string }): ReactNode {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${STATUS_STYLES[status]}`}
    >
      {label ?? STATUS_TEXT[status]}
    </span>
  );
}

export function Notice({
  kind,
  children,
  onDismiss,
}: {
  kind: "ok" | "error" | "info";
  children: ReactNode;
  onDismiss?: () => void;
}): ReactNode {
  const styles =
    kind === "ok"
      ? "border-[var(--ok)] bg-[rgba(70,211,154,0.08)]"
      : kind === "error"
        ? "border-[var(--danger)] bg-[rgba(255,107,107,0.08)]"
        : "border-[var(--line)] bg-[var(--surface-2)]";
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-[14px] ${styles}`}
    >
      <div>{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup notifikasi"
          className="cursor-pointer rounded px-1 text-[var(--muted)] hover:text-[var(--text)]"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}): ReactNode {
  return (
    <div className="rounded-xl border border-dashed border-[var(--line)] px-6 py-12 text-center">
      <p className="text-[16px] font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--muted)]">{body}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function formatDate(iso: string): string {
  if (!iso) return "belum pernah";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "tidak diketahui";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
