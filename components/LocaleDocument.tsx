"use client";

import { useEffect } from "react";
import type { Dictionary } from "@/lib/i18n/types";

/** Sets document language for / vs /en/ (root layout html lang defaults to nl). */
export function LocaleDocument({ dict }: { dict: Dictionary }) {
  useEffect(() => {
    document.documentElement.lang = dict.htmlLang;
  }, [dict.htmlLang]);
  return null;
}
