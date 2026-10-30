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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#plan .step--connect .mini[data-integrations]", {
  timeout: 8000,
});
await page.locator("#plan .step--connect").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const heading = await page.locator("#plan .step--connect h3").textContent();
if (!heading?.includes("Connect your channels")) {
  console.error("Unexpected step 1 heading:", heading);
  process.exitCode = 1;
}

const tags = await page.evaluate(() => {
  return [...document.querySelectorAll("#plan .step--connect .mini .r .tag.g")].map((el) => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, color: s.color, text: el.textContent?.trim() };
  });
});

if (tags.length !== 6) {
  console.error("Expected 6 Connected tags, got", tags.length);
  process.exitCode = 1;
}

for (const t of tags) {
  const bg = rgbToHex(t.bg);
  const fg = rgbToHex(t.color);
  if (bg === "#FF0050" || bg === "#FFB8CE") {
    console.error("Connected tag still pink:", t.text, bg);
    process.exitCode = 1;
  }
  if (bg !== "#ECEEE8") {
    console.error("Connected tag background should be #ECEEE8, got", bg, t.text);
    process.exitCode = 1;
  }
  if (fg !== "#43453F") {
    console.error("Connected tag text should be #43453F (var(--text)), got", fg, t.text);
    process.exitCode = 1;
  }
}

const step2Sample = await page.evaluate(() => {
  const el = document.querySelector("#plan .step--business .mini .r .tag");
  if (!el) return null;
  const s = getComputedStyle(el);
  return { bg: s.backgroundColor, color: s.color };
});
if (step2Sample && rgbToHex(step2Sample.bg) !== "#FF0050") {
  console.error("Step 2 tag should remain #FF0050, got", rgbToHex(step2Sample.bg));
  process.exitCode = 1;
}

await page.locator("#plan .step--connect").screenshot({
  path: `${outDir}/plan-step1-connect-channels-en.png`,
});

await page.close();
await browser.close();

if (process.exitCode) process.exit(process.exitCode);
console.log("verify-plan-step1-connected: ok");
