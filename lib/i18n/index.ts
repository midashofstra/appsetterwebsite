import { en } from "@/lib/i18n/en";
import { nl } from "@/lib/i18n/nl";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export type { Dictionary, Locale, FaqItem } from "@/lib/i18n/types";

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : nl;
}

export function isLocale(value: string): value is Locale {
  return value === "nl" || value === "en";
}
