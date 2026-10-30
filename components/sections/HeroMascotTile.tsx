"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  MASCOT_FACE_BASE_INTENSITY,
  MascotInlineSvg,
} from "@/components/mascot/MascotInlineSvg";
import {
  initFaceFollowCursor,
  initFaceIdleGlance,
  prefersMascotCursorFollow,
} from "@/lib/osmo/face-follow-cursor";

/** User mascot SVG (444×444); eyes/inner eyes + body follow cursor while hero is in view. */
export function HeroMascotTile({ ariaLabel }: { ariaLabel: string }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const section = sectionRef.current;
    const hero = document.querySelector(".hero");
    if (!section || !hero) return undefined;
    if (prefersMascotCursorFollow()) {
      return initFaceFollowCursor(section, hero);
    }
    return initFaceIdleGlance(section, hero);
  }, [reduceMotion]);

  return (
    <span className="tiles" role="img" aria-label={ariaLabel}>
      <span
        className="tile t1 as-tile hero-mascot-tile"
        ref={sectionRef}
        data-face={MASCOT_FACE_BASE_INTENSITY}
      >
        <MascotInlineSvg className="as-icon hero-mascot-svg" />
      </span>
    </span>
  );
}
