import { useRef, useEffect, useCallback, useState } from 'react'
import { years, fedRate, nyRate } from '../data/nycTaxRateData'

const N = years.length // 60
const NAVY = '#14237e'
const CSS_H = 320
const ML = 50, MR = 54, MT = 16, MB = 42
const LOOP = 7200, BAR_DUR = 600, BAR_STAGGER = 360, LINE_START = 820, LINE_DUR = 3000

function ease3(t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3) }

export default function TaxRateChart() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const tipRef = useRef(null)
  const stateRef = useRef({ cssW: 0, startTime: null, rafId: null, hoverIdx: -1, pausedAt: null, scrubT: null })
  const pausedRef = useRef(false)
  const [tooltip, setTooltip] = useState(null)
  const [paused, setPaused] = useState(false)
  const [scrubValue, setScrubValue] = useState(0) // 0-100, for display

  // Keep ref in sync with state
  useEffect(() => { pausedRef.current = paused }, [paused])

  const W = useCallback(() => stateRef.current.cssW - ML - MR, [])
  const H = useCallback(() => CSS_H - MT - MB, [])
  const xOf = useCallback((i) => ML + (i / (N - 1)) * W(), [W])
  const yFed = useCallback((v) => MT + H() - (v / 90) * H(), [H])
  const yNY = useCallback((v) => MT + H() - (v / 16) * H(), [H])

  const resize = useCallback(() => {
    const el = containerRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return
    const dpr = window.devicePixelRatio || 1
    const cssW = el.offsetWidth
    stateRef.current.cssW = cssW
    canvas.width = cssW * dpr
    canvas.height = CSS_H * dpr
    canvas.style.height = CSS_H + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    stateRef.current.startTime = null
  }, [])

  const draw = useCallback((t) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { cssW, hoverIdx } = stateRef.current
    const cW = W(), cH = H()

    ctx.clearRect(0, 0, cssW, CSS_H)

    // Grid lines
    ;[0, 20, 40, 60, 80].forEach(v => {
      const y = yFed(v)
      ctx.strokeStyle = v === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.05)'
      ctx.lineWidth = v === 0 ? 1 : 0.8
      ctx.setLineDash(v === 0 ? [] : [3, 4])
      ctx.beginPath(); ctx.moveTo(ML, y); ctx.lineTo(ML + cW, y); ctx.stroke()
    })
    ctx.setLineDash([])

    // Left axis
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(ML, MT); ctx.lineTo(ML, MT + cH); ctx.stroke()

    // Hover crosshair
    if (hoverIdx >= 0) {
      ctx.strokeStyle = 'rgba(20,35,126,0.12)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4])
      ctx.beginPath(); ctx.moveTo(xOf(hoverIdx), MT); ctx.lineTo(xOf(hoverIdx), MT + cH); ctx.stroke()
      ctx.setLineDash([])
    }

    // Federal rate bars
    const bSpan = cW / N
    const bW = bSpan * 0.78
    for (let i = 0; i < N; i++) {
      const p = ease3((t - (i / N) * BAR_STAGGER) / BAR_DUR)
      if (p <= 0) continue
      const fullH = (fedRate[i] / 90) * cH
      const bH = fullH * p
      const x = ML + i * bSpan + (bSpan - bW) / 2
      const y = MT + cH - bH
      const isHov = hoverIdx === i
      const g = ctx.createLinearGradient(0, y, 0, MT + cH)
      g.addColorStop(0, isHov ? 'rgba(120,145,218,0.85)' : 'rgba(140,165,228,0.68)')
      g.addColorStop(0.5, isHov ? 'rgba(155,175,235,0.45)' : 'rgba(165,185,235,0.32)')
      g.addColorStop(1, 'rgba(195,215,248,0.04)')
      ctx.fillStyle = g; ctx.fillRect(x, y, bW, bH)
      ctx.strokeStyle = isHov ? 'rgba(80,110,200,0.9)' : 'rgba(120,148,218,0.8)'
      ctx.lineWidth = isHov ? 1.2 : 0.75
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + bW, y); ctx.stroke()
    }

    // NY+City line
    const rev = Math.max(0, (t - LINE_START) / LINE_DUR)
    if (rev > 0) {
      const cnt = rev * (N - 1)
      const full = Math.floor(cnt)
      const frac = cnt - full
      const fi = Math.min(full, N - 1)
      const ni = Math.min(full + 1, N - 1)
      const lx = frac > 0 && full < N - 1 ? xOf(full) + (xOf(ni) - xOf(full)) * frac : xOf(fi)
      const ly = frac > 0 && full < N - 1 ? yNY(nyRate[full]) + (yNY(nyRate[ni]) - yNY(nyRate[full])) * frac : yNY(nyRate[fi])

      // Area fill
      ctx.beginPath()
      ctx.moveTo(xOf(0), yNY(nyRate[0]))
      for (let i = 1; i <= fi; i++) ctx.lineTo(xOf(i), yNY(nyRate[i]))
      if (frac > 0 && full < N - 1) ctx.lineTo(lx, ly)
      ctx.lineTo(lx, MT + cH); ctx.lineTo(xOf(0), MT + cH); ctx.closePath()
      const ag = ctx.createLinearGradient(0, MT, 0, MT + cH)
      ag.addColorStop(0, 'rgba(20,35,126,0.11)')
      ag.addColorStop(0.7, 'rgba(20,35,126,0.03)')
      ag.addColorStop(1, 'rgba(20,35,126,0)')
      ctx.fillStyle = ag; ctx.fill()

      // Line with glow
      ctx.save()
      ctx.shadowColor = 'rgba(20,35,126,0.3)'; ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.moveTo(xOf(0), yNY(nyRate[0]))
      for (let i = 1; i <= fi; i++) ctx.lineTo(xOf(i), yNY(nyRate[i]))
      if (frac > 0 && full < N - 1) ctx.lineTo(lx, ly)
      ctx.strokeStyle = NAVY; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.stroke()
      ctx.restore()

      // Line solid
      ctx.beginPath()
      ctx.moveTo(xOf(0), yNY(nyRate[0]))
      for (let i = 1; i <= fi; i++) ctx.lineTo(xOf(i), yNY(nyRate[i]))
      if (frac > 0 && full < N - 1) ctx.lineTo(lx, ly)
      ctx.strokeStyle = NAVY; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke()

      // Dots
      for (let i = 0; i <= fi; i++) {
        const isHov = hoverIdx === i
        ctx.beginPath(); ctx.arc(xOf(i), yNY(nyRate[i]), isHov ? 4.5 : 2.4, 0, Math.PI * 2)
        ctx.fillStyle = NAVY; ctx.fill()
        ctx.beginPath(); ctx.arc(xOf(i), yNY(nyRate[i]), isHov ? 2.2 : 1.1, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'; ctx.fill()
      }

      // Leading pulse
      if (rev < 1) {
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 170)
        const r = 10 + pulse * 3
        const gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, r)
        gr.addColorStop(0, 'rgba(20,35,126,0.35)')
        gr.addColorStop(0.4, 'rgba(20,35,126,0.12)')
        gr.addColorStop(1, 'rgba(20,35,126,0)')
        ctx.beginPath(); ctx.arc(lx, ly, r, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill()
        ctx.beginPath(); ctx.arc(lx, ly, 4.5, 0, Math.PI * 2); ctx.fillStyle = NAVY; ctx.fill()
        ctx.beginPath(); ctx.arc(lx, ly, 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
      }

      // Hover ring
      if (hoverIdx >= 0 && hoverIdx <= fi) {
        ctx.beginPath(); ctx.arc(xOf(hoverIdx), yNY(nyRate[hoverIdx]), 7, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(20,35,126,0.3)'; ctx.lineWidth = 1.5; ctx.stroke()
      }
    }

    // Axis labels
    ctx.font = "10px -apple-system,'Helvetica Neue',Arial,sans-serif"
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'right'; ctx.fillStyle = 'rgba(110,122,158,0.85)'
    ;[20, 40, 60, 80].forEach(v => ctx.fillText(v + '%', ML - 7, yFed(v)))
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(20,35,126,0.65)'
    ;[4, 8, 12, 16].forEach(v => ctx.fillText(v + '%', ML + cW + 8, yNY(v)))
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(110,122,158,0.8)'
    ctx.textBaseline = 'top'
    years.forEach((y, i) => { if (i % 8 === 0) ctx.fillText(y, xOf(i), MT + cH + 10) })

    // Rotated axis titles
    ctx.save(); ctx.translate(12, MT + cH / 2); ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = "9px -apple-system,'Helvetica Neue',Arial,sans-serif"
    ctx.fillStyle = 'rgba(130,140,168,0.7)'; ctx.fillText('Top federal rate', 0, 0); ctx.restore()
    ctx.save(); ctx.translate(cssW - 12, MT + cH / 2); ctx.rotate(Math.PI / 2)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = "9px -apple-system,'Helvetica Neue',Arial,sans-serif"
    ctx.fillStyle = 'rgba(20,35,126,0.5)'; ctx.fillText('Effective NY+NYC rate', 0, 0); ctx.restore()
  }, [W, H, xOf, yFed, yNY])

  // Animation loop
  useEffect(() => {
    resize()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const animate = (ts) => {
      const s = stateRef.current
      if (!s.startTime) s.startTime = ts

      // If scrubbing, use the scrub time
      if (s.scrubT != null) {
        draw(s.scrubT)
        setScrubValue(Math.round((s.scrubT / LOOP) * 100))
        s.rafId = requestAnimationFrame(animate)
        return
      }

      if (pausedRef.current) {
        if (s.pausedAt == null) s.pausedAt = ts
        const t = (s.pausedAt - s.startTime) % LOOP
        draw(t)
        setScrubValue(Math.round((t / LOOP) * 100))
        s.rafId = requestAnimationFrame(animate)
        return
      }
      if (s.pausedAt != null) {
        s.startTime += ts - s.pausedAt
        s.pausedAt = null
      }
      const t = (ts - s.startTime) % LOOP
      draw(t)
      setScrubValue(Math.round((t / LOOP) * 100))
      s.rafId = requestAnimationFrame(animate)
    }
    stateRef.current.rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', onResize)
      if (stateRef.current.rafId) cancelAnimationFrame(stateRef.current.rafId)
    }
  }, [resize, draw])

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const cW = W(), cH = H()
    if (mx < ML || mx > ML + cW || my < MT || my > MT + cH) {
      stateRef.current.hoverIdx = -1
      setTooltip(null)
      return
    }
    const idx = Math.max(0, Math.min(N - 1, Math.round((mx - ML) / cW * (N - 1))))
    stateRef.current.hoverIdx = idx
    setTooltip({ idx, x: mx, y: my })
  }, [W, H])

  const handleMouseLeave = useCallback(() => {
    stateRef.current.hoverIdx = -1
    setTooltip(null)
  }, [])

  return (
    <div style={{ overflow: 'hidden', maxWidth: '100%' }}>
      <div style={{ marginBottom: 12 }}>
        <p style={{
          fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 18,
          color: '#0b1240', letterSpacing: '-0.5px', margin: '0 0 4px', fontWeight: 'normal',
        }}>
          Combined NYS–NYC Marginal Income Tax Rate
        </p>
        <p style={{
          fontSize: 11, color: '#9aa2be', margin: '0 0 14px',
          letterSpacing: '0.03em', textTransform: 'uppercase',
        }}>
          Net of federal deductibility · 1966–2025
        </p>
        <div style={{
          display: 'flex', gap: 12, marginBottom: 12,
          fontSize: 11, color: '#9aa2be', alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 13, height: 10, background: 'rgba(155,175,230,0.6)',
              borderRadius: 2, display: 'inline-block', flexShrink: 0,
            }} />
            Top federal rate (left axis)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 20, height: 2.5, background: NAVY,
              display: 'inline-block', flexShrink: 0,
            }} />
            Effective NY+City rate (right)
          </span>
          <button
            onClick={() => setPaused(p => !p)}
            style={{
              marginLeft: 'auto', fontSize: 11, padding: '3px 10px',
              border: '1px solid rgba(20,35,126,0.2)', borderRadius: 4,
              background: paused ? 'rgba(20,35,126,0.06)' : '#fff',
              color: NAVY, cursor: 'pointer',
              fontFamily: "-apple-system,'Helvetica Neue',Arial,sans-serif",
            }}
          >
            {paused ? '▶ Play' : '⏸ Pause'}
          </button>
        </div>
      </div>

      <div ref={containerRef} style={{ width: '100%', maxWidth: '100%', position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute',
            display: 'block',
            pointerEvents: 'none',
            background: '#fff',
            border: '0.5px solid rgba(20,35,126,0.18)',
            borderRadius: 8,
            padding: '10px 13px',
            boxShadow: '0 4px 18px rgba(20,35,126,0.12)',
            minWidth: 150,
            zIndex: 10,
            left: tooltip.x + 14 + 170 > stateRef.current.cssW - 8
              ? tooltip.x - 170 - 14
              : tooltip.x + 14,
            top: Math.max(0, tooltip.y - 30),
          }}>
            <p style={{
              fontSize: 12, fontWeight: 600, color: '#0b1240',
              margin: '0 0 7px', letterSpacing: '0.02em',
              borderBottom: '0.5px solid rgba(20,35,126,0.1)', paddingBottom: 6,
            }}>
              {years[tooltip.idx]}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <span style={{
                width: 10, height: 10, background: 'rgba(140,165,228,0.7)',
                borderRadius: 2, flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, color: '#7a82a8' }}>Federal rate</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#0b1240', marginLeft: 'auto' }}>
                {fedRate[tooltip.idx]}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                width: 10, height: 2.5, background: NAVY, flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, color: '#7a82a8' }}>NY+City rate</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: NAVY, marginLeft: 'auto' }}>
                {nyRate[tooltip.idx]}%
              </span>
            </div>
            <p style={{
              fontSize: 9.5, color: '#b8bdd4', margin: '7px 0 0',
              borderTop: '0.5px solid rgba(20,35,126,0.1)', paddingTop: 6,
              fontStyle: 'italic', lineHeight: 1.4,
            }}>
              Estimated from original static graphic, to be confirmed
            </p>
          </div>
        )}
      </div>

      {/* Scrubber */}
      <div style={{ margin: '10px auto 0', maxWidth: '100%', padding: '0 4px' }}>
        <input
          type="range" min={0} max={100} value={scrubValue}
          onChange={e => {
            const val = Number(e.target.value)
            const t = (val / 100) * LOOP
            stateRef.current.scrubT = t
            setScrubValue(val)
          }}
          onMouseUp={() => {
            // Commit scrub position as paused state
            const s = stateRef.current
            if (s.scrubT != null) {
              s.pausedAt = performance.now()
              s.startTime = s.pausedAt - s.scrubT
              s.scrubT = null
            }
            setPaused(true)
          }}
          onTouchEnd={() => {
            const s = stateRef.current
            if (s.scrubT != null) {
              s.pausedAt = performance.now()
              s.startTime = s.pausedAt - s.scrubT
              s.scrubT = null
            }
            setPaused(true)
          }}
          style={{ width: '100%', accentColor: NAVY }}
        />
      </div>

      <div style={{
        marginTop: 10, paddingTop: 12,
        borderTop: '0.5px solid rgba(20,35,126,0.08)',
      }}>
        <p style={{ fontSize: 10, color: '#9aa2be', margin: '0 0 4px', lineHeight: 1.5 }}>
          Animated from a graphic in E.J. McMahon's issue brief{' '}
          <a href="https://manhattan.institute/article/the-limits-of-new-yorks-tax-the-rich-policy"
            target="_blank" rel="noopener noreferrer"
            style={{ color: NAVY, textDecoration: 'none', borderBottom: '0.5px solid rgba(20,35,126,0.3)' }}>
            "The Limits of New York's 'Tax the Rich' Policy"
          </a>{' '}
          from the Manhattan Institute.
        </p>
      </div>
    </div>
  )
}
