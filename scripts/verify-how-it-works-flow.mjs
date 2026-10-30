import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const EN_LABELS = [
  "1 · Find leads",
  "2 · Add leads",
  "3 · Contact",
  "4 · Conversation",
  "5 · Book",
  "6 · Learn",
  "7 · CRM",
];
const NL_LABELS = [
  "1 · Leads vinden",
  "2 · Leads toevoegen",
  "3 · Contact",
  "4 · Gesprek",
  "5 · Afspraak boeken",
  "6 · Leren",
  "7 · CRM",
];

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

const browser = await chromium.launch();

for (const [path, tag, width, height, expectedLabels] of [
  ["/en", "desktop-en", 1440, 900, EN_LABELS],
  ["/en", "mobile-en", 390, 844, EN_LABELS],
  ["/nl", "mobile-nl", 390, 844, NL_LABELS],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#kanalen").scrollIntoViewIfNeeded();
  await page.waitForSelector(".bouncy-tabs--ready", { timeout: 15000 });
  await page.waitForTimeout(400);

  const metrics = await page.evaluate(() => {
    const section = document.querySelector("#kanalen");
    const subtitle = section?.querySelector(".chan-sub")?.textContent?.trim() ?? "";
    const tabs = [...document.querySelectorAll(".bouncy-tabs__button")].map((b) => b.textContent?.trim());
    const nav = document.querySelector(".bouncy-tabs__nav");
    const navStyle = nav ? getComputedStyle(nav) : null;
    const flowDiagram = document.querySelector(".how-it-works-flow");
    const activePanel = document.querySelector("[data-bouncy-tabs-panel][data-active]");
    const hasCta = !!activePanel?.querySelector(".bouncy-tabs__cta");
    const pageOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
    return {
      tabs,
      subtitle,
      navScrollable: navStyle?.overflowX === "auto" || navStyle?.overflowX === "scroll",
      navWrap: navStyle?.flexWrap,
      flowDiagramPresent: !!flowDiagram,
      pageOverflow,
      hasCta,
    };
  });

  console.log(tag, metrics);

  if (metrics.tabs.length !== 7) fail(`${tag}: expected 7 tabs, got ${metrics.tabs.length}`);
  expectedLabels.forEach((label, i) => {
    if (metrics.tabs[i] !== label) fail(`${tag}: tab ${i + 1} expected "${label}", got "${metrics.tabs[i]}"`);
  });
  if (metrics.flowDiagramPresent) fail(`${tag}: end-to-end flow diagram should be removed`);
  if (metrics.pageOverflow) fail(`${tag}: horizontal page overflow`);
  if (!metrics.navScrollable && width < 768) fail(`${tag}: mobile nav should scroll horizontally`);
  if (path === "/en" && !metrics.subtitle.includes("Everywhere your customers")) {
    fail(`${tag}: subtitle missing`);
  }
  if (path === "/nl" && !metrics.subtitle.includes("Overal waar je klanten")) {
    fail(`${tag}: NL subtitle missing`);
  }

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-seven-tabs-${tag}-step1.png`,
    timeout: 12000,
  });

  await page.getByRole("tab", { name: expectedLabels[4] }).click();
  await page.waitForTimeout(450);
  const bookPanel = await page.evaluate(() => ({
    hasCta: !!document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__cta"),
    title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
  }));
  console.log(tag, "book panel", bookPanel);
  if (!bookPanel.hasCta) fail(`${tag}: Book tab should show panel CTA`);

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-seven-tabs-${tag}-book.png`,
    timeout: 12000,
  });

  await page.getByRole("tab", { name: expectedLabels[3] }).click();
  await page.waitForTimeout(350);
  const logos = await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-img--logo").count();
  if (logos !== 3) fail(`${tag}: Conversation panel should show 3 channel logos, got ${logos}`);

  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-how-it-works-flow: ok");
