import { useRef } from 'react'
import GrowthChart from '../components/GrowthChart'
import ShareMenu from '../components/ShareMenu'

export default function GrowthChartPage() {
  const chartCardRef = useRef(null)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>The Power of More Economic Growth</h1>
        <p className="subtitle">
          Small differences in annual growth rates produce dramatically different outcomes over time.
          Add, remove, or adjust growth scenarios to see compound growth in action.
        </p>
        <p style={{
          fontSize: 14,
          color: 'var(--color-text-secondary)',
          marginTop: 12,
          lineHeight: 1.5,
          padding: '8px 12px',
          background: 'rgba(190,83,67,0.08)',
          border: '1px solid rgba(190,83,67,0.2)',
          borderRadius: 6,
          display: 'inline-block',
        }}>
          Created to accompany the Maximum New York post{' '}
          <a href="https://www.maximumnewyork.com/p/economic-growth-is-the-best" target="_blank" rel="noopener noreferrer" style={{ color: '#BE5343', textDecoration: 'none', fontStyle: 'italic', borderBottom: '1px solid rgba(190,83,67,0.4)' }}>Economic Growth is the Best</a>
        </p>
      </div>

      <div className="chart-card dark-card" ref={chartCardRef}>
        <ShareMenu chartRef={chartCardRef} chartId="growth-chart" title="The Power of More Economic Growth" dark />
        <GrowthChart />
      </div>
    </div>
  )
}
