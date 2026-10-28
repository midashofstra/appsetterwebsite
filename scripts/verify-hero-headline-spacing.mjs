import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.HERO_SPACE_URL || "http://127.0.0.1:3001/";
const MIN = 0.18;
const MAX = 0.34;

const browser = await chromium.launch();

for (const width of [1440, 1280, 768, 375]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.documentElement.dataset.heroIntro === "complete",
    null,
    { timeout: 25000 }
  );
  await page.waitForTimeout(300);

  const report = await page.evaluate(({ min, max }) => {
    const hx = document.querySelector(".hx");
    const fs = parseFloat(getComputedStyle(hx).fontSize);
    const sameLine = (a, b) => Math.abs(a.top - b.top) < fs * 0.15;
    const gaps = [];
    const kids = [...hx.children];

    for (let i = 0; i < kids.length - 1; i++) {
      const ar = kids[i].getBoundingClientRect();
      const br = kids[i + 1].getBoundingClientRect();
      if (!sameLine(ar, br)) continue;
      const em = (br.left - ar.right) / fs;
      gaps.push({ kind: "flex", i, em: Math.round(em * 1000) / 1000 });
    }

    hx.querySelectorAll(".wm + .wm").forEach((wm) => {
      const prev = wm.previousElementSibling?.querySelector(".wi") || wm.previousElementSibling;
      const wi = wm.querySelector(".wi");
      if (!prev || !wi) return;
      const a = (prev.classList?.contains("wi") ? prev : prev.querySelector?.(".wi"))?.getBoundingClientRect();
      const b = wi.getBoundingClientRect();
      if (!a) return;
      if (!sameLine(a, b)) return;
      gaps.push({ kind: "wm", em: Math.round(((b.left - a.right) / fs) * 1000) / 1000 });
    });

    const bad = gaps.filter((g) => g.em < min || g.em > max);
    return { fs, gaps, bad };
  }, { min: MIN, max: MAX });

  console.log({ width, report });
  if (report.bad.length) process.exitCode = 1;

  if (width === 1440 || width === 375) {
    await page.locator(".hero .hx").screenshot({ path: `${outDir}/hero-spacing-${width}.png` });
  }
  await page.close();
}

await browser.close();
