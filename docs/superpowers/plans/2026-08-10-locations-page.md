# Locations Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `/locations` route on the St. Gianna Medical Group site, matching the supplied Framer export, composed of five new page-specific section components plus the existing sitewide `Nav`/`BookCta`/`TickerBar`/`Cta`/`Footer`/`BackToTop`, and repoint the sitewide "Locations" link to it.

**Architecture:** Follows the exact pattern already used for `/about` and `/services`: a Server Component route (`app/locations/page.tsx`) rendering a fixed sequence of section components, each a `"use client"` component with a co-located CSS Module and test, using the shared `useScrollReveal`/`useParallax` hooks for motion. The map section additionally uses `react-leaflet` + OpenStreetMap tiles, loaded client-only via `next/dynamic` to avoid server-render errors from Leaflet's browser-only code.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Vitest + Testing Library, `react-leaflet` + `leaflet` (new dependencies, approved for this feature).

## Global Constraints

- Every color/background/border in new CSS must use an existing `var(--token)` from `app/globals.css` — no new literal hex/rgb values, **except** where mirroring an already-established repo-wide exception verbatim (the always-dark hero band's `#06161C`/`#fff`/`/images/logo-dark.png`, and the always-dark photo-panel overlay's `#fff`/`rgba(255,255,255,…)` text — both patterns already exist in `AboutHero.module.css` and `Locations.module.css` and are being copied, not invented).
- Mobile-first responsive; reuse the existing `max-width: 640px` breakpoint for mobile overrides (no new breakpoint values).
- All entrance motion goes through `useScrollReveal`; the panels section additionally uses `useParallax` (matching the homepage's `Locations.tsx`). Never bypass the hooks' built-in `prefers-reduced-motion` handling.
- Every new component gets a co-located `ComponentName.module.css` and `ComponentName.test.tsx` (route-level `page.tsx` files are not unit-tested anywhere in this codebase — confirmed by `app/**/*.test.tsx` returning no matches — so `app/locations/page.tsx` gets no test file, consistent with `app/about/page.tsx` and `app/services/page.tsx`).
- New dependencies for this feature only: `leaflet`, `react-leaflet`, `@types/leaflet`.
- Full `npm test` suite must pass and `npm run build` must succeed before the work is done. Manual verification (both themes, mobile/tablet/desktop widths, full-page scroll) happens in the final task.

---

### Task 1: LocationsHero

**Files:**
- Create: `components/LocationsHero.tsx`
- Create: `components/LocationsHero.module.css`
- Test: `components/LocationsHero.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` from `@/hooks/useScrollReveal` (existing).
- Produces: `export default function LocationsHero()` — a zero-prop section component, consumed by `app/locations/page.tsx` in Task 6.

- [ ] **Step 1: Write the failing test**

```tsx
// components/LocationsHero.test.tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsHero from "./LocationsHero";

describe("LocationsHero", () => {
  it("renders the breadcrumb, headline, intro copy, and stats", () => {
    render(<LocationsHero />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/three/i);
    expect(
      screen.getByText(/we are proud to offer our exceptional healthcare services/i),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA offices")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("Booking")).toBeInTheDocument();
    expect(screen.getByText("Same-day")).toBeInTheDocument();
    expect(screen.getByText("Appointments")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/LocationsHero.test.tsx`
Expected: FAIL — `Failed to resolve import "./LocationsHero"`.

- [ ] **Step 3: Write the CSS module**

```css
/* components/LocationsHero.module.css */
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

- [ ] **Step 4: Write the component**

```tsx
// components/LocationsHero.tsx
"use client";

import Link from "next/link";
import styles from "./LocationsHero.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATS = [
  { n: "3", l: "LA offices" },
  { n: "24/7", l: "Booking" },
  { n: "Same-day", l: "Appointments" },
];

export default function LocationsHero() {
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
          / Locations
        </span>
        <h1 className={styles.headline}>
          Three
          <br />
          <span className={styles.headlineItalic}>locations.</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            We are proud to offer our exceptional healthcare services at three convenient
            locations. Whether you are in Hollywood, Santa Monica, or La Mirada, you can count on
            St. Gianna Medical Group for top-quality medical care.
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

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- components/LocationsHero.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/LocationsHero.tsx components/LocationsHero.module.css components/LocationsHero.test.tsx
git commit -m "feat: add Locations page hero section"
```

---

### Task 2: LocationsPanels

**Files:**
- Create: `components/LocationsPanels.tsx`
- Create: `components/LocationsPanels.module.css`
- Test: `components/LocationsPanels.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal`, `useParallax` (existing hooks); `CallIcon`, `NearMeIcon` from `@/components/icons` (existing).
- Produces: `export default function LocationsPanels()` — a zero-prop section component, consumed by `app/locations/page.tsx` in Task 6.

- [ ] **Step 1: Write the failing test**

```tsx
// components/LocationsPanels.test.tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsPanels from "./LocationsPanels";

describe("LocationsPanels", () => {
  it("renders all three offices with address and working call/directions links", () => {
    render(<LocationsPanels />);
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /818-275-7006/ })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getAllByRole("link", { name: /directions/i })[0]).toHaveAttribute(
      "href",
      "https://maps.google.com/?q=5255+W+Sunset+Blvd,+Los+Angeles,+CA+90027",
    );
    expect(screen.getAllByText("Open now")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/LocationsPanels.test.tsx`
Expected: FAIL — `Failed to resolve import "./LocationsPanels"`.

- [ ] **Step 3: Write the CSS module**

```css
/* components/LocationsPanels.module.css */
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
  max-width: 20ch;
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

.panels {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 480px;
}

.panel {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  min-width: 220px;
  min-height: 480px;
  display: flex;
  align-items: flex-end;
  flex: 1;
  transition: flex .55s cubic-bezier(.2, .9, .2, 1);
}

.panelActive {
  flex: 3.2;
}

.imageLayer {
  position: absolute;
  left: 0;
  right: 0;
  top: -24px;
  bottom: -24px;
}

.image {
  opacity: .5;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(6, 22, 28, .15), rgba(6, 22, 28, .55) 45%, rgba(6, 22, 28, .93));
}

.status {
  position: absolute;
  top: 26px;
  left: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(79, 195, 194, .2);
  pointer-events: none;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--italic-highlight);
}

.statusDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--link);
}

.body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(22px, 2.6vw, 32px);
  width: 100%;
  color: #fff;
}

.name {
  font-size: clamp(26px, 2.8vw, 38px);
  line-height: 1.02;
  letter-spacing: -.035em;
  font-weight: 800;
}

.detail {
  display: block;
  overflow: hidden;
  transition: opacity .35s ease, max-height .5s ease;
  opacity: 0;
  max-height: 0;
}

.detailVisible {
  opacity: 1;
  max-height: 220px;
}

.address {
  display: block;
  font-size: 14.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, .76);
  white-space: pre-line;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.callLink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  background: #fff;
  color: #06161C;
  font-size: 14.5px;
  font-weight: 800;
}

.callLink:hover {
  background: var(--link);
  color: #06161C;
}

.directionsLink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .32);
  color: #fff;
  font-size: 14.5px;
  font-weight: 800;
}

.directionsLink:hover {
  background: rgba(255, 255, 255, .12);
}

@media (max-width: 640px) {
  .panels {
    min-height: 0;
  }

  .panel {
    min-width: 100%;
    min-height: 320px;
    flex: 1 !important;
  }

  .detail {
    opacity: 1;
    max-height: 220px;
  }
}
```

- [ ] **Step 4: Write the component**

```tsx
// components/LocationsPanels.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./LocationsPanels.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import { CallIcon, NearMeIcon } from "@/components/icons";

const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd,\nLos Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
    map: "https://maps.google.com/?q=5255+W+Sunset+Blvd,+Los+Angeles,+CA+90027",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd,\nSanta Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
    map: "https://maps.google.com/?q=2221+Lincoln+Blvd,+Santa+Monica,+CA+90405",
    image: "/images/photo-hospital-hallway.jpg",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200,\nLa Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
    map: "https://maps.google.com/?q=12675+La+Mirada+Blvd+200,+La+Mirada,+CA+90638",
    image: "/images/photo-pediatric-checkup.jpg",
  },
];

export default function LocationsPanels() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(0.08, 24);
  const [active, setActive] = useState(0);

  return (
    <section
      id="offices"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>Serving Hollywood, Santa Monica, and La Mirada</h2>
        <span className={styles.kicker}>Our offices</span>
      </div>
      <div className={styles.panels} ref={parallaxRef} onMouseLeave={() => setActive(0)}>
        {OFFICES.map((office, i) => (
          <div
            key={office.name}
            className={`${styles.panel} ${active === i ? styles.panelActive : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
              <Image
                src={office.image}
                alt={`${office.name} clinic`}
                fill
                className={styles.image}
              />
            </div>
            <span className={styles.overlay} />
            <span className={styles.status}>
              <span className={styles.statusDot} />
              Open now
            </span>
            <div className={styles.body}>
              <span className={styles.name}>{office.name}</span>
              <div className={`${styles.detail} ${active === i ? styles.detailVisible : ""}`}>
                <span className={styles.address}>{office.address}</span>
                <span className={styles.actions}>
                  <a href={office.tel} className={styles.callLink}>
                    <CallIcon size={18} />
                    {office.phone}
                  </a>
                  <a
                    href={office.map}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.directionsLink}
                  >
                    <NearMeIcon size={18} />
                    Directions
                  </a>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- components/LocationsPanels.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/LocationsPanels.tsx components/LocationsPanels.module.css components/LocationsPanels.test.tsx
git commit -m "feat: add Locations page office panels section"
```

---

### Task 3: LocationsMap

**Files:**
- Modify: `package.json` (add `leaflet`, `react-leaflet` dependencies; `@types/leaflet` devDependency)
- Create: `components/LocationsMapView.tsx`
- Create: `components/LocationsMap.tsx`
- Create: `components/LocationsMap.module.css`
- Test: `components/LocationsMap.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` (existing hook).
- Produces: `export type MapOffice = { name: string; address: string; lat: number; lng: number }` and `export default function LocationsMapView({ offices, focusedIndex }: { offices: MapOffice[]; focusedIndex: number })` from `LocationsMapView.tsx`, consumed only by `LocationsMap.tsx` in this same task. `export default function LocationsMap()` — a zero-prop section component, consumed by `app/locations/page.tsx` in Task 6.

- [ ] **Step 1: Install dependencies**

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

- [ ] **Step 2: Write the failing test**

The real `react-leaflet`/Leaflet DOM rendering is mocked out — it's a third-party mapping library, not something this codebase's tests should exercise against jsdom. The mock lets the test assert the actual behavior this component owns: one chip per office, and clicking a chip switches which office is focused.

```tsx
// components/LocationsMap.test.tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LocationsMap from "./LocationsMap";

vi.mock("./LocationsMapView", () => ({
  default: ({
    offices,
    focusedIndex,
  }: {
    offices: { name: string }[];
    focusedIndex: number;
  }) => <div>Focused: {offices[focusedIndex].name}</div>,
}));

describe("LocationsMap", () => {
  it("renders a chip per office and switches focus on click", async () => {
    render(<LocationsMap />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/find us on/i);
    expect(await screen.findByText("Focused: Hollywood")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Santa Monica" }));
    expect(await screen.findByText("Focused: Santa Monica")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- components/LocationsMap.test.tsx`
Expected: FAIL — `Failed to resolve import "./LocationsMap"`.

- [ ] **Step 4: Write the CSS module**

```css
/* components/LocationsMap.module.css */
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

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 11px 18px;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -.005em;
  color: var(--ink-2);
  transition: background .3s ease, color .3s ease, border-color .3s ease;
}

.chipActive {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
}

.mapFrame {
  position: relative;
  height: clamp(360px, 52vh, 560px);
  border: 1px solid var(--line);
  border-radius: 26px;
  overflow: hidden;
  background: var(--bg-2);
}
```

- [ ] **Step 5: Write the map view component**

```tsx
// components/LocationsMapView.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapOffice = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

function FocusHandler({ office }: { office: MapOffice }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([office.lat, office.lng], 14, { duration: 0.8 });
  }, [map, office]);
  return null;
}

export default function LocationsMapView({
  offices,
  focusedIndex,
}: {
  offices: MapOffice[];
  focusedIndex: number;
}) {
  const focused = offices[focusedIndex];

  return (
    <MapContainer
      center={[focused.lat, focused.lng]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {offices.map((office) => (
        <Marker key={office.name} position={[office.lat, office.lng]}>
          <Popup>
            <strong>{office.name}</strong>
            <br />
            {office.address}
          </Popup>
        </Marker>
      ))}
      <FocusHandler office={focused} />
    </MapContainer>
  );
}
```

- [ ] **Step 6: Write the map section component**

```tsx
// components/LocationsMap.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./LocationsMap.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { MapOffice } from "./LocationsMapView";

const LocationsMapView = dynamic(() => import("./LocationsMapView"), { ssr: false });

const OFFICES: MapOffice[] = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd, Los Angeles, CA 90027",
    lat: 34.0981967,
    lng: -118.3045711,
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd, Santa Monica, CA 90405",
    lat: 34.0025873,
    lng: -118.4703697,
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200, La Mirada, CA 90638",
    lat: 33.9161889,
    lng: -118.0124715,
  },
];

export default function LocationsMap() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [focusedIndex, setFocusedIndex] = useState(0);

  return (
    <section
      id="map"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Find us on
          <br />
          the map
        </h2>
        <span className={styles.chips}>
          {OFFICES.map((office, i) => (
            <button
              key={office.name}
              type="button"
              className={`${styles.chip} ${i === focusedIndex ? styles.chipActive : ""}`}
              onClick={() => setFocusedIndex(i)}
            >
              {office.name}
            </button>
          ))}
        </span>
      </div>
      <div className={styles.mapFrame}>
        <LocationsMapView offices={OFFICES} focusedIndex={focusedIndex} />
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test -- components/LocationsMap.test.tsx`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json components/LocationsMapView.tsx components/LocationsMap.tsx components/LocationsMap.module.css components/LocationsMap.test.tsx
git commit -m "feat: add Locations page map section with OpenStreetMap/Leaflet"
```

---

### Task 4: LocationsDetails

**Files:**
- Create: `components/LocationsDetails.tsx`
- Create: `components/LocationsDetails.module.css`
- Test: `components/LocationsDetails.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` (existing hook); `CallIcon` from `@/components/icons` (existing).
- Produces: `export default function LocationsDetails()` — a zero-prop section component, consumed by `app/locations/page.tsx` in Task 6.

- [ ] **Step 1: Write the failing test**

```tsx
// components/LocationsDetails.test.tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsDetails from "./LocationsDetails";

describe("LocationsDetails", () => {
  it("renders the heading and all three office rows with tel links", () => {
    render(<LocationsDetails />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/addresses and/i);
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /818-275-7006/ })).toHaveAttribute(
      "href",
      "tel:+18182757006",
    );
    expect(screen.getByRole("link", { name: /562-941-9853/ })).toHaveAttribute(
      "href",
      "tel:+15629419853",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/LocationsDetails.test.tsx`
Expected: FAIL — `Failed to resolve import "./LocationsDetails"`.

- [ ] **Step 3: Write the CSS module**

```css
/* components/LocationsDetails.module.css */
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
  font-size: clamp(30px, 3.8vw, 54px);
  line-height: 1.05;
  letter-spacing: -.038em;
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

.name {
  flex: 1;
  min-width: 180px;
  font-size: clamp(22px, 2.6vw, 34px);
  line-height: 1.04;
  letter-spacing: -.035em;
  font-weight: 700;
  color: var(--ink);
  transition: color .35s ease;
}

.rowDimmed .name {
  color: var(--dim-2);
}

.address {
  min-width: 220px;
  max-width: 32ch;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--muted);
  white-space: pre-line;
  transition: color .35s ease;
}

.rowDimmed .address {
  color: var(--dim);
}

.phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
  color: var(--ink);
  transition: color .35s ease;
}

.rowActive .phone {
  color: var(--accent);
}

.rowDimmed .phone {
  color: var(--dim-2);
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

- [ ] **Step 4: Write the component**

```tsx
// components/LocationsDetails.tsx
"use client";

import { useState } from "react";
import styles from "./LocationsDetails.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CallIcon } from "@/components/icons";

const OFFICES = [
  {
    name: "Hollywood",
    address: "5255 W Sunset Blvd,\nLos Angeles, CA 90027",
    phone: "818-275-7006",
    tel: "tel:+18182757006",
  },
  {
    name: "Santa Monica",
    address: "2221 Lincoln Blvd,\nSanta Monica, CA 90405",
    phone: "818-308-4100",
    tel: "tel:+18183084100",
  },
  {
    name: "La Mirada",
    address: "12675 La Mirada Blvd, #200,\nLa Mirada, CA 90638",
    phone: "562-941-9853",
    tel: "tel:+15629419853",
  },
];

export default function LocationsDetails() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const [hovered, setHovered] = useState(-1);

  return (
    <section
      id="details"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Addresses and
          <br />
          phone numbers
        </h2>
        <span className={styles.kicker}>Get in touch</span>
      </div>
      <div className={styles.rows}>
        {OFFICES.map((office, i) => {
          const active = hovered === i;
          const dimmed = hovered >= 0 && !active;
          return (
            <div
              key={office.name}
              className={`${styles.row} ${active ? styles.rowActive : ""} ${
                dimmed ? styles.rowDimmed : ""
              }`}
              onMouseEnter={() => setHovered(i)}
            >
              <span className={styles.num}>{`0${i + 1}`}</span>
              <span className={styles.name}>{office.name}</span>
              <span className={styles.address}>{office.address}</span>
              <a href={office.tel} className={styles.phone}>
                <CallIcon size={19} />
                {office.phone}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- components/LocationsDetails.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/LocationsDetails.tsx components/LocationsDetails.module.css components/LocationsDetails.test.tsx
git commit -m "feat: add Locations page address/phone details section"
```

---

### Task 5: LocationsNotes (+ SupportAgentIcon)

**Files:**
- Modify: `components/icons/index.tsx` (add `SupportAgentIcon`)
- Modify: `components/icons/index.test.tsx:16` (icon count 27 → 28)
- Create: `components/LocationsNotes.tsx`
- Create: `components/LocationsNotes.module.css`
- Test: `components/LocationsNotes.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` (existing hook); `SyncAltIcon`, `BoltIcon`, `VerifiedUserIcon` (existing icons) and `SupportAgentIcon` (new, added in this task) from `@/components/icons`.
- Produces: `export const SupportAgentIcon` added to `@/components/icons`, consumed only within this task. `export default function LocationsNotes()` — a zero-prop section component, consumed by `app/locations/page.tsx` in Task 6.

- [ ] **Step 1: Write the failing tests**

```tsx
// components/LocationsNotes.test.tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsNotes from "./LocationsNotes";

describe("LocationsNotes", () => {
  it("renders the heading and all four notes", () => {
    render(<LocationsNotes />);
    expect(
      screen.getByRole("heading", { name: /the same care at whichever door you use/i }),
    ).toBeInTheDocument();
    [
      "One chart, everywhere",
      "Same-day appointments",
      "24-hour assistance",
      "Most insurances accepted",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });
});
```

Update the existing icon-count assertion in `components/icons/index.test.tsx`:

```tsx
// components/icons/index.test.tsx (line 16)
  it("has exactly 28 icons", () => {
    expect(Object.keys(Icons)).toHaveLength(28);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/LocationsNotes.test.tsx components/icons/index.test.tsx`
Expected: `LocationsNotes.test.tsx` FAILS — `Failed to resolve import "./LocationsNotes"`. `icons/index.test.tsx` FAILS — expected length 28, received 27.

- [ ] **Step 3: Add the new icon**

Append to `components/icons/index.tsx`:

```tsx
export const SupportAgentIcon = makeIcon(
  "M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440Zm-80-280q-17 0-28.5-11.5T320-440q0-17 11.5-28.5T360-480q17 0 28.5 11.5T400-440q0 17-11.5 28.5T360-400Zm240 0q-17 0-28.5-11.5T560-440q0-17 11.5-28.5T600-480q17 0 28.5 11.5T640-440q0 17-11.5 28.5T600-400Zm-359-62q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z",
);
```

- [ ] **Step 4: Write the CSS module**

```css
/* components/LocationsNotes.module.css */
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
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 30px 28px 34px 0;
  border-top: 1px solid var(--line-2);
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
    padding-right: 0;
  }
}
```

- [ ] **Step 5: Write the component**

```tsx
// components/LocationsNotes.tsx
"use client";

import styles from "./LocationsNotes.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SyncAltIcon, BoltIcon, SupportAgentIcon, VerifiedUserIcon } from "@/components/icons";

const NOTES = [
  {
    icon: SyncAltIcon,
    title: "One chart, everywhere",
    body: "Your record is live at whichever office you walk into, so any clinician can pick up where the last visit left off.",
  },
  {
    icon: BoltIcon,
    title: "Same-day appointments",
    body: "Each office holds slots daily for urgent problems, bookable online or by phone.",
  },
  {
    icon: SupportAgentIcon,
    title: "24-hour assistance",
    body: "Booking and help are available around the clock, not only during office hours.",
  },
  {
    icon: VerifiedUserIcon,
    title: "Most insurances accepted",
    body: "Coverage is verified before your visit so costs are clear at check-in.",
  },
];

export default function LocationsNotes() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="visit"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>The same care at whichever door you use.</h2>
      <div className={styles.grid}>
        {NOTES.map(({ icon: NoteIcon, title, body }) => (
          <div key={title} className={styles.card}>
            <NoteIcon size={30} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test -- components/LocationsNotes.test.tsx components/icons/index.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add components/icons/index.tsx components/icons/index.test.tsx components/LocationsNotes.tsx components/LocationsNotes.module.css components/LocationsNotes.test.tsx
git commit -m "feat: add Locations page visit-notes section and support_agent icon"
```

---

### Task 6: `/locations` route

**Files:**
- Create: `app/locations/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `BookCta`, `TickerBar`, `Cta`, `Footer`, `BackToTop` (existing sitewide components); `LocationsHero`, `LocationsPanels`, `LocationsMap`, `LocationsDetails`, `LocationsNotes` (from Tasks 1–5).
- Produces: the `/locations` route itself. No exports consumed elsewhere.

- [ ] **Step 1: Write the route**

```tsx
// app/locations/page.tsx
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BookCta from "@/components/BookCta";
import LocationsHero from "@/components/LocationsHero";
import TickerBar from "@/components/TickerBar";
import LocationsPanels from "@/components/LocationsPanels";
import LocationsMap from "@/components/LocationsMap";
import LocationsDetails from "@/components/LocationsDetails";
import LocationsNotes from "@/components/LocationsNotes";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Locations | St. Gianna Medical Group",
  description:
    "Find St. Gianna Medical Group's three Los Angeles-area offices in Hollywood, Santa Monica, and La Mirada, with addresses, phone numbers, and directions.",
};

export default function LocationsPage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <BookCta />
      <LocationsHero />
      <TickerBar />
      <LocationsPanels />
      <LocationsMap />
      <LocationsDetails />
      <LocationsNotes />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
```

- [ ] **Step 2: Run the full test suite and the build**

Run: `npm test`
Expected: PASS (all suites, including Tasks 1–5's new tests).

Run: `npm run build`
Expected: build succeeds, `/locations` listed among the generated routes.

- [ ] **Step 3: Commit**

```bash
git add app/locations/page.tsx
git commit -m "feat: add /locations route composing all section components"
```

---

### Task 7: Repoint sitewide Locations link

**Files:**
- Modify: `components/Nav.tsx:29`
- Modify: `components/Footer.tsx:24`
- Modify: `components/Nav.test.tsx:16`
- Modify: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed elsewhere — this is the final wiring step.

- [ ] **Step 1: Update the failing tests**

```tsx
// components/Nav.test.tsx (line 16)
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute("href", "/locations");
```

Add a new assertion to `components/Footer.test.tsx` (inside the existing `it` block, after the "Services" link assertion):

```tsx
    expect(screen.getByRole("link", { name: "Locations" })).toHaveAttribute("href", "/locations");
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- components/Nav.test.tsx components/Footer.test.tsx`
Expected: `Nav.test.tsx` FAILS — received `/#locations`, expected `/locations`. `Footer.test.tsx` FAILS — no link found with name "Locations" and href `/locations` (link currently has href `/#locations`).

- [ ] **Step 3: Update Nav.tsx**

```tsx
// components/Nav.tsx (line 29)
    { label: "Locations", href: "/locations", icon: <NearMeIcon size={23} />, primary: true },
```

- [ ] **Step 4: Update Footer.tsx**

```tsx
// components/Footer.tsx (line 24)
          <Link href="/locations" className={styles.link}>Locations</Link>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- components/Nav.test.tsx components/Footer.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/Nav.tsx components/Footer.tsx components/Nav.test.tsx components/Footer.test.tsx
git commit -m "feat: repoint sitewide Locations link to the new /locations page"
```

---

### Task 8: Final verification

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: every suite passes, including all new and modified tests from Tasks 1–7.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type or lint errors, `/locations` appears in the route output.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual verification in a running dev server**

Run: `npm run dev`, then in a browser visit `http://localhost:3000/locations` and check:
- Dark theme (default) and light theme (toggle via the nav's light/dark control): hero, panels, map, details, and notes sections all render with correct tokens, no unstyled or invisible text.
- Mobile (≤640px), tablet (859–1179px), and desktop (≥1180px) widths: no overflow, clipping, or overlap in the hero stats row, the panels, the map chips, or the details rows.
- Scroll the full page top to bottom: every section's scroll-reveal fade/slide-in fires at the expected point, matching the timing of other pages (`/about`, `/services`).
- Click each of the three map chips and confirm the map pans/zooms to the corresponding office and its marker popup shows the right name and address.
- Click a panel's "Directions" link and confirm it opens the correct Google Maps search in a new tab; click a phone number and confirm the `tel:` link.
- From the homepage and any other page, click "Locations" in both the nav and the footer and confirm both land on `/locations`.

- [ ] **Step 5: No commit for this task** — verification only, nothing to stage.
