# Maximum New York Data Viz & Art

Interactive visualizations of New York City data, live at **https://data.maximumnewyork.com**. Built with React + Vite and hosted on GitHub Pages.

## Quick Start

```bash
npm install
npm run dev       # local dev server at localhost:5173
npm run build     # production build to /dist
npm run preview   # serve the production build locally (includes the Content-Security-Policy)
```

## Deployment

Pushing to `main` deploys automatically: `.github/workflows/deploy.yml` builds the site and publishes `dist/` to the `gh-pages` branch, which GitHub Pages serves on the custom domain in `public/CNAME`. `npm run deploy` does the same from your machine if you ever need it.

## Project Structure

```
src/
  categories.js       # Registry of every page: nav, homepage cards, routes, titles, social tags
  pageComponents.js   # Slug → lazy-loaded page component
  App.jsx             # Routes (normal + /embed/<slug>), 404, error boundary
  components/         # Charts, Layout (navbar + footer), ShareMenu
  pages/              # One wrapper per visualization
  data/               # Data files
scripts/
  site-pages.js       # Vite plugin: per-page HTML with social tags, 404, sitemap, robots, CSP
  refresh-bills.mjs   # Weekly Council Quest bill refresh (run by GitHub Actions)
email-worker/         # Cloudflare Worker that emails Met Explorer favorites
docs/
  CHART_STYLE.md      # Chart design spec
  ADDING_DATA.md      # Adding a new fiscal year of budget data
```

See `CLAUDE.md` for the full architecture, how to add a page, and deployment details.

## Data Sources

Each page cites its sources. Budget figures come from the NYC Office of Management and Budget's "Summary of the Expense Budget by Agency" tables, published with the annual budget documents.
