import { ChannelsBouncyTabs } from "@/components/sections/ChannelsBouncyTabs";
import { resolveHowItWorksStepImageSrcs } from "@/lib/how-it-works-step-images";
import type { Dictionary } from "@/lib/i18n/types";

/** How it works (in-conversation flow) — same #kanalen anchor; Osmo bouncy tabs. */
export function Channels({ dict }: { dict: Dictionary }) {
  const { channels } = dict;
  return (
    <section id="kanalen" className="soft chan chan-bouncy-section">
      <div className="wrap">
        <div className="head rv">
          <div>
            <span className="label">
              <i />
              {channels.label}
            </span>
            <h2>{channels.title}</h2>
            <p className="chan-sub rv d1">{channels.subtitle}</p>
          </div>
        </div>

        <ChannelsBouncyTabs dict={dict} stepImageSrcs={resolveHowItWorksStepImageSrcs()} />

        {/* Legacy three-card channels layout (Font Awesome icons):
        import { faEnvelope, faCommentDots } from "@fortawesome/free-solid-svg-icons";
        import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
        import { SiteIcon } from "@/components/icons/SiteIcon";
        const channelIcons = [faLinkedinIn, faEnvelope, faCommentDots] as const;
        const channelClasses = ["card rv", "card rv d1", "card g rv d2"] as const;
        <div className="cards">
          {channels.cards.map(({ title, text }, i) => (
            <div className={channelClasses[i]} key={title}>
              <SiteIcon icon={channelIcons[i]} size={40} style={{ color: "var(--icon-fg, #151613)" }} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        */}
      </div>
    </section>
  );
}
