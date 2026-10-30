import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const base = (process.env.VERIFY_URL || "http://127.0.0.1:3001").replace(/\/$/, "");

function fail(msg) {
  console.error(msg);
  process.exitCode = 1;
}

function readEl(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    opacity: cs.opacity,
    transform: cs.transform,
    revealed: el.getAttribute("data-motion-revealed") === "true",
  };
}

async function runViewport(page, tag) {
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (/vimeo|cloudflare|Content Security Policy|status of 401|font-size:0;color:transparent/i.test(text)) {
      return;
    }
    errors.push(text);
  });

  await page.goto(`${base}/en`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".hx", { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelector("#probleem h2")?.hasAttribute("data-landing-reveal"),
    { timeout: 15000 }
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const samples = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        sel,
        opacity: cs.opacity,
        revealed: el.getAttribute("data-motion-revealed") === "true",
        pending: el.hasAttribute("data-landing-reveal"),
      };
    };
    return [
      pick("#probleem h2"),
      pick("#waarom h2"),
      pick(".cards .card"),
      pick("#pricing .pricing-card"),
    ].filter(Boolean);
  });
  console.log(tag, "below-fold at rest", samples);

  for (const s of samples) {
    if (s && s.sel === "#probleem h2" && parseFloat(s.opacity) > 0.95 && s.revealed) {
      fail(`${tag}: problem h2 already revealed at scroll 0 (premature reveal)`);
    }
    if (s && s.sel === "#probleem h2" && parseFloat(s.opacity) > 0.95 && !s.revealed) {
      fail(`${tag}: problem h2 fully visible at scroll 0 before reveal (SSG flash)`);
    }
  }

  const problemH2 = await page.$("#probleem h2");
  if (problemH2) {
    const beforeScroll = await problemH2.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        opacity: cs.opacity,
        transform: cs.transform,
        revealed: el.getAttribute("data-motion-revealed") === "true",
      };
    });
    await problemH2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const afterScroll = await problemH2.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        opacity: cs.opacity,
        transform: cs.transform,
        revealed: el.getAttribute("data-motion-revealed") === "true",
      };
    });
    console.log(tag, "problem h2 scroll", { beforeScroll, afterScroll });
    if (beforeScroll && parseFloat(beforeScroll.opacity) > 0.95 && parseFloat(afterScroll?.opacity ?? "0") < 0.85) {
      fail(`${tag}: problem h2 flashed to hidden on scroll`);
    }
    if (parseFloat(afterScroll?.opacity ?? "0") < 0.9) {
      fail(`${tag}: problem h2 did not finish reveal on scroll`);
    }
  }

  await page.evaluate(() => {
    const h2 = document.querySelector("#waarom h2");
    h2?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(900);
  const whyAfter = await page.evaluate(() => {
    const el = document.querySelector("#waarom h2");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      opacity: cs.opacity,
      transform: cs.transform,
      revealed: el.getAttribute("data-motion-revealed") === "true",
    };
  });
  console.log(tag, "why h2 after scroll", whyAfter);
  if (whyAfter && parseFloat(whyAfter.opacity) < 0.5) {
    fail(`${tag}: why h2 stuck hidden after scroll into view`);
  }

  await page.screenshot({
    path: `${outDir}/scroll-reveal-${tag}-why-visible.png`,
    fullPage: false,
  });

  if (errors.length) {
    console.error(tag, "console errors", errors);
    fail(`${tag}: console errors during scroll reveal test`);
  }
}

const browser = await chromium.launch();
for (const [width, tag] of [
  [1440, "desktop-1440"],
  [390, "mobile-390"],
]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  await runViewport(page, tag);
  await page.close();
}

await browser.close();
if (process.exitCode) process.exit(process.exitCode);
console.log("verify-scroll-reveal-no-flash: ok");
