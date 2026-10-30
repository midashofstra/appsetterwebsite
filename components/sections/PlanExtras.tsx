"use client";

import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { INTEGRATION_LOGOS } from "@/lib/integration-logos";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Dictionary } from "@/lib/i18n/types";

export function PlanExtras({ dict }: { dict: Dictionary }) {
  useLayoutEffect(() => {
    const headBtn = document.querySelector("#plan .head .btn-ghost");
    if (headBtn && !headBtn.classList.contains("btn-roll")) {
      const mount = document.createElement("div");
      mount.style.display = "contents";
      headBtn.replaceWith(mount);
      createRoot(mount).render(
        <CtaButton href="#start" className="btn-ghost">
          {dict.why.cta}
        </CtaButton>
      );
    }

    const mini = document.querySelector("#plan .step--connect .mini");
    if (mini && !mini.hasAttribute("data-integrations")) {
      mini.setAttribute("data-integrations", "true");
      const planConnectLogos = [...INTEGRATION_LOGOS];
      const whatsappIdx = planConnectLogos.findIndex((l) => l.label === "WhatsApp");
      const outlookIdx = planConnectLogos.findIndex((l) => l.label === "Outlook");
      if (whatsappIdx >= 0 && outlookIdx >= 0) {
        [planConnectLogos[whatsappIdx], planConnectLogos[outlookIdx]] = [
          planConnectLogos[outlookIdx],
          planConnectLogos[whatsappIdx],
        ];
      }
      mini.innerHTML = planConnectLogos.map(
        ({ label, src }) =>
          `<div class="r"><img draggable="false" src="${src}" alt="${label}">${label}<span class="tag g">${dict.planExtras.connected}</span></div>`
      ).join("");
    }
  }, [dict.planExtras.connected, dict.why.cta]);

  return null;
}
