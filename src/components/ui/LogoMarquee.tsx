'use client'

import { useEffect, useRef, useState } from 'react'

interface LogoMarqueeProps {
  items: string[]
  speed?: number
  className?: string
}

export function LogoMarquee({ items, speed = 30, className = '' }: LogoMarqueeProps) {
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={stripRef}
        className="marquee-strip flex gap-4"
        style={{
          animation: reducedMotion ? 'none' : `marquee-scroll ${speed}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {/* First set */}
        {items.map((item, i) => (
          <span
            key={`a-${i}`}
            className="px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/20 text-xs font-mono text-slate-400 tracking-wide whitespace-nowrap"
          >
            {item}
          </span>
        ))}
        {/* Duplicated set for seamless loop */}
        {items.map((item, i) => (
          <span
            key={`b-${i}`}
            className="px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/20 text-xs font-mono text-slate-400 tracking-wide whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
