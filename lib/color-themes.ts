export type ColorVariant = {
  slug: string;
  primary: string;
  label: string;
};

/** Alternate brand primaries (home `/` keeps default green in :root). */
export const COLOR_VARIANTS: ColorVariant[] = [
  { slug: "ff0048", primary: "#FF0048", label: "#FF0048" },
  { slug: "ff3b00", primary: "#FF3B00", label: "#FF3B00" },
  { slug: "acff00", primary: "#ACFF00", label: "#ACFF00" },
  { slug: "00f13e", primary: "#00F13E", label: "#00F13E" },
  { slug: "00db77", primary: "#00DB77", label: "#00DB77" },
  { slug: "00be58", primary: "#00BE58", label: "#00BE58" },
];

export const DEFAULT_PRIMARY = "#8BF15B";

type Rgb = { r: number; g: number; b: number };

function parseHex(hex: string): Rgb {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: Rgb, bg: Rgb): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const INK = parseHex("#151613");
const WHITE = parseHex("#FFFFFF");

/** Derive related brand tokens from a primary hex color. */
export function deriveThemeTokens(primary: string) {
  const base = parseHex(primary);

  const gSoft = rgbToHex(mix(base, WHITE, 0.9));
  const gMid = rgbToHex(mix(base, WHITE, 0.72));
  const gBorder = rgbToHex(mix(base, INK, 0.14));
  const gInk = rgbToHex(mix(base, INK, 0.78));
  const ctaSub = rgbToHex(mix(parseHex(gInk), INK, 0.35));

  const onPrimaryInk = contrastRatio(INK, base);
  const onPrimaryWhite = contrastRatio(WHITE, base);
  const btnMainFg =
    onPrimaryInk >= 4.5
      ? "#151613"
      : onPrimaryWhite >= 4.5
        ? "#FFFFFF"
        : onPrimaryWhite >= onPrimaryInk
          ? "#FFFFFF"
          : "#151613";

  return {
    "--g": primary.toUpperCase(),
    "--g-soft": gSoft,
    "--g-mid": gMid,
    "--g-border": gBorder,
    "--g-ink": gInk,
    "--cta-sub": ctaSub,
    "--btn-main-fg": btnMainFg,
  } as const;
}

export function getVariantBySlug(slug: string): ColorVariant | undefined {
  return COLOR_VARIANTS.find((v) => v.slug === slug.toLowerCase());
}

export function themeStyleFromPrimary(
  primary: string,
): Record<string, string> {
  return { ...deriveThemeTokens(primary) };
}
