import { chromium } from "playwright";

const base = process.env.VERIFY_URL || "https://appsetterwebsite.vercel.app";

for (const path of ["/", "/nl/"]) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const samples = [];
  page.on("framenavigated", async () => {
    samples.push(
      await page.evaluate(() => {
        const btn = document.querySelector(".hero .ctas.hero-cta-intro .btn, .hero .ctas.hero-cta-intro .btn-roll");
        const tick = document.querySelector(".hero .ticks.hero-cta-intro span");
        const gs = document.documentElement.classList.contains("gs");
        const btnOp = btn ? getComputedStyle(btn).opacity : null;
        const tickOp = tick ? getComputedStyle(tick).opacity : null;
        return { gs, btnOp, tickOp };
      }).catch(() => null)
    );
  });

  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(80);
  const late = await page.evaluate(() => {
    const btn = document.querySelector(".hero .ctas.hero-cta-intro .btn, .hero .ctas.hero-cta-intro .btn-roll");
    const tick = document.querySelector(".hero .ticks.hero-cta-intro span");
    return {
      btnOp: btn ? getComputedStyle(btn).opacity : null,
      tickOp: tick ? getComputedStyle(tick).opacity : null,
      intro: document.documentElement.dataset.heroIntro,
    };
  });

  const bad = samples.filter((s) => s && (s.btnOp === "1" || s.tickOp === "1"));
  console.log({ path, samples: samples.slice(0, 5), late, earlyVisibleFlash: bad.length });
  if (bad.length) process.exitCode = 1;

  await browser.close();
}
