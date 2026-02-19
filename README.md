# New York City Budget Graphics

A static site for interactive visualizations of New York City's expense budget, built with React + Vite and deployed to GitHub Pages.

## Quick Start

```bash
npm install
npm run dev       # local dev server at localhost:5173
npm run build     # production build to /dist
npm run deploy    # deploy to GitHub Pages
```

## Deployment (GitHub Pages)

1. Create a GitHub repo (e.g., `nyc-budget-graphics`)
2. Update `base` in `vite.config.js` to match your repo name: `'/nyc-budget-graphics/'`
3. Push to GitHub
4. Run `npm run deploy` — this builds and pushes to the `gh-pages` branch
5. In repo Settings → Pages, set source to the `gh-pages` branch

## Project Structure

```
src/
  components/
    Layout.jsx              # Navbar + footer wrapper
    BudgetPieChart.jsx      # Reusable interactive pie/donut chart
  data/
    fy2026.js               # FY2026 adopted budget data
    fy2027.js               # FY2027 preliminary budget data
  pages/
    ExpenseBudgetPage.jsx   # Main page rendering budget charts
  App.jsx                   # Routes
  main.jsx                  # Entry point
  index.css                 # Global styles
docs/
  CHART_STYLE.md            # Chart design spec for replication
  ADDING_DATA.md            # How to add new fiscal year data
```

## Adding New Charts

See `docs/ADDING_DATA.md` for step-by-step instructions on adding a new fiscal year or chart type.

## Design Reference

See `docs/CHART_STYLE.md` for the complete design specification, including color palette, typography, component API, and layout rules. This file is written so that an AI assistant (Claude) can read it and produce new charts consistent with the existing style.

## Data Sources

All budget figures come from the NYC Office of Management and Budget's "Summary of the Expense Budget by Agency" tables, published as part of the annual budget documents.
