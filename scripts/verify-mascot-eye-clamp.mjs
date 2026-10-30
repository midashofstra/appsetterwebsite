import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

async function highlightsContainedInEyes(page, selector) {
  return page.locator(selector).evaluate((root) => {
    const eyes = root.querySelector("#eyes_2");
    const inner = root.querySelector("#innereyes");
    if (!eyes || !inner) return false;
    const eyeRects = [...eyes.querySelectorAll(":scope > path")].map((p) =>
      p.getBoundingClientRect()
    );
    if (!eyeRects.length) return false;
    for (const hp of inner.querySelectorAll("path")) {
      const hr = hp.getBoundingClientRect();
      const cx = (hr.left + hr.right) / 2;
      const cy = (hr.top + hr.bottom) / 2;
      const centerInside = eyeRects.some(
        (er) => cx >= er.left && cx <= er.right && cy >= er.top && cy <= er.bottom
      );
      if (!centerInside) return false;
      const insetPx = 0.75;
      const corners = [
        [hr.left + insetPx, hr.top + insetPx],
        [hr.right - insetPx, hr.top + insetPx],
        [hr.left + insetPx, hr.bottom - insetPx],
        [hr.right - insetPx, hr.bottom - insetPx],
      ];
      for (const [x, y] of corners) {
        const inside = eyeRects.some(
          (er) => x >= er.left && x <= er.right && y >= er.top && y <= er.bottom
        );
        if (!inside) return false;
      }
    }
    return true;
  });
}

async function probeMascot(page, selector, label, shots) {
  const root = page.locator(selector);
  await root.waitFor({ state: "visible", timeout: 15000 });
  const box = await root.boundingBox();
  if (!box) {
    fail(`${label}: no bounding box`);
    return;
  }

  const probes = [
    { name: "center", x: box.x + box.width / 2, y: box.y + box.height / 2 },
    { name: "top-left", x: 8, y: 8 },
    { name: "top-right", x: page.viewportSize().width - 8, y: 8 },
    { name: "bottom-left", x: 8, y: page.viewportSize().height - 8 },
    { name: "bottom-right", x: page.viewportSize().width - 8, y: page.viewportSize().height - 8 },
  ];

  for (const probe of probes) {
    await page.mouse.move(probe.x, probe.y);
    await page.waitForTimeout(probe.name === "center" ? 350 : 500);
    const ok = await highlightsContainedInEyes(page, selector);

    if (!ok) fail(`${label} @ ${probe.name}: highlight escaped black eye`);
    else console.log(`${label} @ ${probe.name}: highlights contained`);

    if (shots && (probe.name === "top-left" || probe.name === "bottom-right")) {
      await root.screenshot({
        path: `${outDir}/${label}-eye-${probe.name}.png`,
        timeout: 8000,
      });
    }
  }
}

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
await desktop.waitForSelector("#hdr .nav-mascot-icon", { timeout: 15000 });
await probeMascot(desktop, "#hdr .nav-mascot-icon", "nav-mascot", true);

await desktop.locator(".manifest h2").scrollIntoViewIfNeeded();
await desktop.evaluate(() => {
  const h2 = document.querySelector(".manifest h2");
  if (!h2) return;
  const top = h2.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + h2.offsetHeight / 2 - window.innerHeight / 2, behavior: "instant" });
});
await desktop.waitForTimeout(600);
await probeMascot(desktop, ".manifest-inline-mascot", "manifest-mascot", true);
await desktop.locator(".manifest").screenshot({
  path: `${outDir}/manifest-mascot-eye-clamp-desktop.png`,
  timeout: 10000,
});

await desktop.close();

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
});
await mobile.goto(`${base}/nl`, { waitUntil: "domcontentloaded" });
await mobile.waitForTimeout(3200);
await mobile.locator(".manifest h2").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(400);
await probeMascot(mobile, ".manifest-inline-mascot", "manifest-mascot-mobile", false);
await mobile.locator(".manifest").screenshot({
  path: `${outDir}/manifest-mascot-eye-clamp-mobile.png`,
  timeout: 10000,
});
await mobile.close();

await browser.close();

if (process.exitCode) process.exit(process.exitCode);
console.log("verify-mascot-eye-clamp: ok");
