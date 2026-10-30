"use client";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { INTEGRATION_LOGOS } from "@/lib/integration-logos";

function planConnectLogosOrdered() {
  const planConnectLogos = [...INTEGRATION_LOGOS];
  const whatsappIdx = planConnectLogos.findIndex((l) => l.label === "WhatsApp");
  const outlookIdx = planConnectLogos.findIndex((l) => l.label === "Outlook");
  if (whatsappIdx >= 0 && outlookIdx >= 0) {
    [planConnectLogos[whatsappIdx], planConnectLogos[outlookIdx]] = [
      planConnectLogos[outlookIdx],
      planConnectLogos[whatsappIdx],
    ];
  }
  return planConnectLogos;
}

export function PlanConnectMini({ connectedLabel }: { connectedLabel: string }) {
  return (
    <>
      {planConnectLogosOrdered().map(({ label, src }) => (
        <div className="r" key={label}>
          <img draggable={false} src={src} alt={label} />
          {label}
          {/* Legacy visible pill text: Connected / Gekoppeld */}
          <span className="tag g plan-connect-tag" aria-label={connectedLabel}>
            <span className="sr-only">{connectedLabel}</span>
            <span aria-hidden="true">
              <SiteIcon icon={faCheck} size={11} className="plan-connect-tag__icon" style={{ color: "var(--text)" }} />
            </span>
          </span>
        </div>
      ))}
    </>
  );
}
