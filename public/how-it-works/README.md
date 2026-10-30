# How it works — step panel images

Each of the seven bouncy tabs can show a **photo or mockup** in the right-hand tile. Drop one image per step in this folder.

## Filenames (use exactly one file per step)

| Step | File basename (add extension) |
|------|-------------------------------|
| 1 · Find leads | `step-1-find-leads` |
| 2 · Add leads | `step-2-add-leads` |
| 3 · Contact | `step-3-contact` |
| 4 · Conversation | `step-4-conversation` |
| 5 · Book | `step-5-book` |
| 6 · Learn | `step-6-learn` |
| 7 · CRM | `step-7-crm` |

**Extensions (priority order):** `.webp`, `.png`, `.jpg`, `.jpeg`

Examples:

- `step-1-find-leads.webp`
- `step-4-conversation.png`

If no file exists for a step, the site keeps the **Font Awesome icon** fallback (step 4 uses **LinkedIn / Gmail / WhatsApp logos** until you add `step-4-conversation.*`).

## Recommended size

- **Aspect ratio:** **1:1** (square), matching the panel tile (`aspect-ratio: 1`).
- **Pixel size:** **640×640** minimum; **960×960** or **1200×1200** @1x for sharp desktop.
- **Crop:** Important content centered; images use `object-fit: cover` with rounded corners.

## Optional config override

To point at a custom path without using the default slug, set `HOW_IT_WORKS_STEP_IMAGE_OVERRIDES` in `lib/how-it-works-step-images.ts` (per-step URL path).

After adding or replacing files, run **`npm run build`** so static export picks up new assets.
