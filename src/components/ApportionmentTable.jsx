import { useState, useMemo } from 'react'
import { populations, allRows, finalSeats } from '../data/apportionmentData'

const PAGE_SIZE = 100

function fmt(n) { return n.toLocaleString() }
function fmtPri(v) { return v == null ? '—' : v.toLocaleString(undefined, { maximumFractionDigits: 2 }) }

const stateOptions = populations.map(p => p[1]).sort()

export default function ApportionmentTable() {
  const [stateFilter, setStateFilter] = useState('')
  const [seatRange, setSeatRange] = useState('all')
  const [page, setPage] = useState(1)
  const [showAll, setShowAll] = useState(false)

  const activeState = stateFilter

  const filtered = useMemo(() => {
    return allRows.filter(r => {
      if (activeState && r.abbr !== activeState) return false
      if (seatRange !== 'all' && !r.isFirst) {
        const [lo, hi] = seatRange.split('-').map(Number)
        if (r.step < lo || r.step > hi) return false
      }
      return true
    })
  }, [activeState, seatRange])

  const totalPages = showAll ? 1 : Math.ceil(filtered.length / PAGE_SIZE)
  const safePage = showAll ? 1 : Math.min(page, Math.max(1, totalPages))
  const slice = showAll ? filtered : filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const stats = useMemo(() => {
    if (activeState && finalSeats[activeState]) {
      const pop = populations.find(p => p[1] === activeState)[2]
      return [
        { label: 'Final seats', value: finalSeats[activeState] },
        { label: 'Population', value: (pop / 1e6).toFixed(2) + 'M' },
        { label: 'People per seat', value: fmt(Math.round(pop / finalSeats[activeState])) },
        { label: 'Rows shown', value: filtered.length },
      ]
    }
    return [
      { label: 'Largest delegation', value: 'CA: 52' },
      { label: 'Smallest delegation', value: '6 states: 1' },
      { label: 'Total seats', value: '435' },
      { label: 'Rows shown', value: filtered.length },
    ]
  }, [activeState, filtered.length])

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      }}>
        <label style={{ color: '#94a3b8' }}>Filter by state:</label>
        <select
          value={stateFilter}
          onChange={e => { setStateFilter(e.target.value); setPage(1) }}
          style={{
            fontSize: 13, padding: '4px 8px', border: '1px solid #334155',
            borderRadius: 6, background: '#1e293b', color: '#e2e8f0',
          }}
        >
          <option value="">All states</option>
          {stateOptions.map(abbr => <option key={abbr} value={abbr}>{abbr}</option>)}
        </select>

        <label style={{ color: '#94a3b8', marginLeft: 8 }}>Show seats:</label>
        <select
          value={seatRange}
          onChange={e => { setSeatRange(e.target.value); setPage(1) }}
          style={{
            fontSize: 13, padding: '4px 8px', border: '1px solid #334155',
            borderRadius: 6, background: '#1e293b', color: '#e2e8f0',
          }}
        >
          <option value="all">All 435</option>
          <option value="51-100">51–100</option>
          <option value="101-200">101–200</option>
          <option value="201-300">201–300</option>
          <option value="301-435">301–435</option>
        </select>

        <label style={{
          color: '#94a3b8', marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        }}>
          <input
            type="checkbox"
            checked={showAll}
            onChange={e => { setShowAll(e.target.checked); setPage(1) }}
            style={{ accentColor: '#60a5fa' }}
          />
          Show all rows
        </label>
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 10, marginBottom: 16,
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 14px',
          }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: '#e2e8f0' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{
        overflowX: 'auto', maxHeight: showAll ? 'none' : 600, overflowY: showAll ? 'visible' : 'auto',
        border: '1px solid #1e293b', borderRadius: 8, background: 'rgba(255,255,255,0.02)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['#', 'State', 'Abbr', 'Seat', 'Formula: pop ÷ √(n × (n−1))', 'Priority value', 'Running total'].map(h => (
                <th key={h} style={{
                  position: 'sticky', top: 0, background: '#1e293b', padding: '8px 12px',
                  textAlign: 'left', fontWeight: 500, fontSize: 12, color: '#94a3b8',
                  borderBottom: '1px solid #334155', whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={i} style={{ cursor: 'default' }}
                onMouseEnter={e => { for (const td of e.currentTarget.children) td.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { for (const td of e.currentTarget.children) td.style.background = '' }}
              >
                <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {r.isFirst ? '—' : r.step}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: 500, color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                  {r.name}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                  {r.abbr}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                  <span style={{
                    display: 'inline-block', padding: '1px 7px', borderRadius: 99,
                    fontSize: 11, fontWeight: 500,
                    background: r.isFirst ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                    color: r.isFirst ? '#10b981' : '#60a5fa',
                  }}>
                    {r.isFirst ? '1st (guaranteed)' : r.seatNum}
                  </span>
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#64748b' }}>
                    {r.isFirst ? 'guaranteed — no calculation' : r.formula}
                  </span>
                </td>
                <td style={{
                  padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#cbd5e1', whiteSpace: 'nowrap',
                }}>
                  {fmtPri(r.priority)}
                </td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                  {r.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {slice.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
            No matching rows.
          </div>
        )}
      </div>

      {/* Pager */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center', marginTop: 10,
          fontSize: 13, color: '#94a3b8',
        }}>
          <button
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            style={{
              fontSize: 13, padding: '3px 10px', border: '1px solid #334155',
              borderRadius: 6, background: '#1e293b', color: '#e2e8f0',
              cursor: safePage === 1 ? 'default' : 'pointer',
              opacity: safePage === 1 ? 0.4 : 1,
            }}
          >
            ← prev
          </button>
          <span>Page {safePage} of {totalPages}</span>
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            style={{
              fontSize: 13, padding: '3px 10px', border: '1px solid #334155',
              borderRadius: 6, background: '#1e293b', color: '#e2e8f0',
              cursor: safePage === totalPages ? 'default' : 'pointer',
              opacity: safePage === totalPages ? 0.4 : 1,
            }}
          >
            next →
          </button>
          <span style={{ marginLeft: 8, fontSize: 12 }}>({filtered.length} rows total)</span>
        </div>
      )}
    </div>
  )
}
