"use client";

import { useEffect, useRef } from "react";
import { mountArcScrollTransition } from "@/lib/osmo/arc-scroll-transition";

/**
 * Cover arc at the bottom of the logos band: problem-section background (--bg)
 * rises over the hero funnel as #probleem scrolls into view (Osmo Arc Scroll Transition).
 */
export function ProblemArcScrollTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return mountArcScrollTransition(el);
  }, []);

  return (
    <div
      ref={ref}
      className="problem-arc-scroll-transition"
      data-arc-scroll-transition
      data-mode="cover"
      data-curve="12"
      data-scroll-trigger="#probleem"
      data-scroll-start="top bottom"
      data-scroll-end="top 78%"
      aria-hidden
    />
  );
}
