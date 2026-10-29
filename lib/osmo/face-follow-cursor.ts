import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FaceTarget = {
  el: Element;
  intensity: number;
  setX: gsap.QuickToFunc;
  setY: gsap.QuickToFunc;
};

type MascotFaceMotion = {
  targets: FaceTarget[];
  body: Element | null;
  bodySetRotate: gsap.QuickToFunc | null;
  bodySetX: gsap.QuickToFunc | null;
  bodySetY: gsap.QuickToFunc | null;
  bodyTiltDeg: number;
  bodyShiftPct: number;
  applyNormalized: (nx: number, ny: number) => void;
  resetAll: () => void;
};

const QUICK = { duration: 0.3, ease: "power2.out" };
const IDLE_MOVE = { ease: "power2.inOut" as const };
/** Mascot SVG viewBox is 0 0 444 444 — pivot body tilt around tile centre, not path bbox. */
const MASCOT_VIEWBOX_CX = 222;
const MASCOT_VIEWBOX_CY = 222;

function setSvgGroupPivot(el: Element, mode: "viewBox" | "fillBox") {
  const node = el as SVGGraphicsElement;
  node.style.transformBox = mode === "viewBox" ? "view-box" : "fill-box";
  node.style.transformOrigin = "50% 50%";
  gsap.set(el, {
    transformOrigin: "50% 50%",
    svgOrigin:
      mode === "viewBox"
        ? `${MASCOT_VIEWBOX_CX} ${MASCOT_VIEWBOX_CY}`
        : "50% 50%",
  });
}

function createMascotFaceMotion(section: Element): MascotFaceMotion {
  const baseIntensity = parseFloat(section.getAttribute("data-face") ?? "") || 30;
  const bodyTiltDeg = 4;
  const bodyShiftPct = 4;

  const targetEls = section.querySelectorAll("[data-face-target]");
  const targets: FaceTarget[] = Array.from(targetEls).map((el) => {
    const factor = parseFloat(el.getAttribute("data-face-target") ?? "") || 1;
    return {
      el,
      intensity: baseIntensity * factor,
      setX: gsap.quickTo(el, "xPercent", QUICK),
      setY: gsap.quickTo(el, "yPercent", QUICK),
    };
  });

  const body = section.querySelector(".hero-mascot-body");
  if (body) setSvgGroupPivot(body, "viewBox");
  targets.forEach((t) => setSvgGroupPivot(t.el, "fillBox"));

  const bodySetRotate = body ? gsap.quickTo(body, "rotation", QUICK) : null;
  const bodySetX = body ? gsap.quickTo(body, "xPercent", QUICK) : null;
  const bodySetY = body ? gsap.quickTo(body, "yPercent", QUICK) : null;

  const applyNormalized = (nx: number, ny: number) => {
    targets.forEach((target) => {
      target.setX(nx * target.intensity);
      target.setY(ny * target.intensity);
    });
    bodySetRotate?.(nx * bodyTiltDeg);
    bodySetX?.(nx * bodyShiftPct);
    bodySetY?.(ny * bodyShiftPct);
  };

  const resetAll = () => {
    targets.forEach((t) => {
      t.setX(0);
      t.setY(0);
    });
    bodySetRotate?.(0);
    bodySetX?.(0);
    bodySetY?.(0);
  };

  return {
    targets,
    body,
    bodySetRotate,
    bodySetX,
    bodySetY,
    bodyTiltDeg,
    bodyShiftPct,
    applyNormalized,
    resetAll,
  };
}

function heroScrollBindings(
  heroScrollTrigger: Element,
  onEnter: () => void,
  onLeave: () => void
) {
  return ScrollTrigger.create({
    trigger: heroScrollTrigger,
    start: "top bottom",
    end: "bottom top",
    onEnter,
    onEnterBack: onEnter,
    onLeave,
    onLeaveBack: onLeave,
  });
}

export function initFaceFollowCursor(section: Element, heroScrollTrigger: Element): () => void {
  const motion = createMascotFaceMotion(section);

  let isTracking = false;
  let isRafRunning = false;
  const lastMouse = { x: 0, y: 0 };

  const update = () => {
    const mx = lastMouse.x;
    const my = lastMouse.y;
    const r = section.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rx = r.width / 2 || 1;
    const ry = r.height / 2 || 1;

    let nx = (mx - cx) / rx;
    let ny = (my - cy) / ry;
    const mag = Math.hypot(nx, ny);
    if (mag > 1) {
      nx /= mag;
      ny /= mag;
    }

    motion.applyNormalized(nx, ny);
    isRafRunning = false;
  };

  const onMouseMove = (e: MouseEvent) => {
    lastMouse.x = e.clientX;
    lastMouse.y = e.clientY;
    if (!isRafRunning) {
      requestAnimationFrame(update);
      isRafRunning = true;
    }
  };

  const startTracking = () => {
    if (isTracking) return;
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    isTracking = true;
  };

  const stopTracking = () => {
    if (!isTracking) return;
    window.removeEventListener("mousemove", onMouseMove);
    isTracking = false;
    motion.resetAll();
  };

  const st = heroScrollBindings(heroScrollTrigger, startTracking, stopTracking);

  return () => {
    stopTracking();
    st.kill();
  };
}

/** Touch / hover:none: idle glance loop while hero is in view. */
export function initFaceIdleGlance(section: Element, heroScrollTrigger: Element): () => void {
  const { targets, body, bodyTiltDeg, bodyShiftPct, resetAll } = createMascotFaceMotion(section);

  const state = { nx: 0, ny: 0 };

  const syncIdlePose = () => {
    const { nx, ny } = state;
    targets.forEach((target) => {
      gsap.set(target.el, {
        xPercent: nx * target.intensity,
        yPercent: ny * target.intensity,
      });
    });
    if (body) {
      gsap.set(body, {
        rotation: nx * bodyTiltDeg,
        xPercent: nx * bodyShiftPct,
        yPercent: ny * bodyShiftPct,
      });
    }
  };

  const glanceSteps: { nx: number; ny: number; move: number; hold: number }[] = [
    { nx: 0, ny: 0, move: 0.45, hold: 1.4 },
    { nx: -0.92, ny: 0.06, move: 0.55, hold: 2.1 },
    { nx: -0.75, ny: -0.35, move: 0.5, hold: 1.6 },
    { nx: 0.58, ny: -0.62, move: 0.6, hold: 2.4 },
    { nx: 0.72, ny: 0.38, move: 0.52, hold: 1.8 },
    { nx: 0, ny: 0, move: 0.65, hold: 1.25 },
  ];

  let idleTimeline: gsap.core.Timeline | null = null;

  const buildTimeline = () => {
    const tl = gsap.timeline({ repeat: -1, defaults: IDLE_MOVE });
    glanceSteps.forEach((step) => {
      tl.to(state, {
        nx: step.nx,
        ny: step.ny,
        duration: step.move,
        onUpdate: syncIdlePose,
      });
      tl.to({}, { duration: step.hold });
    });
    return tl;
  };

  const startIdle = () => {
    if (idleTimeline) return;
    gsap.set(state, { nx: 0, ny: 0 });
    syncIdlePose();
    idleTimeline = buildTimeline();
  };

  const stopIdle = () => {
    idleTimeline?.kill();
    idleTimeline = null;
    gsap.killTweensOf(state);
    gsap.killTweensOf(targets.map((t) => t.el));
    if (body) gsap.killTweensOf(body);
    resetAll();
  };

  const st = heroScrollBindings(heroScrollTrigger, startIdle, stopIdle);

  return () => {
    stopIdle();
    st.kill();
  };
}

export function prefersMascotCursorFollow(): boolean {
  if (typeof window === "undefined") return true;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const hoverNone = window.matchMedia("(hover: none)").matches;
  return fine && !hoverNone;
}
