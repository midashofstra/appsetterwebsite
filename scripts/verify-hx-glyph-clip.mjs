import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.HX_CLIP_URL || "http://127.0.0.1:3001/";
const WIDTHS = [320, 360, 375, 390, 414, 768];
const MID_MS = Number(process.env.HX_CLIP_MID_MS || 380);
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

for (const width of WIDTHS) {
  for (const phase of ["post", "mid"]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.emulateMedia({ reducedMotion: phase === "post" ? "reduce" : "no-preference" });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    if (phase === "post") {
      await page.waitForFunction(
        () =>
          document.documentElement.getAttribute("data-hero-intro") === "complete" ||
          getComputedStyle(document.documentElement).getPropertyValue("--motion-reduce") === "1",
        null,
        { timeout: 8000 }
      ).catch(() => {});
      await page.waitForTimeout(200);
    } else {
      await page.waitForTimeout(MID_MS);
    }

    const clipped = await page.evaluate(
      ({ fnSrc, descenderRe }) => {
        const clipCheck = new Function(`return (${fnSrc})`)();
        const re = new RegExp(descenderRe, "i");
        const bad = [];
        document.querySelectorAll(".hx .wi").forEach((wi) => {
          const text = wi.textContent?.trim() || "";
          if (!re.test(text)) return;
          if (clipCheck(wi)) bad.push({ text, tag: "wi" });
        });
        document.querySelectorAll(".hx .wm").forEach((wm) => {
          const text = wm.textContent?.trim() || "";
          if (!re.test(text)) return;
          if (clipCheck(wm)) bad.push({ text, tag: "wm" });
        });
        return bad;
      },
      { fnSrc: clipCheck.toString(), descenderRe: DESCENDER.source }
    );

    console.log({ width, phase, clippedCount: clipped.length, clipped });
    if (clipped.length) process.exitCode = 1;

    if (width === 375 && phase === "post") {
      const je = page.locator(".hx .wi", { hasText: "je" }).first();
      if (await je.count()) {
        await je.scrollIntoViewIfNeeded();
        await je.screenshot({ path: `${outDir}/hero-hx-je-375-post.png`, timeout: 8000 });
      }
    }
    await page.close();
  }
}

await browser.close();
