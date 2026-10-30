"use client";

import { useEffect, useId, useRef } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { CHANNEL_TAB_VISUALS } from "@/lib/channel-tab-visuals";
import { initBouncyContentTabs } from "@/lib/osmo/bouncy-content-tabs";
import type { Dictionary } from "@/lib/i18n/types";

export function ChannelsBouncyTabs({ dict }: { dict: Dictionary }) {
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
      className="bouncy-tabs chan-bouncy"
    >
      <div data-bouncy-tabs-nav="" role="tablist" aria-label={c.tabsAria} className="bouncy-tabs__nav">
        <div data-bouncy-tabs-ghost="" className="bouncy-tabs__ghost" aria-hidden />
        <div data-bouncy-tabs-indicator="" className="bouncy-tabs__indicator" aria-hidden />
        {c.cards.map(({ title }, i) => (
          <button
            key={CHANNEL_TAB_VISUALS[i]?.id ?? title}
            type="button"
            role="tab"
            data-bouncy-tabs-button=""
            {...(i === 0 ? { "data-active": true } : {})}
            className="bouncy-tabs__button"
            aria-selected={i === 0 ? "true" : "false"}
            tabIndex={i === 0 ? 0 : -1}
          >
            {title}
          </button>
        ))}
      </div>

      <div data-bouncy-tabs-card="" className="bouncy-tabs__collection">
        <div data-bouncy-tabs-panels="" className="bouncy-tabs__list">
          {c.cards.map(({ title, text }, i) => {
            const visual = CHANNEL_TAB_VISUALS[i];
            return (
              <div
                key={visual?.id ?? title}
                data-bouncy-tabs-panel=""
                role="tabpanel"
                {...(i === 0 ? { "data-active": true } : {})}
                className="bouncy-tabs__item"
              >
                <div className="bouncy-tabs__item-text">
                  <h3 className="bouncy-tabs__heading">{title}</h3>
                  <p className="bouncy-tabs__para">{text}</p>
                  {c.panelCta ? (
                    <CtaButton href="#start" className="bouncy-tabs__cta btn-main btn-sm">
                      {c.panelCta}
                    </CtaButton>
                  ) : null}
                </div>
                <div className="bouncy-tabs__item-visual">
                  {visual ? (
                    <img
                      className="bouncy-tabs__item-img"
                      src={visual.src}
                      alt={visual.alt}
                      width={160}
                      height={160}
                      draggable={false}
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
