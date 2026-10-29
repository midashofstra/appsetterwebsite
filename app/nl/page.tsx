import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { nl } from "@/lib/i18n/nl";
import { localeHomeAlternates } from "@/lib/i18n/site-alternates";

export const metadata: Metadata = {
  title: nl.meta.title,
  description: nl.meta.description,
  alternates: localeHomeAlternates("/nl/"),
};

export default function DutchHomePage() {
  return <LandingPage locale="nl" />;
}
