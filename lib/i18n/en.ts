import * as sections from "@/lib/i18n/en-sections";
import type { Dictionary } from "@/lib/i18n/types";

export const en: Dictionary = {
  locale: "en",
  htmlLang: "en",
  meta: {
    title: "Appointment Setter | AI appointment setter for LinkedIn, email and WhatsApp",
    description:
      "An AI agent that follows up on your leads via LinkedIn, email and WhatsApp and books meetings straight into your calendar.",
  },
  alternates: { nl: "/nl/", en: "/" },
  nav: {
    aria: "Main menu",
    brand: "Appointment Setter",
    problem: "Problem",
    why: "Why us",
    plan: "How it works",
    channels: "The agent",
    pricing: "Pricing",
    faq: "FAQ",
    // cta: "Try for €1",
    cta: "Try 3 days for €1",
  },
  hero: {
    words: ["Let", "fill your", "straight from"],
    // words: ["Fill", "your", "straight from"],
    mascotAria: "Appointment Setter mascot",
    agendaDeckAria: "Google Calendar and Outlook",
    channelDeckAria: "LinkedIn, Gmail, WhatsApp and Outlook",
    sub: "Appointment Setter follows up on every lead via LinkedIn, email and WhatsApp and puts meetings on your calendar. You only take the calls.",
    // ctaPrimary: "Try for 3 days for €1",
    ctaPrimary: "Try 3 days for €1",
    ctaGhost: "Let us onboard you",
    ticks: [
      // "Try for 3 days for €1",
      "Try 3 days for €1",
      "No setter needed",
      "You stay in control",
    ],
    videoSectionAria: "Product demo video",
    videoPlaceholder: "Video coming soon",
  },
  logos: { title: "Works with the tools you already use" },
  why: {
    label: "Why us",
    title: "We did sales ourselves for years.",
    body: "We know how follow-up works and what moves a lead to yes. That know-how is built into the product.",
    // cta: "Try for 3 days for €1",
    cta: "Try 3 days for €1",
    feats: [
      { title: "Writes like you", text: "Your words, your tone. No robot speak." },
      { title: "Replies within minutes", text: "Even at 11 p.m. and on weekends." },
      { title: "Knows your calendar", text: "Only offers times that are truly free." },
      { title: "You stay in control", text: "Watch every conversation and take over anytime." },
    ],
  },
  channels: {
    label: "How it works",
    title: "Inside the conversation, end to end.",
    subtitle: "One agent. Everywhere your customers are.",
    tabsAria: "How the agent works, step by step",
    panelCta: "Try 3 days for €1",
    /* Legacy channels tabs (LinkedIn / Email / WhatsApp cards):
    label: "Channels",
    title: "One agent. Everywhere your customers are.",
    cards: [ ... ],
    */
    steps: [
      {
        tabLabel: "1 · Reply",
        title: "Reads and replies in your tone",
        text: "It picks up incoming WhatsApp, email, LinkedIn, and other messages and responds the way you would—with your voice and guardrails. One agent. Everywhere your customers are.",
      },
      {
        tabLabel: "2 · Calendar",
        title: "Checks your calendar",
        text: "It reads your real availability and only offers slots that are actually free—no double bookings or back-and-forth about times that do not work.",
      },
      {
        tabLabel: "3 · Book",
        title: "Books the meeting—you stay in control",
        text: "When someone is ready, it schedules the appointment in your calendar. You see every thread and can take over whenever you want.",
      },
    ],
  },
  compare: {
    label: "The difference",
    title: "From chasing leads to only running conversations.",
    noTitle: "If you do nothing",
    yesTitle: "With Appointment Setter",
    noItems: [
      "Leads go cold and choose a competitor",
      "You stay the bottleneck and growth stalls",
      "You pay a setter with no guarantee",
      "Your calendar stays empty despite demand",
      "Your days fill with work AI can handle",
    ],
    yesItems: [
      "Every lead gets followed up",
      "A full calendar",
      "You focus on what matters",
      "No setter needed, lower cost",
      "A more stable business",
    ],
  },
  pricing: {
    title: "Try 3 days for €1",
    mostPopular: "Most popular",
    perMonth: "/ month",
    cta: "Try 3 days for €1",
    paymentNote: "Payment card required",
    footer: {
      cancelAnytime: "Cancel anytime",
      historyIncluded: "30 days of conversation history included",
      needMore: "Need more?",
      contactUs: "Contact us",
    },
  },
  faq: {
    title: "Questions we hear often",
    items: [
      {
        q: "How does the €1 trial work?",
        a: "You use Appointment Setter for 3 days for €1. After that [YOUR PRICE]. Cancel anytime.",
      },
      {
        q: "Is this cheaper than a setter?",
        a: "A setter easily costs €10 to €50 per hour, or €100 per meeting plus bonus. Appointment Setter costs [YOUR PRICE] and works around the clock.",
      },
      {
        q: "Does the AI sound like a robot?",
        a: "No. It writes in your voice and you decide what it may or may not say.",
      },
      {
        q: "Can I watch and take over?",
        a: "Yes. You see every conversation and can jump in anytime.",
      },
      {
        q: "I do not have time to set it up.",
        a: "We will. We onboard you and configure everything for you.",
      },
    ],
  },
  cta: {
    // title: "Try it for 3 days for €1.",
    title: "Try 3 days for €1.",
    sub: "Connect your channels and watch the first meetings land. Prefer us to set it up? We will onboard you.",
    primary: "Start for €1",
    ghost: "Let us onboard you",
    mascotAlt:
      "3D mascot of appointmentsetter.app: a white calendar block with two rings and large black eyes",
  },
  planExtras: { connected: "Connected" },
  manifest: {
    wordsBeforeLogo: [
      "Your",
      "job",
      "is",
      "the",
      "meeting.",
      "Everything",
      "before",
      "that",
      "belongs",
      "to",
    ],
  },
  sections: {
    problemHtml: sections.problemHtml,
    planHtml: sections.planHtml,
    footerHtml: sections.footerHtml,
  },
};
