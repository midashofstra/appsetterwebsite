import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.HERO_PROMINENCE_URL || "http://127.0.0.1:3001/";
const widths = [375, 768, 1280, 1440];

const browser = await chromium.launch();

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-hero-intro") === "complete",
    null,
    { timeout: 15000 }
  );
  await page.waitForTimeout(200);
  const pillVisible = await page.locator(".hero .pill").count();
  const hx = await page.locator(".hx").evaluate((el) => {
    const s = getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight };
  });
  const overlap = await page.evaluate(() => {
    const hxEl = document.querySelector(".hx");
    const sub = document.querySelector(".hero .sub");
    if (!hxEl || !sub) return false;
    const a = hxEl.getBoundingClientRect();
    const b = sub.getBoundingClientRect();
    return a.bottom > b.top + 2;
  });
  console.log({ width, pillVisible, hx, overlap });
  await page.locator(".hero").screenshot({ path: `${outDir}/hero-prominence-${width}.png` });
  if (pillVisible > 0 || overlap) process.exitCode = 1;
  await page.close();
}

await browser.close();
