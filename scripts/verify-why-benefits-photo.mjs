import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();

for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
  await page.locator("#waarom").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const img = page.locator("#waarom .why-showcase__img");
  await img.waitFor({ state: "visible", timeout: 10000 });
  const alt = await img.getAttribute("alt");
  if (alt !== "Appointment Setter working while you relax") {
    console.error("Unexpected alt:", alt);
    process.exitCode = 1;
  }

  const overflow = await page.evaluate(() => {
    const s = document.querySelector("#waarom");
    return s ? s.scrollWidth > s.clientWidth + 2 : true;
  });
  if (overflow) process.exitCode = 1;

  await page.locator("#waarom .why-showcase").screenshot({
    path: `${outDir}/why-benefits-photo-${name}.png`,
  });
  await page.close();
}

await browser.close();
