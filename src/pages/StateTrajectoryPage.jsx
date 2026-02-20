import { useState, useRef } from 'react'
import SlopeChart from '../components/SlopeChart'
import SortableTable from '../components/SortableTable'
import ShareMenu from '../components/ShareMenu'
import { stateData, legendItems } from '../data/statePopulation'

export default function StateTrajectoryPage() {
  const [hoveredState, setHoveredState] = useState(null)
  const [activeLegend, setActiveLegend] = useState(null)
  const [lockedLegend, setLockedLegend] = useState(null)
  const slopeCardRef = useRef(null)
  const tableCardRef = useRef(null)

  const handleLegendClick = (key) => {
    setLockedLegend((prev) => (prev === key ? null : key))
    setActiveLegend((prev) => (prev === key ? null : key))
  }

  const handleLegendEnter = (key) => {
    if (!lockedLegend) setActiveLegend(key)
  }

  const handleLegendLeave = () => {
    if (!lockedLegend) setActiveLegend(null)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>The Great Shuffle</h1>
        <p className="subtitle">
          U.S. State Population Rankings — 1960 vs. 2024.
          How states have risen and fallen in the national pecking order over six decades.
        </p>
      </div>

      <div className="chart-card dark-card" ref={slopeCardRef}>
        <ShareMenu chartRef={slopeCardRef} chartId="state-slope-chart" title="The Great Shuffle — Slope Chart" dark />
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>
            Population Rank Changes
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>
            U.S. State Population Rankings — 1960 vs. 2024
          </p>
        </div>

        <div className="slope-legend-bar">
          {legendItems.map((item) => {
            const isActive = activeLegend === item.key
            const isLocked = lockedLegend === item.key
            const isAnyActive = activeLegend !== null
            return (
              <button key={item.key}
                onClick={() => handleLegendClick(item.key)}
                onMouseEnter={() => handleLegendEnter(item.key)}
                onMouseLeave={handleLegendLeave}
                className={`slope-legend-btn${isActive ? ' active' : ''}${isLocked ? ' locked' : ''}`}
                style={{
                  borderColor: isActive ? item.color : 'transparent',
                  background: isActive ? item.color + '18' : 'rgba(255,255,255,0.03)',
                  color: isAnyActive && !isActive ? '#475569' : '#94a3b8',
                  opacity: isAnyActive && !isActive ? 0.5 : 1,
                  outlineColor: isLocked ? item.color : 'transparent',
                }}>
                <span className="slope-legend-swatch" style={{
                  background: item.color,
                  opacity: isAnyActive && !isActive ? 0.3 : 1,
                }} />
                {item.label}
                {isActive && (
                  <span style={{ fontSize: 10, color: item.color, marginLeft: 2 }}>
                    {` (${stateData.filter((d) => d.category === item.key).length})`}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <SlopeChart
          data={stateData}
          hoveredState={hoveredState}
          setHoveredState={setHoveredState}
          activeLegend={activeLegend}
        />
      </div>

      <div className="chart-card dark-card" ref={tableCardRef}>
        <ShareMenu chartRef={tableCardRef} chartId="state-rankings-table" title="State Rankings Table" dark />
        <div style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: '#cbd5e1' }}>Rankings Table</h2>
          <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
            Click any column header to sort. Shift = ranks gained (+) or lost (−). % Change = population growth since 1960.
          </p>
        </div>

        <SortableTable
          data={stateData}
          hoveredState={hoveredState}
          setHoveredState={setHoveredState}
        />

        <p className="chart-source" style={{ textAlign: 'center', marginTop: 32 }}>
          Sources: 1960 U.S. Census · 2024 Census Bureau Estimates (in thousands)
        </p>
      </div>
    </div>
  )
}
