"use client";

import {
  LayoutGroup,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

export const MAGNETIC_CURSOR_LAYOUT_ID = "magnetic-cursor-bg";
const FOLLOW = { stiffness: 120, damping: 22, mass: 0.4 };

type MagneticCtx = {
  activeEl: HTMLElement | null;
  setActive: (el: HTMLElement | null) => void;
};

const MagneticCursorContext = createContext<MagneticCtx | null>(null);

export function MagneticCursorProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null);
  const [pointerFine, setPointerFine] = useState(false);

  const x = useSpring(0, FOLLOW);
  const y = useSpring(0, FOLLOW);

  useEffect(() => {
    setPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || !pointerFine) return undefined;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion, pointerFine, x, y]);

  const enabled = !reduceMotion && pointerFine;

  return (
    <MagneticCursorContext.Provider value={{ activeEl, setActive: setActiveEl }}>
      {children}
      {enabled && (
        <LayoutGroup id="magnetic-cursor">
          {!activeEl && (
            <motion.div
              className="magnetic-cursor"
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
                zIndex: 55,
              }}
              aria-hidden
            >
              <motion.div
                layoutId={MAGNETIC_CURSOR_LAYOUT_ID}
                className="magnetic-cursor-bg magnetic-cursor-bg--dot"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          )}
        </LayoutGroup>
      )}
    </MagneticCursorContext.Provider>
  );
}

function magneticVariantFromClass(className: string) {
  if (className.includes("btn-ghost")) return "ghost";
  if (className.includes("btn-ink")) return "ink";
  return "main";
}

export function useMagneticCursorTarget(): {
  ref: RefObject<HTMLAnchorElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isActive: boolean;
  variant: "main" | "ghost" | "ink";
} {
  const ctx = useContext(MagneticCursorContext);
  const ref = useRef<HTMLAnchorElement | null>(null);
  const isActive = Boolean(ctx?.activeEl && ref.current && ctx.activeEl === ref.current);
  const variant = ref.current
    ? (magneticVariantFromClass(ref.current.className) as "main" | "ghost" | "ink")
    : "main";

  const onMouseEnter = useCallback(() => {
    if (ref.current) ctx?.setActive(ref.current);
  }, [ctx]);

  const onMouseLeave = useCallback(() => {
    ctx?.setActive(null);
  }, [ctx]);

  return { ref, onMouseEnter, onMouseLeave, isActive, variant };
}

export function MagneticCursorButtonFill({
  active,
  variant,
}: {
  active: boolean;
  variant: "main" | "ghost" | "ink";
}) {
  if (!active) return null;
  return (
    <motion.div
      layoutId={MAGNETIC_CURSOR_LAYOUT_ID}
      className={`magnetic-cursor-bg magnetic-cursor-bg--fill magnetic-cursor-bg--${variant}`}
      aria-hidden
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
