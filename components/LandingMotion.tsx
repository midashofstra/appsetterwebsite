"use client";

import { useLayoutEffect } from "react";
import { initLandingMotion } from "@/lib/landing-motion";

/** Client-side Motion animations for the marketing landing page. */
export function LandingMotion() {
  /* useLayoutEffect: prime scroll-reveal hidden state before paint (avoids SSG flash + re-animate on scroll). */
  useLayoutEffect(() => {
    const cleanup = initLandingMotion();
    return cleanup;
  }, []);

  return null;
}
