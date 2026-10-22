"use client";

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SiteIcon } from "@/components/icons/SiteIcon";

const EASE = [0.22, 1, 0.36, 1] as const;

const FAQ_ITEMS = [
  {
    q: "Hoe werkt de proef van €1?",
    a: "Je gebruikt Appointment Setter 3 dagen voor €1. Daarna [JOUW PRIJS]. Stoppen kan altijd.",
  },
  {
    q: "Is dit goedkoper dan een setter?",
    a: "Een setter kost al snel €10 tot €50 per uur, of €100 per afspraak plus bonus. Appointment Setter kost [JOUW PRIJS] en werkt dag en nacht.",
  },
  {
    q: "Klinkt de AI als een robot?",
    a: "Nee. Hij schrijft in jouw toon en jij bepaalt wat hij wel en niet zegt.",
  },
  {
    q: "Kan ik meekijken en zelf overnemen?",
    a: "Ja. Je ziet elk gesprek en kunt op elk moment zelf verder.",
  },
  {
    q: "Ik heb geen tijd om het in te stellen.",
    a: "Dan doen wij het. We onboarden je en zetten alles voor je klaar.",
  },
] as const;

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
            className="faq-panel-outer"
            initial={reduceMotion ? false : { height: 0 }}
            animate={{ height: "auto" }}
            exit={reduceMotion ? undefined : { height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ overflow: "hidden", margin: 0, padding: 0 }}
          >
            <motion.div
              className="faq-panel-inner"
              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
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

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ paddingTop: 20 }}>
      <div className="wrap faq">
        <h2 className="rv">Vragen die we vaak krijgen</h2>
        {FAQ_ITEMS.map((item, i) => (
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
