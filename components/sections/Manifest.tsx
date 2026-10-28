import type { Dictionary } from "@/lib/i18n/types";

export function Manifest({ dict }: { dict: Dictionary }) {
  return <div dangerouslySetInnerHTML={{ __html: dict.sections.manifestHtml }} />;
}
