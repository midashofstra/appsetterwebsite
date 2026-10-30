import {
  faCalendarCheck,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { INTEGRATION_LOGOS, LINKEDIN_LOGO } from "@/lib/integration-logos";

const gmail = INTEGRATION_LOGOS.find((l) => l.label === "Gmail")!;
const whatsapp = INTEGRATION_LOGOS.find((l) => l.label === "WhatsApp")!;

export type HowItWorksVisual =
  | { kind: "flow" }
  | { kind: "logos"; items: { src: string; alt: string }[] }
  | { kind: "icon"; icon: IconDefinition };

/** Tab panel visuals: flow (tab 1), calendar/book icons, then channel logos (tab 4). */
export const HOW_IT_WORKS_VISUALS: HowItWorksVisual[] = [
  { kind: "flow" },
  { kind: "icon", icon: faCalendarDays },
  { kind: "icon", icon: faCalendarCheck },
  {
    kind: "logos",
    items: [
      { src: LINKEDIN_LOGO, alt: "LinkedIn" },
      { src: gmail.src, alt: gmail.alt || "Gmail" },
      { src: whatsapp.src, alt: whatsapp.alt || "WhatsApp" },
    ],
  },
];

/* Legacy tab 1 visual (logos only on first tab):
export const HOW_IT_WORKS_VISUALS: HowItWorksVisual[] = [
  { kind: "logos", items: [ LinkedIn, Gmail, WhatsApp ] },
  ...
];
*/

/* Legacy per-channel tab visuals (LinkedIn / Gmail / WhatsApp only):
import { CHANNEL_TAB_VISUALS } from "@/lib/channel-tab-visuals";
*/
