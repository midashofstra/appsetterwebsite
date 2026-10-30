import type { Locale } from "@/lib/i18n/types";

/**
 * TODO: Replace every PLACEHOLDER value below with real product IDs, Stripe prices,
 * plan names, monthly amounts, and feature lists before launch.
 */

export type PricingPlanId = "starter" | "growth" | "scale";

export type LocalizedString = Record<Locale, string>;

export type PricingFeaturePlaceholder = {
  /** PLACEHOLDER feature copy — swap when plans are final. */
  text: LocalizedString;
  /** Optional PLACEHOLDER tooltip (info icon). */
  info?: LocalizedString;
};

export type PricingPlanPlaceholder = {
  id: PricingPlanId;
  /** PLACEHOLDER — show “Most popular” on this plan in the UI. */
  popular?: boolean;
  /** PLACEHOLDER monthly price in EUR (integer, no cents in UI). */
  priceMonthlyEur: number;
  name: LocalizedString;
  description: LocalizedString;
  features: PricingFeaturePlaceholder[];
};

/** All plan names, prices, and feature bullets are PLACEHOLDER content. */
export const PRICING_PLANS_PLACEHOLDER: PricingPlanPlaceholder[] = [
  {
    id: "starter",
    priceMonthlyEur: 149,
    name: {
      en: "Starter (placeholder)",
      nl: "Starter (placeholder)",
    },
    description: {
      en: "For solo founders testing AI follow-up on one channel.",
      nl: "Voor solo-ondernemers die AI-opvolging op één kanaal willen testen.",
    },
    features: [
      {
        text: {
          en: "1 connected inbox (placeholder)",
          nl: "1 gekoppelde inbox (placeholder)",
        },
      },
      {
        text: {
          en: "Up to 200 active conversations / mo (placeholder)",
          nl: "Tot 200 actieve gesprekken / mnd (placeholder)",
        },
        info: {
          en: "PLACEHOLDER limit — define what counts as an active thread.",
          nl: "PLACEHOLDER-limiet — definieer wat een actief gesprek is.",
        },
      },
      {
        text: {
          en: "LinkedIn or email (placeholder)",
          nl: "LinkedIn of e-mail (placeholder)",
        },
      },
      {
        text: {
          en: "Calendar sync (placeholder)",
          nl: "Agenda-koppeling (placeholder)",
        },
      },
    ],
  },
  {
    id: "growth",
    popular: true,
    priceMonthlyEur: 297,
    name: {
      en: "Growth (placeholder)",
      nl: "Growth (placeholder)",
    },
    description: {
      en: "For teams that want every lead followed up across channels.",
      nl: "Voor teams die elke lead over alle kanalen willen opvolgen.",
    },
    features: [
      {
        text: {
          en: "3 connected inboxes (placeholder)",
          nl: "3 gekoppelde inboxen (placeholder)",
        },
      },
      {
        text: {
          en: "Up to 600 active conversations / mo (placeholder)",
          nl: "Tot 600 actieve gesprekken / mnd (placeholder)",
        },
        info: {
          en: "PLACEHOLDER limit for Growth tier.",
          nl: "PLACEHOLDER-limiet voor Growth.",
        },
      },
      {
        text: {
          en: "LinkedIn, email & WhatsApp (placeholder)",
          nl: "LinkedIn, e-mail & WhatsApp (placeholder)",
        },
      },
      {
        text: {
          en: "Custom tone & guardrails (placeholder)",
          nl: "Eigen toon & guardrails (placeholder)",
        },
      },
      {
        text: {
          en: "Priority onboarding (placeholder)",
          nl: "Prioriteit onboarding (placeholder)",
        },
      },
    ],
  },
  {
    id: "scale",
    priceMonthlyEur: 497,
    name: {
      en: "Scale (placeholder)",
      nl: "Scale (placeholder)",
    },
    description: {
      en: "For agencies and larger sales teams with high volume.",
      nl: "Voor bureaus en grotere salesteams met veel volume.",
    },
    features: [
      {
        text: {
          en: "Unlimited inboxes (placeholder)",
          nl: "Onbeperkte inboxen (placeholder)",
        },
      },
      {
        text: {
          en: "Up to 2,000 active conversations / mo (placeholder)",
          nl: "Tot 2.000 actieve gesprekken / mnd (placeholder)",
        },
        info: {
          en: "PLACEHOLDER — enterprise overage rules TBD.",
          nl: "PLACEHOLDER — enterprise overschrijding nog te bepalen.",
        },
      },
      {
        text: {
          en: "Multi-brand workspaces (placeholder)",
          nl: "Multi-brand workspaces (placeholder)",
        },
      },
      {
        text: {
          en: "Dedicated success manager (placeholder)",
          nl: "Dedicated success manager (placeholder)",
        },
      },
      {
        text: {
          en: "API & webhooks (placeholder)",
          nl: "API & webhooks (placeholder)",
        },
      },
    ],
  },
];

export function getPricingPlansForLocale(locale: Locale) {
  return PRICING_PLANS_PLACEHOLDER.map((plan) => ({
    id: plan.id,
    popular: plan.popular,
    priceMonthlyEur: plan.priceMonthlyEur,
    name: plan.name[locale],
    description: plan.description[locale],
    features: plan.features.map((f) => ({
      text: f.text[locale],
      info: f.info?.[locale],
    })),
  }));
}
