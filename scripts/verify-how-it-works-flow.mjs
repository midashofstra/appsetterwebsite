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
  const researchPanel = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return {
      title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
      src: img?.getAttribute("src") || "",
      hasPhoto: !!img,
      photoVisual: !!document.querySelector(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo"
      ),
    };
  });
  console.log(tag, "research", researchPanel);
  if (path === "/en" && !researchPanel.title?.includes("Know the lead")) {
    fail(`${tag}: Research panel title missing`);
  }
  if (!researchPanel.hasPhoto || !researchPanel.src.includes("step-3-research")) {
    fail(`${tag}: Research tab should show step-3-research photo`);
  }
  if (!researchPanel.photoVisual) fail(`${tag}: Research photo should use photo tile styling`);
  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-eight-tabs-${tag}-research.png`,
    timeout: 12000,
  });
  if (tag === "desktop-en") {
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-3-research-tab-en.png`,
      timeout: 12000,
    });
  }

  await page.getByRole("tab", { name: expectedLabels[3] }).click();
  await page.waitForTimeout(450);
  const contactPanel = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return {
      title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
      src: img?.getAttribute("src") || "",
      hasPhoto: !!img,
      photoVisual: !!document.querySelector(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo"
      ),
    };
  });
  console.log(tag, "contact", contactPanel);
  if (path === "/en" && !contactPanel.title?.includes("First outreach")) {
    fail(`${tag}: Contact panel title missing`);
  }
  if (path === "/nl" && !contactPanel.title?.includes("Eerste opvolging")) {
    fail(`${tag}: NL Contact panel title missing`);
  }
  if (!contactPanel.hasPhoto || !contactPanel.src.includes("step-4-contact")) {
    fail(`${tag}: Contact tab should show step-4-contact photo`);
  }
  if (!contactPanel.photoVisual) fail(`${tag}: Contact photo should use photo tile styling`);
  if (tag === "desktop-en") {
    await page.locator("#kanalen").screenshot({
      path: `${outDir}/how-it-works-eight-tabs-${tag}-contact.png`,
      timeout: 12000,
    });
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-4-contact-tab-en.png`,
      timeout: 12000,
    });
  }

  await page.getByRole("tab", { name: expectedLabels[4] }).click();
  await page.waitForTimeout(450);
  const conversationPanel = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return {
      title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
      src: img?.getAttribute("src") || "",
      hasPhoto: !!img,
      photoVisual: !!document.querySelector(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo"
      ),
      logoCount: document.querySelectorAll(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-img--logo"
      ).length,
    };
  });
  console.log(tag, "conversation", conversationPanel);
  if (path === "/en" && !conversationPanel.title?.includes("Reads and replies")) {
    fail(`${tag}: Conversation panel title missing`);
  }
  if (path === "/nl" && !conversationPanel.title?.includes("Leest en antwoordt")) {
    fail(`${tag}: NL Conversation panel title missing`);
  }
  if (!conversationPanel.hasPhoto || !conversationPanel.src.includes("step-5-conversation")) {
    fail(`${tag}: Conversation tab should show step-5-conversation photo`);
  }
  if (!conversationPanel.photoVisual) fail(`${tag}: Conversation photo should use photo tile styling`);
  if (conversationPanel.logoCount !== 0) {
    fail(`${tag}: Conversation tab should not show loose channel logos, got ${conversationPanel.logoCount}`);
  }
  if (tag === "desktop-en") {
    await page.locator("#kanalen").screenshot({
      path: `${outDir}/how-it-works-eight-tabs-${tag}-conversation.png`,
      timeout: 12000,
    });
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-5-conversation-tab-en.png`,
      timeout: 12000,
    });
  }
  if (tag === "mobile-nl") {
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-5-conversation-tab-nl.png`,
      timeout: 12000,
    });
  }

  await page.getByRole("tab", { name: expectedLabels[5] }).click();
  await page.waitForTimeout(450);
  const meetingPanel = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return {
      hasCta: !!document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__cta"),
      title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
      src: img?.getAttribute("src") || "",
      hasPhoto: !!img,
      photoVisual: !!document.querySelector(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo"
      ),
    };
  });
  console.log(tag, "meeting panel", meetingPanel);
  if (!meetingPanel.hasCta) fail(`${tag}: Meeting tab should show panel CTA`);
  if (path === "/en" && !meetingPanel.title?.includes("The meeting")) {
    fail(`${tag}: Meeting panel title should not use legacy Book wording`);
  }
  if (path === "/nl" && !meetingPanel.title?.includes("De afspraak")) {
    fail(`${tag}: NL Meeting panel title missing`);
  }
  if (!meetingPanel.hasPhoto || !meetingPanel.src.includes("step-6-meeting")) {
    fail(`${tag}: Meeting tab should show step-6-meeting photo`);
  }
  if (!meetingPanel.photoVisual) fail(`${tag}: Meeting photo should use photo tile styling`);

  await page.locator("#kanalen").screenshot({
    path: `${outDir}/how-it-works-eight-tabs-${tag}-meeting.png`,
    timeout: 12000,
  });
  if (tag === "desktop-en") {
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-6-meeting-tab-en.png`,
      timeout: 12000,
    });
  }

  await page.getByRole("tab", { name: expectedLabels[6] }).click();
  await page.waitForTimeout(450);
  const learnPanel = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return {
      title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
      src: img?.getAttribute("src") || "",
      hasPhoto: !!img,
      photoVisual: !!document.querySelector(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo"
      ),
    };
  });
  console.log(tag, "learn", learnPanel);
  if (path === "/en" && !learnPanel.title?.includes("Sharper after every thread")) {
    fail(`${tag}: Learn panel title missing`);
  }
  if (path === "/nl" && !learnPanel.title?.includes("Scherper na elk gesprek")) {
    fail(`${tag}: NL Learn panel title missing`);
  }
  if (!learnPanel.hasPhoto || !learnPanel.src.includes("step-7-learn")) {
    fail(`${tag}: Learn tab should show step-7-learn photo`);
  }
  if (!learnPanel.photoVisual) fail(`${tag}: Learn photo should use photo tile styling`);
  if (tag === "desktop-en") {
    await page.locator("#kanalen").screenshot({
      path: `${outDir}/how-it-works-eight-tabs-${tag}-learn.png`,
      timeout: 12000,
    });
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-7-learn-tab-en.png`,
      timeout: 12000,
    });
  }

  await page.getByRole("tab", { name: expectedLabels[7] }).click();
  await page.waitForTimeout(450);
  const crmPanel = await page.evaluate(() => {
    const img = document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo");
    return {
      title: document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__heading")?.textContent?.trim(),
      src: img?.getAttribute("src") || "",
      hasPhoto: !!img,
      photoVisual: !!document.querySelector(
        "[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo"
      ),
    };
  });
  console.log(tag, "crm", crmPanel);
  if (path === "/en" && !crmPanel.title?.includes("Notes and context")) {
    fail(`${tag}: CRM panel title missing`);
  }
  if (path === "/nl" && !crmPanel.title?.includes("Notities en context")) {
    fail(`${tag}: NL CRM panel title missing`);
  }
  if (!crmPanel.hasPhoto || !crmPanel.src.includes("step-8-crm")) {
    fail(`${tag}: CRM tab should show step-8-crm photo`);
  }
  if (!crmPanel.photoVisual) fail(`${tag}: CRM photo should use photo tile styling`);
  if (tag === "desktop-en") {
    await page.locator("#kanalen").screenshot({
      path: `${outDir}/how-it-works-eight-tabs-${tag}-crm.png`,
      timeout: 12000,
    });
    await page.locator("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-visual--photo").screenshot({
      path: `${outDir}/how-it-works-step-8-crm-tab-en.png`,
      timeout: 12000,
    });
    await page.locator(".bouncy-tabs__nav").screenshot({
      path: `${outDir}/how-it-works-all-eight-tabs-nav-en.png`,
      timeout: 12000,
    });
    const photoSlugs = [
      "step-1-find-leads",
      "step-2-add-leads",
      "step-3-research",
      "step-4-contact",
      "step-5-conversation",
      "step-6-meeting",
      "step-7-learn",
      "step-8-crm",
    ];
    for (let i = 0; i < 8; i++) {
      await page.getByRole("tab", { name: expectedLabels[i] }).click();
      await page.waitForTimeout(280);
      const src = await page.evaluate(() =>
        document.querySelector("[data-bouncy-tabs-panel][data-active] .bouncy-tabs__item-photo")?.getAttribute("src")
      );
      if (!src?.includes(photoSlugs[i])) fail(`${tag}: tab ${i + 1} missing ${photoSlugs[i]}`);
    }
  }

  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-how-it-works-flow: ok");
