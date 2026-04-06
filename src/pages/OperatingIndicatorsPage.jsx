import { useRef } from 'react'
import OperatingIndicatorsChart from '../components/OperatingIndicatorsChart'
import ShareMenu from '../components/ShareMenu'

export default function OperatingIndicatorsPage() {
  const cardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>NYC Operating Indicators</h1>
        <p className="subtitle">
          Ten years of city agency performance data &mdash; from crime and fire response to parks
          attendance and homeless shelter counts. Pick an agency and indicator to explore.
        </p>
      </div>

      <div className="chart-card dark-card" ref={cardRef}>
        <ShareMenu chartRef={cardRef} chartId="operating-indicators" title="NYC Operating Indicators" dark />
        <OperatingIndicatorsChart />
      </div>

      <p style={{
        maxWidth: 780, margin: '24px auto 0', textAlign: 'center',
        fontSize: 13, color: '#64748b', lineHeight: 1.6,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Source:{' '}
        <a
          href="https://comptroller.nyc.gov/reports/comprehensive-annual-financial-reports/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)' }}
        >
          NYC Comptroller's Report for Fiscal 2025
        </a>
        {' '}&mdash; Operating Indicators by Function/Program (Part III).
        Data from the Mayor's Management Report (MMR) and various City agencies.
      </p>
    </div>
  )
}
