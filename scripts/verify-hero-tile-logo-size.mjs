import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.HERO_LOGO_URL || "http://127.0.0.1:3001/";

function measure(page) {
  return page.evaluate(() => {
    const body = document.querySelector(".as-tile .as-body")?.getBoundingClientRect();
    const target = body?.width ?? 0;
    const logos = [];
    document.querySelectorAll(".hx .tile:not(.as-tile)").forEach((tile) => {
      const el = tile.querySelector("img, svg");
      if (!el) return;
      const r = el.getBoundingClientRect();
      logos.push({ w: r.width, target, delta: r.width - target });
    });
    const maxDelta = Math.max(...logos.map((l) => Math.abs(l.delta)));
    return { mascotBody: target, logos, maxDelta };
  });
}

const browser = await chromium.launch();

for (const width of [1440, 375]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-hero-intro") === "complete",
    null,
    { timeout: 15000 }
  );
  await page.waitForTimeout(400);
  await page.locator(".hero").screenshot({ path: `${outDir}/hero-tile-logos-${width}.png` });
  const m = await page.evaluate(() => {
    const body = document.querySelector(".as-tile .as-body")?.getBoundingClientRect().width ?? 0;
    const linkedin = document.querySelector('[data-card-id="linkedin"] img');
    const imgW = linkedin ? linkedin.getBoundingClientRect().width : 0;
    return { mascotBody: body, linkedinImg: imgW, delta: imgW - body };
  });
  console.log({ width, ...m });
  if (Math.abs(m.delta) > 4) process.exitCode = 1;
  await page.close();
}

await browser.close();
