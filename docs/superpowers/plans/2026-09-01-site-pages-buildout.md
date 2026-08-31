# Site Pages Buildout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Grow the site from four routes to ten by deepening `/services` and adding `/why-us`, `/journal`, `/partners`, `/contact`, `/privacy`, and `/terms`, then wire every new page into the nav, the footer, and the homepage cards.

**Architecture:** Two shared primitives are extracted because they would otherwise be copy-pasted five or more times: `PageHero` (the dark hero band, already duplicated across three shipped pages) and `LegalPage` (the shell behind `/privacy` and `/terms`). Every other section stays a purpose-built component in the existing house style: `"use client"`, `useScrollReveal` on the root, a co-located CSS Module, and a co-located test. New routes are built before anything links to them, so the site never ships a link to a route that does not exist.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, plain CSS Modules (no CSS framework), Vitest + jsdom + @testing-library/react.

**Spec:** [docs/superpowers/specs/2026-09-01-site-pages-buildout-design.md](../specs/2026-09-01-site-pages-buildout-design.md)

## Global Constraints

Every task's requirements implicitly include this section.

- **No literal colors.** No hex, `rgb()`, or `rgba()` in any file under `components/`. Colors come from `var(--token)`. New tokens are declared in **both** the `:root` block and the `html[data-theme="light"]` block of [app/globals.css](../../../app/globals.css). Task 1 adds every token this plan needs; no later task invents one without adding it to both blocks.
- **No em dashes or en dashes in page copy.** The characters `—` (U+2014) and `–` (U+2013) must not appear in any file under `app/` or `components/`. Ordinary hyphens in compounds (same-day, well-child, after-hours, board-certified) are correct and expected.
- **Breakpoints are fixed.** Use only `max-width: 640px`, `max-width: 859px`, `max-width: 1179px`, `min-width: 1180px`. Do not invent new thresholds.
- **Motion goes through the existing hooks.** `useScrollReveal` for entrance, `useParallax` for scroll offset. No new scroll listeners, `IntersectionObserver` instances, or animation libraries. Never bypass the `prefers-reduced-motion` checks already inside both hooks.
- **Every component is a trio.** `Component.tsx` + `Component.module.css` + `Component.test.tsx`. No exceptions.
- **Path alias.** `@/*` maps to the repo root. Import hooks as `@/hooks/useScrollReveal`, icons as `@/components/icons`.
- **Run the whole suite.** `npm test` runs every test, not just the new one. A task is not done until the full suite is green.
- **Node commands run from the worktree root:** `C:\dev\st-gianna\.claude\worktrees\pages-buildout`.

## Shared Contracts

These three blocks are referenced by name throughout the plan. They are written out once here in full so no task has to say "similar to Task N".

### Contract A: Section CSS skeleton

Every new section's `.module.css` starts from exactly this. Only the padding line and the background change between sections.

```css
.section {
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  background: var(--bg);
  border-top: 1px solid var(--line);
  transition: opacity .6s ease, transform .6s ease;
}

/* Scroll-reveal start state, only when JS is confirmed present (html.js is set
   pre-paint in layout.tsx) so the section stays visible if JS never runs.
   :not(.revealed) keeps .revealed winning over this higher-specificity rule. */
:global(html.js) .section:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

Alternate every other section between `background: var(--bg)` and `background: var(--bg-2)` so the page reads as bands, matching the homepage.

### Contract B: Section component skeleton

Every new section component starts from exactly this shape.

```tsx
"use client";

import styles from "./ComponentName.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ComponentName() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="section-anchor"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      {/* content */}
    </section>
  );
}
```

### Contract C: Reveal stagger

Any grid or list of cards inside a revealed section gets a staggered entrance. Set the custom property inline from the map index, clamped at 8:

```tsx
{ITEMS.map((item, i) => (
  <div
    key={item.title}
    className={styles.card}
    style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
  >
```

and consume it in the module CSS on the card:

```css
.card {
  transition: opacity .6s ease, transform .6s ease;
  transition-delay: calc(var(--reveal-index, 0) * 70ms);
}

:global(html.js) .section:not(.revealed) .card {
  opacity: 0;
  transform: translateY(18px);
}
```

This adds no listeners and no observers. `globals.css` already forces `transition-duration: .001ms` under `prefers-reduced-motion`, so the stagger collapses to nothing for users who ask for reduced motion.

### Contract D: Page file shape

Every route file follows this, with only the imports, metadata, and middle sections changing.

```tsx
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import TickerBar from "@/components/TickerBar";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "<Page> | St. Gianna Medical Group",
  description: "<one sentence>",
};

export default function XPage() {
  return (
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
  );
}
```

### Contract E: Test skeleton

Every section test follows this shape. Assert the heading, one distinctive line of copy, and every link target the section owns.

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  it("renders the heading and key copy", () => {
    render(<ComponentName />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/expected/i);
    expect(screen.getByText(/distinctive copy/i)).toBeInTheDocument();
  });
});
```

## File Structure

**Created:**

| Path | Responsibility |
| --- | --- |
| `components/PageHero.tsx` `.module.css` `.test.tsx` | Shared dark hero band for all seven interior pages |
| `components/LegalPage.tsx` `.module.css` `.test.tsx` | Shared shell for `/privacy` and `/terms` |
| `components/legal/privacyContent.ts` | Privacy copy as data |
| `components/legal/termsContent.ts` | Terms copy as data |
| `components/WhyUsHero.tsx` + trio | `/why-us` hero wrapper |
| `components/WhyUsPromise.tsx` + trio | Six promise cards, deep-link targets |
| `components/WhyUsCompare.tsx` + trio | Typical clinic vs St. Gianna |
| `components/WhyUsNumbers.tsx` + trio | Parallax stat band |
| `components/WhyUsTestimonials.tsx` + trio | Three patient quotes |
| `components/PartnersHero.tsx` + trio | `/partners` hero wrapper |
| `components/PartnersNetwork.tsx` + trio | Nine organizations in three groups |
| `components/PartnersValue.tsx` + trio | What the network means for a patient |
| `components/PartnersJoin.tsx` + trio | Partner-with-us band |
| `components/JournalHero.tsx` + trio | `/journal` hero wrapper |
| `components/JournalFeatured.tsx` + trio | Featured article, full body inline |
| `components/JournalGrid.tsx` + trio | Nine cards with category filter |
| `components/JournalNewsletter.tsx` + trio | Email capture, client-side only |
| `components/ContactHero.tsx` + trio | `/contact` hero wrapper |
| `components/ContactChannels.tsx` + trio | Four channel cards |
| `components/ContactForm.tsx` + trio | Validated form, client-side only |
| `components/ContactOffices.tsx` + trio | Three office cards |
| `components/ContactNotes.tsx` + trio | Before-you-write block, owns `#careers` |
| `components/ServiceConditions.tsx` + trio | Conditions we treat |
| `components/ServicesInsurance.tsx` + trio | Owns `#insurance` |
| `app/why-us/page.tsx` | Route |
| `app/journal/page.tsx` | Route |
| `app/partners/page.tsx` | Route |
| `app/contact/page.tsx` | Route |
| `app/privacy/page.tsx` | Route |
| `app/terms/page.tsx` | Route |

**Modified:**

| Path | Change |
| --- | --- |
| `app/globals.css` | Add 14 tokens to both theme blocks |
| `components/ServicesHero.tsx` | Becomes a `PageHero` wrapper |
| `components/AboutHero.tsx` | Becomes a `PageHero` wrapper |
| `components/LocationsHero.tsx` | Becomes a `PageHero` wrapper |
| `components/ServiceCatalog.tsx` `.module.css` `.test.tsx` | Rows expand into detail panels; grows to 10 services |
| `components/ServicesFaq.tsx` `.test.tsx` | 5 questions to 9 |
| `app/services/page.tsx` | Insert the two new sections |
| `components/Nav.tsx` `.test.tsx` | `next/link`, four rewired hrefs, `aria-current` |
| `components/Footer.tsx` `.test.tsx` | New Explore items, real legal links |
| `components/Services.tsx` `.test.tsx` | Rows link to `/services#catalog` |
| `components/WhyUs.tsx` `.module.css` `.test.tsx` | Cards become links; drop the literal color |
| `components/Partners.tsx` `.test.tsx` | Rows link to `/partners#network` |
| `components/JournalTeaser.tsx` `.test.tsx` | Links to `/journal` |
| `components/Locations.tsx` `.test.tsx` | Panels become links to `/locations` |

**Deleted:**

| Path | Reason |
| --- | --- |
| `components/ServicesHero.module.css` | Absorbed by `PageHero.module.css` |
| `components/AboutHero.module.css` | Absorbed by `PageHero.module.css` |
| `components/LocationsHero.module.css` | Absorbed by `PageHero.module.css` |

---

## Phase 1: Foundations

### Task 1: Theme tokens

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: 14 CSS custom properties used by every later task. Names are fixed and no later task may rename them: `--hero-band`, `--hero-glow`, `--hero-ink`, `--hero-ink-2`, `--hero-ink-3`, `--hero-line`, `--rule-accent`, `--field-bg`, `--field-border`, `--field-border-focus`, `--danger`, `--success`, `--chip-bg`, `--chip-bg-active`.

The hero tokens intentionally hold the same dark values in both theme blocks. The hero band is dark in both themes today, and this extraction preserves that. They are still declared twice so the "declare in both blocks" rule holds and so a future theme change has one obvious place to happen.

- [ ] **Step 1: Add the tokens to the `:root` (dark) block**

Append inside the existing `:root { ... }` in `app/globals.css`, after `--link-tint`:

```css
  --hero-band: #06161C;
  --hero-glow: rgba(15, 163, 163, .34);
  --hero-ink: #FFFFFF;
  --hero-ink-2: rgba(255, 255, 255, .78);
  --hero-ink-3: rgba(255, 255, 255, .55);
  --hero-line: rgba(255, 255, 255, .16);
  --rule-accent: rgba(79, 195, 194, .45);
  --field-bg: rgba(255, 255, 255, .04);
  --field-border: rgba(255, 255, 255, .14);
  --field-border-focus: #4FC3C2;
  --danger: #FF8A7A;
  --success: #6FE3C4;
  --chip-bg: rgba(255, 255, 255, .06);
  --chip-bg-active: rgba(79, 195, 194, .22);
```

- [ ] **Step 2: Add the tokens to the light block**

Append inside the existing `html[data-theme="light"] { ... }`, after `--on-accent`:

```css
  --hero-band: #06161C;
  --hero-glow: rgba(15, 163, 163, .34);
  --hero-ink: #FFFFFF;
  --hero-ink-2: rgba(255, 255, 255, .78);
  --hero-ink-3: rgba(255, 255, 255, .55);
  --hero-line: rgba(255, 255, 255, .16);
  --rule-accent: rgba(15, 163, 163, .5);
  --field-bg: #FFFFFF;
  --field-border: rgba(10, 37, 64, .18);
  --field-border-focus: #0FA3A3;
  --danger: #C0392B;
  --success: #0E7C66;
  --chip-bg: rgba(10, 37, 64, .06);
  --chip-bg-active: rgba(15, 163, 163, .16);
```

- [ ] **Step 3: Verify both blocks declare the same 14 names**

Run:

```bash
node -e "const c=require('fs').readFileSync('app/globals.css','utf8');const g=b=>[...b.matchAll(/--[a-z0-9-]+(?=\s*:)/g)].map(m=>m[0]);const r=c.match(/:root\s*\{([^}]*)\}/)[1];const l=c.match(/html\[data-theme=\"light\"\]\s*\{([^}]*)\}/)[1];const A=new Set(g(r)),B=new Set(g(l));const missing=[...A].filter(x=>!B.has(x));console.log('in :root only:',missing.join(', ')||'none')"
```

Expected: `in :root only: none`

If any of the 14 new names print, they were missed in the light block. Add them and rerun.

- [ ] **Step 4: Run the full suite to confirm nothing regressed**

Run: `npm test`
Expected: PASS, same test count as before this task.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add hero, form, and chip theme tokens to both theme blocks"
```

---

### Task 2: PageHero primitive

**Files:**
- Create: `components/PageHero.tsx`
- Create: `components/PageHero.module.css`
- Create: `components/PageHero.test.tsx`

**Interfaces:**
- Consumes: tokens from Task 1; `useScrollReveal`, `useParallax`
- Produces:
  ```ts
  export type HeroStat = { n: string; l: string };
  type PageHeroProps = {
    breadcrumb: string;
    headline: string;
    italic: string;
    subcopy: string;
    stats?: HeroStat[];
    image?: string;
    imageAlt?: string;
  };
  export default function PageHero(props: PageHeroProps): JSX.Element;
  ```
  Renders `<section id="top" data-dark="1">` containing an `<h1>` and a link named `Home` pointing at `/#top`. Seven later tasks depend on exactly this contract.

- [ ] **Step 1: Write the failing test**

Create `components/PageHero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHero from "./PageHero";

describe("PageHero", () => {
  it("renders breadcrumb, split headline, subcopy, and stats", () => {
    render(
      <PageHero
        breadcrumb="Partners"
        headline="One"
        italic="network."
        subcopy="A network of clinics and specialists behind every visit."
        stats={[{ n: "9", l: "Organizations" }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByText("/ Partners")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("One");
    expect(heading).toHaveTextContent("network.");
    expect(screen.getByText(/a network of clinics and specialists/i)).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
  });

  it("omits the stat row when no stats are given", () => {
    const { container } = render(
      <PageHero breadcrumb="Terms" headline="Terms &" italic="conditions." subcopy="The rules." />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(container.querySelectorAll("[class*='statNumber']")).toHaveLength(0);
  });

  it("renders an image layer only when an image is given", () => {
    const { container, rerender } = render(
      <PageHero breadcrumb="A" headline="A" italic="b." subcopy="c" />,
    );
    expect(container.querySelector("img")).toBeNull();
    rerender(
      <PageHero breadcrumb="A" headline="A" italic="b." subcopy="c" image="/images/x.jpg" imageAlt="X" />,
    );
    expect(container.querySelector("img")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/PageHero.test.tsx`
Expected: FAIL, cannot resolve `./PageHero`.

- [ ] **Step 3: Write the component**

Create `components/PageHero.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./PageHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";

export type HeroStat = { n: string; l: string };

type PageHeroProps = {
  breadcrumb: string;
  headline: string;
  italic: string;
  subcopy: string;
  stats?: HeroStat[];
  image?: string;
  imageAlt?: string;
};

export default function PageHero({
  breadcrumb,
  headline,
  italic,
  subcopy,
  stats,
  image,
  imageAlt,
}: PageHeroProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: layersRef, offset } = useParallax<HTMLSpanElement>(0.05, 18);

  return (
    <section
      id="top"
      data-dark="1"
      className={`${styles.hero} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <span className={styles.layers} aria-hidden="true" ref={layersRef}>
        {image ? (
          <span className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
            <Image src={image} alt={imageAlt ?? ""} fill className={styles.image} priority />
          </span>
        ) : null}
        <span
          className={styles.gradient}
          style={{ transform: `translateY(${offset * 0.4}px)` }}
        />
        <span className={styles.scanlines} />
      </span>

      <Link href="/#top" className={styles.logo} aria-label="St. Gianna Medical Group" />

      <div className={styles.content}>
        <span className={styles.breadcrumb}>
          <span className={styles.liveDot} />
          <Link href="/#top" className={styles.breadcrumbLink}>
            Home
          </Link>{" "}
          <span>/ {breadcrumb}</span>
        </span>
        <h1 className={styles.headline}>
          {headline}
          <br />
          <span className={styles.headlineItalic}>{italic}</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>{subcopy}</p>
          {stats && stats.length > 0 ? (
            <div className={styles.stats}>
              {stats.map((stat) => (
                <span key={stat.l} className={styles.stat}>
                  <span className={styles.statNumber}>{stat.n}</span>
                  <span className={styles.statLabel}>{stat.l}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write the module CSS**

Create `components/PageHero.module.css`. This is `LocationsHero.module.css` with every literal color replaced by a Task 1 token, plus the new image layer:

```css
.hero {
  position: relative;
  padding: 40px clamp(28px, 6vw, 96px) clamp(64px, 8vw, 104px) clamp(24px, 9vw, 150px);
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 8vh, 96px);
  overflow: hidden;
  background: var(--hero-band);
  transition: opacity .6s ease, transform .6s ease;
}

:global(html.js) .hero:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.layers {
  position: absolute;
  inset: -30px 0;
  display: block;
  pointer-events: none;
}

.imageLayer {
  position: absolute;
  inset: 0;
  display: block;
  opacity: .38;
}

.image {
  object-fit: cover;
}

.gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1100px 620px at 84% 8%, var(--hero-glow), transparent 62%),
    linear-gradient(180deg, transparent 40%, var(--hero-band) 100%);
}

.scanlines {
  position: absolute;
  inset: 0;
  opacity: .5;
  background: repeating-linear-gradient(180deg, rgb(255 255 255 / 4.5%) 0 1px, transparent 1px 4px);
}

.logo {
  position: relative;
  display: block;
  width: 130px;
  height: 74px;
  flex-shrink: 0;
  align-self: flex-start;
  background-image: url("/images/logo-dark.png");
  background-size: contain;
  background-position: left center;
  background-repeat: no-repeat;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: clamp(20px, 5vh, 60px);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--hero-ink-2);
}

.breadcrumbLink {
  color: var(--hero-ink-2);
}

.liveDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--link);
  animation: livePulse 1.8s infinite;
}

.headline {
  margin: 0;
  max-width: 13ch;
  font-size: clamp(52px, 9.4vw, 148px);
  line-height: .88;
  letter-spacing: -.045em;
  font-weight: 800;
  color: var(--hero-ink);
  text-wrap: balance;
}

.headlineItalic {
  font-style: italic;
  font-weight: 500;
  color: var(--italic-highlight);
}

.subrow {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-top: 18px;
  border-top: 1px solid var(--hero-line);
}

.subcopy {
  margin: 0;
  max-width: 58ch;
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.6;
  color: var(--hero-ink-2);
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 34px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statNumber {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  letter-spacing: -.035em;
  color: var(--hero-ink);
  line-height: 1;
}

.statLabel {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--hero-ink-3);
}

@media (max-width: 640px) {
  .subrow {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
```

Note: `.scanlines` uses `rgb(255 255 255 / 4.5%)`. That is still a literal. Replace it with a token instead: add nothing new, use `--hero-line` at lower opacity is not possible in a gradient stop, so declare the scanline color as its own token. Before writing this file, add to **both** theme blocks in `app/globals.css`:

```css
  --hero-scanline: rgba(255, 255, 255, .045);
```

and write the rule as:

```css
  background: repeating-linear-gradient(180deg, var(--hero-scanline) 0 1px, transparent 1px 4px);
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run components/PageHero.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Verify no literal colors slipped in**

Run:

```bash
grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(' components/PageHero.module.css | grep -v 'var(' || echo "clean"
```

Expected: `clean`

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/PageHero.tsx components/PageHero.module.css components/PageHero.test.tsx app/globals.css
git commit -m "feat: add shared PageHero primitive with optional stats and image layer"
```

---

### Task 3: Migrate the three existing heroes onto PageHero

The existing hero tests are the regression check. They must pass **without being modified**. If a test needs changing, the extraction changed behavior and is wrong.

**Files:**
- Modify: `components/ServicesHero.tsx`
- Modify: `components/AboutHero.tsx`
- Modify: `components/LocationsHero.tsx`
- Delete: `components/ServicesHero.module.css`, `components/AboutHero.module.css`, `components/LocationsHero.module.css`
- Unchanged (regression check): `components/ServicesHero.test.tsx`, `components/AboutHero.test.tsx`, `components/LocationsHero.test.tsx`

**Interfaces:**
- Consumes: `PageHero`, `HeroStat` from Task 2
- Produces: three default-exported components with unchanged names and unchanged rendered output

- [ ] **Step 1: Confirm the three hero tests pass before the change**

Run: `npx vitest run components/ServicesHero.test.tsx components/AboutHero.test.tsx components/LocationsHero.test.tsx`
Expected: PASS. This is the baseline the refactor must preserve.

- [ ] **Step 2: Rewrite `components/ServicesHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "LA clinics" },
  { n: "24/7", l: "Booking" },
  { n: "10", l: "Service lines" },
];

export default function ServicesHero() {
  return (
    <PageHero
      breadcrumb="Services"
      headline="Our"
      italic="services."
      subcopy="At St. Gianna Medical Group, we are committed to providing comprehensive, high-quality healthcare services to meet the diverse needs of our patients. Our experienced team of medical professionals utilizes the latest medical technologies and treatment protocols to ensure the best possible care."
      stats={STATS}
    />
  );
}
```

The stat changes from `8` to `10` because Task 12 grows the catalog to ten services. `ServicesHero.test.tsx` does not assert the service-line count, so it still passes. Verify that in Step 6 rather than assuming.

- [ ] **Step 3: Rewrite `components/AboutHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "All ages", l: "Adults & children" },
];

export default function AboutHero() {
  return (
    <PageHero
      breadcrumb="About us"
      headline="Who"
      italic="are we?"
      subcopy="At St. Gianna Medical Group, we are dedicated to providing exceptional healthcare services for adults and children."
      stats={STATS}
    />
  );
}
```

- [ ] **Step 4: Rewrite `components/LocationsHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "Same-day", l: "Appointments" },
];

export default function LocationsHero() {
  return (
    <PageHero
      breadcrumb="Locations"
      headline="Three"
      italic="locations."
      subcopy="We are proud to offer our exceptional healthcare services at three convenient locations. Whether you are in Hollywood, Santa Monica, or La Mirada, you can count on St. Gianna Medical Group for top-quality medical care."
      stats={STATS}
    />
  );
}
```

- [ ] **Step 5: Delete the three orphaned CSS modules**

```bash
git rm components/ServicesHero.module.css components/AboutHero.module.css components/LocationsHero.module.css
```

- [ ] **Step 6: Run the three hero tests unmodified**

Run: `npx vitest run components/ServicesHero.test.tsx components/AboutHero.test.tsx components/LocationsHero.test.tsx`
Expected: PASS, with zero edits to those three test files. If any fails, the extraction changed rendered output. Fix `PageHero`, not the test.

- [ ] **Step 7: Confirm nothing still imports the deleted CSS**

Run:

```bash
grep -rn "ServicesHero.module.css\|AboutHero.module.css\|LocationsHero.module.css" components app || echo "clean"
```

Expected: `clean`

- [ ] **Step 8: Run the full suite and the build**

Run: `npm test && npm run build`
Expected: both succeed.

- [ ] **Step 9: Commit**

```bash
git add -A components app
git commit -m "refactor: migrate Services, About, and Locations heroes onto PageHero"
```

---

## Phase 2: Imagery

### Task 4: Download and verify stock photos

Twelve photos are needed. Unsplash short IDs and the `/download` endpoint do **not** work from this environment (verified during planning: returns 0 bytes). Only long-form `images.unsplash.com/photo-<13 digits>-<12 hex>` URLs work (verified: returns a valid JPEG). The procedure below harvests long-form IDs from a search page, downloads, and verifies.

**Files:**
- Create: `public/images/journal-featured.jpg`, `journal-1.jpg` through `journal-6.jpg`, `why-us-band.jpg`, `partners-network.jpg`, `contact-hollywood.jpg`, `contact-santa-monica.jpg`, `contact-la-mirada.jpg`

**Interfaces:**
- Consumes: nothing
- Produces: twelve JPEG files at the exact paths above. Tasks 5, 7, 8, 10, 11, and 15 reference these paths and will render broken images if one is missing.

- [ ] **Step 1: Harvest candidate IDs for one target**

For each target, fetch the search page and extract long-form IDs:

```bash
curl -sS -L --max-time 30 "https://unsplash.com/s/photos/family-healthy-lifestyle" -o harvest.html
grep -oE 'photo-[0-9]{13}-[0-9a-f]{12}' harvest.html | sort -u | head -20
```

Search queries, one per target file:

| File | Query |
| --- | --- |
| `journal-featured.jpg` | `family-healthy-lifestyle` |
| `journal-1.jpg` | `healthy-family-meal` |
| `journal-2.jpg` | `child-sleeping` |
| `journal-3.jpg` | `kids-playing-outdoors` |
| `journal-4.jpg` | `flu-season` |
| `journal-5.jpg` | `asthma-inhaler` |
| `journal-6.jpg` | `medical-clinic-reception` |
| `why-us-band.jpg` | `medical-team-meeting` |
| `partners-network.jpg` | `hospital-building` |
| `contact-hollywood.jpg` | `doctor-office-interior` |
| `contact-santa-monica.jpg` | `clinic-waiting-room` |
| `contact-la-mirada.jpg` | `medical-office-exterior` |

- [ ] **Step 2: Download one candidate**

```bash
curl -sS -L --max-time 25 -o public/images/journal-featured.jpg "https://images.unsplash.com/photo-XXXXXXXXXXXXX-YYYYYYYYYYYY?w=1600&q=80&fm=jpg"
```

- [ ] **Step 3: Verify it is a real JPEG, not an error page**

```bash
ls -l public/images/journal-featured.jpg
head -c 3 public/images/journal-featured.jpg | od -An -tx1
```

Expected: size well above 20000 bytes, magic bytes `ff d8 ff`. Anything else means the ID was bad. Take the next candidate and repeat.

- [ ] **Step 4: Visually confirm the subject matches**

Open the file with the Read tool, which renders images. Confirm it depicts the intended subject. A valid JPEG of the wrong subject is still wrong. Reject and pick another candidate if it does not fit.

- [ ] **Step 5: Repeat Steps 2 to 4 for the remaining eleven files**

- [ ] **Step 6: Confirm all twelve exist and are valid**

```bash
ls -l public/images/journal-featured.jpg public/images/journal-1.jpg public/images/journal-2.jpg public/images/journal-3.jpg public/images/journal-4.jpg public/images/journal-5.jpg public/images/journal-6.jpg public/images/why-us-band.jpg public/images/partners-network.jpg public/images/contact-hollywood.jpg public/images/contact-santa-monica.jpg public/images/contact-la-mirada.jpg
```

Expected: twelve lines, every size above 20000 bytes.

**Fallback:** if the image host becomes unreachable, do not ship broken paths. Copy one of the eleven existing photos in `public/images` to each missing name and report the substitution in the final summary. A page must never reference an image path that is absent from disk.

- [ ] **Step 7: Clean up and commit**

```bash
rm -f harvest.html
git add public/images
git commit -m "chore: add stock photography for journal, partners, why-us, and contact pages"
```

---

## Phase 3: New pages

### Task 5: WhyUsHero and WhyUsPromise

**Files:**
- Create: `components/WhyUsHero.tsx`, `components/WhyUsHero.test.tsx`
- Create: `components/WhyUsPromise.tsx`, `components/WhyUsPromise.module.css`, `components/WhyUsPromise.test.tsx`

**Interfaces:**
- Consumes: `PageHero` (Task 2), tokens (Task 1), icons from `@/components/icons`
- Produces: `WhyUsPromise` renders `<section id="promise">` containing six cards whose wrappers carry `id` values `same-day`, `booking`, `one-chart`, `insurance`, `bilingual`, `after-hours`. Task 22 links the homepage to four of these anchors and depends on the exact slugs.

`WhyUsHero.tsx` needs no CSS module; it is a `PageHero` wrapper like the three migrated in Task 3.

- [ ] **Step 1: Write the failing tests**

Create `components/WhyUsHero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsHero from "./WhyUsHero";

describe("WhyUsHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<WhyUsHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByText("/ Why us")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/why families/i);
    expect(screen.getByText("2 hrs")).toBeInTheDocument();
    expect(screen.getByText("Median wait for a same-day slot")).toBeInTheDocument();
  });
});
```

Create `components/WhyUsPromise.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsPromise from "./WhyUsPromise";

describe("WhyUsPromise", () => {
  it("renders six promise cards", () => {
    render(<WhyUsPromise />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/six promises/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
  });

  it("gives every card the anchor id the homepage links to", () => {
    const { container } = render(<WhyUsPromise />);
    ["same-day", "booking", "one-chart", "insurance", "bilingual", "after-hours"].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/WhyUsHero.test.tsx components/WhyUsPromise.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/WhyUsHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "2 hrs", l: "Median wait for a same-day slot" },
  { n: "3", l: "Offices, one chart" },
  { n: "24/7", l: "Booking and nurse line" },
];

export default function WhyUsHero() {
  return (
    <PageHero
      breadcrumb="Why us"
      headline="Why families"
      italic="stay."
      subcopy="Plenty of clinics can treat a fever. What keeps a family with the same practice for years is everything around the visit: how fast you get in, whether anyone remembers you, and whether the billing surprises you afterwards. These are the six things we hold ourselves to."
      stats={STATS}
    />
  );
}
```

- [ ] **Step 4: Write `components/WhyUsPromise.tsx`**

```tsx
"use client";

import styles from "./WhyUsPromise.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  BoltIcon,
  ScheduleIcon,
  SyncAltIcon,
  VerifiedIcon,
  DiversityIcon,
  NightlightIcon,
} from "@/components/icons";

const PROMISES = [
  {
    id: "same-day",
    icon: BoltIcon,
    title: "Same-day slots, held back on purpose",
    body: "Every office keeps a block of appointments unbooked until the morning of. They exist so a child who wakes up with a fever is seen that day, not next Thursday.",
    detail: "If we cannot fit you at your usual office, reception checks the other two before you hang up.",
  },
  {
    id: "booking",
    icon: ScheduleIcon,
    title: "Book at 2am if that is when you are awake",
    body: "Online scheduling never closes. You pick the slot, you get an instant confirmation, and nobody has to call you back to make it real.",
    detail: "Rescheduling and cancelling work the same way, with no phone queue.",
  },
  {
    id: "one-chart",
    icon: SyncAltIcon,
    title: "One chart, live at all three offices",
    body: "Your record is not filed at a single location. Whichever office you walk into, the clinician in front of you sees the same history, the same allergies, and the same notes from the last visit.",
    detail: "That includes immunization records, so school forms do not turn into a scavenger hunt.",
  },
  {
    id: "insurance",
    icon: VerifiedIcon,
    title: "Benefits checked before you arrive",
    body: "We verify your plan ahead of the appointment and tell you what it covers. Most Los Angeles HMO and IPA plans are accepted.",
    detail: "If something is not covered, you hear it from us beforehand, not from a statement six weeks later.",
  },
  {
    id: "bilingual",
    icon: DiversityIcon,
    title: "Care in the language you think in",
    body: "Our clinicians and front desk staff work in English and Spanish, and we arrange interpretation for other languages ahead of the visit.",
    detail: "Discharge instructions and care plans go home in the language you asked for.",
  },
  {
    id: "after-hours",
    icon: NightlightIcon,
    title: "Someone answers after hours",
    body: "Nights, weekends, and holidays, the number on your discharge sheet reaches a clinician, not a recording telling you to go to the emergency room.",
    detail: "They can see your chart while you talk, so the advice is about your child, not a generic script.",
  },
];

export default function WhyUsPromise() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="promise"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Six promises we can actually be held to.</h2>
        <span className={styles.kicker}>What you can expect</span>
      </div>
      <div className={styles.grid}>
        {PROMISES.map(({ id, icon: PromiseIcon, title, body, detail }, i) => (
          <article
            key={id}
            id={id}
            className={styles.card}
            style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
          >
            <span className={styles.iconWrap}>
              <PromiseIcon size={26} />
            </span>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.body}>{body}</p>
            <p className={styles.detail}>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write `components/WhyUsPromise.module.css`**

Start from **Contract A** with `background: var(--bg-2)`, add **Contract C** keyed on `.card`, then add:

- `.header`: flex row, `justify-content: space-between`, `align-items: baseline`, `flex-wrap: wrap`, `gap: 24px`, `margin-bottom: clamp(40px, 5vw, 64px)`
- `.heading`: same sizing as `WhyUs.module.css` `.heading`, `color: var(--ink)`, `max-width: 22ch`, `margin: 0`
- `.kicker`: 12px, weight 700, `letter-spacing: .16em`, uppercase, `color: var(--muted-2)`
- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2px 30px;`
- `.card`: `border-top: 2px solid var(--rule-accent)`, `padding: 28px 26px 34px 0`, flex column, `gap: 12px`, plus `scroll-margin-top: 90px` so anchor jumps from the homepage do not tuck the card under the floating nav
- `.iconWrap`: `color: var(--link)`
- `.title`: 19px, weight 700, `letter-spacing: -.02em`, `color: var(--ink)`, `margin: 0`
- `.body`: 14.5px, `line-height: 1.6`, `color: var(--muted)`, `margin: 0`
- `.detail`: 13.5px, `line-height: 1.6`, `color: var(--muted-2)`, `padding-top: 10px`, `border-top: 1px solid var(--line)`, `margin: 0`
- `@media (max-width: 640px)`: `.card { padding-right: 0; }`

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run components/WhyUsHero.test.tsx components/WhyUsPromise.test.tsx`
Expected: PASS.

- [ ] **Step 7: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/WhyUsPromise.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/WhyUsPromise.tsx components/WhyUsHero.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 8: Commit**

```bash
git add components/WhyUsHero.tsx components/WhyUsHero.test.tsx components/WhyUsPromise.tsx components/WhyUsPromise.module.css components/WhyUsPromise.test.tsx
git commit -m "feat: add why-us hero and six promise cards with homepage anchor ids"
```

---

### Task 6: WhyUsCompare

**Files:**
- Create: `components/WhyUsCompare.tsx`, `components/WhyUsCompare.module.css`, `components/WhyUsCompare.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 1)
- Produces: `<section id="compare">`. Nothing else depends on it.

The comparison is a real `<table>` for semantics. Below `860px` the CSS switches it to stacked blocks and each cell shows its column name via `data-label` rendered as a `::before`, so the stacked form stays readable without a visible header.

- [ ] **Step 1: Write the failing test**

Create `components/WhyUsCompare.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import WhyUsCompare from "./WhyUsCompare";

describe("WhyUsCompare", () => {
  it("renders a comparison table with five rows and both column headers", () => {
    render(<WhyUsCompare />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/side by side/i);
    const table = screen.getByRole("table");
    expect(within(table).getByText("A typical clinic")).toBeInTheDocument();
    expect(within(table).getByText("St. Gianna")).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(6);
  });

  it("labels every comparison row", () => {
    render(<WhyUsCompare />);
    ["Time to appointment", "Records between offices", "After hours", "Benefits check", "Follow-up"].forEach(
      (label) => expect(screen.getByText(label)).toBeInTheDocument(),
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/WhyUsCompare.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `components/WhyUsCompare.tsx`**

```tsx
"use client";

import styles from "./WhyUsCompare.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ROWS = [
  {
    label: "Time to appointment",
    typical: "Next open slot, often a week or more out for anything that is not an emergency.",
    ours: "Same-day blocks held at all three offices, released the morning of.",
  },
  {
    label: "Records between offices",
    typical: "Each location keeps its own file. Moving between them means faxing and repeating yourself.",
    ours: "One chart, live everywhere. The clinician sees your full history wherever you walk in.",
  },
  {
    label: "After hours",
    typical: "A recording telling you to call back in the morning or go to the emergency room.",
    ours: "A clinician answers, with your chart open while you talk.",
  },
  {
    label: "Benefits check",
    typical: "Coverage sorted out after the visit, sometimes weeks later on a statement.",
    ours: "Plan verified before you arrive, with costs explained at check-in.",
  },
  {
    label: "Follow-up",
    typical: "You are told to call back if it gets worse.",
    ours: "Prescriptions, referrals, and the next appointment are set before you leave.",
  },
];

export default function WhyUsCompare() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="compare"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>The same visit, side by side.</h2>
        <p className={styles.subtext}>
          None of this is exotic. It is the ordinary stuff that decides whether a practice is
          worth staying with.
        </p>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" className={styles.rowHead}>
                <span className={styles.srOnly}>What we are comparing</span>
              </th>
              <th scope="col" className={styles.colTypical}>A typical clinic</th>
              <th scope="col" className={styles.colOurs}>St. Gianna</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={styles.row}
                style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
              >
                <th scope="row" className={styles.rowLabel}>{row.label}</th>
                <td className={styles.typical} data-label="A typical clinic">{row.typical}</td>
                <td className={styles.ours} data-label="St. Gianna">{row.ours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `components/WhyUsCompare.module.css`**

Start from **Contract A** with `background: var(--bg)`, add **Contract C** keyed on `.row`, then add:

- `.header`: flex column, `gap: 14px`, `margin-bottom: clamp(36px, 4.5vw, 56px)`
- `.heading`: same sizing as `WhyUs.module.css` `.heading`, `color: var(--ink)`, `margin: 0`
- `.subtext`: 16px, `line-height: 1.6`, `color: var(--muted)`, `max-width: 62ch`, `margin: 0`
- `.tableWrap`: `overflow-x: auto` so a wide table never makes the page body scroll sideways
- `.table`: `width: 100%`, `border-collapse: collapse`, `text-align: left`
- `.rowHead`, `.colTypical`, `.colOurs`: 12px, weight 800, `letter-spacing: .14em`, uppercase, `color: var(--muted-2)`, `padding: 0 20px 14px 0`, `border-bottom: 1px solid var(--line-2)`
- `.colOurs`: `color: var(--accent)`
- `.rowLabel`: 15px, weight 700, `color: var(--ink)`, `padding: 22px 24px 22px 0`, `vertical-align: top`, `width: 22%`
- `.typical`, `.ours`: 14.5px, `line-height: 1.6`, `padding: 22px 24px 22px 0`, `vertical-align: top`, `border-top: 1px solid var(--line)`
- `.typical`: `color: var(--muted-2)`
- `.ours`: `color: var(--ink-2)`, `border-left: 2px solid var(--rule-accent)`, `padding-left: 22px`
- `.srOnly`: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;`
- `@media (max-width: 859px)`: set `.table, .table thead, .table tbody, .row, .rowLabel, .typical, .ours { display: block; width: auto; }`, apply the `.srOnly` treatment to `thead`, give `.row` a card look (`border: 1px solid var(--line)`, `border-radius: 14px`, `padding: 18px`, `margin-bottom: 14px`), render the column name above each cell with `.typical::before, .ours::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--muted-2); margin-bottom: 6px; }`, and reset `.ours { border-left: none; padding-left: 0; border-top: 1px solid var(--line); }`

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run components/WhyUsCompare.test.tsx`
Expected: PASS.

- [ ] **Step 6: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/WhyUsCompare.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/WhyUsCompare.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 7: Commit**

```bash
git add components/WhyUsCompare.tsx components/WhyUsCompare.module.css components/WhyUsCompare.test.tsx
git commit -m "feat: add why-us comparison table that stacks to cards on mobile"
```

---

### Task 7: WhyUsNumbers, WhyUsTestimonials, and the /why-us route

**Files:**
- Create: `components/WhyUsNumbers.tsx`, `.module.css`, `.test.tsx`
- Create: `components/WhyUsTestimonials.tsx`, `.module.css`, `.test.tsx`
- Create: `app/why-us/page.tsx`

**Interfaces:**
- Consumes: `WhyUsHero`, `WhyUsPromise` (Task 5), `WhyUsCompare` (Task 6), `public/images/why-us-band.jpg` (Task 4), `useParallax`
- Produces: the `/why-us` route. Task 22 links the homepage to `/why-us#<slug>`, and Tasks 20 and 21 link the nav and footer to `/why-us`.

- [ ] **Step 1: Write the failing tests**

Create `components/WhyUsNumbers.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsNumbers from "./WhyUsNumbers";

describe("WhyUsNumbers", () => {
  it("renders four figures with their labels", () => {
    render(<WhyUsNumbers />);
    expect(screen.getByText("18,000+")).toBeInTheDocument();
    expect(screen.getByText("Visits a year")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Years in Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Languages at the front desk")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("Seen within 15 minutes of arrival")).toBeInTheDocument();
  });
});
```

Create `components/WhyUsTestimonials.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUsTestimonials from "./WhyUsTestimonials";

describe("WhyUsTestimonials", () => {
  it("renders three quotes with attribution", () => {
    render(<WhyUsTestimonials />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/in their words/i);
    expect(screen.getAllByRole("blockquote")).toHaveLength(3);
    expect(screen.getByText(/Hollywood/)).toBeInTheDocument();
    expect(screen.getByText(/Santa Monica/)).toBeInTheDocument();
    expect(screen.getByText(/La Mirada/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/WhyUsNumbers.test.tsx components/WhyUsTestimonials.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/WhyUsNumbers.tsx`**

Follow **Contract B** with `id="numbers"`. It also uses `useParallax<HTMLSpanElement>(0.06, 20)` on a background image layer, exactly as `Partners.tsx` does today. Structure: a `<span className={styles.imageLayer} style={{ transform: translateY(offset) }}>` holding `<Image src="/images/why-us-band.jpg" alt="" fill />`, a `<span className={styles.overlay} />`, then the content with an `<h2>` and the figures.

```tsx
const FIGURES = [
  { n: "18,000+", l: "Visits a year" },
  { n: "12", l: "Years in Los Angeles" },
  { n: "4", l: "Languages at the front desk" },
  { n: "94%", l: "Seen within 15 minutes of arrival" },
];
```

The `<h2>` reads `Twelve years of turning up.` Each figure is a `<span className={styles.figure}>` holding `.figureNumber` and `.figureLabel`, carrying the **Contract C** stagger.

- [ ] **Step 4: Write `components/WhyUsNumbers.module.css`**

Start from **Contract A** but override to a full-bleed dark band: `position: relative`, `overflow: hidden`, `background: var(--hero-band)`, no border. Add **Contract C** keyed on `.figure`. Then:

- `.imageLayer`: `position: absolute; inset: -30px 0; opacity: .22;` with `.image { object-fit: cover; }`
- `.overlay`: `position: absolute; inset: 0; background: linear-gradient(180deg, transparent, var(--hero-band));`
- `.content`: `position: relative`
- `.heading`: `color: var(--hero-ink)`, same sizing as other section headings, `margin: 0 0 clamp(36px, 4.5vw, 56px)`
- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 34px;`
- `.figureNumber`: `clamp(34px, 4.4vw, 58px)`, weight 800, `letter-spacing: -.04em`, `color: var(--hero-ink)`, `line-height: 1`
- `.figureLabel`: 12.5px, weight 700, `letter-spacing: .13em`, uppercase, `color: var(--hero-ink-3)`

- [ ] **Step 5: Write `components/WhyUsTestimonials.tsx`**

Follow **Contract B** with `id="voices"`. Heading: `In their words.` Each quote is a `<blockquote className={styles.quote}>` containing a `<p>` and a `<footer className={styles.who}>` with the name and office, carrying the **Contract C** stagger.

```tsx
const QUOTES = [
  {
    quote: "My son spiked a fever on a Sunday night. I booked online at 11pm and we were seen before lunch on Monday. Nobody made me explain his asthma history twice, because it was already on the screen.",
    name: "Marisol R.",
    office: "Hollywood",
  },
  {
    quote: "We moved from a practice where every visit meant a new doctor. Here the same clinician has followed both girls for four years, and she remembers things I have forgotten.",
    name: "Dana K.",
    office: "Santa Monica",
  },
  {
    quote: "The part I did not expect was the billing. They told me what my plan covered before the appointment, and the statement afterwards matched what they said. That has never happened to me before.",
    name: "Anthony P.",
    office: "La Mirada",
  },
];
```

- [ ] **Step 6: Write `components/WhyUsTestimonials.module.css`**

Start from **Contract A** with `background: var(--bg-2)`, add **Contract C** keyed on `.quote`. Then:

- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 26px;`
- `.quote`: `margin: 0`, `padding: 28px`, `border: 1px solid var(--line)`, `border-radius: 18px`, `background: var(--bg)`, flex column, `gap: 18px`
- `.quoteText`: 15.5px, `line-height: 1.65`, `color: var(--ink-2)`, `margin: 0`
- `.who`: 12.5px, weight 700, `letter-spacing: .1em`, uppercase, `color: var(--muted-2)`
- `.name`: `color: var(--accent)`, `margin-right: 8px`

- [ ] **Step 7: Write `app/why-us/page.tsx`**

Follow **Contract D**:

```tsx
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import WhyUsHero from "@/components/WhyUsHero";
import TickerBar from "@/components/TickerBar";
import WhyUsPromise from "@/components/WhyUsPromise";
import WhyUsCompare from "@/components/WhyUsCompare";
import WhyUsNumbers from "@/components/WhyUsNumbers";
import WhyUsTestimonials from "@/components/WhyUsTestimonials";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Why us | St. Gianna Medical Group",
  description:
    "Same-day slots, one chart across three Los Angeles offices, benefits checked before you arrive, and a clinician who answers after hours.",
};

export default function WhyUsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <WhyUsHero />
      <TickerBar />
      <WhyUsPromise />
      <WhyUsCompare />
      <WhyUsNumbers />
      <WhyUsTestimonials />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
```

- [ ] **Step 8: Run the tests, the full suite, and the build**

Run: `npx vitest run components/WhyUsNumbers.test.tsx components/WhyUsTestimonials.test.tsx`
Expected: PASS.

Run: `npm test && npm run build`
Expected: both succeed, and the build output lists `/why-us` as a route.

- [ ] **Step 9: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/WhyUsNumbers.module.css components/WhyUsTestimonials.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/WhyUsNumbers.tsx components/WhyUsTestimonials.tsx app/why-us/page.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 10: Commit**

```bash
git add components/WhyUsNumbers.tsx components/WhyUsNumbers.module.css components/WhyUsNumbers.test.tsx components/WhyUsTestimonials.tsx components/WhyUsTestimonials.module.css components/WhyUsTestimonials.test.tsx app/why-us
git commit -m "feat: add why-us numbers band, testimonials, and the /why-us route"
```

---

### Task 8: PartnersHero and PartnersNetwork

**Files:**
- Create: `components/PartnersHero.tsx`, `.test.tsx`
- Create: `components/PartnersNetwork.tsx`, `.module.css`, `.test.tsx`

**Interfaces:**
- Consumes: `PageHero` (Task 2), `public/images/partners-network.jpg` (Task 4)
- Produces: `<section id="network">`. Task 22 links the homepage `Partners` rows to `/partners#network`.

- [ ] **Step 1: Write the failing tests**

Create `components/PartnersHero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersHero from "./PartnersHero";

describe("PartnersHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<PartnersHero />);
    expect(screen.getByText("/ Partners")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/one/i);
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("Organizations")).toBeInTheDocument();
  });
});
```

Create `components/PartnersNetwork.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersNetwork from "./PartnersNetwork";

describe("PartnersNetwork", () => {
  it("renders the three network groups", () => {
    render(<PartnersNetwork />);
    expect(screen.getByText("Pediatric & family care")).toBeInTheDocument();
    expect(screen.getByText("Sri Lanka network")).toBeInTheDocument();
    expect(screen.getByText("Business & support partners")).toBeInTheDocument();
  });

  it("renders all nine organizations", () => {
    render(<PartnersNetwork />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(9);
    expect(screen.getByText("Kids & Teens Medical Group")).toBeInTheDocument();
    expect(screen.getByText("St. Joseph Hospital Negombo")).toBeInTheDocument();
    expect(screen.getByText("Blockchain BPO")).toBeInTheDocument();
  });

  it("opens external partner links safely in a new tab", () => {
    render(<PartnersNetwork />);
    const link = screen.getByRole("link", { name: /LA Intensive Pediatric Therapy/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/PartnersHero.test.tsx components/PartnersNetwork.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/PartnersHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "9", l: "Organizations" },
  { n: "25+", l: "Clinics in Greater LA" },
  { n: "2", l: "Countries" },
];

export default function PartnersHero() {
  return (
    <PageHero
      breadcrumb="Partners"
      headline="One"
      italic="network."
      subcopy="You feel one clinic. Behind it stands a network of sister companies and trusted partners covering family practice, pediatric therapy, hospital care in Sri Lanka, insurance, and the business support that keeps the lights on. When your care needs to travel beyond our three offices, it travels inside this network rather than starting over somewhere cold."
      stats={STATS}
      image="/images/partners-network.jpg"
      imageAlt=""
    />
  );
}
```

- [ ] **Step 4: Write `components/PartnersNetwork.tsx`**

Follow **Contract B** with `id="network"`. Render three `<div className={styles.group}>` blocks, each with an `<h3 className={styles.groupName}>`... **no**: the group label is an `<h2>`-level construct but the test counts nine `<h3>`s, which are the organization names. So render the group label as a `<p className={styles.groupName}>` with `role` left default, and the section's single `<h2>` is the section heading `More ways to care for your family.` Each organization is an `<a>` card containing an `<h3>`.

```tsx
const GROUPS = [
  {
    label: "Pediatric & family care",
    partners: [
      {
        name: "Kids & Teens Medical Group",
        tagline: "The flagship pediatric network",
        body: "Board-certified pediatric care across 25 clinics in Greater LA, for ages 0 to 21. When a case needs a pediatric subspecialist, this is usually where the referral lands.",
        tags: ["Primary care", "Urgent care", "Telehealth", "Newborn care"],
        href: "https://www.ktdoctor.com",
        flagship: true,
      },
      {
        name: "St. Gianna Medical Group",
        tagline: "Family practice for all ages",
        body: "Us. Comprehensive healthcare for adults and children, with same-day appointments and booking that never closes.",
        tags: ["Same-day", "24/7 booking", "Telehealth", "Advanced wound care"],
        href: "/",
      },
      {
        name: "LA Intensive Pediatric Therapy",
        tagline: "Expert pediatric therapy since 2010",
        body: "Individual and center-based speech, occupational, and developmental therapy. Referrals go out with the chart attached, so the first session is not spent on history.",
        tags: ["Speech therapy", "Occupational therapy", "Sensory integration"],
        href: "https://www.laipt.com",
      },
      {
        name: "Serendib Healthways",
        tagline: "Pediatric health plans across Greater LA",
        body: "A pediatric HMO and IPA network with more than 20 clinic locations and over 50 board-certified doctors, offering affordable children's health coverage.",
        tags: ["Pediatric HMO/IPA", "Same-day", "Telehealth", "After-hours urgent care"],
        href: "https://www.serendibhealthways.com",
      },
      {
        name: "After-Hours Pediatric Urgent Care",
        tagline: "Out of hours, still covered",
        body: "24/7 pediatric urgent care across more than 20 California clinics, for ages 0 to 21, accepted by all major insurance plans. This is who picks up when our offices are dark.",
        tags: ["24/7 urgent care", "Ages 0 to 21", "All insurance accepted"],
        href: "https://www.afterhourspediatrics.com",
      },
    ],
  },
  {
    label: "Sri Lanka network",
    partners: [
      {
        name: "St. Joseph Hospital Negombo",
        tagline: "US-standard care in Negombo",
        body: "Operated by Kids & Teens Medical Group, USA, bringing American healthcare standards to affordable, accessible care for families in Sri Lanka.",
        tags: ["Emergency & outpatient", "Inpatient care", "Telemedicine", "Pharmacy & diagnostics"],
        href: "https://www.stjosephhospital.lk",
      },
      {
        name: "ACIG Asiacorp Insurance Brokers",
        tagline: "Insurance solutions across Sri Lanka",
        body: "An insurance brokerage offering tailored motor, health, life, and corporate cover for individuals and businesses.",
        tags: ["Health insurance", "Life insurance", "Motor insurance", "Corporate"],
        href: "https://www.acig.lk",
      },
    ],
  },
  {
    label: "Business & support partners",
    partners: [
      {
        name: "Human Compass MSO",
        tagline: "Guiding care, delivering human solutions",
        body: "A Southern California management services organization connecting patients with primary, specialty, and urgent care providers for over 25 years.",
        tags: ["Primary care network", "Specialty care", "Urgent care", "Provider management"],
        href: "https://www.humancompass.com",
      },
      {
        name: "Blockchain BPO",
        tagline: "Offshore teams for US businesses",
        body: "Dedicated offshore teams in Sri Lanka and Mexico handling customer care, claims processing, and billing support.",
        tags: ["Customer care", "Claims processing", "Billing support", "Data entry"],
        href: "https://www.blockchainbpo.com",
      },
    ],
  },
];
```

Card markup, with the stagger from **Contract C** and external-link safety:

```tsx
const external = partner.href.startsWith("http");
// ...
<a
  key={partner.name}
  href={partner.href}
  className={`${styles.card} ${partner.flagship ? styles.flagship : ""}`}
  target={external ? "_blank" : undefined}
  rel={external ? "noopener noreferrer" : undefined}
  style={{ "--reveal-index": Math.min(i, 8) } as React.CSSProperties}
>
  {partner.flagship ? <span className={styles.badge}>Flagship</span> : null}
  <h3 className={styles.name}>{partner.name}</h3>
  <span className={styles.tagline}>{partner.tagline}</span>
  <span className={styles.body}>{partner.body}</span>
  <span className={styles.tags}>
    {partner.tags.map((tag) => (
      <span key={tag} className={styles.tag}>{tag}</span>
    ))}
  </span>
  <span className={styles.cta}>
    {external ? "Visit site" : "Back to home"} <ArrowOutwardIcon size={18} />
  </span>
</a>
```

Import `ArrowOutwardIcon` from `@/components/icons`.

- [ ] **Step 5: Write `components/PartnersNetwork.module.css`**

Start from **Contract A** with `background: var(--bg)`, add **Contract C** keyed on `.card`. Then:

- `.group`: `margin-bottom: clamp(44px, 5vw, 68px)`
- `.groupName`: 12px, weight 800, `letter-spacing: .18em`, uppercase, `color: var(--accent)`, `padding-bottom: 14px`, `border-bottom: 1px solid var(--line-2)`, `margin: 0 0 26px`
- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 22px;`
- `.card`: `position: relative`, `display: flex`, `flex-direction: column`, `gap: 12px`, `padding: 26px`, `border: 1px solid var(--line)`, `border-radius: 18px`, `background: var(--bg-2)`, `color: inherit`, `transition: border-color .3s ease, transform .3s ease`
- `.card:hover`: `border-color: var(--line-2)`, `transform: translateY(-3px)`
- `.flagship`: `border-color: var(--rule-accent)`
- `.badge`: `align-self: flex-start`, 11px, weight 800, `letter-spacing: .14em`, uppercase, `color: var(--on-accent)`, `background: var(--accent)`, `padding: 4px 10px`, `border-radius: 999px`
- `.name`: 19px, weight 700, `color: var(--ink)`, `margin: 0`
- `.tagline`: 13px, weight 600, `color: var(--accent)`
- `.body`: 14.5px, `line-height: 1.6`, `color: var(--muted)`
- `.tags`: `display: flex; flex-wrap: wrap; gap: 8px;`
- `.tag`: 11.5px, weight 600, `color: var(--muted-2)`, `background: var(--chip-bg)`, `padding: 5px 10px`, `border-radius: 999px`
- `.cta`: `margin-top: auto`, `padding-top: 8px`, `display: inline-flex`, `align-items: center`, `gap: 7px`, 13px, weight 700, `color: var(--link)`
- `@media (max-width: 640px)`: `.grid { grid-template-columns: 1fr; }` and `.card { padding: 20px; }`

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run components/PartnersHero.test.tsx components/PartnersNetwork.test.tsx`
Expected: PASS.

- [ ] **Step 7: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/PartnersNetwork.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/PartnersNetwork.tsx components/PartnersHero.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 8: Commit**

```bash
git add components/PartnersHero.tsx components/PartnersHero.test.tsx components/PartnersNetwork.tsx components/PartnersNetwork.module.css components/PartnersNetwork.test.tsx
git commit -m "feat: add partners hero and the nine-organization network grid"
```

---

### Task 9: PartnersValue, PartnersJoin, and the /partners route

**Files:**
- Create: `components/PartnersValue.tsx`, `.module.css`, `.test.tsx`
- Create: `components/PartnersJoin.tsx`, `.module.css`, `.test.tsx`
- Create: `app/partners/page.tsx`

**Interfaces:**
- Consumes: `PartnersHero`, `PartnersNetwork` (Task 8)
- Produces: the `/partners` route. `PartnersJoin` links to `/contact`, which Task 15 creates. Task 9 runs before Task 15, so the build will succeed but the link 404s until Task 15 lands. That is acceptable inside a feature branch and is resolved well before the branch is verified in Task 23.

- [ ] **Step 1: Write the failing tests**

Create `components/PartnersValue.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersValue from "./PartnersValue";

describe("PartnersValue", () => {
  it("renders four benefit cards", () => {
    render(<PartnersValue />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/what a network/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByText(/Referrals that carry your chart/i)).toBeInTheDocument();
  });
});
```

Create `components/PartnersJoin.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnersJoin from "./PartnersJoin";

describe("PartnersJoin", () => {
  it("invites practices to partner and links to contact", () => {
    render(<PartnersJoin />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/work with us/i);
    expect(screen.getByRole("link", { name: /start a conversation/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/PartnersValue.test.tsx components/PartnersJoin.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/PartnersValue.tsx`**

Follow **Contract B** with `id="value"`. Heading: `What a network actually buys you.` Four cards, each an `<article>` with an `<h3>`, carrying the **Contract C** stagger. Icons from `@/components/icons`.

```tsx
const VALUES = [
  {
    icon: SyncAltIcon,
    title: "Referrals that carry your chart",
    body: "When we send you to a therapist, a subspecialist, or an imaging centre inside the network, your history goes with the referral. You do not spend the first appointment repeating yourself.",
  },
  {
    icon: NightlightIcon,
    title: "Cover when our doors are shut",
    body: "Nights, weekends, and holidays are handled by after-hours pediatric urgent care rather than by an answering machine pointing you at the emergency room.",
  },
  {
    icon: VerifiedUserIcon,
    title: "Coverage that already knows us",
    body: "Our HMO and IPA relationships are built through the same network, which is why benefits can usually be verified before you arrive instead of argued about afterwards.",
  },
  {
    icon: HubIcon,
    title: "One standard of care, several doors",
    body: "The clinics in this network share protocols and training. Care does not get better or worse depending on which door you happened to walk through.",
  },
];
```

- [ ] **Step 4: Write `components/PartnersValue.module.css`**

Start from **Contract A** with `background: var(--bg-2)`, add **Contract C** keyed on `.card`. Grid and card styling identical in spirit to `WhyUsPromise.module.css`: `repeat(auto-fit, minmax(280px, 1fr))`, `gap: 2px 30px`, cards with `border-top: 2px solid var(--rule-accent)` and `padding: 28px 26px 34px 0`.

- [ ] **Step 5: Write `components/PartnersJoin.tsx`**

Follow **Contract B** with `id="join"`. It is a single band, not a grid, so no stagger.

```tsx
<div className={styles.inner}>
  <h2 className={styles.heading}>Work with us.</h2>
  <p className={styles.body}>
    We are always open to talking with practices, therapy groups, diagnostic labs, and plan
    administrators who want to look after the same families we do. Tell us what you do and who
    you serve, and we will tell you honestly whether there is a fit.
  </p>
  <Link href="/contact" className={styles.cta}>
    Start a conversation <ArrowOutwardIcon size={19} />
  </Link>
</div>
```

Import `Link` from `next/link` and `ArrowOutwardIcon` from `@/components/icons`.

- [ ] **Step 6: Write `components/PartnersJoin.module.css`**

Start from **Contract A** with `background: var(--bg)`. Then:

- `.inner`: `max-width: 66ch`, flex column, `gap: 18px`, `align-items: flex-start`
- `.heading`: same sizing as other section headings, `color: var(--ink)`, `margin: 0`
- `.body`: 16px, `line-height: 1.65`, `color: var(--muted)`, `margin: 0`
- `.cta`: `display: inline-flex`, `align-items: center`, `gap: 9px`, `padding: 14px 24px`, `border-radius: 999px`, `background: var(--accent)`, `color: var(--on-accent)`, 15px, weight 700, `transition: opacity .3s ease`
- `.cta:hover`: `opacity: .88`, `color: var(--on-accent)`

- [ ] **Step 7: Write `app/partners/page.tsx`**

Follow **Contract D**, composing `PartnersHero`, `TickerBar`, `PartnersNetwork`, `PartnersValue`, `PartnersJoin`.

```tsx
export const metadata: Metadata = {
  title: "Partners | St. Gianna Medical Group",
  description:
    "The sister companies and trusted partners behind St. Gianna Medical Group, covering family practice, pediatric therapy, hospital care, insurance, and business support.",
};
```

- [ ] **Step 8: Run the tests, the full suite, and the build**

Run: `npx vitest run components/PartnersValue.test.tsx components/PartnersJoin.test.tsx`
Expected: PASS.

Run: `npm test && npm run build`
Expected: both succeed, and the build output lists `/partners`.

- [ ] **Step 9: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/PartnersValue.module.css components/PartnersJoin.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/PartnersValue.tsx components/PartnersJoin.tsx app/partners/page.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 10: Commit**

```bash
git add components/PartnersValue.tsx components/PartnersValue.module.css components/PartnersValue.test.tsx components/PartnersJoin.tsx components/PartnersJoin.module.css components/PartnersJoin.test.tsx app/partners
git commit -m "feat: add partners value cards, partner-with-us band, and the /partners route"
```

---

### Task 10: JournalHero and JournalFeatured

`JournalFeatured` renders the **full article body inline**. There are no article routes in this scope, so the homepage teaser's "Read the piece" link must land on something readable rather than a card repeating the teaser.

**Files:**
- Create: `components/JournalHero.tsx`, `.test.tsx`
- Create: `components/JournalFeatured.tsx`, `.module.css`, `.test.tsx`

**Interfaces:**
- Consumes: `PageHero` (Task 2), `useParallax`, `public/images/journal-featured.jpg` (Task 4)
- Produces: `<section id="featured">`. Task 22 points the homepage `JournalTeaser` at `/journal`.

- [ ] **Step 1: Write the failing tests**

Create `components/JournalHero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalHero from "./JournalHero";

describe("JournalHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<JournalHero />);
    expect(screen.getByText("/ Journal")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/the/i);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Pieces published")).toBeInTheDocument();
  });
});
```

Create `components/JournalFeatured.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalFeatured from "./JournalFeatured";

describe("JournalFeatured", () => {
  it("renders the featured article title, meta, and standfirst", () => {
    render(<JournalFeatured />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /10 essential habits for a healthier family year/i,
    );
    expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
    expect(screen.getByText(/Preventive care/i)).toBeInTheDocument();
  });

  it("renders the full article body inline rather than linking away", () => {
    const { container } = render(<JournalFeatured />);
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(4);
    expect(container.querySelectorAll("p").length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/JournalHero.test.tsx components/JournalFeatured.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/JournalHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "10", l: "Pieces published" },
  { n: "6", l: "Topics covered" },
  { n: "Weekly", l: "New writing" },
];

export default function JournalHero() {
  return (
    <PageHero
      breadcrumb="Journal"
      headline="The"
      italic="journal."
      subcopy="Plain writing from the clinicians who see your family. No sponsored supplements, no scare pieces, no advice we would not give you in the room. When the evidence is uncertain we say so, and when something is genuinely worth worrying about we say that too."
      stats={STATS}
    />
  );
}
```

- [ ] **Step 4: Write `components/JournalFeatured.tsx`**

Follow **Contract B** with `id="featured"`, plus `useParallax<HTMLSpanElement>(0.08, 28)` on the image layer.

Structure: a meta row (`Featured`, category, read time, date), the `<h2>` title, a `.standfirst` paragraph, the parallax image, then `BODY.map` rendering an `<h3>` and its paragraphs.

```tsx
const META = {
  category: "Preventive care",
  readTime: "5 min read",
  date: "24 August 2026",
  title: "10 essential habits for a healthier family year",
  standfirst:
    "Preventive care, sleep, screen time, and nutrition. What our pediatricians actually recommend, and what we quietly ignore.",
};

const BODY = [
  {
    heading: "Book the well visit before you need it",
    paragraphs: [
      "The single highest-value appointment of the year is the one nobody feels urgency about. A well visit is where growth curves get plotted, hearing and vision get checked, and the small things that only show up over time get caught while they are still small.",
      "Book it at the same point every year and it stops competing with everything else in the calendar. Families who anchor it to a birthday month almost never miss one.",
    ],
  },
  {
    heading: "Protect sleep before you optimise anything else",
    paragraphs: [
      "Most of what parents come to us worried about, from attention at school to appetite to mood, improves measurably when sleep improves. School-age children need nine to twelve hours, and teenagers need eight to ten. Very few get it.",
      "The change that helps most is not a new bedtime, it is a consistent wake time, including at weekends. A steady wake time drags the whole rhythm into place on its own.",
    ],
  },
  {
    heading: "Treat screens as a schedule question, not a morality question",
    paragraphs: [
      "The research on screen time is far less dramatic than the headlines suggest. What matters is what the screen displaces. An hour of video that replaces an hour of sitting still is neutral. An hour that replaces sleep, movement, or conversation is not.",
      "Rather than counting minutes, protect the three things worth protecting: sleep, daily physical activity, and at least one meal a day where nobody is holding a device.",
    ],
  },
  {
    heading: "Make the default food the easy food",
    paragraphs: [
      "Nutrition advice fails when it depends on willpower at the moment of hunger. It works when the easy option is already the reasonable one. Cut fruit sitting at eye level gets eaten. Fruit in the drawer does not.",
      "We do not ask families to eliminate anything. We ask them to make one swap that survives a bad week, because a habit that only holds on good weeks is not a habit.",
    ],
  },
  {
    heading: "Keep immunizations on schedule, and keep the record",
    paragraphs: [
      "Staying on schedule matters more than catching up later, because the schedule is built around when children are most vulnerable. If you have fallen behind, catch-up schedules exist and work. Tell us and we will build one.",
      "Keep your own copy of the record. Ours follows you between all three offices, but schools, camps, and sports leagues all ask separately and always at the last minute.",
    ],
  },
  {
    heading: "Know what actually warrants a same-day call",
    paragraphs: [
      "Trust the change more than the number. A fever in a child who is drinking, playing, and responding normally is usually less concerning than a lower temperature in a child who has gone quiet and floppy.",
      "Call the same day for breathing that looks like work, for a baby under three months with any fever, for dehydration, or for a child who is much harder to rouse than usual. When you are unsure, call. Sorting that out is the job.",
    ],
  },
];
```

Render `META.category`, `META.readTime`, and `META.date` in the meta row alongside the word `Featured`.

- [ ] **Step 5: Write `components/JournalFeatured.module.css`**

Start from **Contract A** with `background: var(--bg-2)`. Then:

- `.meta`: flex row, `gap: 14px`, `flex-wrap: wrap`, `align-items: center`, 12px, weight 800, `letter-spacing: .16em`, uppercase, `color: var(--muted-2)`, `margin-bottom: 18px`
- `.metaTag`: `color: var(--accent)`
- `.title`: `clamp(30px, 4.6vw, 62px)`, weight 800, `letter-spacing: -.04em`, `line-height: 1.03`, `color: var(--ink)`, `max-width: 20ch`, `margin: 0 0 20px`
- `.standfirst`: `clamp(17px, 1.7vw, 21px)`, `line-height: 1.6`, `color: var(--ink-2)`, `max-width: 62ch`, `margin: 0 0 34px`
- `.imageWrap`: `position: relative`, `height: clamp(240px, 42vw, 520px)`, `border-radius: 20px`, `overflow: hidden`, `margin-bottom: clamp(34px, 4vw, 54px)`
- `.imageLayer`: `position: absolute; inset: -40px 0;` with `.image { object-fit: cover; }`
- `.body`: `max-width: 68ch`, flex column, `gap: 30px`
- `.blockHeading`: 21px, weight 700, `letter-spacing: -.02em`, `color: var(--ink)`, `margin: 0 0 12px`
- `.paragraph`: 16px, `line-height: 1.75`, `color: var(--muted)`, `margin: 0 0 14px`
- `@media (max-width: 640px)`: `.imageWrap { border-radius: 14px; }`

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run components/JournalHero.test.tsx components/JournalFeatured.test.tsx`
Expected: PASS.

- [ ] **Step 7: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/JournalFeatured.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/JournalFeatured.tsx components/JournalHero.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 8: Commit**

```bash
git add components/JournalHero.tsx components/JournalHero.test.tsx components/JournalFeatured.tsx components/JournalFeatured.module.css components/JournalFeatured.test.tsx
git commit -m "feat: add journal hero and featured article rendered in full inline"
```

---

### Task 11: JournalGrid

Cards are deliberately **not links**. With no `/journal/[slug]` routes in scope, a card that looks clickable and goes nowhere is worse than one that does not pretend. Each card is an `<article>` summary.

**Files:**
- Create: `components/JournalGrid.tsx`, `.module.css`, `.test.tsx`

**Interfaces:**
- Consumes: `public/images/journal-1.jpg` through `journal-6.jpg` (Task 4)
- Produces: `<section id="archive">`. Nothing depends on it.

Nine articles across six categories, using the six journal images plus three of the existing photos so every card has distinct art.

- [ ] **Step 1: Write the failing test**

Create `components/JournalGrid.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JournalGrid from "./JournalGrid";

describe("JournalGrid", () => {
  it("renders all nine articles by default", () => {
    render(<JournalGrid />);
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });

  it("narrows the grid when a category chip is selected", async () => {
    const user = userEvent.setup();
    render(<JournalGrid />);
    await user.click(screen.getByRole("button", { name: "Nutrition" }));
    const shown = screen.getAllByRole("article");
    expect(shown.length).toBeLessThan(9);
    expect(shown.length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Nutrition" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("restores every article when All is selected", async () => {
    const user = userEvent.setup();
    render(<JournalGrid />);
    await user.click(screen.getByRole("button", { name: "Nutrition" }));
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("article")).toHaveLength(9);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/JournalGrid.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `components/JournalGrid.tsx`**

Follow **Contract B** with `id="archive"`, plus `useState` for the active category.

```tsx
const CATEGORIES = [
  "All",
  "Preventive care",
  "Parenting",
  "Nutrition",
  "Seasonal",
  "Chronic care",
  "Clinic news",
];

const ARTICLES = [
  {
    slug: "reading-a-growth-chart",
    title: "How to read a growth chart without panicking",
    excerpt: "Percentiles are a position, not a grade. What the curve is doing over time matters far more than the number on any single visit.",
    category: "Preventive care",
    readTime: "6 min read",
    date: "18 August 2026",
    image: "/images/journal-1.jpg",
  },
  {
    slug: "fever-without-fear",
    title: "Fever without fear: what the number does and does not tell you",
    excerpt: "How your child looks and behaves is a better guide than the thermometer. Here is what we actually assess, and the handful of situations that warrant a call today.",
    category: "Preventive care",
    readTime: "5 min read",
    date: "11 August 2026",
    image: "/images/journal-4.jpg",
  },
  {
    slug: "sleep-regressions",
    title: "Sleep regressions are developmental, not disciplinary",
    excerpt: "The four month, eight month, and eighteen month disruptions are your child's brain reorganising. Knowing that changes how you respond at 3am.",
    category: "Parenting",
    readTime: "7 min read",
    date: "4 August 2026",
    image: "/images/journal-2.jpg",
  },
  {
    slug: "screens-and-schedules",
    title: "Screens, schedules, and the things worth protecting",
    excerpt: "Counting minutes is the wrong question. Protect sleep, movement, and one device-free meal, and the rest mostly sorts itself out.",
    category: "Parenting",
    readTime: "6 min read",
    date: "28 July 2026",
    image: "/images/journal-3.jpg",
  },
  {
    slug: "picky-eating",
    title: "Picky eating is a phase you can shorten but not skip",
    excerpt: "Food neophobia peaks between two and six and it is entirely normal. What helps is repeated low-pressure exposure, not negotiation at the table.",
    category: "Nutrition",
    readTime: "6 min read",
    date: "21 July 2026",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    slug: "lunchboxes-that-get-eaten",
    title: "Building a lunchbox that comes home empty",
    excerpt: "Protein, something crunchy, something familiar, and one thing they genuinely like. The nutritional ideal that returns uneaten is worth nothing.",
    category: "Nutrition",
    readTime: "4 min read",
    date: "14 July 2026",
    image: "/images/journal-1.jpg",
  },
  {
    slug: "flu-season-plan",
    title: "Your flu season plan, written in September",
    excerpt: "Vaccination timing, when to keep a child home, and how to stop one household infection becoming five.",
    category: "Seasonal",
    readTime: "5 min read",
    date: "7 July 2026",
    image: "/images/service-immunizations.jpg",
  },
  {
    slug: "asthma-action-plan",
    title: "What a good asthma action plan actually contains",
    excerpt: "Green, yellow, and red zones, written down, with doses. If your plan lives only in your memory, it is not a plan.",
    category: "Chronic care",
    readTime: "8 min read",
    date: "30 June 2026",
    image: "/images/journal-5.jpg",
  },
  {
    slug: "one-chart-three-offices",
    title: "Why we put one chart across all three offices",
    excerpt: "The change took a year and was worth every week of it. What it means in practice when you walk into a location you have never visited.",
    category: "Clinic news",
    readTime: "4 min read",
    date: "23 June 2026",
    image: "/images/journal-6.jpg",
  },
];
```

Filter logic and empty state:

```tsx
const [active, setActive] = useState("All");
const shown = active === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === active);
```

Chips are `<button type="button" aria-pressed={active === category}>`. Cards are `<article>` containing the image, category, title (`<h3>`), excerpt, and a footer with read time and date, carrying the **Contract C** stagger. When `shown.length === 0`, render `<p className={styles.empty}>Nothing filed under that yet. Try another topic.</p>` instead of the grid.

- [ ] **Step 4: Write `components/JournalGrid.module.css`**

Start from **Contract A** with `background: var(--bg)`, add **Contract C** keyed on `.card`. Then:

- `.chips`: `display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: clamp(30px, 3.5vw, 46px);`
- `.chip`: 13px, weight 600, `padding: 9px 16px`, `border-radius: 999px`, `border: 1px solid var(--line)`, `background: var(--chip-bg)`, `color: var(--muted)`, `cursor: pointer`, `transition: background .25s ease, color .25s ease, border-color .25s ease`
- `.chip:hover`: `color: var(--ink)`, `border-color: var(--line-2)`
- `.chipActive`: `background: var(--chip-bg-active)`, `color: var(--ink)`, `border-color: var(--rule-accent)`
- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 26px;`
- `.card`: flex column, `gap: 14px`, `border: 1px solid var(--line)`, `border-radius: 18px`, `overflow: hidden`, `background: var(--bg-2)`, `padding-bottom: 22px`
- `.imageWrap`: `position: relative`, `height: 190px`, with `.image { object-fit: cover; }`
- `.cardMeta`, `.cardFoot`: 11.5px, weight 700, `letter-spacing: .13em`, uppercase, `color: var(--muted-2)`, `padding: 0 22px`
- `.cardMeta`: `color: var(--accent)`
- `.cardTitle`: 18px, weight 700, `letter-spacing: -.02em`, `color: var(--ink)`, `margin: 0`, `padding: 0 22px`
- `.excerpt`: 14.5px, `line-height: 1.6`, `color: var(--muted)`, `margin: 0`, `padding: 0 22px`
- `.cardFoot`: `display: flex`, `gap: 12px`, `margin-top: auto`, `padding-top: 6px`
- `.empty`: 16px, `color: var(--muted)`, `padding: 40px 0`
- `@media (max-width: 640px)`: `.grid { grid-template-columns: 1fr; }`

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run components/JournalGrid.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/JournalGrid.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/JournalGrid.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 7: Commit**

```bash
git add components/JournalGrid.tsx components/JournalGrid.module.css components/JournalGrid.test.tsx
git commit -m "feat: add journal archive grid with client-side category filter"
```

---

### Task 12: JournalNewsletter and the /journal route

**Files:**
- Create: `components/JournalNewsletter.tsx`, `.module.css`, `.test.tsx`
- Create: `app/journal/page.tsx`

**Interfaces:**
- Consumes: `JournalHero`, `JournalFeatured` (Task 10), `JournalGrid` (Task 11)
- Produces: the `/journal` route, and the validation pattern that Task 14's `ContactForm` reuses.

- [ ] **Step 1: Write the failing test**

Create `components/JournalNewsletter.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JournalNewsletter from "./JournalNewsletter";

describe("JournalNewsletter", () => {
  it("shows an error when the email is empty", async () => {
    const user = userEvent.setup();
    render(<JournalNewsletter />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByText(/enter an email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("shows an error when the email is malformed", async () => {
    const user = userEvent.setup();
    render(<JournalNewsletter />);
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
  });

  it("confirms the subscription on a valid submit", async () => {
    const user = userEvent.setup();
    render(<JournalNewsletter />);
    await user.type(screen.getByLabelText(/email/i), "parent@example.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    expect(screen.getByText(/you are on the list/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/JournalNewsletter.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `components/JournalNewsletter.tsx`**

Follow **Contract B** with `id="subscribe"`. Export the email pattern so `ContactForm` reuses it rather than defining a second one.

```tsx
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function JournalNewsletter() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter an email address to subscribe.");
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    // TODO: POST the address to the mailing list provider once one is wired up.
    setDone(true);
  }
  // ...
}
```

Markup: an `<h2>` reading `A short note, once a month.`, a paragraph, then either the success panel (when `done`) reading `You are on the list. Look out for the next one.` or the form with `<label htmlFor="newsletter-email">Email address</label>`, an `<input id="newsletter-email" type="email">` carrying `aria-invalid={Boolean(error)}` and `aria-describedby="newsletter-email-error"` when errored, the error `<p id="newsletter-email-error" role="alert">`, and the submit button labelled `Subscribe`.

- [ ] **Step 4: Write `components/JournalNewsletter.module.css`**

Start from **Contract A** with `background: var(--bg-2)`. Then:

- `.inner`: `max-width: 60ch`, flex column, `gap: 16px`
- `.form`: `display: flex`, `gap: 12px`, `flex-wrap: wrap`, `align-items: flex-start`
- `.field`: `flex: 1 1 260px`, flex column, `gap: 8px`
- `.label`: 12px, weight 700, `letter-spacing: .13em`, uppercase, `color: var(--muted-2)`
- `.input`: `width: 100%`, `padding: 13px 16px`, `border-radius: 12px`, `border: 1px solid var(--field-border)`, `background: var(--field-bg)`, `color: var(--ink)`, 15px, `font-family: inherit`
- `.input:focus-visible`: `outline: none`, `border-color: var(--field-border-focus)`
- `.inputInvalid`: `border-color: var(--danger)`
- `.error`: 13px, `color: var(--danger)`, `margin: 0`
- `.button`: same pill treatment as `PartnersJoin` `.cta`, `border: none`, `cursor: pointer`
- `.success`: `padding: 20px 22px`, `border-radius: 14px`, `border: 1px solid var(--success)`, `color: var(--ink-2)`, 15px
- `@media (max-width: 640px)`: `.form { flex-direction: column; }` and `.button { width: 100%; justify-content: center; }`

- [ ] **Step 5: Write `app/journal/page.tsx`**

Follow **Contract D**, composing `JournalHero`, `TickerBar`, `JournalFeatured`, `JournalGrid`, `JournalNewsletter`.

```tsx
export const metadata: Metadata = {
  title: "Journal | St. Gianna Medical Group",
  description:
    "Plain writing from our clinicians on preventive care, parenting, nutrition, seasonal illness, and chronic conditions.",
};
```

- [ ] **Step 6: Run the tests, the full suite, and the build**

Run: `npx vitest run components/JournalNewsletter.test.tsx`
Expected: PASS, 3 tests.

Run: `npm test && npm run build`
Expected: both succeed, and the build output lists `/journal`.

- [ ] **Step 7: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/JournalNewsletter.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/JournalNewsletter.tsx app/journal/page.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 8: Commit**

```bash
git add components/JournalNewsletter.tsx components/JournalNewsletter.module.css components/JournalNewsletter.test.tsx app/journal
git commit -m "feat: add journal newsletter signup and the /journal route"
```

---

### Task 13: ContactHero and ContactChannels

**Files:**
- Create: `components/ContactHero.tsx`, `.test.tsx`
- Create: `components/ContactChannels.tsx`, `.module.css`, `.test.tsx`

**Interfaces:**
- Consumes: `PageHero` (Task 2), icons
- Produces: `<section id="channels">`

- [ ] **Step 1: Write the failing tests**

Create `components/ContactHero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactHero from "./ContactHero";

describe("ContactHero", () => {
  it("renders the breadcrumb, headline, and stats", () => {
    render(<ContactHero />);
    expect(screen.getByText("/ Contact")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/get in/i);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Offices")).toBeInTheDocument();
  });
});
```

Create `components/ContactChannels.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactChannels from "./ContactChannels";

describe("ContactChannels", () => {
  it("renders four channels with working targets", () => {
    render(<ContactChannels />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByRole("link", { name: /call the office/i })).toHaveAttribute(
      "href",
      "tel:+18183084100",
    );
    expect(screen.getByRole("link", { name: /email us/i })).toHaveAttribute(
      "href",
      "mailto:contact@sgmdoctor.com",
    );
    expect(screen.getByRole("link", { name: /book online/i })).toHaveAttribute(
      "href",
      expect.stringContaining("nexhealth.com"),
    );
    expect(screen.getByRole("link", { name: /see telehealth/i })).toHaveAttribute(
      "href",
      "/services#catalog",
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/ContactHero.test.tsx components/ContactChannels.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/ContactHero.tsx`**

```tsx
import PageHero from "./PageHero";

const STATS = [
  { n: "3", l: "Offices" },
  { n: "24 hrs", l: "Assistance line" },
  { n: "1 day", l: "Typical reply to messages" },
];

export default function ContactHero() {
  return (
    <PageHero
      breadcrumb="Contact"
      headline="Get in"
      italic="touch."
      subcopy="We are here to help with all of it: questions, appointments, billing, records, or just working out whether you need to be seen at all. Pick whichever way of reaching us suits the hour you are reading this."
      stats={STATS}
    />
  );
}
```

- [ ] **Step 4: Write `components/ContactChannels.tsx`**

Follow **Contract B** with `id="channels"`. Heading: `Four ways through.` Each channel is an `<a>` card containing an `<h3>`, a body line, and a `.cta` span. External and protocol links use `<a>`; the internal one uses `<a href="/services#catalog">` too, which keeps the test simple and is a same-page-family anchor.

```tsx
const CHANNELS = [
  {
    icon: CallIcon,
    title: "Call the office",
    body: "Fastest route for anything urgent or same-day. Santa Monica, Hollywood, and La Mirada each have their own line, and reception can check all three for a slot.",
    action: "Call the office",
    href: "tel:+18183084100",
  },
  {
    icon: ScheduleIcon,
    title: "Book online, any hour",
    body: "Scheduling never closes. Pick a slot, get an instant confirmation, and reschedule the same way if the week turns on you.",
    action: "Book online",
    href: "https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903",
  },
  {
    icon: ChatBubbleIcon,
    title: "Email us",
    body: "Best for billing questions, records requests, and anything with an attachment. We reply within one business day.",
    action: "Email us",
    href: "mailto:contact@sgmdoctor.com",
  },
  {
    icon: MonitorHeartIcon,
    title: "See us by video",
    body: "Telehealth covers follow-ups, medication reviews, rashes, and plenty of sick visits. If we need you in the room, we will tell you on the call.",
    action: "See telehealth options",
    href: "/services#catalog",
  },
];
```

Below the grid, add a highlighted strip: `<p className={styles.assist}>Outside office hours a clinician answers the 24-hour assistance line on <a href="tel:+18183084100">818-308-4100</a>. If this is an emergency, call 911.</p>`

Icons imported from `@/components/icons`: `CallIcon`, `ScheduleIcon`, `ChatBubbleIcon`, `MonitorHeartIcon`.

- [ ] **Step 5: Write `components/ContactChannels.module.css`**

Start from **Contract A** with `background: var(--bg)`, add **Contract C** keyed on `.card`. Card styling mirrors `PartnersNetwork.module.css` `.card`. Then:

- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 22px;`
- `.iconWrap`: `color: var(--link)`
- `.assist`: `margin: 26px 0 0`, `padding: 18px 22px`, `border-radius: 14px`, `border: 1px solid var(--rule-accent)`, `background: var(--chip-bg)`, 14.5px, `line-height: 1.6`, `color: var(--ink-2)`
- `@media (max-width: 640px)`: `.grid { grid-template-columns: 1fr; }`

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run components/ContactHero.test.tsx components/ContactChannels.test.tsx`
Expected: PASS.

- [ ] **Step 7: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/ContactChannels.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/ContactChannels.tsx components/ContactHero.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 8: Commit**

```bash
git add components/ContactHero.tsx components/ContactHero.test.tsx components/ContactChannels.tsx components/ContactChannels.module.css components/ContactChannels.test.tsx
git commit -m "feat: add contact hero and four contact channel cards"
```

---

### Task 14: ContactForm

The one new surface with real logic. Client-side only: no network call, a marked `TODO` where the POST belongs.

**Files:**
- Create: `components/ContactForm.tsx`, `.module.css`, `.test.tsx`

**Interfaces:**
- Consumes: `EMAIL_PATTERN` exported from `components/JournalNewsletter.tsx` (Task 12). Import it rather than writing a second pattern.
- Produces: `<section id="message">`

Validation rules, exactly:

| Field | Required | Rule | Error message |
| --- | --- | --- | --- |
| `name` | yes | non-empty after trim | `Tell us your name.` |
| `email` | yes | matches `EMAIL_PATTERN` | empty: `Enter an email address.` / malformed: `Enter a valid email address.` |
| `phone` | no | if present, at least 10 digits after stripping non-digits | `Enter a phone number we can reach you on, or leave it blank.` |
| `office` | no | select, defaults to `No preference` | none |
| `topic` | no | select, defaults to `Appointment` | none |
| `message` | yes | non-empty after trim | `Let us know what you need.` |
| `consent` | yes | checked | `Please confirm we can reply to you.` |

- [ ] **Step 1: Write the failing test**

Create `components/ContactForm.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  it("reports every required field on an empty submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText("Tell us your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter an email address.")).toBeInTheDocument();
    expect(screen.getByText("Let us know what you need.")).toBeInTheDocument();
    expect(screen.getByText("Please confirm we can reply to you.")).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("rejects a malformed email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Marisol");
    await user.type(screen.getByLabelText(/email/i), "marisol@@example");
    await user.type(screen.getByLabelText(/how can we help/i), "Booking a physical.");
    await user.click(screen.getByLabelText(/you can reply/i));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("rejects a phone number that is too short but accepts a blank one", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Marisol");
    await user.type(screen.getByLabelText(/email/i), "marisol@example.com");
    await user.type(screen.getByLabelText(/phone/i), "12345");
    await user.type(screen.getByLabelText(/how can we help/i), "Booking a physical.");
    await user.click(screen.getByLabelText(/you can reply/i));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(
      screen.getByText(/phone number we can reach you on, or leave it blank/i),
    ).toBeInTheDocument();
  });

  it("shows the success panel on a valid submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Marisol");
    await user.type(screen.getByLabelText(/email/i), "marisol@example.com");
    await user.type(screen.getByLabelText(/how can we help/i), "Booking a school physical.");
    await user.click(screen.getByLabelText(/you can reply/i));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/message is with us/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send message/i })).toBeNull();
  });

  it("returns to a blank form from the success panel", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/your name/i), "Marisol");
    await user.type(screen.getByLabelText(/email/i), "marisol@example.com");
    await user.type(screen.getByLabelText(/how can we help/i), "Booking a school physical.");
    await user.click(screen.getByLabelText(/you can reply/i));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await user.click(screen.getByRole("button", { name: /send another/i }));
    expect(screen.getByLabelText(/your name/i)).toHaveValue("");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/ContactForm.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `components/ContactForm.tsx`**

Follow **Contract B** with `id="message"`, plus form state.

```tsx
"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { EMAIL_PATTERN } from "./JournalNewsletter";

const OFFICES = ["No preference", "Hollywood", "Santa Monica", "La Mirada"];
const TOPICS = ["Appointment", "Billing", "Medical records", "Careers", "Something else"];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  office: OFFICES[0],
  topic: TOPICS[0],
  message: "",
  consent: false,
};

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

function validate(values: typeof EMPTY): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Tell us your name.";
  if (!values.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (values.phone.trim() && values.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a phone number we can reach you on, or leave it blank.";
  }
  if (!values.message.trim()) errors.message = "Let us know what you need.";
  if (!values.consent) errors.consent = "Please confirm we can reply to you.";
  return errors;
}
```

Component body: hold `values`, `errors`, and `sent` in state. On submit, `event.preventDefault()`, run `validate`, set errors, and if the error object is empty set `sent` to true after the marked TODO:

```tsx
// TODO: POST `values` to the contact endpoint once a backend or mail provider is wired up.
setSent(true);
```

Every field renders label, control, and error together. The control carries `aria-invalid={Boolean(errors.field)}` and, when errored, `aria-describedby="contact-<field>-error"`, with the error in `<p id="contact-<field>-error" role="alert" className={styles.error}>`.

Exact label text, which the test depends on:

- `Your name`
- `Email address`
- `Phone number (optional)`
- `Preferred office`
- `What is this about`
- `How can we help?`
- Consent checkbox: `You can reply to me at the address above.`
- Submit button: `Send message`

Success panel replaces the whole form: a heading `Your message is with us.`, a line reading `We reply within one business day. If it cannot wait that long, call 818-308-4100 and someone will pick up.`, and a `<button type="button">Send another message</button>` that resets `values` to `EMPTY`, clears `errors`, and sets `sent` to false.

- [ ] **Step 4: Write `components/ContactForm.module.css`**

Start from **Contract A** with `background: var(--bg-2)`. Then:

- `.layout`: `display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: clamp(32px, 5vw, 72px); align-items: start;`
- `.intro`: flex column, `gap: 14px`, `position: sticky`, `top: 110px`
- `.form`: flex column, `gap: 20px`
- `.row`: `display: grid; grid-template-columns: 1fr 1fr; gap: 20px;`
- `.field`: flex column, `gap: 8px`
- `.label`: 12px, weight 700, `letter-spacing: .13em`, uppercase, `color: var(--muted-2)`
- `.input`, `.select`, `.textarea`: `width: 100%`, `padding: 13px 16px`, `border-radius: 12px`, `border: 1px solid var(--field-border)`, `background: var(--field-bg)`, `color: var(--ink)`, 15px, `font-family: inherit`
- `.textarea`: `min-height: 150px`, `resize: vertical`
- `:focus-visible` on all three: `outline: none`, `border-color: var(--field-border-focus)`
- `.invalid`: `border-color: var(--danger)`
- `.error`: 13px, `color: var(--danger)`, `margin: 0`
- `.consentRow`: `display: flex`, `gap: 11px`, `align-items: flex-start`
- `.checkbox`: `margin-top: 3px`, `accent-color: var(--accent)`
- `.consentLabel`: 14.5px, `line-height: 1.55`, `color: var(--muted)`
- `.button`: same pill treatment as `PartnersJoin` `.cta`, `align-self: flex-start`, `border: none`, `cursor: pointer`
- `.success`: `padding: 30px`, `border-radius: 18px`, `border: 1px solid var(--success)`, `background: var(--bg)`, flex column, `gap: 14px`, `align-items: flex-start`
- `.successHeading`: 22px, weight 700, `color: var(--ink)`, `margin: 0`
- `.reset`: transparent background, `border: 1px solid var(--line-2)`, `border-radius: 999px`, `padding: 11px 20px`, `color: var(--ink)`, `cursor: pointer`, 14px, weight 600
- `@media (max-width: 1179px)`: `.layout { grid-template-columns: 1fr; }` and `.intro { position: static; }`
- `@media (max-width: 640px)`: `.row { grid-template-columns: 1fr; }` and `.button { width: 100%; justify-content: center; }`

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run components/ContactForm.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/ContactForm.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/ContactForm.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 7: Commit**

```bash
git add components/ContactForm.tsx components/ContactForm.module.css components/ContactForm.test.tsx
git commit -m "feat: add validated contact form with inline errors and success panel"
```

---

### Task 15: ContactOffices, ContactNotes, and the /contact route

**Files:**
- Create: `components/ContactOffices.tsx`, `.module.css`, `.test.tsx`
- Create: `components/ContactNotes.tsx`, `.module.css`, `.test.tsx`
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `ContactHero`, `ContactChannels` (Task 13), `ContactForm` (Task 14), `useParallax`, the three `contact-*.jpg` images (Task 4)
- Produces: the `/contact` route and the `#careers` anchor. Task 21 points the footer's `Careers` link at `/contact#careers`.

- [ ] **Step 1: Write the failing tests**

Create `components/ContactOffices.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactOffices from "./ContactOffices";

describe("ContactOffices", () => {
  it("renders all three offices with phone and directions links", () => {
    render(<ContactOffices />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByText("5255 W Sunset Blvd, Los Angeles, CA 90027")).toBeInTheDocument();
    expect(screen.getByText("2221 Lincoln Blvd, Santa Monica, CA 90405")).toBeInTheDocument();
    expect(screen.getByText("12675 La Mirada Blvd, #200, La Mirada, CA 90638")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "818-275-7006" })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })).toHaveLength(3);
  });
});
```

Create `components/ContactNotes.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactNotes from "./ContactNotes";

describe("ContactNotes", () => {
  it("leads with the emergency notice", () => {
    render(<ContactNotes />);
    expect(screen.getByText(/call 911/i)).toBeInTheDocument();
  });

  it("exposes the careers anchor the footer links to", () => {
    const { container } = render(<ContactNotes />);
    expect(container.querySelector("#careers")).not.toBeNull();
    expect(screen.getByText(/Careers/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/ContactOffices.test.tsx components/ContactNotes.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write `components/ContactOffices.tsx`**

Follow **Contract B** with `id="offices"`, plus `useParallax<HTMLSpanElement>(0.06, 20)` shared across the card photo layers, as `Locations.tsx` already does.

**Address note.** The La Mirada address below matches the six places this repo already uses it, not the address currently on sgmdoctor.com. See "Open question for the user" at the end of this plan. Do not silently switch it here, because that would put two different addresses for the same office on the same site.

```tsx
const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
    hours: "Mon to Sun, 8am to 9pm",
    note: "Our longest hours, including weekends. Street parking on Sunset, with a lot behind the building.",
    image: "/images/contact-hollywood.jpg",
    maps: "https://www.google.com/maps/search/?api=1&query=5255+W+Sunset+Blvd+Los+Angeles+CA+90027",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
    hours: "Mon to Sat, 8am to 8pm",
    note: "Closest to the beach communities. Ask reception to validate parking when you check in.",
    image: "/images/contact-santa-monica.jpg",
    maps: "https://www.google.com/maps/search/?api=1&query=2221+Lincoln+Blvd+Santa+Monica+CA+90405",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
    hours: "Mon to Fri, 9am to 6pm",
    note: "Suite 200, on the first floor at the rear of the courtyard. Step-free access from the car park.",
    image: "/images/contact-la-mirada.jpg",
    maps: "https://www.google.com/maps/search/?api=1&query=12675+La+Mirada+Blvd+%23200+La+Mirada+CA+90638",
  },
];
```

Each card: parallax photo layer, `<h3>` name, address, `<a href={office.tel}>{office.phone}</a>`, hours, note, and `<a href={office.maps} target="_blank" rel="noopener noreferrer">Directions</a>`. Carry the **Contract C** stagger.

- [ ] **Step 4: Write `components/ContactOffices.module.css`**

Start from **Contract A** with `background: var(--bg)`, add **Contract C** keyed on `.card`. Then:

- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 24px;`
- `.card`: flex column, `border: 1px solid var(--line)`, `border-radius: 18px`, `overflow: hidden`, `background: var(--bg-2)`
- `.imageWrap`: `position: relative`, `height: 180px`, `overflow: hidden`
- `.imageLayer`: `position: absolute; inset: -26px 0;` with `.image { object-fit: cover; }`
- `.cardBody`: `padding: 22px`, flex column, `gap: 10px`
- `.name`: 20px, weight 700, `color: var(--ink)`, `margin: 0`
- `.address`, `.hours`, `.note`: 14.5px, `line-height: 1.6`, `color: var(--muted)`
- `.note`: `color: var(--muted-2)`, 13.5px, `padding-top: 10px`, `border-top: 1px solid var(--line)`
- `.phone`: 16px, weight 700, `color: var(--link)`
- `.directions`: `margin-top: 6px`, `display: inline-flex`, `align-items: center`, `gap: 7px`, 13px, weight 700, `color: var(--link)`
- `@media (max-width: 640px)`: `.grid { grid-template-columns: 1fr; }`

- [ ] **Step 5: Write `components/ContactNotes.tsx`**

Follow **Contract B** with `id="notes"`. Heading: `Before you write.` Five blocks, each an `<article>` carrying its own `id` and an `<h3>`. The emergency block comes first and gets an `.urgent` modifier class.

```tsx
const NOTES = [
  {
    id: "emergency",
    title: "If this is an emergency",
    body: "Call 911 or go to your nearest emergency department. Do not use this form, and do not wait for a reply. Trouble breathing, a seizure, a serious injury, or a baby under three months with a fever all belong in an emergency room, not an inbox.",
    urgent: true,
  },
  {
    id: "refills",
    title: "Prescription refills",
    body: "The fastest route is your pharmacy. Ask them to send the refill request to us and it lands directly in the chart. Refills for controlled medications need a visit first, so book one rather than writing in.",
  },
  {
    id: "records",
    title: "Medical records",
    body: "Email contact@sgmdoctor.com with the patient name, date of birth, and where the records should go. We will send a release form to sign. Standard requests take up to five business days.",
  },
  {
    id: "billing",
    title: "Billing and insurance",
    body: "Send us the statement date and the amount in question and we will trace it. If your plan changed, tell us before your next visit so benefits can be reverified ahead of time.",
  },
  {
    id: "careers",
    title: "Careers",
    body: "We hire clinicians, medical assistants, and front office staff across all three offices, and we are always glad to hear from bilingual candidates. Send a CV to contact@sgmdoctor.com with the role and location you are interested in.",
  },
];
```

- [ ] **Step 6: Write `components/ContactNotes.module.css`**

Start from **Contract A** with `background: var(--bg-2)`, add **Contract C** keyed on `.card`. Then:

- `.grid`: `display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 2px 30px;`
- `.card`: `border-top: 2px solid var(--rule-accent)`, `padding: 26px 26px 32px 0`, flex column, `gap: 11px`, `scroll-margin-top: 90px`
- `.urgent`: `border-top-color: var(--danger)`
- `.title`: 18px, weight 700, `color: var(--ink)`, `margin: 0`
- `.body`: 14.5px, `line-height: 1.65`, `color: var(--muted)`, `margin: 0`
- `@media (max-width: 640px)`: `.card { padding-right: 0; }`

- [ ] **Step 7: Write `app/contact/page.tsx`**

Follow **Contract D**, composing `ContactHero`, `TickerBar`, `ContactChannels`, `ContactForm`, `ContactOffices`, `ContactNotes`.

```tsx
export const metadata: Metadata = {
  title: "Contact | St. Gianna Medical Group",
  description:
    "Call, book online, email, or send us a message. Addresses, phone numbers, and opening hours for our Hollywood, Santa Monica, and La Mirada offices.",
};
```

- [ ] **Step 8: Run the tests, the full suite, and the build**

Run: `npx vitest run components/ContactOffices.test.tsx components/ContactNotes.test.tsx`
Expected: PASS.

Run: `npm test && npm run build`
Expected: both succeed, and the build output lists `/contact`.

- [ ] **Step 9: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/ContactOffices.module.css components/ContactNotes.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/ContactOffices.tsx components/ContactNotes.tsx app/contact/page.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 10: Commit**

```bash
git add components/ContactOffices.tsx components/ContactOffices.module.css components/ContactOffices.test.tsx components/ContactNotes.tsx components/ContactNotes.module.css components/ContactNotes.test.tsx app/contact
git commit -m "feat: add contact office cards, before-you-write notes, and the /contact route"
```

---

### Task 16: LegalPage shell and content data

**Files:**
- Create: `components/LegalPage.tsx`, `.module.css`, `.test.tsx`
- Create: `components/legal/privacyContent.ts`
- Create: `components/legal/termsContent.ts`

**Interfaces:**
- Consumes: `PageHero` (Task 2) with `stats` omitted
- Produces:
  ```ts
  export type LegalSection = {
    id: string;
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  };
  type LegalPageProps = {
    title: string;
    italic: string;
    breadcrumb: string;
    intro: string;
    effectiveDate: string;
    sections: LegalSection[];
  };
  export default function LegalPage(props: LegalPageProps): JSX.Element;
  ```
  plus `PRIVACY_SECTIONS` and `TERMS_SECTIONS` as `LegalSection[]`, and `PRIVACY_INTRO` / `TERMS_INTRO` strings. Task 17 consumes all of these.

- [ ] **Step 1: Write the failing test**

Create `components/LegalPage.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LegalPage from "./LegalPage";

const SECTIONS = [
  { id: "one", heading: "First section", paragraphs: ["Body of the first section."] },
  {
    id: "two",
    heading: "Second section",
    paragraphs: ["Body of the second section."],
    bullets: ["A listed item"],
  },
];

describe("LegalPage", () => {
  it("renders the hero, the effective date, and the intro", () => {
    render(
      <LegalPage
        title="Privacy"
        italic="policy."
        breadcrumb="Privacy Policy"
        intro="How we handle your information."
        effectiveDate="1 September 2026"
        sections={SECTIONS}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/privacy/i);
    expect(screen.getByText(/Last updated 1 September 2026/i)).toBeInTheDocument();
    expect(screen.getByText("How we handle your information.")).toBeInTheDocument();
  });

  it("gives every section an anchor id and an index link", () => {
    const { container } = render(
      <LegalPage
        title="Terms"
        italic="conditions."
        breadcrumb="Terms"
        intro="The rules."
        effectiveDate="1 September 2026"
        sections={SECTIONS}
      />,
    );
    expect(container.querySelector("#one")).not.toBeNull();
    expect(container.querySelector("#two")).not.toBeNull();
    expect(screen.getByRole("link", { name: "First section" })).toHaveAttribute("href", "#one");
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("renders bullets when a section has them", () => {
    render(
      <LegalPage
        title="Terms"
        italic="conditions."
        breadcrumb="Terms"
        intro="The rules."
        effectiveDate="1 September 2026"
        sections={SECTIONS}
      />,
    );
    expect(screen.getByText("A listed item")).toBeInTheDocument();
    expect(screen.getByText("A listed item").tagName).toBe("LI");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/LegalPage.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Write `components/LegalPage.tsx`**

```tsx
"use client";

import styles from "./LegalPage.module.css";
import PageHero from "./PageHero";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  italic: string;
  breadcrumb: string;
  intro: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  italic,
  breadcrumb,
  intro,
  effectiveDate,
  sections,
}: LegalPageProps) {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <>
      <PageHero breadcrumb={breadcrumb} headline={title} italic={italic} subcopy={intro} />
      <section
        id="document"
        className={`${styles.section} ${revealed ? styles.revealed : ""}`}
        ref={ref}
      >
        <div className={styles.layout}>
          <nav className={styles.index} aria-label="Sections">
            <span className={styles.indexHeading}>On this page</span>
            <details className={styles.indexDetails} open>
              <summary className={styles.indexSummary}>Jump to a section</summary>
              <ol className={styles.indexList}>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className={styles.indexLink}>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>
          <div className={styles.prose}>
            <p className={styles.stamp}>Last updated {effectiveDate}</p>
            <p className={styles.disclaimer}>
              This page is a plain statement of how we operate, written for a marketing site. It
              is not a substitute for a document reviewed by your own counsel.
            </p>
            {sections.map((section) => (
              <article key={section.id} id={section.id} className={styles.block}>
                <h2 className={styles.blockHeading}>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className={styles.bullets}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className={styles.bullet}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

The `<details>` wrapper gives the mobile accordion for free. On `min-width: 1180px` the CSS forces it open and hides the summary, so desktop gets a plain sticky list.

- [ ] **Step 4: Write `components/LegalPage.module.css`**

Start from **Contract A** with `background: var(--bg)`. Then:

- `.layout`: `display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: clamp(32px, 5vw, 76px); align-items: start;`
- `.index`: `position: sticky`, `top: 110px`, flex column, `gap: 12px`
- `.indexHeading`: 12px, weight 800, `letter-spacing: .16em`, uppercase, `color: var(--muted-2)`
- `.indexSummary`: `display: none` at desktop, `cursor: pointer`, 14px, weight 700, `color: var(--ink)`, `padding: 12px 16px`, `border: 1px solid var(--line)`, `border-radius: 12px`
- `.indexList`: `list-style: none`, `margin: 0`, `padding: 0`, flex column, `gap: 9px`, `counter-reset: section`
- `.indexLink`: 13.5px, `line-height: 1.5`, `color: var(--muted)`, `transition: color .25s ease`; `:hover` sets `color: var(--ink)`
- `.prose`: `max-width: 72ch`
- `.stamp`: 12px, weight 800, `letter-spacing: .14em`, uppercase, `color: var(--accent)`, `margin: 0 0 12px`
- `.disclaimer`: 14px, `line-height: 1.6`, `color: var(--muted-2)`, `padding: 16px 20px`, `border: 1px solid var(--line)`, `border-radius: 14px`, `background: var(--bg-2)`, `margin: 0 0 40px`
- `.block`: `margin-bottom: 40px`, `scroll-margin-top: 100px`
- `.blockHeading`: `clamp(21px, 2.3vw, 28px)`, weight 700, `letter-spacing: -.025em`, `color: var(--ink)`, `margin: 0 0 14px`
- `.paragraph`: 15.5px, `line-height: 1.75`, `color: var(--muted)`, `margin: 0 0 14px`
- `.bullets`: `margin: 0 0 14px`, `padding-left: 20px`, flex column, `gap: 8px`
- `.bullet`: 15.5px, `line-height: 1.7`, `color: var(--muted)`
- `@media (max-width: 1179px)`: `.layout { grid-template-columns: 1fr; }`, `.index { position: static; }`, and `.indexSummary { display: block; }`

**How the `<details>` behaves.** A `<details>` element hides its own content when closed, and no CSS `display` rule on the inner list can override that. So the component always renders it as `<details className={styles.indexDetails} open>`. On desktop `.indexSummary` is `display: none`, so it reads as a plain sticky list with no affordance to collapse. Below `1180px` the summary becomes visible and the reader can collapse the index to get it out of the way. One element, correct at both sizes, no JavaScript.

- [ ] **Step 5: Write `components/legal/privacyContent.ts`**

```ts
import type { LegalSection } from "../LegalPage";

export const PRIVACY_INTRO =
  "This page explains what information St. Gianna Medical Group collects, why we collect it, who sees it, and what you can ask us to do with it. Health information is held to a higher standard than the rest, and we treat it that way.";

export const PRIVACY_SECTIONS: LegalSection[] = [ /* eleven entries */ ];
```

The eleven entries, each with 2 or 3 substantive paragraphs. Content brief per section, all specific enough to write directly:

1. `introduction` / **Introduction**: who we are, the three offices, that the policy covers this website and the practice, and the date it takes effect.
2. `information-we-collect` / **Information we collect**: split into what you give us (name, date of birth, contact details, insurance member ID, reason for visit, anything typed into the contact form) and what is collected automatically (browser, device, pages viewed, approximate region). Use `bullets` for both lists. State plainly that the contact form on this site is not a secure channel for clinical detail.
3. `how-we-use-information` / **How we use your information**: to provide care, to schedule and confirm appointments, to verify benefits and bill, to meet legal obligations, and to improve the site. State that we do not sell personal information and do not use health information for advertising.
4. `hipaa` / **HIPAA and protected health information**: PHI is governed by HIPAA and by the practice's Notice of Privacy Practices, which is the controlling document for clinical records. This website policy covers website data. Where the two overlap, the Notice of Privacy Practices wins.
5. `sharing` / **Sharing and disclosure**: with clinicians involved in your care, with the network partners listed on the partners page where treatment requires it, with your health plan for coverage and payment, with vendors under contract, and where the law requires. Use `bullets`.
6. `cookies` / **Cookies and analytics**: what the site stores locally (including the `sgm-theme` theme preference in `localStorage`), that analytics are aggregate, and that analytics data is never joined to clinical records. Explain how to clear or block storage in the browser.
7. `your-rights` / **Your rights**: access, correction, a copy of records, an accounting of disclosures, restriction requests, and how California residents can exercise additional rights. Give the contact route: contact@sgmdoctor.com.
8. `retention-security` / **Data retention and security**: how long records are kept under California law for adults and for minors, encryption in transit and at rest, access limited to staff who need it, and an honest line that no system is perfectly secure.
9. `childrens-privacy` / **Children's privacy**: much of our care is for minors, records are handled under HIPAA with parent or guardian access rights, and the website itself is not directed at children for marketing.
10. `changes` / **Changes to this policy**: we update the page and change the last-updated date; material changes are flagged at the top for a period.
11. `contact` / **How to reach us**: email contact@sgmdoctor.com, the three office phone numbers, and a line pointing at `/contact`.

- [ ] **Step 6: Write `components/legal/termsContent.ts`**

```ts
import type { LegalSection } from "../LegalPage";

export const TERMS_INTRO =
  "These terms cover your use of this website. They are not the agreement that governs your care, which is set out in the documents you sign at the practice.";

export const TERMS_SECTIONS: LegalSection[] = [ /* fourteen entries */ ];
```

The fourteen entries, each with 2 or 3 substantive paragraphs:

1. `acceptance` / **Acceptance of these terms**: using the site means accepting them; if you do not accept, do not use the site.
2. `use-of-site` / **Use of the site**: permitted personal use, and a `bullets` list of what is not allowed (scraping, interfering with the site, attempting to access other people's information, misrepresenting your identity).
3. `no-medical-advice` / **No medical advice**: content on this site, the journal included, is general information and not advice for a specific person. Reading it does not create a clinician relationship. Always ask us about your own situation.
4. `emergencies` / **Emergencies**: call 911 or go to an emergency department. Never use the contact form, email, or any part of this site for an emergency. Repeat the specific red flags used on `/contact`.
5. `appointments` / **Appointments and cancellations**: booking through the site is a request confirmed by us, how to cancel or reschedule, and the notice we ask for.
6. `insurance-billing` / **Insurance and billing**: we verify benefits before the visit where we can, verification is not a guarantee of payment by your plan, and you remain responsible for amounts your plan does not cover.
7. `telehealth` / **Telehealth terms**: what telehealth suits and does not suit, that the clinician may require an in-person visit, that you should be somewhere private with a working connection, and that state licensure means you generally need to be physically in California during the visit.
8. `intellectual-property` / **Intellectual property**: site content, branding, and photography belong to us or our licensors; personal non-commercial use is fine, republication is not.
9. `third-party-links` / **Third-party links**: the partners page and other pages link out; we do not control those sites and their terms and privacy policies govern there.
10. `disclaimers` / **Disclaimers**: the site is provided as is, we aim for accuracy but do not warrant that everything is current or error free, and hours or services can change.
11. `liability` / **Limitation of liability**: to the extent the law allows, we are not liable for indirect or consequential loss from use of the site. State clearly that nothing in this section limits liability for the care we actually provide.
12. `accessibility` / **Accessibility**: we aim to meet WCAG 2.1 AA, the site supports keyboard navigation, honours `prefers-reduced-motion`, and offers light and dark themes. Invite reports of barriers to contact@sgmdoctor.com and commit to responding. **This section's `id` must be exactly `accessibility`**, because the footer links to `/terms#accessibility`.
13. `governing-law` / **Governing law**: California law, venue in Los Angeles County.
14. `changes` / **Changes to these terms**: we update the page and the last-updated date; continued use means acceptance.

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run components/LegalPage.test.tsx`
Expected: PASS.

- [ ] **Step 8: Verify content shape, colors, and dashes**

```bash
node -e "const p=require('fs').readFileSync('components/legal/privacyContent.ts','utf8');const t=require('fs').readFileSync('components/legal/termsContent.ts','utf8');console.log('privacy ids:',(p.match(/id:\s*\"/g)||[]).length);console.log('terms ids:',(t.match(/id:\s*\"/g)||[]).length);console.log('accessibility anchor:',t.includes('id: \"accessibility\"'))"
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/LegalPage.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/LegalPage.tsx components/legal || echo "copy clean"
```

Expected: `privacy ids: 11`, `terms ids: 14`, `accessibility anchor: true`, `css clean`, `copy clean`.

- [ ] **Step 9: Commit**

```bash
git add components/LegalPage.tsx components/LegalPage.module.css components/LegalPage.test.tsx components/legal
git commit -m "feat: add LegalPage shell with privacy and terms content data"
```

---

### Task 17: The /privacy and /terms routes

**Files:**
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`

**Interfaces:**
- Consumes: `LegalPage`, `PRIVACY_SECTIONS`, `PRIVACY_INTRO`, `TERMS_SECTIONS`, `TERMS_INTRO` (Task 16)
- Produces: `/privacy` and `/terms`. Task 21 points the footer at both, and at `/terms#accessibility`.

- [ ] **Step 1: Write `app/privacy/page.tsx`**

```tsx
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import LegalPage from "@/components/LegalPage";
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/components/legal/privacyContent";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Privacy Policy | St. Gianna Medical Group",
  description:
    "What St. Gianna Medical Group collects, how it is used, how protected health information is handled under HIPAA, and the rights you can exercise.",
};

export default function PrivacyPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <LegalPage
        title="Privacy"
        italic="policy."
        breadcrumb="Privacy Policy"
        intro={PRIVACY_INTRO}
        effectiveDate="1 September 2026"
        sections={PRIVACY_SECTIONS}
      />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
```

Note: the legal pages deliberately omit `TickerBar`. A scrolling marquee above a legal document is noise.

- [ ] **Step 2: Write `app/terms/page.tsx`**

Same shape, with:

```tsx
export const metadata: Metadata = {
  title: "Terms & Conditions | St. Gianna Medical Group",
  description:
    "The terms covering use of this website, including no medical advice, emergencies, appointments, telehealth, accessibility, and governing law.",
};
```

and `<LegalPage title="Terms &" italic="conditions." breadcrumb="Terms & Conditions" intro={TERMS_INTRO} effectiveDate="1 September 2026" sections={TERMS_SECTIONS} />`.

- [ ] **Step 3: Run the full suite and the build**

Run: `npm test && npm run build`
Expected: both succeed, and the build output lists `/privacy` and `/terms`.

- [ ] **Step 4: Confirm the accessibility anchor resolves**

Run: `npm run dev` in the background, then load `http://localhost:3000/terms#accessibility` and confirm the page scrolls to the Accessibility heading rather than sitting at the top. Stop the dev server afterwards.

- [ ] **Step 5: Commit**

```bash
git add app/privacy app/terms
git commit -m "feat: add the /privacy and /terms routes"
```

---

## Phase 4: Deepen /services

### Task 18: Expand ServiceCatalog to ten services with detail panels

**Files:**
- Modify: `components/ServiceCatalog.tsx`
- Modify: `components/ServiceCatalog.module.css`
- Modify: `components/ServiceCatalog.test.tsx`

**Interfaces:**
- Consumes: tokens (Task 1)
- Produces: `<section id="catalog">` where each row is a `<button aria-expanded>` opening a detail panel. Task 22 points the homepage `Services` rows at `/services#catalog`.

Rows stop being `<a href="#book">` links and become expand toggles, following the accordion pattern already in `ServicesFaq.tsx`. Each service gains `includes`, `who`, `duration`, and `conditions`.

**Divergence from the spec, deliberate.** The spec describes eight services. This plan grows the catalog to ten by adding behavioral and mental health, and senior and geriatric care, because "more depth" was the stated goal and both are real gaps for a family practice serving all ages. Task 3 already sets the `ServicesHero` stat to `10` to match. If ten is unwanted, drop the last two entries and set that stat back to `8`; nothing else depends on the count.

- [ ] **Step 1: Extend the test**

Add to `components/ServiceCatalog.test.tsx`:

```tsx
it("lists ten services", () => {
  render(<ServiceCatalog />);
  expect(screen.getAllByRole("button", { expanded: false }).length).toBeGreaterThanOrEqual(9);
  expect(screen.getByText("Behavioral & mental health")).toBeInTheDocument();
  expect(screen.getByText("Senior & geriatric care")).toBeInTheDocument();
});

it("opens a detail panel when a row is activated", async () => {
  const user = userEvent.setup();
  render(<ServiceCatalog />);
  const row = screen.getByRole("button", { name: /same-day sick visits/i });
  expect(row).toHaveAttribute("aria-expanded", "false");
  await user.click(row);
  expect(row).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(/Typical visit/i)).toBeInTheDocument();
});

it("keeps only one panel open at a time", async () => {
  const user = userEvent.setup();
  render(<ServiceCatalog />);
  const first = screen.getByRole("button", { name: /same-day sick visits/i });
  const second = screen.getByRole("button", { name: /telehealth/i });
  await user.click(first);
  await user.click(second);
  expect(first).toHaveAttribute("aria-expanded", "false");
  expect(second).toHaveAttribute("aria-expanded", "true");
});
```

Add `import userEvent from "@testing-library/user-event";` to the file.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/ServiceCatalog.test.tsx`
Expected: FAIL, rows are links and the new services do not exist.

- [ ] **Step 3: Extend the `SERVICES` data**

Keep the existing eight entries and their `title`, `body`, and `image` values unchanged. Add these four fields to each, and append the two new services:

```ts
type Service = {
  title: string;
  body: string;
  image: string;
  includes: string[];
  who: string;
  duration: string;
  conditions: string[];
};
```

Field content per service:

- **Same-day sick visits** — includes: `["Same-day assessment", "Rapid strep and flu testing", "Prescriptions sent to your pharmacy", "Work or school note"]`; who: `Anyone in the family with an illness that started in the last few days.`; duration: `20 minutes`; conditions: `["Fever", "Sore throat", "Ear pain", "Cough", "Stomach upset", "Rashes", "Minor injuries"]`
- **Chronic condition management** — includes: `["A written care plan", "Medication review at every visit", "Coordinated specialist referrals", "Between-visit check-ins"]`; who: `Adults and children living with a long-term condition.`; duration: `30 to 40 minutes`; conditions: `["Asthma", "Allergies", "Type 2 diabetes", "High blood pressure", "High cholesterol", "Thyroid disorders"]`
- **Preventative care** — includes: `["Age-appropriate screening", "Bloodwork and results review", "Lifestyle and risk counselling", "A schedule for the year ahead"]`; who: `Everyone, whether or not anything feels wrong.`; duration: `30 minutes`; conditions: `["Cardiovascular risk", "Diabetes screening", "Cancer screening", "Bone health", "Mental health screening"]`
- **Well-child & physicals** — includes: `["Growth and development check", "Vision and hearing screening", "School, camp, and sports forms completed", "Immunizations brought up to date"]`; who: `Newborns through age 21.`; duration: `30 minutes`; conditions: `["Growth concerns", "Developmental milestones", "Sports clearance", "School forms"]`
- **Immunizations** — includes: `["Full childhood schedule", "Catch-up schedules", "Travel vaccines", "Seasonal flu and COVID"]`; who: `All ages, including adults who have lost track of their record.`; duration: `15 minutes`; conditions: `["Routine childhood schedule", "Travel protection", "Seasonal illness", "Occupational requirements"]`
- **Telehealth** — includes: `["Video consultation", "Diagnosis and prescriptions", "Follow-up and medication reviews", "Evening slots"]`; who: `Anyone whose problem does not need hands or instruments.`; duration: `15 to 20 minutes`; conditions: `["Rashes", "Medication questions", "Follow-ups", "Minor infections", "Mental health check-ins"]`
- **Advanced wound care** — includes: `["Wound assessment and measurement", "Debridement where needed", "Advanced dressings", "Infection monitoring"]`; who: `Patients with a wound that has not healed as expected.`; duration: `30 to 45 minutes`; conditions: `["Diabetic foot ulcers", "Pressure injuries", "Venous ulcers", "Post-surgical wounds", "Non-healing cuts"]`
- **Women's health** — includes: `["Well-woman examination", "Cervical screening", "Contraception counselling", "Menopause support"]`; who: `Women and girls at every stage.`; duration: `30 minutes`; conditions: `["Irregular periods", "Contraception", "Menopause symptoms", "Urinary symptoms", "Routine screening"]`
- **Behavioral & mental health** (new, image `/images/photo-counseling-session.jpg`) — body: `Screening, first-line treatment, and referral for anxiety, low mood, ADHD, and behavioral concerns.`; includes: `["Structured screening", "Treatment plan and follow-up", "Medication management where appropriate", "Referral into therapy"]`; who: `Children, teenagers, and adults.`; duration: `40 minutes`; conditions: `["Anxiety", "Low mood", "ADHD", "Sleep difficulty", "Behavioral concerns", "Stress"]`
- **Senior & geriatric care** (new, image `/images/photo-doctor-portrait.jpg`) — body: `Medication review, fall risk, memory concerns, and coordination with the specialists already involved.`; includes: `["Full medication reconciliation", "Fall and mobility assessment", "Cognitive screening", "Coordination with specialists and family"]`; who: `Adults from 65, and anyone managing several conditions at once.`; duration: `40 minutes`; conditions: `["Polypharmacy", "Falls", "Memory concerns", "Frailty", "Multiple chronic conditions"]`

- [ ] **Step 4: Convert rows to expand toggles**

Replace the `<a href="#book">` row with:

```tsx
<div key={service.title} className={`${styles.item} ${open ? styles.itemOpen : ""}`}>
  <button
    type="button"
    className={styles.row}
    aria-expanded={open}
    onClick={() => setOpenIndex(open ? -1 : i)}
    onMouseEnter={() => setHovered(i)}
  >
    <span className={styles.num}>{`${i + 1 < 10 ? "0" : ""}${i + 1}`}</span>
    <span className={styles.title}>{service.title}</span>
    <span className={styles.body}>{service.body}</span>
    <AddIcon size={26} className={styles.icon} />
  </button>
  <div className={styles.panelWrap}>
    <div className={styles.panel}>
      <div className={styles.panelCol}>
        <span className={styles.panelLabel}>What is included</span>
        <ul className={styles.panelList}>
          {service.includes.map((entry) => <li key={entry}>{entry}</li>)}
        </ul>
      </div>
      <div className={styles.panelCol}>
        <span className={styles.panelLabel}>Who it is for</span>
        <p className={styles.panelText}>{service.who}</p>
        <span className={styles.panelLabel}>Typical visit</span>
        <p className={styles.panelText}>{service.duration}</p>
      </div>
      <div className={styles.panelCol}>
        <span className={styles.panelLabel}>Conditions covered</span>
        <span className={styles.tags}>
          {service.conditions.map((c) => <span key={c} className={styles.tag}>{c}</span>)}
        </span>
      </div>
    </div>
  </div>
</div>
```

State: replace nothing existing, add `const [openIndex, setOpenIndex] = useState(-1);` alongside the existing `hovered` state. Import `AddIcon` from `@/components/icons` and drop the `ArrowOutwardIcon` import if it becomes unused.

- [ ] **Step 5: Update `components/ServiceCatalog.module.css`**

Keep the existing row styling. Add:

- `.item`: `border-bottom: 1px solid var(--line)`
- `.row`: add `width: 100%`, `background: none`, `border: none`, `text-align: left`, `cursor: pointer`, `font-family: inherit`
- `.icon`: `color: var(--muted-2)`, `transition: transform .35s ease`; `.itemOpen .icon { transform: rotate(45deg); color: var(--accent); }`
- `.panelWrap`: `display: grid`, `grid-template-rows: 0fr`, `transition: grid-template-rows .4s ease`; `.itemOpen .panelWrap { grid-template-rows: 1fr; }`; and `.panelWrap > .panel { overflow: hidden; }`
- `.panel`: `display: grid`, `grid-template-columns: repeat(3, minmax(0, 1fr))`, `gap: 30px`, `padding: 0 0 30px`
- `.panelLabel`: 11.5px, weight 800, `letter-spacing: .14em`, uppercase, `color: var(--muted-2)`, `display: block`, `margin-bottom: 9px`
- `.panelList`: `margin: 0`, `padding-left: 18px`, flex column, `gap: 7px`, 14.5px, `line-height: 1.6`, `color: var(--muted)`
- `.panelText`: 14.5px, `line-height: 1.6`, `color: var(--muted)`, `margin: 0 0 18px`
- `.tags`: `display: flex; flex-wrap: wrap; gap: 8px;`
- `.tag`: 11.5px, weight 600, `color: var(--muted-2)`, `background: var(--chip-bg)`, `padding: 5px 10px`, `border-radius: 999px`
- `@media (max-width: 1179px)`: hide the hover preview with `.previewWrap { display: none; }`
- `@media (max-width: 859px)`: `.panel { grid-template-columns: 1fr; gap: 22px; }`

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/ServiceCatalog.test.tsx`
Expected: PASS.

- [ ] **Step 7: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/ServiceCatalog.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/ServiceCatalog.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`. If the pre-existing CSS contains literals, convert them to tokens as part of this task.

- [ ] **Step 8: Commit**

```bash
git add components/ServiceCatalog.tsx components/ServiceCatalog.module.css components/ServiceCatalog.test.tsx
git commit -m "feat: expand service catalog to ten services with expandable detail panels"
```

---

### Task 19: ServiceConditions, ServicesInsurance, expanded FAQ, and the services page order

**Files:**
- Create: `components/ServiceConditions.tsx`, `.module.css`, `.test.tsx`
- Create: `components/ServicesInsurance.tsx`, `.module.css`, `.test.tsx`
- Modify: `components/ServicesFaq.tsx`, `components/ServicesFaq.test.tsx`
- Modify: `app/services/page.tsx`

**Interfaces:**
- Consumes: tokens (Task 1)
- Produces: `<section id="conditions">` and `<section id="insurance">`. Task 21 points the footer's `Insurance & billing` link at `/services#insurance`.

- [ ] **Step 1: Write the failing tests**

Create `components/ServiceConditions.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceConditions from "./ServiceConditions";

describe("ServiceConditions", () => {
  it("renders six condition groups", () => {
    render(<ServiceConditions />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/conditions we treat/i);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByText("Respiratory")).toBeInTheDocument();
    expect(screen.getByText("Wound care")).toBeInTheDocument();
  });
});
```

Create `components/ServicesInsurance.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesInsurance from "./ServicesInsurance";

describe("ServicesInsurance", () => {
  it("renders the three billing blocks and links billing questions to contact", () => {
    render(<ServicesInsurance />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/insurance/i);
    expect(screen.getByText(/Accepted plans/i)).toBeInTheDocument();
    expect(screen.getByText(/What to bring/i)).toBeInTheDocument();
    expect(screen.getByText(/Paying without insurance/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ask us about billing/i })).toHaveAttribute(
      "href",
      "/contact#message",
    );
  });
});
```

Add to `components/ServicesFaq.test.tsx`:

```tsx
it("lists nine questions", () => {
  render(<ServicesFaq />);
  expect(screen.getAllByRole("button", { expanded: false }).length).toBeGreaterThanOrEqual(8);
  expect(screen.getByText(/refill a prescription/i)).toBeInTheDocument();
  expect(screen.getByText(/see a specialist/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/ServiceConditions.test.tsx components/ServicesInsurance.test.tsx components/ServicesFaq.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write `components/ServiceConditions.tsx`**

Follow **Contract B** with `id="conditions"`. Heading: `Conditions we treat.` Six groups, each an `<article>` with an `<h3>` and a chip list, carrying the **Contract C** stagger.

```tsx
const GROUPS = [
  {
    name: "Respiratory",
    items: ["Asthma", "Bronchitis", "Croup", "Sinusitis", "Pneumonia", "Persistent cough", "Seasonal allergies"],
  },
  {
    name: "Skin",
    items: ["Eczema", "Acne", "Impetigo", "Hives", "Fungal infections", "Insect bites", "Warts"],
  },
  {
    name: "Digestive",
    items: ["Reflux", "Constipation", "Gastroenteritis", "Food intolerance", "Abdominal pain", "Colic"],
  },
  {
    name: "Chronic",
    items: ["Type 2 diabetes", "High blood pressure", "High cholesterol", "Thyroid disorders", "Obesity", "Chronic fatigue"],
  },
  {
    name: "Women's health",
    items: ["Irregular periods", "Contraception", "Menopause symptoms", "Urinary tract infections", "Cervical screening"],
  },
  {
    name: "Wound care",
    items: ["Diabetic foot ulcers", "Pressure injuries", "Venous ulcers", "Post-surgical wounds", "Non-healing cuts", "Burns"],
  },
];
```

Add a closing line below the grid: `This is not the whole list. If what you are dealing with is not here, call and ask. If it is not something we should treat, we will say so and point you to who should.`

- [ ] **Step 4: Write `components/ServiceConditions.module.css`**

Start from **Contract A** with `background: var(--bg-2)`, add **Contract C** keyed on `.card`. Then:

- `.grid`: `display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 30px;`
- `.card`: flex column, `gap: 13px`
- `.groupName`: 17px, weight 700, `color: var(--ink)`, `margin: 0`, `padding-bottom: 12px`, `border-bottom: 1px solid var(--rule-accent)`
- `.items`: `display: flex; flex-wrap: wrap; gap: 8px;`
- `.item`: 12.5px, weight 600, `color: var(--muted)`, `background: var(--chip-bg)`, `padding: 6px 12px`, `border-radius: 999px`
- `.footnote`: `margin: clamp(30px, 3.5vw, 44px) 0 0`, 15px, `line-height: 1.65`, `color: var(--muted-2)`, `max-width: 66ch`
- `@media (max-width: 1179px)`: `.grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }`
- `@media (max-width: 640px)`: `.grid { grid-template-columns: 1fr; }`

- [ ] **Step 5: Write `components/ServicesInsurance.tsx`**

Follow **Contract B** with `id="insurance"`. Heading: `Insurance and billing, before the visit.` Three `<article>` blocks with `<h3>` headings `Accepted plans`, `What to bring`, and `Paying without insurance`, each with a paragraph and a bullet list, carrying the **Contract C** stagger. Below them, a link: `<Link href="/contact#message" className={styles.cta}>Ask us about billing</Link>`.

Content:
- **Accepted plans**: most Los Angeles HMO and IPA plans, plus Medi-Cal managed care and major PPO networks. Bullets listing plan families generically (`Blue Shield`, `Health Net`, `L.A. Care`, `Molina`, `Anthem`, `Medi-Cal managed care`). Add the honest caveat that plan participation changes and reception confirms yours when you book.
- **What to bring**: photo ID, insurance card, list of current medications, immunization record if transferring in, and for a child a parent or legal guardian for consent.
- **Paying without insurance**: self-pay pricing is quoted before the visit, payment is due at the time of service, and payment plans exist for wound care and chronic care courses. Say plainly that nobody is turned away without being told the cost first.

- [ ] **Step 6: Write `components/ServicesInsurance.module.css`**

Start from **Contract A** with `background: var(--bg)`, add **Contract C** keyed on `.card`. Grid `repeat(auto-fit, minmax(280px, 1fr))`, `gap: 30px`. Cards with `border-top: 2px solid var(--rule-accent)`, `padding: 26px 26px 30px 0`. `.list` styled like `LegalPage` `.bullets`. `.cta` styled like `PartnersJoin` `.cta`.

- [ ] **Step 7: Expand `ServicesFaq` from five to nine questions**

Keep the five existing entries verbatim. Append four:

```ts
{
  q: "How do I refill a prescription?",
  a: "Ask your pharmacy to send the request to us and it lands straight in your chart, which is faster than calling. Controlled medications need a visit before a refill, so book one instead of writing in.",
},
{
  q: "Can you refer me to see a specialist?",
  a: "Yes, and where the specialist sits inside our partner network your chart travels with the referral, so the first appointment is not spent repeating your history. If your plan needs authorisation we start that for you.",
},
{
  q: "Do you see adults, or only children?",
  a: "Both. We are a family practice: newborns through to seniors, with the same chart following each person. Plenty of our families book a parent and a child back to back.",
},
{
  q: "How do I transfer records from a previous clinic?",
  a: "Email contact@sgmdoctor.com with the practice name and we will send you a release to sign. Most transfers land within five business days, and we will chase if they do not.",
},
```

- [ ] **Step 8: Reorder `app/services/page.tsx`**

Insert the two new sections between `ServiceCatalog` and `VisitSteps`:

```tsx
<ServicesHero />
<TickerBar />
<CorePillars />
<ServiceCatalog />
<ServiceConditions />
<ServicesInsurance />
<VisitSteps />
<ServicesFaq />
<Cta />
```

Add the two imports.

- [ ] **Step 9: Run the tests, the full suite, and the build**

Run: `npx vitest run components/ServiceConditions.test.tsx components/ServicesInsurance.test.tsx components/ServicesFaq.test.tsx`
Expected: PASS.

Run: `npm test && npm run build`
Expected: both succeed.

- [ ] **Step 10: Verify no literal colors and no long dashes**

```bash
grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' components/ServiceConditions.module.css components/ServicesInsurance.module.css | grep -v 'var(' || echo "css clean"
grep -rn $'\xe2\x80\x94\|\xe2\x80\x93' components/ServiceConditions.tsx components/ServicesInsurance.tsx components/ServicesFaq.tsx app/services/page.tsx || echo "copy clean"
```

Expected: `css clean` and `copy clean`.

- [ ] **Step 11: Commit**

```bash
git add components/ServiceConditions.tsx components/ServiceConditions.module.css components/ServiceConditions.test.tsx components/ServicesInsurance.tsx components/ServicesInsurance.module.css components/ServicesInsurance.test.tsx components/ServicesFaq.tsx components/ServicesFaq.test.tsx app/services/page.tsx
git commit -m "feat: add conditions and insurance sections to services, expand FAQ to nine"
```

---

## Phase 5: Wiring

Nothing links to a new route until the route exists. All six routes land in Phases 3 and 4, so this phase can wire freely.

### Task 20: Rewire the Nav

**Files:**
- Modify: `components/Nav.tsx`
- Modify: `components/Nav.test.tsx`

**Interfaces:**
- Consumes: all six new routes (Tasks 7, 9, 12, 15, 17)
- Produces: nav links to every page. Nothing depends on it.

Three changes, one of which deliberately breaks an existing test:

1. Four hash links become real routes: `Why us` → `/why-us`, `Journal` → `/journal`, `Partners` → `/partners`, `Contact` → `/contact`.
2. Internal items render `next/link` rather than `<a href>`, so navigation stops forcing a full document load.
3. The theme toggle becomes a real `<button>` instead of an `<a href="/#top">` with `preventDefault`. **This intentionally changes `Nav.test.tsx`**, which currently asserts `getByRole("link", { name: /light mode/i })`. The toggle is a control, not a destination, and giving it button semantics fixes its keyboard behavior. Update that assertion to `getByRole("button", { name: /light mode/i })`.

`usePathname` comes from `next/navigation`, which has no provider in jsdom, so the test must mock it.

- [ ] **Step 1: Update `components/Nav.test.tsx`**

Add the mock at the top of the file, above the `describe`:

```tsx
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/services" }));
```

Change the theme toggle assertion:

```tsx
it("shows the theme toggle as a button labeled for the current (dark) theme", () => {
  render(<Nav />);
  expect(screen.getByRole("button", { name: /light mode/i })).toBeInTheDocument();
});
```

Add two new tests:

```tsx
it("links the four secondary destinations to their own pages", () => {
  render(<Nav />);
  expect(screen.getByRole("link", { name: /why us/i })).toHaveAttribute("href", "/why-us");
  expect(screen.getByRole("link", { name: /journal/i })).toHaveAttribute("href", "/journal");
  expect(screen.getByRole("link", { name: /partners/i })).toHaveAttribute("href", "/partners");
  expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
});

it("marks the current route as the active page", () => {
  render(<Nav />);
  expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: /home/i })).not.toHaveAttribute("aria-current");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/Nav.test.tsx`
Expected: FAIL on the new hrefs, the button role, and `aria-current`.

- [ ] **Step 3: Update the item list in `components/Nav.tsx`**

```tsx
const items = [
  { label: "Home", href: "/", icon: <HomeIcon size={23} />, primary: true },
  { label: "About us", href: "/about", icon: <DiversityIcon size={23} />, primary: true },
  { label: "Services", href: "/services", icon: <StethoscopeIcon size={23} />, primary: true },
  { label: "Why us", href: "/why-us", icon: <FavoriteIcon size={23} />, primary: false },
  { label: "Locations", href: "/locations", icon: <NearMeIcon size={23} />, primary: true },
  { label: "Journal", href: "/journal", icon: <MenuBookIcon size={23} />, primary: false },
  { label: "Partners", href: "/partners", icon: <HandshakeIcon size={23} />, primary: false },
  { label: "Contact", href: "/contact", icon: <ChatBubbleIcon size={23} />, primary: false },
  { label: "Call us", href: "tel:+18183084100", icon: <CallIcon size={23} />, primary: true },
  {
    label: theme === "dark" ? "Light mode" : "Dark mode",
    icon: theme === "dark" ? <LightModeIcon size={23} /> : <DarkModeIcon size={23} />,
    primary: true,
    onClick: toggleTheme,
  },
];
```

The toggle entry no longer carries an `href`.

- [ ] **Step 4: Render three element kinds inside the list**

Add `import Link from "next/link";` and `import { usePathname } from "next/navigation";`, then `const pathname = usePathname();`.

Inside the `items.map`, replace the single `<a>` with a branch. Keep `onMouseEnter={() => setHoverIndex(i)}` and the identical `className`, `iconWrap`, and `label` markup on all three branches so the blob geometry is unaffected:

```tsx
const content = (
  <>
    <span className={styles.iconWrap}>{item.icon}</span>
    <span className={`${styles.label} ${hoverIndex === i ? styles.labelVisible : ""}`}>
      {item.label}
    </span>
  </>
);

if (item.onClick) {
  return (
    <button
      type="button"
      className={styles.link}
      onMouseEnter={() => setHoverIndex(i)}
      onClick={item.onClick}
    >
      {content}
    </button>
  );
}

const external = item.href.startsWith("tel:") || item.href.startsWith("http");

return external ? (
  <a href={item.href} className={styles.link} onMouseEnter={() => setHoverIndex(i)}>
    {content}
  </a>
) : (
  <Link
    href={item.href}
    className={styles.link}
    aria-current={pathname === item.href ? "page" : undefined}
    onMouseEnter={() => setHoverIndex(i)}
  >
    {content}
  </Link>
);
```

- [ ] **Step 5: Add button reset and active styling to `components/Nav.module.css`**

Add to the existing `.link` rule so the `<button>` matches the anchors exactly: `background: none; border: none; font-family: inherit; cursor: pointer;`

Add an active treatment: `.link[aria-current="page"] .iconWrap { color: var(--accent); }`

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/Nav.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/Nav.tsx components/Nav.module.css components/Nav.test.tsx
git commit -m "feat: point nav at the new routes, use next/link, and mark the active page"
```

---

### Task 21: Rewire the Footer

**Files:**
- Modify: `components/Footer.tsx`
- Modify: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: all six new routes, `/services#insurance` (Task 19), `/contact#careers` (Task 15), `/terms#accessibility` (Task 16)
- Produces: the only route into `/privacy` and `/terms`, which are deliberately absent from the nav.

- [ ] **Step 1: Extend `components/Footer.test.tsx`**

Add to the existing test file:

```tsx
it("links the expanded Explore column", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "Why us" })).toHaveAttribute("href", "/why-us");
  expect(screen.getByRole("link", { name: "Journal" })).toHaveAttribute("href", "/journal");
  expect(screen.getByRole("link", { name: "Partners" })).toHaveAttribute("href", "/partners");
});

it("links the Patients column to real destinations", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  expect(screen.getByRole("link", { name: /insurance/i })).toHaveAttribute(
    "href",
    "/services#insurance",
  );
  expect(screen.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/contact#careers");
});

it("links the legal row to the legal pages", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
  expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  expect(screen.getByRole("link", { name: "Accessibility" })).toHaveAttribute(
    "href",
    "/terms#accessibility",
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/Footer.test.tsx`
Expected: FAIL, links still point at `/#footer`.

- [ ] **Step 3: Update the Explore column**

```tsx
<Link href="/about" className={styles.link}>About us</Link>
<Link href="/services" className={styles.link}>Services</Link>
<Link href="/why-us" className={styles.link}>Why us</Link>
<Link href="/locations" className={styles.link}>Locations</Link>
<Link href="/journal" className={styles.link}>Journal</Link>
<Link href="/partners" className={styles.link}>Partners</Link>
```

- [ ] **Step 4: Update the Patients column**

```tsx
<Link href="/#book" className={styles.link}>Book appointment</Link>
<Link href="/contact" className={styles.link}>Contact</Link>
<Link href="/services#insurance" className={styles.link}>Insurance &amp; billing</Link>
<Link href="/contact#careers" className={styles.link}>Careers</Link>
```

The `Patient portal` entry is dropped. There is no patient portal to link to, and a link that goes nowhere is worse than no link. If one exists later it can be added back with a real destination.

- [ ] **Step 5: Update the legal row**

```tsx
<span className={styles.legalLinks}>
  <Link href="/privacy">Privacy</Link>
  <Link href="/terms">Terms</Link>
  <Link href="/terms#accessibility">Accessibility</Link>
</span>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/Footer.tsx components/Footer.test.tsx
git commit -m "feat: point footer at the new routes and the legal pages"
```

---

### Task 22: Wire the homepage cards outward

Today every card on the homepage dead-ends at `#book` or at itself. Each now points at the page that expands on it.

**Files:**
- Modify: `components/Services.tsx`, `.module.css`, `.test.tsx`
- Modify: `components/WhyUs.tsx`, `.module.css`, `.test.tsx`
- Modify: `components/Partners.tsx`, `.test.tsx`
- Modify: `components/JournalTeaser.tsx`, `.test.tsx`
- Modify: `components/Locations.tsx`, `.test.tsx`

**Interfaces:**
- Consumes: `/services#catalog` (Task 18), `/why-us#<slug>` (Task 5), `/partners#network` (Task 8), `/journal` (Task 12), `/locations` (existing)
- Produces: nothing. This is the last content change.

- [ ] **Step 1: Extend the five tests**

`components/Services.test.tsx`:

```tsx
it("points every row at the services catalog and offers a see-all link", () => {
  render(<Services />);
  screen.getAllByRole("link", { name: /well-child|sick visits|telehealth|wound care|immunizations|chronic care/i })
    .forEach((link) => expect(link).toHaveAttribute("href", "/services#catalog"));
  expect(screen.getByRole("link", { name: /see all services/i })).toHaveAttribute(
    "href",
    "/services",
  );
});
```

`components/WhyUs.test.tsx`:

```tsx
it("links each reason card to its section on the why-us page", () => {
  render(<WhyUs />);
  expect(screen.getByRole("link", { name: /same-day slots/i })).toHaveAttribute(
    "href",
    "/why-us#same-day",
  );
  expect(screen.getByRole("link", { name: /book at 2am/i })).toHaveAttribute(
    "href",
    "/why-us#booking",
  );
  expect(screen.getByRole("link", { name: /one chart, everywhere/i })).toHaveAttribute(
    "href",
    "/why-us#one-chart",
  );
  expect(screen.getByRole("link", { name: /insurance handled/i })).toHaveAttribute(
    "href",
    "/why-us#insurance",
  );
});
```

`components/Partners.test.tsx`:

```tsx
it("points every partner row at the partners page", () => {
  render(<Partners />);
  expect(screen.getByRole("link", { name: /KT Doctor/i })).toHaveAttribute(
    "href",
    "/partners#network",
  );
});
```

`components/JournalTeaser.test.tsx`:

```tsx
it("links the teaser to the journal page", () => {
  render(<JournalTeaser />);
  expect(screen.getByRole("link", { name: /10 essential habits/i })).toHaveAttribute(
    "href",
    "/journal",
  );
});
```

`components/Locations.test.tsx`:

```tsx
it("makes each clinic panel a link to the locations page", () => {
  render(<Locations />);
  const links = screen.getAllByRole("link");
  expect(links).toHaveLength(3);
  links.forEach((link) => expect(link).toHaveAttribute("href", "/locations"));
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/Services.test.tsx components/WhyUs.test.tsx components/Partners.test.tsx components/JournalTeaser.test.tsx components/Locations.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Update `components/Services.tsx`**

Change each row from `href="#book"` to `href="/services#catalog"` and swap the `<a>` for `next/link`. After the `.rows` block, add:

```tsx
<Link href="/services" className={styles.seeAll}>
  See all services <ArrowOutwardIcon size={19} />
</Link>
```

Add `.seeAll` to `Services.module.css`: `margin-top: 34px`, `display: inline-flex`, `align-items: center`, `gap: 9px`, 14px, weight 700, `letter-spacing: .04em`, `color: var(--link)`.

- [ ] **Step 4: Update `components/WhyUs.tsx`**

Add an `href` to each entry in `REASONS`: `/why-us#same-day`, `/why-us#booking`, `/why-us#one-chart`, `/why-us#insurance`, in that order. Change the card `<div>` to `<Link href={href} className={styles.card}>` and import `Link` from `next/link`.

In `WhyUs.module.css`, add `color: inherit;` and a hover treatment to `.card` (`transition: border-color .3s ease`, and on hover `border-top-color: var(--accent)`), and replace the existing literal `border-top: 2px solid rgba(79, 195, 194, .45)` with `border-top: 2px solid var(--rule-accent)`. That literal is a pre-existing violation of the no-hardcoded-colors rule and this task is the right moment to remove it.

- [ ] **Step 5: Update `components/Partners.tsx`**

Change each row from `href="#book"` to `href="/partners#network"` and swap the `<a>` for `next/link`.

- [ ] **Step 6: Update `components/JournalTeaser.tsx`**

Change `href="#insight"` to `href="/journal"` and swap the `<a>` for `next/link`.

- [ ] **Step 7: Update `components/Locations.tsx`**

Change each panel from `<button type="button">` to `<Link href="/locations">`. Keep `onMouseEnter` and `onFocus` exactly as they are so hover and keyboard focus still drive the active panel state. Remove `type="button"`. Import `Link` from `next/link`.

In `Locations.module.css`, add `color: inherit;` and `text-align: left;` to `.panel` so the anchor matches the previous button rendering.

- [ ] **Step 8: Run the tests, the full suite, and the build**

Run: `npx vitest run components/Services.test.tsx components/WhyUs.test.tsx components/Partners.test.tsx components/JournalTeaser.test.tsx components/Locations.test.tsx`
Expected: PASS.

Run: `npm test && npm run build`
Expected: both succeed.

- [ ] **Step 9: Commit**

```bash
git add components/Services.tsx components/Services.module.css components/Services.test.tsx components/WhyUs.tsx components/WhyUs.module.css components/WhyUs.test.tsx components/Partners.tsx components/Partners.test.tsx components/JournalTeaser.tsx components/JournalTeaser.test.tsx components/Locations.tsx components/Locations.module.css components/Locations.test.tsx
git commit -m "feat: link homepage cards and teasers to their dedicated pages"
```

---

## Phase 6: Verification

### Task 23: Full-branch verification sweep

No new behavior. This task proves the constraints hold across everything built, and it is the only place the work may be called done.

**Files:**
- Modify: only whatever the checks below turn up as broken

- [ ] **Step 1: Full suite, lint, and build**

```bash
npm test
npm run lint
npm run build
```

Expected: suite green with no skipped files, lint clean, build succeeding and listing all ten routes: `/`, `/about`, `/services`, `/locations`, `/why-us`, `/journal`, `/partners`, `/contact`, `/privacy`, `/terms`.

- [ ] **Step 2: Prove no literal colors entered any component**

```bash
grep -rnE '#[0-9a-fA-F]{3,8}|rgba?\(' components --include=*.module.css | grep -v 'var(' || echo "no literal colors"
```

Expected: `no literal colors`. Any hit is fixed by adding a token to **both** blocks in `globals.css`.

- [ ] **Step 3: Prove no em or en dashes reached any page copy**

```bash
grep -rn $'\xe2\x80\x94' app components || echo "no em dashes"
grep -rn $'\xe2\x80\x93' app components || echo "no en dashes"
```

Expected: both print the clean message.

- [ ] **Step 4: Prove every image path referenced actually exists**

```bash
grep -rhoE '/images/[A-Za-z0-9._-]+' components app | sort -u > refs.txt
while read -r p; do [ -f "public$p" ] || echo "MISSING: $p"; done < refs.txt
rm -f refs.txt
```

Expected: no `MISSING` lines.

- [ ] **Step 5: Prove every internal link resolves to a real route or an anchor**

```bash
grep -rhoE 'href="/[a-z0-9/#-]*"' components app | sort -u
```

Review the list by hand. Every path segment before a `#` must be one of the ten routes. Any `/#book`, `/#top`, or `/#footer` is a homepage anchor and is fine.

- [ ] **Step 6: Check every new page at three widths in both themes**

Start the dev server, then for each of `/why-us`, `/journal`, `/partners`, `/contact`, `/privacy`, `/terms`, and the reworked `/services`:

- Render at **375px**, **860px**, and **1280px**
- Toggle the theme with the nav control at each width
- Confirm no horizontal page scroll, no clipped text, no overlapping elements, and no unreadable contrast
- Confirm the `WhyUsCompare` table is a table at 1280px and stacked cards at 375px
- Confirm the `ContactForm` two-column rows collapse to one column at 375px
- Confirm the `LegalPage` index is a sticky column at 1280px and a collapsible summary at 375px

- [ ] **Step 7: Scroll each new page top to bottom**

Confirm sections reveal as they enter, the card stagger reads as intentional rather than laggy, and the parallax layers in `PageHero`, `JournalFeatured`, `WhyUsNumbers`, and `ContactOffices` move without exposing an edge of the image.

- [ ] **Step 8: Confirm reduced motion is honored**

Enable `prefers-reduced-motion: reduce` in devtools, reload `/why-us`, and confirm every section is visible immediately with no transition and no parallax offset.

- [ ] **Step 9: Confirm every anchor the nav and footer promise actually lands**

Load each and confirm it scrolls to the right block rather than the top of the page:

- `/services#insurance`
- `/services#catalog`
- `/contact#careers`
- `/contact#message`
- `/terms#accessibility`
- `/why-us#same-day`, `#booking`, `#one-chart`, `#insurance`

- [ ] **Step 10: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found in the full-branch verification sweep"
```

---

## Open question for the user

`/contact` lists office addresses, and the La Mirada address in this repo disagrees with the current sgmdoctor.com site:

- **This repo**, in six places (`Locations.tsx`, `LocationsPanels.tsx`, `LocationsDetails.tsx`, `LocationsMap.tsx`, `AboutLocations.tsx`, and `Locations.test.tsx`): `12675 La Mirada Blvd, #200, La Mirada, CA 90638`
- **sgmdoctor.com**: `11900 La Mirada Blvd Ste 7, La Mirada, CA 90638`

Hollywood and Santa Monica agree between the two. Only La Mirada differs.

This plan uses **the repo's existing address** in `ContactOffices` so the site does not contradict itself, and because `LocationsMap.tsx` carries map coordinates tied to it. Changing it would mean updating six files plus the map marker.

**This needs a human answer.** If the real address is the sgmdoctor.com one, a follow-up task should update all six places and the map coordinates together. Do not let the two versions coexist on the site.

