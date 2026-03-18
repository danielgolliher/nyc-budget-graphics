// Standard US tile cartogram grid positions [col, row]
// Based on common data visualization layouts (NPR/FiveThirtyEight style)
// Grid is 12 columns × 8 rows

export const GRID_COLS = 12
export const GRID_ROWS = 8

export const tilePositions = {
  // Row 0
  AK: [0, 0],
  ME: [11, 0],

  // Row 1
  WA: [1, 1],
  MT: [2, 1],
  ND: [3, 1],
  MN: [4, 1],
  WI: [6, 1],
  MI: [8, 1],
  VT: [10, 1],
  NH: [11, 1],

  // Row 2
  OR: [1, 2],
  ID: [2, 2],
  WY: [3, 2],
  SD: [4, 2],
  IA: [5, 2],
  IL: [6, 2],
  IN: [7, 2],
  OH: [8, 2],
  PA: [9, 2],
  NY: [10, 2],
  MA: [11, 2],

  // Row 3
  CA: [1, 3],
  NV: [2, 3],
  UT: [3, 3],
  CO: [4, 3],
  NE: [5, 3],
  MO: [6, 3],
  KY: [7, 3],
  WV: [8, 3],
  VA: [9, 3],
  NJ: [10, 3],
  CT: [11, 3],

  // Row 4
  AZ: [2, 4],
  NM: [3, 4],
  KS: [4, 4],
  AR: [5, 4],
  TN: [6, 4],
  NC: [7, 4],
  SC: [8, 4],
  MD: [9, 4],
  DE: [10, 4],
  RI: [11, 4],

  // Row 5
  OK: [4, 5],
  LA: [5, 5],
  MS: [6, 5],
  AL: [7, 5],
  GA: [8, 5],

  // Row 6
  HI: [0, 6],
  TX: [3, 6],
  FL: [9, 6],
}
