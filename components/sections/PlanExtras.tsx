"use client";

import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { INTEGRATION_LOGOS } from "@/lib/integration-logos";
import { CtaButton } from "@/components/ui/CtaButton";

export function PlanExtras() {
  useLayoutEffect(() => {
    const headBtn = document.querySelector("#plan .head .btn-ghost");
    if (headBtn && !headBtn.classList.contains("btn-roll")) {
      const mount = document.createElement("div");
      mount.style.display = "contents";
      headBtn.replaceWith(mount);
      createRoot(mount).render(
        <CtaButton href="#start" className="btn-ghost">
          Probeer 3 dagen voor €1
        </CtaButton>
      );
    }

    const mini = document.querySelector("#plan .step .mini");
    if (mini && !mini.hasAttribute("data-integrations")) {
      mini.setAttribute("data-integrations", "true");
      mini.innerHTML = INTEGRATION_LOGOS.map(
        ({ label, src }) =>
          `<div class="r"><img draggable="false" src="${src}" alt="${label}">${label}<span class="tag g">Gekoppeld</span></div>`
      ).join("");
    }
  }, []);

  return null;
}
