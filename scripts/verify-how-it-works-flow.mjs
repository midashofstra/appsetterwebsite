import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

const EN_LABELS = [
  "1 · Find leads",
  "2 · Add leads",
  "3 · Research",
  "4 · Contact",
  "5 · Conversation",
  "6 · Meeting",
  "7 · Learn",
  "8 · CRM",
];
const NL_LABELS = [
  "1 · Leads vinden",
  "2 · Leads toevoegen",
  "3 · Onderzoek",
  "4 · Contact",
  "5 · Gesprek",
  "6 · Afspraak",
  "7 · Leren",
  "8 · CRM",
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
    const pageOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
    return {
      tabs,
      subtitle,
      navScrollable: navStyle?.overflowX === "auto" || navStyle?.overflowX === "scroll",
      navWrap: navStyle?.flexWrap,
      flowDiagramPresent: !!flowDiagram,
      pageOverflow,
    };
  });

  console.log(tag, metrics);

  if (metrics.tabs.length !== 8) fail(`${tag}: expected 8 tabs, got ${metrics.tabs.length}`);
  expectedLabels.forEach((label, i) => {
    if (metrics.tabs[i] !== label) fail(`${tag}: tab ${i + 1} expected "${label}", got "${metrics.tabs[i]}"`);
  });
  if (metrics.flowDiagramPresent) fail(`${tag}: end-to-end flow diagram should be removed`);
  if (metrics.pageOverflow) fail(`${tag}: horizontal page overflow`);
  if (!metrics.navScrollable) fail(`${tag}: nav should scroll horizontally for 8 tabs`);
  if (path === "/en" && !metrics.subtitle.includes("Everywhere your customers")) {
    fail(`${tag}: subtitle missing`);
  }
  if (path === "/nl" && !metrics.subtitle.includes("Overal waar je klanten")) {
    fail(`${tag}: NL subtitle missing`);
  }

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-eight-tabs-${tag}-step1.png`,
    timeout: 12000,
  });

  const step1Photo = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return img?.getAttribute("src") || "";
  });
  if (!step1Photo.includes("step-1-find-leads")) fail(`${tag}: step 1 image missing`);

  await page.getByRole("tab", { name: expectedLabels[2] }).click();
  await page.waitForTimeout(450);
  const researchPanel = await page.evaluate(() => ({
    title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
    hasIcon: !!document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__step-icon"),
  }));
  console.log(tag, "research", researchPanel);
  if (path === "/en" && !researchPanel.title?.includes("Know the lead")) {
    fail(`${tag}: Research panel title missing`);
  }
  if (!researchPanel.hasIcon) fail(`${tag}: Research should show FA fallback icon`);
  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-eight-tabs-${tag}-research.png`,
    timeout: 12000,
  });

  await page.getByRole("tab", { name: expectedLabels[5] }).click();
  await page.waitForTimeout(450);
  const meetingPanel = await page.evaluate(() => ({
    hasCta: !!document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__cta"),
    title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
  }));
  console.log(tag, "meeting panel", meetingPanel);
  if (!meetingPanel.hasCta) fail(`${tag}: Meeting tab should show panel CTA`);
  if (path === "/en" && !meetingPanel.title?.includes("The meeting")) {
    fail(`${tag}: Meeting panel title should not use legacy Book wording`);
  }
  if (path === "/nl" && !meetingPanel.title?.includes("De afspraak")) {
    fail(`${tag}: NL Meeting panel title missing`);
  }

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-eight-tabs-${tag}-meeting.png`,
    timeout: 12000,
  });

  await page.getByRole("tab", { name: expectedLabels[4] }).click();
  await page.waitForTimeout(350);
  const logos = await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-img--logo").count();
  if (logos !== 3) fail(`${tag}: Conversation panel should show 3 channel logos, got ${logos}`);

  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-how-it-works-flow: ok");
