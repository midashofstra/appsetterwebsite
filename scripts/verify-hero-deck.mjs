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
  console.log(`sha256 ${key} match=${a === b}`);
  if (a !== b) process.exitCode = 1;
}

const browser = await chromium.launch();

async function revealHero(page) {
  await page.evaluate(() => {
    document.documentElement.classList.remove("gs");
    document.querySelectorAll(".hero-hide").forEach((el) => {
      el.style.visibility = "visible";
      el.style.opacity = "1";
    });
  });
  await page.locator(".hero .hx").waitFor({ state: "visible", timeout: 15000 });
}

for (const { width, suffix } of [
  { width: 1440, suffix: "1440" },
  { width: 390, suffix: "390" },
]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await revealHero(page);
  await page.locator(".hero .hx").screenshot({ path: `${outDir}/hero-deck-${suffix}.png` });
  await page.screenshot({ path: `${outDir}/hero-full-deck-${suffix}.png` });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await revealHero(page);
  const channelDeck = page.locator(".hx .tiles-deck").last();
  await channelDeck.click();
  await page.waitForTimeout(180);
  await channelDeck.screenshot({ path: `${outDir}/hero-deck-mid-flip-channel-1440.png` });
  await page.close();
}

{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await revealHero(page);
  await page.waitForTimeout(3200);
  await page.locator(".hx .tiles-deck").last().click();
  await page.waitForTimeout(1200);
  await page.locator(".hx .tiles-deck").first().click();
  await page.waitForTimeout(1200);
  const vid = await page.video()?.path();
  await page.close();
  await ctx.close();
  if (vid) {
    const { renameSync } = await import("fs");
    renameSync(vid, `${outDir}/hero-deck-cycle-demo.webm`);
    console.log("video", `${outDir}/hero-deck-cycle-demo.webm`);
  }
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await revealHero(page);
  const channelDeck = page.locator(".hx .tiles-deck").last();
  const before = await channelDeck.getAttribute("data-hero-front");
  await channelDeck.click();
  await page.waitForFunction(
    (prev) => {
      const decks = document.querySelectorAll(".hx .tiles-deck");
      const el = decks[decks.length - 1];
      return el && el.getAttribute("data-hero-front") !== prev;
    },
    before,
    { timeout: 5000 }
  );
  const after = await channelDeck.getAttribute("data-hero-front");
  console.log(`click-advance channel: ${before} -> ${after}`);
  if (!before || before === after) {
    console.error("click did not advance channel deck");
    process.exitCode = 1;
  }
  const agendaDeck = page.locator(".hx .tiles-deck").nth(0);
  const b1 = await agendaDeck.getAttribute("data-hero-front");
  await agendaDeck.click();
  await page.waitForFunction(
    (prev) => {
      const el = document.querySelectorAll(".hx .tiles-deck")[0];
      return el && el.getAttribute("data-hero-front") !== prev;
    },
    b1,
    { timeout: 5000 }
  );
  const b2 = await agendaDeck.getAttribute("data-hero-front");
  console.log(`click-advance agenda: ${b1} -> ${b2}`);
  if (!b1 || b1 === b2) {
    console.error("click did not advance agenda deck");
    process.exitCode = 1;
  }
  await page.close();
}

await browser.close();
