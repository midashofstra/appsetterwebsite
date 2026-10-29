"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  MagneticCursorButtonFill,
  useMagneticCursorTarget,
} from "@/components/ui/MagneticCursor";

type CtaButtonProps = {
  href: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

function splitLabel(label: string) {
  return [...label].map((char, index) => ({
    char,
    key: `${index}-${char === " " ? "sp" : char}`,
    delay: `${index * 0.01}s`,
  }));
}

function variantFromClass(className: string): "main" | "ghost" | "ink" {
  if (className.includes("btn-ghost")) return "ghost";
  if (className.includes("btn-ink")) return "ink";
  return "main";
}

export function CtaButton({ href, className = "", children, ...rest }: CtaButtonProps) {
  const reduceMotion = useReducedMotion();
  const label = typeof children === "string" ? children : String(children);
  const chars = useMemo(() => splitLabel(label), [label]);
  const magnetic = useMagneticCursorTarget();
  const variant = variantFromClass(className);
  const [magHover, setMagHover] = useState(false);

  if (reduceMotion) {
    return (
      <Link href={href} className={`btn ${className}`.trim()} aria-label={label} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      ref={magnetic.ref}
      className={`btn btn-roll btn-animate-chars ${className}`.trim()}
      aria-label={label}
      data-magnetic-cursor-target=""
      onMouseEnter={() => {
        setMagHover(true);
        magnetic.onMouseEnter();
      }}
      onMouseLeave={() => {
        setMagHover(false);
        magnetic.onMouseLeave();
      }}
      {...rest}
    >
      <MagneticCursorButtonFill active={magHover} variant={variant} />
      <span className="btn-chars-viewport" aria-hidden="true">
        <span data-button-animate-chars="" className="btn-chars-text">
          {chars.map(({ char, key, delay }) => (
            <span
              key={key}
              style={{
                transitionDelay: delay,
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
