"use client";

import { useEffect } from "react";
import { getBasePath } from "@/lib/base-path";

/** Static-export fallback when host has no edge redirects (Vercel uses vercel.json). */
export function EnLegacyRedirect() {
  const base = getBasePath();
  const home = base ? `${base}/` : "/";

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    window.location.replace(`${home}${search}${hash}`.replace(/\/{2,}/g, "/"));
  }, [home]);

  return (
    <p style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      Redirecting…{" "}
      <a href={home}>Continue to the English homepage</a>
    </p>
  );
}
