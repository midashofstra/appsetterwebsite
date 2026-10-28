"use client";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { getBasePath } from "@/lib/base-path";
import { VIDEO_POSTER, VIDEO_SRC } from "@/lib/hero-video-config";

function resolveMediaUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBasePath();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function HeroVideo() {
  const src = resolveMediaUrl(VIDEO_SRC);
  const poster = resolveMediaUrl(VIDEO_POSTER);

  return (
    <section className="hero-video" id="hero-demo" aria-label="Productdemo video">
      <div className="wrap">
        <div className="hero-video__frame">
          {src ? (
            <video
              className="hero-video__player"
              src={src}
              controls
              playsInline
              preload="metadata"
              poster={poster || undefined}
            />
          ) : (
            <div className="hero-video__placeholder" aria-hidden="true">
              <span className="hero-video__placeholder-icon">
                <SiteIcon icon={faPlay} size={28} style={{ color: "var(--g-ink)" }} />
              </span>
              <p className="hero-video__placeholder-text">Video volgt</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
