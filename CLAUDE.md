# Maximum New York Data Viz & Art Site

## Project Overview
This is the **Maximum New York Data Viz & Art** site — a collection of interactive data visualizations. It lives at **https://data.maximumnewyork.com** and is deployed to GitHub Pages from the `gh-pages` branch.

- **Repo**: https://github.com/danielgolliher/nyc-budget-graphics
- **Branch**: `main` (single branch workflow)
- **Custom domain**: `data.maximumnewyork.com` (CNAME file in `public/` preserves this across deploys)

## Tech Stack
- **Vite** + **React 18** (JSX, no TypeScript)
- **React Router v7** (declarative mode) with `BrowserRouter` (clean URLs, no hash)
- **Recharts** for chart visualizations
- **html2canvas** for PNG downloads
- **qrcode.react** for QR codes on pages and in downloads
- **GitHub Actions** for deployment (`.github/workflows/deploy.yml` publishes to the `gh-pages` branch on every push to `main`)

## Key Commands
- `npm run dev` — local dev server (Vite)
- `npm run build` — production build to `dist/`
- `npm run deploy` — manual build + deploy from your machine (`vite build && gh-pages -d dist --nojekyll`). Normally unnecessary: pushing `main` deploys automatically

## Architecture

### Routing
- `src/main.jsx` — BrowserRouter wrapper; strips a trailing slash from the URL so every page has one canonical address
- `src/App.jsx` — Two route modes:
  - **Normal routes** (`/`, `/<slug>`) — wrapped in `Layout` (navbar + footer)
  - **Embed routes** (`/embed/<slug>`) — same page components but wrapped in `.embed-wrapper` which hides page headers, share buttons, and chrome via CSS
  - Also: a "Page not found" route, an error boundary that reloads once if a page's code chunk is missing after a deploy, scroll-to-top and tab-title updates on navigation
- **Generated page files** (`scripts/site-pages.js`, a Vite plugin). At build time it writes `dist/<slug>.html` and `dist/<slug>/index.html` for every entry in `categories.js` (and the same under `embed/`), each a copy of the app shell with that page's `<title>`, description, canonical link and OG/Twitter tags. GitHub Pages serves them with a 200, so crawlers and link unfurlers see the right tags and visitors land straight in the app (no redirect). It also writes `404.html` (the app shell, which shows the "Page not found" route), `sitemap.xml`, `robots.txt` and `.nojekyll`
- **Content-Security-Policy**: the same plugin adds a CSP `<meta>` tag to every built page (GitHub Pages can't send headers). Inline scripts in `index.html` are allowed by hash automatically. **If a page starts loading images, data or scripts from a new host, add the host to `contentSecurityPolicy()` in `scripts/site-pages.js`**, or the browser will block it. The CSP is only in the build, so check new hosts with `npm run build && npm run preview`
- Old `/?/<slug>` links from the previous redirect setup still work (small script in `index.html`)
- **Homepage** (`src/pages/HomePage.jsx`) — Shows all visualization cards from `categories.js`, with subtitle containing contact info (email `daniel@maximumnewyork.com` + LinkedIn/X links)

### Adding a New Visualization
1. Create the chart component in `src/components/`
2. Create a page wrapper in `src/pages/` following the pattern:
   - `page-container` > `page-header` (title + subtitle) > `chart-card` (with `dark-card` class if dark theme)
   - Include `ShareMenu` with `chartRef`, `chartId`, `title`, and `dark` prop if dark card
3. Create a preview SVG thumbnail in `public/previews/` (200×140, simplified visual)
4. Add an entry to `src/categories.js` with `slug`, `label`, `description`, `preview`. Optional: `navLabel` (shorter nav name), and the social-preview fields `title`, `metaDescription`, `shareDescription`, `image` (see the comment at the top of the file)
5. Add the lazy-loaded page component to `src/pageComponents.js` under the same slug
6. Everything else (routing, nav links, embed routes, homepage card, page HTML with social tags, sitemap) is automatic

### Key Files
| File | Purpose |
|------|---------|
| `src/categories.js` | Central registry of all visualizations (plain data, also read by the build) — drives nav, routes, homepage grid, embed routes, page titles, social tags and the sitemap. Optional `navLabel` field for shorter dropdown names |
| `src/pageComponents.js` | Slug → lazy-loaded page component |
| `scripts/site-pages.js` | Vite plugin: per-page HTML files with social tags, 404.html, sitemap.xml, robots.txt, CSP |
| `src/components/Layout.jsx` | Navbar (with "MNY" monogram, "Explore" dropdown menu, "Pigeons" toggle, mobile hamburger), footer (with QR code + X/LinkedIn social links) |
| `src/components/PigeonOverlay.jsx` | Site-wide 2D canvas pigeon particle effect — ~28 pigeons + drifting feathers, toggled from navbar |
| `src/components/ShareMenu.jsx` | Link/Download/Embed buttons + QR code per chart card |
| `src/index.css` | All styles including navbar, cards, dark-card theme, embed wrapper, responsive/mobile |
| `src/App.jsx` | Route definitions for normal and embed modes |
| `index.html` | App shell: Google Fonts (Source Serif 4, JetBrains Mono, DM Sans), analytics, night-mode boot script, `<!--page-meta-->` placeholder the build fills per page |
| `public/CNAME` | Custom domain — **do not delete** or deploys will break the domain |
| `public/og-met-explorer.jpg` | Met Explorer social preview image (Degas' *The Dance Class*) |
| `public/data/nyc_fy_inflation_data.csv` | BLS CPI-U inflation data (FY2001–2025, NYC Metro Area) — downloadable source for inflation overlay |
| `public/data/state_population_rankings_1960_2025.csv` | State population data (1960 Census vs. 2025 estimates) — downloadable from State Trajectory page |
| `src/data/nycPayroll2025.js` | FY2025 payroll data — agency totals (raw + filtered), OT by agency, top earners, salary distribution, summary stats |
| `src/components/PayrollCharts.jsx` | 6 payroll chart components + PayrollStats + shared hooks (useSelection, SelectionBar, FilterBadge) |
| `src/components/MetExplorer.jsx` | Met Museum Explorer — gallery, search, detail overlay, favorites system, email panel |
| `src/components/metExplorerStyles.css` | All Met Explorer styles (warm cream/gold theme, cards, overlays, favorites panel, FAB) |
| `email-worker/index.js` | Cloudflare Worker that sends favorites email via Resend API |

### Current Visualizations
1. **Expense Budget** (`/expense-budget`) — FY2026 + FY2027 pie charts, light cards
2. **State Trajectory** (`/state-trajectory`) — Slope chart + sortable table comparing 1960 vs. 2025 U.S. state population rankings, dark cards. Data sourced from 1960 Census and 2025 Census Bureau estimates; stored in `src/data/statePopulation.js` (populations in thousands). CSV downloadable via highlighted "Get the data" link below page title (`public/data/state_population_rankings_1960_2025.csv`). Mobile: slope chart margins scale responsively (150→110→70px) with smaller label fonts (9px); legend buttons and table cells use tighter padding; min SVG width lowered to 320px to prevent horizontal scroll on phones.
3. **Budget Through the Years** (`/nyc-budget-2002-2026`) — Total adopted expense budget FY2002–2026 across three mayors, with area chart and year-over-year bar chart as two independently shareable dark cards. Component imports ShareMenu directly (not via page wrapper). Features a "Show Inflation" toggle on the area chart that overlays NYC Metro CPI-U inflation rates (BLS data, FY2002–2025) as bars behind the budget line, with a right-side Y-axis for the percentage scale. When toggled, an "Avg Inflation Rate" stat box also appears in the stats row, dynamically computed for the selected FY range. Inflation source CSV downloadable from `public/data/nyc_fy_inflation_data.csv`. Uses `ComposedChart` from Recharts to mix Area and Bar on Chart 1; Chart 2 remains a standalone `BarChart`. Mobile: `clamp()` padding on outer container and chart cards; detail panel headers wrap; inflation hint callout hidden on mobile (overflows off-screen).
4. **Growth Chart** (`/growth-chart`) — Compound growth calculator with configurable scenarios, dark card. Mobile: 16px input font (prevents iOS auto-zoom), larger remove-button touch targets (32px min), wider range slider with `max-width: 40vw`, end-value row wraps gracefully.
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
   - **Search**: Free-text search bar that queries the Met API's paginated `/v1.1/search` endpoint (first 500 IDs; the old `/v1/search` was retired 2026-10-01 and returns 410). Results replace the gallery grid. Placeholder dynamically shows department name when a department filter is active (e.g. "Search in European Paintings..."). During loading with a department filter, a context line shows "Searching in {department}..."
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
   - **Email infrastructure**: Cloudflare Worker in `email-worker/` directory. Resend API key stored as Worker secret (`wrangler secret put RESEND_API_KEY`). The worker only accepts JSON POSTs whose `Origin` is the site or localhost, caps the body at 64 KB and the list at 40 favorites, rate-limits per IP (5/min) and per recipient (1/min) via the Rate Limiting bindings in `wrangler.toml` plus a per-isolate backstop (both are best-effort: Cloudflare counts loosely across machines, so fast bursts partly get through), and rebuilds every item from the Met API by object ID (client text is used only if the Met API is unreachable, and is cleaned and escaped). Links always point to metmuseum.org and images to images.metmuseum.org. Deploy with `cd email-worker && npx wrangler deploy` (pushing `main` does not deploy the worker; run `wrangler login` first if the login has expired).
   - Key files: `src/components/MetExplorer.jsx` (all sub-components + main component), `src/components/metExplorerStyles.css` (styles), `src/pages/MetExplorerPage.jsx` (page wrapper), `email-worker/index.js` (Cloudflare Worker)

7. **Large Loads** (`/large-loads`) — Interactive guide to data centers, the grid, and Texas vs. New York large-load rules. A self-contained page mirrored from the `danielgolliher/large-loads` repo (also live at danielgolliher.github.io/large-loads): the app is `public/large-loads/guide.html`, shown full-height under the navbar by an iframe in `src/pages/LargeLoadsPage.jsx` (no page header; the guide has its own title). A small script at the end of `guide.html` opens outside links in a new tab when framed. To update, copy the large-loads repo's `index.html` over `guide.html` and keep that script. Social preview: the `large-loads` entry in `src/categories.js` + `public/og-large-loads.png`.

### Design System
- **Brand color**: `#BE5343` (Maximum New York red) — set as `--color-accent` in CSS
- **Navbar**: Glassmorphism (`rgba` background + `backdrop-filter: blur(8px)`), 64px height (`--nav-height`). "MNY" monogram pill (JetBrains Mono) next to brand name. "Explore" dropdown groups all visualization links — desktop: hover/click to open, white glass panel with fade-in animation, active page gets red left bar, trigger gets white underline when any child page is active. Closes on click-outside or Escape. "Pigeons" pill toggle activates a site-wide canvas particle overlay (~28 pigeon silhouettes with wing-flap/coast cycles + drifting feathers); warm muted palette, `pointer-events: none` so site remains interactive. Mobile: dropdown items display directly in slide-out (no extra tap), trigger becomes uppercase "EXPLORE" section header, chevron hidden. Mobile slide-out also uses glassmorphism.
- **Dark cards**: `#0a0e17` background, used for State Trajectory and Growth Chart
- **Light cards**: White background, used for Expense Budget
- **Fonts**: Source Serif 4 (display), DM Sans (body), JetBrains Mono (mono)
- **QR codes**: Appear in footer (every page) and top-right of each chart card; included in PNG downloads
- **Mobile responsive** (`@media max-width: 768px` in `index.css`): page container tightened to `24px 16px` padding, page header reduced margins, homepage category grid goes single-column, chart cards `20px 16px` padding, pie chart layout stacks vertically, slope table/legend get tighter padding. Individual components also adapt via JS (SlopeChart responsive margins, GrowthChart touch targets) and `clamp()` (Budget Through the Years padding). All text inputs use 16px font to prevent iOS Safari auto-zoom.

### ShareMenu Behavior
- **Link**: Copies canonical page URL (uses `useLocation`; strips any trailing slash or `/embed` prefix). Falls back to `execCommand('copy')` where the Clipboard API is unavailable
- **Download**: html2canvas capture of `chartRef`, excludes `.share-menu-controls` (but keeps QR), adds red credit bar with attribution
- **Embed**: Generates iframe pointing to `/embed/<slug>` route (chart-only, no site chrome)

### Social Media Previews (Open Graph)
- Generated at build time from `src/categories.js` by `scripts/site-pages.js` (see Routing). Edit the page's `title` / `metaDescription` / `shareDescription` / `image` fields there
- Default OG image: `og-image.jpg` (1200×675, ~200 KB). `og-image.png` is the 2560×1440 original, kept so previews already cached by social sites keep working
- Met Explorer uses `og-met-explorer.jpg` (Degas' *The Dance Class*, downloaded from Met API); Large Loads uses `og-large-loads.png`

### Deployment Notes
- Pushing to `main` deploys automatically (`.github/workflows/deploy.yml`: `npm ci`, `npm run build`, publish `dist/` to `gh-pages`). Watch it in the repo's Actions tab
- The weekly `refresh-bills.yml` job (Fridays) commits fresh Council Quest bill data to `main` and deploys on its own, since pushes made by Actions don't trigger other workflows. Its script refuses to write if the bill count drops, most districts come back empty, or the game script stops parsing; it exits without committing when nothing changed. Both workflows share a `gh-pages` concurrency group so they never deploy at the same time
- `npm run deploy` still works for a manual deploy from your machine, but it publishes your local working tree, uncommitted changes included
- The `public/CNAME` file is critical — it gets copied to `dist/` and preserves the custom domain (the workflows also pass `cname:`)
- GitHub Pages takes 1-2 minutes to update after deploy (occasionally up to 10)
- Workflow actions are pinned to commit SHAs (with the version in a comment). Bump them together when updating
