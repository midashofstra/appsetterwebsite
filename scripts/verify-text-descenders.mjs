import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.DESCENDER_VERIFY_URL || "http://127.0.0.1:3001/";
const DESCENDER = /[gjpqy]/i;

function clipCheck(el) {
  const style = getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none") return false;
  if (el.scrollHeight > el.clientHeight + 1) return true;
  let parent = el.parentElement;
  while (parent) {
    const ps = getComputedStyle(parent);
    if (ps.overflow === "hidden" || ps.overflowY === "hidden") {
      const pr = parent.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      if (er.bottom > pr.bottom + 0.5) return true;
      break;
    }
    parent = parent.parentElement;
  }
  return false;
}

const browser = await chromium.launch();

for (const width of [375, 768, 1280, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const clipped = await page.evaluate(
    ({ fnSrc, descenderRe }) => {
      const clipCheck = new Function(`return (${fnSrc})`)();
      const re = new RegExp(descenderRe, "i");
      const bad = [];
      document.querySelectorAll(".btn-roll-viewport").forEach((vp) => {
        const line = vp.querySelector(".btn-roll-line");
        if (line && clipCheck(line)) {
          bad.push({ where: "btn-roll", text: line.textContent?.slice(0, 40) });
        }
      });
      document.querySelectorAll(".btn:not(.btn-roll)").forEach((btn) => {
        if (clipCheck(btn)) bad.push({ where: "btn", text: btn.textContent?.slice(0, 40) });
      });
      document.querySelectorAll(".hx .wi, section h2 .wi, .manifest .wi").forEach((wi) => {
        if (!re.test(wi.textContent || "")) return;
        if (clipCheck(wi)) bad.push({ where: "headline-wi", text: wi.textContent?.slice(0, 40) });
      });
      document.querySelectorAll(".brand, .navlinks a, header .btn").forEach((el) => {
        if (clipCheck(el)) bad.push({ where: "nav", text: el.textContent?.slice(0, 40) });
      });
      return bad;
    },
    { fnSrc: clipCheck.toString(), descenderRe: DESCENDER.source }
  );

  console.log({ width, clippedCount: clipped.length, clipped });
  if (clipped.length) process.exitCode = 1;

  if (width === 375 || width === 1440) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.locator(".hero .wrap").screenshot({ path: `${outDir}/cta-descenders-hero-${width}.png`, timeout: 8000 });
    await page.evaluate(() => document.querySelector("#start")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(300);
    await page.locator(".cta .ctas").screenshot({ path: `${outDir}/cta-descenders-band-${width}.png`, timeout: 8000 });
  }
  await page.close();
}

await browser.close();
