import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { en } from "@/lib/i18n/en";

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: {
    canonical: "/en/",
    languages: {
      "nl-NL": "/",
      en: "/en/",
    },
  },
};

export default function EnglishHomePage() {
  return <LandingPage locale="en" />;
}
