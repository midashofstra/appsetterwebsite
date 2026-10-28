"use client";

import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { getBasePath } from "@/lib/base-path";
import type { Locale } from "@/lib/i18n/types";

function localeHref(locale: Locale, base: string, hash: string): string {
  const path = locale === "en" ? `${base}/en/` : `${base}/`;
  return `${path.replace(/\/{2,}/g, "/")}${hash}`;
}

export function LangSwitcher({ locale }: { locale: Locale }) {
  const base = getBasePath();
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const nlHref = localeHref("nl", base, hash);
  const enHref = localeHref("en", base, hash);

  return (
    <div className="lang-switch" aria-label="Language">
      <SiteIcon icon={faGlobe} size={16} className="lang-switch-icon" aria-hidden />
      {locale === "nl" ? (
        <>
          <span className="lang-switch-active">NL</span>
          <span className="lang-switch-sep" aria-hidden>
            /
          </span>
          <a href={enHref} className="lang-switch-link" hrefLang="en">
            EN
          </a>
        </>
      ) : (
        <>
          <a href={nlHref} className="lang-switch-link" hrefLang="nl-NL">
            NL
          </a>
          <span className="lang-switch-sep" aria-hidden>
            /
          </span>
          <span className="lang-switch-active">EN</span>
        </>
      )}
    </div>
  );
}
