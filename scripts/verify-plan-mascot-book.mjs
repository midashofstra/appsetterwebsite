import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

function rgbToHex(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb;
  const hex = (n) => Number(n).toString(16).padStart(2, "0");
  return `#${hex(m[1])}${hex(m[2])}${hex(m[3])}`.toUpperCase();
}

const viewports = [
  ["/en/", "desktop-1440", 1440, 900],
  ["/en/", "desktop-1280", 1280, 900],
  ["/en/", "mobile-390", 390, 844],
];

const browser = await chromium.launch();

for (const [path, tag, width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#plan .step:nth-child(4)").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const metrics = await page.evaluate(() => {
    const img = document.querySelector(".plan-book-mascot__img");
    const host = document.getElementById("plan-mascot-host");
    const fig = document.querySelector(".plan-book-mascot");
    const step3 = document.querySelector("#plan .step:nth-child(4)");
    const mini = step3?.querySelector(".mini");
    if (!img || !host || !fig) return { ok: false, reason: "missing mascot nodes" };
    const ir = img.getBoundingClientRect();
    const hr = host.getBoundingClientRect();
    const mr = mini?.getBoundingClientRect();
    const figStyle = getComputedStyle(fig);
    const overlapsMini =
      mr &&
      !(ir.bottom < mr.top - 4 || ir.top > mr.bottom + 4 || ir.right < mr.left - 4 || ir.left > mr.right + 4);
    return {
      ok: true,
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
      opacity: figStyle.opacity,
      imgWidth: ir.width,
      imgHeight: ir.height,
      hostWidth: hr.width,
      visible: ir.width > 40 && ir.height > 40 && parseFloat(figStyle.opacity) > 0.85,
      overlapsMini: !!overlapsMini,
      hostRight: hr.right,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    };
  });

  console.log(tag, metrics);
  if (!metrics.ok) {
    console.error(`${tag}:`, metrics.reason);
    process.exitCode = 1;
  } else {
    if (!metrics.src.includes("mascot-book")) process.exitCode = 1;
    if (metrics.alt !== "Appointment Setter mascot reading") process.exitCode = 1;
    if (!metrics.visible) {
      console.error(`${tag}: mascot not visible`, metrics);
      process.exitCode = 1;
    }
    if (metrics.pageOverflow) process.exitCode = 1;
    if (metrics.overlapsMini) {
      console.error(`${tag}: mascot overlaps step 3 mini card`);
      process.exitCode = 1;
    }
    if (width >= 960) {
      if (metrics.hostWidth < 210 || metrics.hostWidth > 290) {
        console.error(`${tag}: desktop host width out of range`, metrics.hostWidth);
        process.exitCode = 1;
      }
      if (metrics.hostRight < width * 0.55) {
        console.error(`${tag}: mascot should align to right column on desktop`);
        process.exitCode = 1;
      }
    }
  }

  await page.locator("#plan .step:nth-child(4)").screenshot({
    path: `${outDir}/plan-mascot-book-${tag}.png`,
    timeout: 12000,
  });
  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-plan-mascot-book: ok");
