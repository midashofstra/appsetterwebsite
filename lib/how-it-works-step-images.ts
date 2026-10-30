import fs from "fs";
import path from "path";
import { HOW_IT_WORKS_STEP_IMAGE_SLUGS } from "@/lib/how-it-works-tab-visuals";

const IMAGE_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"] as const;

function publicBasePath(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  if (!raw) return "";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized.replace(/\/$/, "");
}

/**
 * Optional hard-coded paths (with or without basePath). When set, skips filesystem lookup for that step.
 * Example: "/how-it-works/step-4-conversation.webp"
 */
export const HOW_IT_WORKS_STEP_IMAGE_OVERRIDES: (string | undefined)[] = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];

/** Resolve image URL per step at build time (static export). Null → use icon/logo fallback. */
export function resolveHowItWorksStepImageSrcs(): (string | null)[] {
  const base = publicBasePath();
  const dir = path.join(process.cwd(), "public", "how-it-works");

  return HOW_IT_WORKS_STEP_IMAGE_SLUGS.map((slug, i) => {
    const override = HOW_IT_WORKS_STEP_IMAGE_OVERRIDES[i];
    if (override) {
      return override.startsWith("http") ? override : `${base}${override.startsWith("/") ? override : `/${override}`}`;
    }

    for (const ext of IMAGE_EXTENSIONS) {
      const filePath = path.join(dir, `${slug}${ext}`);
      if (fs.existsSync(filePath)) {
        return `${base}/how-it-works/${slug}${ext}`;
      }
    }
    return null;
  });
}
