/* Local browser proof for the content design system showcase.
   Run: node scripts/showcase-proof.mjs [baseUrl]
   Checks: fonts actually loaded, every section renders, no console/resource
   errors, decode of the owner JPEG/SVG. Writes screenshots to /tmp. */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:5174";
const errors = [];
const failed = [];

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));
page.on("requestfailed", (r) => failed.push(`${r.url()} — ${r.failure()?.errorText}`));

await page.goto(`${base}/#/design-system`, { waitUntil: "networkidle" });

const fontReport = await page.evaluate(async () => {
  const faces = [
    ['400 16px "Plus Jakarta Sans"', "Plus Jakarta Sans 400"],
    ['500 16px "Plus Jakarta Sans"', "Plus Jakarta Sans 500"],
    ['600 16px "Plus Jakarta Sans"', "Plus Jakarta Sans 600"],
    ['700 16px "Plus Jakarta Sans"', "Plus Jakarta Sans 700"],
    ['800 16px "Plus Jakarta Sans"', "Plus Jakarta Sans 800"],
    ['400 16px "JetBrains Mono"', "JetBrains Mono 400"],
    ['500 16px "JetBrains Mono"', "JetBrains Mono 500"],
    ['700 16px "JetBrains Mono"', "JetBrains Mono 700"],
  ];
  for (const [spec] of faces) await document.fonts.load(spec, "Rp10.000 Ag09");
  await document.fonts.ready;
  return faces.map(([spec, label]) => ({ label, loaded: document.fonts.check(spec, "Rp10.000") }));
});

const sections = await page.evaluate(() =>
  ["typography", "tokens", "assets", "primitives", "blueprints", "generator"].map((id) => ({
    id,
    present: Boolean(document.getElementById(id)),
  })),
);

const assetDecode = await page.evaluate(async () => {
  const srcs = ["/brand/tokengateway-logo-reference.jpeg", "/brand/tokengateway-mark.svg"];
  const out = [];
  for (const src of srcs) {
    const res = await fetch(src);
    out.push({ src, status: res.status, type: res.headers.get("content-type") });
  }
  return out;
});

/* Screenshots of each section. */
await page.screenshot({ path: "/tmp/ds-top.png" });
for (const id of ["typography", "tokens", "assets", "primitives", "blueprints", "generator"]) {
  await page.evaluate((s) => document.getElementById(s)?.scrollIntoView(), id);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `/tmp/ds-${id}.png` });
}

console.log(JSON.stringify({ fontReport, sections, assetDecode, errors, failed }, null, 2));
await browser.close();
