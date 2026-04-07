import { useRef } from 'react'
import SeqraBattle from '../components/SeqraBattle'
import ShareMenu from '../components/ShareMenu'

export default function SeqraBattlePage() {
  const cardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>HOUSE vs. SEQRA</h1>
        <p className="subtitle">
          A wild SEQRA appeared! Can New York housing survive the State Environmental Quality Review Act?
        </p>
      </div>

      <div style={{
        maxWidth: 780, margin: '0 auto 32px', padding: '0 16px',
        fontSize: 15, lineHeight: 1.75, color: 'var(--color-navy)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ marginBottom: 12 }}>
          Daniel just made this for fun, as an example of what is easily possible
          with AI tools, and how it can change discussion and advocacy. See
          Governor Hochul's{' '}
          <a
            href="https://www.governor.ny.gov/news/let-them-build-governor-hochul-unveils-landmark-reforms-cut-red-tape-and-build-more-housing"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-accent)' }}
          >
            "Let Them Build"
          </a>{' '}
          agenda for more on SEQRA reform.
        </p>
      </div>

      <div className="chart-card" ref={cardRef} style={{ overflow: 'hidden' }}>
        <ShareMenu chartRef={cardRef} chartId="seqra-battle" title="HOUSE vs. SEQRA" />
        <SeqraBattle />
      </div>

      <div style={{
        maxWidth: 780, margin: '24px auto 0', padding: '0 16px',
        textAlign: 'center', fontSize: 12, color: '#887',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Learn more:{' '}
        <a
          href="https://www.governor.ny.gov/news/let-them-build-governor-hochul-unveils-landmark-reforms-cut-red-tape-and-build-more-housing"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)', textDecoration: 'none', borderBottom: '1px dotted var(--color-accent)' }}
        >
          Governor Hochul's "Let Them Build" Agenda
        </a>
      </div>
    </div>
  )
}
