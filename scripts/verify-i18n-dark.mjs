import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });
const base = process.env.VERIFY_URL || "https://appsetterwebsite.vercel.app";

const browser = await chromium.launch();

for (const scheme of ["light", "dark"]) {
  for (const { path, tag, width } of [
    { path: "/", tag: "en", width: 375 },
    { path: "/", tag: "en", width: 1440 },
    { path: "/nl/", tag: "nl", width: 375 },
    { path: "/nl/", tag: "nl", width: 1440 },
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      colorScheme: scheme,
    });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const lang = await page.evaluate(() => document.documentElement.lang);
    await page.locator(".hero").screenshot({
      path: `${outDir}/home-${tag}-${scheme}-${width}.png`,
      timeout: 10000,
    });
    console.log({ path, scheme, width, lang });
    await page.close();
  }
}

await browser.close();
