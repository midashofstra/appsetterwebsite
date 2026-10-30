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

await page.screenshot({ path: `${outDir}/bouncy-channels-en-desktop-linkedin.png` });

for (const label of ["Email", "WhatsApp"]) {
  await page.getByRole("tab", { name: label }).click();
  await page.waitForTimeout(600);
  await page.locator("#kanalen").screenshot({
    path: `${outDir}/bouncy-channels-en-desktop-${label.toLowerCase()}.png`,
  });
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await mobile.locator("#kanalen").scrollIntoViewIfNeeded();
await mobile.waitForSelector(".bouncy-tabs--ready", { timeout: 15000 });
const overflow = await mobile.evaluate(() => {
  const nav = document.querySelector(".bouncy-tabs__nav");
  const section = document.querySelector("#kanalen");
  return {
    navScroll: nav.scrollWidth > nav.clientWidth + 2,
    sectionOverflow: section.scrollWidth > section.clientWidth + 2,
  };
});
console.log("mobile overflow", overflow);
if (overflow.sectionOverflow) process.exitCode = 1;
await mobile.getByRole("tab", { name: "WhatsApp" }).click();
await mobile.waitForTimeout(500);
await mobile.locator(".bouncy-tabs__collection").screenshot({
  path: `${outDir}/bouncy-channels-en-mobile-whatsapp.png`,
});

await page.close();
await mobile.close();
await browser.close();
