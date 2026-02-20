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
    slug: 'growth-chart',
    label: 'Growth Chart',
    description:
      'How small differences in annual growth rates produce dramatically different outcomes over time.',
    preview: 'previews/growth-chart.svg',
    component: lazy(() => import('./pages/GrowthChartPage')),
  },
]

export default categories
