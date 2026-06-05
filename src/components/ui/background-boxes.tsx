'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Aceternity "Background Boxes" — a skewed perspective grid. Adapted for this repo:
// dropped framer-motion (the upstream per-cell whileHover never fired behind the
// robot — content/canvas on top ate the pointer events — and 3k motion components
// is heavy). Instead the grid AMBIENTLY twinkles: a light loop imperatively lights
// random cells a brand color across the WHOLE grid, so it lights up everywhere,
// including behind the 3D robot, with zero React re-renders. Respects reduced-motion.
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const rows = new Array(70).fill(1)
  const cols = new Array(45).fill(1)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = rootRef.current
    if (!root) return
    const cells = Array.from(root.querySelectorAll<HTMLElement>('[data-cell]'))
    if (!cells.length) return

    // Brand-leaning palette: teal/cyan family + a warm gold accent.
    const colors = [
      '#2DD4BF', '#22D3EE', '#67E8F9', '#38BDF8', '#5EEAD4',
      '#34D399', '#A5F3FC', '#FBBF24', '#0EA5E9',
    ]
    const pending = new Set<number>()

    // Every tick, light a handful of random cells; clear them shortly after so the
    // `transition-colors` on each cell fades them back out — a soft, continuous twinkle.
    const tick = () => {
      for (let n = 0; n < 6; n++) {
        const cell = cells[Math.floor(Math.random() * cells.length)]
        cell.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        const t = window.setTimeout(() => {
          cell.style.backgroundColor = ''
          pending.delete(t)
        }, 350)
        pending.add(t)
      }
    }
    const interval = window.setInterval(tick, 140)

    return () => {
      window.clearInterval(interval)
      pending.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        // Center the grid on the hero and scale it up so it covers the ENTIRE
        // hero (overflowing every edge off-screen — no visible grid boundary).
        // (The upstream component leans on a 150×100 grid that's huge enough to
        // cover from an off-center anchor; our trimmed grid must be centered.)
        transform:
          'translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(1.2) translateZ(0)',
      }}
      className={cn('absolute left-1/2 top-1/2 z-0 flex p-4', className)}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row` + i} className="relative h-8 w-16 border-l border-slate-700/60">
          {cols.map((_, j) => (
            <div
              data-cell
              key={`col` + j}
              className="relative h-8 w-16 border-r border-t border-slate-700/60 transition-colors duration-700"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700/50"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
