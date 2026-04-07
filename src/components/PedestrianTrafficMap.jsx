import { useRef, useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const FI = { wdAM: 4, wdMD: 5, wdPM: 6, weAM: 7, weMD: 8, wePM: 9 }

function valColor(v) {
  if (v < 50)   return 'rgba(20,40,80,0.3)'
  if (v < 100)  return 'rgba(25,70,130,0.5)'
  if (v < 200)  return 'rgba(30,110,190,0.65)'
  if (v < 400)  return 'rgba(33,150,243,0.8)'
  if (v < 700)  return 'rgba(100,180,60,0.85)'
  if (v < 1200) return 'rgba(249,168,37,0.9)'
  if (v < 2000) return 'rgba(255,111,0,0.92)'
  return 'rgba(229,57,53,0.95)'
}

function valWidth(v, zoom) {
  let base
  if (v < 50) base = 0.3
  else if (v < 200) base = 0.8
  else if (v < 500) base = 1.5
  else if (v < 1000) base = 2.5
  else base = 4
  if (zoom >= 15) return base * 3
  if (zoom >= 14) return base * 2
  if (zoom >= 13) return base * 1.5
  return base
}

function ptSegDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - x1, py - y1)
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq))
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

function row(label, val, highlight) {
  return `<div style="display:flex;justify-content:space-between;gap:16px;margin:3px 0">
    <span style="color:${highlight ? '#60a5fa' : '#999'}">${label}</span>
    <span style="color:#fff;font-weight:600;font-variant-numeric:tabular-nums">${val.toLocaleString()}</span>
  </div>`
}

export default function PedestrianTrafficMap() {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const segmentsRef = useRef(null)
  const canvasLayerRef = useRef(null)
  const dayRef = useRef('wd')
  const timeRef = useRef('MD')
  const [currentDay, setCurrentDay] = useState('wd')
  const [currentTime, setCurrentTime] = useState('MD')
  const [loading, setLoading] = useState(true)
  const [loadMsg, setLoadMsg] = useState('Downloading data...')
  const [segCount, setSegCount] = useState(0)
  const [fullScreen, setFullScreen] = useState(false)
  const containerRef = useRef(null)

  // Keep refs in sync with state
  useEffect(() => { dayRef.current = currentDay }, [currentDay])
  useEffect(() => { timeRef.current = currentTime }, [currentTime])

  useEffect(() => {
    if (mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [40.71, -73.95],
      zoom: 12,
      zoomControl: false,
    })
    mapInstance.current = map

    L.control.zoom({ position: 'topright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Canvas overlay layer
    const CanvasLayer = L.Layer.extend({
      onAdd(m) {
        this._map = m
        const pane = m.getPane('overlayPane')
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer', pane)
        this._canvas.style.position = 'absolute'
        this._canvas.style.pointerEvents = 'none'
        this._ctx = this._canvas.getContext('2d')
        m.on('moveend zoomend resize', this._redraw, this)
        this._redraw()
      },
      onRemove(m) {
        L.DomUtil.remove(this._canvas)
        m.off('moveend zoomend resize', this._redraw, this)
      },
      _redraw() {
        const segments = segmentsRef.current
        if (!segments) return
        const m = this._map
        const size = m.getSize()
        const dpr = window.devicePixelRatio || 1
        this._canvas.width = size.x * dpr
        this._canvas.height = size.y * dpr
        this._canvas.style.width = size.x + 'px'
        this._canvas.style.height = size.y + 'px'
        const topLeft = m.containerPointToLayerPoint([0, 0])
        L.DomUtil.setPosition(this._canvas, topLeft)
        const ctx = this._ctx
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, size.x, size.y)

        const bounds = m.getBounds()
        const minLng = bounds.getWest(), maxLng = bounds.getEast()
        const minLat = bounds.getSouth(), maxLat = bounds.getNorth()
        const zoom = m.getZoom()
        const fi = FI[dayRef.current + timeRef.current]
        const buckets = {}

        for (let i = 0; i < segments.length; i++) {
          const s = segments[i]
          if (s[0] < minLng && s[2] < minLng) continue
          if (s[0] > maxLng && s[2] > maxLng) continue
          if (s[1] < minLat && s[3] < minLat) continue
          if (s[1] > maxLat && s[3] > maxLat) continue

          const val = s[fi]
          const color = valColor(val)
          const width = valWidth(val, zoom)
          const key = color + '|' + width
          if (!buckets[key]) buckets[key] = { c: color, w: width, pts: [] }
          const p0 = m.latLngToContainerPoint([s[1], s[0]])
          const p1 = m.latLngToContainerPoint([s[3], s[2]])
          buckets[key].pts.push(p0.x, p0.y, p1.x, p1.y)
        }

        for (const key of Object.keys(buckets)) {
          const b = buckets[key]
          ctx.strokeStyle = b.c
          ctx.lineWidth = b.w
          ctx.lineCap = 'round'
          ctx.beginPath()
          const pts = b.pts
          for (let j = 0; j < pts.length; j += 4) {
            ctx.moveTo(pts[j], pts[j + 1])
            ctx.lineTo(pts[j + 2], pts[j + 3])
          }
          ctx.stroke()
        }
      },
      redraw() { this._redraw() },
    })

    const canvasLayer = new CanvasLayer()
    canvasLayerRef.current = canvasLayer

    // Tooltip on hover
    const tooltip = L.DomUtil.create('div')
    tooltip.style.cssText = 'position:absolute;z-index:1500;display:none;background:rgba(10,10,15,0.95);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:12px 14px;font-size:12px;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,0.5);min-width:180px;color:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif'
    mapRef.current.parentElement.appendChild(tooltip)

    map.getContainer().addEventListener('mousemove', (e) => {
      const segments = segmentsRef.current
      if (!segments) return
      const rect = map.getContainer().getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const fi = FI[dayRef.current + timeRef.current]
      let best = null, bestDist = 6

      const bounds = map.getBounds()
      const minLng = bounds.getWest(), maxLng = bounds.getEast()
      const minLat = bounds.getSouth(), maxLat = bounds.getNorth()

      for (let i = 0; i < segments.length; i++) {
        const s = segments[i]
        if (s[0] < minLng && s[2] < minLng) continue
        if (s[0] > maxLng && s[2] > maxLng) continue
        if (s[1] < minLat && s[3] < minLat) continue
        if (s[1] > maxLat && s[3] > maxLat) continue
        const p0 = map.latLngToContainerPoint([s[1], s[0]])
        const p1 = map.latLngToContainerPoint([s[3], s[2]])
        const d = ptSegDist(mx, my, p0.x, p0.y, p1.x, p1.y)
        if (d < bestDist) { bestDist = d; best = s }
      }

      if (best) {
        const dayLabel = dayRef.current === 'wd' ? 'Weekday' : 'Weekend'
        const tl = { AM: 'AM Peak', MD: 'Midday', PM: 'PM Peak' }
        tooltip.innerHTML =
          `<div style="font-weight:700;color:#60a5fa;margin-bottom:6px;font-size:14px">${best[fi].toLocaleString()} peds/hr</div>` +
          row(dayLabel + ' ' + tl[timeRef.current], best[fi], true) +
          '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:6px 0">' +
          row('Wkday AM', best[4]) + row('Wkday Midday', best[5]) + row('Wkday PM', best[6]) +
          row('Wkend AM', best[7]) + row('Wkend Midday', best[8]) + row('Wkend PM', best[9])
        tooltip.style.display = 'block'
        tooltip.style.left = (mx + 14) + 'px'
        tooltip.style.top = (my + 14) + 'px'
      } else {
        tooltip.style.display = 'none'
      }
    })

    // Fetch data
    const xhr = new XMLHttpRequest()
    xhr.open('GET', import.meta.env.BASE_URL + 'data/nyc_ped_compact.json', true)
    xhr.onprogress = (e) => {
      if (e.lengthComputable) setLoadMsg('Downloading... ' + Math.round(e.loaded / e.total * 100) + '%')
      else setLoadMsg('Downloading... ' + (e.loaded / 1048576).toFixed(0) + ' MB')
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        setLoadMsg('Parsing data...')
        setTimeout(() => {
          try {
            segmentsRef.current = JSON.parse(xhr.responseText)
            setSegCount(segmentsRef.current.length)
            setLoading(false)
            canvasLayer.addTo(map)
          } catch (err) {
            setLoadMsg('Parse error: ' + err.message)
          }
        }, 30)
      } else {
        setLoadMsg('Error: HTTP ' + xhr.status)
      }
    }
    xhr.onerror = () => setLoadMsg('Network error')
    xhr.send()

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [])

  // Redraw on toggle change
  useEffect(() => {
    if (canvasLayerRef.current && segmentsRef.current) {
      canvasLayerRef.current.redraw()
    }
  }, [currentDay, currentTime])

  // Invalidate map size when fullscreen toggles
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => {
        mapInstance.current.invalidateSize()
        if (canvasLayerRef.current && segmentsRef.current) {
          canvasLayerRef.current.redraw()
        }
      }, 50)
    }
  }, [fullScreen])

  // Escape key exits fullscreen
  useEffect(() => {
    if (!fullScreen) return
    const handler = (e) => { if (e.key === 'Escape') setFullScreen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullScreen])

  const days = [
    { value: 'wd', label: 'Weekday' },
    { value: 'we', label: 'Weekend' },
  ]
  const times = [
    { value: 'AM', label: 'AM Peak' },
    { value: 'MD', label: 'Midday' },
    { value: 'PM', label: 'PM Peak' },
  ]

  return (
    <div ref={containerRef} style={{
      position: fullScreen ? 'fixed' : 'relative',
      top: fullScreen ? 0 : undefined,
      left: fullScreen ? 0 : undefined,
      width: fullScreen ? '100vw' : '100%',
      height: fullScreen ? '100vh' : undefined,
      zIndex: fullScreen ? 9999 : undefined,
      borderRadius: fullScreen ? 0 : 8,
      overflow: 'hidden',
    }}>
      <div ref={mapRef} style={{ width: '100%', height: fullScreen ? '100vh' : 600, background: '#0a0a0a' }} />

      {/* Controls overlay */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000,
        background: 'rgba(15,15,20,0.92)', backdropFilter: 'blur(12px)',
        borderRadius: 10, padding: 16, width: 240,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>Day Type</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {days.map(d => (
            <button key={d.value} onClick={() => setCurrentDay(d.value)} style={{
              flex: 1, padding: '6px 4px', border: `1px solid ${currentDay === d.value ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.12)'}`,
              background: currentDay === d.value ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.04)',
              color: currentDay === d.value ? '#60a5fa' : '#999', borderRadius: 6, cursor: 'pointer',
              fontSize: 12, fontWeight: currentDay === d.value ? 600 : 500,
            }}>{d.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>Time Period</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {times.map(t => (
            <button key={t.value} onClick={() => setCurrentTime(t.value)} style={{
              flex: 1, padding: '6px 4px', border: `1px solid ${currentTime === t.value ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.12)'}`,
              background: currentTime === t.value ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.04)',
              color: currentTime === t.value ? '#60a5fa' : '#999', borderRadius: 6, cursor: 'pointer',
              fontSize: 12, fontWeight: currentTime === t.value ? 600 : 500,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
          <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>Pedestrians / Block / Hour</div>
          <div style={{
            height: 10, borderRadius: 5, marginBottom: 4,
            background: 'linear-gradient(to right, #1a1a2e, #1e3a5f, #1e6091, #2196f3, #66bb6a, #f9a825, #ff6f00, #e53935)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#888' }}>
            <span>0</span><span>200</span><span>500</span><span>1,000</span><span>2,000+</span>
          </div>
        </div>
      </div>

      {/* Full Screen toggle */}
      <button onClick={() => setFullScreen(f => !f)} style={{
        position: 'absolute', bottom: 16, right: 16, zIndex: 1000,
        background: 'rgba(15,15,20,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
        padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        color: '#ccc', fontSize: 12, fontWeight: 500,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {fullScreen ? (
            <>
              <polyline points="5,1 1,1 1,5" /><polyline points="9,13 13,13 13,9" />
              <polyline points="13,5 13,1 9,1" /><polyline points="1,9 1,13 5,13" />
            </>
          ) : (
            <>
              <polyline points="1,5 1,1 5,1" /><polyline points="13,9 13,13 9,13" />
              <polyline points="9,1 13,1 13,5" /><polyline points="5,13 1,13 1,9" />
            </>
          )}
        </svg>
        {fullScreen ? 'Exit Full Screen' : 'Full Screen'}
      </button>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 2000, textAlign: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            width: 36, height: 36, border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#60a5fa', borderRadius: '50%',
            animation: 'ped-spin 1s linear infinite', margin: '0 auto 10px',
          }} />
          <div style={{ fontSize: 13, color: '#ccc' }}>{loadMsg}</div>
          <style>{`@keyframes ped-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Segment count */}
      {!loading && (
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
          background: 'rgba(15,15,20,0.92)', backdropFilter: 'blur(12px)',
          borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#888',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ color: '#60a5fa', fontWeight: 600 }}>{segCount.toLocaleString()}</span> street segments
        </div>
      )}
    </div>
  )
}
