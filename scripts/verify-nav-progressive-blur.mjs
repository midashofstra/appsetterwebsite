import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.NAV_BLUR_URL || "http://127.0.0.1:3001/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
await page.evaluate(() => window.scrollTo(0, 420));
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/nav-progressive-blur-scroll-1440.png` });
const layers = await page.locator("#hdr .progressive-blur__layer").count();
const hdrPe = await page.locator("header .brand").evaluate((el) => {
  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  return document.elementFromPoint(x, y) === el || el.contains(document.elementFromPoint(x, y));
});
console.log({ layers, brandClickableStack: hdrPe });
if (layers !== 5) process.exitCode = 1;
if (!hdrPe) process.exitCode = 1;
await browser.close();
