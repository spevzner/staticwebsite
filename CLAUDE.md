# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (hot reload) — serves on http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

No test framework is configured.

## What this site is

"English with Americans" — a tutoring service landing site. Three pages: Home (hero with CTAs), About, Contact. Content on About and Contact is placeholder text ready to be filled in.

## Architecture

React 19 SPA built with Vite. Client-side routing via react-router-dom v7.

- `src/main.jsx` — mounts `<App />` in StrictMode
- `src/App.jsx` — `<BrowserRouter>` with sticky nav and `<Routes>`; add new routes here. The site name ("English with Americans") is the `<Link to="/">` in the nav.
- `src/pages/` — one file per route: `Home.jsx`, `About.jsx`, `Contact.jsx`
- `src/index.css` — global reset + CSS custom properties (`--blue-primary`, `--blue-accent`, `--gold`, `--text-dark`, `--text-muted`) and base typography

## Styling conventions

All component styles are **inline JS style objects** defined as `const xxxStyle = { … }` at the top of each file — no CSS modules, no Tailwind, no styled-components. The design tokens in `index.css` (CSS vars) are not yet referenced in component styles; the hex values are used directly. Keep this pattern consistent.

Color palette: blue gradient `#3770b2 → #2a5298` (nav/hero), gold `#ffb606` (primary CTA), white text on dark backgrounds.

## Production server config

Since this is a client-side SPA, the web server must serve `index.html` for all routes. Nginx example:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

The `/admin` route exists in production but shows an error (the save API only works in dev). This is intentional.

## Adding a page

1. Create `src/pages/NewPage.jsx` exporting a default component.
2. Import it in `src/App.jsx` and add a `<Route>` inside `<Routes>`.
3. Add a `<Link>` in the nav `<div>` if it belongs in the top navigation.
