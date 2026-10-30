import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await page.locator(".manifest h2").scrollIntoViewIfNeeded();
await page.evaluate(() => {
  const h2 = document.querySelector(".manifest h2");
  if (!h2) return;
  const top = h2.getBoundingClientRect().top + window.scrollY;
  const center = top + h2.offsetHeight / 2 - window.innerHeight / 2;
  window.scrollTo({ top: center, behavior: "instant" });
});
await page.waitForTimeout(800);
await page.mouse.move(900, 420);
await page.waitForTimeout(350);
await page.locator(".manifest").screenshot({
  path: `${outDir}/manifest-mascot-en-desktop.png`,
});

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
});
await mobile.goto(`${base}/nl`, { waitUntil: "domcontentloaded" });
await mobile.locator(".manifest h2").scrollIntoViewIfNeeded();
await mobile.evaluate(() => {
  const h2 = document.querySelector(".manifest h2");
  if (!h2) return;
  const top = h2.getBoundingClientRect().top + window.scrollY;
  const center = top + h2.offsetHeight / 2 - window.innerHeight / 2;
  window.scrollTo({ top: center, behavior: "instant" });
});
await mobile.waitForTimeout(3200);
await mobile.locator(".manifest").screenshot({
  path: `${outDir}/manifest-mascot-nl-mobile.png`,
});

await page.close();
await mobile.close();
await browser.close();
