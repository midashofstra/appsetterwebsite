"use client";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { CtaButton } from "@/components/ui/CtaButton";

/** Hydrates hero CTAs and tick checkmarks inside injected hero HTML. */
export function HeroExtras() {
  useLayoutEffect(() => {
    const ctas = document.querySelector(".hero .ctas");
    if (ctas && !ctas.querySelector(".btn-roll")) {
      ctas.innerHTML = "";
      const mount = document.createElement("div");
      mount.style.display = "contents";
      ctas.appendChild(mount);
      createRoot(mount).render(
        <>
          <CtaButton href="#start" className="btn-main">
            Probeer 3 dagen voor €1
          </CtaButton>
          <CtaButton href="#start" className="btn-ghost">
            Laat ons je onboarden
          </CtaButton>
        </>
      );
    }

    document.querySelectorAll(".hero .ticks span").forEach((span) => {
      if (span.querySelector("svg[data-icon]")) return;
      const text = span.textContent?.trim() ?? "";
      const svg = span.querySelector("svg");
      if (!svg || !text) return;
      const mount = document.createElement("span");
      mount.style.display = "inline-flex";
      mount.style.alignItems = "center";
      mount.style.gap = "8px";
      span.replaceWith(mount);
      createRoot(mount).render(
        <>
          <SiteIcon icon={faCheck} size={18} className="hero-tick-icon" style={{ color: "var(--g-ink)", flexShrink: 0 }} />
          {text}
        </>
      );
    });

    const bookedOk = document.querySelector(".booked .ok");
    if (bookedOk && !bookedOk.querySelector("svg[data-icon]")) {
      bookedOk.innerHTML = "";
      createRoot(bookedOk).render(<SiteIcon icon={faCheck} size={20} style={{ color: "#151613" }} />);
    }
  }, []);

  return null;
}
