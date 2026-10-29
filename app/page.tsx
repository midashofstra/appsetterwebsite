import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { en } from "@/lib/i18n/en";
import { localeHomeAlternates } from "@/lib/i18n/site-alternates";

export const metadata: Metadata = {
  title: en.meta.title,
  description: en.meta.description,
  alternates: localeHomeAlternates("/"),
};

export default function HomePage() {
  return <LandingPage locale="en" />;
}
