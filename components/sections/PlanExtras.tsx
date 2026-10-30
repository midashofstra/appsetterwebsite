"use client";

import { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { PlanConnectMini } from "@/components/sections/PlanConnectMini";
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
      mini.replaceChildren();
      createRoot(mini).render(<PlanConnectMini connectedLabel={dict.planExtras.connected} />);
    }
  }, [dict.planExtras.connected, dict.why.cta]);

  return null;
}
