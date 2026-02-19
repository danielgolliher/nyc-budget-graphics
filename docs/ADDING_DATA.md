# Adding New Budget Data

This guide explains how to add a new fiscal year's budget data to the site.

## Step 1: Prepare the Data

You need the "Summary of the Expense Budget by Agency" table from the NYC OMB budget documents. This is typically a two-page table listing every agency with its budget figures.

The key column to extract is the **Adopted Budget** (or **Preliminary Budget**, **Executive Budget**, etc., depending on which version you're working with).

You also need the **Net Total Budget** figure from the bottom of the table.

## Step 2: Create the Data File

Create a new file in `src/data/` following the naming convention `fyXXXX.js`:

```js
// src/data/fy2028.js
// FY2028 [Type] Expense Budget — by agency
// Source: NYC OMB, Summary of the Expense Budget by Agency, Fiscal Year 2028

export const fy2028 = {
  label: 'FY2028',
  type: 'Adopted',          // or 'Preliminary', 'Executive'
  netTotal: 130000000000,   // Net Total Budget from bottom of table
  agencies: [
    { name: 'Department of Education', value: 39000000000 },
    { name: 'Miscellaneous', value: 16000000000 },
    // ... all agencies with positive budget values
  ],
  // Optional: negative line items that can't be shown in a pie chart
  excludedItems: [
    { name: 'Citywide Savings Initiatives', value: -1000000000 },
  ],
}
```

### Data entry tips

- Values should be **whole numbers** (no decimals, no dollar signs, no commas).
- Agency names should match the conventions in `docs/CHART_STYLE.md`.
- Include **all agencies** from the table, even tiny ones — the threshold filter handles grouping small ones into "Other."
- The `netTotal` should be the Net Total Budget after subtracting Intra-City Expenditures.
- If the budget includes negative placeholder items (like "Citywide Savings Initiatives"), put them in `excludedItems` so they're documented but not charted.

## Step 3: Add to the Page

In `src/pages/ExpenseBudgetPage.jsx`:

1. Import the new data:
   ```js
   import { fy2028 } from '../data/fy2028'
   ```

2. Add a new `<BudgetPieChart>` component (newest first):
   ```jsx
   <BudgetPieChart
     title="FY2028 Adopted Expense Budget"
     subtitle={`Net Total: $${(fy2028.netTotal / 1e9).toFixed(1)} Billion — By Agency`}
     agencies={fy2028.agencies}
     netTotal={fy2028.netTotal}
   />
   ```

3. If there are excluded items worth noting, add the `note` prop:
   ```jsx
   note="Excludes ($1.0B) Citywide Savings Initiatives offset."
   ```

## Step 4: Test Locally

```bash
npm run dev
```

Check that:
- The pie chart renders correctly
- Threshold buttons work
- Hover interactions work on both pie and legend
- Dollar amounts look reasonable
- Percentages sum to roughly 100% (won't be exact due to rounding and the "Other" bucket)

## Step 5: Deploy

```bash
npm run deploy
```

## Using Claude to Transcribe Budget Tables

If you have screenshots or PDFs of the OMB budget tables, you can ask Claude to transcribe them into the data file format. Provide the images and ask:

> "Please transcribe these budget table images into a JS data file matching the format in `src/data/fy2026.js`. Use the [Adopted/Preliminary] Budget column for the values."

Claude should reference `docs/CHART_STYLE.md` for naming conventions.
