import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.VERIFY_URL || "http://127.0.0.1:3001/en";

const browser = await chromium.launch();

for (const [path, tag, width] of [
  ["/en", "en-desktop", 1440],
  ["/en", "en-mobile", 390],
  ["/nl", "nl-mobile", 390],
]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
  await page.goto(`${baseUrl.replace(/\/en\/?$/, "")}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const metrics = await page.locator("#pricing .wrap").evaluate((wrap) => {
    const grid = wrap.querySelector(".pricing-grid");
    const cards = [...wrap.querySelectorAll(".pricing-card")];
    const topFirst = cards.reduce((best, card) =>
      !best || card.getBoundingClientRect().top < best.getBoundingClientRect().top ? card : best
    );
    const popularTab = wrap.querySelector(".pricing-card--popular .pricing-card__tab");
    const tabStyle = popularTab ? getComputedStyle(popularTab) : null;
    const tabFs = tabStyle ? parseFloat(tabStyle.fontSize) : 0;
    const tabPadY = tabStyle ? parseFloat(tabStyle.paddingTop) : 0;
    const foot = wrap.querySelector(".pricing-foot");
    const gridRect = grid?.getBoundingClientRect();
    const next = wrap.parentElement?.querySelector("#faq, .faq, section[id='faq']");
    const section = wrap.closest(".pricing-section");
    const sectionRect = section?.getBoundingClientRect();
    return {
      count: cards.length,
      overflow: grid ? grid.scrollWidth > grid.clientWidth + 2 : true,
      topIsPopular: topFirst?.classList.contains("pricing-card--popular") ?? false,
      footPresent: !!foot,
      tabFs,
      tabPadY,
      tabCentered:
        popularTab && gridRect
          ? Math.abs(
              popularTab.getBoundingClientRect().left +
                popularTab.getBoundingClientRect().width / 2 -
                (gridRect.left + gridRect.width / 2)
            ) < 24
          : false,
      sectionBottomGap: sectionRect && gridRect ? sectionRect.bottom - gridRect.bottom : null,
    };
  });
  console.log(tag, metrics);
  if (metrics.count !== 3 || metrics.overflow) process.exitCode = 1;
  if (width === 390 && !metrics.topIsPopular) process.exitCode = 1;
  if (metrics.footPresent) process.exitCode = 1;
  if (metrics.tabFs > 12.5) process.exitCode = 1;
  if (metrics.tabPadY > 5) process.exitCode = 1;
  if (!metrics.tabCentered) process.exitCode = 1;
  if (metrics.sectionBottomGap != null && metrics.sectionBottomGap > 120) process.exitCode = 1;
  await page.locator("#pricing").screenshot({ path: `${outDir}/pricing-${tag}.png` });
  await page.close();
}

await browser.close();
