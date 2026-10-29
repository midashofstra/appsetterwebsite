import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FaceTarget = {
  el: Element;
  intensity: number;
  setX: gsap.QuickToFunc;
  setY: gsap.QuickToFunc;
};

const QUICK = { duration: 0.3, ease: "power2.out" };

export function initFaceFollowCursor(section: Element, heroScrollTrigger: Element): () => void {
  const baseIntensity = parseFloat(section.getAttribute("data-face") ?? "") || 30;

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
  const bodySetRotate = body ? gsap.quickTo(body, "rotation", QUICK) : null;
  const bodySetX = body ? gsap.quickTo(body, "xPercent", QUICK) : null;
  const bodySetY = body ? gsap.quickTo(body, "yPercent", QUICK) : null;
  const bodyTiltDeg = 4;
  const bodyShiftPct = 4;

  let isTracking = false;
  let isRafRunning = false;
  const lastMouse = { x: 0, y: 0 };

  const resetAll = () => {
    targets.forEach((t) => {
      t.setX(0);
      t.setY(0);
    });
    bodySetRotate?.(0);
    bodySetX?.(0);
    bodySetY?.(0);
  };

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

    targets.forEach((target) => {
      target.setX(nx * target.intensity);
      target.setY(ny * target.intensity);
    });

    bodySetRotate?.(nx * bodyTiltDeg);
    bodySetX?.(nx * bodyShiftPct);
    bodySetY?.(ny * bodyShiftPct);

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
    resetAll();
  };

  const st = ScrollTrigger.create({
    trigger: heroScrollTrigger,
    start: "top bottom",
    end: "bottom top",
    onEnter: startTracking,
    onEnterBack: startTracking,
    onLeave: stopTracking,
    onLeaveBack: stopTracking,
  });

  return () => {
    stopTracking();
    st.kill();
  };
}
