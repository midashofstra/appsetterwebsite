import {
  faCalendarCheck,
  faDatabase,
  faLightbulb,
  faMagnifyingGlass,
  faPaperPlane,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { INTEGRATION_LOGOS, LINKEDIN_LOGO } from "@/lib/integration-logos";

const gmail = INTEGRATION_LOGOS.find((l) => l.label === "Gmail")!;
const whatsapp = INTEGRATION_LOGOS.find((l) => l.label === "WhatsApp")!;

/** Unaltered integration SVGs for Contact / Conversation panels. */
export const HOW_IT_WORKS_CHANNEL_LOGOS = [
  { src: LINKEDIN_LOGO, alt: "LinkedIn" },
  { src: gmail.src, alt: gmail.alt || "Gmail" },
  { src: whatsapp.src, alt: whatsapp.alt || "WhatsApp" },
] as const;

export type HowItWorksVisual =
  | { kind: "logos"; items: { src: string; alt: string }[] }
  | { kind: "icon"; icon: IconDefinition };

/** One visual per step tab: Find → Add → Contact → Conversation → Book → Learn → CRM */
export const HOW_IT_WORKS_VISUALS: HowItWorksVisual[] = [
  { kind: "icon", icon: faMagnifyingGlass },
  { kind: "icon", icon: faUserPlus },
  { kind: "icon", icon: faPaperPlane },
  { kind: "logos", items: [...HOW_IT_WORKS_CHANNEL_LOGOS] },
  { kind: "icon", icon: faCalendarCheck },
  { kind: "icon", icon: faLightbulb },
  { kind: "icon", icon: faDatabase },
];

/* Legacy four-tab visuals (flow diagram + calendar + book + logos):
export type HowItWorksVisual = | { kind: "flow" } | ...
export const HOW_IT_WORKS_VISUALS = [
  { kind: "flow" },
  { kind: "icon", icon: faCalendarDays },
  { kind: "icon", icon: faCalendarCheck },
  { kind: "logos", items: [...HOW_IT_WORKS_CHANNEL_LOGOS] },
];
*/

/* Legacy per-channel tab visuals (LinkedIn / Gmail / WhatsApp only):
import { CHANNEL_TAB_VISUALS } from "@/lib/channel-tab-visuals";
*/
