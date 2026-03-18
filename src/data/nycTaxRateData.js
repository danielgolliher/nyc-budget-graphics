// Combined NYS-NYC Marginal Income Tax Rate data, 1966-2025
// Animated from a graphic in E.J. McMahon's issue brief
// "The Limits of New York's 'Tax the Rich' Policy" from the Manhattan Institute.
// https://manhattan.institute/article/the-limits-of-new-yorks-tax-the-rich-policy

export const years = Array.from({ length: 60 }, (_, i) => 1966 + i)

// Top federal marginal rate (%)
export const fedRate = [
  70, 70, 75.25, 77, 71.75, 70, 70, 70, 70, 70,
  70, 69.125, 50, 50, 50, 50, 50, 38.5, 28, 28,
  28, 31, 31, 39.6, 39.6, 39.6, 39.6, 39.6, 39.6, 39.6,
  39.6, 39.1, 38.6, 35, 35, 35, 35, 35, 35, 35,
  35, 35, 35, 39.6, 39.6, 39.6, 39.6, 39.6, 37, 37,
  37, 37, 37, 37, 37, 37, 37, 37, 37, 37,
]

// Effective combined NY State + NYC rate, net of federal deductibility (%)
export const nyRate = [
  4.7, 4.0, 4.0, 5.7, 5.7, 5.7, 5.7, 5.7, 5.7, 5.7,
  5.7, 5.7, 5.7, 5.7, 5.7, 7.1, 5.8, 5.8, 5.8, 5.8,
  5.8, 8.3, 8.4, 8.4, 9.4, 9.8, 9.4, 9.4, 9.4, 7.8,
  7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 7.4, 8.9, 8.9, 7.8,
  7.8, 7.8, 9.1, 9.1, 9.1, 9.1, 9.1, 9.0, 8.7, 8.7,
  8.7, 12.7, 12.7, 12.7, 12.7, 14.8, 14.7, 14.7, 14.7, 14.7,
]
