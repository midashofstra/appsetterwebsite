import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const defaultMode = "cover" as const;
const defaultScrollStart = { cover: "bottom bottom", reveal: "top bottom" } as const;
const defaultScrollEnd = { cover: "bottom top", reveal: "top top" } as const;
const defaultScrub = 0.3;
const defaultCurve = 12;
const viewBox = 100;
const svgNamespace = "http://www.w3.org/2000/svg";

type ArcMode = "cover" | "reveal";

type ArcInstance = {
  wrapper: HTMLElement;
  shape: SVGSVGElement;
  path: SVGPathElement;
  section: HTMLElement;
  mode: ArcMode;
  depth: number;
  tween: gsap.core.Tween;
};

function getMode(wrapper: HTMLElement): ArcMode {
  return wrapper.dataset.mode === "reveal" ? "reveal" : defaultMode;
}

function getCurve(wrapper: HTMLElement): number {
  const value = parseFloat(wrapper.dataset.curve ?? "");
  return Number.isFinite(value) ? value : defaultCurve;
}

function getScrollStart(wrapper: HTMLElement, mode: ArcMode): string {
  return wrapper.dataset.scrollStart || defaultScrollStart[mode];
}

function getScrollEnd(wrapper: HTMLElement, mode: ArcMode): string {
  return wrapper.dataset.scrollEnd || defaultScrollEnd[mode];
}

function resolveTriggerSection(wrapper: HTMLElement): HTMLElement {
  const selector = wrapper.dataset.scrollTrigger?.trim();
  if (selector) {
    const el = document.querySelector(selector);
    if (el instanceof HTMLElement) return el;
  }
  const closest = wrapper.closest("section");
  if (closest instanceof HTMLElement) return closest;
  const parent = wrapper.parentElement;
  if (parent instanceof HTMLElement) return parent;
  return wrapper;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildShape(wrapper: HTMLElement): { shape: SVGSVGElement; path: SVGPathElement } {
  const shape = document.createElementNS(svgNamespace, "svg");
  shape.setAttribute("data-arc-scroll-shape", "");
  shape.setAttribute("viewBox", `0 0 ${viewBox} ${viewBox}`);
  shape.setAttribute("preserveAspectRatio", "none");
  shape.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(svgNamespace, "path");
  path.setAttribute("data-arc-scroll-path", "");
  shape.appendChild(path);
  wrapper.appendChild(shape);
  return { shape, path };
}

function measureSection(instance: ArcInstance) {
  const rect = instance.section.getBoundingClientRect();
  const aspect = rect.height ? rect.width / rect.height : 1;
  instance.depth = getCurve(instance.wrapper) * aspect;
}

function drawArc(instance: ArcInstance, progress: number) {
  const fill = instance.mode === "cover" ? progress : 1 - progress;
  const curve = instance.depth * Math.sin(fill * Math.PI);
  if (instance.mode === "cover") {
    const edge = round(viewBox - viewBox * fill);
    const control = round(edge - curve * 2);
    instance.path.setAttribute(
      "d",
      `M0 ${viewBox} L0 ${edge} Q${viewBox / 2} ${control} ${viewBox} ${edge} L${viewBox} ${viewBox} Z`
    );
    return;
  }
  const edge = round(viewBox * fill);
  const control = round(edge + curve * 2);
  instance.path.setAttribute(
    "d",
    `M0 0 L0 ${edge} Q${viewBox / 2} ${control} ${viewBox} ${edge} L${viewBox} 0 Z`
  );
}

function createAnimation(instance: ArcInstance): gsap.core.Tween {
  const state = { progress: 0 };
  return gsap.to(state, {
    progress: 1,
    ease: "none",
    onUpdate: () => drawArc(instance, state.progress),
    scrollTrigger: {
      trigger: instance.section,
      start: getScrollStart(instance.wrapper, instance.mode),
      end: getScrollEnd(instance.wrapper, instance.mode),
      scrub: defaultScrub,
      invalidateOnRefresh: true,
      onRefresh: () => measureSection(instance),
    },
  });
}

function setupInstance(wrapper: HTMLElement): ArcInstance {
  const { shape, path } = buildShape(wrapper);
  const instance: ArcInstance = {
    wrapper,
    shape,
    path,
    section: resolveTriggerSection(wrapper),
    mode: getMode(wrapper),
    depth: 0,
    tween: null as unknown as gsap.core.Tween,
  };
  measureSection(instance);
  drawArc(instance, 0);
  instance.tween = createAnimation(instance);
  return instance;
}

function destroyInstance(instance: ArcInstance) {
  instance.tween.scrollTrigger?.kill();
  instance.tween.kill();
  instance.shape.remove();
}

/** Osmo Arc Scroll Transition — single wrapper; no-op under prefers-reduced-motion. */
export function mountArcScrollTransition(wrapper: HTMLElement): () => void {
  if (!wrapper.hasAttribute("data-arc-scroll-transition")) {
    wrapper.setAttribute("data-arc-scroll-transition", "");
  }

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const instance = setupInstance(wrapper);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => destroyInstance(instance);
  });

  const onRefresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", onRefresh);
  window.addEventListener("orientationchange", onRefresh);

  return () => {
    window.removeEventListener("load", onRefresh);
    window.removeEventListener("orientationchange", onRefresh);
    mm.revert();
  };
}
