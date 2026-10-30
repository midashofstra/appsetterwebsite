import {
  faCalendarCheck,
  faDatabase,
  faLightbulb,
  faMagnifyingGlass,
  faMagnifyingGlassChart,
  faPaperPlane,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { INTEGRATION_LOGOS, LINKEDIN_LOGO } from "@/lib/integration-logos";

const gmail = INTEGRATION_LOGOS.find((l) => l.label === "Gmail")!;
const whatsapp = INTEGRATION_LOGOS.find((l) => l.label === "WhatsApp")!;

/**
 * Drop files in `public/how-it-works/` using these basenames (first match wins: .webp, .png, .jpg, .jpeg).
 * See `public/how-it-works/README.md` for sizes and upload notes.
 */
/** Native pixel size of uploaded step art (1:1). Used for width/height on panel images. */
export const HOW_IT_WORKS_STEP_IMAGE_PX = 1692;

export const HOW_IT_WORKS_STEP_IMAGE_SLUGS = [
  "step-1-find-leads",
  "step-2-add-leads",
  "step-3-research",
  "step-4-contact",
  "step-5-conversation",
  "step-6-meeting",
  "step-7-learn",
  "step-8-crm",
] as const;

/** Pre–Research-step filenames (7-step layout) still resolve to the matching panel. */
export const HOW_IT_WORKS_STEP_IMAGE_LEGACY_SLUGS: readonly (readonly string[])[] = [
  [],
  [],
  [],
  ["step-3-contact"],
  ["step-4-conversation"],
  ["step-6-book", "step-5-book"],
  ["step-6-learn"],
  ["step-7-crm"],
] as const;

/** Unaltered integration SVGs for Conversation panel. */
export const HOW_IT_WORKS_CHANNEL_LOGOS = [
  { src: LINKEDIN_LOGO, alt: "LinkedIn" },
  { src: gmail.src, alt: gmail.alt || "Gmail" },
  { src: whatsapp.src, alt: whatsapp.alt || "WhatsApp" },
] as const;

export type HowItWorksVisual =
  | { kind: "logos"; items: { src: string; alt: string }[] }
  | { kind: "icon"; icon: IconDefinition };

/** One visual per step tab: Find → Add → Research → Contact → Conversation → Meeting → Learn → CRM */
export const HOW_IT_WORKS_VISUALS: HowItWorksVisual[] = [
  { kind: "icon", icon: faMagnifyingGlass },
  { kind: "icon", icon: faUserPlus },
  { kind: "icon", icon: faMagnifyingGlassChart },
  { kind: "icon", icon: faPaperPlane },
  { kind: "logos", items: [...HOW_IT_WORKS_CHANNEL_LOGOS] },
  { kind: "icon", icon: faCalendarCheck },
  { kind: "icon", icon: faLightbulb },
  { kind: "icon", icon: faDatabase },
];
