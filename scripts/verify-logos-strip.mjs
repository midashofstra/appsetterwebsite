import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

const browser = await chromium.launch();

for (const [path, tag, width, height] of [
  ["/en", "desktop", 1440, 900],
  ["/en", "mobile", 375, 812],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(
      () => document.documentElement.getAttribute("data-hero-intro") === "complete",
      null,
      { timeout: 20000 }
    )
    .catch(() => {});

  const logosY = await page.evaluate(() => document.querySelector(".logos")?.offsetTop ?? 0);

  for (const scrollY of [0, Math.max(0, logosY - 220), logosY, logosY + 40]) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(900);
    const metrics = await page.evaluate(() => {
      const band = document.querySelector(".logos");
      const wrap = document.querySelector(".logos .wrap");
      const arc = document.querySelector(".problem-arc-scroll-transition");
      const spans = [...document.querySelectorAll(".logo-row span")];
      const p = document.querySelector(".logos p");
      const sample = spans[0];
      if (!band || !wrap || !arc || !sample || !p) return { ok: false, reason: "missing nodes" };

      const cx = sample.getBoundingClientRect();
      const hit = document.elementFromPoint(cx.left + cx.width / 2, cx.top + cx.height / 2);
      const arcCovers = !!hit?.closest(".problem-arc-scroll-transition");
      const wrapZ = parseInt(getComputedStyle(wrap).zIndex, 10);
      const arcZ = parseInt(getComputedStyle(arc).zIndex, 10);

      const spanOps = spans.map((s) => parseFloat(getComputedStyle(s).opacity));
      const pOp = parseFloat(getComputedStyle(p).opacity);
      const minOp = Math.min(pOp, ...spanOps);

      return {
        ok: true,
        scrollY: window.scrollY,
        minOp,
        arcCovers,
        wrapZ,
        arcZ,
        spanCount: spans.length,
        title: p.textContent?.trim().slice(0, 48),
      };
    });

    if (!metrics.ok) {
      fail(`${tag} scroll ${scrollY}: ${metrics.reason}`);
      continue;
    }
    if (metrics.spanCount < 6) fail(`${tag}: expected 6 logo pills, got ${metrics.spanCount}`);
    if (metrics.wrapZ <= metrics.arcZ) fail(`${tag}: logos wrap must sit above arc overlay`);
    if (metrics.arcCovers) fail(`${tag} scroll ${scrollY}: arc overlay covers logo pills`);
    if (metrics.minOp < 0.65) fail(`${tag} scroll ${scrollY}: logos too faint (min opacity ${metrics.minOp})`);

    console.log(tag, metrics);
  }

  await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, logosY - 180));
  await page.waitForTimeout(900);
  await page.locator(".logos").screenshot({
    path: `${outDir}/logos-strip-${tag}-9232.png`,
    timeout: 10000,
  });

  await page.close();
}

await browser.close();

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log("verify-logos-strip: ok");
