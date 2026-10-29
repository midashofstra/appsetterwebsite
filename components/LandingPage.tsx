import { LocaleDocument } from "@/components/LocaleDocument";
import { LandingMotion } from "@/components/LandingMotion";
import { Channels } from "@/components/sections/Channels";
import { Compare } from "@/components/sections/Compare";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { HeroExtras } from "@/components/sections/HeroExtras";
import { PlanExtras } from "@/components/sections/PlanExtras";
import { Logos } from "@/components/sections/Logos";
import { Manifest } from "@/components/sections/Manifest";
import { Plan } from "@/components/sections/Plan";
import { Problem } from "@/components/sections/Problem";
import { Progress } from "@/components/sections/Progress";
import { SvgDefs } from "@/components/sections/SvgDefs";
import { Why } from "@/components/sections/Why";
import { MagneticCursorProvider } from "@/components/ui/MagneticCursor";
import { getDictionary, type Locale } from "@/lib/i18n";

export function LandingPage({ locale = "en" }: { locale?: Locale }) {
  const dict = getDictionary(locale);
  return (
    <MagneticCursorProvider>
      <LocaleDocument dict={dict} />
      <SvgDefs />
      <Progress />
      <Header dict={dict} />
      <main id="top">
        <Hero dict={dict} />
        <HeroExtras dict={dict} />
        <Logos dict={dict} />
        <Problem dict={dict} />
        <Manifest dict={dict} />
        <Why dict={dict} />
        <Plan dict={dict} />
        <PlanExtras dict={dict} />
        <Channels dict={dict} />
        <Compare dict={dict} />
        <Faq dict={dict} />
        <Cta dict={dict} />
      </main>
      <Footer dict={dict} />
      <LandingMotion />
    </MagneticCursorProvider>
  );
}
