import { useEffect, useRef, useCallback } from 'react'

// Elegant 2D pigeon silhouettes in flight across the viewport
// Lightweight canvas overlay — no dependencies

const PIGEON_COUNT = 20
const FEATHER_COUNT = 8

// Depth layers: far pigeons are smaller/dimmer, close ones are larger/more vivid
function makeColor(base, alpha) {
  return `rgba(${base.join(',')},${alpha})`
}

// Pigeon body palettes — inspired by real NYC rock doves
const PALETTES = [
  { body: [140, 145, 160], wing: [120, 125, 142], neck: [130, 100, 150] },  // blue-gray + purple neck
  { body: [155, 150, 140], wing: [135, 130, 120], neck: [140, 115, 155] },  // warm gray + violet neck
  { body: [170, 165, 155], wing: [148, 142, 132], neck: [145, 120, 160] },  // light dove
  { body: [195, 190, 180], wing: [170, 165, 155], neck: [160, 130, 170] },  // pale cream dove
  { body: [130, 128, 120], wing: [110, 108, 100], neck: [125, 95, 140] },   // dark pigeon
  { body: [160, 140, 130], wing: [140, 118, 108], neck: [150, 110, 145] },  // russet pigeon
]

const FEATHER_BASES = [
  [170, 165, 155],
  [155, 150, 140],
  [185, 178, 168],
]

function drawPigeonInFlight(ctx, x, y, scale, tilt, wingAngle, palette, alpha, facing) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(facing, 1)
  ctx.rotate(tilt)
  ctx.scale(scale, scale)

  const bodyAlpha = alpha
  const wingAlpha = alpha * 0.85

  // Soft shadow beneath
  ctx.save()
  ctx.translate(2, 3)
  ctx.globalAlpha = alpha * 0.12
  ctx.beginPath()
  ctx.ellipse(0, 2, 14, 5, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,1)'
  ctx.fill()
  ctx.restore()

  // --- Wings (behind body) ---
  const wingSpread = Math.sin(wingAngle)
  const wingUp = wingSpread * 18
  const wingMid = wingSpread * 8

  // Left/top wing
  ctx.beginPath()
  ctx.moveTo(-3, 0)
  ctx.bezierCurveTo(-8, -4 - wingUp, -18, -6 - wingUp, -22, -2 - wingMid)
  ctx.bezierCurveTo(-20, 0 - wingMid * 0.3, -12, 2, -3, 1)
  ctx.closePath()
  ctx.fillStyle = makeColor(palette.wing, wingAlpha)
  ctx.fill()

  // Wing feather tips
  ctx.beginPath()
  ctx.moveTo(-18, -5 - wingUp)
  ctx.bezierCurveTo(-22, -7 - wingUp, -26, -4 - wingMid, -24, -1 - wingMid * 0.5)
  ctx.bezierCurveTo(-22, -2 - wingMid * 0.3, -20, -3 - wingUp * 0.5, -18, -5 - wingUp)
  ctx.closePath()
  ctx.fillStyle = makeColor(palette.wing, wingAlpha * 0.7)
  ctx.fill()

  // Right/bottom wing (mirror, less pronounced)
  ctx.beginPath()
  ctx.moveTo(-3, 1)
  ctx.bezierCurveTo(-8, 5 + wingUp * 0.6, -16, 7 + wingUp * 0.6, -20, 4 + wingMid * 0.4)
  ctx.bezierCurveTo(-18, 3 + wingMid * 0.2, -10, 2, -3, 1)
  ctx.closePath()
  ctx.fillStyle = makeColor(palette.wing, wingAlpha * 0.65)
  ctx.fill()

  // --- Body ---
  ctx.beginPath()
  ctx.moveTo(10, 0)
  ctx.bezierCurveTo(8, -4, 2, -6, -4, -5)
  ctx.bezierCurveTo(-8, -4, -10, -2, -10, 0)
  ctx.bezierCurveTo(-10, 2, -8, 4, -4, 5)
  ctx.bezierCurveTo(0, 6, 6, 4, 10, 1)
  ctx.closePath()
  ctx.fillStyle = makeColor(palette.body, bodyAlpha)
  ctx.fill()

  // --- Tail ---
  ctx.beginPath()
  ctx.moveTo(-8, 0)
  ctx.bezierCurveTo(-12, -1, -17, -2, -19, -1)
  ctx.bezierCurveTo(-17, 0, -17, 2, -19, 3)
  ctx.bezierCurveTo(-16, 3, -12, 2, -8, 1)
  ctx.closePath()
  ctx.fillStyle = makeColor(palette.wing, bodyAlpha * 0.7)
  ctx.fill()

  // --- Head ---
  ctx.beginPath()
  ctx.arc(11, -2, 4, 0, Math.PI * 2)
  ctx.fillStyle = makeColor(palette.body, bodyAlpha)
  ctx.fill()

  // Neck iridescence
  ctx.beginPath()
  ctx.arc(10, 0, 3.2, 0, Math.PI * 2)
  ctx.fillStyle = makeColor(palette.neck, bodyAlpha * 0.5)
  ctx.fill()

  // Eye
  ctx.beginPath()
  ctx.arc(12.5, -3, 1, 0, Math.PI * 2)
  ctx.fillStyle = makeColor([40, 30, 20], bodyAlpha)
  ctx.fill()
  // Eye ring (orange, like real pigeons)
  ctx.beginPath()
  ctx.arc(12.5, -3, 1.6, 0, Math.PI * 2)
  ctx.strokeStyle = makeColor([210, 140, 50], bodyAlpha * 0.6)
  ctx.lineWidth = 0.5
  ctx.stroke()

  // Beak
  ctx.beginPath()
  ctx.moveTo(15, -2)
  ctx.lineTo(18, -1)
  ctx.lineTo(15, 0)
  ctx.closePath()
  ctx.fillStyle = makeColor([180, 150, 100], bodyAlpha * 0.8)
  ctx.fill()

  ctx.restore()
}

function drawFeather(ctx, x, y, rotation, scale, alpha, colorBase) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)
  ctx.globalAlpha = alpha

  // Asymmetric feather shape
  ctx.beginPath()
  ctx.moveTo(0, -12)
  ctx.bezierCurveTo(3, -6, 4, 0, 2, 8)
  ctx.bezierCurveTo(1, 11, 0, 12, -0.5, 11)
  ctx.bezierCurveTo(-2, 8, -3, 0, -2, -6)
  ctx.bezierCurveTo(-1, -9, 0, -12, 0, -12)
  ctx.closePath()
  ctx.fillStyle = makeColor(colorBase, 0.9)
  ctx.fill()

  // Shaft
  ctx.beginPath()
  ctx.moveTo(0, -11)
  ctx.quadraticCurveTo(0.5, 0, 0, 10)
  ctx.strokeStyle = makeColor(colorBase, 0.5)
  ctx.lineWidth = 0.4
  ctx.stroke()

  // Barb lines
  ctx.strokeStyle = makeColor(colorBase, 0.25)
  ctx.lineWidth = 0.3
  for (let i = -8; i < 8; i += 3) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(i > 0 ? 2.5 : 3, i + 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(i > 0 ? -2 : -2.5, i + 2)
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  ctx.restore()
}

export default function PigeonOverlay({ active }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const pigeonsRef = useRef(null)
  const feathersRef = useRef(null)
  const fadeRef = useRef(0)
  const lastTimeRef = useRef(null)

  const initParticles = useCallback((w, h) => {
    const pigeons = []
    for (let i = 0; i < PIGEON_COUNT; i++) {
      // Depth layer: 0 = far, 1 = mid, 2 = close
      const depth = i < 6 ? 0 : i < 14 ? 1 : 2
      const depthScale = [0.45, 0.7, 1.0][depth]
      const depthAlpha = [0.35, 0.55, 0.75][depth]
      const depthSpeed = [0.3, 0.6, 1.0][depth]

      const facing = Math.random() > 0.25 ? 1 : -1
      pigeons.push({
        x: Math.random() * (w + 300) - 150,
        y: 40 + Math.random() * (h - 100),
        scale: (0.8 + Math.random() * 0.5) * depthScale,
        baseAlpha: depthAlpha + Math.random() * 0.1,
        speed: (0.5 + Math.random() * 0.7) * depthSpeed,
        facing,
        palette: PALETTES[Math.floor(Math.random() * PALETTES.length)],
        // Wing animation
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 3.5 + Math.random() * 2,
        // Flap/glide cycle
        glideTimer: Math.random() * 8,
        glideDuration: 1.5 + Math.random() * 2,   // seconds of gliding
        flapDuration: 1.0 + Math.random() * 1.5,   // seconds of flapping
        isGliding: Math.random() > 0.5,
        // Flight path undulation
        pathPhase: Math.random() * Math.PI * 2,
        pathFreq: 0.2 + Math.random() * 0.3,
        pathAmp: 8 + Math.random() * 15,
        // Body tilt
        tiltPhase: Math.random() * Math.PI * 2,
        tiltSpeed: 0.3 + Math.random() * 0.4,
        tiltAmp: 0.04 + Math.random() * 0.06,
        depth,
      })
    }
    // Sort by depth so far pigeons render first (behind)
    pigeons.sort((a, b) => a.depth - b.depth)
    pigeonsRef.current = pigeons

    const feathers = []
    for (let i = 0; i < FEATHER_COUNT; i++) {
      feathers.push({
        x: Math.random() * w,
        y: -20 - Math.random() * h, // start above viewport, stagger entry
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        fallSpeed: 0.25 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.2,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.8 + Math.random() * 1.2,
        swaySpeed: 0.8 + Math.random() * 1.0,
        tumblePhase: Math.random() * Math.PI * 2,
        tumbleSpeed: 0.4 + Math.random() * 0.6,
        scale: 0.7 + Math.random() * 0.5,
        alpha: 0.18 + Math.random() * 0.14,
        colorBase: FEATHER_BASES[Math.floor(Math.random() * FEATHER_BASES.length)],
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!pigeonsRef.current) initParticles(window.innerWidth, window.innerHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    fadeRef.current = 0
    lastTimeRef.current = null

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) // cap at 50ms
      lastTimeRef.current = timestamp

      // Fade in over 1.5 seconds
      fadeRef.current = Math.min(fadeRef.current + dt / 1.5, 1)
      const globalFade = fadeRef.current

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const w = window.innerWidth
      const h = window.innerHeight

      // Feathers
      for (const f of feathersRef.current) {
        f.y += f.fallSpeed * dt * 60
        const sway = Math.sin(timestamp / 1000 * f.swaySpeed + f.swayPhase) * f.swayAmp
        f.x += (f.drift + sway * 0.02) * dt * 60
        f.rotation += f.rotSpeed * dt * 60
        // Tumble — slight scale oscillation for 3D feel
        const tumble = 0.7 + Math.sin(timestamp / 1000 * f.tumbleSpeed + f.tumblePhase) * 0.3

        if (f.y > h + 30) {
          f.y = -30
          f.x = Math.random() * w
        }
        if (f.x > w + 30) f.x = -30
        if (f.x < -30) f.x = w + 30

        drawFeather(ctx, f.x, f.y, f.rotation, f.scale * tumble, f.alpha * globalFade, f.colorBase)
      }

      // Pigeons
      for (const p of pigeonsRef.current) {
        // Flap/glide state machine
        p.glideTimer += dt
        if (p.isGliding && p.glideTimer > p.glideDuration) {
          p.isGliding = false
          p.glideTimer = 0
          p.flapDuration = 1.0 + Math.random() * 1.5
        } else if (!p.isGliding && p.glideTimer > p.flapDuration) {
          p.isGliding = true
          p.glideTimer = 0
          p.glideDuration = 1.5 + Math.random() * 2
        }

        // Wing animation — smooth transitions
        if (p.isGliding) {
          // Glide: wings held slightly up, gentle drift
          const glideTarget = 0.3
          p.wingPhase += (glideTarget - p.wingPhase) * 2 * dt
        } else {
          // Flap: sinusoidal wing beat
          p.wingPhase += p.wingSpeed * dt
        }

        // Flight path — gentle sine wave
        const pathY = Math.sin(timestamp / 1000 * p.pathFreq + p.pathPhase) * p.pathAmp
        const tilt = Math.sin(timestamp / 1000 * p.tiltSpeed + p.tiltPhase) * p.tiltAmp

        // Move
        p.x += p.speed * p.facing * dt * 60

        // Wrap
        if (p.facing > 0 && p.x > w + 60) {
          p.x = -60
          p.pathPhase = Math.random() * Math.PI * 2
          p.y = 40 + Math.random() * (h - 100)
        } else if (p.facing < 0 && p.x < -60) {
          p.x = w + 60
          p.pathPhase = Math.random() * Math.PI * 2
          p.y = 40 + Math.random() * (h - 100)
        }

        const drawY = p.y + pathY

        drawPigeonInFlight(
          ctx, p.x, drawY, p.scale,
          tilt, p.wingPhase,
          p.palette, p.baseAlpha * globalFade,
          p.facing
        )
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [active, initParticles])

  // Reset particles when toggled off
  useEffect(() => {
    if (!active) {
      pigeonsRef.current = null
      feathersRef.current = null
      lastTimeRef.current = null
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
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
