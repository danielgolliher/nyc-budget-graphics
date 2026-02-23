import { useRef, useState } from 'react'
import {
  AgencyCompensationChart, OvertimeChart, PayrollStats,
  AgencyOvertimeDollarsChart, TopOvertimeEarnersChart, TopSalariesChart,
  CompensationDistributionChart,
} from '../components/PayrollCharts'
import ShareMenu from '../components/ShareMenu'

const SECTIONS = [
  { id: 'agencies', label: 'Agencies' },
  { id: 'distribution', label: 'Distribution' },
  { id: 'ot-dollars', label: 'OT by Agency' },
  { id: 'ot-ratio', label: 'OT Ratio' },
  { id: 'top-ot', label: 'Top OT Earners' },
  { id: 'top-salaries', label: 'Top Salaries' },
]

export default function PayrollPage() {
  const mainCardRef = useRef(null)
  const distCardRef = useRef(null)
  const otDollarsCardRef = useRef(null)
  const otPctCardRef = useRef(null)
  const outlierOtCardRef = useRef(null)
  const outlierSalaryCardRef = useRef(null)
  const [filterPositive, setFilterPositive] = useState(false)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>NYC Payroll: Where the Money Goes</h1>
        <p className="subtitle">
          A breakdown of New York City's $34.6 billion payroll across {filterPositive ? '549,000+' : '550,000+'} municipal employees in FY2025 — from base salaries to overtime.
        </p>
      </div>
      <div style={{
        maxWidth: 780, margin: '0 auto 12px', padding: '8px 16px',
        background: 'rgba(190,83,67,0.08)', border: '1px solid rgba(190,83,67,0.2)',
        borderRadius: 8, textAlign: 'center',
        fontSize: 13, color: '#64748b', fontFamily: "'DM Sans', sans-serif",
      }}>
        This data is still being cleaned. Please recheck anything you find on the page if this banner is up.
        <br />[Last updated February 22, 2026]
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 32px', padding: '0 16px',
        fontSize: 15, lineHeight: 1.75, color: 'var(--color-navy)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ marginBottom: 12 }}>
          This data comes from the City of New York's{' '}
          <a href="https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Citywide Payroll Data</a>{' '}
          dataset on NYC Open Data, published by the Office of Payroll Administration (OPA). It covers every municipal
          employee who appeared on a city payroll in fiscal year 2025 (July 2024 through June 2025), including their
          agency, title, regular gross pay, overtime, and{' '}
          <a href="https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e/about_data"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            other pay</a>{' '}
          (differentials, lump sums, settlements, and retroactive payments).
        </p>
        <p style={{ marginBottom: 12 }}>
          You can download the full dataset yourself at the link above — filter by fiscal year, agency, or any other
          field, and export as CSV. The dataset is also queryable via the{' '}
          <a href="https://dev.socrata.com/foundry/data.cityofnewyork.us/k397-673e"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Socrata Open Data API</a>,
          which is how these visualizations were built. For each chart below, click on individual bars to select
          and sum them.
        </p>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          <strong>Note on employee counts:</strong> Our default total of 550,219 employees includes all payroll records,
          including those with zero or negative net pay (adjustments, clawbacks). Use the filter below to show only
          employees with {'>'} $0 total compensation — matching the methodology used by the{' '}
          <a href="https://www.empirecenter.org/publications/nyc-employees-receive-300k-in-overtime/"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Empire Center's FY2025 report</a>{' '}
          (549,246 employees).
        </p>
      </div>

      {/* Controls bar: filter toggle + chart nav */}
      <div style={{
        maxWidth: 900, margin: '0 auto 28px', padding: '0 16px',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Filter toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, marginBottom: 16,
        }}>
          <button
            onClick={() => setFilterPositive(!filterPositive)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: filterPositive ? 'rgba(190,83,67,0.12)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${filterPositive ? 'rgba(190,83,67,0.4)' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: 8, padding: '8px 18px', cursor: 'pointer',
              fontSize: 13, color: filterPositive ? '#BE5343' : '#64748b',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
              fontWeight: filterPositive ? 600 : 400,
            }}
          >
            <span style={{
              display: 'inline-block', width: 36, height: 20, borderRadius: 10,
              background: filterPositive ? '#BE5343' : '#cbd5e1',
              position: 'relative', transition: 'background 0.2s',
            }}>
              <span style={{
                position: 'absolute', top: 2, left: filterPositive ? 18 : 2,
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </span>
            {filterPositive
              ? 'Showing only employees with > $0 total comp (549,246)'
              : 'Showing all employees including $0 / negative adjustments (550,219)'}
          </button>
        </div>

        {/* Chart navigation */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8,
        }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 20, padding: '6px 16px', cursor: 'pointer',
                fontSize: 13, color: '#475569', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s', fontWeight: 500,
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(190,83,67,0.08)'; e.target.style.color = '#BE5343'; e.target.style.borderColor = 'rgba(190,83,67,0.3)' }}
              onMouseLeave={e => { e.target.style.background = 'rgba(0,0,0,0.04)'; e.target.style.color = '#475569'; e.target.style.borderColor = 'rgba(0,0,0,0.08)' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div id="agencies" className="chart-card dark-card" ref={mainCardRef} style={{ scrollMarginTop: 24 }}>
        <ShareMenu chartRef={mainCardRef} chartId="nyc-payroll-agencies" title="NYC Payroll — Top Agencies" dark />
        <PayrollStats filtered={filterPositive} />
        <AgencyCompensationChart filtered={filterPositive} />
        <p className="chart-source" style={{ textAlign: 'center', marginTop: 24 }}>
          Source: NYC Open Data — Citywide Payroll Data (Office of Payroll Administration)
        </p>
      </div>

      <div id="distribution" className="chart-card dark-card" ref={distCardRef} style={{ scrollMarginTop: 24 }}>
        <ShareMenu chartRef={distCardRef} chartId="nyc-payroll-distribution" title="NYC Payroll — Compensation Distribution" dark />
        <CompensationDistributionChart filtered={filterPositive} />
        <p className="chart-source" style={{ textAlign: 'center', marginTop: 24 }}>
          Source: NYC Open Data — Citywide Payroll Data (Office of Payroll Administration)
        </p>
      </div>

      <div id="ot-dollars" className="chart-card dark-card" ref={otDollarsCardRef} style={{ scrollMarginTop: 24 }}>
        <ShareMenu chartRef={otDollarsCardRef} chartId="nyc-payroll-ot-dollars" title="NYC Payroll — Total Overtime by Agency" dark />
        <AgencyOvertimeDollarsChart filtered={filterPositive} />
        <p className="chart-source" style={{ textAlign: 'center', marginTop: 24 }}>
          Source: NYC Open Data — Citywide Payroll Data (Office of Payroll Administration)
        </p>
      </div>

      <div id="ot-ratio" className="chart-card dark-card" ref={otPctCardRef} style={{ scrollMarginTop: 24 }}>
        <ShareMenu chartRef={otPctCardRef} chartId="nyc-payroll-overtime" title="NYC Payroll — Overtime Ratio" dark />
        <OvertimeChart filtered={filterPositive} />
        <p className="chart-source" style={{ textAlign: 'center', marginTop: 24 }}>
          Source: NYC Open Data — Citywide Payroll Data (Office of Payroll Administration)
        </p>
      </div>

      <div id="top-ot" className="chart-card dark-card" ref={outlierOtCardRef} style={{ scrollMarginTop: 24 }}>
        <ShareMenu chartRef={outlierOtCardRef} chartId="nyc-payroll-top-ot-earners" title="NYC Payroll — Top OT Earners" dark />
        <TopOvertimeEarnersChart />
        <p className="chart-source" style={{ textAlign: 'center', marginTop: 24 }}>
          Source: NYC Open Data — Citywide Payroll Data (Office of Payroll Administration)
        </p>
      </div>

      <div id="top-salaries" className="chart-card dark-card" ref={outlierSalaryCardRef} style={{ scrollMarginTop: 24 }}>
        <ShareMenu chartRef={outlierSalaryCardRef} chartId="nyc-payroll-top-salaries" title="NYC Payroll — Highest Salaries" dark />
        <TopSalariesChart />
        <p className="chart-source" style={{ textAlign: 'center', marginTop: 24 }}>
          Source: NYC Open Data — Citywide Payroll Data (Office of Payroll Administration)
        </p>
      </div>
    </div>
  )
}
