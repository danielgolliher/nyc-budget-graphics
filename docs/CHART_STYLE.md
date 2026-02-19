# Chart Style Guide — NYC Budget Graphics

This document defines the visual and technical specification for all charts on the NYC Budget Graphics site. It is written to serve as a reference for both human developers and AI assistants (Claude) so that new charts can be produced in a consistent style.

---

## Site Identity

- **Name**: New York City Budget Graphics
- **Tone**: Civic, editorial, serious but accessible. Think ProPublica or NYT Upshot — clean data presentation, not flashy dashboards.
- **Audience**: Policy researchers, journalists, engaged citizens, elected officials.

## Design System

### Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / headings | `Source Serif 4` | 600–700 | Serif. Used for chart titles, page titles. |
| Body / UI | `DM Sans` | 400–600 | Sans-serif. Used for labels, subtitles, nav, buttons. |
| Data / numbers | `JetBrains Mono` | 400–500 | Monospace. Used in legend table numbers, threshold buttons, tooltips. |

Load via Google Fonts. Fallbacks: Georgia (serif), system sans-serif, monospace.

### Color Palette

**Brand colors (CSS variables):**

| Variable | Hex | Usage |
|----------|-----|-------|
| `--color-bg` | `#FAF9F6` | Page background — warm off-white |
| `--color-surface` | `#FFFFFF` | Card/chart backgrounds |
| `--color-navy` | `#1B2A4A` | Navbar, headings, primary text |
| `--color-navy-light` | `#2C3E6B` | Secondary dark |
| `--color-accent` | `#2D5FA0` | Links, active states, brand accent |
| `--color-text` | `#1B2A4A` | Primary text |
| `--color-text-secondary` | `#5A6578` | Subtitles, secondary info |
| `--color-text-muted` | `#8B92A0` | Labels, footnotes |
| `--color-border` | `#D8DAE0` | Borders, dividers |
| `--color-border-light` | `#ECEDF0` | Subtle row dividers |

**Chart data palette (56 colors):**
Used for pie slices, bar segments, etc. Ordered to maximize visual distinction for the first ~15 entries, then cycles. Blues and teals first (civic feel), then purples, greens, ambers, reds, pinks.

```js
const PALETTE = [
  '#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
  '#1e40af', '#1d4ed8', '#2a5298', '#4a7fc1', '#6b9fd4',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#c4b5fd',
  '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
  '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a',
  '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca',
  '#db2777', '#ec4899', '#f472b6', '#f9a8d4',
  '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9',
  '#4b5563', '#6b7280', '#9ca3af', '#d1d5db',
  '#78716c', '#a8a29e', '#d6d3d1',
  '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1',
  '#365314', '#4d7c0f', '#65a30d', '#84cc16', '#a3e635',
  '#7e22ce', '#9333ea', '#a855f7', '#c084fc',
]
```

### Layout

- Max content width: `1140px`, centered.
- Charts live inside `.chart-card` containers: white background, 1px light border, 8px radius, subtle shadow.
- Page padding: `48px` top, `24px` sides.

---

## Chart Type: Budget Pie (Donut)

This is the primary chart type on the site. It shows a single fiscal year's expense budget broken down by agency.

### Component

`BudgetPieChart` in `src/components/BudgetPieChart.jsx`

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | e.g., `"FY2027 Preliminary Expense Budget"` |
| `subtitle` | string | e.g., `"Net Total: $127.0 Billion — By Agency"` |
| `note` | string? | Optional footnote (italic, muted). Used for caveats like excluded items. |
| `agencies` | `{ name: string, value: number }[]` | All agencies. Negative values are filtered out automatically. |
| `netTotal` | number | The net total budget. Used for percentage calculations. |

### Behavior

1. **Threshold filter**: Buttons at top let the user filter agencies by minimum % of total (0.25%, 0.5%, 1%, 2%, 5%). Default: **1%**. Agencies below the threshold are grouped into an "Other (N agencies)" slice.
2. **Hover interaction**: Hovering a pie slice highlights it (expands outward with a ring effect). Hovering a legend row does the same, and vice versa. Linked via shared `activeIndex` state.
3. **Tooltip**: Shows agency name (bold, navy), dollar amount (mono), and percentage of total (muted).
4. **Legend table**: Right side of chart. Columns: Agency (with color swatch), Budget (formatted), Share (%). Sticky header. Scrollable if many rows.

### Visual Spec

- **Chart type**: Donut (Recharts `<Pie>` with `innerRadius`)
- **Inner radius**: 72px
- **Outer radius**: 175px
- **Padding angle**: 0.4°
- **Stroke**: white, 1px between slices
- **Active shape**: outer radius +6px, plus a thin ring at +10 to +13px
- **Chart area height**: 440px
- **Legend max height**: 440px (scrollable)

### Dollar Formatting

```
≥ $1B  →  "$X.XB"   (one decimal)
≥ $1M  →  "$XXXM"   (no decimal)
< $1M  →  "$XXXK"   (no decimal)
Negative → "−$X.XB"  (em dash, not hyphen)
```

### Data File Format

Each fiscal year is a separate file in `src/data/`. Export a single object:

```js
export const fyXXXX = {
  label: 'FY2027',            // Short label
  type: 'Preliminary',        // 'Adopted', 'Preliminary', 'Executive', 'Modified'
  netTotal: 127000975382,     // Net total budget (number)
  agencies: [                 // Array of all agencies
    { name: 'Department of Education', value: 38029864876 },
    // ...
  ],
  // Optional: items excluded from the pie (negative values, etc.)
  excludedItems: [
    { name: 'Citywide Savings Initiatives', value: -1060000000 },
  ],
}
```

### Agency Naming Conventions

Use the official OMB name but abbreviate for readability:
- "Department of" → "Department of" (keep) or "Dept of" for long names
- "Information Technology and Telecommunications" → "IT & Telecom"
- Use "&" not "and" in abbreviated names
- District Attorneys keep borough suffix: "District Attorney - Kings"
- Libraries keep full name: "New York Public Library"
- "Community Boards (59)" for the aggregate line

---

## Navbar

- Sticky, dark navy (`--color-navy`) background.
- 3px accent-blue bottom border.
- Brand: "New York City Budget Graphics" in Source Serif 4, white.
- Secondary brand text: "Data & Visualization" in DM Sans, uppercase, muted white, separated by a 2px vertical accent-blue rule.
- Links: DM Sans 13px, muted white → white on hover, with subtle background highlight. Active link gets slightly brighter background.

---

## Future Chart Types (Anticipated)

When adding new chart types, follow these conventions:

1. **Create a reusable component** in `src/components/` (e.g., `BudgetBarChart.jsx`, `BudgetLineChart.jsx`)
2. **Accept data via props**, not hardcoded. Data lives in `src/data/`.
3. **Use the same palette** (`PALETTE` array) and the same tooltip/legend styling.
4. **Wrap in `.chart-card`** container for consistent presentation.
5. **Document the new component** by updating this file with its spec.

Potential future charts:
- **Stacked bar**: Compare multiple fiscal years side-by-side
- **Treemap**: Budget share as nested rectangles
- **Line chart**: Agency budget trends over time
- **Comparison table**: Side-by-side fiscal year comparison (like the XLSX we produced)
