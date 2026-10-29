"use client";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { HeroVimeoPlayer } from "@/components/sections/HeroVimeoPlayer";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { getBasePath } from "@/lib/base-path";
import { VIDEO_POSTER, VIMEO_VIDEO_ID } from "@/lib/hero-video-config";
import type { Dictionary } from "@/lib/i18n/types";

function resolveMediaUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBasePath();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function HeroVideo({ dict }: { dict: Dictionary }) {
  const poster = resolveMediaUrl(VIDEO_POSTER);
  const hasVimeo = Boolean(VIMEO_VIDEO_ID);

  return (
    <section className="hero-video" id="hero-demo" aria-label={dict.hero.videoSectionAria}>
      <div className="wrap">
        <div className={`hero-video__frame${hasVimeo ? " hero-video__frame--vimeo" : ""}`}>
          {hasVimeo ? (
            <HeroVimeoPlayer
              videoId={VIMEO_VIDEO_ID}
              posterUrl={poster}
              placeholderLabel={dict.hero.videoPlaceholder}
              autoplay={false}
              updateSize
            />
          ) : (
            <div className="hero-video__placeholder" aria-hidden="true">
              <span className="hero-video__placeholder-icon">
                <SiteIcon icon={faPlay} size={28} style={{ color: "var(--g-ink)" }} />
              </span>
              <p className="hero-video__placeholder-text">{dict.hero.videoPlaceholder}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
