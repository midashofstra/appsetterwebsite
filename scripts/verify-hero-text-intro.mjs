import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.HERO_INTRO_URL || "http://127.0.0.1:3001/";

const browser = await chromium.launch();

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(380);
  await page.locator(".hero").screenshot({ path: `${outDir}/hero-text-intro-mid-1440.png` });
  const mid = await page.locator(".hero .wi").first().evaluate((el) => ({
    filter: getComputedStyle(el).filter,
    opacity: getComputedStyle(el).opacity,
  }));
  console.log("mid-intro:", mid);
  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-hero-intro") === "complete",
    null,
    { timeout: 12000 }
  );
  await page.waitForTimeout(250);
  await page.locator(".hero").screenshot({ path: `${outDir}/hero-text-intro-done-1440.png` });
  const done = await page.locator(".hero .sub").evaluate((el) => ({
    filter: getComputedStyle(el).filter,
    userSelect: getComputedStyle(el).userSelect,
  }));
  console.log("after intro .hero .sub:", done);
  if (done.userSelect !== "none") process.exitCode = 1;
  const hasLeftoverBlur = (f) => f.includes("blur(") && !f.match(/blur\(0(px)?\)/);
  if (hasLeftoverBlur(done.filter)) process.exitCode = 1;
  await page.close();
}

await browser.close();
