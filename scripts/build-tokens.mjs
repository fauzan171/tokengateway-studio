import { readFileSync, writeFileSync } from "node:fs";

/* Generates src/design/tokens.generated.css from src/design/tokens.json.
   Run: node scripts/build-tokens.mjs  (also wired to npm run build via prebuild) */
const raw = JSON.parse(readFileSync(new URL("../src/design/tokens.json", import.meta.url), "utf8"));
const c = raw.colors;
const css = `/* GENERATED from src/design/tokens.json — do not edit by hand. Regenerate: node scripts/build-tokens.mjs */
[data-tg-canvas]{
--tg-bg:${c.bg};--tg-surface:${c.surface};--tg-surface-elevated:${c.surfaceElevated};
--tg-line:${c.line};--tg-text:${c.textPrimary};--tg-text-2:${c.textSecondary};
--tg-accent:${c.accent};--tg-blue:${c.brandBlue};--tg-warn:${c.warn};--tg-error:${c.error};
--tg-muted-surface:${c.mutedSurface};
--tg-sans:${raw.fonts.sans.stack};--tg-mono:${raw.fonts.mono.stack};
background:var(--tg-bg);color:var(--tg-text);font-family:var(--tg-sans);
-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
}
`;
writeFileSync(new URL("../src/design/tokens.generated.css", import.meta.url), css);
console.log("tokens.generated.css:", css.length, "bytes");
