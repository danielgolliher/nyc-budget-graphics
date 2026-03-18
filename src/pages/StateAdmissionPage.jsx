import { useRef } from 'react'
import StateAdmissionTable from '../components/StateAdmissionTable'
import ShareMenu from '../components/ShareMenu'
import '../components/stateAdmissionStyles.css'

export default function StateAdmissionPage() {
  const cardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admission of States to the Union</h1>
        <p className="subtitle">
          All 50 states, from Delaware (1787) to Hawaii (1959) — how each joined the United States.
        </p>
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 32px', padding: '0 16px',
        fontSize: 15, lineHeight: 1.75, color: 'var(--color-navy)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ marginBottom: 12 }}>
          Data drawn from the Congressional Research Service report{' '}
          <a href="https://www.congress.gov/crs-product/R47747" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}>
            <em>Admission of States to the Union</em> (R47747)
          </a>.
          Statutes at Large citations link to{' '}
          <a href="https://legislink.org/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}>LegisLink</a> (vols. 1–64) or{' '}
          <a href="https://www.govinfo.gov/app/collection/statute/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}>GovInfo</a> (vols. 65+).
          Named acts link to their Wikipedia articles. The original 13 joined by ratifying the{' '}
          <a href="https://www.archives.gov/founding-docs/constitution" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}>Constitution</a>.
        </p>
      </div>

      <div className="chart-card admission-card" ref={cardRef}>
        <ShareMenu chartRef={cardRef} chartId="state-admission-table" title="Admission of States to the Union" />
        <StateAdmissionTable />
        <p style={{
          textAlign: 'center', marginTop: 32,
          fontSize: 12, color: '#887', fontFamily: "'DM Sans', sans-serif",
        }}>
          Sources:{' '}
          <a href="https://www.congress.gov/crs-product/R47747" target="_blank" rel="noopener noreferrer"
            style={{ color: '#6b3a2a', textDecoration: 'none', borderBottom: '1px dotted #6b3a2a' }}>
            CRS Report R47747
          </a> (updated Jan. 6, 2026) ·{' '}
          <a href="https://www.loc.gov/collections/united-states-statutes-at-large/about-this-collection/" target="_blank" rel="noopener noreferrer"
            style={{ color: '#6b3a2a', textDecoration: 'none', borderBottom: '1px dotted #6b3a2a' }}>
            U.S. Statutes at Large
          </a> via LegisLink and GovInfo
        </p>
      </div>
    </div>
  )
}
