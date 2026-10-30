"use client";

import Image from "next/image";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { HOW_IT_WORKS_STEP_IMAGE_PX } from "@/lib/how-it-works-tab-visuals";
import type { HowItWorksVisual } from "@/lib/how-it-works-tab-visuals";

type Props = {
  visual: HowItWorksVisual | undefined;
  imageSrc: string | null;
  alt: string;
};

export function HowItWorksStepVisual({ visual, imageSrc, alt }: Props) {
  if (imageSrc) {
    return (
      <div className="bouncy-tabs__item-visual bouncy-tabs__item-visual--photo">
        <Image
          src={imageSrc}
          alt={alt}
          width={HOW_IT_WORKS_STEP_IMAGE_PX}
          height={HOW_IT_WORKS_STEP_IMAGE_PX}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 767px) 100vw, 320px"
          className="bouncy-tabs__item-photo"
          draggable={false}
          onLoad={() => {
            window.dispatchEvent(new Event("resize"));
          }}
        />
      </div>
    );
  }

  return (
    <div className="bouncy-tabs__item-visual">
      {/* Legacy Conversation channel logos (replaced by step-5-conversation photo when imageSrc is set):
      {visual?.kind === "logos" ? (
        <div className="bouncy-tabs__logo-row" aria-hidden>
          {visual.items.map((logo) => (
            <img
              key={logo.src}
              className="bouncy-tabs__item-img bouncy-tabs__item-img--logo"
              src={logo.src}
              alt={logo.alt}
              width={72}
              height={72}
              draggable={false}
            />
          ))}
        </div>
      ) : visual?.kind === "icon" ? (
      */}
      {visual?.kind === "icon" ? (
        <SiteIcon
          icon={visual.icon}
          size={56}
          className="bouncy-tabs__step-icon"
          style={{ color: "var(--icon-fg, #151613)" }}
        />
      ) : null}
    </div>
  );
}
