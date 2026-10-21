// Central registry of every page. Plain data (no React) so the build can read it too:
// scripts/site-pages.js turns each entry into a real HTML file with its own title and
// social-preview tags, plus the sitemap. The page components live in src/pageComponents.js.
//
// Per-page SEO fields (all optional):
//   title            — browser tab / social title, before " — Maximum New York Data Viz & Art" (default: label)
//   metaDescription  — <meta name="description"> (default: description)
//   shareDescription — og:description / twitter:description (default: metaDescription)
//   image            — social preview image in public/ (default: og-image.jpg), with imageWidth/imageHeight

const categories = [
  {
    slug: 'expense-budget',
    label: 'Expense Budget',
    title: 'NYC Expense Budget',
    description:
      'How New York City allocates its operating budget across agencies.',
    metaDescription:
      'How New York City allocates its operating budget across agencies. Interactive pie charts for FY2026 and FY2027.',
    preview: 'previews/expense-budget.svg',
  },
  {
    slug: 'state-trajectory',
    label: 'State Trajectory',
    title: 'State Population Trajectory',
    description:
      'How U.S. states have risen and fallen in population rankings from 1960 to 2024.',
    metaDescription:
      'How U.S. states have risen and fallen in population rankings from 1960 to 2024. Interactive slope chart and sortable table.',
    shareDescription:
      'How U.S. states have risen and fallen in population rankings from 1960 to 2024.',
    preview: 'previews/state-trajectory.svg',
  },
  {
    slug: 'nyc-budget-2002-2026',
    label: 'Budget Through the Years',
    navLabel: 'Budget History',
    title: 'NYC Budget Through the Years',
    description:
      'How NYC\'s total adopted expense budget has grown from FY2002 to FY2026, across three mayors.',
    metaDescription:
      'How NYC\'s total adopted expense budget has grown from FY2002 to FY2026, across three mayors. With inflation overlay.',
    shareDescription:
      'How NYC\'s total adopted expense budget has grown from FY2002 to FY2026, across three mayors.',
    preview: 'previews/budget-through-years.svg',
  },
  {
    slug: 'growth-chart',
    label: 'Growth Chart',
    description:
      'How small differences in annual growth rates produce dramatically different outcomes over time.',
    metaDescription:
      'How small differences in annual growth rates produce dramatically different outcomes over time. Interactive compound growth calculator.',
    shareDescription:
      'How small differences in annual growth rates produce dramatically different outcomes over time.',
    preview: 'previews/growth-chart.svg',
  },
  {
    slug: 'nyc-payroll-2025',
    label: 'NYC Payroll FY2025',
    navLabel: 'NYC Payroll',
    description:
      'Where New York City\'s $34.6 billion payroll goes — compensation breakdown across 550,000+ municipal employees.',
    metaDescription:
      'Where New York City\'s $34.6 billion payroll goes — compensation breakdown across 550,000+ municipal employees. Six interactive charts.',
    shareDescription:
      'Where New York City\'s $34.6 billion payroll goes — compensation breakdown across 550,000+ municipal employees.',
    preview: 'previews/payroll.svg',
  },
  {
    slug: 'met-explorer',
    label: 'Met Museum Explorer',
    navLabel: 'Met Explorer',
    description:
      "Discover and explore 500,000+ artworks from The Metropolitan Museum of Art's open collection.",
    metaDescription:
      "Discover and explore 500,000+ artworks from The Metropolitan Museum of Art's open collection. Star favorites and email them to yourself.",
    shareDescription:
      "Discover and explore 500,000+ artworks from The Met's open collection. Star favorites and email them to yourself.",
    image: 'og-met-explorer.jpg',
    imageWidth: 579,
    imageHeight: 624,
    preview: 'previews/met-explorer.svg',
  },
  {
    slug: 'apportionment',
    label: '2020 Apportionment',
    navLabel: 'Apportionment',
    description:
      'All 435 House seat assignments, step by step, using the Huntington-Hill method and 2020 Census populations.',
    preview: 'previews/apportionment.svg',
  },
  {
    slug: 'state-admission',
    label: 'Admission of States',
    navLabel: 'State Admission',
    title: 'Admission of States to the Union',
    description:
      'All 50 states, from Delaware (1787) to Hawaii (1959) — how each joined the United States.',
    metaDescription:
      'All 50 states, from Delaware (1787) to Hawaii (1959) — how each joined the United States, with enabling acts and historical context.',
    shareDescription:
      'All 50 states, from Delaware (1787) to Hawaii (1959) — how each joined the United States.',
    preview: 'previews/state-admission.svg',
  },
  {
    slug: 'operating-indicators',
    label: 'NYC Operating Indicators',
    navLabel: 'Operating Indicators',
    description:
      'Ten years of NYC agency performance data — crime, fire response, shelter counts, parks attendance, and more.',
    metaDescription:
      'Ten years of NYC agency performance data — crime, fire response, shelter counts, parks attendance, and more. From the Comptroller\'s FY2025 report.',
    shareDescription:
      'Ten years of NYC agency performance data — crime, fire response, shelter counts, parks attendance, and more.',
    preview: 'previews/operating-indicators.svg',
  },
  {
    slug: 'nyc-tax-rate',
    label: 'NYS-NYC Tax Rate',
    navLabel: 'Tax Rate',
    description:
      'Combined NYS-NYC marginal income tax rate from 1966 to 2025, net of federal deductibility.',
    metaDescription:
      'Combined NYS-NYC marginal income tax rate from 1966 to 2025, net of federal deductibility. Animated from a Manhattan Institute graphic.',
    shareDescription:
      'Combined NYS-NYC marginal income tax rate from 1966 to 2025, net of federal deductibility.',
    preview: 'previews/tax-rate.svg',
  },
  {
    slug: 'seqra-battle',
    label: 'HOUSE vs. SEQRA',
    navLabel: 'SEQRA Battle',
    description:
      'A Pokémon-style battle between New York housing and the State Environmental Quality Review Act.',
    shareDescription:
      'A wild SEQRA appeared! Can New York housing survive the State Environmental Quality Review Act?',
    preview: 'previews/seqra-battle.svg',
  },
  {
    slug: 'council-quest',
    label: 'NYC Council Quest',
    navLabel: 'Council Quest',
    description:
      "Walk Manhattan's council districts in a retro 2D game. Meet your representatives, explore legislation, and email their offices.",
    metaDescription:
      "Walk Manhattan's council districts in a retro 2D game. Meet all 10 council members, explore their legislation, and email their offices.",
    shareDescription:
      "Walk Manhattan's council districts in a retro 2D game. Meet your representatives and explore their legislation.",
    preview: 'previews/council-quest.jpg',
    comingSoon: true,
  },
  {
    slug: 'pedestrian-traffic',
    label: 'NYC Pedestrian Traffic',
    navLabel: 'Pedestrian Traffic',
    description:
      'Estimated peak-period pedestrian volumes across every sidewalk and crosswalk in all five NYC boroughs.',
    metaDescription:
      'Estimated peak-period pedestrian volumes across every sidewalk and crosswalk in all five NYC boroughs. Data from MIT City Form Lab.',
    shareDescription:
      'Estimated peak-period pedestrian volumes across every sidewalk and crosswalk in all five NYC boroughs.',
    preview: 'previews/pedestrian-traffic.svg',
  },
  {
    slug: 'large-loads',
    label: 'Large Loads',
    description:
      'Data centers, the grid, and the rules Texas and New York are writing for them.',
    metaDescription:
      'An interactive guide to data centers, the grid, and the large-load rules Texas and New York are writing.',
    image: 'og-large-loads.png',
    imageWidth: 1200,
    imageHeight: 630,
    preview: 'previews/large-loads.svg',
  },
  {
    slug: 'make-your-own',
    label: 'Make Your Own',
    description:
      'Anyone can build a site like this with Claude and a free GitHub account. Here\'s how the pieces fit together.',
    metaDescription:
      'Anyone can build a site like this with Claude and a free GitHub account. A simple diagram of how the pieces fit together.',
    shareDescription:
      'Anyone can build a site like this with Claude and a free GitHub account. Here\'s how the pieces fit together.',
    preview: 'previews/make-your-own.svg',
  },
]

export const SITE_NAME = 'Maximum New York Data Viz & Art'

// Browser-tab title for a page ("NYC Expense Budget — Maximum New York Data Viz & Art").
export function pageTitle(category) {
  return category ? `${category.title || category.label} — ${SITE_NAME}` : SITE_NAME
}

export default categories
