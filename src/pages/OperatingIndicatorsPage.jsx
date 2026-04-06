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
          Ten years of NYC financial and operating data from the Comptroller&rsquo;s FY2025 report.
          Explore financial trends, revenues, expenditures, and agency performance indicators.
        </p>
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 20px', padding: '12px 18px',
        background: 'rgba(190,83,67,0.08)', border: '1px solid rgba(190,83,67,0.25)',
        borderRadius: 10, fontSize: 13, lineHeight: 1.6, color: '#94644a',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Data from the <a
          href="https://comptroller.nyc.gov/wp-content/uploads/2025/11/8-Financial-Trends-and-Other-Statistical-Information-FY25.pdf"
          target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)', fontWeight: 600 }}
        >Statistical Section (PDF)</a> of the NYC Comptroller&rsquo;s <a
          href="https://comptroller.nyc.gov/reports/annual-comprehensive-financial-reports/"
          target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)', fontWeight: 600 }}
        >Annual Comprehensive Financial Report</a> for Fiscal Year 2025.
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
