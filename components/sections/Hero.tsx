import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { buildHeroBodyHtml } from "@/lib/hero-body-html";
import type { Dictionary } from "@/lib/i18n/types";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <div className="hero">
      <div className="wrap">
        {/* Eyebrow hidden for a cleaner, headline-first hero (restore if needed):
        <span className="pill hero-hide">
          <i />
          AI appointment setter voor LinkedIn, e-mail en WhatsApp
        </span>
        */}
        <HeroHeadline dict={dict} />
        <div dangerouslySetInnerHTML={{ __html: buildHeroBodyHtml(dict) }} />
      </div>
      <HeroVideo dict={dict} />
      {/* Legacy inbox demo: import HeroDemoStage from HeroDemoStage.tsx, render <HeroDemoStage />, remove <HeroVideo />. */}
    </div>
  );
}
