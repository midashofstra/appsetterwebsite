import Image from "next/image";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { WhyFeatureCard } from "@/components/sections/WhyFeatureCard";

const BENEFITS_PHOTO = {
  src: "/benefits-photo.jpg",
  width: 795,
  height: 795,
  alt: "Appointment Setter working while you relax",
} as const;

type Feat = { title: string; text: string };

export function WhyBenefitsShowcase({
  feats,
  icons,
}: {
  feats: Feat[];
  icons: readonly IconDefinition[];
}) {
  return (
    <div className="why-showcase rv">
      {feats.map(({ title, text }, i) => (
        <WhyFeatureCard
          key={title}
          icon={icons[i]!}
          title={title}
          text={text}
          className={`why-showcase__feat why-showcase__feat--${i + 1}`}
        />
      ))}

      <figure className="why-showcase__photo rv d1">
        <Image
          src={BENEFITS_PHOTO.src}
          alt={BENEFITS_PHOTO.alt}
          width={BENEFITS_PHOTO.width}
          height={BENEFITS_PHOTO.height}
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 45vw, 380px"
          className="why-showcase__img"
        />
      </figure>
    </div>
  );
}
