import { INTEGRATION_LOGOS } from "@/lib/integration-logos";

function logoSrc(label: string): string {
  const entry = INTEGRATION_LOGOS.find((l) => l.label === label);
  if (!entry) throw new Error(`Missing integration logo: ${label}`);
  return entry.src;
}

function HeroTile({ className, label }: { className: string; label: string }) {
  return (
    <span className={`tile ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img draggable={false} src={logoSrc(label)} alt="" />
    </span>
  );
}

/** Inline headline tile stacks — one small stack per slot (prototype layout). */
export function HeroHeadline() {
  return (
    <h1 className="hx hero-hide">
      <span>Laat</span>
      <span className="tiles" role="img" aria-label="appointmentsetter">
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
      <span>je</span>
      <span className="tiles" role="img" aria-label="Google Agenda en Outlook Calendar">
        <HeroTile className="t5" label="Google Agenda" />
        <HeroTile className="t4" label="Outlook Calendar" />
      </span>
      <span>agenda</span>
      <span>vullen,</span>
      <span>direct vanuit</span>
      <span className="tiles" role="img" aria-label="LinkedIn, Gmail, Outlook en WhatsApp">
        <HeroTile className="t7" label="LinkedIn" />
        <HeroTile className="t6" label="Gmail" />
        <HeroTile className="t4" label="Outlook" />
        <HeroTile className="t8" label="WhatsApp" />
      </span>
    </h1>
  );
}
