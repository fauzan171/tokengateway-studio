/* Token engine: tokens.json -> typed access + generated CSS variables.
   Canvas-scoped only: variables live under [data-tg-canvas], never global. */
import raw from "./tokens.json";

export const tokens = raw;
export type Tokens = typeof raw;
export type TypeRole = keyof Tokens["typeScale"];

export const COLOR = raw.colors;
export const TYPE = raw.typeScale;
export const SPACE = raw.spacing;
export const SANS_STACK = raw.fonts.sans.stack;
export const MONO_STACK = raw.fonts.mono.stack;

export function fontStack(role: TypeRole): string {
  return raw.typeScale[role].family === "mono" ? MONO_STACK : SANS_STACK;
}

/** Deterministic CSS generated from tokens.json. Keep in sync by running tests. */
export function tokensCss(): string {
  const c = raw.colors;
  const lines: string[] = [`[data-tg-canvas]{`,
    `--tg-bg:${c.bg};--tg-surface:${c.surface};--tg-surface-elevated:${c.surfaceElevated};`,
    `--tg-line:${c.line};--tg-text:${c.textPrimary};--tg-text-2:${c.textSecondary};`,
    `--tg-accent:${c.accent};--tg-blue:${c.brandBlue};--tg-warn:${c.warn};--tg-error:${c.error};`,
    `--tg-muted-surface:${c.mutedSurface};`,
    `--tg-sans:${raw.fonts.sans.stack};--tg-mono:${raw.fonts.mono.stack};`,
    `background:var(--tg-bg);color:var(--tg-text);font-family:var(--tg-sans);`,
    `-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;`,
    `}`];
  return lines.join("");
}
