# Maximum New York Data Viz Site

## Project Overview
This is the **Maximum New York Data Viz** site — a collection of interactive data visualizations. It lives at **https://data.maximumnewyork.com** and is deployed to GitHub Pages from the `gh-pages` branch.

- **Repo**: https://github.com/danielgolliher/nyc-budget-graphics
- **Branch**: `main` (single branch workflow)
- **Custom domain**: `data.maximumnewyork.com` (CNAME file in `public/` preserves this across deploys)

## Tech Stack
- **Vite** + **React 18** (JSX, no TypeScript)
- **React Router v6** with `BrowserRouter` (clean URLs, no hash)
- **Recharts** for chart visualizations
- **html2canvas** for PNG downloads
- **qrcode.react** for QR codes on pages and in downloads
- **gh-pages** for deployment

## Key Commands
- `npm run dev` — local dev server (Vite)
- `npm run build` — production build to `dist/`
- `npm run deploy` — build + deploy to GitHub Pages (`vite build && gh-pages -d dist`)

## Architecture

### Routing
- `src/main.jsx` — BrowserRouter wrapper
- `src/App.jsx` — Two route modes:
  - **Normal routes** (`/`, `/<slug>`) — wrapped in `Layout` (navbar + footer)
  - **Embed routes** (`/embed/<slug>`) — same page components but wrapped in `.embed-wrapper` which hides page headers, share buttons, and chrome via CSS
- `public/404.html` + script in `index.html` — SPA redirect trick for GitHub Pages (rewrites paths to query params and back)

### Adding a New Visualization
1. Create the chart component in `src/components/`
2. Create a page wrapper in `src/pages/` following the pattern:
   - `page-container` > `page-header` (title + subtitle) > `chart-card` (with `dark-card` class if dark theme)
   - Include `ShareMenu` with `chartRef`, `chartId`, `title`, and `dark` prop if dark card
3. Create a preview SVG thumbnail in `public/previews/` (200×140, simplified visual)
4. Add entry to `src/categories.js` with `slug`, `label`, `description`, `preview`, and lazy-loaded `component`
5. Everything else (routing, nav links, embed routes, homepage card) is automatic from the categories array

### Key Files
| File | Purpose |
|------|---------|
| `src/categories.js` | Central registry of all visualizations — drives nav, routes, homepage grid, and embed routes |
| `src/components/Layout.jsx` | Navbar (with mobile hamburger), footer (with QR code) |
| `src/components/ShareMenu.jsx` | Link/Download/Embed buttons + QR code per chart card |
| `src/index.css` | All styles including navbar, cards, dark-card theme, embed wrapper, responsive/mobile |
| `src/App.jsx` | Route definitions for normal and embed modes |
| `index.html` | Google Fonts (Source Serif 4, JetBrains Mono, DM Sans, IBM Plex Sans), analytics, SPA redirect script |
| `public/CNAME` | Custom domain — **do not delete** or deploys will break the domain |

### Current Visualizations
1. **Expense Budget** (`/expense-budget`) — FY2026 + FY2027 pie charts, light cards
2. **State Trajectory** (`/state-trajectory`) — Slope chart + sortable table, dark cards
3. **Growth Chart** (`/growth-chart`) — Compound growth calculator with configurable scenarios, dark card

### Design System
- **Brand color**: `#BE5343` (Maximum New York red) — set as `--color-accent` in CSS
- **Navbar**: Gradient red background with shadow, mobile hamburger menu
- **Dark cards**: `#0a0e17` background, used for State Trajectory and Growth Chart
- **Light cards**: White background, used for Expense Budget
- **Fonts**: Source Serif 4 (display), DM Sans (body), JetBrains Mono (mono), IBM Plex Sans (Growth Chart component)
- **QR codes**: Appear in footer (every page) and top-right of each chart card; included in PNG downloads

### ShareMenu Behavior
- **Link**: Copies canonical page URL (uses `useLocation` for clean path)
- **Download**: html2canvas capture of `chartRef`, excludes `.share-menu-controls` (but keeps QR), adds red credit bar with attribution
- **Embed**: Generates iframe pointing to `/embed/<slug>` route (chart-only, no site chrome)

### Deployment Notes
- Always use `npm run deploy` which builds and pushes to `gh-pages` branch
- The `public/CNAME` file is critical — it gets copied to `dist/` and preserves the custom domain
- GitHub Pages takes 1-2 minutes to update after deploy (occasionally up to 10)
- After pushing to `main`, also run `npm run deploy` to update the live site
