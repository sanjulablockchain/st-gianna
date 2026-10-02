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

## Rules (non negotiable)

1. **Responsive.** Every page and component must work on mobile, tablet and desktop. Build mobile first, then add `sm:` / `md:` / `lg:` / `xl:` overrides. Check at 375px, 768px and 1280px. No horizontal scroll at any width. Tap targets at least 44px.
2. **No dash punctuation in visible text.** Never use em dashes, en dashes, or a hyphen as punctuation (" - ") in any copy, headings, labels, alt text, metadata or button text. Rewrite the sentence with a comma, colon, period or "and" instead. Hyphens are fine in code, class names, URLs and filenames. `npm run check:dashes` enforces this. Also avoid them in commit messages and docs we write.
3. **Always follow the theme.** Use only the tokens in `src/app/globals.css` (`@theme`): `bg-primary`, `text-ink`, `rounded-card`, `shadow-card`, `max-w-site`, etc. No raw hex values, no arbitrary color classes like `bg-[#123456]`, no inline styles for colors. Need a new value? Add a token to `@theme` first, then use it.
4. **Commit everything.** Small, focused commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`). Never leave work uncommitted at the end of a task. The working tree must be clean when done.
5. **New feature means a new git worktree.** Never build features directly on `main`:
   ```bash
   git worktree add .worktrees/<feature> -b feat/<feature>
   cd .worktrees/<feature> && npm install
   # work, commit
   cd ../.. && git merge --no-ff feat/<feature>
   git worktree remove .worktrees/<feature> && git branch -d feat/<feature>
   ```
   `.worktrees/` is gitignored. Small chores (docs, config) may go straight to `main`.
6. **Follow the folder architecture.** Put new files where they belong. Do not invent new top level folders without updating this file.
7. **Tailwind CSS only.** No CSS modules, styled components or other CSS files. `globals.css` holds only the theme tokens and base layer. Merge classes with `cn()` from `@/lib/cn`.
8. **Light mode and dark mode.** Everything must look right in both. The site follows the OS setting by default and visitors can switch with the ThemeToggle in the header (`next-themes`, `data-theme` on `<html>`). Every color token has a dark value in `@theme` and a light value in `:root[data-theme="light"]` in `globals.css`, so use tokens and colors switch on their own. When adding a token, define both values. Use `dark:` classes only for things tokens cannot cover (for example swapping an image or logo). Text on gold fills uses `text-void` or `text-on-gold`. Check every change in both modes, with readable contrast (WCAG AA).
9. **Images optimized for fast loading.** Every image must be light and load fast on slow networks:
   - Always render with `next/image` (never a raw `<img>`). It serves AVIF / WebP at the right size.
   - Always set `sizes` for responsive images and `width` / `height` (or `fill` with a sized parent) so there is no layout shift.
   - Only the first visible (above the fold) image gets `priority`; everything else lazy loads.
   - Use `placeholder="blur"` for large photos (static imports get this for free).
   - Before committing, resize to at most 2x the largest display size and compress. Photos as `.webp` or `.jpg`, graphics and logos as optimized `.svg`. Limits: raster 300 KB, SVG 50 KB.
   - Files in `public/images` and `public/icons` are cached for a year, so when replacing an image give it a new filename.
   - `npm run check:images` enforces size limits.
10. **No external image links.** Every image (photos, logos, icons, backgrounds, Open Graph images) is downloaded into `public/images` or `public/icons` and served from our own domain. Never use a CDN, hotlink or third party URL for an image. `next.config.ts` has no `remotePatterns` and the CSP only allows `img-src 'self'`, so external images will break. `npm run check:images` enforces this.
11. **Tight security, always.** Think about security in every change:
    - Keep the security headers and CSP in `next.config.ts`. Never loosen them (new external domains, `unsafe-eval` in production, removing headers) without asking the user first.
    - No third party scripts, trackers, embeds or iframes without explicit user approval. Load fonts only through `next/font` (self hosted).
    - Never commit secrets. Keep them in `.env.local` (gitignored). Only `NEXT_PUBLIC_*` values reach the browser, so never put secrets in them.
    - Never use `dangerouslySetInnerHTML`, `eval` or unsanitized user input in the DOM.
    - Forms: validate and sanitize on the server (Server Actions or Route Handlers), limit input length, add spam protection, and never trust client side validation alone.
    - External links use `target="_blank" rel="noopener noreferrer"`.
    - Treat any patient or health information as sensitive: never log it, never put it in URLs.
    - Add dependencies only when needed, prefer well maintained packages, and keep `npm run check:audit` clean.

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
