"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { HeroTileSpec } from "@/lib/hero-tiles";

/** Ease-out, no overshoot */
const EASE_OUT = [0, 0, 0.2, 1] as const;
const CYCLE_MS = 3000;
const FLIP_MS = 450;

const WHATSAPP_SVG = (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M15 0C6.71532 0 0 6.71532 0 15C0 17.7251 0.72659 20.2812 1.99769 22.4835L0 30L7.7922 28.1575C9.93121 29.3315 12.3876 30 15 30C23.2847 30 30 23.2847 30 15C30 6.71532 23.2847 0 15 0ZM15 27.313C12.4934 27.313 10.161 26.5639 8.21618 25.2772L3.61214 26.4494L4.90318 22.0491C3.50636 20.0523 2.68699 17.622 2.68699 15C2.68699 8.19971 8.19971 2.68699 15 2.68699C21.8003 2.68699 27.313 8.19971 27.313 15C27.313 21.8003 21.8003 27.313 15 27.313Z"
      fill="#00D757"
    />
    <path
      d="M18.5139 16.9803L22.1434 18.691C22.3099 18.7699 22.4165 18.9381 22.4018 19.1219C22.3628 19.5997 22.1712 20.5569 21.3128 21.4144C18.8911 23.8361 14.542 21.0962 14.3651 20.9904C13.2951 20.4156 12.279 19.6473 11.3157 18.6832C10.3524 17.7199 9.58329 16.7028 9.00844 15.6338C8.90265 15.4569 6.16277 11.1086 8.58445 8.68608C9.44283 7.8277 10.3992 7.63694 10.8769 7.59706C11.0607 7.58232 11.2298 7.68897 11.3079 7.85544L13.0186 11.4849C13.0992 11.6566 13.0636 11.8604 12.9301 11.9947L11.6547 13.2702C11.379 13.5459 11.2975 13.9751 11.4882 14.3158C11.9538 15.1508 12.5798 15.9546 13.3047 16.6942C14.0443 17.419 14.848 18.045 15.683 18.5106C16.0238 18.7005 16.4529 18.6199 16.7287 18.3442L18.0041 17.0687C18.1385 16.9343 18.3422 16.8988 18.5139 16.9803Z"
      fill="#00D757"
    />
  </svg>
);

function parseRot(className: string): number {
  const map: Record<string, number> = {
    t4: -3,
    t5: 3,
    t6: -3,
    t7: 2,
    t8: -2,
    t9: 1,
  };
  for (const key of Object.keys(map)) {
    if (className.includes(key)) return map[key];
  }
  return 0;
}

function peekForDepth(depth: number, baseRot: number) {
  const capped = Math.min(depth, 2);
  return {
    x: `${capped * 0.034}em`,
    y: `${capped * 0.026}em`,
    rotate: baseRot + capped * 1.2,
    zIndex: 40 - depth,
  };
}

function renderTileContent(card: HeroTileSpec) {
  if (card.kind === "whatsapp") return WHATSAPP_SVG;
  return <img src={card.src} alt={card.alt ?? ""} draggable={false} />;
}

type Props = {
  cards: HeroTileSpec[];
  ariaLabel: string;
  /** Delay before the first automatic flip (ms). */
  autoStartDelayMs?: number;
};

export function HeroTileDeck({ cards, ariaLabel, autoStartDelayMs = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const n = cards.length;
  const [front, setFront] = useState(0);
  const [exitId, setExitId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frontRef = useRef(0);
  const deckId = useId();

  frontRef.current = front;
  const frontId = cards[front]?.id ?? "";
  const transitionActive = exitId !== null;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    if (n <= 1) return;
    timerRef.current = setTimeout(() => {
      flipRef.current();
    }, CYCLE_MS);
  }, [clearTimer, n]);

  const flipRef = useRef<() => void>(() => {});

  flipRef.current = () => {
    if (n <= 1) return;
    clearTimer();

    const outgoingId = cards[frontRef.current]?.id;
    if (!reduceMotion && outgoingId) {
      setExitId(outgoingId);
      clearExitTimer();
      exitTimerRef.current = setTimeout(() => setExitId(null), FLIP_MS);
    }

    setFront((f) => (f + 1) % n);
    scheduleNext();
  };

  useEffect(() => {
    if (n <= 1) return undefined;
    const start = setTimeout(() => flipRef.current(), autoStartDelayMs);
    return () => {
      clearTimeout(start);
      clearTimer();
      clearExitTimer();
    };
  }, [autoStartDelayMs, clearExitTimer, clearTimer, n]);

  const onActivate = () => {
    flipRef.current();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };

  if (n <= 1) {
    const card = cards[0];
    return (
      <span className="tiles" role="img" aria-label={ariaLabel}>
        <span className={`tile ${card.className}`}>{renderTileContent(card)}</span>
      </span>
    );
  }

  return (
    <span
      className="tiles tiles-deck"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      data-hero-deck={deckId}
      data-hero-front={frontId}
      onClick={onActivate}
      onKeyDown={onKeyDown}
    >
      {cards.map((card, i) => {
        const depth = (i - front + n) % n;
        const baseRot = parseRot(card.className);
        const stack = peekForDepth(depth, baseRot);
        const isFront = depth === 0;
        const isExiting = exitId === card.id;

        if (reduceMotion) {
          return (
            <motion.span
              key={card.id}
              data-card-id={card.id}
              className={`tile ${card.className} tile-deck-card`}
              initial={false}
              animate={{ opacity: isFront ? 1 : 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              style={{
                zIndex: isFront ? 40 : 0,
                pointerEvents: "none",
              }}
            >
              {renderTileContent(card)}
            </motion.span>
          );
        }

        const frontPose = {
          x: 0,
          y: 0,
          rotate: baseRot,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
        };

        let animateTarget: Record<string, string | number>;
        if (isExiting) {
          animateTarget = {
            ...frontPose,
            scale: 0.96,
            opacity: 0,
            filter: "blur(8px)",
          };
        } else if (isFront && transitionActive) {
          animateTarget = {
            ...frontPose,
            opacity: 1,
            filter: "blur(0px)",
          };
        } else {
          animateTarget = {
            x: stack.x,
            y: stack.y,
            rotate: stack.rotate,
            scale: 1,
            opacity: depth > 2 ? 0 : depth === 0 ? 1 : 0.92,
            filter: depth === 0 ? "blur(0px)" : depth === 1 && transitionActive ? "blur(3px)" : "blur(0px)",
          };
        }

        return (
          <motion.span
            key={card.id}
            data-card-id={card.id}
            className={`tile ${card.className} tile-deck-card`}
            initial={false}
            animate={animateTarget}
            transition={{ duration: FLIP_MS / 1000, ease: EASE_OUT }}
            style={{
              zIndex: isExiting ? 60 : stack.zIndex,
              pointerEvents: "none",
              transformOrigin: "center center",
            }}
          >
            {renderTileContent(card)}
          </motion.span>
        );
      })}
    </span>
  );
}
