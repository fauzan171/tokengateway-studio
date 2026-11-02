# `src/design/` — reserved for the content design system

This directory is intentionally empty of tokens in the dashboard milestone.

Session two (briefs/09_CONTENT_DESIGN_SYSTEM_PROMPT.md) owns:

- `tokens.json` and the generated stylesheet for **content** tokens: semantic
  colors, font scale, spacing, borders, format dimensions, safe profiles.
- Local self-hosted WOFF2 faces (Plus Jakarta Sans, JetBrains Mono) plus
  `fonts.css` and the font readiness check.
- Capture CSS used by the `/render` route.

Boundary rule that must not change: these tokens apply to the **canvas**. The
studio shell theme in `src/studio/theme.css` is scoped to `[data-studio-shell]`
and must never leak global `h1`/`body` typography into the canvas. Canvas
typography comes from content tokens only.

Nothing in `src/studio/`, `src/contracts/`, or `src/facts/` needs a rewrite when
this directory is filled in: the stage already renders through the
`LayoutRenderer` contract in `src/canvas/renderer.ts`.
