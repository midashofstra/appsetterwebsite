import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "fs";
import { createHash } from "crypto";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const upload = "/home/ubuntu/.cursor/projects/workspace/uploads/linkedin_77b8.svg";
const pub = "/workspace/public/logos/linkedin.svg";
const a = createHash("sha256").update(readFileSync(upload)).digest("hex");
const b = createHash("sha256").update(readFileSync(pub)).digest("hex");
console.log(`sha256 linkedin match=${a === b}`);
if (a !== b) process.exit(1);

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
  await page.goto("http://127.0.0.1:3001/", { waitUntil: "networkidle" });
  await revealHero(page);
  await page.waitForTimeout(400);
  await page.locator(".hero .hx").screenshot({ path: `${outDir}/hero-official-linkedin-${suffix}.png` });
  await page.locator(".logos").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator(".logos").screenshot({ path: `${outDir}/integrations-official-linkedin-${suffix}.png` });
  const srcs = await page.locator('.logos img[src*="linkedin"]').evaluateAll((els) =>
    els.map((el) => el.getAttribute("src"))
  );
  console.log(`integrations linkedin src ${suffix}:`, srcs);
  if (!srcs.every((s) => s === "/logos/linkedin.svg")) process.exitCode = 1;
  const heroLi = await page.locator('[data-card-id="linkedin"] img').getAttribute("src");
  console.log(`hero linkedin src ${suffix}:`, heroLi);
  if (heroLi !== "/logos/linkedin.svg") process.exitCode = 1;
  await page.close();
}

await browser.close();
