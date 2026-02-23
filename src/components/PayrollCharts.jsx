import { useState, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  topAgencies, overtimeLeaders, payrollSummary, agencyOvertimeDollars,
  topOvertimeEarners, topSalaries, compensationDistribution,
  filteredTopAgencies, filteredOvertimeLeaders, filteredPayrollSummary,
  filteredAgencyOvertimeDollars, filteredCompensationDistribution,
} from '../data/nycPayroll2025'

const COLORS = {
  regular: '#457B9D',
  overtime: '#E63946',
  other: '#2A9D8F',
}

const fmt = (val) => {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`
  return `$${val}`
}

const fmtFull = (val) => `$${(val / 1e9).toFixed(2)}B`
const fmtEmployees = (val) => val.toLocaleString()

// ---------------------------------------------------------------------------
// Shared: multi-select hook + summary panel
// ---------------------------------------------------------------------------
function useSelection() {
  const [selected, setSelected] = useState(new Set())
  const toggle = useCallback((idx) => setSelected(prev => {
    const next = new Set(prev)
    next.has(idx) ? next.delete(idx) : next.add(idx)
    return next
  }), [])
  const clear = useCallback(() => setSelected(new Set()), [])
  return { selected, toggle, clear, hasSelection: selected.size > 0 }
}

function SelectionBar({ items, onClear, count, hasSelection }) {
  if (hasSelection) {
    return (
      <div style={{
        background: 'rgba(69,123,157,0.12)', border: '1px solid rgba(69,123,157,0.35)',
        borderRadius: 8, padding: '10px 16px', marginBottom: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7fb3d3' }}>
            {count} selected
          </span>
          <button onClick={onClear} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4, color: '#94a3b8', cursor: 'pointer', fontSize: 11, padding: '3px 10px',
          }}>Clear</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', fontSize: 13, color: '#e2e8f0' }}>
          {items.map(({ label, value }) => (
            <div key={label}>
              <span style={{ color: '#94a3b8' }}>{label}: </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div style={{
      background: 'rgba(190,83,67,0.10)', border: '1px solid rgba(190,83,67,0.25)',
      borderRadius: 8, padding: '8px 16px', marginBottom: 16,
      textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: 13, color: '#e8a89f', fontWeight: 500, letterSpacing: '0.01em' }}>
        Click bars to select and sum
      </span>
    </div>
  )
}

function FilterBadge({ filtered, total, filteredTotal }) {
  if (!filtered) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: 'rgba(190,83,67,0.10)', border: '1px solid rgba(190,83,67,0.25)',
      borderRadius: 6, padding: '4px 12px', marginBottom: 12,
      fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#e8a89f',
    }}>
      <span style={{ fontWeight: 600 }}>Filtered:</span> showing {filteredTotal.toLocaleString()} of {total.toLocaleString()} employees ({(total - filteredTotal).toLocaleString()} with {'\u2264'} $0 comp removed)
    </div>
  )
}

// Bar opacity helper: selected = 1, unselected = 0.2 when selection exists, else use default
function barOpacity(hasSelection, selected, idx, defaultOpacity = 1) {
  if (!hasSelection) return defaultOpacity
  return selected.has(idx) ? 1 : 0.2
}

// ---------------------------------------------------------------------------
// Shared tooltip style
// ---------------------------------------------------------------------------
const ttStyle = {
  background: 'rgba(10,14,23,0.96)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif",
  fontSize: 13, lineHeight: 1.7, color: '#e2e8f0',
}

// ---------------------------------------------------------------------------
// 1. Top 20 Agencies — stacked horizontal bar
// ---------------------------------------------------------------------------
function CompTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ ...ttStyle, minWidth: 220 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: '#f8fafc' }}>{d.name}</div>
      <div><span style={{ color: COLORS.regular }}>Regular Pay</span>: {fmt(d.regular)}</div>
      <div><span style={{ color: COLORS.overtime }}>Overtime</span>: {fmt(d.overtime)}</div>
      <div><span style={{ color: COLORS.other }}>Other Pay</span>: {fmt(d.other)}</div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, paddingTop: 6, fontWeight: 600 }}>
        Total: {fmt(d.total)}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>{fmtEmployees(d.employees)} employees</div>
    </div>
  )
}

const OTHER_PAY_ABOUT = 'https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e/about_data'

const renderLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 4, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
    {[
      { key: 'regular', label: 'Regular Pay', color: COLORS.regular },
      { key: 'overtime', label: 'Overtime', color: COLORS.overtime },
      { key: 'other', label: 'Other Pay', color: COLORS.other, link: OTHER_PAY_ABOUT },
    ].map(item => (
      <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
        <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
        {item.link ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'underline', textDecorationColor: 'rgba(148,163,184,0.4)', textUnderlineOffset: 2 }}>
            {item.label}
          </a>
        ) : item.label}
      </div>
    ))}
  </div>
)

export function AgencyCompensationChart({ filtered = false }) {
  const { selected, toggle, clear, hasSelection } = useSelection()
  const data = filtered ? filteredTopAgencies : topAgencies
  const allEmp = topAgencies.reduce((s, d) => s + d.employees, 0)
  const filtEmp = filteredTopAgencies.reduce((s, d) => s + d.employees, 0)

  const summaryItems = []
  if (hasSelection) {
    const sel = data.filter((_, i) => selected.has(i))
    const r = sel.reduce((s, d) => s + d.regular, 0)
    const o = sel.reduce((s, d) => s + d.overtime, 0)
    const oth = sel.reduce((s, d) => s + d.other, 0)
    const emp = sel.reduce((s, d) => s + d.employees, 0)
    summaryItems.push(
      { label: 'Regular', value: fmt(r) },
      { label: 'Overtime', value: fmt(o) },
      { label: 'Other', value: fmt(oth) },
      { label: 'Total', value: fmt(r + o + oth) },
      { label: 'Employees', value: fmtEmployees(emp) },
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
          Top 20 Agencies by Total Compensation
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          FY2025 — Regular pay, overtime, and other compensation
        </p>
      </div>
      <FilterBadge filtered={filtered} total={allEmp} filteredTotal={filtEmp} />
      <SelectionBar items={summaryItems} onClear={clear} count={selected.size} hasSelection={hasSelection} />
      {renderLegend()}
      <ResponsiveContainer width="100%" height={620}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }} barSize={22}>
          <XAxis type="number" tickFormatter={fmt}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis type="category" dataKey="name" width={185}
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<CompTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="regular" stackId="comp" fill={COLORS.regular} onClick={(_, idx) => toggle(idx)}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS.regular} opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
          <Bar dataKey="overtime" stackId="comp" fill={COLORS.overtime} onClick={(_, idx) => toggle(idx)}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS.overtime} opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
          <Bar dataKey="other" stackId="comp" fill={COLORS.other} radius={[0, 4, 4, 0]} onClick={(_, idx) => toggle(idx)}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS.other} opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 2. Overtime as % of Regular Pay
// ---------------------------------------------------------------------------
function OTTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ ...ttStyle, minWidth: 200 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: '#f8fafc' }}>{d.name}</div>
      <div><span style={{ color: COLORS.overtime }}>Overtime</span>: {fmt(d.overtime)}</div>
      <div>Regular Pay: {fmt(d.regular)}</div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, paddingTop: 6 }}>
        <span style={{ fontWeight: 600, color: COLORS.overtime }}>OT = {d.otPct}%</span> of regular pay
      </div>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>{fmtEmployees(d.employees)} employees</div>
    </div>
  )
}

const OT_GRADIENT = [
  '#E63946', '#E84450', '#EB505A', '#ED5D65', '#F06A70',
  '#F2777B', '#F48486', '#F69191', '#F89E9D', '#FAABA8',
  '#FCB8B3', '#FEC5BF', '#FFD2CB',
]

export function OvertimeChart({ filtered = false }) {
  const { selected, toggle, clear, hasSelection } = useSelection()
  const data = filtered ? filteredOvertimeLeaders : overtimeLeaders
  const allEmp = overtimeLeaders.reduce((s, d) => s + d.employees, 0)
  const filtEmp = filteredOvertimeLeaders.reduce((s, d) => s + d.employees, 0)

  const summaryItems = []
  if (hasSelection) {
    const sel = data.filter((_, i) => selected.has(i))
    const ot = sel.reduce((s, d) => s + d.overtime, 0)
    const reg = sel.reduce((s, d) => s + d.regular, 0)
    const emp = sel.reduce((s, d) => s + d.employees, 0)
    summaryItems.push(
      { label: 'Overtime', value: fmt(ot) },
      { label: 'Regular', value: fmt(reg) },
      { label: 'Weighted OT %', value: `${(reg > 0 ? (ot / reg) * 100 : 0).toFixed(1)}%` },
      { label: 'Employees', value: fmtEmployees(emp) },
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
          Overtime as % of Regular Pay
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          FY2025 — Agencies with over $5M in overtime payments
        </p>
      </div>
      <FilterBadge filtered={filtered} total={allEmp} filteredTotal={filtEmp} />
      <SelectionBar items={summaryItems} onClear={clear} count={selected.size} hasSelection={hasSelection} />
      <ResponsiveContainer width="100%" height={Math.max(400, data.length * 38 + 40)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 60, left: 8, bottom: 4 }} barSize={24}>
          <XAxis type="number" tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} domain={[0, 'auto']} />
          <YAxis type="category" dataKey="name" width={185}
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<OTTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="otPct" radius={[0, 4, 4, 0]} onClick={(_, idx) => toggle(idx)}
            label={{ position: 'right', formatter: (v) => `${v}%`, fill: '#94a3b8', fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace" }}>
            {data.map((_, i) => (
              <Cell key={i} fill={OT_GRADIENT[Math.min(i, OT_GRADIENT.length - 1)]}
                opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. Total Overtime Dollars by Agency
// ---------------------------------------------------------------------------
function OTDollarsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ ...ttStyle, minWidth: 200 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: '#f8fafc' }}>{d.name}</div>
      <div><span style={{ color: COLORS.overtime }}>Total Overtime</span>: {fmt(d.overtime)}</div>
      <div>Employees with OT: {fmtEmployees(d.otEmployees)}</div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, paddingTop: 6 }}>
        Avg OT per employee: {fmt(d.avgOtPerEmployee)}
      </div>
    </div>
  )
}

export function AgencyOvertimeDollarsChart({ filtered = false }) {
  const { selected, toggle, clear, hasSelection } = useSelection()
  const data = filtered ? filteredAgencyOvertimeDollars : agencyOvertimeDollars
  const allEmp = agencyOvertimeDollars.reduce((s, d) => s + d.otEmployees, 0)
  const filtEmp = filteredAgencyOvertimeDollars.reduce((s, d) => s + d.otEmployees, 0)

  const summaryItems = []
  if (hasSelection) {
    const sel = data.filter((_, i) => selected.has(i))
    const ot = sel.reduce((s, d) => s + d.overtime, 0)
    const emp = sel.reduce((s, d) => s + d.otEmployees, 0)
    summaryItems.push(
      { label: 'Total Overtime', value: fmt(ot) },
      { label: 'OT Employees', value: fmtEmployees(emp) },
      { label: 'Avg OT / Employee', value: fmt(Math.round(ot / emp)) },
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
          Total Overtime Paid by Agency
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          FY2025 — Top 20 agencies by total overtime dollars
        </p>
      </div>
      <FilterBadge filtered={filtered} total={allEmp} filteredTotal={filtEmp} />
      <SelectionBar items={summaryItems} onClear={clear} count={selected.size} hasSelection={hasSelection} />
      <ResponsiveContainer width="100%" height={620}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 50, left: 8, bottom: 4 }} barSize={22}>
          <XAxis type="number" tickFormatter={fmt}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis type="category" dataKey="name" width={185}
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<OTDollarsTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="overtime" radius={[0, 4, 4, 0]} onClick={(_, idx) => toggle(idx)}>
            {data.map((_, i) => (
              <Cell key={i} fill={OT_GRADIENT[Math.min(i, OT_GRADIENT.length - 1)]}
                opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 4. Top Overtime Earners — grouped horizontal bar
// ---------------------------------------------------------------------------
function EmployeeTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ ...ttStyle, minWidth: 240 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: '#f8fafc' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{d.title} — {d.agency}</div>
      <div><span style={{ color: COLORS.regular }}>Regular Pay</span>: ${fmtEmployees(d.regular)}</div>
      <div><span style={{ color: COLORS.overtime }}>Overtime</span>: ${fmtEmployees(d.overtime)}</div>
      <div><span style={{ color: COLORS.other }}>Other Pay</span>: ${fmtEmployees(Math.max(0, d.other))}</div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, paddingTop: 6, fontWeight: 600 }}>
        Total Comp: ${fmtEmployees(d.total)}
      </div>
      <div style={{ color: COLORS.overtime, fontSize: 12 }}>OT is {d.otRatio}% of regular pay</div>
    </div>
  )
}

export function TopOvertimeEarnersChart() {
  const { selected, toggle, clear, hasSelection } = useSelection()

  const summaryItems = []
  if (hasSelection) {
    const sel = topOvertimeEarners.filter((_, i) => selected.has(i))
    const reg = sel.reduce((s, d) => s + d.regular, 0)
    const ot = sel.reduce((s, d) => s + d.overtime, 0)
    const tot = sel.reduce((s, d) => s + d.total, 0)
    summaryItems.push(
      { label: 'Combined Regular', value: `$${fmtEmployees(reg)}` },
      { label: 'Combined Overtime', value: `$${fmtEmployees(ot)}` },
      { label: 'Combined Total', value: `$${fmtEmployees(tot)}` },
      { label: 'Avg OT Ratio', value: `${(reg > 0 ? (ot / reg) * 100 : 0).toFixed(0)}%` },
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
          Top 25 Individual Overtime Earners
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          FY2025 — Regular pay vs. overtime for the highest OT earners. Many earn more in OT than base pay.
        </p>
      </div>
      <SelectionBar items={summaryItems} onClear={clear} count={selected.size} hasSelection={hasSelection} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: COLORS.regular }} /> Regular Pay
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: COLORS.overtime }} /> Overtime
        </div>
      </div>
      <ResponsiveContainer width="100%" height={topOvertimeEarners.length * 32 + 40}>
        <BarChart data={topOvertimeEarners} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }}
          barSize={11} barGap={2}>
          <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis type="category" dataKey="name" width={168}
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<EmployeeTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="regular" fill={COLORS.regular} radius={[0, 3, 3, 0]} onClick={(_, idx) => toggle(idx)}>
            {topOvertimeEarners.map((_, i) => (
              <Cell key={i} fill={COLORS.regular} opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
          <Bar dataKey="overtime" fill={COLORS.overtime} radius={[0, 3, 3, 0]} onClick={(_, idx) => toggle(idx)}>
            {topOvertimeEarners.map((_, i) => (
              <Cell key={i} fill={COLORS.overtime} opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 5. Highest Base Salaries
// ---------------------------------------------------------------------------
function SalaryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ ...ttStyle, minWidth: 220 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: '#f8fafc' }}>{d.name}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{d.title} — {d.agency}</div>
      <div><span style={{ color: '#E9C46A' }}>Base Salary</span>: ${fmtEmployees(d.salary)}</div>
      <div>Gross Paid: ${fmtEmployees(d.grossPaid)}</div>
    </div>
  )
}

export function TopSalariesChart() {
  const { selected, toggle, clear, hasSelection } = useSelection()

  const summaryItems = []
  if (hasSelection) {
    const sel = topSalaries.filter((_, i) => selected.has(i))
    const salaries = sel.map(d => d.salary)
    const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
    summaryItems.push(
      { label: 'Avg Base Salary', value: `$${fmtEmployees(avg)}` },
      { label: 'Highest', value: `$${fmtEmployees(Math.max(...salaries))}` },
      { label: 'Lowest', value: `$${fmtEmployees(Math.min(...salaries))}` },
      { label: 'Combined Salaries', value: fmt(salaries.reduce((a, b) => a + b, 0)) },
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
          Highest Base Salaries
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          FY2025 — Top 25 city employees by annual base salary
        </p>
      </div>
      <SelectionBar items={summaryItems} onClear={clear} count={selected.size} hasSelection={hasSelection} />
      <ResponsiveContainer width="100%" height={topSalaries.length * 32 + 40}>
        <BarChart data={topSalaries} layout="vertical" margin={{ top: 4, right: 50, left: 8, bottom: 4 }} barSize={20}>
          <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <YAxis type="category" dataKey="name" width={178}
            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<SalaryTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="salary" radius={[0, 4, 4, 0]} onClick={(_, idx) => toggle(idx)}
            label={{ position: 'right', formatter: (v) => `$${(v / 1000).toFixed(0)}K`,
              fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
            {topSalaries.map((_, i) => {
              const t = 1 - i / (topSalaries.length - 1)
              const r = Math.round(233 + (69 - 233) * (1 - t))
              const g = Math.round(196 + (130 - 196) * (1 - t))
              const b = Math.round(106 + (74 - 106) * (1 - t))
              return (
                <Cell key={i} fill={`rgb(${r},${g},${b})`}
                  opacity={barOpacity(hasSelection, selected, i)}
                  style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 6. Compensation Distribution Histogram
// ---------------------------------------------------------------------------
const DATA_SOURCE_URL = 'https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e/about_data'

function DistTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div style={{ ...ttStyle, minWidth: 200 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#f8fafc' }}>{d.band}</div>
      <div>{fmtEmployees(d.count)} employees</div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 6, paddingTop: 6 }}>
        Total compensation: {fmt(d.totalComp)}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>
        Avg per employee: ${fmtEmployees(Math.round(d.totalComp / d.count))}
      </div>
      {d.note && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{d.note}</div>}
    </div>
  )
}

function AngledTick({ x, y, payload }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="end" fill="#64748b" fontSize={10}
        fontFamily="'JetBrains Mono', monospace" transform="rotate(-45)">
        {payload.value}
      </text>
    </g>
  )
}

function findMedianBand(data) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const mid = Math.ceil(total / 2)
  let cum = 0
  for (const d of data) {
    cum += d.count
    if (cum >= mid) return d.band
  }
  return data[data.length - 1]?.band
}

export function CompensationDistributionChart({ filtered = false }) {
  const [excludeUnder10K, setExcludeUnder10K] = useState(false)
  const { selected, toggle, clear, hasSelection } = useSelection()

  const baseData = filtered ? filteredCompensationDistribution : compensationDistribution
  const data = excludeUnder10K
    ? baseData.filter(d => d.min >= 10000)
    : baseData

  const medianBand = findMedianBand(data)

  const summaryItems = []
  if (hasSelection) {
    const sel = data.filter((_, i) => selected.has(i))
    const emp = sel.reduce((s, d) => s + d.count, 0)
    const comp = sel.reduce((s, d) => s + d.totalComp, 0)
    summaryItems.push(
      { label: 'Employees', value: fmtEmployees(emp) },
      { label: 'Total Compensation', value: fmt(comp) },
      { label: 'Avg per Employee', value: `$${fmtEmployees(Math.round(comp / emp))}` },
      { label: 'Bands', value: sel.map(d => d.band).join(', ') },
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
          Total Compensation Distribution
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
          FY2025 — How {filtered ? '549,000+' : '550,000+'} city employees are distributed across pay bands
          (regular + OT + <a href={DATA_SOURCE_URL} target="_blank" rel="noopener noreferrer"
            style={{ color: '#7fb3d3', textDecoration: 'underline', textUnderlineOffset: 2 }}>other pay</a>)
        </p>
      </div>
      <FilterBadge filtered={filtered}
        total={compensationDistribution.reduce((s, d) => s + d.count, 0)}
        filteredTotal={filteredCompensationDistribution.reduce((s, d) => s + d.count, 0)} />
      <SelectionBar items={summaryItems} onClear={clear} count={selected.size} hasSelection={hasSelection} />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <button onClick={() => { setExcludeUnder10K(!excludeUnder10K); clear() }}
          style={{
            background: excludeUnder10K ? 'rgba(69,123,157,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${excludeUnder10K ? 'rgba(69,123,157,0.5)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 6, padding: '6px 14px', cursor: 'pointer',
            color: excludeUnder10K ? '#7fb3d3' : '#94a3b8',
            fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
          }}>
          {excludeUnder10K ? 'Show all employees' : 'Exclude under $10K (part-time / seasonal)'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} margin={{ top: 8, right: 20, left: 10, bottom: 70 }}>
          <XAxis dataKey="band" tick={<AngledTick />} interval={0}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} height={70} />
          <YAxis tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
            tick={{ fill: '#64748b', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#1e293b' }} tickLine={false} />
          <Tooltip content={<DistTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[3, 3, 0, 0]} onClick={(_, idx) => toggle(idx)}>
            {data.map((d, i) => {
              const isMedian = d.band === medianBand
              const isUnder10K = d.min < 10000
              let fill = '#457B9D'
              if (isUnder10K) fill = '#64748b'
              else if (isMedian) fill = '#2A9D8F'
              else {
                const t = i / (data.length - 1)
                fill = `rgba(69,123,157,${0.5 + 0.5 * (1 - t)})`
              }
              return <Cell key={i} fill={fill}
                opacity={barOpacity(hasSelection, selected, i)}
                style={{ transition: 'opacity 0.2s', cursor: 'pointer' }} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {!excludeUnder10K && !hasSelection && (
        <p style={{ textAlign: 'center', fontSize: 11, color: '#475569', marginTop: 8 }}>
          The "Under $10K" band includes ~159K part-time, seasonal, per-session, and poll workers.
          Toggle above to zoom into the full-time distribution.
        </p>
      )}

      <div style={{
        display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16,
        fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: '#64748b',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#2A9D8F' }} />
          Median band ({medianBand})
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 2, background: '#457B9D' }} />
          Distribution
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stats row
// ---------------------------------------------------------------------------
const OTHER_PAY_URL = 'https://data.cityofnewyork.us/City-Government/Citywide-Payroll-Data-Fiscal-Year-/k397-673e/about_data'

export function PayrollStats({ filtered = false }) {
  const { totalEmployees, totalRegular, totalOvertime, totalOther, totalPayroll } = filtered ? filteredPayrollSummary : payrollSummary
  const otShare = ((totalOvertime / totalPayroll) * 100).toFixed(1)

  const stats = [
    { label: 'Total Payroll', value: fmtFull(totalPayroll), sub: 'FY2025' },
    { label: 'Employees', value: fmtEmployees(totalEmployees), sub: 'on payroll' },
    { label: 'Overtime', value: fmt(totalOvertime), sub: `${otShare}% of total` },
    { label: 'Other Pay', value: fmt(totalOther), sub: 'differentials & lump sums', link: OTHER_PAY_URL },
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: 16, marginBottom: 24,
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: 10,
          padding: '16px 20px', border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: '#64748b', fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#f1f5f9', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.03em' }}>
            {s.value}
          </div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
            {s.link ? (
              <a href={s.link} target="_blank" rel="noopener noreferrer"
                style={{ color: '#7fb3d3', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                {s.sub}
              </a>
            ) : s.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
