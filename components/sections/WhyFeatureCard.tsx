"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { motion, useReducedMotion } from "motion/react";
import { SiteIcon } from "@/components/icons/SiteIcon";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const HOVER_MS = 0.22;

type WhyFeatureCardProps = {
  icon: IconDefinition;
  title: string;
  text: string;
};

export function WhyFeatureCard({ icon, title, text }: WhyFeatureCardProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="feat rv">
        <span className="ico">
          <SiteIcon icon={icon} size={22} style={{ color: "var(--g-ink)" }} />
        </span>
        <div>
          <b>{title}</b>
          <span>{text}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="feat rv"
      initial="rest"
      whileHover="hover"
      variants={{
        rest: {
          y: 0,
          backgroundColor: "#ffffff",
          borderColor: "var(--line)",
          boxShadow: "0 1px 2px rgba(21,22,19,.04), 0 4px 16px -8px rgba(21,22,19,.08)",
        },
        hover: {
          y: -3,
          backgroundColor: "var(--g-soft)",
          borderColor: "var(--g-mid)",
          boxShadow: "0 2px 4px rgba(21,22,19,.06), 0 12px 28px -10px rgba(21,22,19,.14)",
        },
      }}
      transition={{ duration: HOVER_MS, ease: EASE_OUT }}
    >
      <motion.span
        className="ico"
        variants={{
          rest: { y: 0 },
          hover: { y: -2 },
        }}
        transition={{ duration: HOVER_MS, ease: EASE_OUT }}
      >
        <motion.span
          className="ico-inner"
          variants={{
            rest: { color: "var(--g-ink)" },
            hover: { color: "var(--g)" },
          }}
          transition={{ duration: HOVER_MS, ease: EASE_OUT }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <SiteIcon icon={icon} size={22} style={{ color: "currentColor" }} />
        </motion.span>
      </motion.span>
      <div>
        <b>{title}</b>
        <span>{text}</span>
      </div>
    </motion.div>
  );
}
