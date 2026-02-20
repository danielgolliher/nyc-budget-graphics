import { useState, useMemo } from 'react'

const columns = [
  { key: 'state', label: 'State', align: 'left' },
  { key: 'rank1960', label: 'Rank 1960', align: 'center' },
  { key: 'pop1960', label: 'Pop 1960', align: 'right' },
  { key: 'rank2024', label: 'Rank 2024', align: 'center' },
  { key: 'pop2024', label: 'Pop 2024', align: 'right' },
  { key: 'shift', label: 'Shift', align: 'center' },
  { key: 'pctChange', label: '% Change', align: 'right' },
]

export default function SortableTable({ data, hoveredState, setHoveredState }) {
  const [sortKey, setSortKey] = useState('rank2024')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    return data.slice().sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (typeof va === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      return sortDir === 'asc' ? va - vb : vb - va
    })
  }, [data, sortKey, sortDir])

  const arrow = (key) => {
    if (sortKey !== key) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="slope-table-wrap">
      <table className="slope-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}
                onClick={() => handleSort(col.key)}
                className={sortKey === col.key ? 'active' : ''}
                style={{ textAlign: col.align }}>
                {col.label}{arrow(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((d, i) => {
            const isHovered = hoveredState === d.abbr
            return (
              <tr key={d.abbr}
                onMouseEnter={() => setHoveredState(d.abbr)}
                onMouseLeave={() => setHoveredState(null)}
                className={isHovered ? 'hovered' : ''}
                style={{
                  background: isHovered
                    ? 'rgba(59,130,246,0.12)'
                    : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                }}>
                <td style={{ fontWeight: isHovered ? 600 : 400, color: '#e2e8f0' }}>{d.state}</td>
                <td style={{ textAlign: 'center', color: '#94a3b8' }}>{d.rank1960}</td>
                <td style={{ textAlign: 'right', color: '#94a3b8' }}>{(d.pop1960 * 1000).toLocaleString()}</td>
                <td style={{ textAlign: 'center', color: '#cbd5e1' }}>{d.rank2024}</td>
                <td style={{ textAlign: 'right', color: '#cbd5e1' }}>{(d.pop2024 * 1000).toLocaleString()}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className="shift-badge" style={{
                    color: d.shift > 0 ? '#4ade80' : d.shift < 0 ? '#f87171' : '#64748b',
                    background: d.shift > 0 ? 'rgba(74,222,128,0.1)' : d.shift < 0 ? 'rgba(248,113,113,0.1)' : 'transparent',
                  }}>
                    {d.shift > 0 ? `+${d.shift}` : d.shift === 0 ? '—' : d.shift}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="pct-badge" style={{
                    color: '#38bdf8',
                    background: d.pctChange > 500 ? 'rgba(56,189,248,0.12)' : 'transparent',
                  }}>
                    {`${d.pctChange > 0 ? '+' : ''}${d.pctChange}%`}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
