import { CtaButton } from "@/components/ui/CtaButton";

const NAV_PROGRESSIVE_BLUR_PX = [0.5, 1, 2, 4, 8, 16, 32] as const;

export function Header() {
  return (
    <header id="hdr">
      <div className="hdr-progressive-blur" aria-hidden="true">
        {NAV_PROGRESSIVE_BLUR_PX.map((px) => (
          <div key={px} />
        ))}
      </div>
      <div className="wrap">
        <nav aria-label="Hoofdmenu">
          <a href="#top" className="brand">
            <svg width="38" height="38" viewBox="0 0 120 120" aria-hidden="true">
              <rect width="120" height="120" rx="30" fill="var(--g)" />
              <use href="#agent" transform="rotate(-8 60 64)" />
            </svg>
            <span>Appointment Setter</span>
          </a>
          <div className="navlinks">
            <a href="#probleem">Probleem</a>
            <a href="#waarom">Waarom wij</a>
            <a href="#plan">Hoe het werkt</a>
            <a href="#kanalen">Kanalen</a>
            <a href="#faq">Vragen</a>
          </div>
          <CtaButton href="#start" className="btn-main btn-sm">
            Probeer voor €1
          </CtaButton>
        </nav>
      </div>
    </header>
  );
}
