'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

interface TextRevealProps {
  children: ReactNode
  className?: string
  /** Adds blur-to-focus + scale for hero-level emphasis */
  hero?: boolean
  /** Delay in seconds before animation starts */
  delay?: number
}

export function TextReveal({
  children,
  className = '',
  hero = false,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      if (hero) {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 30,
            filter: 'blur(8px)',
            scale: 1.03,
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            scale: 1,
            duration: 1,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        )
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, el)

    return () => ctx.revert()
  }, [hero, delay])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  )
}
