import type { Dictionary } from "@/lib/i18n/types";

export function Plan({ dict }: { dict: Dictionary }) {
  return <div dangerouslySetInnerHTML={{ __html: dict.sections.planHtml }} />;
}
