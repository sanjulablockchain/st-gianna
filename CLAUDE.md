# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

St. Gianna Medical Group marketing site: a Next.js 16 (App Router) + React 19 multi page site. No CSS framework. Styling is plain CSS via per-component CSS Modules (`Component.module.css`) plus global tokens in [app/globals.css](app/globals.css).

## Commands

```bash
npm run dev            # start dev server (localhost:3000)
npm run build          # production build
npm run lint           # eslint
npm test               # vitest run (jsdom + @testing-library/react)
npm run check:dashes   # no em or en dashes in source
npm run check:images   # image size limits, no external image URLs
npm run check:audit    # npm audit, high severity and above
npm run gen:blur       # regenerate lib/blurData.json after adding or replacing a photo
```

Every component has a co-located `*.test.tsx`. Run the whole suite and the three `check:*` scripts before considering a change done.

## Architecture

- `app/layout.tsx`: root layout, loads the Hanken Grotesk font, injects the pre-paint theme bootstrap script.
- `app/page.tsx`: the homepage is one column of section components. Other routes live in `app/<route>/page.tsx`.
- `app/api/`: Route Handlers (the contact form).
- `components/*.tsx` + `components/*.module.css`: one section or UI piece per file pair.
- `components/icons/`: hand rolled inline SVG icon set (`Icon.tsx` + `index.tsx`), not an icon package.
- `hooks/`: shared client hooks (`useTheme`, `useScrollReveal`, `useParallax`).
- `lib/`: server and shared helpers (`validation`, `rateLimit`, `email/`).
- `scripts/`: repo checks run by the `check:*` npm scripts.
- `public/images/`: every image the site serves. `public/videos/`: the hero video.
- `@/*` path alias maps to the repo root (see [tsconfig.json](tsconfig.json)).

## Rules (non negotiable)

1. **Responsive.** Every page and component must work on mobile, tablet and desktop. Build mobile first, then add wider overrides with `min-width` media queries. Check at 375px, 768px and 1280px. No horizontal scroll at any width. Tap targets at least 44px. Reuse the breakpoints already in the codebase: `640px` (mobile), `860px` and `1180px` (tablet and desktop). Only invent a new threshold when a component genuinely needs one.
2. **No dash punctuation in visible text.** Never use em dashes, en dashes, or a hyphen as punctuation (" - ") in any copy, headings, labels, alt text, metadata or button text. Rewrite the sentence with a comma, colon, period or "and" instead. Hyphens are fine in code, class names, URLs and filenames. `npm run check:dashes` enforces this for source files. Also avoid them in commit messages and docs we write.
3. **Always follow the theme.** Use only the CSS custom properties in [app/globals.css](app/globals.css) (`--bg`, `--ink`, `--accent`, `--line` and so on), defined on `:root` (dark) and overridden under `html[data-theme="light"]`. No raw hex or rgb values in any component or module CSS file. To tint a token, use `color-mix(in srgb, var(--token) 40%, transparent)`. Need a new value? Add a token to both blocks in `globals.css` first, then use it. Text on accent fills uses `--on-accent`.
4. **Commit everything.** Small, focused commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`). Never leave work uncommitted at the end of a task. The working tree must be clean when done.
5. **New feature means a new git worktree.** Never build features directly on `main`:
   ```bash
   git worktree add .worktrees/<feature> -b feat/<feature>
   cd .worktrees/<feature> && npm install
   # work, commit
   cd ../.. && git merge --no-ff feat/<feature>
   git worktree remove .worktrees/<feature> && git branch -d feat/<feature>
   ```
   `.worktrees/` is gitignored. Small chores (docs, config) and fixes may go straight to `main`.
6. **Follow the folder architecture** in the Architecture section. Put new files where they belong. Do not invent new top level folders without updating this file.
7. **Styling is CSS Modules.** One `Component.module.css` per component, next to it. No Tailwind, styled components or other CSS files. [app/globals.css](app/globals.css) holds only the theme tokens and base layer.
8. **Light mode and dark mode.** Everything must look right in both. Theme is driven by `data-theme` on `<html>` through [hooks/useTheme.ts](hooks/useTheme.ts), persisted to `localStorage` under `sgm-theme`, and bootstrapped before paint in [app/layout.tsx](app/layout.tsx). Every color token has a dark value on `:root` and a light value under `html[data-theme="light"]`. When adding a token, define both. Check every change in both themes (toggle with the nav control) with readable contrast (WCAG AA).
9. **Scroll motion reuses the existing hooks.** Use [hooks/useScrollReveal.ts](hooks/useScrollReveal.ts) (`IntersectionObserver` fade and slide in) and [hooks/useParallax.ts](hooks/useParallax.ts) (scroll driven offset), not new scroll listeners, observers or animation libraries. Keep the `prefers-reduced-motion` bail-out. Rely on `html.js` (see Gotchas) for the pre-hydration reveal state. Scroll the full page to confirm timing before calling work done.
10. **Images optimized for fast loading.** Every image must be light and load fast on slow networks:
    - Always render with `next/image` (never a raw `<img>`). It serves AVIF / WebP at the right size.
    - Always set `sizes` for responsive images and `width` / `height` (or `fill` with a sized parent) so there is no layout shift.
    - Only the first visible (above the fold) image gets `priority`; everything else lazy loads.
    - Use `placeholder="blur"` for large photos. Spread `{...blurProps(src)}` from `@/lib/blur`, and run `npm run gen:blur` after adding a photo.
    - Before committing, resize to at most 2x the largest display size and compress. Photos as `.webp` or `.jpg`, graphics and logos as optimized `.svg`. Limits: raster 300 KB, SVG 50 KB.
    - Files in `public/images` are cached for a year, so when replacing an image give it a new filename.
    - `npm run check:images` enforces size limits.
11. **No external image links.** Every image (photos, logos, icons, backgrounds, Open Graph images) is downloaded into `public/images` and served from our own domain. Never use a CDN, hotlink or third party URL for an image. The CSP only allows `img-src 'self'`, so external images will break. The one approved exception is the OpenStreetMap tile server used by the map on `/locations`. `npm run check:images` enforces this.
12. **Tight security, always.** Think about security in every change:
    - Keep the security headers and CSP in `next.config.ts`. Never loosen them (new external domains, `unsafe-eval` in production, removing headers) without asking the user first.
    - No third party scripts, trackers, embeds or iframes without explicit user approval. Load fonts only through `next/font` (self hosted).
    - Never commit secrets. Keep them in `.env.local` (gitignored). Only `NEXT_PUBLIC_*` values reach the browser, so never put secrets in them.
    - Never use `dangerouslySetInnerHTML`, `eval` or unsanitized user input in the DOM. The one allowed use is the fixed theme bootstrap string in `app/layout.tsx`.
    - Forms: validate and sanitize on the server (Route Handlers), limit input length, add spam protection, and never trust client side validation alone.
    - External links use `target="_blank" rel="noopener noreferrer"`.
    - Treat any patient or health information as sensitive: never log it, never put it in URLs.
    - Add dependencies only when needed, prefer well maintained packages, and keep `npm run check:audit` clean.

## Gotchas

- `html.js` class + `suppressHydrationWarning`: `app/layout.tsx` adds a pre-paint inline script that sets `document.documentElement.classList.add("js")` and reads the stored theme before React hydrates, so scroll-reveal CSS and theme don't flash the wrong state on load. Don't remove this without checking `useScrollReveal`'s CSS dependency on `html.js`.
- `useTheme` uses a module-level store (`useSyncExternalStore`) shared across every component instance, not React context. All theme reads and writes go through [hooks/useTheme.ts](hooks/useTheme.ts).
- Images referenced by CSS `var(--logo-img)` swap per theme; see `public/images/logo-dark.png` / `logo-light.png`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
