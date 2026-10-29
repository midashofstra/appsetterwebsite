"use client";

import { HeroTileDeck } from "@/components/sections/HeroTileDeck";
import {
  HERO_DECK_CHANNEL_CYCLE_MS,
  HERO_DECK_CHANNEL_STAGGER_MS,
  HERO_DECK_CYCLE_MS,
} from "@/lib/hero-deck-timing";
import { HERO_AGENDA_TILES, HERO_CHANNEL_TILES } from "@/lib/hero-tiles";
import type { Dictionary } from "@/lib/i18n/types";

export function HeroHeadline({ dict }: { dict: Dictionary }) {
  const words = dict.hero.words;
  const w0 = words[0];
  const w1 = words[1];
  /** NL: “vullen,” between agenda and channel decks; EN omits (tile = calendar). */
  const afterAgendaDeck = words.length >= 4 ? words[2] : null;
  const beforeChannelDeck = words.length >= 4 ? words[3]! : words[2]!;
  const lineBreakBeforeChannel = dict.locale === "en";
  return (
    <h1 className="hx hero-hide">
      <span>{w0}</span>
      <span className="tiles" role="img" aria-label={dict.hero.mascotAria}>
        <span className="tile t1 as-tile">
          <svg className="as-icon" viewBox="0 0 120 120" aria-hidden="true">
            <rect width="120" height="120" rx="30" fill="var(--g)" />
            <g className="as-body">
              <rect x="31" y="41" width="62" height="56" rx="18" fill="#151613" />
              <rect x="25" y="35" width="62" height="56" rx="18" fill="#fff" stroke="#151613" strokeWidth="6" />
              <rect x="38" y="22" width="10" height="22" rx="5" fill="#151613" />
              <rect x="64" y="22" width="10" height="22" rx="5" fill="#151613" />
              <g className="as-open">
                <g className="as-look">
                  <ellipse cx="49" cy="64" rx="7" ry="10" fill="#151613" />
                  <ellipse cx="68" cy="64" rx="7" ry="10" fill="#151613" />
                  <circle cx="52" cy="60" r="2.6" fill="#fff" />
                  <circle cx="71" cy="60" r="2.6" fill="#fff" />
                </g>
              </g>
              <g className="as-happy" fill="none" stroke="#151613" strokeWidth="4" strokeLinecap="round">
                <path d="M42 63q7 7 14 0" />
                <path d="M61 63q7 7 14 0" />
              </g>
              <g className="as-sleepy" fill="#151613">
                <path d="M42 63h14a7 6 0 0 1-14 0z" />
                <path d="M61 63h14a7 6 0 0 1-14 0z" />
              </g>
            </g>
          </svg>
        </span>
      </span>
      <span>{w1}</span>
      <HeroTileDeck
        cards={HERO_AGENDA_TILES}
        ariaLabel={dict.hero.agendaDeckAria}
        firstFlipDelayAfterIntroMs={HERO_DECK_CYCLE_MS}
      />
      {afterAgendaDeck ? <span>{afterAgendaDeck}</span> : null}
      {lineBreakBeforeChannel ? <span className="hx-break" aria-hidden /> : null}
      <span>{beforeChannelDeck}</span>
      <HeroTileDeck
        cards={HERO_CHANNEL_TILES}
        ariaLabel={dict.hero.channelDeckAria}
        firstFlipDelayAfterIntroMs={HERO_DECK_CHANNEL_CYCLE_MS}
        firstFlipStaggerMs={HERO_DECK_CHANNEL_STAGGER_MS}
        cycleIntervalMs={HERO_DECK_CHANNEL_CYCLE_MS}
      />
    </h1>
  );
}
