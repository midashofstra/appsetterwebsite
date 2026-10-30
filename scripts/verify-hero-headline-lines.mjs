import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const widths = [390, 768, 1024, 1280, 1440];
const minDesktopFsPx = 56;

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
      const lineEls = [...hx.querySelectorAll(":scope > .hx-line")];
      const textSpans = [...hx.querySelectorAll(".hx-line-text")];
      const tops = textSpans.map((el) => el.getBoundingClientRect().top);
      const rowCount = tops.reduce((groups, t) => {
        if (!groups.some((g) => Math.abs(g - t) <= fs * 0.35)) groups.push(t);
        return groups;
      }, []).length;
      const perLineNowrap = textSpans.every((el) => getComputedStyle(el).whiteSpace === "nowrap");
      const noOverflow = textSpans.every((el) => el.scrollWidth <= el.clientWidth + 2);
      return { lineCount: lineEls.length, rowCount, perLineNowrap, noOverflow, fs };
    });

    const expectedRows = width <= 767 ? 3 : 2;
    const fsPx = metrics.fs;
    const fsOk = width <= 767 ? fsPx >= 36 && fsPx <= 48 : fsPx >= minDesktopFsPx;
    const ok =
      metrics.rowCount === expectedRows && metrics.perLineNowrap && metrics.noOverflow && fsOk;
    console.log(`${locale} ${width}px`, metrics, fsOk ? "" : `(fs ${fsPx}px)`, ok ? "OK" : "FAIL");
    if (!ok) process.exitCode = 1;

    await page.locator(".hero .hx").screenshot({
      path: `${outDir}/hero-lines-${locale}-${width}.png`,
    });
    await page.close();
  }
}

await browser.close();
