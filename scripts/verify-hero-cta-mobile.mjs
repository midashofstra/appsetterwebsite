import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });
const baseUrl = process.env.VERIFY_URL || "http://127.0.0.1:3001/";
const WIDTHS = [320, 360, 375, 390, 414];

const browser = await chromium.launch();
let failed = false;

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelectorAll(".hero .ctas .btn").length >= 2, null, {
    timeout: 15000,
  });

  const layout = await page.evaluate(() => {
    const ctas = document.querySelector(".hero .ctas");
    const btns = [...document.querySelectorAll(".hero .ctas .btn")];
    if (!ctas || btns.length < 2) return null;
    const cs = getComputedStyle(ctas);
    const r0 = btns[0].getBoundingClientRect();
    const r1 = btns[1].getBoundingClientRect();
    const sameRow = Math.abs(r0.top - r1.top) < 4;
    const overflow = btns.some((b) => b.scrollWidth > b.clientWidth + 1);
    const heights = btns.map((b) => Math.round(b.getBoundingClientRect().height));
    return {
      flexWrap: cs.flexWrap,
      sameRow,
      overflow,
      heights,
      ctasWidth: Math.round(ctas.getBoundingClientRect().width),
    };
  });

  console.log({ width, layout });
  if (!layout?.sameRow || layout.overflow || layout.heights.some((h) => h < 40)) failed = true;

  if (width === 375) {
    await page.locator(".hero .ctas").screenshot({ path: `${outDir}/hero-ctas-mobile-375.png` });
  }
  await page.close();
}

await browser.close();
if (failed) process.exitCode = 1;
