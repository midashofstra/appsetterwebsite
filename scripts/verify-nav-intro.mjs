import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.NAV_INTRO_URL || "http://127.0.0.1:3001/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseUrl, { waitUntil: "commit" });
const midMs = Number(process.env.NAV_INTRO_MID_MS || 180);
await page.waitForTimeout(midMs);
const mid = await page.evaluate(() => {
  const brand = document.querySelector("#hdr .brand");
  if (!brand) return null;
  const s = getComputedStyle(brand);
  return {
    opacity: s.opacity,
    filter: s.filter,
    transform: s.transform,
  };
});
await page.screenshot({ path: `${outDir}/nav-intro-mid.png`, fullPage: false });
await page.waitForFunction(
  () => document.documentElement.getAttribute("data-hero-intro") === "complete",
  null,
  { timeout: 20000 }
);
await page.waitForTimeout(200);
const done = await page.evaluate(() => {
  const brand = document.querySelector("#hdr .brand");
  const cta = document.querySelector("#hdr nav .btn-main");
  const blur = document.querySelector("#hdr .hdr-progressive-blur");
  if (!brand || !cta || !blur) return null;
  const b = getComputedStyle(brand);
  const c = getComputedStyle(cta);
  const bl = getComputedStyle(blur);
  return {
    brand: { opacity: b.opacity, filter: b.filter, transform: b.transform },
    cta: { opacity: c.opacity, filter: c.filter, transform: c.transform },
    blurOpacity: bl.opacity,
  };
});
await page.screenshot({ path: `${outDir}/nav-intro-done.png`, fullPage: false });
console.log({ mid, done });
const midAnimating =
  mid && (parseFloat(mid.opacity) < 0.95 || mid.filter.includes("blur(") || mid.transform !== "none");
const noBlur = (f) => !f || f === "none" || /^blur\(0(px)?\)$/.test(f);
const noTransform = (t) => !t || t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)";
const doneClean =
  done &&
  done.brand.opacity === "1" &&
  done.cta.opacity === "1" &&
  noBlur(done.brand.filter) &&
  noBlur(done.cta.filter) &&
  noTransform(done.brand.transform) &&
  noTransform(done.cta.transform) &&
  parseFloat(done.blurOpacity) >= 0.99;
if (!midAnimating || !doneClean) process.exitCode = 1;
await browser.close();
