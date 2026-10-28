import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.FONT_VERIFY_URL || "http://127.0.0.1:3001/";
const expectName = "Plus Jakarta Sans";

function familyIncludes(name, computed) {
  return computed.toLowerCase().includes(name.toLowerCase());
}

const browser = await chromium.launch();

for (const width of [375, 768, 1280, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-hero-intro") === "complete",
    null,
    { timeout: 15000 }
  );
  const fonts = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    hx: getComputedStyle(document.querySelector(".hx")).fontFamily,
    brand: getComputedStyle(document.querySelector(".brand")).fontFamily,
    hxWeight: getComputedStyle(document.querySelector(".hx")).fontWeight,
  }));
  const overflow = await page.evaluate(() => {
    const hx = document.querySelector(".hx");
    const hero = document.querySelector(".hero");
    if (!hx || !hero) return true;
    const hr = hero.getBoundingClientRect();
    const xr = hx.getBoundingClientRect();
    return xr.width > hr.width + 2 || xr.right > window.innerWidth + 1;
  });
  console.log({ width, fonts, overflow });
  if (
    !familyIncludes(expectName, fonts.body) ||
    !familyIncludes(expectName, fonts.hx) ||
    !familyIncludes(expectName, fonts.brand) ||
    overflow
  ) {
    process.exitCode = 1;
  }
  if (width === 1440 || width === 375) {
    await page.waitForTimeout(200);
    await page.locator(".hero").screenshot({ path: `${outDir}/hero-plus-jakarta-${width}.png` });
  }
  await page.close();
}

await browser.close();
