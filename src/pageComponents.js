import { lazy } from 'react'

// Lazy-loaded page component for each slug in src/categories.js.
const pageComponents = {
  'expense-budget': lazy(() => import('./pages/ExpenseBudgetPage')),
  'state-trajectory': lazy(() => import('./pages/StateTrajectoryPage')),
  'nyc-budget-2002-2026': lazy(() => import('./pages/BudgetThroughYearsPage')),
  'growth-chart': lazy(() => import('./pages/GrowthChartPage')),
  'nyc-payroll-2025': lazy(() => import('./pages/PayrollPage')),
  'met-explorer': lazy(() => import('./pages/MetExplorerPage')),
  'apportionment': lazy(() => import('./pages/ApportionmentPage')),
  'state-admission': lazy(() => import('./pages/StateAdmissionPage')),
  'operating-indicators': lazy(() => import('./pages/OperatingIndicatorsPage')),
  'nyc-tax-rate': lazy(() => import('./pages/TaxRatePage')),
  'seqra-battle': lazy(() => import('./pages/SeqraBattlePage')),
  'council-quest': lazy(() => import('./pages/CouncilQuestPage')),
  'pedestrian-traffic': lazy(() => import('./pages/PedestrianTrafficPage')),
  'large-loads': lazy(() => import('./pages/LargeLoadsPage')),
  'make-your-own': lazy(() => import('./pages/MakeYourOwnPage')),
}

export default pageComponents
