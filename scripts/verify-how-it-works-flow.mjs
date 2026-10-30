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

for (const [path, tag, width, height] of [
  ["/en", "desktop-en", 1440, 900],
  ["/en", "mobile-en", 390, 844],
  ["/nl", "mobile-nl", 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#kanalen").scrollIntoViewIfNeeded();
  await page.waitForSelector(".bouncy-tabs--ready", { timeout: 15000 });
  await page.waitForTimeout(400);

  const flow = await page.evaluate(() => {
    const steps = document.querySelectorAll(".how-it-works-flow__step");
    const labels = [...document.querySelectorAll(".how-it-works-flow__label")].map((el) =>
      el.textContent?.trim()
    );
    const tabs = [...document.querySelectorAll(".bouncy-tabs__button")].map((b) => b.textContent?.trim());
    const activePanel = document.querySelector("[data-bouncy-tabs-panel][data-active]");
    const flowVisible = !!activePanel?.querySelector(".how-it-works-flow");
    const isColumn = flowVisible
      ? getComputedStyle(document.querySelector(".how-it-works-flow")).flexDirection === "column"
      : null;
    return { stepCount: steps.length, labels, tabs, flowVisible, isColumn };
  });

  console.log(tag, flow);

  if (!flow.flowVisible) fail(`${tag}: tab 1 should show flow`);
  if (flow.stepCount !== 6) fail(`${tag}: expected 6 flow steps, got ${flow.stepCount}`);
  if (flow.tabs.length !== 4) fail(`${tag}: expected 4 tabs, got ${flow.tabs.length}`);
  if (width >= 768 && flow.isColumn) fail(`${tag}: desktop flow should be horizontal`);
  if (width < 768 && !flow.isColumn) fail(`${tag}: mobile flow should be vertical`);

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-flow-${tag}.png`,
    timeout: 12000,
  });

  await page.getByRole("tab", { name: /4 ·/ }).click();
  await page.waitForTimeout(350);
  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-channels-tab-${tag}.png`,
    timeout: 12000,
  });

  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-how-it-works-flow: ok");
