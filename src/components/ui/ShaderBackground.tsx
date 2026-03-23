'use client'

import { useEffect, useRef } from 'react'

// ─── Starfall Background — Diagonal shooting streaks ────────────────────────

const COLORS = [
  [45, 212, 191],   // teal
  [6, 182, 212],    // cyan
  [103, 232, 249],  // bright cyan
  [99, 102, 241],   // indigo
  [139, 92, 246],   // violet
  [56, 189, 248],   // sky blue
]

const ANGLE = (145 * Math.PI) / 180
const COS_A = Math.cos(ANGLE)
const SIN_A = Math.sin(ANGLE)

interface Streak {
  x: number; y: number
  len: number; speed: number; width: number
  alpha: number; glow: number
  color: number[]
}

function makeStreak(w: number, h: number): Streak {
  const bright = Math.random() < 0.25
  const spawn = Math.random() * (w + h)
  let x: number, y: number
  if (spawn < w) {
    x = spawn; y = -100 - Math.random() * 400
  } else {
    x = w + 100 + Math.random() * 400
    y = (spawn - w) / (w + h) * h
  }
  return {
    x, y,
    len: bright ? 200 + Math.random() * 400 : 60 + Math.random() * 200,
    speed: bright ? 4 + Math.random() * 6 : 1.5 + Math.random() * 3.5,
    width: bright ? 2 + Math.random() * 2.5 : 0.6 + Math.random() * 1.5,
    alpha: bright ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.4,
    glow: bright ? 10 + Math.random() * 15 : 3 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streaksRef = useRef<Streak[]>([])
  const animRef = useRef(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize
    const resize = () => {
      const dpr = window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const w = () => canvas.clientWidth
    const h = () => canvas.clientHeight

    // Init streaks
    const count = window.innerWidth < 768 ? 20 : 45
    streaksRef.current = Array.from({ length: count }, () => makeStreak(w(), h()))

    // Animation loop
    const animate = () => {
      const cw = w()
      const ch = h()

      // Opaque dark background (streaks need a solid base to glow against)
      ctx.fillStyle = '#0B1120'
      ctx.fillRect(0, 0, cw, ch)

      for (const s of streaksRef.current) {
        // Move
        s.x += COS_A * s.speed
        s.y += SIN_A * s.speed

        // Reset if off-screen
        if (s.x < -s.len * 2 || s.y > ch + s.len * 2) {
          Object.assign(s, makeStreak(cw, ch))
        }

        // Head and tail
        const hx = s.x, hy = s.y
        const tx = s.x - COS_A * s.len
        const ty = s.y - SIN_A * s.len
        const [r, g, b] = s.color

        // Wide glow
        const glowGrad = ctx.createLinearGradient(tx, ty, hx, hy)
        glowGrad.addColorStop(0, `rgba(${r},${g},${b},0)`)
        glowGrad.addColorStop(0.1, `rgba(${r},${g},${b},${s.alpha * 0.2})`)
        glowGrad.addColorStop(0.6, `rgba(${r},${g},${b},${s.alpha * 0.35})`)
        glowGrad.addColorStop(1, `rgba(${r},${g},${b},${s.alpha * 0.5})`)
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.strokeStyle = glowGrad
        ctx.lineWidth = s.glow * 2
        ctx.lineCap = 'round'
        ctx.stroke()

        // Core line
        const coreGrad = ctx.createLinearGradient(tx, ty, hx, hy)
        coreGrad.addColorStop(0, `rgba(${r},${g},${b},0)`)
        coreGrad.addColorStop(0.08, `rgba(${r},${g},${b},${s.alpha * 0.6})`)
        coreGrad.addColorStop(0.5, `rgba(${r},${g},${b},${s.alpha * 0.85})`)
        coreGrad.addColorStop(1, `rgba(255,255,255,${s.alpha})`)
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(hx, hy)
        ctx.strokeStyle = coreGrad
        ctx.lineWidth = s.width
        ctx.lineCap = 'round'
        ctx.stroke()

        // Head flare
        if (s.alpha > 0.3) {
          const fr = s.width * 3
          const fg = ctx.createRadialGradient(hx, hy, 0, hx, hy, fr * 3)
          fg.addColorStop(0, `rgba(255,255,255,${s.alpha * 0.7})`)
          fg.addColorStop(0.3, `rgba(${r},${g},${b},${s.alpha * 0.3})`)
          fg.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.beginPath()
          ctx.arc(hx, hy, fr * 3, 0, Math.PI * 2)
          ctx.fillStyle = fg
          ctx.fill()
        }
      }

      // Ambient stars
      for (let i = 0; i < 50; i++) {
        const sx = ((i * 7919 + 42) % 10000) / 10000 * cw
        const sy = ((i * 6271 + 42) % 10000) / 10000 * ch
        ctx.beginPath()
        ctx.arc(sx, sy, 0.6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(180, 220, 255, 0.15)'
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    const onResize = () => resize()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
