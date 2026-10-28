import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Dictionary } from "@/lib/i18n/types";

export function Cta({ dict }: { dict: Dictionary }) {
  const { cta } = dict;
  return (
    <section id="start" className="cta-section">
      <div className="wrap">
        <div className="cta-stage">
          <div className="cta rv">
            <div>
              <h2>{cta.title}</h2>
              <p className="sub">{cta.sub}</p>
              <div className="ctas cta-actions">
                <CtaButton href="#start" className="btn-ink">
                  {cta.primary}
                </CtaButton>
                <CtaButton href="#start" className="btn-ghost">
                  {cta.ghost}
                </CtaButton>
              </div>
            </div>
          </div>
          <div className="cta-mascot-wrap">
            <Image
              src="/mascot-3d.webp"
              alt={cta.mascotAlt}
              width={1242}
              height={1228}
              className="cta-mascot-3d"
              sizes="(max-width: 760px) 140px, 240px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
