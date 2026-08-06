# St. Gianna Medical Group — Homepage Rebuild (Next.js)

Date: 2026-08-06
Status: Approved
Scope: Homepage only (`sgmdoctor.com` landing page). Other pages/routes are out of scope for this spec.

## Goal

Rebuild the supplied prototype export ("St Gianna Medical Group - Homepage (1).html") as a production Next.js site.
**The rendered result must look exactly like the source file** — same copy, same layout, same colors, same photos/video/logo, same motion. On top of that exact baseline we add: a Back to Top button, scroll-reveal + parallax animation, a working dark/light mode toggle, and full mobile/tablet/desktop responsiveness (the source has none).

## Source file analysis

The supplied HTML is not plain markup — it's a self-extracting bundle (a "publisher" export) that unpacks a JSON manifest of base64 assets and a JSON-encoded HTML template at runtime via `<script type="__bundler/manifest">` / `<script type="__bundler/template">` tags. It was reverse-engineered by:
1. Extracting and decoding the manifest (`docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/`) — every image/video/font is real, embedded binary data, not a remote link.
2. Extracting and decoding the template string (`docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/source-template.html`) — contains the exact CSS (custom properties, keyframes) and HTML structure, plus the original React component's render logic (which resolves each `image-slot` and the hero `<video>` to a specific asset).
3. Cross-referencing `<script type="__bundler/ext_resources">`, which maps each embedded asset's Pexels photo ID to its manifest UUID — this is how each of the 5 stock photos was matched to its exact section.

Nothing here is placeholder guesswork: every asset-to-section mapping below comes directly from the source's own code.

## Content inventory (reuse verbatim, no rewriting)

Sections, top to bottom:
1. **Nav** — logo, Home / Services / Locations / Call us / Light mode (theme toggle) links, "Book a visit" pill CTA. Nav has a gooey SVG-filter "blob" that morphs to the hovered item.
2. **Hero** — full-bleed looped/muted background video with a slow continuous zoom, gradient + scanline overlay, eyebrow ("Los Angeles · Pediatric & family medicine"), headline "Care that keeps up with childhood.", subcopy, 3 stats (3 LA clinics / 24/7 booking / 4.9 parent rating), scroll-hint indicator.
3. **Ticker** — infinite marquee of 6 pills (Same-day appointments, 24/7 online booking, Telehealth tonight, Most HMO & IPA plans, Board-certified pediatricians, One chart three clinics), duplicated for seamless loop.
4. **Services ("What we do")** — 6 numbered rows (Well-child & physicals, Same-day sick visits, Telehealth, Advanced wound care, Immunizations, Chronic care), each linking to `#book`, with a hover preview photo (doctor portrait, Pexels id 4173251).
5. **Why us** — headline + 4 feature cards (Same-day slots / Book at 2am / One chart everywhere / Insurance handled), each with its own icon.
6. **Locations ("Three doors across the city")** — 3 hoverable panels: Santa Monica (hospital hallway photo), Hollywood (counseling session photo), La Mirada (pediatric checkup photo). Each shows status ("Open now"/"Opens 9am") with a pulsing live dot, address, phone, hours.
7. **Partners ("We never treat your family alone")** — 5 rows: KT Doctor (doctor portrait photo), Serendib Health (counseling photo), Pediatric After Hours (pediatric checkup photo), LAIPT (physical therapy photo), HMO & IPA plans (hospital hallway photo).
8. **Journal teaser** — 1 article card with physical-therapy photo background, "5 min read", "10 essential habits for a healthier family year".
9. **CTA band** — "Ready when your family is." + Book online + phone link.
10. **Footer** — logo, tagline, Explore / Patients / Contact link columns, 3 clinic phone numbers, contact email, copyright, Privacy/Terms/Accessibility.

All addresses, phone numbers, hours, and partner names are reused exactly as-is from the source (not altered, even where they look like placeholder data).

## Asset inventory (already extracted — real files, not links)

| File (in this spec folder) | Source Pexels ID | Used for |
|---|---|---|
| `media/logo-dark-theme.png` | — | Nav + footer logo, dark theme |
| `media/logo-light-theme.png` | — | Nav + footer logo, light theme |
| `media/hero-background.mp4` | — | Hero background video |
| `media/photo-doctor-portrait.jpg` | 4173251 | Services hover-preview photo + "KT Doctor" partner |
| `media/photo-hospital-hallway.jpg` | 127873 | Santa Monica location + "HMO & IPA plans" partner |
| `media/photo-counseling-session.jpg` | 4098152 | Hollywood location + "Serendib Health" partner |
| `media/photo-pediatric-checkup.jpg` | 8460047 | La Mirada location + "Pediatric After Hours" partner |
| `media/photo-physical-therapy.jpg` | 5794058 | Journal article background + "LAIPT" partner |

During implementation these move into `public/images/` under descriptive final names (already named descriptively above).

**Fonts:** body/heading font is "Hanken Grotesk" (confirmed via `@font-face` in the source) — self-hosted through `next/font/google`, no runtime request to any external URL.

**Icons:** source uses Google's "Material Symbols Outlined" as a 3.9MB icon webfont via ligatures (`home`, `stethoscope`, `near_me`, `call`, `light_mode`/`dark_mode`, `arrow_outward`, `bolt`, `schedule`, `sync_alt`, `verified`, `hub`, `biotech`, `nightlight`, `sports_gymnastics`, `verified_user` — 15 glyphs total). Rebuilt as individual inline SVG React components matching the exact Material Symbols Outlined glyph shapes, instead of shipping a multi-megabyte font for 15 icons.

## Visual spec (exact values, from the decoded source CSS)

Captured in `source-template.html` in this folder — colors, spacing, and keyframes are transcribed 1:1 from there during implementation, not re-guessed. Key tokens:

- Dark theme (default): `--bg:#06161C; --bg-2:#0B2229; --ink:#EAF4F3; --ink-2:#C6D9D9; --muted:#9FB6B8; --line:rgba(255,255,255,.09)` (+ more, see source)
- Light theme: `--bg:#F5F8F7; --bg-2:#FFFFFF; --ink:#0A2540; --ink-2:#33474A; --muted:#5A6C6C; --line:rgba(10,37,64,.12)`
- Link color `#4FC3C2`, hover `#9BE7E5`
- Existing keyframes to reproduce exactly: `slowZoom` (hero video, 1.04→1.16 scale over 26s alternate), `marquee` (ticker, translateX 0→-50%), `scrollHint` (bounce/fade), `livePulse` (open-now dot, opacity 1↔.25)

## Architecture

- **Next.js 14, App Router, TypeScript.**
- `app/` — `layout.tsx` (fonts, `<html data-theme>` bootstrap script to avoid flash-of-wrong-theme), `page.tsx` (composes sections), `globals.css` (CSS variables for both themes, resets, keyframes).
- `components/` — one component per section: `Nav.tsx`, `Hero.tsx`, `TickerBar.tsx`, `Services.tsx`, `WhyUs.tsx`, `Locations.tsx`, `Partners.tsx`, `JournalTeaser.tsx`, `Cta.tsx`, `Footer.tsx`, `BackToTop.tsx`, `ThemeToggle.tsx`. Each gets a co-located CSS Module (`Hero.module.css`, etc.) so styling stays scoped and mirrors the source's per-section structure.
- `components/icons/` — one `.tsx` file per Material Symbol used, exporting a typed SVG component (`HomeIcon`, `StethoscopeIcon`, `ArrowOutwardIcon`, …).
- `hooks/useScrollReveal.ts` — IntersectionObserver-based hook, adds a "revealed" class when a section enters the viewport (`prefers-reduced-motion` respected — animations become instant/no-op).
- `hooks/useTheme.ts` — reads/writes `data-theme` on `<html>` + `localStorage`, exposes `theme` + `toggleTheme()`.
- `public/images/` — the 7 extracted images (2 logos + 5 photos).
- `public/videos/hero.mp4` — the extracted hero video.
- Styling approach: **CSS Modules + CSS custom properties**, not Tailwind — the source is a bespoke pixel-value design (arbitrary `clamp()`s, custom gradients, a goo SVG filter), and hand-written CSS mirrors that most faithfully without fighting a utility framework.
- Animation approach: **plain CSS keyframes + the IntersectionObserver hook** for scroll-reveal/parallax, no Framer Motion dependency — keeps the bundle light and matches the source's own lightweight, no-heavy-framework style.

## New behavior (not in the source)

- **Back to Top**: fixed bottom-right button, hidden until the user scrolls past the hero, smooth-scrolls to `#top`, styled consistently with the pill/CTA language already in the design (dark chip, teal on hover).
- **Scroll-reveal**: each major section (Services rows, Why-us cards, Location panels, Partner rows, Journal card, CTA) fades/slides in the first time it enters the viewport.
- **Parallax**: hero video gets a subtle scroll-linked translateY in addition to its existing slow-zoom; location/partner photos get a slight parallax drift on scroll.
- **Dark/light toggle**: the source had the markup (`light_mode` nav link) but no wiring since it's a static export. This gets real behavior — click toggles theme, swaps the logo image, persists via `localStorage`, defaults to dark on first visit (matching the source's default), and sets the attribute before hydration to avoid a flash of the wrong theme.
- **Responsiveness**: the source ships zero `@media` queries (desktop-only prototype). New breakpoints:
  - Mobile `<640px`: nav collapses to a compact icon rail or hamburger; hero headline/stat row stack; services/why-us/locations/partners grids go single-column; ticker marquee font shrinks; footer columns stack.
  - Tablet `640–1024px`: 2-column grids where the desktop uses 3+; nav stays icon+label but tighter spacing.
  - Desktop `≥1024px`: matches the source's layout as captured.

## Constraints

- No em dash (`—`) anywhere — copy, code, comments, commit messages.
- No `<img src="https://...">`/CSS `url(https://...)` for any content asset — every image/video/font is a local file, downloaded once during this analysis (already sitting in this spec's `media/` folder) or self-hosted via `next/font`.
- Git: commit at meaningful milestones (scaffold, per-section implementation, animation/theme/responsive pass) — this repo currently has zero commits, so the first commit establishes the initial Next.js scaffold.

## Testing / verification plan

- `npm run build` must succeed with no type errors.
- Dev server visually diffed against the original bundle (already rendered once via a local static server + browser tool during this analysis) for each section, both themes.
- Manual check at 375px (mobile), 768px (tablet), 1280px (desktop) viewports.
- Toggle dark/light, confirm logo swap + persistence across reload.
- Scroll to bottom, confirm Back to Top appears and returns to `#top` smoothly.
- Grep the whole `app/`/`components/` tree for `—` before considering any task done.

## Out of scope

- Any page other than the homepage (booking flow, patient portal, careers, journal article page, privacy/terms pages — footer links to these can point at `#footer`/placeholder routes as the source does).
- CMS/backend integration — content stays hardcoded in components for this phase.
- Real analytics/tracking, real payment or account flows.
