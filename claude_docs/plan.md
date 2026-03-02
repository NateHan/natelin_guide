# natelin_guide — Build Plan

> Last updated after full design interview. All major decisions locked.

---

## Project Overview

A single-page application (SPA) serving as a personal, public-facing travel recommendation guide authored by Nate. Content is food/drink-heavy with coffee, activities, and practical travel tips. The site is shareable, fun in tone, and built to scale from a handful of cities.

---

## Finalized Tech Stack

| Decision       | Choice              | Rationale                                                     |
|----------------|---------------------|---------------------------------------------------------------|
| Framework      | Vite + React        | Comfortable, lightweight, full control over routing + MD pipeline |
| Styling        | Tailwind CSS        | Fast responsive layout, flexible enough for a zine/fun aesthetic |
| Markdown       | gray-matter + marked (or remark) | Parse YAML frontmatter + render MD body |
| Deployment     | Vercel              | Easy GitHub integration, free tier, automatic previews        |
| Routing        | React Router        | Client-side routing for `/` (home) and `/:city` (guide)       |

---

## Visual Design Decisions

- **Vibe:** Fun & personal / zine-like — feels like a recommendation from a friend, not a publication
- **City cards (home page):** Photo-forward — hero image fills the card, city name overlaid
- **Hero images:** Mix of personal photos (committed to `/public/images/`) and Unsplash URLs (referenced in frontmatter)
- **Navigation:** Home screen with city card grid → click to open city guide
- **Responsive:** Fully responsive from day one (mobile + desktop equally)
- **Color/type:** Bold, expressive typography; Tailwind to enforce consistent spacing

---

## Content Structure

### City Guide Sections (fixed order)
1. **Eat**
2. **Coffee** _(separate from Drink — intentional)_
3. **Drink**
4. **Do**
5. **Tips**

### Markdown Format: Hybrid
- **City-level metadata:** YAML frontmatter (title, country, visited, hero image)
- **Spot entries:** `### Spot Name` heading + free-form prose below it
- **Card metadata (neighborhood, price, Maps link):** Written inline naturally in prose — no parsing required
- **Schema enforcement:** Flexible — missing fields are gracefully omitted, no hard errors

### Content File Location
```
natelin_guide/
  content/
    united-kingdom/
      cities/
        london.md
    united-states/
      cities/
        new-york.md
    france/
      cities/
        paris.md
```

---

## Feature Scope

### MVP (build first)
- [x] Landing page with photo-forward city cards grid
- [x] Individual city guide page at `/:city`
- [x] Category tabs (Eat / Coffee / Drink / Do / Tips) per city
- [x] H3-based spot cards with styled prose content
- [x] Google Maps links rendered as inline links in card prose
- [x] Hero image per city (with fallback placeholder)
- [x] Fully responsive layout
- [x] Clean, readable typography (Tailwind prose)

### Post-MVP (nice to have)
- [ ] Deep-link anchor URLs to sections (e.g. `/#eat`)
- [ ] Dark mode toggle
- [ ] Search / filter cities on home page
- [ ] Tags per spot or per city
- [ ] "Last visited" date on city cards

### Out of Scope
- User accounts / authentication
- Admin UI / CMS (Markdown files ARE the CMS)
- Comments, ratings, social features
- Embedded maps (Google Maps inline link per spot is sufficient)

---

## Application Architecture

```
src/
  App.tsx                    # Router setup
  pages/
    Home.tsx                 # City card grid
    CityGuide.tsx            # Renders a single city's MD content
  components/
    CityCard.tsx             # Card on home page (photo, name, country)
    SectionTabs.tsx          # Eat / Coffee / Drink / Do / Tips tab bar
    SpotCard.tsx             # Individual recommendation card (H3 + prose)
  lib/
    parseCity.ts             # gray-matter frontmatter + marked body parser
    getCities.ts             # Loads all city MD files (Vite import.meta.glob)
  content/                   # at project root, NOT inside src/
    {country}/
      cities/
        *.md                 # One file per city (e.g. content/united-kingdom/cities/london.md)
  styles/
    index.css                # Tailwind base + custom overrides
```

### Markdown → Component pipeline
1. **Vite** uses `import.meta.glob('../../content/**/*.md', { query: '?raw', eager: true })` to bundle all MD files at build time
2. **gray-matter** parses the YAML frontmatter into a `CityMeta` object
3. **marked** converts the MD body to HTML synchronously (`marked.use({ async: false })`)
4. **parseCity.ts** splits the body by `## Heading` into sections, then each section by `### Heading` into `Spot[]` objects
5. **React** renders spot cards with `dangerouslySetInnerHTML`; map links get pill styling via CSS `a[href*="maps.google"]`

---

## Markdown File Schema

See `/claude_docs/city-template.md` for the canonical template.

### Frontmatter fields
| Field        | Required | Notes                                      |
|--------------|----------|--------------------------------------------|
| `title`      | Yes      | City display name                          |
| `country`    | Yes      | Country name                               |
| `visited`    | No       | `YYYY-MM` format, shown on city card       |
| `hero_image` | No       | Path (`/images/tokyo.jpg`) or Unsplash URL |
| `tagline`    | No       | One-liner shown on city card               |

---

## Open Questions / Deferred Decisions

1. **Font choice** — what typeface fits the zine/personal vibe? (e.g. Playfair Display, DM Serif, Space Grotesk, or a Google Font)
2. **Color palette** — should each city have a unique accent color, or is there a single site palette?
3. **Placeholder image** — what to show on city cards when no `hero_image` is set?
4. **Tab behavior on mobile** — horizontal scroll tabs or a dropdown selector?
5. **Site domain** — custom domain on Vercel or use the generated `*.vercel.app` URL?
