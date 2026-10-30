import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const browser = await chromium.launch();

for (const [path, tag, width, height] of [
  ["/en", "desktop-en", 1440, 900],
  ["/en", "mobile-en", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#plan").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const metrics = await page.evaluate(() => {
    const img = document.querySelector(".plan-book-mascot__img");
    const host = document.getElementById("plan-mascot-host");
    const step3 = document.querySelector("#plan .step:nth-child(4)");
    const mini = step3?.querySelector(".mini");
    if (!img || !host) return { ok: false };
    const ir = img.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const mr = mini?.getBoundingClientRect();
    const overlapsMini =
      mr &&
      !(ir.bottom < mr.top - 4 || ir.top > mr.bottom + 4 || ir.right < mr.left - 4 || ir.left > mr.right + 4);
    return {
      ok: true,
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
      w: img.getAttribute("width"),
      h: img.getAttribute("height"),
      overlapsMini: !!overlapsMini,
      hostRight: hr.right,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });

  console.log(tag, metrics);
  if (!metrics.ok || !metrics.src.includes("mascot-book")) process.exitCode = 1;
  if (metrics.alt !== "Appointment Setter mascot reading") process.exitCode = 1;
  if (metrics.pageOverflow) process.exitCode = 1;
  if (metrics.overlapsMini) {
    console.error(`${tag}: mascot overlaps step 3 mini card`);
    process.exitCode = 1;
  }
  if (width >= 960 && metrics.hostRight < width * 0.55) {
    console.error(`${tag}: mascot should align to right column on desktop`);
    process.exitCode = 1;
  }

  await page.locator("#plan").screenshot({
    path: `${outDir}/plan-mascot-book-${tag}.png`,
    timeout: 12000,
  });
  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-plan-mascot-book: ok");
