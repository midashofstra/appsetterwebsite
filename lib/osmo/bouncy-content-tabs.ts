import gsap from "gsap";

const CONFIG = {
  travel: 0.35,
  settle: 0.25,
  squashDown: 0.15,
  squashBack: 0.45,
  overshoot: 16,
  cardSquash: 0.2,
  cardInflate: 0.45,
};

type Rect = { left: number; right: number; top: number; height: number };

export function initBouncyContentTabs(root: HTMLElement): () => void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nav = root.querySelector("[data-bouncy-tabs-nav]") as HTMLElement | null;
  const indicator = root.querySelector("[data-bouncy-tabs-indicator]") as HTMLElement | null;
  const ghost = root.querySelector("[data-bouncy-tabs-ghost]") as HTMLElement | null;
  const buttons = nav ? (Array.from(nav.querySelectorAll("[data-bouncy-tabs-button]")) as HTMLElement[]) : [];
  const card = root.querySelector("[data-bouncy-tabs-card]") as HTMLElement | null;
  const panelsWrap = root.querySelector("[data-bouncy-tabs-panels]") as HTMLElement | null;
  const panels = panelsWrap
    ? (Array.from(panelsWrap.querySelectorAll("[data-bouncy-tabs-panel]")) as HTMLElement[])
    : [];

  if (!nav || !indicator || buttons.length < 2) {
    return () => {};
  }

  const navEl = nav;
  const indicatorEl = indicator;

  const hasCard = Boolean(card && panelsWrap && panels.length);
  const instanceId = root.dataset.bouncyTabsInstance ?? "1";
  const cleanups: (() => void)[] = [];

  buttons.forEach((button, i) => {
    const panel = panels[i];
    if (!panel) return;
    if (!button.id) button.id = `bouncy-tabs-${instanceId}-tab-${i + 1}`;
    if (!panel.id) panel.id = `bouncy-tabs-${instanceId}-panel-${i + 1}`;
    button.setAttribute("aria-controls", panel.id);
    panel.setAttribute("aria-labelledby", button.id);
    button.setAttribute("role", "tab");
    panel.setAttribute("role", "tabpanel");
  });

  let activeIndex = Math.max(
    0,
    buttons.findIndex((b) => b.hasAttribute("data-active"))
  );
  const pos = { left: 0, right: 0 };
  let ghostVisible = false;

  const dur = (d: number) => (reduceMotion.matches ? 0 : d);

  function syncButtonState() {
    buttons.forEach((b, i) => {
      b.toggleAttribute("data-active", i === activeIndex);
      b.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      b.tabIndex = i === activeIndex ? 0 : -1;
    });
  }

  function rectFor(button: HTMLElement): Rect {
    return {
      left: button.offsetLeft,
      right: button.offsetLeft + button.offsetWidth,
      top: button.offsetTop,
      height: button.offsetHeight,
    };
  }

  function render() {
    gsap.set(indicatorEl, { x: pos.left, width: pos.right - pos.left });
  }

  function place(index: number) {
    const target = rectFor(buttons[index]);
    pos.left = target.left;
    pos.right = target.right;
    gsap.killTweensOf(pos);
    gsap.killTweensOf(indicatorEl);
    gsap.set(indicatorEl, { scaleY: 1, y: target.top, height: target.height });
    render();
  }

  function setPanelsHeight() {
    if (hasCard && panelsWrap) {
      gsap.set(panelsWrap, { height: panels[activeIndex].offsetHeight });
    }
  }

  function swapPanelsInstant() {
    if (!hasCard) return;
    panels.forEach((p, i) => {
      gsap.killTweensOf(p);
      gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0, x: 0 });
      p.toggleAttribute("data-active", i === activeIndex);
    });
    if (card) gsap.set(card, { scaleX: 1, scaleY: 1, x: 0 });
    setPanelsHeight();
  }

  function transitionCard(prevIndex: number, movingRight: boolean) {
    if (!hasCard || !card || !panelsWrap) return;
    const direction = movingRight ? 1 : -1;
    const incoming = panels[activeIndex];
    const outgoing = panels[prevIndex];
    if (!incoming || !outgoing) return;

    panels.forEach((p) => {
      if (p !== incoming && p !== outgoing) {
        gsap.killTweensOf(p);
        gsap.set(p, { autoAlpha: 0, x: 0 });
        p.removeAttribute("data-active");
      }
    });
    incoming.setAttribute("data-active", "");
    outgoing.removeAttribute("data-active");

    gsap.killTweensOf([card, panelsWrap, incoming, outgoing]);
    gsap.set(card, { transformOrigin: "50% 50%" });
    const targetHeight = incoming.offsetHeight;
    gsap
      .timeline()
      .to(
        card,
        { scaleX: 0.96, scaleY: 1.02, x: direction * 10, duration: CONFIG.cardSquash, ease: "power2.out" },
        0
      )
      .to(outgoing, { x: direction * -35, autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0)
      .to(panelsWrap, { height: targetHeight, duration: 0.3, ease: "power2.inOut" }, 0.1)
      .fromTo(
        incoming,
        { x: direction * 35, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
        CONFIG.cardSquash
      )
      .to(
        card,
        { scaleX: 1, scaleY: 1, x: 0, duration: CONFIG.cardInflate, ease: "back.out(2)" },
        CONFIG.cardSquash
      )
      .set(outgoing, { x: 0 });
  }

  function goTo(index: number) {
    if (index === activeIndex) return;
    const prevIndex = activeIndex;
    const movingRight = index > activeIndex;
    activeIndex = index;
    syncButtonState();

    if (reduceMotion.matches) {
      place(index);
      swapPanelsInstant();
      scrollActiveTabIntoView(buttons[index]);
      return;
    }

    transitionCard(prevIndex, movingRight);
    scrollActiveTabIntoView(buttons[index]);
    const target = rectFor(buttons[index]);
    gsap.killTweensOf(pos);
    gsap.killTweensOf(indicatorEl);
    const hDir =
      target.left === pos.left ? (movingRight ? 1 : -1) : target.left > pos.left ? 1 : -1;
    const distance = Math.abs(target.left - pos.left);
    const maxOvershoot = Math.max(6, CONFIG.overshoot);
    let overshoot = gsap.utils.clamp(6, maxOvershoot, distance * 0.08) * hDir;
    if (hDir > 0) overshoot = Math.min(overshoot, navEl.clientWidth - target.right);
    else overshoot = Math.max(overshoot, -target.left);

    gsap.set(indicatorEl, { transformOrigin: "50% 50%" });
    gsap.to(indicatorEl, { y: target.top, height: target.height, duration: CONFIG.travel, ease: "power3.out" });
    gsap
      .timeline()
      .to(pos, {
        left: target.left + overshoot,
        right: target.right + overshoot,
        duration: CONFIG.travel,
        ease: "power3.out",
        onUpdate: render,
      })
      .to(pos, {
        left: target.left,
        right: target.right,
        duration: CONFIG.settle,
        ease: "power2.inOut",
        onUpdate: render,
      });
    gsap
      .timeline()
      .to(indicatorEl, { scaleY: 0.78, duration: CONFIG.squashDown, ease: "power2.out" })
      .to(indicatorEl, { scaleY: 1, duration: CONFIG.squashBack, ease: "back.out(2.5)" });
  }

  function moveGhost(button: HTMLElement) {
    if (!ghost) return;
    const target = rectFor(button);
    if (!ghostVisible) {
      ghostVisible = true;
      gsap.killTweensOf(ghost);
      gsap.set(ghost, {
        x: target.left,
        y: target.top,
        width: target.right - target.left,
        height: target.height,
      });
      gsap.to(ghost, { autoAlpha: 1, duration: dur(0.25), ease: "power2.out" });
    } else {
      gsap.to(ghost, {
        x: target.left,
        y: target.top,
        width: target.right - target.left,
        height: target.height,
        autoAlpha: 1,
        duration: dur(0.3),
        ease: "power3.out",
      });
    }
  }

  function hideGhost() {
    if (!ghost) return;
    ghostVisible = false;
    gsap.to(ghost, { autoAlpha: 0, duration: dur(0.2), ease: "power1.out" });
  }

  function refreshLayout() {
    const rows = new Set(buttons.map((b) => b.offsetTop));
    navEl.toggleAttribute("data-wrapped", rows.size > 1);
    place(activeIndex);
    setPanelsHeight();
    root.classList.add("bouncy-tabs--ready");
  }

  const onKeyDown = (event: KeyboardEvent) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = Math.min(buttons.length - 1, activeIndex + 1);
    if (event.key === "ArrowLeft") next = Math.max(0, activeIndex - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (next === null) return;
    event.preventDefault();
    if (next !== activeIndex) {
      goTo(next);
      buttons[next].focus({ preventScroll: true });
      scrollActiveTabIntoView(buttons[next]);
    }
  };

  function scrollActiveTabIntoView(button: HTMLElement) {
    if (!navEl.classList.contains("bouncy-tabs__nav--scroll")) return;
    button.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  }

  buttons.forEach((button, index) => {
    const onClick = () => goTo(index);
    const onEnter = () => moveGhost(button);
    button.addEventListener("click", onClick);
    button.addEventListener("mouseenter", onEnter);
    cleanups.push(() => {
      button.removeEventListener("click", onClick);
      button.removeEventListener("mouseenter", onEnter);
    });
  });

  navEl.addEventListener("mouseleave", hideGhost);
  navEl.addEventListener("keydown", onKeyDown);
  cleanups.push(() => {
    navEl.removeEventListener("mouseleave", hideGhost);
    navEl.removeEventListener("keydown", onKeyDown);
  });

  const onResize = () => refreshLayout();
  window.addEventListener("resize", onResize);
  cleanups.push(() => window.removeEventListener("resize", onResize));

  const onMotionChange = () => {
    if (reduceMotion.matches) swapPanelsInstant();
    refreshLayout();
  };
  reduceMotion.addEventListener("change", onMotionChange);
  cleanups.push(() => reduceMotion.removeEventListener("change", onMotionChange));

  if (ghost) gsap.set(ghost, { autoAlpha: 0 });
  panels.forEach((p, i) => gsap.set(p, { autoAlpha: i === activeIndex ? 1 : 0 }));
  syncButtonState();

  if (document.fonts?.ready) {
    void document.fonts.ready.then(refreshLayout);
  } else {
    refreshLayout();
  }

  return () => {
    cleanups.forEach((fn) => fn());
    gsap.killTweensOf([indicatorEl, ghost, card, panelsWrap, ...panels, pos]);
  };
}
