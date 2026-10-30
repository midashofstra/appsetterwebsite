import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
  await page.locator("#kanalen").scrollIntoViewIfNeeded();
  await page.waitForSelector(".bouncy-tabs--ready", { timeout: 15000 });

  const metrics = await page.evaluate(() => {
    const wrap = document.querySelector("#kanalen .wrap");
    const card = document.querySelector("#kanalen .bouncy-tabs__collection");
    const section = document.querySelector("#kanalen");
    if (!wrap || !card || !section) return null;
    const cr = card.getBoundingClientRect();
    const ws = getComputedStyle(wrap);
    const contentWidth =
      wrap.clientWidth - parseFloat(ws.paddingLeft) - parseFloat(ws.paddingRight);
    return {
      contentWidth,
      cardWidth: cr.width,
      widthDelta: Math.abs(contentWidth - cr.width),
      sectionOverflow: section.scrollWidth > section.clientWidth + 2,
      wrapOverflow: wrap.scrollWidth > wrap.clientWidth + 2,
    };
  });

  console.log(vp.name, metrics);
  if (
    !metrics ||
    metrics.widthDelta > 2 ||
    metrics.sectionOverflow ||
    metrics.wrapOverflow
  ) {
    process.exitCode = 1;
  }

  if (vp.name === "desktop") {
    await page.getByRole("tab", { name: "2 · Calendar" }).click();
    await page.waitForTimeout(500);
  }

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-fullwidth-${vp.name}.png`,
  });
  await page.close();
}

await browser.close();
