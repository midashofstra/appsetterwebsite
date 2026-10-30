import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.VERIFY_URL || "http://127.0.0.1:3001/en";

const browser = await chromium.launch();

for (const [path, tag, width] of [
  ["/en", "en-desktop", 1440],
  ["/en", "en-mobile", 390],
  ["/nl", "nl-mobile", 390],
]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
  await page.goto(`${baseUrl.replace(/\/en\/?$/, "")}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const grid = await page.locator(".pricing-grid").evaluate((el) => {
    const cards = [...el.querySelectorAll(".pricing-card")];
    const topFirst = cards.reduce((best, card) =>
      !best || card.getBoundingClientRect().top < best.getBoundingClientRect().top ? card : best
    );
    return {
      count: cards.length,
      overflow: el.scrollWidth > el.clientWidth + 2,
      topIsPopular: topFirst?.classList.contains("pricing-card--popular") ?? false,
    };
  });
  console.log(tag, grid);
  if (grid.count !== 3 || grid.overflow) process.exitCode = 1;
  if (width === 390 && !grid.topIsPopular) process.exitCode = 1;
  await page.locator("#pricing").screenshot({ path: `${outDir}/pricing-${tag}.png` });
  await page.close();
}

await browser.close();
