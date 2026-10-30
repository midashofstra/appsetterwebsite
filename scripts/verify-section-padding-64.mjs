import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();

async function sampleSectionPadding(page) {
  return page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        selector: sel,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
      };
    };
    return {
      compare: pick("#kanalen"),
      pricing: pick("#pricing"),
      faq: pick("#faq"),
      generic: pick("main section:not(.hero):not(#top)"),
    };
  });
}

for (const [path, tag, width] of [
  ["/en", "desktop", 1440],
  ["/en", "mobile", 390],
]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-hero-intro") === "complete",
    null,
    { timeout: 15000 }
  ).catch(() => {});
  const pads = await sampleSectionPadding(page);
  console.log(tag, JSON.stringify(pads, null, 2));

  const channels = pads.compare;
  if (!channels || channels.paddingTop !== "64px" || channels.paddingBottom !== "64px") {
    console.error("Expected #kanalen section padding 64px top/bottom", channels);
    process.exitCode = 1;
  }
  if (width === 390 && channels) {
    const topPx = parseFloat(channels.paddingTop);
    if (topPx > 64.5) {
      console.error("Mobile section padding should not exceed desktop 64px", channels.paddingTop);
      process.exitCode = 1;
    }
  }

  await page.locator("#kanalen").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${outDir}/section-padding-${tag}-channels.png`, fullPage: false });
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${outDir}/section-padding-${tag}-pricing.png`, fullPage: false });
  await page.close();
}

await browser.close();
