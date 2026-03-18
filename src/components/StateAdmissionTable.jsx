import { useState, useMemo } from 'react'
import { states, categories, eras } from '../data/stateAdmissionData'

const catKeys = Object.keys(categories)
const eraKeys = Object.keys(eras)

const catColors = {
  original:    { bg: '#ccd5e0', color: '#1e2d4a' },
  territory:   { bg: '#d4e8d0', color: '#2a5a20' },
  partition:   { bg: '#d0dbe8', color: '#1e3a5f' },
  republic:    { bg: '#e8d4d0', color: '#6b2a1e' },
  unorganized: { bg: '#e8e0d0', color: '#5a4a20' },
  compromise:  { bg: '#e0d0e8', color: '#4a205a' },
  wartime:     { bg: '#e8d0d0', color: '#6b1e1e' },
}

export default function StateAdmissionTable() {
  const [search, setSearch] = useState('')
  const [eraFilter, setEraFilter] = useState('')
  const [activeCats, setActiveCats] = useState([])
  const [sortCol, setSortCol] = useState(0)
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    let result = states.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
      if (eraFilter && s.era !== eraFilter) return false
      if (activeCats.length > 0 && !activeCats.includes(s.cat)) return false
      return true
    })

    result = [...result].sort((a, b) => {
      let valA, valB
      if (sortCol === 0) { valA = a.order; valB = b.order }
      else if (sortCol === 1) { valA = a.name.toLowerCase(); valB = b.name.toLowerCase() }
      else if (sortCol === 2) { valA = new Date(a.date); valB = new Date(b.date) }
      else return 0
      if (valA < valB) return sortAsc ? -1 : 1
      if (valA > valB) return sortAsc ? 1 : -1
      return 0
    })

    return result
  }, [search, eraFilter, activeCats, sortCol, sortAsc])

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }

  const toggleCat = (cat) => {
    setActiveCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const resetFilters = () => {
    setSearch('')
    setEraFilter('')
    setActiveCats([])
  }

  const thStyle = (col) => ({
    background: '#2c1810', color: '#f5f0e8',
    fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 15,
    padding: '12px 14px', textAlign: 'left', position: 'sticky', top: 0, zIndex: 10,
    borderBottom: '3px solid #8b2500', cursor: col <= 2 ? 'pointer' : 'default',
    whiteSpace: 'nowrap', userSelect: 'none',
  })

  const arrow = (col) => (
    <span style={{ fontSize: 11, marginLeft: 4, opacity: sortCol === col ? 1 : 0.4 }}>
      {sortCol === col ? (sortAsc ? '▲' : '▼') : '▲'}
    </span>
  )

  return (
    <div>
      {/* Filters */}
      <div style={{
        background: '#ebe5d9', border: '1px solid #c4b9a8', borderRadius: 6,
        padding: '14px 18px', marginBottom: 16,
        display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#665' }}>
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="State name..."
            style={{
              fontSize: 16, padding: '6px 10px', border: '1px solid #c4b9a8',
              borderRadius: 4, background: '#fff', color: '#1a1a1a', minWidth: 200,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#665' }}>
            Era
          </label>
          <select
            value={eraFilter}
            onChange={e => setEraFilter(e.target.value)}
            style={{
              fontSize: 14, padding: '6px 10px', border: '1px solid #c4b9a8',
              borderRadius: 4, background: '#fff', color: '#1a1a1a', minWidth: 160,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <option value="">All eras</option>
            {eraKeys.map(k => <option key={k} value={k}>{eras[k]}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#665' }}>
            Path to Statehood
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {catKeys.map(k => (
              <button
                key={k}
                onClick={() => toggleCat(k)}
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 20,
                  border: `1px solid ${activeCats.includes(k) ? '#2c1810' : '#c4b9a8'}`,
                  background: activeCats.includes(k) ? '#2c1810' : '#fff',
                  color: activeCats.includes(k) ? '#f5f0e8' : '#1a1a1a',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {categories[k].label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={resetFilters}
          style={{
            fontSize: 13, padding: '6px 14px', border: '1px solid #c4b9a8',
            borderRadius: 4, background: '#fff', color: '#8b2500', cursor: 'pointer',
            alignSelf: 'flex-end', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Reset
        </button>

        <span style={{
          fontSize: 13, color: '#887', marginLeft: 'auto',
          alignSelf: 'flex-end', paddingBottom: 4, whiteSpace: 'nowrap',
        }}>
          Showing {filtered.length} of 50
        </span>
      </div>

      {/* Table */}
      <div style={{
        overflowX: 'auto', border: '1px solid #c4b9a8', borderRadius: 6,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900, fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle(0), width: 42, textAlign: 'center' }} onClick={() => handleSort(0)}>
                # {arrow(0)}
              </th>
              <th style={{ ...thStyle(1), width: 120 }} onClick={() => handleSort(1)}>
                State {arrow(1)}
              </th>
              <th style={{ ...thStyle(2), width: 130 }} onClick={() => handleSort(2)}>
                Admitted {arrow(2)}
              </th>
              <th style={{ ...thStyle(3), width: 260 }}>
                Enabling / Admission Act
              </th>
              <th style={thStyle(4)}>
                How It Became a State
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.order} style={{ borderBottom: '1px solid #ddd5c8' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff8e7'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{
                  padding: '10px 14px', textAlign: 'center', fontWeight: 600,
                  color: '#8b2500', fontFamily: "'Source Serif 4', serif", fontSize: 16,
                  verticalAlign: 'top',
                }}>
                  {s.order}
                </td>
                <td style={{
                  padding: '10px 14px', fontWeight: 600, whiteSpace: 'nowrap',
                  verticalAlign: 'top', color: '#1a1a1a',
                }}>
                  {s.name}
                </td>
                <td style={{
                  padding: '10px 14px', whiteSpace: 'nowrap', fontSize: 14,
                  verticalAlign: 'top', color: '#1a1a1a',
                }}>
                  {s.dateDisplay}
                </td>
                <td
                  style={{ padding: '10px 14px', verticalAlign: 'top', fontSize: 14, lineHeight: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: s.actHtml }}
                  className="admission-act-cell"
                />
                <td
                  style={{ padding: '10px 14px', verticalAlign: 'top', fontSize: 14, lineHeight: 1.5 }}
                  dangerouslySetInnerHTML={{ __html: s.summaryHtml }}
                  className="admission-summary-cell"
                />
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#887', fontSize: 14 }}>
            No matching states.
          </div>
        )}
      </div>
    </div>
  )
}
