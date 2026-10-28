import type { Dictionary } from "@/lib/i18n/types";

export function Footer({ dict }: { dict: Dictionary }) {
  return <div dangerouslySetInnerHTML={{ __html: dict.sections.footerHtml }} />;
}
