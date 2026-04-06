import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import { YEARS, AGENCIES } from '../data/operatingIndicators'

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
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e4) return (n / 1e3).toFixed(0) + 'K'
  if (Number.isInteger(n) || Math.abs(n) >= 100) return n.toLocaleString('en-US')
  return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

function formatFull(n) {
  if (n === null || n === undefined) return '\u2014'
  if (Number.isInteger(n) || Math.abs(n) >= 100) return n.toLocaleString('en-US')
  return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

// Group agencies by category
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
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
    </div>
  )
}

export default function OperatingIndicatorsChart() {
  const [agency, setAgency] = useState('')
  const [metric, setMetric] = useState('')

  const grouped = useMemo(getGroupedAgencies, [])
  const metrics = agency ? Object.keys(AGENCIES[agency].metrics) : []
  const entry = agency && metric ? AGENCIES[agency].metrics[metric] : null

  const chartData = useMemo(() => {
    if (!entry) return []
    return YEARS.map((yr, i) => ({ year: 'FY' + yr, value: entry.values[i] }))
  }, [entry])

  const stats = useMemo(() => {
    if (!entry) return null
    const vals = entry.values.filter(v => v !== null)
    const latest = entry.values[entry.values.length - 1]
    const earliest = entry.values[0]
    const peak = Math.max(...vals)
    const trough = Math.min(...vals)
    const peakYear = YEARS[entry.values.indexOf(peak)]
    const troughYear = YEARS[entry.values.indexOf(trough)]
    let pctChange = null
    if (earliest !== null && earliest !== 0 && latest !== null) {
      pctChange = ((latest - earliest) / Math.abs(earliest)) * 100
    }
    return { latest, earliest, peak, trough, peakYear, troughYear, pctChange }
  }, [entry])

  const handleAgencyChange = (e) => {
    setAgency(e.target.value)
    setMetric('')
  }

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24,
      }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6,
            fontFamily: "'DM Sans', sans-serif",
          }}>Agency / Department</label>
          <select
            value={agency}
            onChange={handleAgencyChange}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 15,
              background: 'rgba(255,255,255,0.06)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
              appearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            <option value="" style={{ background: '#0a0e17', color: '#888' }}>
              Select an agency\u2026
            </option>
            {grouped.map(g => (
              <optgroup key={g.category} label={g.category} style={{ background: '#0a0e17', color: '#ccc' }}>
                {g.agencies.map(a => (
                  <option key={a} value={a} style={{ background: '#0a0e17', color: '#fff' }}>{a}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <label style={{
            display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 6,
            fontFamily: "'DM Sans', sans-serif",
          }}>Indicator</label>
          <select
            value={metric}
            onChange={e => setMetric(e.target.value)}
            disabled={!agency}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 15,
              background: 'rgba(255,255,255,0.06)', color: agency ? '#fff' : 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              cursor: agency ? 'pointer' : 'not-allowed',
              opacity: agency ? 1 : 0.5,
              appearance: 'none',
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            <option value="" style={{ background: '#0a0e17', color: '#888' }}>
              {agency ? 'Select an indicator\u2026' : 'Pick an agency first'}
            </option>
            {metrics.map(m => (
              <option key={m} value={m} style={{ background: '#0a0e17', color: '#fff' }}>{m}</option>
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
          <span style={{ fontSize: 15 }}>Pick an agency and indicator to see the trend</span>
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
              {agency} &middot; FY2016\u2013FY2025
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
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNum}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
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
                  Latest (FY2025)
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
