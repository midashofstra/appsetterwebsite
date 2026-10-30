"use client";

import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  MASCOT_FACE_BASE_INTENSITY,
  MascotInlineSvg,
} from "@/components/mascot/MascotInlineSvg";
import { useMascotFaceTracking } from "@/components/mascot/useMascotFaceTracking";

/** Header brand icon (38×38): same face-follow as hero, global pointer + scaled motion. */
export function NavMascotIcon() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  useMascotFaceTracking(rootRef, reduceMotion);

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
