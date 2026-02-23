import { useEffect, useRef, useCallback } from 'react'

// Elegant 2D pigeon silhouettes drifting across the viewport
// Lightweight canvas overlay — ~30 pigeons, no Three.js dependency

const PIGEON_COUNT = 28
const FEATHER_COUNT = 12

// Warm, happy palette
const PIGEON_COLORS = [
  'rgba(180, 160, 140, 0.55)',  // warm gray
  'rgba(200, 180, 160, 0.50)',  // light taupe
  'rgba(160, 145, 130, 0.50)',  // soft brown
  'rgba(220, 210, 195, 0.45)',  // cream
  'rgba(170, 155, 145, 0.50)',  // dove
  'rgba(190, 100, 80, 0.35)',   // hint of brand red
]

const FEATHER_COLORS = [
  'rgba(200, 185, 165, 0.3)',
  'rgba(215, 200, 180, 0.25)',
  'rgba(180, 165, 148, 0.25)',
]

function drawPigeon(ctx, x, y, scale, angle, wingPhase, color, facing) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(scale * facing, scale)

  // Body
  ctx.beginPath()
  ctx.ellipse(0, 0, 12, 7, 0, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()

  // Head
  ctx.beginPath()
  ctx.arc(-14, -4, 5.5, 0, Math.PI * 2)
  ctx.fill()

  // Beak
  ctx.beginPath()
  ctx.moveTo(-19, -4)
  ctx.lineTo(-23, -2.5)
  ctx.lineTo(-18, -2)
  ctx.closePath()
  ctx.fillStyle = 'rgba(210, 160, 80, 0.6)'
  ctx.fill()

  // Eye
  ctx.beginPath()
  ctx.arc(-15.5, -5.5, 1.2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(60, 40, 30, 0.7)'
  ctx.fill()

  // Wings — graceful flap
  const wingLift = Math.sin(wingPhase) * 14
  const wingTuck = Math.cos(wingPhase) * 3

  ctx.beginPath()
  ctx.moveTo(-4, -2)
  ctx.quadraticCurveTo(4, -8 + wingLift, 16, -4 + wingTuck)
  ctx.quadraticCurveTo(8, -1, -2, 0)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.globalAlpha = 0.7
  ctx.fill()
  ctx.globalAlpha = 1

  // Tail
  ctx.beginPath()
  ctx.moveTo(10, 0)
  ctx.lineTo(20, -3)
  ctx.lineTo(21, 2)
  ctx.lineTo(18, 5)
  ctx.lineTo(10, 3)
  ctx.closePath()
  ctx.globalAlpha = 0.5
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.restore()
}

function drawFeather(ctx, x, y, rotation, scale, alpha, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha

  ctx.beginPath()
  ctx.moveTo(0, -10)
  ctx.quadraticCurveTo(4, -3, 2, 6)
  ctx.quadraticCurveTo(0, 10, -2, 6)
  ctx.quadraticCurveTo(-4, -3, 0, -10)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  // Feather spine
  ctx.beginPath()
  ctx.moveTo(0, -10)
  ctx.lineTo(0, 8)
  ctx.strokeStyle = color
  ctx.lineWidth = 0.5
  ctx.stroke()

  ctx.globalAlpha = 1
  ctx.restore()
}

export default function PigeonOverlay({ active }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const pigeonsRef = useRef(null)
  const feathersRef = useRef(null)

  const initParticles = useCallback((w, h) => {
    const pigeons = []
    for (let i = 0; i < PIGEON_COUNT; i++) {
      pigeons.push({
        x: Math.random() * (w + 200) - 100,
        y: Math.random() * h,
        scale: 0.6 + Math.random() * 0.7,
        speed: 0.4 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.3,
        wingSpeed: 2.5 + Math.random() * 2,
        wingPhase: Math.random() * Math.PI * 2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.3 + Math.random() * 0.5,
        wobbleAmp: 0.3 + Math.random() * 0.6,
        color: PIGEON_COLORS[Math.floor(Math.random() * PIGEON_COLORS.length)],
        facing: Math.random() > 0.3 ? 1 : -1, // most face right (direction of travel)
        glidePhase: Math.random() * Math.PI * 2,
        glideSpeed: 0.15 + Math.random() * 0.2,
      })
    }
    pigeonsRef.current = pigeons

    const feathers = []
    for (let i = 0; i < FEATHER_COUNT; i++) {
      feathers.push({
        x: Math.random() * w,
        y: Math.random() * h,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        fallSpeed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.4,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1 + Math.random() * 1.5,
        scale: 0.6 + Math.random() * 0.6,
        alpha: 0.15 + Math.random() * 0.2,
        color: FEATHER_COLORS[Math.floor(Math.random() * FEATHER_COLORS.length)],
      })
    }
    feathersRef.current = feathers
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
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (!pigeonsRef.current) initParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0

    const animate = () => {
      time += 0.016 // ~60fps step
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const w = canvas.width
      const h = canvas.height

      // Feathers — gentle falling
      for (const f of feathersRef.current) {
        f.y += f.fallSpeed
        f.x += f.drift + Math.sin(time * f.swaySpeed + f.swayPhase) * 0.5
        f.rotation += f.rotSpeed

        if (f.y > h + 20) {
          f.y = -20
          f.x = Math.random() * w
        }
        if (f.x > w + 20) f.x = -20
        if (f.x < -20) f.x = w + 20

        drawFeather(ctx, f.x, f.y, f.rotation, f.scale, f.alpha, f.color)
      }

      // Pigeons — graceful flight
      for (const p of pigeonsRef.current) {
        // Glide cycle: sometimes flap, sometimes coast
        const glideVal = Math.sin(time * p.glideSpeed + p.glidePhase)
        const isGliding = glideVal > 0.3
        const wingTarget = isGliding ? 0 : time * p.wingSpeed
        p.wingPhase += (wingTarget - p.wingPhase) * 0.1

        const wobble = Math.sin(time * p.wobbleSpeed + p.wobble) * p.wobbleAmp

        p.x += p.speed * p.facing
        p.y += p.drift + Math.sin(time * 0.5 + p.wobble) * 0.2

        // Wrap around screen
        if (p.facing > 0 && p.x > w + 40) {
          p.x = -40
          p.y = Math.random() * h
        } else if (p.facing < 0 && p.x < -40) {
          p.x = w + 40
          p.y = Math.random() * h
        }
        if (p.y > h + 30) p.y = -30
        if (p.y < -30) p.y = h + 30

        drawPigeon(ctx, p.x, p.y, p.scale, wobble * 0.08, p.wingPhase, p.color, p.facing)
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [active, initParticles])

  // Reset particles when toggled off then on
  useEffect(() => {
    if (!active) {
      pigeonsRef.current = null
      feathersRef.current = null
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
