# appointmentsetter.app — marketing website

Dutch-language landing page for [appointmentsetter.app](https://appointmentsetter.app), an AI appointment setter for LinkedIn, e-mail and WhatsApp.

Built with **Next.js 15** (App Router, TypeScript), static export for **Vercel**, and **GSAP** for scroll and hero animations from the original single-file prototype.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Brand color variants

The default green homepage stays at `/`. Alternative primaries for review:

| Route | Primary |
|-------|---------|
| [/kleur](http://localhost:3000/kleur) | Overview with swatches |
| `/kleur/ff0048` | `#FF0048` |
| `/kleur/ff3b00` | `#FF3B00` |
| `/kleur/acff00` | `#ACFF00` |
| `/kleur/00f13e` | `#00F13E` |
| `/kleur/00db77` | `#00DB77` |
| `/kleur/00be58` | `#00BE58` |

Each variant wraps the same landing page in a `ThemeRoot` that overrides CSS variables (`--g`, `--g-soft`, `--g-mid`, `--g-ink`, `--g-border`, `--btn-main-fg`, `--cta-sub`).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production static export |
| `npm run lint` | ESLint (Next.js config)  |
| `npm start`    | Serve production build   |

## Project structure

```
app/
  layout.tsx       # Metadata, Figtree font, global `gs` class for animations
  page.tsx         # Composes landing sections
  globals.css      # Styles from the prototype (CSS variables, layout, motion)
  icon.svg         # Favicon / app icon
components/
  LandingAnimations.tsx   # Client-side GSAP + scroll behavior
  sections/               # One component per page section (header, hero, FAQ, …)
lib/
  landing-animations.ts   # Animation logic ported from the prototype
public/
  prototype-reference.html  # Original single-file design reference
```

Section components preserve the prototype markup (including inline SVGs and data-URI icons) for visual parity. Iterating on copy or layout can be done per file under `components/sections/`.

## Deploy

The site uses `output: "export"` in `next.config.ts`. Deploy the repo to Vercel as a standard Next.js project; the build output is static HTML in `out/`.
