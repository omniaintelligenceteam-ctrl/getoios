'use client'

import { useEffect, useRef } from 'react'

export function useScrollVelocity() {
  const velocity = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lastScroll = window.scrollY
    let lastTime = performance.now()
    let raf: number

    function update() {
      const now = performance.now()
      const dt = now - lastTime
      if (dt > 0) {
        const currentScroll = window.scrollY
        const rawVelocity = Math.abs(currentScroll - lastScroll) / dt
        // Smooth the velocity
        velocity.current += (rawVelocity - velocity.current) * 0.1
        lastScroll = currentScroll
        lastTime = now

        // Apply to noise overlay
        const noise = document.querySelector('.noise-overlay') as HTMLElement
        if (noise) {
          const opacity = 0.035 + Math.min(velocity.current * 0.02, 0.025)
          noise.style.opacity = String(opacity)
        }

        // Apply momentum to orbs
        const orbs = document.querySelectorAll('.orb') as NodeListOf<HTMLElement>
        orbs.forEach((orb, i) => {
          const shift = velocity.current * (i + 1) * 3
          orb.style.setProperty('--velocity-shift', `${shift}px`)
        })
      }
      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return velocity
}
