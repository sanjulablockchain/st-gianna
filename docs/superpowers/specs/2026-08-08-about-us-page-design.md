# St. Gianna Medical Group — About Us Page

Date: 2026-08-08
Status: Approved
Scope: New `/about` route, its section components, Nav/Footer wiring to it, and a sitewide correction of placeholder contact data to the real practice data. Other pages/routes are otherwise out of scope.

## Goal

Build a new About Us page matching the supplied Framer export ("St Gianna Medical Group - About Us.html"), following the same pattern already established for the Services page (`app/services/page.tsx`): a route composed of shared sitewide components plus new page-specific section components, each styled with a co-located CSS Module and following the theme/responsive/scroll-reveal rules in `CLAUDE.md`.

Two content changes from the raw source are intentional, both confirmed with the user:
- The CTA section's button reads "Book online" (already the case in the existing shared `Cta` component), not the draft's "Book same-day appointment".
- The "drop a team photo" placeholder resolves to `/images/photo-doctor-portrait.jpg`, an existing asset.

## Source file analysis

The supplied export was unbundled with the project's `unbundle.js` scratch script into a `design.html` template (real markup + CSS, stripped of the React runtime/fonts/base64 blobs). Its `:root` CSS variables (`--bg`, `--ink`, `--muted`, `--line`, etc.) are byte-for-byte identical to this repo's `app/globals.css` tokens, confirming the draft was generated from the same design system already in place — content and copy can be lifted directly, colors mapped straight to existing `var(--token)` names, no new tokens needed.

The draft also contains what is evidently the **real practice data** (not placeholder): specific LA-area addresses, phone numbers, a live NexHealth booking URL under `ktdoctor`, and `contact@sgmdoctor.com` — matching the codebase's existing correct footer email and the `KT Doctor` partner referenced in `Partners.tsx`. The current site instead has 555-prefixed placeholder phone numbers and generic street addresses (`1234 Wilshire Blvd`, etc.) used as scaffolding since no real data existed yet at homepage-build time. See "Sitewide data correction" below.

## Content inventory (from `design.html`, reused verbatim)

Sections, top to bottom:
1. **Hero** — dark, breadcrumb "Home / About us", H1 "Who / *are we?*" (italic teal), intro paragraph, 3 stats (3 LA offices / 24/7 Booking / All ages — adults & children).
2. **Ticker** — reuses the existing sitewide `TickerBar` unchanged (already used identically on Home and Services).
3. **Commitment** ("Our Commitment to Your Health") — kicker "Who are we", long paragraph on the practice's services/approach, team portrait image.
4. **Mission/Vision** — two-column "Our Mission" / "Our Vision" paragraphs on the `--bg-2` band.
5. **Specialties** ("Care across specialties") — 5 numbered rows: Cardiology, Orthopedics, Neurology, Primary care, Preventive care, each with a one-line description.
6. **Values** ("What patients can count on, every visit.") — 4 cards: Compassionate care, Same-day appointments, 24/7 booking, Most insurances accepted.
7. **Locations** ("Three doors across the city") — Hollywood, Santa Monica, La Mirada: name, address, phone.
8. **CTA band** — reuses the existing sitewide `Cta` unchanged ("Ready when your family is." / "Book online" / phone).
9. **Footer** — reuses the existing sitewide `Footer`, with one new "About us" link.

All specialty/value/mission copy is reused exactly as written in the draft.

## Architecture

- **New route**: `app/about/page.tsx` — Server Component exporting `metadata` (title/description), composed the same way as `app/services/page.tsx`:
  `Nav → BookCta → AboutHero → TickerBar → AboutCommitment → AboutMission → AboutSpecialties → AboutValues → AboutLocations → Cta → Footer → BackToTop`
- **New components** (`components/*.tsx` + co-located `*.module.css` + co-located `*.test.tsx`, matching every existing component in the repo):
  - `AboutHero.tsx` — structurally cloned from `ServicesHero.tsx` (dark hero, breadcrumb, italic headline span, stat row); own CSS module since `Hero`/`ServicesHero` are already separate per-page components in this codebase (no shared generic hero exists, and none is introduced here).
  - `AboutCommitment.tsx` — heading + kicker + paragraph + portrait image (`next/image`, `/images/photo-doctor-portrait.jpg`) in the draft's pill-top/square-bottom rounded frame (`border-radius: 200px 200px 20px 20px`), grid layout that stacks on mobile/tablet and goes side-by-side at the `1180px` desktop breakpoint (matching the draft's `wide` check).
  - `AboutMission.tsx` — two-column grid (`repeat(auto-fit, minmax(320px, 1fr))`), kicker color `var(--link)`.
  - `AboutSpecialties.tsx` — numbered row list with hover highlight/dim state (mirrors the interaction pattern in `Services.tsx`/`ServiceCatalog.tsx` rows), but **no image preview panel** (text-only, per the approved design choice — the draft itself has no preview here and no specialty-specific photos exist in `public/images`).
  - `AboutValues.tsx` — 4-card icon grid styled like `WhyUs.tsx`. Reuses `BoltIcon`, `ScheduleIcon`, `VerifiedIcon`; adds **one new icon** (`VolunteerActivismIcon`, the Material Symbols Outlined "volunteer_activism" glyph — same one named in the draft's own data for this card — hand-rolled in the same style as the rest of `components/icons/index.tsx`) for "Compassionate care".
  - `AboutLocations.tsx` — simple bordered cards (name, address, `tel:` phone link), **no photos** (per the approved design choice, matching the draft exactly rather than the richer hover-panel `Locations.tsx` used on the homepage).
- All new sections use `useScrollReveal` for entrance animation, consistent with every other section in the codebase. No parallax is used, matching the draft (which has none in this page beyond what shared components already do).
- **Reused unchanged**: `TickerBar`, `Cta`, `Footer` (aside from the link addition below), `BackToTop`, `BookCta`.

## Nav & Footer wiring

- `Nav.tsx`: new item `{ label: "About us", href: "/about", icon: <DiversityIcon size={23} />, primary: true }`, inserted right after "Home" and before "Services" in the `items` array. `primary: true` so it's visible in the mobile pill nav, consistent with Home/Services/Locations/Call us. `DiversityIcon` is a new hand-rolled icon matching the Material Symbols Outlined "diversity_1" glyph — the exact icon the draft itself uses for this nav concept ("who we are").
- `Footer.tsx`: new `<Link href="/about">About us</Link>` in the "Explore" column, before the existing "Services" link.

## Sitewide data correction

Per the user's decision to fix this everywhere rather than just on the new page, every placeholder phone number / address / booking link in the codebase is replaced with the real data confirmed in the draft:

| Location | Field | Old (placeholder) | New (real) |
|---|---|---|---|
| `Nav.tsx` | "Call us" href | `tel:13105550123` | `tel:8183084100` |
| `Cta.tsx` | primary button href | `#book` | `https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903` |
| `Cta.tsx` | secondary button href/text | `tel:13105550123` / "(310) 555-0123" | `tel:8183084100` / "818-308-4100" |
| `Locations.tsx` | Santa Monica address/phone | `1234 Wilshire Blvd, Santa Monica, CA 90403` / `(310) 555-0123` | `2221 Lincoln Blvd, Santa Monica, CA 90405` / `818-308-4100` |
| `Locations.tsx` | Hollywood address/phone | `5678 Sunset Blvd, Los Angeles, CA 90028` / `(323) 555-0199` | `5255 W Sunset Blvd, Los Angeles, CA 90027` / `818-275-7006` |
| `Locations.tsx` | La Mirada address/phone | `910 Rosecrans Ave, La Mirada, CA 90638` / `(562) 555-0144` | `12675 La Mirada Blvd, #200, La Mirada, CA 90638` / `562-941-9853` |
| `Footer.tsx` | 3 contact lines | plain text, 555-numbers | real numbers, converted to `tel:` links (matching the draft's footer, which uses anchors here) |

Not changed: `Locations.tsx`'s fabricated `status` ("Open now"/"Opens 9am") and `hours` fields, since the draft has no data for them and nothing indicates they're wrong — only address/phone/booking-link are corrected. `BookCta.tsx` and `Partners.tsx` keep their `#book` in-page-anchor hrefs unchanged, since the draft's own floating CTA button does the same (only the CTA band's own button gets the real external booking link).

Existing tests asserting the old placeholder values (`Cta.test.tsx`, `Locations.test.tsx`, `Nav.test.tsx`, `Footer.test.tsx`) are updated to assert the new real values.

## Testing

- Every new component gets a co-located `*.test.tsx` following the existing testing-library conventions used across the codebase (render + `screen.getByText`/`getByRole` assertions).
- Updated components (`Nav`, `Footer`, `Cta`, `Locations`) have their existing tests updated for the new data/links, not rewritten from scratch.
- Full `npm test` suite must pass before the change is considered done (per `CLAUDE.md`).
- Manual verification: dev server run, `/about` checked in both themes (dark/light toggle), at mobile/tablet/desktop widths, and scrolled fully to confirm reveal timing — per the three mandatory UI-work checks in `CLAUDE.md`.
