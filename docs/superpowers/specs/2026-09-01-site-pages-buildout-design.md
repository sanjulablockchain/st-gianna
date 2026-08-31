# Site Pages Buildout Design

Date: 2026-09-01
Branch: `worktree-pages-buildout`
Status: approved for planning

## Goal

Grow the St. Gianna Medical Group site from four routes to ten. Deepen the
existing `/services` page, add `/why-us`, `/journal`, `/partners`, `/contact`,
`/privacy`, and `/terms`, wire all of them into the nav and footer, and connect
the homepage cards and teasers to the pages they describe.

Reference sites for content and tone:

- `https://sgmdoctor.com/services/`
- `https://sgmdoctor.com/contact/`
- `https://www.ktdoctor.com/network`

The new pages must be materially deeper than those references, not a
reproduction of them.

## Constraints

These come from `CLAUDE.md` and from the decisions made during brainstorming.

1. **No hardcoded colors.** Every color, background, and border uses a
   `var(--token)` from `app/globals.css`. New tokens are declared in both the
   `:root` block and the `html[data-theme="light"]` block. No literal hex or
   rgb values in any component or module CSS.
2. **Mobile first, existing breakpoints.** `max-width: 640px`, `max-width: 859px`,
   `max-width: 1179px`, `min-width: 1180px`. No new breakpoint values unless a
   component genuinely needs one.
3. **Existing motion system only.** Entrance motion goes through
   `useScrollReveal`. Scroll offset goes through `useParallax`. No new scroll
   listeners, observers, or animation libraries. The `prefers-reduced-motion`
   bail-out in both hooks is preserved. Pre-hydration reveal state relies on the
   existing `html.js` class.
4. **No em dashes or en dashes in page copy.** Ordinary hyphens in compound
   words such as same-day, well-child, after-hours, and board-certified are
   kept, matching copy already in the repo.
5. **Every component gets a co-located test.** `Component.tsx`,
   `Component.module.css`, `Component.test.tsx`, same as every existing section.

## Approach

Targeted extraction with bespoke sections. Two shared primitives are extracted
because they would otherwise be copy-pasted five or more times. Everything else
stays a purpose-built section component in the existing house style.

Rejected alternatives:

- **Pure convention copy.** Would mean writing five more near-identical hero
  files on top of the three that already exist.
- **Heavy extraction into a component kit.** Would rewrite three shipped pages
  and over-generalize sections that are deliberately distinct.

## Routes

| Route | Status | In nav | In footer |
| --- | --- | --- | --- |
| `/` | modify: wire cards outward | yes | yes |
| `/about` | unchanged except hero refactor | yes | yes |
| `/services` | modify: deepen | yes | yes |
| `/locations` | unchanged except hero refactor | yes | yes |
| `/why-us` | new | yes | yes |
| `/journal` | new | yes | yes |
| `/partners` | new | yes | yes |
| `/contact` | new | yes | yes |
| `/privacy` | new | no | yes |
| `/terms` | new | no | yes |

Every page file follows the established composition:

```tsx
<div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
  <Nav />
  <BookCta />
  <XHero />
  <TickerBar />
  {/* page sections */}
  <Cta />
  <Footer />
  <BackToTop />
</div>
```

Each page exports a `Metadata` object with a title of the form
`<Page> | St. Gianna Medical Group` and a description.

## Shared primitives

### `PageHero`

Absorbs the duplication across `ServicesHero`, `AboutHero`, and `LocationsHero`.

Renders the dark hero band: radial gradient layer, scanline layer, logo link
back to `/`, breadcrumb with pulsing live dot, a two-line headline where the
second line carries the italic accent style, subcopy, and a stat row.

Props:

| Prop | Type | Notes |
| --- | --- | --- |
| `breadcrumb` | `string` | Current page label, rendered after `Home /` |
| `headline` | `string` | First line, upright |
| `italic` | `string` | Second line, italic accent |
| `subcopy` | `string` | Intro paragraph |
| `stats` | `{ n: string; l: string }[] \| undefined` | Stat row, 3 items typical. Omitted by the legal pages, which render no stat row |
| `image` | `string \| undefined` | Optional photo layer behind the gradient |
| `imageAlt` | `string \| undefined` | Required when `image` is set |

Uses `useScrollReveal` for the band and `useParallax(0.05, 18)` for the gradient
and optional photo layer.

The three existing hero components keep their file names and default exports
and become thin wrappers that pass their own copy into `PageHero`. This keeps
`ServicesHero.test.tsx`, `AboutHero.test.tsx`, and `LocationsHero.test.tsx`
passing unchanged, which is the regression check on the refactor. The four new
heroes (`WhyUsHero`, `JournalHero`, `PartnersHero`, `ContactHero`) are wrappers
of the same shape.

The existing heroes hardcode dark-band colors via `#06161C` and
`rgba(255,255,255,...)`. `PageHero` must not. The extraction is the moment to
move these onto tokens: a new `--hero-band`, `--hero-ink`, `--hero-ink-2`,
`--hero-ink-3`, and `--hero-line` set, defined in both theme blocks. The dark
hero band stays visually dark in both themes, which is the existing intent, so
the light-theme values for these tokens hold the same dark band values. This
satisfies rule 1 without changing the design.

### `LegalPage`

Shared shell for `/privacy` and `/terms`.

Props:

| Prop | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Page title, for example `Privacy Policy` |
| `italic` | `string` | Italic accent word for the hero |
| `breadcrumb` | `string` | Breadcrumb label |
| `intro` | `string` | Lead paragraph above the first section |
| `effectiveDate` | `string` | Rendered as `Last updated <date>` |
| `sections` | `LegalSection[]` | See below |

```ts
type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};
```

`LegalPage` renders `PageHero` with `stats` omitted, then the index and prose.

Layout: on `min-width: 1180px` a sticky section index sits in a left column and
the prose runs in the right. Below `859px` the index collapses into a
`<details>` accordion above the prose. Section headings render as `<h2>` with
the `id` applied so footer anchors such as `/terms#accessibility` resolve.

Content lives in `components/legal/privacyContent.ts` and
`components/legal/termsContent.ts` as plain data, so the page files stay short.

## Page contents

### `/services` (modify)

Existing sections kept: `ServicesHero`, `TickerBar`, `CorePillars`,
`VisitSteps`, `Cta`.

**`ServiceCatalog` expansion.** Today it is a hover list of eight rows that all
link to `#book`. It becomes an expandable list: activating a row opens a detail
panel with four fields.

```ts
type Service = {
  title: string;
  body: string;
  image: string;
  includes: string[];      // what is included
  who: string;             // who it is for
  duration: string;        // typical visit length
  conditions: string[];    // conditions covered
};
```

One panel open at a time, keyboard accessible via `<button aria-expanded>`,
following the pattern already established in `ServicesFaq`. The hover image
preview is retained on `min-width: 1180px` and suppressed below it, where the
panel content is what matters.

**`ServiceConditions` (new).** "Conditions we treat", grouped into six sets:
respiratory, skin, digestive, chronic, women's health, and wound care. Each
group is a heading plus conditions rendered as tag chips. Three columns on
desktop, two on tablet, one on mobile.

**`ServicesInsurance` (new).** Anchored at `#insurance` so the footer's
`Insurance & billing` link resolves. Three blocks: accepted HMO and IPA plans,
what to bring to a first visit, and a self pay note. Directs billing questions
to `/contact`.

**`ServicesFaq` expansion.** From 5 questions to 9. New questions cover
telehealth eligibility, prescription refills, specialist referrals, and records
transfer from a previous clinic.

Final section order: hero, ticker, core pillars, catalog, conditions,
insurance, visit steps, faq, cta.

### `/why-us` (new)

- `WhyUsHero`: headline `Why families` / `stay.`
- `WhyUsPromise`: six promise cards. Each card has an `id` so the homepage
  `WhyUs` cards can deep-link to it. Slugs: `same-day`, `booking`, `one-chart`,
  `insurance`, `bilingual`, `after-hours`.
- `WhyUsCompare`: a comparison of a typical clinic against St. Gianna across
  five rows: time to appointment, records between offices, after hours, benefits
  check, and follow-up. Renders as a two-column table on `min-width: 860px` and
  stacks into one card per row below that. The stacked form repeats the row
  label inside each card so it stays readable without a header.
- `WhyUsNumbers`: parallax stat band, four figures.
- `WhyUsTestimonials`: three patient quotes with attribution and office.

### `/partners` (new)

- `PartnersHero`: headline `One` / `network.`
- `PartnersNetwork` at `#network`: the nine organizations, in three groups.
  - Pediatric & family care: Kids & Teens Medical Group (flagship),
    St. Gianna Medical Group, LA Intensive Pediatric Therapy, Serendib
    Healthways, After-Hours Pediatric Urgent Care
  - Sri Lanka network: St. Joseph Hospital Negombo, ACIG Asiacorp Insurance
    Brokers
  - Business & support partners: Human Compass MSO, Blockchain BPO

  ```ts
  type Partner = {
    name: string;
    tagline: string;
    body: string;
    tags: string[];
    href: string;
    flagship?: boolean;
  };
  ```

  External links get `target="_blank"` and `rel="noopener noreferrer"`.
- `PartnersValue`: four cards on what the network means for a patient, covering
  referrals, shared records, coverage, and after-hours access.
- `PartnersJoin`: a band inviting practices to partner, linking to `/contact`.

### `/journal` (new)

- `JournalHero`: headline `The` / `journal.`
- `JournalFeatured`: the article currently teased on the homepage, with a
  parallax image layer. Because there are no article routes in this scope, the
  featured piece renders its **full body inline** rather than linking out: a
  standfirst, a parallax hero image, and the complete article text in prose
  blocks with subheadings. This is what the homepage `JournalTeaser` "Read the
  piece" link resolves to, so the teaser leads somewhere real instead of a card
  that repeats itself.
- `JournalGrid`: nine article cards with client-side category filter chips.
  Categories: Preventive care, Parenting, Nutrition, Seasonal, Chronic care,
  Clinic news. Filter is `useState` over a constant array, no routing. An `All`
  chip resets. When a filter yields nothing the grid renders an empty state
  rather than collapsing.

  ```ts
  type Article = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
    image: string;
  };
  ```

  Cards are not links to article routes, which do not exist in this scope. Each
  card is a non-interactive article summary with read time and date. This is
  deliberate: shipping cards that link nowhere is worse than cards that do not
  claim to be links.
- `JournalNewsletter`: email capture, client-side only, same validation and
  success-panel pattern as the contact form.

### `/contact` (new)

- `ContactHero`: headline `Get in` / `touch.`
- `ContactChannels`: four channel cards. Call (`tel:+18183084100`), book online
  (the NexHealth URL already used by `Cta`), email
  (`mailto:contact@sgmdoctor.com`), and telehealth (`/services#catalog`). Plus
  the 24-hour assistance line.
- `ContactForm`: fields are name, email, phone, preferred office (select of the
  three), topic (select: appointment, billing, records, careers, other),
  message, and a consent checkbox.
  - Validation on submit: name non-empty, email matches a basic address shape,
    message non-empty, consent checked. Phone is optional but validated for
    shape when present.
  - Errors render inline beneath each field, and the field gets
    `aria-invalid="true"` plus `aria-describedby` pointing at the error.
  - On a valid submit the form is replaced by a success panel with a reset
    link. No network call. A clearly marked `TODO` comment marks where the POST
    belongs.
  - This is the one new interactive surface with real logic, so its test covers
    the empty submit path, the invalid email path, and the success path.
- `ContactOffices`: three office cards with photo, address, phone, hours, and a
  Google Maps directions link.
  - Hollywood, 5255 W Sunset Blvd, Los Angeles, CA 90027, 818-275-7006
  - Santa Monica, 2221 Lincoln Blvd, Santa Monica, CA 90405, 818-308-4100
  - La Mirada, 11900 La Mirada Blvd Ste 7, La Mirada, CA 90638, 562-941-9853
- `ContactNotes`: "before you write" block covering emergencies (call 911),
  prescription refills, records requests, billing questions, and careers. The
  careers block carries `id="careers"` for the footer link.

### `/privacy` (new)

`LegalPage` with 11 sections: introduction, information we collect, how we use
information, HIPAA and protected health information, sharing and disclosure,
cookies and analytics, your rights, data retention and security, children's
privacy, changes to this policy, and how to contact us.

### `/terms` (new)

`LegalPage` with 14 sections: acceptance of terms, use of the site, no medical
advice, emergencies, appointments and cancellations, insurance and billing,
telehealth terms, intellectual property, third-party links, disclaimers,
limitation of liability, accessibility (`id="accessibility"`), governing law,
changes to these terms, and contact.

Both pages carry a visible note that the content is a general statement for a
marketing site and not a substitute for a reviewed legal document.

## Navigation and footer

### `Nav`

The item list becomes:

| Label | href | primary |
| --- | --- | --- |
| Home | `/` | yes |
| About us | `/about` | yes |
| Services | `/services` | yes |
| Why us | `/why-us` | no |
| Locations | `/locations` | yes |
| Journal | `/journal` | no |
| Partners | `/partners` | no |
| Contact | `/contact` | no |
| Call us | `tel:+18183084100` | yes |
| Theme toggle | button | yes |

Two improvements while the file is open:

- Internal items render `next/link` instead of `<a href>`, so navigation stops
  triggering a full document load. `tel:` stays an `<a>`. The theme toggle
  becomes a real `<button>` rather than an `<a>` with `preventDefault`, which
  also fixes its keyboard semantics.
- The item matching `usePathname()` gets `aria-current="page"` and a subtle
  active treatment on the blob layer.

The blob hover geometry and the `primary` small-screen filter are unchanged.

`Nav.test.tsx` is extended to assert the four rewired hrefs and the
`aria-current` behavior.

### `Footer`

- Explore column: About us, Services, Why us, Locations, Journal, Partners
- Patients column: Book appointment (`/#book`), Contact (`/contact`),
  Insurance & billing (`/services#insurance`), Careers (`/contact#careers`)
- Contact column: unchanged
- Bottom row: Privacy (`/privacy`), Terms (`/terms`), Accessibility
  (`/terms#accessibility`)

`Footer.test.tsx` is extended to assert every link target.

### Homepage wiring

| Component | Today | Becomes |
| --- | --- | --- |
| `Services` rows | `#book` | `/services#catalog`, plus a "See all services" link |
| `WhyUs` cards | plain `<div>` | `Link` to `/why-us#<slug>` (see mapping below) |
| `Partners` rows | `#book` | `/partners#network` |
| `JournalTeaser` | `#insight` | `/journal` |
| `Locations` panels | `<button>` that navigates nowhere | `Link` to `/locations` |

The homepage `WhyUs` cards map onto four of the six `WhyUsPromise` slugs. The
remaining two exist only on `/why-us`, which is part of why the page is worth
visiting:

| Homepage card | Target |
| --- | --- |
| Same-day slots | `/why-us#same-day` |
| Book at 2am | `/why-us#booking` |
| One chart, everywhere | `/why-us#one-chart` |
| Insurance handled | `/why-us#insurance` |
| (page only) | `#bilingual` |
| (page only) | `#after-hours` |

`Locations` panels currently use `onMouseEnter` and `onFocus` on a `<button>` to
drive the active state. Converting to `Link` preserves both handlers, so hover
and keyboard focus behavior is unchanged while the element becomes navigable.

Each affected homepage test is updated to assert the new destination.

## Motion

Every new section uses `useScrollReveal` on its root and applies the established
CSS pattern:

```css
:global(html.js) .section:not(.revealed) { opacity: 0; transform: translateY(28px); }
.revealed { opacity: 1; transform: translateY(0); }
```

`useParallax` is applied to:

- `PageHero` gradient and optional photo layer, `(0.05, 18)`
- `JournalFeatured` image layer, `(0.08, 28)`
- `WhyUsNumbers` band, `(0.06, 20)`
- `ContactOffices` card photos, `(0.06, 20)`
- `PartnersNetwork` group art, `(0.05, 16)`

**Stagger.** Cards inside a revealed grid receive a `--reveal-index` custom
property set inline from the map index, and the CSS multiplies it into a
`transition-delay`:

```css
.card { transition-delay: calc(var(--reveal-index, 0) * 70ms); }
```

This is CSS on top of the existing observer. It adds no listeners and no new
observers. `globals.css` already forces `transition-duration: .001ms` under
`prefers-reduced-motion`, so the stagger collapses to nothing for users who ask
for reduced motion. The index is clamped at 8 so late items in long lists do
not wait.

## Theme tokens

New tokens added to both blocks in `app/globals.css`:

| Token | Purpose |
| --- | --- |
| `--hero-band` | Dark hero band background |
| `--hero-ink` | Hero headline text |
| `--hero-ink-2` | Hero body text |
| `--hero-ink-3` | Hero label and stat label text |
| `--hero-line` | Hero divider rule |
| `--field-bg` | Form input surface |
| `--field-border` | Form input border |
| `--field-border-focus` | Focused input border |
| `--danger` | Validation error text and invalid border |
| `--success` | Success panel accent |
| `--chip-bg` | Filter chip and tag surface |
| `--chip-bg-active` | Selected filter chip surface |

The hero tokens resolve to the same dark values in both themes, preserving the
current design where the hero band stays dark regardless of theme. The rest
differ per theme.

## Images

Roughly twelve stock photos are downloaded into `public/images`:

- `journal-featured.jpg`
- `journal-1.jpg` through `journal-6.jpg`
- `why-us-band.jpg`
- `partners-network.jpg`
- `contact-hollywood.jpg`, `contact-santa-monica.jpg`, `contact-la-mirada.jpg`

Each downloaded file is verified to be a real JPEG by checking magic bytes
rather than trusting the HTTP status.

**Fallback.** If the image host is unreachable, the pages recompose the eleven
photos already in `public/images` and the deviation is reported rather than
shipping broken `next/image` references. Under no circumstances does a page
reference an image path that does not exist on disk.

All images render through `next/image` with either explicit `width` and
`height` or `fill` inside a positioned parent, matching existing usage.

## Testing

- Every new component gets a co-located `*.test.tsx` in the existing style:
  render, assert headings, key copy, and link targets.
- `ContactForm` gets behavioral coverage: empty submit shows errors, invalid
  email shows a field error, valid submit shows the success panel.
- `JournalGrid` gets filter coverage: selecting a category narrows the cards,
  `All` restores them.
- `ServiceCatalog` gets expansion coverage: activating a row opens its panel and
  sets `aria-expanded`.
- `Nav.test.tsx` and `Footer.test.tsx` are extended for the new destinations.
- Existing hero tests are the regression check on the `PageHero` extraction and
  must pass without modification.

## Verification before completion

1. `npm test` full suite green
2. `npm run lint` clean
3. `npm run build` succeeding
4. Every new page rendered at 375px, 860px, and 1280px in both themes with no
   overflow, clipping, or overlap
5. Full-page scroll on each new route to confirm reveal and parallax timing
6. `grep` across `app/` and `components/` for em dash and en dash characters,
   expecting no hits in page copy
7. `grep` across new module CSS for literal hex and rgb color values, expecting
   no hits

## Out of scope

- `/services/[slug]` and `/journal/[slug]` child routes
- A real form backend, email provider, or API route
- A careers route, which is served by an anchor on `/contact`
- Any change to `Hero`, `TickerBar`, `Cta`, `BookCta`, `BackToTop`, or
  `GooFilter` beyond what wiring requires
- Legal review of the privacy and terms copy
