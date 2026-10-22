"use client";

import { useEffect } from "react";
import { initLandingMotion } from "@/lib/landing-motion";

/** Client-side Motion animations for the marketing landing page. */
export function LandingMotion() {
  useEffect(() => {
    const cleanup = initLandingMotion();
    return cleanup;
  }, []);

  return null;
}
