// U.S. State Population Rankings — 1960 vs. 2025
// Sources: 1960 U.S. Census · 2025 Census Bureau Estimates (in thousands)

export const getShiftCategory = (shift) => {
  if (shift > 10) return 'up10'
  if (shift > 5) return 'up5'
  if (shift > 0) return 'up1'
  if (shift === 0) return 'none'
  if (shift > -5) return 'down1'
  if (shift > -10) return 'down5'
  return 'down10'
}

const rawData = [
  { state: 'California', abbr: 'CA', pop1960: 15717, rank1960: 2, pop2025: 39355, rank2025: 1 },
  { state: 'Texas', abbr: 'TX', pop1960: 9580, rank1960: 6, pop2025: 31710, rank2025: 2 },
  { state: 'Florida', abbr: 'FL', pop1960: 4952, rank1960: 10, pop2025: 23463, rank2025: 3 },
  { state: 'New York', abbr: 'NY', pop1960: 16782, rank1960: 1, pop2025: 20002, rank2025: 4 },
  { state: 'Pennsylvania', abbr: 'PA', pop1960: 11319, rank1960: 3, pop2025: 13059, rank2025: 5 },
  { state: 'Illinois', abbr: 'IL', pop1960: 10081, rank1960: 4, pop2025: 12719, rank2025: 6 },
  { state: 'Ohio', abbr: 'OH', pop1960: 9706, rank1960: 5, pop2025: 11901, rank2025: 7 },
  { state: 'Georgia', abbr: 'GA', pop1960: 3943, rank1960: 16, pop2025: 11303, rank2025: 8 },
  { state: 'North Carolina', abbr: 'NC', pop1960: 4556, rank1960: 12, pop2025: 11198, rank2025: 9 },
  { state: 'Michigan', abbr: 'MI', pop1960: 7823, rank1960: 7, pop2025: 10128, rank2025: 10 },
  { state: 'New Jersey', abbr: 'NJ', pop1960: 6067, rank1960: 8, pop2025: 9548, rank2025: 11 },
  { state: 'Virginia', abbr: 'VA', pop1960: 3967, rank1960: 14, pop2025: 8880, rank2025: 12 },
  { state: 'Washington', abbr: 'WA', pop1960: 2853, rank1960: 23, pop2025: 8001, rank2025: 13 },
  { state: 'Arizona', abbr: 'AZ', pop1960: 1302, rank1960: 35, pop2025: 7624, rank2025: 14 },
  { state: 'Tennessee', abbr: 'TN', pop1960: 3567, rank1960: 17, pop2025: 7315, rank2025: 15 },
  { state: 'Massachusetts', abbr: 'MA', pop1960: 5149, rank1960: 9, pop2025: 7154, rank2025: 16 },
  { state: 'Indiana', abbr: 'IN', pop1960: 4662, rank1960: 11, pop2025: 6973, rank2025: 17 },
  { state: 'Missouri', abbr: 'MO', pop1960: 4320, rank1960: 13, pop2025: 6271, rank2025: 18 },
  { state: 'Maryland', abbr: 'MD', pop1960: 3101, rank1960: 21, pop2025: 6265, rank2025: 19 },
  { state: 'Colorado', abbr: 'CO', pop1960: 1754, rank1960: 33, pop2025: 6013, rank2025: 20 },
  { state: 'Wisconsin', abbr: 'WI', pop1960: 3952, rank1960: 15, pop2025: 5973, rank2025: 21 },
  { state: 'Minnesota', abbr: 'MN', pop1960: 3414, rank1960: 18, pop2025: 5830, rank2025: 22 },
  { state: 'South Carolina', abbr: 'SC', pop1960: 2383, rank1960: 26, pop2025: 5570, rank2025: 23 },
  { state: 'Alabama', abbr: 'AL', pop1960: 3267, rank1960: 19, pop2025: 5193, rank2025: 24 },
  { state: 'Louisiana', abbr: 'LA', pop1960: 3257, rank1960: 20, pop2025: 4618, rank2025: 25 },
  { state: 'Kentucky', abbr: 'KY', pop1960: 3038, rank1960: 22, pop2025: 4607, rank2025: 26 },
  { state: 'Oregon', abbr: 'OR', pop1960: 1769, rank1960: 32, pop2025: 4274, rank2025: 27 },
  { state: 'Oklahoma', abbr: 'OK', pop1960: 2328, rank1960: 27, pop2025: 4123, rank2025: 28 },
  { state: 'Connecticut', abbr: 'CT', pop1960: 2535, rank1960: 25, pop2025: 3688, rank2025: 29 },
  { state: 'Utah', abbr: 'UT', pop1960: 891, rank1960: 38, pop2025: 3539, rank2025: 30 },
  { state: 'Nevada', abbr: 'NV', pop1960: 285, rank1960: 49, pop2025: 3282, rank2025: 31 },
  { state: 'Iowa', abbr: 'IA', pop1960: 2758, rank1960: 24, pop2025: 3238, rank2025: 32 },
  { state: 'Arkansas', abbr: 'AR', pop1960: 1786, rank1960: 31, pop2025: 3115, rank2025: 33 },
  { state: 'Kansas', abbr: 'KS', pop1960: 2179, rank1960: 28, pop2025: 2977, rank2025: 34 },
  { state: 'Mississippi', abbr: 'MS', pop1960: 2178, rank1960: 29, pop2025: 2954, rank2025: 35 },
  { state: 'New Mexico', abbr: 'NM', pop1960: 951, rank1960: 37, pop2025: 2125, rank2025: 36 },
  { state: 'Idaho', abbr: 'ID', pop1960: 667, rank1960: 42, pop2025: 2030, rank2025: 37 },
  { state: 'Nebraska', abbr: 'NE', pop1960: 1411, rank1960: 34, pop2025: 2018, rank2025: 38 },
  { state: 'West Virginia', abbr: 'WV', pop1960: 1860, rank1960: 30, pop2025: 1766, rank2025: 39 },
  { state: 'Hawaii', abbr: 'HI', pop1960: 633, rank1960: 43, pop2025: 1433, rank2025: 40 },
  { state: 'New Hampshire', abbr: 'NH', pop1960: 607, rank1960: 45, pop2025: 1415, rank2025: 41 },
  { state: 'Maine', abbr: 'ME', pop1960: 969, rank1960: 36, pop2025: 1415, rank2025: 42 },
  { state: 'Montana', abbr: 'MT', pop1960: 675, rank1960: 41, pop2025: 1145, rank2025: 43 },
  { state: 'Rhode Island', abbr: 'RI', pop1960: 859, rank1960: 39, pop2025: 1115, rank2025: 44 },
  { state: 'Delaware', abbr: 'DE', pop1960: 446, rank1960: 46, pop2025: 1060, rank2025: 45 },
  { state: 'South Dakota', abbr: 'SD', pop1960: 681, rank1960: 40, pop2025: 935, rank2025: 46 },
  { state: 'North Dakota', abbr: 'ND', pop1960: 632, rank1960: 44, pop2025: 799, rank2025: 47 },
  { state: 'Alaska', abbr: 'AK', pop1960: 226, rank1960: 50, pop2025: 737, rank2025: 48 },
  { state: 'Vermont', abbr: 'VT', pop1960: 390, rank1960: 47, pop2025: 645, rank2025: 49 },
  { state: 'Wyoming', abbr: 'WY', pop1960: 330, rank1960: 48, pop2025: 589, rank2025: 50 },
]

export const stateData = rawData.map((d) => {
  const pctChange = Math.round(((d.pop2025 - d.pop1960) / d.pop1960) * 1000) / 10
  return {
    ...d,
    shift: d.rank1960 - d.rank2025,
    pctChange,
    netVsUS: Math.round((pctChange - 91.0) * 10) / 10,
    category: getShiftCategory(d.rank1960 - d.rank2025),
  }
})

export const formatPop = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'M'
  return n + 'K'
}

export const legendItems = [
  { key: 'up10', label: 'Climbed 10+', color: '#16a34a' },
  { key: 'up5', label: 'Climbed 5\u20139', color: '#4ade80' },
  { key: 'up1', label: 'Climbed 1\u20134', color: '#86efac' },
  { key: 'none', label: 'No change', color: '#94a3b8' },
  { key: 'down1', label: 'Fell 1\u20134', color: '#fca5a5' },
  { key: 'down5', label: 'Fell 5\u20139', color: '#f87171' },
  { key: 'down10', label: 'Fell 10+', color: '#dc2626' },
]

export const categoryColorMap = {
  up10: '#16a34a', up5: '#4ade80', up1: '#86efac',
  none: '#94a3b8',
  down1: '#fca5a5', down5: '#f87171', down10: '#dc2626',
}
