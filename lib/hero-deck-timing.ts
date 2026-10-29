/** Agenda/calendar deck: dwell before first flip (after intro) and between flips. */
export const HERO_DECK_CYCLE_MS = 3000;

/**
 * Channel deck (LinkedIn → Gmail → WhatsApp → Outlook): ~1.67× faster cycle than agenda.
 * First flip dwell uses the same ratio vs {@link HERO_DECK_CYCLE_MS}.
 */
export const HERO_DECK_CHANNEL_CYCLE_MS = 1800;

/** Extra delay for the channel deck so slots do not flip together. */
export const HERO_DECK_CHANNEL_STAGGER_MS = 600;

export const HERO_INTRO_COMPLETE_EVENT = "hero-intro-complete";

export function markHeroIntroComplete(): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.heroIntro = "complete";
  window.dispatchEvent(new CustomEvent(HERO_INTRO_COMPLETE_EVENT));
}

export function isHeroIntroComplete(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.heroIntro === "complete";
}
