# St. Gianna Medical Group

Marketing site for St. Gianna Medical Group, built with [Next.js](https://nextjs.org) (App Router) and React.

## Getting Started

Install dependencies, then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result. The homepage is composed in [app/page.tsx](app/page.tsx) from the section components in [components/](components/); edit a component and its matching `*.module.css` file to change a section.

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
npm test         # vitest (jsdom + @testing-library/react)
```

## Development Guidelines

- **Theme:** the site supports dark/light mode via the `data-theme` attribute and CSS custom properties defined in [app/globals.css](app/globals.css) (managed by [hooks/useTheme.ts](hooks/useTheme.ts)). All UI work must use the existing `var(--token)` colors — no hardcoded colors — and must be checked in both themes.
- **Responsive design:** all UI work must be verified across mobile, tablet, and desktop widths, using the breakpoints already established in the component `*.module.css` files (`640px`, `859px`/`1179px`, `1180px+`).

See [CLAUDE.md](CLAUDE.md) for more detailed architecture notes and conventions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
