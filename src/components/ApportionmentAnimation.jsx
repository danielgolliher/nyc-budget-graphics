import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { populations, allRows, finalSeats } from '../data/apportionmentData'

// Only the apportioned steps (seats 51–435)
const steps = allRows.filter(r => !r.isFirst)

// All state abbreviations sorted by final seat count (desc), then alphabetically
const sortedStates = populations
  .map(([name, abbr]) => ({ name, abbr }))
  .sort((a, b) => finalSeats[b.abbr] - finalSeats[a.abbr] || a.abbr.localeCompare(b.abbr))

const TOTAL_STEPS = steps.length // 385
const MAX_SEATS = finalSeats['CA'] // 52

// Color palette — assign a hue to each state for visual distinction
const stateColors = {}
sortedStates.forEach((s, i) => {
  const hue = (i * 137.5) % 360 // golden angle for good spread
  stateColors[s.abbr] = `hsl(${hue}, 55%, 55%)`
})

function getSeatsAtStep(stepIndex) {
  // stepIndex: 0 = all states at 1 seat, 1 = first apportioned seat, etc.
  const seats = {}
  populations.forEach(([, abbr]) => { seats[abbr] = 1 })
  for (let i = 0; i < stepIndex && i < steps.length; i++) {
    seats[steps[i].abbr]++
  }
  return seats
}

export default function ApportionmentAnimation() {
  const [currentStep, setCurrentStep] = useState(0) // 0 = initial (all 1), up to 385
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(50) // ms per step
  const timerRef = useRef(null)
  const barAreaRef = useRef(null)

  const seats = useMemo(() => getSeatsAtStep(currentStep), [currentStep])
  const seatNumber = currentStep + 50 // seat 50 = all guaranteed, seat 51 = first step
  const lastAssigned = currentStep > 0 ? steps[currentStep - 1] : null

  // Sort states by current seat count (desc), then by final (desc), then alpha
  const displayOrder = useMemo(() => {
    return [...sortedStates].sort((a, b) => {
      const diff = seats[b.abbr] - seats[a.abbr]
      if (diff !== 0) return diff
      return finalSeats[b.abbr] - finalSeats[a.abbr] || a.abbr.localeCompare(b.abbr)
    })
  }, [seats])

  const stop = useCallback(() => {
    setPlaying(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (currentStep >= TOTAL_STEPS) setCurrentStep(0)
    setPlaying(true)
  }, [currentStep])

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= TOTAL_STEPS) {
          stop()
          return TOTAL_STEPS
        }
        return prev + 1
      })
    }, speed)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, speed, stop])

  const reset = () => { stop(); setCurrentStep(0) }
  const skipToEnd = () => { stop(); setCurrentStep(TOTAL_STEPS) }

  const pct = (currentStep / TOTAL_STEPS) * 100

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }}>
          Apportionment Animation
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>
          Watch 435 House seats get assigned one by one
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, flexWrap: 'wrap', fontFamily: "'DM Sans', sans-serif",
      }}>
        <button onClick={playing ? stop : play} style={btnStyle}>
          {playing ? '⏸ Pause' : currentStep >= TOTAL_STEPS ? '↺ Replay' : '▶ Play'}
        </button>
        <button onClick={reset} style={btnStyle} disabled={currentStep === 0 && !playing}>
          ↺ Reset
        </button>
        <button onClick={skipToEnd} style={btnStyle} disabled={currentStep === TOTAL_STEPS}>
          ⏭ End
        </button>
        <label style={{ color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>Speed:</label>
        <select
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{
            fontSize: 13, padding: '4px 8px', border: '1px solid #334155',
            borderRadius: 6, background: '#1e293b', color: '#e2e8f0',
          }}
        >
          <option value={200}>Slow</option>
          <option value={50}>Normal</option>
          <option value={10}>Fast</option>
        </select>
      </div>

      {/* Progress bar */}
      <div style={{
        margin: '0 auto 8px', maxWidth: 600,
        background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 6, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: '#60a5fa',
          borderRadius: 4, transition: speed > 30 ? 'width 0.15s' : 'none',
        }} />
      </div>

      {/* Status line */}
      <div style={{
        textAlign: 'center', marginBottom: 16, fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, color: '#94a3b8', minHeight: 44,
      }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: 18 }}>
            {seatNumber}
          </span>
          <span style={{ color: '#64748b' }}> / 435 seats assigned</span>
        </div>
        {lastAssigned && (
          <div style={{ fontSize: 13 }}>
            Seat #{lastAssigned.step} →{' '}
            <span style={{ color: stateColors[lastAssigned.abbr], fontWeight: 600 }}>
              {lastAssigned.name}
            </span>
            {' '}(seat {lastAssigned.seatNum}, priority {lastAssigned.priority.toLocaleString(undefined, { maximumFractionDigits: 0 })})
          </div>
        )}
        {!lastAssigned && currentStep === 0 && (
          <div style={{ fontSize: 13 }}>
            Each state begins with 1 guaranteed seat
          </div>
        )}
      </div>

      {/* Scrubber */}
      <div style={{ margin: '0 auto 20px', maxWidth: 600, padding: '0 8px' }}>
        <input
          type="range"
          min={0}
          max={TOTAL_STEPS}
          value={currentStep}
          onChange={e => { stop(); setCurrentStep(Number(e.target.value)) }}
          style={{ width: '100%', accentColor: '#60a5fa' }}
        />
      </div>

      {/* Bar chart */}
      <div ref={barAreaRef} style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 500 }}>
          {displayOrder.map(({ abbr, name }) => {
            const count = seats[abbr]
            const widthPct = (count / MAX_SEATS) * 100
            const isLast = lastAssigned && lastAssigned.abbr === abbr
            return (
              <div key={abbr} style={{
                display: 'flex', alignItems: 'center', marginBottom: 2,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                <div style={{
                  width: 32, textAlign: 'right', fontSize: 11, color: '#94a3b8',
                  fontFamily: "'JetBrains Mono', monospace", marginRight: 8, flexShrink: 0,
                }}>
                  {abbr}
                </div>
                <div style={{ flex: 1, position: 'relative', height: 16 }}>
                  <div style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    background: isLast
                      ? stateColors[abbr]
                      : stateColors[abbr] + '88',
                    borderRadius: 3,
                    transition: speed > 30 ? 'width 0.15s' : 'none',
                    boxShadow: isLast ? `0 0 8px ${stateColors[abbr]}` : 'none',
                    minWidth: count > 0 ? 4 : 0,
                  }} />
                </div>
                <div style={{
                  width: 28, textAlign: 'right', fontSize: 11, color: '#cbd5e1',
                  fontFamily: "'JetBrains Mono', monospace", marginLeft: 6, flexShrink: 0,
                }}>
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p style={{
        textAlign: 'center', marginTop: 24,
        fontSize: 12, color: '#64748b', fontFamily: "'DM Sans', sans-serif",
      }}>
        Source: 2020 U.S. Census · Huntington-Hill method (2 U.S.C. § 2a)
      </p>
    </div>
  )
}

const btnStyle = {
  fontSize: 13, padding: '6px 14px', border: '1px solid #334155',
  borderRadius: 6, background: '#1e293b', color: '#e2e8f0', cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}
