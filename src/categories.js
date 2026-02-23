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
    description:
      'Where New York City\'s $34.6 billion payroll goes — compensation breakdown across 550,000+ municipal employees.',
    preview: 'previews/payroll.svg',
    component: lazy(() => import('./pages/PayrollPage')),
  },
]

export default categories
