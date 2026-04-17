import { useEffect, useRef, useCallback } from 'react'

const PIGEON_COUNT = 20
const PIGEON_EMOJI = '🐦'

export default function PigeonOverlay({ active }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const pigeonsRef = useRef(null)
  const fadeRef = useRef(0)
  const lastTimeRef = useRef(null)

  const initPigeons = useCallback((w, h) => {
    const pigeons = []
    for (let i = 0; i < PIGEON_COUNT; i++) {
      const depth = i < 6 ? 0 : i < 14 ? 1 : 2
      const depthSize = [18, 26, 34][depth]
      const depthAlpha = [0.4, 0.6, 0.85][depth]
      const depthSpeed = [0.3, 0.6, 1.0][depth]
      const facing = Math.random() > 0.25 ? 1 : -1

      pigeons.push({
        x: Math.random() * (w + 200) - 100,
        y: 40 + Math.random() * (h - 100),
        size: depthSize + Math.random() * 8,
        alpha: depthAlpha + Math.random() * 0.1,
        speed: (0.5 + Math.random() * 0.7) * depthSpeed,
        facing,
        pathPhase: Math.random() * Math.PI * 2,
        pathFreq: 0.2 + Math.random() * 0.3,
        pathAmp: 8 + Math.random() * 15,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.3 + Math.random() * 0.4,
        wobbleAmp: 0.04 + Math.random() * 0.05,
        depth,
      })
    }
    pigeons.sort((a, b) => a.depth - b.depth)
    pigeonsRef.current = pigeons
  }, [])

  useEffect(() => {
    if (!active) {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!pigeonsRef.current) initPigeons(window.innerWidth, window.innerHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    fadeRef.current = 0
    lastTimeRef.current = null

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = timestamp

      fadeRef.current = Math.min(fadeRef.current + dt / 1.2, 1)
      const globalFade = fadeRef.current

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const w = window.innerWidth
      const h = window.innerHeight

      for (const p of pigeonsRef.current) {
        const pathY = Math.sin(timestamp / 1000 * p.pathFreq + p.pathPhase) * p.pathAmp
        const wobble = Math.sin(timestamp / 1000 * p.wobbleSpeed + p.wobblePhase) * p.wobbleAmp

        p.x += p.speed * p.facing * dt * 60

        if (p.facing > 0 && p.x > w + 50) {
          p.x = -50
          p.pathPhase = Math.random() * Math.PI * 2
          p.y = 40 + Math.random() * (h - 100)
        } else if (p.facing < 0 && p.x < -50) {
          p.x = w + 50
          p.pathPhase = Math.random() * Math.PI * 2
          p.y = 40 + Math.random() * (h - 100)
        }

        const drawY = p.y + pathY

        ctx.save()
        ctx.translate(p.x, drawY)
        ctx.rotate(wobble)
        ctx.scale(p.facing, 1)
        ctx.globalAlpha = p.alpha * globalFade
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(PIGEON_EMOJI, 0, 0)
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      pigeonsRef.current = null
      lastTimeRef.current = null
    }
  }, [active, initPigeons])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
