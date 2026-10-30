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

for (const [path, tag, ariaLabel, headingNeedle] of [
  ["/en/", "en", "Connected", "Connect your channels"],
  ["/nl/", "nl", "Gekoppeld", "Koppel je kanalen"],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#plan .step--connect .mini[data-integrations]", {
    timeout: 8000,
  });
  await page.locator("#plan .step--connect").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const heading = await page.locator("#plan .step--connect h3").textContent();
  if (!heading?.includes(headingNeedle)) {
    console.error(`${tag}: unexpected step 1 heading:`, heading);
    process.exitCode = 1;
  }

  const tags = await page.evaluate((expectedAria) => {
    return [...document.querySelectorAll("#plan .step--connect .mini .r .tag.g")].map((el) => {
      const s = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const svg = el.querySelector("svg[data-icon='check'], svg.fa-check");
      const visibleText = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent?.trim())
        .join("");
      return {
        bg: s.backgroundColor,
        aria: el.getAttribute("aria-label"),
        hasCheck: !!svg,
        w: rect.width,
        h: rect.height,
        visibleText,
      };
    });
  }, ariaLabel);

  if (tags.length !== 6) {
    console.error(`${tag}: expected 6 Connected tags, got`, tags.length);
    process.exitCode = 1;
  }

  for (const t of tags) {
    const bg = rgbToHex(t.bg);
    if (bg === "#FF0050" || bg === "#FFB8CE") {
      console.error(`${tag}: Connected tag still pink`, bg);
      process.exitCode = 1;
    }
    if (bg !== "#ECEEE8") {
      console.error(`${tag}: Connected tag background should be #ECEEE8, got`, bg);
      process.exitCode = 1;
    }
    if (t.aria !== ariaLabel) {
      console.error(`${tag}: expected aria-label "${ariaLabel}", got`, t.aria);
      process.exitCode = 1;
    }
    if (!t.hasCheck) {
      console.error(`${tag}: missing Font Awesome check icon in pill`);
      process.exitCode = 1;
    }
    if (t.visibleText) {
      console.error(`${tag}: pill should not show visible text, got`, t.visibleText);
      process.exitCode = 1;
    }
    if (t.w > 36 || t.h > 36 || t.w < 22 || t.h < 22) {
      console.error(`${tag}: compact pill size out of range`, t.w, t.h);
      process.exitCode = 1;
    }
  }

  await page.locator("#plan .step--connect").screenshot({
    path: `${outDir}/plan-step1-connect-check-${tag}.png`,
  });
  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-plan-step1-connected: ok");
