"use client";

import { useEffect, type RefObject } from "react";
import {
  initFaceFollowCursorGlobal,
  initFaceIdleGlanceGlobal,
  mascotMotionScaleVsHero,
  prefersMascotCursorFollow,
} from "@/lib/osmo/face-follow-cursor";

/** Global pointer follow (desktop) or idle glance (touch); scales motion vs hero tile. */
export function useMascotFaceTracking(
  rootRef: RefObject<HTMLElement | null>,
  reduceMotion: boolean | null
) {
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
  }, [reduceMotion, rootRef]);
}
