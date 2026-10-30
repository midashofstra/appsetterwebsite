import * as sections from "@/lib/i18n/nl-sections";
import type { Dictionary } from "@/lib/i18n/types";

export const nl: Dictionary = {
  locale: "nl",
  htmlLang: "nl",
  meta: {
    title: "Appointment Setter | AI appointment setter voor LinkedIn, e-mail en WhatsApp",
    description:
      "Een AI-agent die je leads opvolgt via LinkedIn, e-mail en WhatsApp en afspraken direct in je agenda plant.",
  },
  alternates: { nl: "/nl/", en: "/" },
  nav: {
    aria: "Hoofdmenu",
    brand: "Appointment Setter",
    problem: "Probleem",
    why: "Waarom wij",
    plan: "Hoe het werkt",
    channels: "Kanalen",
    pricing: "Prijzen",
    faq: "Vragen",
    cta: "Probeer voor €1",
  },
  hero: {
    words: ["Laat", "je", "vullen,", "direct vanuit"],
    mascotAria: "appointmentsetter",
    agendaDeckAria: "Google Agenda en Outlook",
    channelDeckAria: "LinkedIn, Gmail, WhatsApp en Outlook",
    sub: "Appointment Setter volgt elke lead op via LinkedIn, e-mail en WhatsApp en zet de afspraken in je agenda. Jij voert alleen nog de gesprekken.",
    ctaPrimary: "Probeer 3 dagen voor €1",
    ctaGhost: "Laat ons je onboarden",
    ticks: ["3 dagen proberen voor €1", "Geen setter meer nodig", "Jij kijkt altijd mee"],
    videoSectionAria: "Productdemo video",
    videoPlaceholder: "Video volgt",
  },
  logos: { title: "Werkt met de tools die je al gebruikt" },
  why: {
    label: "Waarom wij",
    title: "We deden zelf jarenlang sales.",
    body: "We weten hoe opvolgen werkt en wat een lead over de streep trekt. Die kennis zit nu in de tool.",
    cta: "Probeer 3 dagen voor €1",
    feats: [
      { title: "Schrijft zoals jij", text: "Jouw woorden, jouw stijl. Geen robottaal." },
      { title: "Antwoordt binnen minuten", text: "Ook om 23:00 en in het weekend." },
      { title: "Kent je agenda", text: "Biedt alleen tijden aan die echt vrij zijn." },
      { title: "Jij houdt de regie", text: "Kijk mee in elk gesprek en neem over wanneer je wilt." },
    ],
  },
  channels: {
    label: "Kanalen",
    title: "Eén agent. Overal waar je klanten zijn.",
    tabsAria: "Communicatiekanalen",
    panelCta: "Probeer 3 dagen voor €1",
    cards: [
      {
        title: "LinkedIn",
        text: "Reageert op connecties en antwoorden, en stuurt het gesprek richting een afspraak.",
      },
      {
        title: "E-mail",
        text: "Volgt op na een offerte of formulier, op het juiste moment, zonder te pushen.",
      },
      {
        title: "WhatsApp",
        text: "Snel en persoonlijk. Precies waar je leads het liefst antwoorden.",
      },
    ],
  },
  compare: {
    label: "Het verschil",
    title: "Van achter leads aanrennen naar alleen nog gesprekken voeren.",
    noTitle: "Als je niks doet",
    yesTitle: "Met Appointment Setter",
    noItems: [
      "Leads koelen af en gaan naar je concurrent",
      "Je blijft de bottleneck en je groei stopt",
      "Je betaalt een setter, zonder garantie op resultaat",
      "Je agenda blijft leeg terwijl er genoeg kansen zijn",
      "Je dagen zitten vol werk dat AI ook kan",
    ],
    yesItems: [
      "Elke lead wordt opgevolgd",
      "Een volle agenda",
      "Jij bent bezig met wat ertoe doet",
      "Geen setter meer nodig, dus lagere kosten",
      "Een stabielere business",
    ],
  },
  pricing: {
    title: "Probeer 3 dagen voor €1",
    mostPopular: "Meest gekozen",
    perMonth: "/ maand",
    cta: "Probeer 3 dagen voor €1",
    paymentNote: "Betaalkaart vereist",
    footer: {
      cancelAnytime: "Altijd opzegbaar",
      historyIncluded: "30 dagen gespreksgeschiedenis inbegrepen",
      needMore: "Meer nodig?",
      contactUs: "Neem contact op",
    },
  },
  faq: {
    title: "Vragen die we vaak krijgen",
    items: [
      {
        q: "Hoe werkt de proef van €1?",
        a: "Je gebruikt Appointment Setter 3 dagen voor €1. Daarna [JOUW PRIJS]. Stoppen kan altijd.",
      },
      {
        q: "Is dit goedkoper dan een setter?",
        a: "Een setter kost al snel €10 tot €50 per uur, of €100 per afspraak plus bonus. Appointment Setter kost [JOUW PRIJS] en werkt dag en nacht.",
      },
      {
        q: "Klinkt de AI als een robot?",
        a: "Nee. Hij schrijft in jouw toon en jij bepaalt wat hij wel en niet zegt.",
      },
      {
        q: "Kan ik meekijken en zelf overnemen?",
        a: "Ja. Je ziet elk gesprek en kunt op elk moment zelf verder.",
      },
      {
        q: "Ik heb geen tijd om het in te stellen.",
        a: "Dan doen wij het. We onboarden je en zetten alles voor je klaar.",
      },
    ],
  },
  cta: {
    title: "Probeer het 3 dagen voor €1.",
    sub: "Koppel je kanalen en zie de eerste afspraken binnenkomen. Liever dat wij het instellen? Dan onboarden we je.",
    primary: "Start voor €1",
    ghost: "Laat ons je onboarden",
    mascotAlt:
      "3D-mascotte van appointmentsetter.app: een wit kalenderblok met twee ringen en grote zwarte ogen",
  },
  planExtras: { connected: "Gekoppeld" },
  sections: {
    problemHtml: sections.problemHtml,
    manifestHtml: sections.manifestHtml,
    planHtml: sections.planHtml,
    footerHtml: sections.footerHtml,
  },
};
