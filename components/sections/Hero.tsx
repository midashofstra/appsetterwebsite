import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { HERO_BODY_AFTER_HEADLINE } from "@/lib/hero-body-html";

export function Hero() {
  return (
    <div className="hero">
      <div className="wrap">
        {/* Eyebrow hidden for a cleaner, headline-first hero (restore if needed):
        <span className="pill hero-hide">
          <i />
          AI appointment setter voor LinkedIn, e-mail en WhatsApp
        </span>
        */}
        <HeroHeadline />
        <div dangerouslySetInnerHTML={{ __html: HERO_BODY_AFTER_HEADLINE }} />
      </div>
    </div>
  );
}
