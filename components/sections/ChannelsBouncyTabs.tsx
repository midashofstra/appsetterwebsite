"use client";

import { useEffect, useId, useRef } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { HowItWorksStepVisual } from "@/components/sections/HowItWorksStepVisual";
import { HOW_IT_WORKS_VISUALS } from "@/lib/how-it-works-tab-visuals";
import { initBouncyContentTabs } from "@/lib/osmo/bouncy-content-tabs";
import type { Dictionary } from "@/lib/i18n/types";

/** Meeting step (1-based step 6) — panel CTA lives here. */
const MEETING_STEP_INDEX = 5;
/* Legacy name: BOOK_STEP_INDEX (step was labeled "Book" / "Afspraak boeken"). */

export function ChannelsBouncyTabs({
  dict,
  stepImageSrcs,
}: {
  dict: Dictionary;
  stepImageSrcs: (string | null)[];
}) {
  const { channels: c } = dict;
  const rootRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initBouncyContentTabs(root);
  }, []);

  return (
    <div
      ref={rootRef}
      data-bouncy-tabs-init=""
      data-bouncy-tabs-instance={reactId}
      className="bouncy-tabs chan-bouncy bouncy-tabs--eight-steps"
    >
      <div
        data-bouncy-tabs-nav=""
        role="tablist"
        aria-label={c.tabsAria}
        className="bouncy-tabs__nav bouncy-tabs__nav--scroll"
      >
        <div data-bouncy-tabs-ghost="" className="bouncy-tabs__ghost" aria-hidden />
        <div data-bouncy-tabs-indicator="" className="bouncy-tabs__indicator" aria-hidden />
        {c.steps.map(({ tabLabel }, i) => (
          <button
            key={tabLabel}
            type="button"
            role="tab"
            data-bouncy-tabs-button=""
            {...(i === 0 ? { "data-active": true } : {})}
            className="bouncy-tabs__button"
            aria-selected={i === 0 ? "true" : "false"}
            tabIndex={i === 0 ? 0 : -1}
          >
            {tabLabel}
          </button>
        ))}
      </div>

      <div data-bouncy-tabs-card="" className="bouncy-tabs__collection">
        <div data-bouncy-tabs-panels="" className="bouncy-tabs__list">
          {c.steps.map(({ title, text }, i) => {
            const visual = HOW_IT_WORKS_VISUALS[i];
            return (
              <div
                key={tabLabelKey(c.steps[i].tabLabel, i)}
                data-bouncy-tabs-panel=""
                role="tabpanel"
                {...(i === 0 ? { "data-active": true } : {})}
                className="bouncy-tabs__item"
              >
                <div className="bouncy-tabs__item-text">
                  <h3 className="bouncy-tabs__heading">{title}</h3>
                  <p className="bouncy-tabs__para">{text}</p>
                  {c.panelCta && i === MEETING_STEP_INDEX ? (
                    <CtaButton href="#start" className="bouncy-tabs__cta btn-main btn-sm">
                      {c.panelCta}
                    </CtaButton>
                  ) : null}
                </div>
                <HowItWorksStepVisual
                  visual={visual}
                  imageSrc={stepImageSrcs[i] ?? null}
                  alt={title}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function tabLabelKey(tabLabel: string, index: number) {
  return `${index}-${tabLabel}`;
}

/* Legacy tab 1 end-to-end flow diagram (HowItWorksFlowSteps):
import { HowItWorksFlowSteps } from "@/components/sections/HowItWorksFlowSteps";
{visual?.kind === "flow" ? <HowItWorksFlowSteps dict={dict} /> : ...}
CTA was on index 2 (old Calendar tab).
*/
