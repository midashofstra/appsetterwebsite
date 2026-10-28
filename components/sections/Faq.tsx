"use client";

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { Dictionary } from "@/lib/i18n/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`faq-item rv ${open ? "is-open" : ""}`}>
      <button type="button" className="faq-summary" onClick={onToggle} aria-expanded={open}>
        <span>{question}</span>
        <span className={`pl ${open ? "is-open" : ""}`} aria-hidden="true">
          <SiteIcon icon={open ? faMinus : faPlus} size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            className="faq-panel"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p>{answer}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq({ dict }: { dict: Dictionary }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ paddingTop: 20 }}>
      <div className="wrap faq">
        <h2 className="rv">{dict.faq.title}</h2>
        {dict.faq.items.map((item, i) => (
          <FaqItem
            key={item.q}
            question={item.q}
            answer={item.a}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
