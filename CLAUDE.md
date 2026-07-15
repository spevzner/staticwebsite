# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (hot reload + CMS API) — serves on http://localhost:5173
npm run build     # tsc typecheck, then production build → dist/
npm run preview   # Preview the production build locally
```

No `lint` npm script and no test framework are configured, despite `eslint.config.js` existing — run `npx eslint .` directly if you need to lint.

## What this site is

"English with Americans" — a tutoring service landing site with a hand-rolled, dev-only CMS. Pages: Home (hero with CTAs), About, Contact, plus any number of custom pages created through the `/admin` panel.

## Architecture

React 19 SPA built with Vite. Client-side routing via react-router-dom v7. **Content is data-driven**: all page copy lives in `src/content.json`, not hardcoded in components.

- `src/main.jsx` — actual entry point, mounts `<App />` in StrictMode (referenced by `index.html`). Note: `src/main.ts`, `src/counter.ts`, `src/style.css`, `src/App.css`, `src/typescript.svg` are unused leftovers from the vanilla-TS Vite template — safe to ignore/delete, not part of the app.
- `src/App.jsx` — `<BrowserRouter>` with sticky nav and `<Routes>`. Fixed routes (`/`, `/about`, `/contact`, `/admin`) are hardcoded; any `content.json` page whose `id` isn't `home`/`about`/`contact` gets an auto-generated `<Route>` + nav `<Link>` rendered via `ContentPage`.
- `src/content.json` — single source of truth for page content, keyed by page `id` with a `slug` for routing. `home`/`about`/`contact` have bespoke shapes (headline/tagline/CTAs; title/body; title/intro/email/phone/location); custom pages use a generic `title` + `body` (paragraphs separated by blank lines).
- `src/pages/Home.jsx`, `About.jsx`, `Contact.jsx` — each imports `content.json` directly and looks up its own page by `id`.
- `src/pages/ContentPage.jsx` — generic renderer used for all custom (non-fixed) pages; receives its page object as a prop from the route.
- `src/pages/Admin.jsx` — CMS UI at `/admin`. Fetches `GET /api/content`, edits in local state with a per-page-type editor (`HeroEditor`/`ContactEditor`/`ContentEditor`), and saves via `POST /api/content`. Supports adding/deleting custom pages (slug auto-generated from title); `home`/`about`/`contact` can't be deleted.
- `vite.config.js` — defines a custom `cmsPlugin` middleware that only exists in `npm run dev`: it serves `GET /api/content` (reads `src/content.json`) and `POST /api/content` (overwrites `src/content.json` on disk). **This means editing content through `/admin` in dev directly rewrites the source file.** There is no such endpoint in production.
- `src/index.css` — global reset + CSS custom properties (`--blue-primary`, `--blue-accent`, `--gold`, `--text-dark`, `--text-muted`) and base typography.

## Styling conventions

All component styles are **inline JS style objects** defined as `const xxxStyle = { … }` at the top of each file — no CSS modules, no Tailwind, no styled-components. The design tokens in `index.css` (CSS vars) are not yet referenced in component styles; the hex values are used directly. Keep this pattern consistent.

Color palette: blue gradient `#3770b2 → #2a5298` (nav/hero), gold `#ffb606` (primary CTA), white text on dark backgrounds.

## Production deployment

The site ships as a Docker image (`Dockerfile`): a `node:22-alpine` build stage runs `npm ci && npm run build`, then the `dist/` output is copied into an `nginx:1.27-alpine` stage alongside `nginx.conf`. Since this is a client-side SPA, `nginx.conf` falls back unknown paths to `index.html` (`try_files $uri $uri/ /index.html`) and long-caches `/assets/`.

- `deploy.sh` — builds the image, tags it `ghcr.io/spevzner/english-with-americans:<git-sha>` and `:latest`, and pushes both to GHCR. Requires `docker login ghcr.io` first. Run manually (`./deploy.sh [tag]`); not wired into CI.
- `docker-compose.yml` — pulls the `:latest` GHCR image and runs it on port 80. Used on the deploy target, not for local dev (local dev is `npm run dev`, not Docker).

The `/admin` route exists in production but shows an error ("The CMS API is only available in development") because the `/api/content` endpoint is a dev-only Vite middleware, not a real backend. Production content changes must be made by editing `src/content.json` directly, then redeployed via `deploy.sh` + `docker compose pull && docker compose up -d` on the target.

## Adding a page

Two ways:
- **Via the admin panel** (dev only): go to `/admin` → "+ Add Page", fill in title/body, Save. This writes a new entry to `src/content.json` and the route/nav link appear automatically (no code changes needed) because `App.jsx` derives routes from any non-fixed `content.json` entry.
- **Manually for a custom-shaped page** (e.g. one that isn't just title+body): create `src/pages/NewPage.jsx` exporting a default component, import it in `src/App.jsx`, and add a `<Route>` inside `<Routes>`. Add a `<Link>` in the nav if it belongs in the top navigation.
