import { INTEGRATION_LOGOS } from "@/lib/integration-logos";

export function Logos() {
  return (
    <div className="logos">
      <div className="wrap">
        <p className="rv">Werkt met de tools die je al gebruikt</p>
        <div className="logo-row rv d1">
          {INTEGRATION_LOGOS.map(({ label, src, alt }) => (
            <span key={label}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img draggable={false} src={src} alt={alt || label} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
