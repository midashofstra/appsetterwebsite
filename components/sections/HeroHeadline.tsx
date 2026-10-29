"use client";

import { HeroTileDeck } from "@/components/sections/HeroTileDeck";
import {
  HERO_DECK_CHANNEL_CYCLE_MS,
  HERO_DECK_CHANNEL_STAGGER_MS,
  HERO_DECK_CYCLE_MS,
} from "@/lib/hero-deck-timing";
import { HeroMascotTile } from "@/components/sections/HeroMascotTile";
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
      <HeroMascotTile ariaLabel={dict.hero.mascotAria} />
      {/* Legacy calendar-block mascot SVG (replaced by public/mascot.svg inline in HeroMascotTile):
      <span className="tiles" role="img" aria-label={dict.hero.mascotAria}>
        <span className="tile t1 as-tile"><svg className="as-icon" viewBox="0 0 120 120">...</svg></span>
      </span>
      */}
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
