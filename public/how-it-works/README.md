# How it works — step panel images

Each of the **eight** bouncy tabs can show a **photo or mockup** in the right-hand tile. Drop one image per step in this folder.

## Filenames (use exactly one file per step)

| Step | Tab label (EN) | File basename (add extension) |
|------|----------------|--------------------------------|
| 1 | Find leads | `step-1-find-leads` |
| 2 | Add leads | `step-2-add-leads` |
| 3 | Research | `step-3-research` |
| 4 | Contact | `step-4-contact` |
| 5 | Conversation | `step-5-conversation` |
| 6 | Meeting | `step-6-meeting` |
| 7 | Learn | `step-7-learn` |
| 8 | CRM | `step-8-crm` |

**Extensions (priority order):** `.webp`, `.png`, `.jpg`, `.jpeg`

Examples:

- `step-1-find-leads.webp`
- `step-3-research.jpg`
- `step-6-meeting.png`

If no file exists for a step, the site keeps the **Font Awesome icon** fallback (Conversation uses **LinkedIn / Gmail / WhatsApp logos** until `step-5-conversation.*` is added).

### Legacy filenames

These still resolve to the correct step if the new name is missing:

| Old file | Maps to step |
|----------|----------------|
| `step-3-contact.*` | 4 · Contact |
| `step-4-conversation.*` | 5 · Conversation |
| `step-6-book.*` | 6 · Meeting |
| `step-5-book.*` | 6 · Meeting (pre–Research layout) |
| `step-6-learn.*` | 7 · Learn |
| `step-7-crm.*` | 8 · CRM |

<!-- Legacy step 6 basename before Meeting rename: `step-6-book` -->

Renaming to the current `step-N-…` names above is recommended for clarity.

## Recommended size

- **Aspect ratio:** **1:1** (square), matching the panel tile (`aspect-ratio: 1`).
- **Pixel size:** **640×640** minimum; **960×960** or **1200×1200** @1x for sharp desktop.
- **Crop:** Important content centered; images use `object-fit: cover` with rounded corners.

## Optional config override

To point at a custom path without using the default slug, set `HOW_IT_WORKS_STEP_IMAGE_OVERRIDES` in `lib/how-it-works-step-images.ts` (per-step URL path).

After adding or replacing files, run **`npm run build`** so static export picks up new assets.
