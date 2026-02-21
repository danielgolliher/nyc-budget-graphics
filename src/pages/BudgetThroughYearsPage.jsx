import NYCBudgetThroughYears from '../components/NYCBudgetThroughYears'

export default function BudgetThroughYearsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>NYC's Budget from FY 2002 through 2026</h1>
        <p className="subtitle">
          Total adopted expense budget by fiscal year, from FY2002 through FY2026.
          Filter by mayor, adjust the range, hover for details, and click any data point to freeze the panel and access source links.
        </p>
      </div>
      <NYCBudgetThroughYears />
    </div>
  )
}
