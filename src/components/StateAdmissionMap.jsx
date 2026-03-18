import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { states, categories, eras } from '../data/stateAdmissionData'
import { tilePositions, GRID_COLS, GRID_ROWS } from '../data/tileCartogramPositions'

const TOTAL_STEPS = states.length // 50
const CELL = 52
const GAP = 3
const PAD = 10
const SVG_W = PAD * 2 + GRID_COLS * (CELL + GAP)
const SVG_H = PAD * 2 + GRID_ROWS * (CELL + GAP)

const catColors = {
  original:    { bg: '#ccd5e0', text: '#1e2d4a' },
  territory:   { bg: '#d4e8d0', text: '#2a5a20' },
  partition:   { bg: '#d0dbe8', text: '#1e3a5f' },
  republic:    { bg: '#e8d4d0', text: '#6b2a1e' },
  unorganized: { bg: '#e8e0d0', text: '#5a4a20' },
  compromise:  { bg: '#e0d0e8', text: '#4a205a' },
  wartime:     { bg: '#e8d0d0', text: '#6b1e1e' },
}

// Sort states by admission order
const orderedStates = [...states].sort((a, b) => a.order - b.order)

export default function StateAdmissionMap() {
  const [currentStep, setCurrentStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(400)
  const [tooltip, setTooltip] = useState(null) // { state, x, y }
  const timerRef = useRef(null)
  const svgContainerRef = useRef(null)

  const admittedSet = useMemo(() => {
    const set = new Set()
    for (let i = 0; i < currentStep; i++) set.add(orderedStates[i].abbr)
    return set
  }, [currentStep])

  const lastAdmitted = currentStep > 0 ? orderedStates[currentStep - 1] : null
  const currentEra = lastAdmitted ? eras[lastAdmitted.era] : null

  const stop = useCallback(() => {
    setPlaying(false)
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }, [])

  const play = useCallback(() => {
    if (currentStep >= TOTAL_STEPS) setCurrentStep(0)
    setPlaying(true)
  }, [currentStep])

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= TOTAL_STEPS) { stop(); return TOTAL_STEPS }
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
        <h2 style={{
          color: '#2c1810', fontSize: 22, fontWeight: 600,
          fontFamily: "'Source Serif 4', Georgia, serif", letterSpacing: '-0.02em',
        }}>
          Westward Expansion
        </h2>
        <p style={{ fontSize: 14, color: '#887', marginTop: 6, fontStyle: 'italic' }}>
          Watch the United States grow from 13 colonies to 50 states
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, flexWrap: 'wrap', fontFamily: "'DM Sans', sans-serif",
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
        <label style={{ color: '#665', fontSize: 13, marginLeft: 8 }}>Speed:</label>
        <select
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{
            fontSize: 13, padding: '4px 8px', border: '1px solid #c4b9a8',
            borderRadius: 4, background: '#fff', color: '#1a1a1a',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value={800}>Slow</option>
          <option value={400}>Normal</option>
          <option value={120}>Fast</option>
        </select>
      </div>

      {/* Progress bar */}
      <div style={{
        margin: '0 auto 6px', maxWidth: 600,
        background: 'rgba(0,0,0,0.06)', borderRadius: 4, height: 6, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: '#8b2500',
          borderRadius: 4, transition: speed > 200 ? 'width 0.2s' : 'none',
        }} />
      </div>

      {/* Status line */}
      <div style={{
        textAlign: 'center', marginBottom: 12, fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, color: '#665', minHeight: 52,
      }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: '#2c1810', fontWeight: 600, fontSize: 18 }}>
            {currentStep}
          </span>
          <span style={{ color: '#887' }}> / 50 states admitted</span>
          {currentEra && (
            <span style={{
              marginLeft: 12, fontSize: 12, padding: '2px 8px',
              background: '#ebe5d9', borderRadius: 10, color: '#665',
            }}>
              {currentEra}
            </span>
          )}
        </div>
        {lastAdmitted && (
          <div style={{ fontSize: 13 }}>
            <span style={{
              display: 'inline-block', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.06em', padding: '2px 6px', borderRadius: 3,
              fontWeight: 700, marginRight: 6,
              background: catColors[lastAdmitted.cat].bg,
              color: catColors[lastAdmitted.cat].text,
            }}>
              {categories[lastAdmitted.cat].label}
            </span>
            <strong style={{ color: '#2c1810' }}>{lastAdmitted.name}</strong>
            {' — '}{lastAdmitted.dateDisplay}
            <span style={{ color: '#aaa', marginLeft: 6 }}>#{lastAdmitted.order}</span>
          </div>
        )}
        {!lastAdmitted && currentStep === 0 && (
          <div style={{ fontSize: 13, color: '#aaa' }}>
            Press Play to watch the states join the Union
          </div>
        )}
      </div>

      {/* Scrubber */}
      <div style={{ margin: '0 auto 12px', maxWidth: 600, padding: '0 8px' }}>
        <input
          type="range" min={0} max={TOTAL_STEPS} value={currentStep}
          onChange={e => { stop(); setCurrentStep(Number(e.target.value)) }}
          style={{ width: '100%', accentColor: '#8b2500' }}
        />
      </div>

      {/* SVG Map */}
      <div style={{ overflowX: 'auto', position: 'relative' }} ref={svgContainerRef}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '100%', maxWidth: 720, display: 'block', margin: '0 auto' }}
          onMouseLeave={() => setTooltip(null)}
        >
          {orderedStates.map(s => {
            const pos = tilePositions[s.abbr]
            if (!pos) return null
            const [col, row] = pos
            const x = PAD + col * (CELL + GAP)
            const y = PAD + row * (CELL + GAP)
            const isAdmitted = admittedSet.has(s.abbr)
            const isLatest = lastAdmitted && lastAdmitted.abbr === s.abbr
            const colors = catColors[s.cat]

            return (
              <g key={s.abbr} style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const container = svgContainerRef.current
                  if (!container) return
                  const svg = container.querySelector('svg')
                  const svgRect = svg.getBoundingClientRect()
                  const containerRect = container.getBoundingClientRect()
                  const scaleX = svgRect.width / SVG_W
                  const scaleY = svgRect.height / SVG_H
                  const tileLeft = (x + CELL / 2) * scaleX + (svgRect.left - containerRect.left)
                  const tileTop = y * scaleY + (svgRect.top - containerRect.top)
                  const tileBottom = (y + CELL) * scaleY + (svgRect.top - containerRect.top)
                  const flipBelow = row <= 1
                  setTooltip({ state: s, x: tileLeft, y: flipBelow ? tileBottom : tileTop, flipBelow })
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <rect
                  x={x} y={y} width={CELL} height={CELL} rx={4}
                  fill={isAdmitted ? colors.bg : '#e8e0d8'}
                  stroke={isLatest ? '#8b2500' : isAdmitted ? colors.text + '40' : '#c4b9a8'}
                  strokeWidth={isLatest ? 2.5 : 0.5}
                  opacity={isAdmitted ? 1 : 0.35}
                  style={{ transition: speed > 200 ? 'fill 0.3s, opacity 0.3s, stroke 0.3s' : 'none' }}
                />
                {/* State abbreviation */}
                <text
                  x={x + CELL / 2} y={y + CELL / 2 - 4}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isAdmitted ? 13 : 11}
                  fontWeight={isAdmitted ? 700 : 400}
                  fontFamily="'DM Sans', sans-serif"
                  fill={isAdmitted ? colors.text : '#bbb'}
                  style={{ transition: speed > 200 ? 'fill 0.3s' : 'none', pointerEvents: 'none' }}
                >
                  {s.abbr}
                </text>
                {/* Order number (small, below abbr) */}
                {isAdmitted && (
                  <text
                    x={x + CELL / 2} y={y + CELL / 2 + 12}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={9}
                    fontFamily="'JetBrains Mono', monospace"
                    fill={colors.text}
                    opacity={0.5}
                    style={{ pointerEvents: 'none' }}
                  >
                    #{s.order}
                  </text>
                )}
                {/* Pulse ring for latest */}
                {isLatest && (
                  <rect
                    x={x - 2} y={y - 2} width={CELL + 4} height={CELL + 4} rx={5}
                    fill="none" stroke="#8b2500" strokeWidth={1.5}
                    opacity={0.5}
                    style={{ pointerEvents: 'none' }}
                  >
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.2s" repeatCount="indefinite" />
                  </rect>
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.flipBelow ? tooltip.y + 8 : tooltip.y - 8,
            transform: tooltip.flipBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
            background: '#2c1810',
            color: '#f5f0e8',
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 20,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
              {tooltip.state.name}
            </div>
            <div style={{ color: '#c4b9a8', fontSize: 12 }}>
              #{tooltip.state.order} · {tooltip.state.dateDisplay}
            </div>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '1px 5px', borderRadius: 3, fontWeight: 700,
                background: catColors[tooltip.state.cat].bg,
                color: catColors[tooltip.state.cat].text,
              }}>
                {categories[tooltip.state.cat].label}
              </span>
              <span style={{ fontSize: 11, color: '#a09080' }}>
                {eras[tooltip.state.era]}
              </span>
            </div>
            {admittedSet.has(tooltip.state.abbr) ? (
              <div style={{ marginTop: 4, fontSize: 11, color: '#8b7' }}>
                Admitted
              </div>
            ) : (
              <div style={{ marginTop: 4, fontSize: 11, color: '#a09080', fontStyle: 'italic' }}>
                Not yet admitted at this step
              </div>
            )}
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              ...(tooltip.flipBelow
                ? { top: -6, borderBottom: '6px solid #2c1810' }
                : { bottom: -6, borderTop: '6px solid #2c1810' }
              ),
            }} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
        marginTop: 16, fontFamily: "'DM Sans', sans-serif",
      }}>
        {Object.entries(categories).map(([key, { label }]) => {
          const colors = catColors[key]
          const count = orderedStates.filter(s => s.cat === key && admittedSet.has(s.abbr)).length
          const total = orderedStates.filter(s => s.cat === key).length
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, color: '#665', padding: '3px 8px',
              background: '#f5f0e8', borderRadius: 12, border: '1px solid #e0d8cc',
            }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                background: colors.bg, border: `1px solid ${colors.text}40`,
                flexShrink: 0,
              }} />
              {label}
              <span style={{ fontSize: 10, color: '#aaa' }}>
                {count}/{total}
              </span>
            </div>
          )
        })}
      </div>

      <p style={{
        textAlign: 'center', marginTop: 20,
        fontSize: 12, color: '#887', fontFamily: "'DM Sans', sans-serif",
      }}>
        Source:{' '}
        <a href="https://www.congress.gov/crs-product/R47747" target="_blank" rel="noopener noreferrer"
          style={{ color: '#6b3a2a', textDecoration: 'none', borderBottom: '1px dotted #6b3a2a' }}>
          CRS Report R47747
        </a>{' '}
        · U.S. Statutes at Large
      </p>
    </div>
  )
}

const btnStyle = {
  fontSize: 13, padding: '6px 14px', border: '1px solid #c4b9a8',
  borderRadius: 4, background: '#fff', color: '#2c1810', cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
}
