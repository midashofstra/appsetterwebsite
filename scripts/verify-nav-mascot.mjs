import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

async function assertNavLogoVisible(page, tag) {
  const metrics = await page.evaluate(() => {
    const mascot = document.querySelector("#hdr .nav-mascot-icon");
    const wordmark = document.querySelector("#hdr .brand-wordmark");
    const cta = document.querySelector("#hdr nav .btn-main");
    const brand = document.querySelector("#hdr .brand");
    const box = (el) =>
      el
        ? {
            w: el.getBoundingClientRect().width,
            h: el.getBoundingClientRect().height,
            x: el.getBoundingClientRect().x,
          }
        : null;
    return {
      mascot: {
        box: box(mascot),
        display: mascot ? getComputedStyle(mascot).display : null,
      },
      wordmark: {
        box: box(wordmark),
        display: wordmark ? getComputedStyle(wordmark).display : null,
      },
      brand: box(brand),
      cta: box(cta),
    };
  });
  console.log(tag, metrics);
  if (metrics.mascot.display === "none") fail(`${tag}: nav mascot must not be display:none`);
  if (!metrics.mascot.box || metrics.mascot.box.w < 30 || metrics.mascot.box.h < 30) {
    fail(`${tag}: nav mascot tile not visible`);
  }
  if (!metrics.brand?.w || metrics.brand.w < 30) fail(`${tag}: .brand has no visible width`);
  if (!metrics.cta?.w) fail(`${tag}: nav CTA missing`);
  if (metrics.mascot.box.x > metrics.cta.x) fail(`${tag}: mascot should be left of CTA`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#hdr .nav-mascot-icon", { timeout: 15000 });

await page.mouse.move(200, 80);
await page.waitForTimeout(400);
await page.locator("#hdr .brand").screenshot({
  path: `${outDir}/nav-mascot-desktop-look-left.png`,
});

await page.mouse.move(1200, 120);
await page.waitForTimeout(400);
await page.locator("#hdr .brand").screenshot({
  path: `${outDir}/nav-mascot-desktop-look-right.png`,
});

for (const [width, slug] of [
  [390, "390"],
  [360, "360"],
]) {
  const mobile = await browser.newPage({
    viewport: { width, height: 844 },
    hasTouch: true,
  });
  await mobile.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
  await mobile.waitForFunction(
    () => {
      const el = document.querySelector("#hdr .brand");
      if (!el) return false;
      return parseFloat(getComputedStyle(el).opacity) > 0.5;
    },
    { timeout: 20000 }
  );
  await mobile.waitForTimeout(1200);
  await assertNavLogoVisible(mobile, `mobile-en-${slug}`);
  const hdrBox = await mobile.locator("#hdr").boundingBox();
  if (hdrBox) {
    await mobile.screenshot({
      path: `${outDir}/nav-logo-mobile-${slug}w-en.png`,
      clip: { x: hdrBox.x, y: hdrBox.y, width: hdrBox.width, height: Math.min(hdrBox.height, 72) },
    });
  }
  await mobile.close();
}

await page.close();
await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-nav-mascot: ok");
