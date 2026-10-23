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
  await revealHero(page);
  await page.waitForTimeout(150);

  const agendaFront = await page.locator(".hx .tiles-deck").nth(0).getAttribute("data-hero-front");
  const channelFront = await page.locator(".hx .tiles-deck").nth(1).getAttribute("data-hero-front");
  console.log(`load-front ${suffix}: agenda=${agendaFront} channel=${channelFront}`);
  if (agendaFront !== "google-agenda" || channelFront !== "linkedin") {
    console.error("initial front cards incorrect on load");
    process.exitCode = 1;
  }

  await page.locator(".hero .hx").screenshot({ path: `${outDir}/hero-deck-load-${suffix}.png` });
  await page.close();
}

for (const { width, suffix } of [
  { width: 1440, suffix: "1440" },
  { width: 390, suffix: "390" },
]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await revealHero(page);
  const channelDeck = page.locator(".hx .tiles-deck").nth(1);
  await channelDeck.click();
  await page.waitForTimeout(225);
  const mid = await channelDeck.evaluate((deck) => {
    const exiting = deck.querySelector('[data-card-id][style*="blur"]');
    const front = deck.querySelector('[data-hero-front]');
    const exitingEl = deck.querySelector('[data-card-id]');
    const tiles = [...deck.querySelectorAll(".tile-deck-card")];
    const transforms = tiles.map((t) => getComputedStyle(t).transform);
    const filters = tiles.map((t) => getComputedStyle(t).filter);
    return {
      hasBlur: filters.some((f) => f.includes("blur") && !f.includes("blur(0px)")),
      transforms,
      filters,
    };
  });
  console.log(`mid-flip ${suffix}: hasBlur=${mid.hasBlur}`);
  if (!mid.hasBlur) {
    console.error("expected blur mid-transition");
    process.exitCode = 1;
  }
  const maxTranslate = mid.transforms.some((t) => {
    if (!t || t === "none") return false;
    const m = t.match(/matrix\(([^)]+)\)/);
    if (!m) return false;
    const parts = m[1].split(",").map(Number);
    const tx = parts[4];
    return Math.abs(tx) > 8;
  });
  if (maxTranslate) {
    console.error("outgoing card appears to translate horizontally mid-flip");
    process.exitCode = 1;
  }
  await channelDeck.screenshot({ path: `${outDir}/hero-deck-mid-flip-${suffix}.png` });
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
  await page.locator(".hx .tiles-deck").nth(1).click();
  await page.waitForTimeout(1200);
  await page.locator(".hx .tiles-deck").nth(0).click();
  await page.waitForTimeout(1200);
  const vid = await page.video()?.path();
  await page.close();
  await ctx.close();
  if (vid) {
    const { renameSync } = await import("fs");
    renameSync(vid, `${outDir}/hero-deck-fade-blur-demo.webm`);
    console.log("video", `${outDir}/hero-deck-fade-blur-demo.webm`);
  }
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await revealHero(page);
  const channelDeck = page.locator(".hx .tiles-deck").nth(1);
  const before = await channelDeck.getAttribute("data-hero-front");
  await channelDeck.click();
  await page.waitForFunction(
    (prev) => {
      const el = document.querySelectorAll(".hx .tiles-deck")[1];
      return el && el.getAttribute("data-hero-front") !== prev;
    },
    before,
    { timeout: 5000 }
  );
  const after = await channelDeck.getAttribute("data-hero-front");
  console.log(`click-advance channel: ${before} -> ${after}`);
  if (before !== "linkedin" || after !== "gmail") {
    console.error("expected linkedin -> gmail on first channel click");
    process.exitCode = 1;
  }
  await page.close();
}

await browser.close();
