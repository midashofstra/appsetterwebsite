"use client";

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { Dictionary } from "@/lib/i18n/types";

export function Faq({ dict }: { dict: Dictionary }) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const onClick = useCallback((event: React.MouseEvent) => {
    const toggle = (event.target as HTMLElement).closest("[data-accordion-toggle]");
    if (!toggle || !rootRef.current) return;
    const item = toggle.closest("[data-accordion-status]") as HTMLElement | null;
    if (!item) return;

    const isActive = item.getAttribute("data-accordion-status") === "active";
    const next = isActive ? "not-active" : "active";
    item.setAttribute("data-accordion-status", next);
    toggle.setAttribute("aria-expanded", next === "active" ? "true" : "false");

    if (!isActive) {
      rootRef.current.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
        if (sibling === item) return;
        sibling.setAttribute("data-accordion-status", "not-active");
        sibling.querySelector(".faq-summary")?.setAttribute("aria-expanded", "false");
      });
    }
  }, []);

  return (
    <section id="faq" style={{ paddingTop: 20 }}>
      <div
        ref={rootRef}
        className={`wrap faq faq-accordion-css${reduceMotion ? " faq-accordion-css--instant" : ""}`}
        data-accordion-close-siblings="true"
        data-accordion-css-init=""
        onClick={onClick}
      >
        <h2 className="rv">{dict.faq.title}</h2>
        {dict.faq.items.map((item) => (
          <div key={item.q} className="faq-item rv" data-accordion-status="not-active">
            <button
              type="button"
              className="faq-summary"
              data-accordion-toggle=""
              aria-expanded={false}
            >
              <span>{item.q}</span>
              <span className="pl faq-accordion-icon" aria-hidden="true">
                <SiteIcon icon={faPlus} size={14} className="faq-icon-plus" />
                <SiteIcon icon={faMinus} size={14} className="faq-icon-minus" />
              </span>
            </button>
            <div className="faq-panel faq-panel-outer">
              <div className="faq-panel-wrap">
                <div className="faq-panel-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
