import {
  faCalendarCheck,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { INTEGRATION_LOGOS, LINKEDIN_LOGO } from "@/lib/integration-logos";

const gmail = INTEGRATION_LOGOS.find((l) => l.label === "Gmail")!;
const whatsapp = INTEGRATION_LOGOS.find((l) => l.label === "WhatsApp")!;

export type HowItWorksVisual =
  | { kind: "logos"; items: { src: string; alt: string }[] }
  | { kind: "icon"; icon: IconDefinition };

/** Step visuals: channel marks (unchanged SVG bytes) + Font Awesome for calendar/book. */
export const HOW_IT_WORKS_VISUALS: HowItWorksVisual[] = [
  {
    kind: "logos",
    items: [
      { src: LINKEDIN_LOGO, alt: "LinkedIn" },
      { src: gmail.src, alt: gmail.alt || "Gmail" },
      { src: whatsapp.src, alt: whatsapp.alt || "WhatsApp" },
    ],
  },
  { kind: "icon", icon: faCalendarDays },
  { kind: "icon", icon: faCalendarCheck },
];

/* Legacy per-channel tab visuals (LinkedIn / Gmail / WhatsApp only):
import { CHANNEL_TAB_VISUALS } from "@/lib/channel-tab-visuals";
*/
