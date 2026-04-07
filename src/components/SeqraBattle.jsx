import { useRef, useState, useEffect, useCallback } from 'react'

const W = 800, H = 640, PX = 6
const BATTLE_BOTTOM = 440
const TB = { x: 20, y: 455, w: 760, h: 165 }
const H_BASE = { x: 70, y: 220 }
const S_BASE = { x: 490, y: 50 }
const HP_ENEMY  = { x: 30,  y: 30,  w: 280, h: 58 }
const HP_PLAYER = { x: 430, y: 310, w: 320, h: 58 }
const TXT_SPD = 30

function hpColor(r) { return r > 0.5 ? '#4CAF50' : r > 0.2 ? '#FFC107' : '#F44336' }

function fillRR(ctx, x, y, w, h, r) {
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r)
  else ctx.rect(x, y, w, h)
  ctx.fill()
}
function strokeRR(ctx, x, y, w, h, r) {
  ctx.beginPath()
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r)
  else ctx.rect(x, y, w, h)
  ctx.stroke()
}

// ── PARTICLE SPAWNERS ──
function spawnPaper(particles, sx, sy, tx, ty, delay) {
  const a = Math.atan2(ty - sy, tx - sx), spd = 420
  particles.push({ type: 'paper', x: sx, y: sy, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd,
    sz: 10+Math.random()*8, life: 700, ml: 700, delay, rot: Math.random()*6.28, rs: (Math.random()-0.5)*10 })
}
function spawnPermit(particles, sx, sy, tx, ty) {
  const a = Math.atan2(ty - sy, tx - sx), spd = 380
  particles.push({ type: 'permit', x: sx, y: sy, vx: Math.cos(a)*spd, vy: Math.sin(a)*spd,
    sz: 22, life: 700, ml: 700, delay: 0, bounced: false, bt: 320 })
}
function spawnGavel(particles, tx, ty) {
  particles.push({ type: 'gavel', x: tx+40, y: ty-220, ty: ty+20, sz: 28, life: 900, ml: 900, delay: 0, phase: 'fall' })
}
function spawnSparkle(particles, x, y, col) {
  particles.push({ type: 'sparkle', x, y, vx: (Math.random()-0.5)*120, vy: -60-Math.random()*100,
    color: col, sz: 3+Math.random()*5, life: 400+Math.random()*300, ml: 400+Math.random()*300, delay: 0 })
}
function spawnBeam(particles, sx, sy, tx, ty, delay) {
  const a = Math.atan2(ty - sy, tx - sx)
  const sp = (Math.random()-0.5)*0.35, spd = 280+Math.random()*180
  particles.push({ type: 'beam', x: sx, y: sy, vx: Math.cos(a+sp)*spd, vy: Math.sin(a+sp)*spd,
    color: Math.random()>0.4?'#FFD700':'#FFF8DC', sz: 4+Math.random()*7, life: 650, ml: 650, delay })
}

function updateParticles(particles, dt, houseRef) {
  for (let i = particles.length-1; i >= 0; i--) {
    const p = particles[i]
    if (p.delay > 0) { p.delay -= dt; continue }
    p.life -= dt
    if (p.life <= 0) { particles.splice(i, 1); continue }
    const s = dt / 1000
    if (p.type==='paper'||p.type==='beam'||p.type==='sparkle') {
      p.x += p.vx*s; p.y += p.vy*s
      if (p.rot !== undefined) p.rot += (p.rs||0)*s
    } else if (p.type==='permit') {
      if (!p.bounced && p.life < p.ml - p.bt) { p.bounced = true; p.vx *= -0.5; p.vy = -220 }
      p.x += p.vx*s; p.y += p.vy*s
      if (p.bounced) p.vy += 350*s
    } else if (p.type==='gavel') {
      if (p.phase==='fall') { p.y += 650*s; if (p.y >= p.ty) { p.y = p.ty; p.phase = 'hit'; if (houseRef) houseRef.shake = 25 } }
    }
  }
}

// ── DRAWING FUNCTIONS ──
function drawBG(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, BATTLE_BOTTOM)
  g.addColorStop(0, '#87CEEB'); g.addColorStop(0.55, '#B0E0E6'); g.addColorStop(1, '#7CB342')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, BATTLE_BOTTOM)
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i%2 ? '#5D8A2F' : '#6B9B37'; ctx.fillRect(0, 270+i*17, W, 17)
  }
  ctx.fillStyle = '#5D8A2F'; ctx.beginPath(); ctx.ellipse(S_BASE.x+55, S_BASE.y+115, 95, 22, 0, 0, 6.29); ctx.fill()
  ctx.fillStyle = '#6B9B37'; ctx.beginPath(); ctx.ellipse(S_BASE.x+55, S_BASE.y+111, 95, 22, 0, 0, 6.29); ctx.fill()
  ctx.fillStyle = '#5D8A2F'; ctx.beginPath(); ctx.ellipse(H_BASE.x+55, H_BASE.y+115, 105, 28, 0, 0, 6.29); ctx.fill()
  ctx.fillStyle = '#6B9B37'; ctx.beginPath(); ctx.ellipse(H_BASE.x+55, H_BASE.y+111, 105, 28, 0, 0, 6.29); ctx.fill()
}

function drawHouse(ctx, bx, by, shk, fl, glow) {
  const ox = shk>0.3?(Math.random()-0.5)*shk*2:0, oy = shk>0.3?(Math.random()-0.5)*shk:0
  const x = bx+ox, y = by+oy, p = PX
  if (glow > 0) { ctx.fillStyle = `rgba(255,215,0,${glow*0.35})`; ctx.beginPath(); ctx.ellipse(x+8*p,y+8*p,11*p,11*p,0,0,6.29); ctx.fill() }
  ctx.fillStyle = '#777'; ctx.fillRect(x+11*p,y-p,2*p,4*p); ctx.fillStyle = '#999'; ctx.fillRect(x+11*p,y-p,2*p,p)
  ctx.fillStyle = '#C41E3A'
  for (let i = 0; i < 6; i++) ctx.fillRect(x+(7-i)*p, y+(2+i)*p, (2+i*2)*p, p)
  ctx.fillStyle = '#E83050'
  for (let i = 0; i < 3; i++) ctx.fillRect(x+(7-i)*p, y+(2+i)*p, (2+i*2)*p, 2)
  ctx.fillStyle = '#FFF5D4'; ctx.fillRect(x+2*p,y+8*p,12*p,7*p)
  ctx.strokeStyle = '#C4A35A'; ctx.lineWidth = 2; ctx.strokeRect(x+2*p,y+8*p,12*p,7*p)
  ;[[3,9],[11,9]].forEach(([wx,wy]) => {
    ctx.fillStyle = '#87CEEB'; ctx.fillRect(x+wx*p,y+wy*p,2*p,2*p)
    ctx.strokeStyle = '#8B7355'; ctx.lineWidth = 1; ctx.strokeRect(x+wx*p,y+wy*p,2*p,2*p)
    ctx.beginPath(); ctx.moveTo(x+(wx+1)*p,y+wy*p); ctx.lineTo(x+(wx+1)*p,y+(wy+2)*p)
    ctx.moveTo(x+wx*p,y+(wy+1)*p); ctx.lineTo(x+(wx+2)*p,y+(wy+1)*p); ctx.stroke()
  })
  ctx.fillStyle = '#8B4513'; ctx.fillRect(x+7*p,y+11*p,2*p,4*p)
  ctx.strokeStyle = '#6B3410'; ctx.lineWidth = 1; ctx.strokeRect(x+7*p,y+11*p,2*p,4*p)
  ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(x+8.6*p,y+13*p,3,0,6.29); ctx.fill()
  if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl*0.75})`; ctx.fillRect(x+p,y-p,14*p,16*p) }
}

function drawSeqra(ctx, bx, by, shk, fl) {
  const ox = shk>0.3?(Math.random()-0.5)*shk*2:0, oy = shk>0.3?(Math.random()-0.5)*shk:0
  const x = bx+ox, y = by+oy, p = PX
  ctx.fillStyle = '#CCCCC8'; ctx.fillRect(x+2*p,y+2*p,12*p,11*p)
  ctx.fillStyle = '#E0E0DC'; ctx.fillRect(x+p,y+p,12*p,11*p)
  ctx.fillStyle = '#F5F5F0'; ctx.fillRect(x+p,y,12*p,11*p)
  ctx.strokeStyle = '#AAA'; ctx.lineWidth = 2; ctx.strokeRect(x+p,y,12*p,11*p)
  ctx.fillStyle = '#BBB'
  for (let i = 0; i < 3; i++) ctx.fillRect(x+3*p,y+(6.5+i*1.2)*p,8*p,2)
  ctx.fillStyle = '#CC0000'; ctx.fillRect(x-p,y+2.5*p,16*p,p); ctx.fillRect(x-p,y+7.5*p,16*p,p)
  ctx.save(); ctx.translate(x+7*p,y+5*p); ctx.rotate(-0.3)
  ctx.fillStyle = 'rgba(200,0,0,0.6)'; ctx.fillRect(-8*p,-p*0.4,16*p,p*0.8); ctx.restore()
  ctx.fillStyle = '#FF0000'; ctx.fillRect(x+3*p,y+3.5*p,2*p,2*p); ctx.fillRect(x+9*p,y+3.5*p,2*p,2*p)
  ctx.fillStyle = '#800000'; ctx.fillRect(x+3.5*p,y+4*p,p,p); ctx.fillRect(x+9.5*p,y+4*p,p,p)
  ctx.fillStyle = '#FF8888'; ctx.fillRect(x+3*p,y+3.5*p,p*0.5,p*0.5); ctx.fillRect(x+9*p,y+3.5*p,p*0.5,p*0.5)
  ctx.strokeStyle = '#990000'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(x+2*p,y+2.5*p); ctx.lineTo(x+5*p,y+3.5*p); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x+9*p,y+3.5*p); ctx.lineTo(x+12*p,y+2.5*p); ctx.stroke()
  ctx.save(); ctx.translate(x+7*p,y+9.5*p); ctx.rotate(-0.15)
  ctx.fillStyle = 'rgba(200,0,0,0.55)'; ctx.fillRect(-3.5*p,-p,7*p,2*p)
  ctx.strokeStyle = 'rgba(180,0,0,0.8)'; ctx.lineWidth = 2; ctx.strokeRect(-3.5*p,-p,7*p,2*p)
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 12px "Courier New",monospace'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('DENIED',0,0); ctx.restore()
  ctx.fillStyle = '#CC0000'
  ctx.fillRect(x-2*p,y+4.5*p,3*p,p); ctx.fillRect(x-3*p,y+5.5*p,2*p,p)
  ctx.fillRect(x+13*p,y+4.5*p,3*p,p); ctx.fillRect(x+14*p,y+5.5*p,2*p,p)
  if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl*0.75})`; ctx.fillRect(x-p,y-p,16*p,14*p) }
}

function drawHPBar(ctx, cfg, name, lv, dHP, maxHP) {
  const { x, y, w, h } = cfg
  ctx.fillStyle = '#2D3436'; fillRR(ctx, x, y, w, h, 8)
  ctx.strokeStyle = '#636E72'; ctx.lineWidth = 2; strokeRR(ctx, x, y, w, h, 8)
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 18px "Courier New",monospace'
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(name, x+14, y+18)
  ctx.textAlign = 'right'; ctx.fillText('Lv'+lv, x+w-14, y+18)
  ctx.fillStyle = '#FFC107'; ctx.font = 'bold 12px "Courier New",monospace'
  ctx.textAlign = 'left'; ctx.fillText('HP', x+14, y+42)
  const bx = x+42, by = y+35, bw = w-58, bh = 14
  ctx.fillStyle = '#1A1A2E'; fillRR(ctx, bx, by, bw, bh, 4)
  const ratio = Math.max(0, dHP/maxHP), fw = Math.max(0, (bw-4)*ratio)
  if (fw > 0) { ctx.fillStyle = hpColor(ratio); fillRR(ctx, bx+2, by+2, fw, bh-4, 3) }
}

function drawTextBox(ctx, boxText, boxShown) {
  ctx.fillStyle = '#F8F8F0'; ctx.fillRect(TB.x, TB.y, TB.w, TB.h)
  ctx.strokeStyle = '#333'; ctx.lineWidth = 4; ctx.strokeRect(TB.x, TB.y, TB.w, TB.h)
  ctx.strokeStyle = '#777'; ctx.lineWidth = 2; ctx.strokeRect(TB.x+7, TB.y+7, TB.w-14, TB.h-14)
  if (boxText) {
    const shown = boxText.substring(0, Math.floor(boxShown))
    ctx.fillStyle = '#222'; ctx.font = 'bold 26px "Courier New",monospace'
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'
    shown.split('\n').forEach((line, i) => ctx.fillText(line, TB.x+28, TB.y+30+i*38))
  }
}

function drawBigText(ctx, txt, alpha, color, scale) {
  if (!txt || alpha <= 0) return
  ctx.save(); ctx.globalAlpha = alpha
  ctx.font = 'bold 52px "Courier New",monospace'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.translate(W/2, 220); ctx.scale(scale, scale)
  ctx.strokeStyle = '#000'; ctx.lineWidth = 7; ctx.strokeText(txt, 0, 0)
  ctx.fillStyle = color; ctx.fillText(txt, 0, 0)
  ctx.restore()
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    if (p.delay > 0) continue
    ctx.globalAlpha = Math.max(0, p.life/p.ml)
    if (p.type==='paper') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot||0)
      ctx.fillStyle = '#F5F5F0'; ctx.fillRect(-p.sz/2,-p.sz*0.35,p.sz,p.sz*0.7)
      ctx.fillStyle = '#CC0000'; ctx.fillRect(-p.sz/2,0,p.sz,2); ctx.restore()
    } else if (p.type==='permit') {
      ctx.fillStyle = '#FFF'; ctx.fillRect(p.x-11,p.y-15,22,30)
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1; ctx.strokeRect(p.x-11,p.y-15,22,30)
      ctx.fillStyle = '#4CAF50'; ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('\u2713', p.x, p.y)
    } else if (p.type==='gavel') {
      ctx.fillStyle = '#8B4513'; ctx.fillRect(p.x-3,p.y-12,6,28)
      ctx.fillStyle = '#5C2D06'; ctx.fillRect(p.x-14,p.y-18,28,10)
    } else if (p.type==='sparkle') {
      ctx.fillStyle = p.color; ctx.fillRect(p.x,p.y,p.sz,p.sz)
    } else if (p.type==='beam') {
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,6.29); ctx.fill()
    }
    ctx.globalAlpha = 1
  }
}

function drawVictory(ctx, t) {
  const spots = [
    { x: 320, y: 160, s: 0.75 }, { x: 520, y: 140, s: 0.65 },
    { x: 180, y: 170, s: 0.7 }, { x: 620, y: 180, s: 0.55 }, { x: 400, y: 130, s: 0.6 },
  ]
  spots.forEach((sp, i) => {
    const age = t - i * 500
    if (age < 0) return
    ctx.globalAlpha = Math.min(1, age/350)
    ctx.save(); ctx.translate(sp.x, sp.y); ctx.scale(Math.min(1,age/200)*sp.s, Math.min(1,age/200)*sp.s)
    drawHouse(ctx, 0, 0, 0, 0, 0); ctx.restore()
    ctx.globalAlpha = 1
  })
}

// ── BATTLE STEPS ──
function makeSteps(state) {
  return [
    // 0 — slide in
    { dur: 1400, update(t) {
      state.slideH = -350 * Math.max(0, 1 - t/1200)
      state.slideS = 400 * Math.max(0, 1 - t/1200)
    }},
    // 1 — FIGHT!
    { dur: 1100, enter() {
      state.bigTxt = 'FIGHT!'; state.bigColor = '#FF6600'; state.bigAlpha = 1; state.bigScale = 1.5
    }, update(t) {
      state.bigScale = 1 + Math.sin(t/80)*0.06
      if (t > 550) state.bigAlpha = Math.max(0, 1 - (t-550)/400)
    }, exit() { state.bigTxt = ''; state.bigAlpha = 0 }},
    // 2 — SEQRA USED ENVIRONMENTAL REVIEW!
    { dur: 3000, enter() { state.boxText = 'SEQRA USED\nENVIRONMENTAL REVIEW!'; state.boxShown = 0 },
      update(t) {
        if (t > 1400 && !state.flags.a) { state.flags.a = 1
          const sx = S_BASE.x+state.slideS+30, sy = S_BASE.y+60, tx = H_BASE.x+state.slideH+50, ty = H_BASE.y+50
          for (let i = 0; i < 8; i++) spawnPaper(state.particles, sx, sy, tx, ty, i*70)
        }
        if (t > 2200 && !state.flags.d) { state.flags.d = 1
          state.house.hp = 50; state.house.shake = 22; state.house.flash = 1; state.screenFlash = 0.6
        }
      }},
    // 3 — IT'S SUPER EFFECTIVE!
    { dur: 1300, enter() { state.boxText = "IT'S SUPER EFFECTIVE!"; state.boxShown = 0 }},
    // 4 — HOUSE USED BUILDING PERMIT!
    { dur: 2500, enter() { state.boxText = 'HOUSE USED\nBUILDING PERMIT!'; state.boxShown = 0 },
      update(t) {
        if (t > 1200 && !state.flags.a) { state.flags.a = 1
          spawnPermit(state.particles, H_BASE.x+state.slideH+70, H_BASE.y+40, S_BASE.x+state.slideS+50, S_BASE.y+50)
        }
      }},
    // 5 — NO EFFECT!
    { dur: 1400, enter() {
      state.boxText = 'NO EFFECT!'; state.boxShown = 0
      state.bigTxt = 'NO EFFECT!'; state.bigColor = '#888'; state.bigAlpha = 1; state.bigScale = 1
    }, update(t) { if (t > 700) state.bigAlpha = Math.max(0, 1-(t-700)/500) },
      exit() { state.bigTxt = '' }},
    // 6 — SEQRA USED FRIVOLOUS LAWSUIT!
    { dur: 3000, enter() { state.boxText = 'SEQRA USED\nFRIVOLOUS LAWSUIT!'; state.boxShown = 0 },
      update(t) {
        if (t > 1400 && !state.flags.a) { state.flags.a = 1; spawnGavel(state.particles, H_BASE.x+state.slideH, H_BASE.y) }
        if (t > 2200 && !state.flags.d) { state.flags.d = 1
          state.house.hp = 12; state.house.shake = 28; state.house.flash = 1; state.screenFlash = 0.7
        }
      }},
    // 7 — A CRITICAL HIT!
    { dur: 1200, enter() { state.boxText = 'A CRITICAL HIT!'; state.boxShown = 0 }},
    // 8 — HOUSE LEARNED STATE PREEMPTION!
    { dur: 2500, enter() { state.boxText = 'HOUSE LEARNED\nSTATE PREEMPTION!'; state.boxShown = 0 },
      update(t) {
        state.house.glow = 0.4 + Math.sin(t/120)*0.4
        if (Math.floor(t/60)%2===0) spawnSparkle(state.particles, H_BASE.x+state.slideH+Math.random()*100, H_BASE.y+Math.random()*100, '#FFD700')
      }, exit() { state.house.glow = 0 }},
    // 9 — HOUSE USED STATE PREEMPTION!
    { dur: 3600, enter() { state.boxText = 'HOUSE USED\nSTATE PREEMPTION!'; state.boxShown = 0 },
      update(t) {
        state.house.glow = 0.2 + Math.sin(t/80)*0.2
        if (t > 1200 && !state.flags.a) { state.flags.a = 1
          const sx = H_BASE.x+state.slideH+70, sy = H_BASE.y+40, tx = S_BASE.x+state.slideS+50, ty = S_BASE.y+50
          for (let i = 0; i < 35; i++) spawnBeam(state.particles, sx, sy, tx, ty, i*25)
        }
        if (t > 2000 && !state.flags.h) { state.flags.h = 1; state.seqra.shake = 30; state.seqra.flash = 1; state.screenFlash = 1 }
        if (t > 2000 && t < 3300) state.seqra.hp = Math.max(0, 100*(1-(t-2000)/1300))
      }, exit() { state.house.glow = 0; state.seqra.hp = 0 }},
    // 10 — POWERFUL EFFECT!
    { dur: 1300, enter() {
      state.boxText = 'POWERFUL EFFECT!'; state.boxShown = 0
      state.bigTxt = 'POWERFUL EFFECT!'; state.bigColor = '#FFD700'; state.bigAlpha = 1; state.bigScale = 1
    }, update(t) {
      state.bigScale = 1 + Math.sin(t/70)*0.08
      if (t > 700) state.bigAlpha = Math.max(0, 1-(t-700)/450)
    }, exit() { state.bigTxt = '' }},
    // 11 — SEQRA WAS DEFEATED!
    { dur: 2500, enter() { state.boxText = 'SEQRA WAS DEFEATED!'; state.boxShown = 0; state.seqra.fallV = 0 },
      update(t) {
        state.seqra.fallV += 0.35; state.seqra.fallY += state.seqra.fallV
        if (state.seqra.fallY > 500) state.seqra.vis = false
        if (t < 800 && Math.floor(t/40)%2===0) {
          spawnSparkle(state.particles, S_BASE.x+Math.random()*100, S_BASE.y+state.seqra.fallY+Math.random()*70,
            ['#F5F5F0','#CC0000','#DDD'][Math.floor(Math.random()*3)])
        }
      }},
    // 12 — VICTORY
    { dur: 4000, enter() { state.boxText = 'NEW HOMES APPEARED!'; state.boxShown = 0; state.seqra.vis = false }},
  ]
}

export default function SeqraBattle() {
  const canvasRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const stateRef = useRef(null)
  const rafRef = useRef(null)

  const initState = useCallback(() => ({
    slideH: -350, slideS: 400,
    house: { hp: 100, dHP: 100, shake: 0, flash: 0, glow: 0 },
    seqra: { hp: 100, dHP: 100, shake: 0, flash: 0, fallY: 0, fallV: 0, vis: true },
    boxText: '', boxShown: 0,
    bigTxt: '', bigAlpha: 0, bigColor: '#FF6600', bigScale: 1,
    screenFlash: 0, particles: [], step: 0, stepTime: 0, flags: {},
  }), [])

  const start = useCallback(() => {
    const s = initState()
    stateRef.current = s
    const steps = makeSteps(s)
    if (steps[0].enter) steps[0].enter()
    setStarted(true)
    setDone(false)

    let lastTs = performance.now()
    const loop = (ts) => {
      const dt = Math.min(50, ts - lastTs)
      lastTs = ts
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      // update
      s.stepTime += dt
      const cur = steps[s.step]
      if (cur) {
        if (cur.update) cur.update(s.stepTime, dt)
        if (s.stepTime >= cur.dur) {
          if (cur.exit) cur.exit()
          s.step++; s.stepTime = 0; s.flags = {}
          if (s.step < steps.length && steps[s.step].enter) steps[s.step].enter()
        }
      }
      s.house.dHP += (s.house.hp - s.house.dHP) * 0.07
      s.seqra.dHP += (s.seqra.hp - s.seqra.dHP) * 0.07
      if (Math.abs(s.house.dHP - s.house.hp) < 0.3) s.house.dHP = s.house.hp
      if (Math.abs(s.seqra.dHP - s.seqra.hp) < 0.3) s.seqra.dHP = s.seqra.hp
      s.house.shake *= 0.91; if (s.house.shake < 0.3) s.house.shake = 0
      s.seqra.shake *= 0.91; if (s.seqra.shake < 0.3) s.seqra.shake = 0
      s.house.flash = Math.max(0, s.house.flash - dt/140)
      s.seqra.flash = Math.max(0, s.seqra.flash - dt/140)
      s.screenFlash = Math.max(0, s.screenFlash - dt/280)
      s.boxShown = Math.min(s.boxText.length, s.boxShown + dt/TXT_SPD)
      updateParticles(s.particles, dt, s.house)

      // render
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)
      drawBG(ctx)
      if (s.seqra.vis) drawSeqra(ctx, S_BASE.x+s.slideS, S_BASE.y+s.seqra.fallY, s.seqra.shake, s.seqra.flash)
      drawHouse(ctx, H_BASE.x+s.slideH, H_BASE.y, s.house.shake, s.house.flash, s.house.glow)
      if (s.step >= steps.length - 1) drawVictory(ctx, s.stepTime)
      drawParticles(ctx, s.particles)
      const hpA = s.step === 0 ? Math.max(0, (s.stepTime-800)/400) : 1
      if (hpA > 0) {
        ctx.globalAlpha = Math.min(1, hpA)
        drawHPBar(ctx, HP_ENEMY, 'SEQRA', 75, s.seqra.dHP, 100)
        drawHPBar(ctx, HP_PLAYER, 'HOUSE', 4, s.house.dHP, 100)
        ctx.globalAlpha = 1
      }
      drawTextBox(ctx, s.boxText, s.boxShown)
      drawBigText(ctx, s.bigTxt, s.bigAlpha, s.bigColor, s.bigScale)
      if (s.screenFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${s.screenFlash})`
        ctx.fillRect(0, 0, W, BATTLE_BOTTOM)
      }

      if (s.step < steps.length) rafRef.current = requestAnimationFrame(loop)
      else setDone(true)
    }
    rafRef.current = requestAnimationFrame(loop)
  }, [initState])

  useEffect(() => {
    // draw static initial frame
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) { drawBG(ctx); drawTextBox(ctx, '', 0) }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: W }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', width: '100%', height: 'auto', cursor: started && !done ? 'default' : 'pointer' }}
        onClick={() => { if (!started || done) start() }}
      />
      {(!started || done) && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'rgba(0,0,0,0.3)', cursor: 'pointer',
        }} onClick={start}>
          <span style={{
            color: '#fff', fontFamily: '"Courier New", monospace', fontWeight: 'bold',
            fontSize: 'clamp(18px, 3.5vw, 28px)', textShadow: '3px 3px 0 #000',
            animation: 'seqra-blink 1s step-end infinite',
          }}>
            {done ? '\u25B6 REPLAY' : '\u25B6 CLICK TO START'}
          </span>
        </div>
      )}
      <style>{`@keyframes seqra-blink { 50% { opacity: 0 } }`}</style>
    </div>
  )
}
