import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { nl } from "@/lib/i18n/nl";

export const metadata: Metadata = {
  title: nl.meta.title,
  description: nl.meta.description,
  alternates: {
    canonical: "/",
    languages: {
      "nl-NL": "/",
      en: "/en/",
    },
  },
};

export default function HomePage() {
  return <LandingPage locale="nl" />;
}
