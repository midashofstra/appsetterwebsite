import type { Metadata } from "next";
import { EnLegacyRedirect } from "@/app/en/EnLegacyRedirect";

export const metadata: Metadata = {
  title: "Redirecting…",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

export default function EnglishLegacyPathPage() {
  return <EnLegacyRedirect />;
}
