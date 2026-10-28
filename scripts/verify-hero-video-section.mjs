import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.HERO_VIDEO_VERIFY_URL || "http://127.0.0.1:3001/";

const browser = await chromium.launch();

for (const width of [375, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll(".hx .wi").length > 0, null, { timeout: 15000 }).catch(() => {});

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const hdr = document.querySelector("header");
    const hx = document.querySelector(".hx");
    if (!hero || !hdr || !hx) return null;
    const hr = hero.getBoundingClientRect();
    const hxr = hx.getBoundingClientRect();
    const hdrRect = hdr.getBoundingClientRect();
    const cs = getComputedStyle(hero);
    return {
      heroPaddingTop: cs.paddingTop,
      gapNavToHeadline: Math.round(hxr.top - hdrRect.bottom),
      legacyStage: !!document.querySelector(".stage"),
      heroVideo: !!document.querySelector(".hero-video"),
      heroDemoId: document.getElementById("hero-demo")?.id ?? null,
    };
  });
  console.log({ width, metrics });

  await page.locator(".hero > .wrap").screenshot({ path: `${outDir}/hero-top-${width}.png`, timeout: 8000 });
  await page.locator(".hero-video").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator(".hero-video").screenshot({ path: `${outDir}/hero-video-section-${width}.png`, timeout: 8000 });
  await page.close();
}

await browser.close();
