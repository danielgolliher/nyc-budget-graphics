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
      </div>

      <div className="chart-card dark-card" ref={chartCardRef}>
        <ShareMenu chartRef={chartCardRef} chartId="growth-chart" title="The Power of More Economic Growth" dark />
        <GrowthChart />
      </div>
    </div>
  )
}
