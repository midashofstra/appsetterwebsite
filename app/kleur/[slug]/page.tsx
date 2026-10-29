import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { ThemeRoot } from "@/components/ThemeRoot";
import { COLOR_VARIANTS, getVariantBySlug } from "@/lib/color-themes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return COLOR_VARIANTS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const variant = getVariantBySlug(slug);
  if (!variant) return {};
  return {
    title: `Kleur ${variant.label} | appointmentsetter.app`,
    description: `Landing page preview with primary brand color ${variant.label}.`,
  };
}

export default async function KleurVariantPage({ params }: PageProps) {
  const { slug } = await params;
  const variant = getVariantBySlug(slug);
  if (!variant) notFound();

  return (
    <ThemeRoot primary={variant.primary}>
      <LandingPage locale="en" />
    </ThemeRoot>
  );
}
