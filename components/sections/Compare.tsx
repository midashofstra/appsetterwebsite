import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";

const noItems = [
  "Leads koelen af en gaan naar je concurrent",
  "Je blijft de bottleneck en je groei stopt",
  "Je betaalt een setter, zonder garantie op resultaat",
  "Je agenda blijft leeg terwijl er genoeg kansen zijn",
  "Je dagen zitten vol werk dat AI ook kan",
];

const yesItems = [
  "Elke lead wordt opgevolgd",
  "Een volle agenda",
  "Jij bent bezig met wat ertoe doet",
  "Geen setter meer nodig, dus lagere kosten",
  "Een stabielere business",
];

export function Compare() {
  return (
    <section>
      <div className="wrap">
        <div className="head rv">
          <div>
            <span className="label">
              <i />
              Het verschil
            </span>
            <h2>Van achter leads aanrennen naar alleen nog gesprekken voeren.</h2>
          </div>
        </div>
        <div className="compare">
          <div className="col no rv">
            <h3>Als je niks doet</h3>
            {noItems.map((text) => (
              <div className="it" key={text}>
                <SiteIcon icon={faXmark} size={20} style={{ color: "#9A9D93" }} />
                {text}
              </div>
            ))}
          </div>
          <div className="col yes rv d1">
            <h3>Met Appointment Setter</h3>
            {yesItems.map((text) => (
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
