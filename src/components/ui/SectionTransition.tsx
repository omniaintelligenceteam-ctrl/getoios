'use client'

import { useRef, useEffect } from 'react'

export function SectionTransition() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('section-transition-visible')
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="section-transition">
      <div className="section-transition-line" />
      <div className="section-transition-glow" />
    </div>
  )
}
