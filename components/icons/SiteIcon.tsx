import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { CSSProperties } from "react";

type SiteIconProps = {
  icon: IconDefinition;
  size?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/** Font Awesome icon sized to match legacy inline SVGs (uses currentColor). */
export function SiteIcon({ icon, size = 20, className, style, title }: SiteIconProps) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      title={title}
      style={{ width: size, height: size, display: "block", ...style }}
    />
  );
}
