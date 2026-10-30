import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.VERIFY_URL || "http://127.0.0.1:3001/";

function parseRotateDeg(transform) {
  if (!transform || transform === "none") return 0;
  const m = transform.match(/matrix\(([^)]+)\)/);
  if (m) {
    const p = m[1].split(",").map((x) => parseFloat(x.trim()));
    if (p.length >= 4) return (Math.atan2(p[1], p[0]) * 180) / Math.PI;
  }
  const r = transform.match(/rotate\(([-0-9.]+)deg\)/);
  return r ? parseFloat(r[1]) : 0;
}

async function hoverProbe(page, selector, label) {
  const loc = page.locator(selector).first();
  await loc.waitFor({ state: "visible", timeout: 15000 });
  await loc.scrollIntoViewIfNeeded();
  const before = await loc.evaluate((el) => getComputedStyle(el).transform);
  const box = await loc.boundingBox();
  if (!box) throw new Error(`no box: ${label}`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(450);
  const after = await loc.evaluate((el) => getComputedStyle(el).transform);
  const spin = Math.abs(parseRotateDeg(after) - parseRotateDeg(before));
  return { label, before, after, spinDeg: spin };
}

const browser = await chromium.launch();

for (const [path, locale] of [
  ["/en", "en"],
  ["/nl", "nl"],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(`${baseUrl.replace(/\/$/, "")}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.getAttribute("data-hero-intro") === "complete",
    null,
    { timeout: 15000 }
  );

  const planH2 = await page.locator("#plan h2").first().evaluate((el) => ({
    text: el.textContent?.slice(0, 40),
    wiCount: el.querySelectorAll(".wi").length,
  }));
  console.log(`${locale} #plan h2:`, planH2);

  const probes = [
    await hoverProbe(page, "#plan h2", `${locale} plan h2`),
    await hoverProbe(page, ".hx .wi", `${locale} hero word`),
    await hoverProbe(page, ".manifest h2 .wi", `${locale} manifest word`),
  ];
  console.log(JSON.stringify(probes, null, 2));

  for (const p of probes) {
    if (p.spinDeg > 2) {
      console.error(`FAIL ${p.label}: rotate delta ${p.spinDeg}deg`);
      process.exitCode = 1;
    }
  }

  await page.locator("#plan h2").first().screenshot({
    path: `${outDir}/heading-hover-plan-${locale}.png`,
  });
  await page.close();
}

await browser.close();
