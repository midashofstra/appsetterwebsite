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

  if (dict.locale === "en") {
    return (
      <h1 className="hx hero-hide">
        <span className="hx-line">
          <span className="hx-line-text">{words[0]}</span>
          <HeroMascotTile ariaLabel={dict.hero.mascotAria} />
        </span>
        <span className="hx-line">
          <span className="hx-line-text">{words[1]}</span>
          <HeroTileDeck
            cards={HERO_AGENDA_TILES}
            ariaLabel={dict.hero.agendaDeckAria}
            firstFlipDelayAfterIntroMs={HERO_DECK_CYCLE_MS}
          />
        </span>
        <span className="hx-break" aria-hidden />
        <span className="hx-line">
          <span className="hx-line-text">{words[2]}</span>
          <HeroTileDeck
            cards={HERO_CHANNEL_TILES}
            ariaLabel={dict.hero.channelDeckAria}
            firstFlipDelayAfterIntroMs={HERO_DECK_CHANNEL_CYCLE_MS}
            firstFlipStaggerMs={HERO_DECK_CHANNEL_STAGGER_MS}
            cycleIntervalMs={HERO_DECK_CHANNEL_CYCLE_MS}
          />
        </span>
      </h1>
    );
  }

  /** NL: Laat {mascot} / je {agenda} vullen, / direct vanuit {channels} */
  return (
    <h1 className="hx hero-hide">
      <span className="hx-line">
        <span className="hx-line-text">{words[0]}</span>
        <HeroMascotTile ariaLabel={dict.hero.mascotAria} />
      </span>
      <span className="hx-line">
        <span className="hx-line-text">{words[1]}</span>
        <HeroTileDeck
          cards={HERO_AGENDA_TILES}
          ariaLabel={dict.hero.agendaDeckAria}
          firstFlipDelayAfterIntroMs={HERO_DECK_CYCLE_MS}
        />
        <span className="hx-line-text">{words[2]}</span>
      </span>
      <span className="hx-line">
        <span className="hx-line-text">{words[3]}</span>
        <HeroTileDeck
          cards={HERO_CHANNEL_TILES}
          ariaLabel={dict.hero.channelDeckAria}
          firstFlipDelayAfterIntroMs={HERO_DECK_CHANNEL_CYCLE_MS}
          firstFlipStaggerMs={HERO_DECK_CHANNEL_STAGGER_MS}
          cycleIntervalMs={HERO_DECK_CHANNEL_CYCLE_MS}
        />
      </span>
    </h1>
  );
}
