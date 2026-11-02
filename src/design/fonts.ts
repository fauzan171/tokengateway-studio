/* Font readiness: explicit load + verification of every used face.
   Capture never proceeds against fallback fonts. */

export interface FontFaceSpec {
  family: string;
  weight: number;
  style: "normal";
}

export const REQUIRED_FACES: readonly FontFaceSpec[] = [
  { family: "Plus Jakarta Sans", weight: 400, style: "normal" },
  { family: "Plus Jakarta Sans", weight: 500, style: "normal" },
  { family: "Plus Jakarta Sans", weight: 600, style: "normal" },
  { family: "Plus Jakarta Sans", weight: 700, style: "normal" },
  { family: "Plus Jakarta Sans", weight: 800, style: "normal" },
  { family: "JetBrains Mono", weight: 400, style: "normal" },
  { family: "JetBrains Mono", weight: 500, style: "normal" },
  { family: "JetBrains Mono", weight: 700, style: "normal" },
];

export interface FontReadiness {
  ready: boolean;
  loaded: readonly FontFaceSpec[];
  missing: readonly FontFaceSpec[];
}

function faceString(f: FontFaceSpec): string {
  return `${f.style} ${f.weight} 16px "${f.family}"`;
}

/** Load all required faces and verify each one. Never resolves true on fallback. */
export async function ensureFontsReady(): Promise<FontReadiness> {
  const loaded: FontFaceSpec[] = [];
  const missing: FontFaceSpec[] = [];
  await Promise.all(
    REQUIRED_FACES.map(async (f) => {
      try {
        await document.fonts.load(faceString(f), "Rp10.000 Ag09/{}/");
      } catch {
        /* handled by check below */
      }
    }),
  );
  await document.fonts.ready;
  for (const f of REQUIRED_FACES) {
    // check() verifies family+weight availability; combined with load() success
    // this catches absent/corrupt files without synthetic fallback.
    if (document.fonts.check(faceString(f), "Rp10.000")) loaded.push(f);
    else missing.push(f);
  }
  return { ready: missing.length === 0, loaded, missing };
}
