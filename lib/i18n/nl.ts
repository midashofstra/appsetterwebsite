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
    channels: "De agent",
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
    label: "Zo werkt het",
    title: "Zo voert je agent het gesprek.",
    subtitle: "Eén agent. Overal waar je klanten zijn.",
    tabsAria: "Stappen: zo werkt de agent",
    flowAria: "Flow van lead tot leren",
    panelCta: "Probeer 3 dagen voor €1",
    flowSteps: [
      { label: "Leads vinden", description: "Vind interesse waar je kopers al zitten." },
      { label: "Leads toevoegen", description: "Zet ze in één rij—zonder spreadsheet-gedoe." },
      { label: "Contact", description: "Eerste opvolging in jouw toon, snel." },
      { label: "Gesprek", description: "Heen en weer tot ze klaar zijn." },
      { label: "Afspraak boeken", description: "In je agenda zodra ze ja zeggen." },
      { label: "Leren", description: "Wordt scherper na elk gesprek." },
      { label: "CRM", description: "Notities en context blijven sync." },
    ],
    /* Legacy zes stappen (tab 1):
    flowSteps: [
      { label: "Leads", description: "Nieuwe interesse komt binnen." },
      { label: "Eerste contact", description: "Opvolging in jouw toon, snel." },
      { label: "Gesprek", description: "Heen en weer tot ze klaar zijn." },
      { label: "Afspraak", description: "In je agenda zodra ze ja zeggen." },
      { label: "CRM", description: "Notities en context blijven sync." },
      { label: "Leren", description: "Wordt scherper na elk gesprek." },
    ],
    */
    /* Legacy tab 1 (kanaallogo's — nu tab 4):
    tabLabel: "1 · Antwoord",
    title: "Leest en antwoordt in jouw toon",
    text: "De agent pakt binnenkomende WhatsApp-, e-mail-, LinkedIn-...",
    */
    /* Legacy channels tabs (LinkedIn / E-mail / WhatsApp):
    label: "Kanalen",
    title: "Eén agent. Overal waar je klanten zijn.",
    cards: [ ... ],
    */
    steps: [
      {
        tabLabel: "1 · Leads vinden",
        title: "Zie interesse voordat het afkoelt",
        text: "De agent kijkt waar je kopers al actief zijn—social, inbox en meer—zodat je warme signalen ziet zonder handmatig speuren.",
      },
      {
        tabLabel: "2 · Leads toevoegen",
        title: "Eén rij, geen spreadsheet-gedoe",
        text: "Elke lead komt in één lijst met context erbij. Geen copy-paste, geen losse tabbladen, geen “waar was die DM ook alweer?”",
      },
      {
        tabLabel: "3 · Onderzoek",
        title: "Ken de lead voordat je schrijft",
        text: "De agent zoekt bedrijf, rol en recente signalen op, zodat je eerste zin iets concreets noemt—geen generiek sjabloon.",
      },
      {
        tabLabel: "4 · Contact",
        title: "Eerste opvolging in jouw toon",
        text: "Hij opent het gesprek via WhatsApp, e-mail, LinkedIn en de rest—snel, on-brand en binnen de kaders die jij zet.",
      },
      {
        tabLabel: "5 · Gesprek",
        title: "Leest en antwoordt in jouw toon",
        text: "De agent pakt binnenkomende WhatsApp-, e-mail-, LinkedIn- en andere berichten op en antwoordt zoals jij dat zou doen—in jouw stem en met jouw kaders. Eén agent. Overal waar je klanten zijn.",
      },
      {
        tabLabel: "6 · Afspraak boeken",
        title: "Boekt de afspraak—jij houdt de regie",
        text: "Hij kijkt naar je echte beschikbaarheid, biedt alleen vrije slots aan en plant de afspraak zodra ze ja zeggen. Jij ziet elk gesprek en neemt over wanneer je wilt.",
      },
      {
        tabLabel: "7 · Leren",
        title: "Scherper na elk gesprek",
        text: "Elk thread leert wat werkt—bezwaren, toon die converteert—zodat het volgende antwoord dichter bij jouw manier van schrijven komt.",
      },
      {
        tabLabel: "8 · CRM",
        title: "Notities en context blijven sync",
        text: "Samenvattingen, status en historie gaan terug naar je CRM, zodat je team het verhaal voortzet zonder jou te vragen wat er gebeurde.",
      },
    ],
    /* Legacy vier bouncy tabs (Overzicht / Agenda / Boeken / Kanalen + flow op tab 1):
    steps: [
      { tabLabel: "1 · Overzicht", title: "Van lead tot ingeplande afspraak", text: "..." },
      { tabLabel: "2 · Agenda", title: "Checkt je agenda", text: "..." },
      { tabLabel: "3 · Boeken", title: "Boekt de afspraak—jij houdt de regie", text: "..." },
      { tabLabel: "4 · Kanalen", title: "Leest en antwoordt in jouw toon", text: "..." },
    ],
    */
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
  manifest: {
    wordsBeforeLogo: [
      "Jouw",
      "werk",
      "is",
      "de",
      "afspraak.",
      "Alles",
      "daarvoor",
      "is",
      "van",
    ],
  },
  sections: {
    problemHtml: sections.problemHtml,
    planHtml: sections.planHtml,
    footerHtml: sections.footerHtml,
  },
};
