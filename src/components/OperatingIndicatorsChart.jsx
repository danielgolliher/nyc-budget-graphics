import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import { YEARS as OP_YEARS, AGENCIES } from '../data/operatingIndicators'
import { YEARS as FT_YEARS, FINANCIAL_TRENDS } from '../data/financialTrends'
import { YEARS as RD_YEARS, REVENUE_CAPACITY, DEBT_CAPACITY } from '../data/revenueAndDebt'
import { YEARS as DM_YEARS, DEMOGRAPHICS } from '../data/demographics'

const SECTIONS = [
  { key: 'financial', label: 'Financial Trends' },
  { key: 'revenue', label: 'Revenue Capacity' },
  { key: 'debt', label: 'Debt Capacity' },
  { key: 'demographics', label: 'Demographics & Economy' },
  { key: 'operating', label: 'Operating Information' },
]

const CATEGORY_ORDER = [
  'General Government',
  'Public Safety & Judicial',
  'Education',
  'Social Services',
  'Environmental Protection',
  'Transportation',
  'Parks, Recreation & Culture',
  'Housing',
  'Health',
  'Libraries',
]

function formatNum(n) {
  if (n === null || n === undefined) return '\u2014'
  const abs = Math.abs(n)
  if (abs >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (abs >= 1e4) return (n / 1e3).toFixed(0) + 'K'
  if (Number.isInteger(n) || abs >= 100) return n.toLocaleString('en-US')
  return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

function formatFull(n) {
  if (n === null || n === undefined) return '\u2014'
  if (Number.isInteger(n) || Math.abs(n) >= 100) return n.toLocaleString('en-US')
  return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

function getGroupedAgencies() {
  const groups = {}
  for (const [name, info] of Object.entries(AGENCIES)) {
    const cat = info.category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(name)
  }
  return CATEGORY_ORDER.map(cat => ({ category: cat, agencies: groups[cat] || [] }))
    .filter(g => g.agencies.length > 0)
}

// Convert a raw number + unit into a human-readable string like "$86.2 billion"
function humanReadable(n, unit) {
  if (n === null || n === undefined) return null
  const abs = Math.abs(n)

  // Determine the multiplier to get actual dollars
  let actualValue = n
  let isDollar = false
  if (unit && unit.includes('thousands ($)')) {
    actualValue = n * 1000
    isDollar = true
  } else if (unit && unit.includes('millions ($)')) {
    actualValue = n * 1000000
    isDollar = true
  }

  if (isDollar) {
    const absActual = Math.abs(actualValue)
    const sign = actualValue < 0 ? '-' : ''
    if (absActual >= 1e12) return sign + '$' + (absActual / 1e12).toFixed(1) + ' trillion'
    if (absActual >= 1e9) return sign + '$' + (absActual / 1e9).toFixed(1) + ' billion'
    if (absActual >= 1e6) return sign + '$' + (absActual / 1e6).toFixed(1) + ' million'
    if (absActual >= 1e3) return sign + '$' + (absActual / 1e3).toFixed(0) + ' thousand'
    return sign + '$' + absActual.toFixed(0)
  }

  // Non-dollar: just show a rounded human-readable version for large numbers
  if (abs >= 1e9) return (n / 1e9).toFixed(1) + ' billion'
  if (abs >= 1e6) return (n / 1e6).toFixed(1) + ' million'
  if (abs >= 1e4) return (n / 1e3).toFixed(0) + ' thousand'
  return null // No summary needed for small numbers
}

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  const readable = humanReadable(v, unit)
  return (
    <div style={{
      background: '#0f1729', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8, padding: '10px 14px', fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
        {formatFull(v)}
      </div>
      {readable && (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
          {readable}
        </div>
      )}
    </div>
  )
}

const selectStyle = {
  width: '100%', padding: '10px 12px', fontSize: 15,
  background: 'rgba(255,255,255,0.06)', color: '#fff',
  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
  appearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
}

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6,
  fontFamily: "'DM Sans', sans-serif",
}

const optionStyle = { background: '#0a0e17', color: '#fff' }
const optionMuted = { background: '#0a0e17', color: '#888' }

export default function OperatingIndicatorsChart() {
  const [section, setSection] = useState('operating')
  const [category, setCategory] = useState('')
  const [metric, setMetric] = useState('')
  const [startAtZero, setStartAtZero] = useState(false)
  const [customMin, setCustomMin] = useState('')
  const [customMax, setCustomMax] = useState('')

  const isOperating = section === 'operating'
  const isFinancial = section === 'financial' || section === 'revenue' || section === 'debt' || section === 'demographics'
  const grouped = useMemo(getGroupedAgencies, [])

  const sectionData = useMemo(() => {
    switch (section) {
      case 'financial': return FINANCIAL_TRENDS
      case 'revenue': return REVENUE_CAPACITY
      case 'debt': return DEBT_CAPACITY
      case 'demographics': return DEMOGRAPHICS
      default: return null
    }
  }, [section])

  // Get category options based on section
  const categoryOptions = useMemo(() => {
    if (sectionData) return Object.keys(sectionData)
    return [] // For operating, we use optgroups
  }, [sectionData])

  // Get metric options based on section + category
  const metricOptions = useMemo(() => {
    if (!category) return []
    if (sectionData) {
      const table = sectionData[category]
      return table ? Object.keys(table.metrics) : []
    }
    const agency = AGENCIES[category]
    return agency ? Object.keys(agency.metrics) : []
  }, [sectionData, category])

  // Get the unit for the selected table
  const tableUnit = useMemo(() => {
    if (!category || !sectionData) return null
    return sectionData[category]?.unit || null
  }, [sectionData, category])

  // Get the selected entry
  const entry = useMemo(() => {
    if (!category || !metric) return null
    if (sectionData) {
      return sectionData[category]?.metrics[metric] || null
    }
    return AGENCIES[category]?.metrics[metric] || null
  }, [sectionData, category, metric])

  const years = useMemo(() => {
    switch (section) {
      case 'revenue': return RD_YEARS
      case 'debt': return RD_YEARS
      case 'demographics': return DM_YEARS
      case 'financial': return FT_YEARS
      default: return OP_YEARS
    }
  }, [section])

  const chartData = useMemo(() => {
    if (!entry) return []
    return years.map((yr, i) => ({ year: 'FY' + yr, value: entry.values[i] }))
  }, [entry, years])

  const stats = useMemo(() => {
    if (!entry) return null
    const vals = entry.values.filter(v => v !== null)
    const latest = entry.values[entry.values.length - 1]
    const earliest = entry.values[0]
    const peak = Math.max(...vals)
    const trough = Math.min(...vals)
    const peakYear = years[entry.values.indexOf(peak)]
    const troughYear = years[entry.values.indexOf(trough)]
    let pctChange = null
    if (earliest !== null && earliest !== 0 && latest !== null) {
      pctChange = ((latest - earliest) / Math.abs(earliest)) * 100
    }
    return { latest, earliest, peak, trough, peakYear, troughYear, pctChange }
  }, [entry, years])

  const yDomain = useMemo(() => {
    const hasMin = customMin !== '' && !isNaN(Number(customMin))
    const hasMax = customMax !== '' && !isNaN(Number(customMax))
    if (hasMin || hasMax) {
      return [
        hasMin ? Number(customMin) : (startAtZero ? 0 : 'auto'),
        hasMax ? Number(customMax) : 'auto',
      ]
    }
    return startAtZero ? [0, 'auto'] : ['auto', 'auto']
  }, [startAtZero, customMin, customMax])

  const handleSectionChange = (key) => {
    setSection(key)
    setCategory('')
    setMetric('')
    setCustomMin('')
    setCustomMax('')
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setMetric('')
    setCustomMin('')
    setCustomMax('')
  }

  // Subtitle for the category
  const categoryLabel = isOperating ? 'Agency / Department' : 'Table / Schedule'
  const yearRange = `FY${years[0]}\u2013FY${years[years.length - 1]}`

  return (
    <div>
      {/* Section pills */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap',
      }}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => handleSectionChange(s.key)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: section === s.key ? '#BE5343' : 'rgba(255,255,255,0.06)',
              color: section === s.key ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Dropdowns */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <label style={labelStyle}>{categoryLabel}</label>
          <select value={category} onChange={handleCategoryChange} style={selectStyle}>
            <option value="" style={optionMuted}>
              {isOperating ? 'Select an agency\u2026' : 'Select a table\u2026'}
            </option>
            {isOperating ? (
              grouped.map(g => (
                <optgroup key={g.category} label={g.category} style={{ background: '#0a0e17', color: '#ccc' }}>
                  {g.agencies.map(a => (
                    <option key={a} value={a} style={optionStyle}>{a}</option>
                  ))}
                </optgroup>
              ))
            ) : (
              categoryOptions.map(t => (
                <option key={t} value={t} style={optionStyle}>{t}</option>
              ))
            )}
          </select>
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <label style={labelStyle}>Indicator</label>
          <select
            value={metric}
            onChange={e => setMetric(e.target.value)}
            disabled={!category}
            style={{
              ...selectStyle,
              color: category ? '#fff' : 'rgba(255,255,255,0.3)',
              cursor: category ? 'pointer' : 'not-allowed',
              opacity: category ? 1 : 0.5,
            }}
          >
            <option value="" style={optionMuted}>
              {category ? 'Select an indicator\u2026' : 'Pick a category first'}
            </option>
            {metricOptions.map(m => (
              <option key={m} value={m} style={optionStyle}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart or placeholder */}
      {!entry ? (
        <div style={{
          height: 340, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.25)', gap: 12,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 5-9" />
          </svg>
          <span style={{ fontSize: 15 }}>
            {isOperating
              ? 'Pick an agency and indicator to see the trend'
              : 'Pick a table and indicator to see the trend'}
          </span>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#fff',
              fontFamily: "'Source Serif 4', Georgia, serif",
            }}>
              {metric}
            </div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.45)',
              fontFamily: "'DM Sans', sans-serif", marginTop: 2,
            }}>
              {category} &middot; {yearRange}
              {tableUnit && ` \u00b7 ${tableUnit}`}
            </div>
          </div>

          {/* Y-axis controls */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            marginBottom: 16, fontFamily: "'DM Sans', sans-serif",
          }}>
            <button
              onClick={() => { setStartAtZero(!startAtZero); setCustomMin(''); setCustomMax('') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 6, border: 'none',
                background: startAtZero ? 'rgba(190,83,67,0.2)' : 'rgba(255,255,255,0.06)',
                color: startAtZero ? '#e8a89e' : 'rgba(255,255,255,0.5)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
              }}
            >
              <span style={{
                display: 'inline-block', width: 28, height: 16, borderRadius: 8,
                background: startAtZero ? '#BE5343' : 'rgba(255,255,255,0.15)',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <span style={{
                  position: 'absolute', top: 2, left: startAtZero ? 14 : 2,
                  width: 12, height: 12, borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }} />
              </span>
              Start at zero
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Y-axis
              </span>
              <input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={e => { setCustomMin(e.target.value); if (e.target.value !== '') setStartAtZero(false) }}
                style={{
                  width: 72, padding: '5px 8px', fontSize: 13,
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>&ndash;</span>
              <input
                type="number"
                placeholder="Max"
                value={customMax}
                onChange={e => { setCustomMax(e.target.value) }}
                style={{
                  width: 72, padding: '5px 8px', fontSize: 13,
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {(customMin !== '' || customMax !== '') && (
                <button
                  onClick={() => { setCustomMin(''); setCustomMax('') }}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', fontSize: 14, padding: '2px 4px',
                  }}
                  title="Reset"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BE5343" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#BE5343" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 6"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  domain={yDomain}
                  allowDataOverflow={customMin !== '' || customMax !== ''}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNum}
                  width={65}
                />
                <Tooltip content={<CustomTooltip unit={tableUnit} />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#BE5343"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ r: 4, fill: '#BE5343', stroke: '#0a0e17', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#fff', stroke: '#BE5343', strokeWidth: 2.5 }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats row */}
          {stats && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
              marginTop: 20, paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  Latest (FY{years[years.length - 1]})
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  {formatFull(stats.latest)}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  10-Year Change
                </div>
                <div style={{
                  fontSize: 18, fontWeight: 700, marginTop: 4,
                  color: stats.pctChange > 0 ? '#34d399' : stats.pctChange < 0 ? '#f87171' : 'rgba(255,255,255,0.7)',
                }}>
                  {stats.pctChange !== null
                    ? (stats.pctChange >= 0 ? '+' : '') + stats.pctChange.toFixed(1) + '%'
                    : '\u2014'}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  Peak
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  {formatNum(stats.peak)}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  FY{stats.peakYear}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  Low
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  {formatNum(stats.trough)}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  FY{stats.troughYear}
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          {entry.note && (
            <div style={{
              marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.35)',
              fontStyle: 'italic', lineHeight: 1.5,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {entry.note}
            </div>
          )}
        </>
      )}
    </div>
  )
}
