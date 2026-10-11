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
- `src/pages/ContentPage.jsx` — generic renderer used for all custom (non-fixed) pages; receives its page object as a prop from the route, renders `title` + `body` via `renderBody.jsx`.
- `src/pages/renderBody.jsx` — parses a custom page's `body` string into React nodes. Beyond plain blank-line-delimited paragraphs, it supports: image lines (`![alt](/uploads/...)`), pipe-delimited markdown tables (header + `---` separator row), and a `:::columns\n<left>\n:::\n<right>\n:::end` fence that lays two blocks out side by side. This is the only place that syntax is interpreted — keep body-authoring conventions (in the admin editor and in `content.json`) in sync with what this parser actually accepts.
- `src/pages/Admin.jsx` — CMS UI at `/admin`. Fetches `GET /api/content`, edits in local state with a per-page-type editor (`HeroEditor`/`ContactEditor`/`ContentEditor`), and saves via `POST /api/content`. Supports adding/deleting custom pages (slug auto-generated from title); `home`/`about`/`contact` can't be deleted. Image uploads go through `POST /api/upload`.
- `vite.config.js` — defines a custom `cmsPlugin` middleware that only exists in `npm run dev`, exposing two endpoints: `/api/content` (`GET` reads `src/content.json`, `POST` overwrites it on disk — **editing content through `/admin` in dev directly rewrites the source file**) and `/api/upload` (`POST`, multipart-free raw body with a `?filename=` query param; writes into `public/uploads/`, converting `.heic`/`.heif` to `.jpg` via `heic-convert`). Neither endpoint exists in production.
- `src/index.css` — global reset + CSS custom properties (`--blue-primary`, `--blue-accent`, `--gold`, `--text-dark`, `--text-muted`) and base typography.

## Styling conventions

All component styles are **inline JS style objects** defined as `const xxxStyle = { … }` at the top of each file — no CSS modules, no Tailwind, no styled-components. The design tokens in `index.css` (CSS vars) are not yet referenced in component styles; the hex values are used directly. Keep this pattern consistent.

Color palette: blue gradient `#3770b2 → #2a5298` (nav/hero), gold `#ffb606` (primary CTA), white text on dark backgrounds.

## Production deployment

The site ships as a Docker image (`Dockerfile`): a `node:22-alpine` build stage runs `npm ci && npm run build`, then the `dist/` output is copied into an `nginx:1.27-alpine` stage alongside `nginx.conf`. Since this is a client-side SPA, `nginx.conf` falls back unknown paths to `index.html` (`try_files $uri $uri/ /index.html`) and long-caches `/assets/`.

Deploys go through a build-then-promote pipeline, all run manually from a dev machine (none of this is wired into CI):

1. `deploy.sh [tag]` — builds the image and pushes both `ghcr.io/spevzner/english-with-americans:<git-sha>` (or `[tag]`) and `:latest` to GHCR. Requires `docker login ghcr.io` first.
2. `deploy-stage.sh` — SSHes to the LAN staging host (`prodhost@new-host-17`) and runs `docker compose pull && docker compose up -d` there, then curls it to confirm it's up. Verify the change here first.
3. `deploy-prod.sh` — SSHes to the AWS production host (`ec2-user@44.199.165.106`, via `~/.ssh/linguaglobe-deploy.pem`), copies `docker-compose.yml` + `Caddyfile` over, and does the same pull/up, serving `https://linguaglobe.org/`. That IP is an Elastic IP (`eipalloc-00fc52a44e61eb23d`) attached to instance `i-062df5cd09d288d44`, so it survives stop/start; the `linguaglobe.org` and `www` A records in Route 53 zone `Z08191873TO7V6I04MV74` point at it. SSH (port 22) is only open to the home IP in security group `sg-04e44a26783caea7b` — if the home ISP address changes, run `allow-my-ip.sh` (swaps the rule to this machine's current public IP) or SSH/`deploy-prod.sh` will time out.

Both stage and prod pull the same `:latest` GHCR tag via `docker-compose.yml`, so `deploy.sh` must be run (and stage verified) before `deploy-prod.sh`.

### HTTPS (Caddy)

`docker-compose.yml` runs a `caddy` container in front of the site container: Caddy owns ports 80/443 and reverse-proxies to `web:80` (the nginx container no longer publishes a host port). Its site address comes from `SITE_ADDRESS`:
- **Prod**: `~/.env` on the EC2 host sets `SITE_ADDRESS=linguaglobe.org, www.linguaglobe.org` (not in the repo, not copied by `deploy-prod.sh` — it's per-host). Caddy obtains and auto-renews Let's Encrypt certs into the `caddy_data` volume and 308-redirects HTTP → HTTPS. Cert issuance needs port 80 reachable from the internet, so don't close it in the security group.
- **Unset** (staging): compose defaults it to `:80`, so Caddy serves plain HTTP with no cert attempts. `deploy-stage.sh` doesn't copy compose files, so the staging host keeps whatever `docker-compose.yml` it already has until one is copied there manually.

The `/admin` route exists in production but shows an error ("The CMS API is only available in development") because `/api/content` and `/api/upload` are dev-only Vite middleware, not a real backend. Production content changes must be made by editing `src/content.json` (and adding files under `public/uploads/`) directly, then redeployed via the pipeline above.

## Adding a page

Two ways:
- **Via the admin panel** (dev only): go to `/admin` → "+ Add Page", fill in title/body, Save. This writes a new entry to `src/content.json` and the route/nav link appear automatically (no code changes needed) because `App.jsx` derives routes from any non-fixed `content.json` entry.
- **Manually for a custom-shaped page** (e.g. one that isn't just title+body): create `src/pages/NewPage.jsx` exporting a default component, import it in `src/App.jsx`, and add a `<Route>` inside `<Routes>`. Add a `<Link>` in the nav if it belongs in the top navigation.
