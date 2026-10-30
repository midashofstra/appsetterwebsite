import { getBasePath } from "@/lib/base-path";

/** Plan section book mascot (transparent PNG). */
export const PLAN_BOOK_MASCOT_PATH = "/plan/mascot-book.png";
export const PLAN_BOOK_MASCOT_WIDTH = 1678;
export const PLAN_BOOK_MASCOT_HEIGHT = 1656;
export const PLAN_BOOK_MASCOT_ALT = "Appointment Setter mascot reading";

/** Static markup inside `#plan-mascot-host` (SSG HTML — no client portal). */
export function planBookMascotHostInnerHtml(): string {
  const src = `${getBasePath()}${PLAN_BOOK_MASCOT_PATH}`;
  return `<figure class="plan-book-mascot">
  <img class="plan-book-mascot__img" src="${src}" alt="${PLAN_BOOK_MASCOT_ALT}" width="${PLAN_BOOK_MASCOT_WIDTH}" height="${PLAN_BOOK_MASCOT_HEIGHT}" decoding="async" loading="eager" draggable="false" />
</figure>`;
}
