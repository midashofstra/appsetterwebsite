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
await page.locator("#plan .step--business").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const heading = await page.locator("#plan .step--business h3").textContent();
if (!heading?.includes("Tell us about your business")) {
  console.error("Unexpected step 2 heading:", heading);
  process.exitCode = 1;
}

const step2TagStyles = await page.evaluate(() => {
  const tags = [...document.querySelectorAll("#plan .step--business .mini .r .tag")];
  return tags.map((el) => {
    const s = getComputedStyle(el);
    return {
      text: el.textContent?.trim(),
      bg: s.backgroundColor,
      color: s.color,
    };
  });
});

if (step2TagStyles.length !== 3) {
  console.error("Expected 3 step 2 tags, got", step2TagStyles.length);
  process.exitCode = 1;
}

for (const t of step2TagStyles) {
  const bg = rgbToHex(t.bg);
  const fg = rgbToHex(t.color);
  if (bg !== "#FF0050" || fg !== "#FFFFFF") {
    console.error("Step 2 tag color mismatch:", t.text, { bg, fg, raw: t });
    process.exitCode = 1;
  }
}

const connectedBg = await page.evaluate(() => {
  const el = document.querySelector("#plan .step:not(.step--business) .tag.g");
  if (!el) return null;
  return getComputedStyle(el).backgroundColor;
});
if (!connectedBg) {
  console.error("Missing step 1 Connected tag");
  process.exitCode = 1;
}
const connectedHex = rgbToHex(connectedBg);
if (connectedHex === "#FF0050") {
  console.error("Step 1 Connected tag should not use #FF0050, got", connectedHex);
  process.exitCode = 1;
}

await page.locator("#plan .step--business").screenshot({
  path: `${outDir}/plan-step2-tell-us-business-en.png`,
});

await page.close();
await browser.close();

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log("verify-plan-step2-business: ok");
