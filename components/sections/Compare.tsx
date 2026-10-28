import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import type { Dictionary } from "@/lib/i18n/types";

export function Compare({ dict }: { dict: Dictionary }) {
  const { compare: c } = dict;
  return (
    <section>
      <div className="wrap">
        <div className="head rv">
          <div>
            <span className="label">
              <i />
              {c.label}
            </span>
            <h2>{c.title}</h2>
          </div>
        </div>
        <div className="compare">
          <div className="col no rv">
            <h3>{c.noTitle}</h3>
            {c.noItems.map((text) => (
              <div className="it" key={text}>
                <SiteIcon icon={faXmark} size={20} style={{ color: "var(--muted)" }} />
                {text}
              </div>
            ))}
          </div>
          <div className="col yes rv d1">
            <h3>{c.yesTitle}</h3>
            {c.yesItems.map((text) => (
              <div className="it" key={text}>
                <SiteIcon icon={faCheck} size={20} style={{ color: "var(--g-ink)" }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
