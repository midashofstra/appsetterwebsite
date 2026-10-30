/**
 * Hero demo video — Vimeo (preferred) or legacy file under `public/`.
 */

/** Osmo demo clip until our upload is ready; override with `NEXT_PUBLIC_VIMEO_VIDEO_ID`. */
export const VIMEO_VIDEO_ID_DEFAULT = "1019191082";

export const VIMEO_VIDEO_ID = (
  process.env.NEXT_PUBLIC_VIMEO_VIDEO_ID ?? VIMEO_VIDEO_ID_DEFAULT
).trim();

/** Optional poster (path under `public/` or HTTPS). Empty = Vimeo thumbnail for `VIMEO_VIDEO_ID`. */
export const VIDEO_POSTER = "";

export function vimeoThumbnailUrl(videoId: string): string {
  return `https://vumbnail.com/${videoId}.jpg`;
}

/** Legacy MP4 — superseded by Vimeo when `VIMEO_VIDEO_ID` is set. */
export const VIDEO_SRC = "";
