import { useState, useRef, useEffect } from 'react'
import { categoryColorMap, formatPop } from '../data/statePopulation'

export default function SlopeChart({ data, hoveredState, setHoveredState, activeLegend }) {
  const svgRef = useRef(null)
  const [dims, setDims] = useState({ width: 700, height: 1100 })

  useEffect(() => {
    const el = svgRef.current?.parentElement
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      setDims({ width: Math.max(400, w), height: 1100 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const margin = { top: 50, bottom: 20, left: 150, right: 150 }
  const innerW = dims.width - margin.left - margin.right
  const innerH = dims.height - margin.top - margin.bottom
  const rowH = innerH / 50

  const getY = (rank) => margin.top + (rank - 1) * rowH + rowH / 2
  const x1 = margin.left
  const x2 = margin.left + innerW

  const getLineColor = (d) => categoryColorMap[d.category]

  const isHighlighted = (d) => {
    if (hoveredState) return hoveredState === d.abbr
    if (activeLegend) return d.category === activeLegend
    return false
  }

  const isAnyActive = hoveredState !== null || activeLegend !== null

  const hoveredData = hoveredState ? data.find((s) => s.abbr === hoveredState) : null
  let tooltip = null
  if (hoveredData) {
    const d = hoveredData
    const midX = (x1 + x2) / 2
    const midY = (getY(d.rank1960) + getY(d.rank2024)) / 2
    const boxW = 220
    const boxH = 92
    let boxY = midY - boxH / 2
    if (boxY < 10) boxY = 10
    if (boxY + boxH > dims.height - 10) boxY = dims.height - boxH - 10
    tooltip = (
      <g>
        <rect x={midX - boxW / 2} y={boxY} width={boxW} height={boxH} rx={6}
          fill="#1e293b" stroke="#475569" strokeWidth={1} />
        <text x={midX} y={boxY + 18} textAnchor="middle"
          style={{ fontSize: 13, fontWeight: 700, fill: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace" }}>
          {d.state}
        </text>
        <text x={midX} y={boxY + 35} textAnchor="middle"
          style={{ fontSize: 11, fill: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
          {`#${d.rank1960} (${formatPop(d.pop1960)}) → #${d.rank2024} (${formatPop(d.pop2024)})`}
        </text>
        <text x={midX} y={boxY + 52} textAnchor="middle"
          style={{
            fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            fill: d.shift > 0 ? '#4ade80' : d.shift < 0 ? '#f87171' : '#94a3b8',
          }}>
          {d.shift > 0 ? `▲ ${d.shift} ranks` : d.shift < 0 ? `▼ ${Math.abs(d.shift)} ranks` : '— no change'}
        </text>
        <text x={midX} y={boxY + 68} textAnchor="middle"
          style={{ fontSize: 11, fill: '#38bdf8', fontFamily: "'JetBrains Mono', monospace" }}>
          {`${d.pctChange > 0 ? '+' : ''}${d.pctChange}% growth`}
        </text>
        <text x={midX} y={boxY + 83} textAnchor="middle"
          style={{
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            fill: d.netVsUS > 0 ? '#a78bfa' : '#f97316',
          }}>
          {`${d.netVsUS > 0 ? '+' : ''}${d.netVsUS}% vs US avg`}
        </text>
      </g>
    )
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg ref={svgRef} width={dims.width} height={dims.height}
        style={{ display: 'block', margin: '0 auto' }}>
        <text x={x1} y={margin.top - 24} textAnchor="middle"
          style={{ fontSize: 15, fontWeight: 700, fill: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
          1960
        </text>
        <text x={x2} y={margin.top - 24} textAnchor="middle"
          style={{ fontSize: 15, fontWeight: 700, fill: '#cbd5e1', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
          2024
        </text>

        {/* Alternating row stripes */}
        {Array.from({ length: 50 }, (_, i) => (
          <rect key={`stripe-${i}`}
            x={0} y={getY(i + 1) - rowH / 2}
            width={dims.width} height={rowH}
            fill={i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'}
          />
        ))}

        {/* Slope lines */}
        {data.map((d) => {
          const lit = isHighlighted(d)
          const opacity = isAnyActive ? (lit ? 1 : 0.06) : 0.6
          const strokeW = isAnyActive && lit ? 4.5 : 3
          return (
            <line key={d.abbr}
              x1={x1 + 28} y1={getY(d.rank1960)}
              x2={x2 - 28} y2={getY(d.rank2024)}
              stroke={getLineColor(d)}
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={opacity}
              style={{ transition: 'opacity 0.2s, stroke-width 0.2s' }}
            />
          )
        })}

        {/* Left labels (1960) */}
        {data.map((d) => {
          const lit = isHighlighted(d)
          const opacity = isAnyActive ? (lit ? 1 : 0.2) : 0.9
          return (
            <g key={`left-${d.abbr}`}
              onMouseEnter={() => setHoveredState(d.abbr)}
              onMouseLeave={() => setHoveredState(null)}
              style={{ cursor: 'pointer' }}>
              <text x={x1 - 8} y={getY(d.rank1960) + 1}
                textAnchor="end" dominantBaseline="middle"
                style={{
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  fill: lit ? '#f8fafc' : '#94a3b8',
                  fontWeight: lit ? 700 : 400, opacity, transition: 'all 0.2s',
                }}>
                {d.rank1960}. {d.abbr}
              </text>
              <circle cx={x1} cy={getY(d.rank1960)} r={lit ? 5 : 3.5}
                fill={getLineColor(d)} opacity={opacity} style={{ transition: 'all 0.2s' }} />
            </g>
          )
        })}

        {/* Right labels (2024) */}
        {data.map((d) => {
          const lit = isHighlighted(d)
          const opacity = isAnyActive ? (lit ? 1 : 0.2) : 0.9
          return (
            <g key={`right-${d.abbr}`}
              onMouseEnter={() => setHoveredState(d.abbr)}
              onMouseLeave={() => setHoveredState(null)}
              style={{ cursor: 'pointer' }}>
              <circle cx={x2} cy={getY(d.rank2024)} r={lit ? 5 : 3.5}
                fill={getLineColor(d)} opacity={opacity} style={{ transition: 'all 0.2s' }} />
              <text x={x2 + 8} y={getY(d.rank2024) + 1}
                textAnchor="start" dominantBaseline="middle"
                style={{
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  fill: lit ? '#f8fafc' : '#94a3b8',
                  fontWeight: lit ? 700 : 400, opacity, transition: 'all 0.2s',
                }}>
                {d.rank2024}. {d.abbr}
              </text>
            </g>
          )
        })}

        {tooltip}
      </svg>
    </div>
  )
}
