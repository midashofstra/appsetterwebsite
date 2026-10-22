"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.3;

type CtaButtonProps = {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export function CtaButton({ href, className = "", children, ...rest }: CtaButtonProps) {
  const reduceMotion = useReducedMotion();
  const label = typeof children === "string" ? children : String(children);

  if (reduceMotion) {
    return (
      <Link href={href} className={`btn ${className}`.trim()} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={`btn btn-roll ${className}`.trim()} {...rest}>
      <span className="btn-roll-viewport" aria-hidden="true">
        <motion.span
          className="btn-roll-track"
          initial="rest"
          whileHover="hover"
          variants={{
            rest: { y: "0%" },
            hover: { y: "-50%" },
          }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <span className="btn-roll-line">{label}</span>
          <span className="btn-roll-line">{label}</span>
        </motion.span>
      </span>
      <span className="sr-only">{label}</span>
    </Link>
  );
}
