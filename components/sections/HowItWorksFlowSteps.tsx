import { SiteIcon } from "@/components/icons/SiteIcon";
import { HOW_IT_WORKS_FLOW_STEP_ICONS } from "@/lib/how-it-works-flow-steps";
import type { Dictionary } from "@/lib/i18n/types";

export function HowItWorksFlowSteps({ dict }: { dict: Dictionary }) {
  const steps = dict.channels.flowSteps;

  return (
    <ol className="how-it-works-flow" aria-label={dict.channels.flowAria}>
      {steps.map((step, i) => {
        const icon = HOW_IT_WORKS_FLOW_STEP_ICONS[i]?.icon;
        return (
          <li key={step.label} className="how-it-works-flow__step">
            <span className="how-it-works-flow__marker" aria-hidden>
              <span className="how-it-works-flow__num">{i + 1}</span>
              {icon ? (
                <SiteIcon
                  icon={icon}
                  size={22}
                  className="how-it-works-flow__icon"
                  style={{ color: "var(--icon-fg, #151613)" }}
                />
              ) : null}
            </span>
            <span className="how-it-works-flow__copy">
              <span className="how-it-works-flow__label">{step.label}</span>
              {step.description ? (
                <span className="how-it-works-flow__desc">{step.description}</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
