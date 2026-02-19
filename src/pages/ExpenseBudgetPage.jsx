import BudgetPieChart from '../components/BudgetPieChart'
import { fy2026 } from '../data/fy2026'
import { fy2027 } from '../data/fy2027'

export default function ExpenseBudgetPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Expense Budget by Agency</h1>
        <p className="subtitle">
          How New York City allocates its operating budget across agencies,
          from the adopted FY2026 budget through the FY2027 preliminary budget.
        </p>
      </div>

      <BudgetPieChart
        title="FY2027 Preliminary Expense Budget"
        subtitle={`Net Total: $${(fy2027.netTotal / 1e9).toFixed(1)} Billion — By Agency`}
        note="Excludes ($1.06B) Citywide Savings Initiatives offset not yet allocated to agencies."
        agencies={fy2027.agencies}
        netTotal={fy2027.netTotal}
      />

      <BudgetPieChart
        title="FY2026 Adopted Expense Budget"
        subtitle={`Net Total: $${(fy2026.netTotal / 1e9).toFixed(1)} Billion — By Agency`}
        agencies={fy2026.agencies}
        netTotal={fy2026.netTotal}
      />
    </div>
  )
}
