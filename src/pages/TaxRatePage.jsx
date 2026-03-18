import { useRef } from 'react'
import TaxRateChart from '../components/TaxRateChart'
import ShareMenu from '../components/ShareMenu'

export default function TaxRatePage() {
  const cardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>New York's Tax Burden Over Time</h1>
        <p className="subtitle">
          How the combined NYS and NYC marginal income tax rate has changed alongside the top federal rate, from 1966 to 2025.
        </p>
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 32px', padding: '0 16px',
        fontSize: 15, lineHeight: 1.75, color: 'var(--color-navy)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ marginBottom: 12 }}>
          This chart is animated from a graphic in E.J. McMahon's issue brief{' '}
          <a href="https://manhattan.institute/article/the-limits-of-new-yorks-tax-the-rich-policy"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            "The Limits of New York's 'Tax the Rich' Policy"
          </a>{' '}
          published by the{' '}
          <a href="https://manhattan.institute/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}>
            Manhattan Institute
          </a>.
          It shows the effective combined New York State and New York City top marginal income tax rate,
          net of federal deductibility, alongside the top federal rate. As federal rates fell dramatically
          after 1986, state and local taxes became a larger share of top earners' total burden — a dynamic
          that accelerated sharply after the 2017 SALT deduction cap.
        </p>
      </div>

      <div className="chart-card" ref={cardRef} style={{
        background: '#fff', borderTop: '3px solid #14237e',
      }}>
        <ShareMenu chartRef={cardRef} chartId="nyc-tax-rate" title="Combined NYS-NYC Marginal Income Tax Rate" />
        <TaxRateChart />
      </div>
    </div>
  )
}
