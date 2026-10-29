/**
 * Hero demo video — Vimeo (preferred) or legacy file under `public/`.
 */

/** TODO: set `NEXT_PUBLIC_VIMEO_VIDEO_ID` in env when the Vimeo upload is ready. */
export const VIMEO_VIDEO_ID = (process.env.NEXT_PUBLIC_VIMEO_VIDEO_ID ?? "").trim();

/** Optional poster image (path under `public/` or HTTPS URL). Used as Vimeo placeholder. */
export const VIDEO_POSTER = "";

/** Legacy MP4 — superseded by Vimeo when `VIMEO_VIDEO_ID` is set. */
export const VIDEO_SRC = "";
