# St. Gianna Medical Group — Locations Page

Date: 2026-08-10
Status: Approved
Scope: New `/locations` route, its section components, and Nav/Footer repointing of the existing "Locations" link to it. Other pages/routes (including the homepage's existing `Locations` teaser section and the About Us page's `AboutLocations` section) are unchanged and out of scope.

## Goal

Build a new Locations page matching the supplied Framer export ("St Gianna Medical Group - Locations.html"), following the same pattern already established for the Services and About Us pages (`app/services/page.tsx`, `app/about/page.tsx`): a route composed of shared sitewide components plus new page-specific section components, each styled with a co-located CSS Module and following the theme/responsive/scroll-reveal rules in `CLAUDE.md`.

## Source file analysis

The supplied export was unbundled with the project's `unbundle.js` scratch script into a `design.html` template (real markup + CSS, stripped of the React runtime/fonts/base64 blobs). Its `:root` CSS variables are identical to this repo's `app/globals.css` tokens, confirming it was generated from the same design system already in place — content and copy can be lifted directly, colors mapped straight to existing `var(--token)` names, no new tokens needed.

The draft's addresses, phone numbers, and booking link already match the real data already live sitewide (see prior About Us work) — no sitewide data correction is needed this time.

Two things in the draft are not reproducible or not desired as-is, both confirmed with the user:
- The "Find us on the map" section is a Framer-hosted interactive map widget (chips that focus an iframe via `postMessage`, backed by a Framer-internal `map.html`) — not portable. Rebuilt instead with a real embedded map (OpenStreetMap + Leaflet), keeping the chip-switch interaction.
- The office panels' status pill reads "Open now" identically for all three offices (static mockup copy, not real-time data) and has no hours field. This is kept literally as in the draft, rather than pulling in the homepage `Locations.tsx` panel's differentiated status ("Opens 9am" for La Mirada) and hours line — the user chose to match the draft over reusing the richer/inconsistent existing data.

## Content inventory (from `design.html`, reused verbatim except where noted above)

Sections, top to bottom:
1. **Hero** — dark, breadcrumb "Home / Locations", H1 "Three / *locations.*" (italic teal), intro paragraph, 3 stats (3 LA offices / 24/7 Booking / Same-day Appointments).
2. **Ticker** — reuses the existing sitewide `TickerBar` unchanged (its own content, not the draft's custom marquee strings — same precedent as the About Us and Services pages).
3. **Our offices** ("Serving Hollywood, Santa Monica, and La Mirada") — hover-spotlight panels: status pill, name, address, phone (`tel:` button), Directions link (Google Maps search URL).
4. **Find us on the map** ("Find us on the map") — chip-switchable map, one chip per office.
5. **Addresses and phone numbers** — numbered rows: office name, address, phone.
6. **The same care at whichever door you use** — 4-card notes grid: "One chart, everywhere", "Same-day appointments", "24-hour assistance", "Most insurances accepted".
7. **CTA band** — reuses the existing sitewide `Cta` unchanged (its own heading/copy, not the draft's "Secure your appointment now.").
8. **Footer** — reuses the existing sitewide `Footer`, with its "Locations" link repointed (see below).

## Architecture

- **New route**: `app/locations/page.tsx` — Server Component exporting `metadata` (title/description), composed the same way as `app/services/page.tsx` / `app/about/page.tsx`:
  `Nav → BookCta → LocationsHero → TickerBar → LocationsPanels → LocationsMap → LocationsDetails → LocationsNotes → Cta → Footer → BackToTop`
- **New components** (`components/*.tsx` + co-located `*.module.css` + co-located `*.test.tsx`, matching every existing component in the repo):
  - `LocationsHero.tsx` — structurally cloned from `AboutHero.tsx`/`ServicesHero.tsx` (dark hero, breadcrumb, italic headline span, stat row).
  - `LocationsPanels.tsx` — hover-spotlight panels cloned structurally from the homepage's `Locations.tsx` interaction (flex-grow-on-hover panels, `useParallax` on the image layer), but with the draft's own content shape: status pill + name + address + phone button + Directions link, **no hours field**, status hardcoded to "Open now" for all three per the approved literal-match decision. Images reuse the same three local files already assigned per office in `Locations.tsx` (`photo-hospital-hallway.jpg` → Santa Monica, `photo-counseling-session.jpg` → Hollywood, `photo-pediatric-checkup.jpg` → La Mirada) since no other office photography exists in `public/images`.
  - `LocationsMap.tsx` — client component using `react-leaflet` + OpenStreetMap tiles (new dependencies: `leaflet`, `react-leaflet`). Three chips (one per office) set which office is focused; the map centers/zooms to that office's marker on click. Requires `"use client"` and loading the map via `next/dynamic` with `ssr: false` (Leaflet touches `window` at import time). Per-office lat/lng will be resolved via geocoding during implementation and stored as static constants next to the address/phone data. Leaflet's default marker icon assets need explicit handling under Next.js's bundler (a known integration snag) — addressed at implementation time, not a design-level concern.
  - `LocationsDetails.tsx` — numbered address/phone row list ("01 Hollywood ...", "02 Santa Monica ...", "03 La Mirada ..."), mirroring the numbered-row interaction already used in `ServiceCatalog.tsx`/`AboutSpecialties.tsx`, but **no image preview** (text-only, matching the draft, which has none here).
  - `LocationsNotes.tsx` — 4-card icon grid styled like `WhyUs.tsx`/`AboutValues.tsx`. Reuses `SyncAltIcon`, `BoltIcon`, `VerifiedUserIcon`; adds **one new icon**, `SupportAgentIcon` (Material Symbols Outlined "support_agent" — the glyph the draft itself uses for "24-hour assistance"), hand-rolled in the same style as the rest of `components/icons/index.tsx`.
- All new sections use `useScrollReveal` for entrance animation, consistent with every other section in the codebase. `useParallax` is reused only in `LocationsPanels`, matching its use in the homepage's `Locations.tsx`.
- **Reused unchanged**: `TickerBar`, `Cta`, `Footer` (aside from the link repoint below), `BackToTop`, `BookCta`.

## Nav & Footer wiring

- `Nav.tsx`: the existing "Locations" nav item's `href` changes from `/#locations` to `/locations` — no new item is added, since "Locations" already exists in the nav (unlike "About us", which was net-new). This matches the precedent set when "About us" was pointed at its new page.
- `Footer.tsx`: the existing "Locations" link in the "Explore" column changes from `/#locations` to `/locations`.
- The homepage's own `Locations` section (`id="locations"`) and its component are unchanged — it remains reachable by scrolling the homepage, just no longer the nav/footer's direct target.

## Testing

- Every new component gets a co-located `*.test.tsx` following the existing testing-library conventions used across the codebase (render + `screen.getByText`/`getByRole` assertions).
- `Nav.test.tsx` and `Footer.test.tsx` are updated to assert the new `/locations` href in place of `/#locations`.
- Full `npm test` suite must pass before the change is considered done (per `CLAUDE.md`).
- Manual verification: dev server run, `/locations` checked in both themes (dark/light toggle), at mobile/tablet/desktop widths, and scrolled fully to confirm reveal timing and the map chip-switch interaction — per the three mandatory UI-work checks in `CLAUDE.md`.
