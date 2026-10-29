"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useMemo, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useMagneticCursorBinding } from "@/components/ui/MagneticCursor";

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

export function CtaButton({ href, className = "", children, ...rest }: CtaButtonProps) {
  const reduceMotion = useReducedMotion();
  const label = typeof children === "string" ? children : String(children);
  const chars = useMemo(() => splitLabel(label), [label]);
  const linkRef = useRef<HTMLAnchorElement>(null);
  useMagneticCursorBinding(linkRef, !reduceMotion);

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
      ref={linkRef}
      className={`btn btn-roll btn-animate-chars ${className}`.trim()}
      aria-label={label}
      data-magnetic-cursor-target=""
      {...rest}
    >
      <span data-magnetic-cursor-bg="" className="magnetic-cursor-bg-slot" aria-hidden />
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
