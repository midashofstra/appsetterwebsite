import Link from "next/link";
import { COLOR_VARIANTS, DEFAULT_PRIMARY } from "@/lib/color-themes";

export const metadata = {
  title: "Kleurvarianten | appointmentsetter.app",
  description: "Overzicht van alternatieve merkkleuren voor de landing page.",
};

export default function KleurIndexPage() {
  return (
    <main className="kleur-index">
      <div className="wrap">
        <Link href="/" className="kleur-index-back">
          ← Homepage ({DEFAULT_PRIMARY})
        </Link>
        <h1>Kleurvarianten</h1>
        <p className="kleur-index-lead">
          Vergelijk alternatieven voor de primaire merkkleur. De live site gebruikt{" "}
          {DEFAULT_PRIMARY}; elke variant gebruikt dezelfde pagina met aangepaste CSS-variabelen.
        </p>
        <ul className="kleur-index-grid">
          {COLOR_VARIANTS.map((variant) => (
            <li key={variant.slug}>
              <Link href={`/kleur/${variant.slug}`} className="kleur-index-card">
                <span
                  className="kleur-index-swatch"
                  style={{ background: variant.primary }}
                  aria-hidden
                />
                <span className="kleur-index-meta">
                  <strong>{variant.label}</strong>
                  <span>/kleur/{variant.slug}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
