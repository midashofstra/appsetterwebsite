"use client";

import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import { MASCOT_FACE_BASE_INTENSITY, MascotInlineSvg } from "@/components/mascot/MascotInlineSvg";
import { useMascotFaceTracking } from "@/components/mascot/useMascotFaceTracking";

/** Inline manifest heading mascot — same SVG + face motion as hero/nav. */
export function ManifestInlineMascot() {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  useMascotFaceTracking(rootRef, reduceMotion);

  return (
    <span
      ref={rootRef}
      className="manifest-inline-mascot"
      data-face={MASCOT_FACE_BASE_INTENSITY}
      data-face-subtle="manifest"
      role="img"
      aria-label="Appointment Setter"
    >
      <span className="tile as-tile manifest-mascot-tile">
        <MascotInlineSvg className="as-icon hero-mascot-svg" />
      </span>
    </span>
  );
}
