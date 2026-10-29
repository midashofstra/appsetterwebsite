export type Locale = "nl" | "en";

export type FaqItem = { q: string; a: string };

export type Dictionary = {
  locale: Locale;
  htmlLang: string;
  meta: { title: string; description: string };
  alternates: { nl: string; en: string };
  nav: {
    aria: string;
    brand: string;
    problem: string;
    why: string;
    plan: string;
    channels: string;
    faq: string;
    cta: string;
  };
  hero: {
    /** NL: 4 segments (text before/after each tile group). EN: 3 (no word after agenda deck). */
    words: readonly string[];
    mascotAria: string;
    agendaDeckAria: string;
    channelDeckAria: string;
    sub: string;
    ctaPrimary: string;
    ctaGhost: string;
    ticks: [string, string, string];
    videoSectionAria: string;
    videoPlaceholder: string;
  };
  logos: { title: string };
  why: {
    label: string;
    title: string;
    body: string;
    cta: string;
    feats: { title: string; text: string }[];
  };
  channels: {
    label: string;
    title: string;
    cards: { title: string; text: string }[];
  };
  compare: {
    label: string;
    title: string;
    noTitle: string;
    yesTitle: string;
    noItems: string[];
    yesItems: string[];
  };
  faq: { title: string; items: FaqItem[] };
  cta: {
    title: string;
    sub: string;
    primary: string;
    ghost: string;
    mascotAlt: string;
  };
  planExtras: { connected: string };
  sections: {
    problemHtml: string;
    manifestHtml: string;
    planHtml: string;
    footerHtml: string;
  };
};
