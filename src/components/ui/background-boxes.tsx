'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

// Aceternity "Background Boxes" — a skewed grid of cells that light up a random
// brand color on hover. Adapted for this repo: uses `motion/react` (not the
// original's framer-motion) and real hex colors (the upstream `--sky-300`-style
// CSS vars aren't defined in this Tailwind v4 theme). Grid count is trimmed from
// the upstream 150×100 to keep the DOM/motion overhead sane on a marketing page.
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(70).fill(1)
  const cols = new Array(45).fill(1)

  // Brand-leaning palette: teal/cyan family + a warm gold accent.
  const colors = [
    '#2DD4BF', // teal-400
    '#22D3EE', // cyan-400
    '#67E8F9', // cyan-300
    '#38BDF8', // sky-400
    '#5EEAD4', // teal-300
    '#34D399', // emerald-400
    '#A5F3FC', // cyan-200
    '#FBBF24', // amber-400 (brand warm accent)
    '#0EA5E9', // sky-500
  ]
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  return (
    <div
      style={{
        // Center the grid on the hero and scale it up so it covers the viewport.
        // (The upstream component leans on a 150×100 grid that's huge enough to
        // cover from an off-center anchor; our trimmed grid must be centered.)
        transform:
          'translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(0.9) translateZ(0)',
      }}
      className={cn('absolute left-1/2 top-1/2 z-0 flex p-4', className)}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row` + i} className="relative h-8 w-16 border-l border-slate-700/60">
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              key={`col` + j}
              className="relative h-8 w-16 border-r border-t border-slate-700/60"
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
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
