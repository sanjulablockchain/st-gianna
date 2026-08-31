# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

St. Gianna Medical Group marketing site — a Next.js 16 (App Router) + React 19 single-page site. No CSS framework; styling is plain CSS via per-component CSS Modules (`Component.module.css`) plus global tokens in [app/globals.css](app/globals.css).

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # eslint
npm test         # vitest run (jsdom + @testing-library/react)
```

Every component has a co-located `*.test.tsx`. Run the whole suite before considering a change done.

## Architecture

- `app/layout.tsx` — root layout, loads the Hanken Grotesk font, injects the pre-paint theme bootstrap script.
- `app/page.tsx` — the entire homepage is one column of section components (`Nav`, `Hero`, `TickerBar`, `Services`, `WhyUs`, `Locations`, `Partners`, `JournalTeaser`, `Cta`, `Footer`, `BackToTop`, `BookCta`).
- `components/*.tsx` + `components/*.module.css` — one section/UI piece per file pair.
- `components/icons/` — hand-rolled inline SVG icon set (`Icon.tsx` + `index.tsx`), not an icon package.
- `hooks/` — shared client hooks (`useTheme`, `useScrollReveal`, `useParallax`).
- `@/*` path alias maps to the repo root (see [tsconfig.json](tsconfig.json)).

## Required rules for all UI work

**1. Follow the current theme system — never hardcode colors.**
Theme is dark/light via `data-theme` on `<html>`, driven by [hooks/useTheme.ts](hooks/useTheme.ts) (persisted to `localStorage` under `sgm-theme`) and bootstrapped pre-paint in [app/layout.tsx](app/layout.tsx). All color values live as CSS custom properties in [app/globals.css](app/globals.css) (`--bg`, `--ink`, `--accent`, `--line`, etc.), defined once on `:root` (dark) and overridden under `html[data-theme="light"]`. Any new UI must:
- Use `var(--token)` for color/background/border — add a new token to both blocks in `globals.css` if one doesn't exist yet.
- Never introduce a literal hex/rgb color in a component or module CSS file.
- Verify the component looks correct in **both** themes (toggle via the nav's light/dark control) before calling work done.

**2. Follow responsive design for mobile / tablet / desktop.**
Breakpoints already established across the codebase (see `*.module.css`): `max-width: 640px` (mobile), `max-width: 859px`–`1179px` (tablet), `min-width: 1180px` (desktop/large). Any new UI must:
- Be built mobile-first and verified to not overflow, clip, or overlap at narrow widths.
- Reuse the existing breakpoint values above instead of inventing new ones, unless a component genuinely needs a different threshold.
- Be checked at mobile, tablet, and desktop widths (e.g. via browser devtools or Playwright resize) before calling work done.

**3. Follow the established scroll/parallax/reveal-animation system — don't hand-roll new motion patterns.**
Scroll-driven motion goes through [hooks/useScrollReveal.ts](hooks/useScrollReveal.ts) (`IntersectionObserver`-based fade/slide-in on entry) and [hooks/useParallax.ts](hooks/useParallax.ts) (scroll-position-driven offset via `requestAnimationFrame`). Both hooks already respect `prefers-reduced-motion`. Any new section or UI element with entrance/scroll motion must:
- Reuse `useScrollReveal`/`useParallax` instead of adding new scroll listeners, observers, or animation libraries.
- Preserve the `prefers-reduced-motion` bail-out — never ship motion that ignores it.
- Rely on `html.js` (see Gotchas) for the pre-hydration reveal state instead of introducing another flash-of-unanimated-content workaround.
- Be verified by scrolling the full page to confirm reveal/parallax timing looks correct alongside the theme and responsive checks above.

## Gotchas

- `html.js` class + `suppressHydrationWarning`: `app/layout.tsx` adds a pre-paint inline script that sets `document.documentElement.classList.add("js")` and reads the stored theme before React hydrates, so scroll-reveal CSS and theme don't flash-of-wrong-state on load. Don't remove this without checking `useScrollReveal`'s CSS dependency on `html.js`.
- `useTheme` uses a module-level store (`useSyncExternalStore`) shared across every component instance, not React context — all theme reads/writes go through [hooks/useTheme.ts](hooks/useTheme.ts).
- Images referenced by CSS `var(--logo-img)` swap per theme; see `public/images/logo-dark.png` / `logo-light.png`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
