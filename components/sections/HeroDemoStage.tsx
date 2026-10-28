import { HERO_STAGE_LEGACY_HTML } from "@/lib/hero-stage-legacy-html";

/** Legacy animated inbox demo (hidden from page; kept for restore). */
export function HeroDemoStage() {
  return <div dangerouslySetInnerHTML={{ __html: HERO_STAGE_LEGACY_HTML }} />;
}
