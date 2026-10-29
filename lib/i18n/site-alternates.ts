import type { Metadata } from "next";

/** hreflang + canonical for locale home pages (x-default = English `/`). */
export function localeHomeAlternates(canonical: "/" | "/nl/"): Metadata["alternates"] {
  return {
    canonical,
    languages: {
      en: "/",
      "nl-NL": "/nl/",
      "x-default": "/",
    },
  };
}
