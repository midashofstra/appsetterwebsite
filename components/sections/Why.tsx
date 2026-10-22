import { faCalendarDays, faPen, faSliders, faBolt } from "@fortawesome/free-solid-svg-icons";
import { WhyFeatureCard } from "@/components/sections/WhyFeatureCard";
import { CtaButton } from "@/components/ui/CtaButton";

const feats = [
  {
    icon: faPen,
    title: "Schrijft zoals jij",
    text: "Jouw woorden, jouw stijl. Geen robottaal.",
  },
  {
    icon: faBolt,
    title: "Antwoordt binnen minuten",
    text: "Ook om 23:00 en in het weekend.",
  },
  {
    icon: faCalendarDays,
    title: "Kent je agenda",
    text: "Biedt alleen tijden aan die echt vrij zijn.",
  },
  {
    icon: faSliders,
    title: "Jij houdt de regie",
    text: "Kijk mee in elk gesprek en neem over wanneer je wilt.",
  },
] as const;

export function Why() {
  return (
    <section className="soft" id="waarom">
      <div className="wrap">
        <div className="guide">
          <div className="copy rv">
            <span className="label" style={{ marginBottom: 0 }}>
              <i />
              Waarom wij
            </span>
            <h2>We deden zelf jarenlang sales.</h2>
            <p className="sub">
              We weten hoe opvolgen werkt en wat een lead over de streep trekt. Die kennis zit nu in de
              tool.
            </p>
            <CtaButton href="#start" className="btn-main" style={{ alignSelf: "flex-start" }}>
              Probeer 3 dagen voor €1
            </CtaButton>
          </div>
          <div className="list">
            {feats.map(({ icon, title, text }) => (
              <WhyFeatureCard key={title} icon={icon} title={title} text={text} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
