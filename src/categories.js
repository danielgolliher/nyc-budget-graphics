import { lazy } from 'react'

const categories = [
  {
    slug: 'expense-budget',
    label: 'Expense Budget',
    description:
      'How New York City allocates its operating budget across agencies.',
    preview: 'previews/expense-budget.svg',
    component: lazy(() => import('./pages/ExpenseBudgetPage')),
  },
  {
    slug: 'state-trajectory',
    label: 'State Trajectory',
    description:
      'How U.S. states have risen and fallen in population rankings from 1960 to 2024.',
    preview: 'previews/state-trajectory.svg',
    component: lazy(() => import('./pages/StateTrajectoryPage')),
  },
  {
    slug: 'nyc-budget-2002-2026',
    label: 'Budget Through the Years',
    navLabel: 'Budget History',
    description:
      'How NYC\'s total adopted expense budget has grown from FY2002 to FY2026, across three mayors.',
    preview: 'previews/budget-through-years.svg',
    component: lazy(() => import('./pages/BudgetThroughYearsPage')),
  },
  {
    slug: 'growth-chart',
    label: 'Growth Chart',
    description:
      'How small differences in annual growth rates produce dramatically different outcomes over time.',
    preview: 'previews/growth-chart.svg',
    component: lazy(() => import('./pages/GrowthChartPage')),
  },
  {
    slug: 'nyc-payroll-2025',
    label: 'NYC Payroll FY2025',
    navLabel: 'NYC Payroll',
    description:
      'Where New York City\'s $34.6 billion payroll goes — compensation breakdown across 550,000+ municipal employees.',
    preview: 'previews/payroll.svg',
    component: lazy(() => import('./pages/PayrollPage')),
  },
  {
    slug: 'met-explorer',
    label: 'Met Museum Explorer',
    navLabel: 'Met Explorer',
    description:
      "Discover and explore 500,000+ artworks from The Metropolitan Museum of Art's open collection.",
    preview: 'previews/met-explorer.svg',
    component: lazy(() => import('./pages/MetExplorerPage')),
  },
  {
    slug: 'apportionment',
    label: '2020 Apportionment',
    navLabel: 'Apportionment',
    description:
      'All 435 House seat assignments, step by step, using the Huntington-Hill method and 2020 Census populations.',
    preview: 'previews/apportionment.svg',
    component: lazy(() => import('./pages/ApportionmentPage')),
  },
  {
    slug: 'state-admission',
    label: 'Admission of States',
    navLabel: 'State Admission',
    description:
      'All 50 states, from Delaware (1787) to Hawaii (1959) — how each joined the United States.',
    preview: 'previews/state-admission.svg',
    component: lazy(() => import('./pages/StateAdmissionPage')),
  },
  {
    slug: 'operating-indicators',
    label: 'NYC Operating Indicators',
    navLabel: 'Operating Indicators',
    description:
      'Ten years of NYC agency performance data — crime, fire response, shelter counts, parks attendance, and more.',
    preview: 'previews/operating-indicators.svg',
    component: lazy(() => import('./pages/OperatingIndicatorsPage')),
  },
  {
    slug: 'nyc-tax-rate',
    label: 'NYS-NYC Tax Rate',
    navLabel: 'Tax Rate',
    description:
      'Combined NYS-NYC marginal income tax rate from 1966 to 2025, net of federal deductibility.',
    preview: 'previews/tax-rate.svg',
    component: lazy(() => import('./pages/TaxRatePage')),
  },
  {
    slug: 'seqra-battle',
    label: 'HOUSE vs. SEQRA',
    navLabel: 'SEQRA Battle',
    description:
      'A Pokémon-style battle between New York housing and the State Environmental Quality Review Act.',
    preview: 'previews/seqra-battle.svg',
    component: lazy(() => import('./pages/SeqraBattlePage')),
  },
  {
    slug: 'council-quest',
    label: 'NYC Council Quest',
    navLabel: 'Council Quest',
    description:
      "Walk Manhattan's council districts in a retro 2D game. Meet your representatives, explore legislation, and email their offices.",
    preview: 'previews/council-quest.svg',
    component: lazy(() => import('./pages/CouncilQuestPage')),
    comingSoon: true,
  },
  {
    slug: 'pedestrian-traffic',
    label: 'NYC Pedestrian Traffic',
    navLabel: 'Pedestrian Traffic',
    description:
      'Estimated peak-period pedestrian volumes across every sidewalk and crosswalk in all five NYC boroughs.',
    preview: 'previews/pedestrian-traffic.svg',
    component: lazy(() => import('./pages/PedestrianTrafficPage')),
  },
]

export default categories
