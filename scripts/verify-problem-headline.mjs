import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

const browser = await chromium.launch();

for (const [path, tag, expected] of [
  ["/en/", "en", "Sound familiar?"],
  ["/nl/", "nl", "Herken je dit?"],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#probleem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const h2 = await page.locator("#probleem .head h2").textContent();
  if (h2?.trim() !== expected) {
    fail(`${tag}: expected h2 "${expected}", got "${h2?.trim()}"`);
  }
  if (h2?.includes("Plenty of leads") || h2?.includes("Leads genoeg")) {
    fail(`${tag}: legacy headline still visible`);
  }

  await page.locator("#probleem .head").screenshot({
    path: `${outDir}/problem-headline-${tag}.png`,
    timeout: 12000,
  });
  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-problem-headline: ok");
