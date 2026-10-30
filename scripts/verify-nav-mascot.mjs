import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#hdr .nav-mascot-icon", { timeout: 15000 });

await page.mouse.move(200, 80);
await page.waitForTimeout(400);
await page.locator("#hdr .brand").screenshot({
  path: `${outDir}/nav-mascot-desktop-look-left.png`,
});

await page.mouse.move(1200, 120);
await page.waitForTimeout(400);
await page.locator("#hdr .brand").screenshot({
  path: `${outDir}/nav-mascot-desktop-look-right.png`,
});

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
});
await mobile.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await mobile.waitForFunction(
  () => {
    const el = document.querySelector("#hdr .brand");
    if (!el) return false;
    return parseFloat(getComputedStyle(el).opacity) > 0.5;
  },
  { timeout: 20000 }
);
await mobile.waitForTimeout(2800);
const hdrBox = await mobile.locator("#hdr").boundingBox();
if (hdrBox) {
  await mobile.screenshot({
    path: `${outDir}/nav-mascot-mobile-idle.png`,
    clip: { x: hdrBox.x, y: hdrBox.y, width: hdrBox.width, height: Math.min(hdrBox.height, 72) },
  });
}

await page.close();
await mobile.close();
await browser.close();
