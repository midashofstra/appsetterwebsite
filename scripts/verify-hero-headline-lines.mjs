import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const widths = [375, 768, 1024, 1280, 1440];

const browser = await chromium.launch();

for (const locale of ["en", "nl"]) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const path = locale === "en" ? "/en" : "/nl";
    await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
    await page
      .waitForFunction(
        () => document.documentElement.getAttribute("data-hero-intro") === "complete",
        null,
        { timeout: 20000 }
      )
      .catch(() => {});

    const metrics = await page.evaluate(() => {
      const hx = document.querySelector(".hx");
      const fs = parseFloat(getComputedStyle(hx).fontSize);
      const lines = [...hx.querySelectorAll(":scope > .hx-line")].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          top: r.top,
          nowrap: getComputedStyle(el).whiteSpace,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        };
      });
      const tops = lines.map((l) => l.top);
      const rowCount = tops.reduce((groups, t) => {
        if (!groups.some((g) => Math.abs(g - t) <= fs * 0.2)) groups.push(t);
        return groups;
      }, []).length;
      const perLineNowrap = lines.every((l) => l.nowrap === "nowrap");
      const noOverflow = lines.every((l) => l.scrollWidth <= l.clientWidth + 2);
      return { lineCount: lines.length, rowCount, perLineNowrap, noOverflow, fs };
    });

    const expectedRows = width <= 767 ? 3 : 2;
    const ok = metrics.rowCount === expectedRows && metrics.perLineNowrap && metrics.noOverflow;
    console.log(`${locale} ${width}px`, metrics, ok ? "OK" : "FAIL");
    if (!ok) process.exitCode = 1;

    await page.locator(".hero .hx").screenshot({
      path: `${outDir}/hero-lines-${locale}-${width}.png`,
    });
    await page.close();
  }
}

await browser.close();
