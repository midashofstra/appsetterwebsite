import { INTEGRATION_LOGOS, LINKEDIN_LOGO } from "@/lib/integration-logos";

const gmail = INTEGRATION_LOGOS.find((l) => l.label === "Gmail")!;
const whatsapp = INTEGRATION_LOGOS.find((l) => l.label === "WhatsApp")!;

/** Legacy: one logo per channel tab (pre–how-it-works flow). See HOW_IT_WORKS_VISUALS. */
export const CHANNEL_TAB_VISUALS = [
  { id: "linkedin" as const, src: LINKEDIN_LOGO, alt: "LinkedIn" },
  /** Email tab uses the same Gmail mark as elsewhere on the site (not Outlook mail). */
  { id: "email" as const, src: gmail.src, alt: gmail.alt || "Gmail" },
  { id: "whatsapp" as const, src: whatsapp.src, alt: whatsapp.alt || "WhatsApp" },
];
