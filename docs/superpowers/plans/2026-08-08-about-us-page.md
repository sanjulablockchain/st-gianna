# About Us Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `/about` page for the St. Gianna Medical Group site (six new section components wired into a new route), and correct placeholder contact data (phone numbers, addresses, booking link) sitewide to the real practice data.

**Architecture:** Next.js App Router page (`app/about/page.tsx`) composed of existing shared components (`Nav`, `BookCta`, `TickerBar`, `Cta`, `Footer`, `BackToTop`) plus six new page-specific section components (`AboutHero`, `AboutCommitment`, `AboutMission`, `AboutSpecialties`, `AboutValues`, `AboutLocations`), each with a co-located CSS Module and `*.test.tsx`, following the exact pattern of the existing `app/services/page.tsx`. Two new hand-rolled icons are added to the shared icon set. Separately, four existing files (`Cta.tsx`, `Locations.tsx`, `Nav.tsx`, `Footer.tsx`) get their placeholder phone/address/booking data replaced with real data, with their tests updated to match.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, CSS Modules, Vitest + Testing Library (jsdom).

## Global Constraints

- Never hardcode colors — use `var(--token)` from `app/globals.css` for every color/background/border. All tokens needed already exist; no new tokens are introduced.
- Reuse the existing breakpoints only: `max-width: 640px` (mobile), `max-width: 859px`–`1179px` (tablet), `min-width: 1180px` (desktop).
- Scroll-driven entrance animation goes through `useScrollReveal` (from `hooks/useScrollReveal.ts`) exactly as every other section does — no new scroll listeners/observers.
- Every component file gets a co-located `*.module.css` and co-located `*.test.tsx`.
- The CTA button text is "Book online" (already correct in the existing `Cta` component — do not change it back to "Book same-day appointment").
- The About page's team-photo section uses the existing asset `/images/photo-doctor-portrait.jpg`.
- Run `npm test` (full suite) before any task is considered done, per `CLAUDE.md`.

---

## File Structure

New files:
- `components/AboutHero.tsx` / `.module.css` / `.test.tsx`
- `components/AboutCommitment.tsx` / `.module.css` / `.test.tsx`
- `components/AboutMission.tsx` / `.module.css` / `.test.tsx`
- `components/AboutSpecialties.tsx` / `.module.css` / `.test.tsx`
- `components/AboutValues.tsx` / `.module.css` / `.test.tsx`
- `components/AboutLocations.tsx` / `.module.css` / `.test.tsx`
- `app/about/page.tsx`

Modified files:
- `components/icons/index.tsx` — add `VolunteerActivismIcon`, `DiversityIcon`
- `components/Cta.tsx` / `components/Cta.test.tsx` — real booking link + phone
- `components/Locations.tsx` / `components/Locations.test.tsx` — real addresses/phones
- `components/Nav.tsx` / `components/Nav.test.tsx` — new "About us" item + real "Call us" tel
- `components/Footer.tsx` / `components/Footer.test.tsx` — new "About us" link + real phones as `tel:` links

---

### Task 1: Correct `Cta.tsx` to the real booking link and phone number

**Files:**
- Modify: `components/Cta.tsx`
- Test: `components/Cta.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new (no signature changes — same component, same props).

- [ ] **Step 1: Update the failing test's expectations first**

Replace the full contents of `components/Cta.test.tsx` with:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Cta from "./Cta";

describe("Cta", () => {
  it("renders the closing headline and both call-to-action links", () => {
    render(<Cta />);
    expect(screen.getByRole("heading", { name: /ready when your family is/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book online/i })).toHaveAttribute(
      "href",
      "https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903",
    );
    expect(screen.getByRole("link", { name: /818-308-4100/i })).toHaveAttribute(
      "href",
      "tel:8183084100",
    );
  });
});
```

- [ ] **Step 2: Run it to confirm it fails against the current component**

Run: `npx vitest run components/Cta.test.tsx`
Expected: FAIL — the link hrefs/text don't match yet (`#book` / `tel:13105550123` / "(310) 555-0123").

- [ ] **Step 3: Update `components/Cta.tsx`**

Change the two `<a>` tags inside the `.actions` div (lines with `href="#book"` and `href="tel:13105550123"`) to:

```tsx
        <a
          href="https://app.nexhealth.com/appt/ktdoctor?atid=275899,275901,275900,275904,275905,275903"
          className={styles.primary}
        >
          Book online <ArrowOutwardIcon size={20} />
        </a>
        <a href="tel:8183084100" className={styles.secondary}>
          <CallIcon size={20} />
          818-308-4100
        </a>
```

Nothing else in the file changes (imports, the `id="book"` section, the heading, all stay as-is).

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `npx vitest run components/Cta.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/Cta.tsx components/Cta.test.tsx
git commit -m "fix: point Cta at the real booking link and phone number"
```

---

### Task 2: Correct `Locations.tsx` (homepage) to the real addresses and phone numbers

**Files:**
- Modify: `components/Locations.tsx`
- Test: `components/Locations.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing new.

- [ ] **Step 1: Update the failing test's expectations first**

Replace the full contents of `components/Locations.test.tsx` with:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Locations from "./Locations";

describe("Locations", () => {
  it("renders all three clinics with address, phone, and hours", () => {
    render(<Locations />);
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("2221 Lincoln Blvd, Santa Monica, CA 90405")).toBeInTheDocument();
    expect(screen.getByText("818-308-4100")).toBeInTheDocument();
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("5255 W Sunset Blvd, Los Angeles, CA 90027")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByText("12675 La Mirada Blvd, #200, La Mirada, CA 90638")).toBeInTheDocument();
    expect(screen.getByText("Opens 9am")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/Locations.test.tsx`
Expected: FAIL — old placeholder addresses/phones are still in the component.

- [ ] **Step 3: Update the `LOCATIONS` array in `components/Locations.tsx`**

Replace the `LOCATIONS` array (lines 9-34) with:

```tsx
const LOCATIONS = [
  {
    name: "Santa Monica",
    status: "Open now",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
    phone: "818-308-4100",
    hours: "Mon-Sat 8am-8pm",
    image: "/images/photo-hospital-hallway.jpg",
  },
  {
    name: "Hollywood",
    status: "Open now",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    phone: "818-275-7006",
    hours: "Mon-Sun 8am-9pm",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "La Mirada",
    status: "Opens 9am",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    phone: "562-941-9853",
    hours: "Mon-Fri 9am-6pm",
    image: "/images/photo-pediatric-checkup.jpg",
  },
];
```

Everything else in the file (the component body, the panel markup, `status`/`hours`/`image` usage) stays unchanged.

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `npx vitest run components/Locations.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/Locations.tsx components/Locations.test.tsx
git commit -m "fix: correct homepage clinic addresses and phone numbers"
```

---

### Task 3: `AboutHero` component

**Files:**
- Create: `components/AboutHero.tsx`
- Create: `components/AboutHero.module.css`
- Test: `components/AboutHero.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal` (existing, no changes).
- Produces: default-exported `AboutHero` component, no props. Consumed by `app/about/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `components/AboutHero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutHero from "./AboutHero";

describe("AboutHero", () => {
  it("renders the breadcrumb, headline, intro copy, and stats", () => {
    render(<AboutHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/who/i);
    expect(
      screen.getByText(
        /dedicated to providing exceptional healthcare services for adults and children/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA offices")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("Booking")).toBeInTheDocument();
    expect(screen.getByText("All ages")).toBeInTheDocument();
    expect(screen.getByText("Adults & children")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/AboutHero.test.tsx`
Expected: FAIL with "Cannot find module './AboutHero'"

- [ ] **Step 3: Create `components/AboutHero.tsx`**

```tsx
"use client";

import Link from "next/link";
import styles from "./AboutHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "All ages", l: "Adults & children" },
];

export default function AboutHero() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="top"
      data-dark="1"
      className={`${styles.hero} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <span className={styles.gradient} />
      <span className={styles.scanlines} />

      <Link href="/#top" className={styles.logo} aria-label="St. Gianna Medical Group" />

      <div className={styles.content}>
        <span className={styles.breadcrumb}>
          <span className={styles.liveDot} />
          <Link href="/#top" className={styles.breadcrumbLink}>
            Home
          </Link>{" "}
          / About us
        </span>
        <h1 className={styles.headline}>
          Who
          <br />
          <span className={styles.headlineItalic}>are we?</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            At St. Gianna Medical Group, we are dedicated to providing exceptional healthcare
            services for adults and children.
          </p>
          <div className={styles.stats}>
            {STATS.map((stat) => (
              <span key={stat.l} className={styles.stat}>
                <span className={styles.statNumber}>{stat.n}</span>
                <span className={styles.statLabel}>{stat.l}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/AboutHero.module.css`**

```css
.hero {
  position: relative;
  padding: 40px clamp(28px, 6vw, 96px) clamp(64px, 8vw, 104px) clamp(24px, 9vw, 150px);
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 8vh, 96px);
  overflow: hidden;
  background: #06161C;
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

.gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1100px 620px at 84% 8%, rgba(15, 163, 163, .34), transparent 62%),
    linear-gradient(180deg, rgba(6, 22, 28, 0) 40%, rgba(6, 22, 28, .9) 100%);
}

.scanlines {
  position: absolute;
  inset: 0;
  opacity: .5;
  background: repeating-linear-gradient(180deg, rgba(255, 255, 255, .045) 0 1px, transparent 1px 4px);
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
  color: rgba(255, 255, 255, .7);
}

.breadcrumbLink {
  color: rgba(255, 255, 255, .7);
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
  color: #fff;
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
  border-top: 1px solid rgba(255, 255, 255, .16);
}

.subcopy {
  margin: 0;
  max-width: 58ch;
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.6;
  color: rgba(255, 255, 255, .78);
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
  color: #fff;
  line-height: 1;
}

.statLabel {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, .55);
}

@media (max-width: 640px) {
  .subrow {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `npx vitest run components/AboutHero.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/AboutHero.tsx components/AboutHero.module.css components/AboutHero.test.tsx
git commit -m "feat: add AboutHero section for the About Us page"
```

---

### Task 4: `AboutCommitment` component

**Files:**
- Create: `components/AboutCommitment.tsx`
- Create: `components/AboutCommitment.module.css`
- Test: `components/AboutCommitment.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal`; `next/image`; the existing asset `/images/photo-doctor-portrait.jpg`.
- Produces: default-exported `AboutCommitment` component, no props. Consumed by `app/about/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `components/AboutCommitment.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutCommitment from "./AboutCommitment";

describe("AboutCommitment", () => {
  it("renders the heading, kicker, commitment copy, and portrait", () => {
    render(<AboutCommitment />);
    expect(
      screen.getByRole("heading", { name: /our commitment to your health/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Who are we")).toBeInTheDocument();
    expect(
      screen.getByText(
        /dedicated to providing exceptional healthcare services for adults and children/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByAltText(/st\. gianna medical group clinician/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/AboutCommitment.test.tsx`
Expected: FAIL with "Cannot find module './AboutCommitment'"

- [ ] **Step 3: Create `components/AboutCommitment.tsx`**

```tsx
"use client";

import Image from "next/image";
import styles from "./AboutCommitment.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutCommitment() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="commitment"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Our Commitment to Your Health</h2>
        <span className={styles.kicker}>Who are we</span>
      </div>
      <div className={styles.wrap}>
        <p className={styles.body}>
          At St. Gianna Medical Group, we are dedicated to providing exceptional healthcare
          services for adults and children. Our experienced team of medical professionals offers
          comprehensive care across various specialties, including cardiology, orthopedics,
          neurology, and more. With state-of-the-art facilities and a patient-centered approach,
          we ensure personalized treatment plans tailored to each individual&apos;s needs. We
          pride ourselves on our compassionate care, same-day appointments, 24/7 booking
          availability, and acceptance of most insurances. Our commitment is to enhance the
          well-being and health of our community, making quality healthcare accessible to all.
          Trust St. Gianna Medical Group for your healthcare needs.
        </p>
        <span className={styles.imageWrap}>
          <Image
            src="/images/photo-doctor-portrait.jpg"
            alt="A St. Gianna Medical Group clinician"
            fill
            className={styles.image}
          />
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/AboutCommitment.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 120px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 120px) clamp(24px, 9vw, 150px);
  transition: opacity .6s ease, transform .6s ease;
}

:global(html.js) .section:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  padding-bottom: 44px;
}

.heading {
  margin: 0;
  max-width: 16ch;
  font-size: clamp(32px, 4.4vw, 62px);
  line-height: 1;
  letter-spacing: -.04em;
  font-weight: 800;
  color: var(--ink);
}

.kicker {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(32px, 4vw, 64px);
  align-items: start;
}

.body {
  margin: 0;
  max-width: 62ch;
  font-size: clamp(17px, 1.55vw, 21px);
  line-height: 1.62;
  color: var(--ink-2);
}

.imageWrap {
  position: relative;
  display: block;
  width: 100%;
  height: 300px;
  border-radius: 200px 200px 20px 20px;
  overflow: hidden;
}

.image {
  object-fit: cover;
}

@media (min-width: 1180px) {
  .wrap {
    grid-template-columns: minmax(0, 1.35fr) 320px;
  }

  .imageWrap {
    height: 420px;
  }
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `npx vitest run components/AboutCommitment.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/AboutCommitment.tsx components/AboutCommitment.module.css components/AboutCommitment.test.tsx
git commit -m "feat: add AboutCommitment section for the About Us page"
```

---

### Task 5: `AboutMission` component

**Files:**
- Create: `components/AboutMission.tsx`
- Create: `components/AboutMission.module.css`
- Test: `components/AboutMission.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal`.
- Produces: default-exported `AboutMission` component, no props. Consumed by `app/about/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `components/AboutMission.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutMission from "./AboutMission";

describe("AboutMission", () => {
  it("renders the mission and vision statements", () => {
    render(<AboutMission />);
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
    expect(screen.getByText("Our Vision")).toBeInTheDocument();
    expect(
      screen.getByText(/provide exceptional, compassionate healthcare to adults/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/leading healthcare provider recognized for excellence/i),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/AboutMission.test.tsx`
Expected: FAIL with "Cannot find module './AboutMission'"

- [ ] **Step 3: Create `components/AboutMission.tsx`**

```tsx
"use client";

import styles from "./AboutMission.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATEMENTS = [
  {
    label: "Our Mission",
    body: "Our mission at St. Gianna Medical Group is to provide exceptional, compassionate healthcare to adults through comprehensive services, advanced medical technology, and a patient-centered approach. We strive to enhance the well-being and quality of life for our community by delivering personalized and accessible healthcare solutions.",
  },
  {
    label: "Our Vision",
    body: "Our vision is to be a leading healthcare provider recognized for excellence in medical care, innovation, and patient satisfaction. We aim to foster a healthy community where everyone has access to the highest standards of medical treatment and preventive care, ensuring a healthier future for all.",
  },
];

export default function AboutMission() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="mission"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.grid}>
        {STATEMENTS.map((statement) => (
          <div key={statement.label} className={styles.column}>
            <span className={styles.kicker}>{statement.label}</span>
            <p className={styles.body}>{statement.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/AboutMission.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  background: var(--bg-2);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  transition: opacity .6s ease, transform .6s ease;
}

:global(html.js) .section:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(28px, 4vw, 64px);
}

.column {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-top: 30px;
  border-top: 1px solid var(--line-2);
}

.kicker {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--link);
}

.body {
  margin: 0;
  max-width: 44ch;
  font-size: clamp(20px, 2.1vw, 28px);
  line-height: 1.35;
  letter-spacing: -.025em;
  font-weight: 600;
  color: var(--ink);
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `npx vitest run components/AboutMission.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/AboutMission.tsx components/AboutMission.module.css components/AboutMission.test.tsx
git commit -m "feat: add AboutMission section for the About Us page"
```

---

### Task 6: `AboutSpecialties` component

**Files:**
- Create: `components/AboutSpecialties.tsx`
- Create: `components/AboutSpecialties.module.css`
- Test: `components/AboutSpecialties.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal`; React `useState`.
- Produces: default-exported `AboutSpecialties` component, no props. Consumed by `app/about/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `components/AboutSpecialties.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutSpecialties from "./AboutSpecialties";

describe("AboutSpecialties", () => {
  it("renders the heading, kicker, and all five specialty rows", () => {
    render(<AboutSpecialties />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/care across/i);
    expect(screen.getByText("Adults & children")).toBeInTheDocument();
    ["Cardiology", "Orthopedics", "Neurology", "Primary care", "Preventive care"].forEach(
      (title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/AboutSpecialties.test.tsx`
Expected: FAIL with "Cannot find module './AboutSpecialties'"

- [ ] **Step 3: Create `components/AboutSpecialties.tsx`**

```tsx
"use client";

import { useState } from "react";
import styles from "./AboutSpecialties.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SPECIALTIES = [
  { title: "Cardiology", body: "Heart health assessment, monitoring and ongoing management." },
  { title: "Orthopedics", body: "Joint, bone and mobility care from injury through recovery." },
  { title: "Neurology", body: "Assessment and management of neurological conditions." },
  {
    title: "Primary care",
    body: "Everyday medicine for adults and children, one continuous chart.",
  },
  {
    title: "Preventive care",
    body: "Physicals, screenings and immunizations that catch problems early.",
  },
];

export default function AboutSpecialties() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [hovered, setHovered] = useState(-1);

  return (
    <section
      id="specialties"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Care across
          <br />
          specialties
        </h2>
        <span className={styles.kicker}>Adults &amp; children</span>
      </div>
      <div className={styles.rows}>
        {SPECIALTIES.map((specialty, i) => {
          const active = hovered === i;
          const dimmed = hovered >= 0 && !active;
          return (
            <div
              key={specialty.title}
              className={`${styles.row} ${active ? styles.rowActive : ""} ${
                dimmed ? styles.rowDimmed : ""
              }`}
              onMouseEnter={() => setHovered(i)}
            >
              <span className={styles.num}>{`0${i + 1}`}</span>
              <span className={styles.title}>{specialty.title}</span>
              <span className={styles.body}>{specialty.body}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/AboutSpecialties.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 120px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 120px) clamp(24px, 9vw, 150px);
  transition: opacity .6s ease, transform .6s ease;
}

:global(html.js) .section:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  padding-bottom: 34px;
}

.heading {
  margin: 0;
  font-size: clamp(32px, 4.4vw, 62px);
  line-height: 1;
  letter-spacing: -.04em;
  font-weight: 800;
  color: var(--ink);
}

.kicker {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.rows {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px 28px;
  padding: 26px 0;
  border-top: 1px solid var(--line);
  transition: padding .4s cubic-bezier(.2, .9, .2, 1), border-color .3s ease;
}

.row:last-child {
  border-bottom: 1px solid var(--line);
}

.rowActive {
  padding: 26px 26px;
  border-color: var(--line-2);
}

.num {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .1em;
  color: var(--muted-2);
  width: 46px;
  flex-shrink: 0;
  transition: color .35s ease;
}

.rowActive .num {
  color: var(--accent);
}

.rowDimmed .num {
  color: var(--dim);
}

.title {
  flex: 1;
  min-width: 220px;
  font-size: clamp(24px, 3.2vw, 44px);
  line-height: 1.04;
  letter-spacing: -.035em;
  font-weight: 700;
  color: var(--ink);
  transition: color .35s ease;
}

.rowDimmed .title {
  color: var(--dim-2);
}

.body {
  max-width: 34ch;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--dim-3);
  transition: color .35s ease;
}

.rowActive .body {
  color: var(--ink-2);
}

.rowDimmed .body {
  color: var(--dim);
}

@media (max-width: 640px) {
  .row {
    align-items: flex-start;
    gap: 10px 16px;
    padding: 20px 0;
  }

  .rowActive {
    padding: 20px 20px;
  }
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `npx vitest run components/AboutSpecialties.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/AboutSpecialties.tsx components/AboutSpecialties.module.css components/AboutSpecialties.test.tsx
git commit -m "feat: add AboutSpecialties section for the About Us page"
```

---

### Task 7: `VolunteerActivismIcon` + `AboutValues` component

**Files:**
- Modify: `components/icons/index.tsx`
- Create: `components/AboutValues.tsx`
- Create: `components/AboutValues.module.css`
- Test: `components/AboutValues.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal`; `BoltIcon`, `ScheduleIcon`, `VerifiedIcon` (existing, from `@/components/icons`); new `VolunteerActivismIcon` (this task).
- Produces: `VolunteerActivismIcon` component (`components/icons/index.tsx`, same `makeIcon(path)` shape as every other icon in the file — usable anywhere via `@/components/icons`). Default-exported `AboutValues` component, no props, consumed by `app/about/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `components/AboutValues.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutValues from "./AboutValues";

describe("AboutValues", () => {
  it("renders the heading and all four value cards", () => {
    render(<AboutValues />);
    expect(
      screen.getByRole("heading", { name: /what patients can count on, every visit/i }),
    ).toBeInTheDocument();
    [
      "Compassionate care",
      "Same-day appointments",
      "24/7 booking",
      "Most insurances accepted",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/AboutValues.test.tsx`
Expected: FAIL with "Cannot find module './AboutValues'"

- [ ] **Step 3: Add `VolunteerActivismIcon` to `components/icons/index.tsx`**

Append this export at the end of `components/icons/index.tsx` (after the existing `AddIcon` export):

```tsx
export const VolunteerActivismIcon = makeIcon(
  "M640-440 474-602q-31-30-52.5-66.5T400-748q0-55 38.5-93.5T532-880q32 0 60 13.5t48 36.5q20-23 48-36.5t60-13.5q55 0 93.5 38.5T880-748q0 43-21 79.5T807-602L640-440Zm0-112 109-107q19-19 35-40.5t16-48.5q0-22-15-37t-37-15q-14 0-26.5 5.5T700-778l-60 72-60-72q-9-11-21.5-16.5T532-800q-22 0-37 15t-15 37q0 27 16 48.5t35 40.5l109 107ZM280-220l278 76 238-74q-5-9-14.5-15.5T760-240H558q-27 0-43-2t-33-8l-93-31 22-78 81 27q17 5 40 8t68 4q0-11-6.5-21T578-354l-234-86h-64v220ZM40-80v-440h304q7 0 14 1.5t13 3.5l235 87q33 12 53.5 42t20.5 66h80q50 0 85 33t35 87v40L560-60l-280-78v58H40Zm80-80h80v-280h-80v280Zm520-546Z",
);
```

- [ ] **Step 4: Create `components/AboutValues.tsx`**

```tsx
"use client";

import styles from "./AboutValues.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { VolunteerActivismIcon, BoltIcon, ScheduleIcon, VerifiedIcon } from "@/components/icons";

const VALUES = [
  {
    icon: VolunteerActivismIcon,
    title: "Compassionate care",
    body: "A team that listens first and treats the person, not just the chart.",
  },
  {
    icon: BoltIcon,
    title: "Same-day appointments",
    body: "Slots held daily so urgent problems are seen without a long wait.",
  },
  {
    icon: ScheduleIcon,
    title: "24/7 booking",
    body: "Online scheduling never closes, and confirmation lands instantly.",
  },
  {
    icon: VerifiedIcon,
    title: "Most insurances accepted",
    body: "Coverage is checked before your visit so costs are clear up front.",
  },
];

export default function AboutValues() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="values"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>What patients can count on, every visit.</h2>
      <div className={styles.grid}>
        {VALUES.map(({ icon: ValueIcon, title, body }) => (
          <div key={title} className={styles.card}>
            <ValueIcon size={30} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `components/AboutValues.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  background: var(--bg-2);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  transition: opacity .6s ease, transform .6s ease;
}

:global(html.js) .section:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.heading {
  margin: 0 0 clamp(40px, 5vw, 64px);
  max-width: 20ch;
  font-size: clamp(30px, 3.8vw, 54px);
  line-height: 1.05;
  letter-spacing: -.038em;
  font-weight: 800;
  color: var(--ink);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0;
}

.card {
  padding: 30px 30px 34px 0;
  margin-right: 30px;
  border-top: 1px solid var(--line-2);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.icon {
  color: var(--link);
}

.title {
  font-size: clamp(20px, 2vw, 26px);
  line-height: 1.1;
  letter-spacing: -.03em;
  font-weight: 800;
  color: var(--ink);
}

.body {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--muted);
}

@media (max-width: 640px) {
  .card {
    margin-right: 0;
    padding-right: 0;
  }
}
```

- [ ] **Step 6: Run the test again to confirm it passes**

Run: `npx vitest run components/AboutValues.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/icons/index.tsx components/AboutValues.tsx components/AboutValues.module.css components/AboutValues.test.tsx
git commit -m "feat: add AboutValues section and VolunteerActivismIcon"
```

---

### Task 8: `AboutLocations` component

**Files:**
- Create: `components/AboutLocations.tsx`
- Create: `components/AboutLocations.module.css`
- Test: `components/AboutLocations.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal`; `CallIcon` (existing, from `@/components/icons`).
- Produces: default-exported `AboutLocations` component, no props. Consumed by `app/about/page.tsx` (Task 9).

- [ ] **Step 1: Write the failing test**

Create `components/AboutLocations.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutLocations from "./AboutLocations";

describe("AboutLocations", () => {
  it("renders all three offices with address and a tel link", () => {
    render(<AboutLocations />);
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /818-308-4100/ })).toHaveAttribute(
      "href",
      "tel:8183084100",
    );
    expect(screen.getByRole("link", { name: /562-941-9853/ })).toHaveAttribute(
      "href",
      "tel:5629419853",
    );
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/AboutLocations.test.tsx`
Expected: FAIL with "Cannot find module './AboutLocations'"

- [ ] **Step 3: Create `components/AboutLocations.tsx`**

```tsx
"use client";

import styles from "./AboutLocations.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CallIcon } from "@/components/icons";

const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd,\nLos Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:8182757006",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd,\nSanta Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:8183084100",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200,\nLa Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:5629419853",
  },
];

export default function AboutLocations() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="locations"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Three doors
          <br />
          across the city
        </h2>
        <span className={styles.kicker}>Get in touch</span>
      </div>
      <div className={styles.grid}>
        {OFFICES.map((office) => (
          <div key={office.name} className={styles.card}>
            <span className={styles.name}>{office.name}</span>
            <span className={styles.address}>{office.address}</span>
            <a href={office.tel} className={styles.phone}>
              <CallIcon size={19} />
              {office.phone}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/AboutLocations.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  transition: opacity .6s ease, transform .6s ease;
}

:global(html.js) .section:not(.revealed) {
  opacity: 0;
  transform: translateY(28px);
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  padding-bottom: 34px;
}

.heading {
  margin: 0;
  font-size: clamp(32px, 4.4vw, 62px);
  line-height: 1;
  letter-spacing: -.04em;
  font-weight: 800;
  color: var(--ink);
}

.kicker {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(18px, 2.2vw, 28px);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(26px, 3vw, 36px);
  border: 1px solid var(--line);
  border-radius: 26px;
  background: var(--bg-2);
}

.name {
  font-size: clamp(22px, 2.2vw, 28px);
  line-height: 1.05;
  letter-spacing: -.03em;
  font-weight: 800;
  color: var(--ink);
}

.address {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--muted);
  white-space: pre-line;
}

.phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 800;
}
```

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `npx vitest run components/AboutLocations.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/AboutLocations.tsx components/AboutLocations.module.css components/AboutLocations.test.tsx
git commit -m "feat: add AboutLocations section for the About Us page"
```

---

### Task 9: `app/about/page.tsx` route

**Files:**
- Create: `app/about/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `BookCta`, `TickerBar`, `Cta`, `Footer`, `BackToTop` (existing, unchanged); `AboutHero`, `AboutCommitment`, `AboutMission`, `AboutSpecialties`, `AboutValues`, `AboutLocations` (Tasks 3-8).
- Produces: the `/about` route. No test file — matching the existing convention (`app/services/page.tsx` has no dedicated test either; its section components are unit-tested individually).

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import AboutHero from "@/components/AboutHero";
import TickerBar from "@/components/TickerBar";
import AboutCommitment from "@/components/AboutCommitment";
import AboutMission from "@/components/AboutMission";
import AboutSpecialties from "@/components/AboutSpecialties";
import AboutValues from "@/components/AboutValues";
import AboutLocations from "@/components/AboutLocations";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "About Us | St. Gianna Medical Group",
  description:
    "Dedicated to providing exceptional healthcare services for adults and children across our Los Angeles clinics.",
};

export default function AboutPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <AboutHero />
      <TickerBar />
      <AboutCommitment />
      <AboutMission />
      <AboutSpecialties />
      <AboutValues />
      <AboutLocations />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
```

- [ ] **Step 2: Run the full test suite to confirm nothing broke**

Run: `npm test`
Expected: PASS (all suites, including the 6 new ones)

- [ ] **Step 3: Run the production build to confirm the route compiles**

Run: `npm run build`
Expected: build succeeds, `/about` listed in the route output

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add /about route composing the About Us page sections"
```

---

### Task 10: Add `DiversityIcon` and wire "About us" into `Nav.tsx`

**Files:**
- Modify: `components/icons/index.tsx`
- Modify: `components/Nav.tsx`
- Test: `components/Nav.test.tsx`

**Interfaces:**
- Consumes: `makeIcon` from `./Icon` (existing).
- Produces: `DiversityIcon` component (`components/icons/index.tsx`), usable anywhere via `@/components/icons`.

- [ ] **Step 1: Update the failing test's expectations first**

Replace the full contents of `components/Nav.test.tsx` with:

```tsx
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

describe("Nav", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders all primary destinations as page-aware anchors", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /about us/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute("href", "/#locations");
    expect(screen.getByRole("link", { name: /call us/i })).toHaveAttribute(
      "href",
      "tel:8183084100",
    );
  });

  it("shows the theme toggle labeled for the current (dark) theme", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /light mode/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/Nav.test.tsx`
Expected: FAIL — no "About us" link yet, and "Call us" still points at the placeholder number.

- [ ] **Step 3: Add `DiversityIcon` to `components/icons/index.tsx`**

Append this export at the end of `components/icons/index.tsx` (after `VolunteerActivismIcon` from Task 7):

```tsx
export const DiversityIcon = makeIcon(
  "M38-428q-18-36-28-73T0-576q0-112 76-188t188-76q63 0 120 26.5t96 73.5q39-47 96-73.5T696-840q112 0 188 76t76 188q0 38-10 75t-28 73q-11-19-26-34t-35-24q9-23 14-45t5-45q0-78-53-131t-131-53q-81 0-124.5 44.5T480-616q-48-56-91.5-100T264-760q-78 0-131 53T80-576q0 23 5 45t14 45q-20 9-35 24t-26 34ZM0-80v-63q0-44 44.5-70.5T160-240q13 0 25 .5t23 2.5q-14 20-21 43t-7 49v65H0Zm240 0v-65q0-65 66.5-105T480-290q108 0 174 40t66 105v65H240Zm540 0v-65q0-26-6.5-49T754-237q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM480-210q-57 0-102 15t-53 35h311q-9-20-53.5-35T480-210Zm-320-70q-33 0-56.5-23.5T80-360q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-280Zm640 0q-33 0-56.5-23.5T720-360q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-280Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-440q0 50-34.5 85T480-320Zm0-160q-17 0-28.5 11.5T440-440q0 17 11.5 28.5T480-400q17 0 28.5-11.5T520-440q0-17-11.5-28.5T480-480Zm0 40Zm1 280Z",
);
```

- [ ] **Step 4: Update `components/Nav.tsx`**

Add `DiversityIcon` to the import from `@/components/icons` (change line 6-17's import block to include it after `HomeIcon`):

```tsx
import {
  HomeIcon,
  DiversityIcon,
  StethoscopeIcon,
  FavoriteIcon,
  NearMeIcon,
  MenuBookIcon,
  HandshakeIcon,
  ChatBubbleIcon,
  CallIcon,
  LightModeIcon,
  DarkModeIcon,
} from "@/components/icons";
```

Update the `items` array (currently lines 23-39) to insert "About us" after "Home" and fix the "Call us" href:

```tsx
  const items = [
    { label: "Home", href: "/", icon: <HomeIcon size={23} />, primary: true },
    { label: "About us", href: "/about", icon: <DiversityIcon size={23} />, primary: true },
    { label: "Services", href: "/services", icon: <StethoscopeIcon size={23} />, primary: true },
    { label: "Why us", href: "/#why", icon: <FavoriteIcon size={23} />, primary: false },
    { label: "Locations", href: "/#locations", icon: <NearMeIcon size={23} />, primary: true },
    { label: "Journal", href: "/#insight", icon: <MenuBookIcon size={23} />, primary: false },
    { label: "Partners", href: "/#partners", icon: <HandshakeIcon size={23} />, primary: false },
    { label: "Contact", href: "/#footer", icon: <ChatBubbleIcon size={23} />, primary: false },
    { label: "Call us", href: "tel:8183084100", icon: <CallIcon size={23} />, primary: true },
    {
      label: theme === "dark" ? "Light mode" : "Dark mode",
      href: "/#top",
      icon: theme === "dark" ? <LightModeIcon size={23} /> : <DarkModeIcon size={23} />,
      primary: true,
      onClick: toggleTheme,
    },
  ];
```

Nothing else in the file changes.

- [ ] **Step 5: Run the test again to confirm it passes**

Run: `npx vitest run components/Nav.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/icons/index.tsx components/Nav.tsx components/Nav.test.tsx
git commit -m "feat: add About us nav item and fix Call us phone number"
```

---

### Task 11: Wire "About us" into `Footer.tsx` and correct its phone numbers

**Files:**
- Modify: `components/Footer.tsx`
- Test: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `Link` from `next/link` (existing import, no change).
- Produces: nothing new (no signature changes).

- [ ] **Step 1: Update the failing test's expectations first**

Replace the full contents of `components/Footer.test.tsx` with:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the tagline, link columns, and contact details", () => {
    render(<Footer />);
    expect(screen.getByRole("img", { name: "St. Gianna Medical Group" })).toBeInTheDocument();
    expect(
      screen.getByText(/pediatric and family healthcare across los angeles/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About us" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    expect(screen.getByRole("link", { name: "Book appointment" })).toHaveAttribute("href", "/#book");
    expect(screen.getByRole("link", { name: /santa monica/i })).toHaveAttribute(
      "href",
      "tel:8183084100",
    );
    expect(screen.getByRole("link", { name: /hollywood/i })).toHaveAttribute(
      "href",
      "tel:8182757006",
    );
    expect(screen.getByRole("link", { name: /la mirada/i })).toHaveAttribute(
      "href",
      "tel:5629419853",
    );
    expect(screen.getByRole("link", { name: "contact@sgmdoctor.com" })).toHaveAttribute(
      "href",
      "mailto:contact@sgmdoctor.com",
    );
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run components/Footer.test.tsx`
Expected: FAIL — no "About us" link yet, and the contact lines are plain text with placeholder numbers, not `tel:` links.

- [ ] **Step 3: Update `components/Footer.tsx`**

Update the "Explore" column (the first `.column` div) to add "About us" before "Services":

```tsx
        <div className={styles.column}>
          <span className={styles.columnHeading}>Explore</span>
          <Link href="/about" className={styles.link}>About us</Link>
          <Link href="/services" className={styles.link}>Services</Link>
          <Link href="/#why" className={styles.link}>Why us</Link>
          <Link href="/#locations" className={styles.link}>Locations</Link>
          <Link href="/#insight" className={styles.link}>Journal</Link>
        </div>
```

Update the "Contact" column (the last `.column` div) to use real numbers as `tel:` links instead of plain `<span>` text:

```tsx
        <div className={styles.column}>
          <span className={styles.columnHeading}>Contact</span>
          <a href="tel:8183084100" className={styles.link}>Santa Monica &middot; 818-308-4100</a>
          <a href="tel:8182757006" className={styles.link}>Hollywood &middot; 818-275-7006</a>
          <a href="tel:5629419853" className={styles.link}>La Mirada &middot; 562-941-9853</a>
          <a href="mailto:contact@sgmdoctor.com" className={styles.emailLink}>
            contact@sgmdoctor.com
          </a>
        </div>
```

Nothing else in the file changes (the brand column, "Patients" column, and bottom row stay as-is).

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `npx vitest run components/Footer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/Footer.tsx components/Footer.test.tsx
git commit -m "feat: add About us footer link and fix clinic phone numbers"
```

---

### Task 12: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: every suite passes, including all 6 new About components and the 4 updated components (`Cta`, `Locations`, `Nav`, `Footer`).

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds; route list includes `/about`.

- [ ] **Step 4: Manual browser verification (per `CLAUDE.md`'s mandatory UI checks)**

Start the dev server (`npm run dev`), then using the Playwright MCP browser tools:
1. Navigate to `http://localhost:3000/about`.
2. Take a snapshot/screenshot at desktop width (≥1180px) — confirm the hero, commitment portrait side-by-side layout, mission columns, specialty rows, value cards, and location cards all render without overlap.
3. Resize to tablet width (~860-1179px) and re-check for overflow/clipping.
4. Resize to mobile width (≤640px) — confirm the commitment section stacks (photo below text), the mission grid single-columns, and the bottom pill nav includes the new "About us" icon.
5. Toggle the theme via the nav's light/dark control and re-check colors on `/about` in light mode (no leftover hardcoded dark colors).
6. Scroll the full page slowly to confirm each new section's scroll-reveal fires correctly.
7. Click the "About us" links in both the Nav and Footer from the homepage (`/`) and confirm they land on `/about`.
8. Click "Book online" on the About page's CTA band and confirm it opens the real NexHealth booking URL (`app.nexhealth.com/appt/ktdoctor?...`), and click "Call us" in the Nav and confirm it's `tel:8183084100`.

No commit for this task — it's a checklist against the already-committed work from Tasks 1-11. If any check fails, fix it in the relevant component's file and re-run that component's test file before re-committing (`git commit --amend` is not appropriate here — make a new small fix commit, per repo convention).

---

## Self-Review Notes

- **Spec coverage:** every section in the design spec (Hero, Commitment, Mission/Vision, Specialties, Values, Locations, Nav/Footer wiring, sitewide data correction, testing) maps to a task above (Tasks 1-2 = data correction, 3-8 = new sections, 9 = route, 10-11 = nav/footer wiring, 12 = verification).
- **Placeholder scan:** no TBDs; every step has literal, complete code — nothing deferred to "later" or described without being shown.
- **Type/name consistency:** `AboutHero`, `AboutCommitment`, `AboutMission`, `AboutSpecialties`, `AboutValues`, `AboutLocations` are named identically in their own task's creation step and in Task 9's import/JSX list. `VolunteerActivismIcon` and `DiversityIcon` are named identically between their `makeIcon` definition and their consuming import. Phone numbers/addresses are copied identically across Tasks 1, 2, 8, 10, and 11 (`818-308-4100` / `tel:8183084100` for Santa Monica everywhere it appears, etc.) — cross-checked against the table in the design spec.
