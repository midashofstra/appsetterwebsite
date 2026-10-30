import fs from "fs";
import path from "path";
import {
  HOW_IT_WORKS_STEP_IMAGE_LEGACY_SLUGS,
  HOW_IT_WORKS_STEP_IMAGE_SLUGS,
} from "@/lib/how-it-works-tab-visuals";

const IMAGE_EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"] as const;

function publicBasePath(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  if (!raw) return "";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  return normalized.replace(/\/$/, "");
}

/**
 * Optional hard-coded paths (with or without basePath). When set, skips filesystem lookup for that step.
 * Example: "/how-it-works/step-5-conversation.webp"
 */
export const HOW_IT_WORKS_STEP_IMAGE_OVERRIDES: (string | undefined)[] = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];

function findImageForSlug(dir: string, slug: string): string | null {
  for (const ext of IMAGE_EXTENSIONS) {
    const filePath = path.join(dir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      return `${slug}${ext}`;
    }
  }
  return null;
}

/** Resolve image URL per step at build time (static export). Null → use icon/logo fallback. */
export function resolveHowItWorksStepImageSrcs(): (string | null)[] {
  const base = publicBasePath();
  const dir = path.join(process.cwd(), "public", "how-it-works");

  return HOW_IT_WORKS_STEP_IMAGE_SLUGS.map((slug, i) => {
    const override = HOW_IT_WORKS_STEP_IMAGE_OVERRIDES[i];
    if (override) {
      return override.startsWith("http") ? override : `${base}${override.startsWith("/") ? override : `/${override}`}`;
    }

    const candidates = [slug, ...(HOW_IT_WORKS_STEP_IMAGE_LEGACY_SLUGS[i] ?? [])];
    for (const candidate of candidates) {
      const match = findImageForSlug(dir, candidate);
      if (match) {
        return `${base}/how-it-works/${match}`;
      }
    }
    return null;
  });
}
