import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./studio/App";
import "./studio/theme.css";
/* Content design system: local faces + canvas-scoped token variables.
   Fonts/provenance approved files untouched; only imports are added. */
import "./design/fonts.css";
import "./design/tokens.generated.css";
import "./blueprints/content/content.css";

const container = document.getElementById("root");
if (!container) throw new Error("Elemen #root tidak ditemukan di index.html");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
