# St. Gianna Medical Group Homepage Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/source-template.html` (the decoded prototype) as a production Next.js homepage that renders pixel-identical to the source on desktop, adds real dark/light theming, scroll-reveal + parallax motion, a Back to Top button, and responsive layouts the source never had.

**Architecture:** Next.js 14 App Router + TypeScript. One React component per homepage section, each with a co-located CSS Module. Two small hooks (`useTheme`, `useScrollReveal`) carry all the interactive behavior; components stay declarative. Icons are individual inline-SVG React components sourced from the official `@material-symbols/svg-400` package (verified real paths, not hand-drawn). All media (logo x2, 5 photos, 1 video) is already extracted to `docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/` and just needs copying into `public/`.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, CSS Modules, Vitest + @testing-library/react for hook/smoke tests, `next/font/google` for Hanken Grotesk, `@material-symbols/svg-400` (dev-time source of icon paths only, not shipped as a runtime dependency).

## Global Constraints

- **Exact visual fidelity on desktop (>=1024px):** every color, spacing value, font size, and copy string must match `docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/source-template.html` exactly. When a task gives a pixel/color value, it was copied from that file — do not approximate.
- **Mobile/tablet layouts are new work**, not a fidelity target — the source has zero `@media` queries. Adapt sensibly using the same colors, type scale, radii, and motion language. Where a task calls out a mobile simplification versus the source's internal (JS-width-based) mobile branch, that's intentional; follow the task's CSS, not the source's JS.
- **No em dash (`—`) anywhere** — copy, code, comments, commit messages. Use a comma or period instead.
- **No remote asset URLs.** Every image/video is a local file already staged in `docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/`. The font is self-hosted via `next/font/google` (downloaded at build time, no runtime request to Google).
- **Dark theme is the default** on first visit; the toggle persists to `localStorage` under the key `sgm-theme`.
- Commit after every task.

---

### Task 1: Scaffold the Next.js project and stage real assets

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `next-env.d.ts` (via `create-next-app`)
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (placeholder content, overwritten in later tasks)
- Create: `public/images/logo-dark.png`, `public/images/logo-light.png`, `public/images/photo-doctor-portrait.jpg`, `public/images/photo-hospital-hallway.jpg`, `public/images/photo-pediatric-checkup.jpg`, `public/images/photo-physical-therapy.jpg`, `public/images/photo-counseling-session.jpg`
- Create: `public/videos/hero.mp4`

**Interfaces:**
- Produces: a runnable Next.js app (`npm run dev`, `npm run build`) that later tasks add components to.

- [ ] **Step 1: Scaffold Next.js with TypeScript, App Router, no Tailwind**

Run from `C:\dev\st-gianna`:

```bash
npx --yes create-next-app@latest . --typescript --eslint --no-tailwind --app --no-src-dir --import-alias "@/*" --use-npm --no-git
```

If it prompts interactively despite the flags, accept the defaults matching: TypeScript yes, ESLint yes, Tailwind no, `app/` router yes, `src/` directory no, import alias `@/*`.

- [ ] **Step 2: Add test tooling**

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Add to `package.json` `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 3: Copy the extracted real media into `public/`**

```bash
mkdir -p public/images public/videos
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/logo-dark-theme.png" public/images/logo-dark.png
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/logo-light-theme.png" public/images/logo-light.png
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/photo-doctor-portrait.jpg" public/images/photo-doctor-portrait.jpg
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/photo-hospital-hallway.jpg" public/images/photo-hospital-hallway.jpg
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/photo-pediatric-checkup.jpg" public/images/photo-pediatric-checkup.jpg
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/photo-physical-therapy.jpg" public/images/photo-physical-therapy.jpg
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/photo-counseling-session.jpg" public/images/photo-counseling-session.jpg
cp "docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/media/hero-background.mp4" public/videos/hero.mp4
```

- [ ] **Step 4: Verify the scaffold builds**

Run: `npm run build`
Expected: build succeeds with the default `create-next-app` starter page (it will be replaced in Task 16).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js app and stage real extracted media assets"
```

---

### Task 2: Global theme CSS, fonts, and theme-flash-safe root layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/GooFilter.tsx`

**Interfaces:**
- Produces: CSS variables `--bg`, `--bg-2`, `--ink`, `--ink-2`, `--muted`, `--muted-2`, `--dim`, `--dim-2`, `--dim-3`, `--line`, `--line-2`, `--pill`, `--on-accent`, `--accent`, `--link`, `--link-hover`, `--italic-highlight`, usable by every later component's CSS Module. Keyframes `slowZoom`, `scrollHint`, `livePulse`, `marquee`. A `<html data-theme="dark">` attribute set before paint.
- Consumes: nothing.

- [ ] **Step 1: Write `app/globals.css`**

```css
* {
  box-sizing: border-box;
}

:root {
  --bg: #06161C;
  --bg-2: #0B2229;
  --ink: #EAF4F3;
  --ink-2: #C6D9D9;
  --muted: #9FB6B8;
  --muted-2: #6E8F92;
  --dim: #3C555A;
  --dim-2: #54706F;
  --dim-3: #7E9A9B;
  --line: rgba(255, 255, 255, .09);
  --line-2: rgba(255, 255, 255, .2);
  --pill: rgba(15, 39, 50, .92);
  --on-accent: #06161C;
  --accent: #0FA3A3;
  --link: #4FC3C2;
  --link-hover: #9BE7E5;
  --italic-highlight: #7AD5D5;
}

html[data-theme="light"] {
  --bg: #F5F8F7;
  --bg-2: #FFFFFF;
  --ink: #0A2540;
  --ink-2: #33474A;
  --muted: #5A6C6C;
  --muted-2: #6E8080;
  --dim: #B7C6C6;
  --dim-2: #93A6A6;
  --dim-3: #7E9A9B;
  --line: rgba(10, 37, 64, .12);
  --line-2: rgba(10, 37, 64, .26);
  --pill: rgba(255, 255, 255, .94);
  --on-accent: #06161C;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  transition: background .3s ease, color .3s ease;
}

a {
  color: var(--link);
  text-decoration: none;
}

a:hover {
  color: var(--link-hover);
}

button {
  font-family: inherit;
}

@keyframes slowZoom {
  0% { transform: scale(1.04); }
  100% { transform: scale(1.16); }
}

@keyframes scrollHint {
  0% { transform: translateY(0); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(16px); opacity: 0; }
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .25; }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes revealUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Create the goo filter component**

`components/GooFilter.tsx`:

```tsx
export default function GooFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}
```

- [ ] **Step 3: Write `app/layout.tsx` with the Hanken Grotesk font and a pre-hydration theme script**

```tsx
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import GooFilter from "@/components/GooFilter";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "St. Gianna Medical Group",
  description:
    "Pediatric and family healthcare across Los Angeles. Same-day, telehealth, after hours.",
};

const THEME_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("sgm-theme");
    document.documentElement.dataset.theme = stored === "light" ? "light" : "dark";
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={hankenGrotesk.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body style={{ fontFamily: "var(--font-hanken-grotesk), system-ui, sans-serif" }}>
        <GooFilter />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx components/GooFilter.tsx
git commit -m "Add theme CSS variables, keyframes, goo filter, and Hanken Grotesk font"
```

---

### Task 3: `useTheme` hook (TDD)

**Files:**
- Create: `hooks/useTheme.ts`
- Test: `hooks/useTheme.test.tsx`

**Interfaces:**
- Produces: `useTheme(): { theme: "dark" | "light"; toggleTheme: () => void }`. Reads/writes `localStorage["sgm-theme"]` and `document.documentElement.dataset.theme`.
- Consumes: nothing.

- [ ] **Step 1: Write the failing test**

`hooks/useTheme.test.tsx`:

```tsx
import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark when nothing is stored", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("reads a previously stored light theme on mount", () => {
    window.localStorage.setItem("sgm-theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("toggleTheme flips the theme, updates the DOM attribute, and persists it", () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("sgm-theme")).toBe("light");
  });

  it("toggleTheme flips back to dark on a second call", () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.toggleTheme();
    });
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");
    expect(window.localStorage.getItem("sgm-theme")).toBe("dark");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- hooks/useTheme.test.tsx`
Expected: FAIL, `useTheme` module not found.

- [ ] **Step 3: Implement `hooks/useTheme.ts`**

```ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "sgm-theme";

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return { theme, toggleTheme };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- hooks/useTheme.test.tsx`
Expected: PASS, all 4 tests.

- [ ] **Step 5: Commit**

```bash
git add hooks/useTheme.ts hooks/useTheme.test.tsx
git commit -m "Add useTheme hook with persisted dark/light state"
```

---

### Task 4: `useScrollReveal` and `useParallax` hooks (TDD)

**Files:**
- Create: `hooks/useScrollReveal.ts`
- Test: `hooks/useScrollReveal.test.tsx`
- Create: `hooks/useParallax.ts`
- Test: `hooks/useParallax.test.tsx`

**Interfaces:**
- Produces: `useScrollReveal<T extends HTMLElement>(): { ref: RefObject<T>; revealed: boolean }`. `revealed` flips to `true` the first time the referenced element intersects the viewport, and stays `true` afterward. Immediately `true` if `prefers-reduced-motion: reduce` or `IntersectionObserver` is unavailable.
- Produces: `useParallax<T extends HTMLElement>(speed?: number, max?: number): { ref: RefObject<T>; offset: number }`. `offset` is `(viewportCenter - elementCenter) * speed`, clamped to `[-max, max]`, recomputed on scroll. Always `0` if `prefers-reduced-motion: reduce`. Used by Locations (Task 11) and Partners (Task 12) for their photo parallax drift.
- Consumes: nothing.

- [ ] **Step 1: Write the failing test**

`hooks/useScrollReveal.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { useScrollReveal } from "./useScrollReveal";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function Probe() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}>{revealed ? "revealed" : "hidden"}</div>;
}

describe("useScrollReveal", () => {
  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    window.matchMedia =
      window.matchMedia ||
      ((query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      })) as typeof window.matchMedia;
  });

  it("starts hidden and reveals once the element intersects the viewport", () => {
    const { getByText } = render(<Probe />);
    expect(getByText("hidden")).toBeInTheDocument();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger(true);

    expect(getByText("revealed")).toBeInTheDocument();
  });

  it("disconnects the observer after the first reveal", () => {
    render(<Probe />);
    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger(true);
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- hooks/useScrollReveal.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `hooks/useScrollReveal.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- hooks/useScrollReveal.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Write the failing test for `useParallax`**

`hooks/useParallax.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { useParallax } from "./useParallax";

function Probe({ speed = 0.5, max = 40 }: { speed?: number; max?: number }) {
  const { ref, offset } = useParallax<HTMLDivElement>(speed, max);
  return <div ref={ref} data-testid="target">{offset}</div>;
}

describe("useParallax", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is zero when the element's center matches the viewport center", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 350,
      height: 100,
      bottom: 450,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 350,
      toJSON: () => ({}),
    } as DOMRect);

    const { getByTestId } = render(<Probe speed={0.5} max={40} />);
    expect(Number(getByTestId("target").textContent)).toBe(0);
  });

  it("clamps the offset to the configured max", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: -2000,
      height: 100,
      bottom: -1900,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: -2000,
      toJSON: () => ({}),
    } as DOMRect);

    const { getByTestId } = render(<Probe speed={0.5} max={40} />);
    expect(Number(getByTestId("target").textContent)).toBe(40);
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- hooks/useParallax.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 7: Implement `hooks/useParallax.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useParallax<T extends HTMLElement>(speed = 0.12, max = 40) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setOffset(0);
      return;
    }

    const clamp = (value: number) => Math.max(-max, Math.min(max, value));

    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      setOffset(clamp((viewportCenter - elementCenter) * speed));
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed, max]);

  return { ref, offset };
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- hooks/useParallax.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 9: Commit**

```bash
git add hooks/useScrollReveal.ts hooks/useScrollReveal.test.tsx hooks/useParallax.ts hooks/useParallax.test.tsx
git commit -m "Add useScrollReveal and useParallax hooks for scroll-driven motion"
```

---

### Task 5: Icon components

**Files:**
- Create: `components/icons/Icon.tsx`
- Create: `components/icons/index.tsx`
- Test: `components/icons/index.test.tsx`

**Interfaces:**
- Produces: 21 named React components (`HomeIcon`, `StethoscopeIcon`, `FavoriteIcon`, `NearMeIcon`, `MenuBookIcon`, `HandshakeIcon`, `ChatBubbleIcon`, `CallIcon`, `LightModeIcon`, `DarkModeIcon`, `ArrowOutwardIcon`, `BoltIcon`, `ScheduleIcon`, `SyncAltIcon`, `VerifiedIcon`, `HubIcon`, `BiotechIcon`, `NightlightIcon`, `SportsGymnasticsIcon`, `VerifiedUserIcon`, `ArrowUpwardIcon`), each accepting `{ size?: number; className?: string }` and rendering an inline SVG that inherits `color` via `fill="currentColor"`.
- Consumes: nothing.

All path data below is copied verbatim from the official `@material-symbols/svg-400` package (`outlined` variant, viewBox `0 -960 960 960`), verified by installing the package and reading the files directly, not reconstructed from memory.

- [ ] **Step 1: Create the shared SVG wrapper**

`components/icons/Icon.tsx`:

```tsx
type IconProps = {
  size?: number;
  className?: string;
};

export function makeIcon(path: string) {
  return function IconComponent({ size = 24, className }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 -960 960 960"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    );
  };
}
```

- [ ] **Step 2: Create `components/icons/index.tsx` with all 21 icons**

```tsx
import { makeIcon } from "./Icon";

export const HomeIcon = makeIcon(
  "M220-180h150v-250h220v250h150v-390L480-765 220-570v390Zm-60 60v-480l320-240 320 240v480H530v-250H430v250H160Zm320-353Z",
);

export const StethoscopeIcon = makeIcon(
  "M540-81q-112 0-186-78.5T280-347v-35q-85-11-142.5-75.71T80-610v-230h120v-40h60v140h-60v-40h-60v169.68q0 71.32 49.5 120.82T310-440q71 0 120.5-49.5T480-610.32V-780h-60v40h-60v-140h60v40h120v230q0 87.58-57.5 152.29T340-382v35q0 85 56.5 145.5T540-141q81 0 140.5-60.15T740-347.23V-424q-35-10-57.5-39T660-530q0-45.83 32.12-77.92 32.12-32.08 78-32.08T848-607.92q32 32.09 32 77.92 0 38-22.5 67T800-424v77q0 111-76.5 188.5T540-81Zm265.5-413.32q14.5-14.33 14.5-35.5 0-21.18-14.32-35.68-14.33-14.5-35.5-14.5-21.18 0-35.68 14.32-14.5 14.33-14.5 35.5 0 21.18 14.32 35.68 14.33 14.5 35.5 14.5 21.18 0 35.68-14.32ZM770-530Z",
);

export const FavoriteIcon = makeIcon(
  "m480-121-41-37q-105.77-97.12-174.88-167.56Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.15 60.5-150.58Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.42Q880-733.15 880-643q0 46-16.5 91T806-451.5Q765-396 695.88-325.56 626.77-255.12 521-158l-41 37Zm0-79q101.24-93 166.62-159.5Q712-426 750.5-476t54-89.14q15.5-39.13 15.5-77.72 0-66.14-42-108.64T670.22-794q-51.52 0-95.37 31.5T504-674h-49q-26-56-69.85-88-43.85-32-95.37-32Q224-794 182-751.5t-42 108.82q0 38.68 15.5 78.18 15.5 39.5 54 90T314-358q66 66 166 158Zm0-297Z",
);

export const NearMeIcon = makeIcon(
  "M527-120 413-413 120-527v-43l720-270-270 720h-43Zm18-114 192-503-502 192 224 86 86 225Zm-86-225Z",
);

export const MenuBookIcon = makeIcon(
  "M248-300q53.57 0 104.28 12.5Q403-275 452-250v-427q-45-30-97.62-46.5Q301.76-740 248-740q-38 0-74.5 9.5T100-707v434q31-14 70.5-20.5T248-300Zm264 50q50-25 98-37.5T712-300q38 0 78.5 6t69.5 16v-429q-34-17-71.82-25-37.82-8-76.18-8-54 0-104.5 16.5T512-677v427Zm-30 90q-51-38-111-58.5T248-239q-36.54 0-71.77 9T106-208q-23.1 11-44.55-3Q40-225 40-251v-463q0-15 7-27.5T68-761q42-20 87.39-29.5 45.4-9.5 92.61-9.5 63 0 122.5 17T482-731q51-35 109.5-52T712-800q46.87 0 91.93 9.5Q849-781 891-761q14 7 21.5 19.5T920-714v463q0 27.89-22.5 42.45Q875-194 853-208q-34-14-69.23-22.5Q748.54-239 712-239q-63 0-121 21t-109 58ZM276-489Z",
);

export const HandshakeIcon = makeIcon(
  "M475-140q5 0 11.5-2.5T497-149l337-338q13-13 19.5-29.67Q860-533.33 860-550q0-17-6.5-34T834-614L654-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5Q540-807 527-794l-18 18 81 82q13 14 23 32.5t10 40.5q0 38-29.5 67T526-525q-25 0-41.5-7.5t-30.19-21.34L381-627 200-446q-5 5-7 10.53-2 5.52-2 11.84 0 12.63 8.5 21.13 8.5 8.5 21.17 8.5 6.33 0 11.83-3t9.5-7l138-138 42 42-137 137q-5 5-7 11t-2 12q0 12 9 21t21 9q6 0 11.5-2.5t9.5-6.5l138-138 42 42-137 137q-4 4-6.5 10.33-2.5 6.34-2.5 12.67 0 12 9 21t21 9q6 0 11-2t10-7l138-138 42 42-138 138q-5 5-7 11t-2 11q0 14 8 22t22 8Zm.06 60Q442-80 416-104.5t-31-60.62Q351-170 328-193t-28-57q-34-5-56.5-28.5T216-335q-37-5-61-30t-24-60q0-17 6.72-34.05Q144.45-476.1 157-489l224-224 110 110q8 8 17.33 12.5 9.34 4.5 18.67 4.5 13 0 24.5-11.5t11.5-24.65q0-5.85-3.5-13.35T548-651L405-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5-16.67 6.5-29.61 19.36L126-642q-14 14-19.5 29.5t-6.5 35q-1 19.5 7.5 38T128-506l-43 43q-20-22-32.5-53T40-579q0-30 11.5-57.5T84-685l151-151q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T448-836l18 18 18-18q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T697-836l179 179q22 22 33 50.03 11 28.04 11 57 0 28.97-11 56.47T876-444L539-107q-13 13-29.53 20t-34.41 7ZM377-626Z",
);

export const ChatBubbleIcon = makeIcon(
  "M80-80v-740q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H240L80-80Zm134-220h606v-520H140v600l74-80Zm-74 0v-520 520Z",
);

export const CallIcon = makeIcon(
  "M795-120q-116 0-236.5-56T335-335Q232-438 176-558.5T120-795q0-19.29 12.86-32.14Q145.71-840 165-840h140q14 0 24 10t14 25l26.93 125.64Q372-665 369.5-653.5t-10.73 19.73L259-533q26 44 55 82t64 72q37 38 78 69.5t86 55.5l95-98q10-11 23.15-15 13.15-4 25.85-2l119 26q15 4 25 16.04 10 12.05 10 26.96v135q0 19.29-12.86 32.14Q814.29-120 795-120ZM229-588l81-82-23-110H180q2 42 13.5 88.5T229-588Zm369 363q41 19 89 31t93 14v-107l-103-21-79 83ZM229-588Zm369 363Z",
);

export const LightModeIcon = makeIcon(
  "M579-381q41-41 41-99t-41-99q-41-41-99-41t-99 41q-41 41-41 99t41 99q41 41 99 41t99-41Zm-240.5 42.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-450H40v-60h160v60Zm720 0H760v-60h160v60ZM450-760v-160h60v160h-60Zm0 720v-160h60v160h-60ZM262-658l-100-97 43-44 96 100-39 41Zm494 496-98-100 41-41 99 98-42 43Zm-99-537 98-99 44 42-99 98-43-41ZM162-205l99-98 42 42-98 99-43-43Zm318-275Z",
);

export const DarkModeIcon = makeIcon(
  "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q8 0 17 .5t23 1.5q-36 32-56 79t-20 99q0 90 63 153t153 63q52 0 99-18.5t79-51.5q1 12 1.5 19.5t.5 14.5q0 150-105 255T480-120Zm0-60q109 0 190-67.5T771-406q-25 11-53.67 16.5Q688.67-384 660-384q-114.69 0-195.34-80.66Q384-545.31 384-660q0-24 5-51.5t18-62.5q-98 27-162.5 109.5T180-480q0 125 87.5 212.5T480-180Zm-4-297Z",
);

export const ArrowOutwardIcon = makeIcon(
  "m242-246-42-42 412-412H234v-60h480v480h-60v-378L242-246Z",
);

export const BoltIcon = makeIcon(
  "m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm154-396Z",
);

export const ScheduleIcon = makeIcon(
  "m627-287 45-45-159-160v-201h-60v225l174 181ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z",
);

export const SyncAltIcon = makeIcon(
  "M271-120 80-311l192-192 42 42-120 120h646v60H194l119 119-42 42Zm418-337-42-42 119-119H120v-60h646L646-798l42-42 192 192-191 191Z",
);

export const VerifiedIcon = makeIcon(
  "m346-60-76-130-151-31 17-147-96-112 96-111-17-147 151-31 76-131 134 62 134-62 77 131 150 31-17 147 96 111-96 112 17 147-150 31-77 130-134-62-134 62Zm27-79 107-45 110 45 67-100 117-30-12-119 81-92-81-94 12-119-117-28-69-100-108 45-110-45-67 100-117 28 12 119-81 94 81 92-12 121 117 28 70 100Zm107-341Zm-43 133 227-225-45-41-182 180-95-99-46 45 141 140Z",
);

export const HubIcon = makeIcon(
  "M153-73q-33-33-33-81t33.25-81q33.25-33 80.75-33 14 0 24.5 2.5T280-258l85-106q-19-23-29-52.5t-5-61.5l-121-41q-15 25-39.5 39T114-466q-47.5 0-80.75-33.25T0-580q0-47.5 33.25-80.75T114-694q47.5 0 80.75 33.25T228-580v4l122 42q18-32 43.5-49t56.5-24v-129q-39-11-61.5-43T366-846q0-47.5 33-80.75T480-960q48 0 81 33.25T594-846q0 35-23 67t-61 43v129q31 7 57 24t44 49l121-42v-4q0-47.5 33.25-80.75T846-694q47.5 0 80.75 33T960-580q0 48-33.25 81T846-466q-32 0-57-14t-39-39l-121 41q5 32-4.5 61.5T595-364l85 106q11-5 21.5-7.5t24.06-2.5Q774-268 807-235t33 81q0 48-33 81t-81 33q-48 0-81-33.25T612-154q0-20 5.5-36t15.5-31l-85-106q-32.13 17-68.56 17Q443-310 411-327l-84 107q10 15 15.5 30.5T348-154q0 47.5-33 80.75T234-40q-48 0-81-33Zm-38.96-453q22.96 0 38.46-15.54 15.5-15.53 15.5-38.5 0-22.96-15.54-38.46-15.53-15.5-38.5-15.5Q91-634 75.5-618.46 60-602.93 60-579.96 60-557 75.54-541.5q15.53 15.5 38.5 15.5ZM272.5-115.54q15.5-15.53 15.5-38.5 0-22.96-15.54-38.46-15.53-15.5-38.5-15.5-22.96 0-38.46 15.54-15.5 15.53-15.5 38.5 0 22.96 15.54 38.46 15.53 15.5 38.5 15.5 22.96 0 38.46-15.54Zm246-692q15.5-15.53 15.5-38.5 0-22.96-15.54-38.46-15.53-15.5-38.5-15.5-22.96 0-38.46 15.54-15.5 15.53-15.5 38.5 0 22.96 15.54 38.46 15.53 15.5 38.5 15.5 22.96 0 38.46-15.54ZM480.5-370q37.5 0 63.5-26.5t26-64q0-37.5-26.1-63.5T480-550q-37 0-63.5 26.1T390-460q0 37 26.5 63.5t64 26.5Zm284 254.46q15.5-15.53 15.5-38.5 0-22.96-15.54-38.46-15.53-15.5-38.5-15.5-22.96 0-38.46 15.54-15.5 15.53-15.5 38.5 0 22.96 15.54 38.46 15.53 15.5 38.5 15.5 22.96 0 38.46-15.54Zm120-426q15.5-15.53 15.5-38.5 0-22.96-15.54-38.46-15.53-15.5-38.5-15.5-22.96 0-38.46 15.54-15.5 15.53-15.5 38.5 0 22.96 15.54 38.46 15.53 15.5 38.5 15.5 22.96 0 38.46-15.54ZM480-846ZM114-580Zm366 120Zm366-120ZM234-154Zm492 0Z",
);

export const BiotechIcon = makeIcon(
  "M200-120v-60h208v-104h-15q-81 0-137-56t-56-137q0-61 35-111t92-70q4-40 35-65t72-22l-21-59 41-14.56L440-856l66-24 14 37 40-14 113 295-43 15 14 37-64 23-14-37-43 16-25-68q-15 17-35.5 24.5t-43.83 6.5Q393-546 371-561t-35-38q-35 17-55.5 49.97Q260-516.07 260-477q0 55.42 38.79 94.21Q337.58-344 393-344h347v60H508v104h252v60H200Zm356-452 53-19-80-206-53 19 80 206Zm-94.5-37.32q14.5-14.33 14.5-35.5 0-21.18-14.32-35.68-14.33-14.5-35.5-14.5-21.18 0-35.68 14.32-14.5 14.33-14.5 35.5 0 21.18 14.32 35.68 14.33 14.5 35.5 14.5 21.18 0 35.68-14.32ZM556-572Zm-130-75Zm2 0Z",
);

export const NightlightIcon = makeIcon(
  "M593-80q-88.11 0-166.56-32.5Q348-145 288.43-200.41q-59.57-55.41-94-129.62Q160-404.25 160-488.13q0-83.87 34.5-158.37t94-130q59.5-55.5 137.94-88Q504.89-897 593-897q47 0 88 10t79 27q-90 64-146 160t-56 211.5q0 115.5 56 212T760-117q-38 17-79 27t-88 10Zm0-60h26.42q12.58 0 20.58-1-66-74-104-162t-38-185q0-97 38-185t104-163q-8-1-20.58-1H593q-153 0-263 101.96t-110 247Q220-343 330-241.5T593-140Zm-95-349Z",
);

export const SportsGymnasticsIcon = makeIcon(
  "m490-80-20-398-149-52H40v-60h243l275-197 39 46-149 107 97 34 340-200 35 42-346 251-24 427h-60ZM240.08-647q-30.08 0-51.58-21.42t-21.5-51.5q0-30.08 21.42-51.58t51.5-21.5q30.08 0 51.58 21.42t21.5 51.5q0 30.08-21.42 51.58t-51.5 21.5Z",
);

export const VerifiedUserIcon = makeIcon(
  "m436-347 228-228-42-41-183 183-101-101-44 44 142 143Zm44 266q-140-35-230-162.5T160-523v-238l320-120 320 120v238q0 152-90 279.5T480-81Zm0-62q115-38 187.5-143.5T740-523v-196l-260-98-260 98v196q0 131 72.5 236.5T480-143Zm0-337Z",
);

export const ArrowUpwardIcon = makeIcon(
  "M450-160v-526L202-438l-42-42 320-320 320 320-42 42-248-248v526h-60Z",
);
```

- [ ] **Step 3: Write a smoke test**

`components/icons/index.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import * as Icons from "./index";

describe("icon components", () => {
  it("renders every icon as an svg with a path", () => {
    Object.entries(Icons).forEach(([name, IconComponent]) => {
      const { container } = render(<IconComponent />);
      const svg = container.querySelector("svg");
      expect(svg, `${name} should render an svg`).toBeTruthy();
      expect(svg?.querySelector("path")).toBeTruthy();
    });
  });

  it("has exactly 21 icons", () => {
    expect(Object.keys(Icons)).toHaveLength(21);
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- components/icons/index.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 5: Commit**

```bash
git add components/icons
git commit -m "Add verified Material Symbols icon components"
```

---

### Task 6: Nav component

**Files:**
- Create: `components/Nav.tsx`
- Create: `components/Nav.module.css`
- Test: `components/Nav.test.tsx`

**Interfaces:**
- Consumes: `useTheme()` from Task 3; `HomeIcon`, `StethoscopeIcon`, `FavoriteIcon`, `NearMeIcon`, `MenuBookIcon`, `HandshakeIcon`, `ChatBubbleIcon`, `CallIcon`, `LightModeIcon`, `DarkModeIcon` from Task 5.
- Produces: `export default function Nav()`, rendered once in `app/page.tsx` (Task 16). No props.

Source reference: `docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/source-template.html:254-270` (markup), `:510-541` (hover-blob width/color logic), `:606-616` (responsive nav container styles).

- [ ] **Step 1: Write a render test**

`components/Nav.test.tsx`:

```tsx
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Nav from "./Nav";

describe("Nav", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders all primary destinations", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "#top");
    expect(screen.getByRole("link", { name: /services/i })).toHaveAttribute("href", "#services");
    expect(screen.getByRole("link", { name: /locations/i })).toHaveAttribute("href", "#locations");
    expect(screen.getByRole("link", { name: /call us/i })).toHaveAttribute("href", "tel:13105550123");
  });

  it("shows the theme toggle labeled for the current (dark) theme", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /light mode/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Nav.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/Nav.module.css`**

```css
.nav {
  position: fixed;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
  width: 52px;
}

.blobLayer {
  position: absolute;
  inset: 0;
  filter: url(#goo);
  pointer-events: none;
}

.blob {
  position: absolute;
  left: 0;
  height: 52px;
  border-radius: 999px;
  background: var(--pill);
  transition: width .42s cubic-bezier(.2, .9, .2, 1), background .3s ease;
}

.blobActive {
  background: var(--accent);
}

.list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.link {
  position: relative;
  height: 52px;
  width: 52px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--ink);
  transition: color .3s ease;
}

.iconWrap {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  display: block;
  position: absolute;
  left: 54px;
  white-space: nowrap;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -.01em;
  color: inherit;
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity .28s ease .06s, transform .38s cubic-bezier(.2, .9, .2, 1);
}

.labelVisible {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 859px) {
  .nav {
    left: 50%;
    top: auto;
    bottom: 14px;
    transform: translateX(-50%);
    width: auto;
    max-width: calc(100vw - 24px);
    padding: 6px;
    border-radius: 999px;
    background: var(--pill);
    backdrop-filter: blur(14px);
    box-shadow: 0 16px 34px -18px rgba(0, 0, 0, .7);
  }

  .blobLayer {
    inset: 6px;
  }

  .list {
    flex-direction: row;
    gap: 6px;
  }

  .link,
  .iconWrap {
    width: 46px;
    height: 46px;
  }

  .blob {
    height: 46px;
    width: 46px !important;
  }

  .label {
    display: none;
  }

  .extraOnly {
    display: none;
  }
}
```

- [ ] **Step 4: Implement `components/Nav.tsx`**

```tsx
"use client";

import { useState } from "react";
import styles from "./Nav.module.css";
import { useTheme } from "@/hooks/useTheme";
import {
  HomeIcon,
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

const SLOT_HEIGHT = 60;

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [hoverIndex, setHoverIndex] = useState(-1);

  const items = [
    { label: "Home", href: "#top", icon: <HomeIcon />, primary: true },
    { label: "Services", href: "#services", icon: <StethoscopeIcon />, primary: true },
    { label: "Why us", href: "#why", icon: <FavoriteIcon />, primary: false },
    { label: "Locations", href: "#locations", icon: <NearMeIcon />, primary: true },
    { label: "Journal", href: "#insight", icon: <MenuBookIcon />, primary: false },
    { label: "Partners", href: "#partners", icon: <HandshakeIcon />, primary: false },
    { label: "Contact", href: "#footer", icon: <ChatBubbleIcon />, primary: false },
    { label: "Call us", href: "tel:13105550123", icon: <CallIcon />, primary: true },
    {
      label: theme === "dark" ? "Light mode" : "Dark mode",
      href: "#top",
      icon: theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />,
      primary: true,
      onClick: toggleTheme,
    },
  ];

  return (
    <nav className={styles.nav} onMouseLeave={() => setHoverIndex(-1)}>
      <div className={styles.blobLayer} aria-hidden="true">
        {items.map((item, i) => {
          const distance = hoverIndex < 0 ? Infinity : Math.abs(i - hoverIndex);
          const width = distance === 0 ? 184 : distance === 1 ? 92 : distance === 2 ? 64 : 52;
          return (
            <div
              key={item.label}
              className={`${styles.blob} ${distance === 0 ? styles.blobActive : ""} ${
                item.primary ? "" : styles.extraOnly
              }`}
              style={{ top: `${i * SLOT_HEIGHT}px`, width: `${width}px` }}
            />
          );
        })}
      </div>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li
            key={item.label}
            className={item.primary ? undefined : styles.extraOnly}
            style={{ listStyle: "none" }}
          >
            <a
              href={item.href}
              className={styles.link}
              onMouseEnter={() => setHoverIndex(i)}
              onClick={
                item.onClick
                  ? (event) => {
                      event.preventDefault();
                      item.onClick?.();
                    }
                  : undefined
              }
            >
              <span className={styles.iconWrap}>{item.icon}</span>
              <span className={`${styles.label} ${hoverIndex === i ? styles.labelVisible : ""}`}>
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Nav.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 6: Commit**

```bash
git add components/Nav.tsx components/Nav.module.css components/Nav.test.tsx
git commit -m "Add Nav component with gooey hover blob and theme toggle"
```

---

### Task 7: Hero component with video, parallax, and scroll hint

**Files:**
- Create: `components/Hero.tsx`
- Create: `components/Hero.module.css`
- Test: `components/Hero.test.tsx`

**Interfaces:**
- Consumes: nothing new (plain component, `useEffect` for its own parallax scroll listener).
- Produces: `export default function Hero()`. Renders a `<section id="top">`.

Source reference: `source-template.html:274-306` (markup, gradients, headline, stats, scroll hint), keyframes `slowZoom`/`scrollHint` from `app/globals.css` (Task 2).

- [ ] **Step 1: Write a render test**

`components/Hero.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders the headline, subcopy, and stats", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/care that/i);
    expect(
      screen.getByText(/same-day sick visits, round-the-clock booking/i),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("LA clinics")).toBeInTheDocument();
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
  });

  it("has a section with id=top for nav anchoring", () => {
    render(<Hero />);
    expect(document.getElementById("top")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Hero.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/Hero.module.css`**

```css
.hero {
  position: relative;
  min-height: 100vh;
  padding: 40px clamp(28px, 6vw, 96px) 0 clamp(24px, 9vw, 150px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  overflow: hidden;
}

.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: slowZoom 26s ease-in-out infinite alternate;
  will-change: transform;
}

.gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(6, 22, 28, .72) 0%, rgba(6, 22, 28, .42) 38%, rgba(6, 22, 28, .94) 88%),
    radial-gradient(1100px 640px at 82% 18%, rgba(15, 163, 163, .34), transparent 65%);
}

.scanlines {
  position: absolute;
  inset: 0;
  opacity: .5;
  background: repeating-linear-gradient(180deg, rgba(255, 255, 255, .045) 0 1px, transparent 1px 4px);
}

.content {
  position: relative;
  padding-bottom: clamp(40px, 6vh, 74px);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .2em;
  text-transform: uppercase;
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
  max-width: 15ch;
  font-size: clamp(52px, 9.4vw, 148px);
  line-height: .88;
  letter-spacing: -.045em;
  font-weight: 800;
  color: #fff;
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
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, .16);
}

.subcopy {
  margin: 0;
  max-width: 46ch;
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

.scrollHint {
  position: absolute;
  right: clamp(28px, 6vw, 96px);
  bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.scrollHintLabel {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, .5);
  writing-mode: vertical-rl;
}

.scrollHintTrack {
  width: 1px;
  height: 46px;
  background: rgba(255, 255, 255, .28);
  position: relative;
  overflow: hidden;
}

.scrollHintFill {
  position: absolute;
  inset: 0;
  background: var(--link);
  animation: scrollHint 2.4s ease-in-out infinite;
}

@media (max-width: 640px) {
  .subrow {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .scrollHint {
    display: none;
  }
}
```

- [ ] **Step 4: Implement `components/Hero.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 60);
        video.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="top" className={styles.hero} data-dark="1">
      <video
        ref={videoRef}
        className={styles.video}
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <span className={styles.gradient} />
      <span className={styles.scanlines} />

      <div className={styles.content}>
        <span className={styles.eyebrow}>
          <span className={styles.liveDot} />
          Los Angeles &middot; Pediatric &amp; family medicine
        </span>
        <h1 className={styles.headline}>
          Care that
          <br />
          keeps up
          <br />
          with <span className={styles.headlineItalic}>childhood.</span>
        </h1>
        <div className={styles.subrow}>
          <p className={styles.subcopy}>
            Same-day sick visits, round-the-clock booking, telehealth after dinner, and one chart
            that follows your child to every office we run.
          </p>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>LA clinics</span>
            </span>
            <span className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Booking</span>
            </span>
            <span className={styles.stat}>
              <span className={styles.statNumber}>4.9</span>
              <span className={styles.statLabel}>Parent rating</span>
            </span>
          </div>
        </div>
      </div>

      <span className={styles.scrollHint}>
        <span className={styles.scrollHintLabel}>Scroll</span>
        <span className={styles.scrollHintTrack}>
          <span className={styles.scrollHintFill} />
        </span>
      </span>
    </section>
  );
}
```

Note: `&middot;` renders the source's middle-dot separator (`·`). That character is not an em dash and is reused verbatim, matching the Global Constraint to reuse copy exactly.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Hero.test.tsx`
Expected: PASS, both tests.

- [ ] **Step 6: Commit**

```bash
git add components/Hero.tsx components/Hero.module.css components/Hero.test.tsx
git commit -m "Add Hero section with background video, parallax, and scroll hint"
```

---

### Task 8: TickerBar (marquee)

**Files:**
- Create: `components/TickerBar.tsx`
- Create: `components/TickerBar.module.css`
- Test: `components/TickerBar.test.tsx`

**Interfaces:**
- Produces: `export default function TickerBar()`.

Source reference: `source-template.html:308-314`, `599` (the six marquee strings), `627` keyframe reference already in `app/globals.css`.

- [ ] **Step 1: Write a render test**

`components/TickerBar.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TickerBar from "./TickerBar";

describe("TickerBar", () => {
  it("renders each pill twice for a seamless loop", () => {
    render(<TickerBar />);
    expect(screen.getAllByText("Same-day appointments")).toHaveLength(2);
    expect(screen.getAllByText("24/7 online booking")).toHaveLength(2);
    expect(screen.getAllByText("Board-certified pediatricians")).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/TickerBar.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/TickerBar.module.css`**

```css
.bar {
  position: relative;
  padding: 22px 0;
  background: var(--link);
  color: var(--bg);
  overflow: hidden;
  white-space: nowrap;
}

.track {
  display: inline-flex;
  gap: 46px;
  align-items: center;
  animation: marquee 34s linear infinite;
  padding-right: 46px;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 46px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(6, 22, 28, .45);
}

@media (max-width: 640px) {
  .item {
    font-size: 12.5px;
    gap: 28px;
  }

  .track {
    gap: 28px;
  }
}
```

- [ ] **Step 4: Implement `components/TickerBar.tsx`**

```tsx
import styles from "./TickerBar.module.css";

const MARQUEE_ITEMS = [
  "Same-day appointments",
  "24/7 online booking",
  "Telehealth tonight",
  "Most HMO & IPA plans",
  "Board-certified pediatricians",
  "One chart, three clinics",
];

const LOOPED_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function TickerBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.track}>
        {LOOPED_ITEMS.map((label, index) => (
          <span key={`${label}-${index}`} className={styles.item}>
            {label}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/TickerBar.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/TickerBar.tsx components/TickerBar.module.css components/TickerBar.test.tsx
git commit -m "Add TickerBar marquee section"
```

---

### Task 9: Services section

**Files:**
- Create: `components/Services.tsx`
- Create: `components/Services.module.css`
- Test: `components/Services.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` (Task 4), `ArrowOutwardIcon` (Task 5).
- Produces: `export default function Services()`.

Source reference: `source-template.html:316-334` (markup), `:543-563` (six services array and hover-state color logic), image `/images/photo-doctor-portrait.jpg` (Task 1).

- [ ] **Step 1: Write a render test**

`components/Services.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "./Services";

describe("Services", () => {
  it("renders the section heading and all six service rows", () => {
    render(<Services />);
    expect(screen.getByRole("heading", { name: "What we do" })).toBeInTheDocument();
    [
      "Well-child & physicals",
      "Same-day sick visits",
      "Telehealth",
      "Advanced wound care",
      "Immunizations",
      "Chronic care",
    ].forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("each row links to #book", () => {
    render(<Services />);
    expect(screen.getByRole("link", { name: /well-child & physicals/i })).toHaveAttribute(
      "href",
      "#book",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Services.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/Services.module.css`**

```css
.section {
  position: relative;
  padding: clamp(70px, 9vw, 120px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 120px) clamp(24px, 9vw, 150px);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
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
  position: relative;
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
  transition: padding .4s cubic-bezier(.2, .9, .2, 1), border-color .3s ease, background .3s ease;
  color: inherit;
}

.row:last-child {
  border-bottom: 1px solid var(--line);
}

.row:hover,
.row:focus-visible {
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

.row:hover .num {
  color: var(--accent);
}

.title {
  flex: 1;
  min-width: 220px;
  font-size: clamp(24px, 3.2vw, 44px);
  line-height: 1.04;
  letter-spacing: -.035em;
  font-weight: 700;
  color: var(--ink);
}

.body {
  max-width: 34ch;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--dim-3);
  transition: color .35s ease;
}

.row:hover .body {
  color: var(--ink-2);
}

.arrow {
  color: var(--muted-2);
  flex-shrink: 0;
  transition: color .35s ease;
}

.row:hover .arrow {
  color: var(--accent);
}

.previewWrap {
  position: absolute;
  right: 0;
  top: 50%;
  width: 300px;
  height: 380px;
  border-radius: 200px 200px 12px 12px;
  overflow: hidden;
  pointer-events: none;
  z-index: 3;
  transition: opacity .45s ease, transform .6s cubic-bezier(.2, .9, .2, 1);
  opacity: 0;
  transform: translateY(-50%) scale(.9) rotate(6deg);
}

.previewVisible {
  opacity: 1;
  transform: translateY(-50%) scale(1) rotate(0deg);
}

.previewImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 1180px) {
  .rows {
    padding-right: 330px;
  }
}

@media (max-width: 1179px) {
  .previewWrap {
    display: none;
  }
}

@media (max-width: 640px) {
  .row {
    align-items: flex-start;
    gap: 10px 16px;
    padding: 20px 0;
  }

  .row:hover {
    padding: 20px;
  }
}
```

- [ ] **Step 4: Implement `components/Services.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Services.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";

const SERVICES = [
  {
    title: "Well-child & physicals",
    body: "Growth checks, school and sports physicals, immunizations, developmental screening.",
  },
  {
    title: "Same-day sick visits",
    body: "Fevers, infections and acute illness, usually seen the day you call.",
  },
  {
    title: "Telehealth",
    body: "Virtual consults, diagnosis and prescriptions from home, evenings included.",
  },
  {
    title: "Advanced wound care",
    body: "Specialist treatment for chronic and non-healing wounds.",
  },
  {
    title: "Immunizations",
    body: "Full childhood schedule plus travel and seasonal vaccines, tracked across offices.",
  },
  {
    title: "Chronic care",
    body: "Asthma, allergy and ongoing conditions with one consistent care team.",
  },
];

export default function Services() {
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [hovered, setHovered] = useState(-1);

  return (
    <section
      id="services"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>What we do</h2>
        <span className={styles.kicker}>Six lines of care</span>
      </div>
      <div className={styles.rows}>
        {SERVICES.map((service, i) => (
          <a
            key={service.title}
            href="#book"
            className={styles.row}
            onMouseEnter={() => setHovered(i)}
          >
            <span className={styles.num}>{`0${i + 1}`}</span>
            <span className={styles.title}>{service.title}</span>
            <span className={styles.body}>{service.body}</span>
            <ArrowOutwardIcon size={26} className={styles.arrow} />
          </a>
        ))}
        <span className={`${styles.previewWrap} ${hovered >= 0 ? styles.previewVisible : ""}`}>
          <Image
            src="/images/photo-doctor-portrait.jpg"
            alt="A St. Gianna clinician"
            width={300}
            height={380}
            className={styles.previewImage}
          />
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Services.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Services.tsx components/Services.module.css components/Services.test.tsx
git commit -m "Add Services section with hover preview and scroll reveal"
```

---

### Task 10: WhyUs section

**Files:**
- Create: `components/WhyUs.tsx`
- Create: `components/WhyUs.module.css`
- Test: `components/WhyUs.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` (Task 4), `BoltIcon`, `ScheduleIcon`, `SyncAltIcon`, `VerifiedIcon` (Task 5).
- Produces: `export default function WhyUs()`.

Source reference: `source-template.html:336-347`, `:629-634` (the four reasons array).

- [ ] **Step 1: Write a render test**

`components/WhyUs.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import WhyUs from "./WhyUs";

describe("WhyUs", () => {
  it("renders the heading and all four reason cards", () => {
    render(<WhyUs />);
    expect(
      screen.getByRole("heading", {
        name: /built around a parent's real day, not a clinic's schedule/i,
      }),
    ).toBeInTheDocument();
    ["Same-day slots", "Book at 2am", "One chart, everywhere", "Insurance handled"].forEach(
      (title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      },
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/WhyUs.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/WhyUs.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  background: var(--bg-2);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
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
  border-top: 2px solid rgba(79, 195, 194, .45);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon {
  color: var(--link);
}

.title {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -.02em;
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

- [ ] **Step 4: Implement `components/WhyUs.tsx`**

```tsx
"use client";

import styles from "./WhyUs.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BoltIcon, ScheduleIcon, SyncAltIcon, VerifiedIcon } from "@/components/icons";

const REASONS = [
  {
    icon: BoltIcon,
    title: "Same-day slots",
    body: "Held daily for sick visits, so you are not waiting a week with a feverish child.",
  },
  {
    icon: ScheduleIcon,
    title: "Book at 2am",
    body: "Online scheduling never closes, and confirmation lands instantly.",
  },
  {
    icon: SyncAltIcon,
    title: "One chart, everywhere",
    body: "Your child's record is live at whichever office you walk into.",
  },
  {
    icon: VerifiedIcon,
    title: "Insurance handled",
    body: "Most HMO and IPA plans, with benefits checked before the visit.",
  },
];

export default function WhyUs() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="why"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Built around a parent&apos;s real day, not a clinic&apos;s schedule.</h2>
      <div className={styles.grid}>
        {REASONS.map(({ icon: ReasonIcon, title, body }) => (
          <div key={title} className={styles.card}>
            <ReasonIcon size={27} className={styles.icon} />
            <span className={styles.title}>{title}</span>
            <span className={styles.body}>{body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/WhyUs.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/WhyUs.tsx components/WhyUs.module.css components/WhyUs.test.tsx
git commit -m "Add WhyUs section with four reason cards"
```

---

### Task 11: Locations section

**Files:**
- Create: `components/Locations.tsx`
- Create: `components/Locations.module.css`
- Test: `components/Locations.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal`, `useParallax` (Task 4).
- Produces: `export default function Locations()`.

Source reference: `source-template.html:349-371`, `:566-577` (the three locations array and hover-flex-grow logic). Default active panel is index 0 (Santa Monica), matching `clearPanel: () => this.setState({ panel: 0 })` at `:622`. The parallax drift on the clinic photos is new (per the design spec's "New behavior" section), not in the source.

- [ ] **Step 1: Write a render test**

`components/Locations.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Locations from "./Locations";

describe("Locations", () => {
  it("renders all three clinics with address, phone, and hours", () => {
    render(<Locations />);
    expect(screen.getByText("Santa Monica")).toBeInTheDocument();
    expect(screen.getByText("1234 Wilshire Blvd, Santa Monica, CA 90403")).toBeInTheDocument();
    expect(screen.getByText("(310) 555-0123")).toBeInTheDocument();
    expect(screen.getByText("Hollywood")).toBeInTheDocument();
    expect(screen.getByText("La Mirada")).toBeInTheDocument();
    expect(screen.getByText("Opens 9am")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Locations.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/Locations.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
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

.subtext {
  margin: 0;
  max-width: 34ch;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--muted);
}

.panels {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 460px;
}

.panel {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  min-width: 220px;
  min-height: 460px;
  display: flex;
  align-items: flex-end;
  flex: 1;
  transition: flex .55s cubic-bezier(.2, .9, .2, 1);
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
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
  background: linear-gradient(180deg, rgba(6, 22, 28, .25), rgba(6, 22, 28, .92));
}

.status {
  position: absolute;
  top: 26px;
  left: 32px;
  pointer-events: none;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--italic-highlight);
}

.statusDot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--italic-highlight);
  margin-right: 8px;
  animation: livePulse 1.8s infinite;
}

.body {
  position: relative;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 32px;
  color: #fff;
}

.name {
  font-size: clamp(26px, 2.8vw, 38px);
  line-height: 1;
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
  max-height: 200px;
}

.address {
  display: block;
  font-size: 14.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, .72);
  max-width: 30ch;
}

.phone {
  display: block;
  margin-top: 10px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -.02em;
  color: #fff;
}

.hours {
  display: block;
  margin-top: 4px;
  font-size: 13.5px;
  color: rgba(255, 255, 255, .6);
}

@media (max-width: 640px) {
  .panels {
    min-height: 0;
  }

  .panel {
    min-width: 100%;
    min-height: 300px;
    flex: 1 !important;
  }

  .detail {
    opacity: 1;
    max-height: 200px;
  }
}
```

- [ ] **Step 4: Implement `components/Locations.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Locations.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";

const LOCATIONS = [
  {
    name: "Santa Monica",
    status: "Open now",
    address: "1234 Wilshire Blvd, Santa Monica, CA 90403",
    phone: "(310) 555-0123",
    hours: "Mon-Sat 8am-8pm",
    image: "/images/photo-hospital-hallway.jpg",
  },
  {
    name: "Hollywood",
    status: "Open now",
    address: "5678 Sunset Blvd, Los Angeles, CA 90028",
    phone: "(323) 555-0199",
    hours: "Mon-Sun 8am-9pm",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "La Mirada",
    status: "Opens 9am",
    address: "910 Rosecrans Ave, La Mirada, CA 90638",
    phone: "(562) 555-0144",
    hours: "Mon-Fri 9am-6pm",
    image: "/images/photo-pediatric-checkup.jpg",
  },
];

export default function Locations() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(0.08, 24);
  const [active, setActive] = useState(0);

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
        <p className={styles.subtext}>
          Hover a panel. Your child&apos;s chart is already there before you arrive.
        </p>
      </div>
      <div className={styles.panels} ref={parallaxRef} onMouseLeave={() => setActive(0)}>
        {LOCATIONS.map((location, i) => (
          <button
            key={location.name}
            type="button"
            className={`${styles.panel} ${active === i ? styles.panelActive : ""}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className={styles.imageLayer} style={{ transform: `translateY(${offset}px)` }}>
              <Image
                src={location.image}
                alt={`${location.name} clinic`}
                fill
                className={styles.image}
              />
            </div>
            <span className={styles.overlay} />
            <span className={styles.status}>
              <span className={styles.statusDot} />
              {location.status}
            </span>
            <span className={styles.body}>
              <span className={styles.name}>{location.name}</span>
              <span
                className={`${styles.detail} ${active === i ? styles.detailVisible : ""}`}
              >
                <span className={styles.address}>{location.address}</span>
                <span className={styles.phone}>{location.phone}</span>
                <span className={styles.hours}>{location.hours}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
```

Note: `Image` with `fill` requires the parent (`.panel`) to be `position: relative`, which it already is. `.imageLayer` is an oversized (24px top/bottom buffer) wrapper around each `Image`; the shared `offset` from `useParallax` translates that wrapper, not the panel itself, so the drift never reveals an empty edge inside the `overflow: hidden` panel.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Locations.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Locations.tsx components/Locations.module.css components/Locations.test.tsx
git commit -m "Add Locations section with hoverable clinic panels and photo parallax"
```

---

### Task 12: Partners section

**Files:**
- Create: `components/Partners.tsx`
- Create: `components/Partners.module.css`
- Test: `components/Partners.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal`, `useParallax` (Task 4), `HubIcon`, `BiotechIcon`, `NightlightIcon`, `SportsGymnasticsIcon`, `VerifiedUserIcon`, `ArrowOutwardIcon` (Task 5).
- Produces: `export default function Partners()`.

Source reference: `source-template.html:373-392`, `:579-597` (five partners array, row grid, hover preview). The parallax drift on the preview photo is new (per the design spec's "New behavior" section), not in the source.

- [ ] **Step 1: Write a render test**

`components/Partners.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Partners from "./Partners";

describe("Partners", () => {
  it("renders the heading and all five partner rows", () => {
    render(<Partners />);
    expect(
      screen.getByRole("heading", { name: /we never treat.*your family alone/i }),
    ).toBeInTheDocument();
    ["KT Doctor", "Serendib Health", "Pediatric After Hours", "LAIPT", "HMO & IPA plans"].forEach(
      (name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      },
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Partners.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/Partners.module.css`**

```css
.section {
  position: relative;
  padding: clamp(70px, 9vw, 118px) clamp(28px, 6vw, 96px) clamp(70px, 9vw, 118px) clamp(24px, 9vw, 150px);
  background: var(--bg-2);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
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

.subtext {
  margin: 0;
  max-width: 34ch;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--muted);
}

.rows {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.row {
  display: grid;
  grid-template-columns: 32px minmax(150px, 1.2fr) 118px minmax(0, 1.15fr) 26px;
  align-items: center;
  gap: 22px;
  padding: 24px 0;
  border-top: 1px solid var(--line);
  transition: padding .4s cubic-bezier(.2, .9, .2, 1), border-color .3s ease;
  color: inherit;
}

.row:last-child {
  border-bottom: 1px solid var(--line);
}

.row:hover,
.row:focus-visible {
  padding: 24px 18px;
  border-color: var(--line-2);
}

.icon {
  color: var(--muted-2);
  transition: color .35s ease;
}

.row:hover .icon {
  color: var(--accent);
}

.name {
  font-size: clamp(22px, 2.8vw, 40px);
  line-height: 1.04;
  letter-spacing: -.035em;
  font-weight: 800;
  color: var(--ink);
  transition: color .35s ease;
}

.role {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.body {
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--muted);
  transition: color .35s ease;
}

.row:hover .body {
  color: var(--ink-2);
}

.arrow {
  color: var(--muted-2);
  justify-self: end;
  transition: color .35s ease;
}

.row:hover .arrow {
  color: var(--accent);
}

.previewWrap {
  position: absolute;
  right: 0;
  top: 50%;
  width: 280px;
  height: 360px;
  border-radius: 185px 185px 12px 12px;
  overflow: hidden;
  pointer-events: none;
  z-index: 3;
  transition: opacity .45s ease, transform .6s cubic-bezier(.2, .9, .2, 1);
  opacity: 0;
  transform: translateY(-50%) scale(.9) rotate(6deg);
}

.previewVisible {
  opacity: 1;
  transform: translateY(-50%) scale(1) rotate(0deg);
}

.previewImageLayer {
  position: absolute;
  left: 0;
  right: 0;
  top: -20px;
  bottom: -20px;
}

.previewImage {
  object-fit: cover;
}

@media (max-width: 1179px) {
  .previewWrap {
    display: none;
  }
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 26px 1fr 22px;
    grid-template-areas: "icon name arrow" "body body body";
    gap: 8px 14px;
    padding: 20px 0;
  }

  .row:hover {
    padding: 20px 18px;
  }

  .icon {
    grid-area: icon;
  }

  .name {
    grid-area: name;
  }

  .arrow {
    grid-area: arrow;
  }

  .role {
    display: none;
  }

  .body {
    grid-area: body;
    margin-top: 6px;
  }
}
```

The mobile `grid-template-areas` stacking (icon/name/arrow on one row, body below, role hidden) is an intentional adaptation for a breakpoint the source never defined, per the Global Constraints note on mobile layouts.

- [ ] **Step 4: Implement `components/Partners.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Partners.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useParallax } from "@/hooks/useParallax";
import {
  HubIcon,
  BiotechIcon,
  NightlightIcon,
  SportsGymnasticsIcon,
  VerifiedUserIcon,
  ArrowOutwardIcon,
} from "@/components/icons";

const PARTNERS = [
  {
    name: "KT Doctor",
    role: "Primary network",
    icon: HubIcon,
    body: "Shared charting and specialist referrals across the group.",
    image: "/images/photo-doctor-portrait.jpg",
  },
  {
    name: "Serendib Health",
    role: "Diagnostics",
    icon: BiotechIcon,
    body: "Same-week labs and imaging read by pediatric radiologists.",
    image: "/images/photo-counseling-session.jpg",
  },
  {
    name: "Pediatric After Hours",
    role: "Nights & weekends",
    icon: NightlightIcon,
    body: "A pediatric nurse answers every call, 24 hours a day.",
    image: "/images/photo-pediatric-checkup.jpg",
  },
  {
    name: "LAIPT",
    role: "Therapy",
    icon: SportsGymnasticsIcon,
    body: "Physical, occupational and speech therapy for growing kids.",
    image: "/images/photo-physical-therapy.jpg",
  },
  {
    name: "HMO & IPA plans",
    role: "Coverage",
    icon: VerifiedUserIcon,
    body: "Most Los Angeles plans accepted, benefits checked before the visit.",
    image: "/images/photo-hospital-hallway.jpg",
  },
];

export default function Partners() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();
  const { ref: parallaxRef, offset } = useParallax<HTMLSpanElement>(0.06, 20);
  const [hovered, setHovered] = useState(-1);
  const previewIndex = hovered >= 0 ? hovered : 0;

  return (
    <section
      id="partners"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      onMouseLeave={() => setHovered(-1)}
      ref={ref}
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>
          We never treat
          <br />
          your family alone
        </h2>
        <p className={styles.subtext}>
          Five partnerships carry the weight behind every visit. You feel one clinic; behind it
          stands a network.
        </p>
      </div>
      <div className={styles.rows}>
        {PARTNERS.map((partner, i) => {
          const PartnerIcon = partner.icon;
          return (
            <a
              key={partner.name}
              href="#book"
              className={styles.row}
              onMouseEnter={() => setHovered(i)}
            >
              <PartnerIcon size={25} className={styles.icon} />
              <span className={styles.name}>{partner.name}</span>
              <span className={styles.role}>{partner.role}</span>
              <span className={styles.body}>{partner.body}</span>
              <ArrowOutwardIcon size={23} className={styles.arrow} />
            </a>
          );
        })}
        <span
          className={`${styles.previewWrap} ${hovered >= 0 ? styles.previewVisible : ""}`}
          ref={parallaxRef}
        >
          <span
            className={styles.previewImageLayer}
            style={{ transform: `translateY(${offset}px)` }}
          >
            <Image
              src={PARTNERS[previewIndex].image}
              alt={`${PARTNERS[previewIndex].name} preview`}
              fill
              className={styles.previewImage}
            />
          </span>
        </span>
      </div>
    </section>
  );
}
```

Note: `.previewWrap` keeps the existing hover show/hide `transform` (translate/scale/rotate); the parallax drift is applied to the inner `.previewImageLayer` instead so the two transforms do not collide. `.previewImageLayer` is oversized by 20px top/bottom (matching the hook's `max`), so the drift never reveals an empty edge inside the `overflow: hidden` `.previewWrap`.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Partners.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Partners.tsx components/Partners.module.css components/Partners.test.tsx
git commit -m "Add Partners section with hover preview and photo parallax"
```

---

### Task 13: JournalTeaser and Cta band

**Files:**
- Create: `components/JournalTeaser.tsx`
- Create: `components/JournalTeaser.module.css`
- Create: `components/Cta.tsx`
- Create: `components/Cta.module.css`
- Test: `components/JournalTeaser.test.tsx`
- Test: `components/Cta.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal` (Task 4), `ArrowOutwardIcon`, `CallIcon` (Task 5).
- Produces: `export default function JournalTeaser()`, `export default function Cta()`.

Source reference: `source-template.html:394-405` (journal), `:407-413` (CTA band).

- [ ] **Step 1: Write render tests**

`components/JournalTeaser.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JournalTeaser from "./JournalTeaser";

describe("JournalTeaser", () => {
  it("renders the article teaser copy", () => {
    render(<JournalTeaser />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
    expect(
      screen.getByText("10 essential habits for a healthier family year"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /read the piece/i })).toHaveAttribute(
      "href",
      "#insight",
    );
  });
});
```

`components/Cta.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Cta from "./Cta";

describe("Cta", () => {
  it("renders the closing headline and both call-to-action links", () => {
    render(<Cta />);
    expect(screen.getByRole("heading", { name: /ready when your family is/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book online/i })).toHaveAttribute("href", "#book");
    expect(screen.getByRole("link", { name: /555-0123/i })).toHaveAttribute(
      "href",
      "tel:13105550123",
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- components/JournalTeaser.test.tsx components/Cta.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement `components/JournalTeaser.module.css`**

```css
.section {
  position: relative;
  padding: 0 0 clamp(70px, 9vw, 118px);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.link {
  position: relative;
  display: block;
  padding: clamp(56px, 7vw, 96px) clamp(28px, 6vw, 96px) clamp(56px, 7vw, 96px) clamp(24px, 9vw, 150px);
  overflow: hidden;
}

.image {
  position: absolute;
  inset: 0;
  opacity: .45;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(6, 22, 28, .96) 32%, rgba(6, 22, 28, .35));
}

.content {
  position: relative;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: min(100%, 640px);
}

.kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--italic-highlight);
}

.kickerRule {
  width: 26px;
  height: 1px;
  background: rgba(122, 213, 213, .5);
}

.title {
  font-size: clamp(26px, 4.2vw, 58px);
  line-height: 1.06;
  letter-spacing: -.035em;
  font-weight: 800;
  color: #fff;
}

.body {
  font-size: 15.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, .72);
  max-width: 38ch;
}

.cta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--link);
}
```

- [ ] **Step 4: Implement `components/JournalTeaser.tsx`**

```tsx
"use client";

import Image from "next/image";
import styles from "./JournalTeaser.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon } from "@/components/icons";

export default function JournalTeaser() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="insight"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      data-dark="1"
      ref={ref}
    >
      <a href="#insight" className={styles.link}>
        <Image
          src="/images/photo-physical-therapy.jpg"
          alt=""
          fill
          className={styles.image}
        />
        <span className={styles.overlay} />
        <span className={styles.content}>
          <span className={styles.kicker}>
            Journal <span className={styles.kickerRule} /> 5 min read
          </span>
          <span className={styles.title}>10 essential habits for a healthier family year</span>
          <span className={styles.body}>
            Preventive care, sleep, screen time and nutrition: what our pediatricians actually
            recommend.
          </span>
          <span className={styles.cta}>
            Read the piece <ArrowOutwardIcon size={19} />
          </span>
        </span>
      </a>
    </section>
  );
}
```

- [ ] **Step 5: Implement `components/Cta.module.css`**

```css
.section {
  padding: clamp(70px, 9vw, 130px) clamp(28px, 6vw, 96px) clamp(60px, 7vw, 90px) clamp(24px, 9vw, 150px);
  background: var(--link);
  color: var(--bg);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
}

.revealed {
  opacity: 1;
  transform: translateY(0);
}

.heading {
  margin: 0;
  max-width: 16ch;
  font-size: clamp(40px, 7.4vw, 116px);
  line-height: .92;
  letter-spacing: -.045em;
  font-weight: 800;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 38px;
}

.primary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 34px;
  border-radius: 999px;
  background: var(--bg);
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  transition: background .3s ease;
}

.primary:hover {
  background: var(--bg-2);
  color: #fff;
}

.secondary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 34px;
  border-radius: 999px;
  border: 1px solid rgba(6, 22, 28, .35);
  color: var(--bg);
  font-weight: 800;
  font-size: 16px;
  transition: background .3s ease;
}

.secondary:hover {
  background: rgba(6, 22, 28, .08);
  color: var(--bg);
}
```

- [ ] **Step 6: Implement `components/Cta.tsx`**

```tsx
"use client";

import styles from "./Cta.module.css";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowOutwardIcon, CallIcon } from "@/components/icons";

export default function Cta() {
  const { ref, revealed } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="book"
      className={`${styles.section} ${revealed ? styles.revealed : ""}`}
      ref={ref}
    >
      <h2 className={styles.heading}>Ready when your family is.</h2>
      <div className={styles.actions}>
        <a href="#book" className={styles.primary}>
          Book online <ArrowOutwardIcon size={20} />
        </a>
        <a href="tel:13105550123" className={styles.secondary}>
          <CallIcon size={20} />
          (310) 555-0123
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test -- components/JournalTeaser.test.tsx components/Cta.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/JournalTeaser.tsx components/JournalTeaser.module.css components/Cta.tsx components/Cta.module.css components/JournalTeaser.test.tsx components/Cta.test.tsx
git commit -m "Add JournalTeaser and Cta band sections"
```

---

### Task 14: Footer

**Files:**
- Create: `components/Footer.tsx`
- Create: `components/Footer.module.css`
- Test: `components/Footer.test.tsx`

**Interfaces:**
- Consumes: `useTheme` (Task 3) to pick the correct logo image for the current theme.
- Produces: `export default function Footer()`.

Source reference: `source-template.html:415-451`.

- [ ] **Step 1: Write a render test**

`components/Footer.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the tagline, link columns, and contact details", () => {
    render(<Footer />);
    expect(
      screen.getByText(/pediatric and family healthcare across los angeles/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "#services");
    expect(screen.getByRole("link", { name: "Book appointment" })).toHaveAttribute("href", "#book");
    expect(screen.getByText("Santa Monica · (310) 555-0123")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contact@sgmdoctor.com" })).toHaveAttribute(
      "href",
      "mailto:contact@sgmdoctor.com",
    );
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/Footer.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/Footer.module.css`**

```css
.footer {
  padding: clamp(48px, 6vw, 76px) clamp(28px, 6vw, 96px) 34px clamp(24px, 9vw, 150px);
  background: var(--bg-2);
  border-top: 1px solid var(--line);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.brandColumn {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  display: block;
  height: 96px;
  width: 168px;
  object-fit: contain;
  object-position: left center;
}

.tagline {
  margin: 0;
  max-width: 30ch;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--muted);
}

.column {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.columnHeading {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: .17em;
  text-transform: uppercase;
  color: var(--muted-2);
}

.link {
  font-size: 14.5px;
  color: var(--ink-2);
}

.emailLink {
  font-size: 14.5px;
  font-weight: 600;
}

.bottomRow {
  margin-top: 44px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 14px;
  font-size: 13px;
  color: var(--muted-2);
}

.legalLinks {
  display: flex;
  gap: 22px;
}

.legalLinks a {
  color: var(--muted-2);
}
```

- [ ] **Step 4: Implement `components/Footer.tsx`**

```tsx
"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import { useTheme } from "@/hooks/useTheme";

export default function Footer() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/images/logo-dark.png" : "/images/logo-light.png";

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandColumn}>
          <Image
            src={logoSrc}
            alt="St. Gianna Medical Group"
            width={168}
            height={96}
            className={styles.logo}
          />
          <p className={styles.tagline}>
            Pediatric and family healthcare across Los Angeles. Same-day, telehealth, after
            hours.
          </p>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Explore</span>
          <a href="#services" className={styles.link}>Services</a>
          <a href="#why" className={styles.link}>Why us</a>
          <a href="#locations" className={styles.link}>Locations</a>
          <a href="#insight" className={styles.link}>Journal</a>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Patients</span>
          <a href="#book" className={styles.link}>Book appointment</a>
          <a href="#footer" className={styles.link}>Patient portal</a>
          <a href="#footer" className={styles.link}>Insurance &amp; billing</a>
          <a href="#footer" className={styles.link}>Careers</a>
        </div>
        <div className={styles.column}>
          <span className={styles.columnHeading}>Contact</span>
          <span className={styles.link}>Santa Monica &middot; (310) 555-0123</span>
          <span className={styles.link}>Hollywood &middot; (323) 555-0199</span>
          <span className={styles.link}>La Mirada &middot; (562) 555-0144</span>
          <a href="mailto:contact@sgmdoctor.com" className={styles.emailLink}>
            contact@sgmdoctor.com
          </a>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <span>&copy; 2026 St. Gianna Medical Group. All rights reserved.</span>
        <span className={styles.legalLinks}>
          <a href="#footer">Privacy</a>
          <a href="#footer">Terms</a>
          <a href="#footer">Accessibility</a>
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Footer.tsx components/Footer.module.css components/Footer.test.tsx
git commit -m "Add Footer with theme-aware logo"
```

---

### Task 15: BackToTop button (TDD)

**Files:**
- Create: `components/BackToTop.tsx`
- Create: `components/BackToTop.module.css`
- Test: `components/BackToTop.test.tsx`

**Interfaces:**
- Produces: `export function getBackToTopVisibility(scrollY: number): boolean` (pure, testable) and `export default function BackToTop()`.

- [ ] **Step 1: Write the failing tests**

`components/BackToTop.test.tsx`:

```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BackToTop, { getBackToTopVisibility } from "./BackToTop";

describe("getBackToTopVisibility", () => {
  it("is false near the top of the page", () => {
    expect(getBackToTopVisibility(0)).toBe(false);
    expect(getBackToTopVisibility(200)).toBe(false);
  });

  it("is true once scrolled past the threshold", () => {
    expect(getBackToTopVisibility(500)).toBe(true);
  });
});

describe("BackToTop", () => {
  it("is hidden by default and scrolls to top when clicked", () => {
    window.scrollTo = vi.fn();
    render(<BackToTop />);
    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button.className).not.toMatch(/visible/i);

    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("becomes visible after a scroll event past the threshold", () => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    render(<BackToTop />);
    fireEvent.scroll(window);
    const button = screen.getByRole("button", { name: /back to top/i });
    expect(button.className).toMatch(/visible/i);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- components/BackToTop.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement `components/BackToTop.module.css`**

```css
.button {
  position: fixed;
  right: 26px;
  bottom: 26px;
  z-index: 80;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  color: var(--bg);
  box-shadow: 0 18px 40px -18px rgba(0, 0, 0, .9);
  cursor: pointer;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity .3s ease, transform .3s ease, background .3s ease;
}

.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.button:hover {
  background: var(--accent);
}

@media (max-width: 859px) {
  .button {
    right: 16px;
    bottom: 82px;
    width: 46px;
    height: 46px;
  }
}
```

- [ ] **Step 4: Implement `components/BackToTop.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";
import { ArrowUpwardIcon } from "@/components/icons";

const SHOW_AFTER_PX = 480;

export function getBackToTopVisibility(scrollY: number): boolean {
  return scrollY > SHOW_AFTER_PX;
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(getBackToTopVisibility(window.scrollY));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUpwardIcon size={22} />
    </button>
  );
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- components/BackToTop.test.tsx`
Expected: PASS, all 4 tests.

- [ ] **Step 6: Commit**

```bash
git add components/BackToTop.tsx components/BackToTop.module.css components/BackToTop.test.tsx
git commit -m "Add BackToTop button with scroll-based visibility"
```

---

### Task 16: Compose the homepage and verify against the source

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Nav`, `Hero`, `TickerBar`, `Services`, `WhyUs`, `Locations`, `Partners`, `JournalTeaser`, `Cta`, `Footer`, `BackToTop` (Tasks 6-15).

- [ ] **Step 1: Implement `app/page.tsx`**

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TickerBar from "@/components/TickerBar";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Locations from "@/components/Locations";
import Partners from "@/components/Partners";
import JournalTeaser from "@/components/JournalTeaser";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { ArrowOutwardIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <div style={{ position: "relative", background: "var(--bg)", overflowX: "hidden" }}>
      <Nav />
      <a
        href="#book"
        style={{
          position: "fixed",
          right: "26px",
          top: "26px",
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 24px",
          borderRadius: "999px",
          background: "var(--ink)",
          color: "var(--bg)",
          fontWeight: 800,
          fontSize: "14.5px",
          letterSpacing: "-.01em",
          boxShadow: "0 18px 40px -18px rgba(0,0,0,.9)",
        }}
      >
        Book a visit <ArrowOutwardIcon size={18} />
      </a>
      <Hero />
      <TickerBar />
      <Services />
      <WhyUs />
      <Locations />
      <Partners />
      <JournalTeaser />
      <Cta />
      <Footer />
      <BackToTop />
    </div>
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS, every test file from Tasks 3-15.

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: succeeds with no type errors.

- [ ] **Step 4: Manual visual check against the source**

Run: `npm run dev`, open `http://localhost:3000`, and separately open
`docs/superpowers/specs/2026-08-06-homepage-rebuild-assets/source-template.html`'s rendered output (or the original downloaded file) side by side. Confirm section by section: hero video/gradient/headline, ticker marquee, all 6 service rows and hover preview, all 4 why-us cards, all 3 location panels (hover swap), all 5 partner rows and hover preview, journal teaser, CTA band, footer. Confirm the theme toggle swaps the logo and persists across a reload.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "Compose the full homepage from all sections"
```

---

### Task 17: Responsive QA, em dash sweep, and final verification

**Files:**
- Modify: any component CSS Module that fails the responsive check below.

- [ ] **Step 1: Check three viewport widths in the dev server**

With `npm run dev` running, resize the browser (or use device toolbar) to 375px, 768px, and 1280px. At each width confirm:
- Nav is the bottom pill bar with 5 icons below 860px, and the left vertical rail above it.
- Services/Partners side preview photos are hidden below 1180px and visible above it.
- Locations panels stack full-width below 640px.
- Footer grid collapses to fewer columns as width shrinks (this is automatic via `repeat(auto-fit, minmax(200px, 1fr))`).
- No horizontal scrollbar appears at any width.

Fix any component's CSS Module if a layout breaks (unexpected wrapping, overflow, illegible text) before moving on.

- [ ] **Step 2: Sweep for the forbidden em dash character**

Run:

```bash
grep -rn "—" app components hooks --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: no output. If any match appears, replace it with a comma or period and re-run.

- [ ] **Step 3: Run the full verification suite**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass, build succeeds with no type or lint errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Responsive QA pass and final verification"
```
