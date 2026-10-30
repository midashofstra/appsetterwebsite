// import { LangSwitcher } from "@/components/LangSwitcher";
import { NavMascotIcon } from "@/components/NavMascotIcon";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Dictionary } from "@/lib/i18n/types";

// const NAV_PROGRESSIVE_BLUR_PX = [0.5, 1, 2, 4, 8, 16, 32] as const;

export function Header({ dict }: { dict: Dictionary }) {
  const { nav } = dict;
  return (
    <header id="hdr">
      {/* PR #14 progressive blur (replaced by Osmo top blur below):
      <div className="hdr-progressive-blur" aria-hidden="true">
        {NAV_PROGRESSIVE_BLUR_PX.map((px) => (
          <div key={px} />
        ))}
      </div>
      */}
      <div className="progressive-blur hdr-progressive-blur" aria-hidden="true">
        <div className="progressive-blur__layer is--1" />
        <div className="progressive-blur__layer is--2" />
        <div className="progressive-blur__layer is--3" />
        <div className="progressive-blur__layer is--4" />
        <div className="progressive-blur__layer is--5" />
      </div>
      <div className="wrap">
        <nav aria-label={nav.aria}>
          <a href="#top" className="brand">
            <NavMascotIcon />
            {/* Legacy nav logo (#agent sprite, 38×38):
            <svg width="38" height="38" viewBox="0 0 120 120" aria-hidden="true">
              <rect width="120" height="120" rx="30" fill="var(--g)" />
              <use href="#agent" transform="rotate(-8 60 64)" />
            </svg>
            */}
            <span>{nav.brand}</span>
          </a>
          <div className="navlinks">
            <a href="#probleem">{nav.problem}</a>
            <a href="#waarom">{nav.why}</a>
            <a href="#plan">{nav.plan}</a>
            <a href="#kanalen">{nav.channels}</a>
            <a href="#pricing">{nav.pricing}</a>
            <a href="#faq">{nav.faq}</a>
          </div>
          <div className="nav-end">
            {/* <LangSwitcher locale={dict.locale} /> */}
            <CtaButton href="#start" className="btn-main btn-sm">
              {nav.cta}
            </CtaButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
