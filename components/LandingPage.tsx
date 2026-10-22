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

export function LandingPage() {
  return (
    <>
      <SvgDefs />
      <Progress />
      <Header />
      <main id="top">
        <Hero />
        <HeroExtras />
        <Logos />
        <Problem />
        <Manifest />
        <Why />
        <Plan />
        <PlanExtras />
        <Channels />
        <Compare />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <LandingMotion />
    </>
  );
}
