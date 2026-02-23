# Maximum New York Data Viz & Art Site

## Project Overview
This is the **Maximum New York Data Viz & Art** site — a collection of interactive data visualizations. It lives at **https://data.maximumnewyork.com** and is deployed to GitHub Pages from the `gh-pages` branch.

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
- **Per-route `index.html` files** in `public/<slug>/` — each has page-specific OG/Twitter meta tags for rich social media previews, plus the same SPA redirect script so browsers still land in the React app. GitHub Pages serves these directly (not via 404), so crawlers see the meta tags.
- **Homepage** (`src/pages/HomePage.jsx`) — Shows all visualization cards from `categories.js`, with subtitle containing contact info (email `daniel@maximumnewyork.com` + LinkedIn/X links)

### Adding a New Visualization
1. Create the chart component in `src/components/`
2. Create a page wrapper in `src/pages/` following the pattern:
   - `page-container` > `page-header` (title + subtitle) > `chart-card` (with `dark-card` class if dark theme)
   - Include `ShareMenu` with `chartRef`, `chartId`, `title`, and `dark` prop if dark card
3. Create a preview SVG thumbnail in `public/previews/` (200×140, simplified visual)
4. Add entry to `src/categories.js` with `slug`, `label`, `description`, `preview`, and lazy-loaded `component`. Optionally add `navLabel` for a shorter name in the nav dropdown (falls back to `label`)
5. Everything else (routing, nav links, embed routes, homepage card) is automatic from the categories array

### Key Files
| File | Purpose |
|------|---------|
| `src/categories.js` | Central registry of all visualizations — drives nav, routes, homepage grid, and embed routes. Optional `navLabel` field for shorter dropdown names |
| `src/components/Layout.jsx` | Navbar (with "MNY" monogram, "Explore" dropdown menu, "Pigeons" toggle, mobile hamburger), footer (with QR code + X/LinkedIn social links) |
| `src/components/PigeonOverlay.jsx` | Site-wide 2D canvas pigeon particle effect — ~28 pigeons + drifting feathers, toggled from navbar |
| `src/components/ShareMenu.jsx` | Link/Download/Embed buttons + QR code per chart card |
| `src/index.css` | All styles including navbar, cards, dark-card theme, embed wrapper, responsive/mobile |
| `src/App.jsx` | Route definitions for normal and embed modes |
| `index.html` | Google Fonts (Source Serif 4, JetBrains Mono, DM Sans, IBM Plex Sans), analytics, SPA redirect script |
| `public/CNAME` | Custom domain — **do not delete** or deploys will break the domain |
| `public/<slug>/index.html` | Per-route HTML files with page-specific OG/Twitter meta tags + SPA redirect script — enables rich social media previews for each page |
| `public/og-met-explorer.jpg` | Met Explorer social preview image (Degas' *The Dance Class*) |
| `public/data/nyc_fy_inflation_data.csv` | BLS CPI-U inflation data (FY2001–2025, NYC Metro Area) — downloadable source for inflation overlay |
| `src/data/nycPayroll2025.js` | FY2025 payroll data — agency totals (raw + filtered), OT by agency, top earners, salary distribution, summary stats |
| `src/components/PayrollCharts.jsx` | 6 payroll chart components + PayrollStats + shared hooks (useSelection, SelectionBar, FilterBadge) |
| `src/components/MetExplorer.jsx` | Met Museum Explorer — gallery, search, detail overlay, favorites system, email panel |
| `src/components/metExplorerStyles.css` | All Met Explorer styles (warm cream/gold theme, cards, overlays, favorites panel, FAB) |
| `email-worker/index.js` | Cloudflare Worker that sends favorites email via Resend API |

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
   - **Empire Center filter toggle** at page top: switches all charts between all employees (550,219) and >$0 total comp only (549,246), matching Empire Center methodology. Each chart shows a `FilterBadge` when active (with shorter text on mobile). Toggling the filter clears all bar selections via key-prop remounting. Filtered data fetched from Socrata API and stored in `src/data/nycPayroll2025.js` alongside unfiltered data; agency processing uses shared `buildAgencyDatasets()` function to avoid duplication.
   - **Sticky chart navigation**: pill buttons that smooth-scroll to each section, sticks below navbar on scroll (`position: sticky; top: var(--nav-height)`). Active section highlighted via `IntersectionObserver`. On mobile, pills scroll horizontally with hidden scrollbar.
   - **Fiscal year selector**: disabled `<select>` with FY2025/2024/2023 options, grayed out with a pulsing "Coming Soon!" badge (`@keyframes comingSoonPulse`). Positioned above the filter toggle.
   - **Data cleaning banner**: amber-styled notice at top of page with last-updated date
   - **Mobile responsiveness**: filter toggle and FilterBadge use dual-span pattern (`.filter-label-full` / `.filter-label-short`) for shorter text on small screens. Mobile tap hint shown below nav pills. FY selector stacks vertically on mobile.
   - **Consolidated source line**: single source attribution at bottom of page (replaces per-chart source lines)
   - Source paragraph with links to NYC Open Data dataset, Socrata API docs, and Empire Center report; explains employee count discrepancy (973 records with ≤$0 comp)
   - Key files: `src/data/nycPayroll2025.js` (all data + filtered variants), `src/components/PayrollCharts.jsx` (6 chart components + PayrollStats + shared utilities), `src/pages/PayrollPage.jsx` (page wrapper)
6. **Met Museum Explorer** (`/met-explorer`) — Interactive gallery for browsing 500,000+ artworks from The Met's open collection API (`collectionapi.metmuseum.org`). Warm cream/gold design theme distinct from other pages.
   - **Hero image**: Featured artwork displayed as full-width banner with gradient overlay showing title, artist, and date. Click to open detail view. "Next" arrow button (→) on hover (always visible on mobile) swaps a random gallery artwork into the hero slot.
   - **Search**: Free-text search bar that queries the Met API. Results replace the gallery grid. Placeholder dynamically shows department name when a department filter is active (e.g. "Search in European Paintings..."). During loading with a department filter, a context line shows "Searching in {department}..."
   - **Department filters**: Chip buttons for 19 Met departments. "All" chip is visually distinct (dashed border, bold text) with a vertical separator after it. Chips wrap on desktop (`flex-wrap`) for full visibility; horizontally scroll on mobile (`max-width: 600px`).
   - **Surprise Me**: Button that picks a random department and loads its artworks with shuffled results.
   - **Gallery grid**: 4-column card grid (3 on tablet, 2 on mobile) with 3:4 aspect ratio image thumbnails, title, and artist. Lazy-loaded images, staggered fade-in animation. **Infinite scroll** via `IntersectionObserver` on a sentinel div — auto-loads next batch of 12 when scrolling near the bottom. Loading indicator shown during fetch.
   - **Zero-results state**: When search returns no results, shows the search term and active department in the message, plus a "Clear Search" button.
   - **Detail overlay**: Full artwork view with high-res image, metadata fields (department, medium, dimensions, classification, credit line, accession number), "View on Met Museum" link, and favorite/unfavorite button. Docked below navbar (`top: var(--nav-height)`) on desktop; full-screen takeover on mobile. Closes via ✕, Escape, or backdrop click. Body scroll lock with `position: fixed` + scroll position save/restore to prevent iOS viewport shift.
   - **Favorites system**: Session-only (no persistence). Uses `Map` keyed by `objectID` for O(1) lookup + insertion order.
     - **Star buttons**: On gallery cards (top-right of image, visible on hover/always on mobile), hero image, and detail overlay. Gold filled when starred, outline when not. `e.stopPropagation()` prevents opening detail view.
     - **Floating action button (FAB)**: Fixed bottom-right, gold circle with star icon + count badge. Appears when `favorites.size > 0`. Opens the side panel.
     - **Favorites side panel**: Slides in from right (`min(380px, 85vw)` — tablet-friendly, full-width on phone). Contains: header with count, amber session notice, scrollable list of favorited artworks (60×60 thumbnails, title, artist, remove button), and email form footer. Click artwork to open detail overlay. Escape/backdrop to close. Body scroll lock.
     - **Email favorites**: User enters email and clicks "Send". POSTs to a **Cloudflare Worker** (`met-favorites-email.danielgolliher.workers.dev`) which sends a formatted HTML email via **Resend API** (from `favorites@data.maximumnewyork.com`). The email has a gold-branded header, artwork cards with thumbnails/titles/artists/dates/links, and an "Explore More Art" CTA linking back to the page. Shows sending/success/error states inline. Email input uses 16px font on mobile to prevent iOS Safari auto-zoom.
   - **Back-to-top button**: Fixed bottom-left (↑ arrow, warm gray), appears when `scrollY > 600`. Smooth-scrolls to top on click. Opposite corner from FAB.
   - **Tip banner**: Gold-bordered note at top of page explaining the star-and-email feature.
   - **Data source**: Met Museum Open Access API (no API key required). Initial load uses 12 pre-verified European Paintings seed IDs, then background-fetches full department list for load-more. Object cache (`useRef(Map)`) prevents redundant fetches. `AbortController` cancels in-flight requests on navigation.
   - **Design**: Warm cream background (`#FDFBF7`), gold accent (`#B8860B`), shimmer skeleton loaders, card hover lift. Self-contained styles in `metExplorerStyles.css` with CSS custom properties (`--met-gold`, `--met-cream`, etc.).
   - **Email infrastructure**: Cloudflare Worker in `email-worker/` directory. Resend API key stored as Worker secret (`wrangler secret put RESEND_API_KEY`). CORS locked to `data.maximumnewyork.com` + localhost. Input validation (email format, 1–100 favorites). Deploy with `cd email-worker && npx wrangler deploy`.
   - Key files: `src/components/MetExplorer.jsx` (all sub-components + main component), `src/components/metExplorerStyles.css` (styles), `src/pages/MetExplorerPage.jsx` (page wrapper), `email-worker/index.js` (Cloudflare Worker)

### Design System
- **Brand color**: `#BE5343` (Maximum New York red) — set as `--color-accent` in CSS
- **Navbar**: Glassmorphism (`rgba` background + `backdrop-filter: blur(8px)`), 64px height (`--nav-height`). "MNY" monogram pill (JetBrains Mono) next to brand name. "Explore" dropdown groups all visualization links — desktop: hover/click to open, white glass panel with fade-in animation, active page gets red left bar, trigger gets white underline when any child page is active. Closes on click-outside or Escape. "Pigeons" pill toggle activates a site-wide canvas particle overlay (~28 pigeon silhouettes with wing-flap/coast cycles + drifting feathers); warm muted palette, `pointer-events: none` so site remains interactive. Mobile: dropdown items display directly in slide-out (no extra tap), trigger becomes uppercase "EXPLORE" section header, chevron hidden. Mobile slide-out also uses glassmorphism.
- **Dark cards**: `#0a0e17` background, used for State Trajectory and Growth Chart
- **Light cards**: White background, used for Expense Budget
- **Fonts**: Source Serif 4 (display), DM Sans (body), JetBrains Mono (mono), IBM Plex Sans (Growth Chart component)
- **QR codes**: Appear in footer (every page) and top-right of each chart card; included in PNG downloads

### ShareMenu Behavior
- **Link**: Copies canonical page URL (uses `useLocation` for clean path)
- **Download**: html2canvas capture of `chartRef`, excludes `.share-menu-controls` (but keeps QR), adds red credit bar with attribution
- **Embed**: Generates iframe pointing to `/embed/<slug>` route (chart-only, no site chrome)

### Social Media Previews (Open Graph)
- Each page has a `public/<slug>/index.html` with `og:title`, `og:description`, `og:image`, and Twitter Card meta tags
- Default OG image: `og-image.png` (used by most pages)
- Met Explorer uses `og-met-explorer.jpg` (Degas' *The Dance Class*, downloaded from Met API)
- To add a preview for a new page: create `public/<slug>/index.html` following the pattern in existing files (meta tags + SPA redirect script)

### Deployment Notes
- Always use `npm run deploy` which builds and pushes to `gh-pages` branch
- The `public/CNAME` file is critical — it gets copied to `dist/` and preserves the custom domain
- GitHub Pages takes 1-2 minutes to update after deploy (occasionally up to 10)
- After pushing to `main`, also run `npm run deploy` to update the live site
