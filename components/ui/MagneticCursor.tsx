"use client";

import { useReducedMotion } from "motion/react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  bindMagneticCursorTarget,
  registerMagneticCursorRoot,
} from "@/lib/osmo/magnetic-cursor";

export function MagneticCursorProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBgRef = useRef<HTMLDivElement>(null);
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    setPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion || !pointerFine) return undefined;
    const cursor = cursorRef.current;
    const cursorBg = cursorBgRef.current;
    if (!cursor || !cursorBg) return undefined;
    return registerMagneticCursorRoot(cursor, cursorBg);
  }, [reduceMotion, pointerFine]);

  const enabled = !reduceMotion && pointerFine;

  return (
    <>
      {children}
      {enabled && (
        <div ref={cursorRef} className="magnetic-cursor" aria-hidden>
          <div ref={cursorBgRef} className="magnetic-cursor-bg magnetic-cursor-bg--dot" />
        </div>
      )}
    </>
  );
}

/** Call from CTA links after mount (including client-portaled hero CTAs). */
export function useMagneticCursorBinding(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: fine)").matches) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    let cleanup: (() => void) | undefined;
    let attempts = 0;
    const tryBind = () => {
      cleanup = bindMagneticCursorTarget(el);
      if (el.dataset.magneticBound !== "true" && attempts < 40) {
        attempts += 1;
        window.requestAnimationFrame(tryBind);
      }
    };
    tryBind();

    return () => cleanup?.();
  }, [enabled, ref]);
}
