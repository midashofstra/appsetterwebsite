import Image from "next/image";

export function Cta() {
  return (
    <section id="start" className="cta-section">
      <div className="wrap">
        <div className="cta-stage">
          <div className="cta rv">
            <div>
              <h2>Probeer het 3 dagen voor €1.</h2>
              <p className="sub">
                Koppel je kanalen en zie de eerste afspraken binnenkomen. Liever dat wij het
                instellen? Dan onboarden we je.
              </p>
              <div className="ctas cta-actions">
                <a className="btn btn-ink" href="#start">
                  Start voor €1
                </a>
                <a className="btn btn-ghost" href="#start">
                  Laat ons je onboarden
                </a>
              </div>
            </div>
          </div>
          <div className="cta-mascot-wrap">
            <Image
              src="/mascot-3d.webp"
              alt="3D-mascotte van appointmentsetter.app: een wit kalenderblok met twee ringen en grote zwarte ogen"
              width={868}
              height={917}
              className="cta-mascot-3d"
              sizes="(max-width: 760px) 140px, 240px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
