import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.NAV_BORDER_URL || "http://127.0.0.1:3001/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.querySelector("header")?.classList.add("scrolled");
  window.scrollTo(0, 400);
});
await page.waitForTimeout(200);

const headerStyle = await page.locator("header.scrolled").evaluate((el) => {
  const s = getComputedStyle(el);
  return { boxShadow: s.boxShadow, borderBottom: s.borderBottomWidth };
});

console.log("header.scrolled styles:", headerStyle);
if (headerStyle.boxShadow && headerStyle.boxShadow !== "none") {
  console.error("Expected no box-shadow on scrolled header");
  process.exitCode = 1;
}

await page.locator("header").screenshot({ path: `${outDir}/nav-no-bottom-border-scrolled.png`, timeout: 8000 });
await browser.close();
