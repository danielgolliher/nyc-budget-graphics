import { useRef } from 'react'
import ApportionmentTable from '../components/ApportionmentTable'
import ApportionmentAnimation from '../components/ApportionmentAnimation'
import ShareMenu from '../components/ShareMenu'

export default function ApportionmentPage() {
  const animCardRef = useRef(null)
  const tableCardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>2020 Apportionment — Huntington-Hill Method</h1>
        <p className="subtitle">
          All 435 House seat assignments, step by step, using 2020 Census populations.
          Each state starts with one guaranteed seat; the remaining 385 are assigned by highest priority value.
        </p>
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 32px', padding: '0 16px',
        fontSize: 15, lineHeight: 1.75, color: 'var(--color-navy)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ marginBottom: 12 }}>
          The <strong>Huntington-Hill method</strong> (also called the "method of equal proportions") is the
          formula Congress has used to divide House seats among the states after every census since 1941.
          The Constitution guarantees each state at least one representative. The remaining 385 seats are
          then assigned one at a time: at each step, every state gets a <em>priority value</em> equal to its
          population divided by the geometric mean of its current and next seat number — <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#64748b',
          }}>pop ÷ √(n × (n−1))</span> — and the seat goes to whichever state has the highest value.
          This process repeats until all 435 seats are filled.
        </p>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          For a detailed explanation, see the Census Bureau's{' '}
          <a href="https://www.census.gov/topics/public-sector/congressional-apportionment/about/computing.html"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Computing Apportionment
          </a>{' '}
          page and the Congressional Research Service report{' '}
          <a href="https://www.congress.gov/crs-product/R45951"
            target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
            Apportionment and Redistricting Process for the U.S. House of Representatives
          </a>.
        </p>
      </div>

      <div className="chart-card dark-card" ref={animCardRef}>
        <ShareMenu chartRef={animCardRef} chartId="apportionment-animation" title="2020 Apportionment — Animation" dark />
        <ApportionmentAnimation />
      </div>

      <div className="chart-card dark-card" ref={tableCardRef}>
        <ShareMenu chartRef={tableCardRef} chartId="apportionment-table" title="2020 Apportionment — Huntington-Hill Method" dark />
        <ApportionmentTable />
        <p style={{
          textAlign: 'center', marginTop: 32,
          fontSize: 12, color: '#64748b', fontFamily: "'DM Sans', sans-serif",
        }}>
          Source: 2020 U.S. Census · Huntington-Hill method (2 U.S.C. § 2a)
        </p>
      </div>
    </div>
  )
}
