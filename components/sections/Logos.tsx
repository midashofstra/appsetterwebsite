import { ProblemArcScrollTransition } from "@/components/sections/ProblemArcScrollTransition";
import { INTEGRATION_LOGOS } from "@/lib/integration-logos";
import type { Dictionary } from "@/lib/i18n/types";

export function Logos({ dict }: { dict: Dictionary }) {
  return (
    <div className="logos">
      <div className="wrap">
        <p className="rv">{dict.logos.title}</p>
        <div className="logo-row rv d1">
          {INTEGRATION_LOGOS.map(({ label, src, alt }) => {
            const displayLabel =
              dict.locale === "en" && label === "Google Agenda" ? "Google Calendar" : label;
            return (
              <span key={label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img draggable={false} src={src} alt={alt || displayLabel} />
                {displayLabel}
              </span>
            );
          })}
        </div>
      </div>
      <ProblemArcScrollTransition />
    </div>
  );
}
