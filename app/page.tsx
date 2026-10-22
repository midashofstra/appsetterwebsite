import { LandingAnimations } from "@/components/LandingAnimations";
import { Channels } from "@/components/sections/Channels";
import { Compare } from "@/components/sections/Compare";
import { Cta } from "@/components/sections/Cta";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Logos } from "@/components/sections/Logos";
import { Manifest } from "@/components/sections/Manifest";
import { Plan } from "@/components/sections/Plan";
import { Problem } from "@/components/sections/Problem";
import { Progress } from "@/components/sections/Progress";
import { SvgDefs } from "@/components/sections/SvgDefs";
import { Why } from "@/components/sections/Why";

export default function HomePage() {
  return (
    <>
      <SvgDefs />
      <Progress />
      <Header />
      <main id="top">
        <Hero />
        <Logos />
        <Problem />
        <Manifest />
        <Why />
        <Plan />
        <Channels />
        <Compare />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <LandingAnimations />
    </>
  );
}
