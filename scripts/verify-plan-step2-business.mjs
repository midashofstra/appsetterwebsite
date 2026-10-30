import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await page.locator("#plan .step:nth-child(3)").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const heading = await page.locator("#plan .step:nth-child(3) h3").textContent();
if (!heading?.includes("Tell us about your business")) {
  console.error("Unexpected step 2 heading:", heading);
  process.exitCode = 1;
}

await page.locator("#plan .step:nth-child(3)").screenshot({
  path: `${outDir}/plan-step2-tell-us-business-en.png`,
});

await page.close();
await browser.close();
