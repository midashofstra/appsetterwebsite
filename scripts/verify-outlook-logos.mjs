import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { createHash } from "crypto";
import { readFileSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const uploads = {
  mail: "/home/ubuntu/.cursor/projects/workspace/uploads/outlook_9f52.svg",
  cal: "/home/ubuntu/.cursor/projects/workspace/uploads/outlook-calendar_3f45.svg",
};
const publicPaths = {
  mail: "/workspace/public/logos/outlook.svg",
  cal: "/workspace/public/logos/outlook-calendar.svg",
};

for (const key of ["mail", "cal"]) {
  const a = createHash("sha256").update(readFileSync(uploads[key])).digest("hex");
  const b = createHash("sha256").update(readFileSync(publicPaths[key])).digest("hex");
  console.log(`sha256 ${key} upload=${a} public=${b} match=${a === b}`);
}

const browser = await chromium.launch();

async function snap(page, name) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("gs");
    document.querySelectorAll(".hero-hide").forEach((el) => {
      el.style.visibility = "visible";
      el.style.opacity = "1";
    });
  });
  await page.waitForTimeout(200);
  await page.locator(".hero .hx").waitFor({ state: "visible", timeout: 10000 });
  await page.locator(".hero .hx").screenshot({ path: `${outDir}/${name}` });
}

for (const { width, suffix } of [
  { width: 1440, suffix: "1440" },
  { width: 390, suffix: "390" },
]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await snap(page, `hero-official-outlook-${suffix}.png`);
  await page.screenshot({ path: `${outDir}/hero-full-official-outlook-${suffix}.png` });
  await page.locator(".logos").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator(".logos").screenshot({ path: `${outDir}/integrations-logos-${suffix}.png` });
  await page.close();
}

// Mid-rotation: after tile bounce loop (starts ~3.5s)
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(5200);
  await page.locator(".hx .tiles").last().screenshot({ path: `${outDir}/hero-outlook-mail-mid-rotation-1440.png` });
  await page.close();
}

await browser.close();
