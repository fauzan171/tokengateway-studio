/* Export slide PNG untuk campaign developer via route tersembunyi #/export/<id>.
   Jalankan: npm run studio (terminal lain), lalu: node scripts/export-slides.mjs
   Hasil: output/tokengateway-carousel-dev/slide-NN.png (1080×1350, draft proof). */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const campaignId = process.argv[2] ?? "campaign-dev-openai-compatible";
const outName = process.argv[3] ?? "tokengateway-carousel-dev";
const base = process.argv[4] ?? "http://127.0.0.1:5173";
const outDir = new URL(`../output/${outName}/`, import.meta.url).pathname;
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error" && !m.location().url.endsWith("favicon.ico")) errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

await page.goto(`${base}/#/export/${campaignId}`, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await document.fonts.ready;
});
await page.waitForTimeout(300);

const slides = await page.$$("[data-tg-slide] > [data-tg-canvas]");
for (let i = 0; i < slides.length; i++) {
  await slides[i].screenshot({ path: `${outDir}slide-0${i + 1}.png` });
  console.log(`slide-0${i + 1}.png`);
}
await browser.close();
if (errors.length) {
  console.error(errors.slice(0, 10).join("\n"));
  process.exit(1);
}
console.log(`OK: ${slides.length} slide → ${outDir}`);
