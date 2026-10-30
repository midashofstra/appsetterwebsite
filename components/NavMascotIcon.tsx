"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  MASCOT_FACE_BASE_INTENSITY,
  MascotInlineSvg,
} from "@/components/mascot/MascotInlineSvg";
import {
  initFaceFollowCursorGlobal,
  initFaceIdleGlanceGlobal,
  mascotMotionScaleVsHero,
  prefersMascotCursorFollow,
} from "@/lib/osmo/face-follow-cursor";

/** Header brand icon (38×38): same face-follow as hero, global pointer + scaled motion. */
export function NavMascotIcon() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const section = rootRef.current;
    if (!section) return undefined;

    let cleanupMotion: (() => void) | undefined;

    const remountMotion = () => {
      cleanupMotion?.();
      section.setAttribute("data-motion-scale", String(mascotMotionScaleVsHero(section)));
      cleanupMotion = prefersMascotCursorFollow()
        ? initFaceFollowCursorGlobal(section)
        : initFaceIdleGlanceGlobal(section);
    };

    remountMotion();
    window.addEventListener("resize", remountMotion);
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(remountMotion) : null;
    ro?.observe(section);
    const heroTile = document.querySelector(".hero-mascot-tile");
    if (heroTile && ro) ro.observe(heroTile);

    return () => {
      window.removeEventListener("resize", remountMotion);
      ro?.disconnect();
      cleanupMotion?.();
    };
  }, [reduceMotion]);

  return (
    <span
      ref={rootRef}
      className="nav-mascot-icon"
      data-face={MASCOT_FACE_BASE_INTENSITY}
    >
      <MascotInlineSvg className="as-icon hero-mascot-svg nav-mascot-svg" />
    </span>
  );
}
