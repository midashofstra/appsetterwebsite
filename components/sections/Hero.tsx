import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { HERO_BODY_HTML } from "@/components/sections/hero-body-html";

export function Hero() {
  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div className="wrap">
          <span className="pill hero-hide">
            <i />
            AI appointment setter voor LinkedIn, e-mail en WhatsApp
          </span>
          <HeroHeadline />
          <div dangerouslySetInnerHTML={{ __html: HERO_BODY_HTML }} />
        </div>
      </div>
    </div>
  );
}
