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
| `src/components/Layout.jsx` | Navbar (with mobile hamburger), footer (with QR code + X/LinkedIn social links) |
| `src/components/ShareMenu.jsx` | Link/Download/Embed buttons + QR code per chart card |
| `src/index.css` | All styles including navbar, cards, dark-card theme, embed wrapper, responsive/mobile |
| `src/App.jsx` | Route definitions for normal and embed modes |
| `index.html` | Google Fonts (Source Serif 4, JetBrains Mono, DM Sans, IBM Plex Sans), analytics, SPA redirect script |
| `public/CNAME` | Custom domain — **do not delete** or deploys will break the domain |
| `public/data/nyc_fy_inflation_data.csv` | BLS CPI-U inflation data (FY2001–2025, NYC Metro Area) — downloadable source for inflation overlay |
| `src/data/nycPayroll2025.js` | FY2025 payroll data — agency totals (raw + filtered), OT by agency, top earners, salary distribution, summary stats |
| `src/components/PayrollCharts.jsx` | 6 payroll chart components + PayrollStats + shared hooks (useSelection, SelectionBar, FilterBadge) |

### Current Visualizations
1. **Expense Budget** (`/expense-budget`) — FY2026 + FY2027 pie charts, light cards
2. **State Trajectory** (`/state-trajectory`) — Slope chart + sortable table, dark cards
3. **Budget Through the Years** (`/nyc-budget-2002-2026`) — Total adopted expense budget FY2002–2026 across three mayors, with area chart and year-over-year bar chart as two independently shareable dark cards. Component imports ShareMenu directly (not via page wrapper). Features a "Show Inflation" toggle on the area chart that overlays NYC Metro CPI-U inflation rates (BLS data, FY2002–2025) as bars behind the budget line, with a right-side Y-axis for the percentage scale. When toggled, an "Avg Inflation Rate" stat box also appears in the stats row, dynamically computed for the selected FY range. Inflation source CSV downloadable from `public/data/nyc_fy_inflation_data.csv`. Uses `ComposedChart` from Recharts to mix Area and Bar on Chart 1; Chart 2 remains a standalone `BarChart`.
4. **Growth Chart** (`/growth-chart`) — Compound growth calculator with configurable scenarios, dark card
5. **NYC Payroll FY2025** (`/nyc-payroll-2025`) — Breakdown of NYC's $34.6B payroll across 550K+ municipal employees. Data sourced from NYC Open Data (dataset `k397-673e`) via Socrata API. Six dark-card charts on a single page:
   - **Top 20 Agencies** — Stacked horizontal bars (regular + overtime + other pay) with legend linking to "other pay" explanation
   - **Compensation Distribution** — Histogram with $10K bands, toggle to exclude under-$10K part-time/seasonal, dynamic median band highlight
   - **Total Overtime by Agency** — Top 20 agencies by OT dollars, gradient red bars
   - **Overtime as % of Regular Pay** — Agencies with >$5M OT, sorted by OT ratio
   - **Top 25 OT Earners** — Individual employees, grouped bars (regular vs overtime)
   - **Highest Base Salaries** — Top 25 by annual base salary, gradient gold bars
   - All charts support **click-to-select-and-sum**: click bars to select multiple, summary panel shows combined stats at top of chart
   - **Empire Center filter toggle** at page top: switches all charts between all employees (550,219) and >$0 total comp only (549,246), matching Empire Center methodology. Each chart shows a `FilterBadge` when active. Filtered data fetched from Socrata API and stored in `src/data/nycPayroll2025.js` alongside unfiltered data; agency processing uses shared `buildAgencyDatasets()` function to avoid duplication.
   - **Chart navigation menu**: horizontal pill buttons that smooth-scroll to each section via element IDs
   - **Data cleaning banner**: dismissible notice at top of page with last-updated date
   - Source paragraph with links to NYC Open Data dataset, Socrata API docs, and Empire Center report; explains employee count discrepancy (973 records with ≤$0 comp)
   - Key files: `src/data/nycPayroll2025.js` (all data + filtered variants), `src/components/PayrollCharts.jsx` (6 chart components + PayrollStats + shared utilities), `src/pages/PayrollPage.jsx` (page wrapper)

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
