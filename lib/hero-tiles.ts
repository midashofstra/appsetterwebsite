import {
  INTEGRATION_LOGOS,
  OUTLOOK_CALENDAR_LOGO,
  OUTLOOK_MAIL_LOGO,
} from "@/lib/integration-logos";

const byLabel = (label: string) => INTEGRATION_LOGOS.find((l) => l.label === label)!;

export type HeroTileSpec =
  | { id: string; className: string; kind: "img"; src: string; alt?: string }
  | { id: string; className: string; kind: "whatsapp" };

/** Google Agenda first, then Outlook Calendar (bc736da order). */
export const HERO_AGENDA_TILES: HeroTileSpec[] = [
  { id: "google-agenda", className: "t5", kind: "img", src: byLabel("Google Agenda").src, alt: "" },
  { id: "outlook-calendar", className: "t4", kind: "img", src: OUTLOOK_CALENDAR_LOGO, alt: "" },
];

/** LinkedIn first (initial front), then Gmail → WhatsApp → Outlook mail. */
export const HERO_CHANNEL_TILES: HeroTileSpec[] = [
  { id: "linkedin", className: "t7", kind: "img", src: byLabel("LinkedIn").src, alt: "" },
  { id: "gmail", className: "t6", kind: "img", src: byLabel("Gmail").src, alt: "" },
  { id: "whatsapp", className: "t8", kind: "whatsapp" },
  { id: "outlook-mail", className: "t9", kind: "img", src: OUTLOOK_MAIL_LOGO, alt: "" },
];
