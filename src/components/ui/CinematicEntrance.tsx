'use client'

import { useEffect, useState, useRef } from 'react'
import { gsap } from '@/lib/gsap-init'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Node3D {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  size: number
  brightness: number
  pulseOffset: number
  bx: number; by: number; bz: number
  scattered: boolean
  trail: { x: number; y: number; a: number }[]
}

interface Connection {
  a: number; b: number
  strength: number
  pulsePos: number
  pulseSpeed: number
}

interface Star {
  x: number; y: number
  size: number
  brightness: number
  speed: number
  offset: number
}

interface RainColumn {
  x: number
  headY: number
  speed: number
  length: number
  opacity: number
  chars: string[]
}

interface Spark {
  x: number; y: number
  vx: number; vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

// ─── Constants ──────────────────────────────────────────────────────────────

const CHARS = 'OIOS01\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u039B\u039E\u03A0\u03A3\u03A6\u03A8\u03A9\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03BB\u03BE\u03C0\u03C3\u03C6\u03C8\u03C9\u2200\u2202\u2203\u2205\u2207\u2208\u220B\u220F\u2211\u221A\u221D\u221E\u2220\u2227\u2228\u2229\u222A\u222B\u2248\u2260\u2261\u2264\u2265\u2282\u2283\u2286\u2287\u2295\u2297\u22A5\u22C5'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

// ─── Cinematic Renderer ─────────────────────────────────────────────────────

class CinematicRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private w = 0
  private h = 0
  private dpr = 1
  private t = 0
  private running = false
  private animId = 0

  // Entities
  private stars: Star[] = []
  private rain: RainColumn[] = []
  private nodes: Node3D[] = []
  private connections: Connection[] = []
  private sparks: Spark[] = []

  // Camera
  private cameraZ = 0
  private focalLength = 400

  // Phase controls (driven externally by GSAP)
  rainAlpha = 0
  netAlpha = 0
  concentrate = 0
  burst = 0
  scanY = -1
  scanAlpha = 0
  flashAlpha = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.resize()
    this.initStars()
    this.initRain()
    this.initNetwork()
  }

  resize() {
    this.w = window.innerWidth
    this.h = window.innerHeight
    this.canvas.width = this.w * this.dpr
    this.canvas.height = this.h * this.dpr
    this.canvas.style.width = this.w + 'px'
    this.canvas.style.height = this.h + 'px'
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  // ─── Initialization ────────────────────────────────────────────────────────

  private initStars() {
    const count = this.w < 768 ? 60 : 130
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        size: 0.3 + Math.random() * 1.2,
        brightness: 0.15 + Math.random() * 0.85,
        speed: 0.5 + Math.random() * 2,
        offset: Math.random() * Math.PI * 2,
      })
    }
  }

  private initRain() {
    const colWidth = this.w < 768 ? 24 : 18
    const columns = Math.ceil(this.w / colWidth)
    for (let c = 0; c < columns; c++) {
      const len = 6 + Math.floor(Math.random() * 14)
      const chars: string[] = []
      for (let i = 0; i < len; i++) {
        chars.push(CHARS[Math.floor(Math.random() * CHARS.length)])
      }
      this.rain.push({
        x: c * colWidth + colWidth / 2,
        headY: -Math.random() * this.h * 1.5,
        speed: 2 + Math.random() * 6,
        length: len,
        opacity: 0.3 + Math.random() * 0.7,
        chars,
      })
    }
  }

  private initNetwork() {
    const count = this.w < 768 ? 30 : 55
    const spread = 600
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: (Math.random() - 0.5) * spread,
        y: (Math.random() - 0.5) * spread * 0.6,
        z: (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 3.5,
        brightness: 0.4 + Math.random() * 0.6,
        pulseOffset: Math.random() * Math.PI * 2,
        bx: 0, by: 0, bz: 0,
        scattered: false,
        trail: [],
      })
    }

    const maxDist = 220
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x
        const dy = this.nodes[i].y - this.nodes[j].y
        const dz = this.nodes[i].z - this.nodes[j].z
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (d < maxDist && Math.random() < 0.35) {
          this.connections.push({
            a: i, b: j,
            strength: 1 - d / maxDist,
            pulsePos: Math.random(),
            pulseSpeed: 0.002 + Math.random() * 0.004,
          })
        }
      }
    }
  }

  // ─── Projection & Controls ─────────────────────────────────────────────────

  private project(x: number, y: number, z: number) {
    const pz = z - this.cameraZ + this.focalLength
    if (pz <= 10) return null
    const s = this.focalLength / pz
    return { sx: x * s + this.w / 2, sy: y * s + this.h / 2, s }
  }

  setCameraZ(z: number) { this.cameraZ = z }

  triggerBurst() {
    for (const n of this.nodes) {
      const d = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z) || 1
      const sp = 10 + Math.random() * 15
      n.bx = (n.x / d) * sp
      n.by = (n.y / d) * sp
      n.bz = (n.z / d) * sp
      n.scattered = true
    }
    // Spawn sparks from center
    const sparkCount = this.w < 768 ? 30 : 60
    for (let i = 0; i < sparkCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 4 + Math.random() * 12
      this.sparks.push({
        x: this.w / 2,
        y: this.h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 0.4 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        hue: Math.random() < 0.5 ? 170 : 185,
      })
    }
  }

  start() { this.running = true; this.animate() }
  stop() { this.running = false; if (this.animId) cancelAnimationFrame(this.animId) }
  destroy() { this.stop() }

  // ─── Main Render Loop ──────────────────────────────────────────────────────

  private animate = () => {
    if (!this.running) return
    this.t += 0.016
    const { ctx, w, h, t } = this

    ctx.clearRect(0, 0, w, h)

    // ── Layer 1: Star Field ──────────────────────────────────────────────────
    for (const s of this.stars) {
      const twinkle = 0.3 + 0.7 * (Math.sin(t * s.speed + s.offset) ** 2)
      const a = s.brightness * twinkle * (1 - this.flashAlpha * 0.5)
      if (a < 0.03) continue
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(180,220,255,${a * 0.4})`
      ctx.fill()
    }

    // ── Layer 2: Digital Rain ────────────────────────────────────────────────
    if (this.rainAlpha > 0.01) {
      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'
      ctx.font = `${this.w < 768 ? 12 : 14}px monospace`

      for (const col of this.rain) {
        col.headY += col.speed
        if (col.headY > h + col.length * 18) {
          col.headY = -col.length * 18
          for (let ci = 0; ci < col.chars.length; ci++) {
            if (Math.random() < 0.3) {
              col.chars[ci] = CHARS[Math.floor(Math.random() * CHARS.length)]
            }
          }
        }

        for (let i = 0; i < col.length; i++) {
          const cy = col.headY - i * 18
          if (cy < -18 || cy > h + 18) continue
          const fade = 1 - i / col.length
          const a = col.opacity * fade * this.rainAlpha
          if (a < 0.015) continue

          if (i === 0) {
            ctx.fillStyle = `rgba(200,255,245,${a})`
          } else if (i < 3) {
            ctx.fillStyle = `rgba(45,212,191,${a})`
          } else {
            ctx.fillStyle = `rgba(6,182,212,${a * 0.5})`
          }

          const ch = Math.random() < 0.02
            ? CHARS[Math.floor(Math.random() * CHARS.length)]
            : col.chars[i % col.chars.length]
          ctx.fillText(ch, col.x, cy)
        }
      }
    }

    // ── Layer 3: Neural Network ──────────────────────────────────────────────
    if (this.netAlpha > 0.01) {
      // Update node positions
      for (const n of this.nodes) {
        if (n.scattered) {
          n.x += n.bx; n.y += n.by; n.z += n.bz
          n.bx *= 0.97; n.by *= 0.97; n.bz *= 0.97
        } else {
          if (this.concentrate > 0) {
            const f = this.concentrate * 0.6
            n.x *= 1 - f * 0.02
            n.y *= 1 - f * 0.02
            n.z *= 1 - f * 0.02
          }
          n.x += n.vx; n.y += n.vy; n.z += n.vz
        }

        // Update trail
        const p = this.project(n.x, n.y, n.z)
        if (p) {
          n.trail.unshift({ x: p.sx, y: p.sy, a: 1 })
          if (n.trail.length > 5) n.trail.pop()
          for (const tr of n.trail) tr.a *= 0.7
        }
      }

      // Draw connections
      for (const c of this.connections) {
        const na = this.nodes[c.a]
        const nb = this.nodes[c.b]
        const pa = this.project(na.x, na.y, na.z)
        const pb = this.project(nb.x, nb.y, nb.z)
        if (!pa || !pb) continue

        const a = c.strength * 0.3 * Math.min(pa.s, pb.s) * (1 - this.burst) * this.netAlpha
        if (a < 0.01) continue

        ctx.beginPath()
        ctx.moveTo(pa.sx, pa.sy)
        ctx.lineTo(pb.sx, pb.sy)
        ctx.strokeStyle = `rgba(45,212,191,${a})`
        ctx.lineWidth = c.strength * 1.5 * Math.min(pa.s, pb.s)
        ctx.stroke()

        // Energy pulse along connection
        c.pulsePos = (c.pulsePos + c.pulseSpeed) % 1
        const px = pa.sx + (pb.sx - pa.sx) * c.pulsePos
        const py = pa.sy + (pb.sy - pa.sy) * c.pulsePos
        const pulseAlpha = a * 2.5 * Math.sin(c.pulsePos * Math.PI)
        if (pulseAlpha > 0.02) {
          const pr = 3 * Math.min(pa.s, pb.s)
          const pg = ctx.createRadialGradient(px, py, 0, px, py, pr)
          pg.addColorStop(0, `rgba(45,212,191,${Math.min(pulseAlpha, 0.9)})`)
          pg.addColorStop(1, 'rgba(45,212,191,0)')
          ctx.beginPath()
          ctx.arc(px, py, pr, 0, Math.PI * 2)
          ctx.fillStyle = pg
          ctx.fill()
        }
      }

      // Energy convergence beams (during concentrate phase)
      if (this.concentrate > 0.3 && this.burst < 0.1) {
        const beamAlpha = ((this.concentrate - 0.3) / 0.7) * 0.12 * this.netAlpha
        const cx = w / 2
        const cy = h / 2
        for (const n of this.nodes) {
          const p = this.project(n.x, n.y, n.z)
          if (!p) continue
          const a = beamAlpha * p.s * n.brightness
          if (a < 0.005) continue
          ctx.beginPath()
          ctx.moveTo(p.sx, p.sy)
          ctx.lineTo(cx, cy)
          ctx.strokeStyle = `rgba(45,212,191,${a})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Draw nodes (depth-sorted)
      const sorted = [...this.nodes].sort((a, b) => a.z - b.z)

      for (const node of sorted) {
        // Draw trail
        for (let i = 1; i < node.trail.length; i++) {
          const tr = node.trail[i]
          const ta = tr.a * this.netAlpha * 0.25
          if (ta < 0.01) continue
          ctx.beginPath()
          ctx.arc(tr.x, tr.y, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(45,212,191,${ta})`
          ctx.fill()
        }

        const p = this.project(node.x, node.y, node.z)
        if (!p) continue

        const pulse = 0.6 + 0.4 * Math.sin(t * 2 + node.pulseOffset)
        const r = node.size * p.s * pulse
        if (r < 0.3) continue

        const ba = node.brightness * p.s * pulse * this.netAlpha *
          (node.scattered ? Math.max(0, 1 - this.burst * 1.5) : 1)
        if (ba < 0.01) continue

        // Outer bloom (with hint of indigo)
        const bloom = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 6)
        bloom.addColorStop(0, `rgba(45,212,191,${ba * 0.5})`)
        bloom.addColorStop(0.3, `rgba(6,182,212,${ba * 0.15})`)
        bloom.addColorStop(0.6, `rgba(99,102,241,${ba * 0.04})`)
        bloom.addColorStop(1, 'rgba(6,182,212,0)')
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r * 6, 0, Math.PI * 2)
        ctx.fillStyle = bloom
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(45,212,191,${Math.min(ba, 1)})`
        ctx.fill()

        // Hot center
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,255,250,${Math.min(ba * 0.9, 1)})`
        ctx.fill()
      }
    }

    // ── Layer 4: Sparks ──────────────────────────────────────────────────────
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const sp = this.sparks[i]
      sp.x += sp.vx; sp.y += sp.vy
      sp.vx *= 0.97; sp.vy *= 0.97
      sp.life -= 0.016 / sp.maxLife
      if (sp.life <= 0) { this.sparks.splice(i, 1); continue }

      const sa = sp.life * 0.8

      // Spark trail streak
      ctx.beginPath()
      ctx.moveTo(sp.x, sp.y)
      ctx.lineTo(sp.x - sp.vx * 3, sp.y - sp.vy * 3)
      ctx.strokeStyle = `hsla(${sp.hue},80%,70%,${sa * 0.6})`
      ctx.lineWidth = sp.size * 0.5
      ctx.stroke()

      // Spark head
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${sp.hue},80%,85%,${sa})`
      ctx.fill()
    }

    // ── Layer 5: Scan Line ───────────────────────────────────────────────────
    if (this.scanAlpha > 0.01 && this.scanY >= 0 && this.scanY <= 1) {
      const sy = this.scanY * h

      // Wide glow band
      const sg = ctx.createLinearGradient(0, sy - 40, 0, sy + 40)
      sg.addColorStop(0, 'rgba(45,212,191,0)')
      sg.addColorStop(0.4, `rgba(45,212,191,${this.scanAlpha * 0.15})`)
      sg.addColorStop(0.5, `rgba(200,255,245,${this.scanAlpha * 0.3})`)
      sg.addColorStop(0.6, `rgba(45,212,191,${this.scanAlpha * 0.15})`)
      sg.addColorStop(1, 'rgba(45,212,191,0)')
      ctx.fillStyle = sg
      ctx.fillRect(0, sy - 40, w, 80)

      // Sharp bright core line
      ctx.fillStyle = `rgba(200,255,245,${this.scanAlpha * 0.7})`
      ctx.fillRect(0, sy - 0.5, w, 1)
    }

    // ── Layer 6: Flash Overlay ───────────────────────────────────────────────
    if (this.flashAlpha > 0.005) {
      ctx.fillStyle = `rgba(200,255,250,${this.flashAlpha})`
      ctx.fillRect(0, 0, w, h)
    }

    this.animId = requestAnimationFrame(this.animate)
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function CinematicEntrance({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  const [skipEntrance, setSkipEntrance] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const logoTextRef = useRef<HTMLDivElement>(null)
  const glitchRedRef = useRef<HTMLDivElement>(null)
  const glitchCyanRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ring1Ref = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const ring3Ref = useRef<HTMLDivElement>(null)
  const ring4Ref = useRef<HTMLDivElement>(null)
  const ring5Ref = useRef<HTMLDivElement>(null)
  const networkRef = useRef<CinematicRenderer | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check session/motion on mount
  useEffect(() => {
    if (sessionStorage.getItem('oios-entered')) {
      setSkipEntrance(true)
      setShow(true)
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSkipEntrance(true)
      setShow(true)
      sessionStorage.setItem('oios-entered', '1')
    }
  }, [])

  // ─── Master GSAP Animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (skipEntrance) return

    const overlay = overlayRef.current
    const canvas = canvasRef.current
    const logo = logoRef.current
    const logoText = logoTextRef.current
    const glitchRed = glitchRedRef.current
    const glitchCyan = glitchCyanRef.current
    const subtitle = subtitleRef.current
    const rings = [ring1Ref.current, ring2Ref.current, ring3Ref.current, ring4Ref.current, ring5Ref.current]
    const content = contentRef.current
    if (!overlay || !canvas || !logo || !logoText || !glitchRed || !glitchCyan || !subtitle || rings.some(r => !r) || !content) return

    // Initialize renderer
    const nn = new CinematicRenderer(canvas)
    networkRef.current = nn

    const onResize = () => nn.resize()
    window.addEventListener('resize', onResize)

    nn.start()
    gsap.ticker.lagSmoothing(0)

    // Set initial states
    gsap.set(canvas, { opacity: 0 })
    gsap.set(logo, { opacity: 0, scale: 0.8 })
    gsap.set([glitchRed, glitchCyan], { opacity: 0 })
    gsap.set(subtitle, { opacity: 0, y: 10 })
    gsap.set(rings, { scale: 0, opacity: 0 })
    gsap.set(content, { opacity: 0, y: 30 })

    // GSAP proxies for renderer properties
    const rainProxy = { v: 0 }
    const netProxy = { v: 0 }
    const camProxy = { z: 0 }
    const concProxy = { v: 0 }
    const burstProxy = { v: 0 }
    const scanProxy = { y: 0, a: 0 }
    const flashProxy = { v: 0 }

    // Pre-compute glitch frames for deterministic animation
    const glitchFrames = Array.from({ length: 10 }, () => ({
      rx: rand(-5, 5), ry: rand(-2, 2),
      rc: `inset(${Math.floor(rand(0, 80))}% 0 ${Math.floor(rand(0, 80))}% 0)`,
      cx: rand(-5, 5), cy: rand(-2, 2),
      cc: `inset(${Math.floor(rand(0, 80))}% 0 ${Math.floor(rand(0, 80))}% 0)`,
    }))

    // ─── Timeline ─────────────────────────────────────────────────────────────
    const tl = gsap.timeline({
      delay: 0.2, // Phase 0: The Void
      onComplete: () => {
        sessionStorage.setItem('oios-entered', '1')
        nn.destroy()
        window.removeEventListener('resize', onResize)
        gsap.ticker.lagSmoothing(500, 33)
        setSkipEntrance(true)
      },
    })

    // ── Phase 1: Digital Genesis — stars + rain cascade ──────────────────────
    tl.to(canvas, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
    tl.to(rainProxy, {
      v: 1, duration: 0.4, ease: 'power2.out',
      onUpdate: () => { nn.rainAlpha = rainProxy.v },
    }, 0)

    // ── Phase 2: Network Emergence — rain fades, network materializes ───────
    tl.to(rainProxy, {
      v: 0, duration: 0.8, ease: 'power2.in',
      onUpdate: () => { nn.rainAlpha = rainProxy.v },
    }, 0.5)
    tl.to(netProxy, {
      v: 1, duration: 0.5, ease: 'power2.out',
      onUpdate: () => { nn.netAlpha = netProxy.v },
    }, 0.6)
    tl.to(camProxy, {
      z: 150, duration: 1.8, ease: 'power1.inOut',
      onUpdate: () => nn.setCameraZ(camProxy.z),
    }, 0.7)

    // Scan line sweep
    tl.to(scanProxy, {
      a: 1, duration: 0.15, ease: 'power2.out',
      onUpdate: () => { nn.scanAlpha = scanProxy.a },
    }, 0.8)
    tl.to(scanProxy, {
      y: 1, duration: 0.5, ease: 'power1.inOut',
      onUpdate: () => { nn.scanY = scanProxy.y },
    }, 0.8)
    tl.to(scanProxy, {
      a: 0, duration: 0.3, ease: 'power2.in',
      onUpdate: () => { nn.scanAlpha = scanProxy.a },
    }, 1.1)

    // ── Phase 3: Logo Crystallize — concentrate + glitch decode ──────────────
    tl.to(concProxy, {
      v: 1, duration: 0.9, ease: 'power2.in',
      onUpdate: () => { nn.concentrate = concProxy.v },
    }, 1.3)

    // Glitch layers appear
    tl.to([glitchRed, glitchCyan], { opacity: 0.7, duration: 0.05 }, 1.5)
    tl.to(logo, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, 1.5)

    // Rapid glitch jitter sequence
    for (let i = 0; i < glitchFrames.length; i++) {
      const f = glitchFrames[i]
      const gt = 1.5 + i * 0.04
      tl.set(glitchRed, { x: f.rx, y: f.ry, clipPath: f.rc }, gt)
      tl.set(glitchCyan, { x: f.cx, y: f.cy, clipPath: f.cc }, gt + 0.02)
    }

    // Glitch resolves
    tl.to([glitchRed, glitchCyan], {
      opacity: 0, x: 0, y: 0, clipPath: 'inset(0% 0 0% 0)',
      duration: 0.15, ease: 'power2.out',
    }, 1.9)

    // Subtitle fades in
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.95)

    // ── Phase 4: Supernova — explosion + flash + sparks + rings + shake ─────
    const burstTime = 2.4

    // Logo textShadow intensifies
    tl.to(logoText, {
      textShadow: '0 0 80px rgba(45,212,191,1), 0 0 160px rgba(45,212,191,0.6), 0 0 240px rgba(6,182,212,0.3)',
      duration: 0.12, ease: 'power4.in',
    }, burstTime)
    tl.to(logo, { opacity: 0, scale: 1.15, duration: 0.35, ease: 'power2.in' }, burstTime + 0.1)
    tl.to(subtitle, { opacity: 0, duration: 0.2, ease: 'power2.in' }, burstTime + 0.05)

    // Trigger burst + sparks on renderer
    tl.add(() => nn.triggerBurst(), burstTime)
    tl.to(burstProxy, {
      v: 1, duration: 0.7, ease: 'power2.out',
      onUpdate: () => { nn.burst = burstProxy.v },
    }, burstTime)

    // Screen flash
    tl.to(flashProxy, {
      v: 0.35, duration: 0.08, ease: 'power4.in',
      onUpdate: () => { nn.flashAlpha = flashProxy.v },
    }, burstTime)
    tl.to(flashProxy, {
      v: 0, duration: 0.25, ease: 'power2.out',
      onUpdate: () => { nn.flashAlpha = flashProxy.v },
    }, burstTime + 0.08)

    // Camera shake
    tl.to(overlay, { x: 3, y: -2, duration: 0.04, ease: 'none' }, burstTime)
    tl.to(overlay, { x: -2, y: 3, duration: 0.04, ease: 'none' }, burstTime + 0.04)
    tl.to(overlay, { x: 1, y: -1, duration: 0.04, ease: 'none' }, burstTime + 0.08)
    tl.to(overlay, { x: 0, y: 0, duration: 0.04, ease: 'none' }, burstTime + 0.12)

    // 5 Shockwave rings (staggered)
    const ringScales = [5, 4.5, 4, 3.5, 3]
    const ringPeakOpacity = [0.6, 0.5, 0.4, 0.3, 0.25]
    rings.forEach((ring, i) => {
      if (!ring) return
      const rt = burstTime + i * 0.06
      tl.to(ring, { scale: ringScales[i], opacity: ringPeakOpacity[i], duration: 0.5, ease: 'power2.out' }, rt)
      tl.to(ring, { opacity: 0, duration: 0.3, ease: 'power1.in' }, rt + 0.3)
    })

    // ── Phase 5: Site Reveal ─────────────────────────────────────────────────
    tl.to(canvas, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 2.7)
    tl.to(overlay, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 2.8)
    tl.add(() => setShow(true), 2.8)
    tl.to(content, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 2.9)

    return () => {
      tl.kill()
      nn.destroy()
      window.removeEventListener('resize', onResize)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [skipEntrance])

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Cinematic entrance overlay */}
      {!skipEntrance && (
        <div
          ref={overlayRef}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99990,
            background: '#000',
            pointerEvents: 'none',
          }}
        >
          {/* Neural network canvas */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />

          {/* Cinematic vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Subtle scan lines (CRT feel) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Logo + subtitle centered */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <div
              ref={logoRef}
              style={{
                position: 'relative',
                textAlign: 'center',
                willChange: 'transform, opacity',
              }}
            >
              {/* Glitch layer: red */}
              <div
                ref={glitchRedRef}
                style={{
                  ...logoTextStyle,
                  position: 'absolute',
                  inset: 0,
                  color: '#ff003c',
                  textShadow: 'none',
                  mixBlendMode: 'screen' as const,
                  textAlign: 'center',
                }}
              >
                OIOS
              </div>

              {/* Glitch layer: cyan */}
              <div
                ref={glitchCyanRef}
                style={{
                  ...logoTextStyle,
                  position: 'absolute',
                  inset: 0,
                  color: '#00f0ff',
                  textShadow: 'none',
                  mixBlendMode: 'screen' as const,
                  textAlign: 'center',
                }}
              >
                OIOS
              </div>

              {/* Main logo text */}
              <div
                ref={logoTextRef}
                style={{
                  ...logoTextStyle,
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                OIOS
              </div>
            </div>

            <div
              ref={subtitleRef}
              style={{
                fontSize: 'clamp(10px, 1.5vw, 14px)',
                letterSpacing: '0.25em',
                color: '#94A3B8',
                fontFamily: 'var(--font-display), sans-serif',
                textAlign: 'center',
                marginTop: 'clamp(8px, 1vw, 12px)',
                whiteSpace: 'nowrap',
              }}
            >
              OMNIA INTELLIGENCE
            </div>
          </div>

          {/* Shockwave rings */}
          <div ref={ring1Ref} style={ringStyle} className="cinematic-ring" />
          <div ref={ring2Ref} style={ringStyle} className="cinematic-ring" />
          <div ref={ring3Ref} style={ringStyle} className="cinematic-ring" />
          <div ref={ring4Ref} style={ringStyle} className="cinematic-ring" />
          <div ref={ring5Ref} style={ringStyle} className="cinematic-ring" />
        </div>
      )}

      {/* Page content */}
      <div
        ref={contentRef}
        style={{
          opacity: show ? 1 : undefined,
          transform: show ? 'translateY(0)' : undefined,
        }}
      >
        {children}
      </div>
    </>
  )
}

// ─── Shared Styles ──────────────────────────────────────────────────────────

const logoTextStyle: React.CSSProperties = {
  fontSize: 'clamp(40px, 8vw, 72px)',
  fontWeight: 700,
  letterSpacing: '0.35em',
  color: '#2DD4BF',
  fontFamily: 'var(--font-display), sans-serif',
  textShadow: '0 0 40px rgba(45,212,191,0.5), 0 0 80px rgba(45,212,191,0.25)',
}

const ringStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 100,
  height: 100,
  marginTop: -50,
  marginLeft: -50,
  borderRadius: '50%',
  border: '1.5px solid rgba(45,212,191,0.6)',
  boxShadow: '0 0 20px rgba(45,212,191,0.3), inset 0 0 20px rgba(45,212,191,0.1)',
  pointerEvents: 'none',
  zIndex: 3,
}
