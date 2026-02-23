import { useRef, useState, useEffect } from 'react'
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
  const [activeSection, setActiveSection] = useState('')

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const ids = SECTIONS.map(s => s.id)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const filterKey = filterPositive ? 'f' : 'u'

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
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 8, textAlign: 'center',
        fontSize: 13, color: '#92702a', fontFamily: "'DM Sans', sans-serif",
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

      {/* FY selector + filter toggle */}
      <div style={{
        maxWidth: 900, margin: '0 auto 12px', padding: '0 16px',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Fiscal Year selector (disabled — coming soon) */}
        <div className="fy-selector-wrapper">
          <select disabled defaultValue="2025">
            <option value="2025">FY 2025</option>
            <option value="2024">FY 2024</option>
            <option value="2023">FY 2023</option>
          </select>
          <span className="coming-soon-badge">Coming Soon!</span>
        </div>

        {/* Filter toggle */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, marginBottom: 16,
        }}>
          <button
            onClick={() => setFilterPositive(!filterPositive)}
            className={`payroll-filter-toggle${filterPositive ? ' on' : ''}`}
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
            <span className="filter-label-full">
              {filterPositive
                ? 'Showing only employees with > $0 total comp (549,246)'
                : 'Showing all employees including $0 / negative adjustments (550,219)'}
            </span>
            <span className="filter-label-short">
              {filterPositive
                ? 'Filtered: >$0 comp only (549,246)'
                : 'All employees (550,219)'}
            </span>
          </button>
        </div>
      </div>

      {/* Sticky chart navigation */}
      <div className="payroll-chart-nav-sticky">
        <div className="payroll-chart-nav-inner">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`payroll-nav-pill${activeSection === s.id ? ' active' : ''}`}
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mobile-tap-hint">Tip: Tap any bar to select and sum values</p>
      </div>

      <div id="agencies" className="chart-card dark-card" ref={mainCardRef} style={{ scrollMarginTop: 120 }}>
        <ShareMenu chartRef={mainCardRef} chartId="nyc-payroll-agencies" title="NYC Payroll — Top Agencies" dark />
        <PayrollStats key={`stats-${filterKey}`} filtered={filterPositive} />
        <AgencyCompensationChart key={`agencies-${filterKey}`} filtered={filterPositive} />
      </div>

      <div id="distribution" className="chart-card dark-card" ref={distCardRef} style={{ scrollMarginTop: 120 }}>
        <ShareMenu chartRef={distCardRef} chartId="nyc-payroll-distribution" title="NYC Payroll — Compensation Distribution" dark />
        <CompensationDistributionChart key={`dist-${filterKey}`} filtered={filterPositive} />
      </div>

      <div id="ot-dollars" className="chart-card dark-card" ref={otDollarsCardRef} style={{ scrollMarginTop: 120 }}>
        <ShareMenu chartRef={otDollarsCardRef} chartId="nyc-payroll-ot-dollars" title="NYC Payroll — Total Overtime by Agency" dark />
        <AgencyOvertimeDollarsChart key={`otd-${filterKey}`} filtered={filterPositive} />
      </div>

      <div id="ot-ratio" className="chart-card dark-card" ref={otPctCardRef} style={{ scrollMarginTop: 120 }}>
        <ShareMenu chartRef={otPctCardRef} chartId="nyc-payroll-overtime" title="NYC Payroll — Overtime Ratio" dark />
        <OvertimeChart key={`otr-${filterKey}`} filtered={filterPositive} />
      </div>

      <div id="top-ot" className="chart-card dark-card" ref={outlierOtCardRef} style={{ scrollMarginTop: 120 }}>
        <ShareMenu chartRef={outlierOtCardRef} chartId="nyc-payroll-top-ot-earners" title="NYC Payroll — Top OT Earners" dark />
        <TopOvertimeEarnersChart key={`topot-${filterKey}`} />
      </div>

      <div id="top-salaries" className="chart-card dark-card" ref={outlierSalaryCardRef} style={{ scrollMarginTop: 120 }}>
        <ShareMenu chartRef={outlierSalaryCardRef} chartId="nyc-payroll-top-salaries" title="NYC Payroll — Highest Salaries" dark />
        <TopSalariesChart key={`topsal-${filterKey}`} />
      </div>

      <p className="payroll-consolidated-source">
        Source:{' '}
        <a href="https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e"
          target="_blank" rel="noopener noreferrer">
          NYC Open Data — Citywide Payroll Data
        </a>{' '}
        (Office of Payroll Administration)
      </p>
    </div>
  )
}
