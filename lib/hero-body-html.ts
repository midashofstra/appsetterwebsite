import { nl } from "@/lib/i18n/nl";
import type { Dictionary } from "@/lib/i18n/types";

export function buildHeroBodyHtml(dict: Dictionary): string {
  const { hero } = dict;
  return `<p class="sub hero-hide">${hero.sub}</p>
    <div class="ctas hero-cta-intro">
      <a class="btn btn-main" href="#start">${hero.ctaPrimary}</a>
      <a class="btn btn-ghost" href="#start">${hero.ctaGhost}</a>
    </div>
    <div class="ticks hero-cta-intro">
      <span><svg width="18" height="18" style="color:var(--g-ink)"><use href="#check"/></svg>${hero.ticks[0]}</span>
      <span><svg width="18" height="18" style="color:var(--g-ink)"><use href="#check"/></svg>${hero.ticks[1]}</span>
      <span><svg width="18" height="18" style="color:var(--g-ink)"><use href="#check"/></svg>${hero.ticks[2]}</span>
    </div>`;
}

export const HERO_BODY_AFTER_HEADLINE = buildHeroBodyHtml(nl);
