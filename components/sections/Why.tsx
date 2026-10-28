import { faCalendarDays, faPen, faSliders, faBolt } from "@fortawesome/free-solid-svg-icons";
import { WhyFeatureCard } from "@/components/sections/WhyFeatureCard";
import { CtaButton } from "@/components/ui/CtaButton";
import type { Dictionary } from "@/lib/i18n/types";

const featIcons = [faPen, faBolt, faCalendarDays, faSliders] as const;

export function Why({ dict }: { dict: Dictionary }) {
  const { why } = dict;
  return (
    <section className="soft" id="waarom">
      <div className="wrap">
        <div className="guide">
          <div className="copy rv">
            <span className="label" style={{ marginBottom: 0 }}>
              <i />
              {why.label}
            </span>
            <h2>{why.title}</h2>
            <p className="sub">{why.body}</p>
            <CtaButton href="#start" className="btn-main" style={{ alignSelf: "flex-start" }}>
              {why.cta}
            </CtaButton>
          </div>
          <div className="list">
            {why.feats.map(({ title, text }, i) => (
              <WhyFeatureCard key={title} icon={featIcons[i]} title={title} text={text} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
