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
    pricing: string;
    faq: string;
    cta: string;
  };
  hero: {
    /** NL: 4 segments (Laat, je, vullen,, direct vanuit). EN: 3 (Let, fill your, straight from). */
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
    subtitle: string;
    tabsAria: string;
    panelCta: string;
    steps: { tabLabel: string; title: string; text: string }[];
  };
  compare: {
    label: string;
    title: string;
    noTitle: string;
    yesTitle: string;
    noItems: string[];
    yesItems: string[];
  };
  pricing: {
    title: string;
    mostPopular: string;
    perMonth: string;
    cta: string;
    paymentNote: string;
    footer: {
      cancelAnytime: string;
      historyIncluded: string;
      needMore: string;
      contactUs: string;
    };
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
  manifest: { wordsBeforeLogo: string[] };
  sections: {
    problemHtml: string;
    planHtml: string;
    footerHtml: string;
  };
};
