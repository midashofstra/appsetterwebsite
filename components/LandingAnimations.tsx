"use client";

import { useEffect } from "react";
import { initLandingAnimations } from "@/lib/landing-animations";

export function LandingAnimations() {
  useEffect(() => {
    const cleanup = initLandingAnimations();
    return cleanup;
  }, []);

  return null;
}
