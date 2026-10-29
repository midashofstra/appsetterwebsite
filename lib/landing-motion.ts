/* eslint-disable @typescript-eslint/no-explicit-any */
import { markHeroIntroComplete } from "@/lib/hero-deck-timing";
import { animate, inView, scroll, stagger } from "motion";

type CleanupFn = () => void;

/** Hero headline / sub / CTA text intro (Mobbin-style fade + blur + slide). */
const HERO_TEXT_INTRO_EASE: [number, number, number, number] = [0, 0, 0.2, 1];
const HERO_TEXT_INTRO_BLUR_PX = 8;
const HERO_TEXT_BLUR_IN = `blur(${HERO_TEXT_INTRO_BLUR_PX}px)`;
const HERO_TEXT_BLUR_OUT = "blur(0px)";

/** Hero intro timeline (overlapping: next segment starts before previous ends). */
const HERO_WORD_DURATION_S = 0.55;
const HERO_WORD_STAGGER_S = 0.1;
const HERO_TILE_DURATION_S = 0.55;
const HERO_TILE_STAGGER_S = 0.1;
/** Motion `at`: overlap with headline words. */
const HERO_TILE_AT = "-0.45";
const HERO_SUB_DURATION_S = 0.55;
const HERO_SUB_AT = "-0.35";
const HERO_CTA_DURATION_S = 0.55;
const HERO_CTA_STAGGER_S = 0.1;
/** Gap after sub before CTA beat (CTAs hydrated via HeroExtras separate root). */
const HERO_CTA_AFTER_SUB_DELAY_S = 0.08;
const HERO_TICK_DURATION_S = 0.5;
const HERO_TICK_STAGGER_S = 0.08;
/** Overlap tick row with CTA buttons in the second intro beat. */
const HERO_TICK_AT = "-0.35";

/** Navbar load intro (synced with hero text intro start; does not affect hero-intro-complete). */
const NAV_INTRO_DURATION_S = 0.55;
const NAV_INTRO_OFFSET_Y = -16;
const NAV_INTRO_STAGGER_S = 0.08;

function clearNavIntroInlineStyles(
  targets: HTMLElement[],
  blurLayer: HTMLElement | null
) {
  targets.forEach((el) => {
    el.style.opacity = "";
    el.style.transform = "";
    el.style.filter = "";
    el.style.willChange = "";
  });
  if (blurLayer) blurLayer.style.opacity = "";
}

function primeNavIntroFromState(
  targets: HTMLElement[],
  blurLayer: HTMLElement | null
) {
  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = `translateY(${NAV_INTRO_OFFSET_Y}px)`;
    el.style.filter = HERO_TEXT_BLUR_IN;
    el.style.willChange = "transform, opacity, filter";
  });
  if (blurLayer) blurLayer.style.opacity = "0";
}

function getNavIntroTargets(): {
  brand: HTMLElement | null;
  links: HTMLElement[];
  cta: HTMLElement | null;
  blurLayer: HTMLElement | null;
  all: HTMLElement[];
} {
  const brand = document.querySelector("#hdr .brand") as HTMLElement | null;
  const links = q("#hdr .navlinks a");
  const cta = document.querySelector("#hdr nav .btn-main") as HTMLElement | null;
  const blurLayer = document.querySelector("#hdr .hdr-progressive-blur") as HTMLElement | null;
  const all = [brand, ...links, cta].filter(Boolean) as HTMLElement[];
  return { brand, links, cta, blurLayer, all };
}

function heroCtaIntroButtons(): HTMLElement[] {
  return q(".hero .ctas.hero-cta-intro .btn, .hero .ctas.hero-cta-intro .btn-roll");
}

function primeHeroCtaIntroHidden() {
  heroCtaIntroButtons().forEach((btn) => {
    btn.style.opacity = "0";
    btn.style.transform = "translateY(18px)";
    btn.style.filter = HERO_TEXT_BLUR_IN;
  });
  q(".hero .ticks.hero-cta-intro span").forEach((span) => {
    span.style.opacity = "0";
    span.style.transform = "translateY(10px)";
  });
}

function revealHeroCtaIntroImmediate() {
  heroCtaIntroButtons().forEach((btn) => {
    btn.style.opacity = "";
    btn.style.transform = "";
    btn.style.filter = "";
  });
  q(".hero .ticks.hero-cta-intro span").forEach((span) => {
    span.style.opacity = "";
    span.style.transform = "";
    span.style.filter = "";
  });
}

/** HeroExtras mounts CTAs in a nested root (async); wait before animating them in. */
async function waitForHeroCtaIntroReady(maxMs = 4000): Promise<{
  buttons: HTMLElement[];
  ticks: HTMLElement[];
}> {
  const deadline = performance.now() + maxMs;
  while (performance.now() < deadline) {
    const buttons = heroCtaIntroButtons();
    const ticks = q(".hero .ticks.hero-cta-intro span");
    if (buttons.length >= 2 && ticks.length >= 3) {
      return { buttons, ticks };
    }
    await new Promise((r) => requestAnimationFrame(r));
  }
  return { buttons: heroCtaIntroButtons(), ticks: q(".hero .ticks.hero-cta-intro span") };
}

async function animateHeroCtaIntro(buttons: HTMLElement[]) {
  if (buttons.length) {
    buttons.forEach((btn) => {
      btn.style.willChange = "transform, opacity, filter";
    });
  }
  q(".hero .ticks.hero-cta-intro span").forEach((span) => {
    span.style.filter = HERO_TEXT_BLUR_IN;
  });

  await animate([
    buttons.length && [
      buttons,
      {
        opacity: [0, 1],
        y: [18, 0],
        filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
      },
      {
        duration: HERO_CTA_DURATION_S,
        delay: stagger(HERO_CTA_STAGGER_S),
        ease: HERO_TEXT_INTRO_EASE,
        at: 0,
      },
    ],
    [
      ".hero .ticks.hero-cta-intro span",
      {
        opacity: [0, 1],
        y: [10, 0],
        filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
      },
      {
        duration: HERO_TICK_DURATION_S,
        delay: stagger(HERO_TICK_STAGGER_S),
        ease: HERO_TEXT_INTRO_EASE,
        at: HERO_TICK_AT,
      },
    ],
    [
      ".hero .ticks.hero-cta-intro svg",
      { scale: [0, 1], rotate: [-45, 0] },
      {
        duration: HERO_TICK_DURATION_S,
        delay: stagger(HERO_TICK_STAGGER_S),
        ease: HERO_TEXT_INTRO_EASE,
        at: "<",
      },
    ],
  ].filter(Boolean) as any);

  buttons.forEach((btn) => {
    btn.style.willChange = "";
    btn.style.filter = "";
  });
  q(".hero .ticks.hero-cta-intro span").forEach((span) => {
    span.style.filter = "";
  });
}

function clearHeroTextFilters(selectors: string[]) {
  selectors.forEach((sel) => {
    q(sel).forEach((el) => {
      el.style.filter = "";
    });
  });
}

function q(sel: string, ctx?: ParentNode): HTMLElement[] {
  return Array.from((ctx ?? document).querySelectorAll(sel)) as HTMLElement[];
}

function splitWords(el: HTMLElement): HTMLElement[] {
  const words = el.textContent?.trim().split(/\s+/) ?? [];
  el.innerHTML = words
    .map((w) => `<span class="wm"><span class="wi">${w}</span></span>`)
    .join("");
  return q(".wi", el);
}

function parseMargin(start: string): string {
  const m = start.match(/top\s+(\d+)%/);
  if (!m) return "0px 0px -10% 0px";
  const pct = Number(m[1]);
  return `0px 0px -${100 - pct}% 0px`;
}

function revealOnScroll(
  target: Element | Element[] | string,
  keyframes: Record<string, unknown>,
  opts: {
    trigger?: Element | string;
    start?: string;
    duration?: number;
    ease?: [number, number, number, number];
    delay?: number;
    staggerEach?: number;
  }
): CleanupFn {
  const triggerEl =
    typeof opts.trigger === "string"
      ? document.querySelector(opts.trigger)
      : opts.trigger ?? (typeof target === "string" ? document.querySelector(target) : null);
  if (!triggerEl) return () => {};

  const margin = parseMargin(opts.start ?? "top 88%");
  return inView(
    target,
    (el) => {
      void animate(el, keyframes as any, {
        duration: opts.duration ?? 0.8,
        ease: opts.ease ?? [0.22, 1, 0.36, 1],
        delay: opts.delay,
        delayChildren: opts.staggerEach ? stagger(opts.staggerEach) : undefined,
      });
    },
    { root: document, margin: margin as `${number}px` }
  );
}

export function initLandingMotion(): CleanupFn {
  const root = document.documentElement;
  const hdr = document.getElementById("hdr");
  const onScroll = () => {
    hdr?.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const cleanups: CleanupFn[] = [() => window.removeEventListener("scroll", onScroll)];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navIntro = getNavIntroTargets();

  if (reduce) {
    root.classList.remove("gs");
    clearNavIntroInlineStyles(navIntro.all, navIntro.blurLayer);
    const li = document.querySelector(".steps .line i") as HTMLElement | null;
    if (li) li.style.transform = "scaleX(1)";
    const progress = document.getElementById("progress");
    if (progress) progress.style.transform = "scaleX(1)";
    q(".hero-hide").forEach((el) => {
      el.style.visibility = "visible";
    });
    revealHeroCtaIntroImmediate();
    markHeroIntroComplete();
    return () => cleanups.forEach((fn) => fn());
  }

  const fine = window.matchMedia("(pointer: fine)").matches;
  let stopped = false;
  cleanups.push(() => {
    stopped = true;
  });

  const hx = document.querySelector(".hx") as HTMLElement | null;
  if (!hx) {
    root.classList.remove("gs");
    primeNavIntroFromState(navIntro.all, navIntro.blurLayer);
    void animate(
      [
        navIntro.blurLayer && [
          navIntro.blurLayer,
          { opacity: [0, 1] },
          { duration: NAV_INTRO_DURATION_S, ease: HERO_TEXT_INTRO_EASE },
        ],
        navIntro.brand && [
          navIntro.brand,
          {
            opacity: [0, 1],
            y: [NAV_INTRO_OFFSET_Y, 0],
            filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
          },
          { duration: NAV_INTRO_DURATION_S, ease: HERO_TEXT_INTRO_EASE, at: 0 },
        ],
        navIntro.links.length && [
          navIntro.links,
          {
            opacity: [0, 1],
            y: [NAV_INTRO_OFFSET_Y, 0],
            filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
          },
          {
            duration: NAV_INTRO_DURATION_S,
            delay: stagger(NAV_INTRO_STAGGER_S),
            ease: HERO_TEXT_INTRO_EASE,
            at: NAV_INTRO_STAGGER_S,
          },
        ],
        navIntro.cta && [
          navIntro.cta,
          {
            opacity: [0, 1],
            y: [NAV_INTRO_OFFSET_Y, 0],
            filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
          },
          {
            duration: NAV_INTRO_DURATION_S,
            ease: HERO_TEXT_INTRO_EASE,
            at: NAV_INTRO_STAGGER_S * 2,
          },
        ],
      ].filter(Boolean) as any
    ).then(() => {
      clearNavIntroInlineStyles(navIntro.all, navIntro.blurLayer);
    });
    markHeroIntroComplete();
    return () => cleanups.forEach((fn) => fn());
  }

  let heroWords: HTMLElement[] = [];
  q(":scope > span:not(.tiles)", hx).forEach((sp) => {
    heroWords = heroWords.concat(splitWords(sp));
  });
  const introTiles = q(".hx .tiles-deck", hx).concat(
    q(".hx .tiles:not(.tiles-deck) .tile", hx)
  );
  root.classList.remove("gs");
  q(".hero-hide").forEach((el) => {
    el.style.visibility = "visible";
  });
  primeHeroCtaIntroHidden();

  void (async () => {
    primeNavIntroFromState(navIntro.all, navIntro.blurLayer);

    heroWords.forEach((w) => {
      w.style.willChange = "transform, opacity, filter";
    });

    await animate([
      navIntro.blurLayer && [
        navIntro.blurLayer,
        { opacity: [0, 1] },
        { duration: NAV_INTRO_DURATION_S, ease: HERO_TEXT_INTRO_EASE },
      ],
      navIntro.brand && [
        navIntro.brand,
        {
          opacity: [0, 1],
          y: [NAV_INTRO_OFFSET_Y, 0],
          filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
        },
        { duration: NAV_INTRO_DURATION_S, ease: HERO_TEXT_INTRO_EASE, at: 0 },
      ],
      navIntro.links.length && [
        navIntro.links,
        {
          opacity: [0, 1],
          y: [NAV_INTRO_OFFSET_Y, 0],
          filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
        },
        {
          duration: NAV_INTRO_DURATION_S,
          delay: stagger(NAV_INTRO_STAGGER_S),
          ease: HERO_TEXT_INTRO_EASE,
          at: NAV_INTRO_STAGGER_S,
        },
      ],
      navIntro.cta && [
        navIntro.cta,
        {
          opacity: [0, 1],
          y: [NAV_INTRO_OFFSET_Y, 0],
          filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
        },
        {
          duration: NAV_INTRO_DURATION_S,
          ease: HERO_TEXT_INTRO_EASE,
          at: NAV_INTRO_STAGGER_S * 2,
        },
      ],
      // [".pill", { opacity: [0, 1], y: [16, 0], scale: [0.96, 1] }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] }],
      [
        heroWords,
        {
          y: ["115%", "0%"],
          opacity: [0, 1],
          filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
        },
        {
          duration: HERO_WORD_DURATION_S,
          delay: stagger(HERO_WORD_STAGGER_S),
          ease: HERO_TEXT_INTRO_EASE,
          at: 0,
        },
      ],
      [
        introTiles,
        { opacity: [0, 1], scale: [0.2, 1], y: [30, 0] },
        {
          duration: HERO_TILE_DURATION_S,
          delay: stagger(HERO_TILE_STAGGER_S),
          ease: HERO_TEXT_INTRO_EASE,
          at: HERO_TILE_AT,
        },
      ],
      [
        ".hero .sub",
        {
          opacity: [0, 1],
          y: [18, 0],
          filter: [HERO_TEXT_BLUR_IN, HERO_TEXT_BLUR_OUT],
        },
        { duration: HERO_SUB_DURATION_S, ease: HERO_TEXT_INTRO_EASE, at: HERO_SUB_AT },
      ],
    ].filter(Boolean) as any);

    heroWords.forEach((w) => {
      w.style.willChange = "";
      w.style.filter = "";
    });
    clearNavIntroInlineStyles(navIntro.all, navIntro.blurLayer);
    clearHeroTextFilters([".hero .sub"]);

    markHeroIntroComplete();

    await new Promise((r) => setTimeout(r, HERO_CTA_AFTER_SUB_DELAY_S * 1000));
    const { buttons: heroCtaBtns } = await waitForHeroCtaIntroReady();
    primeHeroCtaIntroHidden();
    await animateHeroCtaIntro(heroCtaBtns);

    const legacyStage = document.querySelector(".stage");
    if (legacyStage) {
      void animate([
        [".stage", { opacity: [0, 1], y: [80, 0] }, { duration: 1.1 }],
        [
          ".mascot-float",
          { opacity: [0, 1], y: [40, 0], scale: [0.6, 1], rotate: [-20, 0] },
          { duration: 0.9, ease: [0.34, 1.56, 0.64, 1], at: "-0.5" },
        ],
      ] as any);
      await runChatDemo();
    }
  })().catch((err) => {
    console.error("[landing-motion] hero intro failed", err);
    clearNavIntroInlineStyles(navIntro.all, navIntro.blurLayer);
    revealHeroCtaIntroImmediate();
    markHeroIntroComplete();
  });

  async function runChatDemo() {
    const msgs = q(".msg");
    if (!msgs.length) return;
    const typing = document.querySelector(".typing") as HTMLElement | null;
    const booked = document.querySelector(".booked") as HTMLElement | null;
    msgs.forEach((m) => {
      m.style.opacity = "0";
      m.style.transform = "translateY(12px) scale(0.92)";
    });
    if (booked) {
      booked.style.opacity = "0";
      booked.style.transform = "scale(0.6) rotate(-8deg) translateY(20px)";
    }
    for (const m of msgs) {
      const out = m.classList.contains("out");
      if (out && typing) {
        m.parentNode?.insertBefore(typing, m);
        typing.style.display = "flex";
        await animate(q("i", typing), { y: [0, -4], opacity: [0.4, 1] }, { duration: 0.2, repeat: 3, repeatType: "reverse" });
        typing.style.display = "none";
      } else {
        await new Promise((r) => setTimeout(r, 350));
      }
      m.style.transformOrigin = out ? "100% 100%" : "0% 100%";
      await animate(m, { opacity: 1, y: 0, scale: 1 }, { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] });
    }
    if (booked) {
      await animate(booked, { opacity: 1, scale: 1, rotate: -2, y: 0 }, { duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 });
      const okIcon = booked.querySelector(".ok svg, .ok [data-icon]");
      if (okIcon) {
        await animate(okIcon, { scale: [0, 1], rotate: [-90, 0] }, { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: -0.35 });
      }
      void animate(booked, { y: [0, -6] }, { duration: 2.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" });
    }
  }

  if (document.querySelector(".mascot-float")) {
    void animate(".mascot-float", { y: [0, -10] }, { duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 2 });
    void animate(".mascot-float", { rotate: [0, -2] }, { duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 2 });
  }

  const stage = document.querySelector(".stage");
  const app = document.querySelector(".app");
  if (stage && app) {
    cleanups.push(
      scroll(
        animate(app, { rotateX: [12, 0], scale: [0.95, 1] }, { ease: "linear" }),
        { target: stage, offset: ["start end", "start 0.25"] }
      )
    );
  }

  (function mascotIconLoop() {
    const body = document.querySelector(".as-body") as SVGElement | null;
    const look = document.querySelector(".as-look");
    const open = document.querySelector(".as-open");
    const happy = document.querySelector(".as-happy");
    const sleepy = document.querySelector(".as-sleepy");
    if (!body) return;

    const setEyes = (state: "open" | "happy" | "sleepy") => {
      if (open) (open as HTMLElement).style.opacity = state === "open" ? "1" : "0";
      if (happy) (happy as HTMLElement).style.opacity = state === "happy" ? "1" : "0";
      if (sleepy) (sleepy as HTMLElement).style.opacity = state === "sleepy" ? "1" : "0";
    };
    body.style.transformOrigin = "60px 64px";
    body.style.transform = "rotate(-8deg)";

    void (async () => {
      await new Promise((r) => setTimeout(r, 1200));
      while (!stopped) {
        await animate(body, { rotate: 0 }, { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] });
        setEyes("happy");
        await new Promise((r) => setTimeout(r, 350));
        setEyes("open");
        if (look) {
          await animate(look, { x: 3 }, { duration: 0.3 });
          await animate(look, { x: -3, y: 1 }, { duration: 0.35 });
          await animate(look, { x: 0, y: 0 }, { duration: 0.3 });
        }
        setEyes("happy");
        await new Promise((r) => setTimeout(r, 400));
        setEyes("open");
        if (look) await animate(look, { x: -2, y: -2 }, { duration: 0.3 });
        await animate(body, { rotate: 30, y: -2 }, { duration: 0.55 });
        if (look) await animate(look, { x: 2, y: -1 }, { duration: 0.3 });
        await animate(body, { rotate: 24 }, { duration: 0.4, ease: "easeInOut" });
        await animate(body, { rotate: 0, y: 0 }, { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] });
        if (look) await animate(look, { x: 0, y: 0 }, { duration: 0.3 });
        setEyes("sleepy");
        await new Promise((r) => setTimeout(r, 400));
        setEyes("open");
        await animate(body, { rotate: -8 }, { duration: 0.4 });
      }
    })();
  })();

  const hoverTiles = q(".tile", hx).filter((t) => !t.closest(".tiles-deck"));
  if (fine) {
    hoverTiles.forEach((t) => {
      const onEnter = () => {
        void animate(t, { y: "-0.12em", scale: 1.1, rotate: 0, zIndex: 5 }, { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] });
      };
      const onLeave = () => {
        const rot = getComputedStyle(t).getPropertyValue("--rot").trim();
        void animate(t, { y: "0em", scale: 1, rotate: rot, zIndex: "" }, { duration: 0.5, ease: [0.68, -0.2, 0.32, 1.2] });
      };
      t.addEventListener("mouseenter", onEnter);
      t.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        t.removeEventListener("mouseenter", onEnter);
        t.removeEventListener("mouseleave", onLeave);
      });
    });
  }

  const progress = document.getElementById("progress");
  if (progress) {
    cleanups.push(scroll(animate(progress, { scaleX: [0, 1] }, { ease: "linear" }), { offset: ["start start", "end end"] }));
  }

  q("section h2").forEach((h) => {
    const ws = splitWords(h);
    cleanups.push(
      revealOnScroll(ws, { y: ["115%", "0%"] }, { trigger: h, start: "top 85%", duration: 0.9, staggerEach: 0.045 })
    );
  });

  q(".label").forEach((l) => {
    cleanups.push(revealOnScroll(l, { opacity: [0, 1], x: [-16, 0] }, { trigger: l, start: "top 88%", duration: 0.6 }));
    const icon = l.querySelector("i");
    if (icon) {
      cleanups.push(revealOnScroll(icon, { scale: [0, 1] }, { trigger: l, start: "top 88%", duration: 0.5, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }));
    }
  });

  q("section .sub, .head .btn, .guide .copy .btn").forEach((el) => {
    cleanups.push(revealOnScroll(el, { opacity: [0, 1], y: [24, 0] }, { trigger: el, start: "top 88%", duration: 0.8 }));
  });

  const heroVideoFrame = document.querySelector(".hero-video__frame") as HTMLElement | null;
  if (heroVideoFrame) {
    heroVideoFrame.style.opacity = "0";
    heroVideoFrame.style.transform = "translateY(28px)";
    heroVideoFrame.style.filter = "blur(10px)";
    cleanups.push(
      revealOnScroll(
        heroVideoFrame,
        { opacity: [0, 1], y: [28, 0], filter: ["blur(10px)", "blur(0px)"] },
        { trigger: ".hero-video", start: "top 92%", duration: 0.85, ease: [0.22, 1, 0.36, 1] }
      )
    );
  }

  cleanups.push(revealOnScroll(".logos p", { opacity: [0, 1], y: [12, 0] }, { trigger: ".logos", start: "top 85%", duration: 0.6 }));
  cleanups.push(
    revealOnScroll(".logo-row span", { opacity: [0, 1], y: [24, 0], scale: [0.9, 1] }, { trigger: ".logo-row", start: "top 88%", duration: 0.6, staggerEach: 0.08 })
  );

  q(".cards .card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = `translateY(60px) rotate(${i % 2 ? 2 : -2}deg)`;
    cleanups.push(
      inView(card, () => {
        void animate(card, { opacity: 1, y: 0, rotate: 0 }, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
      }, { margin: "0px 0px -12% 0px" })
    );
  });

  q(".chan .card svg").forEach((ic) => {
    cleanups.push(
      revealOnScroll(ic, { scale: [0, 1], rotate: [-30, 0] }, { trigger: ic, start: "top 85%", duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] })
    );
  });

  q(".feat").forEach((f) => {
    f.style.opacity = "0";
    f.style.transform = "translateX(40px)";
    cleanups.push(
      inView(f, () => {
        void animate(f, { opacity: 1, x: 0 }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
        const ico = f.querySelector(".ico");
        if (ico) void animate(ico, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] });
      }, { margin: "0px 0px -10% 0px" })
    );
  });

  cleanups.push(revealOnScroll(".quote", { opacity: [0, 1], y: [40, 0] }, { trigger: ".quote", start: "top 88%", duration: 0.9 }));
  cleanups.push(revealOnScroll(".quote figcaption", { opacity: [0, 1], x: [20, 0] }, { trigger: ".quote", start: "top 88%", duration: 0.7, delay: 0.3 }));

  cleanups.push(
    revealOnScroll(".stat", { opacity: [0, 1], y: [40, 0], scale: [0.95, 1] }, { trigger: ".stats", start: "top 85%", duration: 0.8, staggerEach: 0.12 })
  );
  cleanups.push(
    revealOnScroll(".clogos span", { opacity: [0, 1], y: [16, 0] }, { trigger: ".clogos", start: "top 90%", duration: 0.5, staggerEach: 0.07 })
  );

  const manifest = document.querySelector(".manifest");
  const manifestWords = q(".manifest .wi");
  if (manifest && manifestWords.length) {
    manifestWords.forEach((w) => {
      w.style.opacity = "0.15";
    });
    cleanups.push(
      scroll(
        animate(manifestWords, { opacity: [0.15, 1] }, { ease: "linear", delay: stagger(0.1) }),
        { target: manifest, offset: ["start 0.75", "end 0.45"] }
      )
    );
  } else if (manifest) {
    const h2 = manifest.querySelector("h2");
    if (h2) {
      const ws = splitWords(h2);
      ws.forEach((w) => {
        w.style.opacity = "0.15";
      });
      cleanups.push(
        scroll(
          animate(ws, { opacity: [0.15, 1] }, { ease: "linear", delay: stagger(0.1) }),
          { target: manifest, offset: ["start 0.75", "end 0.45"] }
        )
      );
    }
  }

  const stepsSection = document.getElementById("steps");
  const lineInner = document.querySelector(".steps .line i") as HTMLElement | null;
  if (stepsSection && lineInner) {
    cleanups.push(
      scroll(animate(lineInner, { scaleX: [0, 1] }, { ease: "linear" }), { target: stepsSection, offset: ["start 0.75", "center 0.45"] })
    );
  }

  q(".step").forEach((st, i) => {
    cleanups.push(
      inView(
        st,
        () => {
          void animate([
            [st, { opacity: [0, 1], y: [40, 0] }, { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }],
            [st.querySelector(".num")!, { scale: [0, 1], rotate: [-90, 0] }, { duration: 0.6, ease: [0.34, 1.56, 0.64, 1], at: "-0.5" }],
            [q(".mini .r", st), { opacity: [0, 1], x: [-20, 0] }, { duration: 0.45, delay: stagger(0.1), at: "-0.2" }],
            [q(".mini .r .tag", st), { scale: [0.5, 1], opacity: [0, 1] }, { duration: 0.4, delay: stagger(0.1), at: "-0.3" }],
            [q(".cal i", st), { scale: [0, 1] }, { duration: 0.35, delay: stagger(0.03), at: "-0.4" }],
          ] as any);
        },
        { margin: "0px 0px -18% 0px" }
      )
    );
  });

  cleanups.push(revealOnScroll(".col.no", { opacity: [0, 1], x: [-50, 0] }, { trigger: ".compare", start: "top 85%", duration: 0.9 }));
  cleanups.push(revealOnScroll(".col.yes", { opacity: [0, 1], x: [50, 0] }, { trigger: ".compare", start: "top 85%", duration: 0.9 }));

  q(".col").forEach((c) => {
    cleanups.push(
      revealOnScroll(q(".it", c), { opacity: [0, 1], y: [14, 0] }, { trigger: c, start: "top 85%", duration: 0.5, staggerEach: 0.1, delay: 0.35 })
    );
    cleanups.push(
      revealOnScroll(q(".it svg", c), { scale: [0, 1], rotate: [-60, 0] }, { trigger: c, start: "top 85%", duration: 0.5, staggerEach: 0.1, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] })
    );
  });

  cleanups.push(
    revealOnScroll(".faq-item", { opacity: [0, 1], y: [20, 0] }, { trigger: ".faq", start: "top 80%", duration: 0.6, staggerEach: 0.08 })
  );

  const cta = document.querySelector(".cta");
  if (cta) {
    cleanups.push(
      scroll(
        animate(cta, { scale: [0.9, 1], y: [60, 0], borderRadius: ["80px", "36px"] }),
        { target: cta, offset: ["start 0.95", "start 0.55"] }
      )
    );
    cleanups.push(
      revealOnScroll(".cta-mascot-3d", { opacity: [0, 1], scale: [0.4, 1], rotate: [-30, 0], y: [40, 0] }, { trigger: ".cta", start: "top 70%", duration: 1, ease: [0.34, 1.56, 0.64, 1] })
    );
    cleanups.push(revealOnScroll(".cta .btn", { opacity: [0, 1], y: [16, 0] }, { trigger: ".cta", start: "top 70%", duration: 0.6, staggerEach: 0.1 }));
  }

  if (fine) {
    q(".btn:not(.btn-roll)").forEach((b) => {
      let tx = 0;
      let ty = 0;
      let raf = 0;
      const onMove = (e: MouseEvent) => {
        const r = b.getBoundingClientRect();
        const targetX = (e.clientX - r.left - r.width / 2) * 0.25;
        const targetY = (e.clientY - r.top - r.height / 2) * 0.35;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          tx += (targetX - tx) * 0.2;
          ty += (targetY - ty) * 0.2;
          b.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      };
      const onLeave = () => {
        void animate(b, { x: 0, y: 0 }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] });
        tx = ty = 0;
      };
      b.addEventListener("mousemove", onMove);
      b.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        b.removeEventListener("mousemove", onMove);
        b.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(raf);
      });
    });

    q(".card, .col").forEach((c) => {
      c.style.perspective = "900px";
      const onMove = (e: MouseEvent) => {
        const r = c.getBoundingClientRect();
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        const rx = -((e.clientY - r.top) / r.height - 0.5) * 6;
        c.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      };
      const onLeave = () => {
        void animate(c, { rotateX: 0, rotateY: 0 }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
      };
      c.addEventListener("mousemove", onMove);
      c.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        c.removeEventListener("mousemove", onMove);
        c.removeEventListener("mouseleave", onLeave);
      });
    });

    q(".num").forEach((n) => {
      const onEnter = () => {
        void animate(n, { rotate: 360 }, { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] });
      };
      n.addEventListener("mouseenter", onEnter);
      cleanups.push(() => n.removeEventListener("mouseenter", onEnter));
    });

    const mf = document.querySelector(".mascot-float") as HTMLElement | null;
    if (mf) {
      let mx = 0;
      const onMouse = (e: MouseEvent) => {
        const target = (e.clientX / window.innerWidth - 0.5) * 18;
        mx += (target - mx) * 0.15;
        mf.style.transform = `translateX(${mx}px)`;
      };
      window.addEventListener("mousemove", onMouse);
      cleanups.push(() => window.removeEventListener("mousemove", onMouse));
    }
  }

  q(".logo-row span").forEach((sp) => {
    const onEnter = () => void animate(sp, { y: -4 }, { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] });
    const onLeave = () => void animate(sp, { y: 0 }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] });
    sp.addEventListener("mouseenter", onEnter);
    sp.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      sp.removeEventListener("mouseenter", onEnter);
      sp.removeEventListener("mouseleave", onLeave);
    });
  });

  return () => {
    stopped = true;
    cleanups.forEach((fn) => fn());
  };
}
