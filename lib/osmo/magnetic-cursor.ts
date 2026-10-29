import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

type MagneticRoot = {
  cursor: HTMLElement;
  cursorBg: HTMLElement;
};

let root: MagneticRoot | null = null;
let xTo: gsap.QuickToFunc | null = null;
let yTo: gsap.QuickToFunc | null = null;
let moveListener: ((e: MouseEvent) => void) | null = null;

function variantFromTarget(target: Element): string {
  const cls = target.className;
  if (cls.includes("btn-ghost")) return "ghost";
  if (cls.includes("btn-ink")) return "ink";
  return "main";
}

function applyFillVariant(el: HTMLElement, variant: string) {
  el.classList.remove("magnetic-cursor-bg--dot");
  el.classList.add("magnetic-cursor-bg--fill", `magnetic-cursor-bg--${variant}`);
}

function applyDotVariant(el: HTMLElement) {
  el.classList.remove("magnetic-cursor-bg--fill", "magnetic-cursor-bg--main", "magnetic-cursor-bg--ghost", "magnetic-cursor-bg--ink");
  el.classList.add("magnetic-cursor-bg--dot");
}

export function registerMagneticCursorRoot(cursor: HTMLElement, cursorBg: HTMLElement): () => void {
  root = { cursor, cursorBg };
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3.out" });
  yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3.out" });

  moveListener = (e: MouseEvent) => {
    xTo?.(e.clientX);
    yTo?.(e.clientY);
  };
  window.addEventListener("mousemove", moveListener, { passive: true });

  return () => {
    if (moveListener) window.removeEventListener("mousemove", moveListener);
    moveListener = null;
    xTo = null;
    yTo = null;
    root = null;
  };
}

export function bindMagneticCursorTarget(target: HTMLElement): () => void {
  if (target.dataset.magneticBound === "true") return () => {};
  const bgHolder = target.querySelector("[data-magnetic-cursor-bg]");
  if (!bgHolder || !root) return () => {};

  target.dataset.magneticBound = "true";

  const onEnter = () => {
    const { cursorBg } = root!;
    const variant = variantFromTarget(target);
    const state = Flip.getState(cursorBg);
    bgHolder.appendChild(cursorBg);
    applyFillVariant(cursorBg, variant);
    Flip.from(state, { ease: "power3.out", duration: 0.35 });
  };

  const onLeave = () => {
    const { cursor, cursorBg } = root!;
    const state = Flip.getState(cursorBg, { props: "opacity" });
    cursor.appendChild(cursorBg);
    applyDotVariant(cursorBg);
    Flip.from(state, { ease: "power4.out", duration: 0.5 });
  };

  target.addEventListener("mouseenter", onEnter);
  target.addEventListener("mouseleave", onLeave);

  return () => {
    target.removeEventListener("mouseenter", onEnter);
    target.removeEventListener("mouseleave", onLeave);
    delete target.dataset.magneticBound;
  };
}
