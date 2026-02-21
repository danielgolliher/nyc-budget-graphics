import { useRef } from 'react'
import NYCBudgetThroughYears from '../components/NYCBudgetThroughYears'
import ShareMenu from '../components/ShareMenu'

export default function BudgetThroughYearsPage() {
  const chartCardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>NYC's Budget from FY 2002 through 2026</h1>
        <p className="subtitle">
          Total adopted expense budget by fiscal year, from FY2002 through FY2026.
          Filter by mayor, adjust the range, hover for details, and click any data point to freeze the panel and access source links.
        </p>
      </div>

      <div className="chart-card dark-card" ref={chartCardRef}>
        <ShareMenu chartRef={chartCardRef} chartId="nyc-budget-2002-2026" title="NYC's Budget from FY 2002 through 2026" dark />
        <NYCBudgetThroughYears />
      </div>
    </div>
  )
}
