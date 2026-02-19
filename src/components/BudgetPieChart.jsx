import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'

const PALETTE = [
  '#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
  '#1e40af', '#1d4ed8', '#2a5298', '#4a7fc1', '#6b9fd4',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#a78bfa', '#c4b5fd',
  '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
  '#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a',
  '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca',
  '#db2777', '#ec4899', '#f472b6', '#f9a8d4',
  '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9',
  '#4b5563', '#6b7280', '#9ca3af', '#d1d5db',
  '#78716c', '#a8a29e', '#d6d3d1',
  '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1',
  '#365314', '#4d7c0f', '#65a30d', '#84cc16', '#a3e635',
  '#7e22ce', '#9333ea', '#a855f7', '#c084fc',
]

const THRESHOLDS = [0.25, 0.5, 1.0, 2.0, 5.0]

function formatDollars(v) {
  if (v < 0) return `−$${(Math.abs(v) / 1e9).toFixed(1)}B`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
  return `$${(v / 1e3).toFixed(0)}K`
}

function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="#fff" strokeWidth={2} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 13}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  )
}

function ChartTooltip({ active, payload, netTotal }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="chart-tooltip">
      <div className="tt-name">{d.name}</div>
      <div className="tt-value">{formatDollars(d.value)}</div>
      <div className="tt-pct">{(d.value / netTotal * 100).toFixed(2)}% of total</div>
    </div>
  )
}

/**
 * BudgetPieChart — reusable donut chart for any fiscal year's expense budget.
 *
 * Props:
 *   title       — e.g. "FY2026 Adopted Expense Budget"
 *   subtitle    — e.g. "Net Total: $115.9 Billion — By Agency"
 *   note        — optional footnote, e.g. about excluded line items
 *   agencies    — array of { name: string, value: number } (positive values only for pie)
 *   netTotal    — the net total budget number (used for % calculations)
 */
export default function BudgetPieChart({ title, subtitle, note, agencies, netTotal }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [threshold, setThreshold] = useState(1.0)

  const positiveAgencies = useMemo(() =>
    agencies.filter(d => d.value > 0).sort((a, b) => b.value - a.value),
    [agencies]
  )

  const { display } = useMemo(() => {
    const cutoff = netTotal * (threshold / 100)
    const above = positiveAgencies.filter(d => d.value >= cutoff)
    const below = positiveAgencies.filter(d => d.value < cutoff)
    const otherVal = below.reduce((s, d) => s + d.value, 0)
    const display = [...above]
    if (otherVal > 0) display.push({ name: `Other (${below.length} agencies)`, value: otherVal })
    return { display }
  }, [positiveAgencies, netTotal, threshold])

  return (
    <div className="chart-card">
      <h2>{title}</h2>
      <p className="chart-subtitle">{subtitle}</p>
      {note && <p className="chart-note">{note}</p>}

      <div className="threshold-bar">
        <span className="label">Show agencies above:</span>
        {THRESHOLDS.map(t => (
          <button key={t}
            className={`threshold-btn ${threshold === t ? 'active' : ''}`}
            onClick={() => { setThreshold(t); setActiveIndex(null) }}
          >
            {t}%
          </button>
        ))}
      </div>

      <div className="chart-layout">
        <div className="chart-pie-area">
          <ResponsiveContainer width="100%" height={440}>
            <PieChart>
              <Pie
                data={display} dataKey="value"
                cx="50%" cy="50%"
                innerRadius={72} outerRadius={175}
                paddingAngle={0.4}
                activeIndex={activeIndex}
                activeShape={ActiveShape}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {display.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="#fff" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip netTotal={netTotal} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-legend-area">
          <table className="legend-table">
            <thead>
              <tr>
                <th>Agency</th>
                <th>Budget</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {display.map((d, i) => (
                <tr key={i}
                  className={activeIndex === i ? 'highlight' : ''}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <td>
                    <div className="legend-name-cell">
                      <span className="legend-swatch" style={{ background: PALETTE[i % PALETTE.length] }} />
                      {d.name}
                    </div>
                  </td>
                  <td>{formatDollars(d.value)}</td>
                  <td>{(d.value / netTotal * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
