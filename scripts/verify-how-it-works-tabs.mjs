import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await page.locator("#kanalen").scrollIntoViewIfNeeded();
await page.waitForSelector(".bouncy-tabs--ready", { timeout: 15000 });

await page.locator("#kanalen").screenshot({
  path: `${outDir}/how-it-works-en-desktop-step1.png`,
});

for (const label of ["2 · Calendar", "3 · Book"]) {
  await page.getByRole("tab", { name: label }).click();
  await page.waitForTimeout(600);
  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-en-desktop-${label.replace(/\s+/g, "-").toLowerCase()}.png`,
  });
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}/nl`, { waitUntil: "domcontentloaded" });
await mobile.locator("#kanalen").scrollIntoViewIfNeeded();
await mobile.waitForSelector(".bouncy-tabs--ready", { timeout: 15000 });
await mobile.getByRole("tab", { name: "2 · Agenda" }).click();
await mobile.waitForTimeout(500);
await mobile.locator(".bouncy-tabs__collection").screenshot({
  path: `${outDir}/how-it-works-nl-mobile-step2.png`,
});

await page.close();
await mobile.close();
await browser.close();
