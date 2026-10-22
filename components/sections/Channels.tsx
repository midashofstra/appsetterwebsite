import { faEnvelope, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";

const channels = [
  {
    className: "card rv",
    icon: faLinkedinIn,
    title: "LinkedIn",
    text: "Reageert op connecties en antwoorden, en stuurt het gesprek richting een afspraak.",
  },
  {
    className: "card rv d1",
    icon: faEnvelope,
    title: "E-mail",
    text: "Volgt op na een offerte of formulier, op het juiste moment, zonder te pushen.",
  },
  {
    className: "card g rv d2",
    icon: faCommentDots,
    title: "WhatsApp",
    text: "Snel en persoonlijk. Precies waar je leads het liefst antwoorden.",
  },
] as const;

export function Channels() {
  return (
    <section id="kanalen" className="soft chan">
      <div className="wrap">
        <div className="head rv">
          <div>
            <span className="label">
              <i />
              Kanalen
            </span>
            <h2>Eén agent. Overal waar je klanten zijn.</h2>
          </div>
        </div>
        <div className="cards">
          {channels.map(({ className, icon, title, text }) => (
            <div className={className} key={title}>
              <SiteIcon icon={icon} size={40} style={{ color: "#151613" }} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
